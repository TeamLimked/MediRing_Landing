<template>
  <section id="download" class="section" aria-labelledby="dl-title">
    <div class="container">
      <div class="dl card">
        <div>
          <h2 id="dl-title" class="title">오늘의 영양을 차분하게 시작하세요</h2>
          <p class="dl__lead">3분이면 첫 추천을 받아볼 수 있어요. 가입과 핵심 기능은 무료예요.</p>
          <p class="dl__note">만 19세 이상 성인 대상 · 의료 진단·치료를 대체하지 않습니다</p>
        </div>
        <StoreButtons />
      </div>
    </div>
  </section>
</template>

<style scoped>
.dl {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px 40px;
  padding: clamp(28px, 4vw, 48px);
}
.dl .title {
  margin-top: 0;
}
.dl__lead {
  margin-top: 10px;
  color: var(--muted);
}
.dl__note {
  margin-top: 6px;
  font-size: 13px;
  color: var(--faint);
}
</style>
