import os
import tempfile

from fastapi import APIRouter, UploadFile, File

from app.services.stt.whisper import WhisperService


router = APIRouter(prefix="/api", tags=["STT"])

whisper_service = WhisperService()


@router.post("/stt")
async def speech_to_text(
    file: UploadFile = File(...)
):
    audio_bytes = await file.read()

    suffix = os.path.splitext(file.filename or "")[1] or ".wav"

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix,
    ) as temp_file:
        temp_file.write(audio_bytes)
        temp_path = temp_file.name

    try:
        text = whisper_service.transcribe(temp_path)

        return {
            "text": text,
        }

    finally:
        os.remove(temp_path)