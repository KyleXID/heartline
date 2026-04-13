# 하트라인 (Heartline) — 프로젝트 플랜

## 프로젝트 개요
썸/관심상대/연애초기 카카오톡 대화 스크린샷을 업로드하면, AI가 대화를 분석하여 연애 코칭을 해주는 웹 서비스.

- **기술 스택**: React + TypeScript, FastAPI + SQLAlchemy, PostgreSQL
- **인프라**: Docker Compose, Redis (캐시/큐), ARQ (비동기)
- **AI**: Gemini 2.0 Flash (무료 대화 분석), EasyOCR (무료 OCR)
- **타겟 유저**: 썸/연애초기 단계의 20~30대

---

## 핵심 기능

### Tier 1 — 핵심
- **대화 스크린샷 OCR 분석**: 카카오톡 캡처 → EasyOCR 텍스트 추출 → 발화자 자동 구분
- **관계 목표 설정**: "썸 → 고백", "재회", "관계 발전" 등 목표 선택
- **AI 대화 분석 리포트**: 상대방 관심도 점수, 대화 온도, 감정 흐름 분석
- **최적 답장 타이밍 추천**: "지금 바로" / "30분 후" / "내일 오전" 등 타이밍 코칭
- **맞춤 답장 문구 제안**: 상황별 3가지 톤 (가벼운/진지한/재치있는) 답장 후보

### Tier 2 — 차별화 (WOW 포인트)
- **관심도 대시보드**: 시간 흐름에 따른 상대방 관심도 변화 그래프
- **대화 패턴 분석**: 답장 속도, 이모티콘 사용량, 대화 주도권 비율 시각화
- **위험 신호 감지**: Red Flag 자동 감지 (읽씹 패턴, 관심 하락 등)
- **연애 전략 타임라인**: D-day 기반 단계별 전략 제안

### Tier 3 — 부가
- **대화 히스토리 관리**: 여러 상대와의 대화를 각각 관리
- **진행 상황 트래킹**: 관계 단계 변화 기록 및 회고
- **알림 서비스**: "지금 답장 보내기 좋은 타이밍이에요" 알림

---

## 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                  Frontend (React)                     │
│  Vite + TypeScript + TailwindCSS + Shadcn/ui         │
│  React Router + TanStack Query + Zustand             │
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
    (데이터)   (AI 분석/무료) (캐시/큐)
```

---

## DB 스키마

| 테이블 | 주요 컬럼 |
|--------|----------|
| Users | id, email, nickname, gender, age_range, kakao_oauth_id |
| Targets | id, user_id(FK), nickname, memo, relationship_goal |
| Conversations | id, target_id(FK), user_id(FK), status |
| ConversationImages | id, conversation_id(FK), image_file, order, ocr_text |
| Messages | id, conversation_id(FK), sender_type, content, sent_at |
| AnalysisResults | id, conversation_id(FK), interest_score, temperature, emotion_timeline(JSON), red_flags(JSON), reply_timing_advice(JSON), suggested_replies(JSON) |

---

## 에이전트 배치 (Everything Claude Code)

| 에이전트 | 역할 | 필수 ECC 스킬 |
|---------|------|--------------|
| 기획자 | 요구사항 분석, 기능 우선순위, UX 플로우 | `planner`, `product-lens` |
| 디자이너 | UI/UX 설계, 디자인 시스템, 반응형 | `design-system`, `frontend-patterns` |
| 프론트엔드 | React 구현, 상태관리, API 연동 | `frontend-patterns`, `coding-standards`, `e2e-testing` |
| 백엔드 | FastAPI API, DB 설계, 인증, 비동기 처리 | `fastapi`, `api-design`, `postgres-patterns`, `security-review`, `python-patterns` |
| AI 엔지니어 | OCR, Gemini API 연동, 프롬프트 엔지니어링 | `python-patterns`, `pytorch-patterns` |
| DevOps | Docker, CI/CD, 배포 자동화 | `docker-patterns`, `deployment-patterns` |
| QA | 테스트, E2E, 코드 리뷰 | `tdd-workflow`, `e2e-testing`, `python-testing` |
| 보안 | 개인정보 보호, API 보안 | `security-review`, `python-patterns` |

---

## 구현 Phase (6 스프린트, 31개 티켓)

### Sprint 1: Phase 1 (기반구축) + Phase 2 일부 (인증)
- FastAPI 프로젝트 초기화 (CORS, JWT, SQLAlchemy)
- PostgreSQL 연결 및 Alembic 마이그레이션
- React 프로젝트 초기화 (Vite + TS + Tailwind)
- Docker Compose 개발환경
- 디자인 시스템 구축
- User 모델 확장 + JWT 인증 API

### Sprint 2: Phase 2 (인증) + Phase 3 (OCR)
- 카카오 OAuth 소셜 로그인
- 로그인/회원가입 UI
- 이미지 업로드 API
- EasyOCR 파이프라인
- ARQ 비동기 작업 큐
- 드래그&드롭 업로드 UI
- 카카오톡 대화 파싱

### Sprint 3: Phase 4 (AI 분석)
- 관계 목표 설정 모델/API
- Gemini API 대화 분석 엔진
- 답장 타이밍 추천
- 답장 문구 생성 (3가지 톤)
- Red Flag 감지
- 분석 결과 캐싱

### Sprint 4: Phase 5 (대시보드) + Phase 6 일부
- 분석 리포트 메인 페이지 UI
- 관심도 변화 그래프 (Recharts)
- 연애 전략 타임라인
- 반응형 모바일 최적화
- 상대방 프로필 관리

### Sprint 5: Phase 6 (히스토리) + Phase 7 (랜딩)
- 대화 분석 이력 조회
- 관심도 추이 트래킹
- 랜딩 페이지
- 온보딩 플로우 (3단계)
- 샘플 분석 데모

### Sprint 6: Phase 8 (테스트/배포)
- 백엔드 유닛/통합 테스트
- 프론트엔드 컴포넌트 테스트
- E2E 테스트
- 개인정보 보호 및 보안 감사
- 배포 설정 (Docker + Nginx + Uvicorn)

---

## 리스크

| 리스크 | 수준 | 대응 |
|--------|------|------|
| 카카오톡 OCR 정확도 | MED | EasyOCR + 이미지 전처리 + 사용자 수정 UI |
| 개인정보 보호 | HIGH | 암호화 저장, 분석 후 삭제 옵션 |
| AI 분석 품질 일관성 | MED | 프롬프트 정교화, 피드백 수집 |
| API 비용 | LOW | Gemini 무료 티어 (15 RPM/1500 RPD), 캐싱 |
| 모바일 UX | MED | 모바일 퍼스트 설계 |
