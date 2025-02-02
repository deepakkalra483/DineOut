importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received message:", payload);
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message.",
    // Ensure you have an icon file at this path
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
