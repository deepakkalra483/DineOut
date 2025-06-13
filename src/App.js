import "./App.css";
import { AppColors } from "./utils/AppColors";
import { useEffect, useRef, useState } from "react";
import "./utils/AppCss.css";
import { postNotification } from "./networking/CallApi";
import Lottie from "lottie-react";
import orderPlace from "./assets/animations/order_Placed.json";
import { GenerateToken } from "./utils/Firebase";
import {
  FCM_TOKEN,
  GetDetails,
  GetMenu,
  GetOffer,
  GetOrder,
  GetOrderHistory,
  getUserDeatils,
  removeAllExcept,
  RemoveOrders,
  setFcmToken,
  setUserId,
  StoreMenu,
  StoreOffers,
  StoreOrder,
  StoreOrderHistory,
  StoreResturantDetails,
  USER_ID,
} from "./networking/LocalDB";
import { addOrderToDatabase, fetchResturant } from "./networking/FirebaseDB";
import { v4 as uuidv4 } from "uuid";
import MenuItem from "./components/MenuItem";
import MultipriceItem from "./components/MutipriceItem";
import CartView from "./components/CartView";
import HistorySheet from "./components/HistorySheet";
import n5 from "./assets/sounds/order_ready.mp3";
import moment from "moment";

const offers = [
  {
    id: "offer1",
    name: "Combo 2 Burger 2 Cold Drinks",
    title: "20% OFF on orders above ₹199",
    price: [{ size: "", price: 375 }],
    description: "Only valid on Monday and Thursday",
    discount: 20,
    days_active: ["monday", "thursday", "friday", "saturday"],
    start_time: "00:00",
    end_time: "24:59",
    valid_from: "2025-06-10",
    valid_to: "2025-06-30",
    is_active: true,
    src: "https://revacafe.in/cdn/shop/files/burger-combo-reva-cafe_f2307d82-228a-4538-adfc-b42282c500e6.png?v=1725171715",
  },
];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActive] = useState("All");
  const [allItems, setItems] = useState([]);
  const [offers, setOffers] = useState([]);
  const [backupList, setBackup] = useState([]);
  const [filters, setFilters] = useState(["All"]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [fcmToken, setToken] = useState(null);
  const [showPopup, setShowPopUp] = useState(null);
  const [notificationLoad, setNotificationLoad] = useState(false);
  const [userDeatils, setUserDeatils] = useState(null);

  useEffect(() => {
    const channel = new BroadcastChannel("order_ready");
    channel.onmessage = function (event) {
      let sound = new Audio(n5);
      sound.play();
      // showNotification(event.data.key);
    };
  }, []);

  const showNotification = (body) => {
    if (body) {
      //notification sound
      let sound = new Audio(n5);
      sound.play();
      //notification body
      const options = {
        body: body.notification.body,
        // icon: "icon.png",
        vibrate: true, //vibrate will work only on the mobile device
      };
      let notification = new Notification(body.notification.title, options);
      notification.onclick = function (event) {
        event.preventDefault();
        window.open(
          `http://localhost:3000/DineOut?Id=${details.id}&table=${details?.table}`,
          "_self"
        );
      };
    }
  };

  const toggleMenu = () => {
    setOpenHistory(!openHistory);
  };

  const CheckToken = () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      setToken("not");
      return;
    }
    if (Notification.permission == "default") {
      setShowPopUp("open");
    } else if (Notification.permission == "denied") {
      setToken("disable");
    } else {
      const token = localStorage.getItem(FCM_TOKEN);
      if (!token) {
        console.log("tokeNo found");
        StoreToken();
      } else {
        setToken(token);
        console.log("tokenfound--", token);
      }
    }
  };

  const StoreToken = () => {
    setShowPopUp(null);
    GenerateToken(
      (load) => {
        setShowPopUp(load ? "load" : null);
      },
      (response) => {
        setFcmToken(response);
        setToken(response);
        setShowPopUp(null);
      },
      (error) => {
        setToken("disable");
        alert(error);
        setShowPopUp(null);
      }
    );
  };

  // const uniqueId = uuidv4();
  // console.log("id---", uniqueId);

  const GetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position?.coords?.latitude;
      const longitude = position?.coords?.longitude;
      alert(`let${latitude}+ long${longitude}`);
    });
  };

  const getDistanceInMeters = (lat2, lon2) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat1 = position?.coords?.latitude;
          const lon1 = position?.coords?.longitude;
          const R = 6371000; // Radius of the Earth in meters
          const dLat = (lat2 - lat1) * (Math.PI / 180);
          const dLon = (lon2 - lon1) * (Math.PI / 180);

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
              Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          resolve(distance);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const newSession = () => {
    const prevTimestamp = localStorage.getItem("lastVisitTime");
    const currentTime = Date.now(); // Current timestamp in milliseconds
    const fiveMinutes = 5 * 60 * 60 * 1000; // 5 hrs in milliseconds
    console.log("pre", prevTimestamp);
    if (!prevTimestamp || currentTime - parseInt(prevTimestamp) > fiveMinutes) {
      console.log("pre", prevTimestamp);
      localStorage.setItem("lastVisitTime", currentTime.toString());

      console.log("Timestamp updated:", new Date(currentTime).toLocaleString());
      return true;
    } else {
      console.log("Less than 5 hrs since last update. No change.");
      return false;
    }
  };

  const UpdateFilters = (list) => {
    let categories = ["All"];
    list.map((item) => {
      categories.push(item?.category);
    });
    setFilters(categories);
  };

  const UpdateMenu = (Id, table) => {
    if (Id && table) {
      const localMenu = GetMenu(Id);
      const localOffer = GetOffer(Id);
      const uniqueId = uuidv4();
      const isNewSession = newSession();
      if (localMenu?.length == 0 || isNewSession) {
        setLoading(true);
        console.log("notpresent");
        removeAllExcept();
        // localStorage.clear();

        setUserId(uniqueId);
        fetchResturant(
          Id,
          (menu, details) => {
            setItems(menu);
            setOffers(details?.offers);
            setBackup(menu);
            StoreMenu(Id, menu);
            StoreOffers(Id, details?.offers);
            UpdateFilters(menu);
            setDetails({ ...details, ...{ id: Id, table: table } });
            StoreResturantDetails(Id, details);
            setLoading(false);
            // setTimeout(() => {
            //   CheckToken();
            // }, 0);
          },
          (error) => {
            setLoading(false);
            console.log(error);
          }
        );
      } else {
        console.log("exsits");
        setItems(localMenu);
        setOffers(localOffer);
        setBackup(localMenu);
        UpdateFilters(localMenu);

        const orderData = GetOrder(table);
        // if (orderData?.length == 0) {
        //   console.log("removeorders");
        //   removeHistoryAllExcept(Id);
        //   // setUserId(uniqueId);
        // }
        const details = GetDetails(Id);
        setDetails({ ...details, ...{ id: Id, table: table } });
        setOrders(orderData);
        const historydata = GetOrderHistory(table);
        setHistory(historydata);
        setLoading(false);
        // setTimeout(() => {
        //   CheckToken();
        // }, 0);
      }
      // console.log("menu--", data);
    } else {
      setLoading(false);
    }
  };

  const PlaySound = () => {
    let sound = HTMLAudioElement;
    sound = new Audio();
    sound.src = "./assets/animations/notification_sound.wav";
    sound.load();
    sound.play();
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const Id = searchParams.get("Id");
    const table = searchParams.get("table");
    console.log("id--", Id + "/ " + table);
    const userData = getUserDeatils() || null;
    setUserDeatils(userData);
    UpdateMenu(Id, table);
  }, []);

  const toggleHistorySheet = () => {
    setIsOpen(!isOpen);
  };

  const filterItems = (category) => {
    console.log("allItems--", JSON.stringify(backupList));
    const filterMenu = backupList.filter((item) => item?.category === category);
    if (filterMenu?.length > 0) {
      setItems(filterMenu);
    } else {
      setItems(backupList);
    }
  };

  const searchItems = (query) => {
    const lowerQuery = query.toLowerCase();

    const filterMenu = backupList
      .map((menu) => {
        const filteredItems = menu.items.filter((item) =>
          item.name?.toLowerCase().includes(lowerQuery)
        );

        const categoryMatches = menu.category
          ?.toLowerCase()
          .includes(lowerQuery);

        if (filteredItems.length > 0 || categoryMatches) {
          return {
            ...menu,
            items:
              filteredItems.length > 0 || !categoryMatches
                ? filteredItems
                : menu.items, // if only category matched, return full items
          };
        }

        return null;
      })
      .filter((menu) => menu !== null);

    setItems(filterMenu.length > 0 ? filterMenu : []);
  };

  const getOrderDetails = () => {
    let data = [];
    orders.map((item) => {
      const parms = {
        quantity: item?.qty,
        name: item?.size + " " + item?.name,
        // size: item?.size == undefined ? "" : item?.size,
      };
      data.push(parms);
    });
    return data;
  };

  const PlaceOrder = (foodType, userData) => {
    setNotificationLoad(true);
    const currentTimestamp = new Date().toISOString();
    const orderList = getOrderDetails();
    const userId = localStorage.getItem(USER_ID);
    const orderDetails = {
      // tableNumber: details?.table,
      read: "0",
      time: currentTimestamp,
      items: orderList,
      message: foodType,
    };
    const tokenList = details?.tokens
      .filter((item) => item?.type == "chef" || item?.type == "reception")
      .map((item) => item?.token);

    const params = {
      tokens: tokenList,
      orderDetails: {
        userId: userId,
        table: details?.table,
        // time: currentTimestamp,
        items: JSON.stringify(orderList),
        message: foodType || "",
        // token: history?.length == 0 ? fcmToken : "",
        name: userData?.name || "",
        mobile: userData?.mobile || "",
      },
    };
    postNotification(
      params,
      (response) => {
        if (response?.status) {
          setOrderPlaced(true);
          setTimeout(() => {
            setOrderPlaced(false);
          }, 2500);
          setNotificationLoad(false);
          // alert("notification send");
          setHistory([...orders, ...history]);
          StoreOrderHistory(details?.table, [...orders, ...history]);
          RemoveOrders(details?.table);
          setOrders([]);
        } else {
          setNotificationLoad(false);
          alert("failed to send");
        }
      },
      (error) => {
        setNotificationLoad(false);
        alert(`noterr--${error}`);
      }
    );
    addOrderToDatabase(
      details?.id,
      details?.table,
      userId,
      orderDetails,
      (onSuccess) => {},
      (error) => {
        console.log("error");
      }
    );
    // updateOrderToDatabase(
    //   history?.length > 0,
    //   details?.id,
    //   details?.table,
    //   fcmToken,
    //   userId,
    //   orderDetails,
    //   (onSuccess) => {},
    //   (error) => {
    //     console.log("error");
    //   }
    // );
    return;
    // saveHistoryLocal();
    // localStorage.removeItem(details?.resturant + details?.table);
  };

  const AddIncart = (item) => {
    setOrders((prevOrders) => {
      const existingItem = prevOrders.find(
        (order) => order.id === item.id && order?.size === item?.size
      );
      const updatedOrders =
        existingItem &&
        prevOrders.map((order) =>
          order.id === item.id && order?.size === item?.size
            ? { ...order, qty: order.qty + 1 }
            : order
        );
      StoreOrder(details?.table, updatedOrders);
      // saveToLocalStorage(updatedOrders); // Save to localStorage
      return updatedOrders;
    });
  };

  const removeFromCart = (item) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders
        .map((order) =>
          order.id === item.id && order?.size === item?.size
            ? { ...order, qty: order.qty - 1 }
            : order
        )
        .filter((order) => order.qty > 0); // Remove items with qty <= 0
      StoreOrder(details?.table, updatedOrders);
      // saveToLocalStorage(updatedOrders); // Save to localStorage
      return updatedOrders;
    });
  };

  const AddItem = (item, data) => {
    if (data) {
      setOrders((prevOrders) => {
        const existingItem = prevOrders.find(
          (order) => order.id === item.id && order?.size === data?.size
        );
        const updatedOrders = existingItem
          ? prevOrders.map((order) =>
              order.id === item.id && order?.size === data?.size
                ? { ...order, qty: order.qty + 1 }
                : order
            )
          : [
              ...prevOrders,
              {
                id: item?.id,
                name: item?.name,
                price: data?.price,
                src: item?.src,
                size: data?.size,
                qty: 1,
              },
            ];
        StoreOrder(details?.table, updatedOrders);
        // saveToLocalStorage(updatedOrders); // Save to localStorage
        return updatedOrders;
      });
    } else {
      setOrders((prevOrders) => {
        const existingItem = prevOrders.find((order) => order.id === item.id);
        const updatedOrders = existingItem
          ? prevOrders.map((order) =>
              order.id === item.id ? { ...order, qty: order.qty + 1 } : order
            )
          : [...prevOrders, { ...item, qty: 1 }];
        StoreOrder(details?.table, updatedOrders);
        // saveToLocalStorage(updatedOrders); // Save to localStorage
        return updatedOrders;
      });
    }
  };

  const removeItem = (item, data) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders
        .map((order) =>
          order.id === item.id && order?.size === data?.size
            ? { ...order, qty: order.qty - 1 }
            : order
        )
        .filter((order) => order.qty > 0); // Remove items with qty <= 0
      StoreOrder(details?.table, updatedOrders);
      // saveToLocalStorage(updatedOrders); // Save to localStorage
      return updatedOrders;
    });
  };

  const deleteItem = (item) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.filter(
        (order) => !(order.id === item?.id && order.size === item?.size)
      );
      StoreOrder(details?.table, updatedOrders);
      return updatedOrders;
    });
  };

  const [searchText, setSearchText] = useState("");

  const [placeholderText, setPlaceholderText] = useState("Search Pizza");

  return (
    <div className="main-container">
      {/* Fixed Search Bar */}
      <div className="search-bar">
        <input
          style={{ width: "85%" }}
          type="text"
          placeholder={`Search in ${details?.name}`}
          onChange={(e) => searchItems(e?.target?.value)}
        />
        {fcmToken ? (
          <img
            style={{
              height: 35,
              width: 35,
              marginLeft: 10,
            }}
            src={
              fcmToken == "not"
                ? require("./assets/images/icons/not_avl.png")
                : fcmToken == "disable"
                ? require("./assets/images/icons/notification.png")
                : require("./assets/images/icons/notification_enable.png")
            }
          />
        ) : (
          <></>
        )}
        <div
          style={{
            width: 45,
            alignItems: "center",
            marginLeft: 10,
            justifyContent: "center",
            display: "flex",
          }}
          onClick={toggleHistorySheet}
        >
          <img
            style={{
              height: 35,
              width: 35,
            }}
            src={require("./assets/images/icons/history.png")}
          />
          {history?.length > 0 && (
            <p
              style={{
                position: "absolute",
                bottom: 2,
                right: 13,
                backgroundColor: "green",
                borderRadius: "50%",
                fontSize: "10px",
                color: "#fff",
                height: 20,
                width: 20,
                textAlign: "center",
                alignContent: "center",
              }}
            >
              {history.reduce((total, item) => total + item.qty, 0)}
            </p>
          )}
        </div>
      </div>
      {/* {showPopup != null && (
        <PopUp
          title={"Enable Notification"}
          description={
            "When your order is ready, We will send you notification"
          }
          rightPress={StoreToken}
          RightText={"Allow"} 
          loading={showPopup == "load"}
        />
      )} */}

      {/* Scrollable Vertical List */}
      <div
        style={{ height: orders?.length > 0 ? "88%" : "98%" }}
        className="vertical-list"
      >
        <div className="categories">
          <FilterView
            list={filters}
            active={activeFilter}
            onPress={(filter) => {
              filterItems(filter);
              setActive(filter);
            }}
          />
        </div>
        <OfferModal
          offers={offers}
          orders={orders}
          onClick={(item, data) => {
            AddItem(item, data);
          }}
          ordered={true}
        />
        {allItems.length == 0 && loading ? (
          <Spinner />
        ) : allItems.length > 0 ? (
          allItems.map((mainItem) => (
            <div key={mainItem.category} className="list-item">
              <h3>{mainItem.category}</h3>
              {/* Horizontal Scroll List */}
              <div className="horizontal-list">
                {mainItem?.items?.map((item) => {
                  const single = typeof item?.price == "string";
                  const orderDetails = single
                    ? orders.find((orderItem) => orderItem?.id === item?.id)
                    : orders.filter((orderItem) => orderItem?.id === item?.id);
                  return !single ? (
                    <MultipriceItem
                      sizes={item?.price}
                      ordered={orderDetails}
                      qty={orderDetails?.qty || 1}
                      onClick={(data) => AddItem(item, data)}
                      remove={(data) => removeItem(item, data)}
                      add={(data) => AddItem(item, data)}
                      item={item}
                    />
                  ) : (
                    <MenuItem
                      ordered={!!orderDetails}
                      qty={orderDetails?.qty || 1}
                      onClick={() => AddItem(item)}
                      remove={() => removeItem(item)}
                      add={() => AddItem(item)}
                      item={item}
                    />
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </div>
      {orderPlaced && (
        <div
          style={{
            position: "absolute",
            flex: 1,
            backgroundColor: "#fafafa",
            height: "100%",
            width: "100%",
            top: 0,
            zIndex: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Lottie animationData={orderPlace} loop={false} />
        </div>
      )}
      {orders?.length > 0 && (
        <CartView
          loading={notificationLoad}
          payment={details?.payment}
          userDetails={userDeatils}
          placeOrder={async (type, details) => {
            PlaceOrder(type, details);
            // try {
            //   const distance = await getDistanceInMeters(
            //     details?.latitude,
            //     details?.longitude
            //   );
            //   const allowedDistance = parseFloat(details?.distance); // Ensure it's a number

            //   if (isNaN(allowedDistance)) {
            //     alert("Invalid restaurant distance.");
            //     return;
            //   }

            //   if (distance > allowedDistance) {
            //     alert(`Sorry! You are not in restaurant${distance}`);
            //   } else {
            //     // alert(`Wow! You are not  restaurant${distance}`);
            //     PlaceOrder(type);
            //   }
            // } catch (error) {
            //   alert("Failed to get location: " + JSON.stringify(error));
            // }
          }}
          AddItem={(item) => AddIncart(item)}
          removeItem={(item) => removeFromCart(item)}
          deleteItem={(item) => deleteItem(item)}
          orders={orders}
          iconClick={() => {
            // playSound();
            return;
            // getDistanceInMeters(details?.latitude, details?.longitude);
          }}
        />
      )}
      {isOpen && (
        <HistorySheet orderHistory={history} onClose={toggleHistorySheet} />
      )}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",
    position: "relative",
    scrollbarWidth: "none",
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    overflowY: "auto",
    // overflow:'auto'
  },
  header: {
    // backgroundColor: "#009944",
    padding: "10px",
    borderTopRadius: "12px 12px",
    color: "#fff",
    // marginBottom: "10px",
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
  },
  profileImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "12px",
  },
  greeting: {
    fontSize: "14px",
    margin: "0 0 4px",
    color: "#3B3B3B",
  },
  name: {
    fontSize: "20px",
    margin: 0,
    color: "#009944",
  },
  searchBar: {
    width: "95%",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
  },
  filters: {
    display: "flex",
    justifyContent: "space-around",
    overflow: "auto",
    scrollbarWidth: "none",
  },
  filterButton: {
    padding: "8px 16px",
    backgroundColor: "#e7e7e7",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    margin: "0 5px",
  },
  section: {
    paddingBottom: 150,
    // position: "fixed",
    // overflowY: "auto",
  },
  sectionTitle: {
    fontSize: "18px",
    margin: "0 0 16px",
  },
  seeAll: {
    fontSize: "14px",
    color: "#007bff",
    cursor: "pointer",
    float: "right",
  },
  doctorList: {
    display: "flex",
    gap: "16px",
    overflow: "auto",
  },
  doctorCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "12px",
  },
  doctorDetails: {
    textAlign: "left",
  },
  doctorName: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 8px",
  },
  doctorSpecialty: {
    fontSize: "14px",
    color: "#666",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    padding: "4px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  bottomTab: {
    position: "fixed",
    bottom: "0",
    left: "0",
    right: "0",
    backgroundColor: "#2d6a4f",
    padding: "12px",
    display: "flex",
    justifyContent: "center",
  },
  bottomTabIcon: {
    fontSize: "24px",
    color: "#fff",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  popup: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
    // paddingInline:20
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    width: "80%",
  },
  allowButton: {
    width: "35%",
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: AppColors.LIGHT_GREEN_TEXT,
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginInline: "10px",
  },
  leftButton: {
    width: "35%",
    padding: "10px 20px",
    fontSize: "16px",
    color: "#000" /* Changed to black for better contrast */,
    backgroundColor: "white",
    border: "1px solid black" /* Added border */,
    borderRadius: "5px",
    cursor: "pointer",
    marginInline: "10px",
  },
};

export default App;

export const Spinner = () => {
  return <div className="loader"></div>;
};

export const PopUp = (props) => {
  return (
    <div style={styles.popup}>
      <div style={styles.popupContent}>
        <h3>{props?.title}</h3>
        <p>{props?.description}</p>
        <div style={{ flexDirection: "row" }}>
          {props?.leftText && (
            <button onClick={props?.leftPress} style={styles.leftButton}>
              {props?.leftText}
            </button>
          )}
          <button onClick={props?.rightPress} style={styles.allowButton}>
            {props?.loading ? "Processing..." : props?.RightText}
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterView = (props) => {
  const filters = props?.list;
  const active = props?.active;
  return (
    <div className="filter-container">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-button ${
            active === filter ? "active" : "inactive"
          }`}
          onClick={() => props?.onPress(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export const AddButton = (props) => {
  const status = props?.status;
  return status ? (
    <div style={{}} className="quantity-controls">
      <button
        style={{
          // padding: 2,
          paddingInline: 7,
          backgroundColor: "rgba(0, 68, 34, 0.3)",
          color: "black",
          borderWidth: 0.5,
        }}
        onClick={props?.remove}
      >
        -
      </button>
      <span style={{ color: AppColors.DARK_GREEN_TEXT, marginInline: 7 }}>
        {props?.qty}
      </span>
      <button onClick={props?.add}>+</button>
    </div>
  ) : (
    <button
      style={{ marginTop: 5, marginBottom: 5 }}
      onClick={props?.onPress}
      className="add-button"
    >
      Add
    </button>
  );
};

const OfferModal = ({ offers, onClick, orders }) => {
  const activeOffers = offers.filter(isOfferActive);
  console.log("active---", activeOffers);
  if (activeOffers.length === 0) return null;

  function isOfferActive(offer) {
    const now = moment();
    const today = now.format("dddd").toLowerCase(); // e.g., 'monday'
    console.log("today---", today);
    const isDayValid =
      offer.days_active.includes("everyday") ||
      offer.days_active.includes(today);

    const nowTime = now.format("HH:mm");
    const isTimeValid =
      nowTime >= offer.start_time && nowTime <= offer.end_time;

    const isDateValid =
      !offer.valid_from || !offer.valid_to
        ? true
        : now.isBetween(
            moment(offer.valid_from),
            moment(offer.valid_to),
            "day",
            "[]"
          );

    return offer.is_active && isDayValid && isTimeValid && isDateValid;
  }

  return (
    <div className="today-offer-section">
      <h2 className="offer-heading">Today's Offer</h2>
      <div className="offer-scroll-container">
        {activeOffers.map((offer) => {
          const ordered = orders.find(
            (orderItem) => orderItem?.id === offer?.id
          );
          return (
            <div
              key={offer.id}
              className="offer-card-image"
              style={{ backgroundImage: `url(${offer.src})` }}
            >
              <div className="offer-card-overlay">
                <h3>{offer.name}</h3>
                <p>{offer.description}</p>
                {offer?.price && offer?.price?.length > 0 && (
                  <button
                    className="offer-add-button"
                    onClick={() => onClick(offer, offer?.price[0])}
                  >
                    {!ordered
                      ? `Add ₹ ${offer?.price[0]?.price}`
                      : `${ordered?.qty} is Added`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
