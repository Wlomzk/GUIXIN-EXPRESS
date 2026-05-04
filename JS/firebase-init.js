// js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";

const style = "background: #000; color: #0f0; font-family: monospace; padding: 5px; font-size: 14px;";

const firebaseConfig = {
  // 把你從 Firebase Console 拿到的那串貼到這裡
  apiKey: "AIzaSyCvEngtZ2RHi5UmvSNuldzprx4FgwNqSUI",
  authDomain: "guixin-express.firebaseapp.com",
  projectId: "guixin-express",
  storageBucket: "guixin-express.firebasestorage.app",
  messagingSenderId: "392731580810",
  appId: "1:392731580810:web:b02971e593fad3a60dd073",
  measurementId: "G-FVGS01H0YL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 執行匿名登入
signInAnonymously(auth)
  .then(() => console.log("%c[系統通知] 外部連結已確認...", style))
              console.log("%c[警告] 檢測到非法接入，正在分析IP位置...", "color: #ff0; font-weight: bold;");
              console.log("%c[殷商遺存] 啟動中... 身分ID: " + user.uid.substring(0, 8) + "...", "color: #0ff;");
  .catch((err) => console.error(%c[系統通知] 您已遺失在輪迴的洪流中...", err));

  