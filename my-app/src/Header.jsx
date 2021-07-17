import React, {useState,useEffect} from "react";
import "./header.css";
import { auth } from './firebase';
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 0, 3),
    width: "30%",
    outline:"none",
    [theme.breakpoints.down('sm')]: {
      width:"60%",
    },
    [theme.breakpoints.down('xs')]: {
      width:"90%",
    },
  },
}));

const useStylesButton = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function Head({ user, setuser}) {
  const classes = useStyles();
  const button = useStylesButton();

  const [open, setOpen] = useState(false);
  const [logopen, logsetOpen] = useState(false);
  const [progress,setprogress] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loghandleOpen = () => {
    logsetOpen(true);
  };

  const loghandleClose = () => {
    logsetOpen(false);
  };

  const [username,setusername] = useState();
  const [email,setemail] = useState();
  const [password,setpassword] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser && authuser.emailVerified === true){
        setuser(authuser);
      }
      else{
        auth.signOut();
        setuser(null);
      }
    });

    return () => {
      unsubscribe();
    }

  },[user,username]);

  const signup = (event) => {
    event.preventDefault();
    setprogress(true);
    auth.createUserWithEmailAndPassword(email,password)
    .catch((error) => {
        alert(error.message);
      }
    )
    .then((authuser) => {
      authuser.user.updateProfile({
        displayName : username
      })
      authuser.user.sendEmailVerification(); 
    })
    .then(() => {alert("We have send you an confirmation email to verify your account")})
    .catch((error) => { return; })
    .then(() => {setprogress(false);handleClose()});
  }

  const signin = (event) =>{
    event.preventDefault();
    setprogress(true);
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error) => {alert(error.message)})
    .then((user) => {
      if (!user.user.emailVerified){
        auth.signOut();
        alert("Please verify your email first");
      }
    })
    .catch((error) => {return;})
    .then(() => {setprogress(false);loghandleClose()})
  }

  return (
    <>
      <div className="app_header">
        <h1>Instagram</h1>
        <div className="app_auth">
            {user ? 
            (
              <div className="status">
                <h4 className="username">{ user.displayName }</h4>
                <Button variant="contained" color="primary" onClick={() => auth.signOut()}>
                  Log Out
                </Button>
              </div>
            ) : 
            (
              <div className={button.root}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                Sign Up
                </Button>
                <Button variant="contained" color="primary" onClick={loghandleOpen}>
                  Log In
                </Button>
              </div>
            )
          }
          <div className="SignUp">
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <div className={classes.paper}>
                  { progress && <LinearProgress style={{ marginBottom : "15px", width:"100%", marginTop: "-18px" }} color="primary" /> }
                  <div style={{ padding:"2px 5% 2px 5%" }}>
                    <h3>Create New Account</h3>
                    <form onSubmit={signup} className="form" autoComplete="off">
                        <TextField required value={username} onChange={(e) => setusername(e.target.value)} margin="normal" size="medium" id="standard-basic" label="Username"/>
                        <TextField required value={email} onChange={(e) => setemail(e.target.value)} margin="normal" size="medium" type="email" id="standard-basic" label="Email" />
                        <TextField required value={password} onChange={(e) => setpassword(e.target.value)} margin="normal" size="medium" type="password" id="standard-basic" label="Password"/>
                        <Button type="submit" mt="30px" color="primary">Sign Up</Button>
                    </form>
                  </div>
                </div>
              </Fade>
            </Modal>
          </div>
          <div className="login">
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={logopen}
              onClose={loghandleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={logopen}>
                <div className={classes.paper}>
                  { progress && <LinearProgress style={{ marginBottom : "15px", width:"100%", marginTop: "-18px" }} color="primary" /> }
                  <div style={{ padding:"2px 5% 2px 5%" }}>
                    <h3>Log In</h3>
                    <form onSubmit={signin} className="form" autoComplete="off">
                        <TextField required value={email} onChange={(e) => setemail(e.target.value)} margin="normal" size="medium" type="email" id="standard-basic" label="Email" />
                        <TextField required value={password} onChange={(e) => setpassword(e.target.value)} margin="normal" size="medium" type="password" id="standard-basic" label="Password"/>
                        <Button type="submit" mt="30px" color="primary">Log In</Button>
                    </form>
                  </div>
                </div>
              </Fade>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
}

export default Head;
