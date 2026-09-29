<script setup lang="ts">
// 기준 데이터(수치·출처) + 원칙. 수치는 백엔드 문서·데이터에 근거가 있는 것만(README 문구 원칙).
import { principles, sources, stats } from '~/data/content'

const fmt = (s: (typeof stats)[number]) =>
  `${s.prefix}${s.to.toLocaleString('ko-KR', { minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals })}${s.suffix}`
</script>

<template>
  <section id="standards" class="section" aria-labelledby="standards-title">
    <div class="container">
      <header class="section-head">
        <p class="eyebrow">기준 데이터</p>
        <h2 id="standards-title" class="title">공개된 기준 위에서 추천해요</h2>
      </header>

      <dl class="stats">
        <div v-for="s in stats" :key="s.label" class="stats__item">
          <dt>{{ s.label }}</dt>
          <dd>{{ fmt(s) }}</dd>
        </div>
      </dl>

      <div class="basis">
        <div class="basis__sources">
          <h3 class="basis__title">출처</h3>
          <ul>
            <li v-for="s in sources" :key="s">{{ s }}</li>
          </ul>
        </div>
        <ul class="principles">
          <li v-for="p in principles" :key="p.key" class="principles__item">
            <h3>{{ p.title }}</h3>
            <p>{{ p.body }}</p>
            <p class="principles__spec">{{ p.spec }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0;
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  background: var(--card);
}
.stats__item {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  gap: 6px;
  padding: 24px;
}
.stats__item + .stats__item {
  border-left: 1px solid var(--line);
}
.stats__item dd {
  margin: 0;
  font-size: clamp(28px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.stats__item dt {
  font-size: 14px;
  color: var(--muted);
  line-height: 1.5;
}
.basis {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(0, 3fr);
  gap: clamp(24px, 4vw, 56px);
  margin-top: clamp(40px, 5vw, 64px);
}
.basis__title {
  font-size: 15px;
  font-weight: 700;
}
.basis__sources ul {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}
.basis__sources li {
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
  font-size: 14px;
  color: var(--muted);
}
.principles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 32px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.principles__item h3 {
  font-size: 17px;
  font-weight: 700;
}
.principles__item p {
  margin-top: 6px;
  color: var(--muted);
  line-height: 1.7;
}
.principles__item .principles__spec {
  margin-top: 8px;
  font-size: 13px;
  color: var(--faint);
}

@media (max-width: 900px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .stats__item:nth-child(3) {
    border-left: 0;
  }
  .stats__item:nth-child(n + 3) {
    border-top: 1px solid var(--line);
  }
  .basis {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 560px) {
  .principles {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
