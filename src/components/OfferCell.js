import "../cssFiles/OfferCell.css";

const OfferCell = ({ offer, add, remove, onClick,ordered }) => {
  return (
    <div className="offer_cell">
      <div className="offer_img_cell">
        <img
          src={offer.src}
          alt={"Menu Item"}
          className="offer_img"
        />
      </div>
      <div className="offer_content">
        <label className="name_label">{offer.name}</label>
        <label className="description_label">{offer?.description}</label>
        <div className="button_cont">
          {/* <span className="price_text">{`₹ ${offer?.price[0]?.price}`}</span> */}
          {!!ordered ? (
            <div className="counter-btn">
              <button className="counter-icon" onClick={remove}>
                -
              </button>
              <span className="counter-value">{ordered.qty}</span>
              <button className="counter-icon" onClick={add}>
                +
              </button>
            </div>
          ) : (
            <button className="add-btn" onClick={onClick}>
              {`Add ${offer?.price[0]?.price}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCell;
