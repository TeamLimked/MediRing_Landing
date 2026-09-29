<script setup lang="ts">
import { supportHtml } from '~/data/legal'

const links = useSiteLinks()
const html = computed(() => supportHtml({ c: links.company, link: (p) => p }))

useHead({ title: '고객 지원 — MediRing' })
</script>

<template>
  <LegalPage slug="support" heading="고객 지원" :html="html" />
</template>
