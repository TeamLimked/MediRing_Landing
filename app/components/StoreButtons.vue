<script setup lang="ts">
// 괄호 버튼 스타일의 스토어 링크. URL 이 비어 있으면 "출시 예정" 으로 비활성 표시.
const links = useSiteLinks()
const stores = computed(() => [
  { key: 'ios', label: 'App Store', href: links.appStore },
  { key: 'android', label: 'Google Play', href: links.playStore },
])
</script>

<template>
  <div class="stores">
    <component
      :is="s.href ? 'a' : 'span'"
      v-for="s in stores"
      :key="s.key"
      class="bracket store"
      :class="{ 'store--soon': !s.href }"
      :href="s.href || undefined"
      :target="s.href ? '_blank' : undefined"
      :rel="s.href ? 'noopener' : undefined"
      :aria-label="s.href ? `${s.label}에서 MediRing 받기` : `${s.label} 출시 예정`"
    >
      <svg v-if="s.key === 'ios'" class="store__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66zM14.1 5.84c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.75-.96 2.79 1.02.08 2.05-.52 2.68-1.27z"
        />
      </svg>
      <svg v-else class="store__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M3.6 2.3 13.3 12l-9.7 9.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1zm13 6.4-3.3 3.3-9.7-9.7c.3-.2.8-.2 1.2 0l11.8 6.4zm0 6.6-11.8 6.4c-.4.2-.9.2-1.2 0l9.7-9.7 3.3 3.3zm3.8-1.9-3.8 1.9-3.3-3.3 3.3-3.3 3.8 2c1 .6 1 2.1 0 2.7z" />
      </svg>
      <span class="store__text">
        <strong>{{ s.label }}</strong>
        <small v-if="!s.href">출시 예정</small>
      </span>
    </component>
  </div>
</template>

<style scoped>
.stores {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.store {
  min-width: 210px;
  min-height: 68px;
  gap: 14px;
}
.store--soon {
  cursor: default;
}
.store--soon:hover {
  --b: var(--line-strong);
  --s: 10px;
  color: var(--ink);
}
.store--soon:hover::after {
  opacity: 0;
}
.store__icon {
  width: 24px;
  height: 24px;
  flex: none;
}
.store__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}
.store__text strong {
  font-size: 18px;
  font-weight: 800;
}
.store__text small {
  font-size: 12px;
  font-weight: 600;
  color: var(--faint);
}
</style>
