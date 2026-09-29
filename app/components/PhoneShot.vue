<script setup lang="ts">
// 실제 앱 화면(라이트/다크) — 시스템 테마에 맞는 쪽을 보여준다. 원본: MediRing_APP docs/screenshots
const props = defineProps<{ screen: string; alt: string; eager?: boolean }>()
const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
const src = (theme: 'light' | 'dark') => `${base}/screens/${theme}/${props.screen}.png`
</script>

<template>
  <div class="phone">
    <picture>
      <source :srcset="src('dark')" media="(prefers-color-scheme: dark)" />
      <img :src="src('light')" :alt="alt" width="585" height="1266" :loading="eager ? 'eager' : 'lazy'" decoding="async" />
    </picture>
  </div>
</template>

<style scoped>
.phone {
  width: 100%;
  max-width: 300px;
  padding: 8px;
  border: 1px solid var(--line);
  border-radius: 36px;
  background: var(--card);
}
.phone img {
  width: 100%;
  height: auto;
  border-radius: 28px;
  border: 1px solid var(--line);
}
</style>
