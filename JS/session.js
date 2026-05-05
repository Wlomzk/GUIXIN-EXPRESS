// session.js
import { db, auth } from './firebase-init.js';
import { 
    collection, query, where, getDocs, updateDoc, doc, 
    addDoc, setDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/**
 * 產生配對碼 (PC 端使用)
 * @param {string} pcUid - 當前電腦的 UID
 */
export async function createPairingSession(pcUid) {
    try {
        // 隨機產生 8 位數代碼
        const pairingCode = Math.floor(10000000 + Math.random() * 90000000).toString();
        
        // 將 Session 寫入 Firestore
        const sessionRef = await addDoc(collection(db, "sessions"), {
            code: pairingCode,
            pcUid: pcUid,
            status: "waiting", // 等待手機連接
            createdAt: serverTimestamp()
        });
        
        console.log(`[系統通知] 配對碼生成成功: ${pairingCode} (Session ID: ${sessionRef.id})`);
        return { pairingCode, sessionId: sessionRef.id };
        
    } catch (error) {
        console.error("[系統錯誤] 無法生成配對碼：", error);
    }
}

/**
 * 測試連接：寫入一筆「系統心跳」數據
 * 如果這段成功執行，代表我們的安全規則 (Rules) 設定正確！
 */
export async function testConnection() {
    // 等待 Auth 載入完成，取得 UID
    const user = auth.currentUser;
    if (!user) {
        console.warn("系統尚未準備好，請稍候...");
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            lastSeen: new Date().toISOString(),
            status: "online",
            systemVersion: "1.0.0"
        }, { merge: true });

        console.log("%c[系統通知] 終端機連線正常，已寫入伺服器。", "color: #0f0;");
    } catch (error) {
        console.error("[系統錯誤] 無法寫入資料庫：", error.message);
    }
}

/**
 * 手機端：根據代碼加入連線
 */
export async function joinPairingSession(inputCode, mobileUid) {
    try {
        // 1. 去資料庫搜尋這組 code
        const q = query(collection(db, "sessions"), where("code", "==", inputCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.error("查無此配對碼，請確認後再輸入。");
            return false;
        }

        // 2. 找到該筆資料 (理論上只有一筆)
        const sessionDoc = querySnapshot.docs[0];
        
        // 3. 更新該資料：寫入手機 UID 並把狀態改成 paired
        await updateDoc(doc(db, "sessions", sessionDoc.id), {
            mobileUid: mobileUid,
            status: "paired"
        });

        console.log("%c[系統通知] 配對成功！與電腦端已同步。", "color: #00ff00; font-weight: bold;");
        return true;

    } catch (error) {
        console.error("[系統錯誤] 連線失敗：", error);
        return false;
    }
}