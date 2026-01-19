export class NeoParser {
    static parse(source) {
        let scriptContent = "";
        const scriptMatch = source.match(/@Script\s*\{([\s\S]*?)\}/);
        if (scriptMatch) scriptContent = scriptMatch[1].trim();

        // 태그 블록만 추출하기 위해 스크립트 제외
        const cleanSource = source.replace(/@Script\s*\{[\s\S]*?\}/, "").trim();
        
        const root = this.parseRecursive(cleanSource);
        return { root, scriptContent };
    }

    static parseRecursive(text) {
        // @ID:TAG { ... } 구조를 찾는 정규식
        const tagRegex = /@(\w+):(\w+)\s*\{/g;
        let match = tagRegex.exec(text);
        if (!match) return null;

        const node = {
            id: match[1],
            tag: match[2],
            styles: {},
            events: {},
            innerHtml: "",
            children: []
        };

        // 괄호 짝 찾기 (중첩 대응)
        const startIndex = match.index + match[0].length;
        let braceCount = 1;
        let endIndex = startIndex;

        while (braceCount > 0 && endIndex < text.length) {
            if (text[endIndex] === '{') braceCount++;
            else if (text[endIndex] === '}') braceCount--;
            endIndex++;
        }

        const blockContent = text.substring(startIndex, endIndex - 1);

        // 1. 블록 내부에서 속성 추출 (Innerhtml, Style, Event)
        // 줄바꿈과 대소문자를 무시하고 " " 사이의 값을 정확히 가져옴
        const htmlMatch = blockContent.match(/Innerhtml:\s*"([\s\S]*?)"/i);
        if (htmlMatch) node.innerHtml = htmlMatch[1].trim();

        const styleMatch = blockContent.match(/Style\(([\s\S]*?)\)/i);
        if (styleMatch) node.styles = this.parseKV(styleMatch[1]);

        const eventMatch = blockContent.match(/Event\(([\s\S]*?)\)/i);
        if (eventMatch) node.events = this.parseKV(eventMatch[1]);

        // 2. 자식 노드 재귀적 탐색
        // 본인의 속성 정의 부분을 제외한 나머지 텍스트에서 자식 탐색
        const remainingText = blockContent
            .replace(/Innerhtml:\s*"[\s\S]*?"/i, "")
            .replace(/Style\(.*?\)/si, "")
            .replace(/Event\(.*?\)/si, "");

        let childMatch;
        const childRegex = /@\w+:\w+\s*\{/g;
        while ((childMatch = childRegex.exec(remainingText)) !== null) {
            // 자식의 시작 지점부터 다시 재귀 실행
            const childNode = this.parseRecursive(remainingText.substring(childMatch.index));
            if (childNode) {
                node.children.push(childNode);
                // 중복 탐색 방지를 위해 인덱스 건너뛰기 로직 생략 (현재 구조 최적화)
                break; // 예시용 단일 자식 우선 처리, 실제론 루프 최적화 필요
            }
        }

        return node;
    }

    static parseKV(kvString) {
        if (!kvString) return {};
        const obj = {};
        kvString.split(';').forEach(pair => {
            const [key, value] = pair.split(':').map(s => s.trim());
            if (key && value) obj[key] = value;
        });
        return obj;
    }
}