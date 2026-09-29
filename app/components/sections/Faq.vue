<script setup lang="ts">
import { faqs } from '~/data/content'

const { company } = useSiteLinks()
const open = ref(0)
</script>

<template>
  <section id="faq" class="section section--card" aria-labelledby="faq-title">
    <div class="container faq">
      <header class="faq__head">
        <p class="eyebrow">자주 묻는 질문</p>
        <h2 id="faq-title" class="title">궁금한 점을 모았어요</h2>
        <p class="faq__lead">
          더 궁금한 점은 <a class="text-link" :href="`mailto:${company.supportEmail}`">{{ company.supportEmail }}</a>로 보내 주세요.
        </p>
      </header>

      <ul class="faq__list">
        <li v-for="(f, i) in faqs" :key="f.q" class="qa">
          <h3>
            <button
              :id="`faq-q-${i}`"
              type="button"
              class="qa__q"
              :aria-expanded="open === i"
              :aria-controls="`faq-a-${i}`"
              @click="open = open === i ? -1 : i"
            >
              <span>{{ f.q }}</span>
              <svg class="qa__chev" :class="{ open: open === i }" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </button>
          </h3>
          <div v-show="open === i" :id="`faq-a-${i}`" class="qa__a" role="region" :aria-labelledby="`faq-q-${i}`">
            <p>{{ f.a }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
  gap: clamp(28px, 5vw, 72px);
  align-items: start;
}
.faq__lead {
  margin-top: 14px;
  color: var(--muted);
}
.faq__list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}
.qa {
  border-bottom: 1px solid var(--line);
}
.qa h3 {
  font-size: inherit;
}
.qa__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 18px 4px;
  border: 0;
  background: none;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
}
.qa__chev {
  flex: none;
  width: 20px;
  height: 20px;
  color: var(--faint);
  transition: transform 0.15s;
}
.qa__chev.open {
  transform: rotate(180deg);
}
.qa__a {
  padding: 0 4px 20px;
  color: var(--muted);
  line-height: 1.75;
}

@media (max-width: 820px) {
  .faq {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
