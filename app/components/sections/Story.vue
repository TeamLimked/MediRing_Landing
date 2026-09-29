<script setup lang="ts">
// Who we are(화면 고정 스크롤) → Our Principles. 두 섹션 뒤로 three.js 배경이 따라온다(sticky 캔버스).
import type { WhoScene } from '~/lib/who-scene'

const stage = ref<HTMLElement | null>(null)
const canvasHost = ref<HTMLElement | null>(null)
const whoEl = ref<HTMLElement | null>(null)
const whoText = ref<HTMLElement | null>(null)
const principlesEl = ref<HTMLElement | null>(null)
const ready = ref(false)

let scene: WhoScene | null = null
let ctx: { revert(): void } | null = null
let unmounted = false
let whoP = 0
let prinP = 0

onMounted(async () => {
  const { $gsap } = useNuxtApp()
  const gsap = $gsap as typeof import('gsap').gsap
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  try {
    const { createWhoScene } = await import('~/lib/who-scene')
    if (unmounted || !canvasHost.value) return
    scene = createWhoScene(canvasHost.value)
    ready.value = true
  } catch (e) {
    if (import.meta.dev) console.warn('[who] 3D 장면을 시작하지 못했습니다:', e)
  }
  if (unmounted || reduced) return

  ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: whoEl.value,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        whoP = self.progress
        scene?.setProgress(whoP, prinP)
      },
    })
    ScrollTrigger.create({
      trigger: principlesEl.value,
      start: 'top bottom',
      end: 'top 20%',
      scrub: true,
      onUpdate: (self) => {
        prinP = self.progress
        scene?.setProgress(whoP, prinP)
      },
    })
    // 문구: 처음엔 보이다가 전환 구간에서 위로 사라짐
    gsap
      .timeline({ scrollTrigger: { trigger: whoEl.value, start: 'top top', end: 'bottom bottom', scrub: true } })
      .to(whoText.value, { opacity: 0, y: -80, ease: 'none', duration: 0.16 }, 0.3)
      .to({}, { duration: 0.54 }, 0.46)
  }, stage.value!)
})

onBeforeUnmount(() => {
  unmounted = true
  ctx?.revert()
  scene?.dispose()
  scene = null
})
</script>

<template>
  <div ref="stage" class="stage">
    <div class="stage__canvas" aria-hidden="true">
      <div ref="canvasHost" class="stage__host" :class="{ ready }" />
      <div class="stage__fade" />
    </div>

    <section id="who" ref="whoEl" class="who" aria-labelledby="who-title">
      <div class="who__sticky">
        <div ref="whoText" class="who__text">
          <p class="eyebrow">Who we are</p>
          <h2 id="who-title" class="display who__title" v-split data-split>
            메디링은 검증된 기준 데이터와<br class="pc" /> 안전 규칙으로 매일의 영양을 지킵니다.
          </h2>
          <NuxtLink to="/#principles" class="bracket who__more">Learn more</NuxtLink>
        </div>
      </div>
    </section>

    <section id="principles" ref="principlesEl" class="section principles" aria-labelledby="principles-title">
      <div class="container">
        <p class="eyebrow">How we work</p>
        <h2 id="principles-title" class="principles__title" v-split data-split>Our Principles</h2>
        <PrincipleCards />
      </div>
    </section>
  </div>
</template>

<style scoped>
.stage {
  position: relative;
  background: var(--bg);
}
.stage__canvas {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  margin-bottom: -100vh;
  margin-bottom: -100svh;
  overflow: hidden;
  pointer-events: none;
}
.stage__host {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.2s ease;
}
.stage__host.ready {
  opacity: 1;
}
.stage__fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--bg) 0%, transparent 14%, transparent 80%, var(--bg) 100%);
}
.who {
  position: relative;
  height: 280vh;
}
.who__sticky {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  height: 100vh;
  height: 100svh;
  padding: 0 var(--gutter);
}
.who__text {
  position: relative;
  max-width: 900px;
}
.who__title {
  margin-top: 22px;
}
.who__more {
  margin-top: clamp(40px, 5vw, 72px);
}
.principles {
  position: relative;
  padding-top: clamp(40px, 8vw, 120px);
}
.principles__title {
  margin: 22px 0 clamp(36px, 4vw, 56px);
  font-size: clamp(38px, 3.6vw, 64px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

@media (max-width: 760px) {
  .who__sticky {
    align-items: flex-start;
    padding-top: calc(var(--header-h) + 48px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .who {
    height: auto;
  }
  .who__sticky {
    position: relative;
  }
}
</style>
