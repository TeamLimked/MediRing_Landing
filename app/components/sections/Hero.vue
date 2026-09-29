<script setup lang="ts">
const chips = [
  { key: 'safe', tone: 'mint', title: '안전 점검 완료', sub: '복용약 2건 · 주의 1건 확인' },
  { key: 'focus', tone: 'spark', title: '오늘의 주목 영양소', sub: '비타민 D · 마그네슘' },
  { key: 'streak', tone: 'aqua', title: '섭취 루틴 12일째', sub: '새싹이가 떡잎을 틔웠어요' },
]
</script>

<template>
  <section id="top" class="hero">
    <div class="hero__poster" aria-hidden="true" />
    <ClientOnly><HeroScene /></ClientOnly>
    <div class="hero__veil" aria-hidden="true" />

    <div class="container hero__inner">
      <div class="hero__copy">
        <p class="hero__badge">
          <span class="hero__dot" aria-hidden="true" />
          안전 점검부터 하는 개인 맞춤 영양 가이드
        </p>
        <h1 class="hero__title">
          나에게 맞는 영양,<br />
          <span class="hero__accent">안전하게</span> 고르는 법
        </h1>
        <p class="hero__lead">
          3분 컨디션 체크로 <strong>2025 한국인 영양소 섭취기준</strong>과 <strong>식약처 인정 기능성</strong> 데이터에
          기반한 맞춤 영양소를 추천해요. 복용 중인 약·질환·알레르기 주의사항은 추천 전에 먼저 걸러냅니다.
        </p>
        <div class="hero__actions">
          <a href="#download" class="btn btn--mint">
            무료로 시작하기
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </a>
          <a href="#how" class="btn btn--ghost-light">작동 방식 보기</a>
        </div>
        <ul class="hero__meta">
          <li>만 19세 이상 성인</li>
          <li>iOS · Android</li>
          <li>의료 진단을 대체하지 않아요</li>
        </ul>
      </div>
    </div>

    <ul class="hero__chips" aria-hidden="true">
      <li v-for="(c, i) in chips" :key="c.key" class="chip" :class="`chip--${c.tone} chip--${i}`">
        <span class="chip__icon">
          <svg v-if="c.key === 'safe'" viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" /><path d="m9 12 2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          <svg v-else-if="c.key === 'focus'" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
          <svg v-else viewBox="0 0 24 24"><path d="M12 21v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><path d="M12 13c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5zM12 15c0-3-2.3-5-5.5-5 0 3 2.3 5 5.5 5z" fill="currentColor" /></svg>
        </span>
        <span class="chip__text">
          <strong>{{ c.title }}</strong>
          <small>{{ c.sub }}</small>
        </span>
      </li>
    </ul>

    <a href="#stats" class="hero__scroll" aria-label="아래로 스크롤">
      <span />
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--night);
  color: var(--night-ink);
  isolation: isolate;
}
/* WebGL 이 준비되기 전·불가할 때의 정적 배경 */
.hero__poster {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(40% 50% at 72% 50%, rgba(52, 217, 160, 0.22), transparent 70%),
    radial-gradient(30% 35% at 85% 20%, rgba(34, 184, 207, 0.18), transparent 70%),
    radial-gradient(35% 40% at 10% 90%, rgba(255, 138, 61, 0.1), transparent 70%),
    linear-gradient(180deg, #06110d 0%, #0a1c15 60%, #07130f 100%);
}
.hero :deep(.scene) {
  z-index: -1;
}
.hero__veil {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(7, 19, 15, 0.82) 0%, rgba(7, 19, 15, 0.35) 42%, transparent 60%),
    linear-gradient(0deg, var(--night) 0%, transparent 18%);
}
.hero__inner {
  position: relative;
  padding-top: calc(var(--header-h) + 48px);
  padding-bottom: 96px;
}
.hero__copy {
  max-width: 600px;
}
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 8px 12px;
  border-radius: 999px;
  background: rgba(52, 217, 160, 0.1);
  box-shadow: inset 0 0 0 1px rgba(52, 217, 160, 0.3);
  color: #b8ffe4;
  font-size: 14px;
  font-weight: 600;
  animation: rise 0.9s 0.1s both cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hero__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--mint-bright);
  box-shadow: 0 0 0 0 rgba(52, 217, 160, 0.6);
  animation: beat 1.1s infinite;
}
.hero__title {
  margin-top: 28px;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(44px, 7vw, 84px);
  line-height: 1.12;
  letter-spacing: -0.02em;
  animation: rise 0.9s 0.2s both cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hero__accent {
  background: linear-gradient(95deg, #34d9a0 10%, #49d0e4 60%, #ff9f5a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero__lead {
  margin-top: 24px;
  max-width: 540px;
  font-size: clamp(16px, 1.5vw, 19px);
  line-height: 1.75;
  color: var(--night-muted);
  animation: rise 0.9s 0.3s both cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hero__lead strong {
  color: var(--night-ink);
  font-weight: 700;
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
  animation: rise 0.9s 0.4s both cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  color: var(--night-muted);
  animation: rise 0.9s 0.5s both cubic-bezier(0.2, 0.7, 0.2, 1);
}
.hero__meta li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.hero__meta li::before {
  content: '';
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(52, 217, 160, 0.18) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath d='m4 7.2 2 2 4-4.2' fill='none' stroke='%2334D9A0' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/100% no-repeat;
}

/* 떠 있는 UI 칩(데스크톱) */
.hero__chips {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: none;
}
.chip {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px 12px 12px;
  border-radius: 18px;
  background: rgba(12, 31, 24, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: inset 0 0 0 1px rgba(234, 246, 239, 0.12), var(--shadow-float);
  animation: pop 0.9s both cubic-bezier(0.2, 0.7, 0.2, 1), float 6s ease-in-out infinite;
}
.chip--0 {
  top: 24%;
  right: 6%;
  animation-delay: 1.4s, 2.3s;
}
.chip--1 {
  top: 58%;
  right: 34%;
  animation-delay: 1.7s, 2.6s;
}
.chip--2 {
  bottom: 14%;
  right: 8%;
  animation-delay: 2s, 2.9s;
}
.chip__icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
}
.chip__icon svg {
  width: 22px;
  height: 22px;
}
.chip--mint .chip__icon {
  background: rgba(52, 217, 160, 0.16);
  color: var(--mint-bright);
}
.chip--spark .chip__icon {
  background: rgba(255, 159, 90, 0.16);
  color: #ff9f5a;
}
.chip--aqua .chip__icon {
  background: rgba(73, 208, 228, 0.16);
  color: #49d0e4;
}
.chip__text {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}
.chip__text strong {
  font-size: 15px;
  font-weight: 700;
}
.chip__text small {
  font-size: 13px;
  color: var(--night-muted);
}

.hero__scroll {
  position: absolute;
  left: 50%;
  bottom: 28px;
  width: 26px;
  height: 42px;
  margin-left: -13px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1.5px rgba(234, 246, 239, 0.3);
}
.hero__scroll span {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 4px;
  height: 8px;
  margin-left: -2px;
  border-radius: 2px;
  background: var(--mint-bright);
  animation: scrollcue 1.8s infinite;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}
@keyframes pop {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.94);
  }
}
@keyframes float {
  50% {
    translate: 0 -10px;
  }
}
@keyframes beat {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(52, 217, 160, 0.6);
  }
  30% {
    box-shadow: 0 0 0 8px rgba(52, 217, 160, 0);
  }
}
@keyframes scrollcue {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(14px);
  }
}

@media (max-width: 1100px) {
  .chip--1 {
    display: none;
  }
}
@media (max-width: 960px) {
  .hero {
    align-items: flex-end;
  }
  .hero__veil {
    background: linear-gradient(0deg, var(--night) 8%, rgba(7, 19, 15, 0.7) 45%, transparent 70%);
  }
  .hero__inner {
    padding-top: 46vh;
    padding-bottom: 88px;
  }
  .hero__chips {
    display: none;
  }
}
@media (max-width: 480px) {
  .hero__inner {
    padding-top: 40vh;
  }
  .hero__actions .btn {
    flex: 1 1 100%;
  }
  .hero__scroll {
    display: none;
  }
}
</style>
