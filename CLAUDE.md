# 하트라인 (Heartline) — 프로젝트 가이드

## 프로젝트 개요
카카오톡 대화 스크린샷을 업로드하면 AI가 분석하여 연애 코칭을 해주는 웹 서비스.

> ⚙️ **백엔드 전환 진행 중**: Python/FastAPI → **Java/Spring Boot**. 현행 백엔드는 `backend-java/`이며,
> 기존 `backend/`(Python)는 JDK 21 환경에서 빌드·실행 검증이 끝나면 제거할 예정이다.

## 기술 스택
- **Frontend**: React + Vite + TypeScript + TailwindCSS v4 + Shadcn/ui
- **상태관리**: React Router v7, TanStack Query, Zustand
- **Backend**: Spring Boot 3.4 (Web MVC) + Spring Data JPA / Hibernate 6 (Java 21, Gradle)
- **DB**: PostgreSQL
- **마이그레이션**: (예정) Flyway/Liquibase — 현재 PoC 는 `ddl-auto`
- **인증**: Spring Security + jjwt (JWT)
- **비동기**: Spring `@Async` (OCR 워커) + Redis
- **캐시**: Spring Data Redis
- **OCR**: Tess4J(Tesseract, 무료) + JavaCV/bytedeco(OpenCV) 이미지 전처리
- **AI 분석**: Google Gemini 2.0 Flash (무료 티어, RestClient REST 호출)
- **컨테이너**: Docker Compose
- **테스트**: JUnit 5 (백엔드), Vitest + Testing Library (프론트), Playwright (E2E)

## 중요 규칙
- Claude API, Anthropic SDK를 사용하지 않는다. AI 분석은 Gemini API만 사용.
- OCR은 Tess4J(Tesseract)만 사용. 유료 OCR 서비스 사용 금지(무료 원칙 유지).
- 모바일 퍼스트 설계. 타겟 유저의 대부분이 모바일 사용자.
- 개인정보 보호 최우선. 대화 이미지는 분석 후 삭제(물리 삭제 + `image_file` null, OCR 텍스트만 보존).
- 한국어 우선. UI 텍스트, 에러 메시지 모두 한국어.
- API 응답은 `snake_case`(Jackson 전역 설정), 에러는 `{"detail": ...}` 포맷 유지(프론트 호환).

## Everything Claude Code (ECC) 에이전트 & 스킬 활용 규칙

> **모든 작업은 반드시 해당 영역의 ECC 에이전트/스킬을 먼저 활용한 후 진행한다.**

### 에이전트 배치
| 에이전트 | 역할 | 필수 ECC 스킬 |
|---------|------|--------------|
| **기획자** | 요구사항 분석, 기능 우선순위, UX 플로우 | `planner`, `product-lens` |
| **디자이너** | UI/UX 설계, 디자인 시스템, 반응형 | `design-system`, `frontend-patterns` |
| **프론트엔드** | React 구현, 상태관리, API 연동 | `frontend-patterns`, `coding-standards`, `e2e-testing` |
| **백엔드** | Spring Boot API, JPA, 인증, 비동기 처리 | `springboot-patterns`, `api-design`, `jpa-patterns`, `springboot-security`, `java-coding-standards` |
| **AI 엔지니어** | OCR(Tess4J), Gemini API 연동, 프롬프트 엔지니어링 | `springboot-patterns` |
| **DevOps** | Docker, CI/CD, 배포 자동화 | `docker-patterns`, `deployment-patterns` |
| **QA** | 테스트, E2E, 코드 리뷰 | `springboot-tdd`, `e2e-testing`, `springboot-verification` |
| **보안** | 개인정보 보호, API 보안 | `springboot-security`, `security-review` |

### 작업 전 필수 체크리스트
1. **백엔드 작업 시**: `/springboot-patterns`, `/api-design`, `/jpa-patterns` 스킬을 먼저 참조
2. **프론트엔드 작업 시**: `/frontend-patterns`, `/coding-standards` 스킬을 먼저 참조
3. **테스트 작성 시**: `/springboot-tdd` 또는 `/e2e-testing` 스킬을 먼저 참조
4. **코드 리뷰 시**: `java-reviewer` (백엔드) 또는 `typescript-reviewer` (프론트) 에이전트 활용
5. **보안 관련 작업 시**: `/springboot-security`, `/security-review` 스킬을 먼저 참조
6. **DB 스키마/쿼리 작업 시**: `/jpa-patterns`, `/postgres-patterns`, `/database-migrations` 스킬을 먼저 참조
7. **Docker/배포 작업 시**: `/docker-patterns`, `/deployment-patterns` 스킬을 먼저 참조
8. **문서 조회 필요 시**: `/docs` (Context7) 스킬로 최신 라이브러리 문서 확인
9. **계획 수립 시**: `/plan` 스킬로 구현 전략 정리 후 작업 시작
10. **빌드 에러 발생 시**: `/gradle-build` 스킬로 빠르게 해결

## 디렉토리 구조
```
heartline/
├── backend-java/                # ⭐ 현행 백엔드 (Spring Boot)
│   ├── build.gradle
│   ├── docs/                     # spring-for-python-devs.html (학습 슬라이드)
│   └── src/
│       ├── main/java/io/heumlabs/heartline/
│       │   ├── HeartlineApplication.java   # 엔트리포인트 (@EnableAsync/@EnableJpaAuditing)
│       │   ├── config/           # SecurityConfig, AsyncConfig, *Properties
│       │   ├── common/           # BaseEntity, 전역 예외 처리
│       │   ├── domain/           # JPA 엔티티
│       │   ├── repository/       # Spring Data JPA
│       │   ├── auth/  oauth/     # 인증(JWT) · 카카오 로그인
│       │   ├── target/  conversation/  analysis/  # 도메인 API (Controller/Service/dto)
│       │   ├── service/          # OCR 파이프라인(Tess4J) · 카톡 파서(regex)
│       │   └── worker/           # 비동기 OCR 워커 (@Async)
│       ├── main/resources/application.yml
│       └── test/                 # JUnit 5
├── backend/                     # (레거시) Python/FastAPI — 검증 후 제거 예정
├── frontend/
│   ├── src/
│   │   ├── components/          # 공통 UI 컴포넌트
│   │   ├── pages/               # 페이지 컴포넌트
│   │   ├── hooks/               # 커스텀 훅
│   │   ├── services/            # API 호출 레이어
│   │   └── stores/              # Zustand 스토어
│   └── package.json
├── docker-compose.yml
├── docs/                        # 프로젝트 문서
└── CLAUDE.md
```

## DB 테이블
- Users: 사용자 (카카오 OAuth, JWT 인증)
- Targets: 분석 대상 (닉네임, 관계 목표)
- Conversations: 대화 세션 (상태 관리: pending → processing → ocr_complete → analyzed)
- ConversationImages: 업로드 이미지 (OCR 텍스트)
- Messages: 파싱된 개별 메시지 (발화자 구분)
- AnalysisResults: AI 분석 결과 (관심도, 온도, Red Flag 등 — JSONB)

## 패키지 관리 (Gradle)
- 의존성은 `backend-java/build.gradle` 의 `dependencies { }` 에 선언
- 빌드/실행: `./gradlew bootRun` (최초 1회 `gradle wrapper --gradle-version 8.12`)
- 테스트: `./gradlew test`
- **JDK 21 필수** (Spring Boot 3.x). 시스템 오염 없이 SDKMAN 으로 격리 설치 권장: `sdk install java 21-tem && sdk install gradle`
- 의존성 격리는 Gradle 이 프로젝트 classpath 단위로 처리(Python venv 불필요)

## 커밋 컨벤션
- feat: 새 기능
- fix: 버그 수정
- docs: 문서
- style: 포맷팅
- refactor: 리팩토링
- test: 테스트
- chore: 빌드/설정

## Notion 프로젝트 관리
- 플랜: https://www.notion.so/32fe8268560a8056a17eef4b4d54d07c
- 스프린트 보드: https://www.notion.so/e91a21fd3d0249c2989ac8ad51429ada
