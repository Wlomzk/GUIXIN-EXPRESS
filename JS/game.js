// 歸心物流：核心邏輯（含成就系統）

// 1. 初始化已解鎖清單
let unlockedItems = JSON.parse(localStorage.getItem('guixin_archive')) || [];

window.handleTrack = function() {
    const input = document.getElementById('trackInput');
    const resultContent = document.getElementById('result-content');
    const resultArea = document.getElementById('search-result');
    const archiveSection = document.getElementById('archive-section');
    
    if (!input || !input.value.trim()) {
        alert("請輸入檢索碼");
        return;
    }

    const keyword = input.value.trim();
    
    const db = {
        "絳紅": "「絳紅殘綢」：這是一段被時光磨損的絲綢，上面隱約可見靈舒的字跡。",
        "牧野": "「牧野分撥中心地圖」：地圖標註了消失的座標。",
        "天青": "「天青釉碎」：來自汝窯的殘片，據說能聽見雨落的聲音。"
        // 總監，妳之後可以在這裡繼續擴充到 25 個
    };

    resultArea.style.display = 'block';

    if (db[keyword]) {
        resultContent.innerHTML = `<span style="color: #3d3832; font-weight: bold;">【檢索成功】</span><br>${db[keyword]}`;
        
        // 紀錄成就
        if (!unlockedItems.includes(keyword)) {
            unlockedItems.push(keyword);
            localStorage.setItem('guixin_archive', JSON.stringify(unlockedItems));
        }
        renderArchive();
    } else {
        resultContent.innerHTML = `<span style="color: #7f1d1d; font-weight: bold;">【查無此物】</span><br>警告：檢索碼「${keyword}」不存在。`;
    }
};

// 2. 渲染已解鎖清單的功能
function renderArchive() {
    const archiveSection = document.getElementById('archive-section');
    const keywordList = document.getElementById('keyword-list');
    const completionRate = document.getElementById('completion-rate');

    if (unlockedItems.length > 0) {
        archiveSection.classList.remove('hidden'); // 顯示區塊
        keywordList.innerHTML = unlockedItems.map(item => 
            `<span class="px-3 py-1 bg-[#d9d4cc] text-[#3d3832] text-xs rounded border border-stone-300 shadow-sm animate-fade-in">${item}</span>`
        ).join('');
        completionRate.innerText = `PROGRESS: ${unlockedItems.length} / 25`;
    }
}

// 3. 網頁載入後自動跑一次
document.addEventListener('DOMContentLoaded', () => {
    console.log("歸心系統：已就緒");
    renderArchive(); 
});