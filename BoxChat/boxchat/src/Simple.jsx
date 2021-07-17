import React from "react";
import "./simple.css";
import Paper from "@material-ui/core/Paper";

function Simple() {
  return (
    <div className="simple">
      <Paper elevation={3}>
        <div className="simple_data">
          <img
            alt="Logo"
            src="https://img.icons8.com/color/480/000000/chat.png"
          />
          <h2>Chat With Random People's</h2>
        </div>
      </Paper>
    </div>
  );
}

export default Simple;
