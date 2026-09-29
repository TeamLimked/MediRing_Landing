<script setup lang="ts">
// Our standard — 결 있는 다크 배경 + 오른쪽 통계 카드(화면에 들어오면 숫자 카운트업)
import { sources, stats } from '~/data/content'

const cards = ref<HTMLElement[]>([])
const values = ref(stats.map((s) => (0).toFixed(s.decimals)))
let ctx: { revert(): void } | null = null

onMounted(async () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    values.value = stats.map((s) => s.to.toFixed(s.decimals))
    return
  }
  const { $gsap } = useNuxtApp()
  const gsap = $gsap as typeof import('gsap').gsap
  ctx = gsap.context(() => {
    stats.forEach((s, i) => {
      const counter = { v: 0 }
      gsap.to(counter, {
        v: s.to,
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: cards.value[i], start: 'top 85%', once: true },
        onUpdate: () => {
          values.value[i] = counter.v.toLocaleString('ko-KR', { minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals })
        },
      })
    })
  })
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="numbers" class="section num" aria-labelledby="num-title">
    <div class="num__bg" aria-hidden="true">
      <svg class="num__waves" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="nw" x1="0" x2="1">
            <stop offset="0" stop-color="#8fb8ff" stop-opacity="0" />
            <stop offset=".5" stop-color="#cfe3ff" stop-opacity=".55" />
            <stop offset="1" stop-color="#3ad6d4" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path v-for="k in 9" :key="k" :d="`M-100 ${520 + k * 26} C 300 ${300 + k * 30}, 700 ${820 - k * 12}, 1700 ${260 + k * 34}`" fill="none" stroke="url(#nw)" :stroke-width="1 + (k % 3) * 0.6" :style="{ '--d': `${k * -1.3}s` }" />
      </svg>
    </div>

    <div class="container num__grid">
      <div class="num__text">
        <p class="eyebrow">Our standard</p>
        <h2 id="num-title" class="display num__title" v-split data-split>
          매일의 영양을 확인하고 챙기는<br class="pc" /> 기준이 되겠습니다.
        </h2>
        <ul class="num__sources" aria-label="데이터 출처">
          <li v-for="s in sources" :key="s">{{ s }}</li>
        </ul>
      </div>

      <ul class="num__cards">
        <li v-for="(s, i) in stats" :key="s.label" ref="cards" v-reveal="i * 80" class="reveal num__card">
          <strong>
            <span class="num__prefix">{{ s.prefix }}</span>{{ values[i] }}<span class="num__suffix">{{ s.suffix }}</span>
          </strong>
          <span class="num__label">{{ s.label }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.num {
  overflow: hidden;
  background: radial-gradient(80% 70% at 20% 50%, #151b3a 0%, #070a1c 55%, var(--bg) 100%);
}
.num__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.num__waves {
  position: absolute;
  inset: -10% -5%;
  width: 110%;
  height: 120%;
  max-width: none;
  opacity: 0.6;
  filter: blur(0.4px);
}
.num__waves path {
  animation: drift 14s ease-in-out infinite alternate;
  animation-delay: var(--d);
}
@keyframes drift {
  to {
    transform: translate3d(-60px, 24px, 0) scaleY(1.06);
  }
}
.num__grid {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(32px, 5vw, 96px);
  align-items: start;
}
.num__text {
  position: sticky;
  top: calc(var(--header-h) + 48px);
}
.num__title {
  margin-top: 22px;
}
.num__sources {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: clamp(32px, 4vw, 56px) 0 0;
  padding: 0;
  list-style: none;
}
.num__sources li {
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  box-shadow: inset 0 0 0 1px var(--line-strong);
}
.num__cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.num__card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: clamp(28px, 3vw, 44px);
  background: rgba(40, 46, 80, 0.45);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: inset 0 0 0 1px rgba(236, 244, 255, 0.08);
}
.num__card strong {
  font-size: clamp(44px, 4.6vw, 80px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.num__prefix {
  margin-right: 0.2em;
  font-size: 0.45em;
  font-weight: 700;
  vertical-align: 0.2em;
  color: var(--muted);
}
.num__suffix {
  margin-left: 0.08em;
  font-size: 0.55em;
  color: var(--accent);
}
.num__label {
  font-size: 16px;
  font-weight: 700;
  color: rgba(242, 246, 250, 0.82);
}

@media (max-width: 900px) {
  .num__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .num__text {
    position: static;
  }
}
</style>
