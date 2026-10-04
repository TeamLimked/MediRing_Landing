import type { WaitlistVariant } from '~/data/waitlist'

// 메시지 테스트 페이지의 방문·신청 기록. 보내는 곳은 NUXT_PUBLIC_WAITLIST_ENDPOINT(Google Apps Script 웹 앱 — scripts/waitlist-apps-script.gs).
// - 방문(view)·버튼(cta)은 개인정보 없이 무작위 세션 id·변형·utm 만 보낸다(쿠키 없음, 세션당 한 번).
// - Apps Script 는 CORS 응답 헤더를 주지 않으므로 no-cors(text/plain) 로 보내고 응답 본문은 읽지 않는다 — 네트워크 오류만 실패로 본다.
// - 엔드포인트가 비어 있으면(로컬·미설정) 아무것도 보내지 않고, 페이지는 신청을 받지 않는다고 안내한다.

export type SignupFields = { email: string; who: string; count: string; interview: boolean }

const SID_KEY = 'mediring_try_sid'

function storage(): Storage | null {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function randomId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
  }
}

function sessionId(): string {
  const store = storage()
  try {
    const existing = store?.getItem(SID_KEY)
    if (existing) return existing
    const id = randomId()
    store?.setItem(SID_KEY, id)
    return id
  } catch {
    return randomId()
  }
}

// 세션당 한 번만(새로고침·뒤로가기로 방문이 부풀지 않게)
function firstTime(key: string): boolean {
  const store = storage()
  try {
    if (store?.getItem(key)) return false
    store?.setItem(key, '1')
  } catch {
    // 저장소를 못 쓰면 매번 보낸다 — 세션 id 로 시트에서 다시 센다
  }
  return true
}

export function useWaitlist(variant: WaitlistVariant) {
  const { public: pub } = useRuntimeConfig()
  const endpoint = String(pub.waitlistEndpoint || '').trim()

  // 주소창에서 바로 읽는다 — 정적 생성 페이지는 하이드레이션 직후(onMounted) route.query 가 아직 비어 있어 첫 방문의 utm 이 빠졌다
  const utm = () => {
    const params = new URLSearchParams(window.location.search)
    const q = (k: string) => (params.get(k) ?? '').slice(0, 64)
    return { utm_source: q('utm_source'), utm_medium: q('utm_medium'), utm_campaign: q('utm_campaign') }
  }

  async function send(event: 'view' | 'cta' | 'signup', data: Record<string, string | boolean> = {}): Promise<boolean> {
    if (!endpoint || !import.meta.client) return false
    const body = JSON.stringify({ event, variant, sid: sessionId(), ...utm(), ...data })
    try {
      await fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body, keepalive: true })
      return true
    } catch {
      return false
    }
  }

  return {
    enabled: Boolean(endpoint),
    trackView: () => (firstTime(`mediring_try_view_${variant}`) ? send('view') : Promise.resolve(false)),
    trackCta: () => (firstTime(`mediring_try_cta_${variant}`) ? send('cta') : Promise.resolve(false)),
    signup: (fields: SignupFields) => send('signup', { ...fields, email: fields.email.trim().toLowerCase() }),
  }
}
