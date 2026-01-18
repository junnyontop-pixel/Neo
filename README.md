# 🚀 Neo Framework (`@junnyontop-pixel/neo-app`)

**Neo Framework**는 `.neo` 파일을 직관적인 자바스크립트 코드로 컴파일하여 상태 기반 UI를 구현하는 초경량 커스텀 프레임워크입니다. 

---

## 🛠 Installation (설치 방법)

NPM을 통해 프로젝트에 간편하게 설치할 수 있습니다.

```bash
npm install @junnyontop-pixel/neo-app
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

2. `index.html`설정
