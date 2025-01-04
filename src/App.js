import { Sheet } from "react-modal-sheet";
import "./App.css";
import OrderCell from "./components/OrderCell";
import { AppColors } from "./utils/AppColors";
import { useRef, useState } from "react";
import "./utils/AppCss.css";

const burgers = [
  {
    name: "Veg Burer",
    price: 80,
    description: "With extra Cheese",
    src: require("./assets/images/backgrounds/burger_photo.png"),
    qty: 1,
  },
  {
    name: "Cheeseburger",
    price: 110,
    description: "With extra Cheese",
    src: require("./assets/images/backgrounds/burger_photo.png"),
    qty: 1,
  }, {
    name: "Mushroom Burger",
    price: 130,
    description: "With extra Cheese",
    src: require("./assets/images/backgrounds/burger_photo.png"),
    qty: 1,
  }, {
    name: "Burer",
    price: 80,
    description: "With extra Cheese",
    src: require("./assets/images/backgrounds/burger_photo.png"),
    qty: 1,
  },
];

const pizzas = [
  {
    name: "Sweet Corn Pizza",
    price: 159,
    description: "Full vegloaded and spicy",
    src: require("./assets/images/backgrounds/pizza_photo.png"),
    qty: 1,
  },
  {
    name: "Sweet Corn Pizza",
    price: 159,
    description: "Full vegloaded and spicy",
    src: require("./assets/images/backgrounds/pizza_new.png"),
    qty: 1,
  },
  {
    name: "Sweet Corn Pizza",
    price: 159,
    description: "Full vegloaded and spicy",
    src: require("./assets/images/backgrounds/pizza_photo.png"),
    qty: 1,
  },
  {
    name: "Sweet Corn Pizza",
    price: 159,
    description: "Full vegloaded and spicy",
    src: require("./assets/images/backgrounds/pizza_photo.png"),
    qty: 1,
  },
];

const filters = [
  "All",
  "Chinese",
  "South Indian",
  "Pasta",
  "Drinks",
  "Shakes",
  "Cakes",
  "Breakfast",
];
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActive] = useState("All");

  const toggleBottomSheet = () => {
    setIsOpen((prevState) => !prevState); // Toggle the state
  };

  return (
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <img
          src={require("./assets/images/icons/menu.png")}
          alt="Left Icon"
          style={styles.icon}
          onClick={toggleBottomSheet}
        />
        <div style={styles.title}>
          <span style={styles.titlePart1}>Big</span>
          <span style={styles.titlePart2}>Bistro</span>
        </div>
        <img
          src={require("./assets/images/icons/cart.png")}
          alt="Right Icon"
          style={styles.icon}
        />
      </div>
      {/* <img
          src={require("./assets/images/backgrounds/art_bg.png")}
          alt="Background"
          style={styles.backgroundImage}
        /> */}
      <div style={styles.blankScreen}>
        <SearchView />
        <FilterView
          list={filters}
          active={activeFilter}
          onPress={(filter) => setActive(filter)}
        />
        <span
          style={{
            backgroundColor: AppColors.LIGHT_BACKGROUND,
            // width: "25%",
            paddingRight: 15,
            display: "inline-block",
            position: "relative",
            zIndex: 1,
            paddingLeft: 15,
            fontWeight: 700,
            // padding: 10,
          }}
        >
          Burgers
        </span>
        <div
          style={{
            display: "flex",
            paddingLeft: "2%",
            marginTop: 5,
            overflow:'auto',
            scrollbarWidth:'none'
          }}
        >
          {burgers.map((item) => (
            <MenuItem item={item} />
          ))}
        </div>
        <span
          style={{
            backgroundColor: AppColors.LIGHT_BACKGROUND,
            // width: "25%",
            paddingRight: 15,
            display: "inline-block",
            position: "relative",
            zIndex: 1,
            paddingLeft: 15,
            fontWeight: 700,
            // padding: 10,
          }}
        >
          Pizza
        </span>
        <div
          style={{
            display: "flex",
            paddingLeft: "2%",
            marginTop: 5,
            overflow:'auto',
            scrollbarWidth:'none'
          }}
        >
          {pizzas.map((item) => (
            <MenuItem item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh", // Full screen height
  },
  toolbar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ccc",
  },
  icon: {
    width: "40px",
    height: "40px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  },
  titlePart1: {
    color: AppColors.LIGHT_GREEN_TEXT,
  },
  titlePart2: {
    color: AppColors.DARK_GREEN_TEXT,
  },
  blankScreen: {
    flex: 1, // Takes up the remaining space
    backgroundColor: AppColors.LIGHT_BACKGROUND, // Blank screen color
  },
  backgroundImage: {
    position: "absolute",
    top: 60,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3,
    objectFit: "cover",
    // zIndex: -1, // Ensures the image covers the entire screen
  },
};

export default App;

const SearchView = () => {
  return (
    <div className="search-container">
      <div className="search-bar">
        <img
          style={{ width: "15px", height: "15px" }}
          src={require("./assets/images/icons/search.png")}
          alt="Right Icon"
        />
        {/* <span className="icon search-icon">🔍</span> */}
        <input type="text" placeholder="Search..." className="search-input" />
        <img
          style={{ width: "15px", height: "20px" }}
          src={require("./assets/images/icons/mic.png")}
          alt="Right Icon"
        />
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
            active == filter ? "active" : "inactive"
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
  return (
    <div className="menu-card">
      <img src={item?.src} alt={item?.name} className="menu-image" />
      <div className="menu-info">
        <h3 className="menu-title">{item?.name}</h3>
        <p className="menu-price">Rs. {item?.price}</p>
        <button className="add-button">Add</button>
      </div>
    </div>
  );
};
