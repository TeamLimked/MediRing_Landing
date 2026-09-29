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
  padding: calc(var(--header-h) + clamp(56px, 7vw, 110px)) 0 clamp(48px, 5vw, 80px);
  border-bottom: 1px solid var(--line);
  background:
    radial-gradient(45% 120% at 85% 0%, rgba(58, 214, 212, 0.16), transparent 70%),
    linear-gradient(rgba(236, 244, 255, 0.04) 1px, transparent 1px) 0 0 / 48px 48px,
    linear-gradient(90deg, rgba(236, 244, 255, 0.04) 1px, transparent 1px) 0 0 / 48px 48px,
    var(--bg);
}
.legal__crumb {
  display: flex;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
}
.legal__crumb a {
  color: var(--muted);
}
.legal__crumb a:hover {
  color: var(--ink);
}
.legal__title {
  margin-top: 18px;
  font-size: clamp(32px, 4vw, 60px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.2;
}
.legal__date {
  margin-top: 14px;
  font-size: 14px;
  color: var(--muted);
}
.legal__body {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  min-width: 0;
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
  padding-top: clamp(40px, 5vw, 72px);
  padding-bottom: clamp(96px, 10vw, 160px);
}
.legal__nav {
  position: sticky;
  top: calc(var(--header-h) + 32px);
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--line-strong);
}
.legal__nav a {
  padding: 14px 4px;
  border-bottom: 1px solid var(--line);
  font-size: 15px;
  font-weight: 600;
  color: var(--muted);
  transition: color 0.2s, padding 0.3s var(--ease);
}
.legal__nav a:hover {
  color: var(--ink);
  padding-left: 10px;
}
.legal__nav a.active {
  color: var(--accent);
  font-weight: 800;
}
.legal__doc {
  padding: clamp(24px, 4vw, 56px);
  background: var(--panel);
  box-shadow: inset 0 0 0 1px var(--line);
}
.legal__draft {
  margin-bottom: 32px;
  padding: 14px 18px;
  background: var(--warning-soft);
  box-shadow: inset 0 0 0 1px rgba(245, 184, 78, 0.3);
  color: #ffe2ae;
  font-size: 14px;
  font-weight: 600;
}

/* 본문(v-html) */
.prose {
  font-size: 16px;
  line-height: 1.85;
  color: rgba(242, 246, 250, 0.88);
}
.prose :deep(h2) {
  margin: 48px 0 14px;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--ink);
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
  color: var(--accent);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.prose :deep(strong) {
  font-weight: 800;
  color: var(--ink);
}
.prose :deep(.muted) {
  color: var(--faint);
  font-size: 14px;
}
.prose :deep(.table-wrap) {
  overflow-x: auto;
  box-shadow: inset 0 0 0 1px var(--line);
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
  padding: 14px 16px;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid var(--line);
}
.prose :deep(tr:last-child > *) {
  border-bottom: 0;
}
.prose :deep(th) {
  background: rgba(236, 244, 255, 0.04);
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}
.prose :deep(thead th) {
  background: var(--accent-soft);
  color: var(--accent);
}

@media (max-width: 900px) {
  .legal__body {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
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
    border-top: 0;
  }
  .legal__nav a {
    flex: none;
    padding: 9px 16px;
    border: 0;
    font-size: 14px;
    box-shadow: inset 0 0 0 1px var(--line);
  }
  .legal__nav a:hover {
    padding-left: 16px;
  }
  .legal__nav a.active {
    background: var(--accent);
    color: #03121a;
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
