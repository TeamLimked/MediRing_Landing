<script setup lang="ts">
// 앱 BrandMark(MediRing_APP src/components/brand-mark.tsx)와 같은 단색 로고: 링 + 새싹 잎 + 심박 점, 짙은 녹색 한 가지.
defineProps<{ size?: number }>()
const id = useId()
const ring = 'M13.5 34a18.5 18.5 0 1 0 37 0a18.5 18.5 0 1 0 -37 0zM20.5 34a11.5 11.5 0 1 0 23 0a11.5 11.5 0 1 0 -23 0z'
const leaf = 'M34 19c1-7 7-11 14-10-1 7-6 11-14 10z'
</script>

<template>
  <span class="logo">
    <svg :width="size ?? 28" :height="size ?? 28" viewBox="4 2 56 56" aria-hidden="true" class="logo__mark">
      <defs>
        <mask :id="`${id}-knock`" maskUnits="userSpaceOnUse" x="-8" y="-8" width="80" height="80">
          <rect x="-8" y="-8" width="80" height="80" fill="#fff" />
          <circle cx="47" cy="34" r="5.3" fill="#000" />
          <path :d="leaf" fill="none" stroke="#000" stroke-width="3.4" stroke-linejoin="round" />
        </mask>
      </defs>
      <path :d="ring" fill="currentColor" fill-rule="evenodd" :mask="`url(#${id}-knock)`" />
      <path :d="leaf" fill="currentColor" />
      <circle cx="47" cy="34" r="3.2" fill="currentColor" />
    </svg>
    <span class="logo__word">MediRing</span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.logo__mark {
  color: var(--accent);
}
.logo__word {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}
</style>
