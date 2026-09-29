// GSAP(ScrollTrigger·SplitText) 등록 + Lenis 부드러운 스크롤. 모션 줄이기 설정이면 Lenis·텍스트 분할을 끈다.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger, SplitText)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let lenis: Lenis | null = null
  if (!reduced) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis?.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
  }

  // 페이지 전환·웹폰트 로드 뒤 트리거 위치 다시 계산
  nuxtApp.hook('page:finish', () => {
    requestAnimationFrame(() => ScrollTrigger.refresh())
  })
  document.fonts?.ready.then(() => ScrollTrigger.refresh())

  // v-split: 줄 단위로 가려 두었다가 아래에서 올라오게. 템플릿에 data-split 속성을 함께 둔다(초기 깜빡임 방지 CSS).
  // 값: { delay?: number, immediate?: boolean } — immediate 면 스크롤 트리거 없이 바로 재생(히어로)
  type SplitOpts = { delay?: number; immediate?: boolean } | undefined
  const splits = new WeakMap<HTMLElement, SplitText>()
  nuxtApp.vueApp.directive<HTMLElement, SplitOpts>('split', {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      if (reduced) {
        el.classList.add('split-ready')
        return
      }
      const opts = binding.value ?? {}
      const run = () => {
        // CSS 로 숨긴 줄바꿈(<br class="pc">)은 SplitText 가 강제 줄바꿈으로 취급하므로 공백으로 바꾼다
        el.querySelectorAll('br').forEach((br) => {
          if (getComputedStyle(br).display === 'none') br.replaceWith(' ')
        })
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit(self) {
            el.classList.add('split-ready')
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.2,
              ease: 'expo.out',
              stagger: 0.09,
              delay: opts.delay ?? 0,
              scrollTrigger: opts.immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
            })
          },
        })
        splits.set(el, split)
      }
      if (document.fonts?.status === 'loaded') run()
      else document.fonts.ready.then(run)
    },
    beforeUnmount(el) {
      splits.get(el)?.revert()
      splits.delete(el)
    },
  })

  return { provide: { lenis, gsap } }
})
