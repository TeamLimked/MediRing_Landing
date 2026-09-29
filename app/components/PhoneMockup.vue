<script setup lang="ts">
// 앱 홈 화면(컨디션 점수·주목 영양소·안전 요약·AI 코칭)을 CSS 로 재현한 목업. 수치는 예시.
const score = 82
const circumference = 2 * Math.PI * 42
</script>

<template>
  <div class="phone" role="img" aria-label="MediRing 앱 홈 화면 예시: 컨디션 점수, 주목 영양소, 안전 요약, AI 코칭">
    <div class="phone__screen">
      <div class="phone__status" aria-hidden="true">
        <span>9:41</span>
        <span class="phone__island" />
        <span class="phone__icons"><i /><i /><i /></span>
      </div>

      <div class="ph-hero">
        <div>
          <p class="ph-hero__title">좋은 아침이에요!</p>
          <p class="ph-hero__sub">오늘 루틴 2/3 완료</p>
        </div>
        <svg class="ph-sprout" viewBox="0 0 48 48" aria-hidden="true">
          <ellipse cx="24" cy="42" rx="12" ry="3" fill="#10B981" opacity=".18" />
          <path d="M24 40V24" stroke="#0A7D55" stroke-width="3" stroke-linecap="round" />
          <path d="M24 26c0-7 5-11 12-11 0 7-5 11-12 11z" fill="#34D9A0" />
          <path d="M24 29c0-5.5-4-9-10-9 0 5.5 4 9 10 9z" fill="#10B981" />
        </svg>
      </div>

      <div class="ph-card ph-score">
        <svg viewBox="0 0 100 100" class="ph-ring" aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#E1F0E9" stroke-width="9" />
          <circle
            class="ph-ring__bar"
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="url(#ph-grad)"
            stroke-width="9"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :style="{ '--target': circumference * (1 - score / 100), '--full': circumference }"
          />
          <defs>
            <linearGradient id="ph-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#10B981" />
              <stop offset="1" stop-color="#22B8CF" />
            </linearGradient>
          </defs>
        </svg>
        <div class="ph-score__num">
          <strong>{{ score }}</strong>
          <span>컨디션 점수</span>
        </div>
        <div class="ph-score__side">
          <p>지난주보다</p>
          <b>▲ 4</b>
        </div>
      </div>

      <div class="ph-card">
        <p class="ph-label">주목 영양소</p>
        <div class="ph-nutrients">
          <span style="--c: #f5a623">비타민 D</span>
          <span style="--c: #22b8cf">마그네슘</span>
          <span style="--c: #6d8bff">오메가-3</span>
        </div>
      </div>

      <div class="ph-card ph-safety">
        <span class="ph-safety__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3z" fill="currentColor" /></svg>
        </span>
        <div>
          <p class="ph-safety__title">안전 점검 · 주의 1건</p>
          <p class="ph-safety__sub">오메가-3 · 복용약과 함께 확인 필요</p>
        </div>
      </div>

      <div class="ph-card ph-coach">
        <p class="ph-label"><span class="ph-ai">AI</span>오늘의 코칭</p>
        <p class="ph-coach__text">어제는 저녁 루틴을 놓쳤어요. 오늘은 식사 후 바로 체크해 볼까요?</p>
      </div>

      <div class="ph-tabs" aria-hidden="true">
        <i class="on" /><i /><i /><i /><i />
      </div>
    </div>
  </div>
</template>

<style scoped>
.phone {
  width: 300px;
  max-width: 100%;
  aspect-ratio: 300 / 610;
  padding: 11px;
  border-radius: 48px;
  background: linear-gradient(145deg, #1d3a2f, #07130f);
  box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.12), 0 40px 80px -30px rgba(4, 20, 14, 0.55), 0 12px 24px -12px rgba(4, 20, 14, 0.3);
}
.phone__screen {
  position: relative;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px 0;
  border-radius: 38px;
  background: var(--bg);
  font-size: 13px;
  line-height: 1.4;
}
.phone__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 700;
}
.phone__island {
  width: 86px;
  height: 24px;
  border-radius: 999px;
  background: #07130f;
}
.phone__icons {
  display: flex;
  gap: 3px;
}
.phone__icons i {
  width: 12px;
  height: 8px;
  border-radius: 2px;
  background: var(--ink);
  opacity: 0.8;
}
.ph-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 20px;
  background: var(--accent-soft);
}
.ph-hero__title {
  font-family: var(--font-display);
  font-size: 19px;
}
.ph-hero__sub {
  font-size: 12px;
  color: var(--muted);
}
.ph-sprout {
  width: 46px;
  height: 46px;
  animation: sway 4s ease-in-out infinite;
  transform-origin: 50% 90%;
}
.ph-card {
  padding: 12px 14px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(14, 42, 32, 0.05);
}
.ph-score {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}
.ph-ring {
  width: 68px;
  height: 68px;
  transform: rotate(-90deg);
}
.ph-ring__bar {
  stroke-dashoffset: var(--target);
  animation: ring 1.8s 0.3s both cubic-bezier(0.2, 0.7, 0.2, 1);
}
.ph-score__num {
  position: absolute;
  left: 14px;
  width: 68px;
  text-align: center;
  display: flex;
  flex-direction: column;
  line-height: 1.05;
}
.ph-score__num strong {
  font-size: 22px;
  font-weight: 800;
}
.ph-score__num span {
  font-size: 9px;
  color: var(--faint);
  font-weight: 600;
}
.ph-score__side {
  margin-left: auto;
  text-align: right;
  font-size: 12px;
  color: var(--muted);
}
.ph-score__side b {
  font-size: 18px;
  color: var(--spark);
}
.ph-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--faint);
}
.ph-nutrients {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.ph-nutrients span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--c) 14%, white);
  font-size: 12px;
  font-weight: 700;
}
.ph-nutrients span::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c);
}
.ph-safety {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ph-safety__icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--warning-soft);
  color: #f5a623;
}
.ph-safety__icon svg {
  width: 18px;
  height: 18px;
}
.ph-safety__title {
  font-weight: 700;
}
.ph-safety__sub {
  font-size: 11.5px;
  color: var(--muted);
}
.ph-ai {
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--aqua-soft);
  color: var(--info);
  font-size: 10px;
  font-weight: 800;
}
.ph-coach__text {
  margin-top: 6px;
  font-size: 12.5px;
}
.ph-tabs {
  display: flex;
  justify-content: space-around;
  margin: auto -14px 0;
  padding: 12px 20px 20px;
  background: #fff;
  border-top: 1px solid var(--line);
}
.ph-tabs i {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: var(--line);
}
.ph-tabs i.on {
  background: var(--accent);
}

@keyframes ring {
  from {
    stroke-dashoffset: var(--full);
  }
}
@keyframes sway {
  50% {
    transform: rotate(-6deg);
  }
}
</style>
