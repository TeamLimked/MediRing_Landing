<script setup lang="ts">
// 상단 헤더 — 로고 | 섹션 링크 | 앱 받기. 좁은 화면에서는 메뉴 버튼으로 펼친다.
const links = [
  { label: '이용 흐름', to: '/#how' },
  { label: '안전 점검', to: '/#safety' },
  { label: '주요 기능', to: '/#features' },
  { label: '기준 데이터', to: '/#standards' },
  { label: '자주 묻는 질문', to: '/#faq' },
]

const route = useRoute()
const open = ref(false)

watch(
  () => route.fullPath,
  () => (open.value = false),
)

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <header class="hd">
    <div class="container hd__bar">
      <NuxtLink to="/" class="hd__logo" aria-label="MediRing 홈">
        <AppLogo />
      </NuxtLink>

      <nav class="hd__nav" aria-label="주요 메뉴">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" class="hd__link">{{ l.label }}</NuxtLink>
      </nav>

      <div class="hd__actions">
        <NuxtLink to="/#download" class="btn btn--primary btn--sm hd__cta">앱 받기</NuxtLink>
        <button
          type="button"
          class="hd__menu"
          :aria-expanded="open"
          aria-controls="hd-mobile"
          :aria-label="open ? '메뉴 닫기' : '메뉴 열기'"
          @click="open = !open"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path v-if="!open" d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path v-else d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <nav v-show="open" id="hd-mobile" class="hd__mobile" aria-label="주요 메뉴">
      <div class="container">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
        <NuxtLink to="/support">고객 지원</NuxtLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.hd {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--card);
  border-bottom: 1px solid var(--line);
}
.hd__bar {
  display: flex;
  align-items: center;
  gap: 24px;
  height: var(--header-h);
}
.hd__logo {
  flex: none;
}
.hd__nav {
  display: flex;
  gap: 4px;
  margin-left: 16px;
}
.hd__link {
  padding: 8px 12px;
  border-radius: var(--r-btn);
  font-size: 15px;
  font-weight: 500;
  color: var(--muted);
}
.hd__link:hover {
  color: var(--ink);
  background: var(--bg);
}
.hd__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
.hd__menu {
  display: none;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: var(--r-btn);
  background: var(--card);
}
.hd__mobile {
  border-top: 1px solid var(--line);
  background: var(--card);
}
.hd__mobile .container {
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  padding-bottom: 12px;
}
.hd__mobile a {
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  font-size: 16px;
  font-weight: 500;
}
.hd__mobile a:last-child {
  border-bottom: 0;
}

@media (max-width: 920px) {
  .hd__nav {
    display: none;
  }
  .hd__menu {
    display: grid;
  }
}
@media (min-width: 921px) {
  .hd__mobile {
    display: none !important;
  }
}
</style>
