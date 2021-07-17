import React, { useState, useEffect, useRef } from "react";
import "./chat.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import { useParams } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import Menu from "@material-ui/core/Menu";
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import db from "./firebase";
import firebase from "firebase";
import {BrowserView} from 'react-device-detect';

function Chat() {
  const { roomid } = useParams();
  const [room, setroom] = useState("");
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState([]);
  const [typers, settypers] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  };

  useEffect(scrollToBottom, [messages]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const onEmojiClick = (emoji) => {
    setmessage(message + emoji.native);
  };

  const changestate = () => {
      setAnchorEl(null);
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (message.length !== 0) {
      db.collection("rooms").doc(roomid).collection("typing").doc("check").set({
        name: user.displayName,
        email: user.email,
        typing: true,
      });
    } else {
      db.collection("rooms").doc(roomid).collection("typing").doc("check").set({
        name: user.displayName,
        email: user.email,
        typing: false,
      });
    }
  }, [message, roomid]);

  useEffect(() => {
    const unsubscribe = db
      .collection("rooms")
      .doc(roomid)
      .collection("typing")
      .onSnapshot((snapshot) =>
        settypers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return () => {
      unsubscribe();
    };
  }, [roomid]);

  useEffect(() => {
    setAnchorEl(null);

    if (roomid) {
      db.collection("rooms")
        .doc(roomid)
        .onSnapshot((snapshot) => {
          setroom(snapshot.data().name);
        });
    }

    const unsubscribe = db
      .collection("rooms")
      .doc(roomid)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setmessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return () => {
      unsubscribe();
    };
  }, [roomid]);

  const send = (event) => {
    event.preventDefault();
    db.collection("rooms")
      .doc(roomid)
      .collection("messages")
      .add({
        text: message,
        username: user.displayName,
        email: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => setmessage(""));
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <AppBar color="default" position="static">
          <Toolbar>
            <Avatar
              className="avatar"
              style={{ backgroundColor: "skyblue" }}
              alt={room}
              src={`https://api.adorable.io/avatars/285/abott@${room}.png`}
            />
            <div className="chat_info">
              <Typography variant="subtitle1" style={{ marginLeft: "10px" }}>
                {room}
              </Typography>
              {
                messages[messages.length - 1] &&
                messages[messages.length - 1].data.timestamp ? (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ marginLeft: "10px" }}
                  >
                    Last Activity on 
                    {` ${new Date(
                        messages[messages.length - 1].data.timestamp.toDate()
                      ).toLocaleString()}`}
                  </Typography>
                ) : (
                  ""
                )
              }
            </div>
          </Toolbar>
        </AppBar>
      </div>

      <div className="chat_body">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat_message ${
              message.data.email === user.email && "chat_reciever"
            }`}
          >
            <span className="chat_name">{message.data.username}</span>
            <p className="chat_data">
              <span className="msg">{message.data.text}</span>
              <span className="chat_time">
                {message.data.timestamp &&
                  new Date(message.data.timestamp.toDate()).toLocaleString()}
              </span>
            </p>
          </div>
        ))}
        <div
          className={`typing ${typers[0] && typers[0].data.typing && "margin"}`}
        >
          {typers.map((typer) => {
            if (typer.data.typing && typer.data.email !== user.email) {
              return (
                <span
                  className="tf"
                  key={typer.id}
                >{`${typer.data.name} is typing ....`}</span>
              );
            }
          })}
        </div>
        <div ref={messagesEndRef}></div>
      </div>

      <div className="chat_footer">
        <BrowserView>
          <div className="emoji">
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              className="emoji_menu"
              onClose={changestate}
            > 
              <Picker set="google" title="" emojiTooltip theme="light" onSelect={onEmojiClick}/>
            </Menu>
          </div>
        </BrowserView>
        <AppBar color="default" position="static">
          <Toolbar>
            <form onSubmit={send} autoComplete="off" className="chat_form">
              <BrowserView>
                <IconButton 
                  edge="end"
                  color="primary"
                  size="medium"
                  className="emoji_picker"
                  onClick={handleClick}
                >
                  <EmojiEmotionsIcon/>  
                </IconButton>
              </BrowserView>
              <input
                className="input"
                value={message}
                onChange={(e) => setmessage(e.target.value)}
                type="text"
                placeholder="Type a message ..."
                required
              />
              <IconButton
                aria-label="Send"
                edge="end"
                color="primary"
                type="submit"
                size="medium"
              >
                <SendIcon />
              </IconButton>
            </form>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
}

export default Chat;
