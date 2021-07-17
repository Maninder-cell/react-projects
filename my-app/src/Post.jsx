import React, { useState, useEffect } from "react";
import "./post.css";
import { db } from "./firebase";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

function Post({ postid, current_user, username, image, caption }) {
  const [comments, setcomments] = useState([]);
  const [comment, setcomment] = useState("");

  function post_comment(event) {
    event.preventDefault();
    db.collection("posts").doc(postid).collection("comments").add({
      text: comment,
      username: current_user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setcomment("");
  }

  useEffect(() => {
    let unsubscribe;
    if (postid) {
      unsubscribe = db
        .collection("posts")
        .doc(postid)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setcomments(
            snapshot.docs.map((doc) => ({
              id : doc.id, 
              data : doc.data()
            }))
          );
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postid]);

  return (
    <>
      <div className="post">
        <div className="post_user">
          <Avatar alt={username} src="/broken-image.jpg" />
          <h3 className="username">{username}</h3>
        </div>
        <img className="post_img" src={image} alt="post_image" />
        <p className="post_caption">{caption}</p>
        <div className="post_comments">
          <p>View all {comments.length} Comments</p>
          {comments.map(({id,data}) => {
            return (
              <p key={id} className="comment">
                <b>{data.username}</b>
                <span>{data.text}</span>
              </p>
            );
          })}
        </div>
        { current_user && <div className="comment_box">
          <form onSubmit={post_comment} className="comment_form" autoComplete="off">
            <input
              value={comment}
              onChange={(event) => setcomment(event.target.value)}
              className="input_comment"
              type="text"
              required
              placeholder="post a comment"
            />
            <button
              className="post_comment"
              type="submit"
            >
              Post
            </button>
          </form>
        </div> }
      </div>
    </>
  );
}

export default Post;
