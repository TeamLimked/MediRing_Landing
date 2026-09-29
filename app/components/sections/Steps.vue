<script setup lang="ts">
import { steps } from '~/data/content'
</script>

<template>
  <section id="how" class="section section--card" aria-labelledby="how-title">
    <div class="container">
      <header class="section-head">
        <p class="eyebrow">이용 흐름</p>
        <h2 id="how-title" class="title">추천보다 안전 점검이 먼저예요</h2>
      </header>
      <ol class="steps">
        <li v-for="(s, i) in steps" :key="s.title" class="steps__item">
          <span class="steps__no">{{ i + 1 }}</span>
          <h3 class="steps__title">{{ s.title }}</h3>
          <p class="steps__body">{{ s.body }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.steps__item {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  background: var(--bg);
}
.steps__no {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 14px;
  font-weight: 700;
}
.steps__title {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 700;
}
.steps__body {
  margin-top: 8px;
  color: var(--muted);
  line-height: 1.7;
}

@media (max-width: 820px) {
  .steps {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
