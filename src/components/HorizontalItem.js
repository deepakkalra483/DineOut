import React, { useState } from "react";
import "../cssFiles/HorizontalItem.css";
import { AddButton } from "../App";

const HorizontalItem = ({ item, ordered, sizes, onClick, add, remove }) => {
  const [showPopup, setShowPopup] = useState(false);
  const matchedOrder = ordered.find(
    (order) => order.size === sizes[0].size && order.id === item.id
  );
  return (
    <>
      <div className="item_cell">
        <div className="image_cell">
          <img
            src={item?.src}
            alt={item?.name || "Menu Item"}
            className="img"
          />
        </div>

        <div className="content_cell">
          <label className="item_name">{item?.name}</label>
          <p className="item_description">
            {item?.description || "A perfect choice to satisfy your cravings."}
          </p>
          <div className="button_cell">
            <span className="price_text">{`₹ ${sizes[0]?.price}`}</span>
            {!!matchedOrder ? (
              <div className="counter-btn">
                <button
                  className="counter-icon"
                  onClick={() => remove(sizes[0])}
                >
                  -
                </button>
                <span className="counter-value">{matchedOrder.qty}</span>
                <button className="counter-icon" onClick={() => add(sizes[0])}>
                  +
                </button>
              </div>
            ) : (
              <button className="add-btn" onClick={() => onClick(sizes[0])}>
                Add
              </button>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup_overlay" onClick={() => setShowPopup(false)}>
          <div
            className="popup_box"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h3 className="popup_title">{item.name}</h3>
            <div className="popup_options">
              {sizes.map((p, idx) => (
                <div key={idx} className="popup_row">
                  <span>{p.size}</span>
                  <span>₹{p.price}</span>
                  <button className="popup_add_btn">Add</button>
                </div>
              ))}
            </div>
            <button className="popup_close" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HorizontalItem;
