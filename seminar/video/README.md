# Video tập dượt phần 1 (slide 1–25)

Video lớp học hoạt hình để tập trình bày phần Overview, Modeling và Game evaluation: màn chiếu là deck thật (chụp từ `../deck/dist`), bên phải là bảng trắng, người trình bày nói bằng giọng nam tiếng Việt (edge-tts `vi-VN-NamMinhNeural`), chỉ laser vào slide, đi tới bảng vẽ cây ba hộp và viết công thức, hỏi lớp và chờ lớp giơ tay. Góc phải trên luôn ghi slide, bước, đồng hồ, việc cần làm ngay lúc đó và lần bấm → kế tiếp.

- Kịch bản để học thuộc: [`../kich_ban_phan1_Bao.md`](../kich_ban_phan1_Bao.md) (mốc thời gian khớp với video)
- Video: `out/trinh_bay_phan1.mp4` (≈ 24 phút, 1920×1080, 25 fps)
- Ảnh bảng trắng cuối các slide 6, 7, 18, 21, 23, 24: `bang/`

## Sửa lời nói hoặc hành động

Mọi thứ nằm trong [`script.mjs`](script.mjs): lời nói của từng slide, các dấu hành động (`{>}` bấm, `{p:...}` chỉ, `{d:...}` viết bảng, `{||2}` dừng chờ lớp…), vùng chỉ trên slide và nội dung bảng trắng. Sửa xong:

```bash
./build.sh --script   # chỉ cập nhật kịch bản .md (vài giây; câu mới thì đọc lại bằng edge-tts, cần mạng)
./build.sh            # kịch bản + ảnh bảng + video (~10 phút)
```

Xem thử không cần render: `node tools/render.mjs --stills 300,612` (ảnh vào `build/stills/`), hoặc một đoạn ngắn: `node tools/render.mjs --from 320 --to 360` (ra `out/preview.mp4`).

## Cách dựng

| Bước | File | Việc làm |
|---|---|---|
| 1 | `tools/compile.mjs` | tách câu, gọi `tools/tts.py` (edge-tts, có mốc từng từ), xếp lịch mọi câu và hành động, ghi `../kich_ban_phan1_Bao.md`, `build/timeline.js`, `build/narration.wav` |
| 2 | `tools/capture.mjs` | chụp mọi bước của slide 1–26 từ deck bằng Brave headless, chuỗi kéo thanh trượt (slide 23), chuỗi simulation có seed cố định (slide 24), tách khung video manim (slide 22) |
| 3 | `scene/` | cảnh lớp học HTML/SVG; `renderAt(t)` vẽ khung hình tại thời điểm t; nhân vật trong `character.js` (IK hai đoạn cho tay và chân) |
| 4 | `tools/render.mjs` | 8 Brave headless render song song, ffmpeg ghép các đoạn và âm thanh |
| 5 | `tools/boards.mjs` | chụp bảng trắng cho kịch bản |

Cần: Node 24, ffmpeg, Brave (`CHROME=` để đổi trình duyệt), `uv` (chạy edge-tts). Font: Be Vietnam Pro, Pangolin (chữ viết tay trên bảng, có dấu tiếng Việt), từ `@fontsource`.

Kết quả simulation trên slide 24 là ngẫu nhiên khi trình bày thật; video dùng seed 13 (10 ván đầu trung bình −10, 1.010 ván trung bình −0,4).
