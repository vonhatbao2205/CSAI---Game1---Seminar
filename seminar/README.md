# Seminar Games 1 — nhóm 10: slide web

Deck trình bày **Games 1: Mô hình hóa trò chơi, Game Evaluation, Expectimax và Minimax**, dựng trên template seminar RMQ v2 (`/home/bao/Projects/RMQ/seminar/v2`), chuyển sang **nền trắng**. Nội dung lấy từ `reports/Seminar Games 1 nhóm 10.md`; mọi con số trong slide và video được tính lại bằng chính thuật toán trên slide (khớp `research_notes/.../verify_examples_output.txt`).

## Trình chiếu

```bash
cd seminar && ./present.sh          # mở http://localhost:8000
```

Hoặc mở thẳng `deck/dist/index.html` bằng Chrome, Edge, Brave hoặc Firefox. Deck chạy **offline**: font, công thức, thư viện JS nằm trong một file HTML; video nằm trong `deck/dist/media/`. Muốn chép sang máy khác thì chép cả thư mục `deck/dist/`.

| Phím | Tác dụng |
|---|---|
| → hoặc Space, ← | bước hoặc slide tiếp theo, quay lại |
| O hoặc Esc | tổng quan, nhảy tới slide bất kỳ, xem thời lượng |
| N | ghi chú cho người trình bày (lời giảng chi tiết, nguồn, số trang) |
| T | bản rút gọn: bỏ qua các slide đánh dấu "có thể lướt" |
| A | tự chạy, cho người xem lại một mình |
| F | toàn màn hình |
| V (K), J, L, R, [ ] | video: dừng/phát, lùi/tới 5 giây, phát lại, đổi tốc độ |

Số slide hiện ở góc phải dưới. Mỗi slide có lời dẫn của π ở cạnh dưới, nên người xem lại sau seminar vẫn theo được khi không có người trình bày. Kịch bản đầy đủ: `kich_ban.md`.

## Nội dung (64 slide)

| Phần | Slide | Nội dung chính |
|---|---|---|
| Mở đầu | 1–3 | bìa với cây Tic-Tac-Toe 3D, câu hỏi xuyên suốt, lộ trình |
| Overview | 4–8 | single-agent search, plan và policy, game ba hộp chơi được, ba giả định về đối thủ |
| Modeling | 9–19 | sáu thành phần, Tic-Tac-Toe tương tác, game tree và state-space graph, 549.946 node và 5.478 state, policy, utility và value |
| Game evaluation | 20–25 | recurrence, video Manim, đổi policy trực tiếp, Monte Carlo với bảng điểm |
| Expectimax | 26–34 | recurrence, 2 video Manim, đồ thị độ nhạy theo p, mô hình sai, liên hệ MDP |
| Minimax | 35–45 | recurrence, 2 video Manim, so sánh ba phương pháp, postorder DFS từng bước, Halving đấu với máy |
| Face-off | 46–58 | bảng face-off tương tác, đấu thử, ba tính chất, lower bound, thế Q với video fork, thế P, O(b^m) |
| Tổng kết | 59–64 | so sánh phương pháp, các bước giải, câu hỏi kiểm tra, tài liệu tham khảo, hỏi đáp |

Thời lượng dự kiến: 57 phút cho toàn bộ deck, 47 phút ở chế độ rút gọn. Các slide 4, 64 và 65 của bản 67 slide đã được bỏ; số hiện tại được đánh lại liên tục.

## Tập dượt phần 1 (slide 1–25)

- `kich_ban_phan1_Bao.md`: lời nói từng câu cho slide 1–25, kèm chỗ bấm →, chỗ chỉ, chỗ viết bảng, ảnh bảng trắng và mốc thời gian (≈ 24 phút).
- `video/out/trinh_bay_phan1.mp4`: video lớp học hoạt hình nói đúng kịch bản trên, để tập theo. Cách sửa và dựng lại: `video/README.md`.

## Công nghệ

- **Template:** engine slide của RMQ v2 (sân khấu 1920×1080 co giãn, lời dẫn π, bước hiện dần, tổng quan, ghi chú, tự chạy), chỉnh sang nền trắng.
- **[3b1b/manim](https://github.com/3b1b/manim) (ManimGL 1.7.2):** 7 video thuật toán trong `manim/scenes.py`.
- **KaTeX** (công thức, render sẵn lúc build), **D3** (biểu đồ), **GSAP** (chuyển động), **Three.js** (cây trò chơi 3D).
- **Nhân vật pixel** Agent (robot, phe xanh) và Đối thủ (mũ len, phe hồng) do nhóm tự vẽ trong `manim/sprites.py`; cùng một file sprite dùng cho cả web và video. Font pixel: Press Start 2P, VT323 (OFL).

## Thư mục

```
seminar/
├── deck/
│   ├── src/          slides/*.html, deck.css, engine.js, pi.js, widgets/*.js
│   ├── build.mjs     render KaTeX, nhúng font/CSS/JS/thư viện → dist/index.html
│   ├── package.json  phiên bản thư viện cố định
│   └── dist/         index.html (chiếu offline), media/*.mp4, media/posters/*.jpg
├── manim/            scenes.py, sprites.py → sprites.json, pi_shape.json, fonts/, render_all.sh, env.sh
├── tools/            audit.mjs (duyệt mọi bước, báo lỗi JS và tràn bố cục), probe.mjs, contact.py, export_script.mjs
├── present.sh
└── kich_ban.md       sinh từ ghi chú slide
```

## Tái lập

```bash
cd seminar

# 1. Thư viện cho deck (một lần)
cd deck && npm install && cd ..

# 2. Nhân vật pixel (chỉ khi sửa sprites.py)
python3 manim/sprites.py

# 3. Video manim: 1080p, khoảng 2 phút, ghi vào deck/dist/media
./manim/render_all.sh --hd          # hoặc: SCENES="M04_Minimax" ./manim/render_all.sh --hd

# 4. Deck và kịch bản
node deck/build.mjs
node tools/export_script.mjs

# 5. Kiểm tra: đi qua mọi bước trong Brave headless, chụp màn hình
node tools/audit.mjs /tmp/games1-audit --shots
# Chỉ chụp bước cuối mỗi slide, vẫn kiểm tra tất cả các bước:
node tools/audit.mjs /tmp/games1-audit --shots --last
```

`manim/env.sh` dùng venv của dự án RMQ (`/home/bao/Projects/RMQ/.venv`, có sẵn ManimGL 1.7.2) và tự dò thư viện OpenGL, X11, Pango trong Nix store.

Audit lưu `report.json` trong thư mục đầu ra và trả exit code 1 nếu có lỗi JavaScript, video hoặc bố cục. Phần chữ dùng các thuật ngữ agent, policy, state, action, utility, value và expected utility thống nhất trong deck và video.
