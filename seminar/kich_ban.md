# Kịch bản trình bày Games 1 (nhóm 10)

File này được sinh từ slide bằng `node tools/export_script.mjs`. Trong deck, bấm **N** để xem ghi chú của slide hiện tại.

Tổng thời gian khoảng 57 phút; bản rút gọn (phím T) khoảng 47 phút.

## Mở đầu

### 1. Games 1 (30 giây)

Giới thiệu nhóm 10 và chủ đề Games 1, gồm năm phần: Overview, Modeling, Game evaluation, Expectimax và Minimax.

Hình bên phải là game tree của Tic-Tac-Toe từ bàn trống, năm ply đầu (18.730 node). Màu của mỗi node là Minimax value theo X: xanh lá là X thắng, xám là hòa, hồng là O thắng khi hai bên chơi tối ưu. Kéo chuột để xoay cây.

Phím tắt: → đi tiếp, A tự chạy, O tổng quan, N ghi chú, T bản rút gọn, F toàn màn hình.

### 2. Câu hỏi của buổi trình bày (45 giây)

- Pi: Agent là robot bên trái. Đối thủ đội mũ len, đứng bên phải.
- Pi: Agent chỉ chọn ở lượt của mình, nhưng kết quả còn phụ thuộc các lượt sau.
- Pi: Các lượt đó do đối thủ chọn, nên agent phải tính trước cách đối thủ phản ứng.

Câu hỏi của cả buổi: tại một state, agent nên chọn action nào khi một phần diễn biến tiếp theo do đối thủ quyết định.

Quy ước màu dùng trong slide và video: xanh dương cho agent (MAX), hồng cho đối thủ (MIN), tím cho chance node, xanh ngọc cho Game evaluation, cam cho node đang tính, xanh lá cho action được chọn.

### 3. Lộ trình (40 giây)

- Pi: Phần đầu giải thích vì sao có đối thủ thì cần policy thay cho plan.
- Pi: Phần hai mô tả một game bằng sáu thành phần.
- Pi: Phần ba tính value của một cặp policy đã biết.
- Pi: Phần bốn tìm policy tốt nhất khi biết đối thủ chơi theo xác suất nào.
- Pi: Phần năm tìm policy tốt nhất cho worst case.
- Pi: Game ba hộp đi suốt buổi; Tic-Tac-Toe và Halving minh họa thêm.

Mạch nội dung theo Stanford CS221 Games I (games1.pdf, trang 1-56). Ví dụ và cách cài đặt bổ sung từ UC Berkeley CS188.

Evaluation function, depth-limited search, alpha-beta pruning và Expectiminimax thuộc Games 2 của nhóm 11.

## Overview

### 4. Single-agent search (60 giây)

- Pi: Mô hình cho biết start, goal, các action hợp lệ, transition và cost từng bước.
- Pi: Path ít edge nhất chỉ có 2 bước, nhưng tốn 9 + 9 = 18.
- Pi: Path 3 bước chỉ tốn 3. Agent tự chọn mọi bước, nên tìm xong path là đi được ngay.

Một lời giải hợp lệ là path ρ = (s₀, a₀, s₁, …, s_k) đi theo transition và có s_k ∈ G. Path tối ưu là ρ* ∈ argmin C(ρ), với C(ρ) là tổng cost các bước. Path ít bước nhất chưa chắc là path rẻ nhất.

Nguồn: CS188, State Spaces and Search Problems.

### 5. Plan và policy (60 giây)

- Pi: Agent lập plan X0, O4, X2. Nhưng O4 là nước của đối thủ.
- Pi: Nếu O chọn ô 1 hoặc ô 8, plan không còn dùng được.
- Pi: Policy có sẵn một nước đáp cho mỗi phản ứng của O. Đây là adversarial search.

Trong single-agent search, agent tìm một chuỗi action rồi thực hiện. Trong game, agent chỉ chọn ở lượt của mình; các lượt còn lại do đối thủ chọn. Một chuỗi nước dẫn tới thắng chỉ là một trong nhiều diễn biến có thể xảy ra.

Chất lượng của một policy phụ thuộc cả cách agent chơi lẫn cách đối thủ phản ứng (CS188 Note 6, trang 1-2). Các nước đáp trên hình chỉ để minh họa rằng mỗi nhánh đều có một nước đáp; chúng chưa chắc tối ưu.

### 6. Game ba hộp (70 giây)

- Pi: Agent chọn một hộp, đối thủ chọn một trong hai số trong hộp. Số đó là utility của agent.
- Pi: Agent chọn A, đối thủ chọn số nhỏ, nên agent nhận −50.
- Pi: Agent chọn B, đối thủ vẫn chọn số nhỏ, nên agent nhận 1.
- Pi: Nếu đối thủ chọn số lớn, hộp A cho 50. Hộp tốt nhất phụ thuộc vào đối thủ.

Ví dụ ba hộp lấy từ CS221, trang 5-6. Có thể mời người nghe chọn hộp và đổi cách chọn của đối thủ bằng các nút bên dưới. Đồng xu góc trái là tổng utility của agent; vì zero-sum nên góc phải là số đối.

### 7. Ba giả định về đối thủ (70 giây)

- Pi: Sáu kết quả không đổi. Value của hộp còn phụ thuộc cách đối thủ chọn số.
- Pi: Nếu đối thủ chọn số lớn, hộp A có value 50 và là lựa chọn tốt nhất.
- Pi: Nếu đối thủ chọn mỗi số với xác suất ½, value là 0, 2, 5 và agent chọn C.
- Pi: Nếu đối thủ chọn số nhỏ, value là −50, 1, −5 và agent chọn B.

Leaf 50 ở hộp A chưa đủ để kết luận A tốt, vì agent không quyết định việc đi tới leaf đó (CS221, trang 5-6).

Ba dòng của bảng ứng với ba câu hỏi mà Game evaluation, Expectimax và Minimax trả lời ở các phần sau.

### 8. Game khác search ở đâu (45 giây)

- Pi: Utility nằm ở cuối ván. Muốn tính value ở state hiện tại, cần xét các terminal state có thể tới.
- Pi: Mỗi node có một player chọn action, và cách tính value tùy vào player đó.
- Pi: Bốn hình dạng node này dùng cho mọi cây trong buổi.

CS221, trang 17-18. Tam giác hướng lên là node MAX của agent, tam giác hướng xuống là node MIN của đối thủ, hình tròn là chance node, hình vuông là terminal state mang utility.

## Modeling

### 9. Loại game đang xét (50 giây)

- Pi: Có hai player, và tổng utility của hai bên luôn bằng 0.
- Pi: Hai bên đi lần lượt, thấy toàn bộ state, không có yếu tố ngẫu nhiên, và cây hữu hạn.
- Pi: Zero-sum vẫn có hòa; khi hòa, cả hai bên nhận 0.

CS221, trang 13-14. Các cây giải trong bài đều hữu hạn, nên phép tính từ terminal state về root luôn kết thúc.

### 10. Sáu thành phần của mô hình (55 giây)

- Pi: Bốn thành phần đầu giống search: start state, action, transition và điều kiện dừng.
- Pi: Utility chấm terminal state theo góc nhìn agent. Thua cũng là terminal state.
- Pi: Player(s) cho biết ai đang chọn. Đối thủ đi vào mô hình qua thành phần này.

CS221, trang 13-18. So với single-agent search, Player(s) xác định ai điều khiển bước tiếp theo, còn Utility(s) dùng để so sánh các terminal state.

### 11. Từ search sang game (45 giây, có thể lướt)

- Pi: Start state và transition vẫn giữ nguyên.
- Pi: Goal test trở thành IsEnd, và terminal state có thể là thua.
- Pi: Không còn cộng cost dọc path; Utility chấm terminal state.
- Pi: Khác biệt lớn nhất là một số bước do đối thủ chọn.

Biết các bước hợp lệ vẫn chưa đủ để chọn nước. Agent còn cần một cách đánh giá các phản ứng có thể có của đối thủ; ba phần sau đưa ra ba cách như vậy.

### 12. Mô hình hóa Tic-Tac-Toe (75 giây)

- Pi: X là agent và đi trước. Các ô tô xanh là Actions(s). Bấm một ô để đi.
- Pi: Rê chuột lên ô trống để xem Succ(s, a): đặt quân rồi đổi lượt.
- Pi: X đã thắng dù còn ô trống. Phải kiểm tra IsEnd trước khi sinh action.

State: bàn cờ 3×3 và player đến lượt. s_start: bàn trống, X đến lượt. Actions(s): các ô trống nếu ván chưa kết thúc. Succ(s, a): đặt quân của player đến lượt vào ô a rồi đổi lượt. IsEnd(s): một bên có ba quân thẳng hàng hoặc bàn đã đầy. Utility(s): +1 nếu X thắng, 0 nếu hòa, −1 nếu O thắng. Player(s): X hoặc O.

Quy ước X đi trước chỉ dùng cho ví dụ từ bàn trống; thế P và thế Q ở phần sau cho O đi trước. Game tree Tic-Tac-Toe có trong CS188 Lecture 7, trang 14.

### 13. Hai điều cần kiểm tra (45 giây)

- Pi: Cùng một bàn cờ, X đến lượt và O đến lượt là hai state khác nhau.
- Pi: Cả năm ô trống đều hợp lệ, nhưng bốn ô dẫn tới thua ngay.

Nếu luật hoặc mô hình đối thủ phụ thuộc vào lịch sử, phần lịch sử cần thiết cũng phải nằm trong state.

Bàn minh họa theo quy ước X đi trước: X ở ô 4 và 8, O ở ô 0 và 1, X đến lượt. O đe dọa hoàn tất hàng 0-1-2.

### 14. Game tree và state-space graph (60 giây)

- Pi: X0, O4, X2 và X2, O4, X0 là hai lịch sử khác nhau. Trên game tree chúng là hai node.
- Pi: Bàn cờ và lượt giống hệt nhau, nên trong state-space graph chúng là một node.

Trên game tree, mỗi node là một state trong một lịch sử chơi, mỗi edge là một action hợp lệ, mỗi leaf là terminal state mang utility, và mỗi path từ root tới leaf là một ván. Trên state-space graph, mỗi state khác nhau là một node (CS221, trang 11-12).

Từ state chung đó, các action hợp lệ và phần còn lại của ván giống nhau, nên có thể dùng lại value.

### 15. So sánh tree và graph (45 giây, có thể lướt)

- Pi: Game tree giữ lại lịch sử, còn state-space graph gộp các state giống nhau.
- Pi: Vì vậy trên tree, cùng một state có thể bị tính lại nhiều lần.

Các thuật toán trong bài được trình bày trên tree để thấy rõ từng lựa chọn và phản ứng. Gộp state bớt được phần tính lặp, nhưng không giải quyết được trường hợp số state vẫn quá lớn.

### 16. 549.946 node, 5.478 state (50 giây)

- Pi: Bàn cờ chỉ có 9 ô nhưng game tree có gần 550 nghìn node.
- Pi: Số state khác nhau chỉ hơn 5 nghìn, nên rất nhiều node lặp lại cùng một state.
- Pi: Root màu xám: chơi tối ưu thì hòa. Có thể kéo để xoay cây.

Số liệu do nhóm tính bằng verify_examples.py: duyệt toàn cây từ bàn trống, dừng khi có người thắng hoặc bàn đầy. Kết quả là 549.946 lần thăm node (tính cả state lặp), 5.478 state khác nhau, Minimax value ở root bằng 0.

Muốn dùng lại value, state phải đủ thông tin: cùng bàn cờ nhưng khác lượt là hai state. Cây 3D xếp các con thành vòng dưới parent (cone tree); năm tầng đầu có 1 + 9 + 72 + 504 + 3.024 + 15.120 = 18.730 node.

### 17. Policy (55 giây)

- Pi: Policy quy định cách chơi ở mọi state thuộc lượt mình, kể cả state chưa gặp.
- Pi: Deterministic policy chọn đúng một action, tức gán xác suất 1 cho action đó.
- Pi: Stochastic policy gán xác suất cho từng action. Từ đây π là policy của agent, μ của đối thủ.

CS221, trang 21-22. Policy của X trong Tic-Tac-Toe phải nói X đáp thế nào sau mọi nước của O. Path X0 → O4 → X2 chỉ là một lịch sử chơi và không cho biết X làm gì khi O chọn ô 1.

Khi cài đặt, có thể tính lại nước đi từ state thực tế ở mỗi lượt thay vì lưu sẵn toàn bộ policy. Ký hiệu π(a | s), μ(a | s) tương ứng với π_agent(s, a), π_opp(s, a) trong slide CS221.

### 18. Utility và value (60 giây)

- Pi: Utility chỉ có ở terminal state.
- Pi: Value của một cặp policy là expected utility khi hai bên chơi đúng theo policy đó.
- Pi: Giữ μ cố định và cho agent tối ưu, ta được value tối ưu trước μ.
- Pi: Không giả định μ, agent tối đa value trong worst case. Ba phần sau tính từng value.

s_T là terminal state đạt được và utility hữu hạn. Với game hữu hạn, fully observable, hai value tối ưu được tính bằng recurrence của Expectimax và Minimax. Tên trong slide CS221: V_eval = V^{π,μ}, V_exptmax = V^{*,μ}, V_minmax = V_mm.

CS221, trang 25-34; CS188 Note 6, trang 2-3.

### 19. Cùng leaf, ba value (45 giây)

- Pi: Agent cố định chọn A, nên root bằng trung bình của −50 và 50, tức 0.
- Pi: Agent được chọn khi đối thủ chọn đều: max của 0, 2, 5 là 5.
- Pi: Đối thủ chọn số bất lợi nhất: max của −50, 1, −5 là 1.

Các leaf −50, 50, 1, 3, −5, 15 giữ nguyên. Root nhận ba value khác nhau vì giả định về cách hai bên chơi khác nhau. Ba phần sau trình bày từng phép tính.

## Game evaluation

### 20. Game evaluation (50 giây)

- Pi: Agent chơi theo π, đối thủ chơi theo μ, và cả hai đã cố định.
- Pi: Evaluation ở đây nghĩa là đo. Thuật toán chưa tìm policy mới.
- Pi: Kết quả là trung bình theo xác suất; một ván thật có thể ra số khác.

CS221, trang 25-28. Game evaluation tính V^{π,μ}(s) cho một cặp policy đã cố định.

### 21. Recurrence của Game evaluation (60 giây)

- Pi: Tại terminal state, value bằng utility. Tại node khác, lấy trung bình value các con.
- Pi: Hai con có value v₁, v₂ và xác suất q, 1 − q thì value là q·v₁ + (1 − q)·v₂.
- Pi: Lượt agent và lượt đối thủ tính giống nhau, chỉ khác bảng xác suất.

CS221, trang 27-28. Mỗi action xảy ra với xác suất cho trước, nên value của node là trung bình value của các nhánh. Chỉ tại terminal state mới dùng utility trực tiếp.

### 22. Video: Game evaluation trên ba hộp (36 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim: từ utility ở leaf, mỗi hộp lấy trung bình và được 0, 2, 5. Root lấy trung bình theo policy agent chọn A: 1·0 + 0·2 + 0·5 = 0. Sau đó policy agent đổi sang chọn đều ba hộp: (0 + 2 + 5)/3 = 7/3.

C có value cao hơn, nhưng Game evaluation vẫn trả 0 vì đang đánh giá policy chọn A. Đổi policy thì value đổi; phép đánh giá không tự tìm policy mới (CS221, trang 25).

### 23. Thử đổi policy (60 giây)

- Pi: Agent luôn chọn A, đối thủ chọn đều, nên root bằng 0. Độ dày edge thể hiện xác suất.
- Pi: Agent chọn đều ba hộp thì root bằng (0 + 2 + 5)/3 = 7/3. Kéo thanh trượt để đổi μ.

Thanh trượt q là xác suất đối thủ chọn số nhỏ, dùng chung cho cả ba hộp: V(A) = 50 − 100q, V(B) = 3 − 2q, V(C) = 15 − 20q. Mọi node đều tính bằng tổng có trọng số.

### 24. Recurrence và simulation (60 giây)

- Pi: Simulation cho hai policy chơi nhiều ván rồi lấy trung bình utility.
- Pi: Mỗi ván chọn A chỉ ra −50 hoặc 50, nên trung bình của vài ván dao động mạnh.
- Pi: Trung bình mẫu dao động quanh 0 và hội tụ về 0 khi số ván tăng.

Trung bình mẫu V̂ₙ = (1/n) Σ U(s_T⁽ⁱ⁾). Recurrence trên cây hữu hạn cho expected utility chính xác; simulation lấy mẫu action theo hai policy, chơi tới terminal state rồi lấy trung bình. Với số ván hữu hạn, trung bình mẫu có thể khác 0.

Giảng viên CS221 so sánh rollout với recurrence trong Games I 2025, đoạn 13:26 đến 19:51.

### 25. Game evaluation dùng để làm gì (45 giây, có thể lướt)

- Pi: Muốn biết một policy tốt đến đâu trước từng đối thủ, ta dùng Game evaluation.
- Pi: Trong MDP, bước này có tên là policy evaluation.
- Pi: Evaluation function là một khái niệm khác: hàm ước lượng value, thuộc Games 2.
- Pi: Bảng face-off ở phần sau dùng lại phép tính này.

CS221, trang 27 và 47-48; evaluation function ở trang 75.

## Expectimax

### 26. Expectimax (50 giây)

- Pi: Agent vẫn biết đối thủ chơi theo xác suất nào, nhưng giờ được tự chọn action.
- Pi: Lượt agent đổi từ trung bình theo π sang max; lượt đối thủ giữ trung bình theo μ.
- Pi: μ có thể là bất kỳ phân phối xác suất nào đã biết.

CS221, trang 31-34. Theo ký hiệu ở phần Modeling, Expectimax tính V^{*,μ}(s) = max_π V^{π,μ}(s): giữ μ cố định và tối ưu π.

### 27. Recurrence của Expectimax (55 giây)

- Pi: Terminal state trả utility, lượt agent lấy max, lượt đối thủ lấy trung bình theo μ.
- Pi: Tam giác hướng lên là MAX, hình tròn là chance node, hình vuông là terminal state.
- Pi: Trong game có xúc xắc, chance node còn biểu diễn yếu tố ngẫu nhiên của môi trường.

CS188 Note 7, trang 1-2. Trong Games 1, xác suất đến từ mô hình về cách đối thủ chọn nước; Succ(s, a) vẫn deterministic sau khi action đã chọn. Cần phân biệt xác suất do mô hình đối thủ với xác suất do môi trường. Game ba hộp chỉ có loại thứ nhất.

### 28. Video: Expectimax trên ba hộp (28 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim: đối thủ vẫn chọn đều nên ba hộp giữ value 0, 2, 5. Root đổi thành node MAX: max(0, 2, 5) = 5, agent chọn C. Value 5 là expected utility; một ván chọn C chỉ cho −5 hoặc 15 (CS221, trang 31-34).

### 29. Value và action (45 giây)

- Pi: Hàm value trả về một con số. Để chơi, agent cần action tạo ra con số đó.
- Pi: Nếu hai hộp cùng tốt nhất, chọn hộp nào cũng được.
- Pi: Ở mỗi lượt sau, agent lại chọn theo argmax.
- Pi: Expectimax cho 5 ở mức trung bình; một ván riêng lẻ chỉ ra −5 hoặc 15.

Tại mỗi state thuộc lượt agent, policy được lấy bằng argmax. Hàm value có thể gọi lại tại state thực tế sau mỗi nước của đối thủ.

### 30. Video: một tham số, ba lựa chọn (38 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim: p là xác suất đối thủ chọn số nhỏ, dùng chung cho ba hộp. V_A = 50 − 100p, V_B = 3 − 2p, V_C = 15 − 20p. Đường cao nhất cho lựa chọn tốt nhất: A khi p < 7/16, C khi 7/16 < p < 2/3, B khi p > 2/3.

Hai ngưỡng: V_A = V_C khi 35 = 80p, tức p = 7/16; V_C = V_B khi 12 = 18p, tức p = 2/3. A và B cắt nhau tại p = 47/98, nhưng khi đó V_C = 265/49 lớn hơn nên lựa chọn không đổi.

### 31. Độ nhạy theo mô hình đối thủ (60 giây)

- Pi: Mỗi đường thẳng là expected utility của một hộp theo p. Kéo thanh trượt để đổi p.
- Pi: Expectimax luôn chọn đường cao nhất: A, rồi C, rồi B.
- Pi: Lựa chọn đổi tại p = 7/16 và p = 2/3.
- Pi: A và B cắt nhau tại 47/98, nhưng khi đó C cao hơn cả hai nên lựa chọn không đổi.

Bắt đầu từ p = 0,5, chỉ cần giảm p xuống dưới 0,4375 là lựa chọn đổi từ C sang A. Hộp A nhạy với p hơn vì hai số trong hộp cách xa nhau.

Tại p = 7/16, A và C cùng bằng 25/4, lớn hơn B là 17/8. Tại p = 2/3, B và C cùng bằng 5/3, lớn hơn A là −50/3. Phân tích theo p do nhóm phát triển từ game ba hộp (CS221, trang 5-6) và công thức Expectimax (trang 33-34).

### 32. Mô hình sai thì sao (55 giây)

- Pi: Agent tin đối thủ chọn đều, p = 0,5, nên chọn C và dự kiến được 5.
- Pi: Đối thủ thật chọn số nhỏ 90% số lần: C chỉ còn −3, trong khi B được 1,2.
- Pi: Nếu đối thủ luôn chọn số nhỏ, C cho −5 còn B vẫn cho 1. Minimax bắt đầu từ đây.

Expectimax tối ưu theo mô hình được đưa vào; mô hình có thể không khớp đối thủ thật. Khi p = 1, mỗi chance node chỉ còn số nhỏ nhất và lựa chọn trùng với Minimax. Khi p = 0,9, Expectimax cũng chọn B.

Phần thiệt do mô hình sai là hiệu giữa lựa chọn tốt nhất khi biết p thật và lựa chọn theo mô hình, cả hai đều tính với p thật.

### 33. Expectimax cần gì (50 giây)

- Pi: Mô hình đối thủ phải là một phân phối xác suất hợp lệ.
- Pi: Đổi thang utility có thể đổi lựa chọn, dù thứ tự các kết quả giữ nguyên.
- Pi: Expected utility bằng xác suất thắng trừ xác suất thua, nên nó khác tỉ lệ thắng.
- Pi: Lựa chọn tối ưu luôn gắn với một mô hình cụ thể về đối thủ.

Các ví dụ trong bài dùng utility hữu hạn. Ví dụ đổi thang: A cho 0 hoặc 40, B cho 20 hoặc 30, mỗi kết quả xác suất ½. Với U, Expectimax chọn B (25 so với 20); với U², Expectimax chọn A (800 so với 650). Minimax chọn B ở cả hai thang. Phép biến đổi aU + b với a > 0 giữ nguyên lựa chọn.

### 34. Liên hệ MDP (55 giây, có thể lướt)

- Pi: Từ lượt agent, qua một nước của đối thủ, lại tới lượt agent.
- Pi: Vì μ cố định, nước của đối thủ trở thành xác suất transition.
- Pi: Phương trình thu được là Expectimax viết dưới dạng MDP.
- Pi: Cách gộp này chỉ đúng khi đối thủ giữ nguyên policy.

Nếu nhiều action b cùng dẫn tới một s′, xác suất của chúng được cộng lại. Nếu u đã là terminal state ngay sau nước của agent, bỏ lượt đối thủ và đặt P_μ(u | s, a) = 1. Reward trung gian bằng 0, không chiết khấu, utility ở terminal state.

Ví dụ chọn C trong game ba hộp: P_μ(C₋₅ | s₀, C) = P_μ(C₁₅ | s₀, C) = 1/2, tổng ứng với C là 5. Công thức gộp lượt do nhóm triển khai từ CS221, trang 22 và 27-34.

## Minimax

### 35. Minimax (50 giây)

- Pi: Trong game zero-sum, đối thủ tăng utility của mình nghĩa là giảm utility của agent.
- Pi: Vì vậy ở lượt đối thủ, ta giả sử họ chọn nước làm agent thiệt nhất và lấy min.
- Pi: Minimax không cần ước lượng xác suất nào.

CS221, trang 37-42. Tổng utility của hai bên bằng 0, nên đối thủ tối đa utility của mình cũng chính là tối thiểu utility của agent.

### 36. Recurrence của Minimax (55 giây)

- Pi: So với Expectimax, chỉ dòng thứ ba thay đổi: trung bình có trọng số được thay bằng min.
- Pi: Lấy argmax ta được policy của agent, lấy argmin ta được policy của đối thủ.
- Pi: Hai policy này xuất hiện lại trong bảng face-off.

CS221, trang 41-44. Value tính từ leaf lên root. Ở lượt agent, chọn action dẫn tới con có value lớn nhất; ở lượt đối thủ, giả sử đối thủ chọn con có value nhỏ nhất.

### 37. Video: Minimax trên ba hộp (29 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim: các node hộp đổi thành MIN, nên A, B, C có value −50, 1, −5. Root MAX lấy max(−50, 1, −5) = 1 và agent chọn B. Dù đối thủ chọn 1 hay 3, agent nhận ít nhất 1. Hộp A có leaf 50 nhưng agent không thể bảo đảm đi tới đó (CS221, trang 39-40).

### 38. Ba phương pháp, một cây (60 giây)

- Pi: Game evaluation: cả hai policy đã biết, mọi tầng lấy trung bình. Root bằng 0.
- Pi: Expectimax: root đổi thành max. Root bằng 5 và agent chọn C.
- Pi: Minimax: tầng đối thủ đổi thành min. Root bằng 1 và agent chọn B.

Game evaluation đánh giá một cặp policy, Expectimax tối đa expected utility trước một policy đối thủ đã biết, còn Minimax tối đa worst-case value. Mỗi con số 0, 5, 1 chỉ có nghĩa cùng với giả định của nó (CS221, trang 25-43).

### 39. Video: cây nhiều tầng (37 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim trên cây MAX, MIN, MAX. Hai node MAX trong A trả max(−100, 10) = 10 và max(8, 20) = 20; A trả min(10, 20) = 10; B trả min(5, 6) = 5; root trả max(10, 5) = 10 và chọn A.

Leaf −100 không quyết định value của A, vì tới node MAX đó agent sẽ chọn 10. Đối thủ chỉ được chọn ở lượt MIN. Ví dụ do nhóm dựng từ recurrence.

### 40. Pseudocode (50 giây)

- Pi: Hai hàm giống nhau gần như từng dòng.
- Pi: Cả hai dừng ở terminal state, gọi đệ quy xuống các con và lấy max ở lượt agent.
- Pi: Dòng cuối khác nhau: Expectimax cần xác suất của đối thủ, Minimax thì không.

pi_opp(s, a) là xác suất đối thủ chọn a tại s theo policy đã biết. max chỉ trả về value; muốn biết nước đi phải lưu thêm action tương ứng. CS188 Note 6, trang 5; Lecture 7, trang 16-17; Note 7, trang 1-2.

### 41. Chạy từng bước (75 giây)

- Pi: Mỗi lần bấm Bước tiếp là một lời gọi value hoặc một lần trả kết quả.
- Pi: Node chỉ có value khi mọi con đã trả về. Đây là postorder DFS, hay backward induction.
- Pi: Đổi tầng đối thủ sang trung bình: cùng các leaf, Expectimax chọn C thay vì B.

Chiều đi xuống thử các action hợp lệ và sinh state kế tiếp. Chiều đi lên nhận value của các con rồi lấy max, min hoặc trung bình. Việc thử một nhánh trong lúc search chưa có nghĩa agent sẽ chơi nhánh đó.

Backward induction là truyền value từ con lên parent, khác với search ngược từ goal. Nút "Đổi leaf ngẫu nhiên" tạo cây mới để người nghe đoán trước kết quả.

### 42. Halving: luật chơi (50 giây)

- Pi: Mỗi lượt trừ 1 hoặc chia đôi. Bên nhận được số 0 thì thắng.
- Pi: Value luôn tính theo góc nhìn của lớp, kể cả khi máy đang chọn.
- Pi: Ở N = 1, nước nào cũng đưa số 0 cho máy, nên lớp thua.

CS221, trang 19 và 45. Demo dùng game.py của CS221 (bản lưu trữ cs221.1196). Giá trị vô hạn chỉ dùng để phân biệt thắng và thua; thay bằng +1 và −1 thì các nước tối ưu không đổi.

### 43. Video: state thắng và state thua (49 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim: W(n) = 1 nếu player đến lượt tại n có strategy thắng. W(0) = 1; với n > 0, W(n) = max{1 − W(n − 1), 1 − W(⌊n/2⌋)}. Tính từ 0 tới 16, các state thua là 1, 4, 6, 10, 14, 16.

Vì vậy để máy nhận 14 thì lớp có strategy thắng, còn để máy nhận 7 thì máy có strategy thắng. Bảng được kiểm bằng verify_examples.py.

### 44. Lớp đấu với Minimax (180 giây, có thể lướt)

- Pi: Cả lớp bỏ phiếu − hoặc ÷2 ở mỗi lượt. Máy in value theo góc nhìn của lớp.

Chơi một ván. Sau mỗi nước của máy, đọc value: +∞ nghĩa là lớp vẫn có strategy thắng, −∞ nghĩa là máy có strategy thắng. Nếu hết giờ, dừng sau một lượt của máy và dùng value vừa in để kết luận.

Chuỗi dự phòng khi lớp chọn −, /, −, /: (+1,15) → (−1,14) → (+1,13) → (−1,6) → (+1,5) → (−1,4) → (+1,3) → (−1,1) → (+1,0), lớp thắng. Nút "Hiện thế thắng / thua" tô bảng W(n). Có thể thử N = 16: bên đi trước thua nếu bên kia chơi đúng.

### 45. Một nước tối ưu chưa đủ (50 giây)

- Pi: Ở 15, chỉ nước trừ 1 giữ được strategy thắng.
- Pi: Lớp chỉ chắc thắng nếu tiếp tục chơi đúng ở mọi lượt sau.
- Pi: Minimax biết một state thắng hay thua ngay khi ván chưa kết thúc.

Với N = 14, hai action đưa đối phương tới 13 hoặc 7, đều là state thắng của bên nhận lượt. Với N = 16, hai action đưa tới 15 hoặc 8, cũng đều thắng. Vì vậy 14 và 16 là state thua của bên đến lượt khi hai bên chơi tối ưu.

Kết quả tính bằng phần Halving trong verify_examples.py.

## Face-off

### 46. Bốn policy (55 giây)

- Pi: Từ Minimax có hai policy: π_max cho agent và π_min cho đối thủ.
- Pi: Thêm đối thủ π₇ chọn đều, và policy Expectimax π_E tối ưu cho đúng π₇.
- Pi: Bốn policy này đấu chéo trong một bảng hai hàng, hai cột.

CS221, trang 43-48. Trong phát biểu tổng quát, π₇ là một policy bất kỳ đã cố định; trong game ba hộp ta lấy policy chọn đều. Các policy Minimax được xác định tại mọi state.

### 47. Bảng face-off (80 giây)

- Pi: Hàng là policy của agent, cột là policy của đối thủ. Value tính theo góc nhìn agent.
- Pi: Ô đầu: agent chọn B, đối thủ chọn số nhỏ, kết quả 1 bằng Minimax value.
- Pi: Agent vẫn chọn B, đối thủ chuyển sang chọn đều: trung bình của 1 và 3 là 2.
- Pi: π_E vẫn chọn C vì policy của hàng không đổi. Gặp π_min, C chỉ cho −5.
- Pi: Ô cuối: π_E gặp đúng π₇ nên được 5. Bấm vào ô bất kỳ để xem lại.

V(α, β) = Σ_h α(h | s_start)·[β(− | h)·u_{h,−} + β(+ | h)·u_{h,+}], với đối số thứ nhất là policy của agent và đối số thứ hai là policy của đối thủ.

Ô (π_E, π_min) bằng −5. Số 5 chỉ đúng khi đối thủ là π₇. Cách đọc bảng theo CS221, trang 47-56; giảng giải trong Games I 2025 (35:54 đến 46:13) và Game Playing 1 năm 2019 (38:46 đến 50:26).

### 48. Đấu thử 14 ván (45 giây, có thể lướt)

- Pi: Mỗi hàng là một cặp policy, mỗi chấm là một ván.
- Pi: Hai hàng gặp π_min luôn ra cùng một số. Hai hàng gặp π₇ dao động quanh 2 và 5.

Bảng face-off chứa expected utility. Simulation cho trung bình mẫu, nên với ít ván kết quả còn dao động.

### 49. Ba tính chất (75 giây)

- Pi: Giữ đối thủ là π_min thì không policy nào của agent vượt π_max.
- Pi: Giữ agent là π_max thì không đối thủ nào kéo kết quả xuống dưới 1.
- Pi: Giữ đối thủ là π₇ thì policy tối ưu cho π₇ không thể kém π_max.
- Pi: Mỗi tính chất cố định một bên và chỉ thay bên còn lại.

CS221, trang 49-54. Với tính chất ②, nếu μ chọn 1 với xác suất q thì V(π_max, μ) = q·1 + (1 − q)·3 = 3 − 2q ≥ 1. Tính chất ③ đúng theo định nghĩa V(π_E, π₇) = max_π V(π, π₇). Khi đối thủ thật đổi policy, tính chất ③ không còn áp dụng cho cặp policy mới.

### 50. Chuỗi bốn value (40 giây)

- Pi: Tính chất ① nối −5 với 1.
- Pi: Tính chất ② nối 1 với 2.
- Pi: Tính chất ③ nối 2 với 5.
- Pi: Mỗi dấu ≤ cố định một bên và đổi bên kia, theo điều kiện của tính chất tương ứng.

CS221, trang 55-56. Thay đúng bốn cặp policy vào chuỗi mới được −5 ≤ 1 ≤ 2 ≤ 5.

### 51. Vì sao Minimax có lower bound (65 giây)

- Pi: Ở lượt MAX, agent đi tới con có value bằng node hiện tại. Ở lượt MIN, mọi con đều không nhỏ hơn.
- Pi: Đối thủ chọn ngẫu nhiên thì value chỉ giữ nguyên hoặc tăng. Kết quả luôn ít nhất bằng 3.
- Pi: Agent đi sai một nước thì value có thể giảm và lower bound không còn.

Tại terminal state, Minimax value bằng utility, nên Utility(terminal) ≥ V_minmax(s_start). Bất đẳng thức này đúng với từng ván khi agent giữ policy, không chỉ đúng ở mức trung bình, và không cần đối thủ chơi tối ưu.

Vì vậy Minimax value bằng 0 ở root của Tic-Tac-Toe nghĩa là agent bảo đảm ít nhất hòa nếu tiếp tục chơi đúng (CS221, trang 51-52).

### 52. Thế Q (45 giây)

- Pi: Trong ví dụ này O đi trước, X là agent và đang đến lượt.
- Pi: X2 tạo đe dọa, buộc O chặn ở ô 4.
- Pi: X4 cũng tạo đe dọa, buộc O chặn ở ô 2.
- Pi: Nhìn một bước thì hai nước như nhau. Cần nhìn thêm một bước nữa.

Vì O đi trước nên thế Q không phát sinh từ ví dụ X đi trước ở phần Modeling.

### 53. Video: fork ở thế Q (39 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim: sau X2, O chặn ở ô 4 và tạo hai đe dọa cùng lúc, ở ô 0 trên đường chéo 0-4-8 và ở ô 1 trên cột 1-4-7. Đây là một fork. X chỉ chặn được một, nên X2 có Minimax value −1.

Sau X4, O chặn ở ô 2. O2 không tạo fork, và X giữ được hòa với X0, O1. Minimax value của X4 là 0.

### 54. Value các nước ở thế Q (55 giây)

- Pi: Mỗi ô hiện Minimax value của nước đó. X2 có value −1 dù tạo được đe dọa.
- Pi: Khi O chọn đều, Expectimax chọn X4 với value 2/3. Ở thế Q, hai thuật toán cùng chọn X4.

Backup tại node O ngay sau nước X: X0 với O1, O2, O4 cho 0, 0, 0; X1 với O0, O2, O4 cho 0, 0, 0; X2 với O0, O1, O4 cho 1, 1, −1; X4 với O0, O1, O2 cho 1, 1, 0. Ở cây nhỏ này, value của các con trùng nhau dưới hai cách chơi; với cây lớn hơn phải tính riêng.

Thế P ở slide sau cho thấy hai thuật toán chọn khác nhau. Các value được nhóm tính bằng verify_examples.py.

### 55. Thế P (60 giây, có thể lướt)

- Pi: Có sáu action hợp lệ. Theo Minimax, chỉ X0 và X6 giữ được hòa.
- Pi: Expectimax lại chọn X2 và X8 với value 13/15, đúng những nước Minimax cho là thua.

Từ thế P, sau X6 rồi O8 sẽ được thế Q. Cột Minimax giả sử các lượt sau X theo Minimax và O đáp trả bất lợi nhất. Cột Expectimax giả sử X tối ưu expected utility và O chọn đều ở mỗi lượt. Value do code của nhóm tính trên toàn bộ subtree.

Backup Expectimax sau X2: năm phản ứng O0, O1, O4, O6, O8 cho 1, 1, 1, 1, 1/3, trung bình 13/15.

### 56. Đường phản bác X2 (45 giây, có thể lướt)

- Pi: X2 đe dọa thắng ở ô 8.
- Pi: Chỉ một trong năm phản ứng chặn được, đó là O8.
- Pi: Sau O8, O đe dọa hàng dưới nên X phải chặn ở ô 6.
- Pi: O4 tạo hai đe dọa cùng lúc và X chỉ chặn được một. Minimax phải tính tới đường này.

O không nhất thiết đi đường này, nhưng chỉ cần tồn tại một đáp trả ép thua là Minimax value của X2 bằng −1.

Hình dừng ở thế đã có fork, sau X6 rồi O4. Sau O8, nước X tối ưu expected utility (X4 hoặc X6) cho (1 + 1 − 1)/3 = 1/3.

### 57. Expected utility và xác suất thắng (40 giây, có thể lướt)

- Pi: Theo xác suất toàn phần, X2 thắng với xác suất 14/15 và thua với xác suất 1/15.
- Pi: Expected utility là 13/15. X2 đổi worst-case value lấy expected utility cao hơn.

Trong năm phản ứng đầu của O, bốn phản ứng cho X thắng ngay. Phản ứng O8 có xác suất 1/5; sau đó nước X tối ưu expected utility thắng với xác suất 2/3 và thua với xác suất 1/3.

Bảng face-off trên thế P (phá hòa theo ô nhỏ nhất): X theo Minimax được 0 trước O theo Minimax và 3/5 trước O chọn đều; X theo Expectimax được −1 và 13/15. Chuỗi tương ứng là −1 ≤ 0 ≤ 3/5 ≤ 13/15.

### 58. Giới hạn tính toán (55 giây)

- Pi: b là branching factor, m là số ply. Mỗi ply là một action của một player.
- Pi: Với cờ vua, b khoảng 35 và m khoảng 100, nên cây có cỡ 10 mũ 154 node.

Với hai player đi luân phiên, nếu d là số cặp lượt thì m = 2d, nên CS221 viết O(b^{2d}). DFS không cần lưu cả cây: bộ nhớ là O(bm) nếu sinh sẵn các con ở mỗi tầng, hoặc O(m) nếu sinh từng con. CS188 Lecture 7, trang 20; Note 6, trang 5; CS221, trang 69-70.

b^m là cận trên cho cây đều. Tic-Tac-Toe thực tế có 549.946 node vì ván dừng sớm khi có người thắng và b giảm dần. Con số của cờ vua là ước lượng cho cây đều. Tốc độ giả định là 10⁹ node mỗi giây.

## Tổng kết

### 59. So sánh ba phương pháp (55 giây)

- Pi: Ba phương pháp khác nhau ở thông tin đã biết về hai bên.
- Pi: Vì vậy phép tính tại node khác nhau: trung bình, max hoặc min.
- Pi: Mỗi con số chỉ có nghĩa cùng với câu hỏi mà nó trả lời.
- Pi: Cả ba đều đi từ leaf lên root.

Mô hình game xác định các diễn biến hợp lệ; giả định về đối thủ xác định cách đánh giá chúng. Tại mỗi node, ta hoặc theo một policy đã cho, hoặc chọn action tốt nhất, hoặc giả sử đối thủ chọn nước bất lợi nhất.

### 60. Các bước giải (40 giây)

- Pi: Bắt đầu bằng mô hình: state và luật chơi.
- Pi: Value được tính từ terminal state về state hiện tại, theo giả định về đối thủ.
- Pi: Khi cây quá lớn, cần ước lượng value và cắt bớt nhánh.

Khi không duyệt hết được cây, cần evaluation function, depth-limited search và alpha-beta pruning. Các nội dung này thuộc Games 2.

### 61. Câu hỏi kiểm tra (1) (70 giây)

- Pi: Thử trả lời trước khi xem đáp án.
- Pi: Câu 1: lời giải là một policy.
- Pi: Câu 2: Actions chỉ kiểm tra luật.
- Pi: Câu 3 là Game evaluation với agent chọn đều.

Có thể hỏi người nghe trước khi hiện đáp án.

### 62. Câu hỏi kiểm tra (2) (70 giây)

- Pi: Câu 4 về Expectimax, câu 5 về Minimax.
- Pi: Câu 4: thay p = 0,9 vào ba đường V_A, V_B, V_C.
- Pi: Câu 5: tính các node MIN trước, rồi lấy max ở root.

Cây ở câu 5 lấy từ CS188 Lecture 7, trang 18. Các câu còn lại dùng mô hình và ví dụ đã trình bày.

### 63. Tài liệu tham khảo (15 giây)

Slide này để tra cứu sau buổi, không cần đọc. Số trang dẫn theo bản PDF trong thư mục docs/.

### 64. Cảm ơn (15 giây)

Một số câu hỏi có thể gặp.

Expectimax có luôn tốt hơn Minimax không? Chỉ khi mô hình về đối thủ đúng; tính chất ③ chỉ so sánh trong cột π₇.

Minimax có cần đối thủ chơi tối ưu thì lower bound mới đúng không? Không cần, chỉ cần agent giữ π_max.

Vì sao value trong Halving là ±∞? Chỉ để phân biệt thắng và thua; thay bằng ±1 vẫn được.

Game tree và state-space graph khác nhau thế nào? Tree giữ lịch sử, còn graph gộp các state giống nhau.
