<template>
  <section id="download" class="dl" aria-labelledby="dl-title">
    <div class="dl__bg" aria-hidden="true">
      <span class="dl__ring" />
      <span class="dl__ring dl__ring--2" />
    </div>
    <div class="container dl__inner">
      <p class="eyebrow">Get started</p>
      <h2 id="dl-title" class="display dl__title" v-split data-split>메디링과 함께<br />오늘의 영양을 시작하세요.</h2>
      <p class="lead dl__lead">3분이면 첫 추천을 받아볼 수 있어요. 가입과 핵심 기능은 무료예요.</p>
      <StoreButtons class="dl__stores" />
      <p class="dl__note">만 19세 이상 성인 대상 · 의료 진단·치료를 대체하지 않습니다</p>
    </div>
  </section>
</template>

<style scoped>
.dl {
  position: relative;
  overflow: hidden;
  padding: clamp(140px, 16vw, 240px) 0;
  text-align: center;
  background: #02030d;
}
.dl__bg {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: radial-gradient(50% 60% at 50% 50%, rgba(58, 214, 212, 0.14), transparent 70%);
}
/* 흐릿한 대형 링(MediRing) */
.dl__ring {
  grid-area: 1 / 1;
  width: min(1100px, 130vw);
  aspect-ratio: 1;
  border-radius: 50%;
  background: conic-gradient(from 0deg, transparent, rgba(58, 214, 212, 0.55), rgba(143, 184, 255, 0.35), transparent 60%);
  mask: radial-gradient(closest-side, transparent 86%, #000 88%, #000 92%, transparent 94%);
  -webkit-mask: radial-gradient(closest-side, transparent 86%, #000 88%, #000 92%, transparent 94%);
  filter: blur(6px);
  animation: spin 18s linear infinite;
}
.dl__ring--2 {
  width: min(760px, 95vw);
  opacity: 0.6;
  animation-duration: 26s;
  animation-direction: reverse;
}
@keyframes spin {
  to {
    transform: rotate(1turn);
  }
}
.dl__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.dl__title {
  margin-top: 22px;
}
.dl__lead {
  margin-top: 22px;
}
.dl__stores {
  justify-content: center;
  margin-top: clamp(36px, 4vw, 56px);
}
.dl__note {
  margin-top: 28px;
  font-size: 13px;
  color: var(--faint);
}
</style>
