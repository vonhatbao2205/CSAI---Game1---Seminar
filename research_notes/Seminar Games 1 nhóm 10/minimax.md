# Minimax cho game hai người, zero-sum, theo lượt, deterministic, perfect information

Phạm vi: chỉ Minimax (nhóm 10). Expectiminimax, Evaluation functions và depth-limited search, Alpha-beta pruning, TD learning, AI Misalignment, Simultaneous games, Non-zero-sum games, định lý minimax von Neumann cho mixed strategies đều thuộc **nhóm 11**, chỉ được nhắc tối đa một dòng và có gắn nhãn.

Quy ước trích dẫn và kiểm chứng:
- Tài liệu cục bộ: [games1.pdf](/home/bao/Projects/Game1/docs/games1.pdf) (slide CS221; "tr." là số trang PDF, số in trên slide bằng tr. trừ 1), [cs188-sp26-lec07.pdf](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf), [cs188-fa23-note06.pdf](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf), [cs188-fa23-note07.pdf](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf). Các slide có hình (tr. 55, 69 của games1; tr. 19, 20 của lec07; tr. 5 của note06; tr. 3 của note07) đã được render và xem trực tiếp.
- **[Run]** nghĩa là con số do chương trình Python chỉ dùng standard library mà tôi đã thực sự chạy (`python3 -I`). Script nằm ở `/tmp/claude-1000/-home-bao-Projects-Game1/960dc642-df1c-4e34-9dcc-a8bee2337d2a/scratchpad/minimax/` gồm `ttt.py`, `ttt2.py`, `ttt3.py`, `trees.py`, `misc.py`; thư mục này là tạm, nên lõi của phép đếm được chép lại ở cuối mục Cost.
- Chứng minh trong mục Inferences là do tôi viết. Slide CS221 chỉ phác một câu, xem mục 3.
- Ký hiệu: `V*(s)` là `V_minmax(s)`; `V(π_a, π_o; s)` là `V_eval` từ state s; bỏ s nghĩa là từ `s_start`.

## 1. Recurrence V_minmax, trích policy, bước nhảy từ Expectimax, và fixed point của hai best response

### Takeaway
Minimax thay trung bình theo một mô hình đối thủ đã biết bằng phép `min`, nên giá trị không còn phụ thuộc vào policy nào. Cặp (π_max, π_min) là fixed point theo nghĩa mỗi bên là best response của bên kia, và điều này đúng tại mọi subgame chứ không chỉ tại gốc.

### Cited Findings
- Recurrence chính xác của khóa học: `V_minmax(s) = Utility(s)` nếu `IsEnd(s)`; `max_{a∈Actions(s)} V_minmax(Succ(s,a))` nếu `Player(s)=agent`; `min_{a∈Actions(s)} V_minmax(Succ(s,a))` nếu `Player(s)=opp` — [games1.pdf tr. 41](/home/bao/Projects/Game1/docs/games1.pdf).
- Trích policy: `π_max(s) = arg max_{a} V_minmax(Succ(s,a))`, `π_min(s) = arg min_{a} V_minmax(Succ(s,a))` — [games1.pdf tr. 43](/home/bao/Projects/Game1/docs/games1.pdf).
- Động cơ: "don't know opponent's policy", cách tiếp cận là "assume the worst case" — [games1.pdf tr. 37](/home/bao/Projects/Game1/docs/games1.pdf).
- So với Expectimax, chỉ có kỳ vọng theo policy đối thủ được thay bằng min trên các action; giá trị minimax "does not depend on any policies at all", là hai bên chơi tối ưu đối với nhau — [games1.pdf tr. 42](/home/bao/Projects/Game1/docs/games1.pdf).
- Expectimax tương tự value iteration của MDP; Minimax được slide ghi "No analogy in MDPs" — [games1.pdf tr. 33, 34, 41](/home/bao/Projects/Game1/docs/games1.pdf).
- Trên bucket example: Expectimax chọn bin C (giá trị 5), Minimax chọn bin B (giá trị 1) — [games1.pdf tr. 31, 39, 40](/home/bao/Projects/Game1/docs/games1.pdf).
- CS188 viết tương đương: agent-controlled là max, opponent-controlled là min, terminal là known — [cs188-fa23-note06.pdf tr. 4](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf).
- CS188 nói minimax là trường hợp đặc biệt của expectimax: minimizer là chance node gán xác suất 1 cho con có giá trị thấp nhất — [cs188-fa23-note07.pdf tr. 1](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf).
- **[Run]** Trên bucket game, duyệt mọi pure policy (agent 3, opp 2³ = 8): `max_agent min_opp = min_opp max_agent = 1`, và saddle point pure duy nhất là agent chọn B, opp chọn (−50, 1, −5) ở ba bin (`trees.py`).

### Inferences
**Bước nhảy khái niệm.** Expectimax nhận input là một mô hình π_opp và tối ưu theo mô hình đó. Minimax không nhận mô hình nào. Về mặt toán, `min_a V(a) = min_{p∈Δ} Σ_a p(a)V(a)` vì hàm tuyến tính trên simplex đạt cực tiểu tại đỉnh, nên phép min chính là "chọn phân phối xấu nhất tại từng node". Hệ quả: trong lớp game này, randomize không giúp được bên nào, kể cả agent (lập luận tương tự với max).

**Điểm tinh tế của câu "min là chance node xác suất 1".** Phân phối đó không cho trước mà được suy ra từ chính các giá trị đang tính. Đó là lý do Minimax là một fixed point chứ không chỉ là một trường hợp riêng: mô hình đối thủ phải nhất quán với các giá trị mà nó sinh ra.

**Fixed point, nói chính xác.** Đặt `BR_A(π_o) = argmax_{π_a} V(π_a, π_o)` và `BR_O(π_a) = argmin_{π_o} V(π_a, π_o)`. Từ Lemma 0 và Theorem 1, 2 ở mục 3:
- `π_max ∈ BR_A(π_min)` và `π_min ∈ BR_O(π_max)`, tức (π_max, π_min) là fixed point của ánh xạ best response kết hợp, cũng là một pure Nash equilibrium và saddle point.
- Thế π_7 := π_min vào recurrence Expectimax thì `Σ π_min(s,a) V(Succ(s,a)) = V(Succ(s, π_min(s))) = min_a V(Succ(s,a))`, nên recurrence Expectimax sụp thành recurrence Minimax. Vì vậy Expectimax chống π_min cho đúng V*.

Ba điều kiện cần nói rõ khi bị hỏi:
1. Thuật toán không lặp để hội tụ về fixed point. Một lượt bottom-up là đủ, vì V* là nghiệm duy nhất của recurrence trên cấu trúc hữu hạn không chu trình (quy nạp theo chiều cao).
2. Tính best response đúng tại **mọi** state, tức subgame-perfect. Điều ngược lại sai: có cặp best response không phải minimax policy. **[Run]** Cây `max(3, min(1, max(0,10)))` có V = 3 và hai pure equilibrium; một trong đó agent chọn 0 tại node max sâu (nước đi tệ nhưng off-path) mà vẫn cho giá trị 3 (`trees.py`).
3. Mọi equilibrium đều cùng một giá trị. **[Run]** 6.126 cặp pure equilibrium liệt kê trên 319 cây ngẫu nhiên nhỏ đều có giá trị đúng bằng V*, không vi phạm nào (`trees.py`). Đây là kiểm tra thực nghiệm, phần chứng minh là Theorem 4.

Tie-break: V* là duy nhất, còn π_max và π_min thì không. Mọi kết quả dưới đây đúng với mọi tie-break, trừ các con số V(π_max, π_opp) với π_opp không tối ưu (xem mục 3).

### Gaps
- Giá trị trong [games1.pdf tr. 15](/home/bao/Projects/Game1/docs/games1.pdf) dùng Utility ±∞ cho chess. Với stochastic policy, kỳ vọng có thể rơi vào dạng ∞ − ∞ không xác định; slide không xử lý chuyện này. Trong chứng minh tôi giả định utility hữu hạn (dùng ±1 cho win/loss).

## 2. Thực thi: pseudocode, DFS post-order, call stack, và cách values back up

### Takeaway
Minimax là một DFS post-order toàn bộ cây: đi xuống chỉ để liệt kê các tương lai giả định, không quyết định gì; quyết định chỉ xuất hiện khi giá trị được trả ngược lên. Không có vòng tròn logic, vì giá trị tại độ cao h chỉ dùng giá trị ở độ cao nhỏ hơn.

### Cited Findings
- Pseudocode dạng alternating `max-value`/`min-value` và dạng dispatch `value(state)` — [cs188-sp26-lec07.pdf tr. 16, 17](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf); [cs188-fa23-note06.pdf tr. 5](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf).
- CS188: minimax tính giá trị theo thứ tự như DFS, chính xác là "postorder traversal" — [cs188-fa23-note06.pdf tr. 5](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf).
- AIMA có pseudocode trả về cặp (utility, move), kiểm tra terminal ngay trong MAX-VALUE và MIN-VALUE, và mô tả chuỗi back-up 3, 12, 8 → 3 trên ví dụ chuẩn; thuật toán là "complete depth-first exploration" — [AIMA, Figure 5.3, tr. 150](https://aima.eecs.berkeley.edu/~russell/aima/errata/aima-150.pdf).
- CS221: giá trị của một node bằng utility của ít nhất một lá, vì giá trị chỉ được lan truyền qua min và max — [games1.pdf tr. 88](/home/bao/Projects/Game1/docs/games1.pdf).
- **[Run]** Trace thực tế trên bucket tree và ví dụ CS188 (`trees.py`): gốc = 1 với bucket; `[3, 2, 2]` → 3 với cây 3,12,8 / 2,4,6 / 14,5,2, khớp [cs188-fa23-note06.pdf tr. 5](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf).

Pseudocode đầy đủ theo phong cách khóa học (tôi ghép từ các nguồn trên, thêm hàm wrapper ở gốc):

```python
def value(state):                        # dispatch
    if IsEnd(state):             return Utility(state)
    if Player(state) == agent:   return max_value(state)
    if Player(state) == opp:     return min_value(state)

def max_value(state):
    v = -inf
    for a in Actions(state):
        v = max(v, value(Succ(state, a)))
    return v

def min_value(state):
    v = +inf
    for a in Actions(state):
        v = min(v, value(Succ(state, a)))
    return v

def minimax_decision(state):             # chỉ gốc mới cần trả về action
    return argmax(Actions(state), key=lambda a: value(Succ(state, a)))
```

Trace thực tế của bucket tree (**[Run]**, 23 sự kiện, gộp lại):

| Bước | Sự kiện | Call stack | Biến cục bộ sau bước |
|---|---|---|---|
| 1 | gọi max-value(root) | root | root.v = −∞ |
| 2 | gọi min-value(A) | root → A | A.v = +∞ |
| 3–4 | lá −50 trả về A | root → A | A.v = −50 |
| 5–6 | lá 50 trả về A | root → A | A.v = min(−50, 50) = −50 |
| 7–8 | A trả −50 về root | root | root.v = −50 |
| 9 | gọi min-value(B) | root → B | B.v = +∞ |
| 10–11 | lá 1 trả về B | root → B | B.v = 1 |
| 12–13 | lá 3 trả về B | root → B | B.v = min(1, 3) = 1 |
| 14–15 | B trả 1 về root | root | root.v = max(−50, 1) = 1 |
| 16 | gọi min-value(C) | root → C | C.v = +∞ |
| 17–18 | lá −5 trả về C | root → C | C.v = −5 |
| 19–20 | lá 15 trả về C | root → C | C.v = −5 |
| 21–22 | C trả −5 về root | root | root.v = max(1, −5) = 1 |
| 23 | root trả 1, action = B | (rỗng) | V* = 1 |

Thứ tự post-order: −50, 50, A, 1, 3, B, −5, 15, C, root.

### Inferences
**Trên call stack có gì.** Tại mọi thời điểm stack chính là đường đi từ gốc đến node hiện tại. Mỗi frame giữ ba thứ: state, vị trí trong vòng lặp action (hoặc danh sách successor còn lại), và `v` tốt nhất tới lúc đó. Các nhánh đã xong chỉ còn lại dấu vết dưới dạng một con số trong `v` của cha. Đó là lý do bộ nhớ chỉ tuyến tính theo độ sâu dù thời gian là mũ.

**Làm sao tới được lá trước khi biết quyết định ở gốc?** Vì đi xuống không cần quyết định. Vòng `for` thử **mọi** action; đường đi trên stack là một giả định "nếu chơi thế này", không phải một cam kết. Quyết định là output của post-order, không phải input. Đây là khác biệt với agent chơi thật: khi chơi chỉ có một đường, khi tính thì có mọi đường.

**Vì sao lựa chọn hiện tại phụ thuộc vào giá trị đã giả định chơi tối ưu trong tương lai, mà không vòng tròn?**
1. Về logic: V* định nghĩa bằng đệ quy cấu trúc. Giá trị tại độ cao h chỉ dùng giá trị tại độ cao nhỏ hơn, và lá có giá trị do luật chơi cho. "Tương lai chơi tối ưu" không phải giả thiết treo lơ lửng mà là giả thiết quy nạp đã được chứng minh ở tầng dưới.
2. Về mô hình: state tóm tắt đủ quá khứ, utility chỉ phụ thuộc lá, không có thông tin ẩn. Vậy subgame từ s' không phụ thuộc cách đi tới s', và cả hai người sẽ tái tối ưu tại đó. Đây là principle of optimality; giá trị của một nước đi bằng giá trị của subgame mà nó mở ra.
3. Trực giác: bạn chọn bin nào thì đối thủ chọn số *sau khi đã thấy bin*. Để biết bin B đáng giá bao nhiêu với bạn, bạn phải trả lời "đối thủ sẽ làm gì khi ở B" trước.

**Ba điểm trong pseudocode mà giảng viên có thể bắt:**
- Dạng alternating ở [cs188-sp26-lec07.pdf tr. 16](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf) không có terminal test. Nếu chạy nguyên văn, terminal không có successor sẽ trả về −∞ hoặc +∞. Slide tr. 17 sửa bằng dispatcher; AIMA đặt test ngay trong hàm.
- Dạng alternating còn ngầm giả định max và min luân phiên, nên hỏng khi có nhiều ghost hoặc extra turn; dạng dispatch theo `Player(state)` thì không (mục 6).
- [cs188-fa23-note06.pdf tr. 5](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf) nói minimax "will return an action", nhưng pseudocode hiển thị chỉ `return v`. Cần wrapper arg max ở gốc như trên.

### Gaps
- Không có khoảng trống đáng kể cho mục này.

## 3. Bộ tính chất của khóa học: bất đẳng thức, bảng số, chứng minh, guarantee và non-guarantee

### Takeaway
Chuỗi `V(π_exptmax(7), π_min) ≤ V(π_max, π_min) ≤ V(π_max, π_7) ≤ V(π_exptmax(7), π_7)` trên bucket là −5 ≤ 1 ≤ 2 ≤ 5. Guarantee chính xác: mọi ván theo π_max, chống bất kỳ đối thủ nào, đều kết thúc với utility ≥ V*, và không policy nào đảm bảo được nhiều hơn; non-guarantee: khoảng cách tới best response có thể lớn tùy ý.

### Cited Findings
- Property 1, "best against minimax opponent": `V(π_max, π_min) ≥ V(π_agent, π_min)` với mọi π_agent — [games1.pdf tr. 49](/home/bao/Projects/Game1/docs/games1.pdf).
- Property 2, "lower bound against any opponent": `V(π_max, π_min) ≤ V(π_max, π_opp)` với mọi π_opp — [games1.pdf tr. 51](/home/bao/Projects/Game1/docs/games1.pdf).
- Property 3, "not optimal if opponent is known": `V(π_max, π_7) ≤ V(π_exptmax(7), π_7)` với đối thủ π_7 — [games1.pdf tr. 53](/home/bao/Projects/Game1/docs/games1.pdf).
- Slide dùng ký hiệu π_7 (một đối thủ cố định, cụ thể là uniform trong ví dụ), không phải π_opp; đề bài viết `V(pi_exptmax, pi_opp)` chính là ô này — [games1.pdf tr. 47, 48](/home/bao/Projects/Game1/docs/games1.pdf).
- Bảng số (đã xem hình slide), cùng các dấu so sánh ≤ (hàng trên), ≥ (cột trái), ≤ (cột phải) — [games1.pdf tr. 55](/home/bao/Projects/Game1/docs/games1.pdf):

| | π_min | π_7 (uniform) |
|---|---|---|
| **π_max** (chọn B) | V(π_max, π_min) = **1** | V(π_max, π_7) = **2** |
| **π_exptmax(7)** (chọn C) | V(π_exptmax(7), π_min) = **−5** | V(π_exptmax(7), π_7) = **5** |

- **[Run]** Tính lại khớp slide: min theo bin {A: −50, B: 1, C: −5}; mean {A: 0, B: 2, C: 5}; max {A: 50, B: 3, C: 15}; bốn ô = 1, 2, −5, 5 (`trees.py`).
- Slide chỉ nêu ý chứng minh: "perform induction starting from the leaves" — [games1.pdf tr. 50](/home/bao/Projects/Game1/docs/games1.pdf).
- Ghi chú slide về Property 2: nếu minimax value là 1 thì agent được đảm bảo ít nhất 1 dù đối thủ làm gì — [games1.pdf tr. 52](/home/bao/Projects/Game1/docs/games1.pdf).
- CS188 đặt câu hỏi: "Optimal against a perfect player. Otherwise?" với cây lá 10, 10, 9, 100 — [cs188-sp26-lec07.pdf tr. 19](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf). **[Run]** Minimax value của cây này là 10 (`trees.py`).
- CS188 mô tả minimax "often overly pessimistic" khi đối thủ không chắc tối ưu — [cs188-fa23-note07.pdf tr. 1](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf).
- **[Run] Kiểm chứng thực nghiệm** (không thay thế chứng minh): 11.448 mẫu policy, pure lẫn stochastic, số học chính xác `Fraction`, trên 2.862 cây ngẫu nhiên: 0 vi phạm Lemma 0, P1, P2, P3 (`trees.py`).

### Inferences
**Giả thiết.** Game có chiều cao hữu hạn (cây, hoặc DAG khi gộp state), số action hữu hạn, utility hữu hạn. Policy có thể stochastic; deterministic là trường hợp xác suất 1. `V(π_a, π_o; s)` tuân theo recurrence `V_eval` ở [games1.pdf tr. 27](/home/bao/Projects/Game1/docs/games1.pdf). Mọi quy nạp đều theo `h(s)`, số bước dài nhất từ s đến terminal. Base case `IsEnd(s)` luôn tầm thường vì mọi vế đều bằng `Utility(s)`, nên chỉ viết bước quy nạp.

**Lemma 0.** `V(π_max, π_min; s) = V*(s)` với mọi s.
- Node agent: `V(π_max, π_min; s) = V(π_max, π_min; Succ(s, π_max(s)))` `=` (IH) `V*(Succ(s, π_max(s)))` `=` (định nghĩa π_max) `max_a V*(Succ(s,a))` `= V*(s)`.
- Node opp: giống hệt với π_min và min. ∎

**Theorem 1 (Property 1).** Với mọi π_agent và mọi s: `V(π_agent, π_min; s) ≤ V*(s)`.
- Node agent: `Σ_a π_agent(s,a) V(π_agent, π_min; Succ(s,a))` `≤` (IH, trọng số ≥ 0) `Σ_a π_agent(s,a) V*(Succ(s,a))` `≤` (trung bình ≤ max) `max_a V*(Succ(s,a)) = V*(s)`.
- Node opp: `V(π_agent, π_min; s) = V(π_agent, π_min; Succ(s, π_min(s)))` `≤` (IH) `V*(Succ(s, π_min(s))) = min_a V*(Succ(s,a)) = V*(s)`. ∎

Kết hợp Lemma 0 ta có đúng dạng slide: `V(π_agent, π_min) ≤ V(π_max, π_min)`.

**Theorem 2 (Property 2).** Với mọi π_opp và mọi s: `V(π_max, π_opp; s) ≥ V*(s)`.
- Node opp: `Σ_a π_opp(s,a) V(π_max, π_opp; Succ(s,a))` `≥` (IH) `Σ_a π_opp(s,a) V*(Succ(s,a))` `≥` (trung bình ≥ min) `min_a V*(Succ(s,a)) = V*(s)`.
- Node agent: `V(π_max, π_opp; s) = V(π_max, π_opp; Succ(s, π_max(s)))` `≥` (IH) `V*(Succ(s, π_max(s))) = V*(s)`. ∎

**Theorem 3 (Property 3).** Cố định π_7. Gọi `V_E` là `V_exptmax(7)` và `π_E` là `π_exptmax(7)`, tức `π_E(s) = argmax_a V_E(Succ(s,a))`. Với mọi π_agent và mọi s: (a) `V(π_E, π_7; s) = V_E(s)`, và (b) `V(π_agent, π_7; s) ≤ V_E(s)`.
- (a) Node agent: chạy theo π_E rồi IH cho `V_E(Succ(s, π_E(s))) = max_a V_E(Succ(s,a)) = V_E(s)`. Node opp: `Σ π_7(s,a) V(π_E, π_7; Succ(s,a))` `=` (IH) `Σ π_7(s,a) V_E(Succ(s,a)) = V_E(s)`.
- (b) Node agent: `Σ π_agent(s,a) V(π_agent, π_7; Succ(s,a)) ≤ Σ π_agent(s,a) V_E(Succ(s,a)) ≤ max_a V_E(Succ(s,a)) = V_E(s)`. Node opp: `Σ π_7(s,a) V(π_agent, π_7; Succ(s,a)) ≤ Σ π_7(s,a) V_E(Succ(s,a)) = V_E(s)`. ∎

Lấy π_agent = π_max ở (b) được đúng Property 3. Bất đẳng thức có thể là đẳng thức; chẳng hạn khi π_7 = π_min thì cả hai vế đều bằng V*.

**Corollary (chuỗi).** `V(π_E, π_min)` `≤` (T1 với π_agent = π_E) `V(π_max, π_min)` `≤` (T2 với π_opp = π_7) `V(π_max, π_7)` `≤` (T3) `V(π_E, π_7)`. Bucket: −5 ≤ 1 ≤ 2 ≤ 5.

**Theorem 5 (guarantee theo từng ván, mạnh hơn Property 2).** Trên mọi đường chơi mà agent theo π_max, `V*` không bao giờ giảm. Thật vậy, tại node agent `V*(Succ(s, π_max(s))) = V*(s)`, tại node opp mọi con đều có `V*(Succ(s,a)) ≥ min = V*(s)`. Tới lá thì `V*` chính là utility, nên **mọi lá reachable có `Utility ≥ V*(s_start)`**, không chỉ về kỳ vọng. ∎
- **[Run]** Tic-tac-toe, π_max vị trí X: 185 state reachable chống mọi hành vi đối thủ, 59 lá, utility nhỏ nhất 0, tính đơn điệu của V* đúng trên mọi cạnh (`ttt.py`). Bucket: chọn B thì lá chỉ có thể là 1 hoặc 3, đều ≥ 1.

**Guarantee chính xác.** Hai vế gộp lại:
- *Đảm bảo được V*:* Theorem 2 và 5.
- *Không đảm bảo được hơn V*:* Theorem 1 nói mọi π_agent chống π_min đều ≤ V*, nên `min_{π_o} V(π_agent, π_o) ≤ V*`.

Vậy V* là lower bound chặt nhất có thể đạt được khi không biết gì về đối thủ. Guarantee này không đòi hỏi đối thủ hoàn hảo; đối thủ có thể là bất kỳ policy nào, kể cả stochastic hay phụ thuộc lịch sử (trên cây đã unfold, mỗi node là một lịch sử).

**Non-guarantee chính xác.**
- π_max không phải best response với đối thủ không tối ưu, và khoảng cách không bị chặn. **[Run]** Họ game: bin A = {0, M}, bin B = {1, 1}. π_max chọn B, được 1 chống uniform; π_exptmax chọn A, được M/2. Với M = 10⁹: 1 so với 5×10⁸; trong khi cái giá của Expectimax khi gặp π_min chỉ là 0 so với 1 (`trees.py`).
- Chiều ngược lại: nếu mô hình đối thủ sai, Expectimax cũng có thể mất nhiều, −5 so với 1 ở bucket. Đây là đánh đổi giữa khai thác và bảo hiểm; không policy nào thắng trên mọi ô.
- π_max không có ưu tiên nào giữa các nước cùng giá trị, nên hiệu quả chống đối thủ yếu phụ thuộc tie-break.

**Bảng bốn ô trên tic-tac-toe, tính chính xác bằng phân số** (**[Run]** `ttt.py`, `ttt2.py`, `ttt3.py`; utility +1/0/−1 theo góc nhìn agent; π_7 uniform; tie-break chọn ô đầu tiên):

| Agent ở vị trí | V(π_max, π_min) | V(π_max, uniform) | V(π_E, π_min) | V(π_E, uniform) | π_E tệ nhất chống đối thủ bất kỳ | Khoảng V(π_max, uniform) trên mọi tie-break |
|---|---|---|---|---|---|---|
| X (đi trước) | 0 | 191/192 ≈ 0,9948 | 0 | 191/192 ≈ 0,9948 | 0 | [161/192; 191/192] ≈ [0,8385; 0,9948] |
| O (đi sau) | 0 | 254/315 ≈ 0,8063 | 0 | 874/945 ≈ 0,9249 | **−1** | [542/945; 866/945] ≈ [0,5735; 0,9164] |

Ba điều rút ra từ bảng này:
1. Vị trí X với tie-break ô đầu: π_max đạt đúng best response, nên Property 3 có thể chặt. Vị trí O: mọi minimax policy đều dưới best response (866/945 < 874/945).
2. Giá trị V(π_max, π_7) không phải một con số duy nhất: nó phụ thuộc tie-break, biên độ lớn. V* thì không.
3. **Điểm hay để trả lời giảng viên:** `V(π_E, π_min) = 0` nhưng π_E vẫn có thể thua, worst case −1. Lý do: π_min là best response với π_max, **không** nhất thiết với π_E. Ô `V(π_exptmax, π_min)` là giá trị chống một đối thủ cụ thể, không phải worst case của π_exptmax. Bucket che mất điều này vì cây chỉ hai tầng: tại mỗi bin π_min chọn lá nhỏ nhất, nên nó là best response với mọi agent.

Simulation đối chiếu: **[Run]** 200.000 ván π_max (X) chống uniform, seed 1: 198.956 thắng, 1.044 hòa, 0 thua (`ttt.py`), khớp 191/192 và Theorem 5.

**Những câu chữ trong tài liệu nên nói chính xác hơn:**
- [games1.pdf tr. 50](/home/bao/Projects/Game1/docs/games1.pdf) viết "minimax value of each node is the highest over all possible policies"; chính xác là cao nhất *chống π_min*, không phải chống mọi đối thủ (T3 cho thấy có thể cao hơn).
- [cs188-fa23-note06.pdf tr. 2](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf) và [note07 tr. 6](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf) nói minimax dùng khi đối thủ tối ưu. "Đối thủ tối ưu" là điều kiện để value *xảy ra đúng bằng* V*, không phải điều kiện để guarantee có hiệu lực.

### Gaps
- Không tìm thấy trong tài liệu khóa học chứng minh đầy đủ của ba property. Các chứng minh trên là của tôi, đã soát từng bước và kiểm thử thực nghiệm, nhưng chưa được đối chiếu với một bản chứng minh in sẵn.

## 4. Giá trị của game: Zermelo, backward induction (Kuhn), thứ tự min/max, và các ngộ nhận lịch sử

### Takeaway
Trong game hữu hạn perfect information, backward induction chứng minh luôn tồn tại giá trị và pure optimal policy. Nhưng đó là phát biểu hiện đại: theo Schwalbe & Walker, bài năm 1913 của Zermelo chủ yếu nghiên cứu số nước tối đa để ép thắng, cho phép ván vô hạn, và không dùng backward induction.

### Cited Findings
Đã đọc trực tiếp [bản working paper của Schwalbe & Walker (August 1997, revised October 1999)](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf), gồm cả bản dịch tiếng Anh bài của Zermelo ở phụ lục. Bản in chính thức là *Games and Economic Behavior* 34(1), 2001, tr. 123–137.
- Các phát biểu hiện đại bị gán cho Zermelo: chess determinate (Aumann, Hart, Eichberger); "mọi finite perfect-information game có pure-strategy Nash equilibrium suy ra bằng backward induction" (Mas-Colell et al.); first mover không thua (Dimand & Dimand); Zermelo dùng backward induction (Binmore). S&W kết luận hầu hết "to some degree incorrect", và chỉ phát biểu về determinateness là gần với Zermelo, "but even this covers only a minor part of his paper" — [S&W, tr. 1–2](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- Zermelo thực sự xét: hai người, không chance, lợi ích đối lập; hữu hạn **positions**; nhưng cho phép dãy nước vô hạn vì không xét stopping rule. Việc giới hạn vào finite game bắt nguồn từ von Neumann & Morgenstern — [S&W, tr. 3 và chú thích 6](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- Hai câu hỏi của Zermelo: (1) "ở vị trí thắng" định nghĩa toán học thế nào (một tập dãy nước khác rỗng); (2) nếu ở vị trí thắng, cần bao nhiêu nước để ép thắng. Ông quan tâm chủ yếu câu 2, và khẳng định không bao giờ cần nhiều nước hơn số position — [S&W, tr. 3](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- "No use is made of backward induction"; chứng minh bằng phản chứng qua lặp position. Lần đầu có chứng minh bằng backward induction "seems to be" ở von Neumann & Morgenstern; lần đầu Zermelo được nhắc cùng induction là Kuhn (1953) — [S&W, tr. 3–4](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- First-mover claim bị bác: cả hai tập đều có thể rỗng, nghĩa là White có thể không đảm bảo được không thua — [S&W, tr. 3](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- Lỗ hổng của Zermelo: König (1927) chỉ ra lập luận non-repetition chưa đủ vì Black có thể đổi nước; Zermelo gửi chứng minh đúng in trong phụ lục bài của König; Kalmár (1928/29) khôi phục ý non-repetition tổng quát — [S&W, tr. 5–9](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- Phát biểu tam phân rõ ràng "thắng A / thắng B / hòa" mà ngày nay gọi là Zermelo's theorem được S&W ghi nhận là của Kalmár (1928/29, tr. 84) — [S&W, tr. 9](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- Zermelo, König, Kalmár không bàn equilibrium hay "nên chơi thế nào"; đó là câu hỏi của von Neumann (1928) — [S&W, tr. 10](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- Zermelo nguyên văn: "The question as to whether the starting position p0 is already a 'winning position' for one of the parties is still open" — [bản dịch S&W, tr. 15](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- Slide của MIT ghi theo cách phổ biến: "Theorem 2 (Zermelo 1913; Kuhn 1953): In a finite extensive form game of perfect information, the outcome(s) of backward induction constitutes a pure-strategy Nash equilibrium" — [Manea, MIT 14.126, slide 20](https://ocw.mit.edu/courses/14-126-game-theory-spring-2016/ecc1948438ed71a5e77eb29f123a4eef_MIT14_126S16_Extensive.pdf).
- Ewerhart (2002): chess thực ra là infinite game nên backward induction không áp dụng theo nghĩa chặt; lập luận gốc cho minmax theorem của chess là "forward rather than backward looking"; bản infinite có thể quy về bản finite — [Ewerhart, abstract working paper](https://ideas.repec.org/p/xrs/sfbmaa/01-28.html). Shannon làm chess hữu hạn bằng 50-move rule và ghi "by working backward from the end one can determine whether there is a forced win" — [Shannon 1950, §2](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf). S&W nêu stopping rule thông dụng khác là position lặp ba lần — [S&W, chú thích 6](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- **Xung đột nguồn:** Wikipedia viết S&W cho thấy Zermelo chứa "basic idea of backward induction", và Kalmár lần đầu nhắc đến nó — [Wikipedia: Zermelo's theorem](https://en.wikipedia.org/wiki/Zermelo%27s_theorem_(game_theory)). Văn bản S&W tôi đọc nói ngược lại: "Zermelo's original method was not backward induction", và "Kalmár's proof of non-repetition was not by backward induction" ([S&W, tr. 9–10](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf)). Khi thuyết trình, **dùng S&W, đừng dùng Wikipedia** cho điểm này.
- **[Run]** Tic-tac-toe root V* = 0 và cả chín nước đầu của X đều có V* = 0 (`ttt.py`, `ttt2.py`).

### Inferences
**Theorem 4 (giá trị tồn tại, thứ tự max/min không quan trọng trên không gian policy).**
`max_{π_a} min_{π_o} V(π_a, π_o) = min_{π_o} max_{π_a} V(π_a, π_o) = V*(s_start)`.

Chứng minh:
- Weak duality luôn đúng: max min ≤ min max.
- `max min ≥ min_{π_o} V(π_max, π_o)` `≥` (T2) `V*`.
- `min max ≤ max_{π_a} V(π_a, π_min)` `≤` (T1) `V*`.
- Vậy `V* ≤ max min ≤ min max ≤ V*`. ∎

Với utility ±1, 0: V* = +1 là agent ép thắng, V* = −1 là opp ép thắng, V* = 0 là cả hai ép được ít nhất hòa. Đây là cách phát biểu backward induction hiện đại; không nên gọi đó là điều Zermelo đã chứng minh theo nghĩa nguyên văn.

Lưu ý hai nghĩa của "thứ tự": đổi thứ tự toán tử max/min trên **policy** không đổi giá trị, vì policy là kế hoạch có điều kiện trên cùng một cây. Còn đổi **ai đi trước** là một cây khác, có thể cho giá trị khác; không mâu thuẫn gì.

**Một dòng, thuộc nhóm 11:** trong simultaneous game thứ tự có ý nghĩa vì `max min` trên pure strategy có thể nhỏ hơn hẳn `min max`, do người đi sau trong công thức được "thấy" một lựa chọn mà luật chơi không cho thấy.

**Điểm nối đáng nói (suy luận của tôi).** Đặc trưng của Kalmár, "tập M nhỏ nhất đóng dưới: A có một nước vào M, hoặc mọi nước của B đều vào M" ([S&W, tr. 8](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf)), chính là least fixed point mà retrograde analysis tính từng bước ở mục 6. Tức là phần "fixed point" của Minimax có gốc lịch sử rõ ràng, dù không phải qua Zermelo. Đồng thời, các tập U*, V* của Zermelo chính là "thắng nhanh nhất, thua chậm nhất" ([bản dịch S&W, tr. 13–15](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf)), nối trực tiếp với tie-break ở mục 6.

**Câu trả lời gọn:** "Zermelo 1913 định nghĩa chặt 'vị trí thắng' và lập luận rằng thắng được thì thắng được trong số nước không vượt quá số position; không dùng backward induction, không giả định game hữu hạn, và không nói chess thuộc loại nào. Phát biểu ba trường hợp là của Kalmár; backward induction xuất hiện rõ ở von Neumann & Morgenstern; Kuhn 1953 là nơi đầu tiên gắn Zermelo với induction."

### Gaps
- **Chưa đọc được bản gốc** Kuhn (1953), von Neumann & Morgenstern, Zermelo (tiếng Đức). Vai trò của Kuhn ở đây lấy qua S&W và slide MIT; slide MIT là nguồn thứ cấp và chính nó lặp lại cách gán tên mà S&W phê phán.
- S&W trích von Neumann & Morgenstern theo năm 1953 (ấn bản họ dùng), không phải 1944. Một số nguồn thứ cấp ghi 1944. Tôi chưa kiểm tra section cụ thể trong sách.
- Bản tôi đọc là working paper revised 1999, không phải bản in 2001; số trang ở trên là của working paper. Tôi chưa đối chiếu từng câu với bản in.
- Abstract Ewerhart chỉ đọc qua trang RePEc; toàn văn cần subscription.

## 5. Cost: thời gian, không gian, quan hệ giữa các quy ước, số đếm thật, và feasibility

### Takeaway
Time là `O(b^m)`, space là `O(bm)` hoặc `O(m)` tùy cách sinh successor, và `O(b^{2d})` của CS221 đơn giản là `m = 2d`. Tic-tac-toe đo được 549.946 node trong khoảng một giây; chess và Go lớn đến mức cả tree lẫn bảng state đều bất khả thi, nên Minimax đầy đủ chỉ là định nghĩa của điều cần xấp xỉ.

### Cited Findings
- AIMA: time `O(b^m)`; space `O(bm)` nếu sinh mọi action một lúc, hoặc `O(m)` nếu sinh từng action; chess `b ≈ 35`, ván trung bình khoảng 80 ply, `35^80 ≈ 10^123` — [AIMA tr. 150](https://aima.eecs.berkeley.edu/~russell/aima/errata/aima-150.pdf).
- CS188: time `O(b^m)`, space `O(bm)`, "just like (exhaustive) DFS", chess `b ≈ 35, m ≈ 100`, "exact solution is completely infeasible" — [cs188-sp26-lec07.pdf tr. 20](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf).
- CS221: "branching factor b, depth d (2d plies)", "O(d) space, O(b^{2d}) time", chess `b ≈ 35, d ≈ 50`, in kèm một số 155 chữ số — [games1.pdf tr. 69](/home/bao/Projects/Game1/docs/games1.pdf). **[Run]** Con số đó bằng đúng `35^100` (`int(s) == 35**100` trả về True).
- CS221: "a game tree of depth d corresponds to a tree where each player has moved d times", mỗi level là một ply — [games1.pdf tr. 70](/home/bao/Projects/Game1/docs/games1.pdf). **Xung đột thuật ngữ:** Project 2 CS188 lại viết "a single search ply is considered to be one Pacman move and all the ghosts' responses" — [CS188 Project 2](https://inst.eecs.berkeley.edu/~cs188/fa23/projects/proj2/). Khi nói "ply", cần xác định đang theo nghĩa nào.
- Shannon 1950: khoảng 30 nước hợp lệ mỗi lượt, nên một cặp nước là khoảng 10³; ván khoảng 40 nước; **10^120 variations**; máy một variation mỗi microsecond cần "over 10^90 years"; số position cỡ `64!/(32! (8!)² (2!)⁶) ≈ 10^43` — [Shannon 1950](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf).
- Số legal chess positions ước lượng khoảng 4,8×10^44 — [Tromp](https://tromp.github.io/chess/chess.html). Số legal Go positions 19×19 là khoảng 2,08×10^170, xác định ngày 20/1/2016 — [Tromp](https://tromp.github.io/go/legal.html).
- Go: `3^361` ≈ 3×10^172 là cận trên state; b trung bình 250, độ dài 150 ply, game-tree complexity khoảng 10^360 — [Allis 1994](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf). CS221 ghi branching "up to 361" và độ sâu tới 100 — [games1.pdf tr. 70](/home/bao/Projects/Game1/docs/games1.pdf). **Xung đột:** Wikipedia ghi Go game-tree 10^505 với 211 ply — [Wikipedia: Game complexity](https://en.wikipedia.org/wiki/Game_complexity). Hai con số khác nhau vì giả định độ dài ván khác nhau; không có giá trị "đúng" duy nhất.
- Tic-tac-toe trong tài liệu: 5.478 legal positions, và `9! = 362.880` là ước lượng lá theo định nghĩa game-tree complexity — [Allis 1994, §6.2](https://project.dke.maastrichtuniversity.nl/games/files/phd/SearchingForSolutions.pdf); 255.168 games, 765 positions modulo symmetry — [Bottomley](http://www.se16.info/hgb/tictactoe.htm); 549.946 node, 255.168 lá gồm 131.184 / 77.904 / 46.080, 16.168 call với hashing, 2.271 call với symmetry — [Lomont 2024](https://www.lomont.org/posts/2024/minimaltictactoe/).
- **[Run] Đếm thật tic-tac-toe** (`ttt.py`, `ttt3.py`). Ván dừng ngay khi có người thắng:

| Đại lượng | Kết quả chạy | Đối chiếu nguồn |
|---|---|---|
| Node của cây (= số lần gọi value) | **549.946** (294.778 trong, 255.168 lá) | Khớp Lomont |
| Lá = số ván | **255.168** | Khớp Bottomley, Lomont |
| X thắng / O thắng / hòa | 131.184 / 77.904 / 46.080 | Khớp Lomont |
| Lá theo độ sâu 5, 6, 7, 8, 9 | 1.440 / 5.328 / 47.952 / 72.576 / 127.872 | Khớp Bottomley (127.872 = 81.792 + 46.080) |
| Node theo độ sâu 0…9 | 1, 9, 72, 504, 3.024, 15.120, 54.720, 148.176, 200.448, 127.872 | Tổng đúng 549.946 |
| Reachable states | **5.478** (958 terminal, gồm 626 X, 316 O, 16 hòa) | 5.478 khớp Allis |
| States modulo 8 symmetry | **765** (138 lớp terminal) | 765 khớp Bottomley |
| Root V* | 0 (hòa) | |
| Frame tối đa | 10 (độ sâu 9 cộng gốc) | |
| Thời gian | 1,154 giây, khoảng 476.654 node/giây (một lần chạy CPython, phụ thuộc máy) | |

- **[Run] Vì sao `b^m` không phải số đếm chính xác:** `9^9` = 387.420.489 so với 549.946 thực tế. Chính xác hơn: b giảm dần nên có `Σ 9!/(9−k)!` = 986.410 node nếu không dừng sớm; còn lại nhờ dừng khi có người thắng (`ttt.py`). Số 986.410 khớp cận trên của [trang U. Alberta](https://webdocs.cs.ualberta.ca/~hayward/396/jem/ttt.html) (chỉ đối chiếu qua snippet tìm kiếm).
- **[Run] Peak bộ nhớ** tic-tac-toe: 10 frame với kiểu lazy; kiểu eager giữ tối đa 44 successor slot trong lần chạy, cận trên 9+8+…+1 = 45 (`misc.py`).
- **[Run] Feasibility** (`trees.py`, `misc.py`):

| Ước lượng | Giá trị | Ở 10⁶ /s | Ở 2×10⁸ /s | Ở 10¹⁸ /s |
|---|---|---|---|---|
| `35^100` (CS221, CS188) | 2,55×10^154 | 8,1×10^140 năm | 4,0×10^138 năm | 8,1×10^128 năm |
| `10^120` (Shannon) | 10^120 | 3,2×10^106 năm | 1,6×10^104 năm | 3,2×10^94 năm |

Ngoài ra: `35^80` = 10^123,5 (AIMA); `250^150` = 10^359,7 (Allis); công thức position của Shannon cho 4,6×10^42; lưu chỉ 2 bit WDL cho 4,8×10^44 position cũng cần 1,2×10^44 byte (`trees.py`, `misc.py`).

- **[Run]** Với b = 35, tăng tốc máy gấp đôi chỉ thêm 0,195 ply; gấp 1.000 lần thêm 1,94 ply; gấp 10⁶ lần thêm 3,89 ply. Với 10⁶ node chỉ tới khoảng 3,9 ply; 10⁹ node khoảng 5,8 ply.

### Inferences
**Đối chiếu ba quy ước.**

| Nguồn | Tham số độ sâu | Time | Space | Chess |
|---|---|---|---|---|
| CS188 / note06 | m = độ sâu tầng terminal, tính bằng ply | O(b^m) | O(bm) | 35^100 |
| AIMA | m = độ sâu tối đa, ply | O(b^m) | O(bm) hoặc O(m) | 35^80 |
| CS221 | d = số lượt mỗi người, m = 2d | O(b^{2d}) | O(d) | 35^{2·50} = 35^100 |

Với k adversary, một vòng có k+1 ply, nên `m = (k+1)d` (mục 6). Khác biệt space chỉ là cách đếm: `O(bm)` lưu danh sách successor chưa duyệt trong từng frame; `O(m)` giữ một iterator. Cả hai giả định state cỡ O(1) hoặc undo move tại chỗ; nếu copy state cỡ S vào mỗi frame thì nhân thêm S. `O(d)` của CS221 thuộc họ `O(m)`, vì d và m chỉ khác hằng số.

**Không có best case.** Minimax không pruning luôn thăm toàn bộ cây bất kể giá trị lá, nên time là Θ(số node), không phụ thuộc thứ tự action. Với cây b-ary đều: `(b^{m+1}−1)/(b−1)`; lá chiếm gần hết. **[Run]** b = 35, m = 4: 1.544.761 node so với 35⁴ = 1.500.625, tức chỉ hơn 2,94%.

**Shannon's number.** 10^120 là phép nhân thô `(10³)^40` để nói về độ lớn, không phải số đếm ván chess, và Shannon chủ động dùng ván 40 nước vì "conservative". Tính thẳng phép nhân cho 3,2×10^106 năm chứ không phải 10^90; câu "over 10^90 years" của Shannon vẫn đúng chữ vì là cận dưới, nhưng lỏng 16 bậc. Các số 10^120, 10^123, 10^154 khác nhau vì chọn b và độ dài khác nhau, không phải vì mâu thuẫn. Tên "Shannon's number" là cách gọi về sau; tôi không thấy tên đó trong bài của ông.

**Hàm ý feasibility.**
- Tic-tac-toe: tính xong trong khoảng một giây, kể cả bằng CPython không tối ưu.
- Checkers: state 5×10^20, hàng chục máy tính chạy gần như liên tục từ 1989 mới giải được ([Schaeffer et al. 2007](https://www.cse.sc.edu/~mgv/csce580sp17/gradPres/schaeffer_CheckersIsSolved_Science2007.pdf); chi tiết ở mục 6).
- Chess, Go: bất khả thi cả theo cây lẫn theo bảng khi tính từ thế cờ ban đầu. Tăng tốc phần cứng không đổi được kết luận này: lợi ích chỉ theo log, nhân đôi máy thêm chưa tới 0,2 ply.
- Vậy nên V* là khái niệm để định nghĩa điều đúng, còn thực tế phải hỏi hai câu khác. AIMA nói: minimax "serve as a basis for the mathematical analysis of games", và "by approximating the minimax analysis ... we can derive more practical algorithms" ([AIMA tr. 150](https://aima.eecs.berkeley.edu/~russell/aima/errata/aima-150.pdf)). Phần xấp xỉ thuộc nhóm 11.

Lõi phép đếm để chạy lại (đã chạy đúng khối code này, in ra `549946 255168 5478 0`):

```python
LINES = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
def winner(b):
    for x, y, z in LINES:
        if b[x] and b[x] == b[y] == b[z]: return b[x]
    return 0
def is_end(b): return winner(b) != 0 or 0 not in b
def player(b): return 1 if sum(1 for c in b if c) % 2 == 0 else -1
def succs(b):
    for i, c in enumerate(b):
        if c == 0:
            l = list(b); l[i] = player(b); yield tuple(l)
calls = leaves = 0
def plain(b):
    global calls, leaves
    calls += 1
    if is_end(b):
        leaves += 1
        return winner(b)
    vals = [plain(s) for s in succs(b)]
    return max(vals) if player(b) == 1 else min(vals)
memo = {}
def memoized(b):
    if b in memo: return memo[b]
    r = winner(b) if is_end(b) else (max if player(b) == 1 else min)(memoized(s) for s in succs(b))
    memo[b] = r
    return r
empty = (0,) * 9
plain(empty); root = memoized(empty)
print(calls, leaves, len(memo), root)
```

### Gaps
- Số liệu chess và Go đều là ước lượng thô, trừ số position Go của Tromp là số đếm chính xác; số chess của Tromp là ước lượng thống kê.
- AIMA trang đọc được không in rõ số ấn bản; tiêu đề chương "Adversarial Search and Games" gợi ý ấn bản 4, tôi chưa xác nhận.
- Con số 986.410 của U. Alberta chỉ đọc qua snippet, chưa mở trang. Con số này đã tự chạy nên không phụ thuộc vào nguồn đó.

## 6. Mở rộng trong chính Minimax: nhiều min layer, memoization, retrograde analysis, tie-breaking và "doomed agent"

### Takeaway
Dispatch theo `Player(s)` xử lý mọi thứ tự lượt mà không đổi recurrence; memoization giảm tic-tac-toe 100 lần về số node vì V* chỉ phụ thuộc state; retrograde analysis là cùng recurrence đó chạy từ dưới lên. Pacman lao vào ghost không phải lỗi mà là hệ quả đúng của utility có living penalty, và muốn ưu tiên thắng nhanh, thua chậm thì phải sửa utility có kiểm soát.

### Cited Findings
**Nhiều min layer**
- Với bốn ghost: một max layer theo sau là 4 min layer liên tiếp, và cách này "inherently gives rise to cooperation across all minimizers" — [cs188-fa23-note07.pdf tr. 3](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf).
- "Your minimax tree will have multiple min layers (one for each ghost) for every max layer"; depth 2 nghĩa là Pacman và mỗi ghost cùng di chuyển hai lần — [CS188 Project 2](https://inst.eecs.berkeley.edu/~cs188/fa23/projects/proj2/).
- Giới hạn của khóa học: chỉ hai phe, một max và một min, cộng với các player có fixed policy — [games1.pdf tr. 66](/home/bao/Projects/Game1/docs/games1.pdf). Slide cũng đặt câu hỏi về nhiều đối thủ, đồng đội đánh luân phiên và extra turn — [games1.pdf tr. 65](/home/bao/Projects/Game1/docs/games1.pdf).
- **[Run]** 300/300 cây ngẫu nhiên max-min-min có V bằng cây đã gộp min layer liên tiếp thành một min trên joint action. Số lá với b = 4, d = 2: k = 1 → 4⁴ = 256; k = 2 → 4⁶ = 4.096; k = 4 → 4¹⁰ = 1.048.576 (`trees.py`).

**Memoization, transposition table**
- Một transposition là cùng position đến từ các dãy nước khác nhau; transposition table lưu kết quả search trước đó, lần đầu dùng trong Mac Hack VI của Greenblatt (1967) — [chessprogramming: Transposition Table](https://www.chessprogramming.org/Transposition_Table). Deep Blue cũng dùng ý tưởng này — [Campbell et al. 2002, tr. 60](https://www.cs.oswego.edu/~mgrzenda/CSC466/Paper%20Sources/Deep%20Blue.pdf).
- CS221 lập luận theo hướng ngược: có thể nghĩ tới game graph nhưng "all our algorithms will operate on the tree", vì state space quá lớn, và "we cannot forget much and exploit dynamic programming" — [games1.pdf tr. 12, 70](/home/bao/Projects/Game1/docs/games1.pdf).
- **[Run]** Tic-tac-toe (`ttt.py`, `ttt3.py`):

| Biến thể | Giá trị ở gốc | Node/entry | Số lần gọi | Thời gian (một lần chạy) |
|---|---|---|---|---|
| Tree thuần | 0 | 549.946 node | 549.946 | 1,154 s |
| Memo trên state | 0 | 5.478 entry | 16.168 (10.690 hit, 16.167 cạnh) | 0,0212 s |
| Memo + 8 symmetry | 0 | 765 entry | 2.271 | không đo riêng |

Tiết kiệm: 100,4 lần theo node, 34 lần theo số lần gọi, khoảng 54 lần theo thời gian. Số 16.168 và 2.271 khớp độc lập với [Lomont 2024](https://www.lomont.org/posts/2024/minimaltictactoe/).
- **[Run]** Halving game của CS221 ([games1.pdf tr. 19](/home/bao/Projects/Game1/docs/games1.pdf)): N = 40 có 8.247 tree node, trong khi chỉ có tối đa 2×41 = 82 state (N, player). Tôi hiểu "player left with 0 wins" là người tới lượt tại N = 0 thắng; dưới cách hiểu đó các N từ 1 đến 20 có giá trị −1 tại N = 1, 4, 6, 10, 14, 16, 18 và +1 ở phần còn lại (`trees.py`).

**Retrograde analysis và endgame tablebases**
- Thompson 1986 mô tả: W là các position White-to-move thắng, B là các position Black-to-move thua. P₁ tạo B₀ = chiếu hết. P₂ lấy predecessor của Bᵢ làm Wᵢ₊₁ ("at least one White move can obtain a Bᵢ position"). P₃, P₄ lấy predecessor của W rồi kiểm tra "all such successors are in W" để tạo Bᵢ₊₁. Dừng khi không sinh thêm. Dùng un-move generator; bitmap 121.110.528 bit; khoảng 175 MB; máy 12 CPU, một endgame mất 2–3 tuần — [Thompson 1986, tr. 132](http://pdos.csail.mit.edu/~rsc/thompson86endgame.pdf) (scan, đã đọc bằng ảnh).
- Retrograde analysis là "backward induction from known outcomes", thuật toán cơ bản để xây tablebase. Niên biểu: Bellman 1965 (dynamic programming), Ströhlein 1970 (bản cài đặt đầu), Thompson 1986 — [chessprogramming: Retrograde Analysis](https://chessprogramming.org/Retrograde_Analysis).
- Tablebase: Nalimov (DTM, 1998; 6-man 1,2 TiB), Lomonosov (DTM, 7-man hoàn tất tháng 7/2012, 140 TiB), Syzygy (WDL + DTZ50, 7-man hoàn tất tháng 8/2018, 17 TB) — [chessprogramming: Endgame Tablebases](https://www.chessprogramming.org/Endgame_Tablebases).
- Checkers: "Perfect play by both sides leads to a draw"; weakly solved; 5×10^20 positions; backward search gồm 3,9×10^13 positions (≤ 10 quân, đúng ra 39.271.258.813.439 trong Table 1 so với tổng 500.995.484.682.338.672.639); database lưu win/loss/draw, không lưu số nước; positions lặp được xem là hòa — [Schaeffer et al. 2007](https://www.cse.sc.edu/~mgv/csce580sp17/gradPres/schaeffer_CheckersIsSolved_Science2007.pdf).
- **[Run]** Retrograde bottom-up dùng predecessor list và bộ đếm trên tic-tac-toe: gán nhãn đủ 5.478 state, trùng 100% với memoized minimax; phân bố V*: X thắng 2.936, O thắng 1.474, hòa 1.068 (`ttt.py`).
- **[Run]** Đồ thị nhỏ có chu trình a↔b tự dựng: retrograde kết thúc, gán a, b là "draw (unlabelled)", gán đúng mọi node khác; đệ quy DFS thuần sẽ không dừng trên chu trình này (`trees.py`).

**Tie-breaking và "doomed agent"**
- Nguồn chính xác nằm ở Project 2, **không** ở các file cục bộ: "When Pacman believes that his death is unavoidable, he will try to end the game as soon as possible because of the constant penalty for living. Sometimes, this is the wrong thing to do with random ghosts, but minimax agents always assume the worst"; bài yêu cầu sinh viên giải thích vì sao Pacman "rushes the closest ghost" trên `trappedClassic` — [CS188 Project 2](https://inst.eecs.berkeley.edu/~cs188/fa23/projects/proj2/). Trang này nói thêm ExpectimaxAgent thắng khoảng một nửa, AlphaBetaAgent luôn thua ở layout đó. Tôi không chạy code Berkeley.
- Trong lec07, nội dung gần nhất là "Why Pacman Starves": ăn dot bây giờ hay sau đều có điểm bằng nhau trong horizon, nên agent replanning có thể dao động — [cs188-sp26-lec07.pdf tr. 31, 32](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf). Đây là hiện tượng tie cùng horizon, khác với doomed agent; phần horizon thuộc nhóm 11.
- CS188 cũng nêu một ví dụ cùng tinh thần: Pacman đi xa khỏi pellet để "minimize the magnitude of his defeat", −8 thay vì −10 — [cs188-fa23-note06.pdf tr. 4](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf). **[Run]** `max(min(−8,−5), min(−10,8)) = −8` (`trees.py`).
- Zermelo đã nói tới "win in the shortest time" và "postpone a checkmate as long as possible", đồng thời coi mọi nước khác là "forfeit or delay the certain win or otherwise make possible or accelerate the loss" — [bản dịch S&W, tr. 13–15](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf).
- **[Run] Cây minh họa tự dựng** (không phải layout thật của Pacman): `max(rush = −501, flee = min(kill = −503, escape = 490))` cho rush = −501, flee = −503, nên Minimax chọn **rush**. Chống ghost 50/50, flee có kỳ vọng −6,5 so với rush −501, nên Expectimax chọn flee. Bỏ time penalty (`−500` và `min(−500, 490)`) thì hai nhánh hòa, chỉ còn tie-break quyết định (`trees.py`).
- **[Run] Doomed trên tic-tac-toe** với utility ±1 thuần (`ttt.py`): 632 state bên đi chắc chắn thua. Trong 124 state có nước tránh được thua ngay ở nước sau, tie-break ô đầu vẫn chọn nước cho đối phương thắng ngay ở **85** state. Ví dụ, O đi với bàn `XOO / X.. / .X.`: mọi nước đều có V* = +1 (X thắng), tie-break chọn ô 4 và X thắng ngay; utility theo độ sâu cho 4→3, 5→3, 6→1, 8→3 nên O chọn ô 6, chặn và kéo dài.
- **[Run]** Tương tự, trong 2.836 state bên đi thắng, có 392 state có thể thắng ngay nhưng tie-break ô đầu chọn một nước thắng chậm hơn (`ttt.py`).
- **[Run]** Utility theo độ sâu `U' = sign × (10 − ply)`: gốc vẫn 0; dấu của V trùng V* trên toàn bộ 5.478 state (`ttt.py`).
- **[Run] Khi nào sửa utility làm hỏng game:** `U = outcome − ε·t`. Với ε = 0,01 và 0,1, thắng ở ply 9 (0,91 và 0,10) vẫn hơn hòa ở ply 1 (−0,01 và −0,10). Với ε = 0,6, thắng ở ply 9 là −4,40 còn hòa ở ply 1 là −0,60, agent **thích hòa hơn thắng** (`trees.py`).

### Inferences
**Nhiều min layer.**
- Về toán: `min_{a₁} min_{a₂} f = min_{(a₁,a₂)} f`. Vì vậy k ghost liên tiếp tương đương **một** đối thủ có joint action. "Cooperation" không phải điều gì được thiết kế thêm; nó là hệ quả của việc mọi ghost cùng tối thiểu hóa một số.
- Giả định phải nói rõ: đó vẫn là game hai phe. Nhiều người có utility riêng là non-zero-sum (một dòng, thuộc nhóm 11).
- Chi phí: `m = (k+1)d`, tức `b^{(k+1)d}`. Mỗi ghost thêm nhân thời gian lên thêm `b^d`.
- Ba câu hỏi ở [games1.pdf tr. 65](/home/bao/Projects/Game1/docs/games1.pdf): nhiều đối thủ thì nhiều min layer; đồng đội luân phiên thì nhiều max layer; extra turn thì `Player(Succ(s,a)) = Player(s)`. Không cái nào đổi recurrence, vì recurrence phân nhánh theo `Player(s)`, không theo độ sâu chẵn lẻ.

**Vì sao memoization đúng, và khi nào không đúng.** Recurrence của V* chỉ có s, không có đường đi. Với deterministic và perfect information, utility chỉ ở terminal thì V* là hàm của state, nên hợp hai node cùng state là an toàn. Chi phí đổi sang `O(|S| + |E|)` time và `O(|S|)` space. Điều kiện cần giữ:
1. State phải đủ thông tin: repetition, 50-move rule làm giá trị phụ thuộc lịch sử, nên phải đưa bộ đếm vào state hoặc xử lý riêng. Chessprogramming có mục "Path-Dependency" và "Graph History Interaction", tôi chỉ thấy tên mục.
2. Utility phải là hàm của state, không phải của đường đi. Nếu dùng "ply tính từ gốc" trong đồ thị có đường dài khác nhau thì memo sai; phải lưu theo khoảng cách **từ node hiện tại**. Tic-tac-toe thoát được vì số quân xác định ply.
3. Đồ thị phải không chu trình; có chu trình thì DFS memo không còn dừng.
4. Kết quả chỉ tái sử dụng được khi cùng một câu hỏi; search giới hạn độ sâu thì khác (thuộc nhóm 11).

**Mâu thuẫn bề ngoài với CS221.** Slide nói "cannot exploit dynamic programming", còn tôi đo được tiết kiệm 100 lần. Cả hai đều đúng ở hai quy mô khác nhau: trong tic-tac-toe, state ít hơn tree 100 lần; trong chess, memo giảm được phần lớn số mũ (khoảng 10^79 lần so với 35^80, **[Run]**) nhưng vẫn cần 4,8×10^44 entry. DP là đúng về logic, chỉ không đủ về tài nguyên.

**Retrograde analysis chính là minimax chạy ngược.** Đối chiếu từng dòng với Thompson:
- "Có ít nhất một nước tới Bᵢ" là ∃ = `max` trên {thắng, không thắng}.
- "Mọi successor đều trong W" là ∀ = `min`.
- Tầng i là depth-to-mate, nên tính theo lớp cũng cho luôn số nước.

Khác DFS ở chỗ: chiều đi từ terminal lên; bộ nhớ là cả bảng; **xử lý được chu trình**, vì node không bao giờ được gán nhãn thì được hiểu là hòa dưới quy ước "ván vô hạn là hòa". Đó chính là quy ước của Zermelo ("go on forever ... has to be called a draw", [S&W, tr. 12](https://people.math.harvard.edu/~elkies/FS23j.03/zermelo.pdf)). Thực tế giải game lớn là kết hợp: checkers dùng retrograde từ cuối gặp search từ đầu ([Schaeffer et al. 2007](https://www.cse.sc.edu/~mgv/csce580sp17/gradPres/schaeffer_CheckersIsSolved_Science2007.pdf)).

**Doomed agent, trả lời gọn.** Pacman không "tự tử" do lỗi. Với living penalty, mọi kết cục chống đối thủ tối ưu đều là chết, và chết sớm có điểm cao hơn; Minimax tối đa đúng utility đã cho dưới đúng giả định đã cho. Điều gây bất ngờ là agent bỏ qua khả năng đối thủ sai lầm, vì guarantee của nó không tính đến chuyện đó.

**Vì sao "thắng nhanh, thua chậm" cần cẩn thận:**
1. Với utility ±1 thuần, mọi nước trong thế thua đều bằng nhau, nên agent có thể đầu hàng ngay, và trong thế thắng có thể trì hoãn (85 và 392 state trong số liệu tic-tac-toe ở trên). Đây là hành vi đúng với utility, chỉ sai với kỳ vọng của người xem.
2. Ưu tiên thua chậm chỉ có giá trị nếu đối thủ có thể sai. Chống đối thủ hoàn hảo, kéo dài không đổi được kết quả. Nên đây thực ra là một mô hình đối thủ nhỏ được cài vào tie-break.
3. Sửa utility tức là đổi game. Phải giữ thứ tự từ điển thắng > hòa > thua, tức là tổng phạt thời gian phải nhỏ hơn khoảng cách giữa các kết cục. Ví dụ ε = 0,6 cho thấy hỏng thế nào.
4. Nếu time penalty là một phần của score thật (như Pacman) thì không còn là tie-break: rushing là tối ưu đúng theo đặc tả. Muốn hành vi khác thì đổi đặc tả hoặc đổi mô hình đối thủ.
5. Trên graph hoặc memo, giá trị theo độ sâu phải lưu theo khoảng cách tương đối (điều kiện 2 ở trên). Metric DTM và DTZ của tablebase là cùng ý tưởng được làm chặt.
6. Chỉ dùng tie-break theo độ sâu thì vẫn không đảm bảo đối thủ yếu rơi bẫy: Minimax vẫn không tự tạo cơ hội.

### Gaps
- Tôi không chạy `pacman.py` trên `trappedClassic`, nên kết quả "Expectimax thắng khoảng một nửa, AlphaBeta luôn thua" chỉ do trang Project 2 nêu. Cây rush/flee ở trên là minh họa do tôi tự dựng.
- Trang chessprogramming về transposition table chỉ liệt kê tên forum thread về lưu mate score ("Using too-shallow mate scores from the hash table", "Correct way to store and extract mate scores"); tôi chưa đọc nội dung và không có nguồn sơ cấp cho kỹ thuật cụ thể. Điều kiện "lưu theo khoảng cách tương đối" ở trên là suy luận của tôi.
- Tôi chỉ đọc Thompson 1986 trang 132 (phần The Method).

## 7. Ngộ nhận phổ biến và câu hỏi giảng viên có thể hỏi

### Takeaway
Bốn ngộ nhận đều đến từ việc nhầm lẫn giữa lá, giá trị được back up, và giả định về đối thủ. Câu trả lời mạnh nhất cho phần lớn câu hỏi đều quy về Theorem 1, 2, 3, 5 ở mục 3.

### Cited Findings
- CS221: Minimax chọn bin B dù A có lá 50; "if you think I'm against you ... pick B" — [games1.pdf tr. 6](/home/bao/Projects/Game1/docs/games1.pdf). **[Run]** Maximax chọn A, maximin chọn B (`trees.py`).
- CS188: Pacman muốn +8 nhưng "knows" ghost tối ưu sẽ không cho phép — [cs188-fa23-note06.pdf tr. 4](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf).
- CS221: "minimax value does not depend on any policies"; Property 3 "not optimal if opponent is known" — [games1.pdf tr. 42, 53](/home/bao/Projects/Game1/docs/games1.pdf).
- CS188: "Minimax provides more conservative actions than expectimax, and so tends to yield favorable results when the opponent is unknown as well" — [cs188-fa23-note07.pdf tr. 6](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf). Minimax agent thắng 665/1000 ván dù dự báo depth 4 rất xấu — [CS188 Project 2](https://inst.eecs.berkeley.edu/~cs188/fa23/projects/proj2/).
- **[Run]** Phản ví dụ cây sâu `max( min( max(−100,10), max(8,20) ), min(5,6) )`: giá trị nhánh A = 10, B = 5; lá xấu nhất A = −100, B = 5; Minimax chọn A, còn "tối đa lá xấu nhất" chọn B (`trees.py`).
- Bảng ở mục 3 đều là **[Run]**.

### Inferences
**Bốn ngộ nhận trong đề bài, cùng cách sửa ngắn:**

| Ngộ nhận | Vì sao sai | Bằng chứng |
|---|---|---|
| "Minimax chọn lá tốt nhất" | Nó chọn nước có **giá trị back up** tốt nhất, và lá tốt nhất thường không reachable dưới đối thủ tối ưu. | Bucket: lá tốt nhất là 50 ở A, Minimax chọn B. Ngay trong B, lá 3 cũng không xảy ra chống π_min. |
| "Minimax giả định đối thủ hoàn hảo nên luôn là chiến lược tốt nhất" | Tối ưu chỉ chống π_min. Chống đối thủ đã biết khác, best response thắng, và khoảng cách không bị chặn. | Property 3; 2 so với 5 trong bucket; họ M; 0,8063 so với 0,9249 ở tic-tac-toe vị trí O. |
| "Minimax là tối đa hóa lá xấu nhất" | Chỉ trùng với cây hai tầng. Trong cây sâu hơn, agent còn có nước sau, nên "lá xấu nhất" có thể là lá chính agent không bao giờ chọn. | Phản ví dụ trên: Minimax chọn A (10), quy tắc lá xấu nhất chọn B (5). |
| "Minimax value bằng điểm thực sự đạt được" | Chỉ đúng khi cả hai cùng theo minimax. Nếu agent theo π_max thì V* là **lower bound**, có thể đạt nhiều hơn. Nếu agent không theo π_max thì không có lower bound nào. | Bucket: V* = 1, chống uniform kỳ vọng 2, các lá thực tế là 1 hoặc 3. Tic-tac-toe: V* = 0 nhưng π_max thắng 99,48% chống uniform. |

**Bốn ngộ nhận bổ sung:**
- "Dùng minimax thì không khai thác được sai lầm của đối thủ": sai một nửa. Sau khi đối thủ đã sai, V* của state mới tăng và π_max giữ được phần đó, góp phần tạo ra con số 99,48% ở trên. Cái nó không làm là **chủ động đặt bẫy**, vì nó không có mô hình về xác suất đối thủ sai.
- "`V(π_exptmax, π_min)` là worst case của π_exptmax": sai, xem bảng tic-tac-toe vị trí O (0 so với −1).
- "Zermelo đã chứng minh chess là thắng, hòa hoặc thua bằng backward induction": sai ở cả phương pháp lẫn trọng tâm, xem mục 4.
- "`min` nghĩa là agent biết trước đối thủ sẽ đi gì": không. Agent chuẩn bị cho mọi nhánh; `min` là cách đánh giá nhánh, không phải dự báo.

**Câu hỏi giảng viên có thể hỏi và câu trả lời ngắn nhất:**

1. **Tại sao Minimax chọn B mà Expectimax chọn C?** Expectimax tính trung bình (0, 2, 5), Minimax tính worst case (−50, 1, −5). Câu hỏi khác nhau thì đáp án khác nhau; cả hai đều đúng với mô hình của mình.
2. **Giá trị minimax có phụ thuộc policy không?** Không, V* chỉ phụ thuộc cây. Policy được trích từ nó, và có thể không duy nhất khi có tie.
3. **Minimax có đảm bảo gì nếu đối thủ chơi ngẫu nhiên hay ngu?** Có: mọi lá reachable có utility ≥ V*. Nó không đảm bảo là điểm tốt nhất có thể.
4. **Nếu biết đối thủ thì sao?** Dùng best response (Expectimax chống policy đó). Property 3 nói nó không tệ hơn; nhưng nếu mô hình sai, không còn lower bound.
5. **Chứng minh Property 2 thế nào?** Quy nạp theo chiều cao. Tại node opp, trung bình ≥ min; tại node agent, π_max lấy đúng con có giá trị V*.
6. **Stochastic policy có giúp gì không?** Không, trong lớp game này. Trung bình của các con không vượt max, không thấp hơn min, nên pure đã đủ tốt. Đây là lý do T1, T2 cần "trung bình ≤ max" và "trung bình ≥ min".
7. **Vì sao gọi là fixed point nếu thuật toán không lặp?** "Fixed point" mô tả kết quả, không phải quy trình: mỗi policy là best response của policy còn lại tại mọi state. Trên cây hữu hạn, một lượt bottom-up cho nghiệm duy nhất.
8. **Minimax có cần zero-sum không?** Có, cho recurrence này: một số V, một bên max, một bên min (non-zero-sum thuộc nhóm 11).
9. **Space là O(bm) hay O(m)?** Cả hai, tùy mỗi frame giữ list successor hay iterator. CS221 O(d) thuộc họ O(m), vì 2d = m.
10. **Chess có b^m = 35^100 thật không?** Không. Đó là ước lượng bậc độ lớn: b và m chỉ là số trung bình, và số position thật chỉ khoảng 4,8×10^44. Tic-tac-toe cho thấy b^m có thể lệch nhiều: 9⁹ so với 549.946.
11. **Có memo được thì sao chess vẫn không giải được?** Vẫn còn khoảng 4,8×10^44 state. Chỉ 2 bit mỗi state đã là 1,2×10^44 byte.
12. **Vì sao DFS mà không BFS?** Mọi lá đều phải biết giá trị trước khi back up, nên phải thăm toàn bộ cây dù thế nào; DFS chỉ cần bộ nhớ tuyến tính theo độ sâu, BFS thì cần lưu cả tầng.
13. **Ai chứng minh game có giá trị?** Xem câu trả lời gọn ở mục 4.
14. **Pacman lao vào ghost có phải bug?** Không. Mọi kết cục chống đối thủ tối ưu đều xấu, và có living penalty thì chết sớm điểm cao hơn. Đổi hành vi thì đổi utility hoặc đổi mô hình đối thủ.
15. **Thắng nhanh thua chậm có đổi V* không?** Không, nếu phạt nhỏ hơn khoảng cách kết cục. **[Run]** Dấu V trùng với V* trên 5.478 state tic-tac-toe; ε lớn thì vỡ.
16. **Ba ghost có phải là ba đối thủ thực sự không?** Về toán là một đối thủ với joint action, vì cùng tối thiểu hóa một số.
17. **Minimax với độ sâu giới hạn còn guarantee không?** Một dòng, thuộc nhóm 11: CS188 ghi "Guarantee of optimal play is gone" ([cs188-sp26-lec07.pdf tr. 30](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf)).

### Gaps
- Danh sách câu hỏi là dự đoán của tôi dựa trên nội dung môn học, không có nguồn về đề thực tế hay phong cách của giảng viên.

## 8. Minimax thực sự được dùng ở đâu, và engine cờ cổ điển dựa vào nó thế nào

### Takeaway
Minimax đầy đủ tới lá chỉ thực dụng trong game nhỏ, endgame và các phần của việc giải game. Với game lớn, nó là định nghĩa của mục tiêu mà tree search nhắm tới, chứ không phải chương trình chạy nguyên dạng.

### Cited Findings
- Shannon 1950 viết rõ dạng `max min max min f(...)` và đặt tên "type A strategy": xét mọi variation tới một độ sâu cố định — [Shannon 1950, §4](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf). Phần `f` thuộc nhóm 11.
- Shannon cũng nhận xét máy type A sẽ "both slow and a weak player", cần cỡ 10⁹ evaluation sau ba nước mỗi bên — [Shannon 1950, §6](https://vision.unipv.it/IA1/ProgrammingaComputerforPlayingChess.pdf).
- **Một câu về Deep Blue:** Deep Blue của IBM, một hệ song song gồm máy IBM RS/6000 SP 30 node và 480 chip cờ chuyên dụng, đã thắng Garry Kasparov 3,5–2,5 năm 1997 bằng game tree search quy mô lớn, với tốc độ trung bình 126 triệu position mỗi giây trong các lần search dài hơn một phút — [Campbell, Hoane, Hsu 2002, tr. 59–60](https://www.cs.oswego.edu/~mgrzenda/CSC466/Paper%20Sources/Deep%20Blue.pdf).
- **Sửa một con số trong tài liệu:** [cs188-fa23-note06.pdf tr. 1](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf) ghi "over 200 million positions per second", còn [lec07 tr. 2](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf) ghi 200M. Campbell et al.: khoảng 100 triệu ở thế chiến thuật, gần 200 triệu ở thế tĩnh, trung bình 126 triệu, tối đa duy trì 330 triệu — [Campbell et al., tr. 60](https://www.cs.oswego.edu/~mgrzenda/CSC466/Paper%20Sources/Deep%20Blue.pdf).
- Tablebase là "precalculated endgame tables generated by an exhaustive retrograde analysis" — [chessprogramming](https://www.chessprogramming.org/Endgame_Tablebases).
- Checkers dùng cả backward search và forward search để giải được — [Schaeffer et al. 2007](https://www.cse.sc.edu/~mgv/csce580sp17/gradPres/schaeffer_CheckersIsSolved_Science2007.pdf).
- AlphaGo dùng MCTS và learned evaluation; CS188 viết với Go "minimax can no longer be used"; UCT "approaches the behavior of a minimax agent" khi N → ∞ — [cs188-sp26-lec07.pdf tr. 3](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf); [cs188-fa23-note07.pdf tr. 3, 5](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf).
- Bài tập chuẩn: Pacman Project 2 — [CS188 Project 2](https://inst.eecs.berkeley.edu/~cs188/fa23/projects/proj2/).

### Inferences
- Bốn vai trò cần phân biệt khi trình bày: (a) tính thẳng được: tic-tac-toe, game nhỏ; (b) tính thẳng được từ dưới lên: tablebase, endgame database; (c) khung khái niệm cho engine: chúng search bằng cấu trúc max/min trên phần cây giới hạn; (d) định nghĩa "đúng" để so sánh mọi xấp xỉ.
- Deep Blue không tính V* của chess. Đó là suy luận từ bảng feasibility ở mục 5: ở 2×10⁸ position/giây, đi hết `35^100` cần cỡ 10^138 năm. Không nên nói "Deep Blue đã chạy Minimax đầy đủ" hay "giải được chess".
- Câu [Campbell et al.](https://www.cs.oswego.edu/~mgrzenda/CSC466/Paper%20Sources/Deep%20Blue.pdf) đã đủ cho nhóm 10; các cơ chế search và evaluation của Deep Blue để nhóm 11 hoặc bỏ qua.

### Gaps
- Không khảo sát engine hiện đại (Stockfish, các engine neural), vì ngoài yêu cầu và phần kỹ thuật thuộc nhóm 11.
- Hai trang tablebase của chessprogramming là nguồn cộng đồng, không phải bài báo gốc của các dự án Nalimov, Syzygy, Lomonosov.

**Câu chuyển tiếp sang nhóm 11:** Minimax cho ta giá trị đúng và bài toán chi phí vừa thấy, còn cách biến nó thành thuật toán chơi được trong thực tế là phần nhóm 11 sẽ trình bày ngay sau đây.
