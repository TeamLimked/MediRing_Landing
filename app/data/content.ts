// 랜딩 문구·데이터. 표현 원칙(MediRing_Interface/docs/compliance.md):
// - 치료·완치·예방·진단·처방 등 의료적 효능 표현 금지, "위험도" 대신 "주의"
// - 기능성은 식약처 인정 기능성 원문 인용 원칙, 수치는 백엔드 문서에 있는 사실만

// Our standard — 카운트업 통계(근거: 백엔드 README·compliance.md·safety_rules.yml)
export const stats = [
  { to: 3, decimals: 0, prefix: '', suffix: '분', label: '컨디션 체크부터 첫 추천까지' },
  { to: 4.6, decimals: 1, prefix: '약 ', suffix: '만', label: '건강기능식품 품목 공공데이터' },
  { to: 372, decimals: 0, prefix: '', suffix: '', label: '수기 대조로 검증한 성인 섭취기준 값' },
  { to: 50, decimals: 0, prefix: '', suffix: '+', label: '복용약·질환·임신·알레르기 안전 규칙' },
]

export const sources = ['2025 한국인 영양소 섭취기준 · 보건복지부', '식품안전나라 건강기능식품 인정 기능성', '공공데이터포털 의약품 허가정보', 'NIH 영양보충제국(ODS)']

// ── 안전 점검 데모: MediRing_Interface/db/reference/safety_rules.yml 의 실제 규칙 일부 ──
export type Severity = 'block' | 'caution' | 'info'

export type Nutrient = { key: string; name: string; hue: string }

export const demoNutrients: Nutrient[] = [
  { key: 'vitamin_d', name: '비타민 D', hue: '#F5A623' },
  { key: 'omega_3', name: '오메가-3', hue: '#6D8BFF' },
  { key: 'magnesium', name: '마그네슘', hue: '#22B8CF' },
  { key: 'calcium', name: '칼슘', hue: '#12C4B0' },
  { key: 'iron', name: '철분', hue: '#EF5566' },
  { key: 'vitamin_k', name: '비타민 K', hue: '#10B981' },
  { key: 'vitamin_e', name: '비타민 E', hue: '#FF8A3D' },
  { key: 'vitamin_a', name: '비타민 A', hue: '#A06CD5' },
]

export type DemoRule = { nutrient: string | null; severity: Severity; message: string; source: string }

export type DemoTrigger = { key: string; label: string; group: '복용약' | '질환' | '생애주기' | '알레르기'; rules: DemoRule[] }

export const demoTriggers: DemoTrigger[] = [
  {
    key: 'warfarin',
    label: '와파린(항응고제)',
    group: '복용약',
    rules: [
      {
        nutrient: 'vitamin_k',
        severity: 'block',
        message:
          '와파린 복용 중에는 비타민 K 섭취량 변화가 약효(INR)에 영향을 줄 수 있어요. 비타민 K 보충제는 담당 의사와 상의 없이 시작하거나 끊지 마세요.',
        source: 'NIH ODS Vitamin K Fact Sheet',
      },
      {
        nutrient: 'omega_3',
        severity: 'caution',
        message: '항응고제·항혈소판제 복용 중에는 고용량 오메가-3가 출혈 경향을 높일 수 있어요. 섭취 전 의사·약사와 상의하세요.',
        source: 'NIH ODS Omega-3 Fatty Acids Fact Sheet',
      },
      {
        nutrient: 'vitamin_e',
        severity: 'caution',
        message: '비타민 E 보충제는 항응고·항혈소판 효과를 높여 출혈 위험을 키울 수 있어요. 섭취 전 의사와 상의하세요.',
        source: 'NIH ODS Vitamin E Fact Sheet',
      },
    ],
  },
  {
    key: 'levothyroxine',
    label: '갑상선호르몬제',
    group: '복용약',
    rules: [
      {
        nutrient: 'calcium',
        severity: 'caution',
        message: '칼슘은 갑상선호르몬제(레보티록신) 흡수를 방해할 수 있어요. 함께 드실 경우 최소 4시간 간격을 두세요.',
        source: 'NIH ODS Calcium Fact Sheet',
      },
      {
        nutrient: 'iron',
        severity: 'caution',
        message: '철분은 갑상선호르몬제(레보티록신) 흡수를 줄일 수 있어요. 최소 4시간 간격을 두고 드세요.',
        source: 'NIH ODS Iron Fact Sheet',
      },
      {
        nutrient: 'magnesium',
        severity: 'caution',
        message: '마그네슘은 갑상선호르몬제(레보티록신) 흡수를 줄일 수 있어요. 최소 4시간 간격을 두고 드세요.',
        source: 'NIH ODS Magnesium Fact Sheet',
      },
    ],
  },
  {
    key: 'kidney',
    label: '신장 질환',
    group: '질환',
    rules: [
      {
        nutrient: 'magnesium',
        severity: 'block',
        message: '신장 기능이 떨어지면 마그네슘 보충제로 고마그네슘혈증이 생길 수 있어요. 의사 지시 없이 드시지 마세요.',
        source: 'NIH ODS Magnesium Fact Sheet',
      },
      {
        nutrient: 'vitamin_d',
        severity: 'caution',
        message: '신장 질환이 있으면 비타민 D 대사가 달라져요. 보충 여부와 용량은 담당의와 정하세요.',
        source: 'NIH ODS Vitamin D Fact Sheet',
      },
      {
        nutrient: null,
        severity: 'caution',
        message: '신장 질환이 있으면 무기질·비타민이 몸에서 빠져나가는 방식이 달라져요. 모든 영양제는 담당 의사와 상의 후 드세요.',
        source: 'NIH ODS',
      },
    ],
  },
  {
    key: 'pregnant',
    label: '임신 중',
    group: '생애주기',
    rules: [
      {
        nutrient: 'vitamin_a',
        severity: 'caution',
        message:
          '임신 중 레티놀(기성 비타민 A) 고용량은 태아 기형 위험이 있어요. 상한섭취량 3,000 μg RAE를 넘지 않도록 하고, 원료가 베타카로틴인지 확인하세요.',
        source: '2025 한국인 영양소 섭취기준 · NIH ODS',
      },
      {
        nutrient: null,
        severity: 'caution',
        message: '임신 중에는 모든 건강기능식품을 산부인과 의사·약사와 상의한 뒤 드세요.',
        source: '2025 한국인 영양소 섭취기준',
      },
    ],
  },
  {
    key: 'fish_allergy',
    label: '생선 알레르기',
    group: '알레르기',
    rules: [
      {
        nutrient: 'omega_3',
        severity: 'caution',
        message: '생선 알레르기가 있다면 어유(생선 기름) 원료 오메가-3 제품을 피하고 원재료를 꼭 확인하세요.',
        source: 'NIH ODS Omega-3 Fatty Acids Fact Sheet',
      },
    ],
  },
]

export const faqs = [
  {
    q: '메디링이 병원 진료나 약사 상담을 대신하나요?',
    a: '아니요. 메디링은 영양 정보와 생활 루틴을 돕는 서비스이며 의료기기가 아니에요. 질병의 진단·치료를 대신하지 않으니, 복용 중인 약이 있거나 치료 중이라면 반드시 의사·약사와 상의해 주세요.',
  },
  {
    q: '추천은 어떤 기준으로 만들어지나요?',
    a: '보건복지부 「2025 한국인 영양소 섭취기준」, 식약처 건강기능식품 인정 기능성 데이터, 문진 응답 규칙을 기본으로 하고, 비슷한 사용자의 익명 집계(최소 5명 이상)와 섭취 기록을 함께 반영해요. 안전 규칙에 걸린 영양소는 추천 순위에서 제외돼요.',
  },
  {
    q: '안전 규칙은 누가 관리하나요?',
    a: '규칙은 NIH 영양보충제국(ODS) 전문가용 자료와 2025 한국인 영양소 섭취기준을 출처로 만들고, 전문가 검수 워크플로를 거쳐 승인해요. 검수 전이라도 경고를 더 많이 보여주는 쪽으로 적용해요.',
  },
  {
    q: 'AI 기능을 쓰지 않아도 되나요?',
    a: '네. AI 기능은 국외이전에 따로 동의한 경우에만 동작하고, 동의하지 않아도 추천·안전 점검·섭취 체크 등 핵심 기능은 모두 이용할 수 있어요. AI가 만든 문장에는 항상 “AI” 표시가 붙어요.',
  },
  {
    q: '무료로 쓸 수 있나요?',
    a: '가입과 핵심 기능(컨디션 체크, 안전 점검을 거친 맞춤 추천, 영양소 도감, 섭취 체크·리마인더)은 무료예요. AI 상세 추천 근거·주간 코칭 리포트는 프리미엄 멤버십이며, 가격과 자동 갱신·해지 방법은 App Store·Google Play 결제 화면에서 안내해요.',
  },
  {
    q: '메디링이 영양제를 팔거나 제휴 수수료를 받나요?',
    a: '아니요. 메디링은 영양제를 팔지 않고, 제휴(수수료) 링크와 제품 광고도 두지 않아요. 영양소를 추천하더라도 특정 제품 구매로 이어 드리지 않아요.',
  },
  {
    q: '탈퇴하면 제 건강 정보는 어떻게 되나요?',
    a: '탈퇴 즉시 건강 정보를 포함한 개인정보를 파기해요. 법령상 보관이 필요한 결제 기록만 개인을 알아볼 수 없도록 처리해 보관해요. 탈퇴 전에는 앱에서 전체 데이터를 내보낼 수 있어요.',
  },
]

// ── 시네마틱 리디자인 ─────────────────────────────────────────
// Our Principles(펼쳐지는 카드)
export const principles = [
  {
    key: 'safety',
    title: '안전 점검',
    body: '복용약·질환·임신·알레르기 규칙을 추천보다 먼저 대조하고, 피해야 할 영양소는 순위에서 제외합니다.',
    spec: '안전 규칙 50+ · 식약처 의약품 상호작용 · 상한섭취량',
    to: '/#safety',
    hue: '#3AD6D4',
  },
  {
    key: 'recommend',
    title: '맞춤 추천',
    body: '문진 규칙, 비슷한 사용자의 익명 집계(5명 이상), 실제 섭취 기록을 함께 반영합니다.',
    spec: '2025 한국인 영양소 섭취기준 · 식약처 인정 기능성',
    to: '/#features',
    hue: '#49D0E4',
  },
  {
    key: 'routine',
    title: '매일의 루틴',
    body: '오늘의 체크리스트와 맞춤 리마인더. 연결이 약한 곳에서도 기록은 끊기지 않아요.',
    spec: '오프라인 대기열 · 맞춤 리마인더 · 홈 화면 위젯',
    to: '/#features',
    hue: '#34D9A0',
  },
  {
    key: 'ai',
    title: 'AI 코칭',
    body: '동의한 경우에만, 비식별 최소 정보로 생성하고 금칙어·형식 검증을 거쳐 “AI” 표시와 함께 보여줍니다.',
    spec: '국외이전 선택 동의 · 문장 검증 · AI 표시',
    to: '/legal/overseas',
    hue: '#8FB8FF',
  },
  {
    key: 'privacy',
    title: '개인정보 보호',
    body: '건강 정보는 암호화해 저장하고, 탈퇴하면 즉시 파기합니다. 전체 데이터는 언제든 내보낼 수 있어요.',
    spec: 'AES-256-GCM · TLS · 관리자 MFA·감사 로그',
    to: '/legal/privacy',
    hue: '#FF9F5A',
  },
]

// What we do — 탭 + 슬라이드(비주얼은 FeatureVisual 의 kind)
export const featureTabs = [
  {
    key: 'safety',
    label: '안전 점검',
    slides: [
      { kind: 'meds', label: '복용약', caption: '복용약과 먼저 대조해요', to: '/#safety' },
      { kind: 'conditions', label: '질환·임신', caption: '질환·생애주기까지 살펴요', to: '/#safety' },
    ],
  },
  {
    key: 'recommend',
    label: '맞춤 추천',
    slides: [
      { kind: 'rank', label: '영양소 순위', caption: '나에게 맞는 영양소 순위', to: '/#principles' },
      { kind: 'evidence', label: '근거', caption: '근거를 함께 보여줘요', to: '/#numbers' },
    ],
  },
  {
    key: 'routine',
    label: '매일의 루틴',
    slides: [
      { kind: 'checklist', label: '섭취 체크', caption: '오늘의 체크리스트', to: '/#download' },
      { kind: 'reminder', label: '복용 알림', caption: '먹을 시각에 알려 드려요', to: '/#download' },
    ],
  },
] as const

export type FeatureKind = (typeof featureTabs)[number]['slides'][number]['kind']
