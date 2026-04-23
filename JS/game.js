// 歸心物流：修正版核心邏輯
window.handleTrack = function() {
    console.log("系統：開始檢索...");
    const input = document.getElementById('trackInput');
    const resultContent = document.getElementById('result-content');
    const resultArea = document.getElementById('search-result');
    
    if (!input || !input.value.trim()) {
        alert("請輸入檢索碼");
        return;
    }

    const keyword = input.value.trim().toUpperCase(); // 自動轉大寫，防呆
    
    // 物件資料庫
    const db = {
        "RED-SILK": "「絳紅殘綢」：這是一段被時光磨損的絲綢，上面隱約可見靈舒的字跡。",
        "MUYE": "「牧野分撥中心地圖」：地圖標註了消失的座標。",
        "絳紅": "「絳紅殘綢」：這是一段被時光磨損的絲綢，上面隱約可見靈舒的字跡。"
    };

    resultArea.style.display = 'block';

    if (db[keyword]) {
        resultContent.innerHTML = `<span style="color: #3d3832; font-weight: bold;">【檢索成功】</span><br>${db[keyword]}`;
    } else {
        resultContent.innerHTML = `<span style="color: #7f1d1d; font-weight: bold;">【查無此物】</span><br>警告：檢索碼「${keyword}」不存在。`;
    }
};

console.log("歸心系統：JS 載入成功，等待指令。");