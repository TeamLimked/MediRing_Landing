// 메시지 테스트 페이지(/try/a · /try/b) 문구 — 출시 전 사전 신청으로 어느 쪽 메시지가 더 먹히는지 본다.
// - 두 페이지는 구성·폼·디자인이 같고 메시지만 다르다(a: 지금 포지셔닝 '내 영양제 분석', b: '부모님 약통 정리').
// - 표현 원칙은 content.ts 와 같다(MediRing_Interface/docs/compliance.md): 의료 효능 표현 금지, "위험" 대신 "주의", 최상급 금지.
// - 예시 카드의 수치·문구는 실제 규칙과 같다(마그네슘 상한 350 mg — 2025 KDRI, 홍삼 주의사항 — 식약처 원문).

export type WaitlistVariant = 'a' | 'b'

export type ExampleRow = { label: string; tone: 'ok' | 'caution' | 'low'; status: string; detail?: string }

export type VariantCopy = {
  pageTitle: string
  eyebrow: string
  title: string
  lead: string
  trust: string
  points: { title: string; body: string }[]
  example: { heading: string; rows: ExampleRow[]; note: string }
}

export const variants: Record<WaitlistVariant, VariantCopy> = {
  a: {
    pageTitle: '내 영양제, 제대로 먹고 있을까요? — MediRing',
    eyebrow: '개인 맞춤 영양 가이드',
    title: '내 영양제,\n제대로 먹고 있을까요?',
    lead: '3분 컨디션 체크로 나에게 맞는 영양소를 찾고, 지금 먹는 영양제의 영양소를 모두 더해 2025 한국인 영양소 섭취기준과 비교해 드려요.',
    trust: '보건복지부 섭취기준과 식약처 공개 자료를 근거로 알려 드려요.',
    points: [
      { title: '3분 컨디션 체크', body: '잠·피로·스트레스 같은 문항에 답하면 나에게 맞는 영양소를 골라 드려요.' },
      { title: '영양제 합계 분석', body: '먹고 있는 영양제의 영양소를 모두 더해 권장량·상한섭취량과 비교해요. 많아요·적은 편·적정으로 한눈에 보여요.' },
      { title: '먼저 하는 안전 확인', body: '복용 중인 약·질환·알레르기와 함께 먹을 때 주의할 점을 추천보다 먼저 확인해요.' },
    ],
    example: {
      heading: '내 영양제 분석',
      rows: [
        { label: '비타민 D', tone: 'ok', status: '적정' },
        { label: '마그네슘', tone: 'caution', status: '많아요', detail: '1일 합계 450 mg · 상한섭취량의 129%' },
        { label: '철분', tone: 'low', status: '적은 편', detail: '권장량의 40%' },
      ],
      note: '예시 화면이에요. 비교 기준은 내 성별·나이의 2025 한국인 영양소 섭취기준이에요.',
    },
  },
  b: {
    pageTitle: '부모님 약통, 한 장으로 정리해 드려요 — MediRing',
    eyebrow: '부모님 약통 정리',
    title: '부모님 약통,\n한 장으로 정리해 드려요',
    lead: '병원 약, 약국에서 산 약, 홈쇼핑 영양제까지 한곳에 모아 같이 드셔도 되는지 식약처 자료로 확인하고, 병원 갈 때 보여드릴 한 장으로 정리해요.',
    trust: '영양제를 팔지 않아요. 광고·제휴 링크 없이 정리만 도와드려요.',
    points: [
      { title: '찍으면 등록', body: '영양제는 상자의 바코드로, 약은 이름으로 찾아 등록해요.' },
      { title: '같이 드셔도 되는지', body: '약끼리는 식약처 DUR(병용금기·노인주의)로, 영양제와 약은 제품에 적힌 식약처 섭취 시 주의사항으로 확인해요.' },
      { title: '병원 갈 때 한 장', body: '지금 드시는 약·영양제, 함께 먹을 때 주의할 점, 복용 기록을 의사·약사에게 보여드릴 PDF로 만들어요.' },
    ],
    example: {
      heading: '부모님 약통 점검',
      rows: [
        { label: '6년근 홍삼정 + 당뇨약', tone: 'caution', status: '함께 먹을 때 주의', detail: '식약처 섭취 시 주의사항 “의약품(당뇨치료제, 혈액항응고제) 복용 시 섭취에 주의”' },
        { label: '칼슘 + 철분', tone: 'caution', status: '시간 나눠 드세요', detail: '2시간 이상 간격' },
        { label: '종합비타민 + 비타민 D', tone: 'ok', status: '중복 확인', detail: '합쳐도 상한섭취량 안쪽' },
      ],
      note: '예시 화면이에요. 드시던 약을 바꾸기 전에는 꼭 의사·약사와 상의하세요.',
    },
  },
}

// 폼 선택지 — 시트에 그대로 남는 값이라 한국어 그대로 보낸다
export const whoOptions = ['나', '부모님', '배우자·가족', '그 밖에'] as const
export const countOptions = ['1~3가지', '4~6가지', '7가지 이상', '잘 몰라요'] as const

export const disclaimer = 'MediRing은 진단·처방을 대신하지 않아요. 드시던 약을 바꾸거나 끊기 전에는 꼭 의사·약사와 상의하세요.'

// 개인정보 수집·이용 / 국외 이전 안내 — 보관처를 바꾸면(NUXT_PUBLIC_WAITLIST_STORAGE) 국외 이전 문구도 바꾼다
export function privacyItems(operator: string): { label: string; value: string }[] {
  return [
    { label: '수집하는 곳', value: operator },
    { label: '수집 항목', value: '이메일, 응답 내용(누구의 약을 챙기는지, 약·영양제 가짓수, 인터뷰 참여 의향)' },
    { label: '이용 목적', value: '출시 알림 1회 발송, 인터뷰 참여를 고른 경우 일정 연락' },
    { label: '보유 기간', value: '출시 알림을 보낸 뒤 바로 파기해요. 출시 전이라도 신청일로부터 1년이 지나면 파기해요.' },
    { label: '동의 거부', value: '동의하지 않을 수 있어요. 다만 그 경우 출시 알림을 받을 수 없어요.' },
  ]
}

export const overseasItems: { label: string; value: string }[] = [
  { label: '이전받는 곳', value: 'Google LLC (미국) — Google 스프레드시트' },
  { label: '이전 항목', value: '위 수집 항목 전부' },
  { label: '이전 일시·방법', value: '신청할 때 인터넷으로 전송' },
  { label: '목적·보유 기간', value: '신청 내용 보관, 위 보유 기간과 같아요' },
  { label: '동의 거부', value: '동의하지 않을 수 있어요. 다만 신청 내용을 보관할 수 없어 출시 알림을 받을 수 없어요.' },
]
