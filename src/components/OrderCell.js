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
        <img style={imageStyle} src={item.src} alt={item.name} />
        <div style={detailsStyle}>
          <p style={nameStyle}>{item.name}</p>
          <p style={nameStyle}>{item.description}</p>
          <p style={priceStyle}>RS {item.price}</p>
        </div>
        <div style={quantityControlsStyle}>
          <button style={decreaseButtonStyle}>-</button>
          <button style={buttonStyle}>{item.qty}</button>
          <button style={increaseButtonStyle}>+</button>
        </div>
        <button style={deleteButtonStyle}>
          <img style={deleteIconStyle} src={require('../assets/images/icons/delete_icon.png')} alt="delete" />
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  backgroundColor: AppColors.LIGHT_BACKGROUND,
  padding: "10px",
  position: "relative",
  zIndex: 1,
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  padding: "15px",
  backgroundColor: "white",
  height: "60px",
  justifyContent: "space-between",
  borderRadius: "15px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const imageStyle = {
  height: "100%",
  width: "13%",
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
  fontSize: "14px",
  margin: "0",
};

const priceStyle = {
    color: "black",
    fontSize: "14px",
    margin: "0",
    fontWeight:"600"
};

const quantityControlsStyle = {
  display: "flex",
  alignItems: "center",
};

const buttonStyle = {
  fontSize: "18px",
  backgroundColor: "#fafafa",
  padding: "8px 12px",
  border: "none",
  cursor: "pointer",
};

const decreaseButtonStyle = {
  ...buttonStyle,
  backgroundColor: AppColors.DARK_GREEN_TEXT,
};

const increaseButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#28a745",
  color: "white",
};

const deleteButtonStyle = {
  backgroundColor: "#f0f0f0",
  height: "65px",
  width: "35px",
  marginLeft: "15px",
  borderTopLeftRadius: "30px",
  borderBottomLeftRadius: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  marginRight:'-14px',
  border: 'none',
};

const deleteIconStyle = {
  height: "28px",
  width: "28px",
  objectFit: "contain",
};

export default OrderCell;
