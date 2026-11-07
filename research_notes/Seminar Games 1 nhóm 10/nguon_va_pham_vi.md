# Nguồn và phạm vi: seminar "Games 1 (combined)" nhóm 10

Quy ước trích dẫn. Mọi nguồn đều là file cục bộ trong `/home/bao/Projects/Game1/docs`:

- `[g1 p.N]` = `games1.pdf`, trang PDF thứ N (97 trang). Số in ở chân slide khác số trang PDF: chân slide = trang PDF − 1 (p.3 in "2", p.97 in "96"). Ghi chú này luôn dùng trang PDF.
- `[L7 p.N]` = `cs188-sp26-lec07.pdf` (38 trang). `[N6 p.N]` = `cs188-fa23-note06.pdf` (7 trang). `[N7 p.N]` = `cs188-fa23-note07.pdf` (6 trang).
- `[X dòng N]` = `Danh sách nhóm CSAI.xlsx`, sheet "Trang tính 1".
- `[T1 ...]` = `ChatGPT-Nghiên cứu Game 1 AI-20261107-1016.md` (tham chiếu theo lượt trả lời R1/R2 và số mục). `[T2 LN]` = `ChatGPT_Tìm-tài-liệu-Games-1_20261107-1237.md`, dòng N. T1 và T2 là dữ liệu thứ cấp chưa kiểm chứng, không phải thẩm quyền.

Cách kiểm tra: đã render PNG toàn bộ 148 trang PDF. Đã xem trực tiếp bằng ảnh: mọi trang slide và trang trắng của `games1.pdf`, toàn bộ `L7`, `N6` p.2-6, toàn bộ `N7`. Các trang chữ thuần (trang ghi chú chẵn của `games1.pdf`, `N6` p.1 và p.7) chỉ đọc qua `pdftotext -layout`. Trích xuất văn bản sai hoặc thiếu ở ba chỗ, cần tránh khi viết: (a) số trang bị dồn nếu tách theo ký tự `\f` vì có 15 trang trắng; (b) `[g1 p.93]` công thức random ordering bị vỡ, mẫu số thật là 4; (c) `[L7 p.19]` lá cây là 10, 10, 9, 100 nhưng chữ số bị xuống dòng trên slide.

## Phân công chính thức trong file Excel là gì?

### Takeaway
File Excel xác nhận đúng phạm vi đề bài: nhóm 10 có 5 mục, nhóm 11 có 8 mục, cùng ngày 2026-11-09. File không có thời lượng, rubric hay hướng dẫn nào của giảng viên.

### Cited Findings
- Nhóm 10: Võ Nhất Bảo (24120166), Phạm Lê Huy Hoàng (24120182); ô I28 = 46335 = thứ Hai 2026-11-09; "Games 1 (combined)": Overview, Modeling, Game evaluation, Expectimax, Minimax — [X dòng 28-29].
- Nhóm 11: Huỳnh Bảo Khang (24120507), Phạm Minh Đạt (24120174); cùng ngày; "Games 2 (combined)": Expectiminimax, Evaluation functions, Alpha beta pruning, Recap, AI Misalignment, TD learning, Simultaneous games, Non-zero-sum games — [X dòng 30-31].
- Các nhóm liên quan, ngày đã quy đổi từ số serial Excel:

| Nhóm | Ngày | Module | Mục được giao | Nguồn |
|---|---|---|---|---|
| 7 | 2026-10-26 | Search 1 | Overview, Modeling, Tree search, Dynamic programming | X dòng 22 |
| 5 | 2026-10-26 | Search 2 | Uniform cost search, UCS correctness, Externalities and dual use technologies, Structured perceptron, A-star, A-star relaxations | X dòng 18 |
| 8 | 2026-11-02 | MDPs 1 | Overview, Modeling, Policy evaluation | X dòng 24 |
| 9 | 2026-11-02 | MDPs 2 | Value iteration, Reinforcement learning, Model-based Monte Carlo, Model-free Monte Carlo, SARSA, Q-learning | X dòng 26 |
| 12 | 2026-11-16 | CSPs 1 | Overview, Definitions, Examples | X dòng 32 |
| 13 | 2026-11-16 | CSPs 2 | Dynamic ordering, Arc consistency, Beam search, Local search | X dòng 34 |

- Tiêu đề file là "BẢNG ĐIỂM", lớp 24TN, Khoa CNTT, Trường ĐH Khoa học tự nhiên; có cột Điểm số, Điểm chữ, Nhóm, Modules — [X dòng 1-7]. Cột G (Điểm chữ) có giá trị "1" ở các dòng 14-25 (nhóm 3 đến 8), trống ở nhóm 1, 2 và từ nhóm 9 trở đi — [X dòng 10-53].
- XML của file: chỉ có 3 ô gộp (A1:C1, A2:C2, A3:H3), `drawing1.xml` rỗng, `person.xml` rỗng, không có bình luận — [X, nội dung gói xlsx].

### Inferences
- Ý nghĩa cột G chưa rõ, có thể là dấu đã trình bày hoặc điểm tạm. Không nên suy ra rubric từ đó.
- Khoảng cách cột giữa các mục (M, N, O, Q, S ở dòng 28) không có bằng chứng nào cho thấy là tỷ lệ thời lượng; không nên dùng để chia thời gian.

### Gaps
- File không nêu thời lượng, cách chấm, hay yêu cầu về slide.
- File không ghi chữ "Stanford" hay "CS221". Việc các module lấy từ CS221 là suy luận dựa trên `games1.pdf` có chân trang "CS221", không phải điều file khẳng định.

## games1.pdf: bảng từng trang và ranh giới phạm vi nằm ở đâu?

### Takeaway
Nhóm 10 sở hữu p.1-56, nhóm 11 sở hữu p.57-97. PDF **có chứa** tài liệu của nhóm 11 (Expectiminimax, Evaluation functions, Alpha-beta, Recap), chiếm 41/97 trang, nên không được coi cả file là phạm vi nhóm 10. Ranh giới sắc nét nhất là trang tiêu đề "Games: expectiminimax" ở p.57.

### Cited Findings
Phân bố theo mục:

| Mục | Chủ sở hữu | Trang PDF | Số trang | Ghi chú |
|---|---|---|---|---|
| Overview | Nhóm 10 | 1-8 | 8 | PDF không có đầu mục "Overview"; ánh xạ này là suy luận |
| Modeling | Nhóm 10 | 9-22 | 14 | Tiêu đề "Games: modeling" p.9 |
| Game evaluation | Nhóm 10 | 23-28 | 6 | Tiêu đề p.23 |
| Expectimax | Nhóm 10 | 29-34 | 6 | Tiêu đề p.29 |
| Minimax | Nhóm 10 | 35-56 | 22 | Tiêu đề p.35; gồm Face off và 3 properties |
| Expectiminimax | Nhóm 11 | 57-66 | 10 | Tiêu đề p.57 |
| Evaluation functions | Nhóm 11 | 67-80 | 14 | Tiêu đề p.67; gồm slide độ phức tạp p.69 |
| Alpha-beta pruning | Nhóm 11 | 81-94 | 14 | Tiêu đề p.81 |
| Recap | Nhóm 11 | 95-97 | 3 | Tiêu đề p.95 |

AI Misalignment không xuất hiện ở đâu trong PDF. TD learning, Simultaneous games, Non-Zero-Sum games chỉ xuất hiện dưới dạng tên trên Roadmap, không có nội dung — [g1 p.7].

Bảng từng trang. "Ghi chú" là trang chữ thuyết minh của slide liền trước. Trang trắng đã kiểm tra bằng độ lệch chuẩn ảnh bằng 0.

| Trang | Tiêu đề slide | Nội dung một dòng | Thuộc |
|---|---|---|---|
| 1 | Games I | Trang tiêu đề, ảnh Pacman | Overview |
| 2 | (trắng) | | |
| 3 | Course plan | Trục Reflex, States (Search, MDP, **Adversarial games** được đóng khung), Variables, Logic; Machine learning; Low-level đến High-level | Overview |
| 4 | Ghi chú | Games là testbed; có agent khác với utility không đồng thuận; chiến lược thường unknown và adversarial | Overview |
| 5 | A simple game | Game 1: ba bin A, B, C | Overview |
| 6 | Ghi chú | Chọn bin phụ thuộc mental model: hợp tác chọn A, đối kháng chọn B, ngẫu nhiên chọn C | Overview |
| 7 | Roadmap | Danh sách cả Games 1 và Games 2 | Overview (chỉ dùng 4 mục đầu) |
| 8 | (trắng) | | |
| 9 | Games: modeling | Trang tiêu đề mục | Modeling |
| 10 | (trắng) | | |
| 11 | Game tree | Key idea: node là điểm quyết định, đường gốc-lá là một outcome; cây bin | Modeling |
| 12 | Ghi chú | Game tree tương tự search; game graph có thể có nhưng thuật toán chạy trên cây | Modeling |
| 13 | Two-player zero-sum games | Định nghĩa hình thức 6 thành phần | Modeling |
| 14 | Ghi chú | Giới hạn: lần lượt, fully-observed; zero-sum; utility chỉ ở end states | Modeling |
| 15 | Example: chess | Mô hình hóa cờ vua, Utility +∞, 0, −∞ | Modeling |
| 16 | Ghi chú | White là agent; utility thường suy biến thành +∞, −∞, 0 | Modeling |
| 17 | Characteristics of games | Utility ở cuối; người điều khiển khác nhau ở các state | Modeling |
| 18 | Ghi chú | Hai đặc điểm làm game khó; so với search và MDP | Modeling |
| 19 | The halving game | Luật chơi; [semi-live solution: HalvingGame] | Modeling |
| 20 | (trắng) | | |
| 21 | Policies | Deterministic và stochastic policy; [humanPolicy] | Modeling |
| 22 | Ghi chú | π_p theo từng player; MDP là game giữa agent và nature | Modeling |
| 23 | Games: game evaluation | Trang tiêu đề mục | Game evaluation |
| 24 | (trắng) | | |
| 25 | Game evaluation example | π_agent(s)=A, π_opp=1/2; V_eval(s_start)=0 | Game evaluation |
| 26 | Ghi chú | Expected utility khi chơi hai policy nhiều lần; trung bình có trọng số | Game evaluation |
| 27 | Game evaluation recurrence | Analogy policy evaluation; công thức V_eval | Game evaluation |
| 28 | Ghi chú | Ba trường hợp của recurrence | Game evaluation |
| 29 | Games: expectimax | Trang tiêu đề mục | Expectimax |
| 30 | (trắng) | | |
| 31 | Expectimax example | π_opp=1/2; V_exptmax(s_start)=5 | Expectimax |
| 32 | Ghi chú | Từ đánh giá sang tìm policy tốt nhất; max node △ | Expectimax |
| 33 | Expectimax recurrence | Analogy value iteration; công thức V_exptmax | Expectimax |
| 34 | Ghi chú | Khác V_eval chỗ max; evaluation ứng policy evaluation, expectimax ứng value iteration | Expectimax |
| 35 | Games: minimax | Trang tiêu đề mục | Minimax |
| 36 | (trắng) | | |
| 37 | (không tiêu đề) | Problem: don't know opponent's policy; Approach: assume the worst case | Minimax |
| 38 | (trắng) | | |
| 39 | Minimax example | V_minmax(s_start)=1 | Minimax |
| 40 | Ghi chú | Worst case; min node ▽; policy đổi từ phải sang giữa, "Why is this?" | Minimax |
| 41 | Minimax recurrence | "No analogy in MDPs"; công thức V_minmax | Minimax |
| 42 | Ghi chú | Min thay expectation; không phụ thuộc policy nào | Minimax |
| 43 | Extracting minimax policies | arg max và arg min trên V_minmax | Minimax |
| 44 | Ghi chú | Value function cho biết state tốt; cần biết transition | Minimax |
| 45 | The halving game | Lặp lại luật; [minimaxPolicy] | Minimax |
| 46 | (trắng) | | |
| 47 | Face off | Bảng 2x2 policy; "What's the relationship between these values?" | Minimax |
| 48 | Ghi chú | V(π_agent, π_opp) tính qua game evaluation | Minimax |
| 49 | Minimax property 1 | Best against minimax opponent | Minimax |
| 50 | Ghi chú | Chứng minh bằng quy nạp từ lá | Minimax |
| 51 | Minimax property 2 | Lower bound against any opponent | Minimax |
| 52 | Ghi chú | Bảo đảm tối thiểu; minimax value +∞ nghĩa là chắc thắng | Minimax |
| 53 | Minimax property 3 | Not optimal if opponent is known | Minimax |
| 54 | Ghi chú | Ví dụ π_7 ngẫu nhiên: 2 so với 5 | Minimax |
| 55 | Relationship between game values | Bảng 1, 2, −5, 5 | Minimax |
| 56 | Ghi chú | Ghép ba tính chất thành chuỗi bất đẳng thức | Minimax |
| 57 | Games: expectiminimax | Trang tiêu đề | OUT, nhóm 11 |
| 58 | (trắng) | | |
| 59 | A modified game | Game 2: tung đồng xu, dịch bin | OUT, nhóm 11 |
| 60 | Ghi chú | Yếu tố ngẫu nhiên không từ hai người chơi | OUT, nhóm 11 |
| 61 | Expectiminimax example | −27.5, −24.5, −2; V=−2 | OUT, nhóm 11 |
| 62 | Ghi chú | Policy chuyển sang hành động phải | OUT, nhóm 11 |
| 63 | Expectiminimax recurrence | Players = {agent, opp, coin} | OUT, nhóm 11 |
| 64 | Ghi chú | Coin là ẩn dụ cho ngẫu nhiên tự nhiên | OUT, nhóm 11 |
| 65 | Summary so far | Primitives max, chance, min; composition; scenarios | OUT, nhóm 11 |
| 66 | Ghi chú | Hai bên max-min cùng player có policy cố định | OUT, nhóm 11 |
| 67 | Games: evaluation functions | Trang tiêu đề | OUT, nhóm 11 |
| 68 | (trắng) | | |
| 69 | Computation | Tree search; O(d) space, O(b^{2d}) time; chess b≈35, d≈50 | OUT, nhóm 11 (vùng xám, xem bẫy) |
| 70 | Ghi chú | Không dùng được DP; thuật ngữ depth và ply; go b tới 361 | OUT, nhóm 11 (vùng xám) |
| 71 | Speeding up minimax | Evaluation functions và alpha-beta | OUT, nhóm 11 |
| 72 | Ghi chú | Dẫn sang hai ý tưởng | OUT, nhóm 11 |
| 73 | Depth-limited search | V_minmax(s,d), d_max | OUT, nhóm 11 |
| 74 | (trắng) | | |
| 75 | Evaluation functions | Định nghĩa Eval(s) | OUT, nhóm 11 |
| 76 | Ghi chú | d_max=4, D=50; giảm d chỉ ở min node | OUT, nhóm 11 |
| 77 | Evaluation functions | Ví dụ cờ vua | OUT, nhóm 11 |
| 78 | Ghi chú | Domain knowledge | OUT, nhóm 11 |
| 79 | Summary: evaluation functions | O(b^{2d}), không bảo đảm sai số | OUT, nhóm 11 |
| 80 | Ghi chú | Tóm tắt | OUT, nhóm 11 |
| 81 | Games: alpha-beta pruning | Trang tiêu đề | OUT, nhóm 11 |
| 82 | (trắng) | | |
| 83 | Pruning principle | Branch and bound; A:[3,5], B:[5,100] | OUT, nhóm 11 |
| 84 | Ghi chú | Khoảng không chồng lấn | OUT, nhóm 11 |
| 85 | Pruning game trees | Lá 3, 5, 2, 10; gốc 3 | OUT, nhóm 11 |
| 86 | Ghi chú | Cắt phần còn lại của nhánh phải | OUT, nhóm 11 |
| 87 | Alpha-beta pruning | Optimal path; a_s, b_s, α_s, β_s | OUT, nhóm 11 |
| 88 | Ghi chú | Chi tiết cài đặt | OUT, nhóm 11 |
| 89 | Alpha-beta pruning example | Lá 9, 7, 6, 3, 4, 7, 9, 8, 3 | OUT, nhóm 11 |
| 90 | (trắng) | | |
| 91 | Move ordering | Lá 2, 10, 3, 5; không cắt được nút 5 | OUT, nhóm 11 |
| 92 | Ghi chú | Tiết kiệm phụ thuộc thứ tự | OUT, nhóm 11 |
| 93 | Move ordering | Công thức worst, best, random | OUT, nhóm 11 |
| 94 | Ghi chú | Độ sâu 10 thành 20; random sâu thêm 33 phần trăm | OUT, nhóm 11 |
| 95 | Games: recap | Trang tiêu đề | OUT, nhóm 11 |
| 96 | (trắng) | | |
| 97 | Summary | Game trees, Minimax, Evaluation functions, Alpha-beta | OUT, nhóm 11 |

Trang trắng: 2, 8, 10, 20, 24, 30, 36, 38, 46, 58, 68, 74, 82, 90, 96 (15 trang).

### Inferences
- Nhóm 10 không có slide tổng kết sẵn trong PDF: "Summary so far" (p.65) nằm trong mục Expectiminimax và "Summary" (p.97) thuộc Recap. Nhóm phải tự viết phần kết, nên chốt bằng bảng p.55 thay vì tái sử dụng p.97.
- Roadmap p.7 hiển thị cả mục nhóm 11; nếu dùng lại phải cắt còn Modeling Games, Game Evaluation, Expectimax, Minimax.
- "Overview" = p.1-8 là suy luận từ thứ tự trước trang "Games: modeling"; có thể gộp thêm "Characteristics of games" (p.17) vào phần mở đầu vì nó giải thích vì sao game khó, nhưng trong PDF nó thuộc Modeling.

### Gaps
- Không xác định được `games1.pdf` cục bộ là bản của năm nào: PDF không ghi năm. T2 và T1 nêu các URL bản 2023 và 2024 nhưng chưa đối chiếu được ở đây.
- Các "semi-live solution" (p.19, 21, 45) chỉ là tên; PDF không kèm code.

## games1.pdf: định nghĩa, công thức, ví dụ và số liệu nguyên văn của phần trong phạm vi là gì?

### Takeaway
PDF cho đủ định nghĩa, 3 recurrence, công thức trích policy, 3 mệnh đề và một ví dụ số xuyên suốt (ba bin), nhưng **không có pseudocode, không có lời giải số cho Halving game và không có chứng minh đầy đủ**. Pseudocode phải lấy từ CS188.

### Cited Findings

**Overview**
- Nguyên văn: "Games are distinguished from the other tasks that we've considered so far in this class in that they make explicit the presence of other agents, whose utility is not generally aligned with ours. Thus, the optimal strategy (policy) for us will depend on the strategies of these agents. Moreover, their strategies are often unknown and adversarial." — [g1 p.4]
- Game 1, nguyên văn: "You choose one of the three bins. I choose a number from that bin. Your goal is to maximize the chosen number." Bin A: −50, 50. Bin B: 1, 3. Bin C: −5, 15 — [g1 p.5]
- Phân tích: "If you think I'm working with you (unlikely), then you should pick A in hopes of getting 50. If you think I'm against you (likely), then you should pick B as to guard against the worst case (get 1). If you think I'm just acting uniformly at random, then you should pick C so that on average things are reasonable (get 5 in expectation)." — [g1 p.6]

**Modeling**
- Game tree: "Each node is a decision point for a player. Each root-to-leaf path is a possible outcome of the game." Cây 3 nhánh với lá −50, 50, 1, 3, −5, 15 — [g1 p.11]
- Game graph: "all our algorithms will operate on the tree rather than the graph since games generally have enormous state spaces, and we will have to resort to algorithms similar to backtracking search for search problems." — [g1 p.12]
- Định nghĩa: Players = {agent, opp}. "Definition: two-player zero-sum game": s_start: starting state; Actions(s): possible actions from state s; Succ(s, a): resulting state if choose action a in state s; IsEnd(s): whether s is an end state (game over); Utility(s): agent's utility for end state s; Player(s) ∈ Players: player who controls state s — [g1 p.13]. Hai dòng cuối in đỏ, đánh dấu phần khác với search và MDP — [g1 p.13, ảnh].
- Giới hạn lớp game: "games in which people take turns (unlike rock-paper-scissors) and where the state of the game is fully-observed (unlike poker...)". "Zero-sum means that the utility of the agent is negative the utility of the opponent (equivalently, the sum of the two utilities is zero)." "deterministic successor state for each state-action pair" — [g1 p.14]
- Utility chỉ ở cuối: "instead of having edge costs in search problems or rewards in MDPs, we will instead have a utility function Utility(s) defined only at the end states. We could have used edge costs and rewards for games (in fact, that's strictly more general)... You don't get utility for capturing pieces in chess; you only get utility if you win the game. This ultra-delayed utility makes games hard." — [g1 p.14]
- Chess: Players = {white, black}; State s: (position of all pieces, whose turn it is); Actions(s): legal chess moves that Player(s) can make; IsEnd(s): whether s is checkmate or draw; Utility(s): +∞ if white wins, 0 if draw, −∞ if black wins — [g1 p.15]. "white is the agent and black is the opponent"; "the utility is degenerate in that it will be +∞, −∞, or 0" — [g1 p.16]
- Characteristics: "All the utility is at the end state"; "Different players in control at different states" — [g1 p.17]. "In search problems, you (the agent) controlled all actions. In MDPs, we already hinted at the loss of control where nature controlled the chance nodes... Now, we have another player that controls certain states, who is probably out to get us." — [g1 p.18]
- Halving game: "Start with a number N. Players take turns either decrementing N or replacing it with ⌊N/2⌋. The player that is left with 0 wins." — [g1 p.19, p.45]
- Policies: "Deterministic policies: π_p(s) ∈ Actions(s), action that player p takes in state s"; "Stochastic policies π_p(s, a) ∈ [0, 1]: probability of player p taking action a in state s" — [g1 p.21]
- MDP là game: "We can think of an MDP as a game between the agent and nature... π_nature((s, a), s') = T(s, a, s')." — [g1 p.22]

**Game evaluation**
- Ví dụ: π_agent(s) = A; π_opp(s, a) = 1/2 for a ∈ Actions(s). Cạnh gốc (1), (0), (0); cạnh dưới (0.5). Giá trị nút 0, 2, 5; gốc 0. V_eval(s_start) = 0 — [g1 p.25, ảnh]
- Phép tính: ½(−50)+½(50)=0; ½(1)+½(3)=2; ½(−5)+½(15)=5; gốc 1·0+0·2+0·5=0 — [g1 p.25, kiểm lại bằng tính toán]
- Câu hỏi: "Given two policies π_agent and π_opp, what is the (agent's) expected utility? That is, if the agent and the opponent were to play their (possibly stochastic) policies a large number of times, what would be the average utility?" — [g1 p.26]
- Recurrence, kèm "Analogy: recurrence for policy evaluation in MDPs" — [g1 p.27]:
```
V_eval(s) = Utility(s)                                        IsEnd(s)
          = Σ_{a∈Actions(s)} π_agent(s,a) V_eval(Succ(s,a))   Player(s) = agent
          = Σ_{a∈Actions(s)} π_opp(s,a)   V_eval(Succ(s,a))   Player(s) = opp
```

**Expectimax**
- Ví dụ: π_opp(s, a) = 1/2. Nút chance 0, 2, 5; gốc max = 5, cạnh đỏ sang C. V_exptmax(s_start) = 5 — [g1 p.31, ảnh]
- Nguyên văn: "This computation produces the expectimax value V_exptmax(s) for a state s, which is the maximum expected utility of any agent policy when playing with respect to a fixed and known opponent policy π_opp." — [g1 p.32]
- Recurrence, kèm "Analogy: recurrence for value iteration in MDPs" — [g1 p.33]:
```
V_exptmax(s) = Utility(s)                                          IsEnd(s)
             = max_{a∈Actions(s)} V_exptmax(Succ(s,a))             Player(s) = agent
             = Σ_{a∈Actions(s)} π_opp(s,a) V_exptmax(Succ(s,a))    Player(s) = opp
```
- "Where game evaluation was the analogue of policy evaluation for MDPs, expectimax is the analogue of value iteration." — [g1 p.34]

**Minimax**
- "Problem: don't know opponent's policy. Approach: assume the worst case" — [g1 p.37]
- Ví dụ: nút min −50, 1, −5; gốc max = 1, cạnh đỏ vào B. V_minmax(s_start) = 1 — [g1 p.39, ảnh]
- "Note that the policy for the agent changes from choosing the rightmost action (expectimax) to the middle action. Why is this?" — [g1 p.40]
- Recurrence, kèm "No analogy in MDPs" — [g1 p.41]:
```
V_minmax(s) = Utility(s)                              IsEnd(s)
            = max_{a∈Actions(s)} V_minmax(Succ(s,a))  Player(s) = agent
            = min_{a∈Actions(s)} V_minmax(Succ(s,a))  Player(s) = opp
```
- "the minimax value does not depend on any policies at all: it's just the agent and opponent playing optimally with respect to each other." — [g1 p.42]
- Trích policy: π_max(s) = arg max_{a∈Actions(s)} V_minmax(Succ(s,a)); π_min(s) = arg min_{a∈Actions(s)} V_minmax(Succ(s,a)) — [g1 p.43]. "(provided you know the transition structure, which we assume we know here)" — [g1 p.44]
- Face off: V_exptmax ⇒ π_exptmax(7), π_7 (some opponent); V_minmax ⇒ π_max, π_min. "What's the relationship between these values?" — [g1 p.47]. "say π_7 for concreteness" — [g1 p.48]
- Property 1, "best against minimax opponent": V(π_max, π_min) ≥ V(π_agent, π_min) for all π_agent. Chứng minh chỉ nêu ý: "we can perform induction starting from the leaves of the game tree" — [g1 p.49-50]
- Property 2, "lower bound against any opponent": V(π_max, π_min) ≤ V(π_max, π_opp) for all π_opp. "if we get a minimax value of 1, that means no matter what the opponent does, the agent is guaranteed at least a value of 1... if the minimax value is +∞, then the agent is guaranteed to win, provided it follows the minimax policy." — [g1 p.51-52]
- Property 3, "not optimal if opponent is known": V(π_max, π_7) ≤ V(π_exptmax(7), π_7) for opponent π_7. "Then the game value here would be 2 (which is larger than the minimax value 1, as guaranteed by property 2). However, if we followed the expectimax π_exptmax(7), then we would have gotten a value of 5" — [g1 p.53-54]
- Bảng tổng hợp, lấy từ ảnh vì đây là số liệu quan trọng nhất của bài — [g1 p.55]:

| | π_min | | π_7 |
|---|---|---|---|
| π_max | V(π_max, π_min) = **1** | ≤ | V(π_max, π_7) = **2** |
| | ≥ | | ≤ |
| π_exptmax(7) | V(π_exptmax(7), π_min) = **−5** | | V(π_exptmax(7), π_7) = **5** |

Bảng tra tổng hợp ba bin (giá trị trên suy từ p.5, 25, 31, 39, 55):

| Bin | Lá | min | trung bình ½-½ | max |
|---|---|---|---|---|
| A | −50, 50 | −50 | 0 | 50 |
| B | 1, 3 | **1** | 2 | 3 |
| C | −5, 15 | −5 | **5** | 15 |

**Không có trong PDF**: từ "pseudocode", "backward induction", "maximin", "Game Theory", "adversarial search", "Bellman", "Nash" đều có 0 kết quả tìm kiếm trong `games1.pdf` — [g1, grep toàn văn]. Cách diễn đạt gần với "backward induction" nhất trong PDF là "induction starting from the leaves" — [g1 p.50].

**Số liệu ngoài phạm vi (chỉ để nhận diện)**: −27.5, −24.5, −2 — [g1 p.61]; số 155 chữ số là 35^100 (đã kiểm bằng tính toán), chess b≈35, d≈50 — [g1 p.69]; go b tới 361, depth tới 100 — [g1 p.70]; d_max=4, D=50 — [g1 p.76]; material 10^100(K−K')+9(Q−Q')+5(R−R')+3(B−B'+N−N')+1(P−P'), mobility 0.1 — [g1 p.77]; A:[3,5], B:[5,100] — [g1 p.83]; lá 3,5,2,10 — [g1 p.85]; ≥6, ≤8, ≥3, ≤5 — [g1 p.87]; best O((√(b−3/4)+1/2)^{2·d}) ≃ O(b^{2·0.5d}), random O(b^{2·0.75d}) khi b=2, random O(((b−1+√(b²+14b+1))/4)^{2·d}) — [g1 p.93, ảnh].

### Inferences
- Lời giải Halving tự tính, **không có trong tài liệu**, với cách hiểu "player left with 0" là người đến lượt khi N=0. Người đến lượt thua khi N ∈ {1, 4, 6, 10, 14, 16, 18, 22, 24} (xét tới N=25). Nước thắng: N=2 cả hai, 3 '/', 5 '−', 7 '−', 8 '/', 9 '/', 11 '−', 12 '/', 13 '/', 15 '−', 17 '−', 19 '−', 20 '/', 21 '/', 23 '−', 25 '−'.
- Câu chữ p.19 có thể bị hiểu ngược (người đưa N về 0 thắng), khi đó kết quả đảo. Phải chốt cách hiểu trên slide trước khi trình bày.
- Trong bảng p.55 chỉ ba quan hệ có tên mệnh đề; PDF không nêu quan hệ chéo giữa −5 và 5.
- Với Utility = ±∞ (p.15), kỳ vọng dưới policy ngẫu nhiên có thể rơi vào dạng ∞−∞. Ví dụ cho V_eval và V_exptmax nên dùng utility hữu hạn như ba bin hoặc +1/0/−1.
- "Minimax không có analogy trong MDP" (p.41) cần nói cùng với lý do: MDP chỉ có một người tối ưu đối đầu nature có phân phối đã biết, còn min node chọn theo giá trị.

### Gaps
- Không có chứng minh hoàn chỉnh của Property 1-3 trong tài liệu.
- Không có độ phức tạp của Expectimax trong `games1.pdf`.
- Quy ước thắng thua của Halving nên đối chiếu với code `games.py` mà T2 nhắc tới (chưa kiểm chứng, nằm ngoài docs).

## cs188-sp26-lec07, note06, note07: phần nào trong phạm vi và có thêm gì so với games1.pdf?

### Takeaway
Ba file CS188 bổ sung thứ `games1.pdf` thiếu: **pseudocode, tic-tac-toe, Pacman, cây 3-12-8, ví dụ expectimax 1/3, và lịch sử game AI**. Nhưng chúng không có Game evaluation, và khoảng một nửa nội dung thuộc nhóm 11 hoặc không thuộc nhóm nào. `L7` hoàn toàn không dạy Expectimax.

### Cited Findings

**cs188-sp26-lec07.pdf**

| Trang | Tiêu đề | Nội dung và số liệu | Thuộc |
|---|---|---|---|
| 1 | CS 188: AI, Adversarial Search | Trang bìa | Overview |
| 2 | Game Playing State-of-the-Art | Checkers 1950, 1994 Chinook, Marion Tinsley 40 năm, 8-piece endgame, 2007 solved. Chess 1997 Deep Blue, 200M positions/s, tới 40 ply | Overview |
| 3 | như trên, thêm | Go 2016 AlphaGo, MCTS, learned eval; "Pacman?"; biểu đồ A brick, Human, Expert, Solved | Overview (chỉ nhắc) |
| 4 | Behavior from Computation | Demo mystery pacman (L6D1) | Overview |
| 5 | Adversarial Games | Trang chuyển mục | Overview |
| 6 | Types of Games | Trục: Deterministic/stochastic; số người; Zero sum; Perfect information; strategy (policy) | Overview/Modeling |
| 7 | Deterministic Games | S, s0; P={1...N}; A; S×A→S; S→{t,f}; S×P→R; policy S→A | Modeling |
| 8 | Zero-Sum Games | Zero-sum (trong phạm vi) so với General Games (nhóm 11) | Modeling, một phần OUT |
| 9 | Adversarial Search | Trang chuyển mục | Minimax |
| 10 | Single-Agent Trees | Lá 2, 0, ..., 2, 6, ..., 4, 6, và 8 | Minimax (cầu nối) |
| 11 | Value of a State | "The best achievable outcome (utility) from that state"; V(s)=max_{s'∈children(s)} V(s'); terminal V(s)=known | Minimax |
| 12 | Adversarial Game Trees | Lá −20, −8, ..., −18, −5, ..., −10, +4, −20, +8 | Minimax |
| 13 | Minimax Values | V(s)=max_{s'∈successors(s)}V(s'); V(s')=min_{s∈successors(s')}V(s); lá −8, −5, −10, +8 | Minimax |
| 14 | Tic-Tac-Toe Game Tree | MAX(X), MIN(O); Utility −1, 0, +1 | Modeling/Minimax |
| 15 | Adversarial Search (Minimax) | Lá 8, 2, 5, 6; min 2, 5; gốc 5; "best achievable utility against a rational (optimal) adversary" | Minimax |
| 16 | Minimax Implementation | Pseudocode max-value, min-value gọi chéo | Minimax |
| 17 | Minimax Implementation (Dispatch) | Pseudocode value + max-value, min-value | Minimax |
| 18 | Minimax Example | Lá 3, 12, 8 / 2, 4, 6 / 14, 5, 2 (chưa điền giá trị) | Minimax |
| 19 | Minimax Properties | Lá 10, 10, 9, 100; "Optimal against a perfect player. Otherwise?"; demo min vs exp | Minimax |
| 20 | Minimax Efficiency | "Just like (exhaustive) DFS"; Time O(b^m); Space O(bm); chess b≈35, m≈100 | Minimax (vùng xám) |
| 21-28 | Pruning, Alpha-Beta, Quiz | Cây cắt nhánh; α, β; quiz lá 10,8,4,50; quiz 2 lá 10,6,100,8,1,2,20,4; O(b^{m/2}) | OUT, nhóm 11 |
| 29-32 | Resource Limits, Why Pacman Starves | 100 s, 10K nodes/s, 1M nodes/move, α-β tới depth 8; thrashing | OUT, nhóm 11 |
| 33-37 | Evaluation Functions, Depth Matters, Synergies | Eval tuyến tính theo features; tương tác với α-β | OUT, nhóm 11 |
| 38 | Next Time: Uncertainty! | Chỉ một dòng | Cầu nối, không có nội dung |

Pseudocode nguyên văn — [L7 p.16-17], cũng in trong [N6 p.5]:
```
def value(state):
    if the state is a terminal state: return the state's utility
    if the next agent is MAX: return max-value(state)
    if the next agent is MIN: return min-value(state)

def max-value(state):                     def min-value(state):
    initialize v = -∞                         initialize v = +∞
    for each successor of state:              for each successor of state:
        v = max(v, value(successor))              v = min(v, value(successor))
    return v                                  return v
```
[N6 p.5] viết "if the agent is MAX/MIN" thay vì "if the next agent is". [L7 p.16] là bản không dispatch: max-value gọi min-value(successor) và ngược lại.

**cs188-fa23-note06.pdf**

| Trang | Nội dung | Thuộc |
|---|---|---|
| 1 | Games: phân loại; deterministic zero-sum; Pacman score; Checkers 1950, solved; Chess 1997, 200 million positions/s; Go, AlphaGo thắng "Lee Sodol" 4-1, tháng 3/2016 | Overview |
| 2 | Biểu đồ; strategy/policy; "behavior through computation"; định nghĩa formulation; mở đầu Minimax; bàn Pacman: bắt đầu 10 điểm, mất 1 mỗi bước | Overview, Modeling, Minimax |
| 3 | Cây single-agent; đi thẳng được 8; con phải 8, con trái 6; V(s)=max, terminal known; bàn có ghost | Minimax |
| 4 | Cây depth-2, spoofed −8, −5, −10, +8; min(−8,−5)=−8; min(−10,+8)=−10; max(−8,−10)=−8; Pacman đi trái; công thức 3 dòng | Minimax |
| 5 | Postorder traversal, pseudocode; từ "Alpha-Beta Pruning" trở đi OUT; có O(b^m), b≈35, m≈100; cây 3,12,8 / 2,4,6 / 14,5,2 với min 3, 2, 2, gốc 3 | Minimax (nửa trên), OUT nhóm 11 |
| 6 | Tiếp alpha-beta, O(b^{m/2}), Evaluation Functions | OUT, nhóm 11 |
| 7 | Eval(s)=w1f1+...+wnfn; ví dụ checkers 2·agent_kings+agent_pawns−2·opponent_kings−opponent_pawns | OUT, nhóm 11 |

Công thức — [N6 p.4]: ∀ agent-controlled states, V(s)=max_{s'∈successors(s)}V(s'); ∀ opponent-controlled states, V(s)=min_{s'∈successors(s)}V(s'); ∀ terminal states, V(s)=known.

Formulation nguyên văn — [N6 p.2]: Initial state s0; Players, Players(s) denote whose turn is; Actions, Actions(s) available actions for the player; Transition model Result(s,a); Terminal test, Terminal−test(s); Terminal values, Utility(s,player).

Giải thích đáng dùng: "though Pacman wants the score of +8 he can get if he ends up in the rightmost child state, through minimax he 'knows' that an optimally-performing ghost will not allow him to have it." — [N6 p.4]

**cs188-fa23-note07.pdf**

| Trang | Nội dung | Thuộc |
|---|---|---|
| 1 | Expectimax: minimax "overly pessimistic"; chance nodes; công thức; "minimax is simply a special case of expectimax" | Expectimax |
| 2 | Pseudocode exp-value; cây 3,12,9 / 2,4,6 / 15,6,0 với p=1/3: chance 8, 4, 7; gốc 8 | Expectimax |
| 3 | Không cắt nhánh được ở chance node (Expectimax); Mixed Layer Types (OUT phần có chance + min); Monte Carlo Tree Search | Một phần Expectimax; còn lại OUT |
| 4 | MCTS: 57/100, 39/100, 65/100; 77/140, 0/10, 90/150; 61/100, 6/10, 48/100 | OUT, không nhóm nào được giao |
| 5 | UCB1(n)=U(n)/N(n)+C×√(log N(PARENT(n))/N(n)); UCT; General Games | OUT |
| 6 | Cây tuple kết quả (5,2,5); Summary so sánh Minimax và Expectimax | OUT phần general games; Summary trong phạm vi |

Công thức — [N7 p.1]: ∀ agent-controlled states, V(s)=max_{s'∈successors(s)}V(s'); ∀ chance states, V(s)=Σ_{s'∈successors(s)} p(s'|s)V(s'); ∀ terminal states, V(s)=known. p(s'|s) "refers to either the probability that a given nondeterministic action results in moving from state s to s', or the probability that an opponent chooses an action..."

Pseudocode nguyên văn, đọc từ ảnh — [N7 p.2]:
```
def value(state):
    if the state is a terminal state: return the state's utility
    if the agent is MAX: return max-value(state)
    if the agent is EXP: return exp-value(state)

def max-value(state):                 def exp-value(state):
    initialize v = -∞                     initialize v = 0
    for each successor of state:          for each successor of state:
        v = max(v, value(successor))          p = probability(successor)
    return v                                  v += p * value(successor)
                                          return v
```

Câu chốt hữu ích — [N7 p.6]: "Minimax provides more conservative actions than expectimax, and so tends to yield favorable results when the opponent is unknown as well." và Expectimax "Used when we facing a suboptimal opponent(s), using a probability distribution over the moves we believe they will make".

Không cắt nhánh: "a single value can skew the expected value computed by expectimax arbitrarily high or low. However, pruning can be possible when we have known, finite bounds on possible node values." — [N7 p.3]

**So với `games1.pdf`, CS188 có thêm**: lịch sử game AI ([L7 p.2-3], [N6 p.1]); trục phân loại ([L7 p.6]); tic-tac-toe ([L7 p.14]); Pacman single-agent và với ghost ([L7 p.10-13], [N6 p.2-4]); pseudocode ([L7 p.16-17], [N6 p.5], [N7 p.2]); postorder traversal ([N6 p.5]); cây 8-2-5-6 ([L7 p.15]); cây 3-12-8 ([L7 p.18]); cây 10-10-9-100 ([L7 p.19]); ví dụ expectimax 1/3 ([N7 p.2]); O(b^m), O(bm) ([L7 p.20]).

**CS188 không có**: Game evaluation với cặp policy cố định, Face off, 3 mệnh đề, bảng 1/2/−5/5, Halving game, phép tương tự policy evaluation và value iteration — [L7, N6, N7, toàn văn].

**Bất nhất nội bộ của tài liệu CS188**:
- "minimax will return an action" nhưng pseudocode in ngay dưới chỉ `return v` — [N6 p.5].
- [L7 p.13] dùng V(s') cho nút min, đổi tên biến so với [N6 p.4]. Không nên chép nguyên.
- [N7 p.6] viết các nút theo thứ tự "red, green, blue" nhưng tuple in theo màu đỏ, xanh dương, xanh lá; (5,2,5) chỉ đúng theo thứ tự in trên hình (đã tính lại).

### Inferences
- `N7` dạy Expectimax theo góc "tổng quát hóa minimax", ngược thứ tự của `games1.pdf`. Nếu dùng ví dụ 3,12,9 nên giữ ký hiệu chung và không chép mạch bài.
- Ví dụ `[N7 p.2]` có thể làm bài tập nhanh cho khán giả vì khác số với ba bin.
- Cả `[L7 p.20]` và `[N6 p.5]` xếp độ phức tạp minimax ngay sát phần minimax, trong khi `[g1 p.69]` xếp vào mục nhóm 11. Đây là lý do cho phép một câu về độ phức tạp ở cuối phần nhóm 10.
- Chính tả tên riêng: tài liệu in "Gary Kasparov" và "Lee Sodol"; dạng thường gặp là Garry Kasparov và Lee Sedol. Nên kiểm lại với nguồn ngoài trước khi đưa lên slide.

### Gaps
- Không file nào cho độ phức tạp của Expectimax hay chứng minh hình thức. `[N7 p.3]` chỉ nói phải xét mọi con của chance node.
- Các demo "L6D1", "L6D2", "L6D3" chỉ là nhãn, không có video kèm theo trong docs.

## Hai transcript ChatGPT: người dùng hỏi gì, chốt gì, khẳng định gì và sai ở đâu?

### Takeaway
Không có giới hạn thời gian, rubric, hay chỉ thị nguyên văn của giảng viên trong cả hai transcript. Không có outline nào được người dùng chốt: ChatGPT đưa ra nhiều phương án, và các phương án sau trượt dần sang phạm vi nhóm 11. Thứ gần nhất với yêu cầu của giảng viên là một câu thuật lại của người dùng và một ảnh tóm tắt không rõ nguồn.

### Cited Findings

**Người dùng đã hỏi gì**

T1 (2026-11-07, 09:34-10:15), hai lượt:
1. Tìm mọi nguồn cho Game 1 (overview, modeling, Game evaluation, Expectimax, Minimax), kèm video `SMOD_GiRzb8` — [T1 Prompt 1].
2. Gửi ảnh và yêu cầu "tìm ra các nguồn liên quan giải thích theo yêu cầu của thầy" — [T1 Prompt 2]. Ảnh không được nhúng trong file, chỉ có URL nội bộ chatgpt.com.

T2 (2026-11-06 14:07 đến 2026-11-07 12:33), 14 lượt:

| Thời điểm | Câu hỏi | Dòng |
|---|---|---|
| 11-06 14:07 | Tìm video và tài liệu chi tiết, "đủ mở rộng vấn đề sang tối ưu tìm kiếm" | T2 L5-7 |
| 14:19 | Có thuộc RL không | L253-255 |
| 15:12 | Giải thích ảnh Property 3 | L313-317 |
| 15:23 | Giải thích ảnh bảng Putting everything together | L488-492 |
| 16:57 | Tìm video về thế lưỡng nan tù nhân | L663-665 |
| 17:00 | Video Veritasium có dùng được không | L722-725 |
| 17:05 | Đưa vào mở đầu có lạc đề không | L886-894 |
| 17:07 | Minimax có áp dụng cho trò chơi đồng thời không | L956-958 |
| 17:11 | Tìm video khác trên kênh Veritasium | L1078-1081 |
| 11-07 09:34 | Trò chơi zero-sum nào visualize ấn tượng | L1219-1221 |
| 09:39 | Nội dung seminar nhóm 10 gồm những gì | L1341-1343 |
| 10:13 | Xem ảnh và research phần trình bày | L1579-1583 |
| 10:23 | Ảnh về Heuristic và CSP | L1933-1937 |
| 12:33 | Nội dung video `3pU-Hrz_xy4` | L2113-2116 |

**Giới hạn thời gian, rubric, chỉ thị giảng viên**
- Thời lượng: không có số nào từ giảng viên. Các con số đều là đề xuất của ChatGPT: "Nếu chưa có giới hạn về thời gian... khoảng 15 slide" — [T1 R1 §7]; "khoảng 45–60 phút, có thể điều chỉnh theo thời lượng thầy cho phép" — [T2 L178]; "khoảng 40–50 phút", "Khoảng 45 phút" — [T2 L1644-1648]. Bảng ở T2 L180-188 cộng lại 54 phút.
- Rubric: không có. Chỉ có câu giả định "Nếu seminar được đánh giá nặng về thuật toán và chứng minh" — [T2 L950].
- Chỉ thị do người dùng thuật lại: "Thầy tôi có yêu cầu là khi trình bày về nội dung này thì cần làm thật kĩ và hiểu được trọng tâm, cũng như hiểu được ý nghĩa đằng sau hướng đi này, như bài toán tìm đường đi nhắn nhất thì cũng là bài toán tìm nghiệm, giải gì gì đó chư không hẳn là bài tìm đường đi" — [T1 Prompt 1].
- Ảnh tóm tắt nhúng trong T2, đã xem trực tiếp — [T2 L1581, L1935]. Ảnh mở đầu bằng "theo đúng các phân tích và dặn dò của thầy trong buổi học", gồm:
  - Mục 1: quy bài toán/game về "tìm kiếm trên đồ thị không gian trạng thái"; "Lời giải là đường đi"; "Có bao nhiêu đường đi hợp lệ thì có bấy nhiêu lời giải"; đường tổng chi phí nhỏ nhất là lời giải tối ưu.
  - Mục 2: ba thành phần A giả thiết (S0), B kết luận (Sn), phép chuyển (→); suy diễn tiến và suy diễn lùi.
  - Mục 4: độ đo Δ/heuristic, "Mỗi hành động được chọn phải làm giảm dần độ khác biệt này về 0"; đưa ràng buộc vào sớm (CSP) ngay từ bước mở rộng trạng thái đầu tiên.
  - Mục 3 không có trong ảnh nào.

**Các outline ChatGPT đề xuất (chưa ai chốt)**

| Nguồn | Khung | Chỗ vượt phạm vi |
|---|---|---|
| T1 R1 §7 | 15 slide; mạch Problem → Assumption → Mathematical formulation → Worked example → Interpretation → Limitation | Không vượt; chỉ "dẫn đến Games 2" ở slide 15 |
| T1 R2 §6 | Search → Game Modeling → Game Evaluation → Expectimax/Minimax; forward/backward chỉ làm nền | Không vượt |
| T2 L176-188 | 45-60 phút, 7 phần | "Hạn chế và tối ưu tìm kiếm" 8 phút, demo 8 phút |
| T2 L1046-1064 | Prisoner's Dilemma → Iterated PD → Minimax/Expectimax → Simultaneous → Alpha-Beta | Vượt nặng: non-zero-sum, simultaneous, alpha-beta |
| T2 L1176-1203 | Mở Prisoner's Dilemma 2-3 phút, kết Google Maps 2-3 phút | PD thuộc nhóm 11; A* thuộc nhóm 5 |
| T2 L1526-1545 | 18 slide; có Live Demo | Slide 16-18 chạm giới hạn phạm vi |
| T2 L1646-1857 | 7 chương, 20 slide, demo Connect Four bật tắt alpha-beta | Chương VI-VII vượt phạm vi |
| T2 L2078-2093 | Heuristic "nên đưa vào", CSP "đề cập ngắn" | Heuristic thuộc nhóm 5 và 11; CSP thuộc nhóm 12-13 |

Lựa chọn demo cũng thay đổi: Quoridor là chính và Connect Four phụ ở T2 L1327; Connect Four là chính ở T2 L1825.

**Điểm T1 và T2 đúng, khớp với PDF**
- Phân biệt game evaluation và evaluation function — [T1 R1 §5] khớp [g1 p.27, p.75].
- Ba bin: Minimax chọn B giá trị 1, Expectimax chọn C giá trị 5, bảng 1/2/−5/5 — [T2 L348-406, L521-524] khớp [g1 p.39, p.31, p.55].
- Backward induction không đồng nhất với backward state-space search — [T1 R2 §3.3].
- "Không phải cứ có bao nhiêu đường đi hợp lệ thì có bấy nhiêu lời giải hoàn chỉnh của bài toán Game" — [T2 L1618], phù hợp "Each root-to-leaf path is a possible outcome" — [g1 p.11].

**Phát biểu mâu thuẫn với PDF hoặc đáng ngờ**

| Phát biểu | Nguồn | Vấn đề |
|---|---|---|
| π_7 "được ký hiệu là player 7 trong bài giảng" | T2 L448 | Sai. PDF: "π_7 (some opponent)", "say π_7 for concreteness" [g1 p.47-48] |
| "Minimax 36-44" là khoảng slide phần Minimax | T1 R1 §9 | Thiếu, nếu so với bản cục bộ (T1 nói về bản 2023 chưa đối chiếu được). Mục kéo tới chân slide 54-55 (p.47-56), bỏ mất Face off và cả 3 properties. Các khoảng của bốn mục còn lại khớp chân slide bản cục bộ |
| Slide "Minimax provides both optimality and a lower bound against any (unknown) opponent", "Always think about optimality with respect to what?" và câu trích dẫn gắn nguồn games1-6pp 2023 | T2 L594, L655, L1504 | Câu này chỉ có trong ảnh chụp, **không có** trong `games1.pdf` cục bộ (grep 0 kết quả). Ảnh có phụ đề tiếng Việt, có vẻ từ video. Không trích dẫn là từ PDF |
| O(b^d) và Alpha-Beta O(b^{d/2}), với d là số ply | T2 L135-139, L168, L1487 | Xung đột ký hiệu với CS221: d = mỗi người đi d lần, O(b^{2d}) [g1 p.69-70]. Chính T2 L2188 sau đó mới giải thích D=2d |
| Note 6 dùng để nghiên cứu "tính đúng đắn" | T2 L101 | Note 6 không có chứng minh tính đúng đắn [N6 toàn văn] |
| Nhóm cần trình bày pseudocode Expectimax và Minimax, trong đề cương lấy Stanford làm khung | T2 L1453, L1473 | Không sai, nhưng `games1.pdf` không có pseudocode; phải lấy từ CS188 [L7 p.16-17, N7 p.2] |
| Mô hình "Trong mô hình Stanford" có S, s_0, U, A/B; G=(S,s0,A,T,P,Z,U) | T1 R1 §5, T2 L1683 | PDF chỉ có s_start, Actions, Succ, IsEnd, Utility, Player [g1 p.13]. Bộ 7 là cách viết của ChatGPT. T(s,a) còn đụng ký hiệu T(s,a,s') của MDP [g1 p.22] |
| Nên dùng Transposition Table, memoization | T2 L164, L1706, L1819 | PDF: "all our algorithms will operate on the tree rather than the graph" [g1 p.12]; "cannot forget much and exploit dynamic programming" [g1 p.70]. Không sai về kỹ thuật ngoài đời nhưng không có trong tài liệu và ngoài phạm vi |
| "Minimax hoàn toàn có thể áp dụng cho trò chơi đồng thời"; PD maximin | T2 L964-1003 | Đảo lại khuyến nghị trước đó ở T2 L912-914. Lớp game của PDF loại trừ trường hợp này: "take turns (unlike rock-paper-scissors)" [g1 p.14]; chủ đề thuộc nhóm 11 [X dòng 30] |
| Có thể phát triển thành "seminar sâu hơn về Game Theory"; không cần theo cấu trúc Stanford | T2 L1046-1048 | Mâu thuẫn với kết luận chính T2 ở L1565 và với phân công [X dòng 28] |
| Danh sách nhóm 11 trong bảng | T2 L1510-1518 | Thiếu Recap so với [X dòng 30] |
| Tóm tắt phân công nói nhóm 10 "giới thiệu cơ chế" của alpha-beta, eval, iterative deepening | T2 L1812-1821 | Vượt phạm vi; chỉ nên nói lý do tồn tại |
| Mọi nguồn "đều là nguồn chính thức... không phải các bài viết diễn giải thứ cấp" | T1 R1 §1 | Các thẻ ảnh trỏ tới slideserve, walmart; T2 còn dẫn tubesum, pean.ai, copyyoutubetranscript, lilys.ai [T2 L688, L735, L2138] |
| Liên kết "Stanford Encyclopedia of Philosophy — Backward Induction" trỏ tới `entries/epistemic-game` | T2 L1786 | Nhãn và URL không khớp nhau, cần kiểm tra |
| Ngày đăng Veritasium PD "23/12/2023" trong khi URL nguồn ghi `2024/1/15` | T2 L694, L704 | Có thể là hai ngày khác nhau; chưa kiểm chứng |

Bất đồng giữa hai transcript:
- Video `SMOD_GiRzb8`: T1 nói chưa truy xuất được — [T1 R1 §2]; T2 nói là "Stanford CS221 (2025) — Lecture 10: Games I", khoảng 73 phút, đăng 3/2026 — [T2 L47-51].
- Video `3pU-Hrz_xy4`: giảng viên "Percy Liang và Dorsa Sadigh" — [T1 R1 §2], so với "Dorsa Sadigh" — [T2 L2130]; "khoảng 82 phút" — [T2 L57], so với "khoảng 81 phút" — [T2 L2128].

Phần bị mất khi export: T1 R1 §4 (widget ba hộp), §8 (câu hỏi thầy có thể đặt ra); T1 R2 §8; T2 L87, L739, L2136 (bảng mốc video); T2 L759, L979 có công thức bị vỡ `$3, 3)`.

**URL được khẳng định (chưa kiểm chứng; các researcher khác xử lý)**

Stanford:
- `https://stanford-cs221.github.io/spring2026/modules/`
- `https://stanford-cs221.github.io/spring2023-extra/modules/games/games1-6pp.pdf`
- `https://stanford-cs221.github.io/spring2024-extra/modules/games/games1.pdf`
- `https://stanford-cs221.github.io/autumn2024/modules/index.html`
- `https://web.stanford.edu/class/archive/cs/cs221/cs221.1186/lectures/games1-6pp.pdf`
- `https://web.stanford.edu/class/archive/cs/cs221/cs221.1192/lectures/games2.pdf`
- `https://github.com/stanford-cs221/lectures/blob/main/games.py`
- `https://scpd-proed.github.io/xcs221/?trace=games`
- `https://stanford.edu/~shervine/teaching/cs-221/cheatsheet-states-models/`

Berkeley:
- `https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html`, `.../minimax.html`, `.../expectimax.html`, `.../summary.html`, `.../monte-carlo.html`
- `https://inst.eecs.berkeley.edu/~cs188/textbook/search/state.html`
- `https://inst.eecs.berkeley.edu/~cs188/textbook/csp/filtering.html`, `.../ordering.html`, `.../solving.html`
- `https://inst.eecs.berkeley.edu/~cs188/textbook/logic/forward.html`
- `https://inst.eecs.berkeley.edu/~cs188/fa23/assets/notes/cs188-fa23-note06.pdf`, `.../cs188-fa23-note07.pdf`
- `https://inst.eecs.berkeley.edu/~cs188/sp24/assets/lectures/cs188-sp24-lec06.pdf`
- `https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec07.pdf`
- `https://inst.eecs.berkeley.edu/~cs188/fa26/projects/proj2/`
- `https://berkeleyai.github.io/cs188-website/assets/notes/n3.pdf`

Giáo trình và khác:
- `https://aima.cs.berkeley.edu/`, `https://aima.eecs.berkeley.edu/contents.html`
- `https://www.artint.info/3e/html/ArtInt3e.Ch3.S1.html`, `.../ArtInt3e.Ch3.S3.html`, `https://artint.info/3e/html/ArtInt3e.Ch3.S8.html`, `.../ArtInt3e.Ch6.S2.html`, `.../ArtInt3e.Ch6.S3.html`
- `https://www.cs.cmu.edu/~15281/coursenotes/search/`
- `https://bulletin.stanford.edu/courses/1057301`
- `https://chessprogramming.org/Iterative_Deepening`
- `https://deepmind.google/blog/alphazero-shedding-new-light-on-chess-shogi-and-go/`
- `https://plato.stanford.edu/archives/spr2026/entries/epistemic-game/`

Video: `SMOD_GiRzb8`, `3pU-Hrz_xy4`, `STjW3eH0Cik`, `h8Tz4knj-vM`, `hM2EAvMkhtk`, `mScpHTIi-kM`, `ivfw_TcsHbw`, `kS-CGkiPetQ`, `ZMQbHMgK2rw`, `KZeIEiBrT_w`, `Ol18JoeXlVI`.

Demo: `https://nghiatt90.github.io/trust-vn/`, `https://22able22.github.io/quoridor/`, `https://99fk.github.io/connect-four-html/`, `https://m44f4.com/en/projects/hex/`, `https://lightcycle.io/`, `https://github.com/OmarWael004/Quoridor-Game-Project`, `https://piyushai.com/minimax-alpha-beta-pruning-visualizer/`.

### Inferences
- Ảnh tóm tắt có giao diện nền tối và các chip trích dẫn số, và viết về thầy ở ngôi thứ ba, nên nhiều khả năng là bản tóm tắt do AI hoặc người khác tạo từ buổi học, không phải ghi chú của chính giảng viên. T2 L1599 gọi nó là "ghi chú của thầy" là quá mức. Cần người dùng xác nhận.
- Ảnh trong T1 Prompt 2 (ghi 03:11:58) và T2 L1581 (ghi 03:13:28) cách nhau chưa tới 2 phút và mô tả cùng nội dung, nhiều khả năng là cùng một ảnh.
- Hai ảnh slide trong T2 L315 và L490 có phụ đề tiếng Việt và nội dung khác PDF, cho thấy nhóm đang xem một bản bài giảng khác `games1.pdf`, có thể là video `SMOD_GiRzb8`. Chưa xác minh được.
- Yêu cầu của giảng viên có thể tôn trọng mà không vượt phạm vi: mở đầu bằng "bài toán quy về tìm kiếm trên không gian trạng thái", rồi chỉ ra rằng với game, đường đi gốc-lá là một outcome [g1 p.11] còn lời giải là policy [g1 p.21, L7 p.7]. Nên trình bày là mở rộng, không phải đính chính thầy, vì không rõ ảnh tóm tắt có chính xác hay không.
- Yêu cầu "mở rộng sang tối ưu tìm kiếm" xuất phát từ câu hỏi của người dùng [T2 L7]; chưa thấy giảng viên yêu cầu nguyên văn. Mục 4 của ảnh có thể là căn cứ, nhưng cần hỏi lại.

### Gaps
- Không có nguồn gốc của ảnh tóm tắt, không có mục 3, và các số trích dẫn 1-9 trong ảnh không rõ trỏ tới đâu — [T1 R2 §7] cũng ghi nhận điều này.
- Thời lượng và tiêu chí chấm của buổi seminar: không tìm thấy trong bất kỳ file nào. Cần hỏi giảng viên.
- Ảnh gốc: `/tmp/claude-1000/-home-bao-Projects-Game1/960dc642-df1c-4e34-9dcc-a8bee2337d2a/scratchpad/sources/t2img/line315_0.png`, `/tmp/claude-1000/-home-bao-Projects-Game1/960dc642-df1c-4e34-9dcc-a8bee2337d2a/scratchpad/sources/t2img/line490_0.png`, `/tmp/claude-1000/-home-bao-Projects-Game1/960dc642-df1c-4e34-9dcc-a8bee2337d2a/scratchpad/sources/t2img/line1581_0.png`, `/tmp/claude-1000/-home-bao-Projects-Game1/960dc642-df1c-4e34-9dcc-a8bee2337d2a/scratchpad/sources/t2img/line1935_0.png` (thư mục tạm, có thể mất; có thể trích lại từ T2).

## Ký hiệu và thuật ngữ CS221 và CS188 xung đột ở đâu, nên thống nhất thế nào?

### Takeaway
Xung đột nguy hiểm nhất là **độ sâu**: cùng cờ vua nhưng CS221 ghi d≈50, CS188 ghi m≈100, và cùng cây mà CS188 gọi depth-2 thì CS221 gọi depth 1. Đề xuất dùng ký hiệu CS221 làm chuẩn vì module được giao bám `games1.pdf`, và luôn nói rõ "ply" khi nhắc độ sâu.

### Cited Findings

**Xung đột cụ thể**

| Khái niệm | CS221 | CS188 | Hậu quả |
|---|---|---|---|
| Độ sâu | "A game tree of depth d corresponds to a tree where each player has moved d times. Each level in the tree is called a ply." [g1 p.70] | m = "approximate tree depth at which terminal nodes can be found" [N6 p.5]; "depth-2 tree" là 2 tầng [N6 p.4] | Cây Pacman 2 tầng là depth 2 ở CS188, depth 1 ở CS221 (suy ra) |
| Cờ vua | b≈35, d≈50 [g1 p.69] | b≈35, m≈100 [L7 p.20, N6 p.5] | Cùng 35^100; không phải mâu thuẫn số |
| Thời gian | O(b^{2d}) [g1 p.69] | O(b^m) [L7 p.20] | Tương đương khi m=2d, hai người chơi |
| Không gian | O(d) [g1 p.69] | O(bm) [L7 p.20] | Khác thật sự, xem Inferences |
| Tên hàm giá trị | V_eval, V_exptmax, V_minmax [g1 p.27, 33, 41] | V(s) cho mọi trường hợp [L7 p.13, N6 p.4, N7 p.1] | CS188 không phân biệt được loại giá trị |
| Nghĩa "value" | V_eval là expected utility dưới policy cố định [g1 p.28] | "The best achievable outcome (utility) from that state" [L7 p.11]; "optimal score attainable by the agent which controls that state" [N6 p.2] | Định nghĩa CS188 không áp dụng cho game evaluation |
| Utility | Utility(s), một số, góc nhìn agent [g1 p.13] | S×P→R [L7 p.7]; Utility(s, player) [N6 p.2] | CS188 tổng quát cho N người |
| Dấu và thang utility | +∞, 0, −∞ cho chess [g1 p.15]; opp = −agent [g1 p.14] | −1, 0, +1 [L7 p.14]; điểm Pacman [N6 p.3] | Cùng hướng agent-tối-đa, khác thang |
| Khung Expectimax | Opponent có policy cố định và đã biết; tương tự value iteration [g1 p.32-34] | "generalization of minimax", chance node gồm cả randomness tự nhiên và đối thủ [N7 p.1] | Thứ tự bài ngược nhau |
| Quan hệ minimax và expectimax | "No analogy in MDPs" [g1 p.41] | "minimax is simply a special case of expectimax" [N7 p.1] | Xem Inferences |
| Thứ tự môn học | MDP trước Games [g1 p.3, p.18, p.22] | MDP "in the second half of the course" [N7 p.1]; "Next Time: Uncertainty!" [L7 p.38] | Lớp này học MDP trước [X dòng 24-28], không chép câu dẫn của CS188 |
| Bản chất policy | π_p(s), π_p(s,a) [g1 p.21] | policy: S→A [L7 p.7] | CS188 chỉ deterministic ở đây; T1, T2 dùng π(a∣s) |
| Từ vựng | end state, agent/opp, IsEnd, Succ, s_start | terminal state, MAX/MIN, Terminal-test, Result, s0 [N6 p.2, L7 p.7] | Cần bảng ánh xạ |
| Người chơi | Player(s) [g1 p.13] | Players(s) [N6 p.2]; P={1...N} [L7 p.7] | CS188 dùng số nhiều |

**Bất nhất trong chính `games1.pdf`**
- Slide d≈50 [g1 p.69] nhưng ghi chú "have a depth of up to 100" [g1 p.70]; "D = 50" [g1 p.76].
- Ví dụ π_agent(s)=A dạng deterministic [g1 p.25] nhưng recurrence dùng π_agent(s,a) [g1 p.27]; hiểu là xác suất 1, đúng như nhãn cạnh (1) (0) (0).
- Tên viết tắt "V_minmax", không có chữ "i", còn thuật ngữ là "minimax" [g1 p.41].
- V có hai vai: V_...(s) theo state [g1 p.27] và V(π_agent, π_opp) theo cặp policy [g1 p.48].
- V_eval (game evaluation) dễ nhầm Eval(s) (evaluation function) [g1 p.27, p.75].

**Bảng ký hiệu thống nhất đề xuất**

| Khái niệm | Dùng trên slide | Tương đương cần nhắc một lần | Ghi chú |
|---|---|---|---|
| Trạng thái đầu | s_start | s0 (CS188) | |
| Người chơi | Players = {agent, opp}; Player(s) | MAX = agent, MIN = opp | Chỉ hai người |
| Hành động | Actions(s) | A | |
| Chuyển trạng thái | Succ(s, a) | Result(s,a), S×A→S | Tránh T(s,a), đã dùng cho MDP |
| Kết thúc | IsEnd(s) | Terminal-test, "terminal state" | Viết "end state (terminal state)" |
| Utility | Utility(s), luôn theo góc nhìn agent | U, Utility(s, player) | Zero-sum: utility của opp = −Utility(s) |
| Thang utility | Số hữu hạn trong ví dụ tính toán; +∞/0/−∞ chỉ khi mô tả chess theo p.15 | −1/0/+1 | Tránh ∞−∞ |
| Policy deterministic | π_p(s) | S→A | |
| Policy stochastic | π_p(s, a) | π_p(a∣s) | Cùng nghĩa |
| Policy cố định của đối thủ | π_7 "(some opponent)" | p(s'∣s) ở N7 khi Succ xác định | Không gọi là player 7 |
| Giá trị theo state | V_eval(s), V_exptmax(s), V_minmax(s) | V(s) | Đọc V_minmax là "minimax value" |
| Giá trị cặp policy | V(π_agent, π_opp) | | Chỉ dùng ở Face off |
| Policy trích ra | π_max, π_min, π_exptmax(7) | | |
| Hệ số phân nhánh | b | | |
| Độ sâu | Dùng m = số ply; ghi kèm d: m = 2d | d CS221, m CS188 | Luôn đọc "ply" |
| Độ phức tạp minimax | Thời gian O(b^m) = O(b^{2d}) | Không gian ghi chú theo cài đặt | |
| Hình nút | △ max, ▽ min, ○ node theo xác suất | Xanh/đỏ/lục CS188 | Lá là số hoặc ô vuông |
| Game evaluation | Luôn viết "Game evaluation (V_eval)" | | Không viết tắt "evaluation" |
| Evaluation function | Eval(s), chỉ nhắc tên, thuộc nhóm 11 | | |

### Inferences
- Chênh lệch không gian O(d) so với O(bm) nhiều khả năng do cách đếm: chỉ tính ngăn xếp đệ quy (O(d) = O(m)), hay tính cả các nút anh em phải lưu ở mỗi tầng như DFS (O(bm)). Tài liệu không giải thích; nên nói rõ giả định nếu bị hỏi.
- "Minimax là trường hợp riêng của expectimax" chỉ đúng về hình thức, vì phân phối 1/0 ở min node phụ thuộc vào giá trị các con, không phải policy cố định biết trước. Điều này tương thích với "No analogy in MDPs". Khi trình bày nên dùng câu "cùng khung đệ quy, khác toán tử tại nút đối thủ", không nói expectimax bao trùm minimax.
- Với hai người đi luân phiên, m = 2d. Nếu lượt không xen kẽ (nhiều ghost) thì quan hệ này không còn giữ nguyên [N7 p.3].

### Gaps
- Không có nguồn trong docs phân xử dứt khoát O(d) và O(bm).
- Giảng viên ưu tiên ký hiệu nào: chưa biết. Bảng trên là đề xuất. Search và MDP của các nhóm trước dùng ký hiệu gì: không có tài liệu trong docs, nên kiểm tra slide nhóm 5, 7, 8, 9 để nhất quán.

## Những chủ đề hấp dẫn nào thực ra thuộc nhóm 11 hoặc các nhóm khác?

### Takeaway
Bẫy lớn nhất nằm ngay trong tài liệu được cấp: 41 trang cuối của `games1.pdf`, Note 6 từ giữa p.5, Note 7 từ p.3, và `L7` từ p.21 đều không phải của nhóm 10. Với mỗi bẫy, chỉ nên dùng một câu chuyển tiếp thay vì một slide.

### Cited Findings

| Chủ đề hấp dẫn | Chủ sở hữu | Nơi xuất hiện | Câu cầu nối đề xuất |
|---|---|---|---|
| Alpha-beta pruning, move ordering | Nhóm 11 [X dòng 30] | g1 p.81-94; L7 p.21-28; N6 p.5-6; T2 L1812-1829 | "Có cách tính đúng giá trị minimax mà không cần duyệt hết cây; nhóm 11 sẽ trình bày ngay sau đây." |
| Evaluation functions, depth-limited, Eval(s) | Nhóm 11 [X dòng 30] | g1 p.67-80; L7 p.29-37; N6 p.6-7 | "Khi không thể đi tới end state, ta cần ước lượng giá trị; đó là evaluation function của nhóm 11, khác với game evaluation vừa học." |
| Độ phức tạp minimax (vùng xám) | g1 xếp vào mục nhóm 11; L7 xếp cạnh minimax | g1 p.69-70; L7 p.20; N6 p.5 | "Minimax duyệt toàn bộ cây như DFS, cờ vua khoảng 35^100 nút lá, nên không thể chạy nguyên bản; nhóm 11 sẽ giải quyết việc này." |
| Expectiminimax, coin, Game 2 | Nhóm 11 [X dòng 30] | g1 p.57-64; N7 p.3 | "Nếu có thêm ngẫu nhiên từ tự nhiên bên cạnh đối thủ tối ưu, cần thêm một loại nút thứ ba; đó là expectiminimax." |
| Mixed Layer Types có chance | Nhóm 11 | N7 p.3; g1 p.65-66 | "Các loại nút có thể ghép theo mô hình của game; nhóm 11 sẽ cho thấy cách ghép." |
| Summary/Recap | Nhóm 11 [X dòng 30] | g1 p.95-97; g1 p.65-66 | Tự kết bằng bảng g1 p.55, không dùng p.97. |
| Prisoner's Dilemma, Tit for Tat, Nash, general games | Nhóm 11 (Non-zero-sum) | T2 L733-1072; L7 p.8; N7 p.5-6 | "Ở đây ta giả định zero-sum; khi lợi ích không đối nghịch hoàn toàn, câu chuyện khác đi, và đó là phần của nhóm 11." |
| Simultaneous games, minimax theorem, mixed strategies | Nhóm 11 | T2 L964-1042; g1 p.7, p.14 | "Ta chỉ xét game đi lần lượt; nếu hai bên cùng đi một lúc như oẳn tù tì, cần công cụ khác mà nhóm 11 trình bày." |
| TD learning, self-play, AlphaZero | Nhóm 11 (TD) | g1 p.7; T2 L261-307 | "Ở đây quy tắc đã biết và ta tính toán; học giá trị từ kinh nghiệm chơi là TD learning của nhóm 11." |
| AI Misalignment | Nhóm 11 | Chỉ có tên ở X dòng 30, không có tài liệu trong docs | Không đề cập. |
| Value iteration, Bellman, discount, hội tụ | Nhóm 9 [X dòng 26] | g1 p.33-34 | "Expectimax có cấu trúc giống value iteration mà nhóm 9 đã trình bày, chỉ khác là ở đây cây hữu hạn và utility nằm ở cuối." |
| Policy evaluation | Nhóm 8 [X dòng 24] | g1 p.27-28 | "Game evaluation có vai trò như policy evaluation của nhóm 8: policy cố định, chỉ tính giá trị." |
| RL, Q-learning, SARSA, Monte Carlo | Nhóm 9 [X dòng 26] | T2 L263-297 | "Nhóm 9 đã nói về học khi không biết mô hình; trong bài này mô hình game đã biết." |
| MDP as game (agent và nature) | Nhóm 8 và 9 cung cấp nền | g1 p.22 | Trong phạm vi Modeling, giữ đúng một câu: "MDP có thể xem là game giữa agent và nature với π_nature = T(s,a,s')." |
| Tree search, DP, memoization, graph | Nhóm 7 [X dòng 22] | g1 p.12, p.70; T2 L1706 | "Như tree search nhóm 7 đã trình bày, ta vẫn dùng cây, chỉ khác là có lượt của đối thủ." |
| A*, heuristic Δ, Google Maps | Nhóm 5 [X dòng 18] | Ảnh T2 L1935; T2 L1097-1101, L1947-2013 | "Heuristic của nhóm 5 ước lượng chi phí tới đích; ở game, vai trò tương tự do evaluation function của nhóm 11 đảm nhận." |
| CSP, forward checking, arc consistency | Nhóm 12, 13 [X dòng 32-34] | Ảnh T2 L1935; T2 L1984-2013; L7 p.37 | "Luật chơi xác định Actions(s) hợp lệ; kỹ thuật ràng buộc tổng quát thuộc phần CSP tuần sau." |
| Forward/backward reasoning | Bài giảng chung của thầy, không thuộc mục được giao | Ảnh T2 L1581; T1 R2 §3 | "Ta sinh cây theo chiều tiến từ s_start, rồi truyền giá trị ngược từ lá lên gốc." |
| MCTS, UCB, UCT, rollouts | Không nhóm nào [X, toàn bảng] | N7 p.3-5; L7 p.3; T2 L166 | Tối đa một vế khi nói AlphaGo trong lịch sử; không giải thích thuật toán. |
| Iterative deepening, transposition table | Không nhóm nào; gần nhóm 11 | L7 p.30; T2 L163-164 | Không đề cập. |
| Why Pacman Starves, thrashing | Nhóm 11 (depth-limited) | L7 p.31-32 | Không dùng. |
| Demo bật tắt alpha-beta, Quoridor với A* và CSP | Trùng nhóm 11, 5, 12-13 | T2 L1283-1313, L1829, L2033-2074 | Demo nên giới hạn ở cùng một cây, đổi mô hình đối thủ giữa Game evaluation, Expectimax, Minimax. |

Những phần tưởng là bẫy nhưng **thuộc nhóm 10**:
- Face off và 3 properties [g1 p.47-56] thuộc mục Minimax, dù T1 R1 §9 bỏ sót.
- Halving game [g1 p.19, p.45] thuộc Modeling và Minimax.
- Lower bound [g1 p.51] không phải kiến thức alpha-beta dù tên gần với bound của pruning [g1 p.83].
- Pseudocode minimax và expectimax từ CS188 [L7 p.16-17, N7 p.2], miễn là bản không có α, β.
- Câu "không cắt nhánh được ở chance node" [N7 p.3] chỉ dùng được nếu chưa giải thích cơ chế alpha-beta.

### Inferences
- Vùng xám cần xử lý chủ động là độ phức tạp, vì đây là lý do tự nhiên để chuyển sang nhóm 11 và cũng là yêu cầu "tối ưu tìm kiếm" của người dùng. Đề xuất: tối đa một slide kết, nêu số liệu, không nêu cách khắc phục.
- Nên thống nhất với nhóm 11 trước ngày 2026-11-09, vì trình bày cùng ngày, về: ai nói về độ phức tạp, ai dùng ba bin (nhóm 11 có Game 2 kế thừa ba bin ở g1 p.59), và câu chuyển giao.
- Prisoner's Dilemma là ví dụ non-zero-sum, simultaneous, tức trùng cả hai mục của nhóm 11 và nằm ngoài lớp game mà p.14 giới hạn. Ba bin đã đủ làm tình huống mở đầu vì cho ba lựa chọn khác nhau theo ba mô hình đối thủ [g1 p.6].

### Gaps
- Chưa biết giảng viên có chấp nhận hoặc khuyến khích mở rộng ngoài danh sách hay không; đề xuất trên giả định bám sát danh sách trong Excel.
- Chưa biết nhóm 11 dự định dùng ví dụ và phạm vi độ phức tạp thế nào; cần trao đổi trực tiếp.
