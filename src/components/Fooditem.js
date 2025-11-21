import "../cssFiles/FoodItem.css"; 
const FoodItem = ({item}) => {
  return (
    <div className="itemContainer">
      <img
        src={require("../assets/images/banners/combo_banner.jpg")}
        alt="filter"
        className="foodImg"
      />
      <h3>Burger</h3>
    </div>
  );
};

export default FoodItem;
