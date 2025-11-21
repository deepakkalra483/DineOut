import React, { useState } from "react";
import "../cssFiles/CoffeeApp.css";
import FoodItem from "../components/Fooditem";

const banners = ["combo_banner.jpg", "combo_banner.jpg", "combo_banner.jpg"];
const filters=["All","Burger","Noodles","South Indian"]
export default function HomePage() {
   const [activeFilter, setActive] = useState("All");
  const [filterCount, setFilterCount] = useState(5);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  return (
    <div className="app">
      {/* Top View */}
      <div className="topView">
        <div className="tableText">
          <img
            src={require("../assets/images/icons/location.png")}
            alt="filter"
            className="filterIcon"
          />
          <h4>Table: T4, Spliti Cinema</h4>
        </div>

        <div className="filterIconWrapper">
          <img
            src={require("../assets/images/icons/cart.png")}
            alt="filter"
            className="filterIcon"
          />
          {filterCount > 0 && <span className="badge">{filterCount}</span>}
        </div>
      </div>
      <h1 className="heading-primary">Discover The Best Furniture.</h1>
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Search for furniture"
          className="searchInput"
          // onChange={(e) => searchItems(e.target.value)}
        />
        {/* <div className="filterIconWrapper">
          <img
            src={require("../assets/images/icons/order_history.png")}
            alt="filter"
            className="filterIcon"
          />
          {filterCount > 0 && <span className="badge">{filterCount}</span>}
        </div> */}
      </div>

      <div className="bannerSection">
        <div className="bannerContainer" onScroll={handleScroll}>
          {banners.map((item, index) => (
            <div
              key={index}
              className="bannerSlide"
              style={{
                backgroundImage: `url(${require(`../assets/images/banners/${item}`)})`,
              }}
            >
              {/* <div className="overlay" /> */}
              <div className="bannerContent">
                <p>One medium pizza free with one large pizza</p>
                <h3>Buy one get one free</h3>
                <button className="bannerBtn">Buy Now</button>
              </div>
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="dotsContainer">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`dot ${activeIndex === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      <h2 className="section-title">Categories</h2>
      <FilterView
        list={filters}
        active={activeFilter}
        onPress={(filter) => {
          // filterItems(filter);
          setActive(filter);
        }}
      />
      <h2 className="section-title">Best Seller</h2>
      <FoodItem />
    </div>
  );
}

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
