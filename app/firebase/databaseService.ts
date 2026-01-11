import { 
  ref, 
  set, 
  get, 
  update, 
  remove, 
  onValue,
  push,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
  DataSnapshot,
  Unsubscribe
} from "firebase/database";
import { database } from "./firebase";

// Write data
export const writeData = async (path: string, data: any): Promise<void> => {
  const dbRef = ref(database, path);
  await set(dbRef, data);
};

// Read data once
export const readData = async (path: string): Promise<any> => {
  const dbRef = ref(database, path);
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

// Update data
export const updateData = async (path: string, updates: any): Promise<void> => {
  const dbRef = ref(database, path);
  await update(dbRef, updates);
};

// Delete data
export const deleteData = async (path: string): Promise<void> => {
  const dbRef = ref(database, path);
  await remove(dbRef);
};

// Push new data (generates unique key)
export const pushData = async (path: string, data: any): Promise<string | null> => {
  const dbRef = ref(database, path);
  const newRef = push(dbRef);
  await set(newRef, data);
  return newRef.key;
};

// Listen to real-time updates
export const listenToData = (
  path: string, 
  callback: (data: any) => void
): Unsubscribe => {
  const dbRef = ref(database, path);
  return onValue(dbRef, (snapshot) => {
    const data = snapshot.exists() ? snapshot.val() : null;
    callback(data);
  });
};

// Query data
export const queryData = async (
  path: string,
  orderBy: string,
  equalToValue?: any,
  limit?: number
): Promise<any> => {
  let dbQuery = query(ref(database, path), orderByChild(orderBy));
  
  if (equalToValue !== undefined) {
    dbQuery = query(dbQuery, equalTo(equalToValue));
  }
  
  if (limit) {
    dbQuery = query(dbQuery, limitToFirst(limit));
  }
  
  const snapshot = await get(dbQuery);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};