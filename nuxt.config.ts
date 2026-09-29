// MediRing 홍보용 랜딩 — 정적 생성(`nuxt generate`) 기준.
// 공개 값은 runtimeConfig.public 으로만 받는다(NUXT_PUBLIC_* 환경변수로 덮어쓰기).
const title = 'MediRing — 안전 점검부터 하는 개인 맞춤 영양 가이드'
const description =
  '3분 컨디션 체크로 2025 한국인 영양소 섭취기준과 식약처 인정 기능성 데이터에 기반한 맞춤 영양소를 추천해요. 복용 중인 약·질환·알레르기 주의사항은 추천 전에 먼저 확인합니다.'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl: 'https://mediring.io',
      webBaseUrl: 'https://mediring.io',
      appStoreUrl: '',
      playStoreUrl: '',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title,
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: description },
        { name: 'theme-color', content: '#07130F' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'MediRing' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:locale', content: 'ko_KR' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
        },
        // Jua: 앱과 같은 디스플레이 서체(큰 타이틀 전용)
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Jua&display=swap' },
      ],
      script: [{ innerHTML: "document.documentElement.classList.add('js')", tagPosition: 'head' }],
    },
  },

  nitro: {
    prerender: { routes: ['/'] },
  },

  vite: {
    optimizeDeps: { include: ['three'] },
  },
})
