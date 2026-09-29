<script setup lang="ts">
const links = useSiteLinks()
const c = links.company
const year = new Date().getFullYear()
const policies = computed(() => [
  ...links.docs.map((d) => ({ label: d.nav, to: links.legal(d.slug), strong: d.slug === 'privacy' })),
  { label: '고객지원', to: links.support, strong: false },
])
const policyOpen = ref(false)
</script>

<template>
  <footer class="ft">
    <div class="container">
      <div class="ft__top">
        <AppLogo :size="40" class="ft__logo" />

        <div class="ft__family">
          <button type="button" class="ft__family-btn" :aria-expanded="policyOpen" aria-controls="ft-policies" @click="policyOpen = !policyOpen">
            약관 및 정책
            <span class="ft__plus" :class="{ open: policyOpen }" aria-hidden="true" />
          </button>
          <ul v-show="policyOpen" id="ft-policies" class="ft__family-list">
            <li v-for="p in policies" :key="p.label">
              <NuxtLink :to="p.to">{{ p.label }}</NuxtLink>
            </li>
          </ul>
        </div>
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

      <div class="ft__bottom">
        <nav class="ft__links" aria-label="약관 및 정책">
          <NuxtLink v-for="p in policies" :key="p.label" :to="p.to" :class="{ strong: p.strong }">{{ p.label }}</NuxtLink>
        </nav>
        <p class="ft__copy">© {{ year }} {{ c.name }}. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.ft {
  padding: clamp(64px, 7vw, 100px) 0 40px;
  background: #02030d;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 14px;
}
.ft__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}
.ft__logo {
  color: var(--ink);
}
.ft__family {
  position: relative;
  width: min(240px, 50%);
}
.ft__family-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 14px;
  border: 0;
  border-bottom: 1px solid var(--line-strong);
  background: none;
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}
.ft__plus {
  position: relative;
  width: 12px;
  height: 12px;
}
.ft__plus::before,
.ft__plus::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 12px;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.3s var(--ease);
}
.ft__plus::after {
  transform: rotate(90deg);
}
.ft__plus.open::after {
  transform: rotate(0deg);
}
.ft__family-list {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 8px 0;
  list-style: none;
  background: var(--panel-2);
  box-shadow: inset 0 0 0 1px var(--line);
}
.ft__family-list a {
  display: block;
  padding: 9px 16px;
  color: var(--muted);
}
.ft__family-list a:hover {
  color: var(--accent);
}
.ft__info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 28px;
  margin: clamp(40px, 4vw, 64px) 0 0;
}
.ft__info div {
  display: flex;
  gap: 10px;
}
.ft__info dt {
  color: var(--faint);
}
.ft__info dd {
  margin: 0;
  font-weight: 700;
  color: var(--ink);
}
.ft__notice {
  max-width: 1100px;
  margin-top: 24px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--faint);
}
.ft__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid var(--line);
}
.ft__links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 22px;
}
.ft__links a {
  transition: color 0.2s;
}
.ft__links a:hover {
  color: var(--accent);
}
.ft__links a.strong {
  font-weight: 800;
  color: var(--ink);
}
.ft__copy {
  font-size: 13px;
  color: var(--faint);
}
</style>
