#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { NeoParser } from './NeoParser.js';

// 1. 입력 파일 경로 확인
const inputFile = process.argv[2];

if (!inputFile) {
    console.error("❌ 컴파일할 .neo 파일을 입력해주세요. (예: npx neoc src/App.neo)");
    process.exit(1);
}

// 2. 소스 코드 읽기 및 파싱
try {
    const source = fs.readFileSync(inputFile, 'utf8');
    const { root, scriptContent } = NeoParser.parse(source);

    if (!root) {
        throw new Error("파싱 결과가 비어있습니다. .neo 파일의 형식을 확인해주세요.");
    }

    // 3. 코드 생성 함수 (재귀 구조)
    function generateCode(node, indent = "    ") {
    const childrenCode = node.children
        .map(child => generateCode(child, indent + "    "))
        .join(',\n');

    // 이벤트들을 객체 문자열로 변환
    const eventProps = Object.entries(node.events).map(([evt, action]) => {
        const propName = `on${evt.charAt(0).toUpperCase() + evt.slice(1)}`;
        // $count -> state.count로 치환
        let processedAction = action.replace(/\$(\w+)/g, 'state.$1');
        return `${propName}: () => { ${processedAction} }`;
    }).join(`,\n${indent}        `);

    return `${indent}h('${node.tag}', {
${indent}    id: '${node.id}',
${indent}    style: ${JSON.stringify(node.styles)},
${indent}    innerHTML: \`${node.innerHtml.replace(/\$(\w+)/g, '${state.$1}')}\`${eventProps ? ',\n' + indent + '    ' + eventProps : ''}
${indent}}, [${childrenCode ? '\n' + childrenCode + '\n' + indent : ''}])`;
}

// render 함수 생성 부분
const finalJS = `
import { h } from '@junnyontop-pixel/neo-app/core/NeoCore.js';

export default function render(state) {
    // 값이 없을 때만 초기화 (중요: 매번 0으로 덮어쓰지 않음)
    if (state.count === undefined) state.count = 0;
    if (state.title === undefined) state.title = "hello, neo";

    return ${generateCode(root).trimStart()};
}
`.trim();

    // 5. .js 파일로 저장
    const outputPath = inputFile.replace('.neo', '.js');
    fs.writeFileSync(outputPath, finalJS);

    console.log(`✅ [컴파일 성공] -> ${outputPath}`);

} catch (err) {
    console.error("❌ 컴파일 중 에러 발생:");
    console.error(err.message);
    process.exit(1);
}