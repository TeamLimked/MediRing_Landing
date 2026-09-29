<script setup lang="ts">
const links = useSiteLinks()
const c = links.company
const year = new Date().getFullYear()
const policies = computed(() => [
  ...links.docs.map((d) => ({ label: d.nav, to: links.legal(d.slug), strong: d.slug === 'privacy' })),
  { label: '고객 지원', to: links.support, strong: false },
])
</script>

<template>
  <footer class="ft">
    <div class="container">
      <div class="ft__top">
        <AppLogo />
        <nav class="ft__links" aria-label="약관 및 정책">
          <NuxtLink v-for="p in policies" :key="p.label" :to="p.to" :class="{ strong: p.strong }">{{ p.label }}</NuxtLink>
        </nav>
      </div>

      <dl class="ft__info">
        <div><dt>법인명</dt><dd>{{ c.name }}</dd></div>
        <div><dt>대표</dt><dd>{{ c.representative }}</dd></div>
        <div><dt>사업자번호</dt><dd>{{ c.businessNumber }}</dd></div>
        <div><dt>주소</dt><dd>{{ c.address }}</dd></div>
        <div><dt>개인정보 보호책임자</dt><dd>{{ c.privacyOfficer }}</dd></div>
        <div>
          <dt>이메일</dt>
          <dd><a :href="`mailto:${c.supportEmail}`">{{ c.supportEmail }}</a></dd>
        </div>
      </dl>

      <p class="ft__notice">
        MediRing은 영양 정보와 생활 루틴 관리를 돕는 웰니스 서비스이며, 의료기기가 아니고 질병의 진단·치료를 대신하지 않습니다. 복용 중인 약이
        있거나 치료 중이라면 건강기능식품 섭취 전 반드시 의사·약사와 상의하세요. 일부 제품 링크는 제휴 링크이며 구매 시 수수료를 받을 수 있습니다.
        기능성 문구는 식품의약품안전처 인정 기능성 원문을 인용하고, AI가 생성한 문장에는 “AI” 표시가 붙습니다.
      </p>

      <p class="ft__copy">© {{ year }} {{ c.name }}</p>
    </div>
  </footer>
</template>

<style scoped>
.ft {
  padding: clamp(40px, 5vw, 64px) 0 32px;
  background: var(--card);
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 14px;
}
.ft__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px 32px;
}
.ft__links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
}
.ft__links a:hover {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.ft__links a.strong {
  font-weight: 700;
  color: var(--ink);
}
.ft__info {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 24px;
  margin: 28px 0 0;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
.ft__info div {
  display: flex;
  gap: 8px;
}
.ft__info dt {
  color: var(--faint);
}
.ft__info dd {
  margin: 0;
  color: var(--ink);
}
.ft__info a:hover {
  text-decoration: underline;
}
.ft__notice {
  max-width: 900px;
  margin-top: 20px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--faint);
}
.ft__copy {
  margin-top: 20px;
  font-size: 13px;
  color: var(--faint);
}
</style>
