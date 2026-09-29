import type { RouterConfig } from '@nuxt/schema'
import type Lenis from 'lenis'

// 해시 이동(/#safety 등): 새 페이지면 그려진 뒤, 같은 페이지면 바로 해당 섹션으로.
// Lenis 가 켜져 있으면 Lenis 로 스크롤해야 부드러운 스크롤 상태와 어긋나지 않는다.
function headerOffset() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  return parseInt(v, 10) || 94
}

function waitFor(selector: string, timeout = 3000): Promise<Element | null> {
  return new Promise((resolve) => {
    const start = performance.now()
    const tick = () => {
      let el: Element | null = null
      try {
        el = document.querySelector(selector)
      } catch {
        return resolve(null)
      }
      if (el || performance.now() - start > timeout) return resolve(el)
      requestAnimationFrame(tick)
    }
    tick()
  })
}

export default <RouterConfig>{
  async scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp()
    const lenis = nuxtApp.$lenis as Lenis | null
    const samePage = to.path === from.path

    if (!samePage) await new Promise<void>((resolve) => nuxtApp.hooks.hookOnce('page:finish', () => resolve()))

    lenis?.resize()
    if (savedPosition) {
      lenis?.scrollTo(savedPosition.top, { immediate: true, force: true })
      return savedPosition
    }

    if (to.hash) {
      const el = await waitFor(decodeURIComponent(to.hash))
      if (el) {
        if (lenis) {
          // 페이지가 바뀌면 문서 높이가 달라지므로 Lenis 의 스크롤 한계를 먼저 다시 잰다.
          // 헤더 높이만큼의 여백은 Lenis 가 html 의 scroll-padding-top 을 읽어 반영한다(따로 offset 을 주지 않음).
          lenis.resize()
          lenis.scrollTo(el as HTMLElement, { immediate: !samePage, force: true })
          return false
        }
        return { el: to.hash, top: headerOffset(), behavior: samePage ? 'smooth' : 'auto' }
      }
    }
    lenis?.scrollTo(0, { immediate: true, force: true })
    return { top: 0 }
  },
}
