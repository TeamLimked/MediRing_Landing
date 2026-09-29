<script setup lang="ts">
import { sources } from '~/data/content'
</script>

<template>
  <section id="top" class="hero" aria-labelledby="hero-title">
    <div class="container hero__grid">
      <div class="hero__text">
        <p class="eyebrow">개인 맞춤 영양 가이드</p>
        <h1 id="hero-title" class="hero__title">복용 중인 약부터 확인하고<br class="pc" /> 영양소를 추천해요</h1>
        <p class="hero__lead">
          3분 컨디션 체크로 2025 한국인 영양소 섭취기준과 식약처 인정 기능성 데이터에 맞춘 영양소를 추천해요. 복용 중인 약·질환·알레르기
          주의사항은 추천 전에 먼저 확인합니다.
        </p>
        <div class="hero__actions">
          <StoreButtons />
          <NuxtLink to="/#safety" class="text-link hero__try">안전 점검 먼저 해보기</NuxtLink>
        </div>
        <div class="hero__basis">
          <p class="hero__basis-label">추천 근거</p>
          <ul>
            <li v-for="s in sources" :key="s" class="tag">{{ s }}</li>
          </ul>
        </div>
      </div>
      <div class="hero__visual">
        <PhoneShot screen="home" alt="MediRing 앱 홈 화면: 컨디션 점수, 오늘의 주목 영양소, 루틴 기록" eager />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: clamp(48px, 7vw, 96px) 0 clamp(56px, 7vw, 96px);
}
.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 320px);
  gap: clamp(32px, 6vw, 88px);
  align-items: center;
}
.hero__title {
  margin-top: 12px;
  font-size: clamp(30px, 4.2vw, 46px);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.03em;
}
.hero__lead {
  margin-top: 18px;
  max-width: 580px;
  font-size: clamp(16px, 1.4vw, 18px);
  line-height: 1.75;
  color: var(--muted);
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
  margin-top: 28px;
}
.hero__basis {
  margin-top: 36px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
.hero__basis-label {
  font-size: 13px;
  color: var(--faint);
}
.hero__basis ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}
.hero__basis .tag {
  background: var(--card);
  border: 1px solid var(--line);
}
.hero__visual {
  display: flex;
  justify-content: center;
}

@media (max-width: 820px) {
  .hero__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .hero__visual :deep(.phone) {
    max-width: 240px;
  }
}
</style>
