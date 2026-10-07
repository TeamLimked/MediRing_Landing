<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const canonical = computed(() => `${String(config.public.siteUrl).replace(/\/$/, '')}${route.path}`)
useHead(() => ({
  link: [{ rel: 'canonical', href: canonical.value }],
  meta: [{ property: 'og:url', content: canonical.value }],
}))
</script>

<template>
  <a class="skip-link" href="#main">본문으로 건너뛰기</a>
  <!-- 메시지 테스트 페이지(/try/*)는 사이트 머리·꼬리 없이(definePageMeta({ bare: true })) -->
  <SiteHeader v-if="!route.meta.bare" />
  <main id="main">
    <NuxtPage />
  </main>
  <SiteFooter v-if="!route.meta.bare" />
</template>
