import axios from "axios";
import { GET_MENU, SEND_NOTIFICATION } from "./api";

export const getMenu = (params, onSuccess, onFailure) => {
  fetchData(`${GET_MENU}${params?.resturant}/menu`, onSuccess, onFailure);
};

export const postNotification = (params, onSuccess, onFailure) => {
  console.log("url--", SEND_NOTIFICATION);
  console.log("params-", params?.tokens);

  // return
  // postData(SEND_NOTIFICATION, params, onSuccess, onFailure);
  placeOrder(SEND_NOTIFICATION, params, onSuccess, onFailure);
};

const placeOrder = async (url, params, onSuccess, onFailure) => {
  const apiUrl = url;
  try {
    const response = await axios.post(apiUrl, params, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log("Order placed successfully:", response.data);
      // alert("Order placed successfully!");
      onSuccess();
    } else {
      console.error("Unexpected response:", response.status, response.data);
      alert("Failed to place the order. Please try again.");
      onFailure();
    }
  } catch (error) {
    console.error(
      "Error while placing the order:",
      error?.response?.data || error.message
    );
    alert(
      "An error occurred while placing the order. Please check the console for details."
    );
    onFailure();
  }
};

async function postData(url, payload, onSuccess, onFailure) {
  try {
    const response = await fetch(url, {
      method: "POST", // HTTP method for adding data
      headers: {
        "Content-Type": "application/json", // Ensure the server knows the payload is JSON
      },
      body: JSON.stringify(payload), // Convert the data to JSON
    });

    if (!response.ok) {
      onFailure(response.status);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    response
      .json()
      .then((data) => {
        onSuccess(data); // Parse the JSON response
        console.log("Data added successfully:", data);
        return data;
      })
      .catch((error) => {
        onFailure(error);
        console.error("Error Parsing data:", error);
      });
    // Return the response data
  } catch (error) {
    onFailure(error);
    console.error("Error adding data:", error);
  }
}

async function fetchData(url, onSuccess, onFailure) {
  console.log("url--", url);
  try {
    const response = await fetch(url); // Replace with your API endpoint
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    onSuccess(data); // Parse the JSON data
    console.log("Data fetched:", data);
  } catch (error) {
    console.error("Error fetching data:", error);
    onFailure(error);
  }
}
