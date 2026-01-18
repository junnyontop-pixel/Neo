export class NeoCore {
    constructor(state, rootRenderFn, containerId) {
        this.container = document.getElementById(containerId);
        this.rootRenderFn = rootRenderFn;
        this.state = new Proxy(state, {
            set: (target, key, value) => {
                target[key] = value;
                this.mount(); // 상태 변화 시 리렌더링
                return true;
            }
        });
    }

    mount() {
        if (!this.container) return;
        this.container.innerHTML = '';
        const domTree = this.rootRenderFn(this.state);
        this.container.appendChild(domTree);
    }
}

// 가상 노드를 DOM 요소로 바꾸는 함수
export function h(tag, props, children = []) {
    const el = document.createElement(tag);

    // 1. ID 설정
    if (props.id) el.id = props.id;

    // 2. 스타일 설정
    if (props.style) Object.assign(el.style, props.style);

    // 3. 내용물 설정
    if (props.innerHtml) el.innerHTML = props.innerHtml;

    // 💡 4. 이벤트 연결 (이 부분이 빠져있을 거예요!)
    // props에 on으로 시작하는 속성(onClick 등)이 있다면 이벤트를 등록합니다.
    Object.keys(props).forEach(key => {
        if (key.startsWith('on') && typeof props[key] === 'function') {
            const eventType = key.toLowerCase().substring(2); // 'onClick' -> 'click'
            el.addEventListener(eventType, props[key]);
        }
    });

    // 5. 자식 요소 추가
    children.forEach(child => {
        if (child instanceof HTMLElement) {
            el.appendChild(child);
        }
    });

    return el;
}