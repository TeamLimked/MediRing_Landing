// MediRing 홍보용 랜딩 — 정적 생성(`nuxt generate`) 기준.
// 공개 값은 runtimeConfig.public 으로만 받는다(NUXT_PUBLIC_* 환경변수로 덮어쓰기).
const title = 'MediRing — 안전 점검부터 하는 개인 맞춤 영양 가이드'
const description =
  '3분 컨디션 체크로 2025 한국인 영양소 섭취기준과 식약처 인정 기능성 데이터에 기반한 맞춤 영양소를 추천해요. 복용 중인 약·질환·알레르기 주의사항은 추천 전에 먼저 확인합니다.'

// GitHub Pages 처럼 하위 경로(/MediRing_Landing/)에 올릴 때는 빌드 시 NUXT_APP_BASE_URL 로 지정한다.
// head 의 정적 파일 경로는 Nuxt 가 자동으로 접두사를 붙이지 않으므로 직접 붙인다.
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: 'https://mediring.io',
      appStoreUrl: '',
      playStoreUrl: '',
      // 약관·정책 페이지에 표시(NUXT_PUBLIC_COMPANY_*). 빈 값은 백엔드와 같은 자리표시자로 채운다 — data/legal.ts
      company: {
        name: 'TeamLimked',
        representative: '',
        businessNumber: '',
        address: '',
        privacyOfficer: '',
        privacyEmail: 'privacy@mediring.io',
        supportEmail: 'support@mediring.io',
        // 백엔드 UserConsent::POLICY_VERSION 과 같은 값이어야 한다(앱 동의 버전 = 시행일)
        policyVersion: '2026-09-28',
        // 법무 확정 후 false(NUXT_PUBLIC_COMPANY_LEGAL_DRAFT=false) — 백엔드 LEGAL_DRAFT_BANNER 와 함께 바꾼다
        legalDraft: true,
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title,
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: description },
        { name: 'theme-color', content: '#F6F7F8', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#111315', media: '(prefers-color-scheme: dark)' },
        { name: 'color-scheme', content: 'light dark' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'MediRing' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:locale', content: 'ko_KR' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: `${baseURL}favicon.svg` },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        // Pretendard(SIL OFL 1.1) — 앱과 같은 서체, 한글 동적 서브셋
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
        },
      ],
    },
  },

  nitro: {
    prerender: {
      routes: ['/', '/support', ...['terms', 'privacy', 'sensitive', 'overseas', 'marketing', 'medical', 'affiliate'].map((d) => `/legal/${d}`)],
    },
  },
})
