// JS/game.js

// 1. 引入倉庫（確保 keyword.js 裡有寫 export const ARCHIVE_DATABASE）
import { ARCHIVE_DATABASE } from '../data/keyword.js';

// --- [ 1. 手機版全螢幕選單控制 ] ---
window.toggleMenu = function() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        document.body.style.overflow = 'hidden';
    } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        document.body.style.overflow = '';
    }
};

// --- [ 2. 核心資料與成就系統 ] ---
let unlockedItems = JSON.parse(localStorage.getItem('guixin_archive')) || [];

window.handleTrack = function() {
    const input = document.getElementById('trackInput');
    const resultContent = document.getElementById('result-content');
    const resultArea = document.getElementById('search-result');
    
    if (!input || !input.value.trim()) {
        alert("請輸入貨物檢索碼");
        return;
    }

    const keyword = input.value.trim();
    resultArea.style.display = 'block';

    // 從 keyword.js 讀取資料
    const item = ARCHIVE_DATABASE[keyword];

    if (item) {
        // 檢索成功：渲染資料並解鎖成就
        resultContent.innerHTML = `<span style="color: #3d3832; font-weight: bold;">【檢索成功】</span><br>「${item.title}」：${item.content}`;
        resultContent.style.color = '#3d3832';

        if (!unlockedItems.includes(keyword)) {
            unlockedItems.push(keyword);
            localStorage.setItem('guixin_archive', JSON.stringify(unlockedItems));
        }
        renderArchive();
    } else {
        // 檢索失敗
        resultContent.innerHTML = `<span style="color: #7f1d1d; font-weight: bold;">【查無此物】</span><br>警告：檢索碼「${keyword}」不存在於當前緯度。`;
        resultContent.style.color = '#7f1d1d';
    }
};

function renderArchive() {
    const archiveSection = document.getElementById('archive-section');
    const keywordList = document.getElementById('keyword-list');
    const completionRate = document.getElementById('completion-rate');

    if (!archiveSection || !keywordList) return;

    if (unlockedItems.length > 0) {
        archiveSection.classList.remove('hidden');
        keywordList.innerHTML = unlockedItems.map(item => 
            `<span class="px-3 py-1 bg-[#d9d4cc] text-[#3d3832] text-xs rounded border border-stone-300 shadow-sm animate-fade-in">${item}</span>`
        ).join('');
        completionRate.innerText = `PROGRESS: ${unlockedItems.length} / 25`;
    }
}

// --- [ 3. 頁面切換邏輯 ] ---
window.showPage = function(pageName) {
    const pages = ['page-home', 'page-services', 'page-locations'];
    
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    const target = document.getElementById('page-' + pageName);
    if (target) target.classList.remove('hidden');
    
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        toggleMenu();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- [ 4. 事件監聽初始化 ] ---
document.addEventListener('DOMContentLoaded', () => {
    renderArchive();

    const menuBtn = document.getElementById('mobile-menu-button');
    const closeBtn = document.getElementById('close-menu');
    const overlay = document.getElementById('menu-overlay');

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
});