import { legalDocs, resolveCompany, type LegalSlug } from '~/data/legal'

// 스토어·약관 링크와 회사 정보. 스토어 URL 이 비어 있으면 "출시 예정" 으로 취급한다.
export function useSiteLinks() {
  const { public: pub } = useRuntimeConfig()
  return {
    appStore: String(pub.appStoreUrl || ''),
    playStore: String(pub.playStoreUrl || ''),
    legal: (doc: LegalSlug) => `/legal/${doc}`,
    support: '/support',
    docs: legalDocs,
    company: resolveCompany(pub.company ?? {}),
    legalDraft: pub.company?.legalDraft !== false && String(pub.company?.legalDraft) !== 'false',
  }
}
