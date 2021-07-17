import React from "react";
import "./login.css";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { auth, provider } from "./firebase";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import { isMobile } from "react-device-detect";

function Login() {
  const [{}, dispatch] = useStateValue();

  const Signup = () => {
    if (isMobile) {
      auth
        .signInWithRedirect(provider)
        .then((result) => {
          dispatch({
            type: actionTypes.SET_USER,
            user: result.user,
          });
        })
        .catch((error) => alert(error.message));
    } else {
      auth
        .signInWithPopup(provider)
        .then((result) => {
          dispatch({
            type: actionTypes.SET_USER,
            user: result.user,
          });
        })
        .catch((error) => alert(error.message));
    }
  };

  return (
    <div className={`login`}>
      <Paper className="paper" elevation={3}>
        <div className="paper_data">
          <img
            alt="Logo"
            src="https://img.icons8.com/color/480/000000/chat.png"
          />
          <h2>Welcome in BreadCrumb</h2>
          <Button onClick={Signup} variant="outlined" color="secondary">
            Sign In with Google
          </Button>
        </div>
      </Paper>
    </div>
  );
}

export default Login;
