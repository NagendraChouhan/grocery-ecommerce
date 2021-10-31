// Import the functions you need from the SDKs you need
const { initializeApp } =require("firebase/app");
require("firebase/storage");

// const { getAnalytics } = require("firebase/analytics");


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYaoAeB38f4q7PamlCKXdYZ7j9JG186lc",
  authDomain: "test-2fcfe.firebaseapp.com",
  databaseURL: "https://test-2fcfe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "test-2fcfe",
  storageBucket: "test-2fcfe.appspot.com",
  messagingSenderId: "465122486779",
  appId: "1:465122486779:web:7c86c6d033274db8e9c35e",
  measurementId: "G-967E4G8E80"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
console.log(firebase);
module.exports=firebase;
// const analytics = getAnalytics(app);