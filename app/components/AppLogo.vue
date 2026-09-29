<script setup lang="ts">
// 링 + 새싹 잎 + 심박 점. 색은 테마 고정, 워드마크는 currentColor.
defineProps<{ size?: number }>()
const id = useId()
</script>

<template>
  <span class="logo">
    <svg :width="size ?? 30" :height="size ?? 30" viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <linearGradient :id="`${id}-g`" x1="4" y1="36" x2="36" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#10B981" />
          <stop offset="1" stop-color="#22B8CF" />
        </linearGradient>
      </defs>
      <circle cx="19" cy="22" r="11" fill="none" :stroke="`url(#${id}-g)`" stroke-width="5" />
      <path d="M20.5 11c.7-5.2 5.1-8.2 10.3-7.5-.7 5.2-4.5 8.2-10.3 7.5z" fill="#34D9A0" />
      <circle cx="30" cy="22" r="2.4" fill="#FF8A3D" />
    </svg>
    <span class="logo__word">Medi<b>Ring</b></span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}
.logo__word {
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.logo__word b {
  font-weight: 800;
  background: linear-gradient(90deg, #10b981, #22b8cf);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
