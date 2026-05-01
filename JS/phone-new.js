/* ==============================
   歸心物流終端機 - 模組化 JS
   ============================== */

(function() {
    console.log("歸心物流終端機：外掛元件準備中...");

    // 1. 當網頁載入完成，開始建立元件
    document.addEventListener("DOMContentLoaded", function() {
        // --- 建立全域容器 (選用，不建也可以，直接加 body 比較快) ---
        
        // --- 2. 建立「終端機開關」 (釘在右下角) ---
        const terminalTrigger = document.createElement("div");
        terminalTrigger.className = "gx-terminal-trigger";
        terminalTrigger.id = "gx-trigger";
        terminalTrigger.setAttribute("title", "點擊啟動歸心終端 (貞人脈絡校準中...)");
        document.body.appendChild(terminalTrigger);

        // --- 3. 建立「手機主介面」 (隱藏在下方) ---
        const phoneScreen = document.createElement("div");
        phoneScreen.className = "gx-phone-screen";
        phoneScreen.id = "gx-phone";
        phoneScreen.innerHTML = `
            <div style="color:#32CD32; padding:50px; font-family:CourierNew;">
                [歸心物流終端]
                <br>----------------
                <br>系統載入中...
                <br>貞人脈絡比對... (OK)
                <br>時空座標錨定... (Tamsui-Dist)
            </div>
            
            <div id="gx-crack-overlay"></div>
        `;
        document.body.appendChild(phoneScreen);

        // --- 4. 註冊點擊事件 (互動邏輯) ---
        terminalTrigger.addEventListener("click", function() {
            // 切換手機螢幕的開啟/關閉狀態 (toggle)
            const isOpened = phoneScreen.classList.toggle("is-open");
            
            // 可以加點音效或狀態記憶
            if(isOpened) {
                console.log("【警告】歸心系統已啟動。");
                // localStorage.setItem('phoneStatus', 'open'); // 記憶狀態
            } else {
                console.log("歸心系統已離線。");
                // localStorage.setItem('phoneStatus', 'closed'); // 記憶狀態
            }
        });
        
        console.log("歸心物流終端機：骨架已掛載，等待貞人耦合。");
    });
})();