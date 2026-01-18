export class NeoParser {
    static parse(code) {
        // 1. @Script 블록 추출 로직 개선
        // 괄호를 포함해서 캡처한 뒤, 앞뒤 껍데기만 날리는 방식이 가장 안전합니다.
        const scriptMatch = code.match(/@Script\s*\{([\s\S]*?)\}(?=\s*@|$)/);
        let scriptContent = "";
        
        if (scriptMatch) {
            scriptContent = scriptMatch[1].trim();
            // 만약 사용자가 적은 마지막 } 가 잘려 나갔다면 복구하거나, 
            // 원본에서 블록 전체를 가져오는 로직으로 보강
        }

        // 2. UI 요소 추출 (이 부분은 동일)
        const uiCode = code.replace(/@Script\s*\{[\s\S]*?\}\s*/, "");
        const tokenRegex = /(@\w+:\w+)|(Innerhtml:\s*".*?")|(Style\([\s\S]*?\))|(Event\([\s\S]*?\))|(\{)|(\})/g;
        const tokens = uiCode.match(tokenRegex);
        
        const stack = [];
        let root = null;

        tokens.forEach(token => {
            if (token.startsWith('@')) {
                const [_, id, tag] = token.match(/@(\w+):(\w+)/);
                const node = { id, tag, innerHtml: "", styles: {}, events: {}, children: [] };
                if (stack.length > 0) stack[stack.length - 1].children.push(node);
                else if (!root) root = node;
                stack.push(node);
            } else if (token === '}') {
                stack.pop();
            } else if (token.startsWith('Innerhtml')) {
                stack[stack.length - 1].innerHtml = token.match(/"(.*?)"/)[1];
            } else if (token.startsWith('Style')) {
                stack[stack.length - 1].styles = this.parseKV(token.match(/Style\((.*?)\)/)[1]);
            } else if (token.startsWith('Event')) {
                stack[stack.length - 1].events = this.parseKV(token.match(/Event\((.*?)\)/)[1]);
            }
        });

        return { root, scriptContent };
    }

    static parseKV(str) {
        const obj = {};
        str.split(';').forEach(line => {
            const [k, v] = line.split(':').map(s => s?.trim());
            if (k && v) {
                const camelK = k.replace(/-([a-z])/g, g => g[1].toUpperCase());
                obj[camelK] = v;
            }
        });
        return obj;
    }
}