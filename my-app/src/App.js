import React,{ useState, useEffect } from 'react';
import Cake from "./cake";
import Head from './Header';
import Post from './Post';
import { Provider } from "react-redux";
import store from "./redux/store";
import Upload from './Upload';
import './App.css';
import { db } from './firebase';

function App(){
  const [post,setposts] = useState([]);
  const [user, setuser] = useState(null);

  useEffect(() => {
    db.collection('posts').orderBy("timestamp","desc").onSnapshot(data => {
      setposts(data.docs.map(doc => ({
        id : doc.id,
        data: doc.data()
      })));
    })
  },[]);

  return (
    <>
      <Provider store={store}>
        <div className="app">
          <Head user={user} setuser={setuser}/>
          <Cake cake/>
          {user ? (<Upload username={user.displayName}/>) : (<div></div>)} 
          {
            post.map(({id,data}) => {
              return <Post key={id} current_user={user} postid={id} username={data.username} image={data.image} caption={data.caption}/>
            })
          }
        </div>
      </Provider>
    </>
  )
}

export default App;