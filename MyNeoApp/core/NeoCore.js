export class NeoCore {
    constructor(state, rootRenderFn, containerId) {
        this.container = document.getElementById(containerId);
        this.rootRenderFn = rootRenderFn;
        
        this.state = new Proxy(state, {
            set: (target, key, value) => {
                target[key] = value;
                this.mount(); 
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

export function h(tag, props, children = []) {
    const el = document.createElement(tag);

    if (props.id) el.id = props.id;
    if (props.style) Object.assign(el.style, props.style);
    
    // 컴파일러가 주는 innerHTML과 파서가 주는 innerHtml 모두 대응
    // const content = props.innerHTML || props.innerHtml;
    // if (content !== undefined) {
    //     el.innerHTML = content;
    // }

    Object.keys(props).forEach(key => {
        if (key.startsWith('on') && typeof props[key] === 'function') {
            const eventType = key.toLowerCase().substring(2); 
            el.addEventListener(eventType, props[key]);
        }
    });

    const flattenChildren = Array.isArray(children) ? children.flat() : [children];
    
    flattenChildren.forEach(child => {
        if (child === null || child === undefined) return;
        if (child instanceof HTMLElement) {
            el.appendChild(child);
        } else {
            el.appendChild(document.createTextNode(String(child)));
        }
    });

    return el;
}