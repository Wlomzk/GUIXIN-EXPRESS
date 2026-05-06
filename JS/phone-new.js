/* ==========================================================
   phone-new.js (整合版 - 郵件系統已交由 mail_system.js 管理)
   ========================================================== */

import { AuthSystem } from '../data/whoiswatching.js';
import { MAIL_DATABASE } from '../data/mail_data.js';
import { launchMailApp } from './mail_system.js'; // 匯入外部郵件系統

// --- 全域函數掛載 ---
window.closeApp = closeApp;
window.openApp = openApp;
window.updateAppStage = updateAppStage; 

// --- 輔助函數 ---
function updateAppStage(appId, newStage) {
    let appSettings = JSON.parse(localStorage.getItem('gx_app_settings')) || {};
    appSettings[appId] = newStage;
    localStorage.setItem('gx_app_settings', JSON.stringify(appSettings));
    renderAppGrid();
}

// --- 初始化程序 ---
(function() {
    document.addEventListener("DOMContentLoaded", function() {
        if (window.hasInitializedPhone) return;
        window.hasInitializedPhone = true;

        const phoneWrapper = document.createElement("div");
        phoneWrapper.className = "gx-phone-wrapper";
        phoneWrapper.id = "gx-phone";

        const phoneScreen = document.createElement("div");
        phoneScreen.className = "gx-phone-screen";
        phoneScreen.innerHTML = `
            <div id="gx-login-overlay" class="gx-login-overlay">
                <div class="login-box">
                    <h3>歸心物流 - 系統登入</h3>
                    <input type="text" id="login-id" placeholder="User ID">
                    <input type="password" id="login-pass" placeholder="Password">
                    <button id="login-btn">登入系統</button>
                    <p id="login-error" style="color: red; font-size: 0.8em; margin-top: 10px;"></p>
                </div>
            </div>
            <div class="gx-status-bar">
                <div class="gx-status-signal" id="status-signal">信号: 强</div>
                <div id="system-time" class="gx-time-display">--:--</div>
                <div class="gx-status-battery" id="status-battery">
                    <div class="battery-body"><div class="battery-fill" id="battery-fill"></div></div>
                    <span id="battery-text">--%</span>
                </div>
            </div>   
            <div class="gx-phone-close" id="gx-close" style="z-index: 100;">×</div>
            <div class="gx-app-layer"><div class="gx-app-grid"></div></div>
            <div class="gx-crack-overlay"></div>
            <div class="gx-glitch-overlay"></div>
            <div id="gx-battery-notifier"></div>
            <div id="gx-modal" class="gx-modal">
                <div class="gx-modal-content">
                    <div class="gx-modal-header"><span id="modal-title"></span><button class="gx-modal-close" onclick="closeApp()">×</button></div>
                    <div class="gx-modal-body"><p id="modal-text"></p></div>
                </div>
            </div>
            <div id="mail-list-view" class="gx-modal" style="display:none; z-index:90;">
                <div class="gx-modal-content">
                    <div class="gx-modal-header"><span id="mail-win-title">系統郵件</span><button class="gx-modal-close" onclick="closeApp()">×</button></div>
                    <div id="mail-items-container" class="gx-modal-body"></div>
                </div>
            </div>
            <div id="mail-content-view" class="gx-modal" style="display:none; z-index:91;">
                <div class="gx-modal-content">
                    <div class="gx-modal-header"><button onclick="window.backToMailList()">←</button><span id="mail-detail-title"></span></div>
                    <div class="gx-modal-body">
                        <div id="mail-detail-sender" style="font-weight:bold; color:#ffcc00; margin-bottom:5px;"></div>
                        <div id="mail-detail-text"></div>
                    </div>
                </div>
            </div>
        `;

        phoneWrapper.appendChild(phoneScreen);
        document.body.appendChild(phoneWrapper);

        const terminalTrigger = document.createElement("div");
        terminalTrigger.className = "gx-terminal-trigger";
        document.body.appendChild(terminalTrigger);

        document.getElementById('login-btn').addEventListener('click', handleLogin);
        terminalTrigger.addEventListener("click", togglePhone);
        document.getElementById("gx-close").addEventListener("click", togglePhone);

        checkAuthOnStartup();
        setInterval(updateClock, 1000);
    });
})();

// --- 邏輯函數 ---
function handleLogin() {
    const id = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;
    const result = AuthSystem.checkLogin(id, pass);
    if (result.success) {
        localStorage.setItem('gx_user', JSON.stringify({ ...result.user, id: id }));
        document.getElementById('gx-login-overlay').style.display = 'none';
        renderAppGrid();
    } else {
        document.getElementById('login-error').innerText = result.message;
    }
}

function checkAuthOnStartup() {
    if (localStorage.getItem('gx_user')) {
        document.getElementById('gx-login-overlay').style.display = 'none';
        renderAppGrid();
    }
}

function renderAppGrid() {
    const grid = document.querySelector('.gx-app-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const userJson = localStorage.getItem('gx_user');
    if (!userJson) return;

    const appSettings = JSON.parse(localStorage.getItem('gx_app_settings')) || {};

    const allApps = [
        { id: 'app-mail', name: '信件匣', unlocked: true, iconPath: '../image/phone/mail.webp' },
        { id: 'app-logs', name: '系統日誌', title: '系統日誌', content: '數據未加密...', unlocked: true },
        { id: 'app-secret-files', name: '人員清單', title: '人員清單', content: '成員：阿強、小明、[數據已刪除]', unlocked: true },
        null, null, null, null, null, null, null, null, null
    ];

    allApps.forEach(app => {
        if (!app || !app.unlocked) return;

        app.stage = appSettings[app.id] || 1;

        const div = document.createElement('div');
        div.className = 'gx-app-item';

        if (app.iconPath) {
            const iconDiv = document.createElement('div');
            iconDiv.className = `app-icon stage-${app.stage}`;
            iconDiv.style.backgroundImage = `url('${app.iconPath}')`;
            div.appendChild(iconDiv);
        } else {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'gx-app-icon';
            iconDiv.innerText = app.icon || '📱';
            div.appendChild(iconDiv);
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'gx-app-name';
        nameSpan.innerText = app.name;
        div.appendChild(nameSpan);

        // 綁定點擊事件：信件匣呼叫外部函式，其他呼叫預設
        div.onclick = (app.id === 'app-mail') ? handleOpenMail : () => openApp(app.title, app.content);
        grid.appendChild(div);
    });
}

// 代理函數：負責將資料轉交給外部的 mail_system
function handleOpenMail() {
    const user = JSON.parse(localStorage.getItem('gx_user'));
    const databaseEntry = MAIL_DATABASE[user.id];
    const mailData = { ...user, mails: databaseEntry ? databaseEntry.mails : [] };
    
    // 呼叫外部郵件系統的入口
    launchMailApp(mailData);
}

function closeApp() {
    document.getElementById('gx-modal').style.display = 'none';
    // 郵件相關視圖歸零
    document.getElementById('mail-list-view').style.display = 'none';
    document.getElementById('mail-content-view').style.display = 'none';
}

function openApp(title, content) {
    document.getElementById('gx-modal').style.display = 'block';
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-text').innerText = content;
}

function togglePhone() {
    document.getElementById('gx-phone').classList.toggle("is-open");
}

function updateClock() {
    const el = document.getElementById('system-time');
    if (el) el.innerText = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: true });
}