import { GET_MENU } from "./api";

export const getMenu = (params, onSuccess, onFailure) => {
  fetchData(`${GET_MENU}${params?.resturant}/menu`, onSuccess, onFailure);
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
      throw new Error(`HTTP error! Status: ${response.status}`);
      onFailure(response.status);
    }

    const data = await response.json();
    onSuccess(data); // Parse the JSON response
    console.log("Data added successfully:", data);
    return data; // Return the response data
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
