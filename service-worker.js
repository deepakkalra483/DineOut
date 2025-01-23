self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "./assets/images/icons/order_icon.png", // Replace with your icon path
  };
  event.waitUntil(self.registration.showNotification("Your App Name", options));
});
