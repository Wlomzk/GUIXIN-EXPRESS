/* ==========================================================
   歸心物流終端機 - 主程式 (UI 與 互動)
   ========================================================== */

// 1. 初始化防止重複載入
if (window.hasInitializedPhone) {
    console.warn("手機系統被重複載入，已攔截！");
} else {
    window.hasInitializedPhone = true;
    console.log("手機系統初始化成功");
}

// 2. App 資料庫 (在這裡管理你的 App，增加或解鎖都在這裡改！)
const appList = [
    { id: 'app-logs', name: '系統日誌', icon: '🖥️', locked: true, title: '系統日誌', content: '讀取中... [Access Denied]' },
    { id: 'app-secret-files', name: '人員清單', icon: '👤', locked: false, title: '人員清單', content: '成員：阿強、小明、[數據損毀]' },
    { id: 'app-cam', name: '監控中心', icon: '📹', locked: true, title: '監控畫面', content: 'NO SIGNAL' }
];

(function() {
    console.log("歸心物流終端機：系統校準中...");

    document.addEventListener("DOMContentLoaded", function() {
        // --- [SECTION: 初始化介面容器] ---
        const phoneWrapper = document.createElement("div");
        phoneWrapper.className = "gx-phone-wrapper";
        phoneWrapper.id = "gx-phone";

        // [側邊通知欄]
        const batteryNotifier = document.createElement("div");
        batteryNotifier.id = "gx-battery-notifier";
        phoneWrapper.appendChild(batteryNotifier);

        // --- [SECTION: UI 渲染 (畫面結構)] ---
        const phoneScreen = document.createElement("div");
        phoneScreen.className = "gx-phone-screen";
        phoneScreen.innerHTML = `
            <div class="gx-status-bar">
                <div class="gx-status-signal" id="status-signal">信号: 强</div>
                <div id="system-time" class="gx-time-display">--:--</div>
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
                    </div>
            </div>

            <div class="gx-crack-overlay"></div>
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
        `;

        phoneWrapper.appendChild(phoneScreen);
        document.body.appendChild(phoneWrapper);

        // [終端機啟動按鈕]
        const terminalTrigger = document.createElement("div");
        terminalTrigger.className = "gx-terminal-trigger";
        document.body.appendChild(terminalTrigger);

        // --- [SECTION: 初始化功能] ---
        renderAppGrid(); // 渲染 App 列表
        randomGlitch();  // 啟動故障效果
        setInterval(updateClock, 1000);
        updateClock();

        // 監聽器綁定
        terminalTrigger.addEventListener("click", togglePhone);
        document.getElementById("gx-close").addEventListener("click", togglePhone);
    });
})();

// --- [SECTION: 核心渲染與控制函數] ---

// 自動渲染 App (只渲染未鎖定的)
function renderAppGrid() {
    const grid = document.querySelector('.gx-app-grid');
    if (!grid) return;

    grid.innerHTML = ''; // 清空舊的

    // 只篩選出 locked 為 false 的 App
    appList.filter(app => !app.locked).forEach(app => {
        const appItem = document.createElement('div');
        appItem.className = 'gx-app-item';
        appItem.id = app.id;
        // 綁定點擊事件
        appItem.setAttribute('onclick', `openApp('${app.title}', '${app.content}')`);
        
        appItem.innerHTML = `
            <div class="gx-app-icon">${app.icon}</div>
            <span class="gx-app-name">${app.name}</span>
        `;
        grid.appendChild(appItem);
    });
}

function randomGlitch() {
    const phoneWrapper = document.getElementById('gx-phone');
    if (!phoneWrapper) return;
    const effect = Math.random() > 0.5 ? 'effect-flicker' : 'effect-glitch';
    phoneWrapper.classList.add(effect);
    setTimeout(() => { phoneWrapper.classList.remove(effect); }, 500);
    setTimeout(randomGlitch, Math.random() * 5000 + 3000);
}

function togglePhone() {
    const phoneWrapper = document.getElementById('gx-phone');
    const terminalTrigger = document.querySelector('.gx-terminal-trigger');
    const isOpen = phoneWrapper.classList.toggle("is-open");
    terminalTrigger.style.display = isOpen ? 'none' : 'flex';
}

function updateClock() {
    const timeElement = document.getElementById('system-time');
    if (timeElement) {
        timeElement.innerText = new Date().toLocaleTimeString('zh-TW', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
    }
}

function openApp(title, content) {
    if (typeof drainBattery === 'function') {
        drainBattery(10);
    }
    const modal = document.getElementById('gx-modal');
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = content;
    modal.style.display = 'block';
}

function closeApp() { 
    document.getElementById('gx-modal').style.display = 'none'; 
}