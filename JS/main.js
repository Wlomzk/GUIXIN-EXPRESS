// --- 模組引入 ---
import './firebase-init.js';
import { toggleMenu, showPage, updateHeroBanner } from './ui.js';
import { handleTrack, renderArchive } from './archive.js';

// --- 綁定事件初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. 執行基礎渲染
    renderArchive();
    updateHeroBanner();

    // 2. 綁定桌機導航連結
    // 使用 ?. 語法確保如果元素不存在也不會報錯
    document.getElementById('nav-home')?.addEventListener('click', () => showPage('home'));
    document.getElementById('nav-services')?.addEventListener('click', () => showPage('services'));
    document.getElementById('nav-locations')?.addEventListener('click', () => showPage('locations'));

    // 3. 綁定手機版導航連結
    document.getElementById('mobile-nav-home')?.addEventListener('click', () => showPage('home'));
    document.getElementById('mobile-nav-services')?.addEventListener('click', () => showPage('services'));
    document.getElementById('mobile-nav-locations')?.addEventListener('click', () => showPage('locations'));

    // 4. 綁定漢堡選單 (開啟與關閉)
    document.getElementById('mobile-menu-button')?.addEventListener('click', toggleMenu);
    document.getElementById('mobile-menu-close')?.addEventListener('click', toggleMenu);

    // 5. 綁定查詢按鈕
    document.getElementById('search-btn')?.addEventListener('click', handleTrack);

    // 6. 視窗調整監聽
    window.addEventListener('resize', updateHeroBanner);
});