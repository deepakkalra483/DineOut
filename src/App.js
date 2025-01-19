import "./App.css";
import OrderCell from "./components/OrderCell";
import { AppColors } from "./utils/AppColors";
import { useEffect, useRef, useState } from "react";
import "./utils/AppCss.css";
import { MenuItems, specialOffers } from "./utils/StaticArray";
import { addData, addOrder, clearDatabase, getAllData } from "./utils/IndexDB";
import NewDesign from "./components/NewDesign";
import { getCartDetails } from "./utils/LocalStorageHelper";
import { ref, get } from "firebase/database";
import { database } from "./utils/Firebase";
import { getMenu } from "./networking/CallApi";
import Lottie from "lottie-react";
import orderPlace from "./assets/animations/order_Placed.json";
import food_prepare from "./assets/animations/food_prepare.json";

let MenuList = [];
const messages = ["Spicy", "Medium", "Low"];
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActive] = useState("All");
  const [orderList, setOrderList] = useState([]);
  const [allItems, setItems] = useState([]);
  const [backupList, setBackup] = useState([]);
  const [filters, setFilters] = useState(["All"]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [foodType, setType] = useState(null);

  const toggleMenu = () => {
    setOpenHistory(!openHistory);
  };

  const AddMenu = (name, data) => {
    const stringifyData = JSON.stringify(data);
    localStorage.setItem(name, stringifyData);
    UpdateFilters(data);
    setItems(data);
    setBackup(data);
    // MenuList = data;
    setLoading(false);
  };

  const getMenuData = (name) => {
    console.log("call");
    AddMenu(name, MenuItems);
    return;
    getMenu(
      { resturant: name },
      (response) => {
        // console.log("res--", JSON.stringify(response));
        AddMenu(name, response);
      },
      (error) => {
        console.log("error---", error);
      }
    );
  };

  const GetMenu = (name, menu) => {
    const data = localStorage.getItem(name);
    if (data) {
      console.log("alredyPresnet");
      const ParsedData = JSON.parse(data);
      // MenuList = ParsedData;
      setBackup(ParsedData);
      setItems(ParsedData);
      UpdateFilters(ParsedData);
      setLoading(false);
    } else {
      localStorage.clear();
      console.log("notPresent");
      getMenuData(name);
      // fetchRestaurantMenu(name);
    }
  };

  const UpdateFilters = (list) => {
    let categories = ["All"];
    list.map((item) => {
      categories.push(item?.category);
    });
    setFilters(categories);
  };

  useEffect(() => {
    setLoading(true);
    const searchParams = new URLSearchParams(window.location.search);
    const resturant = searchParams.get("resturant");
    const table = searchParams.get("table");
    setDetails({ resturant: resturant, table: table });
    const ordersData = getCartDetails(resturant + table);
    const orderHistory = getCartDetails(resturant + table + "history");
    if (ordersData) {
      setOrders(ordersData);
    }
    if (orderHistory) {
      setHistory(orderHistory);
    }
    console.log("localLenght-", localStorage.length);
    GetMenu(resturant, MenuItems);
  }, [loading]);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const toggleBottomSheet = () => {
    setIsOpen((prevState) => !prevState); // Toggle the state
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
    const lowerQuery = query.toLowerCase(); // Ensure the query is lowercase for comparison
    const filterMenu = backupList
      .map((menu) => {
        // Filter items within the category where the item name matches the query
        const filteredItems = menu.items.filter((item) =>
          item.name?.toLowerCase().includes(lowerQuery)
        );

        // Only return the category if it has matching items or the category name matches the query
        if (
          filteredItems.length > 0 ||
          menu.category?.toLowerCase().includes(lowerQuery)
        ) {
          return { ...menu, items: filteredItems }; // Return category with filtered items
        }

        return null; // Return null if no matching items or category name
      })
      .filter((menu) => menu !== null); // Remove any null categories

    if (filterMenu.length > 0) {
      setItems(filterMenu); // Update state with the filtered menu
    } else {
      setItems([]); // Set empty array if no match
    }
  };

  const saveToLocalStorage = (orders) => {
    localStorage.setItem(
      details?.resturant + details?.table,
      JSON.stringify(orders)
    );
  };

  const saveHistoryLocal = () => {
    const allHistory = [...history, ...orders];
    localStorage.setItem(
      details?.resturant + details?.table + "history",
      JSON.stringify(allHistory)
    );
  };

  const PlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
    }, 2500);
    setHistory([...orders, ...history]);
    saveHistoryLocal();
    localStorage.removeItem(details?.resturant + details?.table);
    setOrders([]);
  };

  const AddItem = (item) => {
    setOrders((prevOrders) => {
      const existingItem = prevOrders.find((order) => order.id === item.id);
      const updatedOrders = existingItem
        ? prevOrders.map((order) =>
            order.id === item.id ? { ...order, qty: order.qty + 1 } : order
          )
        : [...prevOrders, { ...item, qty: 1 }];

      saveToLocalStorage(updatedOrders); // Save to localStorage
      return updatedOrders;
    });
  };

  const removeItem = (item) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders
        .map((order) =>
          order.id === item.id ? { ...order, qty: order.qty - 1 } : order
        )
        .filter((order) => order.qty > 0); // Remove items with qty <= 0

      saveToLocalStorage(updatedOrders); // Save to localStorage
      return updatedOrders;
    });
  };

  const deleteItem = (item) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.filter((order) => order.id !== item?.id);
      saveToLocalStorage(updatedOrders); // Save to localStorage
      return updatedOrders;
    });
  };

  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const [placeholderText, setPlaceholderText] = useState("Search Pizza");

  useEffect(() => {
    console.log("details", details?.resturant + details?.table);
    const placeholderCycle = [
      `Welcome to ${details?.resturant}`,
      "Search Pizza corn",
      "Search Pasta",
    ];
    let index = 0;

    const interval = setInterval(() => {
      setPlaceholderText(placeholderCycle[index]);
      index = (index + 1) % placeholderCycle.length;
    }, 1500);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [details]);
  return (
    <div style={styles.page}>
      {/* <div className="app"> */}
      {/* Fixed Header */}
      <div className="header">
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder={searchText ? "" : placeholderText}
            onChange={(e) => searchItems(e?.target?.value)}
          />
          <img
            style={{ height: 20, width: 20 }}
            src={require("./assets/images/icons/search.png")}
            className="fas fa-search search-icon"
          ></img>
          {/* Search icon inside the input */}
        </div>
        <button
          style={{
            backgroundColor: history?.length > 0 ? "#009944" : "#D3D3D3",
          }}
          className="top-filter-button"
          onClick={toggleMenu}
        >
          <img
            src={require("./assets/images/icons/history.png")}
            alt="Icon"
            className="button-icon"
          />
        </button>
      </div>
      {loading ? (
        <div style={{ width: "40%" }} className="shimmer-wrapper">
          <div className="shimmer-item"></div>
        </div>
      ) : (
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
      )}

      {/* Favourite Doctors Section */}
      {loading ? (
        <ShimmerEffect />
      ) : (
        <section style={styles.section}>
          {allItems?.length > 0 &&
            allItems.map((mainItem) => (
              <div>
                <BoldText text={mainItem?.category} />
                <div
                  style={{
                    display: "flex",
                    paddingLeft: "2%",
                    marginTop: 5,
                    overflow: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  {mainItem?.items.map((item) => {
                    const orderDetails = orders.find(
                      (orderItem) => orderItem?.id === item?.id
                    );

                    return (
                      // !item?.description ? (
                      //   <OfferPoster
                      //     ordered={!!orderDetails}
                      //     qty={orderDetails?.qty || 1}
                      //     onClick={() => AddItem(item)}
                      //     remove={() => removeItem(item)}
                      //     add={() => AddItem(item)}
                      //     item={item}
                      //   />
                      // ) : (
                      <MenuItem
                        ordered={!!orderDetails}
                        qty={orderDetails?.qty || 1}
                        src={
                          mainItem?.category === "Burgers"
                            ? require("./assets/images/backgrounds/burger_photo.png")
                            : require("./assets/images/backgrounds/pizza_combo.jpg")
                        }
                        onClick={() => AddItem(item)}
                        remove={() => removeItem(item)}
                        add={() => AddItem(item)}
                        item={item}
                      />
                    );
                    // );
                  })}
                </div>
              </div>
            ))}
          {orderPlaced && (
            <div
              style={{
                position: "absolute",
                flex: 1,
                backgroundColor: "#fff",
                height: "100%",
                width: "100%",
                top: 0,
                zIndex: 100,
              }}
            >
              <Lottie animationData={orderPlace} loop={false} />
              <h5
                style={{
                  color: "#004422",
                  fontSize: 16,
                  textAlign: "center",
                  // position: "absolute",
                  marginTop: -50,
                }}
              >
                Congratulations! your order has been placed
              </h5>
            </div>
          )}
        </section>
      )}

      {/* Bottom Tab */}

      {(orders?.length > 0 || history?.length > 0) && (
        <div className="cart-wrapper">
          {orders?.length > 0 && (
            <div
              style={{ margin: "10px 10px", width: "95%" }}
              className="cart-box"
            >
              <div className="cart-info">
                <img
                  src={require("./assets/images/icons/order_icon.png")}
                  alt="Pizza Choice"
                  className="cart-image"
                />
                <div className="cart-details">
                  <h4>
                    {`${orders.reduce((total, item) => total + item.qty, 0)}
                    items`}
                  </h4>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <p className="view-menu">Add instructions: </p>
                    {messages.map((item) => (
                      <button
                        style={{
                          height: 20,
                          fontSize: 10,
                          margin: "0px 2px",
                          borderStyle: "none",
                          borderRadius: 15,
                          backgroundColor:
                            foodType == item
                              ? AppColors.LIGHT_GREEN_TEXT
                              : "#e7e7e7",
                          padding: "0px 5px",
                          color: foodType == item ? "white" : "gray",
                        }}
                        onClick={() => setType(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  {/* <p className="view-menu">
                  {orders?.length != 0
                    ? "You can add More"
                    : "We will notify you when order gets ready"}
                </p> */}
                </div>
              </div>
              <div className="cart-actions">
                <button className="view-cart-btn" onClick={PlaceOrder}>
                  {history?.length != 0 ? `Place new order` : `Place order`}
                </button>
                <p
                  style={{ color: AppColors.LIGHT_GREEN_TEXT }}
                  className="item-count"
                  onClick={togglePopup}
                >
                  {history?.length != 0 ? `View new order` : `View order`}
                </p>
              </div>
            </div>
          )}
          {/* {orders?.length != 0 && (
            <button className="place-order-btn" onClick={() => PlaceOrder()}>
              Place Order
            </button>
          )} */}
          {history?.length > 0 && (
            <div
              style={{ boxShadow: "none", borderRadius: 0 }}
              className="cart-box"
            >
              <div className="cart-info">
                <Lottie
                  style={{ height: 65, width: 65 }}
                  animationData={food_prepare}
                  loop={true}
                />
                <div className="cart-details">
                  <h4>{`Order Preparing..`}</h4>
                  <p className="view-menu">
                    {"We will notify you when order gets ready"}
                  </p>
                </div>
              </div>
              <div className="cart-actions">
                <button className="view-cart-btn" onClick={toggleMenu}>
                  {`Order Details`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* place order tab ------------- */}
      {/* <div className="bottom-box">
        <div className="bottom-box-content">
          <img
            src="https://via.placeholder.com/40"
            alt="Icon"
            className="bottom-box-icon"
          />
          <div>
            <h4 className="bottom-box-title">Zomato Money</h4>
            <p className="bottom-box-subtitle">
              Single tap payments. Zero failures
            </p>
          </div>
        </div>

        <button className="new-button" onClick={toggleBottomSheet}>
          NEW
        </button>
      </div> */}

      {/* cart bottom sheet ----------- */}
      {isOpen && orders?.length > 0 && (
        <div className="popup">
          <div className="popup-header">
            <h3 style={{ color: "#000", fontSize: 14 }}>Your order</h3>
            <button className="close-btn" onClick={togglePopup}>
              ×
            </button>
          </div>
          <div className="popup-content">
            <h3
              style={{ color: "#3B3B3B", fontSize: 12 }}
            >{`Total Items: ${orders.reduce(
              (total, item) => total + item.qty,
              0
            )}`}</h3>
            {orders.map((item) => (
              <OrderCell
                add={() => AddItem(item)}
                remove={() => removeItem(item)}
                onDelete={() => deleteItem(item)}
                item={item}
              />
            ))}
            <button className="place-order-btn" onClick={() => PlaceOrder()}>
              Place Order
            </button>
          </div>
        </div>
      )}

      {openHistory && (
        <div className="popup">
          <div className="popup-header">
            <h3 style={{ color: "#000", fontSize: 14 }}>Order details</h3>
            <button className="close-btn" onClick={toggleMenu}>
              ×
            </button>
          </div>
          <div className="popup-content">
            {history.map((item) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  height: 25,
                }}
              >
                <h3 style={{ color: "#000", fontSize: 12 }}>
                  {item?.qty + " " + item?.name}
                </h3>
                <h2 style={{ color: "#000", fontSize: 12 }}>{item?.price}</h2>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <h3 style={{ color: "#000", fontSize: 14 }}>
                {`Total Items: ${history.reduce(
                  (total, item) => total + item.qty,
                  0
                )} `}
              </h3>
              <h2 style={{ color: "#000", fontSize: 12 }}>{`${history.reduce(
                (total, item) => item.qty * item?.price + total,
                0
              )} `}</h2>
            </div>
          </div>
        </div>
      )}

      {/* HIstory Model -----side drwaer----- */}
      {/* {openHistory && (
        <div className={`side-menu ${isOpen ? "open" : ""}`}>
          <div className="menu-header">
            <h2 style={{ fontSize: 20 }} className="menu-title">
              Order Details
            </h2>
            <button onClick={toggleMenu} className="close-button">
              X
            </button>
          </div>
          {history?.length > 0 ? (
            <ul>
              {history.map((item) => (
                <li>{item?.qty + " " + item?.name}</li>
              ))}
            </ul>
          ) : (
            <div>
              <h3>Opps!</h3>
              <h5>Plaes Order something</h5>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
}

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     height: "100vh", // Full screen height
//   },
//   toolbar: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: "10px",
//     backgroundColor: "#fff",
//     borderBottom: "1px solid #ccc",
//   },
//   icon: {
//     width: "25px",
//     height: "25px",
//   },
//   title: {
//     fontSize: "18px",
//     fontWeight: "bold",
//     display: "flex",
//     alignItems: "center",
//   },
//   titlePart1: {
//     color: AppColors.LIGHT_GREEN_TEXT,
//   },
//   titlePart2: {
//     color: AppColors.DARK_GREEN_TEXT,
//   },
//   blankScreen: {
//     flex: 1, // Takes up the remaining space
//     backgroundColor: AppColors.LIGHT_BACKGROUND,
//     paddingBottom: 100, // Blank screen color
//     scrollbarWidth: "none",
//   },
//   backgroundImage: {
//     position: "absolute",
//     top: 35,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     opacity: 0.3,
//     objectFit: "cover",
//     // zIndex: -1, // Ensures the image covers the entire screen
//   },
// };

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
};

export default App;

const SearchView = (props) => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <img
          style={{ width: "15px", height: "15px" }}
          src={require("./assets/images/icons/search.png")}
          alt="Right Icon"
        />
        {/* <span className="icon search-icon">🔍</span> */}
        <input
          onChange={props?.onChange}
          type="text"
          placeholder={props?.placeholder}
          className="search-input"
        />
        {/* <img
          style={{ width: "15px", height: "20px" }}
          src={require("./assets/images/icons/mic.png")}
          alt="Right Icon"
        /> */}
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

const MenuItem = (props) => {
  const item = props?.item;
  const ordered = props?.ordered;
  return (
    <div className="menu-card">
      <img src={props?.src} alt={item?.name} className="menu-image" />
      <div className="menu-info">
        <h3 className="menu-title">{item?.name}</h3>
        <p className="menu-price">Rs. {item?.price}</p>
        {ordered ? (
          <div className="quantity-controls">
            <button
              style={{
                paddingInline: 6,
                backgroundColor: "rgba(0, 68, 34, 0.3)",
                color: "black",
              }}
              onClick={props?.remove}
            >
              -
            </button>
            <span style={{ color: AppColors.DARK_GREEN_TEXT }}>
              {props?.qty}
            </span>
            <button onClick={props?.add}>+</button>
          </div>
        ) : (
          <button onClick={props?.onClick} className="add-button">
            Add
          </button>
        )}
      </div>
    </div>
  );
};

const OfferPoster = (props) => {
  const item = props?.item;
  const ordered = props?.ordered;
  return (
    <div
      className="offer-poster"
      style={{ backgroundImage: `url(${item?.src})` }}
    >
      <div className="offer-content">
        <h1 className="offer-title">{item?.name}</h1>
        <p className="offer-description">{item?.description}</p>
        {ordered ? (
          <div
            style={{ justifyContent: "center", marginTop: 10 }}
            className="quantity-controls"
          >
            <button
              style={{
                paddingInline: 6,
                backgroundColor: "#fff",
                color: "black",
              }}
              onClick={props?.remove}
            >
              -
            </button>
            <span style={{ color: "white" }}>{props?.qty}</span>
            <button onClick={props?.add}>+</button>
          </div>
        ) : (
          <button
            onClick={props?.onClick}
            className="buy-now-btn"
          >{`Add at ₹${item?.price}`}</button>
        )}
      </div>
    </div>
  );
};

const BoldText = (props) => {
  return (
    <span
      style={{
        // backgroundColor: AppColors.LIGHT_BACKGROUND,
        width: "100%",
        paddingRight: 15,
        display: "inline-block",
        position: "relative",
        zIndex: 1,
        paddingLeft: 15,
        fontWeight: 700,
        // padding: 10,
      }}
    >
      {props?.text}
    </span>
  );
};

const ShimmerEffect = () => {
  return (
    <div>
      <div style={{ width: "40%" }} className="shimmer-wrapper">
        <div className="shimmer-item"></div>
      </div>
      <div style={{ height: 150 }} className="shimmer-wrapper">
        <div className="shimmer-item"></div>
      </div>
      <div style={{ width: "40%" }} className="shimmer-wrapper">
        <div className="shimmer-item"></div>
      </div>
      <div style={{ flexDirection: "row", display: "flex" }}>
        {Array.from({ length: 3 }).map(() => (
          <div
            style={{ width: "30%", height: 150 }}
            className="shimmer-wrapper"
          >
            <div className="shimmer-item"></div>
          </div>
        ))}
      </div>
      <div style={{ width: "40%" }} className="shimmer-wrapper">
        <div className="shimmer-item"></div>
      </div>
    </div>
  );
};
