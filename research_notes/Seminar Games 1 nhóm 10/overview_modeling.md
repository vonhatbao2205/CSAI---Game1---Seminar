# Overview và Modeling của chủ đề Games: bản chất bài toán và mô hình hóa hình thức

Phạm vi: chỉ Overview và Modeling của buổi "Games 1 (combined)", nhóm 10, 2026-11-09. Không dẫn công thức Game evaluation, Expectimax, Minimax (researcher khác phụ trách). Các mục thuộc nhóm 11 (Expectiminimax, Evaluation functions, Alpha-beta, TD learning, AI Misalignment, Simultaneous games, Non-zero-sum games) chỉ được nhắc tối đa một dòng.

Quy ước trích dẫn:
- "PDF p.N" là số trang của file PDF, không phải số in trên slide. Với `games1.pdf`, slide có nhãn "CS221 L" nằm ở PDF p.(L+1), phần speaker notes ở trang kế tiếp.
- "[Tự kiểm chứng]" là kết quả do researcher tự enumerate bằng Python trong phiên này, không phải từ tài liệu. Người viết báo cáo có thể chạy lại vì định nghĩa trò chơi đã nêu đủ.
- Các đoạn trong mục "Inferences" là suy luận của researcher, không phải phát biểu của nguồn.

---

## 1. Bản chất của game như một bài toán tính toán: điều gì đổi so với Search và MDP, và vì sao plan không còn đủ

### Takeaway
Luật chơi không xác định được hành vi của đối thủ. Một MDP mô tả đủ mọi thứ để định nghĩa "chính sách tối ưu", còn một game chỉ mô tả luật, nên giá trị là hàm hai đối số V(π_agent, π_opp) và "tối ưu" chỉ có nghĩa khi đã giả định về đối thủ. Lời giải phải là strategy (contingent plan), vì nước đi kế tiếp của ta phụ thuộc vào lựa chọn của một tác nhân khác mà ta không biết trước.

### Cited Findings
- CS221 nêu hai đặc trưng khiến game khó: toàn bộ utility nằm ở end state, và các player khác nhau kiểm soát các state khác nhau — [games1.pdf, PDF p.17-18](/home/bao/Projects/Game1/docs/games1.pdf).
- Trong search, agent kiểm soát mọi hành động. Trong MDP đã có mất kiểm soát qua chance node nhưng "chúng ta giả định biết phân phối mà nature dùng". Trong game, một player khác kiểm soát một số state và "probably out to get us" — [games1.pdf, PDF p.18](/home/bao/Projects/Game1/docs/games1.pdf).
- Chiến lược tối ưu của ta phụ thuộc vào chiến lược của các agent khác, và chiến lược đó thường không biết trước và đối nghịch — [games1.pdf, PDF p.4](/home/bao/Projects/Game1/docs/games1.pdf).
- Search trả về "comprehensive plan" rồi chỉ việc thực thi. Adversarial search trả về strategy/policy khuyến nghị nước đi cho từng cấu hình — [cs188-fa23-note06.pdf, p.1-2](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf).
- AIMA: trong search thường, lời giải tối ưu là một chuỗi nước đi tới goal. Trong game, "MIN has something to say about it", nên MAX phải tìm một **contingent strategy**: nước đi ở state đầu, rồi nước đi ở các state sinh ra từ *mọi* phản ứng có thể của MIN, cứ thế tiếp tục — [AIMA, chương Adversarial Search, §Optimal strategies](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf). Lưu ý: file nằm trong thư mục `4th-ed` nhưng nội dung viết "Go ... amateur level" nên rõ ràng là văn bản cũ; xem Gaps.
- Lý thuyết trò chơi định nghĩa strategy là kế hoạch đầy đủ, phải chỉ rõ hành động tại mọi điểm player đó có thể phải chọn, kể cả những nút sẽ không bao giờ đạt tới — [SEP, Game Theory](https://plato.stanford.edu/entries/game-theory/).
- CS221: có thể xem MDP là game giữa agent và nature, trong đó π_nature((s,a), s') = T(s,a,s') — [games1.pdf, PDF p.22](/home/bao/Projects/Game1/docs/games1.pdf).
- Ví dụ của chính khóa học: cùng một cây, đối thủ hợp tác thì chọn bin A (hy vọng 50), đối thủ chống lại thì chọn B (chắc được ít nhất 1), đối thủ ngẫu nhiên đều thì chọn C (kỳ vọng 5) — [games1.pdf, PDF p.5-6](/home/bao/Projects/Game1/docs/games1.pdf).

**Bảng cầu nối (tổng hợp từ các nguồn trên):**

| | Search | MDP | Game (lớp đang xét) |
|---|---|---|---|
| Ai quyết định state kế | Một mình agent | Agent chọn a, nature chọn s' | Mỗi state có đúng một player quyết định, theo Player(s) |
| Mô hình có cho biết "phần còn lại" không | Có, Succ tất định | Có, T(s,a,s') là một phần của đề bài | **Không**: đề bài không chứa π_opp |
| Tín hiệu mục tiêu | Cost trên từng cạnh | Reward trên từng bước | Utility chỉ ở end state |
| Bản chất của bất định | Không có | Ngẫu nhiên, không có ý đồ | Chiến lược: đối thủ có mục tiêu ngược ta |
| Dạng lời giải | Chuỗi hành động | Policy | Policy cho từng player |
| "Tối ưu" được định nghĩa bởi | Riêng đề bài | Riêng đề bài | Đề bài **cộng** giả định về đối thủ |

### Inferences
- **Điểm tinh tế nhất cho giảng viên:** game ở lớp này có Succ(s,a) hoàn toàn tất định, nên nguồn bất định không nằm ở môi trường mà nằm ở hành vi của tác nhân khác. Vì vậy gọi là "strategic uncertainty" chính xác hơn "chance".
- **Vì sao nature khác đối thủ, phát biểu chặt:** nếu cố định π_opp đã biết, ta gộp lượt đối thủ vào hàm chuyển: T(s,a,s'') = Σ_{a'} π_opp(s',a')·1[Succ(s',a')=s''], với s' = Succ(s,a), và bài toán trở thành một MDP của riêng agent. Nghĩa là game chỉ *khác* MDP về bản chất khi π_opp không được cho trước. Đối thủ khác nature ở hai điểm: π_opp không có trong đề bài, và π_opp có thể được chọn *để phản ứng lại* π_agent, nên không thể ước lượng nó như một hằng số của môi trường rồi tối ưu một lần.
- **Vì sao plan hỏng, về mặt cấu trúc:** plan là một chuỗi, tức một đường đi trong cây. Mỗi nút đối thủ làm cây phân nhánh ngoài tầm kiểm soát của ta, nên lời giải đúng kiểu phải là cây con: một nhánh tại nút của ta, *tất cả* các nhánh tại nút đối thủ. Với MDP, plan cũng hỏng vì nature rẽ nhánh, và lớp đã biết policy; game giữ nguyên yêu cầu về kiểu lời giải đó, cái thay đổi là không còn T để lấy kỳ vọng.
- **Quy mô không gian strategy** [Tự kiểm chứng]: trong bin game, agent có 3 pure strategy, còn opp có 2³ = 8 pure strategy (chọn số nào trong từng bin, kể cả bin agent không chọn), tổng 24 cặp. Trong tic-tac-toe có 2.423 state không kết thúc mà X đi và 2.097 state O đi; số pure strategy của X định nghĩa trên toàn bộ 2.423 state đó là ∏|Actions(s)| ≈ 10^1245, trong khi chỉ có 5.478 position. Không ai liệt kê strategy; đây là lý do mọi thuật toán về sau phải khai thác cấu trúc đệ quy của cây (phần thuật toán thuộc researcher khác).

### Gaps
- Không mở được bản AIMA 4th edition chính thức. Tên thành phần bản mới chỉ kiểm chứng qua slide khóa học (xem mục 3).

---

## 2. Taxonomy: vị trí của lớp "two-player, zero-sum, turn-based, deterministic, perfect information"

### Takeaway
Lớp này là giao của năm ràng buộc đồng thời loại bỏ năm nguồn phức tạp: có một con số duy nhất, có giá trị tồn tại, có strategy thuần tối ưu, và "tối ưu" không còn nhập nhằng. Đó là lý do khoa học để bắt đầu từ đây, không chỉ vì nó dễ dạy.

### Cited Findings
- CS188 liệt kê các trục: deterministic hay stochastic, một/hai/nhiều player, zero-sum, perfect information — [cs188-sp26-lec07.pdf, p.6](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf).
- CS221 giới hạn "game" trong bài giảng: hai player, zero-sum, luân phiên (khác rock-paper-scissors), state quan sát đầy đủ (khác poker) — [games1.pdf, PDF p.14](/home/bao/Projects/Game1/docs/games1.pdf).
- AIMA: trong AI, "games" thường là loại rất chuyên biệt, "deterministic, turn-taking, two-player, zero-sum games of perfect information" — [AIMA, §Games](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Perfect information nghĩa là tại mỗi điểm phải hành động, player biết mọi thứ đã xảy ra trước đó. Nước đi đồng thời làm game trở thành imperfect information — [SEP](https://plato.stanford.edu/entries/game-theory/).
- Shannon nêu đúng hai tính chất của cờ vua: không có yếu tố may rủi (khác bài, backgammon) và "perfect information" (khác Kriegspiel) — [Shannon 1950, §2](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf).
- Backgammon có yếu tố chance, bridge có imperfect information do không thấy hết bài — [AIMA, §Games](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).

**Các ô của taxonomy (chỉ gọi tên, không giải thích thuật toán):**

| Tính chất khác lớp chuẩn | Ví dụ | Nguồn |
|---|---|---|
| **Lớp chuẩn:** 2 player, zero-sum, luân phiên, tất định, perfect info | Tic-tac-toe, Connect Four, checkers, chess, Go | [lec07, Adversarial Search](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf); [Allis §6.3](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf) |
| Có chance, perfect info | Backgammon | [AIMA](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf) |
| Tất định về luật, imperfect info | Kriegspiel | [Shannon 1950](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf) |
| Imperfect info, có chance | Poker, bridge | [games1.pdf, PDF p.14](/home/bao/Projects/Game1/docs/games1.pdf); [AIMA](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf) |
| Đồng thời (simultaneous) | Rock-paper-scissors | [games1.pdf, PDF p.14](/home/bao/Projects/Game1/docs/games1.pdf) |
| Nhiều hơn 2 player | Poker 6 người (Pluribus) | [Brown & Sandholm 2019](https://ui.adsabs.harvard.edu/abs/2019Sci...365..885B) |
| 7 player, có đàm phán | Diplomacy | [Bakhtin et al. 2022](https://pubmed.ncbi.nlm.nih.gov/36413172/) |
| Non-zero-sum | "General games": cooperation, indifference, competition đều có thể | [lec07, p.8](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf); [note07, p.5](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf) |
| Nhiều lượt liên tiếp của cùng phe | Pacman với nhiều ghost: 1 tầng max rồi 4 tầng min | [note07, p.3](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf) |

Pointer: Simultaneous, Non-zero-sum và Expectiminimax thuộc nhóm 11.

### Inferences
- **Lý do lớp này là điểm xuất phát**, mỗi ràng buộc gỡ bỏ một khó khăn cụ thể:
  - *Hai player và zero-sum*: gộp mọi utility thành một số vô hướng, nên "tốt cho tôi" và "xấu cho bạn" là một.
  - *Perfect information*: state hiện tại đã là mọi thứ cần biết, không phải suy luận về điều chưa thấy.
  - *Luân phiên*: mỗi state có đúng một người quyết định, nên cấu trúc đệ quy theo cây sạch sẽ.
  - *Tất định*: không cần phân phối xác suất trong đề bài.
  - *Hữu hạn* (ràng buộc thứ sáu thường bị quên): cùng các điều kiện trên đảm bảo giá trị tồn tại và có pure strategy tối ưu (mục 8).
- **Các trục không độc lập:** "turn order" thực ra là trường hợp đặc biệt của "information", vì đi đồng thời tương đương đi tuần tự mà không thấy nước của người kia (hệ quả trực tiếp của phát biểu SEP). Đây là chi tiết đáng nói nếu giảng viên hỏi "năm trục có trực giao không".
- **Tên gọi dễ gây nhầm:** "fully observable" của AI tương ứng "perfect information" của game theory (AIMA nói rõ sự tương ứng này). Khác với "complete information" (biết luật và payoff của mọi người); phân biệt này là kiến thức nền của researcher, chưa đối chiếu nguồn trong phiên này.

### Gaps
- Chưa tìm được nguồn sơ cấp đã kiểm chứng cho một ô "cooperative, imperfect info" (ví dụ Hanabi): tìm kiếm không trả về tài liệu, nên không đưa vào bảng.
- Bảng không phân loại từng ví dụ theo cả năm trục; mỗi hàng chỉ nêu trục khác với lớp chuẩn được nguồn nói rõ.

---

## 3. Mô hình hình thức và ánh xạ CS221 ↔ CS188 ↔ AIMA

### Takeaway
Định nghĩa sáu thành phần của CS221 là skeleton của search problem cộng thêm hai thứ: Player(s) và Utility trên end state. Các ký hiệu khác nhau của CS188 và AIMA tương đương nhau; khác biệt có ý nghĩa duy nhất là Utility(s) vô hướng so với Utility(s,p) theo từng player, và zero-sum chính là điều kiện cho phép gộp cái sau thành cái trước.

### Cited Findings
- Định nghĩa CS221: s_start; Actions(s); Succ(s,a); IsEnd(s); Utility(s) là "agent's utility for end state s"; Player(s) ∈ Players — [games1.pdf, PDF p.13](/home/bao/Projects/Game1/docs/games1.pdf).
- Skeleton giống search và MDP; khác biệt chính là Player(s), và thay vì edge cost hay reward thì có Utility(s) chỉ định nghĩa ở end state — [games1.pdf, PDF p.14](/home/bao/Projects/Game1/docs/games1.pdf).
- CS188 note: Initial state s0; Players(s) (lượt ai); Actions(s); Transition model Result(s,a); Terminal-test(s); Terminal values Utility(s,player) — [cs188-fa23-note06.pdf, p.2](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf).
- CS188 slide: States S (bắt đầu ở s0); Players P={1...N} (usually take turns); Actions A; Transition Function S×A→S; Terminal Test S→{t,f}; Terminal Utilities S×P→R; lời giải cho một player là policy S→A — [cs188-sp26-lec07.pdf, p.7](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf).
- AIMA (văn bản trong file đã đọc): initial state "includes the board position and identifies the player to move"; successor function trả về các cặp (move, state); terminal test; utility function — [AIMA, §Optimal Decisions in Games](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Cách đặt tên kiểu AIMA mới: S0, TO-MOVE(s), ACTIONS(s), RESULT(s,a), IS-TERMINAL(s), UTILITY(s,p) — [slide khóa học Kirlin, nguồn thứ cấp](https://pkirlin.github.io/ai-f23/lectures/advsearch/adversarial-search-slides-1.pdf).

**Bảng ánh xạ:**

| CS221 (games1) | CS188 note 06 | CS188 slide | AIMA (dạng mới, qua slide) | Ý nghĩa |
|---|---|---|---|---|
| s_start | Initial state s0 | s0 ∈ S | S0 | Vị trí đầu, gồm cả lượt đi |
| Player(s) | Players(s) | P={1..N}, "usually take turns" | TO-MOVE(s) | Ai quyết định tại s |
| Actions(s) | Actions(s) | A (may depend on player/state) | ACTIONS(s) | Nước hợp lệ |
| Succ(s,a) | Result(s,a) | S×A→S | RESULT(s,a) | Luật chuyển tất định |
| IsEnd(s) | Terminal-test(s) | S→{t,f} | IS-TERMINAL(s) | Game kết thúc chưa |
| Utility(s) (một số, của agent) | Utility(s,player) | S×P→R | UTILITY(s,p) | Payoff tại end state |

**Vì sao utility chỉ ở end state, trái với reward của MDP:**
- CS221 viết thẳng: có thể dùng edge cost và reward cho game (slide gọi đó là "strictly more general"), nhưng đặt hết utility ở cuối để nhấn mạnh tính "all-or-nothing": ăn quân không được utility, chỉ thắng mới có. "This ultra-delayed utility makes games hard" — [games1.pdf, PDF p.14](/home/bao/Projects/Game1/docs/games1.pdf).
- Search và MDP thường có các đại lượng trung gian giúp bài toán dễ hơn; trong game, dù có tín hiệu như số quân hay điểm, về mặt kỹ thuật chỉ kết cục mới quan trọng — [games1.pdf, PDF p.18](/home/bao/Projects/Game1/docs/games1.pdf).
- Ví dụ Pacman của CS188: khởi đầu 10 điểm, mất 1 điểm mỗi nước, terminal value là điểm cuối (đi thẳng tới pellet được 8) — [cs188-fa23-note06.pdf, p.2-3](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf).

**Zero-sum, phát biểu hình thức:**
- CS221: utility của agent bằng âm utility của opp, tức tổng bằng 0 — [games1.pdf, PDF p.14](/home/bao/Projects/Game1/docs/games1.pdf). Theo CS188: agent có utility đối nghịch, nên có thể coi là một giá trị duy nhất mà một bên maximize, bên kia minimize — [lec07, p.8](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf).
- AIMA: chess +1/−1, và "It is this opposition between the agents' utility functions that makes the situation adversarial". Với hai player zero-sum, vector utility hai phần tử "can be reduced to a single value because the values are always opposite"; game ba player thì cần vector ⟨v_A, v_B, v_C⟩ — [AIMA](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Tên "zero-sum" không chuẩn: định nghĩa trong slide theo chương AIMA là tổng payoff bằng nhau ở mọi ván, và cờ vua có 0+1, 1+0, ½+½; "constant-sum would have been a better term" — [slide KSU, chương 5, nguồn thứ cấp](https://faculty.ksu.edu.sa/sites/default/files/5.%20Adversarial%20Search.pdf).
- SEP: trong game zero-sum hai người, một bên chỉ có thể tốt hơn bằng cách làm bên kia tệ đi; hàm utility là ảnh gương của nhau — [SEP](https://plato.stanford.edu/entries/game-theory/).

### Inferences
- **Định nghĩa gọn để đưa lên slide:** gọi T là tập end state. Game là zero-sum nếu với mọi t ∈ T, u_agent(t) + u_opp(t) = 0. Đặt U = u_agent thì u_opp = −U, và với mọi t, t': agent thích t hơn t' khi và chỉ khi opp thích t' hơn t. Hai bảng xếp hạng ngược hoàn toàn, nên thông tin của hai hàm nằm trọn trong một hàm U. Không có kết cục nào cả hai cùng muốn, nên không có chỗ cho hợp tác.
- **Constant-sum đưa về zero-sum:** nếu u_1 + u_2 = c với mọi t, đặt u_i' = u_i − c/2 thì tổng bằng 0, thứ tự ưu tiên giữ nguyên. Vì vậy cờ vua 1/½/0 và +1/0/−1 là cùng một game về mặt chiến lược.
- **Single number cần đủ cả hai điều kiện:** với ba player thì dù tổng bằng 0, biết U_1 vẫn chưa xác định U_2, U_3. Cần n−1 số. Đây là phản ví dụ tốt cho câu "zero-sum nên một số là đủ".
- **Về chữ "strictly more general" của slide:** chỉ đúng khi giữ nguyên không gian state. Reward trên đường đi luôn gấp được về terminal utility bằng cách thêm điểm tích lũy g vào state: s̃ = (s, g), Utility(s̃) = g + payoff cuối. Pacman của CS188 chính là như vậy. Kết luận: **terminal-only không phải là giới hạn về khả năng biểu diễn, mà là phát biểu về mục tiêu thật của game**, và cái giá khi gấp là state lớn hơn. Lý do sâu hơn so với MDP: reward MDP là một phần của quá trình tích lũy, còn ở game kết cục là thuộc tính của cả ván đã hoàn tất.
- **Hệ quả không hiển nhiên của mô hình:** không có γ và không có reward trung gian thì hàm mục tiêu không phân biệt thắng sớm với thắng muộn. Muốn phân biệt phải đưa thời gian vào Utility, như Pacman. Điểm số trung gian như ăn quân chỉ là tín hiệu ước lượng, không phải mục tiêu (Evaluation functions: nhóm 11).
- **Player(s) khác tập Players:** CS188 slide chỉ cho tập P và ghi "usually take turns", tức thông tin về lượt nằm ngầm; CS221 và TO-MOVE tách nó thành một hàm trên state. Không có Player(s) thì policy π_p không xác định được miền của nó. Hàm này không buộc phải luân phiên (ví dụ nhiều ghost ở note07).

### Gaps
- Câu "constant-sum" được kiểm chứng qua slide theo chương AIMA, chưa thấy trực tiếp trong sách. Có thể trích "theo slide dạy AIMA", không nên trích số trang của sách.

---

## 4. Game tree, state graph, branching factor, depth và biểu diễn state

### Takeaway
Tree là các *lịch sử* chơi, graph là các *tình huống*. Bảng số phức tạp trong tài liệu đa số đếm position, không đếm state Markov thực sự; cờ vua và cờ vây đều có luật phụ thuộc lịch sử khiến position đơn thuần không phải state hợp lệ.

### Cited Findings

**Tree và graph**
- "Each node is a decision point for a player. Each root-to-leaf path is a possible outcome of the game" — [games1.pdf, PDF p.11](/home/bao/Projects/Game1/docs/games1.pdf).
- CS221 lưu ý có thể dùng game graph vì nhiều đường tới cùng state, nhưng các thuật toán chạy trên tree vì không gian state thường khổng lồ — [games1.pdf, PDF p.12](/home/bao/Projects/Game1/docs/games1.pdf).
- AIMA: cây cờ vua khoảng 35^100 ≈ 10^154 nút, trong khi search graph "chỉ" khoảng 10^40 nút phân biệt — [AIMA, §Games](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Game-tree complexity có thể lớn hơn state-space complexity vì một position có thể xuất hiện ở nhiều chỗ trong cây — [Allis 1994, §6.2](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf).

**Depth và ply**
- AIMA: cây "one move deep" gồm hai half-move, mỗi half-move là một **ply** — [AIMA](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- CS221 dùng khác: depth d nghĩa là mỗi player đi d lần; số ply bằng depth nhân số player — [games1.pdf, PDF p.70](/home/bao/Projects/Game1/docs/games1.pdf).
- Silver et al. định nghĩa b là breadth (số nước hợp lệ mỗi position), d là depth (độ dài ván), cây có khoảng b^d chuỗi nước; chess b≈35, d≈80, Go b≈250, d≈150 — [Silver et al. 2016](https://storage.googleapis.com/deepmind-media/alphago/AlphaGoNaturePaper.pdf). Ở đây d đếm theo ply, khớp với Allis ("80 ply") — [Allis §6.3](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf).
- CS221 viết Go có branching factor "up to 361" và depth "up to 100"; đó là cận hoặc xấp xỉ, không phải giá trị trung bình — [games1.pdf, PDF p.70](/home/bao/Projects/Game1/docs/games1.pdf).

**State và tính Markov**
- CS221: "a state is a summary of the past actions which is sufficient to act optimally in the future"; trong đa số game tương lai phụ thuộc đúng vị trí mọi quân nên không quên được nhiều để khai thác dynamic programming — [games1.pdf, PDF p.70](/home/bao/Projects/Game1/docs/games1.pdf).
- CS221 mô hình chess: State s = (position of all pieces, whose turn it is) — [games1.pdf, PDF p.15](/home/bao/Projects/Game1/docs/games1.pdf).
- **Shannon 1950 đã đòi nhiều hơn:** "position" gồm (1) vị trí quân, (2) bên đi, (3) vua và xe đã di chuyển chưa, (4) nước vừa đi (để xét en passant), (5) số nước từ lần đi tốt hoặc ăn quân gần nhất (luật 50 nước). Ông nói rõ "for simplicity" bỏ qua luật hòa ba lần lặp — [Shannon 1950, §2](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf).
- FIDE 2023: hòa khi có **claim** đúng của người đang có lượt lúc cùng position xuất hiện lần thứ ba (9.2); position giống nhau khi và chỉ khi cùng bên đi, cùng loại và màu quân trên cùng ô, và các nước đi khả dĩ giống nhau (9.2.3). Hòa **tự động** khi lặp năm lần (9.6.1) hoặc 75 nước của mỗi bên không đi tốt, không ăn quân (9.6.2) — [FIDE Laws of Chess, hiệu lực 01/01/2023](https://handbook.fide.com/chapter/E012023). Luật 50 nước (9.3) cũng là dạng claim — [Wikipedia, Fifty-move rule](https://en.wikipedia.org/wiki/Fifty-move_rule).
- FEN có sáu trường: vị trí quân, bên đi, quyền nhập thành, ô en passant, halfmove clock, fullmove number. FEN không đủ để quyết định có claim được hòa do lặp ba lần hay không — [Wikipedia, FEN](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation).
- Cờ vây, luật Tromp-Taylor: "A turn is either a pass; or a move that doesn't repeat an earlier grid coloring" (positional superko), và "The game ends after two consecutive passes" — [Tromp, Rules of Go](https://tromp.github.io/go.html).
- Số 2,08×10^170 của Tromp đếm các cách tô bàn cờ hợp lệ — [Tromp, Number of legal Go positions](https://tromp.github.io/go/legal.html).

**Tree và graph trên chính ví dụ của khóa học** [Tự kiểm chứng; dùng đúng `actions` của code CS221, mỗi nút có 2 nhánh]:

| Game | Số state/position trong graph | Số nút trong tree | Số lá |
|---|---|---|---|
| Halving N=15 | 24 state (player, n) đạt được | 331 | 166 |
| Halving N=100 | 152 | 411.315 | 205.658 |
| Halving N=1000 | 1.502 | ≈5,3×10^11 | ≈2,6×10^11 |
| Tic-tac-toe | 5.478 position (958 terminal) | 549.946 | 255.168 |

### Inferences
- **Phát biểu đúng về độ sâu:** cùng một phép nhân cho ba "số cây cờ vua" khác nhau, chỉ khác giả định độ dài ván: Shannon 10^120 (khoảng 80 ply, 10³ mỗi cặp nước), Allis 35^80 ≈ 10^123, AIMA 35^100 ≈ 10^154. Đừng trình bày như các phép đo mâu thuẫn; đây đều là ước lượng bậc độ lớn. Khi nghe "depth 100" phải hỏi đơn vị là ply hay cặp nước.
- b^d chỉ đúng với cây đều. Halving N=15 có đường dài nhất 15 ply và ngắn nhất 4 ply (15→7→3→1→0) [Tự kiểm chứng], tức b và d chỉ là tóm tắt thống kê.
- **Bảng halving cho thấy vì sao tách tree và graph:** số state tăng gần tuyến tính theo N còn cây tăng rất nhanh, nên DP theo state tiết kiệm lớn. Chess thì position đa số phụ thuộc đúng cấu hình quân, như CS221 nói, nên phần chồng lấp không cứu được.
- **Mô hình trong slide của CS221 là một đơn giản hóa cần gọi tên.** (position, turn) không đủ Markov cho cờ vua: cùng bàn cờ, Actions khác nhau tùy quyền nhập thành và en passant, IsEnd khác nhau tùy số lần lặp và đồng hồ nước. State Markov đầy đủ cần: (vị trí quân, bên đi, quyền nhập thành, ô en passant, halfmove clock, số lần xuất hiện của các position kể từ nước không đảo ngược gần nhất). Fullmove number của FEN không cần cho luật.
- **Chi tiết hiếm người để ý:** theo FIDE, lặp ba lần và 50 nước là claim, nên về hình thức thuộc **Actions(s)** ("claim draw"), còn lặp năm lần và 75 nước là tự động, nên thuộc **IsEnd(s)**. Cùng một ý tưởng "hòa vì không tiến triển" lại rơi vào hai thành phần khác nhau của mô hình.
- **Cờ vây còn nặng hơn:** dưới positional superko, Actions(s) phụ thuộc tập *mọi* bàn cờ đã xuất hiện, và IsEnd cần biết hai pass liên tiếp, nên một cách tô bàn không phải state Markov. Do đó 2,08×10^170 là chặn dưới về số state thực sự, không phải kích thước không gian state.
- **Whose turn:** Tic-tac-toe suy ra được lượt từ số quân (số X = số O thì X đi), nên position đã ngầm chứa lượt. Chess và halving thì không suy ra được, phải ghi trong state. Một lựa chọn tương đương cho game đối xứng: biểu diễn "theo góc nhìn người đang đi" sẽ giảm một nửa state, nhưng khi đó Utility không còn là "của agent" như định nghĩa CS221.
- **Tính hữu hạn là tính chất của mô hình, không tự có:** với cycle trong graph, cây unfold có thể vô hạn trừ khi luật cắt. Shannon viện dẫn luật 50 nước để nói game hữu hạn, và chú thích 6.350 nước là ván dài nhất — [Shannon 1950, chú thích 4](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf). Halving không có vấn đề này vì n giảm ngặt.

### Gaps
- Không có nguồn nào công bố số state "Markov đầy đủ" của cờ vua hay cờ vây; nhận xét "chặn dưới" là suy luận.
- Trang Wikipedia về luật 50 nước là nguồn thứ cấp; số điều 9.3 trùng với luật FIDE 2023 nhưng chỉ đoạn 9.2 và 9.6 được đọc trực tiếp từ FIDE handbook.

---

## 5. Policy: tất định và ngẫu nhiên, và vì sao policy đối thủ quan trọng ngang policy của ta

### Takeaway
Game có một policy cho mỗi player, và kết quả là hàm của cả cặp. Stochastic policy có ích trong mô hình để biểu diễn đối thủ không hoàn hảo và nature (đây là cách đọc của researcher; CS221 chỉ nói "convenient"); với lớp game đang xét, luôn tồn tại pure strategy tối ưu, nên ngẫu nhiên hóa không cải thiện được kết quả trong trường hợp xấu nhất.

### Cited Findings
- Deterministic: π_p(s) ∈ Actions(s). Stochastic: π_p(s,a) ∈ [0,1]. Có một π_p cho mỗi p ∈ Players, và π_p chỉ xác định khi Player(s) = p — [games1.pdf, PDF p.21-22](/home/bao/Projects/Game1/docs/games1.pdf).
- Shannon 1950 đã phân biệt đúng hai khái niệm: strategy là quy trình chọn nước cho mọi position; luôn chọn một nước là "pure", có yếu tố thống kê là "mixed" — [Shannon 1950, §2](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf).
- CS221 giải thích stochastic policy là tiện lợi, và cho thấy nature có dạng một stochastic policy đã biết — [games1.pdf, PDF p.22](/home/bao/Projects/Game1/docs/games1.pdf).
- Mọi finite game of perfect information có pure strategy Nash equilibrium suy ra được bằng backward induction (Mas-Colell et al. 1995, được trích trong) — [Schwalbe & Walker 1997](https://ageconsearch.umn.edu/record/263784/files/canterbury-nz-092.pdf).
- CS221 ký hiệu V(π_agent, π_opp) là expected utility khi hai policy đấu nhau — [games1.pdf, slide "Face off", PDF p.47-48](/home/bao/Projects/Game1/docs/games1.pdf).

**Bin game: một đề bài, ba đáp án** (số liệu từ [games1.pdf, PDF p.5-6](/home/bao/Projects/Game1/docs/games1.pdf); các cột [Tự kiểm chứng]):

| Bin | Các số | Đối thủ hợp tác (max) | Đối thủ uniform (trung bình) | Đối thủ chống lại (min) |
|---|---|---|---|---|
| A | −50, 50 | **50** | 0 | −50 |
| B | 1, 3 | 3 | 2 | **1** |
| C | −5, 15 | 15 | **5** | −5 |

Bảng chỉ dùng để chứng minh sự phụ thuộc vào giả định; cách tính tổng quát thuộc Game evaluation, Expectimax, Minimax.

### Inferences
- Ba cột cho ba đáp án khác nhau trên cùng một cây, nên "bin nào tốt nhất" không có đáp án nếu chưa chọn mô hình đối thủ. Đây là minh chứng ngắn nhất cho luận điểm mục 1, và là cầu nối tự nhiên sang ba phần còn lại của nhóm.
- Khác với MDP: ở đó V^π chỉ có một đối số vì T nằm trong đề bài. Ở game, chữ "π*" tự nó thiếu nghĩa; đúng ra là "best response đối với π_opp".
- Stochastic π_p(s,a) của CS221 là ngẫu nhiên hóa độc lập tại từng state (behavior strategy), khác về hình thức với mixed strategy của von Neumann là phân phối trên toàn bộ pure strategy. Với perfect recall hai dạng này tương đương (định lý Kuhn; kiến thức nền, **chưa kiểm chứng nguồn** trong phiên này). Không nên đưa lên slide trừ khi có thời gian.
- Với rock-paper-scissors, pure strategy thua được, nên ngẫu nhiên hóa là thiết yếu. Tương phản này là lý do von Neumann 1928 cần mixed strategy, còn lớp perfect-information thì không (chi tiết: Simultaneous games, nhóm 11).

### Gaps
- Định lý Kuhn về behavior và mixed strategy chưa được kiểm chứng trong phiên này; cần nguồn riêng nếu đưa lên slide.

---

## 6. Mô hình hóa thực hành: bin game, halving, tic-tac-toe, chess và các lỗi thường gặp

### Takeaway
Ba bài kiểm tra cho mọi mô hình game: state có đủ để Actions, Succ, IsEnd, Utility và Player là hàm của riêng state không; utility được viết theo góc nhìn của ai; game có chắc kết thúc không. Phần lớn lỗi rơi vào ba câu này.

### Cited Findings

**(a) Bin game** (đề bài: [games1.pdf, PDF p.5](/home/bao/Projects/Game1/docs/games1.pdf))

| Thành phần | Mô hình |
|---|---|
| s_start | root |
| Player | Player(root) = agent; Player(bin b) = opp |
| Actions | Actions(root) = {A,B,C}; Actions(b) = các số trong bin b |
| Succ | Succ(root,b) = b; Succ(b,x) = lá x |
| IsEnd, Utility | Đúng tại các lá; Utility(lá x) = x |
| Kích thước | 2 ply, b thay đổi 3 rồi 2, 6 lá |

**(b) Halving game.** Đề: bắt đầu từ N, luân phiên giảm 1 hoặc thay bằng ⌊N/2⌋, "the player that is left with 0 wins" — [games1.pdf, PDF p.19](/home/bao/Projects/Game1/docs/games1.pdf). Code chính thức — [CS221 game.py](https://web.stanford.edu/class/archive/cs/cs221/cs221.1196/semilive/games1/game.py):

| Thành phần | Mô hình |
|---|---|
| State | (player, number), player ∈ {+1, −1} |
| s_start | (+1, N); controller dùng N=15 |
| Actions(s) | {'-', '/'} |
| Succ | ((player,n),'-') → (−player, n−1); ((player,n),'/') → (−player, n//2) |
| IsEnd(s) | number == 0 |
| Utility(s) | player × ∞ (với number == 0) |
| Player(s) | thành phần player |

**Điểm bẫy trong đề:** tại (p, 0), player p là người *đến lượt*, tức không phải người vừa đi, và Utility cho p thắng. Vậy **người đưa số về 0 lại thua**. Đọc "left with 0" theo kiểu "tôi đưa về 0 thì thắng" sẽ ra một game khác [Tự kiểm chứng]:

| Cách hiểu | Các n ≤ 32 mà người đi tại n thua khi hai bên chơi đúng |
|---|---|
| Theo code CS221 (đến lượt tại 0 thì thắng) | 1, 4, 6, 10, 14, 16, 18, 22, 24, 26, 30 |
| Người đưa về 0 thắng | 0, 2, 6, 8, 10, 14, 18, 22, 24, 26, 30, 32 |

Theo code, N=15 là thế thắng cho người đi trước [Tự kiểm chứng]. Tại N=1 hai action cùng dẫn tới 0, tức hai cạnh tới cùng một state. Game chắc chắn kết thúc vì n giảm ngặt.

**(c) Tic-tac-toe**

| Thành phần | Mô hình |
|---|---|
| State | Bàn 9 ô; lượt suy ra được từ số quân |
| s_start | Bàn trống, X đi |
| Player(s) | X nếu #X = #O, ngược lại O |
| Actions(s) | Các ô trống |
| Succ(s,a) | Đặt quân của Player(s) vào ô a |
| IsEnd(s) | Có 3 thẳng hàng hoặc đầy bàn |
| Utility(s) | +1 X thắng, −1 O thắng, 0 hòa |

Số liệu [Tự kiểm chứng]: 3⁹ = 19.683 cấu hình thô; 5.478 position đạt được (khớp số chính xác của [Allis §6.2](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf)); 765 lớp sau khi bỏ đối xứng; 255.168 ván hoàn chỉnh gồm 131.184 X thắng, 77.904 O thắng, 46.080 hòa; giá trị khi chơi đúng là 0.

**(d) Chess**

| Thành phần | Mô hình của slide | Cần bổ sung để đúng luật |
|---|---|---|
| Players | {white, black} | |
| State | (vị trí quân, lượt đi) | Quyền nhập thành, en passant, halfmove clock, lịch sử lặp (mục 4) |
| Actions(s) | Nước hợp lệ của Player(s) | Thêm "claim draw" theo FIDE 9.2, 9.3 |
| IsEnd(s) | Checkmate hoặc draw | Draw gồm cả 9.6 (5 lần lặp, 75 nước), là hàm của lịch sử nếu state không chứa lịch sử |
| Utility(s) | +∞, 0, −∞ theo White | Nên dùng +1, 0, −1 |

Nguồn: [games1.pdf, PDF p.15](/home/bao/Projects/Game1/docs/games1.pdf); [FIDE](https://handbook.fide.com/chapter/E012023); [AIMA dùng +1, −1, 0](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).

**Các lỗi mô hình hóa thường gặp**

1. **Thiếu lượt đi trong state.** Với chess, lượt không suy ra được từ bàn cờ, và CS221 nhấn mạnh "importantly, whose turn it is" — [games1.pdf, PDF p.16](/home/bao/Projects/Game1/docs/games1.pdf).
2. **Nhầm position với state.** Xem mục 4; Shannon đã liệt kê năm thành phần từ 1950.
3. **Dùng ±∞ rồi lấy kỳ vọng.** Slide dùng ±∞ và code nhân với ∞. Với policy ngẫu nhiên, 0,5·(+∞) + 0,5·(−∞) = NaN [Tự kiểm chứng: Python trả `nan`]. Dùng được khi chỉ so sánh max/min, không dùng được cho trung bình. AIMA dùng +1/−1/0; backgammon có payoff từ +192 đến −192 — [AIMA](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
4. **Utility sai góc nhìn hoặc sai quy ước thắng thua.** Halving ở trên.
5. **Gán utility trung gian cho mục tiêu phụ** như ăn quân. CS221: "You don't get utility for capturing pieces" — [games1.pdf, PDF p.14](/home/bao/Projects/Game1/docs/games1.pdf).
6. **Giả định luân phiên cứng.** Player(s) không nhất thiết đổi sau mỗi nước; Pacman 4 ghost có 4 tầng min liên tiếp — [note07, p.3](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf).
7. **IsEnd không đủ nên có cycle.** Xem mục 4.
8. **Nhầm move với ply.** AIMA và CS221 dùng khác nhau.
9. **Cho rằng zero-sum tương đương "thắng hoặc thua".** Có hòa và có thang điểm rộng như backgammon.
10. **Mô hình hóa đối thủ thành nature mà không nói đó là giả định.** Hợp lệ khi đã biết π_opp, nhưng khi đó ta đang giải MDP, không phải game đối kháng.
11. **Đọc bảng đếm lá như lợi thế chiến lược.** X thắng nhiều hơn O trong 255.168 ván không nói gì về giá trị thật (hòa), vì bảng đếm mọi cách chơi, kể cả chơi tệ.

### Inferences
- Cách trình bày tốt cho lớp: dùng bin game để giới thiệu định nghĩa (đủ nhỏ để vẽ), dùng halving để cho thấy state phải chứa lượt, rồi kết bằng bảng chess hai cột. Cột thứ hai tạo khoảnh khắc "slide của khóa học cũng đơn giản hóa", và Shannon đã thấy điều này từ 1950.
- Phần N=15 chỉ nêu kết quả để kiểm tra mô hình; không dẫn công thức, vì Minimax là phần khác.

### Gaps
- Trang đếm tic-tac-toe của Henry Bottomley không truy cập được (lỗi TLS), nên 255.168 và 765 không có nguồn học thuật độc lập đã đọc trực tiếp; chúng được tự kiểm chứng và khớp với kết quả search. Có thể trích là "tự enumerate".
- Không có nguồn nào của CS221 giải thích rõ nghĩa "left with 0"; cách đọc trên suy ra từ code, không phải từ đáp án chính thức.

---

## 7. Vì sao game quan trọng với AI: timeline đã kiểm chứng

### Takeaway
Game là phòng thí nghiệm với luật sắc nét và thước đo không thể cãi. Mốc lịch sử cho thấy một chuỗi câu hỏi: giá trị có tồn tại không, máy tính có tính được không, máy có tự học được không, có thắng được người giỏi nhất không, có giải trọn được không.

### Cited Findings

**Lý do lịch sử**
- Shannon chọn cờ vua vì: (1) vấn đề xác định sắc nét về phép toán và mục tiêu; (2) không tầm thường mà cũng không quá khó; (3) đòi hỏi "thinking", nên lời giải buộc ta phải xét lại khái niệm đó; (4) cấu trúc rời rạc hợp máy tính số — [Shannon 1950, §1](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf).
- AIMA: game đáng quan tâm "because they are too hard to solve"; chúng buộc phải ra quyết định ngay cả khi không tính được tối ưu, và trừng phạt nặng sự kém hiệu quả — [AIMA, §Games](https://aima.cs.berkeley.edu/4th-ed/pdfs/newchap06.pdf).
- Games là testbed chính từ thời đầu AI — [games1.pdf, PDF p.4](/home/bao/Projects/Game1/docs/games1.pdf).
- Schaeffer: đóng góp lớn của AI trong game là nhận ra chiến lược giống người chưa chắc là chiến lược tính toán tốt nhất — [Schaeffer et al. 2007](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/checkers_is_solved.pdf).

**Timeline**

| Năm | Mốc, một câu chính xác | Nguồn |
|---|---|---|
| 1913 | Zermelo phân tích game hai người, không có chance, lợi ích đối nghịch ngặt, hữu hạn position, định nghĩa "winning position" bằng toán học và chặn số nước cần để thắng, với cờ vua là ví dụ. | Zermelo, Proc. Fifth Congress of Mathematicians (Cambridge 1912), CUP 1913, tr. 501-504, theo tham khảo và bản dịch trong [Schwalbe & Walker 1997](https://ageconsearch.umn.edu/record/263784/files/canterbury-nz-092.pdf) |
| 1928 | Von Neumann công bố "Zur Theorie der Gesellschaftsspiele", nguồn gốc của minimax theorem cho game hai người zero-sum. | [Math. Annalen 100:295-320, DOI](https://doi.org/10.1007/BF01448847); [History of Information](https://www.historyofinformation.com/detail.php?id=601) |
| 1950 | Shannon đề xuất lập trình máy chơi cờ, định nghĩa position và strategy, và ước tính khoảng 10^43 position, 10^120 biến thể, nên tính trọn là bất khả thi. | [Phil. Mag. Ser.7, 41(314), 3/1950](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf) |
| 1959 | Samuel xác nhận có thể lập trình để máy học chơi checkers giỏi hơn chính người viết chương trình. | [IBM J. R&D 3(3), DOI 10.1147/rd.33.0210, bản PDF](https://zoo.cs.yale.edu/classes/cs458/lectures/Samuels.pdf) |
| 1997 | Deep Blue thắng đương kim vô địch thế giới Kasparov 3,5-2,5 trong trận sáu ván, sau khi phiên bản trước thua ông năm 1996. | [Campbell, Hoane, Hsu 2002, AIJ 134:57-83](https://www.cs.oswego.edu/~mgrzenda/CSC466/Paper%20Sources/Deep%20Blue.pdf) |
| 2007 | Checkers được **weakly solved**: chơi hoàn hảo cả hai bên dẫn tới hòa, sau một tính toán chạy gần như liên tục từ 1989. | [Schaeffer et al., Science 317:1518-1522](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/checkers_is_solved.pdf) |
| 2016 | Bài Nature (1/2016) báo cáo AlphaGo thắng Fan Hui 5-0 trong trận chính thức ngày 5-9/10/2015; tháng 3/2016 AlphaGo thắng Lee Sedol 4-1 tại Seoul. | [Silver et al. 2016](https://storage.googleapis.com/deepmind-media/alphago/AlphaGoNaturePaper.pdf); [Wikipedia](https://en.wikipedia.org/wiki/AlphaGo_versus_Lee_Sedol); [Nature News](https://www.nature.com/doifinder/10.1038/nature.2016.19575) |

**Các chỗ cần trình bày cẩn thận, kể cả tài liệu của khóa học**

- **Zermelo không dùng backward induction và không chứng minh trực tiếp "cờ vua determinate".** Schwalbe & Walker: đa số phát biểu hiện đại của "Zermelo's theorem" sai ở mức độ nào đó; chỉ phát biểu về tính xác định của cờ vua là gần với nội dung ông làm, nhưng cũng chỉ là phần nhỏ; ông cho phép chuỗi nước vô hạn; backward induction xuất hiện lần đầu trong chứng minh dường như ở von Neumann & Morgenstern 1944 — [Schwalbe & Walker 1997](https://ageconsearch.umn.edu/record/263784/files/canterbury-nz-092.pdf).
- **Bài Silver 2016 không báo cáo trận Lee Sedol.** Dẫn nó cho kết quả 4-1 là sai; nó báo cáo 5-0 với Fan Hui và ghi là thắng chuyên nghiệp đầu tiên không chấp quân trên bàn cỡ đầy đủ — [Silver et al. 2016](https://storage.googleapis.com/deepmind-media/alphago/AlphaGoNaturePaper.pdf).
- **CS188 note 06 mô tả "solved" như strongly solved** ("any position can be evaluated") — [note06, p.1](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf) — trong khi tác giả công bố "checkers has been weakly solved", chứng minh từ thế xuất phát. Chỉ các position ≤10 quân (3,9×10^13) là strongly solved — [Schaeffer et al. 2007](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/checkers_is_solved.pdf).
- **CS188 slide nói Chinook "ended 40-year-reign" của Tinsley năm 1994** — [lec07, p.2](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf). Schaeffer viết chính xác hơn: Tinsley thắng sát nút năm 1992, năm 1994 rút lui giữa chừng vì bệnh và mất tám tháng sau; trận chưa kết thúc để lại câu hỏi ai giỏi hơn — [Schaeffer et al. 2007](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/checkers_is_solved.pdf).
- **"200 triệu position mỗi giây" là con số giản lược.** Campbell et al.: gần 200 triệu là điển hình ở thế tĩnh, nhưng trung bình trong trận 1997 (với các lần search trên một phút) là 126 triệu, cực đại duy trì 330 triệu — [Campbell et al. 2002](https://www.cs.oswego.edu/~mgrzenda/CSC466/Paper%20Sources/Deep%20Blue.pdf). CS188 viết "200M" — [lec07, p.2](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf). Ghi chú: phần thuật toán của Deep Blue nằm ngoài phạm vi.
- **Tên:** note06 viết "Lee Sodol" — [note06, p.1](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf); dạng chuẩn là Lee Sedol.
- **Samuel:** có hai bài cùng tên. File [Virginia](https://www.cs.virginia.edu/evans/greatworks/samuel.pdf) là phần II ("Recent Progress"), không phải bài 1959. Tài liệu cho số trang lệch nhau 210 và 211; DOI ghi 0210.

### Inferences
- Câu chuyện gọn để nói trên lớp: 1913 hỏi "có giá trị không"; 1950 trả lời "có, nhưng tính không nổi"; 1959 cho thấy máy học được; 1997 và 2016 là thắng người; 2007 là thực sự giải. Hai loại thành tựu khác nhau: **chơi giỏi hơn người** không phải **giải được**. Deep Blue và AlphaGo không giải cờ vua hay cờ vây; Chinook mới giải checkers.

### Gaps
- Không đọc được bản gốc tiếng Đức của Zermelo và von Neumann. Mô tả Zermelo dựa trên phân tích kèm bản dịch; DOI von Neumann được kiểm chứng qua các nguồn thư mục, không truy cập được trang Springer (chuyển hướng đăng nhập).
- Bản Schwalbe & Walker đã đọc là discussion paper 1997; bản tạp chí (Games and Economic Behavior 34, 2001, tr. 123-137) chỉ được xác nhận qua kết quả tìm kiếm.
- Chi tiết "Tinsley 40 năm" không được Schaeffer nêu; ông chỉ cho số liệu ba trận thua giai đoạn 1950-1991.
- Thời gian và địa điểm trận Lee Sedol dựa trên Wikipedia và Nature News qua kết quả tìm kiếm; không tìm được trang chính thức của DeepMind. Bài Nature 2017 chưa truy cập được.

---

## 8. Mở rộng: determinacy, solved và unsolved, số liệu độ phức tạp

### Takeaway
Mọi game hữu hạn trong lớp này đều có một giá trị xác định, nhưng tồn tại không có nghĩa là tính được: cờ vua "đã có đáp án" từ góc độ toán học và vẫn chưa ai biết đáp án đó. Hầu hết con số phức tạp nổi tiếng là ước lượng và phụ thuộc định nghĩa đếm cái gì.

### Cited Findings

**Determinacy**
- Shannon: vì không có chance và có perfect information, mọi position là (1) White force được thắng, (2) hòa, cả hai bên force được ít nhất hòa, hoặc (3) Black force được thắng. "This is, for practical purposes, of the nature of an existence theorem" và chưa có cách thực tế để biết thuộc loại nào — [Shannon 1950, §2](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf). Ông dẫn von Neumann & Morgenstern 1944.
- Mọi finite game of perfect information có pure strategy Nash equilibrium từ backward induction (Mas-Colell et al. 1995); phát biểu này thường bị gán cho Zermelo một cách không chính xác — [Schwalbe & Walker 1997](https://ageconsearch.umn.edu/record/263784/files/canterbury-nz-092.pdf).
- Về nguyên tắc có thể chơi hoàn hảo bằng cách xét mọi biến thể tới cuối ván rồi làm ngược lại từ cuối; một máy một biến thể mỗi micro giây sẽ cần hơn 10^90 năm cho nước đầu — [Shannon 1950, §2](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf).
- Ví dụ tồn tại mà không biết cách: Hex là ví dụ ultraweakly solved, người đi trước thắng, nhưng với bàn lớn không biết strategy thắng — [Schaeffer et al. 2007](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/checkers_is_solved.pdf).
- Shannon chứng minh được một biến thể: nếu cho phép "pass", White có ít nhất hòa, bằng lập luận đối xứng, không cần search — [Shannon 1950, §2](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf).

**Ba cấp "solved"** — [Allis 1994, §1.5, p.7-8](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf); [Schaeffer et al. 2007](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/checkers_is_solved.pdf)
- **Ultra-weakly solved:** biết giá trị game-theoretic của position ban đầu.
- **Weakly solved:** có strategy đạt ít nhất giá trị đó từ position ban đầu, cho cả hai bên, với tài nguyên hợp lý.
- **Strongly solved:** có strategy cho mọi position hợp lệ, với tài nguyên hợp lý.
- Thú vị: người có lời giải weak cho tic-tac-toe chỉ cần hòa, không cần tận dụng khi đối thủ sai — [Allis 1994, p.8](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf).

**Định nghĩa đo**
- State-space complexity: số position hợp lệ đạt được từ position đầu. Game-tree complexity: số lá của "solution search tree", tức cây full-width tới solution depth; thường xấp xỉ bằng b^d từ dữ liệu các ván đấu giải — [Allis 1994, §6.2, p.158-160](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf).

**Bảng số liệu**

| Game | Số position | Loại | Game-tree | Loại | Tình trạng |
|---|---|---|---|---|---|
| Tic-tac-toe | 5.478 ([Allis](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf); [Tự kiểm chứng]) | **Chính xác** | 9! = 362.880 ([Allis](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf)); 255.168 lá cây đầy đủ [Tự kiểm chứng] | Ước lượng; chính xác | Hòa; đã giải trọn [Tự kiểm chứng] |
| Connect Four | 4.531.985.219.092 ([OEIS A212693](https://oeis.org/A212693); [Tromp](https://tromp.github.io/c4/c4.html)) | Tính toán, do Edelkamp & Kissmann | ~10^21 (4^36, [Allis](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf)) | Ước lượng | Người đi trước thắng, Allen và Allis 1988 ([Allis](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf)) |
| Checkers | ≈5×10^20, chính xác 500.995.484.682.338.672.639 ([Schaeffer, Table 1](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/checkers_is_solved.pdf)); 10^18 ([Allis](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf)) | Đếm tổ hợp, gồm cả position không đạt được; ước lượng cũ | ~10^31 (b=2,8, 70 ply, [Allis](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf)) | Ước lượng | **Weakly solved**, hòa (2007) |
| Chess | (4,82±0,03)×10^44 ([Tromp](https://github.com/tromp/ChessPositionRanking)); ~10^43 ([Shannon](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf)); ~10^50 ([Allis](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf)) | Ước lượng bằng lấy mẫu, KTC 95%; thô; thô | 10^120 (Shannon); 10^123 (Allis) | Ước lượng | **Chưa giải**; ≤7 quân đã có tablebase đầy đủ ([Lichess](https://lichess.org/blog/W3WeMyQAACQAdfAL/7-piece-syzygy-tablebases-are-complete)) |
| Go 19×19 | 2,0817×10^170, bằng 1,196% của 3^361 ([Tromp](https://tromp.github.io/go/legal.html)) | **Chính xác** (20/1/2016) | ~10^360 (250^150, [Allis](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf)) | Ước lượng | **Chưa giải** |

**Các chi tiết làm con số này có nghĩa**
- Connect Four: Allis và Schaeffer đều dùng 10^14; số chính xác sau này là 4,5×10^12, tức ước lượng lệch khoảng 22 lần. Bài học: ước lượng cũ có thể sai hơn một bậc độ lớn — [Allis](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf); [Schaeffer](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/checkers_is_solved.pdf); [OEIS](https://oeis.org/A212693).
- Checkers: Table 1 đếm cấu hình quân (ví dụ một quân có 120 position: 32+32+28+28), và Fig. 2 ghi có position không đạt được; lời giải chỉ cần khoảng 10^14 phép tính forward cộng với database 3,9×10^13 position, so với 5×10^20 nếu giải toàn bộ bằng lưu trữ — [Schaeffer et al. 2007](https://www.cs.mcgill.ca/~dprecup/courses/AI/Materials/checkers_is_solved.pdf).
- Chess: N≈8,7×10^45 là cận trên có thể đánh số; 10^44 là ước lượng từ mẫu, trong đó tính hợp lệ được kiểm tra bằng proof game; một mẫu nhỏ hơn cho (4,59±0,38)×10^44 — [Tromp, README](https://github.com/tromp/ChessPositionRanking). Allis cho rằng 10^43 quá thấp, và cũng có cận trên 5×10^52 — [Allis §6.3](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf).
- Go: số **ván** khác hẳn số position; cận dưới 10^(10^48) và đã được cải thiện tới googolplex; chỉ riêng bàn 2×2 đã có 386.356.909.593 ván. Giá trị ~10^360 là số lá xấp xỉ, không phải số ván thật — [Tromp](https://tromp.github.io/go/legal.html). Số 3^361 ≈ 10^172 được Allis dùng làm cận trên state-space — [Allis §6.3](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf).

### Inferences
- Vì Allis xấp xỉ game-tree bằng b^d và Schaeffer đếm cấu hình không kèm lượt đi, các cột này **không so sánh được chính xác giữa các hàng**. Nên trình bày dưới dạng bậc độ lớn, ghi rõ từng số là gì, và nói rằng chúng đếm position chứ không phải state Markov (mục 4).
- [Allis §6.2](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf) dùng hai số này cho hai việc khác nhau: state-space cho biết giới hạn của phương pháp liệt kê toàn bộ, game-tree ước lượng kích thước cây minimax cần dựng. Điều này giúp giải thích vì sao có thể giải được checkers với ít hơn nhiều so với số position: lời giải weak chỉ cần chứng minh một strategy, không cần thăm mọi position. Đó là hệ quả trực tiếp của phân biệt "weak" và "strong".
- Tương phản khái niệm đáng nói: determinacy là phát biểu tồn tại về *giá trị*, không phải về khả năng tính được. Câu "cờ vua đã có đáp án, chỉ là ta không biết" chính xác về mặt toán học, nếu giả sử luật đảm bảo game hữu hạn.

### Gaps
- Tình trạng "chess chưa giải" dựa trên [Wikipedia về endgame tablebase](https://en.wikipedia.org/wiki/Endgame_tablebase) (bảng 8 quân vẫn đang được tính) và việc không tìm thấy công bố nào nói ngược lại; không có một bài sơ cấp nào phát biểu điều này như một kết quả. Tương tự với Go: Silver 2016 chỉ nói exhaustive search là bất khả thi.
- Connect Four: Allis cho biết kết quả 1988 và ghi nhận Tromp tính giá trị các position 8-ply; không có nguồn đã đọc khẳng định rõ game đã strongly solved trên toàn bàn 7×6.
- Không phân biệt được hoàn toàn số Connect Four là "chính xác đã xác nhận": OEIS ghi tổng "as computed by Edelkamp and Kissmann", không dùng chữ "exact".
- Chưa kiểm tra chéo cột số liệu với bảng "Game complexity" của Wikipedia; bảng này được ưu tiên dùng nguồn gốc thay vì Wikipedia.

---

## 9. Mô hình game ngoài bàn cờ (ngắn)

### Takeaway
Cùng tư duy mô hình "ai điều khiển gì, ai biết gì, ai được gì" áp dụng ở các bài toán thực. Các ví dụ này thường không nằm trong lớp chuẩn (thường general-sum, imperfect information), nên chỉ nên dùng để minh họa giá trị của việc mô hình hóa đối thủ.

### Cited Findings
- **An ninh:** ARMOR được triển khai tại sân bay LAX từ năm 2007 để ngẫu nhiên hóa điểm kiểm tra; game Stackelberg với bên phòng thủ cam kết trước và kẻ tấn công quan sát rồi phản ứng — [Tambe & An 2012](https://personal.ntu.edu.sg/boan/papers/AAAISS12.pdf). PROTECT lên lịch tuần tra cho US Coast Guard ở cảng Boston từ tháng 4/2011, mô hình leader-follower — [Shieh et al., AAMAS 2012](https://personal.ntu.edu.sg/boan/papers/AAMAS2012-protect.pdf).
- **Đàm phán:** Cicero (Meta FAIR) đạt mức con người trong Diplomacy, game 7 player có đàm phán bằng ngôn ngữ tự nhiên; xếp trong top 10% người chơi nhiều hơn một ván trong 40 ván ẩn danh — [Bakhtin et al., Science 2022](https://pubmed.ncbi.nlm.nih.gov/36413172/).
- **Adversarial robustness:** Madry et al. đặt huấn luyện bền vững dưới dạng bài toán saddle point (min-max): min_θ E[max_{δ∈S} L(θ, x+δ, y)], trong đó mô hình và kẻ tấn công có mục tiêu đối nghịch — [Madry et al. 2018](https://arxiv.org/abs/1706.06083).

### Inferences
- Công thức của Madry đáng cho lớp xem: kẻ tấn công được coi là player đi sau, biết θ. Cấu trúc này gần lớp zero-sum, trong khi ARMOR và PROTECT nhấn mạnh rằng thứ tự commit là phần cốt lõi của mô hình. Đều là các ví dụ của câu "Player(s) và luật ai thấy gì quan trọng ngang hàm mục tiêu".
- Các bài này nằm ngoài lớp chuẩn, nên không cần trình bày thuật toán của chúng; phần non-zero-sum và simultaneous thuộc nhóm 11.

### Gaps
- Tình trạng triển khai hiện tại của ARMOR và PROTECT không xác nhận được; nguồn đọc được đều từ khoảng 2012-2014. Nên viết "đã triển khai từ", không viết "đang dùng".
- Các nguồn an ninh là do chính nhóm phát triển viết; không tìm thấy đánh giá độc lập về hiệu quả trong phiên này.
