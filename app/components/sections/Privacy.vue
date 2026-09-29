<script setup lang="ts">
import { privacyPoints } from '~/data/content'

const ICONS = [
  'M6 10V8a6 6 0 1 1 12 0v2M5 10h14v10H5zM12 14v3',
  'M9 11l2 2 4-4M4 5h16v14H4z',
  'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
  'M12 3v12M7 10l5 5 5-5M4 19h16',
  'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  'M12 3 5 6v5c0 4.4 3 8.3 7 9.5 4-1.2 7-5.1 7-9.5V6l-7-3z',
]
</script>

<template>
  <section id="privacy" class="section section--night privacy">
    <div class="privacy__glow" aria-hidden="true" />
    <div class="container">
      <header v-reveal class="reveal section-head">
        <p class="eyebrow">개인정보 보호</p>
        <h2 class="h2">건강 정보는 가장 민감한 정보예요.<br /><em>그만큼 엄격하게</em> 다룹니다.</h2>
        <p class="lead">개인정보 보호법의 민감정보·국외이전 기준에 맞춰 설계했어요. 필요한 만큼만 받고, 쓰는 곳을 알려 드려요.</p>
      </header>

      <ul class="privacy__grid">
        <li v-for="(p, i) in privacyPoints" :key="p.title" v-reveal="(i % 3) * 90" class="reveal pcard">
          <span class="pcard__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path :d="ICONS[i]" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.body }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.privacy {
  overflow: hidden;
}
.privacy__glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  aspect-ratio: 1;
  background: radial-gradient(closest-side, rgba(52, 217, 160, 0.16), transparent);
  pointer-events: none;
}
.privacy__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--night-line);
  box-shadow: 0 0 0 1px var(--night-line);
}
.pcard {
  padding: 32px 28px;
  background: var(--night);
  transition: background-color 0.3s;
}
.pcard:hover {
  background: var(--night-2);
}
.pcard__icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(52, 217, 160, 0.1);
  color: var(--mint-bright);
}
.pcard__icon svg {
  width: 23px;
  height: 23px;
}
.pcard h3 {
  margin-top: 20px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.pcard p {
  margin-top: 10px;
  font-size: 15px;
  color: var(--night-muted);
}

@media (max-width: 960px) {
  .privacy__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .privacy__grid {
    grid-template-columns: 1fr;
  }
}
</style>
