import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import axios from "axios";

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

// const firebaseConfig = {
//   apiKey: "AIzaSyCbeut2RwySx032SNsZBKls8uDf30LUy7E",
//   authDomain: "finedine-5974a.firebaseapp.com",
//   databaseURL: "https://finedine-5974a-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "finedine-5974a",
//   storageBucket: "finedine-5974a.firebasestorage.app",
//   messagingSenderId: "614290644556",
//   appId: "1:614290644556:web:11e1f00e99c8cf9281dee9",
//   measurementId: "G-T4GJ74K777"
// };

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

export const GenerateToken = async (onLoading, onSuccess, onFailure) => {
  Notification.requestPermission()
    .then((permission) => {
      onLoading(true);
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey:
            "BOLjfAf3ejlPXRIH6XMzz4ycm8rRfPQ_xpMbyLGbOwe4iL5-tzJ1VAnjnCra4Fg0gegomI1ClJ8-aqmvbeJbXyQ",
        })
          .then((token) => {
            // alert(token);
            console.log("token--", token);
            onLoading(false);
            onSuccess(token);
          })
          .catch((error) => {
            onLoading(false);
            onFailure(error);
            console.log(`tokeneror${error}`);
          });
      } else {
        onLoading(false);
        onFailure("denied");
      }
    })
    .catch((error) => {
      onLoading(false);
      alert(`permissionerroe:${error}`);
    });
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
