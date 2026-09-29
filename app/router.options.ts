import type { RouterConfig } from '@nuxt/schema'

// 다른 페이지(약관 등)에서 /#section 으로 올 때 새 페이지가 그려진 뒤 해당 섹션으로 스크롤한다.
// 기본 동작은 페이지 전환 타이밍에 따라 맨 위에 머무는 경우가 있어 직접 처리한다.
function headerOffset() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  return (parseInt(v, 10) || 68) + 12
}

function waitFor(selector: string, timeout = 3000): Promise<Element | null> {
  return new Promise((resolve) => {
    const start = performance.now()
    const tick = () => {
      const el = document.querySelector(selector)
      if (el || performance.now() - start > timeout) return resolve(el)
      requestAnimationFrame(tick)
    }
    tick()
  })
}

export default <RouterConfig>{
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      const samePage = to.path === from.path
      if (!samePage) {
        const nuxtApp = useNuxtApp()
        await new Promise<void>((resolve) => nuxtApp.hooks.hookOnce('page:finish', () => resolve()))
      }
      let el: Element | null = null
      try {
        el = await waitFor(decodeURIComponent(to.hash))
      } catch {
        el = null
      }
      if (el) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        return { el: to.hash, top: headerOffset(), behavior: samePage && !reduced ? 'smooth' : 'auto' }
      }
    }
    return { top: 0 }
  },
}
