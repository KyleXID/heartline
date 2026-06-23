# Heartline 백엔드 — Java / Spring Boot 포팅

기존 FastAPI(Python) 백엔드를 Java/Spring Boot 로 옮긴 결과물.
**인증·OAuth·도메인·OCR·파서·타겟·대화·분석·비동기 워커·캐시까지 전체 기능 포팅 완료.**

> 기존 Python 백엔드(`../backend`)는 그대로 두고 병렬로 작성했다. 이 프로젝트는 Java/Spring 으로 완전 전환 예정이다.
> ⚠️ 이 머신은 Java 8 환경이라 **빌드/실행 검증은 아직 못 했다.** JDK 21 환경에서 검증이 필요하다(아래 참고).

## 기술 스택

| 영역 | Python (기존) | Java (포팅) |
|---|---|---|
| 프레임워크 | FastAPI | Spring Boot 3.4 (Web MVC) |
| ORM | SQLAlchemy 2.0 (async) | Spring Data JPA / Hibernate 6 |
| 마이그레이션 | Alembic | (예정) Flyway/Liquibase — 현재는 ddl-auto |
| 인증 | pyjwt + bcrypt | Spring Security + jjwt + BCrypt |
| OAuth / 외부 호출 | httpx | RestClient |
| 비동기 워커 | ARQ + Redis | Spring `@Async` |
| 캐시 | redis.asyncio | Spring Data Redis |
| OCR | EasyOCR + OpenCV | Tess4J(Tesseract) + JavaCV/bytedeco |
| AI | google-genai | RestClient → Gemini REST |
| 빌드 | uv | Gradle |

## 요구 사항

- **JDK 21** (Spring Boot 3.x 는 JDK 17+ 필수)
- PostgreSQL
- **Redis** (분석 결과 캐시)
- **Tesseract OCR** + 한국어/영어 tessdata (OCR 사용 시)
  - macOS: `brew install tesseract tesseract-lang`
  - Ubuntu: `apt install tesseract-ocr tesseract-ocr-kor`
- (선택) Gradle — 없으면 IntelliJ 로 import 하거나 wrapper 생성

## 빌드 / 실행

`gradle-wrapper.jar`(바이너리)는 포함하지 않았다. 아래 중 하나로 wrapper 를 생성한다.

```bash
cd backend-java
gradle wrapper --gradle-version 8.12   # Gradle 설치돼 있을 때
./gradlew bootRun                       # http://localhost:8000
./gradlew test
```

또는 IntelliJ IDEA 에서 `backend-java/build.gradle` 를 열면 자동 import 된다.

### 환경 변수

```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/heartline_java
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export REDIS_URL=redis://localhost:6379/0
export SECRET_KEY=<32바이트 이상의 시크릿>            # 기존 Python 과 동일해야 토큰 호환
export KAKAO_CLIENT_ID=...
export KAKAO_CLIENT_SECRET=...
export GEMINI_API_KEY=...                            # 분석 사용 시
export TESSDATA_PREFIX=/opt/homebrew/share/tessdata  # OCR 사용 시 (예: macOS Homebrew)
export UPLOAD_DIR=uploads                            # 업로드 저장 루트(기본 uploads)
```

## 구현된 엔드포인트 (19개)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/auth/register` | 이메일 회원가입 |
| POST | `/api/auth/login` | 로그인 (access/refresh 발급) |
| POST | `/api/auth/refresh` | 토큰 재발급 |
| GET | `/api/auth/me` | 현재 사용자 |
| GET | `/api/oauth/kakao/login-url` | 카카오 로그인 URL |
| POST | `/api/oauth/kakao/callback` | 카카오 콜백 (로그인/연동/가입) |
| GET | `/api/targets` | 타겟 목록 |
| POST | `/api/targets` | 타겟 생성 |
| GET | `/api/targets/{id}` | 타겟 조회 |
| PATCH | `/api/targets/{id}` | 타겟 수정 |
| DELETE | `/api/targets/{id}` | 타겟 삭제 |
| GET | `/api/conversations` | 대화 목록 (분석 요약 포함) |
| POST | `/api/conversations` | 대화 생성 |
| POST | `/api/conversations/{id}/images` | 이미지 업로드 → **OCR 자동 트리거** |
| DELETE | `/api/conversations/{id}/images` | 이미지 물리 삭제 (개인정보) |
| GET | `/api/conversations/{id}` | 대화 조회 |
| POST | `/api/analysis` | 분석 실행 (Gemini) |
| GET | `/api/analysis/{conversationId}` | 분석 결과 조회 (캐시) |
| GET | `/health` | 헬스 체크 |

## 처리 흐름 (대화 → 분석)

```
대화 생성 → 이미지 업로드 → [OcrWorker @Async] OCR(Tess4J) → 파싱 → Message 저장 (status: ocr_complete)
                                                                          ↓
                                       POST /api/analysis → Gemini 분석 → AnalysisResult 저장 (status: analyzed) → Redis 캐시
```

## 마이그레이션 호환성 노트

- **JWT**: HS256 + 동일 `SECRET_KEY` 면 기존 pyjwt 토큰을 그대로 검증(무중단 전환). `type=refresh` 규약 유지.
- **비밀번호**: `BCryptPasswordEncoder(12)` 가 Python `bcrypt` 해시와 포맷이 같아 기존 비밀번호를 그대로 검증.
- **응답/에러 포맷**: Jackson `SNAKE_CASE` + `{"detail":...}` 유지(프론트 호환).

## 단순화 / 변경 사항 (원본 대비)

- 엔티티 양방향 컬렉션 → 소유측 `@ManyToOne` 단방향. 대화 이미지는 `ConversationImageRepository` 로 조회. DB 스키마는 동일.
- **OCR→파싱→저장 연결 보강**: Python 은 `parse_ocr_text`/`save_parsed_messages`/`enqueue_ocr` 가 정의만 있고 호출되지 않는 미완 상태였다. Java 에서는 **이미지 업로드 완료 시 OCR 워커를 자동 트리거**하고, 워커가 OCR→파싱→`Message` 저장까지 수행한다(파서 `my_nickname` 은 `User.nickname` 사용).
- **비동기 워커**: ARQ 별도 프로세스 → Spring `@Async` 스레드. 다중 인스턴스가 필요하면 메시지큐로 확장.
- **OCR 엔진 교체**: EasyOCR → Tesseract 로 **한글 인식 정확도가 달라질 수 있다**(전처리도 EasyOCR 기준 튜닝 → 재검증 필요). `Tesseract` 는 thread-safe 하지 않아 스레드별 인스턴스 생성.
- **Gemini**: google-genai SDK 대신 `RestClient` 로 REST(generateContent) 직접 호출(의존성/버전 리스크 축소).
- **경로 trailing slash**: Python(FastAPI)은 `/api/targets/` 형태, Spring 은 `/api/targets`. 프론트 통합 시 한쪽으로 맞춰야 한다.
- DB 스키마: PoC 는 `ddl-auto: update`. 운영 전환 시 Flyway 로 기존 Alembic 스키마와 정합.

## 남은 일

- **JDK 21 환경에서 실제 빌드·실행·통합 테스트** (이 머신 Java 8 한계로 미검증).
- 운영용 Flyway 마이그레이션(기존 Alembic 스키마 baseline).
- 운영 전 성능 개선: 목록 엔드포인트 페이지네이션(`Page<T>`), 대화 목록의 N+1 쿼리(분석 요약/이미지 수 일괄 조회).
- `advice`(답장 추천·전략 타임라인) — **Python 에도 미구현**이라 포팅이 아닌 신규 개발 영역.
