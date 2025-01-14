import { GET_MENU } from "./api";


export const getMenu = (params, onSuccess, onError) => {
  CallApi(`${GET_MENU}${params?.name}/menu`, "GET", null, onSuccess, onError);
};

const CallApi =  (
  url,
  method,
  body = null,
  headers = {},
  onSuccess,
  onFailure
) => {
  // Default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers, // Merge user-provided headers
  };

  const options = {
    method,
    headers: defaultHeaders,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response
        .json()
        .then(() => {
          onSuccess(data);
        })
        .catch((err) => {
          onFailure(err);
        });
    })
    .catch((error) => {
      onFailure(error);
    });
};
