// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTyaad4roB0kGO7LkvFNylN2HCi3_YQZY",
  authDomain: "mftngo.firebaseapp.com",
  databaseURL: "https://mftngo-default-rtdb.firebaseio.com",
  projectId: "mftngo",
  storageBucket: "mftngo.appspot.com",
  messagingSenderId: "366222961708",
  appId: "1:366222961708:web:240f621f21d607cfeef589",
};

// Initialize Firebase
let app = null;

if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
}

export default firebase;
