import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";  // ✅ Import getAuth

const firebaseConfig = {
  apiKey: "AIzaSyCOtWpc0ZVy3UauyRpIegvoDdE0BdV_MAA",
  authDomain: "hardware-hackathon-20074.firebaseapp.com",
  databaseURL: "https://hardware-hackathon-20074-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hardware-hackathon-20074",
  storageBucket: "hardware-hackathon-20074.firebasestorage.app",
  messagingSenderId: "339624349036",
  appId: "1:339624349036:web:e1142544271cb63f0cf749",
  measurementId: "G-007GM345R4"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const database = getDatabase(app);
export const auth = getAuth(app);  // ✅ Export auth
