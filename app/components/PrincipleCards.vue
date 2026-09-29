<script setup lang="ts">
// 마우스를 올리거나 포커스하면 넓어지는 카드(레퍼런스의 Our Capabilities 구성).
// 모바일에서는 세로 아코디언.
import { principles } from '~/data/content'

const active = ref(0)
</script>

<template>
  <ul class="pc">
    <li
      v-for="(p, i) in principles"
      :key="p.key"
      class="pc__card"
      :class="{ 'is-active': active === i }"
      :style="{ '--hue': p.hue }"
      @mouseenter="active = i"
      @focusin="active = i"
    >
      <div class="pc__bg" aria-hidden="true">
        <span class="pc__glow" />
        <span class="pc__grid" :class="`pc__grid--${i % 3}`" />
      </div>

      <button type="button" class="pc__head" :aria-expanded="active === i" @click="active = i">
        <span class="pc__no">0{{ i + 1 }}</span>
        <span class="pc__name">{{ p.title }}</span>
      </button>

      <div class="pc__body" :aria-hidden="active !== i">
        <h3 class="pc__title">{{ p.title }}</h3>
        <p class="pc__desc">{{ p.body }}</p>
        <p class="pc__spec">{{ p.spec }}</p>
        <NuxtLink :to="p.to" class="bracket bracket--sm pc__more" :tabindex="active === i ? 0 : -1">Learn more</NuxtLink>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.pc {
  display: flex;
  gap: 14px;
  height: clamp(420px, 34vw, 560px);
  margin: 0;
  padding: 0;
  list-style: none;
}
.pc__card {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  background: rgba(10, 15, 34, 0.72);
  box-shadow: inset 0 0 0 1px var(--line);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: flex-grow 0.8s var(--ease), box-shadow 0.4s;
}
.pc__card.is-active {
  flex-grow: 4.4;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--hue) 40%, transparent);
}

/* 배경: 색 번짐 + 격자/육각/점 패턴 */
.pc__bg,
.pc__glow,
.pc__grid {
  position: absolute;
  inset: 0;
}
.pc__glow {
  background:
    radial-gradient(70% 55% at 70% 110%, color-mix(in srgb, var(--hue) 55%, transparent), transparent 70%),
    radial-gradient(50% 40% at 10% 0%, color-mix(in srgb, var(--hue) 18%, transparent), transparent 70%);
  opacity: 0.55;
  transition: opacity 0.6s;
}
.is-active .pc__glow {
  opacity: 1;
}
.pc__grid {
  opacity: 0.35;
  mask-image: linear-gradient(0deg, #000 10%, transparent 75%);
  -webkit-mask-image: linear-gradient(0deg, #000 10%, transparent 75%);
  transition: opacity 0.6s, transform 1.2s var(--ease);
}
.is-active .pc__grid {
  opacity: 0.6;
  transform: scale(1.04);
}
.pc__grid--0 {
  background-image: radial-gradient(color-mix(in srgb, var(--hue) 80%, white) 1px, transparent 1.6px);
  background-size: 14px 14px;
}
.pc__grid--1 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='48.5' viewBox='0 0 28 48.5'%3E%3Cpath d='M14 0l14 8.08v16.17L14 32.33 0 24.25V8.08z M14 32.33v16.17' fill='none' stroke='%2349D0E4' stroke-width='.8' opacity='.9'/%3E%3C/svg%3E");
  background-size: 28px 48.5px;
}
.pc__grid--2 {
  background-image:
    linear-gradient(color-mix(in srgb, var(--hue) 50%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--hue) 50%, transparent) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* 접힌 상태: 가운데 세로 제목 */
.pc__head {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  border: 0;
  background: none;
  text-align: center;
  transition: opacity 0.35s;
}
.pc__no {
  font-size: 13px;
  font-weight: 800;
  color: var(--hue);
  letter-spacing: 0.08em;
}
.pc__name {
  font-size: clamp(16px, 1.2vw, 20px);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.02em;
}
.is-active .pc__head {
  opacity: 0;
  pointer-events: none;
}

/* 펼친 상태 */
.pc__body {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: clamp(28px, 3vw, 48px);
  opacity: 0;
  visibility: hidden;
  transform: translateY(16px);
  transition: opacity 0.4s, transform 0.6s var(--ease), visibility 0.4s;
}
.is-active .pc__body {
  opacity: 1;
  visibility: visible;
  transform: none;
  transition-delay: 0.25s;
}
.pc__title {
  font-size: clamp(28px, 2.4vw, 42px);
  font-weight: 800;
  letter-spacing: -0.035em;
}
.pc__desc {
  max-width: 520px;
  margin-top: 16px;
  font-size: clamp(15px, 1.05vw, 18px);
  line-height: 1.7;
  color: rgba(242, 246, 250, 0.85);
}
.pc__spec {
  margin-top: 14px;
  font-size: 14px;
  font-weight: 700;
  color: var(--hue);
}
.pc__more {
  align-self: flex-end;
  margin-top: auto;
}

@media (max-width: 900px) {
  .pc {
    flex-direction: column;
    height: auto;
    gap: 10px;
  }
  .pc__card {
    flex: none;
    height: 76px;
    transition: height 0.7s var(--ease), box-shadow 0.4s;
  }
  .pc__card.is-active {
    height: 360px;
  }
  .pc__head {
    flex-direction: row;
    justify-content: flex-start;
    padding: 0 22px;
  }
}
</style>
