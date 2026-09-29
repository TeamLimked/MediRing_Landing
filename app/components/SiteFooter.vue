<script setup lang="ts">
const links = useSiteLinks()
const year = new Date().getFullYear()
const legal = [
  { label: '이용약관', href: links.legal('terms') },
  { label: '개인정보처리방침', href: links.legal('privacy'), strong: true },
  { label: '민감정보 처리 안내', href: links.legal('sensitive') },
  { label: '국외이전 안내', href: links.legal('overseas') },
  { label: '의료 면책', href: links.legal('medical') },
  { label: '제휴 고지', href: links.legal('affiliate') },
  { label: '고객지원', href: links.support },
]
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <AppLogo />
        <nav class="footer__links" aria-label="약관 및 정책">
          <a v-for="l in legal" :key="l.label" :href="l.href" :class="{ strong: l.strong }">{{ l.label }}</a>
        </nav>
      </div>

      <div class="footer__notice">
        <p>
          MediRing은 영양 정보와 생활 루틴 관리를 돕는 서비스이며, 의료기기가 아니고 질병의 진단·치료를 대신하지 않습니다. 복용 중인
          약이 있거나 치료 중이라면 건강기능식품 섭취 전 반드시 의사·약사와 상의하세요.
        </p>
        <p>
          일부 제품 링크는 제휴 링크이며, 이를 통해 구매하면 MediRing이 수수료를 받을 수 있습니다. 기능성 문구는 식품의약품안전처
          인정 기능성 원문을 인용합니다. AI가 생성한 문장에는 “AI” 표시가 붙습니다.
        </p>
      </div>

      <div class="footer__bottom">
        <p>© {{ year }} TeamLimked. All rights reserved.</p>
        <p>문의 · <a href="mailto:support@mediring.io">support@mediring.io</a></p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 56px 0 40px;
  background: #050d0a;
  color: var(--night-muted);
  font-size: 14px;
}
.footer__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: var(--night-ink);
}
.footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
}
.footer__links a {
  color: var(--night-muted);
  transition: color 0.2s;
}
.footer__links a:hover {
  color: var(--night-ink);
}
.footer__links a.strong {
  color: var(--night-ink);
  font-weight: 700;
}
.footer__notice {
  display: grid;
  gap: 10px;
  margin-top: 36px;
  padding: 24px 0;
  border-top: 1px solid var(--night-line);
  border-bottom: 1px solid var(--night-line);
  font-size: 13px;
  line-height: 1.75;
}
.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  margin-top: 24px;
  font-size: 13px;
}
.footer__bottom a {
  color: var(--night-ink);
}
</style>
