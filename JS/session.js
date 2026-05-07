import { db, auth } from './firebase-init.js';
import { 
    collection, query, where, getDocs, updateDoc, doc, onSnapshot,
    addDoc, setDoc, serverTimestamp, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// [ 核心擴充 ]：商朝命理編號生成器 (DEATH 歪頭版)
// ==========================================
function generateEmployeeID() {
    const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const mysteryWords = ["魂", "煞", "冥", "墓", "魁", "絕", "死"];

    // 隨機選取：天干 + 地支 + 禁忌神祕字
    const stem = heavenlyStems[Math.floor(Math.random() * heavenlyStems.length)];
    const branch = earthlyBranches[Math.floor(Math.random() * earthlyBranches.length)];
    const word = mysteryWords[Math.floor(Math.random() * mysteryWords.length)];
    
    // 生成四位隨機數字 (補零)
    const num = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    // 回傳格式如："辛亥-煞-044052"
    return `${stem}${branch}-${word}-${num}`;
}

/**
 * 輔助函式：清理該使用者的舊 Session (防止資料庫爆炸)
 */
async function clearOldSessions(mobileUid) {
    const q = query(collection(db, "sessions"), where("mobileUid", "==", mobileUid));
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
    await Promise.all(deletePromises);
}

// ==========================================
// 1. 產生配對碼 (手機端使用) - 已修改為商朝編號
// ==========================================
export async function createPairingSession(mobileUid) {
    try {
        // 先清理該使用者的舊 Session
        await clearOldSessions(mobileUid);
        
        // --- 修改處：從純數字改為中英混合命理編號 ---
        const pairingCode = generateEmployeeID();
        
        const sessionRef = await addDoc(collection(db, "sessions"), {
            code: pairingCode,
            mobileUid: mobileUid,
            status: "waiting",
            createdAt: serverTimestamp()
        });
        
        console.log(`[系統] 載體編號生成成功 (命運定錨中): ${pairingCode}`);
        return { pairingCode, sessionId: sessionRef.id };
    } catch (error) {
        console.error("[系統錯誤] 生成配對碼失敗：", error);
    }
}

/**
 * 聰明的配對碼獲取：有舊的就回傳舊的，沒有才創新的
 */
export async function getOrGeneratePairingSession(mobileUid) {
    // 1. 先找找看有沒有已經存在的 Session
    const q = query(collection(db, "sessions"), where("mobileUid", "==", mobileUid), where("status", "==", "waiting"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        // 找到了！回傳現有的代碼
        const doc = querySnapshot.docs[0];
        console.log("[系統] 偵測到現有命理編號，繼續沿用:", doc.data().code);
        return { pairingCode: doc.data().code, sessionId: doc.id };
    }

    // 2. 沒找到，才執行「產生新碼」的動作
    console.log("[系統] 尚未定錨，開始產生新的編號...");
    return await createPairingSession(mobileUid);
}

// ==========================================
// 2. 監聽配對狀態 (手機端使用)
// ==========================================
export function listenForPairing(sessionId, onPaired) {
    const sessionDocRef = doc(db, "sessions", sessionId);
    
    return onSnapshot(sessionDocRef, (doc) => {
        if (doc.exists() && doc.data().status === "paired") {
            console.log("[系統] 電腦端已成功連線！命運同步完成。嘻嘻。");
            onPaired();
        }
    });
}

// ==========================================
// 3. 電腦端：輸入代碼進行配對
// ==========================================
export async function joinPairingSession(inputCode, pcUid) {
    try {
        // 這裡會搜尋玩家輸入的 "辛亥-煞-0442" 格式
        const q = query(collection(db, "sessions"), where("code", "==", inputCode));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.error("查無此編號。您是誰？為什麼要穿著死人的皮囊？嘻嘻。");
            return false;
        }

        const sessionDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "sessions", sessionDoc.id), {
            pcUid: pcUid,
            status: "paired"
        });

        console.log("[系統] 載體配對成功！儀式開始。");
        return true;
    } catch (error) {
        console.error("[系統錯誤] 連線失敗：", error);
        return false;
    }
}

// ==========================================
// 4. 心跳監測
// ==========================================
export async function testConnection() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            lastSeen: new Date().toISOString(),
            status: "online"
        }, { merge: true });
    } catch (error) {
        console.error("[系統錯誤] 連線失敗：", error.message);
    }
}