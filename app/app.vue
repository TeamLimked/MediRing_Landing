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
  <SiteHeader />
  <main id="main">
    <NuxtPage />
  </main>
  <SiteFooter />
</template>
