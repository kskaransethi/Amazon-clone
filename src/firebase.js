import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRRyHsiuP4I7j5TnC6CvwyNS1o7xKeO9E",
  authDomain: "clone-cee60.firebaseapp.com",
  projectId: "clone-cee60",
  databaseURL: "https://amz-clone-medium.firebaseio.com",
  storageBucket: "clone-cee60.appspot.com",
  messagingSenderId: "971046375081",
  appId: "1:971046375081:web:3e52cfbf7c44797b4a63b8",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
