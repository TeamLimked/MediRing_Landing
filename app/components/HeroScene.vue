<script setup lang="ts">
// three.js 장면 호스트(<ClientOnly> 안에서만 쓴다). three 는 여기서만 동적 import → 초기 HTML·JS 를 가볍게 유지.
// WebGL 을 쓸 수 없으면 조용히 CSS 포스터(부모의 배경)만 남는다.
const host = ref<HTMLDivElement | null>(null)
const ready = ref(false)
let dispose: (() => void) | null = null
let unmounted = false

onMounted(async () => {
  const el = host.value
  if (!el) return
  try {
    const { createHeroScene } = await import('~/lib/hero-scene')
    if (unmounted) return
    dispose = createHeroScene(el, { onReady: () => (ready.value = true) })
  } catch (e) {
    if (import.meta.dev) console.warn('[hero] 3D 장면을 시작하지 못했습니다:', e)
  }
})

onBeforeUnmount(() => {
  unmounted = true
  dispose?.()
  dispose = null
})
</script>

<template>
  <div ref="host" class="scene" :class="{ 'scene--ready': ready }" />
</template>

<style scoped>
.scene {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.2s ease;
}
.scene--ready {
  opacity: 1;
}
</style>
