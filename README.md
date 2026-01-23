# 🚀 Neo Framework (`@junnyontop-pixel/neo-app`)

**Neo Framework**는 `.neo` 파일을 직관적인 자바스크립트 코드로 컴파일하여 상태 기반 UI를 구현하는 초경량 커스텀 프레임워크입니다. 

---

> 아직 안정 버전이 없으니 쓰지 실험용으로만 사용하시기 바랍니다.

## 🛠 Installation (설치 방법)

NPM을 통해 프로젝트에 간편하게 설치할 수 있습니다.

```bash
npm install @junnyontop-pixel/neo-app@1.2.1
```

---

## ⚡️ Quick Start with Vite (Vite 사용 권장)

**Neo Framework는 실시간 컴파일과 빠른 피드백(HMR)을 위해 Vite 환경에서의 사용을 강력히 권장합니다.**

1. `vite.config.js` 설정

파일 저장 시 자동으로 `.neo` 파일을 `.js`로 컴파일하도록 아래 플러그인 설정을 추가하세요.

``` js
import { defineConfig } from 'vite';
import { execSync } from 'child_process';

export default defineConfig({
  plugins: [
    {
      name: 'neo-compiler',
      handleHotUpdate({ file, server }) {
        if (file.endsWith('.neo')) {
          try {
            // 파일 저장 시 자동으로 컴파일러 실행
            execSync(`node node_modules/@junnyontop-pixel/neo-app/compiler/index.js ${file}`, { stdio: 'inherit' });
            // 브라우저 새로고침 신호 전송
            server.ws.send({ type: 'full-reload' });
          } catch (e) {
            console.error('⚠️ Neo 컴파일 에러:', e.message);
          }
        }
      }
    }
  ]
});
```

2. 추가 설정

```bash
npx neoc-init
```
명령어를 사용하여 프로젝트를 초기화하세요.

프로젝트 루트에 생긴 src폴더 안의 App.neo파일을 수정하고

```bash
npx neoc src/App.neo
```
명령어를 사용해 컴파일하세요.

---

## 📝 Syntax & Usage (문법 및 사용법)

Neo Framework는 **HTML보다 간결**하고 직관적인 전용 문법을 제공합니다.
Neo 코드는 @Script 블록과 @ID:Tag UI 블록으로 나뉩니다.

1. 로직 정의 (@Script)

**데이터 상태와 함수를 정의**하는 영역입니다.

```neo
@Script {
    let count = 0;
}
```

2. UI 요소 구조 (@ID:Tag)

`@객체명:태그명` 형식을 사용하여 요소를 선언하며, 하위에 `Innerhtml`, `Style`, `Event`를 정의합니다.

```neo
@App:div {
    innerHTML: "Neo 프레임워크에 오신 것을 환영합니다!"
    Style(background-color: white; padding: 20px)
    
    @Counter:h1 {
        innerHTML : "현재 수치: $count"
        Style(color: royalblue; font-size: 24px)
    }

    @Btn:button {
        innerHTML : "증가시키기"
        Style(padding: 10px 20px; cursor: pointer)
        Event(click: count++)
    }
}
```

3. 주요 예약어 설명

| 예약어 | 설명 | 사용 형식 |
| :--- | :--- | :--- |
| **`Innerhtml`** | 태그 내부의 텍스트를 정의하며, `$변수명`을 통해 상태 데이터를 바인딩합니다. | `Innerhtml: "텍스트 또는 $변수"` |
| **`Style`** | 요소의 CSS 스타일을 정의합니다. 각 속성은 세미콜론(`;`)으로 구분합니다. | `Style(key: value; key: value; ...)` |
| **`Event`** | 클릭, 입력 등 브라우저 이벤트를 정의하고 실행할 로직을 작성합니다. | `Event(click: action)` |

```neo
@MyButton:button {
    innerHtml: "클릭 횟수: $count"
    Style(background-color: #4CAF50; color: white; padding: 10px)
    Event(click: $count++)
}
```

---

## 🏗 Directory Structure (권장 구조)

```text
project-root/
├── node_modules/
├── src/           <-- 건들이지 말고 명령어사용
│   ├── App.neo     
│   └── App.js
├── index.html
└── vite.config.js
```

---

## 📄 License
MIT License

---
## 현재 상태

>현재 유지보수가 불가능하다고 판단,
더 새로운,간결한,쉬운 Neojs v2로 돌아오겠습니다.
