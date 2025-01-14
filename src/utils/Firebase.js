// Import the functions you need from the SDKs you need
import { getDatabase } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbeut2RwySx032SNsZBKls8uDf30LUy7E",
  authDomain: "finedine-5974a.firebaseapp.com",
  databaseURL:
    "https://finedine-5974a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "finedine-5974a",
  storageBucket: "finedine-5974a.firebasestorage.app",
  messagingSenderId: "614290644556",
  appId: "1:614290644556:web:5c29f657cbfd680f81dee9",
  measurementId: "G-3DD95J64MG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
