// 負責什麼：儲存變數、localStorage 的存取、變更資料時的「廣播」通知
// 這裡的變數和函式是全域的，其他模組可以直接使用或修改

// state.js
export let gameState = {
    unlockedApps: ['app-logs'],
    // ... 其他狀態
};

export function updateState(newData) {
    gameState = { ...gameState, ...newData };
    // 在這裡可以加一個邏輯：如果改動了重要進度，自動觸發 saveToCloud()
    console.log("狀態已更新", gameState);
}