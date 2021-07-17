import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCboXix97BlhhAuSiXzVOviM7VG3aeJKiQ",
    authDomain: "boxchat-2ee7e.firebaseapp.com",
    databaseURL: "https://boxchat-2ee7e.firebaseio.com",
    projectId: "boxchat-2ee7e",
    storageBucket: "boxchat-2ee7e.appspot.com",
    messagingSenderId: "61223648796",
    appId: "1:61223648796:web:ce8833a9d2928bae7da9d9",
    measurementId: "G-ZHGQPJ3S8K"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export default db;
export { auth, provider };