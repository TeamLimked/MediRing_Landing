// MediRing 메시지 테스트(/try/a · /try/b) 사전 신청 수집 — Google Apps Script 웹 앱.
// 설치는 README '메시지 테스트 페이지' 참고: 스프레드시트 > 확장 프로그램 > Apps Script 에 이 파일을 붙여 넣고
// setup() 을 한 번 실행한 뒤 웹 앱(실행: 나, 액세스: 모든 사용자)으로 배포한다.
// 시트: events(방문·버튼 — 개인정보 없음), signups(신청), summary(변형별 방문·신청·전환율, 그 아래 약사 점검 가격별 의향 — 수식).

var VARIANTS = ['a', 'b'];
var EVENTS = ['view', 'cta', 'signup'];
// 페이지(app/data/waitlist.ts)의 선택지와 같아야 한다
var WHO = ['나', '부모님', '배우자·가족', '일로 챙겨요(기관·약국·요양)', '그 밖에'];
var COUNT = ['1~3가지', '4~6가지', '7가지 이상', '잘 몰라요'];
var PHARMACIST = ['이용할래요', '가격에 따라', '아니요']; // 약사 점검 1회(유료) 이용 의향
var PRICES = ['29,000원', '39,000원']; // 방문자마다 하나를 보여 준 약사 점검 가격(app/data/waitlist.ts pharmacistPrices)
var EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  sheet_(ss, 'events', ['시각', '이벤트', '변형', '세션', 'utm_source', 'utm_medium', 'utm_campaign', '가격']);
  // 새 열은 맨 뒤에 붙인다(요약 수식의 열 위치가 바뀌지 않게)
  sheet_(ss, 'signups', ['시각', '변형', '이메일', '누구', '가짓수', '인터뷰', '세션', 'utm_source', 'utm_medium', 'utm_campaign', '약사 점검', '약사 점검 가격']);
  var summary = sheet_(ss, 'summary', ['변형', '방문(세션)', '버튼(세션)', '신청', '전환율(신청/방문)', '인터뷰 가능', '부모님 챙김', '7가지 이상',
    '약사 점검 이용할래요', '약사 점검 가격에 따라']);
  VARIANTS.forEach(function (v, i) {
    var r = i + 2;
    summary.getRange(r, 1, 1, 10).setValues([[
      v,
      '=IFERROR(COUNTUNIQUE(FILTER(events!D2:D, events!B2:B="view", events!C2:C="' + v + '")), 0)',
      '=IFERROR(COUNTUNIQUE(FILTER(events!D2:D, events!B2:B="cta", events!C2:C="' + v + '")), 0)',
      '=COUNTIF(signups!B2:B, "' + v + '")',
      '=IFERROR(D' + r + '/B' + r + ', 0)',
      '=COUNTIFS(signups!B2:B, "' + v + '", signups!F2:F, TRUE)',
      '=COUNTIFS(signups!B2:B, "' + v + '", signups!D2:D, "부모님")',
      '=COUNTIFS(signups!B2:B, "' + v + '", signups!E2:E, "7가지 이상")',
      '=COUNTIFS(signups!B2:B, "' + v + '", signups!K2:K, "이용할래요")',
      '=COUNTIFS(signups!B2:B, "' + v + '", signups!K2:K, "가격에 따라")',
    ]]);
  });
  summary.getRange('E2:E3').setNumberFormat('0.0%');

  // 약사 점검 가격별 의향 — 39,000원의 '이용할래요' 비율이 29,000원의 절반 이상이면 1건에 남는 돈으로 같거나 많다(백엔드 validation-plan.md 2-1단계)
  summary.getRange(6, 1, 1, 7).setValues([['약사 점검 가격', '방문(세션)', '신청', '이용할래요', '가격에 따라', '아니요', '이용할래요 비율(이용할래요/신청)']]);
  PRICES.forEach(function (p, i) {
    var r = i + 7;
    summary.getRange(r, 1, 1, 7).setValues([[
      p,
      '=IFERROR(COUNTUNIQUE(FILTER(events!D2:D, events!B2:B="view", events!H2:H="' + p + '")), 0)',
      '=COUNTIF(signups!L2:L, "' + p + '")',
      '=COUNTIFS(signups!L2:L, "' + p + '", signups!K2:K, "이용할래요")',
      '=COUNTIFS(signups!L2:L, "' + p + '", signups!K2:K, "가격에 따라")',
      '=COUNTIFS(signups!L2:L, "' + p + '", signups!K2:K, "아니요")',
      '=IFERROR(D' + r + '/C' + r + ', 0)',
    ]]);
  });
  summary.getRange('G7:G8').setNumberFormat('0.0%');
}

// 배포 확인용: 웹 앱 URL 을 브라우저로 열면 ok
function doGet() {
  return text_('MediRing waitlist ok');
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return text_('bad');
  }
  var event = String(data.event || '');
  var variant = String(data.variant || '');
  if (EVENTS.indexOf(event) < 0 || VARIANTS.indexOf(variant) < 0) return text_('bad');

  var row = [new Date()];
  var sid = clip_(data.sid, 64);
  var price = PRICES.indexOf(String(data.price || '')) >= 0 ? String(data.price) : ''; // 모르는 가격은 비워 둔다(신청은 받는다)
  var utm = [clip_(data.utm_source, 64), clip_(data.utm_medium, 64), clip_(data.utm_campaign, 64)];
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (event !== 'signup') {
      ss.getSheetByName('events').appendRow(row.concat([event, variant, sid]).concat(utm).concat([price]));
      return text_('ok');
    }
    var email = String(data.email || '').trim().toLowerCase();
    var who = String(data.who || '');
    var count = String(data.count || '');
    var pharmacist = String(data.pharmacist || '');
    if (!EMAIL.test(email) || WHO.indexOf(who) < 0 || COUNT.indexOf(count) < 0 || PHARMACIST.indexOf(pharmacist) < 0) return text_('bad');
    var signups = ss.getSheetByName('signups');
    // 같은 이메일을 두 번 넣으면 첫 신청만 센다(전환율이 부풀지 않게)
    if (signups.getRange('C:C').createTextFinder(email).matchEntireCell(true).findNext()) return text_('ok');
    signups.appendRow(row.concat([variant, clip_(email, 254), who, count, data.interview === true, sid]).concat(utm).concat([pharmacist, price]));
    return text_('ok');
  } finally {
    lock.releaseLock();
  }
}

function sheet_(ss, name, header) {
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(header);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// 길이 제한 + 수식 주입 방지(=, +, -, @ 로 시작하면 글자로 저장)
function clip_(value, max) {
  var s = String(value == null ? '' : value).slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function text_(s) {
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT);
}
