from faster_whisper import WhisperModel

model_size="turbo"

class WhisperService:
    def __init__(self):
        self.model = WhisperModel(
            model_size,
            device="cpu",
            compute_type="int8",
        )

    def transcribe(self, audio_path: str) -> str:
        segments, info = self.model.transcribe(
            audio_path,
            language="vi",
            beam_size=5,
            vad_filter=True,
        )

        text = " ".join(segment.text.strip() for segment in segments)

        return text.strip()