# 하트라인 (Heartline) — 프로젝트 가이드

## 프로젝트 개요
카카오톡 대화 스크린샷을 업로드하면 AI가 분석하여 연애 코칭을 해주는 웹 서비스.

## 기술 스택
- **Frontend**: React + Vite + TypeScript + TailwindCSS v4 + Shadcn/ui
- **상태관리**: React Router v7, TanStack Query, Zustand
- **Backend**: FastAPI + SQLAlchemy (Python 3.13, uv 패키지 매니저)
- **DB**: PostgreSQL
- **마이그레이션**: Alembic
- **비동기**: ARQ + Redis (FastAPI 네이티브 async 활용)
- **OCR**: EasyOCR (무료) + OpenCV 이미지 전처리
- **AI 분석**: Google Gemini 2.0 Flash (무료 티어)
- **컨테이너**: Docker Compose
- **테스트**: pytest (백엔드), Vitest + Testing Library (프론트), Playwright (E2E)

## 중요 규칙
- Claude API, Anthropic SDK를 사용하지 않는다. AI 분석은 Gemini API만 사용.
- OCR은 EasyOCR만 사용. 유료 OCR 서비스 사용 금지.
- 모바일 퍼스트 설계. 타겟 유저의 대부분이 모바일 사용자.
- 개인정보 보호 최우선. 대화 이미지는 암호화 저장, 분석 후 삭제 옵션 제공.
- 한국어 우선. UI 텍스트, 에러 메시지 모두 한국어.

## Everything Claude Code (ECC) 에이전트 & 스킬 활용 규칙

> **모든 작업은 반드시 해당 영역의 ECC 에이전트/스킬을 먼저 활용한 후 진행한다.**

### 에이전트 배치
| 에이전트 | 역할 | 필수 ECC 스킬 |
|---------|------|--------------|
| **기획자** | 요구사항 분석, 기능 우선순위, UX 플로우 | `planner`, `product-lens` |
| **디자이너** | UI/UX 설계, 디자인 시스템, 반응형 | `design-system`, `frontend-patterns` |
| **프론트엔드** | React 구현, 상태관리, API 연동 | `frontend-patterns`, `coding-standards`, `e2e-testing` |
| **백엔드** | FastAPI API, DB 설계, 인증, 비동기 처리 | `fastapi`, `api-design`, `postgres-patterns`, `security-review`, `python-patterns` |
| **AI 엔지니어** | OCR, Gemini API 연동, 프롬프트 엔지니어링 | `python-patterns`, `pytorch-patterns` |
| **DevOps** | Docker, CI/CD, 배포 자동화 | `docker-patterns`, `deployment-patterns` |
| **QA** | 테스트, E2E, 코드 리뷰 | `tdd-workflow`, `e2e-testing`, `python-testing` |
| **보안** | 개인정보 보호, API 보안 | `security-review`, `python-patterns` |

### 작업 전 필수 체크리스트
1. **백엔드 작업 시**: `/fastapi`, `/api-design`, `/postgres-patterns` 스킬을 먼저 참조
2. **프론트엔드 작업 시**: `/frontend-patterns`, `/coding-standards` 스킬을 먼저 참조
3. **테스트 작성 시**: `/tdd-workflow`, `/python-testing` 또는 `/e2e-testing` 스킬을 먼저 참조
4. **코드 리뷰 시**: `/code-review`, `/python-review` (백엔드) 또는 `/typescript-reviewer` (프론트) 에이전트 활용
5. **보안 관련 작업 시**: `/security-review` 스킬을 먼저 참조
6. **DB 스키마/쿼리 작업 시**: `/postgres-patterns`, `/database-migrations` 스킬을 먼저 참조
7. **Docker/배포 작업 시**: `/docker-patterns`, `/deployment-patterns` 스킬을 먼저 참조
8. **문서 조회 필요 시**: `/docs` (Context7) 스킬로 최신 라이브러리 문서 확인
9. **계획 수립 시**: `/plan` 스킬로 구현 전략 정리 후 작업 시작
10. **빌드 에러 발생 시**: `/build-fix` 스킬로 빠르게 해결

## 디렉토리 구조
```
heartline/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 앱 엔트리포인트
│   │   ├── config.py            # Pydantic Settings 설정
│   │   ├── database.py          # SQLAlchemy 엔진/세션
│   │   ├── dependencies.py      # 공통 의존성 (get_db 등)
│   │   ├── api/
│   │   │   ├── accounts/        # 사용자 인증, 카카오 OAuth
│   │   │   ├── conversations/   # 대화 업로드, 이미지 관리
│   │   │   ├── analysis/        # AI 분석 엔진, Gemini 연동
│   │   │   └── advice/          # 답장 추천, 전략 타임라인
│   │   ├── models/              # SQLAlchemy 모델
│   │   ├── schemas/             # Pydantic 요청/응답 스키마
│   │   ├── services/            # 비즈니스 로직 레이어
│   │   └── core/                # 보안, 유틸, 미들웨어
│   ├── alembic/                 # DB 마이그레이션
│   ├── tests/                   # pytest 테스트
│   └── pyproject.toml
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
- Conversations: 대화 세션 (상태 관리)
- ConversationImages: 업로드 이미지 (OCR 텍스트)
- Messages: 파싱된 개별 메시지 (발화자 구분)
- AnalysisResults: AI 분석 결과 (관심도, 온도, Red Flag 등)

## 패키지 관리 (uv)
- 패키지 설치: `uv add <package>`
- 개발 의존성: `uv add --dev <package>`
- 스크립트 실행: `uv run uvicorn app.main:app --reload`
- 가상환경은 uv가 자동 관리 (.venv/)
- pip/pip install 사용 금지, 반드시 uv 사용

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
