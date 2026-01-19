#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// 1. 템플릿 정의
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Neo App</title>
</head>
<body>
    <div id="app"></div>
    <script type="module">
        import { NeoCore } from '@junnyontop-pixel/neo-app/core/NeoCore.js';
        import render from './src/App.js';

        const state = { title: "Hello Neo!", count: 0 };
        new NeoCore(state, render, 'app').mount();
    </script>
</body>
</html>`;

const neoContent = `@Script {
    // Logic here
}

@Main:div {
    Innerhtml: "🚀 $title"
    Style(padding: 20px; text-align: center; font-family: sans-serif)

    @Counter:button {
        Innerhtml: "클릭 수: $count"
        Style(background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer)
        Event(click: $count++)
    }
}`;

// 2. 파일 생성 로직
const targetDir = process.cwd(); // 명령어를 실행한 현재 폴더

try {
    if (!fs.existsSync(path.join(targetDir, 'src'))) {
        fs.mkdirSync(path.join(targetDir, 'src'));
    }
    
    fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent);
    fs.writeFileSync(path.join(targetDir, 'src/App.neo'), neoContent);
    
    console.log("✅ [Neo] index.html 및 src/App.neo 생성이 완료되었습니다!");
    console.log("👉 이제 'npx neoc src/App.neo'를 실행하여 첫 컴파일을 완료하세요.");
} catch (err) {
    console.error("❌ 초기화 중 에러 발생:", err.message);
}