// db.js
import { db } from './firebase-init.js'; // 假設你有初始化 db

export async function saveGameProgress(data) {
    // 這裡寫你的 Firebase 寫入邏輯
    await db.collection('users').doc('uid').set(data, { merge: true });
}