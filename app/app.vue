<script setup lang="ts">
const config = useRuntimeConfig()
useHead({
  link: [{ rel: 'canonical', href: config.public.siteUrl }],
  meta: [{ property: 'og:url', content: config.public.siteUrl }],
})
</script>

<template>
  <a class="skip-link" href="#main">본문으로 건너뛰기</a>
  <SiteHeader />
  <main id="main">
    <SectionsHero />
    <SectionsStats />
    <SectionsHowItWorks />
    <SectionsSafetyDemo />
    <SectionsFeatures />
    <SectionsGarden />
    <SectionsPrivacy />
    <SectionsPlans />
    <SectionsFaq />
    <SectionsDownload />
  </main>
  <SiteFooter />
</template>
