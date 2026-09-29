<script setup lang="ts">
// 레퍼런스의 "인증현황 → / 찾아오시는 길 →" 두 카드 구성을 메디링의 정책·지원 안내로
const links = useSiteLinks()
const cards = [
  { key: 'privacy', title: '개인정보 처리방침', desc: '어떤 정보를 왜, 얼마나 보관하는지 모두 공개해요.', to: links.legal('privacy') },
  { key: 'support', title: '고객 지원', desc: `계정·구독·개인정보 문의는 ${links.company.supportEmail}`, to: links.support },
]
</script>

<template>
  <section class="section lc" aria-label="정책 및 고객 지원">
    <div class="container lc__grid">
      <NuxtLink v-for="(c, i) in cards" :key="c.key" v-reveal="i * 100" :to="c.to" class="reveal lc__card">
        <span class="arrow-link lc__title">
          {{ c.title }}
          <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
        <span class="lc__visual" aria-hidden="true">
          <svg v-if="c.key === 'privacy'" viewBox="0 0 400 200">
            <circle v-for="r in 4" :key="r" cx="200" cy="100" :r="28 + r * 26" fill="none" stroke="#3ad6d4" :stroke-opacity="0.5 - r * 0.1" />
            <rect x="176" y="92" width="48" height="40" rx="4" fill="#0a0f22" stroke="#3ad6d4" stroke-width="2" />
            <path d="M184 92v-10a16 16 0 0 1 32 0v10" fill="none" stroke="#3ad6d4" stroke-width="2" />
            <circle cx="200" cy="110" r="4" fill="#3ad6d4" />
          </svg>
          <svg v-else viewBox="0 0 400 200">
            <path v-for="k in 5" :key="k" :d="`M0 ${60 + k * 22} Q 100 ${20 + k * 30}, 200 ${80 + k * 10} T 400 ${50 + k * 24}`" fill="none" stroke="#8fb8ff" :stroke-opacity="0.12 + k * 0.06" />
            <rect x="160" y="72" width="80" height="56" rx="4" fill="#0a0f22" stroke="#8fb8ff" stroke-width="2" />
            <path d="m162 76 38 28 38-28" fill="none" stroke="#8fb8ff" stroke-width="2" />
          </svg>
          <span class="lc__desc">{{ c.desc }}</span>
        </span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.lc {
  background: var(--bg-2);
}
.lc__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(20px, 2.4vw, 40px);
}
.lc__card {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.lc__title {
  font-size: clamp(28px, 2.4vw, 44px);
}
.lc__card:hover .lc__title svg {
  transform: translateX(6px);
}
.lc__visual {
  position: relative;
  display: block;
  padding: clamp(20px, 2vw, 32px);
  background: var(--panel);
  box-shadow: inset 0 0 0 1px var(--line);
  overflow: hidden;
  transition: box-shadow 0.4s;
}
.lc__card:hover .lc__visual {
  box-shadow: inset 0 0 0 1px rgba(58, 214, 212, 0.5);
}
.lc__visual svg {
  width: 100%;
  aspect-ratio: 2 / 1;
  background: radial-gradient(50% 70% at 50% 50%, rgba(58, 214, 212, 0.12), transparent 70%), #060a18;
  transition: transform 1s var(--ease);
}
.lc__card:hover .lc__visual svg {
  transform: scale(1.04);
}
.lc__desc {
  display: block;
  margin-top: 18px;
  font-size: 15px;
  color: var(--muted);
}

@media (max-width: 760px) {
  .lc__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
