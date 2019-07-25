import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
var firebaseConfig = {
    apiKey: "AIzaSyCsh88PpP_M_Ww90giajwRck12ASGr6NNw",
    authDomain: "smvue-ffc6b.firebaseapp.com",
    databaseURL: "https://smvue-ffc6b.firebaseio.com",
    projectId: "smvue-ffc6b",
    storageBucket: "",
    messagingSenderId: "485971157081",
    appId: "1:485971157081:web:bc805b8f3712d16e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// firebase collections
const usersCollection = db.collection('users')
const classesCollection = db.collection('classes')
const studentsCollection = db.collection('students')
const likesCollection = db.collection('likes')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    classesCollection,
    studentsCollection,
    likesCollection
}