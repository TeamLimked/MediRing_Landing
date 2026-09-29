<script setup lang="ts">
import { findLegalDoc } from '~/data/legal'

const route = useRoute()
const links = useSiteLinks()
const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')

const doc = computed(() => findLegalDoc(String(route.params.doc)))
if (!doc.value) throw createError({ statusCode: 404, statusMessage: '문서를 찾을 수 없어요', fatal: true })

const html = computed(() => doc.value!.html({ c: links.company, link: (p) => `${base}${p}` }))

useHead(() => ({ title: `${doc.value?.title} — MediRing` }))
</script>

<template>
  <LegalPage
    v-if="doc"
    :slug="doc.slug"
    :heading="doc.heading"
    :html="html"
    :date="doc.showDate ? links.company.policyVersion : undefined"
  />
</template>
