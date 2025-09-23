document.addEventListener('DOMContentLoaded', function() {
    const planContainer = document.getElementById('plan-container');
    const addPlanButton = document.getElementById('add-plan-button');
    const generateButton = document.getElementById('generate-button');
    const outputContainer = document.getElementById('output-container');

    const subjectOptions = ['数学', '英語', '国語', '理科', '社会', '物理', '化学', '生物', '地学', '世界史', '日本史', '地理', 'その他'];
    // 1. 2種類のプレースホルダーを準備
    
    // 一般講師向けのシンプルなプレースホルダー
    const generalPlaceholders = ['理想・目標', '現状', '解決策'];

    // 自分用の詳しいプレースホルダー
    const personalPlaceholders = [
        '理想・目標（現状+本番に向けてより求めるもの）', 
        '現状（確認テストが悪かったら原因）', 
        '具体的な行動・勉強方法（原因→解決策、理想を達成するための勉強法）'
    ];


    function createPlanCard() {
        // 2. URLに「合言葉」があるかチェックして、使うプレースホルダーを決める
        let placeholdersToUse = generalPlaceholders; // デフォルトは一般向け
        const urlParams = window.location.search;
        if (urlParams.includes('my-mode')) {
            placeholdersToUse = personalPlaceholders; // 「合言葉」があれば自分用に切り替え
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
        
        const inputClasses = ['goal-input', 'situation-input', 'solution-input'];

        // 3. 決まった方のプレースホルダーを使って入力欄を作成
        for (let i = 0; i < placeholdersToUse.length; i++) {
            const textarea = document.createElement('textarea');
            textarea.classList.add('plan-input');
            textarea.classList.add(inputClasses[i]);
            textarea.placeholder = placeholdersToUse[i]; // ここで使い分ける！
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
        const goalLines = [],
            situationLines = [],
            solutionLines = [];
        planCards.forEach(card => {
            const subject = card.querySelector('select').value;
            const goal = card.querySelector('.goal-input').value.trim();
            const situation = card.querySelector('.situation-input').value.trim();
            const solution = card.querySelector('.solution-input').value.trim();
            if (goal) goalLines.push(`⚪︎ ${subject}\n→ ${goal}`);
            if (situation) situationLines.push(`⚪︎ ${subject}\n→ ${situation}`);
            if (solution) solutionLines.push(`⚪︎ ${subject}\n→ ${solution}`)
        });
        const homeworkReview = document.getElementById('homework-review').value.trim();
        const testReview = document.getElementById('test-review').value.trim();
        const eventsNotes = document.getElementById('events-notes').value.trim();
        const otherNotes = document.getElementById('other-notes').value.trim();
        const reviewLines = [];
        if (homeworkReview) reviewLines.push(`⚪︎ 宿題の達成度、完成度\n→ ${homeworkReview}`);
        if (testReview) reviewLines.push(`⚪︎ 確認テストの結果\n→ ${testReview}`);
        const notesLines = [];
        if (eventsNotes) notesLines.push(`⚪︎ 行事・テスト等のイベント\n→ ${eventsNotes}`);
        if (otherNotes) notesLines.push(`⚪︎ その他\n→ ${otherNotes}`);
        
        if (reviewLines.length > 0) outputContainer.appendChild(createBox('【宿題/確認テストの振り返り】', reviewLines));
        if (notesLines.length > 0) outputContainer.appendChild(createBox('【特記事項】', notesLines));
        if (goalLines.length > 0) outputContainer.appendChild(createBox('【理想・目標】', goalLines));
        if (situationLines.length > 0) outputContainer.appendChild(createBox('【現状】', situationLines));
        if (solutionLines.length > 0) outputContainer.appendChild(createBox('【具体的な行動・勉強法】', solutionLines));
    }

    addPlanButton.addEventListener('click', createPlanCard);
    generateButton.addEventListener('click', generateReport);
    createPlanCard()
});