<script setup lang="ts">
import { features } from '~/data/content'

const ICONS: Record<string, string> = {
  recommend: 'M9 3h6M10 3v5l-5 9a2.5 2.5 0 0 0 2.2 3.7h9.6A2.5 2.5 0 0 0 19 17l-5-9V3M7.5 14h9',
  intake: 'M4 12.5 9 17.5 20 6.5',
  coach: 'M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.4 1.4M16.6 16.6 18 18M6 18l1.4-1.4M16.6 7.4 18 6M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  catalog: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5zM4 19a2 2 0 0 1 2-2h13M9 7h6',
  reminder: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2zM10 21h4',
  share: 'M16 6a3 3 0 1 0 0-.01M8 12a3 3 0 1 0 0-.01M16 18a3 3 0 1 0 0-.01M10.6 13.5l2.8 2M13.4 8.5l-2.8 2',
}
</script>

<template>
  <section id="features" class="section features">
    <div class="container">
      <header v-reveal class="reveal section-head section-head--center">
        <p class="eyebrow">주요 기능</p>
        <h2 class="h2">추천에서 끝나지 않고,<br /><em>매일의 루틴</em>까지</h2>
        <p class="lead">고르는 순간보다 꾸준히 챙기는 매일이 더 중요하니까요. 필요한 기능만 담았어요.</p>
      </header>

      <div class="bento">
        <div v-reveal class="reveal bento__phone">
          <div class="bento__phone-bg" aria-hidden="true" />
          <PhoneMockup />
          <p class="bento__caption">앱 화면은 예시이며 실제와 다를 수 있어요.</p>
        </div>

        <ul class="bento__grid">
          <li v-for="(f, i) in features" :key="f.key" v-reveal="(i % 2) * 90" class="reveal card feat" :style="{ '--feat': f.accent }">
            <span class="feat__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path :d="ICONS[f.key]" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
            </span>
            <h3 class="feat__title">{{ f.title }}</h3>
            <p class="feat__body">{{ f.body }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: 20px;
  align-items: stretch;
}
.bento__phone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 48px 24px 28px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--night-2);
}
.bento__phone-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 45% at 50% 40%, rgba(52, 217, 160, 0.35), transparent 70%),
    radial-gradient(40% 30% at 80% 85%, rgba(255, 138, 61, 0.25), transparent 70%);
}
.bento__phone > :deep(.phone) {
  position: relative;
}
.bento__caption {
  position: relative;
  font-size: 12.5px;
  color: var(--night-muted);
}
.bento__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.feat {
  padding: 28px 26px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.feat:hover {
  transform: translateY(-4px);
  box-shadow: 0 1px 2px rgba(14, 42, 32, 0.04), 0 24px 48px -20px rgba(14, 42, 32, 0.25);
}
.feat__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--feat) 14%, white);
  color: color-mix(in srgb, var(--feat) 80%, black);
}
.feat__icon svg {
  width: 24px;
  height: 24px;
}
.feat__title {
  margin-top: 20px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.feat__body {
  margin-top: 10px;
  font-size: 15px;
  color: var(--muted);
}

@media (max-width: 1024px) {
  .bento {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .bento__grid {
    grid-template-columns: 1fr;
  }
}
</style>
