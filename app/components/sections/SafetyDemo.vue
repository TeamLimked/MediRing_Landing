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
  <section id="safety" class="section safety">
    <div class="container">
      <header class="safety__head">
        <div>
          <p class="eyebrow">Try it</p>
          <h2 class="display safety__title" v-split data-split>내 상황을 고르면<br class="pc" /> 추천이 달라집니다.</h2>
        </div>
        <p class="lead safety__lead">
          메디링 안전 규칙 데이터의 일부예요. 복용약이나 질환을 선택해 보세요. 피해야 할 영양소는 추천 순위에서 빠지고,
          주의가 필요한 영양소에는 출처와 함께 이유가 붙어요.
        </p>
      </header>

      <div v-reveal="100" class="reveal demo">
        <div class="demo__input">
          <p class="demo__label" id="demo-triggers">나의 상황 선택</p>
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
                <span class="tchip__box" aria-hidden="true" />
                {{ t.label }}
              </button>
            </div>
          </div>
          <button v-if="selected.length" type="button" class="demo__reset" @click="selected = []">선택 초기화</button>

          <div class="demo__legend" aria-hidden="true">
            <span><i class="lg lg--block" />제외 · 추천 순위에서 빠짐</span>
            <span><i class="lg lg--caution" />주의 · 경고와 함께 표시</span>
            <span><i class="lg lg--ok" />추천 가능</span>
          </div>
        </div>

        <div class="demo__output">
          <div class="demo__summary" aria-live="polite">
            <span class="sum sum--block"><b>{{ counts.block }}</b>제외</span>
            <span class="sum sum--caution"><b>{{ counts.caution }}</b>주의</span>
            <span class="sum sum--ok"><b>{{ counts.ok }}</b>추천 가능</span>
          </div>

          <Transition name="fade">
            <div v-if="general.length" class="demo__general">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 20h20L12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" /><path d="M12 10v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
              <div>
                <p v-for="g in general" :key="g.message">{{ g.message }}</p>
              </div>
            </div>
          </Transition>

          <TransitionGroup tag="ul" name="row" class="demo__list">
            <li v-for="(r, i) in results" :key="r.key" class="row" :class="`row--${r.status}`">
              <button
                type="button"
                class="row__head"
                :disabled="!r.rules.length"
                :aria-expanded="r.rules.length ? expanded === r.key : undefined"
                @click="expanded = expanded === r.key ? null : r.key"
              >
                <span class="row__rank">{{ r.status === 'block' ? '–' : i + 1 }}</span>
                <span class="row__dot" :style="{ background: r.hue }" aria-hidden="true" />
                <span class="row__name">{{ r.name }}</span>
                <span class="row__badge">{{ LABEL[r.status] }}</span>
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
          </TransitionGroup>
        </div>
      </div>

      <p v-reveal="150" class="reveal safety__note">
        이해를 돕기 위한 예시 화면이에요. 실제 앱은 더 많은 규칙과 식약처 의약품 상호작용 정보, 중복 섭취·상한섭취량까지 함께
        확인해요. 복용 중인 약이 있다면 섭취 전 반드시 의사·약사와 상의하세요.
      </p>
    </div>
  </section>
</template>

<style scoped>
.safety {
  background: var(--bg);
}
.safety__head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 32px;
  align-items: end;
  margin-bottom: clamp(40px, 5vw, 72px);
}
.safety__title {
  margin-top: 22px;
}
.safety__lead {
  max-width: 560px;
  justify-self: end;
}
.demo {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  background: var(--panel);
  box-shadow: inset 0 0 0 1px var(--line);
}
.demo__input {
  padding: clamp(24px, 3.2vw, 48px);
  border-right: 1px solid var(--line);
}
.demo__label {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.demo__group + .demo__group {
  margin-top: 20px;
}
.demo__group-name {
  display: block;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 700;
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
  gap: 10px;
  min-height: 46px;
  padding: 0 18px 0 14px;
  border: 0;
  background: rgba(16, 23, 47, 0.9);
  box-shadow: inset 0 0 0 1px var(--line);
  font-size: 15px;
  font-weight: 700;
  transition: background-color 0.2s, box-shadow 0.2s, color 0.2s;
}
.tchip:hover {
  box-shadow: inset 0 0 0 1px var(--accent);
}
.tchip__box {
  width: 16px;
  height: 16px;
  box-shadow: inset 0 0 0 1.5px var(--line-strong);
  transition: background-color 0.2s;
}
.tchip--on {
  background: var(--accent-soft);
  box-shadow: inset 0 0 0 1px var(--accent);
  color: var(--accent);
}
.tchip--on .tchip__box {
  background: var(--accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'%3E%3Cpath d='m5 9.2 2.6 2.6L13 6.4' fill='none' stroke='%2303121a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat;
  box-shadow: 0 0 10px rgba(58, 214, 212, 0.6);
}
.demo__reset {
  margin-top: 18px;
  padding: 6px 0;
  border: 0;
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
  text-decoration: underline;
  text-underline-offset: 4px;
}
.demo__legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 32px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  font-size: 13px;
  color: var(--muted);
}
.demo__legend span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.lg {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.lg--block {
  background: var(--critical);
}
.lg--caution {
  background: var(--warning);
}
.lg--ok {
  background: var(--ok);
}

.demo__output {
  padding: clamp(24px, 3.2vw, 48px);
  background:
    radial-gradient(60% 60% at 80% 0%, rgba(58, 214, 212, 0.08), transparent 70%),
    #070b1c;
}
.demo__summary {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}
.sum {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
}
.sum b {
  font-size: 24px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.sum--block {
  background: var(--critical-soft);
  color: var(--critical);
}
.sum--caution {
  background: var(--warning-soft);
  color: var(--warning);
}
.sum--ok {
  background: var(--ok-soft);
  color: var(--ok);
}
.demo__general {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  padding: 12px 16px;
  background: var(--warning-soft);
  box-shadow: inset 0 0 0 1px rgba(245, 184, 78, 0.3);
  color: #ffe2ae;
  font-size: 14px;
}
.demo__general svg {
  flex: none;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}
.demo__list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.row {
  background: rgba(16, 23, 47, 0.85);
  box-shadow: inset 0 0 0 1px var(--line);
  transition: background-color 0.3s, box-shadow 0.3s;
}
.row__head {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 54px;
  padding: 0 16px;
  border: 0;
  background: none;
  text-align: left;
}
.row__head:disabled {
  cursor: default;
  color: inherit;
}
.row__rank {
  width: 22px;
  font-size: 14px;
  font-weight: 800;
  color: var(--faint);
  font-variant-numeric: tabular-nums;
}
.row__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.row__name {
  flex: 1;
  font-size: 16px;
  font-weight: 700;
}
.row__badge {
  padding: 3px 10px;
  font-size: 12.5px;
  font-weight: 800;
  background: var(--ok-soft);
  color: var(--ok);
}
.row__chev {
  width: 18px;
  height: 18px;
  color: var(--faint);
  transition: transform 0.2s;
}
.row__chev.open {
  transform: rotate(180deg);
}
.row--caution {
  box-shadow: inset 0 0 0 1px rgba(245, 184, 78, 0.4);
}
.row--caution .row__badge {
  background: var(--warning-soft);
  color: var(--warning);
}
.row--block {
  background: rgba(255, 107, 125, 0.05);
  box-shadow: inset 0 0 0 1px rgba(255, 107, 125, 0.3);
}
.row--block .row__name {
  color: var(--faint);
  text-decoration: line-through;
  text-decoration-color: var(--critical);
}
.row--block .row__badge {
  background: var(--critical-soft);
  color: var(--critical);
}
.row__detail {
  padding: 0 16px 16px 52px;
}
.row__detail p {
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
}
.row__detail p + p {
  margin-top: 10px;
}
.row__detail small {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--faint);
}
.row__trigger {
  display: inline-block;
  margin-right: 6px;
  padding: 1px 8px;
  background: var(--accent-soft);
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
}
.safety__note {
  max-width: 820px;
  margin: 28px auto 0;
  text-align: center;
  font-size: 14px;
  color: var(--faint);
}

.row-move {
  transition: transform 0.5s var(--ease);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 960px) {
  .safety__head,
  .demo {
    grid-template-columns: minmax(0, 1fr);
  }
  .safety__lead {
    justify-self: start;
  }
  .demo__input {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .demo__legend {
    display: none;
  }
}
</style>
