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

export const AddMore = (id, item) => {
  const data = localStorage.getItem(id);
  if (data) {
    const parsedData = JSON.parse(data);
    const existingItem = parsedData.find(
      (storedItem) => storedItem.id === item.id
    );

    if (existingItem) {
      // Increment the quantity
      existingItem.qty += 1;
    } else {
      // Add the new item with an initial quantity of 1
      parsedData.push({ ...item, quantity: 1 });
    }

    // Save the updated data back to localStorage
    localStorage.setItem(id, JSON.stringify(parsedData));
  }
};
