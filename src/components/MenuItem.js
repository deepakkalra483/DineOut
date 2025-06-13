import React from "react";
import "../cssFiles/MenuItem.css"; // Separate CSS for styling
import { AddButton } from "../App";

const MenuItem = ({ item, ordered, qty, onClick, add, remove }) => {
  console.log("item---", item);
  return (
    <div className="menu-card">
      {/* Image container with title overlay */}
      <div className="image-container">
        <img
          src={item?.src}
          alt={item?.name || "Menu Item"}
          className="menu-image"
        />
        <div className="menu-title-overlay">{item?.name}</div>
      </div>

      {/* Price and Add Button */}
      <div className="menu-info">
        <div className="size-options">
          <div className="size-row">
            <span className="menu-price">{`₹ ${item?.price || 0}`}</span>
            <AddButton
              onPress={onClick}
              status={ordered}
              qty={qty}
              add={add}
              remove={remove}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
