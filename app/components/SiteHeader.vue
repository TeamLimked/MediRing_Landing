<script setup lang="ts">
// 상단 헤더 — 로고 | 메뉴(마우스를 올리면 전체 하위 메뉴가 펼쳐지는 메가 메뉴) | 앱 다운로드
// 홈 첫 화면에서는 투명, 스크롤하면 어두운 반투명 배경. 아래로 스크롤하면 숨기고 위로 올리면 다시 보인다.
const menus = [
  {
    label: '서비스 소개',
    to: '/#who',
    items: [
      { label: '메디링 소개', to: '/#who' },
      { label: '핵심 원칙', to: '/#principles' },
      { label: '기준 데이터', to: '/#numbers' },
    ],
  },
  {
    label: '안전 점검',
    to: '/#safety',
    items: [
      { label: '안전 점검 체험', to: '/#safety' },
      { label: '의료 면책 고지', to: '/legal/medical' },
    ],
  },
  {
    label: '주요 기능',
    to: '/#features',
    items: [
      { label: '안전 점검', to: '/#features' },
      { label: '맞춤 추천', to: '/#features' },
      { label: '매일의 루틴', to: '/#features' },
    ],
  },
  {
    label: '개인정보',
    to: '/legal/privacy',
    items: [
      { label: '개인정보 처리방침', to: '/legal/privacy' },
      { label: '민감정보 처리 안내', to: '/legal/sensitive' },
      { label: '국외이전 안내', to: '/legal/overseas' },
    ],
  },
  {
    label: '고객지원',
    to: '/support',
    items: [
      { label: '자주 묻는 질문', to: '/#faq' },
      { label: '고객 지원', to: '/support' },
      { label: '이용약관', to: '/legal/terms' },
    ],
  },
]

const route = useRoute()
const scrolled = ref(false)
const hidden = ref(false)
const mega = ref(false)
const mobileOpen = ref(false)
const mobileExpanded = ref<string | null>(null)

let lastY = 0
function onScroll() {
  const y = window.scrollY
  scrolled.value = y > 40
  // 메뉴가 열려 있지 않을 때만 방향에 따라 숨김
  if (!mega.value && !mobileOpen.value) hidden.value = y > lastY && y > 400
  lastY = y
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    mega.value = false
    mobileOpen.value = false
  }
}

watch(
  () => route.fullPath,
  () => {
    mega.value = false
    mobileOpen.value = false
    hidden.value = false
  },
)

// 모바일 메뉴가 열려 있으면 뒤 스크롤 잠금
const { $lenis } = useNuxtApp()
watch(mobileOpen, (open) => {
  const lenis = $lenis as { stop(): void; start(): void } | null
  if (open) lenis?.stop()
  else lenis?.start()
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.documentElement.style.overflow = ''
})

const solid = computed(() => scrolled.value || mega.value || mobileOpen.value || route.path !== '/')
</script>

<template>
  <header
    class="hd"
    :class="{ 'hd--solid': solid, 'hd--hidden': hidden, 'hd--mega': mega }"
    @mouseleave="mega = false"
    @focusout="(e: FocusEvent) => !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node) && (mega = false)"
  >
    <div class="hd__bar">
      <NuxtLink to="/" class="hd__logo" aria-label="MediRing 홈">
        <AppLogo />
      </NuxtLink>

      <nav class="hd__nav" aria-label="주요 메뉴" @mouseenter="mega = true" @focusin="mega = true">
        <div v-for="m in menus" :key="m.label" class="hd__col">
          <NuxtLink :to="m.to" class="hd__top">{{ m.label }}</NuxtLink>
          <ul class="hd__sub">
            <li v-for="s in m.items" :key="s.label">
              <NuxtLink :to="s.to" :tabindex="mega ? 0 : -1">{{ s.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </nav>

      <NuxtLink to="/#download" class="hd__cta">
        앱 다운로드
        <span class="hd__ring" aria-hidden="true" />
      </NuxtLink>

      <button
        type="button"
        class="hd__burger"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-menu"
        :aria-label="mobileOpen ? '메뉴 닫기' : '메뉴 열기'"
        @click="mobileOpen = !mobileOpen"
      >
        <span :class="{ open: mobileOpen }" />
      </button>
    </div>

    <div class="hd__mega-bg" aria-hidden="true" />

    <Transition name="mm">
      <nav v-show="mobileOpen" id="mobile-menu" class="mm" aria-label="모바일 메뉴">
        <div v-for="m in menus" :key="m.label" class="mm__group">
          <button
            type="button"
            class="mm__top"
            :aria-expanded="mobileExpanded === m.label"
            @click="mobileExpanded = mobileExpanded === m.label ? null : m.label"
          >
            {{ m.label }}
            <span class="mm__plus" :class="{ open: mobileExpanded === m.label }" aria-hidden="true" />
          </button>
          <ul v-show="mobileExpanded === m.label" class="mm__sub">
            <li v-for="s in m.items" :key="s.label">
              <NuxtLink :to="s.to">{{ s.label }}</NuxtLink>
            </li>
          </ul>
        </div>
        <NuxtLink to="/#download" class="bracket bracket--accent mm__cta">앱 다운로드</NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.hd {
  --mega-h: 0px;
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  color: var(--ink);
  transition: transform 0.5s var(--ease);
}
.hd--hidden {
  transform: translateY(-100%);
}
.hd__bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: stretch;
  height: var(--header-h);
  border-bottom: 1px solid var(--line);
  transition: background-color 0.4s, backdrop-filter 0.4s;
}
.hd--solid .hd__bar {
  background: rgba(3, 4, 12, 0.72);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
}
.hd--mega .hd__bar {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.hd__logo {
  display: flex;
  align-items: center;
  padding: 0 clamp(20px, 2.6vw, 40px);
  border-right: 1px solid var(--line);
}
.hd__nav {
  display: flex;
  flex: 1;
  justify-content: space-around;
  padding: 0 clamp(8px, 2vw, 48px);
}
.hd__col {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 128px;
}
.hd__top {
  display: flex;
  align-items: center;
  height: var(--header-h);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: color 0.2s;
}
.hd__top:hover {
  color: var(--accent);
}
/* 메가 메뉴: 각 메뉴 아래로 하위 항목이 펼쳐짐 */
.hd__sub {
  position: absolute;
  top: var(--header-h);
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 28px 0 0;
  list-style: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease), visibility 0.35s;
}
.hd--mega .hd__sub {
  opacity: 1;
  visibility: visible;
  transform: none;
}
.hd__sub a {
  font-size: 15px;
  font-weight: 500;
  color: var(--muted);
  white-space: nowrap;
  transition: color 0.2s;
}
.hd__sub a:hover {
  color: var(--accent);
}
.hd__mega-bg {
  position: absolute;
  inset: 0 0 auto;
  z-index: 1;
  height: calc(var(--header-h) + 190px);
  background: rgba(3, 4, 12, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--line);
  clip-path: inset(0 0 100% 0);
  transition: clip-path 0.45s var(--ease);
  pointer-events: none;
}
.hd--mega .hd__mega-bg {
  clip-path: inset(0 0 0 0);
}
.hd__cta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 clamp(20px, 2.6vw, 40px);
  border-left: 1px solid var(--line);
  font-size: 17px;
  font-weight: 700;
  transition: color 0.2s;
}
.hd__cta:hover {
  color: var(--accent);
}
.hd__ring {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px currentColor;
}
.hd__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: var(--header-h);
  margin-left: auto;
  border: 0;
  border-left: 1px solid var(--line);
  background: none;
}
.hd__burger span,
.hd__burger span::before,
.hd__burger span::after {
  display: block;
  width: 22px;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.3s var(--ease), background-color 0.2s;
}
.hd__burger span {
  position: relative;
}
.hd__burger span::before,
.hd__burger span::after {
  content: '';
  position: absolute;
  left: 0;
}
.hd__burger span::before {
  transform: translateY(-7px);
}
.hd__burger span::after {
  transform: translateY(7px);
}
.hd__burger span.open {
  background: transparent;
}
.hd__burger span.open::before {
  transform: rotate(45deg);
}
.hd__burger span.open::after {
  transform: rotate(-45deg);
}

/* 모바일 전체 화면 메뉴 */
.mm {
  position: fixed;
  inset: var(--header-h) 0 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 16px var(--gutter) 40px;
  overflow-y: auto;
  background: var(--bg);
}
.mm__group {
  border-bottom: 1px solid var(--line);
}
.mm__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 22px 0;
  border: 0;
  background: none;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: left;
}
.mm__plus {
  position: relative;
  width: 14px;
  height: 14px;
}
.mm__plus::before,
.mm__plus::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 14px;
  height: 1.5px;
  background: var(--accent);
  transition: transform 0.3s var(--ease);
}
.mm__plus::after {
  transform: rotate(90deg);
}
.mm__plus.open::after {
  transform: rotate(0deg);
}
.mm__sub {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0 0 22px;
  list-style: none;
}
.mm__sub a {
  font-size: 16px;
  color: var(--muted);
}
.mm__cta {
  margin-top: 32px;
  width: 100%;
}
.mm-enter-active,
.mm-leave-active {
  transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
}
.mm-enter-from,
.mm-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 1180px) {
  .hd__col {
    min-width: 0;
  }
  .hd__top,
  .hd__cta {
    font-size: 15px;
  }
}
@media (max-width: 1024px) {
  .hd__nav,
  .hd__cta,
  .hd__mega-bg {
    display: none;
  }
  .hd__logo {
    border-right: 0;
  }
  .hd__burger {
    display: flex;
  }
}
</style>
