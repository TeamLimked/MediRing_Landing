# MediRing Landing (Nuxt 4 · three.js)

MediRing 홍보용 랜딩 페이지. 정적 사이트로 생성(`nuxt generate`)해 어떤 정적 호스팅에도 올릴 수 있다.

## 시작하기
```bash
npm ci
cp .env.example .env     # 공개 값만(스토어 링크 등)
npm run dev              # http://localhost:3000
npm run generate         # .output/public 에 정적 파일 생성
npx serve .output/public # 결과 미리보기
npm run typecheck
```

## 환경변수 (`NUXT_PUBLIC_*`, 모두 공개 값)
| 키 | 설명 |
|---|---|
| `NUXT_PUBLIC_SITE_URL` | canonical / og:url (기본 `https://mediring.io`) |
| `NUXT_PUBLIC_APP_STORE_URL` / `NUXT_PUBLIC_PLAY_STORE_URL` | 비우면 스토어 버튼이 "출시 예정" 배지로 표시됨 |
| `NUXT_PUBLIC_COMPANY_*` | 약관·정책·푸터의 회사 정보(이름·대표·사업자번호·주소·보호책임자·메일·시행일). 비우면 백엔드와 같은 자리표시자 |
| `NUXT_PUBLIC_COMPANY_LEGAL_DRAFT` | `false` 면 약관 페이지의 "출시 전 초안" 배너를 숨김(기본 `true`) |

정적 생성이므로 값은 **빌드 시점**에 HTML 에 들어간다. 값이 바뀌면 다시 `generate` 한다.

## GitHub Pages 배포
`main` 에 푸시하면 `.github/workflows/pages.yml` 이 정적 생성 후 Pages 로 배포한다 → https://teamlimked.github.io/MediRing_Landing/
- 저장소 Settings → Pages → Source: **GitHub Actions**
- 하위 경로 대응: 워크플로가 `NUXT_APP_BASE_URL=/MediRing_Landing/` 로 빌드한다. 로컬에서 같은 조건으로 확인하려면
  `NUXT_APP_BASE_URL=/MediRing_Landing/ npx nuxt generate` 후 `.output/public` 을 `MediRing_Landing/` 폴더로 서빙한다.
- 저장소 Settings → Variables(Actions)에 넣으면 다음 배포부터 반영: `APP_STORE_URL`·`PLAY_STORE_URL`,
  회사 정보 `COMPANY_NAME`·`COMPANY_REPRESENTATIVE`·`COMPANY_BUSINESS_NUMBER`·`COMPANY_ADDRESS`·`PRIVACY_OFFICER_NAME`·`PRIVACY_OFFICER_EMAIL`·`SUPPORT_EMAIL`·`POLICY_VERSION`,
  `LEGAL_DRAFT_BANNER`(백엔드와 같은 이름)
- 자체 도메인(mediring.io)으로 옮기면 `NUXT_APP_BASE_URL` 은 `/`, `NUXT_PUBLIC_SITE_URL` 은 실제 도메인으로 바꾸고 아래 라우팅 주의를 따른다.

## 약관·정책 페이지
`/legal/{terms,privacy,sensitive,overseas,marketing,medical,affiliate}` 와 `/support` 를 정적으로 생성한다.
- **문구 원본은 백엔드** `MediRing_Interface/app/views/public_pages/legal/*.html.erb`·`support.html.erb` 다. `app/data/legal.ts` 는 이를 그대로 옮긴 사본이므로
  백엔드 문구가 바뀌면 반드시 함께 고친다(앱·인증 메일은 백엔드 페이지를 링크한다).
- 시행일(`COMPANY_POLICY_VERSION`)은 백엔드 `UserConsent::POLICY_VERSION`(앱 동의 버전)과 같아야 한다.
- 법무 확정 시 백엔드 `LEGAL_DRAFT_BANNER=false` 와 함께 `NUXT_PUBLIC_COMPANY_LEGAL_DRAFT=false` 로 바꾼다.

## 구조
```
app/
  app.vue                     # 헤더 · <NuxtPage> · 푸터
  pages/                      # index(랜딩) · legal/[doc] · support
  router.options.ts           # 다른 페이지에서 /#섹션 이동 시 스크롤 처리
  lib/hero-scene.ts           # three.js 히어로 장면(동적 import — 메인 번들과 분리)
  components/
    HeroScene.vue             # 장면 호스트(<ClientOnly> 안에서만 사용)
    sections/                 # Hero · Stats · HowItWorks · SafetyDemo · Features · Garden · Privacy · Plans · Faq · Download
    LegalPage.vue             # 약관·정책 공통 레이아웃
    PhoneMockup.vue StoreButtons.vue SiteHeader.vue SiteFooter.vue AppLogo.vue
  data/content.ts             # 랜딩 문구·데이터
  data/legal.ts               # 약관·정책 문서(백엔드 원문 사본)
  plugins/reveal.ts           # v-reveal 스크롤 등장
  assets/css/main.css         # 디자인 토큰(앱 theme.ts 의 "Fresh Citrus" 팔레트)
```

## 히어로 3D
- 유리 링(MeshPhysicalMaterial 투과·무지갯빛) + 링 코어의 심박 발광 + 링 둘레를 도는 ECG 파형
- 앱의 영양소 색으로 칠한 캡슐·연질캡슐·정제가 세 궤도면을 돌고, 입자 필드는 커스텀 셰이더로 반짝임
- 마우스 기울기·스크롤 연동, 등장 애니메이션
- 성능: 화면 밖·탭 숨김이면 렌더 정지, DPR 상한(저사양 1.5), 저사양·소형 화면은 입자·분할 수 축소, 언마운트 시 전부 dispose
- `prefers-reduced-motion` 이면 정지된 한 프레임만 그림. WebGL 불가 시 CSS 그라데이션 포스터만 남음
- `HeroScene` 을 `.client.vue` 로 바꾸지 말 것 — 하이드레이션 중 `onMounted` 시점에 ref 가 비어 장면이 시작되지 않는다

## 문구 원칙
`MediRing_Interface/docs/compliance.md` 를 따른다.
- 치료·완치·예방·진단·처방 등 의료 효능 표현 금지, "위험도" 대신 "주의"
- 수치는 백엔드·앱 코드/문서에 근거가 있는 것만(예: 안전 규칙 56개 → "50+", 공공 품목 약 4.6만 건, KDRI 372행 검증)
- 안전 점검 데모의 규칙·문구는 `MediRing_Interface/db/reference/safety_rules.yml` 에서 그대로 가져옴 — 원본이 바뀌면 `data/content.ts` 도 맞춘다
- 정원 슬라이더는 앱 `src/lib/garden.tsx` 규칙(시작 55 XP, 루틴 +20, 돌보기 +15, 단계 임계값)과 같다
- 가격은 스토어 결제 화면 기준이라 랜딩에 적지 않는다

## 배포 시 주의 — 백엔드 공개 웹과 같은 호스트
백엔드(Rails)가 `mediring.io` 에서 `/legal/*`, `/support`, `/s/*`, `/account/*`, `/.well-known/*` 를 제공한다.
랜딩을 같은 도메인 루트에 올리면 Ingress/CDN 에서 **위 경로는 백엔드로, 나머지는 랜딩 정적 파일로** 라우팅해야 한다.
`/legal/*`·`/support` 는 양쪽에 모두 있으므로 한쪽만 서빙하도록 정한다(기본: 앱·메일이 링크하는 백엔드 쪽).
특히 `/.well-known/*` 와 `/s/*` 가 랜딩으로 가면 iOS 유니버설 링크·Android 앱 링크가 깨진다.
