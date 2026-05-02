/* ==============================
   歸心物流終端機 - 完整整合版
   ============================== */
(function() {
    console.log("歸心物流終端機：系統校準中...");

    document.addEventListener("DOMContentLoaded", function() {
        // 1. 建立「外層容器」
        const phoneWrapper = document.createElement("div");
        phoneWrapper.className = "gx-phone-wrapper";
        phoneWrapper.id = "gx-phone";

        // 2. 建立「手機主介面」 (這裡補上了關閉按鈕)
        const phoneScreen = document.createElement("div");
        phoneScreen.className = "gx-phone-screen";
        phoneScreen.innerHTML = `
        <div class="gx-status-bar">
        <div class="gx-status-signal" id="status-signal">信号: 强</div>
        <div id="system-time" style="font-size: 12px; font-family: monospace;">--:--</div>
        <div class="gx-status-battery" id="status-battery">
            <div class="battery-body">
                <div class="battery-fill" id="battery-fill"></div>
            </div>
            <span id="battery-text">100%</span>
        </div>
    </div>    
        
        <div class="gx-phone-close" id="gx-close" style="z-index: 100;">×</div>
    
    <div class="gx-app-layer">
    <div class="gx-app-grid">
        <div class="gx-app-item" onclick="openApp('系統日誌', '讀取中... [Access Denied]')">
            <div class="gx-app-icon"><i class="fa-solid fa-terminal"></i></div>
            <span class="gx-app-name">系統日誌</span>
        </div>
        <div class="gx-app-item" onclick="openApp('人員清單', '成員：阿強、小明、[數據損毀]')">
            <div class="gx-app-icon"><i class="fa-solid fa-users-viewfinder"></i></div>
            <span class="gx-app-name">人員清單</span>
        </div>
        <div class="gx-app-item" onclick="openApp('監控畫面', 'NO SIGNAL')">
            <div class="gx-app-icon"><i class="fa-solid fa-video"></i></div>
            <span class="gx-app-name">監控中心</span>
        </div>
        </div>

    <div id="gx-modal" class="gx-modal">
        <div class="gx-modal-content">
            <div class="gx-modal-header">
                <span id="modal-title">APP名稱</span>
                <button class="gx-modal-close" onclick="closeApp()">×</button>
            </div>
            <div class="gx-modal-body">
                <p id="modal-text">內容加載中...</p>
            </div>
        </div>
    </div>
</div>
    <div class="gx-crack-overlay"></div>
`;

        // 3. 組裝結構
        phoneWrapper.appendChild(phoneScreen);
        document.body.appendChild(phoneWrapper);

        // 4. 建立「終端機開關」
        const terminalTrigger = document.createElement("div");
        terminalTrigger.className = "gx-terminal-trigger";
        document.body.appendChild(terminalTrigger);

        // 5. 定義統一的切換函數
        function togglePhone() {
            const isOpen = phoneWrapper.classList.toggle("is-open");
            // 開啟時隱藏按鈕，關閉時顯示按鈕
            terminalTrigger.style.display = isOpen ? 'none' : 'flex';
        }

        // 6. 綁定監聽事件
        terminalTrigger.addEventListener("click", togglePhone);
        
        // 記得抓取剛剛生成的關閉按鈕
        const closeBtn = document.getElementById("gx-close");
        closeBtn.addEventListener("click", togglePhone);

        console.log("歸心物流終端機：骨架已掛載，等待貞人啟動。");
    });
})();

function updateClock() {
    const timeElement = document.getElementById('system-time');
    if (!timeElement) return;

    const now = new Date();
    
    // 將 hour12 改為 true，並且確保時區設定正確
    const timeString = now.toLocaleTimeString('zh-TW', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true // 關鍵在這裡：設為 true 就會自動顯示上午/下午
    });

    timeElement.innerText = timeString;
}

// 啟動計時器，每 1000 毫秒（1秒）刷新一次
setInterval(updateClock, 1000);

// 頁面載入時先執行一次，才不會等一秒才顯示
updateClock();

function openApp(title, content) {
    const modal = document.getElementById('gx-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = content;
    modal.style.display = 'block';
}

function closeApp() {
    document.getElementById('gx-modal').style.display = 'none';
}