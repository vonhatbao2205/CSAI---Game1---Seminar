# Game evaluation và Expectimax: ghi chú nghiên cứu cho Games 1 (nhóm 10, 2026-11-09)

Quy ước đọc ghi chú:

- "PDF tr.N" là số trang trong file PDF. "slide M" là số in trên slide CS221 (tr.25 ứng với slide 24).
- **[Tự chứng minh]** là phần tôi tự suy ra từ các định nghĩa có nguồn, không phải trích dẫn.
- **[Đã chạy]** là số liệu tôi đã chạy thật bằng `/tmp/claude-1000/-home-bao-Projects-Game1/960dc642-df1c-4e34-9dcc-a8bee2337d2a/scratchpad/expectimax/code/verify.py` và `/tmp/claude-1000/-home-bao-Projects-Game1/960dc642-df1c-4e34-9dcc-a8bee2337d2a/scratchpad/expectimax/code/trace.py` (Python, dùng `Fraction` để tính chính xác khi kiểm chứng minh).
- Ngoài phạm vi, chỉ nêu một dòng và ghi "nhóm 11": Expectiminimax, evaluation function/depth-limited search, alpha-beta, TD learning, simultaneous games, non-zero-sum games. Minimax chỉ dùng để đối chiếu.

**Lưu ý về nguồn, cần biết trước khi làm slide:**

- `cs188-sp26-lec07.pdf` (local) **không có** phần Expectimax và bảng Pacman. Nó kết thúc bằng "Next Time: Uncertainty!" ([lec07, trang cuối](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf)). Hai nội dung đó nằm ở lecture kế tiếp, [CS188 Sp26 lec08 "Uncertainty and Utilities"](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf), tôi đã tải về và đọc.
- `games1.pdf` local gần như trùng với [deck CS221 Spring 2024](https://stanford-cs221.github.io/spring2024-extra/modules/games/games1.pdf). **[Đã chạy]** so khớp theo từ: tỉ lệ 0.9983, 7 khác biệt, chủ yếu là nhãn "[semi-live" so với "[live" và thứ tự trích xuất text. Không khác biệt nào chạm tới recurrence hay số liệu.

---

## 1. Game evaluation trả lời câu hỏi gì, recurrence ra sao, vì sao chỉ là tính toán thuần?

### Takeaway
Game evaluation trả lời: "cho trước **cả hai** policy, expected utility của agent là bao nhiêu?". Vì không còn lựa chọn nào, thuật toán chỉ cộng và nhân xác suất. Kết quả đúng bằng Σ P(path)·Utility(leaf) trên mọi đường đi từ gốc tới lá, và đây chính là policy evaluation trên một Markov chain hấp thụ.

### Cited Findings
- Câu hỏi của game evaluation: "Given two policies π_agent and π_opp, what is the (agent's) expected utility?", tức là độ thỏa dụng trung bình nếu hai bên chơi hai policy đó rất nhiều lần. — [games1 PDF tr.26](/home/bao/Projects/Game1/docs/games1.pdf)
- Recurrence chính xác, đã đối chiếu với slide render. — [games1 PDF tr.27, slide 26](/home/bao/Projects/Game1/docs/games1.pdf)
  ```
  V_eval(s) = Utility(s)                                   nếu IsEnd(s)
            = Σ_{a∈Actions(s)} π_agent(s,a) · V_eval(Succ(s,a))   nếu Player(s) = agent
            = Σ_{a∈Actions(s)} π_opp(s,a)   · V_eval(Succ(s,a))   nếu Player(s) = opp
  ```
- Slide ghi rõ "Analogy: recurrence for policy evaluation in MDPs". — [games1 PDF tr.27](/home/bao/Projects/Game1/docs/games1.pdf)
- Ví dụ của bài giảng: π_agent(s) = A, π_opp(s,a) = 1/2. Giá trị các nút giữa là 0, 2, 5; xác suất ở gốc là (1), (0), (0); **V_eval(s_start) = 0**. Đã kiểm tra bằng ảnh render. — [games1 PDF tr.25, slide 24](/home/bao/Projects/Game1/docs/games1.pdf)
- Game của CS221 có `Succ(s,a)` xác định và Utility chỉ nằm ở end state; policy được định nghĩa riêng cho từng player, ở dạng deterministic hoặc stochastic π_p(s,a) ∈ [0,1]. — [games1 PDF tr.13-14 và tr.21-22](/home/bao/Projects/Game1/docs/games1.pdf)
- Policy evaluation trong MDP: V_π(s) = 0 nếu IsEnd(s), ngược lại Q_π(s,π(s)), với Q_π(s,a) = Σ_{s'} T(s,a,s')[Reward(s,a,s') + γV_π(s')]. Recurrence này suy được từ law of total expectation cùng Markov property. — [CS221 policy-evaluation PDF tr.11-12](https://stanford-cs221.github.io/spring2024-extra/modules/mdps/policy-evaluation.pdf)
- Thời gian của policy evaluation là O(t_PE·S·S'), không phụ thuộc A "because we have a fixed policy". Với đồ thị acyclic chỉ cần một vòng nếu xử lý theo reverse topological order. — [CS221 policy-evaluation PDF tr.19-20](https://stanford-cs221.github.io/spring2024-extra/modules/mdps/policy-evaluation.pdf)
- Markov chain hấp thụ có dạng chính tắc [Q R; 0 I]. N = (I−Q)⁻¹ = I + Q + Q² + … và ma trận xác suất hấp thụ là B = NR. — [ghi chú dựa trên Grinstead & Snell ch.11, UT Austin](https://cs.utexas.edu/~pstone/Courses/394Rspring11/resources/notesXonXex6_2XYR.pdf); [MathWorld](https://mathworld.wolfram.com/AbsorbingMarkovChain.html) (chỉ đọc qua kết quả tìm kiếm, chưa đọc nguyên chương Grinstead & Snell).

### Inferences
**Vì sao cố định cả hai policy thì không còn quyết định nào? [Tự chứng minh]**
- Công thức không có `max`, `min` hay `argmax`. Mỗi nút là một tổ hợp tuyến tính với trọng số đã biết. Đầu ra là **một con số về một cặp policy**, không phải một policy. Đây là phép đo, không phải tối ưu hóa.
- Hệ quả: V_eval là đa thức đa tuyến tính theo các xác suất tại từng nút. Thay đổi một xác suất tại một nút làm V_eval đổi tuyến tính.

**Định lý path-sum. [Tự chứng minh]**

Đặt ω = (s₀=s, a₀, s₁, a₁, …, s_n) là một đường đi từ s tới end state, với s_{i+1} = Succ(s_i, a_i). Đặt

P(ω) = Π_{i<n} π_{Player(s_i)}(s_i, a_i), và quy ước tích rỗng bằng 1.

*Mệnh đề:* với mọi s trong cây hữu hạn, V_eval(s) = Σ_{ω∈Paths(s)} P(ω)·Utility(leaf(ω)), và Σ_ω P(ω) = 1.

*Chứng minh quy nạp theo chiều cao h(s):*
- **Cơ sở** (h = 0, IsEnd(s)): chỉ có đường rỗng, P = 1, leaf = s, nên vế phải là Utility(s) = V_eval(s).
- **Bước quy nạp:** Paths(s) phân hoạch theo hành động đầu tiên. Mỗi ω viết duy nhất dưới dạng (s,a)·ω' với ω' ∈ Paths(Succ(s,a)), và P(ω) = π(s,a)·P(ω'). Do đó

  Σ_ω P(ω)U(leaf ω) = Σ_a π(s,a) Σ_{ω'} P(ω')U(leaf ω') = Σ_a π(s,a) V_eval(Succ(s,a)) = V_eval(s).

  Dấu "=" thứ hai dùng giả thiết quy nạp, dấu "=" thứ ba là recurrence. Thay U ≡ 1 cho Σ_ω P(ω) = Σ_a π(s,a)·1 = 1. ∎
- Về bản chất đây là **tower property** của kỳ vọng. Thuật toán dùng tính phân phối (đặt nhân tử chung) để không phải nhân lại tiền tố của từng đường đi. Cùng ý với CS221 khi suy recurrence bằng law of total expectation ([PDF tr.12](https://stanford-cs221.github.io/spring2024-extra/modules/mdps/policy-evaluation.pdf)).
- **Kiểm tra tay trên ví dụ:** π_agent = A cho hai đường có xác suất 1·0.5 và 1·0.5, nên V = 0.5(−50) + 0.5(50) = 0. Bốn đường qua B, C có P = 0 nên không đóng góp.
- **[Đã chạy]** trên 1797 cây ngẫu nhiên với xác suất hữu tỉ: tổng P(path) đúng bằng 1 và recursion đúng bằng path-sum (so sánh chính xác bằng `Fraction`).

**Tương ứng với policy evaluation trên Markov chain. [Tự chứng minh]**
- Định nghĩa P(s'|s) = Σ_a π_{Player(s)}(s,a)·𝟙[Succ(s,a)=s']. End state là trạng thái hấp thụ. Cố định cả hai policy thì đối tượng còn lại là một Markov chain, không còn hành động.
- Trên transient states, recurrence viết thành V = QV + RU. Vì cây acyclic nên Q lũy linh, do đó (I−Q)⁻¹ = I + Q + … + Q^{h−1} là tổng hữu hạn, và V = BU với B(s,t) = xác suất chain kết thúc tại t. Mỗi lũy thừa Q^k gom các đường dài k, nên đây là định lý path-sum ở dạng ma trận.
- **[Đã chạy]** với game xô, π_agent = A: hàng gốc của B là [1/2, 1/2, 0, 0, 0, 0], V cho 4 transient states là [0, 0, 2, 5], và Q² = 0.
- So với policy evaluation đã học ngày 2026-11-02: cùng phép lấy kỳ vọng một bước, với ba điều chỉnh:
  1. Không có reward giữa đường, γ = 1.
  2. Giá trị ở end state là Utility(s) thay vì 0 (chuyển Utility thành reward của bước đi vào end state, xem mục 3).
  3. Policy có thể stochastic và luân phiên hai bên.
- Trong cách nhìn này, opp được coi như một phần của "môi trường".

**Diễn biến tính toán thực tế.** **[Đã chạy]** với π_agent = A, nếu bỏ qua nhánh xác suất 0 thì chỉ thăm 4 nút (gốc, nút A, hai lá), so với 10 nút của expectimax. Đây là lý do policy evaluation không phụ thuộc A.

### Gaps
- Slide CS221 chỉ cho recurrence và ví dụ, không có bài chứng minh path-sum. Chứng minh trên là của tôi.
- Slide không viết tường minh Markov chain cho game; tương ứng này là suy ra từ dòng "Analogy" và từ định nghĩa policy evaluation.

---

## 2. Expectimax đổi điều gì khi chỉ cố định π_opp, trích policy thế nào, vì sao tối ưu?

### Takeaway
Thay tổng theo π_agent bằng `max` tại nút agent. Giá trị thu được là expected utility lớn nhất mà **bất kỳ** policy nào của agent đạt được trước đúng π_opp đó, và policy tham lam theo V_exptmax là một best response. Tính tối ưu được bảo đảm **chỉ với điều kiện mô hình π_opp đúng**.

### Cited Findings
- Recurrence chính xác, đã đối chiếu slide. — [games1 PDF tr.33, slide 32](/home/bao/Projects/Game1/docs/games1.pdf)
  ```
  V_exptmax(s) = Utility(s)                                          nếu IsEnd(s)
               = max_{a∈Actions(s)} V_exptmax(Succ(s,a))             nếu Player(s) = agent
               = Σ_{a∈Actions(s)} π_opp(s,a) · V_exptmax(Succ(s,a))  nếu Player(s) = opp
  ```
- V_exptmax(s) là "the maximum expected utility of any agent policy when playing with respect to a fixed and known opponent policy π_opp". — [games1 PDF tr.32](/home/bao/Projects/Game1/docs/games1.pdf)
- Recurrence này "exactly the same" như V_eval, chỉ thay trung bình theo π_agent bằng max; expectimax là analogue của value iteration. — [games1 PDF tr.34](/home/bao/Projects/Game1/docs/games1.pdf)
- Ví dụ: π_opp = 1/2, các nút giữa 0, 2, 5, **V_exptmax(s_start) = 5**, chọn nhánh phải (C). Đã xem ảnh render. — [games1 PDF tr.31, slide 30](/home/bao/Projects/Game1/docs/games1.pdf)
- Slide viết π_exptmax(7) cho best policy trước π₇; ký hiệu giá trị trên slide là V_exptmax(s), phụ thuộc π_opp một cách ngầm định. — [games1 PDF tr.47-48](/home/bao/Projects/Game1/docs/games1.pdf)
- Công thức trích policy được CS221 viết tường minh cho minimax (π_max(s) = arg max V_minmax(Succ(s,a))) và cho MDP (π_opt(s) = arg max Q_opt(s,a)). — [games1 PDF tr.43-44](/home/bao/Projects/Game1/docs/games1.pdf); [CS221 value-iteration PDF tr.7](https://stanford-cs221.github.io/autumn2021-extra/modules/mdps/value-iteration.pdf)
- Bốn giá trị đối đầu của ví dụ xô: V(π_max,π_min) = 1, V(π_max,π₇) = 2, V(π_exptmax(7),π_min) = −5, V(π_exptmax(7),π₇) = 5. — [games1 PDF tr.55, slide 54](/home/bao/Projects/Game1/docs/games1.pdf)
- "Best response" trong game theory là chiến lược cho kết quả thuận lợi nhất khi chiến lược các bên khác đã cho trước. — [Wikipedia: Best response](https://en.wikipedia.org/wiki/Best_response)

### Inferences
**Trích policy. [Tự chứng minh, tương tự slide minimax]** Với Player(s) = agent:

π_exptmax(s) ∈ arg max_{a∈Actions(s)} V_exptmax(Succ(s,a)).

Hòa thì chọn tùy ý. Không trích policy ở nút opp vì π_opp là dữ kiện đầu vào. Công thức này không xuất hiện nguyên văn trên slide cho expectimax, nhưng là bản sao trực tiếp của tr.43.

**Định lý tối ưu. [Tự chứng minh]** Cố định π_opp. Gọi V^{π}(s) là V_eval(s) dưới (π, π_opp). Khi đó với mọi s và mọi π_agent (kể cả stochastic):
- (i) V^{π}(s) ≤ V_exptmax(s);
- (ii) đẳng thức xảy ra với π = π_exptmax.

*Quy nạp theo chiều cao:*
- **End state:** cả hai đều bằng Utility(s).
- **Nút opp:** V^{π}(s) = Σ π_opp(s,a) V^{π}(Succ(s,a)) ≤ Σ π_opp(s,a) V_exptmax(Succ(s,a)) = V_exptmax(s). Bất đẳng thức giữ nguyên vì trọng số không âm. Với π_exptmax thì giả thiết quy nạp cho đẳng thức.
- **Nút agent:** V^{π}(s) = Σ π(s,a) V^{π}(Succ(s,a)) ≤ Σ π(s,a) V_exptmax(Succ(s,a)) ≤ max_a V_exptmax(Succ(s,a)) = V_exptmax(s). Bất đẳng thức thứ hai đúng vì **tổ hợp lồi không vượt quá max**. Với a* trong arg max, cả hai đều thành đẳng thức. ∎

*Hệ quả cần nói trước lớp:*
- Một policy deterministic duy nhất tối ưu **đồng thời tại mọi nút**, không chỉ ở gốc.
- Ngẫu nhiên hóa không giúp gì được: tổ hợp lồi ≤ max. Ở đây không có đối thủ phản ứng lại nên không có động cơ che giấu nước đi.
- Nếu tree node được hiểu là lịch sử, chứng minh trên cũng phủ luôn policy phụ thuộc lịch sử.

**[Đã chạy]** trên 1749 cây ngẫu nhiên có không gian policy ≤ 4096: duyệt hết tổng cộng 515.800 policy deterministic, max của chúng đúng bằng V_exptmax trên mọi cây; thêm 5 policy stochastic ngẫu nhiên mỗi cây, không policy nào vượt.

**"Fixed" nghĩa chính xác là gì. [Tự chứng minh]** π_opp là hàm của state, không đổi theo π_agent. Vì thế định lý nói về best response, không phải cân bằng: khi đã biết agent chọn C, một đối thủ thích nghi có thể đổi sang chọn −5 ([games1 PDF tr.55](/home/bao/Projects/Game1/docs/games1.pdf) cho V(π_exptmax(7),π_min) = −5).

### Gaps
- Tôi không tìm thấy trong tài liệu CS221/CS188 đã đọc bài chứng minh viết sẵn cho expectimax. CS221 chỉ nói quy nạp từ lá cho minimax ([games1 PDF tr.50](/home/bao/Projects/Game1/docs/games1.pdf)).
- Ký hiệu V_exptmax,π_opp trong đề bài không có nguyên văn trên slide local (slide dùng V_exptmax và π_exptmax(7)).

---

## 3. Rút gọn game với π_opp cố định thành MDP; Expectimax và Bellman optimality; so với value iteration

### Takeaway
Thay nút opp bằng nút xác suất thì game trở thành MDP với T lấy từ π_opp, reward chỉ ở bước kết thúc và γ = 1. Khi đó recurrence expectimax **chính là** Bellman optimality equation, và nút opp đóng vai q-state. Cùng phương trình nhưng khác cách giải: expectimax là đệ quy cây từ một state, value iteration là các vòng cập nhật bảng trên toàn state space.

### Cited Findings
- CS221 nêu chiều ngược lại: MDP là một game giữa agent và nature, với π_nature((s,a),s') = T(s,a,s'). — [games1 PDF tr.22](/home/bao/Projects/Game1/docs/games1.pdf)
- Bellman optimality: V*(s) = max_a Σ_{s'} T(s,a,s')[R(s,a,s') + γV*(s')], và Q*(s,a) là phần nằm trong max. Slide nói thẳng "This is just what expectimax computed!". — [CS188 Sp26 lec09 tr.30](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec09.pdf)
- MDP gồm S, A, T(s,a,s'), R(s,a,s') (đôi khi chỉ R(s) hay R(s')), start state và có thể có terminal state. "One way to solve them is with expectimax search". — [lec09 tr.10](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec09.pdf)
- Value iteration "do one ply of expectimax from each state", mỗi vòng O(S²A). V_k(s) "is what a depth-k expectimax would give from s". — [lec09 tr.51 và tr.34](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec09.pdf)
- "We're doing way too much work with expectimax! Problem: States are repeated… Problem: Tree goes on forever". — [lec09 tr.33](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec09.pdf)
- "Expectimax didn't compute entire policies. It computed the action for a single state only". — [lec09 tr.12](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec09.pdf)
- Value iteration của CS221 có thời gian O(t_VI·S·A·S'). — [CS221 value-iteration PDF tr.9](https://stanford-cs221.github.io/autumn2021-extra/modules/mdps/value-iteration.pdf)
- Định lý hội tụ: nếu γ < 1 **hoặc** đồ thị MDP acyclic thì value iteration hội tụ đúng; có phản ví dụ với γ = 1 khi có chu trình. — [CS221 value-iteration PDF tr.15-16](https://stanford-cs221.github.io/autumn2021-extra/modules/mdps/value-iteration.pdf)
- CS221 chọn thuật toán trên cây thay vì đồ thị vì game có state space khổng lồ; state trong game thường không "quên" được nhiều nên khó tận dụng dynamic programming. — [games1 PDF tr.12 và tr.70](/home/bao/Projects/Game1/docs/games1.pdf)
- Mô hình game: utility ở end state "ultra-delayed", thay vì reward ở từng cạnh như MDP; dùng edge cost/reward thì "strictly more general". — [games1 PDF tr.14](/home/bao/Projects/Game1/docs/games1.pdf)

### Inferences
**Rút gọn hình thức. [Tự chứng minh]** Cho game (s_start, Actions, Succ, IsEnd, Utility, Player) và π_opp phụ thuộc state.

Định nghĩa toán tử "nhảy tới nút kế tiếp của agent hoặc end": D_u là phân phối trên {agent states} ∪ {end states}, với

- D_u = δ_u nếu u là end hoặc Player(u) = agent;
- D_u = Σ_{a'} π_opp(u,a')·D_{Succ(u,a')} nếu Player(u) = opp.

| Thành phần MDP | Định nghĩa từ game |
|---|---|
| States S | {s : Player(s) = agent} ∪ {end states}; state phải chứa lượt đi. Nếu opp đi trước, start state lấy từ D_{s_start}, hoặc dùng dạng không gộp bên dưới |
| Start | s_start (nếu là nút agent) |
| Actions(s) | Actions(s) của game, tại các nút agent |
| T(s,a,s') | D_{Succ(s,a)}(s'). Khi luân phiên chặt: T(s,a,s') = Σ_{a': Succ(Succ(s,a),a')=s'} π_opp(Succ(s,a),a'). Nếu Succ(s,a) đã là end: T = 1 |
| Reward R(s,a,s') | Utility(s') nếu IsEnd(s'), ngược lại 0 |
| γ | 1 |
| Terminal | V(end) = 0 theo quy ước MDP của CS221; Utility đã chuyển vào reward của bước vào end |

*Dạng không gộp (đơn giản hơn):* giữ nguyên nút opp làm state với một hành động giả `pass`, T(u, pass, Succ(u,a')) = π_opp(u,a').

*Chứng minh tương đương (trường hợp luân phiên chặt; nếu Succ(s,a) đã là end thì V_exptmax(u) = Utility(u) = R + 0 ngay).* Đặt u = Succ(s,a). Nhóm các a' cùng dẫn tới một s':

V_exptmax(u) = Σ_{a'} π_opp(u,a') V_exptmax(Succ(u,a')) = Σ_{s'} T(s,a,s') V_exptmax(s').

Nên V_exptmax(u) = Q*(s,a), với quy ước V*(s') cho s' không kết thúc và R + V*(end) = Utility(end). Khi đó tại nút agent:

V_exptmax(s) = max_a Q*(s,a) = max_a Σ_{s'} T(s,a,s')[R(s,a,s') + 1·V*(s')],

**đúng là Bellman optimality**. Đồ thị acyclic nên nghiệm duy nhất (quy nạp từ end), do đó V* = V_exptmax trên các nút agent. Tương tự, cố định thêm π_agent thì V_eval thỏa Bellman expectation với T^π(s,s') = Σ_a π_agent(s,a) T(s,a,s'). ∎

**Hình ảnh cần nhớ:** nút tròn opp trong cây chính là q-state (s,a) trong MDP search tree mà lớp đã thấy ([lec09 tr.17](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec09.pdf)).

**Điều kiện ẩn. [Tự chứng minh]**
- γ = 1 chỉ an toàn vì cây game hữu hạn (acyclic). Có chu trình và γ = 1 thì đệ quy không dừng và định lý hội tụ không còn áp dụng trực tiếp ([CS221 VI tr.15](https://stanford-cs221.github.io/autumn2021-extra/modules/mdps/value-iteration.pdf)).
- π_opp phải là hàm của s. Nếu opp phụ thuộc lịch sử hoặc học dần, state phải gồm thông tin đó, nếu không tính Markov bị phá vỡ.
- Để có T phải tính được π_opp. Với mô hình đắt, chính bước này rất tốn ([lec08 tr.14](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)).

**Giống và khác trong thực hành. [Tự chứng minh; có số đã chạy]**

| Tiêu chí | Expectimax (đệ quy cây) | Value iteration (state space) |
|---|---|---|
| Phương trình | Bellman optimality, γ=1, reward ở cuối | Bellman optimality, γ tùy ý |
| Đầu vào | Succ, π_opp, gọi theo nhu cầu | T, R tường minh hoặc liệt kê được |
| Phạm vi | Chỉ các nút đạt được từ state hiện tại | Toàn bộ S, kể cả state không đạt được |
| Đầu ra | Giá trị và action tại một state | V* và π* cho mọi state |
| Thứ tự tính | Post-order DFS, mỗi nút cây một lần | Các vòng quét, thông tin lan một lớp mỗi vòng |
| Trạng thái lặp | Tính lại mỗi lần gặp | Mỗi state một ô |
| Bộ nhớ | Theo chiều sâu | O(S) |
| Thời gian | Θ(số nút cây), tới b^m | O(t·S·A·S') |
| Có chu trình | Không dừng nếu không xử lý thêm | Hội tụ nếu γ < 1 |

Cầu nối: đệ quy cây **có memoization** trên đồ thị acyclic chính là một vòng value iteration theo reverse topological order, tức backward induction ([CS221 PE tr.20](https://stanford-cs221.github.io/spring2024-extra/modules/mdps/policy-evaluation.pdf) nói điều này cho policy evaluation).

**[Đã chạy] Số liệu đối chiếu.**

*Game xô:* VI dạng gộp đạt V(gốc) = 5 sau 1 vòng; dạng không gộp (có `pass`) gốc = 0 ở vòng 1 và = 5 ở vòng 2, sau đó không đổi.

*Halving game với opp uniform:* slide ghi luật "the player that is left with 0 wins" ([games1 PDF tr.19](/home/bao/Projects/Game1/docs/games1.pdf)); tôi tự đặt utility ±1 thay vì ±∞ và đặt state (lượt, N).

| N | V tại start (agent đi trước) | Lời gọi đệ quy cây | State đạt được (memo) | Ô trong bảng VI | Số vòng VI (kể cả vòng xác nhận) |
|---|---|---|---|---|---|
| 5 | 1.0 | 27 | 9 | 12 | 7 |
| 15 | 1.0 | 331 | 24 | 32 | 11 |
| 25 | 1.0 | 1571 | 39 | 52 | 15 |
| 31 | 1.0 | 3251 | 48 | 64 | 15 |

Cả ba phương pháp cho cùng giá trị. Với N = 15, Q của "giảm 1" là 1.0, Q của "chia đôi" là 0.75, nên expectimax chọn giảm 1. Bảng minh họa đúng lời cảnh báo "States are repeated", nhưng halving là game có rất ít state; CS221 nói đa số game thực không gom state được như vậy ([games1 PDF tr.70](/home/bao/Projects/Game1/docs/games1.pdf)).

### Gaps
- Tôi không xem được bộ slide MDP thực tế của lớp 24TN ngày 2026-11-02. Trích dẫn MDP dùng deck CS221 (2021, 2024) và CS188 Sp26 lec09; ký hiệu lớp có thể khác.
- Chưa tìm thấy nguồn CS221/CS188 viết tường minh đúng bảng rút gọn trên. Bảng là của tôi, dựa trên các định nghĩa đã trích.

---

## 4. Bẫy thuật ngữ: CS221 so với CS188; khác biệt với Expectiminimax

### Takeaway
Hai khóa học dùng cùng một phép toán. CS221 nhấn vào "policy stochastic đã biết của đối thủ"; CS188 gọi là "chance node cho mọi kết quả ngoài tầm kiểm soát". Điểm then chốt: xác suất ở nút tròn có thể là ngẫu nhiên thật **hoặc** chỉ là niềm tin của agent về đối thủ.

### Cited Findings
- CS221: expectimax là tối ưu trước "a fixed and known opponent policy π_opp". — [games1 PDF tr.32](/home/bao/Projects/Game1/docs/games1.pdf)
- CS221 mô tả ba loại nút tùy theo "whose turn it is at that node and **what we believe about that player's policy**". — [games1 PDF tr.65-66](/home/bao/Projects/Game1/docs/games1.pdf)
- CS188: lý do có chance node gồm "Explicit randomness: rolling dice", "Unpredictable opponents: the ghosts respond randomly", "Actions can fail: when moving a robot, wheels might slip". — [lec08 tr.4](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- CS188: "We have a chance node for any outcome out of our control: opponent or environment"; "The model might say that adversarial actions are likely!"; "Having a probabilistic belief about another agent's action does not mean that the agent is flipping any coins!". — [lec08 tr.13](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- CS188 note: p(s'|s) là xác suất của hành động không xác định **hoặc** xác suất đối thủ chọn hành động, "depending on the specifics of the game". Note này còn nói minimax là trường hợp đặc biệt của expectimax: min node là chance node gán xác suất 1 cho con có giá trị nhỏ nhất. — [note07 tr.1](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf)
- CS188 quiz: đối thủ chạy depth-2 minimax, dùng kết quả 80% số lần và đi ngẫu nhiên phần còn lại; đáp án là "Expectimax!". — [lec08 tr.14](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- CS221 Expectiminimax thêm player `coin` với policy ngẫu nhiên đã biết, song song với max và min. — [games1 PDF tr.63-64](/home/bao/Projects/Game1/docs/games1.pdf)

### Inferences
**Đối chiếu. [Tự chứng minh]**

| Khía cạnh | CS221 | CS188 |
|---|---|---|
| Tên nút | Nút opp trung bình theo π_opp, gọi là chance node trong "Summary" | Chance node |
| Nguồn xác suất | π_opp stochastic của đối thủ; ngẫu nhiên tự nhiên được tách thành player `coin` | Đối thủ **hoặc** môi trường |
| Công thức | Σ_a π_opp(s,a) V(Succ(s,a)) | Σ_{s'} p(s'\|s) V(s') |
| Chỉ số tổng | Theo hành động | Theo successor |

Hai công thức bằng nhau khi đặt p(s'|s) = Σ_{a: Succ(s,a)=s'} π_opp(s,a).

Hòa giải: expectimax là thuật toán trên cây có **nút max và nút trung bình**. Ý nghĩa của xác suất là chuyện mô hình hóa, có ba trường hợp:
1. Đối thủ thật sự tung đồng xu (ghost random).
2. Đối thủ deterministic nhưng ta không chắc (xác suất là niềm tin).
3. Thiên nhiên (xúc xắc, trượt bánh).

Trường hợp 3 thuần túy chính là MDP.

**Ba cái bẫy khi trả lời thầy:**
- "Expectimax giả định đối thủ ngẫu nhiên" là **sai**. π_opp có thể rất đối kháng, ví dụ p = 0.9 chọn số nhỏ, vẫn là expectimax.
- "Minimax là trường hợp đặc biệt của expectimax" chỉ đúng **sau khi** đã biết giá trị. Xác suất 1 của note 7 phụ thuộc giá trị các con, nên đây không phải π_opp cho trước độc lập như trong CS221. CS221 nói minimax "không có analogy trong MDP" ([games1 PDF tr.41](/home/bao/Projects/Game1/docs/games1.pdf)). Hai phát biểu không mâu thuẫn: sau khi tính xong thì π_min là một policy cụ thể và V_exptmax với π_min bằng V_minmax; nhưng không thể viết sẵn T trước khi giải.
- Dùng chance node để biểu diễn niềm tin ngầm giả định **độc lập giữa các nút**. Nếu đối thủ có một "kiểu" cố định chưa biết, lần quan sát trước nên cập nhật niềm tin ở các nút sau. Muốn xử lý đúng, state phải chứa belief; expectimax thuần không tự làm việc đó.

**Khác với Expectiminimax, đúng một dòng:** Expectimax chỉ có nút max và nút trung bình (đối thủ đã thay bằng phân phối); Expectiminimax giữ cả max, min đối kháng thật và nút chance riêng ([games1 tr.63](/home/bao/Projects/Game1/docs/games1.pdf)) — **phần của nhóm 11**.

### Gaps
- Không có tài liệu nào của khóa học đặt tên riêng cho cách phân biệt xác suất "khách quan/chủ quan"; đó là diễn giải của tôi dựa trên câu "flipping any coins".

---

## 5. Thuật toán: pseudocode, thứ tự DFS, độ phức tạp, ý nghĩa b và d

### Takeaway
Cả hai đều là post-order DFS trên cây. Hai công thức O(b^{2d}) của CS221 và O(b^m) của CS188 là một, vì m = 2d. Khác biệt không gian O(d) và O(bm) chỉ là cách đếm bộ nhớ. Hai nguồn không nêu công thức riêng cho expectimax; slide đặt chúng trong phần minimax, nhưng cùng phép duyệt nên áp dụng được.

### Cited Findings
- Pseudocode CS188 (đã đối chiếu ảnh trong note 7): `value(state)` trả utility nếu terminal, gọi `max-value` nếu agent là MAX và `exp-value` nếu là EXP. `max-value`: v = −∞; với mỗi successor, v = max(v, value(successor)). `exp-value`: v = 0; với mỗi successor, p = probability(successor), v += p·value(successor). — [note07 tr.2](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf); [lec08 tr.5](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- CS188 về minimax: "computing values of nodes in the same order as DFS… More precisely, it performs a postorder traversal". — [note06 tr.5](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf)
- CS188: time O(b^m), space O(bm), "Just like (exhaustive) DFS"; chess b ≈ 35, m ≈ 100. Đã xem ảnh render. — [lec07 tr.20](/home/bao/Projects/Game1/docs/cs188-sp26-lec07.pdf)
- CS188 định nghĩa: b là branching factor, m là "the approximate tree depth at which terminal nodes can be found". — [note06 tr.5](/home/bao/Projects/Game1/docs/cs188-fa23-note06.pdf)
- CS221: "branching factor b, depth d (2d plies)", O(d) space, O(b^{2d}) time; chess b ≈ 35, d ≈ 50. — [games1 PDF tr.69, slide 68](/home/bao/Projects/Game1/docs/games1.pdf)
- CS221: "A game tree of depth d corresponds to a tree where each player has moved d times. Each level in the tree is called a ply. The number of plies is the depth times the number of players." — [games1 PDF tr.70](/home/bao/Projects/Game1/docs/games1.pdf)
- Với chance node thường phải xem hết các con, vì một giá trị có thể kéo kỳ vọng lên hoặc xuống tùy ý; chỉ có thể cắt tỉa khi có cận hữu hạn. — [note07 tr.3](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf)
- Ví dụ của CS188: ba chance node {3,12,9}, {2,4,6}, {15,6,0}, xác suất 1/3 mỗi con, cho 8, 4, 7; gốc = 8. — [note07 tr.2](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf)
- Ví dụ của CS188 cho một chance node: (1/2)(8) + (1/3)(24) + (1/6)(−12) = 10. — [lec08 tr.6](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)

### Inferences
**Pseudocode.** Slide CS221 chỉ cho recurrence; code "semi-live" không có trong PDF. Hai đoạn dưới là tôi viết theo recurrence của CS221. **[Đã chạy]** bản Python tương ứng trên game xô cho 0.0 và (5.0, 'C').

```python
# Game evaluation (viết từ recurrence CS221 tr.27)
def Veval(s):
    if IsEnd(s): return Utility(s)
    pi = pi_agent if Player(s) == agent else pi_opp
    v = 0
    for a in Actions(s):
        if pi(s, a) > 0:              # tối ưu của tôi: bỏ nhánh xác suất 0
            v += pi(s, a) * Veval(Succ(s, a))
    return v

# Expectimax (viết từ recurrence CS221 tr.33)
def Vexptmax(s):
    if IsEnd(s): return Utility(s)
    if Player(s) == agent:
        return max(Vexptmax(Succ(s, a)) for a in Actions(s))
    return sum(pi_opp(s, a) * Vexptmax(Succ(s, a)) for a in Actions(s))

def pi_exptmax(s):                    # chỉ gọi khi Player(s) == agent
    return argmax(Actions(s), key=lambda a: Vexptmax(Succ(s, a)))
```

Lưu ý: gọi `pi_exptmax` như trên sẽ tính lại từng cây con mỗi khi đến lượt. Thực tế nên để hàm ở gốc trả về cả value lẫn action.

Dạng CS188 của game evaluation: không có trong tài liệu. Cách chuyển là thay `max-value` bằng `exp-value` dùng π_agent.

**Thứ tự DFS trên game xô, π_opp = 1/2. [Đã chạy]**
```
gọi gốc (max), v = −∞
  gọi nút A (exp), v = 0
    lá −50  → v = −25
    lá  50  → v = 0   → trả 0     gốc: best = 0  (A)
  gọi nút B
    lá   1  → v = 0.5
    lá   3  → v = 2   → trả 2     gốc: best = 2  (B)
  gọi nút C
    lá  −5  → v = −2.5
    lá  15  → v = 5   → trả 5     gốc: best = 5  (C)
trả (5, C). Tổng cộng 10 nút được thăm; stack sâu tối đa 3 frame.
```
Nút cha chỉ biết giá trị con sau khi con trả về (post-order). Stack chỉ giữ đường từ gốc tới nút hiện tại. Game evaluation với π_agent = A dừng sau khối A: 4 nút.

**Bảng hòa giải độ phức tạp. [Tự chứng minh, dựa trên các trích dẫn trên]**

| | CS221 | CS188 | Hòa giải |
|---|---|---|---|
| Độ sâu | d = số lượt **mỗi** player | m = số ply | m = 2d (hai player) |
| Time | O(b^{2d}) | O(b^m) | Giống hệt |
| Chess | b≈35, d≈50 | b≈35, m≈100 | Cùng 35^100 |
| Space | O(d) | O(bm) | Xem dưới |

- **[Đã chạy]** con số dài trên slide 68 của CS221 đúng bằng 35^100 (Python `35**100`, khớp toàn bộ chữ số), xấp xỉ 2.55×10^154.
- **Không gian:** O(d) đếm số frame đệ quy, mỗi frame O(1), coi như chỉ giữ con trỏ duyệt hành động. O(bm) theo kiểu DFS, mỗi mức giữ danh sách tối đa b successor. Với b cố định thì cả hai đều tuyến tính theo độ sâu; cũng không nên so d với m mà quên m = 2d.
- **b không đều:** với cây có b_a hành động agent, b_o hành động opp, d cặp lượt: số lá = (b_a·b_o)^d. Game xô: 3·2 = 6 lá, tổng 1 + 3 + 6 = 10 nút, khớp số đã chạy. Cây đều: tổng nút = (b^{m+1}−1)/(b−1) = Θ(b^m).
- **Expectimax:** Θ(số nút), vì không bỏ được con nào nếu không có thêm thông tin về cận (note07 tr.3). Slide không viết công thức riêng cho expectimax; O(b^m) là suy ra từ phép duyệt.
- **Game evaluation:** nếu π_agent deterministic và bỏ nhánh xác suất 0 thì chỉ còn O(b_o^d). Nếu cả hai deterministic thì chỉ một đường, O(m). Đây chính là "không phụ thuộc A" của policy evaluation ([CS221 PE tr.20](https://stanford-cs221.github.io/spring2024-extra/modules/mdps/policy-evaluation.pdf)). Trong trường hợp tệ nhất (cả hai đều stochastic đầy đủ) vẫn phải duyệt cả cây.

*Pointer một dòng:* cắt tỉa khi có cận và cắt độ sâu thuộc **nhóm 11**.

### Gaps
- Không tìm thấy trong tài liệu đã đọc công thức độ phức tạp ghi riêng cho game evaluation hoặc expectimax; note 7 và lec08 không nêu. [CS188 textbook 3.3](https://inst.eecs.berkeley.edu/~cs188/textbook/games/expectimax.html) cũng không nêu (đọc qua WebFetch).
- Cách diễn giải O(d) so với O(bm) là suy luận của tôi; hai nguồn không tự giải thích sự khác biệt.

---

## 6. Nền tảng: vì sao được lấy trung bình; vì sao cần cardinal utility; ví dụ đổi quyết định

### Takeaway
Định lý von Neumann–Morgenstern cho biết: nếu sở thích trên lottery thỏa các tiên đề thì tồn tại U sao cho so sánh lottery tương đương so sánh E[U]; U duy nhất tới phép biến đổi affine dương. Vì vậy expectimax bảo toàn quyết định dưới aU + b (a > 0) nhưng **không** bảo toàn dưới biến đổi đơn điệu tùy ý. Trên cùng game xô, cùng thứ tự kết cục, ba hàm đơn điệu có thể cho ba quyết định A, B, C.

### Cited Findings
- Principle of MEU: "A rational agent should chose the action that maximizes its expected utility, given its knowledge"; slide nêu đúng câu hỏi "How do we know that averaging even makes sense?". — [lec08 tr.23](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- Định lý [Ramsey 1931; von Neumann & Morgenstern 1944]: với sở thích thỏa ràng buộc, tồn tại U thực sao cho U(A) ≥ U(B) ⇔ A ⪰ B và U([p₁,S₁;…;p_n,S_n]) = Σ p_i U(S_i). Agent có thể hoàn toàn rational mà không biểu diễn utility, ví dụ một lookup table. Đã xem ảnh render. — [lec08 tr.31](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- Slide CS188 liệt kê năm tiên đề: Orderability, Transitivity, Continuity, Substitutability, Monotonicity. — [lec08 tr.30](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- Dạng chuẩn gồm bốn tiên đề: Completeness, Transitivity, Continuity, Independence; kết luận là "nếu và chỉ nếu". u duy nhất tới phép "adding a constant and multiplying by a positive scalar", là interval scale, mạnh hơn ordinal utility. Định lý chỉ khẳng định u tồn tại, không nói agent cố ý tối đa nó. — [Wikipedia: VNM utility theorem](https://en.wikipedia.org/wiki/Von_Neumann%E2%80%93Morgenstern_utility_theorem)
- Utility "unique up to positive linear transformation"; có thể biểu diễn bằng utility không có nghĩa là thật sự "có" hàm utility trong đầu. — [SEP: Normative Theories of Rational Choice](https://plato.stanford.edu/entries/rationality-normative-utility/) (đọc qua công cụ tóm tắt).
- CS188: với minimax thì "terminal function scale doesn't matter", gọi là "insensitivity to monotonic transformations"; với expectimax "we need *magnitudes* to be meaningful". Slide minh họa cây {0,40}, {20,30} qua x² thành {0,1600}, {400,900}. Đã xem ảnh render. — [lec08 tr.24](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- "behavior is invariant under positive linear transformation"; "With deterministic prizes only… only ordinal utility can be determined". — [lec08 tr.33](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- Tiền không phải utility: thường U(L) < U(EMV(L)), đó là risk aversion. Hiệu ứng Allais (1953) cho thấy con người có thể vi phạm. — [lec08 tr.35 và tr.37](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- Một slide khác có cây dice với lá 2,3,1,4 thành 20,30,1,400: 2.1 so với 1.3 đổi thành 21 so với 40.9, "Behaviour is preserved only by positive linear transformation of EVAL". (Cây này có nút min, nên là ví dụ **expectiminimax, nhóm 11**.) — [Barto, UMass CS383 slide 19](https://people.cs.umass.edu/~barto/courses/CS383-Fall11/383-Fall11-Lec9.pdf)
- AIMA 4e: mục 5.5 Stochastic Games, mục 16.2 The Basis of Utility Theory, mục 16.3 Utility Functions, mục 17.2.1 Value Iteration. — [Mục lục AIMA](https://aima.cs.berkeley.edu/contents.html)

### Inferences
**Chuỗi lý luận "vì sao được lấy trung bình". [Tự chứng minh]**
1. Định lý path-sum: mỗi cặp (π_agent, π_opp) sinh ra một **lottery** trên end state, L_π = [P(ω), leaf(ω)].
2. VNM: nếu sở thích của agent trên lottery thỏa tiên đề, thì tồn tại U với U(L) = Σ p_i U(S_i).
3. Do đó V_eval(s_start) đúng là U(L_π), và expectimax chọn lottery được ưa thích nhất.

Điểm đáng nói: lập luận này **không cần chơi nhiều lần**. Cách giải thích của CS221 ("large number of times", tr.26) là luật số lớn; VNM thì đúng cho cả một ván duy nhất. Đổi lại, số trong Utility phải thật sự là utility của agent. Expectimax "risk-neutral **theo U**", không nhất thiết theo tiền hay theo điểm.

**Vì sao bảo toàn với affine, không bảo toàn với đơn điệu. [Tự chứng minh]**
- *Affine:* đặt U' = aU + b (a > 0). Quy nạp: V' = aV + b, vì Σ p_i(aV_i + b) = a Σ p_i V_i + b (dùng Σ p_i = 1) và max(aV_i + b) = a·max V_i + b. arg max không đổi.
- *Đơn điệu tăng chặt f, với minimax:* f(max x_i) = max f(x_i), tương tự min, nên V_{f∘U} = f(V_U). Quyết định không đổi.
- *Đơn điệu f, với expectimax:* nói chung f(Σ p_i x_i) ≠ Σ p_i f(x_i) (Jensen). Bước quy nạp gãy ngay tại nút trung bình.

**Ví dụ đổi quyết định, kiểm tra tay.**

*(a) Ví dụ của CS188 (slide không ghi xác suất; tôi giả định 1/2 mỗi nhánh):*
- Gốc: trái (0+40)/2 = 20, phải (20+30)/2 = 25 → chọn **phải**.
- Qua x²: trái (0+1600)/2 = 800, phải (400+900)/2 = 650 → chọn **trái**.
- x² tăng trên [0,∞) và giữ thứ tự 0 < 20 < 30 < 40. Quyết định đảo.

*(b) Trên game xô của bài giảng, π_opp = 1/2. Thứ tự các lá luôn là −50 < −5 < 1 < 3 < 15 < 50. [Đã chạy, và tính tay lại]*

| f(U) | Lá A (−50, 50) | Lá B (1, 3) | Lá C (−5, 15) | E[A] | E[B] | E[C] | Expectimax | Minimax |
|---|---|---|---|---|---|---|---|---|
| U | −50, 50 | 1, 3 | −5, 15 | 0 | 2 | **5** | C | B |
| 2U+7 (affine) | −93, 107 | 9, 13 | −3, 37 | 7 | 11 | **17** | C | B |
| (U+50)² | 0, 10000 | 2601, 2809 | 2025, 4225 | **5000** | 2705 | 3125 | **A** | B |
| sign(U)·\|U\|^{1/3} | −3.684, 3.684 | 1, 1.442 | −1.710, 2.466 | 0 | **1.221** | 0.378 | **B** | B |
| −exp(−U/5) | −22026, −4.5·10⁻⁵ | −0.819, −0.549 | −2.718, −0.050 | ≈ −11013 | **−0.684** | −1.384 | **B** | B |

Đọc bảng: cùng game, cùng thứ tự, cùng mô hình đối thủ, expectimax đổi sang A, B hay giữ C tùy hình dạng f. Cột Minimax không đổi. −exp(−U/5) là hàm lõm, tức agent sợ rủi ro, nên chọn B ổn định.

**Bẫy khi dùng utility ±∞.** CS221 đặt utility của chess là +∞/0/−∞ ([games1 PDF tr.15](/home/bao/Projects/Game1/docs/games1.pdf)). Với minimax không sao vì chỉ cần thứ tự. Với expectimax, kỳ vọng có thể là ∞ − ∞ (không xác định), hoặc mọi xác suất thắng dương đều cho +∞. Muốn dùng expectimax phải đổi sang số hữu hạn, ví dụ +1/0/−1. **[Tự chứng minh]**

### Gaps
- **AIMA:** tôi chỉ đọc được mục lục, không đọc được chính văn. Theo trí nhớ, cây dice ở slide Barto là một hình trong chương Adversarial Search của AIMA; **chưa xác minh** số hình và trang.
- Slide CS188 chỉ liệt kê năm tiên đề, không có Decomposability; theo trí nhớ, AIMA có tiên đề này. **Chưa xác minh** với sách. Đừng khẳng định số lượng tiên đề mà không nói rõ đang theo nguồn nào: VNM dạng chuẩn có 4, slide CS188 ghi 5.
- Không đọc nguyên bản von Neumann & Morgenstern (1944); chỉ qua SEP, Wikipedia và CS188.

---

## 7. Rủi ro và sai số mô hình: ngưỡng lật trên ví dụ xô; dangerous optimism; bảng Pacman

### Takeaway
Với p = xác suất đối thủ chọn số nhỏ hơn: **p < 7/16 chọn A, 7/16 < p < 2/3 chọn C, p > 2/3 chọn B**. Quyết định C ở p = 1/2 chỉ cách biên A có 1/16 và cách biên B có 1/6, do A có độ trải rất lớn. "Dangerous optimism" của CS188 là giả định chance khi thực tế đối kháng; trong demo Pacman, expectimax trước ghost đối kháng chỉ thắng 1/5 với điểm trung bình −303.

### Cited Findings
- Số liệu game xô đã xác minh bằng ảnh và text: A = {−50, 50}, B = {1, 3}, C = {−5, 15}. "You choose one of the three bins. I choose a number from that bin." — [games1 PDF tr.5, slide 4](/home/bao/Projects/Game1/docs/games1.pdf)
- Bài giảng nói lựa chọn phụ thuộc mental model: đối thủ cùng phe chọn A (mong được 50), đối thủ chống lại chọn B (chắc được 1), đối thủ uniform chọn C (5 trong kỳ vọng). — [games1 PDF tr.6](/home/bao/Projects/Game1/docs/games1.pdf)
- "Property 3": V(π_max,π₇) ≤ V(π_exptmax(7),π₇); bảng 2×2 là 1, 2, −5, 5. — [games1 PDF tr.53-55](/home/bao/Projects/Game1/docs/games1.pdf)
- "The Dangers of Optimism and Pessimism": **Dangerous Optimism** = "Assuming chance when the world is adversarial"; **Dangerous Pessimism** = "Assuming the worst case when it's not likely". — [lec08 tr.16](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- Bảng "Assumptions vs. Reality" (nguyên văn số liệu, "Results from playing 5 games"). — [lec08 tr.17](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf); đã xem số hiện rõ trong ảnh render [Fa23 lec07 tr.25](https://inst.eecs.berkeley.edu/~cs188/archive/fa23/assets/lectures/cs188-fa23-lec07.pdf)

  | | Adversarial Ghost | Random Ghost |
  |---|---|---|
  | **Minimax Pacman** | Won 5/5, Avg. Score: 483 | Won 5/5, Avg. Score: 493 |
  | **Expectimax Pacman** | Won 1/5, Avg. Score: −303 | Won 5/5, Avg. Score: 503 |

- Điều kiện của bảng: "Pacman used depth 4 search with an eval function that avoids trouble. Ghost used depth 2 search with an eval function that seeks Pacman." — [lec08 tr.17](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- Bảng này cũng có đúng các số đó trong [Sp24 lec06](https://inst.eecs.berkeley.edu/~cs188/sp24/assets/lectures/cs188-sp24-lec06.pdf), [Fa24 lec07](https://inst.eecs.berkeley.edu/~cs188/fa24/assets/lectures/cs188-fa24-lec07.pdf) và [Sp23 lec10](https://inst.eecs.berkeley.edu/~cs188/archive/sp23/assets/lectures/cs188-sp23-lec10.pdf) (đã grep text).
- Minimax "provides more conservative actions than expectimax, and so tends to yield favorable results when the opponent is unknown as well". — [note07 tr.6](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf)

### Inferences
**Suy ngưỡng. [Tự chứng minh; Đã chạy bằng số hữu tỉ và quét 16001 điểm p]** Giả định đơn giản hóa: cùng p cho mọi xô.

```
V_A(p) = −50p + 50(1−p) = 50 − 100p
V_B(p) =   1p +  3(1−p) =  3 −   2p
V_C(p) =  −5p + 15(1−p) = 15 −  20p

A = C:  50 − 100p = 15 − 20p  ⇔  35 = 80p  ⇔  p = 7/16 = 0.4375   (giá trị chung 6.25)
C = B:  15 −  20p =  3 −  2p  ⇔  12 = 18p  ⇔  p = 2/3             (giá trị chung 5/3)
A = B:  50 − 100p =  3 −  2p  ⇔  47 = 98p  ⇔  p = 47/98 ≈ 0.4796 (không phải biên: tại đây C cao hơn)
```

| p | V_A | V_B | V_C | Tốt nhất |
|---|---|---|---|---|
| 0 (cùng phe) | 50 | 3 | 15 | A |
| 1/4 | 25 | 2.5 | 10 | A |
| 7/16 | 6.25 | 2.125 | 6.25 | A = C |
| 1/2 (uniform, slide) | 0 | 2 | 5 | **C** |
| 3/5 | −10 | 1.8 | 3 | C |
| 2/3 | −16.67 | 1.667 | 1.667 | C = B |
| 3/4 | −25 | 1.5 | 0 | B |
| 1 (đối thủ min) | −50 | 1 | −5 | **B** (khớp minimax) |

Ba đầu mút khớp đúng ba câu của bài giảng ở [tr.6](/home/bao/Projects/Game1/docs/games1.pdf). max(V_A, V_B, V_C) là hàm lồi, tuyến tính từng khúc theo p.

**Đọc độ nhạy. [Tự chứng minh]**
- Quanh p = 1/2: V_C − V_A = 5 với độ dốc theo p là +80, nên chỉ cần lệch Δp = 5/80 = 1/16. V_C − V_B = 3 với độ dốc −18, nên Δp = 3/18 = 1/6.
- Quy tắc: khoảng cách tới biên = (chênh lệch giá trị) / (độ dốc), và độ dốc đến từ **độ trải** của lá. Xô có độ trải lớn làm quyết định rất nhạy với mô hình.
- *Mô hình trộn:* đối thủ chọn số nhỏ với xác suất ε, còn lại uniform: p = 1/2 + ε/2. **Chỉ cần ε ≥ 1/3 là C mất vị trí tốt nhất**. Tương tự, nếu đối thủ thiên về cùng phe chỉ 1/8 (p = 7/16) đã lật sang A.
- *Liên hệ quiz CS188:* đối thủ 80% đối kháng, 20% ngẫu nhiên cho p = 0.8 + 0.2·0.5 = 0.9 (khớp xác suất 0.1/0.9 trên hình ở [lec08 tr.14](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)). Trên game xô, **[Đã chạy]** cho A = −40, B = 1.2, C = −3, nên chọn B. Đây là áp dụng số của tôi, không phải cách slide dùng số đó.
- *Khác p mỗi xô:* C thắng B ⇔ 10p_C − p_B < 6; C thắng A ⇔ 100p_A − 20p_C > 35. Đặt p bằng nhau là ra đúng hai ngưỡng trên.
- *Cận tổng quát cho một nút:* |E_p U − E_q U| ≤ (U_max − U_min)·TV(p,q).

**Lật quyết định khác với mất nhiều giá trị. [Tự chứng minh]**
Quyết định thay đổi đột ngột, nhưng giá trị liên tục theo p. Đứng gần ngưỡng thì lật sai gần như không mất gì. Thiệt hại lớn đến khi mô hình sai **rất xa**. **[Đã chạy]** regret = (giá trị tốt nhất) − (giá trị lựa chọn):

| Chọn | Thực tế p=0 | p=1/2 | p=1 | Regret lớn nhất trên [0,1] |
|---|---|---|---|---|
| A | 0 | 5 | **51** | 51 |
| B | 47 | 3 | 0 | 47 |
| C | 35 | 0 | 6 | 35 |

Chọn C khi thực tế p = 1 lỗ 6 so với B; chọn A khi p = 1 lỗ 51. Regret là phần mở rộng của tôi, không phải trong bài giảng.

**Bảng Pacman và bảng CS221 là cùng một mẫu 2×2. [Tự chứng minh]**

| | Đối kháng | Ngẫu nhiên |
|---|---|---|
| Minimax (CS221 / Pacman) | 1 / 483 | 2 / 493 |
| Expectimax (CS221 / Pacman) | **−5** / **−303** | 5 / 503 |

Cả hai đều cho thấy: bi quan khi đối thủ ngẫu nhiên mất ít (2 so với 5; 493 so với 503); lạc quan khi đối thủ đối kháng mất nhiều.

**Cảnh báo khi trình bày bảng Pacman:**
- Đây là demo 5 ván, **không phải thực nghiệm thống kê**; không có độ lệch chuẩn, không có seed, một bản đồ.
- Hai bên đều dùng depth-limited search và eval function, và ghost "adversarial" chỉ sâu 2. Vì vậy các tính chất giá trị ở CS221 chỉ phù hợp **về mặt định tính**, không áp dụng như định lý. Chênh lệch 503 so với 493 không đủ để kết luận gì.
- Bảng không chứng minh "minimax luôn tốt hơn". "Dangerous Pessimism" cũng là một tên có thật trên slide, bên cạnh optimism.

### Gaps
- Tôi không có dữ liệu Pacman gốc; chỉ có các số trên slide, không tái tạo được.
- Slide render từ **Sp26 lec08 tr.17 hiện ô trống** (poppler không hiện số dù text layer có). Muốn lấy ảnh có số cho slide nhóm, dùng **Fa23 lec07 tr.25**.
- Hai ngưỡng 7/16 và 2/3 là tôi tự suy, không có trên slide; chúng dựa trên giả định một p chung. Bài giảng chỉ nêu ba trường hợp: p = 0 (bằng lời), p = 1/2 và p = 1.

---

## 8. Mô hình đối thủ đến từ đâu trong thực tế? (phần mở rộng, không thuộc bài giảng CS221)

### Takeaway
Bài giảng giả định π_opp "từ trên trời rơi xuống" và CS188 nói rõ như vậy. Thực tế π_opp đến từ quan sát hoặc học từ dữ liệu người chơi, hoặc từ mô phỏng đối thủ, và chính sự giòn của best response đã dẫn đến các phương pháp robust.

### Cited Findings
- CS188: tạm "assume each chance node magically comes along with probabilities"; mô hình có thể là uniform hoặc phức tạp; khi phải mô phỏng đối thủ thì "gets very slow very quickly", và tệ hơn nếu đối thủ cũng đang mô phỏng lại ta. — [lec08 tr.13-14](https://inst.eecs.berkeley.edu/~cs188/sp26/assets/lectures/cs188-sp26-lec08.pdf)
- **Poker:** Loki quan sát đối thủ, xây mô hình và điều chỉnh chiến lược để khai thác các mẫu hành vi. — [Billings et al., AAAI 1998](https://mlanthology.org/aaai/1998/billings1998aaai-opponent) (chỉ đọc abstract)
- **Dữ liệu người chơi cờ:** Maia là mô hình kiểu AlphaZero huấn luyện trên ván của người, dự đoán nước đi không dùng tree search. Độ khớp nước đi: Stockfish 33–41%, Leela tối đa 46%, Maia tới hơn 52%; Maia cũng có thể nhắm vào một mức rating cụ thể. — [McIlroy-Young et al., KDD 2020](https://arxiv.org/abs/2006.01855) ([PDF](https://arxiv.org/pdf/2006.01855), tr.5-6)
- **Sự giòn của best response:** Johanson et al. tính counter-strategy "bounding the worst-case performance when the tendency is not observed", "substantially more robust than best response counter-strategies, while still exploiting a suspected tendency" trong Texas Hold'em hai người. — [NeurIPS 2007](https://proceedings.neurips.cc/paper/2007/hash/6e7b33fdea3adc80ebd648fffb665bb8-Abstract.html) (chỉ đọc abstract và snippet)
- **Tổng quan:** Albrecht & Stone phân loại các phương pháp modelling (policy reconstruction, type-based reasoning, classification, plan recognition, recursive reasoning, …). — [AIJ 2018 / arXiv 1709.08071](https://arxiv.org/abs/1709.08071) (chỉ đọc mục lục và abstract qua kết quả tìm kiếm)

### Inferences
- Maia chính là một ứng viên cho π_opp(s,a) trong recurrence. Bài Maia không tự chạy expectimax với mô hình đó; việc ghép hai thứ là suy luận của tôi, **không phải kết quả đã công bố trong bài này**.
- Độ chính xác khoảng 50% cho thấy nên dùng **phân phối** thay vì chỉ một nước dự đoán, và sai số mô hình là chuyện thường. Điều này nối trực tiếp với mục 7.
- Nên giới thiệu ở mức một slide "mở rộng", tách rõ với lý thuyết bắt buộc.

### Gaps
- Không đọc toàn văn Billings 1998, Johanson 2007 (hai link PDF tại ualberta trả về 404 khi tải trực tiếp) và Albrecht & Stone. Các mô tả chỉ giới hạn ở abstract/snippet.
- Không có số liệu đo được về việc ghép Maia với expectimax trong tài liệu đã đọc.

---

## 9. Hiểu lầm thường gặp và câu hỏi thầy có thể hỏi

### Takeaway
Những chỗ dễ mất điểm nhất: nhầm game evaluation với evaluation function; nghĩ expectimax giả định đối thủ ngẫu nhiên; nghĩ V = 5 là số điểm sẽ nhận; coi expectimax và value iteration là một thuật toán; dùng utility chỉ có thứ tự.

### Cited Findings
Phần lớn được trích ở các mục trên. Những nguồn riêng cho mục này:
- Eval(s) là ước lượng của V_minmax(s), khái niệm khác hẳn game evaluation. — [games1 PDF tr.75, slide 74](/home/bao/Projects/Game1/docs/games1.pdf)
- Chuỗi tính chất giá trị: V(π_max,π_min) ≥ V(π_agent,π_min); V(π_max,π_min) ≤ V(π_max,π_opp); V(π_max,π₇) ≤ V(π_exptmax(7),π₇). — [games1 PDF tr.49-55](/home/bao/Projects/Game1/docs/games1.pdf)
- Có thể thêm các lớp nút trong cây (nhiều ghost liên tiếp); số lớp không cần luân phiên chặt. — [note07 tr.3](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf)

### Inferences
Các câu trả lời dưới đây là tổng hợp của tôi từ các mục trên.

**Hiểu lầm**

| Nói sai | Sửa đúng |
|---|---|
| Game evaluation là hàm đánh giá cắt độ sâu | Khác hẳn. Game evaluation: giá trị **chính xác** của một cặp policy. Eval(s): ước lượng cho state chưa kết thúc (nhóm 11) |
| Expectimax giả định đối thủ ngẫu nhiên | Giả định đối thủ theo một phân phối **đã biết**; phân phối đó có thể rất đối kháng |
| V_exptmax = 5 nghĩa là được 5 điểm | Kết quả thật là −5 hoặc 15. 5 là **kỳ vọng** |
| Expectimax chính là value iteration | Cùng phương trình, khác cách giải (mục 3) |
| Agent nên ngẫu nhiên hóa để tốt hơn | Trước π_opp cố định, tổ hợp lồi ≤ max, nên không bao giờ lợi hơn (chuyện ngẫu nhiên hóa có lợi thuộc simultaneous games, nhóm 11) |
| Chỉ cần thứ tự các kết cục là đủ | Chỉ đúng cho minimax. Expectimax cần độ lớn |
| Expectimax luôn có kết quả tốt hơn minimax | Chỉ khi mô hình đúng. Sai mô hình có thể tệ hơn: −5 so với 1 |
| Cần zero-sum để chạy expectimax | Không. Recurrence chỉ dùng utility của agent; opp đã là phân phối, nên utility của opp không tham gia |

**Câu hỏi có thể gặp**

1. **Vì sao game evaluation không có max?** Vì π_agent đã cho. Không có gì để chọn, chỉ lấy kỳ vọng.
2. **Vì sao V_exptmax(s) ≥ V_minmax(s) với mọi π_opp?** V_minmax = V(π_max,π_min) ≤ V(π_max,π_opp) (property 2) ≤ V_exptmax (định lý tối ưu). Ví dụ: 1 ≤ 2 ≤ 5. Nhưng điều này chỉ áp dụng khi đối thủ thật sự là π_opp.
3. **Tại sao minimax không có analogy MDP mà expectimax có?** Vì nút trung bình ứng với T biết trước, không phụ thuộc V. Nút min chọn con theo giá trị nên không viết được T cố định trước khi giải.
4. **Vì sao γ = 1 mà không vấn đề gì?** Vì cây hữu hạn, mọi đường đều kết thúc; định lý hội tụ cho phép đồ thị acyclic với γ = 1.
5. **Vì sao không có reward giữa đường?** Đó là lựa chọn mô hình của game; chuyển Utility vào bước cuối là ra đúng dạng MDP. Có thể mô hình với reward giữa đường ([games1 tr.14](/home/bao/Projects/Game1/docs/games1.pdf)).
6. **Có cần bảng không?** Không, chỉ cần stack. Đổi lại, state lặp sẽ bị tính lại.
7. **Bỏ được con nào của nút trung bình không?** Nói chung không, vì con chưa xem có thể kéo kỳ vọng tùy ý; chỉ có thể khi có cận (nhóm 11).
8. **π_exptmax có phải cân bằng không?** Không. Đó là best response với một π_opp. Đối thủ biết điều đó có thể đổi và làm ta còn −5.
9. **Đối thủ deterministic thì sao?** π_opp(s,a) ∈ {0,1}, tổng còn một số hạng; recurrence vẫn đúng. Nếu ta không biết hành động của họ thì phân phối là niềm tin, vẫn là expectimax.
10. **Một ván thì có ý nghĩa không, hay phải chơi nhiều ván?** VNM vẫn cho lý do chọn theo E[U] cả cho một ván, miễn là U là utility đúng của agent.
11. **Nhân U với 2 và cộng 7 thì sao?** Giá trị đổi (5 thành 17), quyết định không đổi.
12. **Có mấy đối thủ thì sao?** Thêm lớp nút trung bình; recurrence không đổi ([games1 tr.65](/home/bao/Projects/Game1/docs/games1.pdf) nêu câu hỏi này, [note07 tr.3](/home/bao/Projects/Game1/docs/cs188-fa23-note07.pdf) nói về nhiều lớp).
13. **Giá trị tại nút giữa có nghĩa gì?** Expected utility từ nút đó trở đi, nếu ván đã đi tới đó và các bên tiếp tục theo policy đã nêu.
14. **Vì sao slide gọi expectimax là analogue của VI chứ không phải giống hệt?** Slide viết "recurrence for value iteration": cùng recurrence, còn phép lặp và bảng thì khác.

### Gaps
- Danh sách câu hỏi là dự đoán của tôi, không dựa trên đề thi hoặc lời giảng viên HCMUS.
- Hai file `ChatGPT-*.md` trong `docs/` không được dùng làm nguồn, vì là tổng hợp thứ cấp. Tôi chỉ xem chúng để biết nhóm đã đọc gì; khi trình bày nên ưu tiên các PDF gốc ở trên.
