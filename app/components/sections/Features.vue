<script setup lang="ts">
// What we do — 왼쪽 괄호 탭 목록 + 오른쪽 큰 슬라이더(하위 탭·캡션·진행 바, 자동 넘김)
import { featureTabs } from '~/data/content'

const SLIDE_MS = 6000
const tab = ref(0)
const slide = ref(0)
const progress = ref(0)
const paused = ref(false)
const inView = ref(false)

const current = computed(() => featureTabs[tab.value]!)
const currentSlide = computed(() => current.value.slides[slide.value]!)

function select(t: number, s = 0) {
  tab.value = t
  slide.value = s
  progress.value = 0
}
function next() {
  if (slide.value < current.value.slides.length - 1) select(tab.value, slide.value + 1)
  else select((tab.value + 1) % featureTabs.length, 0)
}

const root = ref<HTMLElement | null>(null)
let raf = 0
let last = 0
let io: IntersectionObserver | null = null
const reduced = ref(false)

function loop(now: number) {
  const dt = last ? now - last : 0
  last = now
  if (!paused.value && inView.value && !reduced.value) {
    progress.value += dt / SLIDE_MS
    if (progress.value >= 1) next()
  }
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  io = new IntersectionObserver((entries) => (inView.value = entries.some((e) => e.isIntersecting)), { threshold: 0.35 })
  if (root.value) io.observe(root.value)
  raf = requestAnimationFrame(loop)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  io?.disconnect()
})
</script>

<template>
  <section id="features" ref="root" class="section what" aria-labelledby="what-title">
    <div class="container what__grid">
      <div class="what__side">
        <p class="eyebrow">What we do</p>
        <Transition name="swap" mode="out-in">
          <h2 id="what-title" :key="current.key" class="what__title">{{ current.label }}</h2>
        </Transition>

        <div class="what__tabs" role="tablist" aria-label="기능 분류">
          <button
            v-for="(t, i) in featureTabs"
            :key="t.key"
            type="button"
            role="tab"
            class="what__tab"
            :class="{ on: tab === i }"
            :aria-selected="tab === i"
            aria-controls="what-panel"
            @click="select(i)"
          >
            {{ t.label }}
            <span class="what__dot" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="what-panel"
        class="what__panel"
        role="tabpanel"
        :aria-label="`${current.label} · ${currentSlide.label}`"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
        @focusin="paused = true"
        @focusout="paused = false"
      >
        <Transition name="fade">
          <FeatureVisual :key="currentSlide.kind" :kind="currentSlide.kind" />
        </Transition>
        <div class="what__shade" aria-hidden="true" />

        <div class="what__subs">
          <button
            v-for="(s, i) in current.slides"
            :key="s.kind"
            type="button"
            :class="{ on: slide === i }"
            :aria-pressed="slide === i"
            @click="select(tab, i)"
          >
            {{ s.label }}
          </button>
        </div>

        <NuxtLink :to="currentSlide.to" class="arrow-link what__caption">
          <Transition name="swap" mode="out-in">
            <span :key="currentSlide.caption">{{ currentSlide.caption }}</span>
          </Transition>
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </NuxtLink>

        <div class="what__progress" aria-hidden="true">
          <span :style="{ transform: `scaleX(${reduced ? 1 : progress})` }" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.what {
  background: #02030d;
}
.what__grid {
  display: grid;
  grid-template-columns: minmax(220px, 3fr) minmax(0, 9fr);
  gap: clamp(24px, 3vw, 56px);
  align-items: stretch;
}
.what__side {
  display: flex;
  flex-direction: column;
}
.what__title {
  margin-top: 22px;
  font-size: clamp(34px, 3vw, 56px);
  font-weight: 800;
  letter-spacing: -0.04em;
}
/* 괄호로 감싼 탭 목록 */
.what__tabs {
  --b: var(--line-strong);
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: min(260px, 100%);
  margin-top: auto;
  padding: 12px;
  background:
    linear-gradient(var(--b), var(--b)) top left / 10px 1px no-repeat,
    linear-gradient(var(--b), var(--b)) top left / 1px 10px no-repeat,
    linear-gradient(var(--b), var(--b)) top right / 10px 1px no-repeat,
    linear-gradient(var(--b), var(--b)) top right / 1px 10px no-repeat,
    linear-gradient(var(--b), var(--b)) bottom left / 10px 1px no-repeat,
    linear-gradient(var(--b), var(--b)) bottom left / 1px 10px no-repeat,
    linear-gradient(var(--b), var(--b)) bottom right / 10px 1px no-repeat,
    linear-gradient(var(--b), var(--b)) bottom right / 1px 10px no-repeat;
}
.what__tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 18px;
  border: 0;
  background: rgba(16, 23, 47, 0.8);
  font-size: 15px;
  font-weight: 700;
  text-align: left;
  transition: background-color 0.3s, color 0.3s;
}
.what__tab:hover {
  background: rgba(26, 36, 70, 0.9);
}
.what__tab.on {
  background: var(--accent);
  color: #03121a;
}
.what__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1.5px currentColor;
}
.what__tab.on .what__dot {
  background: currentColor;
}

.what__panel {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #060a18;
}
.what__shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(0deg, rgba(2, 3, 13, 0.7) 0%, transparent 30%);
}
.what__subs {
  position: absolute;
  top: clamp(18px, 2.4vw, 36px);
  right: clamp(18px, 2.4vw, 36px);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}
.what__subs button {
  padding: 2px 0;
  border: 0;
  background: none;
  font-size: 14px;
  font-weight: 700;
  color: var(--faint);
  transition: color 0.2s;
}
.what__subs button.on {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 5px;
}
.what__caption {
  position: absolute;
  left: clamp(20px, 2.6vw, 40px);
  bottom: clamp(28px, 3vw, 48px);
  font-size: clamp(22px, 2vw, 34px);
}
.what__progress {
  position: absolute;
  inset: auto 0 0;
  height: 3px;
  background: rgba(236, 244, 255, 0.12);
}
.what__progress span {
  display: block;
  height: 100%;
  background: var(--accent);
  transform-origin: left;
  box-shadow: 0 0 10px var(--accent);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s var(--ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 960px) {
  .what__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .what__tabs {
    flex-direction: row;
    width: 100%;
    margin-top: 28px;
  }
  .what__tab {
    flex: 1;
    justify-content: center;
    padding: 0 8px;
    font-size: 14px;
  }
  .what__dot {
    display: none;
  }
  .what__panel {
    aspect-ratio: 3 / 4;
  }
}
</style>
