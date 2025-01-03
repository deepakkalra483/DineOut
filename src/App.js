import "./App.css";
import OrderCell from "./components/OrderCell";
import { AppColors } from "./utils/AppColors";
import { useState } from "react";
import { Sheet } from "react-modal-sheet";

const orders = [
  {
    name: "Burer",
    price: 80,
    description: "With extra Cheese",
    src: require("./assets/images/backgrounds/burger_photo.png"),
    qty:1
  }, {
    name: "Sweet Corn Pizza",
    price: 159,
    description: "Full vegloaded and spicy",
    src: require("./assets/images/backgrounds/pizza_photo.png"),
    qty:1
  },
];
function App() {
  const [isOpen, setOpen] = useState(false);
  return (
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <img
          src={require("./assets/images/icons/menu.png")}
          alt="Left Icon"
          style={styles.icon}
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
      <div style={styles.blankScreen}>
        <span
          style={{
            backgroundColor: AppColors.LIGHT_BACKGROUND,
            // width: "25%",
            paddingRight:15,
            display: "inline-block",
            position: "relative",
            zIndex: 1,
            padding: 10,
          }}
        >
          Order Details
        </span>
        <img
          src={require("./assets/images/backgrounds/art_bg.png")}
          alt="Background"
          style={styles.backgroundImage}
        />
        {
          orders.map((item)=> (
            <OrderCell item={item} />
          ))
        }
       
      </div>
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        snapPoints={[0.75]} // Open at 75% height
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content style={{ backgroundColor: "red" }}>
            <ul style={{}}>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
              <li>Item 4</li>
              <li>Item 5</li>
            </ul>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop style={{ backgroundColor: "transparent" }} />
      </Sheet>
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
    objectFit: "cover", // Ensures the image covers the entire screen
  },
};

export default App;
