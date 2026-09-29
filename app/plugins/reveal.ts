// v-reveal: 요소가 화면에 들어오면 .is-visible 을 붙인다(템플릿에 class="reveal" 을 함께 둔다).
// 값은 지연(ms). html.js 가 없으면(= JS 미실행) CSS 가 처음부터 보이게 둔다.
export default defineNuxtPlugin((nuxtApp) => {
  let io: IntersectionObserver | null = null

  function observer() {
    io ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          io?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    return io
  }

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: () => ({}),
    mounted(el, binding) {
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      if (!('IntersectionObserver' in window)) {
        el.classList.add('is-visible')
        return
      }
      observer().observe(el)
    },
    beforeUnmount(el) {
      io?.unobserve(el)
    },
  })
})
