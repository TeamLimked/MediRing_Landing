<script setup lang="ts">
import { demoNutrients, demoTriggers, type DemoRule, type Severity } from '~/data/content'

const selected = ref<string[]>(['warfarin'])
const expanded = ref<string | null>(null)

const RANK: Record<Severity | 'ok', number> = { ok: 0, info: 1, caution: 2, block: 3 }
const LABEL: Record<Severity | 'ok', string> = { ok: '추천 가능', info: '참고', caution: '주의', block: '제외' }

function toggle(key: string) {
  selected.value = selected.value.includes(key) ? selected.value.filter((k) => k !== key) : [...selected.value, key]
}

const activeRules = computed(() => demoTriggers.filter((t) => selected.value.includes(t.key)).flatMap((t) => t.rules.map((r) => ({ ...r, trigger: t.label }))))

const general = computed(() => activeRules.value.filter((r) => r.nutrient === null))

const results = computed(() => {
  const rows = demoNutrients.map((n) => {
    const rules = activeRules.value.filter((r) => r.nutrient === n.key) as (DemoRule & { trigger: string })[]
    const status = rules.reduce<Severity | 'ok'>((acc, r) => (RANK[r.severity] > RANK[acc] ? r.severity : acc), 'ok')
    return { ...n, status, rules }
  })
  // 제외는 순위에서 빠지고 맨 아래로, 주의는 경고와 함께 유지
  return rows.sort((a, b) => (a.status === 'block' ? 1 : 0) - (b.status === 'block' ? 1 : 0))
})

const counts = computed(() => {
  const c = { ok: 0, caution: 0, block: 0 }
  for (const r of results.value) {
    if (r.status === 'block') c.block += 1
    else if (r.status === 'caution') c.caution += 1
    else c.ok += 1
  }
  return c
})

const groups = computed(() => {
  const map = new Map<string, typeof demoTriggers>()
  for (const t of demoTriggers) map.set(t.group, [...(map.get(t.group) ?? []), t])
  return [...map.entries()]
})
</script>

<template>
  <section id="safety" class="section" aria-labelledby="safety-title">
    <div class="container">
      <header class="section-head safety__head">
        <p class="eyebrow">안전 점검 체험</p>
        <h2 id="safety-title" class="title">내 상황을 고르면 추천이 달라져요</h2>
        <p class="lead">
          메디링 안전 규칙 데이터의 일부예요. 복용약이나 질환을 선택해 보세요. 피해야 할 영양소는 추천 순위에서 빠지고, 주의가 필요한
          영양소에는 출처와 함께 이유가 붙어요.
        </p>
      </header>

      <div class="demo card">
        <div class="demo__input">
          <p id="demo-triggers" class="demo__label">나의 상황</p>
          <div v-for="[group, items] in groups" :key="group" class="demo__group" role="group" :aria-label="group">
            <span class="demo__group-name">{{ group }}</span>
            <div class="demo__chips">
              <button
                v-for="t in items"
                :key="t.key"
                type="button"
                class="tchip"
                :class="{ 'tchip--on': selected.includes(t.key) }"
                :aria-pressed="selected.includes(t.key)"
                @click="toggle(t.key)"
              >
                <span class="tchip__box" aria-hidden="true">
                  <svg v-if="selected.includes(t.key)" viewBox="0 0 16 16"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </span>
                {{ t.label }}
              </button>
            </div>
          </div>
          <button v-if="selected.length" type="button" class="demo__reset" @click="selected = []">선택 초기화</button>
        </div>

        <div class="demo__output">
          <p class="demo__summary" aria-live="polite">
            제외 <b>{{ counts.block }}</b> · 주의 <b>{{ counts.caution }}</b> · 추천 가능 <b>{{ counts.ok }}</b>
          </p>

          <div v-if="general.length" class="demo__general">
            <p v-for="g in general" :key="g.message">{{ g.message }}</p>
          </div>

          <ul class="demo__list">
            <li v-for="(r, i) in results" :key="r.key" class="row" :class="`row--${r.status}`">
              <button
                type="button"
                class="row__head"
                :disabled="!r.rules.length"
                :aria-expanded="r.rules.length ? expanded === r.key : undefined"
                @click="expanded = expanded === r.key ? null : r.key"
              >
                <span class="row__rank">{{ r.status === 'block' ? '–' : i + 1 }}</span>
                <span class="row__name">{{ r.name }}</span>
                <span class="row__status">{{ LABEL[r.status] }}</span>
                <svg v-if="r.rules.length" class="row__chev" :class="{ open: expanded === r.key }" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              </button>
              <div v-if="expanded === r.key && r.rules.length" class="row__detail">
                <p v-for="rule in r.rules" :key="rule.message">
                  <span class="row__trigger">{{ rule.trigger }}</span>
                  {{ rule.message }}
                  <small>출처 · {{ rule.source }}</small>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <p class="safety__note">
        이해를 돕기 위한 예시 화면이에요. 실제 앱은 더 많은 규칙과 식약처 의약품 상호작용 정보, 중복 섭취·상한섭취량까지 함께 확인해요.
        복용 중인 약이 있다면 섭취 전 반드시 의사·약사와 상의하세요.
      </p>
    </div>
  </section>
</template>

<style scoped>
.demo {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  overflow: hidden;
}
.demo__input {
  padding: clamp(20px, 3vw, 32px);
  border-right: 1px solid var(--line);
}
.demo__label {
  margin-bottom: 20px;
  font-size: 17px;
  font-weight: 700;
}
.demo__group + .demo__group {
  margin-top: 18px;
}
.demo__group-name {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--faint);
}
.demo__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tchip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--r-btn);
  background: var(--card);
  font-size: 15px;
  font-weight: 500;
}
.tchip:hover {
  background: var(--bg);
}
.tchip--on {
  border-color: var(--accent-strong);
  background: var(--accent-soft);
  color: var(--ink);
}
.tchip--on:hover {
  background: var(--accent-soft);
}
.tchip__box {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border: 1.5px solid var(--border);
  border-radius: 5px;
  background: var(--card);
}
.tchip--on .tchip__box {
  border-color: var(--accent-strong);
  background: var(--accent-strong);
  color: var(--on-accent);
}
.tchip__box svg {
  width: 14px;
  height: 14px;
}
.demo__reset {
  margin-top: 20px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--muted);
  font-size: 14px;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.demo__output {
  padding: clamp(20px, 3vw, 32px);
  min-width: 0;
}
.demo__summary {
  font-size: 15px;
  color: var(--muted);
}
.demo__summary b {
  color: var(--ink);
  font-weight: 700;
}
.demo__general {
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: var(--r-btn);
  background: var(--warning-soft);
  font-size: 14px;
  line-height: 1.7;
}
.demo__general p + p {
  margin-top: 6px;
}
.demo__list {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}
.row {
  border-bottom: 1px solid var(--line);
}
.row__head {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 0 4px;
  border: 0;
  background: none;
  text-align: left;
}
.row__head:disabled {
  cursor: default;
}
.row__rank {
  width: 20px;
  color: var(--faint);
  font-variant-numeric: tabular-nums;
  text-align: center;
}
.row__name {
  flex: 1;
  font-weight: 600;
}
.row__status {
  font-size: 14px;
  font-weight: 600;
  color: var(--ok);
}
.row--caution .row__status {
  color: var(--warning-text);
}
.row--block .row__status {
  color: var(--critical-strong);
}
.row--block .row__name {
  color: var(--muted);
  text-decoration: line-through;
  text-decoration-color: var(--faint);
}
.row__chev {
  width: 18px;
  height: 18px;
  color: var(--faint);
  transition: transform 0.15s;
}
.row__chev.open {
  transform: rotate(180deg);
}
.row__detail {
  padding: 0 4px 14px 36px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}
.row__detail p + p {
  margin-top: 10px;
}
.row__detail small {
  display: block;
  margin-top: 2px;
  font-size: 12.5px;
  color: var(--faint);
}
.row__trigger {
  margin-right: 6px;
  padding: 1px 6px;
  border-radius: var(--r-tag);
  background: var(--bg);
  color: var(--ink);
  font-size: 12.5px;
  font-weight: 600;
}
.safety__note {
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--faint);
}

@media (max-width: 860px) {
  .demo {
    grid-template-columns: minmax(0, 1fr);
  }
  .demo__input {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
}
</style>
