<script setup lang="ts">
import { steps } from '~/data/content'
</script>

<template>
  <section id="how" class="section how">
    <div class="container">
      <header v-reveal class="reveal section-head">
        <p class="eyebrow">작동 방식</p>
        <h2 class="h2">추천은 마지막 순서예요.<br /><em>확인이 먼저</em>입니다.</h2>
        <p class="lead">
          좋다는 영양제를 무작정 더하기 전에, 지금 먹는 약과 몸 상태부터 살펴요. 메디링은 세 단계로 나에게 맞는 조합을
          찾아요.
        </p>
      </header>

      <ol class="how__steps">
        <li v-for="(s, i) in steps" :key="s.no" v-reveal="i * 120" class="reveal card step">
          <div class="step__visual" :class="`step__visual--${i}`" aria-hidden="true">
            <!-- 01: 5점 척도 -->
            <div v-if="i === 0" class="scale">
              <p>최근 2주, 쉽게 피곤했나요?</p>
              <div class="scale__dots">
                <span v-for="n in 5" :key="n" :class="{ on: n === 4 }">{{ n }}</span>
              </div>
            </div>
            <!-- 02: 점검 결과 -->
            <ul v-else-if="i === 1" class="checks">
              <li class="checks__row checks__row--block"><b>제외</b>비타민 K</li>
              <li class="checks__row checks__row--caution"><b>주의</b>오메가-3</li>
              <li class="checks__row checks__row--ok"><b>통과</b>비타민 D</li>
            </ul>
            <!-- 03: 체크리스트 -->
            <ul v-else class="todo">
              <li class="done"><i />비타민 D · 아침</li>
              <li class="done"><i />마그네슘 · 저녁</li>
              <li><i />오메가-3 · 저녁</li>
            </ul>
          </div>
          <span class="step__no">{{ s.no }}</span>
          <h3 class="step__title">{{ s.title }}</h3>
          <p class="step__body">{{ s.body }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.how__steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: none;
}
.step {
  position: relative;
  padding: 24px 24px 32px;
}
.step__visual {
  display: grid;
  place-items: center;
  height: 188px;
  margin-bottom: 28px;
  border-radius: var(--radius-md);
  background: var(--accent-soft);
  overflow: hidden;
}
.step__visual--1 {
  background: var(--spark-soft);
}
.step__visual--2 {
  background: var(--aqua-soft);
}
.step__no {
  font-size: 14px;
  font-weight: 800;
  color: var(--accent-strong);
  letter-spacing: 0.04em;
}
.step__title {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.step__body {
  margin-top: 12px;
  color: var(--muted);
  font-size: 15.5px;
}

/* 미니 UI */
.scale {
  width: 82%;
  padding: 18px;
  border-radius: 16px;
  background: #fff;
  box-shadow: var(--shadow-card);
}
.scale p {
  font-size: 14px;
  font-weight: 700;
}
.scale__dots {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
}
.scale__dots span {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  color: var(--faint);
  background: var(--bg);
}
.scale__dots span.on {
  background: var(--accent-strong);
  color: #fff;
  box-shadow: 0 0 0 5px rgba(16, 185, 129, 0.2);
}
.checks,
.todo {
  width: 82%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.checks__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(14, 42, 32, 0.06);
}
.checks__row b {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.checks__row--block b {
  background: var(--critical-soft);
  color: var(--critical);
}
.checks__row--block {
  color: var(--faint);
  text-decoration: line-through;
}
.checks__row--caution b {
  background: var(--warning-soft);
  color: var(--warning);
}
.checks__row--ok b {
  background: var(--accent-soft);
  color: var(--accent-strong);
}
.todo li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(14, 42, 32, 0.06);
}
.todo i {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 2px var(--line);
}
.todo li.done {
  color: var(--faint);
}
.todo li.done i {
  background: var(--aqua) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='m5.5 10.2 3 3 6-6.2' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat;
  box-shadow: none;
}

@media (max-width: 960px) {
  .how__steps {
    grid-template-columns: 1fr;
    max-width: 560px;
  }
}
</style>
