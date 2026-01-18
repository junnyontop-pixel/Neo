#!/usr/bin/env node
import fs from 'fs';
import path from 'path'; // 경로 처리를 위해 추가
import { NeoParser } from './NeoParser.js';

const inputFile = process.argv[2];

// 인자가 없을 경우 에러 처리
if (!inputFile) {
    console.error("❌ 컴파일할 .neo 파일을 입력해주세요. (예: node index.js App.neo)");
    process.exit(1);
}

const source = fs.readFileSync(inputFile, 'utf8');
const { root, scriptContent } = NeoParser.parse(source);

function generateCode(node) {
    const childrenCode = node.children.map(child => generateCode(child)).join(', ');
    
    const eventProps = {};
    for (const [evt, action] of Object.entries(node.events)) {
        const propName = `on${evt.charAt(0).toUpperCase() + evt.slice(1)}`;
        
        let processedAction = action;
        if (action.includes('++')) processedAction = `state.${action}`;
        
        if (processedAction.includes('(') && !processedAction.includes(')')) {
            processedAction += ')';
        }

        eventProps[propName] = `() => { ${processedAction} }`; 
    }

    const eventString = Object.entries(eventProps)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

    return `h('${node.tag}', {
        id: '${node.id}',
        style: ${JSON.stringify(node.styles)},
        innerHtml: \`${node.innerHtml.replace(/\$(\w+)/g, '${state.$1}')}\`${eventString ? ', ' + eventString : ''}
    }, [${childrenCode}])`;
}

// compiler/index.js 내부
const finalJS = `
import { h } from './node_modules/@junnyontop-pixel/neo-app/core/NeoCore.js';

// [User Script]
${scriptContent}

export default function render(state) {
    return ${generateCode(root)};
}
`.trim();

// 파일 생성 위치를 입력 파일과 동일한 위치의 .js로 지정
const outputPath = inputFile.replace('.neo', '.js');
fs.writeFileSync(outputPath, finalJS);

console.log(`✅ [컴파일 완료] -> ${outputPath}`);