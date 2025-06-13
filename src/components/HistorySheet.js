import "../cssFiles/History.css";

const HistorySheet = ({ onClose, orderHistory }) => {
  return (
    <div>
      {/* Order History Sliding Sheet */}
      <div className={`sheet open`}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Order History</h2>

        {/* Order List */}
        {orderHistory?.length > 0 ? (
          <ul className="order-list">
            {orderHistory.map((item) => (
              <li key={item.id} className="order-item">
                <span className="item-name">
                  {item?.size == undefined
                    ? item?.qty + "× " + item.name
                    : item?.qty + "× " + item?.size + " " + item.name}
                </span>
                {/* <span className="item-quantity">x{item.qty}</span> */}
                <span className="item-price">₹{item.price}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              paddingInline: 10,
            }}
          >
            <span style={{ fontWeight: 599, marginBottom: 15 }}>
              {"No Order Found!"}
            </span>
            <img
              style={{ height: 55, width: 55, marginBottom: 15 }}
              src={require("../assets/images/icons/no_history.png")}
            />
            <span
              style={{
                marginBottom: 15,
                textAlign: "center",
                fontSize: "13px",
                color: "#3B3B3B",
              }}
            >
              {"You haven't placed any orders yet!"}
            </span>
          </div>
        )}

        {/* Total Price */}
        {/* <div className="total">
          <strong>Total:</strong> ₹
          {orderHistory.reduce((total, item) => total + item.price, 0)}
        </div> */}
      </div>

      {/* Overlay to close the sheet when clicked */}

      <div className="overlay" onClick={onClose}></div>
    </div>
  );
};

export default HistorySheet;
