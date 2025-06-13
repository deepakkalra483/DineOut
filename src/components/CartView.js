// CartItem.js
import React, { useState } from "react";
import "../cssFiles/CartView.css";
import { AppColors } from "../utils/AppColors";
import OrderCell from "./OrderCell";
import { PopUp } from "../App";
import { setUserDetails } from "../networking/LocalDB";

const messages = ["Spicy", "Medium", "Low"];
const CartView = ({
  orders,
  placeOrder,
  AddItem,
  removeItem,
  deleteItem,
  history,
  iconClick,
  loading,
  payment,
  userDetails,
}) => {
  const [open, setOpen] = useState(null);
  const [foodType, setType] = useState(null);
  const [details, setDetails] = useState(userDetails);

  return (
    <div className="cart-wrapper">
      {open == "popup" && (
        <PopUp
          loading={loading}
          title={loading ? "Please wait" : "Confirm & Place Order"}
          description={
            loading
              ? `Waiting for reception to accept your order...`
              : `Are you sure you want to place this order?`
          }
          leftPress={() => setOpen("sheet")}
          rightPress={!loading ? () => placeOrder(foodType,details) : null}
          // onPress={StoreToken}
          leftText={"No"}
          RightText={"Yes"}
        />
      )}
      {open == "detail" && (
        <PopupForm
          isOpen={open == "detail"}
          onClose={() => {
            setOpen(null);
          }}
          onSave={(data) => {
            setDetails(data);
            setUserDetails(data);
            setOpen("popup");
          }}
        />
      )}
      <div style={{ margin: "10px 5px", width: "95%" }} className="cart-box">
        <div style={{ marginLeft: "10px" }} className="cart-info">
          <img
            src={require("../assets/images/icons/order_icon.png")}
            alt="Pizza Choice"
            className="cart-image"
            onClick={iconClick}
          />
          <div className="cart-details">
            <h4>
              {`${orders.reduce((total, item) => total + item.qty, 0)}
                      items`}
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: 10,
                marginTop: 5,
              }}
            >
              {/* <p className="view-menu">Add instructions: </p> */}
              {messages.map((item) => (
                <button
                  style={{
                    height: 20,
                    fontSize: 10,
                    margin: "0px 3px",
                    borderStyle: "none",
                    borderRadius: 15,
                    backgroundColor:
                      foodType == item ? AppColors.LIGHT_GREEN_TEXT : "#e7e7e7",
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
          <button className="view-cart-btn" onClick={() => setOpen("sheet")}>
            {`Continue`}
          </button>
          {/* <p
              style={{ color: AppColors.LIGHT_GREEN_TEXT }}
              className="item-count"
              onClick={togglePopup}
            >
              {history?.length != 0 ? `View new order` : `View order`}
            </p> */}
        </div>
      </div>
      {open == "sheet" && (
        <div className="popup">
          <div className="popup-header">
            <h3 style={{ color: "#000", fontSize: 14 }}>
              {`Your order :  ${orders.reduce(
                (total, item) => total + item.qty,
                0
              )} items`}
            </h3>
            <button className="close-btn" onClick={() => setOpen(null)}>
              ×
            </button>
          </div>

          {/* Scrollable order list */}
          <div className="popup-content">
            {orders.map((item) => (
              <OrderCell
                key={item.id} // Make sure each item has a unique `id`
                add={() => AddItem(item)}
                remove={() => removeItem(item)}
                onDelete={() => deleteItem(item)}
                item={item}
              />
            ))}
          </div>

          {/* Fixed button */}
          <div className="popup-footer">
            <button
              className="place-order-btn"
              onClick={() => setOpen(details ? "popup" : "detail")}
            >
              {`Place Order`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;

const BottomSheet = ({ items }) => {
  return (
    <div className="bottom-sheet">
      <h3>Your Order Summary</h3>
      <div className="divider"></div>
      {items.map((item) => (
        <div key={item.id} className="order-item">
          <div className="item-left">
            <div className="item-header">
              <span className="item-icon">⏺️</span>
              <span className="item-name">{item.name}</span>
            </div>
            <span className="item-type">{item.size}</span>
          </div>
          <div className="item-controls">
            <button className="btn" onClick={() => item.decrement(item.id)}>
              -
            </button>
            <span className="quantity">{item.qty}</span>
            <button className="btn" onClick={() => item.increment(item.id)}>
              +
            </button>
          </div>
          <span className="item-price">₹{item.price * item.qty}</span>
        </div>
      ))}
      <div className="subtotal-section">
        <div className="subtotal-left">
          <span className="subtotal-icon">🛍️</span>
          <span className="subtotal-text">
            Subtotal: ₹
            {items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
          </span>
          <span className="extra-text">Extra charges may apply</span>
        </div>
        <button className="continue-btn">Continue →</button>
      </div>
    </div>
  );
};

const PopupForm = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  if (!isOpen) return null; // Don't render if not open

  const handleSave = () => {
    if (name.trim() && mobile.trim()) {
      onSave({ name, mobile });
      setName("");
      setMobile("");
    } else {
      alert("Please fill all fields");
    }
  };

  const handleCancel = () => {
    setName("");
    setMobile("");
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-title">Enter Details</h2>
        <input
          className="popup-input"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="popup-input"
          type="text"
          placeholder="Enter your mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <div className="popup-buttons">
          <button className="popup-button cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="popup-button save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
