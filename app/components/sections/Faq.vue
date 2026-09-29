<script setup lang="ts">
import { faqs } from '~/data/content'

const { company } = useSiteLinks()
const open = ref(0)
</script>

<template>
  <section id="faq" class="section faq" aria-labelledby="faq-title">
    <div class="container faq__grid">
      <header class="faq__head">
        <p class="eyebrow">FAQ</p>
        <h2 id="faq-title" class="display faq__title" v-split data-split>자주 묻는 질문</h2>
        <p class="lead faq__lead">
          더 궁금한 점은 <a :href="`mailto:${company.supportEmail}`">{{ company.supportEmail }}</a>로 보내 주세요.
        </p>
      </header>

      <ul class="faq__list">
        <li v-for="(f, i) in faqs" :key="f.q" class="qa" :class="{ on: open === i }">
          <h3>
            <button
              :id="`faq-q-${i}`"
              type="button"
              class="qa__q"
              :aria-expanded="open === i"
              :aria-controls="`faq-a-${i}`"
              @click="open = open === i ? -1 : i"
            >
              <span class="qa__no">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="qa__text">{{ f.q }}</span>
              <span class="qa__icon" aria-hidden="true" />
            </button>
          </h3>
          <div :id="`faq-a-${i}`" class="qa__a" role="region" :aria-labelledby="`faq-q-${i}`">
            <div>
              <p>{{ f.a }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq {
  background: var(--bg);
}
.faq__grid {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: clamp(32px, 5vw, 96px);
  align-items: start;
}
.faq__head {
  position: sticky;
  top: calc(var(--header-h) + 48px);
}
.faq__title {
  margin-top: 22px;
}
.faq__lead {
  margin-top: 20px;
}
.faq__lead a {
  color: var(--accent);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.faq__list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line-strong);
}
.qa {
  border-bottom: 1px solid var(--line);
}
.qa h3 {
  margin: 0;
  font: inherit;
}
.qa__q {
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
  padding: 28px 4px;
  border: 0;
  background: none;
  text-align: left;
}
.qa__no {
  font-size: 14px;
  font-weight: 800;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.qa__text {
  flex: 1;
  font-size: clamp(17px, 1.3vw, 21px);
  font-weight: 700;
  letter-spacing: -0.025em;
  transition: color 0.2s;
}
.qa__q:hover .qa__text,
.qa.on .qa__text {
  color: var(--accent);
}
.qa__icon {
  position: relative;
  flex: none;
  width: 16px;
  height: 16px;
}
.qa__icon::before,
.qa__icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 16px;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.35s var(--ease);
}
.qa__icon::after {
  transform: rotate(90deg);
}
.qa.on .qa__icon::after {
  transform: rotate(0deg);
}
.qa__a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s var(--ease);
}
.qa.on .qa__a {
  grid-template-rows: 1fr;
}
.qa__a > div {
  overflow: hidden;
}
.qa__a p {
  padding: 0 48px 30px 52px;
  font-size: 16px;
  line-height: 1.8;
  color: var(--muted);
}

@media (max-width: 900px) {
  .faq__grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .faq__head {
    position: static;
  }
  .qa__a p {
    padding: 0 4px 26px;
  }
  .qa__q {
    gap: 14px;
  }
}
</style>
