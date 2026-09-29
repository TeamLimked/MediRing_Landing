// 약관·정책 문서. 원문 출처: MediRing_Interface/app/views/public_pages/legal/*.html.erb, support.html.erb
// ⚠ 문구를 여기서 새로 쓰지 않는다 — 백엔드 원문이 바뀌면 이 파일도 같이 맞춘다(앱·메일은 백엔드 페이지를 링크함).
// 회사 정보는 runtimeConfig.public.company(NUXT_PUBLIC_COMPANY_*)에서 받고, 비어 있으면 백엔드와 같은 자리표시자를 쓴다.

export type Company = {
  name: string
  representative: string
  businessNumber: string
  address: string
  privacyOfficer: string
  privacyEmail: string
  supportEmail: string
  policyVersion: string
}

export type LegalSlug = 'terms' | 'privacy' | 'sensitive' | 'overseas' | 'marketing' | 'medical' | 'affiliate'

type Ctx = { c: Company; link: (path: string) => string }

export type LegalDoc = {
  slug: LegalSlug
  title: string // 페이지 제목(백엔드 LEGAL_TITLES)
  nav: string // 목록·푸터 라벨
  heading: string // 본문 h1(백엔드 템플릿)
  showDate?: boolean
  html: (ctx: Ctx) => string
}

const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)

export function resolveCompany(raw: Partial<Record<keyof Company, unknown>>): Company {
  const v = (k: keyof Company, fallback: string) => esc(String(raw[k] ?? '').trim() || fallback)
  return {
    name: v('name', 'TeamLimked'),
    representative: v('representative', '(대표자명)'),
    businessNumber: v('businessNumber', '(사업자등록번호)'),
    address: v('address', '(사업장 주소)'),
    privacyOfficer: v('privacyOfficer', '(개인정보 보호책임자)'),
    privacyEmail: v('privacyEmail', 'privacy@mediring.io'),
    supportEmail: v('supportEmail', 'support@mediring.io'),
    policyVersion: v('policyVersion', '2026-09-28'),
  }
}

const table = (inner: string) => `<div class="table-wrap"><table>${inner}</table></div>`

export const legalDocs: LegalDoc[] = [
  {
    slug: 'terms',
    title: '서비스 이용약관',
    nav: '이용약관',
    heading: '서비스 이용약관',
    showDate: true,
    html: ({ c, link }) => `
<h2>제1조 (목적)</h2>
<p>이 약관은 ${c.name}(이하 "회사")가 제공하는 Mediring 서비스의 이용 조건과 절차, 회사와 회원의 권리·의무를 정합니다.</p>
<h2>제2조 (서비스의 성격)</h2>
<p>서비스는 이용자가 직접 입력한 정보를 바탕으로 일반적인 영양·생활 습관 정보를 제공하는 <strong>웰니스 서비스</strong>입니다. 질병의 진단·치료·예방을 위한 의료행위나 의료기기가 아니며, 의사·약사 등 전문가의 판단을 대신하지 않습니다(<a href="${link('/legal/medical')}">의료 면책 고지</a>).</p>
<h2>제3조 (회원가입)</h2>
<ul>
  <li>만 14세 이상만 가입할 수 있습니다. 건강기능식품 제품 정보는 만 19세 이상 성인에게만 제공합니다.</li>
  <li>가입 시 이용약관, 개인정보 수집·이용, 민감정보(건강정보) 처리, 만 14세 이상 확인에 동의해야 합니다.</li>
</ul>
<h2>제4조 (유료 서비스)</h2>
<ul>
  <li>프리미엄 구독은 Apple App Store 또는 Google Play 결제로 제공되며, 구매 화면에 가격·결제 주기·제공 내용을 표시합니다.</li>
  <li>구독은 해지하지 않으면 결제 주기마다 자동 갱신되며, 갱신 24시간 전까지 스토어 계정 설정에서 해지할 수 있습니다.</li>
  <li>청약 철회와 환불은 관련 법령과 각 스토어의 환불 정책에 따르며, 회사는 스토어 환불 결과를 반영해 권한을 조정합니다.</li>
</ul>
<h2>제5조 (제휴 링크)</h2>
<p>서비스에 표시되는 일부 구매 링크는 제휴 링크이며 구매 시 회사가 수수료를 받을 수 있습니다(<a href="${link('/legal/affiliate')}">제휴 고지</a>). 판매·배송·환불 책임은 판매처에 있습니다.</p>
<h2>제6조 (회원의 의무)</h2>
<ul>
  <li>타인의 정보를 도용하거나 허위 정보를 입력하지 않습니다.</li>
  <li>서비스를 자동화된 방법으로 수집·조작하거나 운영을 방해하지 않습니다.</li>
</ul>
<h2>제7조 (계약 해지)</h2>
<p>회원은 언제든 앱의 계정 삭제 기능으로 탈퇴할 수 있으며, 회사는 법령상 보관 대상을 제외한 정보를 지체 없이 파기합니다.</p>
<h2>제8조 (책임의 제한)</h2>
<p>회사는 이용자가 입력한 정보의 정확성, 이용자가 선택한 제품의 섭취 결과에 대해 책임지지 않습니다. 다만 회사의 고의 또는 중대한 과실로 인한 손해는 예외로 합니다.</p>
<h2>제9조 (분쟁 해결)</h2>
<p>분쟁은 대한민국 법을 따르며, 관할 법원은 민사소송법에 따릅니다. 문의: <a href="mailto:${c.supportEmail}">${c.supportEmail}</a></p>`,
  },
  {
    slug: 'privacy',
    title: '개인정보 처리방침',
    nav: '개인정보처리방침',
    heading: '개인정보 처리방침',
    showDate: true,
    html: ({ c }) => `
<p>${c.name}(이하 "회사")는 「개인정보 보호법」 등 관련 법령을 준수하며, Mediring 앱·웹(이하 "서비스") 이용자의 개인정보를 다음과 같이 처리합니다.</p>

<h2>1. 처리하는 개인정보 항목과 목적</h2>
${table(`
  <thead><tr><th>구분</th><th>항목</th><th>목적</th></tr></thead>
  <tbody>
  <tr><td>필수(회원가입)</td><td>이메일, 비밀번호(단방향 암호화), 출생연도, 만 14세 이상 확인·약관 동의 기록(일시·IP·기기 정보)</td><td>회원 식별, 계정 보안, 연령 확인, 동의 입증</td></tr>
  <tr><td>필수(민감정보, 별도 동의)</td><td>성별, 수면·스트레스·피로 자가보고 점수, 컨디션 문진 응답, 임신·수유 여부, 기저질환, 알레르기, 복용 중인 약, 복용 중인 영양제, 섭취 기록</td><td>맞춤 영양 정보 제공, 안전 확인(약물·질환 상호작용, 상한섭취량 안내), 비슷한 이용자 집단의 집계 통계를 활용한 추천 순위 산정(5명 미만 집단 미사용, 개인 식별 불가)</td></tr>
  <tr><td>자동 수집</td><td>접속 일시, IP 주소, 기기·OS·앱 버전, 푸시 알림 토큰, 서비스 이용 기록(화면 조회·클릭 등 이벤트)</td><td>서비스 제공·보안, 알림 발송, 품질 개선(건강정보는 분석 이벤트에 포함하지 않음)</td></tr>
  <tr><td>선택</td><td>광고성 정보 수신 동의 여부(야간 포함), AI 기능 국외이전 동의 여부</td><td>혜택 안내, AI 코칭·설명 기능 제공</td></tr>
  <tr><td>유료 서비스</td><td>구독 상품·결제 상태·거래 식별번호(결제수단 정보는 앱스토어가 처리하며 회사는 보관하지 않음)</td><td>구독 권한 부여, 환불·분쟁 대응</td></tr>
  </tbody>`)}

<h2>2. 보유 및 이용 기간</h2>
<ul>
  <li>원칙: 회원 탈퇴 시 지체 없이 파기합니다.</li>
  <li>AI 요청 원문(연령대·척도 등)은 생성 후 90일, AI 이용 기록은 180일, 서비스 이용 이벤트는 400일이 지나면 파기합니다.</li>
  <li>법령에 따른 보관: 「전자상거래 등에서의 소비자보호에 관한 법률」 계약·청약철회 및 대금결제·재화공급 기록 5년, 소비자 불만·분쟁처리 기록 3년, 「통신비밀보호법」 접속기록 3개월. 이 기록은 다른 정보와 분리해 보관하며 해당 목적 외에 이용하지 않습니다.</li>
</ul>

<h2>3. 개인정보의 제3자 제공</h2>
<p>회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 특별한 규정이 있거나 수사기관이 적법한 절차에 따라 요청하는 경우는 예외로 합니다.</p>

<h2>4. 처리 위탁 및 국외 이전</h2>
${table(`
  <thead><tr><th>수탁자(국가)</th><th>위탁·이전 업무 / 항목</th><th>이전 시기·방법 / 보유기간</th></tr></thead>
  <tbody>
  <tr><td>Amazon Web Services, Inc.(대한민국 서울 리전)</td><td>서버·데이터베이스 운영, 이메일 발송 / 전체 서비스 데이터</td><td>상시 저장 / 위탁 계약 종료 또는 회원 탈퇴 시까지</td></tr>
  <tr><td>OpenAI, L.L.C.(미국) — <strong>선택 동의 시에만</strong></td><td>AI 코칭·추천 설명 문구 생성 / 연령대(10세 단위), 성별, 자가보고 점수·척도, 후보 영양소명, 섭취 완료 비율 (이메일·이름·복용약·질환·알레르기는 전송하지 않음)</td><td>AI 기능 이용 시 암호화 통신(TLS)으로 전송 / OpenAI API 데이터 보존 정책에 따라 최대 30일 후 삭제, 모델 학습에 사용하지 않음</td></tr>
  <tr><td>RevenueCat, Inc.(미국)</td><td>구독 결제 상태 관리 / 서비스 내부 식별자(무작위 ID), 구독 상품·거래 정보</td><td>구매·갱신 시 암호화 통신으로 전송 / 구독 종료 후 관련 법령 보관기간</td></tr>
  <tr><td>650 Industries, Inc.(Expo, 미국)</td><td>푸시 알림 발송 / 푸시 토큰, 알림 제목·내용</td><td>알림 발송 시 전송 / 발송 처리 후 서비스 제공자 정책에 따라 삭제</td></tr>
  <tr><td>Functional Software, Inc.(Sentry, 미국)</td><td>오류 모니터링 / 오류 정보(개인 식별정보 수집 비활성화)</td><td>오류 발생 시 전송 / 90일</td></tr>
  </tbody>`)}
<p>OpenAI 로의 이전은 이용자가 별도로 동의한 경우에만 이뤄지며, 동의하지 않거나 철회(앱 &gt; 내 정보 &gt; 알림 설정·선택 동의)해도 서비스 이용에는 제한이 없습니다(AI 문구 대신 규칙 기반 안내가 제공됩니다).</p>

<h2>5. 개인정보의 파기 절차와 방법</h2>
<p>보유기간이 지나거나 처리 목적이 달성되면 지체 없이 파기합니다. 전자적 파일은 복구할 수 없는 방법으로 삭제하고, 법령상 보관 대상은 분리 보관 후 기간 경과 시 파기합니다.</p>

<h2>6. 이용자의 권리와 행사 방법</h2>
<ul>
  <li>열람·전송: 앱 &gt; 계정 관리 &gt; 데이터 내보내기(전체 데이터를 파일로 받을 수 있습니다)</li>
  <li>정정: 앱에서 프로필·안전 정보를 직접 수정</li>
  <li>삭제·처리정지: 앱 &gt; 계정 관리 &gt; 계정 삭제(즉시 파기)</li>
  <li>동의 철회: 선택 동의는 앱 설정에서 언제든 철회할 수 있습니다.</li>
  <li>위 방법 외에 <a href="mailto:${c.privacyEmail}">${c.privacyEmail}</a> 로 요청하실 수 있으며 10일 이내에 조치 결과를 알려드립니다.</li>
</ul>

<h2>7. 안전성 확보 조치</h2>
<ul>
  <li>비밀번호 단방향 암호화(bcrypt), 건강·복용약 등 민감정보 컬럼 암호화(AES-256-GCM), 전 구간 TLS 암호화</li>
  <li>관리자 접근: 역할 기반 권한, 2단계 인증(TOTP), 접속 IP 제한, 민감정보 열람 시 사유 기록 및 감사 로그 보관</li>
  <li>로그인 실패 잠금, 세션 개별 폐기, 정기 보안 점검</li>
</ul>

<h2>8. 만 14세 미만 아동</h2>
<p>서비스는 만 14세 미만 아동의 회원가입을 받지 않습니다. 제품 정보는 만 19세 이상 성인에게만 제공합니다.</p>

<h2>9. 개인정보 보호책임자</h2>
<p>성명: ${c.privacyOfficer} · 연락처: <a href="mailto:${c.privacyEmail}">${c.privacyEmail}</a></p>

<h2>10. 권익침해 구제 방법</h2>
<ul>
  <li>개인정보분쟁조정위원회 1833-6972 (www.kopico.go.kr)</li>
  <li>개인정보침해신고센터 118 (privacy.kisa.or.kr)</li>
  <li>대검찰청 1301 (www.spo.go.kr) · 경찰청 182 (ecrm.police.go.kr)</li>
</ul>

<h2>11. 처리방침의 변경</h2>
<p>내용이 변경되는 경우 시행 7일 전(이용자 권리에 중대한 변경은 30일 전)부터 앱 공지와 이 페이지를 통해 알립니다.</p>
<p class="muted">${c.name} · 대표 ${c.representative} · 사업자등록번호 ${c.businessNumber} · ${c.address}</p>`,
  },
  {
    slug: 'sensitive',
    title: '민감정보(건강정보) 처리 안내',
    nav: '민감정보 처리 안내',
    heading: '민감정보(건강정보) 처리 안내',
    html: () => `
<p>「개인정보 보호법」 제23조에 따라 건강에 관한 정보는 별도 동의를 받아 처리합니다.</p>
${table(`
  <tr><th>항목</th><td>성별, 수면·스트레스·피로 자가보고 점수, 컨디션 문진 응답, 임신·수유 여부, 기저질환, 알레르기, 복용 중인 약, 복용 중인 영양제, 섭취 기록</td></tr>
  <tr><th>목적</th><td>맞춤 영양 정보 제공, 복용약·질환·임신 등에 따른 섭취 주의 안내, 상한섭취량 초과 방지 안내, 추천 순위 산정을 위한 집계 통계 작성</td></tr>
  <tr><th>다른 이용자 정보와 함께 쓰는 방식</th><td>추천 순위에는 컨디션 점수가 비슷한 이용자 집단의 영양소 관심도와 섭취 후 자가보고 변화를 <strong>개인을 알아볼 수 없는 집계값</strong>으로만 반영합니다. 5명 미만 집단의 값은 쓰지 않고, 한 사람의 기록은 한 표로만 계산하며, 다른 이용자의 원본 정보는 누구에게도 보여주지 않습니다.</td></tr>
  <tr><th>보유기간</th><td>회원 탈퇴 시까지(탈퇴 즉시 파기)</td></tr>
  <tr><th>보호조치</th><td>저장 시 암호화, 관리자 열람 시 사유 기록·감사 로그</td></tr>`)}
<p>동의를 거부할 수 있으나, 이 정보 없이는 맞춤 영양 정보와 안전 확인 기능을 제공할 수 없어 서비스 가입이 제한됩니다.</p>`,
  },
  {
    slug: 'overseas',
    title: '개인정보 국외 이전 안내',
    nav: '국외이전 안내',
    heading: '개인정보 국외 이전 안내 (AI 기능)',
    html: () => `
<p>「개인정보 보호법」 제28조의8에 따라 AI 코칭·추천 설명 기능을 위해 아래와 같이 개인정보를 국외로 이전합니다. <strong>선택 동의</strong>이며, 동의하지 않아도 규칙 기반 안내로 서비스를 이용할 수 있습니다.</p>
${table(`
  <tr><th>이전받는 자</th><td>OpenAI, L.L.C. (미국) · privacy@openai.com</td></tr>
  <tr><th>이전 항목</th><td>연령대(10세 단위), 성별, 수면·스트레스·피로 자가보고 점수, 컨디션 척도(1~5), 후보 영양소명, 섭취 완료 비율<br><span class="muted">이메일·이름·출생연도·복용약·질환·알레르기 등은 이전하지 않습니다.</span></td></tr>
  <tr><th>이전 시기·방법</th><td>AI 기능 이용 시 암호화 통신(TLS)으로 전송</td></tr>
  <tr><th>이용 목적</th><td>한국어 코칭·설명 문구 생성</td></tr>
  <tr><th>보유·이용 기간</th><td>OpenAI API 정책에 따라 남용 모니터링 목적으로 최대 30일 보관 후 삭제, 모델 학습에 사용하지 않음</td></tr>
  <tr><th>거부 방법·불이익</th><td>앱 &gt; 내 정보 &gt; 알림 설정·선택 동의에서 언제든 철회 가능. 철회 시 AI 문구 대신 규칙 기반 안내가 제공되며 그 밖의 불이익은 없습니다.</td></tr>`)}`,
  },
  {
    slug: 'marketing',
    title: '광고성 정보 수신 동의 안내',
    nav: '광고성 정보 수신',
    heading: '광고성 정보 수신 동의 안내',
    html: () => `
<ul>
  <li>수신 항목: 이벤트·혜택·재참여 안내 등 광고성 앱 푸시(제목 앞 "(광고)" 표기)</li>
  <li>야간(21:00~08:00) 발송은 별도 동의한 경우에만 합니다.</li>
  <li>수신 동의는 선택이며, 앱 &gt; 내 정보 &gt; 알림 설정·선택 동의에서 언제든 철회할 수 있습니다.</li>
  <li>수신 동의 후 2년마다 동의 여부를 다시 안내합니다.</li>
  <li>복용 리마인더처럼 이용자가 직접 설정한 서비스 알림은 광고성 정보가 아닙니다.</li>
</ul>`,
  },
  {
    slug: 'medical',
    title: '의료 면책 고지',
    nav: '의료 면책',
    heading: '의료 면책 고지',
    html: () => `
<ul>
  <li>Mediring의 정보는 일반적인 건강·영양 참고 정보이며 의학적 진단·치료·처방을 대체하지 않습니다.</li>
  <li>질환이 있거나 약을 복용 중이거나 임신·수유 중이라면 건강기능식품 섭취 전 의사·약사와 상담하세요.</li>
  <li>기능성 문구는 식품의약품안전처가 인정한 건강기능식품 기능성을 인용한 것이며, 개인별 효과를 보장하지 않습니다.</li>
  <li>섭취기준 수치는 「2025 한국인 영양소 섭취기준」(보건복지부·한국영양학회)을 인용했습니다.</li>
  <li>AI가 생성한 문구에는 "AI" 표시가 있으며 오류가 있을 수 있습니다.</li>
  <li>이상 증상이 있으면 섭취를 중단하고 전문가와 상담하세요. 응급 상황에서는 119에 연락하세요.</li>
</ul>`,
  },
  {
    slug: 'affiliate',
    title: '제휴(수수료) 링크 고지',
    nav: '제휴 고지',
    heading: '제휴(수수료) 링크 고지',
    html: () => `
<p>Mediring에 표시되는 일부 제품 구매 링크는 제휴 링크입니다. 이용자가 링크를 통해 구매하면 회사가 판매처로부터 수수료를 받을 수 있으며, 이용자에게 추가 비용은 발생하지 않습니다.</p>
<ul>
  <li>제휴 여부는 영양소 추천 순위에 영향을 주지 않습니다. 제품 정보는 식품의약품안전처에 신고된 건강기능식품 정보를 바탕으로 합니다.</li>
  <li>제품의 판매·배송·교환·환불은 각 판매처의 책임입니다.</li>
</ul>`,
  },
]

export const supportHtml = ({ c }: Ctx) => `
<p>문의: <a href="mailto:${c.supportEmail}">${c.supportEmail}</a> (영업일 기준 48시간 이내 답변)</p>
<ul>
  <li>계정 삭제: 앱 &gt; 내 정보 &gt; 계정 관리 &gt; 계정 삭제</li>
  <li>구독 해지·환불: App Store 또는 Google Play 구독 관리에서 진행</li>
  <li>개인정보 문의: <a href="mailto:${c.privacyEmail}">${c.privacyEmail}</a></li>
</ul>`

export const findLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug)
