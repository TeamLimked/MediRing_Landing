<script setup lang="ts">
import { plans } from '~/data/content'
</script>

<template>
  <section id="plans" class="section plans">
    <div class="container">
      <header v-reveal class="reveal section-head section-head--center">
        <p class="eyebrow">멤버십</p>
        <h2 class="h2">핵심 기능은 <em>무료</em>로,<br />더 깊은 분석은 프리미엄으로</h2>
        <p class="lead">안전 점검과 맞춤 추천은 누구나 무료로 쓸 수 있어요.</p>
      </header>

      <div class="plans__grid">
        <article
          v-for="(p, i) in plans"
          :key="p.name"
          v-reveal="i * 100"
          class="reveal card plan"
          :class="{ 'plan--pro': p.highlighted }"
        >
          <header>
            <h3 class="plan__name">{{ p.name }}</h3>
            <p class="plan__price">{{ p.price }}</p>
            <p class="plan__note">{{ p.note }}</p>
          </header>
          <ul class="plan__list">
            <li v-for="item in p.items" :key="item">{{ item }}</li>
          </ul>
          <a href="#download" class="btn" :class="p.highlighted ? 'btn--mint' : 'btn--ghost'">
            {{ p.highlighted ? '앱에서 멤버십 보기' : '무료로 시작하기' }}
          </a>
        </article>
      </div>
      <p v-reveal class="reveal plans__fine">
        결제는 App Store·Google Play를 통해 이뤄지며 자동 갱신·해지 방법은 앱 결제 화면에서 안내해요. 결제 전 이메일 인증이 필요해요.
      </p>
    </div>
  </section>
</template>

<style scoped>
.plans__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 420px));
  justify-content: center;
  gap: 20px;
}
.plan {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 36px 32px 32px;
  border-radius: var(--radius-xl);
}
.plan--pro {
  position: relative;
  background: var(--night-2);
  color: var(--night-ink);
  border-color: transparent;
  box-shadow: var(--shadow-float);
  overflow: hidden;
}
.plan--pro::before {
  content: '';
  position: absolute;
  inset: -40% -30% auto auto;
  width: 80%;
  aspect-ratio: 1;
  background: radial-gradient(closest-side, rgba(52, 217, 160, 0.3), transparent);
  pointer-events: none;
}
.plan__name {
  font-size: 18px;
  font-weight: 800;
}
.plan--pro .plan__name {
  color: var(--mint-bright);
}
.plan__price {
  margin-top: 8px;
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
}
.plan__note {
  margin-top: 6px;
  font-size: 14px;
  color: var(--muted);
}
.plan--pro .plan__note {
  color: var(--night-muted);
}
.plan__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  margin: 0;
  padding: 24px 0 0;
  list-style: none;
  border-top: 1px solid var(--line);
}
.plan--pro .plan__list {
  border-color: var(--night-line);
}
.plan__list li {
  display: flex;
  gap: 10px;
  font-size: 15.5px;
}
.plan__list li::before {
  content: '';
  flex: none;
  width: 20px;
  height: 20px;
  margin-top: 3px;
  border-radius: 50%;
  background: var(--accent-soft) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='m6 10.3 2.6 2.6L14 7.5' fill='none' stroke='%230A7D55' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat;
}
.plan--pro .plan__list li::before {
  background-color: rgba(52, 217, 160, 0.16);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='m6 10.3 2.6 2.6L14 7.5' fill='none' stroke='%2334D9A0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
.plan .btn {
  position: relative;
  width: 100%;
}
.plans__fine {
  max-width: 640px;
  margin: 28px auto 0;
  text-align: center;
  font-size: 13.5px;
  color: var(--faint);
}

@media (max-width: 760px) {
  .plans__grid {
    grid-template-columns: 1fr;
  }
}
</style>
