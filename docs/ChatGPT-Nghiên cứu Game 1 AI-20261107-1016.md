# Nghiên cứu Game 1 AI

**User:** Anonymous  
**Created:** 11/7/2026 9:34:55  
**Updated:** 11/7/2026 10:15:02  
**Exported:** 11/7/2026 10:16:51  
**Link:** [https://chatgpt.com/c/6aee8e4e-fae4-83ec-ba9b-ed842b7329a0](https://chatgpt.com/c/6aee8e4e-fae4-83ec-ba9b-ed842b7329a0)  

## Prompt:
11/7/2026, 9:34:52 AM

hiện tại tôi đang làm bài thuyết trình cho môn học cơ sở AI về nooị dung : Game 1 bao gồm (overview, modeling,  Game evaluation, Expectimax, Minimax)&#x20;
Tôi cần bạn tìm ra tất cả các nguồn tương ứng của đề tài này và [https://www.youtube.com/watch?v=SMOD_GiRzb8&feature=youtu.be](https://www.youtube.com/watch?v=SMOD_GiRzb8\&feature=youtu.be) (vid reference)
Thầy tôi có yêu cầu là khi trình bày về nội dung này thì cần làm thật kĩ và hiểu được trọng tâm, cũng như hiểu được ý nghĩa đằng sau hướng đi này, như bài toán tìm đường đi nhắn nhất thì cũng là bài toán tìm nghiệm, giải gì gì đó chư không hẳn là bài tìm đường đi)

## Response:
11/7/2026, 9:35:04 AM

Mình sẽ đối chiếu video tham khảo với tài liệu giảng dạy AI từ các đại học, rồi hệ thống hóa năm phần thành một mạch kiến thức thống nhất. Mình sẽ tập trung cả vào các công thức, ví dụ và câu hỏi bản chất mà thầy có thể đặt ra khi vấn đáp.

Mình đã xác định được một nguồn rất sát với đề bài: học phần **Games 1 của Stanford CS221 (Spring 2026)** dùng đúng năm mục “Overview → Modeling → Game evaluation → Expectimax → Minimax”. Đây sẽ là tài liệu gốc để xây dựng bài, còn Berkeley CS188 sẽ giúp đối chiếu thuật toán và bổ sung ví dụ. Nội dung video bạn gửi hiện chưa truy xuất trực tiếp được, nên mình sẽ tách rõ phần xác minh được và phần chưa xác minh.

Một điểm rất dễ bị nhầm trong đề cương đã rõ hơn sau khi đối chiếu slide Stanford: **Game evaluation** ở Games 1 là tính giá trị trò chơi khi đã biết chiến lược của cả hai bên; nó khác với **evaluation function** dùng để ước lượng giá trị trạng thái khi cắt ngắn cây tìm kiếm. Mình sẽ giữ sự phân biệt này trong dàn ý vì nó quyết định cách giải thích toàn bộ phần Expectimax và Minimax.

> **Planning research resources**
>
> I’m organizing a comprehensive overview around state-space search, adversarial games, minimax, expectimax, expectiminimax, evaluation functions, and modeling assumptions. I’ll also inspect the referenced video and compare authoritative course materials.
>
> **Planned research resources**
>
> 
>
> **Mapping course materials**
>
> I’ve found that the requested headings align closely with a Stanford AI course sequence. I’m now checking the referenced lecture, matching each topic to official notes, and collecting complementary university resources and clear examples.
>
> **Mapped course materials**
>
> 
>
> **Verifying course alignment**
>
> The course sequence appears to be Stanford’s game-playing module, covering overview, modeling, evaluation, expectimax, and minimax. I’m tying those headings to official notes while checking the referenced lecture independently.
>
> **Verified course alignment**
>
> 
>
> **Searched 11 websites**
>
> 
>
> **Refining source coverage**
>
> I’m expanding beyond the Stanford sequence to include Berkeley, MIT, Russell–Norvig, and DeepMind materials. I’m also separating exact lecture coverage from broader supporting resources so the final guide stays accurate.
>
> **Curating learning resources**
>
> I’m assembling a source map that distinguishes exact lecture matches from broader references. The final guide will connect Stanford’s sequence with Berkeley, MIT, textbooks, and practical assignments, while noting which materials I could verify directly.
>
> **Refined source coverage and curated learning resources**
>
> 
>
> **Organizing the resource guide**
>
> I’m preparing a structured guide with exact Stanford matches, supporting Berkeley and textbook resources, practical assignments, core equations, a small game-tree example, and a realistic presentation sequence.
>
> **Organized the resource guide**
>
> 
>
> **Connecting game-search resources**
>
> I’m ready to synthesize the verified course sequence, complementary references, core equations, and presentation plan into one coherent guide, while clearly separating exact matches from broader supporting materials.
>
> **Synthesizing the guide**
>
> I’m connecting the mathematics, A/B/C game examples, teaching questions, slide sequence, and source map into a coherent explanation, with a practical path for presenting and studying the material.
>
> **Clarifying search models**
>
> I’m distinguishing shortest-path search from game search: one optimizes action sequences and costs, while the other optimizes strategies against opponents or chance. I’ll define states, actions, transitions, utilities, policies, and the assumptions behind each recurrence.
>
> **Clarifying game evaluation**
>
> I’m distinguishing policy evaluation from heuristic evaluation: the first scores a fixed strategy under modeled opponents or chance; the second estimates unfinished positions. I’ll also compare A/B/C outcomes, risk sensitivity, minimax guarantees, expectimax assumptions, and a concise slide sequence.
>
> **Synthesized a guide on game search and evaluation models**
>
> 
>
> **Searched 15 websites**
>
> 
>
> **Searched 1 website**
>
> 
>
> Worked for 2m 47s

# Nghiên cứu chuyên sâu: Games 1 - Foundations of Artificial Intelligence

Phạm vi: Overview · Modeling · Game Evaluation · Expectimax · Minimax

Mình đã tìm được một bộ tài liệu rất sát với yêu cầu của bạn: **Games 1 - Stanford CS221: Artificial Intelligence: Principles and Techniques**\. Đặc biệt, trong chương trình Stanford mùa xuân 2026, học phần Games 1 được chia thành đúng năm nội dung mà nhóm bạn đang phải thuyết trình. \[[Modules](https://stanford-cs221.github.io/spring2026/modules/?utm_source=chatgpt.com)\]

Điểm quan trọng nhất là: **bài này không đơn thuần dạy cách cho máy tính chơi cờ hay cách tính Minimax. Nó nghiên cứu việc một AI ra quyết định tối ưu khi kết quả hành động còn phụ thuộc vào quyết định của những tác nhân khác.**

Đây cũng là hướng mình nghĩ cần ưu tiên để đáp ứng yêu cầu của thầy: hiểu được bản chất của bài toán, vì sao cần mô hình hóa như vậy, và tại sao mỗi thuật toán lại được xây dựng từ những giả định khác nhau.

## 1\. Những nguồn tài liệu nên sử dụng

[![PPT - Artificial Intelligence PowerPoint Presentation, free download - ID:2427013](https://images.openai.com/static-rsc-4/w3pVKq6dbxyMmRgOgSHtHnJR18w4Dsh4UNA9dbEacb25R40DKAjpdyODmlqwUe5P9czI5xvSRuOUY_tAdAKQ-2zj_7UKz8HarB5Af2Vw5KQ3NZRK-_pzJEAqLm6x5t-VEp48gg2j8Htlza5_FRNewgvOIJ6S-mKwpHkKIdD_nWZJodJdsxxeKRt1IDUNOsNY?purpose=fullsize)](https://www.slideserve.com/sanne/artificial-intelligence)

**1\. Stanford CS221 - Games 1**

Nguồn chính · Khớp cả 5 phần · Ưu tiên cao nhất

Tài liệu gốc về modeling, game evaluation, expectimax, minimax, cùng ví dụ ba hộp số và Halving Game.

[Chương trình CS221 2026](https://stanford-cs221.github.io/spring2026/modules/?utm_source=chatgpt.com) · [Slide Games 1 (PDF, 2023)](https://stanford-cs221.github.io/spring2023-extra/modules/games/games1-6pp.pdf?utm_source=chatgpt.com)

---

[![PPT - Games: Expectimax PowerPoint Presentation, free download - ID:5503606](https://images.openai.com/static-rsc-4/0oMvWXL8ivY6bB3x-FPxkQpQjyUHy8pYCZK1BYNWreGi3KfA8U_XWA3-xLdXk1OqJHs6qH81cefUK7170B4CwsWfUjddSR-2HVV_PjRjVRuso-RSADe1VIvERIZI4u88YH5TeHEhMiINs2KVc6fBPf4PwSk1EnrhYotykJiUy_FIPVH6DT628reCKLwweuUc?purpose=fullsize)](https://www.slideserve.com/donoma/games-expectimax)

**2\. UC Berkeley CS188 - Games**

Nguồn kiểm chứng và mở rộng thuật toán

Giải thích game trees, minimax, expectimax, adversarial search và mối liên hệ với các bài toán search thông thường.

[CS188 Games](https://inst.eecs.berkeley.edu/~cs188/textbook/games/summary.html?utm_source=chatgpt.com) · [Lecture Notes (PDF)](https://berkeleyai.github.io/cs188-website/assets/notes/n3.pdf?utm_source=chatgpt.com)

---

[![Brand New Paperback - Artificial Intelligence: A Modern Approach, 4Th Edition with Easy Returns and Replacements - Walmart.com](https://images.openai.com/static-rsc-4/qms85inZT7QWAOgmg7JdNYzwdljbOCeiY0IzXZN2t_Nay00lTEzYa6DbYbHV2muEMnrhOag1qu_Fe8duFP45YqufcjKfPDqTcBg_1AInNdy2elhPUaOnY38h0XKK997KuhZcSNw50zs1MsAu2qilK57QDTzqQFtDQTrQyi-a4zhu62mCPxU64_245h2C-x_k?purpose=fullsize)](https://www.walmart.com/ip/1078688796)

**3\. Artificial Intelligence: A Modern Approach - Russell &amp; Norvig**

Giáo trình nền tảng · Dùng để đào sâu lý thuyết

Chương 5: Adversarial Search and Games. Đặc biệt mục 5.1-5.3 về zero-sum games, minimax, alpha-beta và evaluation functions.

[Trang giáo trình chính thức](https://aima.cs.berkeley.edu/?utm_source=chatgpt.com) · [Mục lục chi tiết](https://aima.eecs.berkeley.edu/contents.html?utm_source=chatgpt.com)

---

**4\. Carnegie Mellon University - Search and Games**

Bổ sung định nghĩa, công thức và phân tích độ phức tạp của Minimax, Expectimax, Expectiminimax. Hữu ích khi chuẩn bị vấn đáp.

[CMU 15-281 Course Notes](https://www.cs.cmu.edu/~15281/coursenotes/search/?utm_source=chatgpt.com)

---

**5\. Berkeley CS188 - Multi-Agent Pacman Project (Fall 2026)**

Bài thực hành triển khai Minimax và Expectimax, so sánh hành vi của Pacman trước những con ma chơi tối ưu hoặc ngẫu nhiên. Phù hợp để làm demo cuối bài.

[Project 2: Multi-Agent Search](https://inst.eecs.berkeley.edu/~cs188/fa26/projects/proj2/?utm_source=chatgpt.com)

Các tài liệu trên đều là nguồn chính thức từ trường đại học hoặc giáo trình, không phải các bài viết diễn giải thứ cấp. \[[\| Games --- \| --- Course plan • This lecture will](https://stanford-cs221.github.io/spring2023-extra/modules/games/games1-6pp.pdf?utm_source=chatgpt.com); [CS 188                     Introduction to Artificial Intelligence](https://berkeleyai.github.io/cs188-website/assets/notes/n3.pdf?utm_source=chatgpt.com); [Search and Games](https://www.cs.cmu.edu/~15281/coursenotes/search/?utm_source=chatgpt.com); [Project 2](https://inst.eecs.berkeley.edu/~cs188/fa26/projects/proj2/?utm_source=chatgpt.com); [Artificial Intelligence: A Modern Approach, 4th US ed.](https://aima.cs.berkeley.edu/?utm_source=chatgpt.com)\]

## 2\. Video tham khảo

[![Free Video: Introduction to Artificial Intelligence: MiniMax and AlphaBeta Search - Lecture 9 from Dave Churchill | Class Central](https://images.openai.com/static-rsc-4/g-Gn2SqnA1ps2-jcePuYJfldnFb8nGoj-RpYEhxh3pQBWsSF3ZAl8XOw1Y7mIir14y6xOeU_hhrfavXZ7WKiB99lMfLmj2hNzFlW66AOr5E6NngFw5l4ZXNAexEArpM0ME9wd4LvbqXEY6BbbysR3EUIpzRmPEYSkh4433oeaH_kjecLECxOILptHeTYKrge?purpose=fullsize)](https://www.classcentral.com/course/youtube-comp-3200-6980-intro-to-artificial-intelligence-lecture-09-minimax-alphabeta-search-428379)

**[Stanford CS221 — Game Playing 1](https://www.youtube.com/watch?v=3pU-Hrz_xy4&utm_source=chatgpt.com)**

Stanford Online · Percy Liang và Dorsa Sadigh · Video công bố năm 2020

Đây là video bài giảng đã xác minh được, có nội dung tương ứng với đề tài. Các mốc quan trọng\:

| Thời điểm | Nội dung |
|--------|--------|
| 02:09 | A Simple Game |
| 04:01 | Game Tree |
| 05:05 | Two-player Zero-sum Games |
| 22:33 | Game Evaluation |
| 29:01 | Expectimax |
| 33:51 | Minimax Policies |
| 34:21 | Halving Game |

\[[Game Playing 1 - Minimax, Alpha-beta Pruning \| Stanford CS221: AI (Autumn 2019)](https://www.youtube.com/watch?v=3pU-Hrz_xy4&utm_source=chatgpt.com)\]

Đối với [video reference bạn gửi](https://www.youtube.com/watch?v=SMOD_GiRzb8&utm_source=chatgpt.com), hiện mình chưa truy xuất được nội dung hoặc transcript để đối chiếu chính xác. Vì vậy, mình không gán nội dung của video đó cho những chủ đề chưa được xác minh. Video Stanford ở trên là nguồn thay thế có nội dung tương ứng đã kiểm tra.

---

## 3\. Trọng tâm thực sự của bài Games 1 là gì?

Mình đề xuất bắt đầu từ câu hỏi\:

**Khi một AI không thể kiểm soát tất cả những gì xảy ra trong tương lai, làm thế nào để nó vẫn đưa ra quyết định tốt nhất?**

Câu hỏi này kết nối trực tiếp nội dung Games 1 với các phần Search và Markov Decision Processes (MDPs) trong môn Cơ sở AI.

### 3.1. Từ bài toán tìm đường đi ngắn nhất đến bài toán ra quyết định

Ví dụ, xét bài toán tìm đường đi ngắn nhất từ $S$ đến $G$\. Ở mức tổng quát, ta không chỉ đang tìm một con đường trên bản đồ, mà đang giải một **bài toán tối ưu hóa trên tập các chuỗi hành động hợp lệ**\.

$$
p^*=\underset{p\in\mathcal P(S,G)}{\arg\min}\ C(p)
$$

Trong đó\:

- $\mathcal P(S,G)$\: tập các đường đi hợp lệ từ $S$ đến $G$\.
- $C(p)$\: tổng chi phí của đường đi $p$\.
- $p^*$\: đường đi có chi phí nhỏ nhất.

Cái bản đồ chỉ là cách biểu diễn vấn đề. Cốt lõi là tìm một nghiệm tối ưu thỏa mãn những ràng buộc của bài toán.

Bây giờ, giả sử chúng ta không còn toàn quyền lựa chọn đường đi. Có một đối thủ có thể chặn một số hướng sau khi quan sát quyết định của chúng ta.

Khi đó, phương án tốt nhất không còn phụ thuộc duy nhất vào hành động của ta.

| Mô hình | Ai quyết định diễn biến? | Ta đang tìm gì? |
|--------|--------|--------|
| Search | Agent kiểm soát hành động | Chuỗi hành động dẫn tới mục tiêu |
| MDP | Agent hành động, môi trường có xác suất chuyển trạng thái đã mô hình hóa | Policy tối ưu theo kỳ vọng |
| Games | Agent và các tác nhân khác cùng ra quyết định | Policy tối ưu có xét đến chiến lược các tác nhân khác |

Đây là lý do Stanford đặt Game Playing sau Search và MDPs: **mức độ phức tạp của quyết định tăng lên khi agent mất quyền kiểm soát các yếu tố ảnh hưởng đến kết quả**\. \[[\| Games --- \| --- Course plan • This lecture will](https://stanford-cs221.github.io/spring2023-extra/modules/games/games1-6pp.pdf?utm_source=chatgpt.com); [3.1 Games](https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html?utm_source=chatgpt.com); [CS221 Course](https://bulletin.stanford.edu/courses/1057301?utm_source=chatgpt.com)\]

Một công thức thể hiện rất rõ sự chuyển đổi là\:

$$
\underbrace{\min_{p}C(p)}_{\text{Shortest-path optimization}}
\quad\longrightarrow\quad
\underbrace{\max_{\pi_A}\min_{\pi_B}U(\pi_A,\pi_B)}_{\text{Adversarial optimization}}
$$

Trong Game, ta không còn chỉ tìm một đường đi $p$, mà cần tìm một **chiến lược $\pi_A$** để ứng phó với những hành động khác nhau của đối thủ.

Đó chính là ý nghĩa sâu hơn mà nhóm nên nhấn mạnh.

## 4\. Ví dụ xuyên suốt cả bài: Trò chơi ba hộp của Stanford

Mình khuyên dùng ví dụ này làm trục chính cho toàn bộ bài thuyết trình, thay vì mỗi thuật toán lại dùng một ví dụ hoàn toàn khác.

Bạn chọn một hộp. Đối thủ chọn một số bên trong hộp đó. Mục tiêu của bạn là tối đa hóa số nhận được.

---

Thử thay đổi giả định về đối thủ\:

- Hợp tác
- Ngẫu nhiên
- Chống đối
Current selection unavailable.

Chọn hộp

V =

Ví dụ và các giá trị dựa trên Stanford CS221 Games 1.

Vì sao ví dụ này quan trọng?

Cùng một tập hành động, cùng một kết quả có thể xảy ra, nhưng chỉ cần thay đổi **mô hình hành vi đối thủ**, quyết định tối ưu đã thay đổi hoàn toàn.

Đó là cầu nối tự nhiên giữa Game Evaluation, Expectimax và Minimax. \[[\| Games --- \| --- Course plan • This lecture will](https://stanford-cs221.github.io/spring2023-extra/modules/games/games1-6pp.pdf?utm_source=chatgpt.com)\]

---

## 5\. Nội dung kiến thức bắt buộc phải nắm trong từng phần

### Part 1 - Overview: Why do we need games?

Không nên chỉ giới thiệu lịch sử AI chơi cờ. Phần này cần trả lời ba vấn đề\:

**Thứ nhất: Games khác gì Search?**

Trong Search, agent có thể tự quyết định chuỗi hành động của mình. Trong Games, hành động của những người chơi khác cũng làm thay đổi trạng thái tương lai.

**Thứ hai: Game là bài toán ra quyết định, không chỉ là trò chơi giải trí.**

Ví dụ về an ninh mạng, nơi bên phòng thủ và bên tấn công có những mục tiêu mâu thuẫn nhau. Tùy cách mô hình hóa, đây có thể là một bài toán ra quyết định mang tính đối kháng.

**Thứ ba: Tại sao cần Game Theory và Adversarial Search?**

Vì khi đối thủ có quyền lựa chọn, ta không thể mặc định tương lai sẽ diễn ra theo hướng tốt nhất cho mình.

**Thông điệp chính cần đưa lên slide\:**

> The optimal decision depends not only on our available actions, but also on how other agents behave.

Đọc: [Berkeley - 3.1 Games](https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html)\.

### Part 2 - Modeling: How do we mathematically represent a game?

Đây là phần rất nên đầu tư vì Modeling quyết định toàn bộ thuật toán phía sau có giải đúng vấn đề hay không.

Trong mô hình Stanford, một game có thể được mô tả bằng các thành phần\:

| Thành phần | Ý nghĩa |
|--------|--------|
| $s_0$ | Trạng thái bắt đầu |
| $S$ | Tập trạng thái |
| $Players$ | Tập người chơi |
| $Player(s)$ | Người có lượt tại trạng thái $s$ |
| $Actions(s)$ | Những hành động hợp lệ tại $s$ |
| $Succ(s,a)$ | Trạng thái kế tiếp sau hành động $a$ |
| $IsEnd(s)$ | Kiểm tra trò chơi kết thúc |
| $Utility(s)$ | Giá trị kết quả tại trạng thái kết thúc, nhìn từ agent |

Trong trò chơi hai người tổng bằng không (*two-player zero-sum game*\)\:

$$
U_{\text{agent}}(s)=-U_{\text{opponent}}(s)
$$

Do đó, khi agent muốn tăng utility, đối thủ muốn giảm chính giá trị đó. \[[\| Games --- \| --- Course plan • This lecture will](https://stanford-cs221.github.io/spring2023-extra/modules/games/games1-6pp.pdf?utm_source=chatgpt.com)\]

**Điểm sâu nên giải thích\:** Một state phải chứa đủ thông tin để xác định các hành động hợp lệ và trạng thái kế tiếp. Ví dụ, trong cờ vua, chỉ có vị trí các quân cờ là chưa đủ; còn phải biết ai đang đến lượt, cùng các quyền và thông tin lịch sử cần thiết theo luật cờ.

#### Policy khác gì một đường đi?

$$
\pi(s)=a
$$

Policy là quy tắc chọn hành động theo trạng thái.

Một đường đi cố định chỉ mô tả một diễn biến có thể xảy ra. Nhưng một policy có thể trả lời: nếu đối thủ làm A, ta làm gì; nếu đối thủ làm B, ta làm gì.

Đây là một sự khác biệt quan trọng giữa lời giải của bài toán Search thông thường và Games.

### Part 3 - Game Evaluation: If both players follow fixed policies, what happens?

Đây là một phần rất dễ bị nhầm lẫn.

Giả sử agent sử dụng policy $\pi_A$, đối thủ sử dụng policy $\pi_B$\.

Ta muốn tính\:

$$
V^{\pi_A,\pi_B}(s)
=
\mathbb E[U(s_T)\mid s,\pi_A,\pi_B]
$$

Nói đơn giản: khi cả hai bên đã có chiến lược, giá trị kỳ vọng cuối cùng của trò chơi là bao nhiêu?

Đối với stochastic policies, công thức đệ quy là\:

$$
V(s)=
\begin{cases}
U(s), & IsEnd(s)\\[4pt]
\displaystyle\sum_a\pi_A(a\mid s)V(Succ(s,a)),
& Player(s)=A\\[8pt]
\displaystyle\sum_a\pi_B(a\mid s)V(Succ(s,a)),
& Player(s)=B
\end{cases}
$$

Ở đây, chúng ta **chưa tìm policy tối ưu**\. Chúng ta chỉ đánh giá kết quả của hai policy đã xác định. Đây chính là điểm tương đồng với *policy evaluation* trong MDPs. \[[\| Games --- \| --- Course plan • This lecture will](https://stanford-cs221.github.io/spring2023-extra/modules/games/games1-6pp.pdf?utm_source=chatgpt.com)\]

Ví dụ: Agent luôn chọn hộp A, đối thủ chọn hai số với xác suất bằng nhau.

$$
V(A)=\frac12(-50)+\frac12(50)=0
$$

Giá trị game bằng 0, nhưng điều này không có nghĩa agent luôn nhận được 0 trong từng lần chơi.

Đó là giá trị trung bình theo phân phối của các kết quả.

Phân biệt hai thuật ngữ đặc biệt quan trọng

| Game Evaluation | Evaluation Function |
|--------|--------|
| Đánh giá giá trị của game khi đã biết các policy | Ước lượng giá trị của trạng thái |
| Chủ đề trong Games 1 | Phần tiếp theo trong Games 2 |
| Có thể tính chính xác bằng đệ quy nếu mô hình hữu hạn, đã biết | Thường là heuristic xấp xỉ khi không thể tìm kiếm đến trạng thái kết thúc |

### Part 4 - Expectimax: What if the opponent follows a known probabilistic policy?

Bây giờ, ta giữ policy của đối thủ là cố định nhưng muốn tìm policy tối ưu cho agent.

Đây là bước nâng cấp từ **evaluation** sang **optimization**\.

$$
V_{\mathrm{exp}}(s)=
\begin{cases}
U(s), & IsEnd(s)\\[4pt]
\displaystyle\max_{a\in Actions(s)}
V_{\mathrm{exp}}(Succ(s,a)), & Player(s)=A\\[8pt]
\displaystyle\sum_{a\in Actions(s)}
\pi_B(a\mid s)V_{\mathrm{exp}}(Succ(s,a)),
& Player(s)=B
\end{cases}
$$

Tại agent node, chọn hành động mang lại giá trị cao nhất.

Tại opponent/chance node, sử dụng kỳ vọng theo phân phối xác suất đã biết hoặc đã giả định.

Với ví dụ ba hộp và đối thủ chọn đều hai số\:

$$
\begin{aligned}
V(A)&=0\\
V(B)&=2\\
V(C)&=5
\end{aligned}
$$

Do đó\:

$$
V_{\mathrm{exp}}(s_0)=\max(0,2,5)=5
$$

Expectimax chọn hộp C.

**Ý nghĩa\:** Không phải Expectimax luôn thích mạo hiểm; nó tối đa hóa *expected utility* theo mô hình xác suất. Nếu mô hình xác suất không phản ánh đúng đối thủ thực tế, policy tìm được có thể kém hiệu quả.

Nguồn: [Berkeley - 3.3 Expectimax](https://inst.eecs.berkeley.edu/~cs188/textbook/games/expectimax.html)\. \[[3.3 Expectimax](https://inst.eecs.berkeley.edu/~cs188/textbook/games/expectimax.html?utm_source=chatgpt.com)\]

### Part 5 - Minimax: What if we cannot trust the opponent?

Trong thực tế, ta thường không biết chính xác chính sách của đối thủ.

Minimax đưa ra một giả định thận trọng: đối thủ luôn chọn hành động bất lợi nhất cho agent.

$$
V_{\mathrm{minimax}}(s)=
\begin{cases}
U(s), & IsEnd(s)\\[4pt]
\displaystyle\max_{a\in Actions(s)}
V_{\mathrm{minimax}}(Succ(s,a)),& Player(s)=A\\[8pt]
\displaystyle\min_{a\in Actions(s)}
V_{\mathrm{minimax}}(Succ(s,a)),& Player(s)=B
\end{cases}
$$

Đối với trò chơi ba hộp\:

$$
\begin{aligned}
V(A)&=\min(-50,50)=-50\\
V(B)&=\min(1,3)=1\\
V(C)&=\min(-5,15)=-5
\end{aligned}
$$

Suy ra\:

$$
\boxed{V_{\mathrm{minimax}}(s_0)=\max(-50,1,-5)=1}
$$

Minimax chọn hộp B, vì bất kể đối thủ chọn số nào trong B, agent vẫn nhận ít nhất 1 điểm.

Đây là bản chất của **worst-case optimization**\: tìm chính sách tối ưu khi phải đối mặt với phản ứng bất lợi nhất.

Trong phạm vi trò chơi xác định, hữu hạn, hai người và zero-sum đang xét, nguyên lý này cho agent một bảo đảm đối với đối thủ bất kỳ khi agent thực hiện đúng policy Minimax. \[[\| Games --- \| --- Course plan • This lecture will](https://stanford-cs221.github.io/spring2023-extra/modules/games/games1-6pp.pdf?utm_source=chatgpt.com)\]

Một điểm kỹ thuật cần hiểu là Minimax tìm bằng cách duyệt cây game, thường theo DFS. Nếu $b$ là branching factor và $m$ là độ sâu cây, thời gian tìm kiếm đầy đủ có thể là\:

$$
T(m)=O(b^m)
$$

Đây là lý do các kỹ thuật như alpha-beta pruning và depth-limited search xuất hiện ở phần tiếp theo.

Nguồn: [Berkeley - 3.2 Minimax](https://inst.eecs.berkeley.edu/~cs188/textbook/games/minimax.html)\.

---

## 6\. Mối quan hệ giữa ba thuật toán - phần nên dùng làm kết luận học thuật

|  | Game Evaluation | Expectimax | Minimax |
|--------|--------|--------|--------|
| Agent policy | Đã biết | Cần tối ưu | Cần tối ưu |
| Opponent policy | Đã biết | Đã biết/được mô hình hóa | Không cần biết cụ thể |
| Agent node | Expected value | MAX | MAX |
| Opponent node | Expected value | Expected value | MIN |
| Kết quả | Giá trị của cặp policy | Policy tối đa hóa kỳ vọng | Policy bảo đảm trường hợp xấu nhất |

Quan hệ của ba bài toán thể hiện qua\:

$$
\underbrace{V(\pi_A,\pi_B)}_{\text{Evaluation}}
$$

$$
\underbrace{\max_{\pi_A}V(\pi_A,\pi_B)}_{\text{Expectimax, fixed }\pi_B}
$$

$$
\underbrace{\max_{\pi_A}\min_{\pi_B}V(\pi_A,\pi_B)}_{\text{Minimax}}
$$

Điểm đáng chú ý là **cả ba vẫn sử dụng cơ chế tính giá trị đệ quy trên game tree**\. Điều thay đổi nằm ở cách mỗi tác nhân đưa ra lựa chọn tại node của mình.

Đó chính là điều nên làm nổi bật khi thuyết trình: các thuật toán không phải những công thức tách biệt, mà là các lời giải cho những phiên bản khác nhau của cùng một vấn đề ra quyết định.

## 7\. Dàn ý slide đề xuất

Nếu chưa có giới hạn về thời gian, mình đề xuất khoảng 15 slide nội dung chính, không tính trang tài liệu tham khảo.

| Slide | Nội dung | Mục đích |
|--------|--------|--------|
| 1 | Games 1: From Search to Strategic Decision-Making | Đặt vấn đề |
| 2 | Why Standard Search Is Not Enough | Giải thích lý do xuất hiện Games |
| 3 | The Three-Bin Game | Đưa ra bài toán trung tâm |
| 4 | Why the Opponent Model Matters | Cho thấy giả định ảnh hưởng quyết định |
| 5 | Formalizing a Game | Định nghĩa toán học |
| 6 | Game Trees, States, Actions and Policies | Diễn giải biểu diễn |
| 7 | Two-Player Zero-Sum Games | Làm rõ giả định |
| 8 | Game Evaluation: Fixed Policies | Bài toán đánh giá |
| 9 | Game Evaluation Recurrence | Giải công thức và ví dụ |
| 10 | Expectimax: Optimizing Expected Utility | Động cơ hình thành |
| 11 | Expectimax: Worked Example | Tính toán cây game |
| 12 | Minimax: The Worst-Case Principle | Động cơ hình thành |
| 13 | Minimax: Worked Example | Tính toán cây game |
| 14 | Game Evaluation vs Expectimax vs Minimax | So sánh bản chất |
| 15 | Key Insights, Assumptions and Limitations | Kết luận, dẫn đến Games 2 |

Ở mỗi phần thuật toán, nên đi theo mạch\:

**Problem → Assumption → Mathematical formulation → Worked example → Interpretation → Limitation.**

Thay vì trình bày công thức trước, hãy cho người nghe thấy vì sao công thức đó cần tồn tại.

## 8\. Những câu hỏi thầy có thể đặt ra

Đây là các câu hỏi mình đánh giá quan trọng nhất để chuẩn bị vấn đáp.

## 9\. Tài liệu nên đọc theo đúng từng phần

Để không mất quá nhiều thời gian đọc lan man, mình gợi ý đối chiếu các mục này trong slide Stanford Games 1 và textbook Berkeley.

| Phần | Stanford CS221 - số slide trong PDF 2023 | Berkeley CS188 |
|--------|--------|--------|
| Overview | Khoảng slide 2-6 | [3.1 Games](https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html) |
| Modeling | Khoảng slide 8-20 | [Game formulation](https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html) |
| Game Evaluation | Khoảng slide 22-26 | Stanford là nguồn sát nhất |
| Expectimax | Khoảng slide 28-32 | [3.3 Expectimax](https://inst.eecs.berkeley.edu/~cs188/textbook/games/expectimax.html) |
| Minimax | Khoảng slide 36-44 | [3.2 Minimax](https://inst.eecs.berkeley.edu/~cs188/textbook/games/minimax.html) |

Các mốc là số slide hiển thị trong bản Stanford 2023, không phải số trang vật lý của PDF dạng 6 slide/trang.

Nếu muốn tăng chất lượng bài thuyết trình, có thể sử dụng hai ví dụ bổ trợ: **Halving Game** của Stanford để chứng minh cách mô hình hóa game bằng trạng thái và hành động, và **Pacman** của Berkeley để minh họa hành vi Minimax so với Expectimax.

## Kết luận và hướng chuẩn bị

Mình đề xuất sử dụng **Stanford CS221 làm xương sống toàn bộ bài thuyết trình**, Berkeley CS188 để bổ sung trực quan và các bước thuật toán, còn *Artificial Intelligence: A Modern Approach* để kiểm tra định nghĩa, giả định và tính đúng đắn.

Một câu kết luận có thể định hướng cho cả bài là\:

> Games 1 is fundamentally about finding optimal decision-making policies in multi-agent environments, where the best action depends on both the agent's objectives and assumptions about other agents' behavior.

Nếu nhóm thực sự hiểu được vì sao chuyển từ *đường đi* sang *policy*, từ *đánh giá một policy* sang *tối ưu policy*, rồi từ *kỳ vọng* sang *bảo đảm worst-case*, thì các bạn đã nắm được ý tưởng trung tâm của Games 1, chứ không chỉ thuộc công thức Expectimax và Minimax.

## Prompt:
11/7/2026, 10:12:20 AM

![image(20261107-031158).png](https://chatgpt.com/backend-api/estuary/content?id=file_000000004c688206b5dec67fa696a91b&fn=image%2820261107-031158%29.png&cd=attachment&ts=498339&p=fs&cid=1&sig=9f4b40b36a2d4a371cff88dcc907812e87d6322e7a4e53a3bed138e47f7c9c92&v=0)

bạn tìm ra các nguồn liên quan giải thích theo yêu cầu của thầy đi

## Response:
11/7/2026, 10:12:30 AM

Mình sẽ truy nguồn cho từng luận điểm trong ảnh: biểu diễn bài toán bằng đồ thị trạng thái, lời giải như một đường đi, ba thành phần $S_0$–$S_n$–phép chuyển, và suy diễn tiến/lùi. Đồng thời mình sẽ đối chiếu với tài liệu về Game để phân biệt phần nào đúng cho bài toán tìm kiếm thông thường và phần nào phải mở rộng khi có đối thủ.

> **Refining research**
>
> I’m narrowing the research around forward versus backward reasoning, checking authoritative sources, and sharpening the conceptual distinctions. I’m also testing examples that separate paths, plans, costs, branching, and uncertainty.
>
> **Refined research**
>
> 
>
> **Extending the comparison**
>
> I’m continuing with game trees and backward reasoning, while keeping their meanings distinct. I’ll map each claim to reliable sources and use a small example showing why a strategy differs from a single path.
>
> **Extended the comparison**
>
> 
>
> **Finalizing the framework**
>
> I’m consolidating the distinctions into a source-backed explanation: paths versus policies, forward versus backward reasoning, and deterministic versus adversarial game trees, with a compact worked example.
>
> **Finalized the framework**
>
> 
>
> **Searched 8 websites**
>
> 
>
> Worked for 2m 2s

# Nguồn học thuật về bản chất bài toán Game và tư duy tìm kiếm trên không gian trạng thái

Sau khi đối chiếu nội dung trong ảnh với tài liệu của UC Berkeley, Stanford và giáo trình *Artificial Intelligence: Foundations of Computational Agents*, mình thấy cách tiếp cận mà thầy yêu cầu có cơ sở học thuật rất rõ ràng.

**Điểm quan trọng\:** Thầy đang muốn các bạn giải thích được bản chất của việc giải quyết bài toán bằng AI, chứ không chỉ trình bày định nghĩa Game, công thức Expectimax và Minimax.

Mạch kiến thức nên là\:

**Problem Formulation**

Bài toán thực sự yêu cầu tìm cái gì?

**State Space Representation**

Biểu diễn bài toán bằng trạng thái và phép chuyển

**Search and Optimization**

Tìm nghiệm hợp lệ hoặc nghiệm tối ưu

**Adversarial Search**

Mở rộng sang trường hợp có nhiều tác nhân cùng quyết định

Mình đã tìm được các nguồn chính thống giải thích trực tiếp những luận điểm trong ảnh.

## 1\. Nguồn quan trọng nhất: Biểu diễn bài toán thành tìm kiếm trên đồ thị

[![Artificial Intelligence: Foundations of Computational Agents 3/e \[Poole\] 9781009258197 滄海書局‧鼎隆圖書購書網](https://images.openai.com/static-rsc-4/KexSETEFAgNbAYAJm7Zhl2GeAZ-tlWLh2bC7HAfQg9Enq0zI5vB6WbRdWGV1C3YeuvddGRBVgUrMVqF0Ka-0jOdRmkgypxybm8ervvlf0yJYk6H3RxO-zFnpbHo1p-fzdge2bSPJPtLHJftoR1-8QFPSpDHisJh-3MOaJtjCtlnuHiwUc9HBuT-Q16oZTKjA?purpose=fullsize)](https://eshop.tsanghai.com.tw/products/cs0455h)

**Nguồn A - Artificial Intelligence: Foundations of Computational Agents**

David L. Poole &amp; Alan K. Mackworth, 3rd edition, 2023

[Chapter 3.1 - Problem Solving as Search](https://www.artint.info/3e/html/ArtInt3e.Ch3.S1.html)

[Chapter 3.3 — Graph Searching](https://www.artint.info/3e/html/ArtInt3e.Ch3.S3.html?utm_source=chatgpt.com)

Đây là nguồn sát nhất với nhận định của thầy rằng nhiều bài toán tưởng chừng khác nhau đều có thể được quy về một mô hình tìm kiếm trên đồ thị.

Chương 3.3 định nghĩa rõ: node có thể biểu diễn một trạng thái; cạnh biểu diễn một phép chuyển; một đường đi từ trạng thái đầu đến trạng thái đích biểu diễn một lời giải của bài toán tìm kiếm. \[[3.1 Problem Solving as Search ‣ Chapter 3 Searching for Solutions ‣ Artificial Intelligence: Foundations of Computational Agents, 3rd Edition](https://www.artint.info/3e/html/ArtInt3e.Ch3.S1.html?utm_source=chatgpt.com); [3.3 Graph Searching ‣ Chapter 3 Searching for Solutions ‣ Artificial Intelligence: Foundations of Computational Agents, 3rd Edition](https://www.artint.info/3e/html/ArtInt3e.Ch3.S3.html?utm_source=chatgpt.com)\]

### Ý nghĩa sâu hơn

Giả sử bạn phải giải ba bài toán\:

- Tìm đường từ TP.HCM đến Hà Nội.
- Giải một trò chơi xếp hình 8-puzzle.
- Điều khiển robot đưa một vật đến vị trí đích.

Trông chúng hoàn toàn khác nhau, nhưng có thể cùng được biểu diễn bằng mô hình\:

$$
\boxed{\text{Problem} \rightarrow \text{States} \rightarrow \text{Actions} \rightarrow \text{Goal}}
$$

Với mô hình tìm kiếm xác định, một lời giải là chuỗi hành động\:

$$
\pi=(a_0,a_1,\ldots,a_{n-1})
$$

sao cho\:

$$
S_0\xrightarrow{a_0}S_1\xrightarrow{a_1}\cdots
\xrightarrow{a_{n-1}}S_n
$$

và $S_n$ thỏa mãn điều kiện mục tiêu.

Lưu ý: $\pi$ ở đây ký hiệu một *kế hoạch hành động cố định*, không phải policy phụ thuộc trạng thái.

Nếu chỉ yêu cầu giải được bài toán, ta tìm một đường đi hợp lệ. Nếu yêu cầu tối ưu, ta phải xác định hàm chi phí\:

$$
\pi^*=\underset{\pi\in\Pi_{\mathrm{valid}}}{\arg\min}
\sum_{i=0}^{n-1}c(S_i,a_i,S_{i+1})
$$

Đây là chỗ cần diễn đạt chính xác nhận định **“lời giải là đường đi”**\: đúng trong mô hình tìm kiếm đường đi; không có nghĩa mọi bài toán AI đều bắt buộc có lời giải là một đường đi ngắn nhất.

## 2\. Nguồn về ba thành phần: Giả thiết - Kết luận - Phép chuyển

**Nguồn B - UC Berkeley CS188: State Spaces and Search Problems**

[Đọc tài liệu gốc của Berkeley](https://inst.eecs.berkeley.edu/~cs188/textbook/search/state.html)

Berkeley giải thích trực tiếp việc xây dựng một bài toán tìm kiếm bằng trạng thái đầu, không gian trạng thái, các hành động, mô hình chuyển trạng thái, chi phí và điều kiện đích. \[[1.2 State Spaces and Search Problems](https://inst.eecs.berkeley.edu/~cs188/textbook/search/state.html?utm_source=chatgpt.com)\]

Ba thành phần thầy đưa ra là một mô hình trực quan\:

| Cách diễn đạt của thầy | Thuật ngữ AI |
|--------|--------|
| Giả thiết $S_0$ | Initial State |
| Kết luận $S_n$ | Goal State / Goal Test |
| Phép chuyển $\rightarrow$ | Actions / Transition Model |

Tuy nhiên, khi trình bày học thuật, cần bổ sung rằng ba thành phần trên chưa phải toàn bộ một *search problem* đầy đủ.

Một cách biểu diễn mở rộng là\:

$$
P=(S,s_0,A,T,G,c)
$$

Trong đó $S$ là tập trạng thái, $s_0$ là trạng thái đầu, $A$ là các hành động, $T$ là mô hình chuyển trạng thái, $G$ là tập trạng thái đích, và $c$ là chi phí.

Điều này giúp bạn trả lời được câu hỏi thầy có thể đặt ra\:

**“Nếu cùng một trạng thái đầu và cùng một trạng thái đích, tại sao hai bài toán vẫn có thể khác nhau?”**

Vì chúng có thể khác nhau về tập hành động hợp lệ, luật chuyển trạng thái hoặc hàm chi phí. Do đó, không gian nghiệm và nghiệm tối ưu cũng thay đổi.

---

## 3\. Nguồn về suy diễn tiến và suy diễn lùi

Đây là phần mình nghĩ nhóm bạn nên nghiên cứu kỹ, vì nó tạo cầu nối rất tự nhiên giữa Search và Minimax.

**Nguồn C - Direction of Search**

[Poole &amp; Mackworth - Chapter 3.8.1](https://artint.info/3e/html/ArtInt3e.Ch3.S8.html)

Giải thích khi nào nên tìm kiếm từ trạng thái đầu, khi nào nên tìm ngược từ trạng thái đích, và sự khác nhau về branching factor. \[[3.8 Search Refinements ‣ Chapter 3 Searching for Solutions ‣ Artificial Intelligence: Foundations of Computational Agents, 3rd Edition](https://artint.info/3e/html/ArtInt3e.Ch3.S8.html?utm_source=chatgpt.com)\]

---

**Nguồn D - Forward Planning**

[Poole &amp; Mackworth — Chapter 6.2](https://artint.info/3e/html/ArtInt3e.Ch6.S2.html?utm_source=chatgpt.com)

Trình bày cách đi từ trạng thái ban đầu, áp dụng các hành động và tạo ra những trạng thái mới cho đến khi đạt mục tiêu. \[[6.2 Forward Planning ‣ Chapter 6 Deterministic Planning ‣ Artificial Intelligence: Foundations of Computational Agents, 3rd Edition](https://artint.info/3e/html/ArtInt3e.Ch6.S2.html?utm_source=chatgpt.com)\]

---

**Nguồn E - Regression Planning**

[Poole &amp; Mackworth — Chapter 6.3](https://artint.info/3e/html/ArtInt3e.Ch6.S3.html?utm_source=chatgpt.com)

Giải thích cách bắt đầu từ mục tiêu, truy ngược những điều kiện cần thỏa mãn để xác định hành động phải thực hiện trước đó. \[[6.3 Regression Planning ‣ Chapter 6 Deterministic Planning ‣ Artificial Intelligence: Foundations of Computational Agents, 3rd Edition](https://artint.info/3e/html/ArtInt3e.Ch6.S3.html?utm_source=chatgpt.com)\]

---

**Nguồn F - Artificial Intelligence: A Modern Approach**

[Russell &amp; Norvig — Chapter 11: Automated Planning](https://aima.cs.berkeley.edu/contents.html?utm_source=chatgpt.com)

Giáo trình phiên bản 4 cũng có hai phần riêng về *Forward State-Space Search* và *Backward Search for Planning*\. \[[aima.cs.berkeley.edu](https://aima.cs.berkeley.edu/contents?utm_source=chatgpt.com)\]

### 3.1. Forward Reasoning: Đi từ điều đã biết đến kết quả

Giả sử một robot muốn vận chuyển một hộp hàng từ phòng A đến phòng C.

Forward search

Sơ đồ minh họa: bắt đầu từ trạng thái hiện tại và tiến dần tới mục tiêu.

Ta biết\:

- Robot đang ở A.
- Robot có thể đi từ A đến B.
- Robot có thể đi từ B đến C.

Ta áp dụng các phép chuyển hợp lệ\:

$$
S_0\xrightarrow{Move(A,B)}S_1
\xrightarrow{Move(B,C)}S_2
$$

**Tư duy\:** Hiện tại ta đang ở đâu, ta có thể làm gì tiếp theo?

### 3.2. Backward Reasoning: Đi từ mục tiêu về điều kiện cần

Vẫn ví dụ đó, nhưng thay vì hỏi robot đi đâu từ A, ta hỏi\:

**Muốn hộp hàng ở C thì ngay trước đó phải có những điều kiện gì?**

Nếu hành động cuối cùng là đi từ B đến C, thì trước hành động đó, robot và hộp hàng phải ở B.

Muốn đến B từ A, robot cần ở A và thực hiện hành động tương ứng.

$$
Goal(C)
\Longleftarrow Precondition(Move(B,C))
$$

$$
\Longleftarrow Precondition(Move(A,B))
$$

Đến đây ta phát hiện những điều kiện cần thỏa mãn ngay trong trạng thái ban đầu.

Đây là tư duy *regression planning*\: đặt câu hỏi về những tiền điều kiện cần thiết để đạt mục tiêu.

Có một điểm nên phân biệt\:

- **Backward state-space search\:** Tìm ngược trên đồ thị bằng các cạnh đảo chiều hoặc hàm sinh trạng thái trước.
- **Regression planning\:** Tìm ngược qua các điều kiện mục tiêu và tiền điều kiện của hành động.
- **Backward chaining\:** Suy luận logic theo các luật và giả thiết để chứng minh một kết luận.

Chúng cùng mang tư duy đi từ mục tiêu về những điều kiện cần, nhưng không phải hoàn toàn là một thuật toán. Nếu muốn tìm hiểu thêm logic, bạn có thể xem [Berkeley — Forward Chaining](https://inst.eecs.berkeley.edu/~cs188/textbook/logic/forward.html?utm_source=chatgpt.com)\. \[[10.6 Forward Chaining](https://inst.eecs.berkeley.edu/~cs188/textbook/logic/forward.html?utm_source=chatgpt.com); [6.3 Regression Planning ‣ Chapter 6 Deterministic Planning ‣ Artificial Intelligence: Foundations of Computational Agents, 3rd Edition](https://artint.info/3e/html/ArtInt3e.Ch6.S3.html?utm_source=chatgpt.com)\]

### 3.3. Tại sao điều này liên quan đến Minimax?

Minimax sử dụng một cách xử lý mang tư duy ngược, thường được gọi là *backward induction*\.

Ta xây dựng game tree theo chiều từ trạng thái hiện tại đến các kết quả tương lai, rồi **tính giá trị ngược từ các node lá lên node gốc**\.

Tuy nhiên, cần nói rõ với thầy: backward induction trong Minimax không đồng nhất với backward state-space search.

Trong Minimax, ta đang truyền ngược các giá trị tối ưu, chứ không nhất thiết tìm các trạng thái tiền nhiệm từ mục tiêu.

---

## 4\. Nguồn nối trực tiếp State-Space Search với Games 1

**Nguồn G - UC Berkeley CS188: Games**

[Chapter 3.1 - Games](https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html)

Đây là nguồn nên đưa vào slide quan trọng nhất của phần Overview.

Berkeley trình bày sự chuyển đổi từ việc tìm một kế hoạch hành động trong bài toán Search sang tìm một chiến lược trong môi trường có đối thủ. \[[3.1 Games](https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html?utm_source=chatgpt.com)\]

### 4.1. Vẫn là đồ thị trạng thái, nhưng bản chất lời giải thay đổi

Trong Search thông thường\:

$$
S_0 \xrightarrow{a_0} S_1 \xrightarrow{a_1} S_2
\xrightarrow{a_2} S_G
$$

Agent tìm một chuỗi hành động đưa nó đến mục tiêu.

Nhưng trong Game\:

Ví dụ: Agent và Opponent thay phiên lựa chọn

Giá trị 5, 2, 1, 4 là một ví dụ minh họa tự xây dựng.

Ta có\:

$$
V(\text{MIN}_{left})=\min(5,2)=2
$$

$$
V(\text{MIN}_{right})=\min(1,4)=1
$$

Do đó\:

$$
V(\text{MAX})=\max(2,1)=2
$$

Agent chọn nhánh trái, vì kết quả tệ nhất mà đối thủ có thể buộc agent nhận được ở nhánh này là 2.

Điểm đáng chú ý: agent không chỉ lựa chọn dựa vào giá trị 5 ở lá bên trái. Nó còn phải dự đoán rằng đối thủ sẽ chọn lá 2 thay vì lá 5.

**Đây là sự khác biệt cốt lõi\:** một hành động tốt hay xấu phụ thuộc vào các phản ứng có thể xảy ra sau hành động ấy.

### 4.2. Từ một đường đi sang một Policy

Đối với Search\:

$$
\text{Solution}= (a_0,a_1,\ldots,a_n)
$$

Đối với Games\:

$$
\boxed{\text{Solution}=\pi^*:S\rightarrow A}
$$

Ở đây, $\pi^*$ là một policy xác định hành động phù hợp tại mỗi trạng thái ra quyết định của agent.

Chẳng hạn, nếu đối thủ chuyển sang phương án A thì agent đáp lại bằng X; nếu đối thủ chuyển sang phương án B thì agent đáp lại bằng Y.

Vì vậy, **một đường đi trong game tree chỉ thể hiện một diễn biến cụ thể của ván chơi, còn một policy có thể quy định hành động cho nhiều tình huống khác nhau**\.

Cũng cần lưu ý rằng chính sách ngẫu nhiên có dạng $\pi(a\mid s)$, tức phân phối xác suất trên các hành động. Còn với Minimax trong lớp trò chơi hữu hạn, xác định, hai người, zero-sum mà nhóm đang xét, ta có thể tìm một chính sách thuần tối ưu bằng phép tính max-min trên cây.

Nguồn bổ sung\:

- [Berkeley — Minimax](https://inst.eecs.berkeley.edu/~cs188/textbook/games/minimax.html?utm_source=chatgpt.com)
- [Berkeley — Expectimax](https://inst.eecs.berkeley.edu/~cs188/textbook/games/expectimax.html?utm_source=chatgpt.com)
- [Stanford CS221 - Games 1](https://stanford-cs221.github.io/spring2026/modules/)

\[[3.2 Minimax](https://inst.eecs.berkeley.edu/~cs188/textbook/games/minimax.html?utm_source=chatgpt.com); [3.3 Expectimax](https://inst.eecs.berkeley.edu/~cs188/textbook/games/expectimax.html?utm_source=chatgpt.com); [Modules](https://stanford-cs221.github.io/spring2026/modules/?utm_source=chatgpt.com)\]

---

## 5\. Những điểm trong bản tổng hợp cần diễn đạt chính xác hơn

Có bốn điểm mình khuyên nên làm rõ trước khi xây dựng slide, nhằm tránh những câu hỏi phản biện về mặt lý thuyết.

| Nhận định trong ảnh | Cách hiểu chính xác hơn |
|--------|--------|
| Mọi bài toán đều quy về tìm kiếm trên đồ thị | Rất nhiều bài toán AI có thể được mô hình hóa bằng tìm kiếm trên đồ thị, nhưng không phải lúc nào đó cũng là biểu diễn tự nhiên hoặc cách giải hiệu quả nhất. |
| Có bao nhiêu đường đi hợp lệ thì có bấy nhiêu lời giải | Trong path-based search, mỗi đường từ đầu đến đích là một phương án hợp lệ. Nhưng các phương án có thể có chi phí khác nhau và không nhất thiết đều tối ưu. |
| Đường đi ngắn nhất là đường có chi phí nhỏ nhất | Chỉ tương đương khi mọi bước có chi phí bằng nhau (hoặc một hằng số dương giống nhau). |
| Backward reasoning là đi ngược từ đích về đầu | Đây là trực giác đúng. Nhưng backward search cần khả năng xác định trạng thái tiền nhiệm; regression planning lại thao tác trên các điều kiện mục tiêu. |

Ví dụ, một đường đi có 1 cạnh với chi phí 10 không tối ưu so với đường đi có 2 cạnh, mỗi cạnh chi phí 1. Do đó, mục tiêu tối ưu phải được định nghĩa rõ.

Tương tự, với Game, không phải lúc nào cũng có một trạng thái đích duy nhất $S_n$\. Ta thường có tập các trạng thái kết thúc và hàm utility đánh giá kết quả\:

$$
U:S_{\mathrm{terminal}}\rightarrow\mathbb R
$$

Điều này dẫn đến một câu hỏi quan trọng: **khi có nhiều kết quả kết thúc khác nhau, thuật toán phải lựa chọn dựa trên tiêu chí nào?**

Và từ đây, cả Game Evaluation, Expectimax lẫn Minimax trở nên có ý nghĩa.

## 6\. Gắn yêu cầu của thầy vào năm phần Games 1

Mình đề xuất phân chia kiến thức theo bảng dưới đây. Nó giúp nhóm giữ đúng đề cương mà vẫn trình bày được bản chất lý thuyết thầy yêu cầu.

| Phần | Câu hỏi cần giải thích | Nguồn ưu tiên |
|--------|--------|--------|
| **Overview** | Vì sao giải quyết vấn đề có thể được xem như tìm kiếm? Tại sao Game khác Search? | Poole Ch. 3.1, Berkeley Games 3.1 |
| **Modeling** | Làm thế nào chuyển một game thành state-space graph và game tree? | Berkeley Search 1.2, Games 3.1 |
| **Game Evaluation** | Nếu biết chiến lược của các bên, tính giá trị game như thế nào? | Stanford CS221 Games 1 |
| **Expectimax** | Khi hành vi đối thủ có phân phối xác suất đã biết, tối ưu quyết định bằng cách nào? | Stanford CS221, Berkeley 3.3 |
| **Minimax** | Nếu đối thủ luôn tìm cách gây bất lợi nhất, làm thế nào tìm chiến lược tốt nhất? | Stanford CS221, Berkeley 3.2 |

Đặc biệt, cách tổ chức này tạo ra một chuỗi lập luận\:

$$
\text{Search}
\longrightarrow
\text{Game Modeling}
\longrightarrow
\text{Game Evaluation}
$$

$$
\longrightarrow
\begin{cases}
\text{Expectimax} & \text{Fixed opponent policy}\\
\text{Minimax} & \text{Worst-case opponent}
\end{cases}
$$

Không nên trình bày Forward/Backward Search thành một chương dài độc lập nếu nhóm chỉ được giao Games 1. Chúng nên đóng vai trò nền tảng để giải thích tại sao ta xây dựng game tree và có thể tính giá trị từ các trạng thái kết thúc quay ngược lên node gốc.

## 7\. Danh mục nguồn đọc theo mức ưu tiên

Các tài liệu cần đọc trước khi làm slide

**1\. Problem Solving as Search - Poole &amp; Mackworth**

Để hiểu phát biểu gốc của thầy về việc quy bài toán thành tìm kiếm nghiệm

[Đọc Chapter 3.1](https://www.artint.info/3e/html/ArtInt3e.Ch3.S1.html)

---

**2\. State Spaces and Search Problems - UC Berkeley**

Để hiểu trạng thái, phép chuyển, đồ thị và cây tìm kiếm

[Đọc Chapter 1.2](https://inst.eecs.berkeley.edu/~cs188/textbook/search/state.html)

---

**3\. Forward/Backward Search - Poole &amp; Mackworth**

Để hiểu hai hướng tư duy suy luận và ý nghĩa của chúng

[Đọc Chapter 3.8](https://artint.info/3e/html/ArtInt3e.Ch3.S8.html)

---

**4\. Games - UC Berkeley**

Để hiểu tại sao cần chiến lược thay vì một chuỗi hành động cố định

[Đọc Chapter 3.1](https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html)

---

**5\. Games 1 - Stanford CS221**

Tài liệu xây dựng nội dung chính của cả năm phần được giao

[Xem module Games 1](https://stanford-cs221.github.io/spring2026/modules/)

Các số tham khảo 1-6 trong ảnh bạn gửi không kèm tên tài liệu, nên mình chưa thể xác định chính xác chúng được trích từ công trình nào. Danh mục trên là những nguồn độc lập mình đã tìm và đối chiếu.

## 8\. Các câu hỏi tự kiểm tra trước khi thuyết trình

5 câu hỏi về bản chất

**Đề xuất cuối cùng\:** Phần mở đầu nên dành đủ thời gian để phân biệt ba khái niệm *state*, *solution path* và *policy*\. Đây là nền tảng giúp người nghe hiểu vì sao Game được xem là một dạng mở rộng của Search, và vì sao Expectimax, Minimax cần thiết.

Sau khi xây dựng được nền tảng này, phần công thức sẽ không còn là những phép tính MAX, MIN hay kỳ vọng rời rạc, mà trở thành những cách giải cụ thể cho bài toán lựa chọn chiến lược trong môi trường nhiều tác nhân.



---
Powered by [ChatGPT Exporter](https://www.chatgptexporter.com)