# Heartline

> 카카오톡 대화 스크린샷을 업로드하면 AI가 분석하여 연애 코칭을 해주는 웹 서비스

> ⚙️ **백엔드 전환 진행 중**: Python/FastAPI → **Java/Spring Boot**. 현행 백엔드는 `backend-java/`이며, 기존 `backend/`(Python)는 JDK 21 환경에서 빌드·실행 검증이 끝나면 제거할 예정입니다.

## Tech Stack

### Frontend
| 기술 | 용도 |
|------|------|
| React + Vite | SPA 프레임워크 + 번들러 |
| TypeScript | 타입 안전성 |
| TailwindCSS v4 | 유틸리티 CSS |
| Shadcn/ui | UI 컴포넌트 |
| React Router v7 | 라우팅 |
| TanStack Query | 서버 상태 관리 |
| Zustand | 클라이언트 상태 관리 |

### Backend (Spring Boot)
| 기술 | 용도 |
|------|------|
| Spring Boot 3.4 (Web MVC) | REST API 프레임워크 |
| Spring Data JPA / Hibernate 6 | ORM |
| Spring Security + jjwt | 인증/인가 (JWT) |
| PostgreSQL | 메인 데이터베이스 |
| Spring Data Redis | 캐시 |
| Spring `@Async` | 비동기 작업 처리 (OCR 워커) |
| Gradle | 빌드 / 의존성 |
| 내장 Tomcat | 서블릿 컨테이너 |

### AI / OCR
| 기술 | 용도 |
|------|------|
| Tess4J (Tesseract) | 카카오톡 스크린샷 텍스트 추출 (무료) |
| JavaCV / bytedeco (OpenCV) | 이미지 전처리 |
| Google Gemini 2.0 Flash | 대화 분석 AI (무료 티어, RestClient REST 호출) |

### Infra
| 기술 | 용도 |
|------|------|
| Docker Compose | 개발/배포 환경 (Java 백엔드용 구성은 전환 후 갱신 예정) |
| Nginx | 리버스 프록시 |
| JUnit 5 | 백엔드 테스트 |
| Vitest | 프론트엔드 테스트 |
| Playwright | E2E 테스트 |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (React)                     │
│  Vite + TypeScript + TailwindCSS + Shadcn/ui         │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────────┐
│         Backend (Spring Boot + Spring Data JPA)       │
│  JWT Auth · OCR Pipeline(Tess4J) · AI Analysis(Gemini)│
│  @Async OCR 워커 · Spring Data Redis (캐시)           │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    PostgreSQL   Gemini API    Redis
```

## Project Structure

```
heartline/
├── backend-java/                # ⭐ 현행 백엔드 (Spring Boot)
│   ├── build.gradle
│   ├── docs/                     # spring-for-python-devs.html (학습 슬라이드)
│   └── src/
│       ├── main/java/io/heumlabs/heartline/
│       │   ├── HeartlineApplication.java   # 엔트리포인트
│       │   ├── config/           # SecurityConfig, AsyncConfig, *Properties
│       │   ├── common/           # BaseEntity, 예외 처리
│       │   ├── domain/           # JPA 엔티티
│       │   ├── repository/       # Spring Data JPA
│       │   ├── auth/  oauth/     # 인증(JWT) · 카카오 로그인
│       │   ├── target/  conversation/  analysis/  # 도메인 API
│       │   ├── service/          # OCR 파이프라인 · 카톡 파서
│       │   └── worker/           # 비동기 OCR 워커
│       ├── main/resources/application.yml
│       └── test/                 # JUnit 5
├── backend/                     # (레거시) Python/FastAPI — 검증 후 제거 예정
├── frontend/
│   └── src/
│       ├── components/           # UI 컴포넌트
│       ├── pages/                # 페이지
│       ├── hooks/                # 커스텀 훅
│       ├── services/             # API 호출
│       └── stores/               # Zustand 스토어
├── docker-compose.yml
├── docs/                         # 프로젝트 문서
└── CLAUDE.md                     # AI 코딩 가이드
```

## DB Schema

| 테이블 | 설명 |
|--------|------|
| Users | 사용자 (카카오 OAuth, JWT) |
| Targets | 분석 대상 (닉네임, 관계 목표) |
| Conversations | 대화 세션 |
| ConversationImages | 업로드 이미지 + OCR 텍스트 |
| Messages | 파싱된 개별 메시지 |
| AnalysisResults | AI 분석 결과 (관심도, 온도, Red Flag 등) |

## Key Features

- **OCR 분석**: 카카오톡 캡처 → 텍스트 추출 → 발화자 자동 구분
- **AI 대화 분석**: 상대방 관심도, 대화 온도, 감정 흐름 리포트
- **답장 코칭**: 최적 타이밍 + 3가지 톤 맞춤 답장 제안
- **관심도 대시보드**: 시간별 관심도 변화 그래프
- **Red Flag 감지**: 읽씹 패턴, 관심 하락 등 위험 신호 자동 알림

## Getting Started

### Prerequisites
- **JDK 21** (Spring Boot 3.x 필수)
- Node.js 20+
- PostgreSQL, Redis
- (OCR 사용 시) Tesseract + 한국어/영어 tessdata
- Docker & Docker Compose (선택)

> JDK는 시스템을 더럽히지 않게 [SDKMAN](https://sdkman.io/)으로 격리 설치를 권장합니다: `sdk install java 21-tem && sdk install gradle`

### Backend (Spring Boot)
```bash
cd backend-java
gradle wrapper --gradle-version 8.12   # 최초 1회 (또는 IntelliJ로 import)
./gradlew bootRun                       # http://localhost:8000
./gradlew test
```

자세한 환경 변수·엔드포인트·처리 흐름은 [`backend-java/README.md`](backend-java/README.md) 참고.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Development

### Package Management
- Backend: `build.gradle`에 의존성 선언 (Gradle)
- Frontend: `npm install <package>`

### Commit Convention
```
feat: 새 기능
fix: 버그 수정
docs: 문서
style: 포맷팅
refactor: 리팩토링
test: 테스트
chore: 빌드/설정
```

## Project Management
- [Notion Plan](https://www.notion.so/32fe8268560a8056a17eef4b4d54d07c)
- [Sprint Board](https://www.notion.so/e91a21fd3d0249c2989ac8ad51429ada)

## License
Private
