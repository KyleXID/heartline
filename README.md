# Heartline

> 카카오톡 대화 스크린샷을 업로드하면 AI가 분석하여 연애 코칭을 해주는 웹 서비스

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

### Backend
| 기술 | 용도 |
|------|------|
| FastAPI | REST API 프레임워크 |
| SQLAlchemy | ORM |
| Alembic | DB 마이그레이션 |
| PostgreSQL | 메인 데이터베이스 |
| Redis | 캐시 / 작업 큐 |
| ARQ | 비동기 작업 처리 |
| Uvicorn | ASGI 서버 |

### AI / OCR
| 기술 | 용도 |
|------|------|
| EasyOCR | 카카오톡 스크린샷 텍스트 추출 (무료) |
| OpenCV | 이미지 전처리 |
| Google Gemini 2.0 Flash | 대화 분석 AI (무료 티어) |

### Infra
| 기술 | 용도 |
|------|------|
| Docker Compose | 개발/배포 환경 |
| Nginx | 리버스 프록시 |
| pytest | 백엔드 테스트 |
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
│              Backend (FastAPI + SQLAlchemy)            │
│  JWT Auth · OCR Pipeline · AI Analysis Engine        │
│  ARQ (비동기 작업) · Redis (캐시/큐)                  │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    PostgreSQL   Gemini API    Redis
```

## Project Structure

```
heartline/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 엔트리포인트
│   │   ├── config.py            # Pydantic Settings
│   │   ├── database.py          # SQLAlchemy 엔진/세션
│   │   ├── dependencies.py      # 공통 의존성
│   │   ├── api/                 # 라우터 (accounts, conversations, analysis, advice)
│   │   ├── models/              # SQLAlchemy 모델
│   │   ├── schemas/             # Pydantic 스키마
│   │   ├── services/            # 비즈니스 로직
│   │   └── core/                # 보안, 유틸, 미들웨어
│   ├── alembic/                 # DB 마이그레이션
│   └── tests/
├── frontend/
│   └── src/
│       ├── components/          # UI 컴포넌트
│       ├── pages/               # 페이지
│       ├── hooks/               # 커스텀 훅
│       ├── services/            # API 호출
│       └── stores/              # Zustand 스토어
├── docker-compose.yml
├── docs/                        # 프로젝트 문서
└── CLAUDE.md                    # AI 코딩 가이드
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
- Python 3.13+
- Node.js 20+
- Docker & Docker Compose
- [uv](https://docs.astral.sh/uv/) (Python 패키지 매니저)

### Backend
```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker (Full Stack)
```bash
docker compose up -d
```

## Development

### Package Management
- Python: `uv add <package>` (pip 사용 금지)
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
