// v-split 은 클라이언트(motion.client.ts)에서만 동작한다. 서버 렌더링(프리렌더)에서는 속성 없이 통과시킨다.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('split', { getSSRProps: () => ({}) })
})
