# Kịch bản trình bày Games 1 (nhóm 10)

File này được sinh từ slide bằng `node tools/export_script.mjs`. Trong deck, bấm **N** để xem ghi chú của slide hiện tại.

Tổng thời gian khoảng 57 phút; bản rút gọn (phím T) khoảng 49 phút.

## Mở đầu

### 1. Games 1 (30 giây)

00:00 → 01:07 · 1 phút 7 giây · 1 bước

00:01 (nhìn lớp) (mở hai tay về phía lớp) Em chào thầy và các bạn. Em là Võ Nhất Bảo, nhóm 10. [chỉ: tên đề tài và thành viên] Hôm nay nhóm em, gồm em và bạn Phạm Lê Huy Hoàng, trình bày chủ đề Games 1: mô hình hóa trò chơi, Game evaluation, Expectimax và Minimax. (nhìn lớp) Game là một trong những bài toán lâu đời nhất của AI: năm 1997, máy Deep Blue thắng nhà vô địch cờ vua Kasparov; năm 2016, AlphaGo thắng Lee Sedol ở cờ vây. Ý tưởng nền tảng phía sau các hệ thống đó chính là những gì nhóm mình sẽ trình bày hôm nay

### 2. Câu hỏi của buổi trình bày (45 giây)

- Pi: Agent là robot bên trái. Đối thủ đội mũ len, đứng bên phải.
- Pi: Agent chỉ chọn ở lượt của mình, nhưng kết quả còn phụ thuộc các lượt sau.
- Pi: Các lượt đó do đối thủ chọn, nên agent phải tính trước cách đối thủ phản ứng.

01:07 → 01:54 · 47 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

01:07 [→] Trước khi vào nội dung, em muốn đặt ra một câu hỏi cho cả buổi. [chỉ: agent (robot bên trái)] Bên trái là agent; các bạn cứ hiểu agent là mình, người đang cần ra quyết định. [chỉ: đối thủ (đội mũ len)] Bên phải là đối thủ, bạn đội mũ len.

01:21 [→] [chỉ: chuỗi lượt: agent → đối thủ → agent → terminal] Agent chỉ được chọn ở lượt của mình. Sau lượt agent là lượt đối thủ, rồi lại tới agent, cứ thế cho tới khi ván kết thúc. Nếu các bạn đã học MDP thì sẽ thấy điểm khác: trong MDP, môi trường có ngẫu nhiên nhưng không cố tình chơi khó mình; còn trong game, đối thủ có mục tiêu ngược với mình.

01:42 [→] [chỉ: câu hỏi ở giữa] Vậy câu hỏi là: tại một state, agent nên chọn action nào, khi một phần diễn biến tiếp theo lại do đối thủ quyết định? (nhìn lớp) Cả buổi hôm nay xoay quanh đúng câu hỏi này.

### 3. Lộ trình (40 giây)

- Pi: Phần đầu giải thích vì sao có đối thủ thì cần policy thay cho plan.
- Pi: Phần hai mô tả một game bằng sáu thành phần.
- Pi: Phần ba tính value của một cặp policy đã biết.
- Pi: Phần bốn tìm policy tốt nhất khi biết đối thủ chơi theo xác suất nào.
- Pi: Phần năm tìm policy tốt nhất cho worst case.
- Pi: Game ba hộp đi suốt buổi; Tic-Tac-Toe và Halving minh họa thêm.

01:54 → 02:37 · 43 giây · 6 bước (bấm → 6 lần, kể cả lần vào slide)

01:54 [→] Để trả lời câu hỏi đó, nhóm em chia nội dung thành năm phần. [chỉ: phần 1 · Overview] Phần một, Overview: vì sao có đối thủ thì lời giải phải là một policy, chứ không còn là một plan.

02:06 [→] [chỉ: phần 2 · Modeling] Phần hai, Modeling: mô tả một game bằng sáu thành phần.

02:11 [→] [chỉ: phần 3 · Game evaluation] Phần ba, Game evaluation: khi đã biết cả hai bên chơi thế nào, thì tính value ra sao. Ba phần này là phần của em.

02:21 [→] [chỉ: phần 4 · Expectimax] Phần bốn là Expectimax, [→] [chỉ: phần 5 · Minimax] và phần năm là Minimax, hai cách tìm policy tốt nhất, bạn Hoàng sẽ trình bày.

02:29 [→] [chỉ: dòng ví dụ chính] Suốt buổi, tụi em dùng một ví dụ chính là game ba hộp; Tic-Tac-Toe và Halving để minh họa thêm.

## Overview

### 4. Single-agent search (60 giây)

- Pi: Mô hình cho biết start, goal, các action hợp lệ, transition và cost từng bước.
- Pi: Path ít edge nhất chỉ có 2 bước, nhưng tốn 9 + 9 = 18.
- Pi: Path 3 bước chỉ tốn 3. Agent tự chọn mọi bước, nên tìm xong path là đi được ngay.

02:37 → 03:29 · 52 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

02:37 [→] OK, mình bắt đầu từ thứ các bạn đã quen: bài toán search một agent. [chỉ: mô hình search (S, s₀, A, T, G, c)] Một bài toán search cho mình tập state, start state, các action hợp lệ và transition, tập goal, và cost của từng bước. Nhiệm vụ là tìm một path từ start tới goal.

02:54 [→] [chỉ: path qua u: 2 edge, cost 18] Ví dụ trên hình, path đi qua u chỉ có hai bước, nhìn thì ngắn, nhưng tốn chín cộng chín là mười tám.

03:02 [→] [chỉ: path qua a, b: 3 edge, cost 3] Còn path đi qua a và b dài ba bước, nhưng chỉ tốn ba. Ít bước nhất chưa chắc là rẻ nhất. (nhìn lớp) Nhưng điểm em muốn các bạn để ý là: trong search, agent tự chọn mọi bước. Tìm xong path thì cứ thế đi theo, không ai cản cả. Giống như mở bản đồ tìm đường từ nhà tới trường: mình chọn đường, còn con đường thì không tự đổi để chơi khó mình. (mở hai tay về phía lớp) Vậy nếu có người khác chen vào giữa thì sao?

### 5. Plan và policy (60 giây)

- Pi: Agent lập plan X0, O4, X2. Nhưng O4 là nước của đối thủ.
- Pi: Nếu O chọn ô 1 hoặc ô 8, plan không còn dùng được.
- Pi: Policy có sẵn một nước đáp cho mỗi phản ứng của O. Đây là adversarial search.

03:29 → 04:22 · 53 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

03:29 [→] Mình thử với Tic-Tac-Toe. [chỉ: bàn cờ X0] Giả sử X là agent, và X lập sẵn một plan: mình đi ô 0, [chỉ: nước O4 của đối thủ] đối thủ đi ô 4, [chỉ: nước X2] rồi mình đi ô 2. Nghe hợp lý đúng không? [chỉ: nước O4 của đối thủ] Nhưng có một vấn đề: nước O4 đâu phải do mình chọn.

03:47 [→] [chỉ: O đi ô 1 hoặc ô 8] Nếu O đi ô 1, hoặc ô 8, thì plan này hết dùng được. [chỉ: khung Plan] Plan chỉ là một chuỗi nước cố định; nó không nói X phải làm gì khi O đi khác.

03:57 [→] [chỉ: khung Policy] Cái mình cần là một policy: một quy tắc cho biết ở mỗi state mà agent có thể gặp, agent sẽ chọn action nào. (nhìn lớp) O đi ô 4 thì mình đáp thế này, O đi ô 1 thì mình đáp thế kia. Nói cách khác, policy giống một cái cây các phản ứng, chứ không còn là một đường thẳng. Search khi có đối thủ như vậy gọi là adversarial search, tức là search đối kháng.

### 6. Game ba hộp (70 giây)

- Pi: Agent chọn một hộp, đối thủ chọn một trong hai số trong hộp. Số đó là utility của agent.
- Pi: Agent chọn A, đối thủ chọn số nhỏ, nên agent nhận −50.
- Pi: Agent chọn B, đối thủ vẫn chọn số nhỏ, nên agent nhận 1.
- Pi: Nếu đối thủ chọn số lớn, hộp A cho 50. Hộp tốt nhất phụ thuộc vào đối thủ.

04:22 → 06:29 · 2 phút 7 giây · 4 bước (bấm → 4 lần, kể cả lần vào slide)

04:22 [→] OK, giờ mình chơi một trò chơi nhỏ. Trò này lấy từ bài giảng CS221 của Stanford, và nó sẽ đi theo mình suốt buổi hôm nay. [chỉ: ba hộp A, B, C] Có ba hộp A, B, C. Hộp A có hai số, âm 50 và 50; hộp B có 1 và 3; hộp C có âm 5 và 15. (nhìn lớp) Luật chơi như sau: các bạn là agent, các bạn chọn một hộp. Sau đó em, là đối thủ, chọn một số trong hộp đó. Số em chọn là điểm của các bạn, và các bạn muốn điểm càng cao càng tốt.

04:58 (giơ tay lên) Em hỏi nhanh nha. Bạn nào chọn hộp A, giơ tay giúp em. (dừng ~2.2 giây, chờ lớp trả lời) OK, vài bạn. (giơ tay lên) Bạn nào chọn B? (dừng ~2.2 giây, chờ lớp trả lời) (giơ tay lên) Còn hộp C? (dừng ~2.2 giây, chờ lớp trả lời) (mở hai tay về phía lớp) À, đa số chọn C. Có vẻ các bạn không tin em lắm, nhưng cũng chưa tới mức nghĩ em sẽ chơi xấu. Chút nữa mình xem ai đúng.

05:26 Em vẽ trò này lên bảng. [✍ vẽ tam giác hướng lên ở trên cùng (lượt agent)] Trên cùng là lượt của agent, em vẽ một tam giác hướng lên. [✍ vẽ ba nhánh A, B, C] Agent có ba action là A, B, C. [✍ vẽ ba hình tròn (lượt đối thủ)] Đi xuống mỗi nhánh là tới lượt đối thủ, em vẽ hình tròn. [✍ vẽ sáu nhánh và sáu ô kết cục −50, 50, 1, 3, −5, 15] Đối thủ chọn một trong hai số, và cuối cùng là sáu kết cục: âm 50, 50, 1, 3, âm 5, 15. Mỗi đường đi từ trên xuống dưới là một ván có thể xảy ra. (nhìn lớp) Cái hình này gọi là game tree: root là trạng thái bắt đầu, mỗi edge là một action, và mỗi leaf là một kết cục có điểm.

06:02 (nhìn màn chiếu) Giờ mình chơi thử trên slide.

06:05 [→] [chỉ: hộp A] Agent chọn hộp A, đối thủ chọn số nhỏ, agent nhận âm 50.

06:11 [→] [chỉ: hộp B] Ván sau agent chọn B, đối thủ vẫn chọn số nhỏ, agent nhận 1.

06:17 [→] [chỉ: nút “Chọn số lớn”] Nhưng nếu đối thủ đổi tính, chọn số lớn, [chỉ: hộp A] thì hộp A lại cho tới 50. (nhìn lớp) Vậy hộp nào tốt nhất? Câu trả lời là: còn tùy đối thủ chơi kiểu gì.

Bảng sau slide 6

```text
              ▲            agent
           A/ |B \C
           ○   ○    ○      đối thủ
          / \ / \  / \
      [−50][50][1][3][−5][15]   kết cục
```

### 7. Ba giả định về đối thủ (70 giây)

- Pi: Sáu kết quả không đổi. Value của hộp còn phụ thuộc cách đối thủ chọn số.
- Pi: Nếu đối thủ chọn số lớn, hộp A có value 50 và là lựa chọn tốt nhất.
- Pi: Nếu đối thủ chọn mỗi số với xác suất ½, value là 0, 2, 5 và agent chọn C.
- Pi: Nếu đối thủ chọn số nhỏ, value là −50, 1, −5 và agent chọn B.

06:29 → 07:41 · 1 phút 12 giây · 4 bước (bấm → 4 lần, kể cả lần vào slide)

06:29 [→] Mình làm rõ chữ “tùy” này. [chỉ: sáu leaf] Sáu kết quả ở dưới không bao giờ đổi. Cái thay đổi là value của từng hộp, vì nó phụ thuộc đối thủ chọn số thế nào. Có ba giả định, em ghi luôn lên bảng.

06:43 [→] [chỉ: dòng “Số lớn”] Giả định thứ nhất: đối thủ tốt bụng, luôn chọn số lớn. [✍ ghi dòng “lớn: 50 | 3 | 15 → A”] Khi đó A có value 50, B là 3, C là 15. Agent chọn A.

06:55 [→] [chỉ: dòng “Xác suất ½”] Giả định thứ hai: đối thủ tung đồng xu, mỗi số xác suất một nửa. [✍ ghi dòng “đều: 0 | 2 | 5 → C”] Value là trung bình: A bằng 0, B bằng 2, C bằng 5. Agent chọn C. Những bạn vừa chọn C chắc là đang nghĩ theo cách này.

07:10 [→] [chỉ: dòng “Số nhỏ”] Giả định thứ ba: đối thủ chơi xấu, luôn chọn số nhỏ nhất. [✍ ghi dòng “nhỏ: −50 | 1 | −5 → B”] A còn âm 50, B là 1, C là âm 5. Agent chọn B. (nhìn lớp) (mở hai tay về phía lớp) Các bạn thấy không, cùng một cái cây, cùng sáu con số, mà ba giả định cho ra ba đáp án khác nhau. Hộp A có số 50 rất hấp dẫn, nhưng agent không quyết định được việc đi tới số 50 đó. [chỉ lên bảng: ba dòng giả định trên bảng] Ba dòng này chính là ba câu hỏi mà Game evaluation, Expectimax và Minimax sẽ trả lời.

Bảng sau slide 7

```text
              ▲            agent
           A/ |B \C
           ○   ○    ○      đối thủ
          / \ / \  / \
      [−50][50][1][3][−5][15]   kết cục
   lớn:    50    3    15     → A
   đều:     0    2     5     → C
   nhỏ:   −50    1    −5     → B
```

### 8. Game khác search ở đâu (45 giây)

- Pi: Utility nằm ở cuối ván. Muốn tính value ở state hiện tại, cần xét các terminal state có thể tới.
- Pi: Mỗi node có một player chọn action, và cách tính value tùy vào player đó.
- Pi: Bốn hình dạng node này dùng cho mọi cây trong buổi.

07:41 → 08:40 · 58 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

07:41 [→] Từ ví dụ này, mình rút ra hai điểm làm game khác search. [chỉ: ý 1: utility nằm ở terminal state] Thứ nhất, utility nằm ở cuối ván. Đang chơi giữa chừng thì chưa có điểm; phải tới terminal state mới biết thắng, hòa hay thua. Nên một nước nhìn có lợi trước mắt vẫn có thể dẫn tới thua.

07:59 [→] [chỉ: ý 2: mỗi node thuộc về một player] Thứ hai, mỗi node thuộc về một player. Ở node của đối thủ, agent không được chọn, và cách tính value tại node phụ thuộc vào ai đang có lượt.

08:09 [→] [chỉ: bốn hình node] Từ giờ mình thống nhất bốn hình: tam giác hướng lên là lượt agent, gọi là node MAX; tam giác hướng xuống là lượt đối thủ, node MIN; hình tròn là chance node; và hình vuông là terminal state. [chỉ lên bảng: ba hình tròn trên bảng] Trên bảng em đang vẽ hình tròn ở lượt đối thủ, vì mình chưa giả định đối thủ chơi kiểu nào. (nhìn lớp) Tóm lại phần Overview: khi có đối thủ, lời giải là một policy; và muốn biết một nước tốt hay không, mình phải biết, hoặc phải giả định, đối thủ sẽ phản ứng ra sao.

## Modeling

### 9. Loại game đang xét (50 giây)

- Pi: Có hai player, và tổng utility của hai bên luôn bằng 0.
- Pi: Hai bên đi lần lượt, thấy toàn bộ state, không có yếu tố ngẫu nhiên, và cây hữu hạn.
- Pi: Zero-sum vẫn có hòa; khi hòa, cả hai bên nhận 0.

08:40 → 09:27 · 47 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

08:40 [→] Qua phần hai, Modeling. Trước hết mình giới hạn loại game đang xét. [chỉ: hai player, zero-sum] Có hai player là agent và đối thủ. Game là zero-sum: utility của đối thủ luôn bằng âm utility của agent, cộng lại bằng 0.

08:56 [→] [chỉ: turn-taking, fully observable, deterministic, hữu hạn] Hai bên đi lần lượt, cả hai thấy toàn bộ state, biết state và action thì biết state kế tiếp, và mọi nhánh đều kết thúc. (nhìn lớp) Tic-Tac-Toe hay cờ vua là loại này. Poker thì không, vì mình không thấy bài của đối thủ. Cờ cá ngựa cũng không, vì có xúc xắc; game có yếu tố ngẫu nhiên thuộc phần Games 2.

09:16 [→] [chỉ: bảng zero-sum có hòa] Một hiểu lầm hay gặp: zero-sum không có nghĩa là bắt buộc phải có người thắng. Vẫn có hòa, và khi hòa thì cả hai bên cùng nhận 0.

### 10. Sáu thành phần của mô hình (55 giây)

- Pi: Bốn thành phần đầu giống search: start state, action, transition và điều kiện dừng.
- Pi: Utility chấm terminal state theo góc nhìn agent. Thua cũng là terminal state.
- Pi: Player(s) cho biết ai đang chọn. Đối thủ đi vào mô hình qua thành phần này.

09:27 → 10:34 · 1 phút 7 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

09:27 [→] Một game như vậy được mô tả bằng sáu thành phần. [chỉ: bốn thành phần đầu] Bốn thành phần đầu nghe rất quen: s start là state ban đầu; Actions của s là các action hợp lệ; Succ của s, a là state nhận được sau khi làm action a; và IsEnd kiểm tra ván đã kết thúc chưa. Bốn cái này gần như y hệt bài toán search.

09:47 [→] [chỉ: Utility(s)] Thành phần thứ năm là Utility: điểm của terminal state, tính theo góc nhìn agent. Các bạn để ý: trong search, tới goal là tốt. Còn trong game, tới terminal state chưa chắc đã tốt, vì thua cũng là một terminal state.

10:03 [→] [chỉ: Player(s)] Thành phần thứ sáu là Player của s, cho biết tại state này ai đang được chọn. Đối thủ đi vào mô hình chính là qua thành phần này. (nhìn bảng) [chỉ lên bảng: cây ba hộp trên bảng] Thử ráp vào game ba hộp trên bảng: s start là root; Actions ở root là A, B, C; Succ của root với action A là node A; IsEnd đúng ở sáu leaf; Utility là con số ghi ở leaf; còn Player ở root là agent, ở ba node giữa là đối thủ. Sáu thành phần là đủ để mô tả trọn trò chơi này.

### 11. Từ search sang game (45 giây, có thể lướt)

- Pi: Start state và transition vẫn giữ nguyên.
- Pi: Goal test trở thành IsEnd, và terminal state có thể là thua.
- Pi: Không còn cộng cost dọc path; Utility chấm terminal state.
- Pi: Khác biệt lớn nhất là một số bước do đối thủ chọn.

10:34 → 11:05 · 31 giây · 4 bước (bấm → 4 lần, kể cả lần vào slide) · có thể lướt nếu trễ giờ

10:34 [→] Slide này đặt hai mô hình cạnh nhau. [chỉ: start state, transition] Start state và transition vẫn giữ nguyên.

10:41 [→] [chỉ: goal test → IsEnd] Goal test trở thành IsEnd, và terminal state có thể là thua.

10:46 [→] [chỉ: cost → Utility] Không còn cộng cost dọc đường nữa, mà chấm điểm ở terminal state.

10:51 [→] [chỉ: agent chọn mọi bước → Player(s)] Và khác biệt lớn nhất: có những bước do đối thủ chọn. (nhìn lớp) Nên chỉ biết bước nào hợp lệ là chưa đủ. Agent cần thêm một cách đánh giá phản ứng của đối thủ, và đó là việc của ba phần sau.

### 12. Mô hình hóa Tic-Tac-Toe (75 giây)

- Pi: X là agent và đi trước. Các ô tô xanh là Actions(s). Bấm một ô để đi.
- Pi: Rê chuột lên ô trống để xem Succ(s, a): đặt quân rồi đổi lượt.
- Pi: X đã thắng dù còn ô trống. Phải kiểm tra IsEnd trước khi sinh action.

11:05 → 11:57 · 52 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

11:05 [→] Áp dụng vào Tic-Tac-Toe. [chỉ: bàn cờ] State gồm bàn cờ ba nhân ba và player đến lượt. Start state là bàn trống, X đến lượt. Ở đây em chọn X làm agent, đi trước. [chỉ: dòng Actions(s)] Actions của s là các ô còn trống, ở đây là cả chín ô.

11:23 [→] [chỉ: bàn cờ] Sau khi X đi ô 0 và O đi ô 4, [chỉ: dòng Succ(s, a)] Succ của s, a nghĩa là đặt quân của người đang tới lượt vào ô a, rồi đổi lượt. Bây giờ lại tới X, và còn bảy ô hợp lệ.

11:35 [→] [chỉ: bàn cờ] Còn đây là một tình huống cần cẩn thận. X đã có ba quân ở hàng trên cùng, X thắng rồi, [chỉ: dòng IsEnd(s)] dù bàn vẫn còn ô trống. Nếu thuật toán cứ sinh action từ các ô trống là sai. Phải kiểm tra IsEnd trước. [chỉ: dòng Utility(s)] Utility ở đây là cộng 1 nếu X thắng, 0 nếu hòa, và trừ 1 nếu O thắng.

### 13. Hai điều cần kiểm tra (45 giây)

- Pi: Cùng một bàn cờ, X đến lượt và O đến lượt là hai state khác nhau.
- Pi: Cả năm ô trống đều hợp lệ, nhưng bốn ô dẫn tới thua ngay.

11:57 → 12:44 · 47 giây · 2 bước (bấm → 2 lần, kể cả lần vào slide)

11:57 [→] Khi mô hình hóa, có hai điều em muốn nhấn mạnh. [chỉ: ý 1: state phải đủ để áp dụng luật] Thứ nhất, state phải đủ thông tin để áp dụng luật. Cùng một bàn cờ, nhưng X tới lượt và O tới lượt là hai state khác nhau, vì người đi tiếp khác nhau. Ở Tic-Tac-Toe thì đếm số quân là suy ra được ai đến lượt, nhưng nhiều game khác không suy ra được, nên ghi rõ lượt đi vào state cho chắc.

12:20 [→] [chỉ: bàn cờ X đến lượt] Thứ hai, các bạn nhìn bàn này: X đến lượt, O đang có hai quân ở hàng trên. X nên đi ô nào? (dừng ~1.8 giây, chờ lớp trả lời) [chỉ: ô 2] Đúng rồi, ô 2, phải chặn. [chỉ: bàn cờ X đến lượt] Cả năm ô trống đều hợp lệ, nhưng bốn ô tô đỏ dẫn tới thua ngay. [chỉ: ý 2: action hợp lệ chưa chắc là action tốt] Nên Actions của s chỉ kiểm tra luật thôi; còn nước nào tốt là việc của thuật toán search.

### 14. Game tree và state-space graph (60 giây)

- Pi: X0, O4, X2 và X2, O4, X0 là hai lịch sử khác nhau. Trên game tree chúng là hai node.
- Pi: Bàn cờ và lượt giống hệt nhau, nên trong state-space graph chúng là một node.

12:44 → 13:25 · 41 giây · 2 bước (bấm → 2 lần, kể cả lần vào slide)

12:44 [→] Tiếp theo là hai cách vẽ một game. [chỉ: lịch sử 1: X0, O4, X2] Lịch sử thứ nhất: X đi 0, O đi 4, X đi 2. [chỉ: lịch sử 2: X2, O4, X0] Lịch sử thứ hai: X đi 2, O đi 4, X đi 0. Hai thứ tự khác nhau, nhưng bàn cờ cuối cùng giống hệt nhau, và đều tới lượt O. [chỉ: game tree: hai node] Trên game tree, mỗi node là một state trong một lịch sử chơi, nên đây là hai node khác nhau.

13:08 [→] [chỉ: state chung (một node)] Còn trên state-space graph, mỗi state chỉ là một node, nên hai đường này gặp nhau ở cùng một node. (nhìn lớp) Ý nghĩa là gì? Từ state chung đó, phần còn lại của ván giống hệt nhau. Tính value một lần là dùng lại được cho cả hai.

### 15. So sánh tree và graph (45 giây, có thể lướt)

- Pi: Game tree giữ lại lịch sử, còn state-space graph gộp các state giống nhau.
- Pi: Vì vậy trên tree, cùng một state có thể bị tính lại nhiều lần.

13:25 → 14:02 · 37 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide) · có thể lướt nếu trễ giờ

13:25 [→] Tóm lại sự khác nhau. [chỉ: một node · hai lịch sử] Game tree giữ lại lịch sử, nên hai lịch sử là hai node.

13:32 [→] [chỉ: số parent · chu trình] Mỗi node chỉ có đúng một parent, và không có chu trình.

13:36 [→] [chỉ: khi tính value] Hệ quả là trên tree, cùng một state có thể bị tính đi tính lại, còn trên graph thì lưu lại và dùng lại được. (nhìn lớp) Trong bài này, các thuật toán vẫn trình bày trên tree, vì nhìn từng lựa chọn và phản ứng sẽ rõ hơn.

13:51 (slide 15 vẫn đang chiếu) Trước khi qua slide sau, em đố các bạn: bàn Tic-Tac-Toe chỉ có chín ô, vậy game tree đầy đủ từ bàn trống có khoảng bao nhiêu node? (dừng ~2.5 giây, chờ lớp trả lời)

### 16. 549.946 node, 5.478 state (50 giây)

- Pi: Bàn cờ chỉ có 9 ô nhưng game tree có gần 550 nghìn node.
- Pi: Số state khác nhau chỉ hơn 5 nghìn, nên rất nhiều node lặp lại cùng một state.
- Pi: Root màu xám: chơi tối ưu thì hòa. Có thể kéo để xoay cây.

14:02 → 14:52 · 50 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

14:02 [→] [chỉ: 549.946 node] Câu trả lời là 549.946 node, gần năm trăm năm mươi nghìn. [chỉ: 5.478 state] Trong khi số state khác nhau, tính cả lượt đi, chỉ có 5.478.

14:14 [→] [chỉ: đoạn giải thích] Tức là game tree lớn gấp khoảng một trăm lần số state, vì rất nhiều node lặp lại cùng một state, đúng như ví dụ vừa rồi. Hai con số này nhóm em tự đếm bằng code.

14:25 [→] [chỉ: root màu xám] Thêm một chi tiết: root có màu xám, nghĩa là nếu cả hai bên chơi tối ưu thì Tic-Tac-Toe luôn hòa. Bạn nào từng chơi chắc cũng thấy vậy. (nhìn lớp) Còn với cờ vua, theo ước tính nổi tiếng của Shannon, số ván cờ khác nhau, tức là số đường đi từ root tới leaf, vào cỡ mười mũ một trăm hai mươi. Không máy nào duyệt hết được; đó là lý do Games 2 cần tới evaluation function và alpha-beta pruning.

### 17. Policy (55 giây)

- Pi: Policy quy định cách chơi ở mọi state thuộc lượt mình, kể cả state chưa gặp.
- Pi: Deterministic policy chọn đúng một action, tức gán xác suất 1 cho action đó.
- Pi: Stochastic policy gán xác suất cho từng action. Từ đây π là policy của agent, μ của đối thủ.

14:52 → 15:49 · 57 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

14:52 [→] Quay lại khái niệm policy, giờ mình nói chính xác hơn. [chỉ: root với π(root) = A] Policy của một player cho biết tại mỗi state thuộc lượt của player đó, player chọn action nào, kể cả những state chưa từng gặp.

15:05 [→] [chỉ: deterministic policy] Loại đơn giản nhất là deterministic policy: mỗi state chọn đúng một action. [chỉ: edge A, xác suất 1] Ví dụ agent luôn chọn hộp A. Viết dưới dạng xác suất thì A có xác suất 1, B và C xác suất 0.

15:19 [→] [chỉ: stochastic policy] Tổng quát hơn là stochastic policy: gán cho mỗi action một xác suất, các xác suất không âm và cộng lại bằng 1. [chỉ: các xác suất ½] Ví dụ đối thủ chọn mỗi số với xác suất một nửa. (nhìn lớp) Tại sao lại cần policy ngẫu nhiên? Các bạn nghĩ tới oẳn tù tì: nếu mình luôn ra kéo, đối thủ sẽ luôn ra búa. Có những lúc chơi ngẫu nhiên mới là cách chơi tốt. Từ giờ em dùng π cho policy của agent, và μ cho policy của đối thủ.

### 18. Utility và value (60 giây)

- Pi: Utility chỉ có ở terminal state.
- Pi: Value của một cặp policy là expected utility khi hai bên chơi đúng theo policy đó.
- Pi: Giữ μ cố định và cho agent tối ưu, ta được value tối ưu trước μ.
- Pi: Không giả định μ, agent tối đa value trong worst case. Ba phần sau tính từng value.

15:49 → 16:58 · 1 phút 10 giây · 4 bước (bấm → 4 lần, kể cả lần vào slide)

15:49 [→] Có policy rồi, mình phân biệt hai chữ hay bị dùng lẫn: utility và value. [chỉ: dòng U(s)] Utility chỉ có ở terminal state; nó chấm điểm một kết cục đã xảy ra, thắng cộng 1, thua trừ 1. [✍ ghi “U(s): điểm của kết cục (terminal)”] Em ghi lên bảng: U của s là điểm của kết cục.

16:06 [→] [chỉ: dòng V^{π,μ}(s)] Còn value thì đánh giá mọi state, kể cả state đang ở giữa ván. Value của cặp policy π, μ là expected utility, tức là utility trung bình nếu hai bên cứ chơi đúng theo hai policy đó tới hết ván. [✍ ghi “V(s): trung bình từ s, theo π và μ”] V của s là trung bình tính từ s, theo π và μ.

16:24 [→] [chỉ: dòng V^{*,μ}(s)] Nếu giữ μ của đối thủ cố định, rồi cho agent chọn policy tốt nhất, mình được value tối ưu trước μ.

16:32 [→] [chỉ: dòng V_mm(s)] Còn nếu không giả định gì về μ, agent tối đa value trong trường hợp xấu nhất. [chỉ: dòng tổng kết] Ba dòng cuối lần lượt là Game evaluation, Expectimax và Minimax. Hôm nay em trình bày dòng thứ nhất. (nhìn lớp) Một cách dễ nhớ: utility giống điểm thi cuối kỳ, có khi thi xong mới biết. Còn value giống điểm mình kỳ vọng khi đang học giữa kỳ, và nó phụ thuộc cả việc mình học thế nào lẫn đề ra thế nào.

Bảng sau slide 18

```text
   (cây + ba dòng giữ nguyên)
   U(s): điểm của kết cục (terminal)
   V(s): trung bình từ s, theo π và μ
```

### 19. Cùng leaf, ba value (45 giây)

- Pi: Agent cố định chọn A, nên root bằng trung bình của −50 và 50, tức 0.
- Pi: Agent được chọn khi đối thủ chọn đều: max của 0, 2, 5 là 5.
- Pi: Đối thủ chọn số bất lợi nhất: max của −50, 1, −5 là 1.

16:58 → 17:46 · 48 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

16:58 [→] Nhìn lại game ba hộp: cùng sáu leaf, nhưng ba câu hỏi cho ba value khác nhau ở root. [chỉ: cây Game evaluation (value 0)] Game evaluation: agent cố định chọn A, đối thủ chọn đều, root là trung bình của âm 50 và 50, tức là 0.

17:14 [→] [chỉ: cây Expectimax (value 5)] Expectimax: đối thủ vẫn chọn đều, nhưng agent được tự chọn, nên lấy max của 0, 2, 5, được 5.

17:23 [→] [chỉ: cây Minimax (value 1)] Minimax: đối thủ chọn số bất lợi nhất, max của âm 50, 1, âm 5 là 1. (nhìn lớp) Ba con số 0, 5, 1 chỉ có nghĩa khi đi kèm giả định của nó. Đó cũng là kết thúc phần Modeling: mình đã có sáu thành phần, có policy, và phân biệt được utility với value. Bây giờ mình đi vào con số đầu tiên.

## Game evaluation

### 20. Game evaluation (50 giây)

- Pi: Agent chơi theo π, đối thủ chơi theo μ, và cả hai đã cố định.
- Pi: Evaluation ở đây nghĩa là đo. Thuật toán chưa tìm policy mới.
- Pi: Kết quả là trung bình theo xác suất; một ván thật có thể ra số khác.

17:46 → 18:42 · 56 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

17:46 [→] Phần ba: Game evaluation. [chỉ: agent cầm π] Agent chơi theo π, [chỉ: đối thủ cầm μ] đối thủ chơi theo μ, và cả hai policy đều được cho trước. [chỉ: V = ?] Câu hỏi duy nhất là: V bằng bao nhiêu? [chỉ: V^{π,μ}(s) = E[U(s_T) | s, π, μ]] Viết ra thì V của s là expected utility của terminal state, khi xuất phát từ s và hai bên chơi theo π và μ.

18:07 [→] [chỉ: ý 1: hai policy cố định] Hai policy này cố định trong suốt phép tính. Chữ evaluation ở đây nghĩa là đo: mình chỉ đo xem cặp cách chơi này cho kết quả bao nhiêu; thuật toán không đi tìm policy mới.

18:19 [→] [chỉ: ý 2, 3: expected utility] Và kết quả là expected utility, tức là trung bình có trọng số theo xác suất. Một ván cụ thể ngoài đời có thể ra số khác. (nhìn lớp) Các bạn có thể thắc mắc: ngoài đời làm sao biết hết policy của đối thủ? Thường là không biết. Nhưng Game evaluation là viên gạch đầu tiên: muốn so sánh hay tối ưu thì trước hết phải đo được.

### 21. Recurrence của Game evaluation (60 giây)

- Pi: Tại terminal state, value bằng utility. Tại node khác, lấy trung bình value các con.
- Pi: Hai con có value v₁, v₂ và xác suất q, 1 − q thì value là q·v₁ + (1 − q)·v₂.
- Pi: Lượt agent và lượt đối thủ tính giống nhau, chỉ khác bảng xác suất.

18:42 → 20:18 · 1 phút 36 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

18:42 [→] Vậy tính V thế nào? Mình định nghĩa một recurrence, tức là một công thức đệ quy. [chỉ: trường hợp terminal: Utility(s)] Trường hợp cơ sở: nếu s là terminal state thì value chính là utility. [chỉ: hai dòng tổng theo π và μ] Còn nếu chưa kết thúc, mình lấy tổng theo các action: xác suất chọn action đó, nhân với value của state con. Lượt agent thì xác suất lấy từ π, lượt đối thủ thì lấy từ μ. [🧽 xóa bảng: vùng giữa, vùng dưới] [✍ ghi recurrence: V(s) = U(s) nếu IsEnd(s); V(s) = Σ P(a|s)·V(Succ(s,a)); P = π hoặc μ] Em viết gọn lên bảng: V của s bằng U của s nếu s là terminal; còn không thì V của s bằng tổng theo a, xác suất của a nhân V của Succ s a.

19:19 [→] [chỉ: ví dụ hai con v₁, v₂] Ví dụ một node có hai con, value là v₁ và v₂, được chọn với xác suất q và 1 trừ q. Value của node là q nhân v₁, cộng 1 trừ q nhân v₂. Các bạn để ý: phải dùng value của cả subtree con, không phải utility, vì một action chưa chắc đã kết thúc ván.

19:39 [→] [chỉ: không có max hay min] Và công thức này không có max, cũng không có min. Lượt agent hay lượt đối thủ đều tính giống nhau, chỉ khác bảng xác suất. Thật ra đây chính là kỳ vọng mà mình đã học trong xác suất thống kê, chỉ là tính đệ quy từ leaf đi lên. (nhìn bảng) Mình tính thử trên cây ở bảng. [✍ ghi “A: ½·(−50) + ½·50 = 0”, điền 0 vào node A] Hộp A: một nửa nhân âm 50, cộng một nửa nhân 50, bằng 0. [✍ điền 2 vào node B] Hộp B: trung bình của 1 và 3 là 2. [✍ điền 5 vào node C] Hộp C: trung bình của âm 5 và 15 là 5. [✍ tô đậm nhánh A, ghi “root = 1·0 + 0·2 + 0·5 = 0” và “= 0” cạnh root] Còn root: agent luôn chọn A, nên bằng 1 nhân 0, cộng 0 nhân 2, cộng 0 nhân 5, bằng 0.

Bảng sau slide 21

▲ = 0 agent A// |B \C (0) (2) (5) đối thủ / \ / \ / \ [−50][50][1][3][−5][15] kết cục V(s) = U(s) nếu IsEnd(s) V(s) = Σₐ P(a|s) · V(Succ(s, a)) P = π (lượt agent), μ (lượt đối thủ) A: ½·(−50) + ½·50 = 0 root = 1·0 + 0·2 + 0·5 = 0(nhánh A tô đậm màu xanh: π chọn A với xác suất 1)

### 22. Video: Game evaluation trên ba hộp (36 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

20:18 → 21:02 · 44 giây · 1 bước (bấm → 1 lần, kể cả lần vào slide)

20:18 [→] [video tự chạy, nói theo] Đây là video nhóm em làm bằng thư viện manim, chạy lại đúng phép tính đó. ⏱ giây 1.8 của video Hai policy đã biết: agent luôn chọn A, đối thủ chọn đều. ⏱ giây 7.6 của video Đầu tiên, mỗi hộp lấy trung bình hai leaf, với trọng số theo μ, được 0, 2 và 5. ⏱ giây 17 của video Sau đó root lấy trung bình theo π. Chỉ hộp A có trọng số 1, nên root bằng 0. ⏱ giây 21.1 của video C có tới 5, cao hơn hẳn, nhưng Game evaluation vẫn trả 0, vì policy đang được đánh giá là chọn A. ⏱ giây 25.2 của video Giờ đổi policy của agent thành chọn đều ba hộp. ⏱ giây 28.6 của video Root thành 0 cộng 2 cộng 5, chia 3, bằng 7/3. Đổi policy thì value đổi theo.

### 23. Thử đổi policy (60 giây)

- Pi: Agent luôn chọn A, đối thủ chọn đều, nên root bằng 0. Độ dày edge thể hiện xác suất.
- Pi: Agent chọn đều ba hộp thì root bằng (0 + 2 + 5)/3 = 7/3. Kéo thanh trượt để đổi μ.

21:02 → 21:55 · 53 giây · 2 bước (bấm → 2 lần, kể cả lần vào slide)

21:02 [→] Slide này là phiên bản tương tác của cây vừa rồi. [chỉ: cây tương tác] Agent luôn chọn A, đối thủ chọn đều, root bằng 0. Độ dày của edge thể hiện xác suất. (nhìn lớp) Em hỏi các bạn: nếu agent chọn đều cả ba hộp thì root bằng bao nhiêu? (dừng ~2.5 giây, chờ lớp trả lời)

21:21 [→] [chỉ: dòng tính root] Đúng rồi: 0 cộng 2 cộng 5, chia 3, bằng bảy phần ba. [✍ ghi “(π đều: 7/3)” cạnh root] Em ghi thêm lên bảng: π chọn đều thì root bằng bảy phần ba. [chỉ: thanh trượt q] Giờ em kéo thanh trượt này. q là xác suất đối thủ chọn số nhỏ. [kéo thanh trượt q lên gần 1] Kéo q lên gần 1, đối thủ gần như luôn chọn số nhỏ, value của cả ba hộp đều giảm, [chỉ: root] root xuống âm; khi q bằng 1 thì root bằng âm 18. [chỉ: thanh trượt q] [kéo q về 0] Kéo q về 0 thì ngược lại, root tăng lên. [thả q về 0,5] (nhìn lớp) Mỗi lần đổi μ, mọi node được tính lại bằng đúng một kiểu tổng có trọng số.

Bảng sau slide 23

```text
              ▲ = 0  (π đều: 7/3)
   … phần còn lại giữ nguyên
```

### 24. Recurrence và simulation (60 giây)

- Pi: Simulation cho hai policy chơi nhiều ván rồi lấy trung bình utility.
- Pi: Mỗi ván chọn A chỉ ra −50 hoặc 50, nên trung bình của vài ván dao động mạnh.
- Pi: Trung bình mẫu dao động quanh 0 và hội tụ về 0 khi số ván tăng.

21:55 → 22:57 · 1 phút 2 giây · 3 bước (bấm → 3 lần, kể cả lần vào slide)

21:55 [→] Có một cách khác để ra con số này, mà không cần công thức: cứ chơi thử. [chỉ: bảng simulation] Đây là simulation: agent luôn chọn A, đối thủ chọn đều, cho hai bên chơi nhiều ván rồi lấy trung bình utility.

22:09 [→] [chỉ: kết quả từng ván] Chơi mười ván đầu: mỗi ván chỉ ra âm 50 hoặc 50, nên trung bình nhảy lung tung. [chỉ: trung bình mẫu] Mới mười ván thì trung bình có thể lệch khỏi 0 khá xa.

22:19 [→] [chỉ: đồ thị trung bình theo số ván] Chơi tiếp lên một nghìn ván, đường trung bình dao động quanh 0 và dần dần hội tụ về 0. [🧽 xóa bảng: vùng dưới] [✍ ghi “V̂ₙ = (1/n)·Σ U(ván i) → 0”] Công thức là V mũ n bằng 1 trên n, nhân tổng utility của n ván. Đây là ước lượng Monte Carlo. (nhìn lớp) Vậy recurrence cho kết quả chính xác, nhưng phải duyệt cả cây, mà cây có thể rất lớn. Simulation chỉ cho ước lượng, nhưng dễ làm, và chơi càng nhiều ván thì ước lượng càng sát. Vậy sao không luôn dùng simulation? Vì ở các phần sau, công thức có thêm max và min, và lấy trung bình mẫu thì không ước lượng max dễ như ước lượng một kỳ vọng.

Bảng sau slide 24

```text
   (xóa hai dòng tính ở dưới, ghi:)
   V̂ₙ = (1/n) · Σ U(ván i)
   n lớn  ⇒  V̂ₙ → 0 (= V)
```

### 25. Game evaluation dùng để làm gì (45 giây, có thể lướt)

- Pi: Muốn biết một policy tốt đến đâu trước từng đối thủ, ta dùng Game evaluation.
- Pi: Trong MDP, bước này có tên là policy evaluation.
- Pi: Evaluation function là một khái niệm khác: hàm ước lượng value, thuộc Games 2.
- Pi: Bảng face-off ở phần sau dùng lại phép tính này.

22:57 → 23:58 · 1 phút 1 giây · 4 bước (bấm → 4 lần, kể cả lần vào slide) · có thể lướt nếu trễ giờ

22:57 [→] Cuối cùng, Game evaluation dùng để làm gì? [chỉ: so sánh policy] Thứ nhất, để so sánh policy: giữ policy của agent rồi đổi đối thủ, hoặc giữ đối thủ rồi đổi agent, xem value thay đổi ra sao.

23:11 [→] [chỉ: policy evaluation] Thứ hai, nếu các bạn đã học MDP, thì bước này chính là policy evaluation: cho trước policy, tính value.

23:20 [→] [chỉ: evaluation function] Và một lưu ý: Game evaluation khác evaluation function. Evaluation function là hàm ước lượng value khi chưa search tới terminal state; phần đó thuộc Games 2 của nhóm 11.

23:33 [→] [chỉ: dòng face-off] Bảng face-off ở phần Minimax sẽ dùng lại đúng phép tính này. (nhìn lớp) (mở hai tay về phía lớp) Tóm lại phần của em: có đối thủ thì mình cần policy chứ không phải plan; một game được mô tả bằng sáu thành phần; và khi biết cả hai policy, value được tính bằng trung bình có trọng số, đi từ leaf lên root. Nhưng agent đâu chỉ muốn đo; agent muốn chọn policy tốt nhất. Đó là Expectimax.

23:58 [→ sang slide 26 · Expectimax] Em xin mời bạn Hoàng trình bày tiếp. Em cảm ơn thầy và các bạn.

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

## Minimax

### 34. Minimax (50 giây)

- Pi: Trong game zero-sum, đối thủ tăng utility của mình nghĩa là giảm utility của agent.
- Pi: Vì vậy ở lượt đối thủ, ta giả sử họ chọn nước làm agent thiệt nhất và lấy min.
- Pi: Minimax không cần ước lượng xác suất nào.

CS221, trang 37-42. Tổng utility của hai bên bằng 0, nên đối thủ tối đa utility của mình cũng chính là tối thiểu utility của agent.

### 35. Recurrence của Minimax (55 giây)

- Pi: So với Expectimax, chỉ dòng thứ ba thay đổi: trung bình có trọng số được thay bằng min.
- Pi: Lấy argmax ta được policy của agent, lấy argmin ta được policy của đối thủ.
- Pi: Hai policy này xuất hiện lại trong bảng face-off.

CS221, trang 41-44. Value tính từ leaf lên root. Ở lượt agent, chọn action dẫn tới con có value lớn nhất; ở lượt đối thủ, giả sử đối thủ chọn con có value nhỏ nhất.

### 36. Video: Minimax trên ba hộp (29 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim: các node hộp đổi thành MIN, nên A, B, C có value −50, 1, −5. Root MAX lấy max(−50, 1, −5) = 1 và agent chọn B. Dù đối thủ chọn 1 hay 3, agent nhận ít nhất 1. Hộp A có leaf 50 nhưng agent không thể bảo đảm đi tới đó (CS221, trang 39-40).

### 37. Ba phương pháp, một cây (60 giây)

- Pi: Game evaluation: cả hai policy đã biết, mọi tầng lấy trung bình. Root bằng 0.
- Pi: Expectimax: root đổi thành max. Root bằng 5 và agent chọn C.
- Pi: Minimax: tầng đối thủ đổi thành min. Root bằng 1 và agent chọn B.

Game evaluation đánh giá một cặp policy, Expectimax tối đa expected utility trước một policy đối thủ đã biết, còn Minimax tối đa worst-case value. Mỗi con số 0, 5, 1 chỉ có nghĩa cùng với giả định của nó (CS221, trang 25-43).

### 38. Video: cây nhiều tầng (37 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim trên cây MAX, MIN, MAX. Hai node MAX trong A trả max(−100, 10) = 10 và max(8, 20) = 20; A trả min(10, 20) = 10; B trả min(5, 6) = 5; root trả max(10, 5) = 10 và chọn A.

Leaf −100 không quyết định value của A, vì tới node MAX đó agent sẽ chọn 10. Đối thủ chỉ được chọn ở lượt MIN. Ví dụ do nhóm dựng từ recurrence.

### 39. Pseudocode (50 giây)

- Pi: Hai hàm giống nhau gần như từng dòng.
- Pi: Cả hai dừng ở terminal state, gọi đệ quy xuống các con và lấy max ở lượt agent.
- Pi: Dòng cuối khác nhau: Expectimax cần xác suất của đối thủ, Minimax thì không.

pi_opp(s, a) là xác suất đối thủ chọn a tại s theo policy đã biết. max chỉ trả về value; muốn biết nước đi phải lưu thêm action tương ứng. CS188 Note 6, trang 5; Lecture 7, trang 16-17; Note 7, trang 1-2.

### 40. Chạy từng bước (75 giây)

- Pi: Mỗi lần bấm Bước tiếp là một lời gọi value hoặc một lần trả kết quả.
- Pi: Node chỉ có value khi mọi con đã trả về. Đây là postorder DFS, hay backward induction.
- Pi: Đổi tầng đối thủ sang trung bình: cùng các leaf, Expectimax chọn C thay vì B.

Chiều đi xuống thử các action hợp lệ và sinh state kế tiếp. Chiều đi lên nhận value của các con rồi lấy max, min hoặc trung bình. Việc thử một nhánh trong lúc search chưa có nghĩa agent sẽ chơi nhánh đó.

Backward induction là truyền value từ con lên parent, khác với search ngược từ goal. Nút "Đổi leaf ngẫu nhiên" tạo cây mới để người nghe đoán trước kết quả.

### 41. Halving: luật chơi (50 giây)

- Pi: Mỗi lượt trừ 1 hoặc chia đôi. Bên nhận được số 0 thì thắng.
- Pi: Value luôn tính theo góc nhìn của lớp, kể cả khi máy đang chọn.
- Pi: Ở N = 1, nước nào cũng đưa số 0 cho máy, nên lớp thua.

CS221, trang 19 và 45. Demo dùng game.py của CS221 (bản lưu trữ cs221.1196). Giá trị vô hạn chỉ dùng để phân biệt thắng và thua; thay bằng +1 và −1 thì các nước tối ưu không đổi.

### 42. Từ Minimax sang W(n) (60 giây)

- Pi: Chạy Minimax với N = 3. Leaf (Máy, 0) có utility −∞, leaf (Lớp, 0) có +∞.
- Pi: (Lớp, 1) = −∞, (Máy, 2) = −∞, (Máy, 1) = +∞. Root lấy max được +∞, nên lớp chia đôi.
- Pi: Lập bảng cho cả hai trường hợp: lớp đến lượt hoặc máy đến lượt. Hai cột luôn ngược dấu.
- Pi: Vì vậy chỉ cần một cột W(n), tính theo góc nhìn bên đến lượt.
- Pi: max của lớp và min của máy là cùng một quy tắc. Video sau dùng quy tắc này để tô bảng tới 16.

Cây dùng đúng recurrence của Minimax, với state và utility như slide trước; value tính theo góc nhìn lớp. Tại (Lớp, 1), cả − và / đều đưa máy tới 0, nên value là −∞. Tại (Máy, 2), cả hai nước đều đưa lớp tới 1, nên min là −∞. Tại (Máy, 1), cả hai nước đều đưa lớp tới 0, nên value là +∞. Root lấy max(−∞, +∞) = +∞ và chọn /. Hai nước dẫn tới cùng một state được vẽ chung một edge.

Hai ô không có trong cây: (Lớp, 2) = max(+∞, +∞) = +∞ vì cả hai nước đều tới (Máy, 1); (Máy, 3) = min(V(Lớp, 2), V(Lớp, 1)) = min(+∞, −∞) = −∞. Luật chơi giống nhau cho hai bên, nên V(Máy, n) = −V(Lớp, n) và chỉ cần lưu một số cho mỗi n. Đặt W(n) = 1 khi bên đến lượt ở n thắng. Nước a của mình thắng khi đối phương nhận state có W = 0, tức 1 − W = 1; có một nước như vậy là đủ, nên lấy max. Video sau viết thành W(n) = max{1 − W(n − 1), 1 − W(⌊n/2⌋)}.

### 43. Video: state thắng và state thua (64 giây)

*Video manim (3b1b/manim), nói theo phụ đề.*

Video manim: tô bảng 0 tới 16 trước, chỉ dùng quy tắc "bên đến lượt thắng khi có một nước đẩy đối phương vào state thua". W(0) = 1 vì bên đến lượt ở 0 đã nhận số 0. Các state thua là 1, 4, 6, 10, 14, 16.

Sau khi tô xong mới viết quy tắc thành công thức: W(n) = max{1 − W(n − 1), 1 − W(⌊n/2⌋)}, với 1 − W là đổi sang góc nhìn của mình. Cuối video tô đậm nước 15 → 14: để máy nhận 14 thì lớp có strategy thắng, còn để máy nhận 7 thì máy có strategy thắng. Bảng được kiểm bằng verify_examples.py.

### 44. Lớp đấu với Minimax (180 giây, có thể lướt)

- Pi: Cả lớp bỏ phiếu − hoặc ÷2 ở mỗi lượt. Máy in value theo góc nhìn của lớp.

Chơi một ván. Sau mỗi nước của máy, đọc value: +∞ nghĩa là lớp vẫn có strategy thắng, −∞ nghĩa là máy có strategy thắng. Nếu hết giờ, dừng sau một lượt của máy và dùng value vừa in để kết luận.

Chuỗi dự phòng khi lớp chọn −, /, −, /: (+1,15) → (−1,14) → (+1,13) → (−1,6) → (+1,5) → (−1,4) → (+1,3) → (−1,1) → (+1,0), lớp thắng. Nút "Hiện thế thắng / thua" tô bảng W(n). Có thể thử N = 16: bên đi trước thua nếu bên kia chơi đúng.

### 45. Một nước tối ưu chưa đủ (50 giây)

- Pi: Ở 15, chỉ nước trừ 1 giữ được strategy thắng.
- Pi: Lượt nào lớp cũng phải đưa máy vào state thua. Để máy nhận 12 là trao cho máy một state thắng.
- Pi: Minimax biết một state thắng hay thua ngay khi ván chưa kết thúc.

Quy tắc giữ strategy thắng: ở mỗi lượt, chọn nước đưa đối phương vào một ô đỏ. Từ 13, nước / cho máy nhận 6 (ô đỏ); nước − cho máy nhận 12 (ô xanh). Tại 12 máy có hai nước: − đưa lớp tới 11 (lớp thắng), / đưa lớp tới 6 (lớp thua), nên máy chọn / và giữ strategy thắng.

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

- Pi: Giữ đối thủ là π_min thì mọi hộp chỉ còn số nhỏ. Không policy nào của agent vượt π_max.
- Pi: Giữ agent là π_max thì không đối thủ nào kéo kết quả xuống dưới 1.
- Pi: Giữ đối thủ là π₇ thì policy tối ưu cho π₇ không thể kém π_max.
- Pi: Gộp ① và ②: một mình agent đổi thì không lợi hơn, một mình đối thủ đổi thì agent không thiệt hơn.

CS221, trang 49-54. Với tính chất ①, khi đối thủ là π_min thì hộp A, B, C có value −50, 1, −5. Một policy bất kỳ của agent chọn A, B, C với xác suất a, b, c (a + b + c = 1), nên value là −50a + b − 5c ≤ 1. Với tính chất ②, nếu μ chọn 1 với xác suất q thì V(π_max, μ) = q·1 + (1 − q)·3 = 3 − 2q ≥ 1, dấu bằng khi q = 1. Tính chất ③ đúng theo định nghĩa V(π_E, π₇) = max_π V(π, π₇). Khi đối thủ thật đổi policy, tính chất ③ không còn áp dụng cho cặp policy mới.

Câu tóm ① + ② là cách đọc khác của hai bất đẳng thức: cặp (π_max, π_min) là điểm mà không bên nào có lợi khi đơn phương đổi policy.

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
