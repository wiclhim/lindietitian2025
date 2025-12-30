// src/config/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJdTZN7LZxWv_B76NkCyC6Vn2S4YkPdSE",
  authDomain: "lindietitian-85b48.firebaseapp.com",
  projectId: "lindietitian-85b48",
  storageBucket: "lindietitian-85b48.firebasestorage.app",
  messagingSenderId: "513298519750",
  appId: "1:513298519750:web:4c6ed87c840fd23fc029c7",
  measurementId: "G-5JTJ33TWVV",
};

let app;
let auth;
let db;

try {
  // 防止在 React Strict Mode 或 Hot Reload 時重複初始化
  if (!window.firebaseAppInitialized) {
      app = initializeApp(firebaseConfig);
      window.firebaseAppInitialized = true;
      window.firebaseAppInstance = app;
  } else {
      app = window.firebaseAppInstance;
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  
} catch (error) {
  console.error("Firebase 初始化失敗", error);
}

// 將初始化好的實體匯出給其他檔案使用
export { app, auth, db };