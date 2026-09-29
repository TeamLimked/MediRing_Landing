<script setup lang="ts">
const nav = [
  { href: '#how', label: '작동 방식' },
  { href: '#safety', label: '안전 점검' },
  { href: '#features', label: '기능' },
  { href: '#privacy', label: '개인정보' },
  { href: '#faq', label: 'FAQ' },
]

const scrolled = ref(false)
const open = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header class="header" :class="{ 'header--solid': scrolled || open }">
    <div class="container header__bar">
      <a href="#top" class="header__brand" aria-label="MediRing 홈" @click="open = false">
        <AppLogo />
      </a>

      <nav class="header__nav" aria-label="주요 메뉴">
        <a v-for="n in nav" :key="n.href" :href="n.href">{{ n.label }}</a>
      </nav>

      <a href="#download" class="btn header__cta">앱 받기</a>

      <button
        class="header__toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? '메뉴 닫기' : '메뉴 열기'"
        @click="open = !open"
      >
        <span :class="{ 'is-open': open }" />
      </button>
    </div>

    <nav v-show="open" id="mobile-nav" class="header__mobile" aria-label="모바일 메뉴">
      <a v-for="n in nav" :key="n.href" :href="n.href" @click="open = false">{{ n.label }}</a>
      <a href="#download" class="btn btn--mint" @click="open = false">앱 받기</a>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  color: var(--night-ink);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
}
.header--solid {
  background: rgba(7, 19, 15, 0.72);
  backdrop-filter: saturate(160%) blur(16px);
  -webkit-backdrop-filter: saturate(160%) blur(16px);
  box-shadow: 0 1px 0 var(--night-line);
}
.header__bar {
  display: flex;
  align-items: center;
  gap: 24px;
  height: var(--header-h);
}
.header__brand {
  margin-right: auto;
}
.header__nav {
  display: flex;
  gap: 4px;
}
.header__nav a {
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  color: var(--night-muted);
  transition: color 0.2s, background-color 0.2s;
}
.header__nav a:hover {
  color: var(--night-ink);
  background: rgba(234, 246, 239, 0.08);
}
.header__cta {
  min-height: 42px;
  padding: 0 18px;
  font-size: 15px;
  background: var(--mint-bright);
  color: #05221a;
}
.header__cta:hover {
  background: #5ee6b6;
}
.header__toggle {
  display: none;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 12px;
  background: rgba(234, 246, 239, 0.08);
  position: relative;
}
.header__toggle span,
.header__toggle span::before,
.header__toggle span::after {
  position: absolute;
  left: 50%;
  width: 20px;
  height: 2px;
  margin-left: -10px;
  border-radius: 2px;
  background: currentColor;
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.header__toggle span {
  top: 50%;
}
.header__toggle span::before,
.header__toggle span::after {
  content: '';
  left: 0;
  margin-left: 0;
}
.header__toggle span::before {
  transform: translateY(-6px);
}
.header__toggle span::after {
  transform: translateY(6px);
}
.header__toggle span.is-open {
  background: transparent;
}
.header__toggle span.is-open::before {
  transform: rotate(45deg);
}
.header__toggle span.is-open::after {
  transform: rotate(-45deg);
}
.header__mobile {
  display: none;
}

@media (max-width: 880px) {
  .header__nav,
  .header__cta {
    display: none;
  }
  .header__toggle {
    display: block;
  }
  .header__mobile {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px var(--gutter) 24px;
  }
  .header__mobile a:not(.btn) {
    padding: 14px 4px;
    font-size: 17px;
    font-weight: 600;
    border-bottom: 1px solid var(--night-line);
  }
  .header__mobile .btn {
    margin-top: 16px;
  }
}
</style>
