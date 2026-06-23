package io.heumlabs.heartline.service.parser;

import static org.assertj.core.api.Assertions.assertThat;

import io.heumlabs.heartline.service.parser.dto.ParsedMessage;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/** tests/test_parser.py 이식. */
class KakaoMessageParserTest {

    private final KakaoMessageParser parser = new KakaoMessageParser();

    @Test
    @DisplayName("기본 파싱 - 발화자/시간 경계로 메시지 분리")
    void parseBasic() {
        String text = "민지 오후 3:42\n오늘 뭐해?\n나 오후 3:45\n아직 미정!";

        List<ParsedMessage> messages = parser.parseOcrText(text, "나");

        assertThat(messages).hasSize(2);
        assertThat(messages.get(0).senderType()).isEqualTo("other");
        assertThat(messages.get(0).content()).isEqualTo("오늘 뭐해?");
        assertThat(messages.get(1).senderType()).isEqualTo("me");
    }

    @Test
    @DisplayName("멀티라인 메시지 - 같은 발화자의 여러 줄을 하나로 묶음")
    void parseMultiline() {
        String text = "민지 오후 4:00\n첫 줄\n두 번째 줄";

        List<ParsedMessage> messages = parser.parseOcrText(text, "나");

        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).content()).isEqualTo("첫 줄\n두 번째 줄");
    }

    @Test
    @DisplayName("시스템 메시지(날짜 구분선/입장 안내) 건너뜀")
    void parseSkipSystem() {
        String text = "2024년 3월 15일 금요일\n민지님이 들어왔습니다\n민지 오후 1:00\n안녕";

        List<ParsedMessage> messages = parser.parseOcrText(text, "나");

        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).content()).isEqualTo("안녕");
    }

    @Test
    @DisplayName("닉네임 미지정 시 발화자 unknown")
    void parseNoNickname() {
        String text = "민지 오후 3:42\n안녕";

        List<ParsedMessage> messages = parser.parseOcrText(text, null);

        assertThat(messages.get(0).senderType()).isEqualTo("unknown");
    }

    @Test
    @DisplayName("오전 시간 파싱 - hour 보존")
    void parseAmPm() {
        String text = "민지 오전 9:30\n아침";

        List<ParsedMessage> messages = parser.parseOcrText(text, "나");

        assertThat(messages.get(0).sentAt().getHour()).isEqualTo(9);
    }
}
