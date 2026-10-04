<script setup lang="ts">
import { countOptions, disclaimer, overseasItems, pharmacistOffer, pharmacistOptions, privacyItems, variants, whoOptions, type WaitlistVariant } from '~/data/waitlist'

// 메시지 테스트 페이지 — /try/a · /try/b 가 같은 화면에 문구만 바꿔 쓴다(사이트 머리·꼬리 없이 가볍게: three.js·GSAP 안 씀).
const props = defineProps<{ variant: WaitlistVariant }>()

const copy = computed(() => variants[props.variant])
const links = useSiteLinks()
const { public: pub } = useRuntimeConfig()
const overseas = String(pub.waitlistStorage || 'google') === 'google'
// 개인정보를 받는 사람이 드러나게 — 대표자(NUXT_PUBLIC_COMPANY_REPRESENTATIVE)가 있으면 함께 적는다(비어 있으면 자리표시자 대신 이름만)
const representative = String(pub.company?.representative ?? '').trim()
const operator = representative ? `${links.company.name}(대표 ${representative})` : links.company.name
const waitlist = useWaitlist(props.variant)

useHead(() => ({
  title: copy.value.pageTitle,
  meta: [
    { name: 'robots', content: 'noindex' }, // 실험 페이지는 검색에 노출하지 않는다
    { name: 'description', content: copy.value.lead },
    { property: 'og:title', content: copy.value.title.replace(/\n/g, ' ') },
    { property: 'og:description', content: copy.value.lead },
  ],
  htmlAttrs: { class: 'try-root' },
  bodyAttrs: { class: 'try-body' },
}))

const email = ref('')
const who = ref('')
const count = ref('')
const pharmacist = ref('')
const interview = ref(false)
const agreePrivacy = ref(false)
const agreeOverseas = ref(false)
const website = ref('') // 봇 걸러내기(사람에게는 보이지 않는 칸)
const state = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const doneRef = ref<HTMLElement | null>(null)

// 하이드레이션이 끝난 뒤에 센다 — 그 사이 라우터가 잠깐 주소에서 쿼리를 뺐다 되돌려(replaceState) onMounted 에서는 utm 이 빠졌다
onNuxtReady(() => {
  void waitlist.trackView()
})

async function submit() {
  if (state.value === 'sending') return
  if (website.value) {
    state.value = 'done'
    return
  }
  state.value = 'sending'
  const ok = await waitlist.signup({ email: email.value, who: who.value, count: count.value, pharmacist: pharmacist.value, interview: interview.value })
  state.value = ok ? 'done' : 'error'
  if (ok) {
    await nextTick()
    doneRef.value?.focus()
  }
}
</script>

<template>
  <div class="try">
    <div class="try__wrap">
      <header class="try__top">
        <AppLogo :size="28" />
      </header>

      <section class="try__hero" aria-labelledby="try-title">
        <p class="try__eyebrow">{{ copy.eyebrow }}</p>
        <h1 id="try-title" class="try__title">{{ copy.title }}</h1>
        <p class="try__lead">{{ copy.lead }}</p>
        <a class="try__cta" href="#signup" @click="waitlist.trackCta()">출시 알림 받기</a>
        <p class="try__trust">{{ copy.trust }}</p>
      </section>

      <section class="try__card" :aria-label="`${copy.example.heading} 예시`">
        <p class="try__card-head">{{ copy.example.heading }} <span class="try__tag">예시</span></p>
        <ul class="try__rows">
          <li v-for="row in copy.example.rows" :key="row.label" class="try__row">
            <div class="try__row-main">
              <span class="try__row-label">{{ row.label }}</span>
              <span class="try__chip" :data-tone="row.tone">{{ row.status }}</span>
            </div>
            <p v-if="row.detail" class="try__row-detail">{{ row.detail }}</p>
          </li>
        </ul>
        <p class="try__card-note">{{ copy.example.note }}</p>
      </section>

      <section class="try__points" aria-label="할 수 있는 일">
        <article v-for="(point, i) in copy.points" :key="point.title" class="try__point">
          <span class="try__num" aria-hidden="true">{{ i + 1 }}</span>
          <div>
            <h2 class="try__point-title">{{ point.title }}</h2>
            <p class="try__point-body">{{ point.body }}</p>
          </div>
        </article>
      </section>

      <section id="signup" class="try__form-wrap" aria-labelledby="signup-title">
        <h2 id="signup-title" class="try__form-title">출시 알림 받기</h2>
        <p class="try__form-sub">출시되면 이메일로 한 번만 알려 드려요.</p>

        <div v-if="state === 'done'" ref="doneRef" class="try__done" role="status" tabindex="-1">
          <p class="try__done-title">신청됐어요. 고맙습니다!</p>
          <p>출시되면 이 이메일로 알려 드릴게요.<template v-if="interview"> 인터뷰 일정은 이메일로 따로 여쭤볼게요.</template></p>
        </div>

        <p v-else-if="!waitlist.enabled" class="try__closed" role="status">지금은 신청을 받지 않아요. 곧 다시 열게요.</p>

        <form v-else class="try__form" novalidate @submit.prevent="($event.target as HTMLFormElement).reportValidity() && submit()">
          <label class="try__field">
            <span class="try__label">이메일</span>
            <input v-model="email" class="try__input" type="email" name="email" autocomplete="email" inputmode="email" required maxlength="120" placeholder="name@example.com" />
          </label>

          <fieldset class="try__fieldset">
            <legend class="try__label">누구의 약·영양제를 챙기세요?</legend>
            <div class="try__options">
              <label v-for="option in whoOptions" :key="option" class="try__option">
                <input v-model="who" type="radio" name="who" :value="option" required />
                <span>{{ option }}</span>
              </label>
            </div>
          </fieldset>

          <fieldset class="try__fieldset">
            <legend class="try__label">챙기시는 약·영양제는 모두 몇 가지쯤인가요?</legend>
            <div class="try__options">
              <label v-for="option in countOptions" :key="option" class="try__option">
                <input v-model="count" type="radio" name="count" :value="option" required />
                <span>{{ option }}</span>
              </label>
            </div>
          </fieldset>

          <fieldset class="try__fieldset">
            <legend class="try__label">약사 점검 <span class="try__soon">출시 예정 · 1회 {{ pharmacistOffer.price }}</span></legend>
            <p class="try__hint">{{ pharmacistOffer.text }} 지금은 결제하지 않아요.</p>
            <p class="try__question">{{ pharmacistOffer.question }}</p>
            <div class="try__options try__options--three">
              <label v-for="option in pharmacistOptions" :key="option" class="try__option">
                <input v-model="pharmacist" type="radio" name="pharmacist" :value="option" required />
                <span>{{ option }}</span>
              </label>
            </div>
          </fieldset>

          <label class="try__check">
            <input v-model="interview" type="checkbox" name="interview" />
            <span>(선택) 30분 화상·전화 인터뷰에 참여할 수 있어요. 참여해 주신 분께는 작은 감사 선물을 드려요.</span>
          </label>

          <div class="try__consent">
            <label class="try__check">
              <input v-model="agreePrivacy" type="checkbox" name="agree_privacy" required />
              <span>[필수] 개인정보 수집·이용에 동의해요.</span>
            </label>
            <details class="try__details">
              <summary>자세히 보기</summary>
              <dl>
                <template v-for="item in privacyItems(operator)" :key="item.label">
                  <dt>{{ item.label }}</dt>
                  <dd>{{ item.value }}</dd>
                </template>
              </dl>
            </details>

            <template v-if="overseas">
              <label class="try__check">
                <input v-model="agreeOverseas" type="checkbox" name="agree_overseas" required />
                <span>[필수] 개인정보 국외 이전(Google 스프레드시트 보관)에 동의해요.</span>
              </label>
              <details class="try__details">
                <summary>자세히 보기</summary>
                <dl>
                  <template v-for="item in overseasItems" :key="item.label">
                    <dt>{{ item.label }}</dt>
                    <dd>{{ item.value }}</dd>
                  </template>
                </dl>
              </details>
            </template>
          </div>

          <div class="try__hp" aria-hidden="true">
            <label>웹사이트 <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" /></label>
          </div>

          <button class="try__submit" type="submit" :disabled="state === 'sending'">
            {{ state === 'sending' ? '보내는 중…' : '알림 신청하기' }}
          </button>
          <p v-if="state === 'error'" class="try__error" role="alert">보내지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.</p>
        </form>
      </section>

      <footer class="try__foot">
        <p>{{ disclaimer }}</p>
        <p>운영: {{ operator }} · 개인정보 문의 <a :href="`mailto:${links.company.privacyEmail}`">{{ links.company.privacyEmail }}</a></p>
      </footer>
    </div>
  </div>
</template>

<style>
/* 사이트 기본(어두운 배경)을 이 페이지에서만 바꾼다 */
html.try-root {
  background: #f5f6f2;
  scroll-padding-top: 16px;
}
html.try-root body.try-body {
  background: #f5f6f2;
}
@media (prefers-color-scheme: dark) {
  html.try-root,
  html.try-root body.try-body {
    background: #0f1311;
  }
}
</style>

<style scoped>
.try {
  --t-bg: #f5f6f2;
  --t-card: #ffffff;
  --t-ink: #16201b;
  --t-muted: #4e5a53;
  --t-line: #dde3de;
  --t-control: #87938c;
  --t-accent: #0a775a;
  --t-accent-ink: #ffffff;
  --t-accent-soft: #e3f1eb;
  --t-caution-ink: #8a5a00;
  --t-caution-bg: #fff3d6;
  --t-low-ink: #2f5f8a;
  --t-low-bg: #e6f0fa;
  --t-error: #b3261e;
  min-height: 100vh;
  background: var(--t-bg);
  color: var(--t-ink);
  font-size: 17px;
  line-height: 1.7;
}
@media (prefers-color-scheme: dark) {
  .try {
    --t-bg: #0f1311;
    --t-card: #171d1a;
    --t-ink: #eef3f0;
    --t-muted: #a9b5ae;
    --t-line: #2a332e;
    --t-control: #6f7b74;
    --t-accent: #4fc79e;
    --t-accent-ink: #062218;
    --t-accent-soft: rgba(79, 199, 158, 0.14);
    --t-caution-ink: #f2c26b;
    --t-caution-bg: rgba(242, 194, 107, 0.12);
    --t-low-ink: #8cc4f2;
    --t-low-bg: rgba(140, 196, 242, 0.12);
    --t-error: #ff8a80;
  }
}
.try :focus-visible {
  outline: 3px solid var(--t-accent);
  outline-offset: 3px;
}
.try__wrap {
  max-width: 640px;
  margin: 0 auto;
  padding: 20px 16px 48px;
}
.try__top {
  padding: 4px 0 28px;
}
.try__eyebrow {
  color: var(--t-accent);
  font-weight: 700;
  font-size: 15px;
}
.try__title {
  margin-top: 8px;
  font-size: clamp(30px, 8vw, 44px);
  line-height: 1.25;
  letter-spacing: -0.03em;
  font-weight: 800;
  white-space: pre-line; /* 제목 줄바꿈은 문구의 \n 으로 정한다 — 한국어는 text-wrap: balance 가 '한 / 장으로'처럼 끊기도 한다 */
}
.try__lead {
  margin-top: 16px;
  color: var(--t-muted);
  font-size: 18px;
  text-wrap: pretty;
}
.try__cta,
.try__submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 24px;
  border: 0;
  border-radius: 14px;
  background: var(--t-accent);
  color: var(--t-accent-ink);
  font-weight: 700;
  font-size: 18px;
}
.try__cta {
  margin-top: 24px;
  width: 100%;
}
.try__trust {
  margin-top: 12px;
  color: var(--t-muted);
  font-size: 15px;
  text-align: center;
}
.try__card {
  margin-top: 36px;
  padding: 20px;
  border-radius: 20px;
  background: var(--t-card);
  border: 1px solid var(--t-line);
}
.try__card-head {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.try__tag {
  font-size: 13px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--t-accent-soft);
  color: var(--t-accent);
}
.try__rows {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
}
.try__row {
  padding: 12px 0;
  border-top: 1px solid var(--t-line);
}
.try__row-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.try__row-label {
  font-weight: 600;
}
.try__chip {
  flex: none;
  font-size: 14px;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 8px;
}
.try__chip[data-tone='ok'] {
  background: var(--t-accent-soft);
  color: var(--t-accent);
}
.try__chip[data-tone='caution'] {
  background: var(--t-caution-bg);
  color: var(--t-caution-ink);
}
.try__chip[data-tone='low'] {
  background: var(--t-low-bg);
  color: var(--t-low-ink);
}
.try__row-detail {
  margin-top: 4px;
  color: var(--t-muted);
  font-size: 15px;
}
.try__card-note {
  margin-top: 8px;
  color: var(--t-muted);
  font-size: 14px;
}
.try__points {
  margin-top: 36px;
  display: grid;
  gap: 20px;
}
.try__point {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 12px;
}
.try__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--t-accent-soft);
  color: var(--t-accent);
  font-weight: 800;
}
.try__point-title {
  font-size: 19px;
  font-weight: 700;
}
.try__point-body {
  margin-top: 4px;
  color: var(--t-muted);
}
.try__form-wrap {
  margin-top: 44px;
  padding: 24px 20px;
  border-radius: 20px;
  background: var(--t-card);
  border: 1px solid var(--t-line);
}
.try__form-title {
  font-size: 24px;
  font-weight: 800;
}
.try__form-sub {
  margin-top: 4px;
  color: var(--t-muted);
}
.try__form {
  margin-top: 20px;
  display: grid;
  gap: 22px;
}
.try__field {
  display: grid;
  gap: 8px;
}
.try__label {
  font-weight: 700;
  padding: 0;
}
.try__input {
  min-height: 52px;
  padding: 0 14px;
  border: 1px solid var(--t-control);
  border-radius: 14px;
  background: var(--t-card);
  color: var(--t-ink);
  font: inherit;
}
.try__fieldset {
  margin: 0;
  padding: 0;
  border: 0;
  min-width: 0;
}
.try__options {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.try__option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 12px;
  border: 1px solid var(--t-control);
  border-radius: 12px;
  cursor: pointer;
}
.try__options--three {
  grid-template-columns: 1fr; /* '가격에 따라'가 휴대폰 폭 3칸에는 들어가지 않는다 */
}
.try__soon {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 8px;
  border-radius: 4px;
  background: var(--t-accent-soft);
  color: var(--t-accent);
  font-size: 14px;
  font-weight: 700;
}
.try__hint {
  margin-top: 6px;
  color: var(--t-muted);
  font-size: 15px;
}
.try__question {
  margin-top: 8px;
  font-weight: 600;
}
.try__option:has(input:checked) {
  border-color: var(--t-accent);
  background: var(--t-accent-soft);
  font-weight: 700;
}
.try__option input,
.try__check input {
  width: 20px;
  height: 20px;
  flex: none;
  accent-color: var(--t-accent);
}
.try__check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}
.try__check input {
  margin-top: 4px;
}
.try__consent {
  display: grid;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--t-line);
}
.try__details {
  margin-left: 30px;
  color: var(--t-muted);
  font-size: 15px;
}
.try__details summary {
  cursor: pointer;
  min-height: 32px;
}
.try__details dl {
  margin: 8px 0 4px;
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 4px 12px;
}
.try__details dt {
  font-weight: 700;
}
.try__details dd {
  margin: 0;
}
.try__hp {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.try__submit {
  width: 100%;
}
.try__submit:disabled {
  opacity: 0.7;
  cursor: progress;
}
.try__error {
  color: var(--t-error);
  font-weight: 600;
}
.try__done,
.try__closed {
  margin-top: 20px;
  padding: 16px;
  border-radius: 14px;
  background: var(--t-accent-soft);
}
.try__done-title {
  font-weight: 800;
  font-size: 19px;
}
.try__foot {
  margin-top: 36px;
  display: grid;
  gap: 6px;
  color: var(--t-muted);
  font-size: 14px;
}
.try__foot a {
  text-decoration: underline;
}
@media (min-width: 560px) {
  .try__cta {
    width: auto;
  }
  .try__trust {
    text-align: left;
  }
  .try__options {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .try__options--three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
