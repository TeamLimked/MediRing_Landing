# MediRing 랜딩(MediRing_Landing) — 에이전트 안내

이 저장소는 **공개** 저장소이고, main 에 병합하면 GitHub Pages 로 바로 배포된다.

작업 규칙·실행 환경·진행 상황은 비공개 백엔드 저장소(TeamLimked/MediRing_Interface)의 `docs/agent-memory/` 에 있다. 권한이 있으면 먼저 읽는다(커밋 명의와 금지 사항은 `01-working-rules.md`).

## 꼭 지킬 것

- **랜딩은 사용자가 랜딩을 콕 집어 요청할 때만 고친다.** "사이트를 개선해줘"는 관리자 웹(MediRing_Admin)을 뜻한다.
- 커밋·PR·이슈에 AI 표기(`Co-Authored-By`·"Generated with Claude Code" 등)를 넣지 않는다. 강제 푸시·이력 재작성 금지.
- 공개 저장소이므로 내부 문서 내용·비밀값·개인 정보·로컬 경로를 커밋하지 않는다.
- 메인 히어로·'맞춤 추천' 구성은 메시지 테스트(`/try/a`·`/try/b`) 결과 뒤에 다시 쓴다. 그 전에는 사실과 다른 문장만 고친다(지금은 모든 기능 무료, AI 는 출시 때 꺼 둠, 영양제를 팔지 않음).
- 사전 신청은 저장소 변수 `WAITLIST_ENDPOINT`(Google Apps Script 웹 앱 URL, `scripts/waitlist-apps-script.gs`)가 있어야 받는다 — README '신청 받는 곳 만들기'.

## 이 저장소 검사

- worktree 마다 `npm ci --prefer-offline`(node_modules 를 심볼릭 링크로 공유하면 Nuxt buildDir 가 메인 클론에 써져 prerender 가 500).
- `npm run typecheck`, `npx nuxt generate`(PR CI 가 없으니 병합 전에 로컬에서 확인), 병합 뒤 Pages 배포와 실제 페이지 문구를 확인.
