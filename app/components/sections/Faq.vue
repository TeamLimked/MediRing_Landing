<script setup lang="ts">
import { faqs } from '~/data/content'
</script>

<template>
  <section id="faq" class="section faq">
    <div class="container faq__grid">
      <header v-reveal class="reveal">
        <p class="eyebrow">자주 묻는 질문</p>
        <h2 class="h2">궁금한 점이<br />있으신가요?</h2>
        <p class="lead">더 궁금한 점은 <a class="faq__link" href="mailto:support@mediring.io">support@mediring.io</a>로 보내 주세요.</p>
      </header>

      <div class="faq__list">
        <details v-for="(f, i) in faqs" :key="f.q" v-reveal="i * 60" class="reveal qa" :open="i === 0">
          <summary>
            <span>{{ f.q }}</span>
            <i aria-hidden="true" />
          </summary>
          <p>{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  background: var(--card);
}
.faq__grid {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
  gap: clamp(32px, 6vw, 80px);
  align-items: start;
}
.faq__grid > header {
  position: sticky;
  top: calc(var(--header-h) + 32px);
}
.faq__link {
  color: var(--accent-strong);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.qa {
  border-bottom: 1px solid var(--line);
}
.qa:first-child {
  border-top: 1px solid var(--line);
}
.qa summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 4px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  list-style: none;
  cursor: pointer;
}
.qa summary::-webkit-details-marker {
  display: none;
}
.qa summary i {
  position: relative;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg);
  transition: background-color 0.2s, transform 0.3s;
}
.qa summary i::before,
.qa summary i::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 2px;
  margin: -1px 0 0 -6px;
  border-radius: 2px;
  background: var(--ink);
  transition: transform 0.3s;
}
.qa summary i::after {
  transform: rotate(90deg);
}
.qa[open] summary i {
  background: var(--accent-soft);
  transform: rotate(180deg);
}
.qa[open] summary i::after {
  transform: rotate(0deg);
}
.qa p {
  padding: 0 52px 26px 4px;
  color: var(--muted);
  font-size: 16px;
}

@media (max-width: 900px) {
  .faq__grid {
    grid-template-columns: 1fr;
  }
  .faq__grid > header {
    position: static;
  }
  .qa p {
    padding-right: 4px;
  }
}
</style>
