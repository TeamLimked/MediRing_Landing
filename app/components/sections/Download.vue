<template>
  <section id="download" class="section section--night download">
    <div class="download__rings" aria-hidden="true">
      <span v-for="n in 4" :key="n" :style="{ '--i': n }" />
    </div>
    <div class="container download__inner">
      <div v-reveal class="reveal">
        <AppLogo :size="44" class="download__logo" />
        <h2 class="download__title">오늘부터, 안전하게<br />나에게 맞는 영양을.</h2>
        <p class="lead">3분이면 첫 추천을 받아볼 수 있어요. 가입과 기본 기능은 무료예요.</p>
        <StoreButtons class="download__stores" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.download {
  overflow: hidden;
  text-align: center;
  background: radial-gradient(60% 80% at 50% 110%, rgba(52, 217, 160, 0.25), transparent 70%), var(--night);
}
.download__inner {
  position: relative;
  display: flex;
  justify-content: center;
}
.download__logo {
  justify-content: center;
  color: var(--night-ink);
}
.download__logo :deep(.logo__word) {
  font-size: 30px;
}
.download__title {
  margin-top: 32px;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(36px, 5.5vw, 64px);
  line-height: 1.18;
}
.download .lead {
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}
.download__stores {
  justify-content: center;
  margin-top: 40px;
}
.download__rings {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}
.download__rings span {
  grid-area: 1 / 1;
  width: calc(280px * var(--i));
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgba(52, 217, 160, calc(0.22 - var(--i) * 0.04));
  animation: ripple 5s calc(var(--i) * -1.25s) infinite ease-out;
}
@keyframes ripple {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: scale(1.15);
    opacity: 0;
  }
}
</style>
