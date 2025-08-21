// おみくじの結果データ
const OMIKUJI_RESULTS = [
    {
        name: "大吉",
        message: "とても良い運勢です。何事も順調に進むでしょう。",
        luck: "excellent"
    },
    {
        name: "中吉", 
        message: "良い運勢です。努力が実を結ぶでしょう。",
        luck: "good"
    },
    {
        name: "小吉",
        message: "まずまずの運勢です。謙虚な気持ちを大切に。",
        luck: "fair"
    },
    {
        name: "吉",
        message: "平穏な運勢です。現状維持を心がけて。",
        luck: "okay"
    },
    {
        name: "末吉",
        message: "後半に向けて運気が上昇します。諦めずに。",
        luck: "fair"
    },
    {
        name: "凶",
        message: "注意が必要な時期です。慎重に行動しましょう。",
        luck: "bad"
    },
    {
        name: "大凶",
        message: "困難な時期ですが、必ず良い時が来ます。",
        luck: "terrible"
    }
];

// DOM要素の取得
const drawButton = document.getElementById('draw-button');
const buttonText = drawButton.querySelector('.button-text');
const loadingSpinner = document.getElementById('loading-spinner');
const resultDisplay = document.getElementById('result-display');
const fortuneText = document.getElementById('fortune-text');
const fortuneMessage = document.getElementById('fortune-message');
const resultDate = document.getElementById('result-date');
const lastResult = document.getElementById('last-result');
const clearHistoryButton = document.getElementById('clear-history');

// ローカルストレージのキー
const STORAGE_KEY = 'omikuji_history';

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    loadLastResult();
    setupEventListeners();
});

// イベントリスナーの設定
function setupEventListeners() {
    drawButton.addEventListener('click', drawOmikuji);
    clearHistoryButton.addEventListener('click', clearHistory);
}

// おみくじを引く
async function drawOmikuji() {
    // ボタンを無効化
    drawButton.disabled = true;
    buttonText.style.opacity = '0';
    loadingSpinner.classList.remove('hidden');
    
    // 結果を隠す
    resultDisplay.classList.add('hidden');
    
    // アニメーション用の待機時間
    await sleep(1500);
    
    // ランダムに結果を選択
    const randomIndex = Math.floor(Math.random() * OMIKUJI_RESULTS.length);
    const result = OMIKUJI_RESULTS[randomIndex];
    
    // 結果を表示
    displayResult(result);
    
    // 結果を保存
    saveResult(result);
    
    // ボタンを元に戻す
    buttonText.style.opacity = '1';
    loadingSpinner.classList.add('hidden');
    drawButton.disabled = false;
    
    // バウンスアニメーション
    resultDisplay.classList.add('animate-bounce');
    setTimeout(() => {
        resultDisplay.classList.remove('animate-bounce');
    }, 800);
}

// 結果を表示
function displayResult(result) {
    fortuneText.textContent = result.name;
    fortuneMessage.textContent = result.message;
    resultDate.textContent = `引いた日時: ${formatDate(new Date())}`;
    
    // 運勢に応じて背景色を変更
    const resultCard = document.querySelector('.result-card');
    resultCard.className = 'result-card'; // リセット
    
    switch(result.luck) {
        case 'excellent':
            resultCard.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
            break;
        case 'good':
            resultCard.style.background = 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)';
            break;
        case 'fair':
            resultCard.style.background = 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)';
            break;
        case 'okay':
            resultCard.style.background = 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)';
            break;
        case 'bad':
            resultCard.style.background = 'linear-gradient(135deg, #fd79a8 0%, #e17055 100%)';
            break;
        case 'terrible':
            resultCard.style.background = 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)';
            break;
    }
    
    resultDisplay.classList.remove('hidden');
    resultDisplay.classList.add('animate-fadeIn');
    
    setTimeout(() => {
        resultDisplay.classList.remove('animate-fadeIn');
    }, 500);
}

// 結果をローカルストレージに保存
function saveResult(result) {
    const resultData = {
        ...result,
        date: new Date().toISOString(),
        timestamp: Date.now()
    };
    
    // 既存の履歴を取得
    let history = getHistory();
    
    // 新しい結果を追加
    history.unshift(resultData);
    
    // 最大10件まで保持
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // 保存
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    
    // 最後の結果表示を更新
    updateLastResultDisplay();
}

// 履歴を取得
function getHistory() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('履歴の読み込みに失敗しました:', error);
        return [];
    }
}

// 最後の結果を読み込み
function loadLastResult() {
    const history = getHistory();
    if (history.length > 0) {
        const lastResult = history[0];
        displayResult(lastResult);
        updateLastResultDisplay();
    }
}

// 最後の結果表示を更新
function updateLastResultDisplay() {
    const history = getHistory();
    if (history.length > 0) {
        const lastResultData = history[0];
        const dateStr = formatDate(new Date(lastResultData.date));
        lastResult.textContent = `最後に引いた結果: ${lastResultData.name} (${dateStr})`;
    } else {
        lastResult.textContent = 'まだおみくじを引いていません';
    }
}

// 履歴をクリア
function clearHistory() {
    if (confirm('本当に履歴を削除しますか？')) {
        localStorage.removeItem(STORAGE_KEY);
        resultDisplay.classList.add('hidden');
        lastResult.textContent = 'まだおみくじを引いていません';
        
        // 確認メッセージ
        showMessage('履歴を削除しました');
    }
}

// メッセージを表示
function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 2000);
}

// 日時をフォーマット
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// 非同期待機ヘルパー
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// エラーハンドリング
window.addEventListener('error', function(event) {
    console.error('エラーが発生しました:', event.error);
    showMessage('エラーが発生しました。ページを再読み込みしてください。');
});

// ローカルストレージのエラーハンドリング
window.addEventListener('storage', function(event) {
    if (event.key === STORAGE_KEY) {
        updateLastResultDisplay();
    }
});