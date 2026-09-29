// 스토어·공개 웹 링크. 스토어 URL 이 비어 있으면 "출시 예정" 으로 취급한다.
export function useSiteLinks() {
  const { public: pub } = useRuntimeConfig()
  const web = String(pub.webBaseUrl || pub.siteUrl).replace(/\/$/, '')
  return {
    appStore: String(pub.appStoreUrl || ''),
    playStore: String(pub.playStoreUrl || ''),
    legal: (doc: 'terms' | 'privacy' | 'sensitive' | 'overseas' | 'marketing' | 'affiliate' | 'medical') => `${web}/legal/${doc}`,
    support: `${web}/support`,
  }
}
