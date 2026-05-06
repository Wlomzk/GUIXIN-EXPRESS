/* ==========================================================
   phone-new.js (UI 介面層 - 已完整恢復 12 格邏輯與隱藏機制)
   ========================================================== */

import { AuthSystem } from '../data/whoiswatching.js';
import { MAIL_DATABASE } from '../data/mail_data.js';

// --- 全域函數掛載 ---
window.closeApp = closeApp;
window.backToMailList = backToMailList;
window.openApp = openApp;

let currentUserMailData = null;

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
                    <span id="battery-text">100%</span>
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
                    <div class="gx-modal-header"><button onclick="backToMailList()">←</button><span id="mail-detail-title"></span></div>
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

    // 定義 12 個格子
    const allApps = [
        { id: 'app-logs', name: '系統日誌', icon: '🖥️', title: '系統日誌', content: '數據未加密...', unlocked: true },
        { id: 'app-secret-files', name: '人員清單', icon: '👤', title: '人員清單', content: '成員：阿強、小明、[數據已刪除]', unlocked: false },
        { id: 'app-mail', name: '郵件系統', icon: '../image/phone/mail.webp', unlocked: true },
        // 下面為預留空位
        null, null, null, null, null, null, null, null, null
    ];

    // 改良後的渲染邏輯：只渲染存在的 APP
    allApps.forEach(app => {
        // 如果是 null，直接跳過，這樣就不會佔位，CSS Grid 會自動往左上補滿
        if (!app || !app.unlocked) return;

        const div = document.createElement('div');
        div.className = 'gx-app-item';
        
        div.innerHTML = app.icon.startsWith('../') ? `<img src="${app.icon}" width="30">` : `<div class="gx-app-icon">${app.icon}</div>`;
        div.innerHTML += `<span class="gx-app-name">${app.name}</span>`;
        
        if (app.id === 'app-mail') {
            div.onclick = openMailApp;
        } else {
            div.onclick = () => openApp(app.title, app.content);
        }
        
        grid.appendChild(div);
    });
}

function openMailApp() {
    const user = JSON.parse(localStorage.getItem('gx_user'));
    const databaseEntry = MAIL_DATABASE[user.id];
    currentUserMailData = { name: user.name, mails: databaseEntry ? databaseEntry.mails : [] };
    
    document.getElementById('mail-list-view').style.display = 'block';
    document.getElementById('mail-win-title').innerText = `系統郵件 - ${currentUserMailData.name}`;
    
    const container = document.getElementById('mail-items-container');
    container.innerHTML = '';
    currentUserMailData.mails.filter(m => m.unlocked).forEach(mail => {
        const div = document.createElement('div');
        div.className = 'mail-item';
        div.style.padding = '10px'; div.style.borderBottom = '1px solid #444';
        div.innerHTML = `<div>${mail.title}</div><div style="font-size:10px;color:#888;">${mail.date}</div>`;
        div.onclick = () => showMailDetail(mail);
        container.appendChild(div);
    });
}

function showMailDetail(mail) {
    document.getElementById('mail-list-view').style.display = 'none';
    document.getElementById('mail-content-view').style.display = 'block';
    document.getElementById('mail-detail-title').innerText = mail.title;
    document.getElementById('mail-detail-sender').innerText = `寄件者: ${mail.sender || '歸心物流中心'}`;
    document.getElementById('mail-detail-text').innerText = mail.content;
}

function backToMailList() {
    document.getElementById('mail-content-view').style.display = 'none';
    document.getElementById('mail-list-view').style.display = 'block';
}

function closeApp() {
    document.getElementById('gx-modal').style.display = 'none';
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