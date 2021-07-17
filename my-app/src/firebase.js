import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyARH4S7fwa_62XfeceNWbrijeCjDeogr40",
    authDomain: "check-ef5f2.firebaseapp.com",
    databaseURL: "https://check-ef5f2.firebaseio.com",
    projectId: "check-ef5f2",
    storageBucket: "check-ef5f2.appspot.com",
    messagingSenderId: "887550449580",
    appId: "1:887550449580:web:86cc708487a8da7e620c09",
    measurementId: "G-Z6YFMF0MS2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const data = firebase.database();


export { db, data, auth , storage };