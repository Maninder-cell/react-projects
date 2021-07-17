import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import "./rooms.css";
import { Link } from "react-router-dom";
import db from "./firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  inline: {
    display: "inline",
  },
}));

function Rooms({ id, name }) {
  const classes = useStyles();

  const [message, setmessage] = useState([]);

  useEffect(() => {
    db.collection("rooms")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setmessage(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);

  return (
    <Link style={{ textDecoration: "none" }} to={`/rooms/${id}`}>
      <div className="rooms">
        <List className={classes.root}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={name} src={`https://api.adorable.io/avatars/285/abott@${name}.png`} />
            </ListItemAvatar>
            <ListItemText
              className="room_name"
              primary={name}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {message[0] && message[0].username}
                  </Typography>
                  {` ${message[0] ? '—' + message[0].text : ''}`}
                </React.Fragment>
              }
            />
          </ListItem>
        </List>
      </div>
    </Link>
  );
}

export default Rooms;
