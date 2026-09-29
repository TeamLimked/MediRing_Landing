<script setup lang="ts">
import { stats } from '~/data/content'

const sources = ['2025 한국인 영양소 섭취기준 · 보건복지부', '식품안전나라 건강기능식품 인정 기능성', '공공데이터포털 의약품 허가정보', 'NIH 영양보충제국(ODS)']
</script>

<template>
  <section id="stats" class="stats" aria-label="MediRing 데이터 기반">
    <div class="container">
      <ul class="stats__grid">
        <li v-for="(s, i) in stats" :key="s.label" v-reveal="i * 80" class="reveal stats__item">
          <strong>{{ s.value }}</strong>
          <span>{{ s.label }}</span>
        </li>
      </ul>
      <div v-reveal="200" class="reveal stats__sources">
        <span class="stats__sources-label">데이터 출처</span>
        <ul>
          <li v-for="s in sources" :key="s">{{ s }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats {
  background: var(--night);
  color: var(--night-ink);
  padding: 24px 0 88px;
}
.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--night-line);
  border-bottom: 1px solid var(--night-line);
}
.stats__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 36px 28px;
}
.stats__item + .stats__item {
  border-left: 1px solid var(--night-line);
}
.stats__item strong {
  font-size: clamp(34px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  background: linear-gradient(180deg, #eaf6ef, #9db7aa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.stats__item span {
  font-size: 15px;
  color: var(--night-muted);
}
.stats__sources {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
  margin-top: 32px;
}
.stats__sources-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--mint-bright);
  letter-spacing: 0.04em;
}
.stats__sources ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.stats__sources li {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: var(--night-muted);
  box-shadow: inset 0 0 0 1px var(--night-line);
}

@media (max-width: 860px) {
  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stats__item:nth-child(3) {
    border-left: 0;
  }
  .stats__item:nth-child(n + 3) {
    border-top: 1px solid var(--night-line);
  }
  .stats__item {
    padding: 28px 16px;
  }
}
</style>
