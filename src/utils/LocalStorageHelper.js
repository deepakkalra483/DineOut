export const AddToCart = (id, item) => {
  const data = localStorage.getItem(id);
  if (data) {
    const parsedData = JSON.parse(data);
    const newData = [...parsedData, item];
    const StringfyData = JSON.stringify(newData);
    localStorage.setItem(id, StringfyData);
  } else {
    let orders = [];
    orders.push(item);
    const stringifyOrders = JSON.stringify(orders);
    localStorage.setItem(id, stringifyOrders);
  }
};

export const getCartDetails = (id) => {
  const orders = localStorage.getItem(id);
  const parsedOrder = JSON.parse(orders);
  return parsedOrder;
};
