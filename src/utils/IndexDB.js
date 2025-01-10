import { openDB } from "idb";

const DB_NAME = "myDatabase";
const STORE_NAME = "myStore";

export const initDB = async (restaurantName, tableNumber) => {
  return openDB(DB_NAME, 6, {
    upgrade(db) {
      // if (db.objectStoreNames.contains(restaurantName)) {
      //   // If the store exists, return true without making any changes
      //   return true;
      // } else {
      // Delete all existing stores if any
      // db.objectStoreNames.forEach((storeName) => {
      //   console.log("storename", storeName);
      // db.deleteObjectStore(restaurantName);
      //   db.deleteObjectStore(tableNumber);
      // });

      // Create a new store with the passed restaurant name
      db.createObjectStore(restaurantName, {
        keyPath: "id",
        autoIncrement: true,
      });

      // Create a new ordersStore
      db.createObjectStore(tableNumber, {
        keyPath: "id",
        autoIncrement: true,
      });
      console.log("New stores created.");
      return false;
      // }
    },
  });
};

// Add data
// export const addData = async (name, data) => {
//   const db = await initDB(name);
//   const tx = db.transaction(STORE_NAME, "readwrite");
//   tx.store
//     .add(data)
//     .then((result) => {
//       if (result) {
//         tx.done
//           .then((res) => {
//             return true;
//           })
//           .catch((e) => {
//             return false;
//             console.log(e);
//           });
//       }
//     })
//     .catch(() => {
//       return false;
//     });
// };

export const addData = (name, table, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const storeExists = await initDB(name, table);

      // If the store already exists, resolve immediately
      if (storeExists) {
        console.log("Restaurant store already exists.");
        resolve(true);
        return true; // Resolves directly if store exists
      } else {
        console.log("elesecall-");
        const db = await initDB(name, table);

        // Start a transaction
        const tx = db.transaction(name, "readwrite");
        const store = tx.objectStore(name);

        // Add data to the store
        const result = await store.add(data);

        // Wait for the transaction to be completed
        await tx.done;

        // If the transaction is done, resolve the promise with true
        resolve(true);
      }
      // Initialize the database
    } catch (error) {
      // If there's any error, reject the promise with false
      console.error("Error adding data:", error);
      reject(false);
    }
  });
};

// export const addOrder = async (table, data) => {
//   const db = await openDB(DB_NAME, 1);
//   const tx = db.transaction(table, "readwrite");
//   return new Promise((resolve,reject)=> {
//     try {
//       await tx.store.add(data);
//     } catch (error) {

//     }
//   })
//   await tx.store.add(data);
//   await tx.done;
// };

export const addOrder = (table, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Open the database
      const db = await openDB(DB_NAME, 2);

      // Start a transaction
      const tx = db.transaction(table, "readwrite");
      const store = tx.objectStore(table);

      // Add the data to the store
      const id = await store.add(data);

      // Ensure the transaction is completed
      await tx.done;

      // Resolve the promise with the ID of the added record
      resolve(id);
    } catch (error) {
      // Reject the promise with the error
      reject(error);
    }
  });
};

export const getAllOrders = (table) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Open the database
      const db = await openDB(DB_NAME, 5);

      // Start a transaction
      const tx = db.transaction(table, "readonly");
      const store = tx.objectStore(table);

      // Get all data from the store
      const data = await store.getAll();

      // Ensure the transaction is completed
      await tx.done;

      // Resolve the promise with all retrieved data
      resolve(data);
    } catch (error) {
      // Reject the promise with the error
      reject(error);
    }
  });
};

// Get all data
export const getAllData = async (restaurantName) => {
  const db = await initDB(restaurantName);
  return db.getAll(restaurantName);
};

// Delete data by ID
export const deleteData = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.delete(id);
  await tx.done;
};

export const clearDatabase = (dbName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => {
      console.log(`Database "${DB_NAME}" deleted successfully.`);
      resolve();
    };

    request.onerror = (event) => {
      console.error(
        `Error deleting database "${DB_NAME}":`,
        event.target.error
      );
      reject(event.target.error);
    };

    request.onblocked = () => {
      console.warn(
        `The deletion of database "${DB_NAME}" is blocked. Ensure no open connections exist.`
      );
    };
  });
};
