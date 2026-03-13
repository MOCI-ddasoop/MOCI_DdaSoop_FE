# 🌳 따숲 (Ddasoop)

---

> ### "긍정의 기록이 만드는 사회적 선순환, 따뜻한 숲을 만드는 커뮤니티"

따숲은 선행의 기록을 공유하고 모임을 통해 지속 가능한 나눔을 실천하며, 후원을 통해 마음을 나누는 커뮤니티 플랫폼입니다. 단순한 SNS를 넘어 사회에 따뜻한 영향력을 전파하는 것을 목표로 합니다.

## 🛠 Tech Stack

| Category  | Tech Stack              | Rationale                                                         |
| :-------- | :---------------------- | :---------------------------------------------------------------- |
| Framework | Next.js (App Router)    | 서버 컴포넌트를 활용한 초기 렌더링 최적화 및 SEO 강화             |
| State     | Zustand, Tanstack Query | 클라이언트 상태의 경량화 및 서버 데이터 캐싱/동기화 효율화        |
| Styling   | Tailwind CSS            | 유틸리티 퍼스트 기반의 빠른 스타일링 및 일관된 디자인 시스템 유지 |
| Network   | Axios                   | 인터셉터를 활용한 공통 에러 핸들링 및 API 통신 구조화             |

## 🏗 Architecture & Design

📂 Directory Structure

<details>
<summary><b>디렉토리 구조 보기 (Click)</b></summary>

.
└── src/
├── app # Next.js App Router 기반의 페이지 라우팅 및 레이아웃 정의
├── assets # 이미지, 아이콘, 폰트 등 정적 리소스 관리
├── domain # 기능별(도메인 단위) 비즈니스 로직 및 컴포넌트 격리
│ ├── admin # 관리자 페이지 관련 기능
│ ├── comment # 댓글 생성/수정/삭제 로직
│ ├── donate # 후원 결제 및 내역 관리
│ ├── feed # 피드 리스트 및 상세 게시글 UI/UX
│ ├── form # 공통 폼 데이터 처리 및 검증 로직
│ ├── login # 인증/인가 및 사용자 로그인 세션
│ ├── main # 메인 랜딩 페이지 및 대시보드
│ ├── modal # 도메인별 특화 모달 UI
│ ├── participation # 모임 참여 및 활동 신청 관리
│ ├── report # 신고하기 및 콘텐츠 필터링
│ ├── search # 검색 필터 및 결과 렌더링
│ ├── together # "함께하기" 모임 생성 및 운영
│ └── user # 사용자 프로필 및 마이페이지
├── server # Server Action 및 서버 측 데이터 페칭 로직
├── shared # 프로젝트 전역에서 재사용되는 공용 모듈
│ ├── api # Axios 인스턴스 및 공통 API 인터셉터 설정
│ ├── component # 버튼, 입력창 등 도메인에 종속되지 않는 공통 UI (Atomic)
│ ├── config # 환경 변수 및 전역 설정값
│ ├── hooks # 공통 비즈니스 로직을 추상화한 커스텀 훅
│ ├── mock # MSW 등을 활용한 테스트용 모킹 데이터
│ ├── providers # Context API, QueryClient 등 전역 래퍼 컴포넌트
│ ├── styles # Tailwind 기반 전역 스타일 및 테마 설정
│ ├── types # 프로젝트 전반에 공유되는 공통 타입 정의
│ └── utils # 날짜, 포맷팅, 좌표 계산 등 순수 유틸리티 함수
├── store # Zustand 기반 전역 상태 관리 및 스토어 정의
└── types # OpenAPI 스펙 기반 생성 타입 (자동 생성 및 변경 비허용 구역)

</details>

## 🚀 Technical Challenges & Solutions

<details>
<summary><b>Masonry 레이아웃 기반 커스텀 가상 스크롤 구현</b></summary>

**문제**: 대량의 이미지가 포함된 Masonry 레이아웃에서 렌더링 성능 저하 및 메모리 과부하 발생.

**해결**:

- 좌표 계산 로직: 최단 높이 컬럼을 계산하여 x,y 절대 좌표를 할당하는 알고리즘 직접 구현. 백엔드와 협의하여 원본 이미지의 width, height 값을 사전에 전달받아 레이아웃 시프트(CLS)를 방지했습니다.
- 가상화 적용: 계산된 y 좌표를 기준으로 현재 뷰포트에 인접한 아이템만 렌더링하도록 제한하여, 수천 개의 데이터에서도 안정적인 프레임(FPS)을 유지했습니다.

</details>
<details>
<summary><b>독립적인 모달 상태 제어 및 메모리 최적화</b></summary>

**문제**: 전역 상태로 모달을 관리할 경우 발생하는 상태 오염 및 불필요한 전체 리렌더링 문제.

**해결**:

- Scope 제한: Zustand와 Context API를 결합하여 특정 컴포넌트 트리에만 영향을 미치는 Provider 패턴 적용. 모달 언마운트 시 상태가 자동으로 Clean-up 되도록 설계했습니다.
- 안전한 재사용성: Provider 외부에서도 안정적인 동작을 보장하기 위해 **더미 스토어(Dummy Store)**를 제공하여 런타임 에러를 방지하고 유연한 컴포넌트 활용이 가능케 했습니다.

</details>
<details>
<summary><b>피드 상세 View의 SEO 및 UX 개선 (Parallel Routes)</b></summary>

**문제**: 피드 상세 내용을 모달로 띄울 때, 클라이언트 사이드 렌더링(CSR)에 의존하게 되어 검색 엔진 최적화(SEO)에 불리함.

**해결**:

- 하이브리드 라우팅: 접근 경로에 따라 동일한 컨텐츠를 모달(CSR) 또는 **페이지(SSR)**로 분기 처리했습니다.

**결과**: 사용자는 리스트에서 즉시 모달로 피드를 확인하는 부드러운 UX를 경험하며, 검색 엔진은 서버에서 렌더링된 상세 페이지 정보를 수집할 수 있어 SEO 지표를 효과적으로 개선했습니다.

</details>
<details>
<summary><b>확장성 있는 피드 중앙제어 제출 방식 (Submit Registry)</b></summary>

**문제**: 피드 수정, 댓글 생성/수정 등 한 페이지 내 다양한 입력 컴포넌트가 혼재되어 제출 로직이 복잡해짐.

**해결**:

- Registry 패턴: 각 입력 컴포넌트가 자신의 제출 로직을 등록(Register)하는 중앙 관리 방식을 도입했습니다.
- 상태에 따라 적절한 Submit Registry를 호출함으로써 코드 응집도를 높이고, 새로운 입력 타입 추가 시 기존 코드를 수정하지 않는 확장성을 확보했습니다.

</details>ㅍ
