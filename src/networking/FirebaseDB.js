import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/Firebase";
import { getDatabase, push, ref, set } from "firebase/database";
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
    `orders/${restaurantId}/${date}/${userId}/`
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
