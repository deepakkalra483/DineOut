import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import axios from "axios";

const firebaseConfig = {
  apiKey: process.env.API_Key,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MESAURMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const db = getFirestore(firebaseApp);

export { db, messaging };
// export const getFcmToken =async () => {
//   return getToken(messaging, {
//     vapidKey:
//       "BOLjfAf3ejlPXRIH6XMzz4ycm8rRfPQ_xpMbyLGbOwe4iL5-tzJ1VAnjnCra4Fg0gegomI1ClJ8-aqmvbeJbXyQ",
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         console.log("current token for client: ", currentToken);
//         setTokenFound(true);
//         // Track the token -> client mapping, by sending to backend server
//         // show on the UI that permission is secured
//       } else {
//         console.log(
//           "No registration token available. Request permission to generate one."
//         );
//         setTokenFound(false);
//         // shows on the UI that permission is required
//       }
//     })
//     .catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//       // catch error while creating client token
//     });
// };

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log(permission);
    if (permission === "granted") {
      try {
        const token = await getToken(messaging, {
          vapidKey:
            "BOLjfAf3ejlPXRIH6XMzz4ycm8rRfPQ_xpMbyLGbOwe4iL5-tzJ1VAnjnCra4Fg0gegomI1ClJ8-aqmvbeJbXyQ",
        });
        console.log(token);
        alert(token);
      } catch (error) {
        alert(error);
        console.log("error--", error);
      }
    }
  } catch (error) {
    alert(error);
  }
};

const FCM_SERVER_KEY = "YOUR_SERVER_KEY"; // From Firebase Console
export const sendNotification = async (fcmToken, title, body) => {
  const payload = {
    message: {
      token: fcmToken,
      notification: {
        body: "This is an FCM notification message!",
        title: "FCM Message",
      },
    },
  };

  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send",
      payload,
      {
        headers: {
          Authorization: `Bearer ya29.a0AXeO80SDS_ZI_WwYV2sdU5dudNuO5hCaCwUmZ0WI-01f9a6UTpH87y09LL8TMsvRG41p4_mCW9HGLdYzFGAJnFVHjU0jhVfHKhQwIMHzErv0JVMDtd7G1rMsqk3gVLhM0YHZy1aJ10ONsrD_TkUctSmm94qzXGwdeUYZbZm6aCgYKAe0SARISFQHGX2MitwZn5yL4OkbZ11o9shG_HQ0175`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Notification sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
