"""Đọc build/tts_jobs.json, tạo giọng đọc bằng edge-tts (có mốc thời gian từng từ).

Chạy: uv run --with edge-tts python tools/tts.py
Kết quả: build/tts/<id>.mp3 và build/tts/<id>.json (danh sách từ: offset, duration giây). Đã có thì bỏ qua.
"""
import asyncio
import json
import pathlib
import sys

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
BUILD = ROOT / "build"
OUT = BUILD / "tts"


async def synth(job, sem):
    mp3, js = OUT / f"{job['id']}.mp3", OUT / f"{job['id']}.json"
    if mp3.exists() and js.exists():
        return False
    async with sem:
        for attempt in range(4):
            try:
                com = edge_tts.Communicate(job["text"], job["voice"], rate=job["rate"], boundary="WordBoundary")
                audio, words = bytearray(), []
                async for ch in com.stream():
                    if ch["type"] == "audio":
                        audio += ch["data"]
                    elif ch["type"] == "WordBoundary":
                        words.append({"o": ch["offset"] / 1e7, "d": ch["duration"] / 1e7, "t": ch["text"]})
                if not audio or not words:
                    raise RuntimeError("empty TTS result")
                mp3.write_bytes(bytes(audio))
                js.write_text(json.dumps({"text": job["text"], "words": words}, ensure_ascii=False))
                return True
            except Exception as e:  # network hiccups: retry
                print(f"retry {job['id']} ({e})", file=sys.stderr)
                await asyncio.sleep(1.5 * (attempt + 1))
        raise RuntimeError(f"TTS failed for {job['id']}: {job['text'][:60]}")


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    jobs = json.loads((BUILD / "tts_jobs.json").read_text())
    sem = asyncio.Semaphore(6)
    done = await asyncio.gather(*(synth(j, sem) for j in jobs))
    print(f"tts: {len(jobs)} câu, tạo mới {sum(done)}")


asyncio.run(main())
