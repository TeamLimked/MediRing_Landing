import type { RouterConfig } from '@nuxt/schema'

// 해시 이동(/#safety 등): 새 페이지면 그려진 뒤, 같은 페이지면 바로 해당 섹션으로. 고정 헤더 높이만큼 띄운다.
function headerOffset() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--header-h')
  return (parseInt(v, 10) || 64) + 16
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
    const samePage = to.path === from.path
    if (!samePage) await new Promise<void>((resolve) => nuxtApp.hooks.hookOnce('page:finish', () => resolve()))
    if (savedPosition) return savedPosition

    if (to.hash) {
      const el = await waitFor(decodeURIComponent(to.hash))
      if (el) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        return { el: to.hash, top: headerOffset(), behavior: samePage && !reduced ? 'smooth' : 'auto' }
      }
    }
    return { top: 0 }
  },
}
