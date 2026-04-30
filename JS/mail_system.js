import { MAIL_DATABASE } from '../data/mail_data.js';

// --- 全域變數（狀態紀錄） ---
let currentUser = null;    // 紀錄當前登入的使用者資料物件
let currentMails = [];     // 紀錄該使用者的郵件清單

// 從 localStorage 讀取已讀紀錄，使用 Set 方便查找與去重
let readMails = new Set(JSON.parse(localStorage.getItem('readMails') || '[]')); 

export function initMailSystem() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.onclick = () => checkLogin(); 
    }
    // 初始化畫面
    refreshMailUI();
}

function refreshMailUI() {
    const loginView = document.getElementById('login-view');
    const mailView = document.getElementById('mail-view');
    const winTitle = document.querySelector('#win-mail .win-header span');

    if (currentUser) {
        loginView.style.display = 'none';
        mailView.style.display = 'flex';
        winTitle.innerText = `郵件系統 - ${currentUser.userName}`;
        renderMailList();
    } else {
        loginView.style.display = 'flex';
        mailView.style.display = 'none';
        winTitle.innerText = `郵件系統 - 請登入`;
    }
}

function checkLogin() {
    const id = document.getElementById('user-id').value.trim();
    const pass = document.getElementById('user-pass').value.trim();
    const errorMsg = document.getElementById('login-error');
    const mailBody = document.getElementById('mail-body');

    if (MAIL_DATABASE[id] && pass === "HOME666") {
        currentUser = MAIL_DATABASE[id];
        currentMails = currentUser.mails;
        refreshMailUI();
    } else {
        if(errorMsg) errorMsg.style.opacity = '1';
        if(mailBody) mailBody.style.background = 'rgba(255, 0, 0, 0.1)';
        setTimeout(() => {
            if(mailBody) mailBody.style.background = 'transparent';
            if(errorMsg) errorMsg.style.opacity = '0';
        }, 800);
    }
}

function renderMailList() {
    const mailView = document.getElementById('mail-view');
    if (!mailView) return;
    mailView.innerHTML = ''; 

    currentMails.forEach((mail, index) => {
        const div = document.createElement('div');
        const isRead = readMails.has(mail.id);
        
        // 增加一個 mail-item 類別，並根據已讀狀態增加 read/unread
        div.className = `mail-item ${isRead ? 'read' : 'unread'}`;
        div.style.cursor = 'pointer';
        div.style.padding = '10px';
        div.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';

        // 構建 HTML
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="mail-title" style="font-weight: ${isRead ? 'normal' : 'bold'}; color: ${isRead ? '#777' : '#deff9a'};">
                    ${isRead ? '✉' : '📩'} ${mail.title}
                </span>
            </div>
            <div class="mail-date" style="align-self: flex-end; font-size: 0.65rem; color: ${isRead ? '#444' : '#666'}; margin-top: 4px;">
                ${mail.date || '2024/10/24'}
            </div>
        `;
        
        div.onclick = () => {
            // 標記為已讀
            if (!readMails.has(mail.id)) {
                readMails.add(mail.id);
                saveReadStatus();
            }
            showMailDetail(index);
        };
        mailView.appendChild(div);
    });
}

function showMailDetail(index) {
    const mail = currentMails[index];
    const mailView = document.getElementById('mail-view');
    if (!mailView) return;
    
    mailView.innerHTML = `
        <div style="margin-bottom: 15px; border-bottom: 1px solid rgba(222,255,154,0.3); padding-bottom: 5px;">
            <div id="back-to-list" style="cursor:pointer; color:#aaa; font-size:0.7rem; margin-bottom:5px;">[ ← 返回郵件列表 ]</div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
                <div style="color:#deff9a; font-weight:bold; font-size:1rem;">${mail.title}</div>
                <div style="color:#555; font-size:0.65rem;">${mail.date || '2024/10/24'}</div>
            </div>
            <div style="color:#888; font-size:0.65rem; margin-top:5px;">寄件者: ${mail.sender || '系統'}</div>
        </div>
        <div class="mail-content-text" style="font-size:0.85rem; line-height:1.6; color:#daffde; white-space: pre-wrap; height: 180px; overflow-y: auto;">${mail.content}</div>
    `;

    document.getElementById('back-to-list').onclick = renderMailList;
}

function saveReadStatus() {
    localStorage.setItem('readMails', JSON.stringify(Array.from(readMails)));
}

export function logout() {
    currentUser = null;
    currentMails = [];
    refreshMailUI();
}

window.checkLogin = checkLogin;