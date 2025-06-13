import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";
import {
  getDatabase,
  push,
  ref,
  serverTimestamp,
  set,
  update,
} from "firebase/database";
import { USER_ID } from "./LocalDB";

export const fetchResturant = (id, onSuccess, onFailure) => {
  const docRef = doc(db, "restaurants", id); // Reference to the restaurant document
  getDoc(docRef).then((docSnap) => {
    if (docSnap.exists()) {
      const { menu, ...details } = docSnap.data();
      console.log("menu--", menu);
      onSuccess(menu, details);
    } else {
      console.log("No such document!");
      onFailure();
    }
  });
};

export const addOrderToDatabase = (
  restaurantId,
  tableId,
  userId,
  orderData,
  onSuccess,
  onFailure
) => {
  const currentTimeStemp = new Date();
  // const userId = localStorage.getItem(USER_ID);
  const date = currentTimeStemp?.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const db = getDatabase();
  const ordersRef = ref(
    db,
    // `orders/${restaurantId}/${date}/${userId}/`
    `orders/${restaurantId}/${date}/${tableId}/${userId}/`
  ); // Path: orders/{restaurantId}
  // Push the new order with a unique key
  const newOrderRef = push(ordersRef); // Creates a unique ID
  set(newOrderRef, orderData) // Adds the order data under the unique ID
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      onFailure();
      alert(`Error adding order:${error}`);
    });
};

export const updateOrderToDatabase = (
  more,
  restaurantId,
  tableId,
  token,
  userId,
  orderData,
  onSuccess,
  onFailure
) => {
  const currentTimeStemp = new Date();
  // const userId = localStorage.getItem(USER_ID);
  const date = currentTimeStemp?.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  // const db = getDatabase();
  // // const date = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // const userNode = `orders/${restaurantId}/${date}/${tableId}/${userId}`;
  // const ordersRef = ref(db, `${userNode}/orders`);

  // // Generate a unique order ID
  // const orderId = push(ordersRef).key;
  // console.log("Order ID:", orderId);

  // // Batch update
  // const updates = {};

  // // ✅ Store order under user
  // updates[`${userNode}/orders/${orderId}`] = {
  //   ...orderData,
  //   timestamp: serverTimestamp(),
  // };

  // // ✅ Store latest order timestamp at user level
  // updates[`${userNode}/latestTimestamp`] = serverTimestamp();

  // // ✅ Store user’s token for notifications
  // updates[`${userNode}/token`] = token;

  // // ✅ Update latest user index for optimized fetching
  // // updates[`latestOrdersIndex/${restaurantId}/latestUsers/${userId}`] = {
  // //   tableId,
  // //   timestamp: serverTimestamp(),
  // // };
  // updates[`latestOrdersIndex/${restaurantId}/tables/${tableId}`] = {
  //   userId,
  //   timestamp: serverTimestamp(),
  // };
  const db = getDatabase();
  const ordersRef = ref(
    db,
    // `orders/${restaurantId}/${date}/${userId}/`
    `orders/${restaurantId}/${date}/${tableId}/${userId}/orders/`
  ); // Path: orders/{restaurantId}
  // Push the new order with a unique key
  const orderId = push(ordersRef).key; // Creates a unique ID
  console.log("id--", orderId);
  const userNode = `orders/${restaurantId}/${date}/${tableId}/${userId}`;
  const updates = {};
  updates[
    `orders/${restaurantId}/${date}/${tableId}/${userId}/orders/${orderId}`
  ] = {
    ...orderData,
  };
  const latestNode = `latestOrders/${restaurantId}/${date}/${tableId}/`;

  if (more) {
    updates[
      `latestOrders/${restaurantId}/${date}/${tableId}/${userId}/orders/${orderId}`
    ] = orderData;
    updates[`${latestNode}/${userId}/token`] = token;
    updates[`${latestNode}/${userId}/latestTimestamp`] = serverTimestamp();
  } else {
    updates[`${latestNode}`] = {
      [userId]: {
        token: token,
        latestTimestamp: serverTimestamp(),
        orders: {
          [orderId]: orderData, // Add new order
        },
      },
    };
  }
  // updates[`${userNode}/latestTimestamp`] = serverTimestamp();
  // updates[`${userNode}/token`] = token;
  update(ref(db), updates)
    .then(() => {
      onSuccess();
    })
    .catch((error) => {
      onFailure();
      alert(`Error adding order:${error}`);
    });
  // set(newOrderRef, orderData) // Adds the order data under the unique ID
  //   .then(() => {
  //     onSuccess();
  //   })
  //   .catch((error) => {
  //     onFailure();
  //     alert(`Error adding order:${error}`);
  //   });
};
