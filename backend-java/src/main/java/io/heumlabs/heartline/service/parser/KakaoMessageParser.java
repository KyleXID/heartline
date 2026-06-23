package io.heumlabs.heartline.service.parser;

import io.heumlabs.heartline.service.parser.dto.ParsedMessage;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/**
 * 카카오톡 OCR 텍스트를 개별 메시지로 파싱. services/parser.py 대응.
 * <p>OCR 결과에서 "닉네임 오전/오후 HH:MM" 라인을 발화자 경계로 삼고,
 * 그 사이 줄들을 메시지 본문으로 묶는다. 위치 정보가 없어 발화자는 닉네임으로만 구분한다.
 */
@Component
public class KakaoMessageParser {

    private static final String UNKNOWN = "unknown";
    private static final String SENDER_ME = "me";
    private static final String SENDER_OTHER = "other";

    // 발화자 + 시간 패턴: "닉네임 오전 10:30" 또는 "닉네임 오후 3:42"
    private static final Pattern SENDER_LINE_PATTERN =
            Pattern.compile("^(.+?)\\s+(오전|오후|AM|PM)\\s*(\\d{1,2}):(\\d{2})\\s*$");

    // 날짜 구분선: "2026년 4월 13일"
    private static final Pattern DATE_DIVIDER_PATTERN =
            Pattern.compile("^\\d{4}년\\s*\\d{1,2}월\\s*\\d{1,2}일");

    /** 카카오톡 시간 표기를 OffsetDateTime(UTC)으로 변환. */
    public OffsetDateTime parseKakaoTime(String period, int hour, int minute) {
        int h = hour;
        if (("오후".equals(period) || "PM".equals(period)) && h != 12) {
            h += 12;
        } else if (("오전".equals(period) || "AM".equals(period)) && h == 12) {
            h = 0;
        }
        return OffsetDateTime.now(ZoneOffset.UTC)
                .withHour(h)
                .withMinute(minute)
                .withSecond(0)
                .withNano(0);
    }

    /**
     * OCR 텍스트를 메시지 리스트로 파싱.
     *
     * @param ocrText    OCR 로 추출된 텍스트 (줄바꿈 구분)
     * @param myNickname 사용자 닉네임 (null 이면 발화자 구분 불가 → "unknown")
     */
    public List<ParsedMessage> parseOcrText(String ocrText, String myNickname) {
        List<ParsedMessage> messages = new ArrayList<>();
        String currentSender = UNKNOWN;
        OffsetDateTime currentTime = null;
        List<String> buffer = new ArrayList<>();

        for (String rawLine : ocrText.split("\n")) {
            String line = rawLine.strip();
            if (line.isEmpty()) {
                continue;
            }

            // 시스템 메시지 건너뛰기 (날짜 구분선, 입퇴장 안내)
            if (DATE_DIVIDER_PATTERN.matcher(line).find()) {
                continue;
            }
            if (line.contains("님이 들어왔습니다") || line.contains("님이 나갔습니다")) {
                continue;
            }

            Matcher match = SENDER_LINE_PATTERN.matcher(line);
            if (match.matches()) {
                // 이전 버퍼 플러시
                if (!buffer.isEmpty()) {
                    messages.add(new ParsedMessage(currentSender, String.join("\n", buffer), currentTime));
                    buffer.clear();
                }

                String nickname = match.group(1).strip();
                String period = match.group(2);
                int hour = Integer.parseInt(match.group(3));
                int minute = Integer.parseInt(match.group(4));
                currentTime = parseKakaoTime(period, hour, minute);

                if (myNickname != null && nickname.equals(myNickname)) {
                    currentSender = SENDER_ME;
                } else if (myNickname != null) {
                    currentSender = SENDER_OTHER;
                } else {
                    currentSender = UNKNOWN;
                }
            } else {
                // 메시지 본문
                buffer.add(line);
            }
        }

        // 마지막 버퍼 플러시
        if (!buffer.isEmpty()) {
            messages.add(new ParsedMessage(currentSender, String.join("\n", buffer), currentTime));
        }
        return messages;
    }
}
