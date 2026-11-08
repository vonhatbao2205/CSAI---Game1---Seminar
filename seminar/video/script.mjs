// Kịch bản phần 1 (slide 1–25): lời nói + hành động. Đây là nguồn duy nhất:
// tools/compile.mjs sinh ra kịch bản .md, audio (edge-tts) và timeline cho video từ file này.
//
// Cú pháp đánh dấu trong `say`:
//   {>}            bấm → (bước tiếp theo của deck)
//   {p:name}       chỉ (laser) vào vùng `name` của slide hiện tại (tọa độ slide 1920×1080)
//   {pb:name}      giơ tay chỉ vào một vùng trên bảng trắng
//   {look:class|screen|board}   quay mặt
//   {g:open|raise|think|shrug}  cử chỉ
//   {d:group}      viết/vẽ nhóm `group` lên bảng (người đi tới bảng, quay lưng, viết)
//   {e:zone,...}   xóa vùng bảng
//   {||2}          dừng 2 giây (chờ lớp trả lời)
//   {hands:3}      (video) 3 bạn giơ tay
//   {vid} {at:7.5} phát video trên slide; câu sau đợi tới giây 7.5 của video
//   {seq:name}     (video) phát chuỗi ảnh trên màn chiếu: kéo thanh trượt, chạy simulation
//   ⟦hiển thị|đọc⟧ chữ in trong kịch bản | cách giọng đọc phát âm

export const META = {
  title: "Games 1 · Phần 1: Overview, Modeling, Game evaluation",
  presenter: "Võ Nhất Bảo",
  partner: "Phạm Lê Huy Hoàng",
  voice: "vi-VN-NamMinhNeural",
  rate: "-10%",
  fps: 25,
};

const P = (x, y, w, h, label) => ({ box: [x, y, w, h], label });

export const SLIDES = [
  {
    n: 1, part: "Mở đầu", title: "Games 1",
    targets: {
      title: P(60, 280, 720, 520, "tên đề tài và thành viên"),
      tree3d: P(1080, 150, 740, 730, "cây Tic-Tac-Toe 3D"),
      legend3d: P(1270, 888, 380, 46, "chú thích màu"),
    },
    say: `{look:class}{g:open}Em chào thầy và các bạn. Em là Võ Nhất Bảo, nhóm 10. {p:title}Hôm nay nhóm em, gồm em và bạn Phạm Lê Huy Hoàng, trình bày chủ đề Games 1: mô hình hóa trò chơi, Game evaluation, Expectimax và Minimax. Em trình bày phần đầu, từ Overview tới hết Game evaluation. Sau đó bạn Hoàng trình bày Expectimax và Minimax. {look:class}Game là một trong những bài toán lâu đời nhất của AI: năm 1997, máy Deep Blue thắng nhà vô địch cờ vua Kasparov; năm 2016, AlphaGo thắng Lee Sedol ở cờ vây. Ý tưởng nền tảng phía sau các hệ thống đó chính là những gì mình học hôm nay: mô hình hóa game, tính value, rồi chọn nước đi.
{p:tree3d}Hình bên phải là game tree của Tic-Tac-Toe, vẽ năm tầng đầu tính từ bàn cờ trống. Mỗi chấm là một node. {p:legend3d}Màu xanh lá là X thắng, xám là hòa, hồng là O thắng, nếu cả hai bên chơi tối ưu. {look:class}Mới năm tầng thôi mà đã gần mười chín nghìn node. Lát nữa mình sẽ quay lại con số này.`,
  },
  {
    n: 2, part: "Mở đầu", title: "Câu hỏi của buổi trình bày",
    targets: {
      agent: P(170, 300, 360, 520, "agent (robot bên trái)"),
      opp: P(1390, 300, 360, 520, "đối thủ (đội mũ len)"),
      turns: P(670, 460, 590, 62, "chuỗi lượt: agent → đối thủ → agent → terminal"),
      question: P(690, 530, 560, 150, "câu hỏi ở giữa"),
    },
    say: `{>}Trước khi vào nội dung, em muốn đặt ra một câu hỏi cho cả buổi. {p:agent}Bên trái là agent; các bạn cứ hiểu agent là mình, người đang cần ra quyết định. {p:opp}Bên phải là đối thủ, bạn đội mũ len. {>}{p:turns}Agent chỉ được chọn ở lượt của mình. Sau lượt agent là lượt đối thủ, rồi lại tới agent, cứ thế cho tới khi ván kết thúc. Nếu các bạn đã học MDP thì sẽ thấy điểm khác: trong MDP, môi trường có ngẫu nhiên nhưng không cố tình chơi khó mình; còn trong game, đối thủ có mục tiêu ngược với mình. {>}{p:question}Vậy câu hỏi là: tại một state, agent nên chọn action nào, khi một phần diễn biến tiếp theo lại do đối thủ quyết định? {look:class}Cả buổi hôm nay xoay quanh đúng câu hỏi này.`,
  },
  {
    n: 3, part: "Mở đầu", title: "Lộ trình",
    targets: {
      r1: P(90, 330, 320, 280, "phần 1 · Overview"),
      r2: P(445, 330, 320, 280, "phần 2 · Modeling"),
      r3: P(800, 330, 320, 280, "phần 3 · Game evaluation"),
      r4: P(1155, 330, 320, 280, "phần 4 · Expectimax"),
      r5: P(1510, 330, 320, 280, "phần 5 · Minimax"),
      foot: P(72, 660, 1776, 74, "dòng ví dụ chính"),
    },
    say: `{>}Để trả lời câu hỏi đó, nhóm em chia nội dung thành năm phần. {p:r1}Phần một, Overview: vì sao có đối thủ thì lời giải phải là một policy, chứ không còn là một plan. {>}{p:r2}Phần hai, Modeling: mô tả một game bằng sáu thành phần. {>}{p:r3}Phần ba, Game evaluation: khi đã biết cả hai bên chơi thế nào, thì tính value ra sao. Ba phần này là phần của em. {>}{p:r4}Phần bốn là Expectimax, {>}{p:r5}và phần năm là Minimax, hai cách tìm policy tốt nhất, bạn Hoàng sẽ trình bày. {>}{p:foot}Suốt buổi, tụi em dùng một ví dụ chính là game ba hộp; Tic-Tac-Toe và Halving để minh họa thêm.`,
  },
  {
    n: 4, part: "Overview", title: "Single-agent search",
    targets: {
      formula: P(1280, 250, 580, 450, "mô hình search (S, s₀, A, T, G, c)"),
      red: P(170, 325, 980, 160, "path qua u: 2 edge, cost 18"),
      green: P(170, 560, 980, 220, "path qua a, b: 3 edge, cost 3"),
    },
    say: `{>}OK, mình bắt đầu từ thứ các bạn đã quen: bài toán search một agent. {p:formula}Một bài toán search cho mình tập state, start state, các action hợp lệ và transition, tập goal, và cost của từng bước. Nhiệm vụ là tìm một path từ start tới goal. {>}{p:red}Ví dụ trên hình, path đi qua u chỉ có hai bước, nhìn thì ngắn, nhưng tốn chín cộng chín là mười tám. {>}{p:green}Còn path đi qua a và b dài ba bước, nhưng chỉ tốn ba. Ít bước nhất chưa chắc là rẻ nhất. {look:class}Nhưng điểm em muốn các bạn để ý là: trong search, agent tự chọn mọi bước. Tìm xong path thì cứ thế đi theo, không ai cản cả. Giống như mở bản đồ tìm đường từ nhà tới trường: mình chọn đường, còn con đường thì không tự đổi để chơi khó mình. {g:open}Vậy nếu có người khác chen vào giữa thì sao?`,
  },
  {
    n: 5, part: "Overview", title: "Plan và policy",
    targets: {
      x0: P(110, 440, 175, 190, "bàn cờ X0"),
      o4: P(570, 250, 200, 190, "nước O4 của đối thủ"),
      x2: P(1030, 250, 200, 190, "nước X2"),
      o18: P(570, 460, 200, 400, "O đi ô 1 hoặc ô 8"),
      plan: P(1365, 285, 500, 235, "khung Plan"),
      policy: P(1365, 535, 500, 235, "khung Policy"),
    },
    say: `{>}Mình thử với Tic-Tac-Toe. {p:x0}Giả sử X là agent, và X lập sẵn một plan: mình đi ô 0, {p:o4}đối thủ đi ô 4, {p:x2}rồi mình đi ô 2. Nghe hợp lý đúng không? {p:o4}Nhưng có một vấn đề: nước O4 đâu phải do mình chọn. {>}{p:o18}Nếu O đi ô 1, hoặc ô 8, thì plan này hết dùng được. {p:plan}Plan chỉ là một chuỗi nước cố định; nó không nói X phải làm gì khi O đi khác. {>}{p:policy}Cái mình cần là một policy: một quy tắc cho biết ở mỗi state mà agent có thể gặp, agent sẽ chọn action nào. {look:class}O đi ô 4 thì mình đáp thế này, O đi ô 1 thì mình đáp thế kia. Nói cách khác, policy giống một cái cây các phản ứng, chứ không còn là một đường thẳng. Search khi có đối thủ như vậy gọi là adversarial search, tức là search đối kháng.`,
  },
  {
    n: 6, part: "Overview", title: "Game ba hộp",
    targets: {
      boxes: P(650, 300, 620, 380, "ba hộp A, B, C"),
      boxA: P(655, 330, 210, 330, "hộp A"),
      boxB: P(860, 330, 210, 330, "hộp B"),
      big: P(190, 755, 225, 70, "nút “Chọn số lớn”"),
    },
    say: `{>}OK, giờ mình chơi một trò chơi nhỏ. Trò này lấy từ bài giảng ⟦CS221|C S 221⟧ của Stanford, và nó sẽ đi theo mình suốt buổi hôm nay. {p:boxes}Có ba hộp A, B, C. Hộp A có hai số, âm 50 và 50; hộp B có 1 và 3; hộp C có âm 5 và 15. {look:class}Luật chơi như sau: các bạn là agent, các bạn chọn một hộp. Sau đó em, là đối thủ, chọn một số trong hộp đó. Số em chọn là điểm của các bạn, và các bạn muốn điểm càng cao càng tốt.
{g:raise}Em hỏi nhanh nha. Bạn nào chọn hộp A, giơ tay giúp em. {hands:2}{||2.2}OK, vài bạn. {g:raise}Bạn nào chọn B? {hands:3}{||2.2}{g:raise}Còn hộp C? {hands:5}{||2.2}{g:open}À, đa số chọn C. Có vẻ các bạn không tin em lắm, nhưng cũng chưa tới mức nghĩ em sẽ chơi xấu. Chút nữa mình xem ai đúng.
Em vẽ trò này lên bảng. {d:t1}Trên cùng là lượt của agent, em vẽ một tam giác hướng lên. {d:t2}Agent có ba action là A, B, C. {d:t3}Đi xuống mỗi nhánh là tới lượt đối thủ, em vẽ hình tròn. {d:t4}Đối thủ chọn một trong hai số, và cuối cùng là sáu kết cục: âm 50, 50, 1, 3, âm 5, 15. Mỗi đường đi từ trên xuống dưới là một ván có thể xảy ra. {look:class}Cái hình này gọi là game tree: root là trạng thái bắt đầu, mỗi edge là một action, và mỗi leaf là một kết cục có điểm.
{look:screen}Giờ mình chơi thử trên slide. {>}{p:boxA}Agent chọn hộp A, đối thủ chọn số nhỏ, agent nhận âm 50. {>}{p:boxB}Ván sau agent chọn B, đối thủ vẫn chọn số nhỏ, agent nhận 1. {>}{p:big}Nhưng nếu đối thủ đổi tính, chọn số lớn, {p:boxA}thì hộp A lại cho tới 50. {look:class}Vậy hộp nào tốt nhất? Câu trả lời là: còn tùy đối thủ chơi kiểu gì.`,
  },
  {
    n: 7, part: "Overview", title: "Ba giả định về đối thủ",
    targets: {
      leaves: P(85, 675, 990, 70, "sáu leaf"),
      row1: P(1130, 512, 656, 84, "dòng “Số lớn”"),
      row2: P(1130, 588, 656, 84, "dòng “Xác suất ½”"),
      row3: P(1130, 663, 656, 84, "dòng “Số nhỏ”"),
    },
    say: `{>}Mình làm rõ chữ “tùy” này. {p:leaves}Sáu kết quả ở dưới không bao giờ đổi. Cái thay đổi là value của từng hộp, vì nó phụ thuộc đối thủ chọn số thế nào. Có ba giả định, em ghi luôn lên bảng. {>}{p:row1}Giả định thứ nhất: đối thủ tốt bụng, luôn chọn số lớn. {d:r1}Khi đó A có value 50, B là 3, C là 15. Agent chọn A. {>}{p:row2}Giả định thứ hai: đối thủ tung đồng xu, mỗi số xác suất một nửa. {d:r2}Value là trung bình: A bằng 0, B bằng 2, C bằng 5. Agent chọn C. Những bạn vừa chọn C chắc là đang nghĩ theo cách này. {>}{p:row3}Giả định thứ ba: đối thủ chơi xấu, luôn chọn số nhỏ nhất. {d:r3}A còn âm 50, B là 1, C là âm 5. Agent chọn B. {look:class}{g:open}Các bạn thấy không, cùng một cái cây, cùng sáu con số, mà ba giả định cho ra ba đáp án khác nhau. Hộp A có số 50 rất hấp dẫn, nhưng agent không quyết định được việc đi tới số 50 đó. {pb:rows}Ba dòng này chính là ba câu hỏi mà Game evaluation, Expectimax và Minimax sẽ trả lời.`,
  },
  {
    n: 8, part: "Overview", title: "Game khác search ở đâu",
    targets: {
      left: P(62, 355, 853, 240, "ý 1: utility nằm ở terminal state"),
      right: P(1005, 355, 853, 185, "ý 2: mỗi node thuộc về một player"),
      legend: P(310, 642, 1300, 56, "bốn hình node"),
    },
    say: `{>}Từ ví dụ này, mình rút ra hai điểm làm game khác search. {p:left}Thứ nhất, utility nằm ở cuối ván. Đang chơi giữa chừng thì chưa có điểm; phải tới terminal state mới biết thắng, hòa hay thua. Nên một nước nhìn có lợi trước mắt vẫn có thể dẫn tới thua. {>}{p:right}Thứ hai, mỗi node thuộc về một player. Ở node của đối thủ, agent không được chọn, và cách tính value tại node phụ thuộc vào ai đang có lượt. {>}{p:legend}Từ giờ mình thống nhất bốn hình: tam giác hướng lên là lượt agent, gọi là node MAX; tam giác hướng xuống là lượt đối thủ, node MIN; hình tròn là chance node; và hình vuông là terminal state. {pb:oppnodes}Trên bảng em đang vẽ hình tròn ở lượt đối thủ, vì mình chưa giả định đối thủ chơi kiểu nào. {look:class}Tóm lại phần Overview: khi có đối thủ, lời giải là một policy; và muốn biết một nước tốt hay không, mình phải biết, hoặc phải giả định, đối thủ sẽ phản ứng ra sao.`,
  },
  {
    n: 9, part: "Modeling", title: "Loại game đang xét",
    targets: {
      rows12: P(60, 168, 1500, 128, "hai player, zero-sum"),
      rows36: P(60, 296, 1500, 258, "turn-taking, fully observable, deterministic, hữu hạn"),
      zerosum: P(60, 612, 1800, 312, "bảng zero-sum có hòa"),
    },
    say: `{>}Qua phần hai, Modeling. Trước hết mình giới hạn loại game đang xét. {p:rows12}Có hai player là agent và đối thủ. Game là zero-sum: utility của đối thủ luôn bằng âm utility của agent, cộng lại bằng 0. {>}{p:rows36}Hai bên đi lần lượt, cả hai thấy toàn bộ state, biết state và action thì biết state kế tiếp, và mọi nhánh đều kết thúc. {look:class}Tic-Tac-Toe hay cờ vua là loại này. Poker thì không, vì mình không thấy bài của đối thủ. Cờ cá ngựa cũng không, vì có xúc xắc; game có yếu tố ngẫu nhiên thuộc phần Games 2. {>}{p:zerosum}Một hiểu lầm hay gặp: zero-sum không có nghĩa là bắt buộc phải có người thắng. Vẫn có hòa, và khi hòa thì cả hai bên cùng nhận 0.`,
  },
  {
    n: 10, part: "Modeling", title: "Sáu thành phần của mô hình",
    targets: {
      rows14: P(62, 328, 1220, 310, "bốn thành phần đầu"),
      util: P(62, 628, 1796, 86, "Utility(s)"),
      player: P(62, 703, 1796, 86, "Player(s)"),
    },
    say: `{>}Một game như vậy được mô tả bằng sáu thành phần. {p:rows14}Bốn thành phần đầu nghe rất quen: s start là state ban đầu; Actions của s là các action hợp lệ; Succ của s, a là state nhận được sau khi làm action a; và ⟦IsEnd|Is End⟧ kiểm tra ván đã kết thúc chưa. Bốn cái này gần như y hệt bài toán search. {>}{p:util}Thành phần thứ năm là Utility: điểm của terminal state, tính theo góc nhìn agent. Các bạn để ý: trong search, tới goal là tốt. Còn trong game, tới terminal state chưa chắc đã tốt, vì thua cũng là một terminal state. {>}{p:player}Thành phần thứ sáu là Player của s, cho biết tại state này ai đang được chọn. Đối thủ đi vào mô hình chính là qua thành phần này. {look:board}{pb:tree}Thử ráp vào game ba hộp trên bảng: s start là root; Actions ở root là A, B, C; Succ của root với action A là node A; ⟦IsEnd|Is End⟧ đúng ở sáu leaf; Utility là con số ghi ở leaf; còn Player ở root là agent, ở ba node giữa là đối thủ. Sáu thành phần là đủ để mô tả trọn trò chơi này.`,
  },
  {
    n: 11, part: "Modeling", title: "Từ search sang game", opt: true,
    targets: {
      r1: P(62, 366, 1796, 158, "start state, transition"),
      r2: P(62, 517, 1796, 84, "goal test → IsEnd"),
      r3: P(62, 592, 1796, 84, "cost → Utility"),
      r4: P(62, 667, 1796, 84, "agent chọn mọi bước → Player(s)"),
    },
    say: `{>}Slide này đặt hai mô hình cạnh nhau. {p:r1}Start state và transition vẫn giữ nguyên. {>}{p:r2}Goal test trở thành ⟦IsEnd|Is End⟧, và terminal state có thể là thua. {>}{p:r3}Không còn cộng cost dọc đường nữa, mà chấm điểm ở terminal state. {>}{p:r4}Và khác biệt lớn nhất: có những bước do đối thủ chọn. {look:class}Nên chỉ biết bước nào hợp lệ là chưa đủ. Agent cần thêm một cách đánh giá phản ứng của đối thủ, và đó là việc của ba phần sau.`,
  },
  {
    n: 12, part: "Modeling", title: "Mô hình hóa Tic-Tac-Toe",
    targets: {
      board: P(395, 285, 450, 450, "bàn cờ"),
      actions0: P(1190, 425, 660, 56, "dòng Actions(s)"),
      succ1: P(1190, 493, 660, 56, "dòng Succ(s, a)"),
      isend: P(1190, 568, 660, 78, "dòng IsEnd(s)"),
      util2: P(1190, 634, 660, 78, "dòng Utility(s)"),
    },
    say: `{>}Áp dụng vào Tic-Tac-Toe. {p:board}State gồm bàn cờ ba nhân ba và player đến lượt. Start state là bàn trống, X đến lượt. Ở đây em chọn X làm agent, đi trước. {p:actions0}Actions của s là các ô còn trống, ở đây là cả chín ô. {>}{p:board}Sau khi X đi ô 0 và O đi ô 4, {p:succ1}Succ của s, a nghĩa là đặt quân của người đang tới lượt vào ô a, rồi đổi lượt. Bây giờ lại tới X, và còn bảy ô hợp lệ. {>}{p:board}Còn đây là một tình huống cần cẩn thận. X đã có ba quân ở hàng trên cùng, X thắng rồi, {p:isend}dù bàn vẫn còn ô trống. Nếu thuật toán cứ sinh action từ các ô trống là sai. Phải kiểm tra ⟦IsEnd|Is End⟧ trước. {p:util2}Utility ở đây là cộng 1 nếu X thắng, 0 nếu hòa, và trừ 1 nếu O thắng.`,
  },
  {
    n: 13, part: "Modeling", title: "Hai điều cần kiểm tra",
    targets: {
      rule1: P(62, 330, 1266, 185, "ý 1: state phải đủ để áp dụng luật"),
      rule2: P(62, 539, 1266, 186, "ý 2: action hợp lệ chưa chắc là action tốt"),
      tttboard: P(1395, 245, 440, 440, "bàn cờ X đến lượt"),
      cell2: P(1685, 248, 148, 148, "ô 2"),
    },
    say: `{>}Khi mô hình hóa, có hai điều em muốn nhấn mạnh. {p:rule1}Thứ nhất, state phải đủ thông tin để áp dụng luật. Cùng một bàn cờ, nhưng X tới lượt và O tới lượt là hai state khác nhau, vì người đi tiếp khác nhau. Ở Tic-Tac-Toe thì đếm số quân là suy ra được ai đến lượt, nhưng nhiều game khác không suy ra được, nên ghi rõ lượt đi vào state cho chắc. {>}{p:tttboard}Thứ hai, các bạn nhìn bàn này: X đến lượt, O đang có hai quân ở hàng trên. X nên đi ô nào? {||1.8}{p:cell2}Đúng rồi, ô 2, phải chặn. {p:tttboard}Cả năm ô trống đều hợp lệ, nhưng bốn ô tô đỏ dẫn tới thua ngay. {p:rule2}Nên Actions của s chỉ kiểm tra luật thôi; còn nước nào tốt là việc của thuật toán search.`,
  },
  {
    n: 14, part: "Modeling", title: "Game tree và state-space graph",
    targets: {
      hist1: P(200, 310, 700, 200, "lịch sử 1: X0, O4, X2"),
      hist2: P(200, 548, 700, 220, "lịch sử 2: X2, O4, X0"),
      treepanel: P(80, 250, 840, 560, "game tree: hai node"),
      merged: P(1610, 420, 190, 250, "state chung (một node)"),
    },
    say: `{>}Tiếp theo là hai cách vẽ một game. {p:hist1}Lịch sử thứ nhất: X đi 0, O đi 4, X đi 2. {p:hist2}Lịch sử thứ hai: X đi 2, O đi 4, X đi 0. Hai thứ tự khác nhau, nhưng bàn cờ cuối cùng giống hệt nhau, và đều tới lượt O. {p:treepanel}Trên game tree, mỗi node là một state trong một lịch sử chơi, nên đây là hai node khác nhau. {>}{p:merged}Còn trên state-space graph, mỗi state chỉ là một node, nên hai đường này gặp nhau ở cùng một node. {look:class}Ý nghĩa là gì? Từ state chung đó, phần còn lại của ván giống hệt nhau. Tính value một lần là dùng lại được cho cả hai.`,
  },
  {
    n: 15, part: "Modeling", title: "So sánh tree và graph", opt: true,
    targets: {
      row12: P(62, 318, 1796, 214, "một node · hai lịch sử"),
      row34: P(62, 516, 1796, 214, "số parent · chu trình"),
      row5: P(62, 714, 1796, 92, "khi tính value"),
    },
    say: `{>}Tóm lại sự khác nhau. {p:row12}Game tree giữ lại lịch sử, nên hai lịch sử là hai node. {>}{p:row34}Mỗi node chỉ có đúng một parent, và không có chu trình. {>}{p:row5}Hệ quả là trên tree, cùng một state có thể bị tính đi tính lại, còn trên graph thì lưu lại và dùng lại được. {look:class}Trong bài này, các thuật toán vẫn trình bày trên tree, vì nhìn từng lựa chọn và phản ứng sẽ rõ hơn.`,
  },
  {
    n: 16, part: "Modeling", title: "549.946 node, 5.478 state",
    targets: {
      n1: P(800, 270, 520, 230, "549.946 node"),
      n2: P(1345, 270, 520, 230, "5.478 state"),
      t1: P(800, 512, 1060, 124, "đoạn giải thích"),
      root3d: P(360, 262, 112, 112, "root màu xám"),
    },
    say: `Trước khi qua slide sau, em đố các bạn: bàn Tic-Tac-Toe chỉ có chín ô, vậy game tree đầy đủ từ bàn trống có khoảng bao nhiêu node? {||2.5}{>}{p:n1}Câu trả lời là ⟦549.946|năm trăm bốn mươi chín nghìn chín trăm bốn mươi sáu⟧ node, gần năm trăm năm mươi nghìn. {p:n2}Trong khi số state khác nhau, tính cả lượt đi, chỉ có ⟦5.478|năm nghìn bốn trăm bảy mươi tám⟧. {>}{p:t1}Tức là game tree lớn gấp khoảng một trăm lần số state, vì rất nhiều node lặp lại cùng một state, đúng như ví dụ vừa rồi. Hai con số này nhóm em tự đếm bằng code. {>}{p:root3d}Thêm một chi tiết: root có màu xám, nghĩa là nếu cả hai bên chơi tối ưu thì Tic-Tac-Toe luôn hòa. Bạn nào từng chơi chắc cũng thấy vậy. {look:class}Còn với cờ vua, theo ước tính nổi tiếng của Shannon, số ván cờ khác nhau, tức là số đường đi từ root tới leaf, vào cỡ mười mũ một trăm hai mươi. Không máy nào duyệt hết được; đó là lý do Games 2 cần tới evaluation function và alpha-beta pruning.`,
  },
  {
    n: 17, part: "Modeling", title: "Policy",
    targets: {
      rootlabel: P(560, 270, 190, 120, "root với π(root) = A"),
      det: P(1258, 293, 600, 185, "deterministic policy"),
      edgeA: P(360, 330, 290, 150, "edge A, xác suất 1"),
      sto: P(1258, 496, 600, 268, "stochastic policy"),
      halves: P(230, 600, 830, 60, "các xác suất ½"),
    },
    say: `{>}Quay lại khái niệm policy, giờ mình nói chính xác hơn. {p:rootlabel}Policy của một player cho biết tại mỗi state thuộc lượt của player đó, player chọn action nào, kể cả những state chưa từng gặp. {>}{p:det}Loại đơn giản nhất là deterministic policy: mỗi state chọn đúng một action. {p:edgeA}Ví dụ agent luôn chọn hộp A. Viết dưới dạng xác suất thì A có xác suất 1, B và C xác suất 0. {>}{p:sto}Tổng quát hơn là stochastic policy: gán cho mỗi action một xác suất, các xác suất không âm và cộng lại bằng 1. {p:halves}Ví dụ đối thủ chọn mỗi số với xác suất một nửa. {look:class}Tại sao lại cần policy ngẫu nhiên? Các bạn nghĩ tới oẳn tù tì: nếu mình luôn ra kéo, đối thủ sẽ luôn ra búa. Có những lúc chơi ngẫu nhiên mới là cách chơi tốt. Từ giờ em dùng π cho policy của agent, và μ cho policy của đối thủ.`,
  },
  {
    n: 18, part: "Modeling", title: "Utility và value",
    targets: {
      U: P(62, 362, 1796, 86, "dòng U(s)"),
      Vpm: P(62, 437, 1796, 86, "dòng V^{π,μ}(s)"),
      Vstar: P(62, 512, 1796, 86, "dòng V^{*,μ}(s)"),
      Vmm: P(62, 587, 1796, 86, "dòng V_mm(s)"),
      foot: P(62, 692, 1796, 68, "dòng tổng kết"),
    },
    say: `{>}Có policy rồi, mình phân biệt hai chữ hay bị dùng lẫn: utility và value. {p:U}Utility chỉ có ở terminal state; nó chấm điểm một kết cục đã xảy ra, thắng cộng 1, thua trừ 1. {d:uv1}Em ghi lên bảng: U của s là điểm của kết cục. {>}{p:Vpm}Còn value thì đánh giá mọi state, kể cả state đang ở giữa ván. Value của cặp policy π, μ là expected utility, tức là utility trung bình nếu hai bên cứ chơi đúng theo hai policy đó tới hết ván. {d:uv2}V của s là trung bình tính từ s, theo π và μ. {>}{p:Vstar}Nếu giữ μ của đối thủ cố định, rồi cho agent chọn policy tốt nhất, mình được value tối ưu trước μ. {>}{p:Vmm}Còn nếu không giả định gì về μ, agent tối đa value trong trường hợp xấu nhất. {p:foot}Ba dòng cuối lần lượt là Game evaluation, Expectimax và Minimax. Hôm nay em trình bày dòng thứ nhất. {look:class}Một cách dễ nhớ: utility giống điểm thi cuối kỳ, có khi thi xong mới biết. Còn value giống điểm mình kỳ vọng khi đang học giữa kỳ, và nó phụ thuộc cả việc mình học thế nào lẫn đề ra thế nào.`,
  },
  {
    n: 19, part: "Modeling", title: "Cùng leaf, ba value",
    targets: {
      tree1: P(62, 228, 599, 600, "cây Game evaluation (value 0)"),
      tree2: P(661, 228, 599, 600, "cây Expectimax (value 5)"),
      tree3: P(1259, 228, 599, 600, "cây Minimax (value 1)"),
    },
    say: `{>}Nhìn lại game ba hộp: cùng sáu leaf, nhưng ba câu hỏi cho ba value khác nhau ở root. {p:tree1}Game evaluation: agent cố định chọn A, đối thủ chọn đều, root là trung bình của âm 50 và 50, tức là 0. {>}{p:tree2}Expectimax: đối thủ vẫn chọn đều, nhưng agent được tự chọn, nên lấy max của 0, 2, 5, được 5. {>}{p:tree3}Minimax: đối thủ chọn số bất lợi nhất, max của âm 50, 1, âm 5 là 1. {look:class}Ba con số 0, 5, 1 chỉ có nghĩa khi đi kèm giả định của nó. Đó cũng là kết thúc phần Modeling: mình đã có sáu thành phần, có policy, và phân biệt được utility với value. Bây giờ mình đi vào con số đầu tiên.`,
  },
  {
    n: 20, part: "Game evaluation", title: "Game evaluation",
    targets: {
      agent: P(150, 380, 270, 420, "agent cầm π"),
      opp: P(870, 380, 270, 420, "đối thủ cầm μ"),
      vq: P(470, 330, 340, 380, "V = ?"),
      formula: P(1290, 300, 570, 80, "V^{π,μ}(s) = E[U(s_T) | s, π, μ]"),
      li1: P(1198, 391, 660, 117, "ý 1: hai policy cố định"),
      li23: P(1198, 510, 660, 235, "ý 2, 3: expected utility"),
    },
    say: `{>}Phần ba: Game evaluation. {p:agent}Agent chơi theo π, {p:opp}đối thủ chơi theo μ, và cả hai policy đều được cho trước. {p:vq}Câu hỏi duy nhất là: V bằng bao nhiêu? {p:formula}Viết ra thì V của s là expected utility của terminal state, khi xuất phát từ s và hai bên chơi theo π và μ. {>}{p:li1}Hai policy này cố định trong suốt phép tính. Chữ evaluation ở đây nghĩa là đo: mình chỉ đo xem cặp cách chơi này cho kết quả bao nhiêu; thuật toán không đi tìm policy mới. {>}{p:li23}Và kết quả là expected utility, tức là trung bình có trọng số theo xác suất. Một ván cụ thể ngoài đời có thể ra số khác. {look:class}Các bạn có thể thắc mắc: ngoài đời làm sao biết hết policy của đối thủ? Thường là không biết. Nhưng Game evaluation là viên gạch đầu tiên: muốn so sánh hay tối ưu thì trước hết phải đo được.`,
  },
  {
    n: 21, part: "Game evaluation", title: "Recurrence của Game evaluation",
    targets: {
      case1: P(370, 328, 920, 62, "trường hợp terminal: Utility(s)"),
      case23: P(370, 392, 920, 170, "hai dòng tổng theo π và μ"),
      qv: P(1300, 270, 560, 520, "ví dụ hai con v₁, v₂"),
      nomax: P(62, 596, 1206, 132, "không có max hay min"),
    },
    say: `{>}Vậy tính V thế nào? Mình định nghĩa một recurrence, tức là một công thức đệ quy. {p:case1}Trường hợp cơ sở: nếu s là terminal state thì value chính là utility. {p:case23}Còn nếu chưa kết thúc, mình lấy tổng theo các action: xác suất chọn action đó, nhân với value của state con. Lượt agent thì xác suất lấy từ π, lượt đối thủ thì lấy từ μ. {e:rows,foot}{d:rec}Em viết gọn lên bảng: V của s bằng U của s nếu s là terminal; còn không thì V của s bằng tổng theo a, xác suất của a nhân V của Succ s a. {>}{p:qv}Ví dụ một node có hai con, value là ⟦v₁|v một⟧ và ⟦v₂|v hai⟧, được chọn với xác suất q và 1 trừ q. Value của node là q nhân ⟦v₁|v một⟧, cộng 1 trừ q nhân ⟦v₂|v hai⟧. Các bạn để ý: phải dùng value của cả subtree con, không phải utility, vì một action chưa chắc đã kết thúc ván. {>}{p:nomax}Và công thức này không có max, cũng không có min. Lượt agent hay lượt đối thủ đều tính giống nhau, chỉ khác bảng xác suất. Thật ra đây chính là kỳ vọng mà mình đã học trong xác suất thống kê, chỉ là tính đệ quy từ leaf đi lên. {look:board}Mình tính thử trên cây ở bảng. {d:cA}Hộp A: một nửa nhân âm 50, cộng một nửa nhân 50, bằng 0. {d:cB}Hộp B: trung bình của 1 và 3 là 2. {d:cC}Hộp C: trung bình của âm 5 và 15 là 5. {d:cR}Còn root: agent luôn chọn A, nên bằng 1 nhân 0, cộng 0 nhân 2, cộng 0 nhân 5, bằng 0.`,
  },
  {
    n: 22, part: "Game evaluation", title: "Video: Game evaluation trên ba hộp",
    targets: {},
    say: `{>}{vid}Đây là video nhóm em làm bằng thư viện manim, chạy lại đúng phép tính đó. {at:1.8}Hai policy đã biết: agent luôn chọn A, đối thủ chọn đều. {at:7.6}Đầu tiên, mỗi hộp lấy trung bình hai leaf, với trọng số theo μ, được 0, 2 và 5. {at:17}Sau đó root lấy trung bình theo π. Chỉ hộp A có trọng số 1, nên root bằng 0. {at:21.1}C có tới 5, cao hơn hẳn, nhưng Game evaluation vẫn trả 0, vì policy đang được đánh giá là chọn A. {at:25.2}Giờ đổi policy của agent thành chọn đều ba hộp. {at:28.6}Root thành 0 cộng 2 cộng 5, chia 3, bằng ⟦7/3|bảy phần ba⟧. Đổi policy thì value đổi theo.`,
  },
  {
    n: 23, part: "Game evaluation", title: "Thử đổi policy",
    targets: {
      tree: P(70, 260, 980, 520, "cây tương tác"),
      root: P(480, 255, 145, 140, "root"),
      uniform: P(1525, 410, 154, 70, "nút “Đều ⅓”"),
      slider: P(1060, 538, 640, 60, "thanh trượt q"),
      readout: P(1062, 606, 720, 100, "dòng tính root"),
    },
    say: `{>}Slide này là phiên bản tương tác của cây vừa rồi. {p:tree}Agent luôn chọn A, đối thủ chọn đều, root bằng 0. Độ dày của edge thể hiện xác suất. {look:class}Em hỏi các bạn: nếu agent chọn đều cả ba hộp thì root bằng bao nhiêu? {||2.5}{>}{p:readout}Đúng rồi: 0 cộng 2 cộng 5, chia 3, bằng bảy phần ba. {d:r73}Em ghi thêm lên bảng: π chọn đều thì root bằng bảy phần ba. {p:slider}Giờ em kéo thanh trượt này. q là xác suất đối thủ chọn số nhỏ. {seq:up}Kéo q lên gần 1, đối thủ gần như luôn chọn số nhỏ, value của cả ba hộp đều giảm, {p:root}root xuống âm; khi q bằng 1 thì root bằng âm 18. {p:slider}{seq:down}Kéo q về 0 thì ngược lại, root tăng lên. {seq:mid}{look:class}Mỗi lần đổi μ, mọi node được tính lại bằng đúng một kiểu tổng có trọng số.`,
  },
  {
    n: 24, part: "Game evaluation", title: "Recurrence và simulation",
    targets: {
      panel: P(62, 262, 1796, 200, "bảng simulation"),
      balls: P(225, 362, 1400, 98, "kết quả từng ván"),
      avg: P(1610, 362, 245, 98, "trung bình mẫu"),
      chart: P(62, 480, 1180, 380, "đồ thị trung bình theo số ván"),
    },
    say: `{>}Có một cách khác để ra con số này, mà không cần công thức: cứ chơi thử. {p:panel}Đây là simulation: agent luôn chọn A, đối thủ chọn đều, cho hai bên chơi nhiều ván rồi lấy trung bình utility. {>}{seq:mc10}{p:balls}Chơi mười ván đầu: mỗi ván chỉ ra âm 50 hoặc 50, nên trung bình nhảy lung tung. {p:avg}Mới mười ván thì trung bình có thể lệch khỏi 0 khá xa. {>}{seq:mc1000}{p:chart}Chơi tiếp lên một nghìn ván, đường trung bình dao động quanh 0 và dần dần hội tụ về 0. {e:foot}{d:mc}Công thức là V mũ n bằng 1 trên n, nhân tổng utility của n ván. Đây là ước lượng Monte Carlo. {look:class}Vậy recurrence cho kết quả chính xác, nhưng phải duyệt cả cây, mà cây có thể rất lớn. Simulation chỉ cho ước lượng, nhưng dễ làm, và chơi càng nhiều ván thì ước lượng càng sát. Vậy sao không luôn dùng simulation? Vì ở các phần sau, công thức có thêm max và min, và lấy trung bình mẫu thì không ước lượng max dễ như ước lượng một kỳ vọng.`,
  },
  {
    n: 25, part: "Game evaluation", title: "Game evaluation dùng để làm gì", opt: true,
    targets: {
      c1: P(62, 350, 559, 238, "so sánh policy"),
      c2: P(681, 350, 559, 238, "policy evaluation"),
      c3: P(1299, 350, 559, 238, "evaluation function"),
      foot: P(62, 630, 1796, 74, "dòng face-off"),
    },
    say: `{>}Cuối cùng, Game evaluation dùng để làm gì? {p:c1}Thứ nhất, để so sánh policy: giữ policy của agent rồi đổi đối thủ, hoặc giữ đối thủ rồi đổi agent, xem value thay đổi ra sao. {>}{p:c2}Thứ hai, nếu các bạn đã học MDP, thì bước này chính là policy evaluation: cho trước policy, tính value. {>}{p:c3}Và một lưu ý: Game evaluation khác evaluation function. Evaluation function là hàm ước lượng value khi chưa search tới terminal state; phần đó thuộc Games 2 của nhóm 11. {>}{p:foot}Bảng face-off ở phần Minimax sẽ dùng lại đúng phép tính này. {look:class}{g:open}Tóm lại phần của em: có đối thủ thì mình cần policy chứ không phải plan; một game được mô tả bằng sáu thành phần; và khi biết cả hai policy, value được tính bằng trung bình có trọng số, đi từ leaf lên root. Nhưng agent đâu chỉ muốn đo; agent muốn chọn policy tốt nhất. Đó là Expectimax. {>}Em xin mời bạn Hoàng trình bày tiếp. Em cảm ơn thầy và các bạn.`,
  },
];

// Sau slide 25 bấm → một lần nữa để mở slide 26 (Expectimax) rồi giao cho bạn Hoàng.
export const LAST_SLIDE = 26;

// ---------------------------------------------------------------- bảng trắng
// Tọa độ trong bảng: gốc ở góc trên trái, rộng 590, cao 490. Vùng:
//   cây ba hộp y 10–240 · ba dòng giả định / recurrence y 252–372 · ghi chú y 388–490
const INK = "ink", BLUE = "blue", RED = "red", GREEN = "green", PURPLE = "purple", GRAY = "gray";
const TX = 30; // dịch toàn bộ nội dung sang phải để người đứng ở mép trái bảng không che chữ
const NODE = { A: [110 + TX, 132], B: [250 + TX, 132], C: [390 + TX, 132] };
const ROOT = [250 + TX, 40];
const LEAF_X = [70, 150, 210, 290, 350, 430].map((x) => x + TX);
const LEAF_V = ["−50", "50", "1", "3", "−5", "15"];
const line = (x1, y1, x2, y2, c = INK, w = 3) => ({ k: "line", pts: [[x1, y1], [x2, y2]], c, w });
const poly = (pts, c = INK, w = 3, closed = true) => ({ k: "poly", pts, c, w, closed });
const circ = (cx, cy, r, c = INK, w = 3) => ({ k: "circle", cx, cy, r, c, w });
const text = (x, y, s, o = {}) => ({ k: "text", x, y, s, size: o.size || 24, c: o.c || INK, anchor: o.anchor || "start" });
const trim = ([x1, y1], [x2, y2], r1, r2) => {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
  return [x1 + (dx * r1) / d, y1 + (dy * r1) / d, x2 - (dx * r2) / d, y2 - (dy * r2) / d];
};

export const BOARD = {
  rect: { x: 1300, y: 300, w: 596, h: 500 }, // vị trí bảng trong khung hình 1920×1080
  zones: { tree: [0, 0, 600, 246], rows: [0, 246, 600, 134], foot: [0, 380, 600, 120] },
  groups: {
    t1: {
      label: "vẽ tam giác hướng lên ở trên cùng (lượt agent)",
      items: [poly([[ROOT[0], 18], [ROOT[0] + 23, 60], [ROOT[0] - 23, 60]], BLUE), text(508, 48, "agent", { size: 20, c: GRAY })],
    },
    t2: {
      label: "vẽ ba nhánh A, B, C",
      items: ["A", "B", "C"].flatMap((k, i) => {
        const [x1, y1, x2, y2] = trim([ROOT[0], 60], NODE[k], 0, 18);
        const lab = [[165 + TX, 84], [262 + TX, 96], [328 + TX, 84]][i];
        return [line(x1, y1, x2, y2), text(lab[0], lab[1], k, { size: 22, c: BLUE })];
      }),
    },
    t3: {
      label: "vẽ ba hình tròn (lượt đối thủ)",
      items: [...["A", "B", "C"].map((k) => circ(NODE[k][0], NODE[k][1], 18, PURPLE)), text(508, 140, "đối thủ", { size: 20, c: GRAY })],
    },
    t4: {
      label: "vẽ sáu nhánh và sáu ô kết cục −50, 50, 1, 3, −5, 15",
      items: LEAF_X.flatMap((lx, i) => {
        const nd = NODE["ABC"[i >> 1]];
        const [x1, y1, x2, y2] = trim(nd, [lx, 199], 18, 0);
        return [line(x1, y1, x2, y2), poly([[lx - 24, 199], [lx + 24, 199], [lx + 24, 231], [lx - 24, 231]]), text(lx, 224, LEAF_V[i], { size: 22, anchor: "middle" })];
      }).concat([text(508, 222, "kết cục", { size: 20, c: GRAY })]),
    },
    r1: { label: "ghi dòng “lớn: 50 | 3 | 15 → A”", items: rowItems(286, "lớn:", ["50", "3", "15"], "→ A") },
    r2: { label: "ghi dòng “đều: 0 | 2 | 5 → C”", items: rowItems(324, "đều:", ["0", "2", "5"], "→ C") },
    r3: { label: "ghi dòng “nhỏ: −50 | 1 | −5 → B”", items: rowItems(362, "nhỏ:", ["−50", "1", "−5"], "→ B") },
    uv1: { label: "ghi “U(s): điểm của kết cục (terminal)”", items: [text(50, 424, "U(s): điểm của kết cục (terminal)", { c: BLUE })] },
    uv2: { label: "ghi “V(s): trung bình từ s, theo π và μ”", items: [text(50, 466, "V(s): trung bình từ s, theo π và μ", { c: GREEN })] },
    rec: {
      label: "ghi recurrence: V(s) = U(s) nếu IsEnd(s); V(s) = Σ P(a|s)·V(Succ(s,a)); P = π hoặc μ",
      items: [
        text(50, 284, "V(s) = U(s)    nếu IsEnd(s)", { size: 24 }),
        text(50, 322, "V(s) = Σₐ P(a|s) · V(Succ(s, a))", { size: 24 }),
        text(50, 360, "P = π (lượt agent),  μ (lượt đối thủ)", { size: 21, c: PURPLE }),
      ],
    },
    cA: {
      label: "ghi “A: ½·(−50) + ½·50 = 0”, điền 0 vào node A",
      items: [text(50, 424, "A: ½·(−50) + ½·50 = 0", { c: GREEN }), text(NODE.A[0], NODE.A[1] + 8, "0", { size: 24, c: GREEN, anchor: "middle" })],
    },
    cB: { label: "điền 2 vào node B", items: [text(NODE.B[0], NODE.B[1] + 8, "2", { size: 24, c: GREEN, anchor: "middle" })] },
    cC: { label: "điền 5 vào node C", items: [text(NODE.C[0], NODE.C[1] + 8, "5", { size: 24, c: GREEN, anchor: "middle" })] },
    cR: {
      label: "tô đậm nhánh A, ghi “root = 1·0 + 0·2 + 0·5 = 0” và “= 0” cạnh root",
      items: [
        (() => { const [x1, y1, x2, y2] = trim([ROOT[0], 60], NODE.A, 0, 18); return line(x1, y1, x2, y2, GREEN, 6); })(),
        text(50, 466, "root = 1·0 + 0·2 + 0·5 = 0", { c: GREEN }),
        text(ROOT[0] + 28, 50, "= 0", { size: 24, c: GREEN }),
      ],
    },
    r73: { label: "ghi “(π đều: 7/3)” cạnh root", items: [text(ROOT[0] + 76, 50, "(π đều: 7/3)", { size: 21, c: RED })] },
    mc: {
      label: "ghi “V̂ₙ = (1/n)·Σ U(ván i) → 0”",
      items: [text(50, 428, "V̂ₙ = (1/n) · Σ U(ván i)", { c: BLUE }), text(50, 468, "n lớn  ⇒  V̂ₙ → 0 (= V)", { size: 22, c: BLUE })],
    },
  },
  // vùng chỉ tay {pb:...} trên bảng
  points: { rows: [40, 256, 540, 116], oppnodes: [100, 108, 340, 50], tree: [40, 10, 480, 230] },
};

function rowItems(y, lab, vals, pick) {
  return [
    text(48, y, lab, { size: 22, c: GRAY }),
    ...vals.map((v, i) => text([NODE.A, NODE.B, NODE.C][i][0], y, v, { size: 24, anchor: "middle" })),
    text(500, y, pick, { size: 24, c: RED }),
  ];
}

// Chuỗi ảnh trên màn chiếu (chụp từ deck bằng tools/capture.mjs)
export const SEQS = {
  // thanh trượt q: ảnh sl_00 (q = 0) … sl_20 (q = 1), policy agent "Đều ⅓"
  up: { frames: range(11, 20).map((i) => `sl_${pad(i)}`), dt: 0.22 },
  down: { frames: range(19, 0).map((i) => `sl_${pad(i)}`), dt: 0.17 },
  mid: { frames: range(1, 10).map((i) => `sl_${pad(i)}`), dt: 0.16 },
  // simulation: mỗi ảnh là một lần cập nhật của widget
  mc10: { frames: range(1, 10).map((i) => `mc10_${pad(i)}`), dt: 0.16, lead: 0.16 },
  mc1000: { frames: range(1, 40).map((i) => `mc1k_${pad(i)}`), dt: 0.045, lead: 0.05 },
};
function range(a, b) { const out = []; for (let i = a; a <= b ? i <= b : i >= b; i += a <= b ? 1 : -1) out.push(i); return out; }
function pad(i) { return String(i).padStart(2, "0"); }
