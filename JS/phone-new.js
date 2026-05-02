/* ==============================
   歸心物流終端機 - 修正後的 JS 模組
   ============================== */

(function() {
    console.log("歸心物流終端機：系統校準中...");

    document.addEventListener("DOMContentLoaded", function() {
        // 1. 建立「外層容器」 (Wrapper) - 這是 CSS 負責處理動畫的目標
        const phoneWrapper = document.createElement("div");
        phoneWrapper.className = "gx-phone-wrapper";
        phoneWrapper.id = "gx-phone"; // 保持 ID，方便控制

        // 2. 建立「手機主介面」 (Screen)
        const phoneScreen = document.createElement("div");
        phoneScreen.className = "gx-phone-screen";
        phoneScreen.innerHTML = `
            <div style="color:#32CD32; padding:50px; font-family:Courier New, monospace;">
                [歸心物流終端]<br>
                ----------------<br>
                系統已就緒...<br>
                貞人脈絡：已耦合<br>
                座標：Tamsui-Dist
            </div>
            <div id="gx-crack-overlay"></div>
        `;

        // 3. 組裝結構：把 screen 放進 wrapper 裡
        phoneWrapper.appendChild(phoneScreen);
        document.body.appendChild(phoneWrapper);

        // 4. 建立「終端機開關」
        const terminalTrigger = document.createElement("div");
        terminalTrigger.className = "gx-terminal-trigger";
        terminalTrigger.innerHTML = ""; // 已經有 ::after 偽元素了
        document.body.appendChild(terminalTrigger);

        // 5. 註冊點擊事件
        terminalTrigger.addEventListener("click", function() {
            // 切換的是外層容器的 class，CSS 才能正確觸發 transform 動畫
            phoneWrapper.classList.toggle("is-open");
            
            console.log("歸心系統狀態變更...");
        });

        console.log("歸心物流終端機：骨架已掛載，等待貞人啟動。");
    });
})();