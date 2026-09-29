<script setup lang="ts">
// 주요 기능 — 탭을 고르면 실제 앱 화면과 설명이 바뀐다(자동 넘김 없음).
import { features } from '~/data/content'

const active = ref(0)
const current = computed(() => features[active.value]!)
const tabs = ref<HTMLButtonElement[]>([])

function onKey(e: KeyboardEvent, i: number) {
  let next = -1
  if (e.key === 'ArrowRight') next = (i + 1) % features.length
  else if (e.key === 'ArrowLeft') next = (i - 1 + features.length) % features.length
  else if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = features.length - 1
  if (next < 0) return
  e.preventDefault()
  active.value = next
  tabs.value[next]?.focus()
}
</script>

<template>
  <section id="features" class="section section--card" aria-labelledby="features-title">
    <div class="container">
      <header class="section-head">
        <p class="eyebrow">주요 기능</p>
        <h2 id="features-title" class="title">매일 쓰는 화면은 단순하게</h2>
      </header>

      <div class="ft-tabs" role="tablist" aria-label="주요 기능">
        <button
          v-for="(f, i) in features"
          :id="`feature-tab-${f.key}`"
          :key="f.key"
          ref="tabs"
          type="button"
          role="tab"
          class="ft-tab"
          :class="{ on: active === i }"
          :aria-selected="active === i"
          aria-controls="feature-panel"
          :tabindex="active === i ? 0 : -1"
          @click="active = i"
          @keydown="onKey($event, i)"
        >
          {{ f.label }}
        </button>
      </div>

      <div id="feature-panel" class="ft-panel" role="tabpanel" :aria-labelledby="`feature-tab-${current.key}`">
        <div class="ft-panel__text">
          <h3 class="ft-panel__title">{{ current.title }}</h3>
          <ul class="ft-panel__points">
            <li v-for="p in current.points" :key="p">{{ p }}</li>
          </ul>
        </div>
        <div class="ft-panel__visual">
          <PhoneShot :key="current.screen" :screen="current.screen" :alt="`MediRing 앱 ${current.label} 화면`" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ft-tabs {
  display: flex;
  gap: 4px;
  padding: 4px;
  width: fit-content;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: var(--r-btn);
  background: var(--bg);
}
.ft-tab {
  flex: none;
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: var(--muted);
  font-size: 15px;
  font-weight: 600;
}
.ft-tab:hover {
  color: var(--ink);
}
.ft-tab.on {
  background: var(--card);
  color: var(--ink);
  box-shadow: 0 0 0 1px var(--line);
}
.ft-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 300px);
  gap: clamp(32px, 6vw, 80px);
  align-items: center;
  margin-top: 32px;
}
.ft-panel__title {
  font-size: clamp(22px, 2.2vw, 26px);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.ft-panel__points {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.ft-panel__points li {
  position: relative;
  padding: 12px 0 12px 22px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  line-height: 1.7;
}
.ft-panel__points li:last-child {
  border-bottom: 1px solid var(--line);
}
.ft-panel__points li::before {
  content: '';
  position: absolute;
  top: 23px;
  left: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
.ft-panel__visual {
  display: flex;
  justify-content: center;
}

@media (max-width: 820px) {
  .ft-panel {
    grid-template-columns: minmax(0, 1fr);
  }
  .ft-panel__visual :deep(.phone) {
    max-width: 240px;
  }
}
</style>
