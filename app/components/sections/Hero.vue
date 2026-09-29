<template>
  <section id="top" class="mv">
    <div class="mv__poster" aria-hidden="true" />
    <ClientOnly><HeroScene /></ClientOnly>
    <div class="mv__shade" aria-hidden="true" />

    <div class="mv__content">
      <h1 class="mv__title" v-split="{ immediate: true, delay: 0.25 }" data-split>
        안전을 넘어,<br class="mv__br" /> 나에게 꼭 맞는 영양으로
      </h1>
      <div class="mv__line" aria-hidden="true" />
      <div class="mv__bottom">
        <p class="mv__desc" v-split="{ immediate: true, delay: 0.7 }" data-split>
          검증된 기준 데이터와 안전 규칙으로 나에게 맞는 영양을 설계합니다.<br />
          매일을 지키는 Personal Nutrition Guide.
        </p>
        <NuxtLink to="/#safety" class="bracket mv__now">+ 체험하기</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mv {
  position: relative;
  height: 100vh;
  height: 100svh;
  min-height: 640px;
  overflow: hidden;
  isolation: isolate;
  background: var(--bg);
}
/* WebGL 준비 전·불가 시 정적 배경 */
.mv__poster {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(38% 50% at 68% 38%, rgba(58, 214, 212, 0.2), transparent 70%),
    radial-gradient(30% 40% at 88% 12%, rgba(143, 184, 255, 0.14), transparent 70%),
    linear-gradient(180deg, #02030a 0%, #050a1c 70%, #03040c 100%);
}
.mv :deep(.scene) {
  z-index: -1;
}
.mv__shade {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(0deg, rgba(3, 4, 12, 0.92) 0%, rgba(3, 4, 12, 0.35) 38%, transparent 62%),
    radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(3, 4, 12, 0.6) 100%);
}
.mv__content {
  position: absolute;
  inset: auto 0 0;
  padding: 0 var(--gutter) clamp(40px, 6vh, 72px);
}
.mv__title {
  font-size: clamp(42px, 6.1vw, 112px);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.045em;
}
.mv__br {
  display: none;
}
.mv__line {
  height: 1px;
  margin: clamp(28px, 3.4vw, 48px) 0 clamp(24px, 3vw, 40px);
  background: var(--line-strong);
  transform-origin: left;
  animation: line-in 1.4s 0.6s both var(--ease);
}
.mv__bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}
.mv__desc {
  font-size: clamp(16px, 1.25vw, 21px);
  font-weight: 600;
  line-height: 1.6;
  color: rgba(242, 246, 250, 0.88);
}
.mv__now {
  flex: none;
  min-width: 132px;
  animation: fade-in 1s 1.2s both var(--ease);
}
@keyframes line-in {
  from {
    transform: scaleX(0);
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (max-width: 760px) {
  .mv__br {
    display: inline;
  }
  .mv__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
  .mv__now {
    align-self: stretch;
  }
}
</style>
