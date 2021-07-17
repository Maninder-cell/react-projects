import React, { useEffect } from "react";
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import Chat from "./Chat.js";
import Simple from "./Simple.jsx";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./Login.jsx";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import {auth} from "./firebase";
import {BrowserView, MobileView} from 'react-device-detect';

function App() {
  const [{ user },dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authuser) => {
      if (authuser){
        dispatch({
          type : actionTypes.SET_USER,
          user : authuser,
        });
      }
    });

    return () => {
      unsubscribe();
    }

  },[user]);

  return (
    <div className="App">
      <BrowserView>
        {user ? (
          <div className="AppBody">
            <Router>
              <Sidebar />
              <Switch>
                <Route path="/rooms/:roomid">
                  <Chat />
                </Route>
                <Route path="/">
                  <Simple />
                </Route>
              </Switch>
            </Router>
          </div>
        ) : (
          <Login/>
        )}
      </BrowserView>
      <MobileView>
      {user ? (
          <div className="AppBody">
            <Router>
              <Switch>
                <Route path="/rooms/:roomid">
                  <Chat />
                </Route>
                <Route path="/">
                  <Sidebar />
                </Route>
              </Switch>
            </Router>
          </div>
        ) : (
          <Login/>
        )}
      </MobileView>
    </div>
  );
}

export default App;
