document.addEventListener('DOMContentLoaded', function() {
    const planContainer = document.getElementById('plan-container');
    const addPlanButton = document.getElementById('add-plan-button');
    const generateButton = document.getElementById('generate-button');
    const outputContainer = document.getElementById('output-container');

    const subjectOptions = ['数学', '英語', '国語', '理科', '社会', '物理', '化学', '生物', '地学', '世界史', '日本史', '地理', 'その他'];

    // --- プレースホルダーの定義 ---
    const generalPlaceholders = ['振り返り', '理想・目標', '現状', '解決策'];
    const personalPlaceholders = [
        '振り返り（1.現状:プラスとマイナス≒問題）',
        '理想・目標（2.理想:一つ上のステータス,マイナス部分をなくすこと 4.課題≒原因）', 
        '現状（3.原因(現状と理想のギャップの原因) 3.5真因）', 
        '具体的な行動・勉強方法（5.解決策(課題の具体化)）'
    ];

    // URLをチェックして静的な入力欄のプレースホルダーを切り替える
    function setStaticPlaceholders() {
        const urlParams = window.location.search;
        const homeworkReviewTextarea = document.getElementById('homework-review');
        const testReviewTextarea = document.getElementById('test-review');

        if (urlParams.includes('my-mode')) {
            // 自分用の詳しいプレースホルダーを設定
            homeworkReviewTextarea.placeholder = '例:宿題が全て達成できています！この調子で進めていきましょう！';
            testReviewTextarea.placeholder = '例:単語、文法ともに8割を超えていて素晴らしいです！ + 求めるものなど';
        } else {
            // 一般向けのプレースホルダーを設定
            homeworkReviewTextarea.placeholder = '';
            testReviewTextarea.placeholder = '';
        }
    }


    function createPlanCard() {
        let placeholdersToUse = generalPlaceholders;
        const urlParams = window.location.search;
        if (urlParams.includes('my-mode')) {
            placeholdersToUse = personalPlaceholders;
        }

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('plan-card');
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('plan-card-header');
        const selectElement = document.createElement('select');
        subjectOptions.forEach(subjectName => {
            const option = document.createElement('option');
            option.value = subjectName;
            option.textContent = subjectName;
            selectElement.appendChild(option)
        });
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.textContent = 'ー';
        removeButton.addEventListener('click', () => {
            planContainer.removeChild(cardDiv)
        });
        cardHeader.appendChild(selectElement);
        cardHeader.appendChild(removeButton);
        const cardBody = document.createElement('div');
        cardBody.classList.add('plan-card-body');
        
        const inputClasses = ['review-input', 'goal-input', 'situation-input', 'solution-input'];

        for (let i = 0; i < placeholdersToUse.length; i++) {
            const textarea = document.createElement('textarea');
            textarea.classList.add('plan-input');
            textarea.classList.add(inputClasses[i]);
            textarea.placeholder = placeholdersToUse[i];
            cardBody.appendChild(textarea)
        }
        cardDiv.appendChild(cardHeader);
        cardDiv.appendChild(cardBody);
        planContainer.appendChild(cardDiv)
    }
    
    function createBox(title, lines) {
        const boxDiv = document.createElement('div');
        boxDiv.classList.add('output-box');
        const boxHeader = document.createElement('div');
        boxHeader.classList.add('output-box-header');
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        const copyButton = document.createElement('button');
        copyButton.classList.add('copy-button');
        copyButton.textContent = 'コピー';
        const contentElement = document.createElement('pre');
        const contentText = lines.join('\n\n');
        contentElement.textContent = contentText;
        copyButton.addEventListener('click', () => {
            const fullTextToCopy = `${title}\n${contentText}`;
            navigator.clipboard.writeText(fullTextToCopy).then(() => {
                copyButton.textContent = 'コピー完了！';
                setTimeout(() => {
                    copyButton.textContent = 'コピー'
                }, 2000)
            }).catch(err => {
                console.error('コピーに失敗しました', err);
                copyButton.textContent = '失敗';
                setTimeout(() => {
                    copyButton.textContent = 'コピー'
                }, 2000)
            })
        });
        boxHeader.appendChild(titleElement);
        boxHeader.appendChild(copyButton);
        boxDiv.appendChild(boxHeader);
        boxDiv.appendChild(contentElement);
        return boxDiv
    }
    
    function generateReport() {
        outputContainer.innerHTML = '';
        const planCards = document.querySelectorAll('.plan-card');
        
        const subjectReviewLines = [],
            goalLines = [],
            situationLines = [],
            solutionLines = [];

        planCards.forEach(card => {
            const subject = card.querySelector('select').value;
            const review = card.querySelector('.review-input').value.trim();
            const goal = card.querySelector('.goal-input').value.trim();
            const situation = card.querySelector('.situation-input').value.trim();
            const solution = card.querySelector('.solution-input').value.trim();

            // ★変更点: ここから '→ ' を削除しました
            if (review) subjectReviewLines.push(`⚪︎ ${subject}\n${review}`);
            if (goal) goalLines.push(`⚪︎ ${subject}\n${goal}`);
            if (situation) situationLines.push(`⚪︎ ${subject}\n${situation}`);
            if (solution) solutionLines.push(`⚪︎ ${subject}\n${solution}`)
        });

        const homeworkReview = document.getElementById('homework-review').value.trim();
        const testReview = document.getElementById('test-review').value.trim();
        const eventsNotes = document.getElementById('events-notes').value.trim();
        const otherNotes = document.getElementById('other-notes').value.trim();
        
        const reviewLines = [];
        // ★変更点: ここからも '→ ' を削除しました
        if (homeworkReview) reviewLines.push(`⚪︎ 宿題の達成度、完成度\n${homeworkReview}`);
        if (testReview) reviewLines.push(`⚪︎ 確認テストの結果\n${testReview}`);
        
        const notesLines = [];
        // ★変更点: ここからも '→ ' を削除しました
        if (eventsNotes) notesLines.push(`⚪︎ 行事・テスト等のイベント\n${eventsNotes}`);
        if (otherNotes) notesLines.push(`⚪︎ その他\n${otherNotes}`);
        
        if (reviewLines.length > 0) outputContainer.appendChild(createBox('【宿題/確認テストの振り返り】', reviewLines));
        if (notesLines.length > 0) outputContainer.appendChild(createBox('【特記事項】', notesLines));
        
        if (subjectReviewLines.length > 0) outputContainer.appendChild(createBox('【振り返り】', subjectReviewLines));
        
        if (goalLines.length > 0) outputContainer.appendChild(createBox('【理想・目標】', goalLines));
        if (situationLines.length > 0) outputContainer.appendChild(createBox('【現状】', situationLines));
        if (solutionLines.length > 0) outputContainer.appendChild(createBox('【具体的な行動・勉強法】', solutionLines));
        
        recordUsageLog(); // アクセスログを送信
    }

    // アクセスログを送信する関数
    function recordUsageLog() {
        // 先ほどコピーしたGASのウェブアプリURLをここに貼る
        const gasUrl = 'https://script.google.com/macros/s/AKfycbycUXpyHuHlFImFPHY_RR0lszWgWnTZZIs2KgA-8Z7laJjS4H0LH4UvNuywg0XzXPkg/exec'; 

        // 1. 端末を識別するIDをlocalStorageで管理（なければランダム生成）
        let deviceId = localStorage.getItem('takeda_device_id');
        if (!deviceId) {
            deviceId = 'PC-' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('takeda_device_id', deviceId);
        }

        // 2. IP取得はせず、端末IDとブラウザ情報だけをセット
        const payload = {
            deviceId: deviceId,
            userAgent: navigator.userAgent
        };

        // 3. GASへPOST送信 (一方通行)
        fetch(gasUrl, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'text/plain' 
            }
        }).catch(e => console.error('ログ送信エラー:', e));
    }

    // --- イベントリスナーと初期化処理 ---
    addPlanButton.addEventListener('click', createPlanCard);
    generateButton.addEventListener('click', generateReport);
    
    setStaticPlaceholders(); // ページ読み込み時に実行
    createPlanCard();
});