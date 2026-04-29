import { MAIL_DATABASE } from '../data/mail_data.js';

// --- 全域變數（狀態紀錄） ---
let currentUser = null;    // 紀錄當前登入的使用者資料物件
let currentMails = [];     // 紀錄該使用者的郵件清單

// 從 localStorage 讀取已讀紀錄，若無則建立新的 Set
let readMails = new Set(JSON.parse(localStorage.getItem('readMails') || '[]')); 

export function initMailSystem() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        // 使用箭頭函式避免 this 指向問題
        loginBtn.onclick = () => checkLogin(); 
    }

    // 初始化時，根據是否有 currentUser 來決定顯示哪個畫面
    refreshMailUI();
}

function refreshMailUI() {
    const loginView = document.getElementById('login-view');
    const mailView = document.getElementById('mail-view');
    const winTitle = document.querySelector('#win-mail .win-header span');

    if (currentUser) {
        // 已登入狀態
        loginView.style.display = 'none';
        mailView.style.display = 'flex';
        winTitle.innerText = `郵件系統 - ${currentUser.userName}`;
        renderMailList();
    } else {
        // 未登入狀態
        loginView.style.display = 'flex';
        mailView.style.display = 'none';
        winTitle.innerText = `郵件系統 - 請登入`;
    }
}

function checkLogin() {
    const id = document.getElementById('user-id').value;
    const pass = document.getElementById('user-pass').value;
    const errorMsg = document.getElementById('login-error');
    const mailBody = document.getElementById('mail-body');

    // 驗證邏輯
    if (MAIL_DATABASE[id] && pass === "HOME666") {
        // 登入成功：存入狀態
        currentUser = MAIL_DATABASE[id];
        currentMails = currentUser.mails;
        
        refreshMailUI(); // 刷新畫面
    } else {
        // 登入失敗：特效
        errorMsg.style.opacity = '1';
        mailBody.style.background = 'rgba(255, 0, 0, 0.1)';
        setTimeout(() => {
            mailBody.style.background = 'transparent';
            errorMsg.style.opacity = '0';
        }, 800);
    }
}

function renderMailList() {
    const mailView = document.getElementById('mail-view');
    mailView.innerHTML = ''; 

    currentMails.forEach((mail, index) => {
        const div = document.createElement('div');
        div.className = 'mail-item';
        
        const isRead = readMails.has(mail.id);
        div.style.color = isRead ? '#777' : '#deff9a';
        div.innerHTML = `${isRead ? '✉' : '📩'} ${mail.title}`; // 未讀用收件箱圖示更直觀
        
        div.onclick = () => {
            // 更新已讀狀態並存入 localStorage
            readMails.add(mail.id);
            saveReadStatus();
            
            showMailDetail(index);
        };
        mailView.appendChild(div);
    });
}

function showMailDetail(index) {
    const mail = currentMails[index];
    const mailView = document.getElementById('mail-view');
    
    mailView.innerHTML = `
        <div style="margin-bottom: 15px; border-bottom: 1px solid rgba(222,255,154,0.3); padding-bottom: 5px;">
            <div id="back-to-list" style="cursor:pointer; color:#aaa; font-size:0.7rem; margin-bottom:5px;">[ ← 返回郵件列表 ]</div>
            <div style="color:#deff9a; font-weight:bold;">${mail.title}</div>
            <div style="color:#888; font-size:0.6rem;">寄件者: ${mail.sender || '系統'}</div>
        </div>
        <div class="mail-content-text" style="font-size:0.8rem; line-height:1.6; color:#daffde; white-space: pre-wrap;">${mail.content}</div>
    `;

    document.getElementById('back-to-list').onclick = renderMailList;
}

// 輔助函式：儲存已讀紀錄
function saveReadStatus() {
    localStorage.setItem('readMails', JSON.stringify(Array.from(readMails)));
}

// 導出登出功能
export function logout() {
    currentUser = null;
    currentMails = [];
    refreshMailUI();
}

/* 預留 */
// TODO: 之後增加伺服器驗證與加密邏輯

window.checkLogin = checkLogin;