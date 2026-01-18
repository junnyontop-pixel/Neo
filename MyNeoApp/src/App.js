import { h } from './node_modules/@junnyontop-pixel/neo-app/core/NeoCore.js';

// [User Script]
function sayHello() {
        alert("안녕하세요!");
    }

export default function render(state) {
    return h('button', {
        id: 'Btn',
        style: {},
        innerHtml: `인사하기`, onClick: () => { sayHello() }
    }, []);
}