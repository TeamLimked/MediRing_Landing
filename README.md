# MediRing Landing (Nuxt 4 · three.js · GSAP)

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
| `NUXT_PUBLIC_WAITLIST_ENDPOINT` | 메시지 테스트 페이지 사전 신청을 받는 Apps Script 웹 앱 URL. 비우면 신청을 받지 않는다고 안내 |
| `NUXT_PUBLIC_WAITLIST_STORAGE` | 신청 보관처 `google`(기본 — 국외 이전 동의를 함께 받음) / `domestic` |

정적 생성이므로 값은 **빌드 시점**에 HTML 에 들어간다. 값이 바뀌면 다시 `generate` 한다.

## 메시지 테스트 페이지(`/try/a` · `/try/b`)
출시 전 사전 신청으로 **어느 메시지가 더 먹히는지** 본다. 두 페이지는 구성·폼·디자인이 같고 메시지만 다르다(`app/data/waitlist.ts`).
| 페이지 | 메시지 |
|---|---|
| `/try/a` | 지금 포지셔닝 — "내 영양제, 제대로 먹고 있을까요?"(맞춤 영양소·영양제 합계 분석) |
| `/try/b` | 부모님 약통 정리 — "부모님 약통, 한 장으로 정리해 드려요"(약·영양제 함께 먹을 때 점검·진료용 한 장, 판매 없음) |

- 사이트 머리·꼬리·3D 없이 가볍게(`definePageMeta({ bare: true })`), 검색 노출 안 함(`noindex`), 밝은 화면(앱 색)·어두운 모드 지원.
- 기록: 방문(`view`)·버튼(`cta`)은 무작위 세션 id·변형·utm 만(쿠키 없음, 세션당 한 번), 신청(`signup`)은 이메일·누구의 약·가짓수·약사 점검 이용 의향·인터뷰 의향.
  약사 점검(1회 29,000원, 출시 예정 — 지금은 결제하지 않는다고 적어 둔다)은 유료 의향을 재는 질문이다(백엔드 `docs/pharmacist-review.md`).
  같은 이메일은 첫 신청만 센다. 봇은 숨은 칸으로 거른다.
- 동의: [필수] 개인정보 수집·이용, [필수] 국외 이전(Google 스프레드시트 — `WAITLIST_STORAGE=google` 일 때). 운영자 이름·문의 메일은 `NUXT_PUBLIC_COMPANY_*` 값.

### 신청 받는 곳 만들기(Google 스프레드시트 + Apps Script, 5분)
1. 새 Google 스프레드시트 → 파일 > 설정 > 시간대 **(GMT+09:00) 서울**.
2. 확장 프로그램 > Apps Script → `Code.gs` 내용을 [`scripts/waitlist-apps-script.gs`](scripts/waitlist-apps-script.gs) 로 바꿔 저장.
3. 함수 `setup` 을 한 번 실행(권한 허용) → `events`·`signups`·`summary` 시트가 생긴다(`summary` 는 변형별 방문·신청·전환율·약사 점검 의향 수식).
   예전에 `setup` 을 돌린 시트라면 `signups` 맨 뒤(K열)에 `약사 점검` 머리글을 넣고 `summary` 를 지운 뒤 `setup` 을 다시 돌린다.
4. 배포 > 새 배포 > 유형 **웹 앱** — 실행: **나**, 액세스: **모든 사용자** → 배포 → 웹 앱 URL 복사(브라우저로 열면 `MediRing waitlist ok`).
5. 저장소 Settings → Secrets and variables → Actions → **Variables** 에 `WAITLIST_ENDPOINT` = 웹 앱 URL → 다시 배포(Actions 의 Deploy 다시 실행).
6. 확인: `/try/a` 를 열면 `events` 에 `view` 한 줄, 신청하면 `signups` 에 한 줄.
- 스크립트를 고치면 배포 > 배포 관리 > 수정 > **새 버전** 으로 올려야 반영된다(URL 은 그대로).
- 신청 데이터는 개인정보다 — 시트 공유를 운영자만으로 두고, 출시 알림을 보낸 뒤(또는 신청 1년 뒤) 행을 지운다.

### 실험 운영
- 링크는 `?utm_source=…&utm_medium=…&utm_campaign=…` 를 붙여 채널별로 나눈다(예: `/try/b?utm_source=meta&utm_campaign=parents-1`).
- 같은 채널·같은 기간·같은 예산으로 두 링크를 나눠 보낸다. 판단 기준과 일정은 백엔드 `docs/validation-plan.md`.

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
  router.options.ts           # /#섹션 이동(Lenis 사용 시 Lenis 로 스크롤)
  plugins/
    motion.client.ts          # GSAP(ScrollTrigger·SplitText) 등록, Lenis 부드러운 스크롤, v-split 디렉티브
    split.server.ts           # 프리렌더용 v-split 빈 디렉티브
    reveal.ts                 # v-reveal 스크롤 등장
  lib/
    hero-scene.ts             # 히어로 3D(유리 링·ECG·궤도 알약·입자)
    who-scene.ts              # Who → Principles 배경 3D(와이어프레임 지형·캡슐·링 → 입자 파도)
  components/
    sections/                 # Hero · Story(Who+Principles) · Features · SafetyDemo · Numbers · Faq · LinkCards · Download
    PrincipleCards.vue        # 펼쳐지는 원칙 카드
    FeatureVisual.vue         # 기능 슬라이드 비주얼(CSS 로 그린 UI)
    LegalPage.vue             # 약관·정책 공통 레이아웃
    SiteHeader.vue            # 메가 메뉴 헤더(스크롤 방향에 따라 숨김)
    SiteFooter.vue StoreButtons.vue AppLogo.vue HeroScene.vue
  data/content.ts             # 랜딩 문구·데이터
  data/legal.ts               # 약관·정책 문서(백엔드 원문 사본)
  assets/css/main.css         # 디자인 토큰(딥 네이비 + 시안), 괄호 버튼 등 공통 스타일
```

## 디자인·모션
- 시네마틱 다크 톤(딥 네이비 + 시안), SUIT 서체, 모서리 괄호 버튼. 레이아웃·인터랙션은 방산 기업 사이트(welcrondefense.com) 구성을 참고했고
  이미지·영상·문구는 쓰지 않았다 — 영상·사진 자리는 three.js 장면과 CSS 비주얼로 대체.
- Who we are 는 스크롤 고정(sticky) 구간: 진행도(ScrollTrigger scrub)에 따라 와이어프레임 → 입자 파도로 전환되고, 같은 캔버스가 Principles 뒤까지 이어진다.
- GSAP 은 3.13 부터 SplitText 등 모든 플러그인이 무료(Standard 'no charge' 라이선스)다.
- `prefers-reduced-motion` 이면 Lenis·스크롤 고정·텍스트 분할·자동 슬라이드를 끄고 최종 상태를 바로 보여준다.

## 히어로 3D
- 유리 링(MeshPhysicalMaterial 투과·무지갯빛) + 링 코어의 심박 발광 + 링 둘레를 도는 ECG 파형
- 앱의 영양소 색으로 칠한 캡슐·연질캡슐·정제가 세 궤도면을 돌고, 입자 필드는 커스텀 셰이더로 반짝임
- 성능: 화면 밖·탭 숨김이면 렌더 정지, DPR 상한(저사양 1.5), 저사양·소형 화면은 입자·분할 수 축소, 언마운트 시 전부 dispose.
  WebGL 불가 시 CSS 그라데이션 포스터만 남음
- `HeroScene` 을 `.client.vue` 로 바꾸지 말 것 — 하이드레이션 중 `onMounted` 시점에 ref 가 비어 장면이 시작되지 않는다(`<ClientOnly>` 로 감싼다)

## 문구 원칙
`MediRing_Interface/docs/compliance.md` 를 따른다.
- 치료·완치·예방·진단·처방 등 의료 효능 표현 금지, "위험도" 대신 "주의"
- 수치는 백엔드·앱 코드/문서에 근거가 있는 것만(예: 안전 규칙 56개 → "50+", 공공 품목 약 4.6만 건 → "약 4.6만", KDRI 372행 검증)
- 안전 점검 데모의 규칙·문구는 `MediRing_Interface/db/reference/safety_rules.yml` 에서 그대로 가져옴 — 원본이 바뀌면 `data/content.ts` 도 맞춘다
- 최상급·효능 단정 표현("가장 안전한" 등)을 쓰지 않는다. 기능 슬라이드 비주얼의 안전 규칙 항목도 실제 규칙 데이터 기준
- 가격은 스토어 결제 화면 기준이라 랜딩에 적지 않는다

## 배포 시 주의 — 백엔드 공개 웹과 같은 호스트
백엔드(Rails)가 `mediring.io` 에서 `/legal/*`, `/support`, `/s/*`, `/account/*`, `/.well-known/*` 를 제공한다.
랜딩을 같은 도메인 루트에 올리면 Ingress/CDN 에서 **위 경로는 백엔드로, 나머지는 랜딩 정적 파일로** 라우팅해야 한다.
`/legal/*`·`/support` 는 양쪽에 모두 있으므로 한쪽만 서빙하도록 정한다(기본: 앱·메일이 링크하는 백엔드 쪽).
특히 `/.well-known/*` 와 `/s/*` 가 랜딩으로 가면 iOS 유니버설 링크·Android 앱 링크가 깨진다.
