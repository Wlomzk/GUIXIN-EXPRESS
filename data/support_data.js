/* ==========================================================
   support_data.js - 歸心物流通訊文本庫 (Base64)
   ========================================================== */
export const SUPPORT_DATABASE = {
    // 初始登入後的自動訊息
    "system_init": "W+W3oee6r+mAmuiomuioremMmF0g6Y6Y56u76YCj6YGTIDQwNCDlt7I", // [遠端通訊紀錄] 專員 404 已上線
    
    // 根據劇情的對話
    "stages": {
        "1": [
            { sender: "bot", content: "6Kqq5b+D54mp5rWB77yM5L2/5ZG95b+F6YGU44CC" }, // 歸心物流，使命必達。
            { sender: "bot", content: "5Y+45py6IDg5NjQg77yM6KuL56m65Y2z5Z+36KGM57m85Yiw5YmN5b6A5behen" } // 司機 8964，請立即執行編號前往淡水大廟。
        ],
        "2": [
            { sender: "bot", content: "57O757Wx56m66Yp677yM6KuL56iN5b6M5YaN6Kmm" } // 系統繁忙，請稍後再試
        ]
    },

    // 關鍵字觸發 (精確匹配用)
    "triggers": {
        "help": "5rKh5pyJ5Lq66IO95bmr5L2g44CC", // 沒有人能幫妳。
        "who": "5oiR5Yid5piv5L2g77yM5L2g5b6M5piv5oiR44CC" // 我初是妳，妳後是我。
    },

    // --- [ 拉姆新增：模糊判定關鍵字庫 ] ---
    "fuzzy_triggers": {
        "靈舒": "5Zi75Zi7Li4uLuS9oOetieS4jeWPiuS6huWXpS4u5oiR5Lmf5piv5ZS3Li4uLg==" 
        // 翻譯：嘻嘻....你等不及了嗎..我也是唷....
    }
};