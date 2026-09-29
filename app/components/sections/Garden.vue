<script setup lang="ts">
import { gardenStages } from '~/data/content'

// 앱(MediRing_APP/src/lib/garden.tsx) 규칙: 시작 55 XP, 하루 한 번 루틴 완료 +20, 정원 돌보기 +15
const INIT_XP = 55
const DAILY_XP = 35
const MAX_DAYS = 12

const days = ref(3)
const xp = computed(() => INIT_XP + days.value * DAILY_XP)
const stageIndex = computed(() => {
  let idx = 0
  gardenStages.forEach((s, i) => {
    if (xp.value >= s.xp) idx = i
  })
  return idx
})
const stage = computed(() => gardenStages[stageIndex.value]!)
const next = computed(() => gardenStages[stageIndex.value + 1])
const progress = computed(() => {
  if (!next.value) return 1
  return (xp.value - stage.value.xp) / (next.value.xp - stage.value.xp)
})
</script>

<template>
  <section id="garden" class="section garden">
    <div class="container garden__grid">
      <div class="garden__copy">
        <header v-reveal class="reveal">
          <p class="eyebrow">루틴 정원</p>
          <h2 class="h2">챙길수록 자라는<br /><em>나만의 새싹이</em></h2>
          <p class="lead">
            섭취 루틴을 마치고 정원을 돌보면 경험치가 쌓여 새싹이가 자라요. 작은 보상이 모여 매일의 습관이 됩니다.
          </p>
        </header>

        <div v-reveal="100" class="reveal garden__control card">
          <label for="garden-days" class="garden__label">
            꾸준히 챙긴 날
            <output for="garden-days"><b>{{ days }}</b>일</output>
          </label>
          <input
            id="garden-days"
            v-model.number="days"
            type="range"
            min="0"
            :max="MAX_DAYS"
            step="1"
            :style="{ '--fill': `${(days / MAX_DAYS) * 100}%` }"
            :aria-valuetext="`${days}일, ${stage.name} 단계`"
          />
          <ol class="garden__stages" aria-label="성장 단계">
            <li v-for="(s, i) in gardenStages" :key="s.key" :class="{ done: i < stageIndex, current: i === stageIndex }">
              {{ s.name }}
            </li>
          </ol>
          <p class="garden__hint">하루 한 번 루틴 완료(+20 XP)와 정원 돌보기(+15 XP)를 모두 한 경우의 예시예요.</p>
        </div>
      </div>

      <div v-reveal="150" class="reveal garden__stage" :data-stage="stageIndex" aria-live="polite">
        <div class="room" aria-hidden="true">
          <div class="room__window">
            <span class="room__sun" />
          </div>
          <div class="room__shelf" />
          <svg class="plant" viewBox="0 0 200 220">
            <!-- 꽃 -->
            <g class="part part--5" style="--o: 100px 62px">
              <circle v-for="k in 6" :key="k" cx="100" cy="44" r="13" fill="#FF9FC0" :transform="`rotate(${k * 60} 100 62)`" />
              <circle cx="100" cy="62" r="11" fill="#F7B801" />
            </g>
            <!-- 꽃봉오리 -->
            <g class="part part--4 part--hide5" style="--o: 100px 70px">
              <path d="M100 48c9 6 11 16 0 24-11-8-9-18 0-24z" fill="#FF6B9D" />
              <path d="M92 70c4-2 12-2 16 0l-8 6z" fill="#10B981" />
            </g>
            <!-- 줄기 -->
            <path class="stem" d="M100 172V70" stroke="#0A7D55" stroke-width="6" stroke-linecap="round" fill="none" />
            <!-- 잎(잎새) -->
            <g class="part part--3" style="--o: 100px 118px">
              <path d="M100 118c-4-18-22-26-40-22 4 18 22 26 40 22z" fill="#12C4B0" />
              <path d="M100 104c4-18 22-26 40-22-4 18-22 26-40 22z" fill="#34D9A0" />
            </g>
            <!-- 떡잎 -->
            <g class="part part--2" style="--o: 100px 140px">
              <path d="M100 140c-2-14-16-22-32-18 3 14 16 21 32 18z" fill="#10B981" />
              <path d="M100 140c2-14 16-22 32-18-3 14-16 21-32 18z" fill="#34D9A0" />
            </g>
            <!-- 새싹 -->
            <g class="part part--1" style="--o: 100px 160px">
              <path d="M100 160c-1-8-8-12-16-11 1 8 8 12 16 11z" fill="#34D9A0" />
              <path d="M100 160c1-8 8-12 16-11-1 8-8 12-16 11z" fill="#10B981" />
            </g>
            <!-- 씨앗 -->
            <ellipse class="seed" cx="100" cy="170" rx="7" ry="5" fill="#B7791F" />
            <!-- 화분 -->
            <path d="M58 170h84l-9 44H67z" fill="#FF8A3D" />
            <rect x="52" y="162" width="96" height="14" rx="7" fill="#FF9F5A" />
            <ellipse cx="100" cy="164" rx="40" ry="4" fill="#7A4B1F" opacity=".55" />
          </svg>
        </div>

        <div class="garden__info card">
          <div class="garden__info-top">
            <span class="garden__stage-name">{{ stage.name }}</span>
            <span class="garden__xp">{{ xp }} XP</span>
          </div>
          <div class="garden__bar" aria-hidden="true"><span :style="{ width: `${progress * 100}%` }" /></div>
          <p class="garden__episode">{{ stage.episode }}</p>
          <p v-if="next" class="garden__next">다음 단계 「{{ next.name }}」까지 {{ next.xp - xp }} XP</p>
          <p v-else class="garden__next">정원이 완성됐어요!</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.garden {
  background: var(--bg-2);
  overflow: hidden;
}
.garden__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 6vw, 80px);
  align-items: center;
}
.garden__control {
  margin-top: 36px;
  padding: 24px;
}
.garden__label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 700;
}
.garden__label output b {
  font-size: 28px;
  font-weight: 800;
  color: var(--accent-strong);
  font-variant-numeric: tabular-nums;
}
input[type='range'] {
  width: 100%;
  height: 32px;
  margin: 12px 0 8px;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
}
input[type='range']::-webkit-slider-runnable-track {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent) var(--fill), var(--line) var(--fill));
}
input[type='range']::-moz-range-track {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent) var(--fill), var(--line) var(--fill));
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px;
  height: 28px;
  margin-top: -9px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 4px var(--accent), 0 6px 14px rgba(14, 42, 32, 0.25);
  cursor: grab;
}
input[type='range']::-moz-range-thumb {
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 4px var(--accent), 0 6px 14px rgba(14, 42, 32, 0.25);
  cursor: grab;
}
.garden__stages {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}
.garden__stages li {
  position: relative;
  padding-top: 14px;
  text-align: center;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--faint);
}
.garden__stages li::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  border-radius: 50%;
  background: var(--line);
  transition: background-color 0.3s, transform 0.3s;
}
.garden__stages li.done::before {
  background: var(--accent);
}
.garden__stages li.current {
  color: var(--accent-strong);
  font-weight: 800;
}
.garden__stages li.current::before {
  background: var(--spark);
  transform: scale(1.5);
}
.garden__hint {
  margin-top: 16px;
  font-size: 13px;
  color: var(--faint);
}

.garden__stage {
  position: relative;
}
.room {
  position: relative;
  aspect-ratio: 1 / 0.9;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: linear-gradient(180deg, #fff8ee 0%, #fdeedd 100%);
  box-shadow: var(--shadow-card);
  transition: background 0.8s;
}
[data-stage='3'] .room,
[data-stage='4'] .room,
[data-stage='5'] .room {
  background: linear-gradient(180deg, #effbf4 0%, #d9f4e6 100%);
}
.room__window {
  position: absolute;
  top: 12%;
  left: 12%;
  width: 34%;
  aspect-ratio: 1 / 1.15;
  border-radius: 999px 999px 16px 16px;
  background: linear-gradient(180deg, #bfeaf3, #e4f7fb);
  box-shadow: inset 0 0 0 8px #fff;
  overflow: hidden;
}
.room__sun {
  position: absolute;
  top: 58%;
  left: 50%;
  width: 46%;
  aspect-ratio: 1;
  margin-left: -23%;
  border-radius: 50%;
  background: #ffc857;
  box-shadow: 0 0 40px 10px rgba(255, 200, 87, 0.6);
  transition: top 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}
[data-stage='1'] .room__sun {
  top: 46%;
}
[data-stage='2'] .room__sun {
  top: 34%;
}
[data-stage='3'] .room__sun,
[data-stage='4'] .room__sun,
[data-stage='5'] .room__sun {
  top: 20%;
}
.room__shelf {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 22%;
  background: #f1dcc4;
  box-shadow: 0 -6px 0 #e7ccae;
}
.plant {
  position: absolute;
  right: 10%;
  bottom: 12%;
  width: 52%;
  height: auto;
}
.stem {
  stroke-dasharray: 110;
  stroke-dashoffset: 110;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.2, 0.7, 0.2, 1);
}
[data-stage='1'] .stem {
  stroke-dashoffset: 94;
}
[data-stage='2'] .stem {
  stroke-dashoffset: 70;
}
[data-stage='3'] .stem {
  stroke-dashoffset: 40;
}
[data-stage='4'] .stem,
[data-stage='5'] .stem {
  stroke-dashoffset: 0;
}
.part {
  transform-origin: var(--o);
  transform: scale(0);
  opacity: 0;
  transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s;
}
.seed {
  transition: opacity 0.4s;
}
.garden__stage:not([data-stage='0']) .seed {
  opacity: 0;
}
[data-stage='1'] .part--1,
[data-stage='2'] .part--2,
[data-stage='3'] .part--2,
[data-stage='3'] .part--3,
[data-stage='4'] .part--2,
[data-stage='4'] .part--3,
[data-stage='4'] .part--4,
[data-stage='5'] .part--2,
[data-stage='5'] .part--3,
[data-stage='5'] .part--5 {
  transform: scale(1);
  opacity: 1;
}

.garden__info {
  position: relative;
  width: min(360px, 90%);
  margin: -64px 0 0 auto;
  margin-right: -8px;
  padding: 20px 22px;
}
.garden__info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.garden__stage-name {
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--accent-strong);
}
.garden__xp {
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--spark-soft);
  color: #b4530f;
  font-size: 13px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.garden__bar {
  height: 8px;
  margin: 12px 0 14px;
  border-radius: 999px;
  background: var(--line);
  overflow: hidden;
}
.garden__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--accent), var(--aqua));
  transition: width 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.garden__episode {
  font-size: 15px;
}
.garden__next {
  margin-top: 6px;
  font-size: 13px;
  color: var(--faint);
}

@media (max-width: 900px) {
  .garden__grid {
    grid-template-columns: 1fr;
  }
  .garden__info {
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
