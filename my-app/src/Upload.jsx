import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import IconButton from "@material-ui/core/IconButton";
import PublishIcon from "@material-ui/icons/Publish";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from '@material-ui/core/Snackbar';
import "./Upload.css";
import firebase from "firebase";
import { storage, db } from "./firebase";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 0, 3),
    outline: "none",
    width:"30%",
    [theme.breakpoints.down('sm')]: {
      width:"60%",
    },
    [theme.breakpoints.down('xs')]: {
      width:"90%",
    },
  },
}));

function Upload({ username }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [erroropen, errorsetOpen] = useState(false);
  const [caption, setcaption] = useState("");
  const [image, setimage] = useState(null);
  const [progress, setprogress] = useState(0);

  const errorhandleClose = () => {
    errorsetOpen(false);
  };

  const errorhandleOpen = () => {
    if (image === null){
      errorsetOpen(true);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const imagehandle = (e) => {
    if (e.target.files[0]) {
      setimage(e.target.files[0]);
    }
  };

  const handleupload = (event) => {
    event.preventDefault();
    const uploadtask = storage.ref(`images/${image.name}`).put(image);
    uploadtask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setprogress(progress);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              image: url,
              username: username,
            });
          })
          .then(() => {
            setcaption("");
            setimage(null);
            handleClose();
            setprogress(0);
          });
      }
    );
  };

  return (
    <>
      <Fab
        onClick={handleOpen}
        className="upload"
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>
      <div className="SignUp">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          maxwidth="lg"
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade
            in={open}
          >
            <div className={classes.paper}>
              {progress > 0 && (
                <LinearProgress
                  style={{
                    marginBottom: "15px",
                    width: "100%",
                    marginTop: "-18px",
                    backgroundColor: "white",
                  }}
                  variant="determinate"
                  value={progress}
                />
              )}
              <div style={{ padding: "2px 4% 2px 4%" }}>
                <h3>Upload Post</h3>
                <form onSubmit={handleupload} className="form" autoComplete="off">
                  <div>
                    <input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      required
                      style={{ display: "none" }}
                      onChange={imagehandle}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        size="medium"
                        justify="center"
                      >
                        <AddAPhotoIcon className="camera" />
                      </IconButton>
                    </label>
                  </div>
                  <TextField
                    margin="normal"
                    id="outlined-multiline-static"
                    label="Caption"
                    multiline
                    rows={6}
                    variant="outlined"
                    vlaue={caption}
                    onChange={(e) => setcaption(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PublishIcon />}
                    type="submit"
                    size="small"
                    style={{ width: "120px", marginTop: "10px" }}
                    onClick={errorhandleOpen}
                  >
                    Publish
                  </Button>
                </form>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={erroropen}
        onClose={errorhandleClose}
        message="PLease select an image"
        key="topright"
      />
    </>
  );
}

export default Upload;
