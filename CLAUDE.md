# 미용업 이력서 생성기 (Hairstylist Resume Maker)

## 프로젝트 개요
미용업 취준생(20대 초반, 이력서를 한 번도 써본 적 없는 사람)을 위한 **모바일 퍼스트** 이력서 생성 웹 서비스.
설문 형식으로 정보를 입력받아 이력서 PDF를 만들어주는 서비스.

### 이 서비스가 필요한 이유
미용업계 구직자들이 이력서를 메모장에 텍스트로 적고 사진 찍어 문자로 보내는 방식으로 지원하는 현실에서 출발.
웹 서비스 하나로 누구나 쉽게 이력서를 만들고 PDF로 저장해서 제출할 수 있게 한다.

---

## 기술 스택
- **Vue 3** + TypeScript
- **Tailwind CSS**
- **pnpm** (패키지 매니저)
- **vue-router** (라우팅)
- **pinia** (상태 관리)
- **html2canvas + jsPDF** (PDF 추출)
- **백엔드 없음** — 모든 처리 브라우저에서 완결, 서버 불필요

---

## 핵심 UX 원칙 (절대 지켜야 할 것들)

1. **모바일 퍼스트** — 타겟 사용자가 폰으로 접근. 모든 화면은 모바일 기준으로 설계
2. **한 화면에 질문 하나** — Typeform 스타일. 한 번에 많은 정보 요구하면 이탈함
3. **진입장벽 최소화** — 이력서도 인터넷도 낯선 사람 기준. 복잡한 커스터마이징 없음
4. **템플릿은 내 데이터로 선택** — 빈 템플릿 고르는 게 아니라, 내 사진/이름이 들어간 상태에서 디자인 전환
5. **PDF 추출이 목적** — 네비게이션 바, 앱 UI 크롬 없음. 문서처럼 생긴 레이아웃

---

## 서비스 흐름 (User Flow)

```
설문 시작 (/survey/1)
  ↓ 스텝 1: 이름이 무엇인가요?
  ↓ 스텝 2: 생년월일을 입력해주세요
  ↓ 스텝 3: 성별을 선택해주세요
  ↓ 스텝 4: 연락처를 입력해주세요
  ↓ 스텝 5: 프로필 사진을 올려주세요 (필수)
  ↓ 스텝 6: 보유 기술을 선택해주세요 (필수)
  ↓ 스텝 7: 포트폴리오 사진을 올려주세요 (선택) ← 미용업 특화, 여러 장
  ↓ 스텝 8: 경력사항을 입력해주세요 (선택)
  ↓ 스텝 9: 자격증을 입력해주세요 (선택)
  ↓ 스텝 10: 한 줄 자기소개를 작성해주세요 (선택)
        ↓
미리보기 화면 (/preview)
  - 입력한 데이터로 이력서 렌더링
  - 하단에 템플릿 전환 버튼 4개 (미니멀 / 다크 / 웜 / 볼드)
  - "수정하기" 버튼으로 설문으로 돌아가기
        ↓
PDF로 저장하기 버튼
  - html2canvas로 캡처 → jsPDF로 저장
  - 파일명: {이름}_이력서.pdf
```

---

## 라우터 구조
```
/              → /survey/1 로 리다이렉트
/survey/:step  → SurveyView.vue (스텝 1~10)
/preview       → PreviewView.vue
```

---

## 프로젝트 구조
```
src/
├── assets/
│   └── main.css          # Tailwind 진입점
├── components/
│   └── templates/
│       ├── TemplateMinimal.vue  # 흰 배경, 심플
│       ├── TemplateDark.vue     # 다크, 골드 포인트
│       ├── TemplateWarm.vue     # 파스텔, 둥근 요소
│       └── TemplateBold.vue     # 인디고 컬러 블록, 트렌디
├── router/
│   └── index.ts
├── stores/
│   └── resume.ts         # Pinia store (reactive 사용)
├── views/
│   ├── SurveyView.vue
│   └── PreviewView.vue
├── App.vue
└── main.ts
```

---

## 템플릿 4종
미리보기 화면에서 실시간 전환 가능. 동일한 데이터를 다른 스타일로 렌더링.

| ID | 이름 | 특징 |
|----|------|------|
| 0 | 미니멀 | 흰 배경, 라이트 그레이, 심플한 타이포 |
| 1 | 다크 | 다크 배경, 골드 포인트, 프리미엄 느낌 |
| 2 | 웜 | 로즈/파스텔 톤, 둥근 요소, 친근한 느낌 |
| 3 | 볼드 | 인디고 컬러 블록, 트렌디, 젊은 에너지 |

---

## Pinia Store 구조 (resume.ts)
```ts
interface ResumeData {
  name: string
  birthDate: string
  gender: string
  phone: string
  profileImage: string | null   // base64
  skills: string[]
  portfolioImages: string[]     // base64 배열
  career: string
  certifications: string
  introduction: string
  selectedTemplate: number      // 0~3
}
```
- `reactive()` 사용 (ref 아님) — 컴포넌트에서 `store.data.name` 으로 직접 접근
- `store.update(partial)` — Object.assign으로 부분 업데이트
- `store.reset()` — 초기화

---

## 개발 명령어
```bash
pnpm install     # 의존성 설치
pnpm dev         # 개발 서버 (http://localhost:5173)
pnpm build       # 프로덕션 빌드
```

---

## 배포
- **플랫폼**: Vercel
- **도메인**: https://hairstylist-resume-maker.vercel.app
- **저장소**: https://github.com/Derek-94/hairstylist-resume-maker
- main 브랜치 푸쉬 시 자동 배포

---

## 앞으로 할 것들 (TODO)
- [ ] 보유 기술 태그 저장 품질 개선 (html2canvas 렌더링 버그 — 현재 미해결)
- [ ] 모바일 실기기 테스트
- [x] 보유 기술 커스텀 입력 추가 (목록에 없는 기술 직접 입력 가능)
- [x] 배포 완료 (Vercel — hairstylist-resume-maker.vercel.app)
- [x] PDF + 이미지 동시 저장 지원
- [x] Stitch MCP 연동 (실제 디자인 참조용으로 활용)

---

## 개발 히스토리 & 주요 결정 사항

### 결정 1: 템플릿 선택 화면 제거
초기 플로우에는 첫 화면에서 템플릿 선택 → 설문 순이었으나,
**빈 템플릿보다 내 데이터가 들어간 상태에서 선택하는 게 더 자연스럽다**는 이유로
미리보기 화면에서 하단 버튼으로 전환하는 방식으로 변경.

### 결정 2: 커스터마이징 없음
타겟층이 디지털 리터러시가 낮은 사용자이므로 직접 커스터마이징 UI는 배제.
대신 디자이너가 만든 4가지 완성된 시안 중 선택.

### 결정 3: 포트폴리오 사진 다중 첨부
미용업 특성상 본인 작업물(레게머리, 염색 등) 사진을 다수 첨부하는 문화가 있음.
포트폴리오 섹션은 여러 장 업로드 지원, 선택 항목으로 처리.

### 결정 4: 백엔드 없음
데이터 저장 불필요. 브라우저에서 base64로 이미지 처리 후 PDF 추출까지 완결.
서버 비용 없이 정적 호스팅으로 배포 가능.

### 결정 5: 저장 방식 2가지 (이미지 + PDF)
- PDF: jsPDF로 콘텐츠 높이에 딱 맞는 커스텀 사이즈 (A4 고정 아님, 여백 없음)
- 이미지: PNG로 저장 → 카카오톡 전송용
- 캡처 대상: `resumeRef`는 `rounded-xl` 안쪽 div에 걸어야 함. 바깥에 걸면 흰 모서리 아티팩트 발생.
- `backgroundColor: null` — 투명 배경으로 캡처해야 템플릿 자체 배경이 올바르게 나옴
- `windowWidth: el.offsetWidth` 사용 (scrollWidth 아님)

---

## html2canvas 알려진 이슈
- **보유 기술 태그 텍스트 정렬**: 한국어 폰트 baseline 계산이 브라우저와 달라 텍스트가 태그 박스 아래에 붙는 현상 발생. `display:flex`, `inline-flex`, `inline-block` + padding 모두 시도했으나 미해결 상태.
- **flex gap 지원 불완전**: flex container의 `gap` 속성이 제대로 렌더링 안 되는 경우 있음. 태그 컨테이너는 `line-height` + `margin` 방식으로 우회.
- **rounded-xl 아티팩트**: 캡처 대상 div에 border-radius 있으면 모서리에 backgroundColor 색으로 채워짐. 캡처 대상은 border-radius 없는 안쪽 div로 지정할 것.

---

## MCP 연동
- **Google Stitch** MCP 등록 완료 (로컬 config)
  - URL: https://stitch.googleapis.com/mcp
  - 기존 프로젝트 2개 확인: "Minimal & Clean Resume" (ID: 4706092503482431127), "Warm & Soft Resume" (ID: 2782408860081329317)
  - 실제 템플릿 디자인은 코드에서 직접 구현함 (Stitch 시안 참조)
