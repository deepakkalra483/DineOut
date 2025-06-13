export const StoreMenu = (id, data) => {
  const stringifyData = JSON.stringify(data);
  localStorage.setItem(MENU_KEY + id, stringifyData);
};

export const StoreOffers = (id, data) => {
  const stringifyData = JSON.stringify(data);
  localStorage.setItem(OFFER_KEY + id, stringifyData);
};

export const StoreResturantDetails = (id, data) => {
  const stringifyData = JSON.stringify(data);
  localStorage.setItem(DETAILS_KEY + id, stringifyData);
};

export const StoreOrder = (id, data) => {
  const stringifyData = JSON.stringify(data);
  localStorage.setItem(ORDER_KEY + id, stringifyData);
};

export const StoreOrderHistory = (id, data) => {
  const stringifyData = JSON.stringify(data);
  localStorage.setItem(HISTORY_KEY + id, stringifyData);
};

export const setUserId = (id) => {
  const previousId = localStorage.getItem(USER_ID);
  console.log("id exsit--", previousId);
  if (!previousId) {
    localStorage.setItem(USER_ID, id);
  } else {
    console.log("id Alreday exsits");
  }
};

export const setUserDetails = (data) => {
  const stringfyDetail = JSON.stringify(data);
  localStorage.setItem(USER_DETAILS, stringfyDetail);
};

export const getUserDeatils = () => {
  const userDeatils = localStorage.getItem(USER_DETAILS);
  if (userDeatils) {
    const parsedData = JSON.parse(userDeatils);
    return parsedData;
  } else {
    return null;
  }
};

export const setFcmToken = (token) => {
  localStorage.setItem(FCM_TOKEN, token);
};

export const GetMenu = (id) => {
  const data = localStorage.getItem(MENU_KEY + id);
  if (data) {
    const ParsedData = JSON.parse(data);
    return ParsedData;
  } else {
    return [];
  }
};

export const GetOffer = (id) => {
  const data = localStorage.getItem(OFFER_KEY + id);
  if (data) {
    const ParsedData = JSON.parse(data);
    return ParsedData;
  } else {
    return [];
  }
};

export const GetDetails = (id) => {
  const data = localStorage.getItem(DETAILS_KEY + id);
  if (data) {
    console.log("alredyPresnet");
    const ParsedData = JSON.parse(data);
    return ParsedData;
  } else {
    return {};
  }
};

export const GetOrder = (id) => {
  const data = localStorage.getItem(ORDER_KEY + id);
  if (data) {
    console.log("alredyPresnet");
    const ParsedData = JSON.parse(data);
    return ParsedData;
  } else {
    return [];
  }
};

export const GetOrderHistory = (id) => {
  const data = localStorage.getItem(HISTORY_KEY + id);
  console.log("history--", data);
  if (data) {
    console.log("alredyPresnet");
    const ParsedData = JSON.parse(data);
    return ParsedData;
  } else {
    console.log("noHistory");
    return [];
  }
};

export const RemoveOrders = (id) => {
  localStorage.removeItem(ORDER_KEY + id);
};

export const GetFcmToken = () => {
  const token = localStorage.getItem(FCM_TOKEN);
  if (token) {
    return token;
  } else {
    return null;
  }
};

export const removeAllExcept = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key !== FCM_TOKEN && key !== TIME_KEY && key !== USER_DETAILS) {
      localStorage.removeItem(key);
    }
  });
};

export const removeHistoryAllExcept = (id) => {
  Object.keys(localStorage).forEach((key) => {
    if (
      key !== FCM_TOKEN &&
      key !== MENU_KEY + id &&
      key !== DETAILS_KEY + id
    ) {
      localStorage.removeItem(key);
    }
  });
};
export const MENU_KEY = `menu`;
export const ORDER_KEY = `order`;
export const HISTORY_KEY = `history_key`;
export const DETAILS_KEY = `details`;
export const USER_ID = "user_id";
export const FCM_TOKEN = "fcm_token";
export const TIME_KEY = `lastVisitTime`;
export const USER_DETAILS = "user_details";
export const OFFER_KEY = "offer_key";
