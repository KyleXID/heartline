from app.services.parser import parse_ocr_text


def test_parse_basic():
    text = """민지 오후 3:42
오늘 뭐해?
나 오후 3:45
아직 미정!"""

    messages = parse_ocr_text(text, my_nickname="나")
    assert len(messages) == 2
    assert messages[0]["sender_type"] == "other"
    assert messages[0]["content"] == "오늘 뭐해?"
    assert messages[1]["sender_type"] == "me"


def test_parse_multiline():
    text = """민지 오후 4:00
첫 줄
두 번째 줄"""

    messages = parse_ocr_text(text, my_nickname="나")
    assert len(messages) == 1
    assert "첫 줄\n두 번째 줄" == messages[0]["content"]


def test_parse_skip_system():
    text = """2024년 3월 15일 금요일
민지님이 들어왔습니다
민지 오후 1:00
안녕"""

    messages = parse_ocr_text(text, my_nickname="나")
    assert len(messages) == 1
    assert messages[0]["content"] == "안녕"


def test_parse_no_nickname():
    text = """민지 오후 3:42
안녕"""

    messages = parse_ocr_text(text)
    assert messages[0]["sender_type"] == "unknown"


def test_parse_am_pm():
    text = """민지 오전 9:30
아침"""

    messages = parse_ocr_text(text, my_nickname="나")
    assert messages[0]["sent_at"].hour == 9
