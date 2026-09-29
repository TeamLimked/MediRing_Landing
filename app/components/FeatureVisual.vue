<script setup lang="ts">
// 기능 슬라이드용 비주얼(사진 대신 CSS 로 그린 다크 UI). 수치·항목은 예시이며, 안전 규칙 문구는 실제 규칙 데이터 기준.
import type { FeatureKind } from '~/data/content'

defineProps<{ kind: FeatureKind }>()
</script>

<template>
  <div class="fv" :class="`fv--${kind}`" aria-hidden="true">
    <div class="fv__bg" />

    <!-- 복용약 -->
    <div v-if="kind === 'meds'" class="fv__stack">
      <div class="tag"><i />복용약 · 와파린(항응고제)</div>
      <ul class="rows">
        <li class="r r--block"><b>제외</b>비타민 K<small>약효(INR)에 영향</small></li>
        <li class="r r--caution"><b>주의</b>오메가-3<small>고용량 시 출혈 경향</small></li>
        <li class="r r--caution"><b>주의</b>비타민 E<small>출혈 위험 증가 가능</small></li>
        <li class="r r--ok"><b>통과</b>비타민 D</li>
      </ul>
    </div>

    <!-- 질환·임신 -->
    <div v-else-if="kind === 'conditions'" class="fv__stack">
      <div class="tags">
        <div class="tag"><i />신장 질환</div>
        <div class="tag tag--warm"><i />임신 중</div>
      </div>
      <div class="banner">모든 건강기능식품은 의사·약사와 상의한 뒤 드세요.</div>
      <ul class="rows">
        <li class="r r--block"><b>제외</b>마그네슘<small>신장 질환</small></li>
        <li class="r r--caution"><b>주의</b>비타민 D<small>신장 질환</small></li>
        <li class="r r--caution"><b>주의</b>비타민 A<small>임신 · 레티놀 고용량</small></li>
      </ul>
    </div>

    <!-- 영양소 순위 -->
    <div v-else-if="kind === 'rank'" class="fv__stack">
      <p class="cap">나의 맞춤 영양소</p>
      <ul class="bars">
        <li style="--w: 92%; --c: #f5b84e"><span>1</span>비타민 D<em>주목</em></li>
        <li style="--w: 81%; --c: #3ad6d4"><span>2</span>마그네슘</li>
        <li style="--w: 70%; --c: #8fb8ff"><span>3</span>오메가-3<em class="warn">주의</em></li>
        <li style="--w: 58%; --c: #34d9a0"><span>4</span>비타민 B군</li>
        <li style="--w: 46%; --c: #ff9f5a"><span>5</span>아연</li>
      </ul>
    </div>

    <!-- 근거 -->
    <div v-else-if="kind === 'evidence'" class="fv__stack fv__stack--wide">
      <div class="ev">
        <div class="ev__head"><i style="--c: #f5b84e" />비타민 D</div>
        <div class="ev__block">
          <p>식약처 인정 기능성 <small>원문 인용</small></p>
          <span class="sk" style="--w: 92%" /><span class="sk" style="--w: 74%" />
        </div>
        <div class="ev__block">
          <p>2025 한국인 영양소 섭취기준</p>
          <div class="chips"><span>권장</span><span>충분</span><span>상한</span></div>
        </div>
        <div class="ev__block ev__block--row">
          <p>함께 먹으면 좋은 음식</p>
          <div class="chips chips--soft"><span>연어</span><span>달걀노른자</span><span>버섯</span></div>
        </div>
      </div>
    </div>

    <!-- 섭취 체크 -->
    <div v-else-if="kind === 'checklist'" class="fv__split">
      <ul class="todo">
        <li class="done"><i />비타민 D<small>아침 식후</small></li>
        <li class="done"><i />마그네슘<small>저녁 식후</small></li>
        <li><i />오메가-3<small>저녁 식후</small></li>
      </ul>
      <div class="streak">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(236,244,255,.1)" stroke-width="8" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="#3ad6d4" stroke-width="8" stroke-linecap="round" stroke-dasharray="314" stroke-dashoffset="105" transform="rotate(-90 60 60)" />
        </svg>
        <p><b>2/3</b><small>오늘 완료</small></p>
      </div>
    </div>

    <!-- 루틴 정원 -->
    <div v-else class="fv__split fv__split--garden">
      <svg class="plant" viewBox="0 0 200 220">
        <g>
          <circle v-for="k in 6" :key="k" cx="100" cy="44" r="13" fill="#ff9fc0" :transform="`rotate(${k * 60} 100 62)`" />
          <circle cx="100" cy="62" r="11" fill="#f7b801" />
        </g>
        <path d="M100 172V70" stroke="#34d9a0" stroke-width="6" stroke-linecap="round" />
        <path d="M100 118c-4-18-22-26-40-22 4 18 22 26 40 22z" fill="#12c4b0" />
        <path d="M100 104c4-18 22-26 40-22-4 18-22 26-40 22z" fill="#34d9a0" />
        <path d="M100 140c-2-14-16-22-32-18 3 14 16 21 32 18z" fill="#10b981" />
        <path d="M100 140c2-14 16-22 32-18-3 14-16 21-32 18z" fill="#34d9a0" />
        <path d="M58 170h84l-9 44H67z" fill="#ff8a3d" />
        <rect x="52" y="162" width="96" height="14" rx="7" fill="#ff9f5a" />
      </svg>
      <div class="xp">
        <p class="xp__stage">활짝</p>
        <div class="xp__bar"><span /></div>
        <p class="xp__text">함께 만든 작은 정원이 완성됐어요.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fv {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #060a18;
}
.fv__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(45% 60% at 70% 60%, rgba(58, 214, 212, 0.22), transparent 70%),
    radial-gradient(40% 50% at 15% 10%, rgba(143, 184, 255, 0.12), transparent 70%),
    linear-gradient(rgba(236, 244, 255, 0.05) 1px, transparent 1px) 0 0 / 40px 40px,
    linear-gradient(90deg, rgba(236, 244, 255, 0.05) 1px, transparent 1px) 0 0 / 40px 40px;
  mask-image: radial-gradient(90% 90% at 50% 50%, #000 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(90% 90% at 50% 50%, #000 40%, transparent 100%);
}
.fv--conditions .fv__bg,
.fv--garden .fv__bg {
  background:
    radial-gradient(45% 60% at 30% 60%, rgba(255, 159, 90, 0.16), transparent 70%),
    radial-gradient(45% 60% at 75% 40%, rgba(58, 214, 212, 0.18), transparent 70%),
    linear-gradient(rgba(236, 244, 255, 0.05) 1px, transparent 1px) 0 0 / 40px 40px,
    linear-gradient(90deg, rgba(236, 244, 255, 0.05) 1px, transparent 1px) 0 0 / 40px 40px;
}
.fv__stack {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: min(460px, 78%);
}
.fv__stack--wide {
  width: min(560px, 84%);
}
.fv__split {
  position: relative;
  display: flex;
  align-items: center;
  gap: clamp(20px, 4vw, 56px);
  width: min(640px, 84%);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  padding: 10px 16px;
  background: rgba(58, 214, 212, 0.1);
  box-shadow: inset 0 0 0 1px rgba(58, 214, 212, 0.4);
  font-size: 14px;
  font-weight: 700;
  color: #b9fbf8;
}
.tag i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent);
}
.tag--warm {
  background: rgba(255, 159, 90, 0.1);
  box-shadow: inset 0 0 0 1px rgba(255, 159, 90, 0.4);
  color: #ffd9bd;
}
.tag--warm i {
  background: var(--spark);
  box-shadow: 0 0 10px var(--spark);
}
.tags {
  display: flex;
  gap: 10px;
}
.banner {
  padding: 12px 16px;
  background: var(--warning-soft);
  box-shadow: inset 0 0 0 1px rgba(245, 184, 78, 0.35);
  font-size: 13.5px;
  font-weight: 600;
  color: #ffe2ae;
}
.rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.r {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(16, 23, 47, 0.85);
  box-shadow: inset 0 0 0 1px var(--line);
  font-size: 15px;
  font-weight: 700;
}
.r b {
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 800;
}
.r small {
  margin-left: auto;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--faint);
}
.r--block {
  box-shadow: inset 0 0 0 1px rgba(255, 107, 125, 0.35);
}
.r--block b {
  background: var(--critical-soft);
  color: var(--critical);
}
.r--caution b {
  background: var(--warning-soft);
  color: var(--warning);
}
.r--ok b {
  background: var(--ok-soft);
  color: var(--ok);
}

.cap {
  font-size: 14px;
  font-weight: 700;
  color: var(--muted);
}
.bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.bars li {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 50px;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 700;
  background: rgba(16, 23, 47, 0.7);
  box-shadow: inset 0 0 0 1px var(--line);
  overflow: hidden;
}
.bars li::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--w);
  background: linear-gradient(90deg, color-mix(in srgb, var(--c) 32%, transparent), color-mix(in srgb, var(--c) 8%, transparent));
  box-shadow: inset -2px 0 0 var(--c);
}
.bars span,
.bars em {
  position: relative;
}
.bars li > :not(span):not(em) {
  position: relative;
}
.bars span {
  width: 18px;
  font-size: 13px;
  color: var(--c);
}
.bars em {
  margin-left: auto;
  padding: 2px 8px;
  font-size: 12px;
  font-style: normal;
  background: rgba(245, 184, 78, 0.16);
  color: var(--warning);
}
.bars em.warn {
  background: var(--warning-soft);
}

.ev {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--line);
  box-shadow: 0 0 0 1px var(--line);
}
.ev__head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: rgba(16, 23, 47, 0.95);
  font-size: 18px;
  font-weight: 800;
}
.ev__head i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c);
  box-shadow: 0 0 12px var(--c);
}
.ev__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
  background: rgba(10, 15, 34, 0.95);
}
.ev__block p {
  font-size: 13px;
  font-weight: 700;
  color: var(--muted);
}
.ev__block small {
  margin-left: 6px;
  color: var(--accent);
}
.sk {
  display: block;
  width: var(--w);
  height: 9px;
  background: linear-gradient(90deg, rgba(236, 244, 255, 0.14), rgba(236, 244, 255, 0.05));
}
.chips {
  display: flex;
  gap: 8px;
}
.chips span {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 700;
  background: var(--accent-soft);
  color: var(--accent);
}
.chips--soft span {
  background: rgba(236, 244, 255, 0.06);
  color: var(--ink);
}

.todo {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.todo li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: rgba(16, 23, 47, 0.85);
  box-shadow: inset 0 0 0 1px var(--line);
  font-size: 15px;
  font-weight: 700;
}
.todo i {
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 1.5px var(--line-strong);
}
.todo li.done {
  color: var(--faint);
}
.todo li.done i {
  background: var(--accent) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='m5.5 10.2 3 3 6-6.2' fill='none' stroke='%2303121a' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat;
  box-shadow: 0 0 12px rgba(58, 214, 212, 0.6);
}
.todo small {
  margin-left: auto;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--faint);
}
.streak {
  position: relative;
  flex: none;
  width: clamp(110px, 12vw, 160px);
}
.streak svg {
  filter: drop-shadow(0 0 12px rgba(58, 214, 212, 0.5));
}
.streak p {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
}
.streak b {
  font-size: 28px;
  font-weight: 800;
}
.streak small {
  font-size: 12px;
  color: var(--muted);
}

.fv__split--garden {
  justify-content: center;
}
.plant {
  width: clamp(140px, 16vw, 220px);
  filter: drop-shadow(0 20px 40px rgba(58, 214, 212, 0.25));
}
.xp {
  width: min(240px, 45%);
}
.xp__stage {
  font-size: 32px;
  font-weight: 800;
  color: var(--mint);
}
.xp__bar {
  height: 6px;
  margin: 12px 0 14px;
  background: rgba(236, 244, 255, 0.1);
}
.xp__bar span {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--mint), var(--accent));
  box-shadow: 0 0 12px var(--accent);
}
.xp__text {
  font-size: 14px;
  color: var(--muted);
}

@media (max-width: 960px) {
  .fv {
    place-items: start center;
    padding: 64px 0 96px;
  }
}
@media (max-width: 640px) {
  .fv__stack,
  .fv__stack--wide,
  .fv__split {
    width: 88%;
    gap: 10px;
  }
  .r,
  .bars li,
  .todo li {
    padding: 10px 12px;
    font-size: 13px;
  }
  .bars li {
    height: 38px;
  }
  .r small,
  .todo small,
  .ev__block--row {
    display: none;
  }
  .ev__block {
    padding: 10px 14px;
  }
  .tag {
    padding: 6px 10px;
    font-size: 12px;
  }
  .banner {
    display: none;
  }
}
</style>
