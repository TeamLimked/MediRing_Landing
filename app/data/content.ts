// 랜딩 문구·데이터. 표현 원칙(MediRing_Interface/docs/compliance.md):
// - 치료·완치·예방·진단·처방 등 의료적 효능 표현 금지, "위험도" 대신 "주의"
// - 기능성은 식약처 인정 기능성 원문 인용 원칙, 수치는 백엔드 문서에 있는 사실만

export const stats = [
  { value: '3분', label: '컨디션 체크부터 첫 추천까지' },
  { value: '4.6만+', label: '건강기능식품 품목 공공데이터' },
  { value: '372', label: '수기 대조로 검증한 성인 섭취기준 값' },
  { value: '50+', label: '복용약·질환·임신·알레르기 안전 규칙' },
]

export const steps = [
  {
    no: '01',
    title: '3분 컨디션 체크',
    body: '기본 정보와 최근 컨디션을 5점 척도로 답하고, 복용 중인 약·영양제·질환·알레르기를 입력해요. 약 이름은 공공 의약품 데이터에서 검색해 고를 수 있어요.',
    tags: ['기본 정보', '컨디션 문항', '복용 약', '알레르기'],
  },
  {
    no: '02',
    title: '추천보다 먼저, 안전 점검',
    body: '임신·수유, 기저질환, 알레르기, 복용약 규칙과 식약처 의약품 상호작용 정보를 먼저 대조해요. 피해야 할 영양소는 순위에서 아예 제외하고, 중복 섭취·상한섭취량도 알려 드려요.',
    tags: ['제외', '주의', '참고'],
  },
  {
    no: '03',
    title: '맞춤 추천과 매일의 루틴',
    body: '문진 규칙, 비슷한 사용자 패턴(최소 5명 이상 익명 집계), 실제 섭취 기록을 함께 반영해 영양소와 제품을 추천해요. 오늘의 체크리스트로 루틴을 이어가세요.',
    tags: ['영양소', '제품', '체크리스트'],
  },
]

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

export const features = [
  {
    key: 'recommend',
    title: '근거가 보이는 맞춤 추천',
    body: '영양소마다 식약처 인정 기능성 원문, 2025 한국인 영양소 섭취기준(권장·충분·상한), 주의사항과 함께 먹으면 좋은 음식을 한 화면에 보여줘요.',
    accent: 'var(--accent)',
  },
  {
    key: 'intake',
    title: '끊기지 않는 섭취 체크',
    body: '오늘 먹을 영양제를 체크리스트로 관리해요. 지하철처럼 연결이 약한 곳에서 체크해도 기록은 대기열에 보관했다가 자동으로 동기화돼요.',
    accent: 'var(--spark)',
  },
  {
    key: 'coach',
    title: 'AI 코칭, 동의한 경우에만',
    body: '생성형 AI가 오늘의 코칭과 인사이트를 정리해요. 연령대·척도 같은 비식별 최소 정보만 쓰고, 모든 문장은 금칙어·형식 검증을 거친 뒤 “AI” 표시와 함께 노출돼요.',
    accent: 'var(--aqua)',
  },
  {
    key: 'catalog',
    title: '영양소 도감',
    body: '비타민·무기질·지방산·아미노산·프로바이오틱스까지 카테고리별로 기능성, 섭취기준, 관련 제품을 찾아볼 수 있어요.',
    accent: '#6D8BFF',
  },
  {
    key: 'reminder',
    title: '내 시간에 맞춘 리마인더',
    body: '섭취 리마인더 시간을 직접 정해요. 광고성 알림은 별도 동의가 있어야만 받고, 야간(21~08시)에는 따로 동의하지 않으면 보내지 않아요.',
    accent: '#FF6B9D',
  },
  {
    key: 'share',
    title: '가족과 결과 공유',
    body: '추천 결과를 링크로 공유할 수 있어요. 공유 화면에는 건강 정보 원문이 아닌 요약만 담겨요.',
    accent: '#12C4B0',
  },
]

export const gardenStages = [
  { key: 'seed', name: '씨앗', xp: 0, episode: '작은 씨앗을 심었어요. 매일의 영양 루틴이 이 아이를 키워요.' },
  { key: 'sprout', name: '새싹', xp: 40, episode: '새싹이 빼꼼 고개를 내밀었어요! 첫 잎이 돋았습니다.' },
  { key: 'seedling', name: '떡잎', xp: 90, episode: '떡잎 두 장이 활짝. 창가에 햇살이 들어오기 시작했어요.' },
  { key: 'leafy', name: '잎새', xp: 160, episode: '잎이 무성해졌어요. 방이 초록으로 물들어가요.' },
  { key: 'bud', name: '꽃봉오리', xp: 250, episode: '꽃봉오리가 맺혔어요. 곧 필 것 같아요!' },
  { key: 'bloom', name: '활짝', xp: 380, episode: '활짝 피었어요! 함께 만든 작은 정원이 완성됐어요.' },
]

export const privacyPoints = [
  { title: '민감정보 암호화', body: '질환·복용약 같은 건강 정보는 AES-256-GCM으로 암호화해 저장하고, 모든 통신은 TLS로 보호해요.' },
  { title: '별도 동의 원칙', body: '건강 정보 처리는 가입 시 별도 동의를 받고, 동의 버전과 이력을 함께 기록해요.' },
  { title: 'AI 국외이전은 선택', body: '해외 AI 모델은 따로 동의한 경우에만 호출해요. 동의하지 않아도 규칙 기반 추천은 그대로 쓸 수 있어요.' },
  { title: '내 데이터는 내 것', body: '앱에서 전체 데이터를 파일로 내보낼 수 있고, 탈퇴하면 즉시 파기해요.' },
  { title: '최소 수집·보존기한 파기', body: '입력 원문·AI 로그·분석 데이터는 정해진 보존기한이 지나면 자동으로 파기해요.' },
  { title: '성인 전용 서비스', body: '안전한 정보 제공을 위해 만 19세 이상 성인만 이용할 수 있어요.' },
]

export const plans = [
  {
    name: '기본',
    price: '무료',
    note: '가입만 하면 바로',
    items: ['3분 컨디션 체크', '안전 점검을 거친 맞춤 추천', '영양소 도감', '섭취 체크리스트·리마인더', '오늘의 AI 코칭(동의 시)', '루틴 정원'],
    highlighted: false,
  },
  {
    name: '프리미엄',
    price: '멤버십',
    note: '가격·혜택은 앱 스토어 결제 화면에서 확인',
    items: ['기본 기능 전체', 'AI 상세 추천 근거', '주간 코칭 리포트', '코칭 대시보드', 'App Store · Google Play 결제, 언제든 해지'],
    highlighted: true,
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
    q: '추천 제품 링크로 구매하면 메디링이 수익을 얻나요?',
    a: '일부 제품 링크는 제휴 링크이며, 구매 시 메디링이 수수료를 받을 수 있어요. 제휴 여부는 제품 목록 옆에 표시하고, 제휴 여부가 안전 점검이나 추천 순위에 영향을 주지는 않아요.',
  },
  {
    q: '탈퇴하면 제 건강 정보는 어떻게 되나요?',
    a: '탈퇴 즉시 건강 정보를 포함한 개인정보를 파기해요. 법령상 보관이 필요한 결제 기록만 개인을 알아볼 수 없도록 처리해 보관해요. 탈퇴 전에는 앱에서 전체 데이터를 내보낼 수 있어요.',
  },
]
