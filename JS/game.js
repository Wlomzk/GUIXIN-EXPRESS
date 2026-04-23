// 歸心物流：系統核心邏輯 (js/game.js)

// 1. 定義物流資料庫 (那 25 個物件的家)
const gameDatabase = {
    "絳紅": {
        content: "「絳紅殘綢」：這是一段被時光磨損的絲綢，上面隱約可見靈舒的字跡。它曾在牧野分撥中心滯留了三百年，等待一個永遠不會來的收件人。"
    },
    "牧野": {
        content: "「牧野分撥中心地圖」：地圖標註了消失的座標。據說在深夜，地圖上的路徑會自行蠕動，指向歸心物流最神祕的禁區。"
    },
    // 總監，接下來的 23 個物件，妳之後可以照這個格式一直加下去...
};

// 2. 核心查詢功能 (我們把它掛在 window 上，讓 HTML 絕對找得到)
window.handleTrack = function() {
    const input = document.getElementById('trackInput');
    const resultArea = document.getElementById('search-result');
    const resultContent = document.getElementById('result-content');
    
    if (!input || !input.value.trim()) {
        alert("請輸入貨物檢索碼");
        return;
    }

    const keyword = input.value.trim();
    
    // 顯示搜尋結果區域
    resultArea.style.display = 'block';
    
    if (gameDatabase[keyword]) {
        // 抓到了！顯示故事
        resultContent.innerHTML = `<span class="text-[#3d3832] font-semibold">【檢索成功】</span><br>${gameDatabase[keyword].content}`;
        resultContent.style.color = '#3d3832';
    } else {
        // 沒抓到，顯示系統錯誤
        resultContent.innerHTML = `<span class="text-red-800 font-semibold">【查無此物】</span><br>警告：檢索碼「${keyword}」不存在於當前緯度，請確認輸入是否正確。`;
        resultContent.style.color = '#7f1d1d';
    }
};

// 3. 系統初始化檢查
document.addEventListener('DOMContentLoaded', () => {
    console.log("歸心系統：核心邏輯載入完成。");
});