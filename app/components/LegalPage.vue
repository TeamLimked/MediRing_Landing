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

      <article class="legal__doc card">
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
  padding: calc(var(--header-h) + 56px) 0 56px;
  background: radial-gradient(50% 120% at 85% 0%, rgba(52, 217, 160, 0.18), transparent 70%), var(--night);
  color: var(--night-ink);
}
.legal__crumb {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: var(--night-muted);
}
.legal__crumb a:hover {
  color: var(--night-ink);
}
.legal__title {
  margin-top: 14px;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.25;
}
.legal__date {
  margin-top: 10px;
  font-size: 14px;
  color: var(--night-muted);
}
.legal__body {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  min-width: 0;
  gap: 32px;
  align-items: start;
  padding-top: 40px;
  padding-bottom: 96px;
}
.legal__nav {
  position: sticky;
  top: calc(var(--header-h) + 24px);
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.legal__nav a {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: var(--muted);
  transition: background-color 0.2s, color 0.2s;
}
.legal__nav a:hover {
  background: var(--accent-soft);
  color: var(--ink);
}
.legal__nav a.active {
  background: var(--card);
  color: var(--accent-strong);
  box-shadow: inset 0 0 0 1px var(--line);
}
.legal__doc {
  padding: clamp(24px, 4vw, 48px);
}
.legal__draft {
  margin-bottom: 28px;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--warning-soft);
  color: #7a4b00;
  font-size: 14px;
  font-weight: 600;
}

/* 본문(v-html) */
.prose {
  font-size: 16px;
  line-height: 1.8;
  color: var(--ink);
}
.prose :deep(h2) {
  margin: 40px 0 12px;
  font-size: 20px;
  font-weight: 800;
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
  margin-top: 14px;
}
.prose :deep(ul) {
  margin: 0;
  padding-left: 1.3em;
}
.prose :deep(li + li) {
  margin-top: 6px;
}
.prose :deep(li::marker) {
  color: var(--accent);
}
.prose :deep(a) {
  color: var(--accent-strong);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose :deep(strong) {
  font-weight: 800;
}
.prose :deep(.muted) {
  color: var(--faint);
  font-size: 14px;
}
.prose :deep(.table-wrap) {
  overflow-x: auto;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px var(--line);
}
.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 14.5px;
  line-height: 1.65;
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
.prose :deep(thead th) {
  background: var(--accent-soft);
  color: var(--accent-strong);
}

@media (max-width: 860px) {
  .legal__body {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }
  .legal__nav {
    position: static;
    flex-direction: row;
    gap: 6px;
    margin: 0 calc(var(--gutter) * -1);
    padding: 0 var(--gutter) 4px;
    overflow-x: auto;
    scrollbar-width: none;
    min-width: 0;
  }
  .legal__nav a {
    flex: none;
    padding: 8px 14px;
    font-size: 14px;
    border-radius: 999px;
    background: var(--card);
    box-shadow: inset 0 0 0 1px var(--line);
  }
  .legal__nav a.active {
    background: var(--accent-strong);
    color: #fff;
    box-shadow: none;
  }
  .prose :deep(th) {
    white-space: normal;
  }
  .prose :deep(tbody th) {
    width: 30%;
  }
}
</style>
