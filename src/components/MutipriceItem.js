import React from "react";
import "../cssFiles/MenuItem.css"; // Separate CSS for styling
import { AddButton } from "../App";

const MultipriceItem = ({ item, ordered, sizes, onClick, add, remove }) => {
  return (
    <div style={{flex: '0 0 55%'}} className="menu-card">
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
            <div style={{ flex: 1 }}>
              {sizes?.map((details) => {
                const matchedOrder = ordered.find(
                  (order) => order.size === details.size && order.id === item.id
                );
                return (
                  <div style={{ marginTop: 5 }} className="size-row">
                    <span className="size-label">{details?.size}</span>
                    <span className="menu-price">{`₹ ${details?.price}`}</span>
                    <AddButton
                      onPress={() => onClick(details)}
                      status={!!matchedOrder}
                      qty={matchedOrder?.qty || 1}
                      add={() => add(details)}
                      remove={() => remove(details)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipriceItem;
