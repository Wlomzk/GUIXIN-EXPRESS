/* ==========================================================
   battery.js - 電池能源管理模組 (整合手機 UI 更新邏輯)
   ========================================================== */

// --- 【1. 初始化與全域變數】 ---
let savedBattery = localStorage.getItem('gx_battery');
window.batteryLevel = (savedBattery === null) ? 34 : parseInt(savedBattery);
window.lastAlertLevel = 0;
window.chargingInterval = null;
window.alert60Shown = false;
window.alert30Shown = false;

// --- 【2. 核心電力運算】 ---

// 扣電執行
function drainBattery(amount) {
    window.batteryLevel = Math.max(0, window.batteryLevel - amount);
    window.updateBatteryUI();
}

// 停止充電邏輯
window.stopCharging = function() {
    if (window.chargingInterval) {
        clearInterval(window.chargingInterval);
        window.chargingInterval = null;
    }
    localStorage.setItem('isCharging', 'false');
    hideChargingIndicator();

    // 拔掉充電後，立刻恢復 UI 更新，確保自然耗電計時器能正常運作
    window.updateBatteryUI();
    console.log("🔌 充電線已拔除");
};

// 啟動充電邏輯
window.handleCharge = function() {
    if (window.chargingInterval) return;
    closeBatteryAlert();
    showChargingIndicator();
    localStorage.setItem('isCharging', 'true');
    localStorage.setItem('chargeStartTime', Date.now());
    
    window.chargingInterval = setInterval(() => {
        if (window.batteryLevel < 100) {
            window.batteryLevel++;
            window.updateBatteryUI();
        } else {
            window.stopCharging();
            window.alert60Shown = false; 
            window.alert30Shown = false;
        }
    }, 1500); // 每 1.5 秒充 1%
};

// --- 【3. UI 更新與狀態同步】 ---

window.updateBatteryUI = function() {
    if (!localStorage.getItem('gx_user')) return;

    const fill = document.getElementById('battery-fill');
    const text = document.getElementById('battery-text');
    const powerOverlay = document.getElementById('gx-power-off-overlay'); 
    
    // 同步到數據庫
    localStorage.setItem('gx_battery', window.batteryLevel);
    localStorage.setItem('gx_last_visit', Date.now()); 

    // 更新電池條長度與顏色 (從手機邏輯搬遷至此)
    if (fill) {
        fill.style.width = window.batteryLevel + '%';
        fill.classList.remove('warning', 'danger');
        if (window.batteryLevel < 30) {
            fill.style.backgroundColor = '#ff4444'; // 這裡補上手機需要的顏色參數
            fill.classList.add('danger');
        } else if (window.batteryLevel < 60) {
            fill.style.backgroundColor = '#ffcc00';
            fill.classList.add('warning');
        } else {
            fill.style.backgroundColor = '#32CD32';
        }
    }
    
    // 更新百分比文字
    if (text) {
        text.innerText = window.batteryLevel + '%';
    }

    // 電力歸零：顯示「系統電力已耗盡」遮罩
    if (powerOverlay) {
        powerOverlay.style.display = (window.batteryLevel <= 0) ? 'flex' : 'none';
    }

    // 更新警示視窗內的數字
    const alertDisplay = document.getElementById('alert-level-display');
    if (alertDisplay) alertDisplay.innerText = window.batteryLevel;

    // 重置警示標記（當充電超過閥值時）
    if (window.batteryLevel > 60) {
        window.alert60Shown = false; window.alert30Shown = false;
    } else if (window.batteryLevel > 30) {
        window.alert30Shown = false;
    }
    
    checkBatteryAlerts();
};

// --- 【4. 警示與通知系統】 ---

function checkBatteryAlerts() {
    if (window.chargingInterval !== null) return; // 充電中不噴警示
    if (window.batteryLevel <= 30 && !window.alert30Shown) {
        window.alert30Shown = true;
        showBatteryAlert(window.batteryLevel);
    } else if (window.batteryLevel <= 60 && !window.alert60Shown) {
        window.alert60Shown = true;
        showBatteryAlert(window.batteryLevel);
    }
}

function showBatteryAlert(level) {
    const notifier = document.getElementById('gx-battery-notifier');
    if(!notifier) return;
    notifier.innerHTML = `
        <span onclick="closeBatteryAlert()" style="position:absolute; top:2px; right:6px; cursor:pointer; color:#FF4444; font-weight:bold;">×</span>
        <div style="flex-grow: 1; color: #32CD32; text-align:center;">
            <div style="font-size: 14px; color: #d41c16; font-weight:bold; margin-bottom:5px;">⚠️ 系統電力</div>
            <div style="font-size: 14px; margin-bottom:8px;">剩餘 <span id="alert-level-display">${level}</span>% 電量</div>
            <button onclick="handleCharge()" style="background:#32CD32; color: #d41c16; border:none; padding:4px 8px; cursor:pointer; font-weight:bold;">[ 充電 ]</button>
        </div>
    `;
    notifier.style.display = 'flex';
}

window.closeBatteryAlert = function() {
    const notifier = document.getElementById('gx-battery-notifier');
    if(notifier) notifier.style.display = 'none';
};

// --- 【5. 充電視覺效果】 ---

function showChargingIndicator() {
    const screen = document.querySelector('.gx-phone-screen');
    if(!screen || document.getElementById('gx-charging-box')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'gx-charging-indicator';
    indicator.id = 'gx-charging-box';
    indicator.setAttribute('onclick', 'stopCharging()');
    indicator.style.cursor = 'pointer';  
    indicator.style.zIndex = '9999'; // 確保在所有視窗之上
    indicator.innerHTML = `<div>⚡</div><div style="font-size:8px;">充電中</div>`;
    indicator.innerHTML += `<div style="font-size:8px; opacity:0.7; margin-top:2px;">[ 點擊拔除 ]</div>`;
    screen.appendChild(indicator);
}

function hideChargingIndicator() {
    const box = document.getElementById('gx-charging-box');
    if (box) box.remove();
}

// --- 【6. 生命週期管理與離線計算】 ---

window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('gx_user')) return;

    const lastVisit = parseInt(localStorage.getItem('gx_last_visit') || Date.now());
    const isCharging = localStorage.getItem('isCharging') === 'true';
    const now = Date.now();
    const diffMs = now - lastVisit;

    if (isCharging) {
        // 離線充電計算
        const gainedPower = Math.floor(diffMs / 1500);
        window.batteryLevel = Math.min(100, window.batteryLevel + gainedPower);
        window.handleCharge();
    } else {
        // 離線耗電計算 (每 5 秒扣 1%)
        const lostDrain = Math.floor(diffMs / 5000); 
        window.batteryLevel = Math.max(0, window.batteryLevel - lostDrain);
    }
    window.updateBatteryUI();
});

// 定時自然耗電
setInterval(() => {
    if (!localStorage.getItem('gx_user')) return; 
    if (window.chargingInterval !== null) return;
    if (window.batteryLevel > 0) drainBattery(1);
}, 5000);

// --- 【7. 外部通訊介面】 ---
// 接收來自 phone-new.js 的指令
document.addEventListener('battery-consume', (e) => {
    if (!localStorage.getItem('gx_user')) return;
    const amount = e.detail.amount || 1;
    drainBattery(amount);
});