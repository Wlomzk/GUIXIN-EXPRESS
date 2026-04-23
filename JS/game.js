const gameDatabase = {
        "絳紅": { link: "red-silk.html", hint: "那是靈舒最後遺留下的顏色，懸掛於千年之木。" },
        "RED-SILK": { link: "red-silk.html", hint: "那是靈舒最後遺留下的顏色，懸掛於千年之木。" },
        "牧野": { link: "muye.html", hint: "消失的分撥中心，藏著不為人知的過去。" }
    };

    let unlockedKeywords = JSON.parse(localStorage.getItem('guixin_archive')) || [];
    const TOTAL_KEYWORDS = 20;

    window.onload = function() {
        if (unlockedKeywords.length > 0) {
            document.getElementById('archive-section').classList.remove('hidden');
        }
        unlockedKeywords.forEach(key => renderKeywordBox(key));
        updateProgress(false);
    };

    function handleTrack() {
        const input = document.getElementById('trackInput');
        const _raw = input.value.trim().toUpperCase(); 
        if (!_raw) return;

        document.getElementById('search-result').style.display = "block";

        if (gameDatabase[_raw]) {
            const foundKey = (_raw === "RED-SILK") ? "絳紅" : _raw;
            document.getElementById('archive-section').classList.remove('hidden');
            document.getElementById('result-content').innerText = ` [ 系統檢索成功 ] \n\n 物件：『${foundKey}』 \n 狀態：配送異常 - 滯留中。 \n\n 

※ 提示：${gameDatabase[_raw].hint}`;

            if (!unlockedKeywords.includes(foundKey)) {
                unlockedKeywords.push(foundKey);
                localStorage.setItem('guixin_archive', JSON.stringify(unlockedKeywords));
                renderKeywordBox(foundKey);
                updateProgress(true);
            }
        } else {
            document.getElementById('result-content').innerText = " [ 檢索結果 ] \n\n 查無此單號。";
        }
        input.value = "";
    }

    function renderKeywordBox(key) {
        const list = document.getElementById('keyword-list');
        const box = document.createElement('a');
        const dataKey = (key === "絳紅") ? "絳紅" : key;
        box.href = gameDatabase[dataKey] ? gameDatabase[dataKey].link : "#";
        box.className = "px-3 py-1 border border-stone-300 text-[11px] tracking-widest text-stone-500 hover:bg-[#4a443e] hover:text-[#d9d4cc] 

transition-all italic group";
        box.innerHTML = `# ${key} <span class="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>`;
        list.appendChild(box);
    }

    function updateProgress(animate = false) {
        const rate = document.getElementById('completion-rate');
        rate.innerText = `PROGRESS: ${unlockedKeywords.length} / ${TOTAL_KEYWORDS}`;
        if (animate) {
            rate.classList.remove('animate-pop');
            void rate.offsetWidth; 
            rate.classList.add('animate-pop');
        }
    }

    document.getElementById('trackInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') handleTrack(); });
    document.getElementById('collect-link').onclick = () => alert("這裡收集了那些暫時找不到家的小物件。");
// 手機選單開關邏輯
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeBtn = document.getElementById('close-menu');

menuBtn.onclick = () => mobileMenu.classList.remove('hidden');
closeBtn.onclick = () => mobileMenu.classList.add('hidden');

// 點擊選單內的連結後也自動關閉
document.querySelectorAll('.mobile-link').forEach(link => {
    link.onclick = () => mobileMenu.classList.add('hidden');
});