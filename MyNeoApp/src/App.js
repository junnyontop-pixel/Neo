import { h } from '@junnyontop-pixel/neo-app/core/NeoCore.js';

export default function render(state) {
    // 값이 없을 때만 초기화 (중요: 매번 0으로 덮어쓰지 않음)
    if (state.count === undefined) state.count = 0;
    if (state.title === undefined) state.title = "hello, neo";

    return h('button', {
                id: 'Btn',
                style: {},
        onClick: () => { sayHello( }
            }, [
`인사하기`
    ]);
}