/**
 * 歸心物流 - 關鍵字檢索與存檔系統 (Archive System)
 * 功能：處理貨物檢索碼查詢、存檔解鎖、以及歷史紀錄回看
 */

import { KEYWORD_DATABASE } from '../data/keyword_data.js';

// --- 【初始化區】讀取存檔 ---
// 從瀏覽器快取拿資料，若無則初始化為空陣列
let unlockedItems = JSON.parse(localStorage.getItem('guixin_archive')) || [];

/**
 * 【核心功能：貨物檢索】
 * 當玩家點擊「查詢」按鈕時觸發
 */
export function handleTrack() {
    const input = document.getElementById('trackInput');
    const resultContent = document.getElementById('result-content');
    const resultArea = document.getElementById('search-result');
    
    // 檢查輸入
    if (!input || !input.value.trim()) {
        alert("請掃描條碼或輸入貨物檢索碼");
        return;
    }

    const keyword = input.value.trim();
    const item = KEYWORD_DATABASE[keyword];

    // 顯示結果區域 (Container)
    if (resultArea) resultArea.style.display = 'block';

    if (item) {
        // 1. 抓取當下的系統時間 (格式如 14:30)
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // 2. 更新存檔數據
        const alreadyUnlocked = unlockedItems.find(u => u.id === keyword);
        if (!alreadyUnlocked) {
            unlockedItems.push({
                id: keyword,
                title: item.title,
                content: item.content,
                time: timeStr
            });
            localStorage.setItem('guixin_archive', JSON.stringify(unlockedItems));
        }

        // 3. 觸發介面更新
        showSearchResult(keyword);
        renderArchive();
    } else {
        // 錯誤顯示邏輯
        resultContent.innerHTML = `
            <span style="color: #7f1d1d; font-weight: bold;">【查無此物】</span><br>
            警告：檢索碼「<span class="italic">${keyword}</span>」不存在於當前緯度。
        `;
        resultContent.style.color = '#7f1d1d';
    }
}

/**
 * 【UI 功能：顯示查詢結果】
 * 負責將選定的資料內容渲染到畫面上方的顯示區
 * @param {string} keywordId - 關鍵字 ID (如：'絳紅')
 */
export function showSearchResult(keywordId) {
    const resultContent = document.getElementById('result-content');
    const resultArea = document.getElementById('search-result');
    
    // 從當前已解鎖數據中尋找內容
    const item = unlockedItems.find(u => u.id === keywordId);

    if (item && resultContent) {
        if (resultArea) resultArea.style.display = 'block';
        
        const displayTime = item.time || 'SYSTEM READY';
        
        resultContent.innerHTML = `
            <div class="text-[10px] opacity-40 font-mono tracking-widest mb-1">LOGGED AT: ${displayTime}</div>
            <span style="color: #3d3832; font-weight: bold;">【檢索成功】</span><br>
            「${item.title}」：${item.content}
        `;
        resultContent.style.color = '#3d3832';
    }
}

/**
 * 【UI 功能：渲染歷史存檔清單】
 * 負責把解鎖過的關鍵字生成可點擊的按鈕方塊
 */
export function renderArchive() {
    const archiveSection = document.getElementById('archive-section');
    const keywordList = document.getElementById('keyword-list');
    const completionRate = document.getElementById('completion-rate');

    if (!archiveSection || !keywordList) return;

    // 檢查是否有存檔，若有則顯示區塊
    if (unlockedItems.length > 0) {
        archiveSection.classList.remove('hidden');
        
        // --- 重要：先清空容器，防止方塊重複生成 ---
        keywordList.innerHTML = '';

        // 使用 JS 動態建立按鈕，確保點擊事件 100% 綁定
        unlockedItems.forEach(item => {
            const btn = document.createElement('button');
            btn.className = "px-3 py-1 bg-[#d9d4cc] text-[#3d3832] text-xs rounded border border-stone-300 shadow-sm hover:bg-[#c9c4bc] hover:border-stone-400 transition-all active:scale-95 animate-fade-in";
            btn.innerText = item.id;
            
            // 點擊行為：回看內容 + 閃爍動畫
            btn.addEventListener('click', () => {
                showSearchResult(item.id);
                
                const resultArea = document.getElementById('search-result');
                if (resultArea) {
                    resultArea.classList.add('animate-pulse');
                    setTimeout(() => resultArea.classList.remove('animate-pulse'), 500);
                }
            });

            keywordList.appendChild(btn);
        });
        
        // 更新進度計數
        if (completionRate) {
            completionRate.innerText = `PROGRESS: ${unlockedItems.length} / 25`;
        }
    }
}

// --- 【全域初始化掛載】 ---

// 1. 將關鍵函式掛載至 window 供外部或同步系統使用
window.showSearchResult = showSearchResult;

// 2. 頁面啟動時自動延時渲染一次 (確保 DOM 已完全載入)
setTimeout(() => {
    renderArchive();
}, 200);