import "../cssFiles/History.css";
import { GetDetails } from "../networking/LocalDB";

const HistorySheet = ({ onClose, orderHistory, Id }) => {
  const details = GetDetails(Id);
  const totalAmount = orderHistory.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  return (
    <div>
      {/* Order History Sliding Sheet */}
      <div className={`sheet open`}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{`Order History`}</h2>

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
            <li
              className="order-total"
              style={{ marginTop: "10px", fontWeight: "bold" }}
            >
              Total: ₹{totalAmount}
            </li>
            {details?.upi && (
              <li>
                <button
                  style={{
                    marginTop: "10px",
                    padding: "10px 15px",
                    backgroundColor: "#0f9d58",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const upiId = "9876543210@paytm"; // Your UPI ID
                    const name = "My Shop";
                    const note = "Order Payment";
                    const link = `upi://pay?pa=${
                      details?.upi
                    }&pn=${encodeURIComponent(
                      name
                    )}&am=${totalAmount}&tn=${encodeURIComponent(note)}&cu=INR`;

                    // Detect mobile before opening
                    if (/Android|iPhone/i.test(navigator.userAgent)) {
                      window.location.href = link;
                    } else {
                      alert(
                        "Please open this page on your phone with Google Pay installed."
                      );
                    }
                  }}
                >
                  Pay with Google Pay
                </button>
              </li>
            )}
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
