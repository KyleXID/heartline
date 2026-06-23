# Heartline 백엔드 — Java / Spring Boot 마이그레이션 (PoC)

기존 FastAPI(Python) 백엔드를 Java/Spring Boot 로 옮기기 위한 **개념 검증(PoC)** 코드.
이번 PoC 범위는 **프로젝트 골격 + 도메인 엔티티 6종 + 인증(JWT) + 카카오 OAuth** 다.

> 기존 Python 백엔드(`../backend`)는 그대로 두고 병렬로 작성했다.

## 기술 스택

| 영역 | Python (기존) | Java (이번 PoC) |
|---|---|---|
| 프레임워크 | FastAPI | Spring Boot 3.4 (Web MVC) |
| ORM | SQLAlchemy 2.0 (async) | Spring Data JPA / Hibernate 6 |
| 마이그레이션 | Alembic | Flyway/Liquibase (예정, PoC 는 ddl-auto) |
| 인증 | pyjwt + bcrypt | Spring Security + jjwt + BCrypt |
| OAuth | httpx | RestClient |
| 비동기 워커 | ARQ + Redis | (예정) @Async / Redis 큐 |
| OCR | EasyOCR + OpenCV | (예정) **Tess4J(Tesseract)** |
| AI | google-genai | (예정) google-genai Java SDK |
| 빌드 | uv | Gradle |

## 요구 사항

- **JDK 21** (Spring Boot 3.x 는 JDK 17+ 필수)
- PostgreSQL
- (선택) Gradle — 없으면 IntelliJ 로 import 하거나 wrapper 생성
- **Tesseract OCR** + 한국어/영어 tessdata (OCR 파이프라인 사용 시)
  - macOS: `brew install tesseract tesseract-lang`
  - Ubuntu: `apt install tesseract-ocr tesseract-ocr-kor`
  - `TESSDATA_PREFIX` 로 tessdata 경로 지정(미지정 시 시스템 기본 경로 사용)

## 빌드 / 실행

이 저장소에는 `gradle-wrapper.jar`(바이너리)가 포함되어 있지 않다. 아래 중 하나로 wrapper 를 생성한다.

```bash
# Gradle 이 설치돼 있으면
cd backend-java
gradle wrapper --gradle-version 8.12

# 이후
./gradlew bootRun
```

또는 IntelliJ IDEA 에서 `backend-java/build.gradle` 를 열면 자동으로 import 된다.

### 환경 변수

```bash
export DATABASE_URL=jdbc:postgresql://localhost:5432/heartline_java
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
export SECRET_KEY=<32바이트 이상의 시크릿>   # 기존 Python 과 동일해야 토큰 호환
export KAKAO_CLIENT_ID=...
export KAKAO_CLIENT_SECRET=...
export TESSDATA_PREFIX=/opt/homebrew/share/tessdata   # OCR 사용 시 (예: macOS Homebrew)
```

## 구현된 엔드포인트

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/auth/register` | 이메일 회원가입 |
| POST | `/api/auth/login` | 로그인 (access/refresh 발급) |
| POST | `/api/auth/refresh` | 토큰 재발급 |
| GET | `/api/auth/me` | 현재 사용자 |
| GET | `/api/oauth/kakao/login-url` | 카카오 로그인 URL |
| POST | `/api/oauth/kakao/callback` | 카카오 콜백 (로그인/연동/가입) |
| GET | `/health` | 헬스 체크 |

## 마이그레이션 호환성 노트

- **JWT**: HS256 + 동일 `SECRET_KEY` 이면 기존 pyjwt 가 발급한 토큰을 그대로 검증한다(무중단 전환 가능). `type=refresh` 클레임 규약도 동일하게 유지.
- **비밀번호**: `BCryptPasswordEncoder(12)` 는 Python `bcrypt`(gensalt 기본 cost 12)가 만든 해시와 포맷이 같아 **기존 사용자 비밀번호를 그대로 검증**할 수 있다.
- **응답 포맷**: Jackson `SNAKE_CASE` 전역 설정으로 `access_token`, `is_active`, `age_range` 등 기존 FastAPI 응답과 동일.
- **에러 포맷**: `{"detail": "..."}` 유지(프론트 호환).

## 변환 완료 (2차) — OCR / 파서

- **OCR 파이프라인** (`pipeline.py` → `service/ocr/OcrPipeline`): EasyOCR → **Tess4J(Tesseract)**.
- **이미지 전처리** (`preprocess.py` → `service/ocr/ImagePreprocessor`): OpenCV → **JavaCV/bytedeco** (그레이스케일 → 저해상도 2배 확대 → 노이즈 제거 → CLAHE).
- **카톡 파서** (`parser.py` → `service/parser/KakaoMessageParser`): `java.util.regex` 로 이식. 원본 `test_parser.py` 5개 케이스를 JUnit5 로 이식(`KakaoMessageParserTest`).

## 단순화 / 변경 사항 (원본 대비)

- 엔티티 양방향 컬렉션(`relationship`) → 소유측 `@ManyToOne` 단방향. DB 스키마는 동일.
- `X-XSS-Protection` 헤더 제거(현대 브라우저에서 deprecated).
- DB 스키마 관리: PoC 는 `ddl-auto: update`. 운영 전환 시 Flyway 로 기존 Alembic 스키마와 정합.
- **OCR 엔진 교체**: EasyOCR → Tesseract 로 바뀌어 **한글 인식 정확도가 달라질 수 있다**(전처리도 EasyOCR 기준 튜닝이므로 재검증·재튜닝 필요).
- **OCR 동시성**: EasyOCR reader 는 모듈 싱글턴이었으나 `Tesseract` 는 thread-safe 하지 않아 호출 스레드마다 인스턴스를 생성한다.

## 아직 옮기지 않은 것 (다음 단계)

- 대화 업로드 / 이미지 관리 (`conversations`)
- OCR→파서 결과를 DB(`Message`)에 저장 (`save_parsed_messages`)
- Gemini 분석 엔진 (`analysis.py`)
- 분석 대상 관리 (`targets`)
- ARQ 워커 → 비동기 작업 처리 (OCR 백그라운드 처리)
