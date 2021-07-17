import React, { useState, useEffect } from "react";
import "./sidebar.css";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import MoreIcon from "@material-ui/icons/MoreVert";
import Rooms from "./Rooms";
import Divider from "@material-ui/core/Divider";
import SearchIcon from "@material-ui/icons/Search";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fade from "@material-ui/core/Fade";
import db, { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";

const useStyles = makeStyles((theme) => ({
  av: {
    flexGrow: 1,
  },
}));

function Sidebar() {
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setrooms] = useState([]);
  const [frooms, fsetrooms] = useState([]);
  const [search, setsearch] = useState(null);
  const [roomname, setroomname] = useState("");

  useEffect(() => {
    if (search !== null) {
      fsetrooms(
        rooms.filter((element) =>
          element.data.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      fsetrooms([]);
    }
  }, [search]);

  useEffect(() => {
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) => {
      setrooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dopen, setdOpen] = React.useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickOpen = () => {
    setAnchorEl(null);
    setdOpen(true);
  };

  const handleClose = () => {
    setdOpen(false);
    setAnchorEl(null);
  };

  const newroom = (event) => {
    event.preventDefault();
    db.collection("rooms")
      .add({
        name: roomname,
      })
      .then(() => {
        setdOpen(false);
      });
  };

  const signout = () => {
    auth
      .signOut()
      .then(function () {
        handleClose();
        dispatch({
          type: actionTypes.LOG_OUT,
        });
      })
      .catch(function (error) {
        alert(error.message);
      });
  };

  return (
    <div className="sidebar">
      <AppBar className="lefthead" color="default" position="static">
        <Toolbar>
          <div className={classes.av}>
            <Avatar
              className="avatar"
              style={{ backgroundColor: "skyblue" }}
              alt={user.displayName}
              src={user.photoURL}
            />
          </div>
          <IconButton
            aria-label="display more actions"
            edge="end"
            color="inherit"
            onClick={handleClick}
          >
            <MoreIcon />
          </IconButton>
          <Menu
            id="long-menu"
            className="menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem key="Create New Room" onClick={handleClickOpen}>
              Create New Room
            </MenuItem>
            <MenuItem key="Log Out" onClick={signout}>
              Log Out
            </MenuItem>
          </Menu>
          <div className="dialog">
            <Dialog
              open={dopen}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Create New Room</DialogTitle>
              <form onSubmit={newroom} autoComplete="off">
                <DialogContent>
                  <DialogContentText>
                    Try to set a unique and small name
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="New Room"
                    type="text"
                    fullWidth
                    required
                    onChange={(e) => setroomname(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Create
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </div>
        </Toolbar>
      </AppBar>
      <div className="header_search">
        <form onSubmit={event => event.preventDefault()} className="form">
          <SearchIcon />
          <input
            className="search"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            type="text"
            placeholder="search room"
          />
        </form>
      </div>
      <div className="app_rooms">
        {search === null
          ? rooms.map((room, index) => {
              if (index !== rooms.length - 1) {
                return (
                  <div key={room.id}>
                    <Rooms key={room.id} id={room.id} name={room.data.name} />
                    <Divider variant="middle" component="li" />
                  </div>
                );
              } else {
                return (
                  <div key={room.id}>
                    <Rooms key={room.id} id={room.id} name={room.data.name} />
                  </div>
                );
              }
            })
          : frooms.map((room, index) => {
              if (index !== frooms.length - 1) {
                return (
                  <div key={room.id}>
                    <Rooms key={room.id} id={room.id} name={room.data.name} />
                    <Divider variant="middle" component="li" />
                  </div>
                );
              } else {
                return (
                  <div key={room.id}>
                    <Rooms key={room.id} id={room.id} name={room.data.name} />
                  </div>
                );
              }
            })}
      </div>
    </div>
  );
}

export default Sidebar;
