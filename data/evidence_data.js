// evidence_data.js
export const EVIDENCE_DATABASE = [
    { 
        id: 'ev_001', 
        type: 'image', 
        title: '紅包裡的頭髮',
        content: '紅包殘骸，內含一束黑髮與寫著生辰八字的紙條，散發出淡淡的陳舊檀香味。' , 
        imagePath: 'image/stop-sad.webp',
        timeType: "dynamic", // 代表這要抓玩家的系統時間
        unlockedTime: null ,   // 初始值為空
        isLocked: true  // 預設鎖住，玩家在列表看不到它
    },
    { 
        id: 'ev_002', 
        type: 'text', 
        title: '貞人的卜辭殘片', 
        content: '「...神靈收回命...冥槐下見...」這是從物流包裹裡掉出來的古老竹片，上面的墨跡似乎在扭動。'  ,
        timeType: "static",  // 代表這要用妳指定的死時間
        fixedTime: "1994/07/15 04:44" ,
        isLocked: false  // 這個證據一開始就解鎖了，玩家一開始就能看到它
    },
    { 
        id: 'ev_003', 
        type: 'image', 
        title: '物流車內的血手印', 
        content: '拍攝於淡水物流車門內側。這不是紅色的顏料，系統檢測顯示為「無法辨識的有機物質」。'  ,
        imagePath: 'image/stop-sad.webp',
        timeType: "dynamic", // 代表這要抓玩家的系統時間
        unlockedTime: null ,   // 初始值為空 
        isLocked: false  // 這個證據一開始就解鎖了，玩家一開始就能看到它
    }
];