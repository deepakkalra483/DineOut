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
      <div
        style={itemStyle}
      >
        {/* <img
          style={imageStyle}
          src={item.src || require("../assets/images/backgrounds/momos.png")}
          alt={item.name}
        /> */}
        <p style={{ fontSize: 8, alignSelf: "flex-start" }}>⏺️</p>
        <div style={detailsStyle}>
          <p style={nameStyle}>{item?.qty +'× '+(item?.size ? item?.size + " " : "")+' '+item.name}</p>
          <p style={descriptionStyle}>{item.description}</p>
          <div style={{ flexDirection: "row", display: "flex", marginTop: 5 }}>
            <p style={priceStyle}>₹ {item.price}</p>
            {/* {<p style={sizeStyle}>{item?.size}</p>} */}
          </div>
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
  backgroundColor: "white",
  // padding: "5px",
  position: "relative",
  zIndex: 1,
};

const itemStyle ={
  display: "flex",
  alignItems: "center",
  padding: "8px",
  backgroundColor: "white",
  justifyContent: "space-between",
  borderBottom: "1px solid #e0e0e0",
};

const imageStyle = {
  height: "100%",
  width: "10%",
  objectFit: "cover",
  borderRadius: "10px",
  backgroundColor: "red",
};

const detailsStyle = {
  flex: 0.9,
  marginLeft: "0px",
  height: "100%",
};

const nameStyle = {
  color: "black",
  fontSize: "12px",
  margin: "0",
  fontWeight: "700",
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

const sizeStyle = {
  color: AppColors.LIGHT_GREEN_TEXT,
  fontSize: "12px",
  margin: 0,
  marginLeft: 10,
  // backgroundColor:AppColors.LIGHT_GREEN_TEXT,
  // borderRadius:5,
  // paddingInline:7,
  // paddingTop:2,
  // paddingBottom:2
  fontWeight:'bold',
  fontFamily: "Arial, sans-serif"
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
