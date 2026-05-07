// 負責什麼：儲存變數、localStorage 的存取、變更資料時的「廣播」通知
// 這裡的變數和函式是全域的，其他模組可以直接使用或修改

// state.js
export let gameState = {
    unlockedApps: ['app-logs'],
    unlockedEvidences: {},
    // ... 其他狀態
};

// 更新狀態的共用函式，其他模組可以呼叫它來修改狀態並觸發更新通知
export function updateState(newData) {
    gameState = { ...gameState, ...newData };
    // 廣播通知 (這裡可以用自定義事件 CustomEvent)
    window.dispatchEvent(new CustomEvent('stateUpdated', { detail: gameState }));
    
    console.log("狀態已更新並存檔", gameState);
}

// 儲存到 localStorage 的共用邏輯
export function saveToLocal() {
    localStorage.setItem('my_paranormal_game_save', JSON.stringify(gameState));
}

// 從 localStorage 讀取的邏輯 (初始化時執行一次)
export function loadFromLocal() {
    const saved = localStorage.getItem('my_paranormal_game_save');
    if (saved) {
        gameState = { ...gameState, ...JSON.parse(saved) };
    }
}

// 解鎖證據的共用函式，其他模組可以呼叫它來解鎖證據並記錄時間
export function unlockEvidence(id, fixedTime = null) {
    // 如果已經解鎖過，就跳過 (不覆蓋第一次的時間)
    if (gameState.unlockedEvidences[id]) return;

    // 決定時間：如果有傳入「固定時間」就用它，否則抓「現在時間」
    const timeToRecord = fixedTime || new Date().toLocaleString(); 

    // 更新狀態
    const newEvidences = { ...gameState.unlockedEvidences };
    newEvidences[id] = timeToRecord;

    updateState({ unlockedEvidences: newEvidences });

    // 可以在這裡加一些「變態」的副作用
    if (Object.keys(newEvidences).length > 5) {
        updateState({ storyPhase: 'suspicious' }); // 解鎖太多，客服開始變怪
    }
}