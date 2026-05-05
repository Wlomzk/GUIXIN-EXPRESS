/* ==========================================================
   battery.js - 電池能源管理模組 (全域持久化版)
   ========================================================== */

// 1. 初始化電量
const savedBattery = localStorage.getItem('gx_battery');
window.batteryLevel = savedBattery !== null ? parseInt(savedBattery) : 100;

// 全域變數
window.lastAlertLevel = 0;
window.chargingInterval = null;
window.alert60Shown = false;
window.alert30Shown = false;

// --- 核心邏輯 ---

function updateBatteryUI() {
    const fill = document.getElementById('battery-fill');
    const text = document.getElementById('battery-text');
    
    // 更新電量數值與紀錄時間戳記 (關鍵！讓系統知道最後一次更新是何時)
    localStorage.setItem('gx_battery', batteryLevel);
    localStorage.setItem('gx_last_visit', Date.now()); 

    if (!fill) return;

    fill.style.width = batteryLevel + '%';
    text.innerText = batteryLevel + '%';

    const alertDisplay = document.getElementById('alert-level-display');
    if (alertDisplay) alertDisplay.innerText = batteryLevel;

    // 狀態重置機制
    if (batteryLevel > 60) {
        alert60Shown = false;
        alert30Shown = false;
    } else if (batteryLevel > 30) {
        alert30Shown = false;
    }

    fill.classList.remove('warning', 'danger');
    if (batteryLevel < 30) fill.classList.add('danger');
    else if (batteryLevel < 60) fill.classList.add('warning');
    
    checkBatteryAlerts();
}

// 統一停止充電的邏輯
function stopCharging() {
    if (chargingInterval) {
        clearInterval(chargingInterval);
        chargingInterval = null;
    }
    localStorage.setItem('isCharging', 'false');
    hideChargingIndicator();
}

function handleCharge() {
    if (chargingInterval) return;

    closeBatteryAlert();
    showChargingIndicator();
    
    // 記錄開始充電的狀態
    localStorage.setItem('isCharging', 'true');
    localStorage.setItem('chargeStartTime', Date.now());

    chargingInterval = setInterval(() => {
        if (batteryLevel < 100) {
            batteryLevel++;
            updateBatteryUI();
        } else {
            stopCharging();
            alert("系統充能完畢。");
            alert60Shown = false; // 重置警示
            alert30Shown = false;
        }
    }, 1500); // 1.5秒充 1%
}

// --- 初始化與狀態恢復 (最重要！) ---
window.addEventListener('DOMContentLoaded', () => {
    const lastVisit = parseInt(localStorage.getItem('gx_last_visit') || Date.now());
    const isCharging = localStorage.getItem('isCharging') === 'true';
    const chargeStartTime = parseInt(localStorage.getItem('chargeStartTime') || Date.now());
    
    const now = Date.now();
    const diffMs = now - lastVisit;

    if (isCharging) {
        // 如果原本在充電，計算離線期間充了多少電
        const gainedPower = Math.floor(diffMs / 1500);
        batteryLevel = Math.min(100, batteryLevel + gainedPower);
        
        // 恢復充電 UI 與計時器
        handleCharge();
    } else {
        // 如果原本沒在充電，計算離線期間耗了多少電
        const lostDrain = Math.floor(diffMs / 5000); // 5秒耗 1%
        batteryLevel = Math.max(0, batteryLevel - lostDrain);
    }

    updateBatteryUI();
});

// --- 其他輔助函數 ---

function drainBattery(amount) {
    batteryLevel = Math.max(0, batteryLevel - amount);
    updateBatteryUI();
}

function checkBatteryAlerts() {
    if (chargingInterval !== null) return;
    if (batteryLevel <= 30 && !alert30Shown) {
        alert30Shown = true;
        showBatteryAlert(batteryLevel);
    } else if (batteryLevel <= 60 && !alert60Shown) {
        alert60Shown = true;
        showBatteryAlert(batteryLevel);
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

function closeBatteryAlert() {
    const notifier = document.getElementById('gx-battery-notifier');
    if(notifier) notifier.style.display = 'none';
}

function showChargingIndicator() {
    const screen = document.querySelector('.gx-phone-screen');
    if(!screen) return;
    // 避免重複生成
    if(document.getElementById('gx-charging-box')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'gx-charging-indicator';
    indicator.id = 'gx-charging-box';
    indicator.innerHTML = `<div>⚡</div><div style="font-size:8px;">充電中</div>`;
    screen.appendChild(indicator);
}

function hideChargingIndicator() {
    const box = document.getElementById('gx-charging-box');
    if (box) box.remove();
}

setInterval(() => {
    if (chargingInterval !== null) return;
    if (batteryLevel > 0) drainBattery(1);
}, 5000);

document.addEventListener('battery-consume', (e) => {
    const amount = e.detail.amount || 1;
    drainBattery(amount);
});