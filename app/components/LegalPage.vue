<script setup lang="ts">
// 약관·정책·고객지원 공통 레이아웃. 본문은 data/legal.ts 의 정적 HTML(백엔드 원문)이다.
const props = defineProps<{ slug: string; heading: string; html: string; date?: string }>()

const links = useSiteLinks()
const router = useRouter()

const nav = computed(() => [
  ...links.docs.map((d) => ({ slug: d.slug, label: d.nav, to: links.legal(d.slug) })),
  { slug: 'support', label: '고객 지원', to: links.support },
])

// v-html 안의 내부 링크(/legal/...)는 전체 새로고침 대신 라우터로 이동
function onClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return
  const url = new URL(a.href, window.location.href)
  if (url.origin !== window.location.origin) return
  const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
  if (!url.pathname.startsWith(`${base}/`)) return
  e.preventDefault()
  router.push(url.pathname.slice(base.length) + url.hash)
}

const active = computed(() => props.slug)

const navEl = ref<HTMLElement | null>(null)
function revealActive() {
  const el = navEl.value?.querySelector<HTMLElement>('a.active')
  const nav = navEl.value
  if (!el || !nav || nav.scrollWidth <= nav.clientWidth) return
  nav.scrollLeft = el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2
}
onMounted(revealActive)
watch(active, () => nextTick(revealActive))
</script>

<template>
  <div class="legal">
    <header class="legal__band">
      <div class="container">
        <p class="legal__crumb">
          <NuxtLink to="/">홈</NuxtLink>
          <span aria-hidden="true">/</span>
          약관 및 정책
        </p>
        <h1 class="legal__title">{{ heading }}</h1>
        <p v-if="date" class="legal__date">시행일 {{ date }} · {{ links.company.name }}</p>
      </div>
    </header>

    <div class="container legal__body">
      <nav ref="navEl" class="legal__nav" aria-label="약관 및 정책 목록">
        <NuxtLink
          v-for="n in nav"
          :key="n.slug"
          :to="n.to"
          :class="{ active: active === n.slug }"
          :aria-current="active === n.slug ? 'page' : undefined"
        >
          {{ n.label }}
        </NuxtLink>
      </nav>

      <article class="legal__doc">
        <p v-if="links.legalDraft" class="legal__draft">이 문서는 출시 전 초안이며 법무 검토 후 확정됩니다.</p>
        <!-- eslint-disable-next-line vue/no-v-html -- 저장소에 고정된 정적 문구(백엔드 원문), 회사 정보는 이스케이프됨 -->
        <div class="prose" @click="onClick" v-html="html" />
      </article>
    </div>
  </div>
</template>

<style scoped>
.legal {
  min-height: 100vh;
  background: var(--bg);
}
.legal__band {
  padding: clamp(40px, 5vw, 64px) 0 clamp(28px, 3vw, 40px);
  border-bottom: 1px solid var(--line);
  background: var(--card);
}
.legal__crumb {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: var(--faint);
}
.legal__crumb a {
  color: var(--muted);
}
.legal__crumb a:hover {
  color: var(--ink);
  text-decoration: underline;
}
.legal__title {
  margin-top: 10px;
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.3;
}
.legal__date {
  margin-top: 8px;
  font-size: 14px;
  color: var(--muted);
}
.legal__body {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  min-width: 0;
  gap: clamp(24px, 3vw, 48px);
  align-items: start;
  padding-top: clamp(28px, 3vw, 48px);
  padding-bottom: clamp(72px, 8vw, 120px);
}
.legal__nav {
  position: sticky;
  top: calc(var(--header-h) + 24px);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.legal__nav a {
  padding: 8px 12px;
  border-radius: var(--r-btn);
  font-size: 15px;
  color: var(--muted);
}
.legal__nav a:hover {
  color: var(--ink);
  background: var(--card);
}
.legal__nav a.active {
  color: var(--accent-strong);
  background: var(--accent-soft);
  font-weight: 700;
}
.legal__doc {
  padding: clamp(20px, 3.4vw, 44px);
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--r-card);
}
.legal__draft {
  margin-bottom: 28px;
  padding: 12px 16px;
  border-radius: var(--r-btn);
  background: var(--warning-soft);
  color: var(--ink);
  font-size: 14px;
}

/* 본문(v-html) */
.prose {
  font-size: 16px;
  line-height: 1.8;
  color: var(--ink);
}
.prose :deep(h2) {
  margin: 40px 0 12px;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.prose :deep(h2:first-child) {
  margin-top: 0;
}
.prose :deep(p + p),
.prose :deep(p + ul),
.prose :deep(ul + p),
.prose :deep(.table-wrap + p),
.prose :deep(p + .table-wrap) {
  margin-top: 12px;
}
.prose :deep(ul) {
  margin: 0;
  padding-left: 1.3em;
}
.prose :deep(li + li) {
  margin-top: 4px;
}
.prose :deep(a) {
  color: var(--accent-strong);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose :deep(strong) {
  font-weight: 700;
}
.prose :deep(.muted) {
  color: var(--muted);
  font-size: 14px;
}
.prose :deep(.table-wrap) {
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: var(--r-btn);
}
.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 14.5px;
  line-height: 1.7;
}
.prose :deep(table:has(thead)) {
  min-width: 560px;
}
.prose :deep(th),
.prose :deep(td) {
  padding: 12px 14px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--line);
}
.prose :deep(tr:last-child > *) {
  border-bottom: 0;
}
.prose :deep(th) {
  background: var(--bg);
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .legal__body {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
  .legal__nav {
    position: static;
    flex-direction: row;
    gap: 6px;
    min-width: 0;
    margin: 0 calc(var(--gutter) * -1);
    padding: 0 var(--gutter) 4px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .legal__nav a {
    flex: none;
    padding: 7px 14px;
    border: 1px solid var(--line);
    font-size: 14px;
    background: var(--card);
  }
  .legal__nav a.active {
    border-color: var(--accent-strong);
  }
  .prose :deep(th) {
    white-space: normal;
  }
  .prose :deep(tbody th) {
    width: 30%;
  }
}
</style>
