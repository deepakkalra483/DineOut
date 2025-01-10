import { Sheet } from "react-modal-sheet";
import "./App.css";
import OrderCell from "./components/OrderCell";
import { AppColors } from "./utils/AppColors";
import { useEffect, useRef, useState } from "react";
import "./utils/AppCss.css";
import { MenuItems, specialOffers } from "./utils/StaticArray";
import { addData, addOrder, clearDatabase, getAllData } from "./utils/IndexDB";
import NewDesign from "./components/NewDesign";
import { AddMore, AddToCart, getCartDetails } from "./utils/LocalStorageHelper";

let MenuList = [];
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActive] = useState("All");
  const [orderList, setOrderList] = useState([]);
  const [allItems, setItems] = useState([]);
  const [filters, setFilters] = useState(["All"]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);

  const AddMenu = (name, data) => {
    const stringifyData = JSON.stringify(data);
    localStorage.setItem(name, stringifyData);
    UpdateFilters(data);
    setItems(data);
    MenuList = data;
    setLoading(false);
  };

  const GetMenu = (name, menu) => {
    const data = localStorage.getItem(name);
    if (data) {
      console.log("alredyPresnet");
      const ParsedData = JSON.parse(data);
      MenuList = ParsedData;
      setItems(ParsedData);
      UpdateFilters(ParsedData);
      setLoading(false);
    } else {
      localStorage.clear();
      console.log("notPresent");
      AddMenu(name, menu);
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
    if (ordersData) {
      setOrders(ordersData);
    }
    console.log("localLenght-", localStorage.length);
    // return
    GetMenu(resturant, MenuItems);
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const toggleBottomSheet = () => {
    setIsOpen((prevState) => !prevState); // Toggle the state
  };

  const filterItems = (category) => {
    console.log("allItems--", JSON.stringify(allItems));
    const filterMenu = MenuList.filter((item) => item?.category === category);
    if (filterMenu?.length > 0) {
      setItems(filterMenu);
    } else {
      setItems(MenuList);
    }
  };

  const searchItems = (query) => {
    const lowerQuery = query.toLowerCase(); // Ensure the query is lowercase for comparison
    const filterMenu = MenuList.map((menu) => {
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
    }).filter((menu) => menu !== null); // Remove any null categories

    if (filterMenu.length > 0) {
      setItems(filterMenu); // Update state with the filtered menu
    } else {
      setItems([]); // Set empty array if no match
    }
  };

  const AddItem = (item) => {
    setOrders((prevOrders) => {
      const index = prevOrders.findIndex(
        (prevItem) => prevItem?.id === item?.id
      );
      if (index === -1) {
        // If the item is not found, add it with qty: 1
        const newItem = { qty: 1, ...item };
        AddToCart(details?.resturant + details?.table, newItem);
        return [...prevOrders, newItem];
      } else {
        const newItem = item;
        const updatedOrders = prevOrders.map((item) => {
          if (item.id === newItem.id) {
            console.log("found", item);
            return { ...item, qty: item.qty + 1 };
          }
          return item;
        });
        // AddToCart(details?.resturant + details?.table, updatedOrders[index]);
        return updatedOrders;
      }
    });
  };

  const removeItem = (newItem) => {
    setOrders((prevOrder) => {
      const updatedOrders = prevOrder.map((item) => {
        if (item.id === newItem.id) {
          console.log("found", item);
          if (item?.qty > 1) {
            return { ...item, qty: item.qty - 1 };
          } else {
            return null;
          }
        }
        return item;
      });
      // AddToCart(details?.resturant + details?.table, updatedOrders[index]);
      return updatedOrders;
    });
  };

  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // return (
  //   <div style={styles.container}>
  //     {/* Toolbar */}
  //     <div style={styles.toolbar}>
  //       <img
  //         src={require("./assets/images/icons/bill.png")}
  //         alt="Left Icon"
  //         style={styles.icon}
  //         onClick={toggleBottomSheet}
  //       />
  //       <div style={styles.title}>
  //         <span style={styles.titlePart1}>Big</span>
  //         <span style={styles.titlePart2}>Bistro</span>
  //       </div>
  //       <img
  //         src={require("./assets/images/icons/waiter.png")}
  //         alt="Right Icon"
  //         style={styles.icon}
  //         onClick={storeMenu}
  //       />
  //     </div>
  //     <div style={styles.blankScreen}>
  //       <SearchView onChange={(e) => searchItems(e?.target?.value)} />
  //       <FilterView
  //         list={filters}
  //         active={activeFilter}
  //         onPress={(filter) => {
  //           filterItems(filter);
  //           setActive(filter);
  //         }}
  //       />
  //       {allItems?.length > 0 &&
  //         allItems.map((mainItem) => (
  //           <div>
  //             <BoldText text={mainItem?.category} />
  //             <div
  //               style={{
  //                 display: "flex",
  //                 paddingLeft: "2%",
  //                 marginTop: 5,
  //                 overflow: "auto",
  //                 scrollbarWidth: "none",
  //               }}
  //             >
  //               {mainItem?.items.map((item) =>
  //                 item?.description ? (
  //                   <OfferPoster item={item} />
  //                 ) : (
  //                   <MenuItem
  //                     ordered={orders.some(
  //                       (orderItem) => orderItem?.id === item?.id
  //                     )}
  //                     src={
  //                       mainItem?.category === "Burgers"
  //                         ? require("./assets/images/backgrounds/burger_photo.png")
  //                         : require("./assets/images/backgrounds/pizza_combo.jpg")
  //                     }
  //                     onClick={() => AddItem(item)}
  //                     add={() => console.log("+")}
  //                     item={item}
  //                   />
  //                 )
  //               )}
  //             </div>
  //           </div>
  //         ))}
  //       {/* cart box --------- */}(
  //       {orders?.length > 0 && (
  //         <div className="cart-wrapper">
  //           <div className="cart-box">
  //             <div className="cart-info">
  //               <img
  //                 src={require("./assets/images/icons/order_icon.png")}
  //                 alt="Pizza Choice"
  //                 className="cart-image"
  //               />
  //               <div className="cart-details">
  //                 <h4>{`${orders?.length} Items`}</h4>
  //                 <p className="view-menu">You can add More</p>
  //               </div>
  //             </div>
  //             <div className="cart-actions">
  //               <button className="view-cart-btn" onClick={togglePopup}>
  //                 View Order
  //               </button>
  //               {/* <p className="item-count">2 items</p> */}
  //             </div>
  //           </div>
  //           <button className="place-order-btn">Place Order</button>
  //         </div>
  //       )}
  //       ){/* Bottom Popup */}
  //       {isOpen && (
  //         <div className="popup">
  //           <div className="popup-header">
  //             <h2
  //               style={{
  //                 fontSize: 16,
  //                 marginTop: 5,
  //                 marginBottom: 5,
  //                 color: AppColors.DARK_GREEN_TEXT,
  //               }}
  //             >
  //               Your Order
  //             </h2>
  //             <button className="close-btn" onClick={togglePopup}>
  //               &times;
  //             </button>
  //           </div>
  //           <div className="popup-content">
  //             <img
  //               src={require("./assets/images/backgrounds/art_bg.png")}
  //               alt="Background"
  //               style={styles.backgroundImage}
  //             />
  //             <BoldText text={"Total Items: 2"} />
  //             {orders.map((item) => (
  //               <OrderCell item={item} />
  //             ))}
  //             <button
  //               style={{
  //                 width: "100%",
  //                 marginTop: 10,
  //                 // marginBottom: 5,
  //               }}
  //               className="view-cart-btn"
  //               onClick={togglePopup}
  //             >
  //               Place Order
  //             </button>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  // const [searchText, setSearchText] = useState("");
  const [placeholderText, setPlaceholderText] = useState("Search Pizza");

  useEffect(() => {
    console.log("details", details?.resturant + details?.table);
    const placeholderCycle = [
      `Welcome to ${details?.resturant}`,
      "Search Pizza",
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
        <button className="top-filter-button">
          <img
            src={require("./assets/images/icons/waiter_outline.png")}
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

                    return item?.description ? (
                      <OfferPoster item={item} />
                    ) : (
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
                  })}
                </div>
              </div>
            ))}
        </section>
      )}

      {/* Top Doctor Section */}
      {/* <section style={styles.section}>
        <h4 style={styles.sectionTitle}>
          Top Doctor <span style={styles.seeAll}>See all</span>
        </h4>
        <div style={styles.doctorCard}>
          <img
            src={doctors[2].image}
            alt={doctors[2].name}
            style={styles.image}
          />
          <div style={styles.doctorDetails}>
            <h5 style={styles.doctorName}>{doctors[2].name}</h5>
            <p style={styles.doctorSpecialty}>{doctors[2].specialty}</p>
          </div>
        </div>
      </section> */}

      {/* Bottom Tab */}

      {orders?.length > 0 && (
        <div className="cart-wrapper">
          <div className="cart-box">
            <div className="cart-info">
              <img
                src={require("./assets/images/icons/order_icon.png")}
                alt="Pizza Choice"
                className="cart-image"
              />
              <div className="cart-details">
                <h4>{`${orders?.length} Items`}</h4>
                <p className="view-menu">You can add More</p>
              </div>
            </div>
            <div className="cart-actions">
              <button className="view-cart-btn" onClick={togglePopup}>
                View Order
              </button>
              {/* <p className="item-count">2 items</p> */}
            </div>
          </div>
          <button className="place-order-btn">Place Order</button>
        </div>
      )}

      {isOpen && (
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
            >{`Total Items: ${orders?.length}`}</h3>
            {orders.map((item) => (
              <OrderCell item={item} />
            ))}
            <button className="place-order-btn">Place Order</button>
          </div>
        </div>
      )}
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
    padding: "10px 0",
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
  return (
    <div
      className="offer-poster"
      style={{ backgroundImage: `url(${item?.src})` }}
    >
      <div className="offer-content">
        <h1 className="offer-title">{item?.name}</h1>
        <p className="offer-description">{item?.description}</p>
        <button className="buy-now-btn">{`Add at ₹${item?.price}`}</button>
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
