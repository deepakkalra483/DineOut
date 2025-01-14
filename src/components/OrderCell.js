import { useState } from "react";
import { AppColors } from "../utils/AppColors";

const OrderCell = (props) => {
  const item = props?.item;
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    setQuantity(quantity + 1);
    // onAdd();
  };

  const handleRemove = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      //   onRemove();
    }
  };

  const handleDelete = () => {
    // onDelete();
  };

  return (
    <div style={containerStyle}>
      <div style={itemStyle}>
        <img
          style={imageStyle}
          src={item.src || require("../assets/images/backgrounds/momos.png")}
          alt={item.name}
        />
        <div style={detailsStyle}>
          <p style={nameStyle}>{item.name}</p>
          <p style={descriptionStyle}>{item.description}</p>
          <p style={priceStyle}>RS {item.price}</p>
        </div>
        <div style={quantityControlsStyle}>
          <button onClick={props?.remove} style={decreaseButtonStyle}>
            -
          </button>
          <button style={buttonStyle}>{item.qty}</button>
          <button onClick={props?.add} style={increaseButtonStyle}>
            +
          </button>
        </div>
        <button onClick={props?.onDelete} style={deleteButtonStyle}>
          <img
            style={deleteIconStyle}
            src={require("../assets/images/icons/delete_icon.png")}
            alt="delete"
          />
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  backgroundColor: AppColors.LIGHT_BACKGROUND,
  // padding: "5px",
  position: "relative",
  zIndex: 1,
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px",
  backgroundColor: "white",
  // height: "30px",
  justifyContent: "space-between",
  borderRadius: "15px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  marginBottom: 10,
};

const imageStyle = {
  height: "100%",
  width: "9%",
  objectFit: "cover",
  borderRadius: "10px",
};

const detailsStyle = {
  flex: 1,
  marginLeft: "15px",
  height: "100%",
};

const nameStyle = {
  color: "black",
  fontSize: "12px",
  margin: "0",
  fontWeight: "600",
};

const descriptionStyle = {
  color: AppColors.LIGHT_GRAY_TEXT,
  fontSize: "10px",
  margin: "0",
  // fontWeight:"600"
};

const priceStyle = {
  color: "black",
  fontSize: "12px",
  margin: "0",
  // fontWeight:"600"
};

const quantityControlsStyle = {
  display: "flex",
  alignItems: "center",
};

const buttonStyle = {
  fontSize: "18px",
  backgroundColor: "#fafafa",
  padding: "3px 8px",
  border: "none",
  cursor: "pointer", // Border color
  // borderWidth: 2,          // Border width
  borderRadius: 5,
};

const decreaseButtonStyle = {
  ...buttonStyle,
  padding: "3px 10px",
  backgroundColor: "rgba(0, 68, 34, 0.3)",
};

const increaseButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#28a745",
  color: "white",
};

const deleteButtonStyle = {
  backgroundColor: "#f0f0f0",
  height: "40px",
  width: "25px",
  marginLeft: "15px",
  borderTopLeftRadius: "30px",
  borderBottomLeftRadius: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  marginRight: "-10px",
  border: "none",
};

const deleteIconStyle = {
  height: "18px",
  width: "18px",
  objectFit: "contain",
};

export default OrderCell;
