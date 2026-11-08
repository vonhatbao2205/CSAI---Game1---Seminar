# Transcript phụ đề tiếng Việt — 2 bài giảng Stanford CS221 (Lý thuyết trò chơi)

> Gồm 2 video: bài giảng CS221 *Games I* (Autumn 2025) và bài giảng *Game Playing 1 — Minimax, Alpha-beta Pruning* (Autumn 2019).
> Nội dung là lời giảng được chuyển thành văn bản từ phụ đề tiếng Anh có sẵn của kênh Stanford Online, rồi dịch sang tiếng Việt.
> Mốc thời gian `[hh:mm:ss]` ở đầu mỗi dòng cho biết thời điểm câu nói bắt đầu trong video. Bản dịch là dịch máy nên có thể còn chỗ chưa mượt.

## Mục lục

1. [Stanford CS221 | Autumn 2025 | Lecture 10: Games I](#stanford-cs221-autumn-2025-lecture-10-games-i) — https://youtu.be/SMOD_GiRzb8
2. [Game Playing 1 — Minimax, Alpha-beta Pruning | Stanford CS221: AI (Autumn 2019)](#game-playing-1-minimax-alpha-beta-pruning-stanford-cs221-ai-autumn-2019) — https://youtu.be/3pU-Hrz_xy4

## Stanford CS221 | Autumn 2025 | Lecture 10: Games I

- **Link:** https://youtu.be/SMOD_GiRzb8
- **Kênh:** Stanford Online — đăng ngày 09/03/2026
- **Thời lượng:** 01:13:24
- **Nguồn:** phụ đề gốc "English (United States)" (bản chuẩn của kênh) → dịch máy sang tiếng Việt, giữ nguyên mốc thời gian
- **Quy mô:** 735 dòng, ~11849 từ

### Transcript

`[00:00:06]` Vì vậy bài giảng hôm nay sẽ nói về trò chơi.
`[00:00:10]` Hãy nhớ lần trước chúng ta đã nói về quá trình ra quyết định của Markov và học tập tăng cường.
`[00:00:15]` Và lần trước chúng ta đã nói về tìm kiếm và trò chơi sẽ hoàn thành chuyến tham quan của chúng ta về các mô hình không gian trạng thái.
`[00:00:25]` Và vì vậy hãy đi sâu vào một ví dụ.
`[00:00:28]` Vậy chúng ta sẽ chơi một trò chơi.
`[00:00:31]` Đây gọi là ván 1 vì thiếu thuật ngữ hay hơn.
`[00:00:34]` Vậy ở đây có 3 thùng A, B và C.
`[00:00:37]` Vì vậy bạn sẽ chọn một trong ba thùng.
`[00:00:42]` Và sau đó tôi chọn một số từ thùng đó.
`[00:00:45]` Và mục tiêu của bạn là tối đa hóa con số đã chọn.
`[00:00:49]` Được rồi, khá đơn giản.
`[00:00:52]` Vậy hãy làm một cuộc thăm dò ý kiến.
`[00:00:56]` Bao nhiêu người trong số các bạn sẽ chọn A. Được rồi, một vài người, một số người sẽ chọn A. Bao nhiêu người trong số các bạn sẽ chọn B?
`[00:01:08]` Đợi đã, tôi nghĩ một số bạn đang bỏ phiếu hai lần, nhưng không sao cả.
`[00:01:12]` Có thể là một chính sách ngẫu nhiên.
`[00:01:14]` Và bao nhiêu bạn sẽ chọn C. OK, hầu hết các bạn sẽ chọn C.
`[00:01:18]` Vậy chiến lược của bạn nên là gì?
`[00:01:22]` Và trái ngược với điều này, điều này rất không được xác định rõ ràng về mục đích.
`[00:01:28]` Và mục đích chung của trò chơi là chiến lược của bạn phải phụ thuộc vào những gì tôi sắp làm.
`[00:01:35]` Và ví dụ, nếu ai đó chọn A, tôi có thể sẽ khoan dung.
`[00:01:39]` Tôi chỉ cho bạn 50 hoặc tôi có thể thực sự cố gắng chơi bạn và tôi sẽ cho bạn âm 50.
`[00:01:47]` Vì vậy, thách thức trong trò chơi là bạn không biết đối thủ sẽ làm gì.
`[00:01:51]` Vậy làm thế nào để bạn đề phòng điều đó?
`[00:01:55]` Tôi thực sự ngạc nhiên khi có nhiều người không chọn B. Tôi đoán các bạn không nghĩ rằng tôi có tính chất đối địch như tôi có thể nhưng OK.
`[00:02:04]` Vì vậy, MDP, tác nhân đang cố gắng tối đa hóa tiện ích và môi trường là ngẫu nhiên và không xác định.
`[00:02:13]` Nếu nó chưa được biết thì chúng ta sẽ học tăng cường và nó sẽ được biết một cách ngầm định hoặc rõ ràng.
`[00:02:19]` Trong trò chơi, tác nhân vẫn cố gắng tối đa hóa tiện ích, nhưng có một đối thủ trong môi trường và không xác định được chiến lược của đối thủ.
`[00:02:31]` Vì vậy, đây là lộ trình cho ngày hôm nay.
`[00:02:35]` Chúng ta sẽ nói về việc làm người mẫu một lát.
`[00:02:38]` Trò chơi là gì?
`[00:02:38]` Chúng ta sẽ xem cách chúng ta chơi một trò chơi và khái niệm giá trị trò chơi là gì.
`[00:02:44]` Và sau đó chúng ta sẽ xem xét một loạt các phép truy toán khác nhau sẽ giúp chúng ta hiểu được giá trị tối ưu và chính sách tối ưu.
`[00:02:51]` Và phần cuối cùng của bài giảng sẽ nói về cách chúng ta tăng tốc mọi thứ, chính xác hoặc gần đúng.
`[00:02:59]` Vì vậy, hãy bắt đầu với khái niệm về một trò chơi.
`[00:03:02]` Vì vậy, đối tượng quan trọng bạn nên có trong đầu là một cây trò chơi.
`[00:03:06]` Vì vậy tôi sẽ sử dụng ví dụ này trong suốt bài giảng.
`[00:03:09]` Vậy hãy để tôi vẽ lên bảng.
`[00:03:12]` Vì vậy, gốc của cây là trạng thái bắt đầu của trò chơi.
`[00:03:17]` Và mỗi cạnh đi ra khỏi một nút là những hành động cụ thể có thể được thực hiện.
`[00:03:25]` Trong trường hợp này, bạn có thể đi A B, C Và bây giờ đến lượt tôi.
`[00:03:35]` Và tôi chọn một con số.
`[00:03:36]` Và điều đó có thể kết thúc bằng-- Tôi sẽ chỉ để lại các nút ở đó.
`[00:03:41]` Vậy trừ 50, 1, 3, hoặc trừ 5, 15.
`[00:03:56]` ĐƯỢC RỒI.
`[00:03:58]` Vì vậy, mỗi đường dẫn từ gốc đến lá là một quá trình triển khai hoặc một quỹ đạo hoặc một kết quả trò chơi của một trò chơi.
`[00:04:06]` Và mỗi nút, người chơi phải đưa ra quyết định.
`[00:04:10]` Một số nút là tác nhân đưa ra quyết định và một số nút là đối thủ đưa ra quyết định.
`[00:04:18]` Được rồi, trong bài giảng này và trong lớp học này nói chung, chúng ta sẽ tập trung vào trò chơi có tổng bằng 0 giữa hai người chơi.
`[00:04:24]` Vậy điều đó có nghĩa là gì?
`[00:04:25]` Hai người chơi có nghĩa là số lượng người chơi là hai.
`[00:04:28]` Thông thường, đây sẽ là đối thủ và đại lý.
`[00:04:32]` Và tổng bằng 0 có nghĩa là tiện ích của một tác nhân bằng với tiện ích âm của đối thủ.
`[00:04:39]` Vì vậy, nếu bạn cộng hai thứ đó lại với nhau, bạn sẽ nhận được 0.
`[00:04:43]` ĐƯỢC RỒI.
`[00:04:43]` Đó là lý do tại sao nó được gọi là tổng bằng không.
`[00:04:45]` Vì vậy, cụ thể, nếu tác nhân nhận được tiện ích là 1 thì đối thủ sẽ nhận được tiện ích là âm 1.
`[00:04:53]` Giả sử nó đang cố gắng tối đa hóa tiện ích của họ.
`[00:04:57]` Vậy tổng hữu dụng là 0.
`[00:05:03]` Vì vậy, hãy xem ví dụ này chi tiết hơn.
`[00:05:08]` Chúng ta có thể định nghĩa trò chơi này một cách chính thức.
`[00:05:12]` Vì vậy, một trò chơi chính thức có trạng thái bắt đầu như trước.
`[00:05:17]` Vì vậy, đây sẽ chỉ là chuỗi gốc.
`[00:05:20]` Ở mỗi trạng thái, tôi có thể gọi một hàm để xem trò chơi đã kết thúc chưa và đó là kết thúc hay đó là nút lá.
`[00:05:30]` Đây là điều mới.
`[00:05:31]` Vì vậy, ở mọi trạng thái, tôi cũng có một chức năng người chơi cho tôi biết ai là người chơi sẽ đến lượt.
`[00:05:37]` Và nói chung, đó sẽ là tài sản của di sản.
`[00:05:41]` Vì thế nhà nước biết đến lượt ai.
`[00:05:44]` Và nó sẽ là tác nhân hoặc tác động cho đối thủ.
`[00:05:48]` Và cuối cùng, mỗi bang sẽ phân cho tôi một nhóm người kế nhiệm.
`[00:05:52]` Và tôi đã viết những phần tiếp theo cho mục đích của chúng ta ở đây như một sự ánh xạ từ một hành động đến một trạng thái.
`[00:06:00]` Vì vậy, việc thực hiện hành động A sẽ đưa tôi đến trạng thái A.
`[00:06:05]` Vì vậy, hãy thực hiện một nút khác ở đây.
`[00:06:08]` Vì vậy, từ trạng thái A, tôi không ở cuối.
`[00:06:12]` Vì vậy, A, nói rõ hơn, là cái này.
`[00:06:15]` Thực ra, hãy để tôi viết phần cuối này.
`[00:06:19]` Vì vậy, để tham khảo.
`[00:06:22]` Và điều này cũng giống như việc chọn hành động A, B, C.
`[00:06:30]` Và đây là 1, 2.
`[00:06:31]` Tôi sẽ chỉ gắn nhãn chúng là 1, 2.
`[00:06:35]` ĐƯỢC RỒI.
`[00:06:36]` Vì vậy, người chơi ở trạng thái A ủng hộ đối thủ.
`[00:06:43]` Và những trạng thái tiếp theo của trạng thái này là-- đối thủ có thể chọn hành động một để đưa tôi đến A1 hoặc hành động hai để đưa tôi đến A2.
`[00:06:55]` ĐƯỢC RỒI.
`[00:06:56]` Và nếu bạn ở A1, trò chơi kết thúc và tiện ích bị trừ 50.
`[00:07:02]` Vì vậy, những chức năng này tôi có thể gọi ở bất kỳ trạng thái nào.
`[00:07:05]` Và điều đó cho tôi biết những tiện ích và những người kế nhiệm là gì.
`[00:07:11]` Vậy một trò chơi có gì đặc biệt?
`[00:07:15]` Một là tất cả tiện ích đều ở trạng thái cuối.
`[00:07:22]` Vì vậy, đây không phải là một hạn chế cứng nhắc.
`[00:07:25]` Đôi khi, bạn có những trò chơi mang lại cho bạn điểm ở giữa và tiện ích là số điểm, điều đó không sao cả, nhưng tôi thường nghĩ trong một trò chơi, điều quan trọng cuối cùng là ai thắng hay không hay đó là một trận hòa.
`[00:07:43]` Và vì vậy ngay cả khi bạn có nhiều điểm, bạn vẫn có thể thua trò chơi.
`[00:07:47]` Và nói chung, tiện ích đang cố gắng nắm bắt những gì bạn muốn.
`[00:07:51]` Vì vậy, điều này sẽ làm cho mọi thứ trở nên khó khăn.
`[00:07:54]` Đây là trong bối cảnh học tập tăng cường.
`[00:07:57]` Đây được coi là vấn đề về phần thưởng thưa thớt vì bạn không thực sự biết điều gì sẽ xảy ra cho đến khi bạn đi đến điểm cuối cùng.
`[00:08:02]` Bạn có thể có vẻ như đang làm rất tốt nhưng rồi mọi thứ sụp đổ.
`[00:08:07]` Và điều quan trọng hơn là những người chơi khác nhau sẽ kiểm soát các trạng thái khác nhau.
`[00:08:13]` Vì vậy, trong quá trình ra quyết định của Markov, chúng tôi đã thấy điều này một chút.
`[00:08:16]` Hãy nhớ rằng có các nút kiểm soát tác nhân, là các nút mà tác nhân đang cố gắng đưa ra quyết định và nút đó sẽ chuyển đến nút cơ hội nơi môi trường chuyển sang trạng thái kế nhiệm.
`[00:08:29]` Vì vậy, bây giờ chúng ta sẽ thấy nhiều loại nút khác mà hiện tại đối thủ đang kiểm soát một số nút.
`[00:08:37]` Vì vậy, xét về mặt ký hiệu, một chính sách vẫn là sự ánh xạ từ trạng thái đến hành động.
`[00:08:44]` Vì vậy, chính sách xác định, pi sub p của s là hành động mà người chơi p sẽ thực hiện trong trạng thái s, và chính sách ngẫu nhiên, mà nói chung, chúng ta sẽ giả định-- đây sẽ là xác suất mà người chơi p thực hiện hành động A trong trạng thái s.
`[00:09:04]` Và chúng ta sẽ thấy một số ví dụ về điều này.
`[00:09:10]` Đây là một ví dụ khác về một trò chơi.
`[00:09:15]` Vì vậy, đây là một trò chơi rất đơn giản được gọi là trò chơi giảm một nửa.
`[00:09:18]` Vì vậy, tôi sẽ bắt đầu với số n, chẳng hạn như giả sử là 11, và tác nhân và đối thủ sẽ lần lượt chọn hành động.
`[00:09:28]` Và một hành động có thể là giảm n hoặc thay thế nó bằng việc làm tròn xuống một nửa.
`[00:09:36]` ĐƯỢC RỒI.
`[00:09:36]` Và người còn lại con số 0 sẽ thắng.
`[00:09:41]` Vậy cái này trông như thế nào-- vậy bạn bắt đầu ở trạng thái ban đầu, n là 11.
`[00:09:48]` Đến lượt các đại lý.
`[00:09:50]` Vì vậy, ở đây, chúng ta đang thấy rằng trạng thái đánh dấu lượt của nó một cách rõ ràng là một trường.
`[00:09:57]` Người chơi ở đây rõ ràng là người đại diện.
`[00:10:00]` Những người kế tiếp của trạng thái này là, tôi có thể giảm dần và điều đó đưa tôi đến trạng thái này, trong đó n bây giờ là 10 và đến lượt đối thủ, hoặc tôi có thể có nơi tôi lấy 11 chia cho 2 tầng và điều đó cho tôi 5.
`[00:10:15]` Và ở đây, tôi vẫn chưa kết thúc.
`[00:10:18]` ĐƯỢC RỒI.
`[00:10:19]` Vì vậy, bạn có thể suy nghĩ về chiến lược tối ưu ở đây là gì.
`[00:10:24]` Điều này là hiển nhiên trừ khi bạn có thể thực hiện phép lặp minimax trong đầu.
`[00:10:31]` Nhưng đây chỉ là một ví dụ mà chúng ta sẽ quay lại.
`[00:10:39]` Được rồi.
`[00:10:39]` Vậy bây giờ bạn đã biết trò chơi là gì.
`[00:10:43]` Câu hỏi đặt ra là bạn có phải cân nhắc việc giảm giá khi xem xét tính tiện ích không?
`[00:10:47]` Vì vậy, trong bài giảng này, chúng ta sẽ giả sử tất cả các tiện ích ở cuối bài, nghĩa là chỉ có một con số.
`[00:10:55]` Và vì vậy việc chiết khấu có ý nghĩa khi bạn tích lũy phần thưởng theo thời gian và bạn đang chiết khấu cho tương lai.
`[00:11:01]` Nhưng chỉ có một con số.
`[00:11:02]` Vì vậy, đó chỉ là con số.
`[00:11:03]` Đó là tiện ích.
`[00:11:05]` Vì vậy, hãy nói về đánh giá trò chơi ở đây.
`[00:11:09]` Vì vậy, với một trò chơi mà chúng tôi đã xác định và chính sách dành cho từng người chơi, giá trị của trò chơi là tiện ích mong đợi trong tất cả các đợt triển khai có thể có.
`[00:11:22]` Vì vậy, điều này hẳn rất quen thuộc với các MDP, nơi chúng tôi xác định giá trị ở một trạng thái cụ thể của chính sách về cơ bản chính là tiện ích mong đợi.
`[00:11:33]` Vì vậy, hãy xem xét một chính sách cụ thể.
`[00:11:37]` Vì vậy, chúng ta vẫn đang chơi trò chơi này ở đây, trò chơi một.
`[00:11:41]` Chúng ta sẽ giả sử tác nhân luôn chọn A và ở đây, vì nói chung, tôi sẽ xem xét các chính sách ngẫu nhiên.
`[00:11:48]` Điều này sẽ trả về một từ điển ánh xạ từng hành động với xác suất của hành động đó.
`[00:11:55]` Vì vậy, nếu tôi là một chính sách xác định, tôi chỉ thấy dấu hai chấm hành động 1.
`[00:11:59]` Vậy với xác suất 1, tôi chọn A.
`[00:12:02]` Giả sử đối thủ chọn ngẫu nhiên từ 1 đến 2.
`[00:12:08]` Vì vậy, nó sẽ được biểu thị bằng 1, có xác suất 0,5 và 2 có xác suất 0,5.
`[00:12:15]` ĐƯỢC RỒI.
`[00:12:17]` Vì vậy bây giờ tôi sẽ gói gọn những chính sách này thành các chính sách.
`[00:12:21]` Và điều đó sẽ quyết định chính sách của tất cả người chơi.
`[00:12:25]` Và bây giờ chúng ta hãy chơi trò chơi.
`[00:12:28]` Vì vậy, lối chơi sẽ được cung cấp bởi chức năng mô phỏng, rất giống với những gì chúng ta đã thấy trong các vấn đề tìm kiếm cũng như đối với MDP.
`[00:12:40]` Và bạn bắt đầu với trạng thái bắt đầu.
`[00:12:43]` Và khi trò chơi chưa kết thúc, bạn sẽ biết đến lượt ai.
`[00:12:51]` Và sau đó bạn nhận được chính sách của người chơi đó.
`[00:12:55]` Bạn vượt qua trạng thái và bạn nhận được sự phân bổ theo hành động.
`[00:13:00]` Và sau đó bạn lấy mẫu một hành động dựa trên sự phân phối đó.
`[00:13:05]` Và bây giờ khi bạn đã chọn hành động, động lực của trò chơi sẽ tiếp quản.
`[00:13:09]` Và bạn nhìn vào những trạng thái kế tiếp của trạng thái đó, hãy nhớ rằng đó là sự ánh xạ từ trạng thái hành động sang trạng thái kế tiếp.
`[00:13:16]` Và bạn thực hiện hành động đó và điều đó mang lại cho bạn một trạng thái mới.
`[00:13:22]` Và sau đó bạn chỉ cần theo dõi tất cả các bước.
`[00:13:26]` Vì vậy, cuối cùng, bạn sẽ nhận được một tiện ích tương ứng với một đợt triển khai cụ thể.
`[00:13:33]` Vì vậy, trong trường hợp này, điều đó tương ứng với việc chọn A.
`[00:13:41]` Và sau đó chính sách ngẫu nhiên sẽ thực hiện việc tung đồng xu, và ngẫu nhiên chọn 2 ở đây, và điều đó mang lại cho tôi hữu dụng là 50.
`[00:13:54]` Vì vậy, đó là một triển khai.
`[00:13:58]` Và nếu tôi làm nhiều lần ở mức Trung bình, bạn sẽ thấy rằng đôi khi tôi nhận được âm 50, đôi khi tôi nhận được 50.
`[00:14:05]` Và trung bình của tất cả là 15.
`[00:14:11]` Vì vậy, bây giờ 15 không phải là giá trị thực của trò chơi vì chúng đang lấy mẫu lỗi.
`[00:14:18]` Tôi chỉ cố gắng 20 lần thôi.
`[00:14:20]` Nếu bạn tăng con số này lên giả sử là một triệu, bạn nghĩ tiện ích trung bình sẽ là bao nhiêu?
`[00:14:31]` Nó phải là 0.
`[00:14:32]` Bởi vì một nửa thời gian bạn chọn âm 50 và một nửa thời gian bạn chọn 50.
`[00:14:38]` Vậy liệu chúng ta có thể tính toán chính xác giá trị trò chơi mà không cần mô phỏng không?
`[00:14:43]` Và hy vọng câu trả lời là có, bởi vì chúng ta có thể xác định một phép truy toán để thực hiện điều này.
`[00:14:50]` Vì vậy, tôi sẽ sử dụng bức ảnh này làm hình ảnh minh họa cho những gì phép tái diễn đang diễn ra.
`[00:14:58]` Vì vậy, đây là một số sơ đồ mà nó thể hiện, tại một trạng thái cụ thể, tác nhân sẽ di chuyển, và sau đó đối thủ sẽ di chuyển và tác nhân sẽ di chuyển, v.v.
`[00:15:09]` ĐƯỢC RỒI.
`[00:15:10]` Và chúng ta sẽ thấy các biến thể của điều này.
`[00:15:12]` Vì vậy, tôi chỉ có thể định nghĩa sự tái phát như sau.
`[00:15:16]` Vì vậy, V eval của s sẽ là giá trị trò chơi ở trạng thái s và đối với chính sách pI tác nhân và pi op.
`[00:15:27]` Và nếu tôi ở trạng thái kết thúc, thì tôi chỉ trả lại tiện ích của trạng thái đó.
`[00:15:34]` Đó là trường hợp cơ bản.
`[00:15:36]` Nếu đến lượt tác nhân di chuyển thì việc tôi làm là xem xét tất cả các hành động có thể xảy ra mà tác nhân có thể thực hiện, xác suất để tác nhân đó thực hiện hành động đó là bao nhiêu.
`[00:15:53]` Và tôi xin nhắc lại, giá trị trò chơi của trạng thái kế tiếp là bao nhiêu.
`[00:16:04]` Và sau đó nếu đến lượt đối thủ, về cơ bản tôi có tổng số tiền như nhau cho tất cả các hành động.
`[00:16:11]` Xác suất mà đối thủ thực hiện hành động nhân với giá trị trò chơi của trạng thái kế tiếp.
`[00:16:17]` Sự khác biệt duy nhất là đại lý so với đối thủ ở đây.
`[00:16:23]` Vì vậy, hy vọng điều này có vẻ quen thuộc với MDP, nơi tôi cũng có tổng các hành động và cũng có tổng các trạng thái kế tiếp nhân với xác suất.
`[00:16:37]` Vì vậy, điều này về cơ bản là thực hiện một phép tính rất giống nhau.
`[00:16:42]` Vì vậy, hãy xem nó trông như thế nào trong mã.
`[00:16:48]` Vì vậy, đây là đánh giá V.
`[00:16:50]` Nếu tôi ở cuối, tôi trả lại tiện ích.
`[00:16:55]` Mặt khác, tôi xem đến lượt ai, chọn người chơi, xem chính sách và sau đó tôi sẽ xem xét tất cả các hành động, trong đó đối với mỗi hành động có thăm dò xác suất, tôi sẽ xem trò chơi đưa tôi đến đâu.
`[00:17:15]` Nếu tôi hành động trong trạng thái đặc biệt này, điều gì sẽ xảy ra.
`[00:17:19]` Và tôi sẽ lặp lại giá trị trò chơi của trạng thái kế tiếp nhân với xác suất.
`[00:17:26]` Và nếu tôi cộng tất cả những giá trị này lại thì tôi sẽ nhận được giá trị mong đợi.
`[00:17:34]` Vì vậy, đây chỉ là điều tương tự nhưng trong mã.
`[00:17:41]` Được rồi.
`[00:17:42]` Vì vậy, một lưu ý là việc tính toán này sẽ chính xác nhưng có thể mất thời gian theo cấp số nhân.
`[00:17:49]` Vì vậy, đặc biệt, nếu tại mỗi nút, bạn có hai hành động và trò chơi chạy được 100 bước, thì bạn mất từ ​​2 đến 100 bước, điều này không tuyệt vời lắm, nhưng nó là như vậy.
`[00:18:09]` Vì vậy, bây giờ chúng ta hãy xem ví dụ này.
`[00:18:12]` Vì vậy, ở đây, tác nhân luôn chọn A, và đối thủ sẽ theo chính sách ngẫu nhiên chọn 1 hoặc 2 với xác suất 1/2.
`[00:18:24]` Vì vậy, về mặt khái niệm, phép truy toán đang thực hiện với mỗi nút từ lá dưới lên trên, nó sẽ tính một giá trị mà tôi đã biểu thị bằng màu xanh lá cây ở đây.
`[00:18:33]` Vì vậy, đối với nút này, giá trị của nút này sẽ là 0,5 nhân âm 50 cộng 0,5 nhân 50.
`[00:18:43]` Đó sẽ là 0.
`[00:18:44]` Ở đây, nó là 0,5 nhân 1 cộng 0,5 nhân ba.
`[00:18:47]` Đó sẽ là 2.
`[00:18:48]` Và đây là 0,5 nhân trừ 5 cộng 0,5 nhân 15.
`[00:18:53]` Đó sẽ là 5.
`[00:18:55]` Và cuối cùng, đây chỉ là việc lựa chọn hành động theo chính sách.
`[00:19:03]` Chính sách luôn chọn A. Vậy nó sẽ là 1 nhân 0 cộng 0 nhân 2 cộng 0 nhân 5, kết quả là 0 ở đây.
`[00:19:13]` Vì vậy, nếu tôi đưa cho bạn chính sách dành cho tác nhân, chính sách của chúng tôi dành cho đối thủ và trò chơi, bạn sẽ có thể tính toán tại nút gốc giá trị của trò chơi là gì, tiện ích mong đợi của tác nhân là gì.
`[00:19:25]` Và hãy nhớ tổng bằng 0, có nghĩa là lợi ích mong đợi của đối thủ chỉ là số trừ.
`[00:19:30]` Vì vậy, tóm tắt.
`[00:19:33]` Vì vậy, giá trị là tiện ích mong đợi của trò chơi tác nhân.
`[00:19:37]` Chúng ta có thể mô phỏng trò chơi bằng cách chỉ đưa ra một số tiện ích trung bình.
`[00:19:43]` Và điều này cung cấp cho chúng ta ước tính giá trị của Monte Carlo.
`[00:19:46]` Bạn cũng có thể tính toán giá trị một cách chính xác, nhưng việc này có thể mất thời gian theo cấp số nhân.
`[00:19:51]` Và điều này tương tự như việc đánh giá chính sách ở các nước nghèo đa chiều.
`[00:19:58]` Ghi nhớ đánh giá chính sách.
`[00:20:00]` Bạn được cung cấp một chính sách của đại lý.
`[00:20:03]` Bạn cũng được cung cấp động lực chuyển đổi môi trường mà bạn có thể coi là đối thủ nếu muốn.
`[00:20:10]` Và sau đó bạn chỉ đang tính toán giá trị.
`[00:20:14]` Vì vậy, bây giờ bạn có thể tự hỏi tại sao bạn lại làm điều này.
`[00:20:17]` Bởi vì nó cần thời gian theo cấp số nhân.
`[00:20:19]` Và có lẽ bạn sẽ không thực sự làm điều này để đánh giá trò chơi.
`[00:20:22]` Bạn chỉ cần lấy mẫu một loạt các lần triển khai và mức trung bình và điều đó sẽ hội tụ tương đối nhanh chóng.
`[00:20:30]` Nhưng sau này chúng ta sẽ thấy rằng không phải lúc nào việc lấy mẫu cũng không hiệu quả.
`[00:20:40]` Được rồi, vậy là bây giờ chúng ta đã biết cách đánh giá một trò chơi dựa trên các chính sách cố định.
`[00:20:44]` Hãy thử tính toán các chính sách tối ưu.
`[00:20:48]` Vì vậy, cái này sẽ được gọi là Expectimax.
`[00:20:53]` Vì vậy, thay vì đánh giá chính sách đại lý cố định, chúng ta sẽ tìm chính sách đại lý tối ưu.
`[00:21:00]` Nhưng đối với một đối thủ cố định.
`[00:21:03]` Vì vậy, sơ đồ trông như thế này.
`[00:21:06]` Tôi sẽ sử dụng hình tam giác để biểu thị nút tối đa nơi tác nhân nắm quyền kiểm soát và hình tròn để biểu thị nút có chính sách cố định đang được chạy ở đây.
`[00:21:19]` Vì vậy, tác nhân đi trước, sau đó là đối thủ, sau đó là tác nhân, v.v.
`[00:21:24]` Vì vậy, đây là giá trị kỳ vọng của một trạng thái-- Tôi sẽ có một sự lặp lại rất giống nhau.
`[00:21:32]` Và điều duy nhất thay đổi là phần màu đỏ.
`[00:21:36]` Nhưng chỉ để trải qua mọi thứ.
`[00:21:38]` Nếu tôi ở trạng thái kết thúc thì tôi sẽ trả lại tiện ích.
`[00:21:41]` Đây là trường hợp cơ bản.
`[00:21:43]` Nếu đến lượt đối thủ thì việc này cũng tương tự như trước.
`[00:21:49]` Tôi chỉ xem xét khả năng chính sách của đối phương sẽ thực hiện nhiều hành động khác nhau, sử dụng điều đó để đánh giá giá trị của những người kế nhiệm.
`[00:22:01]` Nhưng nếu đến lượt đại lý, thay vì tính tổng các hành động, tôi sẽ lấy mức tối đa vì đại lý muốn tối đa hóa tiện ích mong đợi.
`[00:22:13]` Vì vậy, tác nhân nên chọn hành động tối đa hóa giá trị kỳ vọng tối đa của trò chơi của các trạng thái kế tiếp.
`[00:22:22]` Thế là xong.
`[00:22:28]` Và bạn có thể thấy rằng đối với giá trị kỳ vọng, bạn không thể chỉ lấy mẫu một cách ngây thơ và có được ước tính Monte Carlo vì giá trị tối đa này.
`[00:22:39]` Khi bạn có số tiền, bạn có thể lấy mẫu và điều đó mang lại cho bạn ước tính khách quan.
`[00:22:43]` Max, bạn không thể.
`[00:22:47]` Vì vậy, hãy xem điều này trông như thế nào trong ví dụ cụ thể của chúng ta.
`[00:22:54]` Vì vậy, tôi sẽ áp dụng lại chính sách ngẫu nhiên này là chọn 1 hoặc 2 với xác suất 1/2.
`[00:23:01]` Vậy điều đó tương ứng với chính sách của đối thủ ở đây.
`[00:23:05]` Và theo trực giác, nếu x trở lại mức tối đa về cơ bản có nghĩa là, ở nốt đối phương, tôi đang làm điều tương tự như trước.
`[00:23:16]` Tôi chỉ tính trung bình thôi.
`[00:23:18]` Nhưng tại nút tối đa, tôi sẽ lấy giá trị tối đa, trong trường hợp này ở đây, nó là 5, lớn hơn 0 hoặc 2.
`[00:23:30]` Vì vậy, một số bạn đang làm Expectimax.
`[00:23:33]` Những người nói rằng tôi sẽ chọn C, có lẽ bạn nghĩ rằng tôi chỉ định tung đồng xu.
`[00:23:39]` Vậy 15 có vẻ khá tốt, trừ 5.
`[00:23:43]` Thôi, hy vọng điều đó không xảy ra.
`[00:23:44]` Và bạn đã chọn C.
`[00:23:49]` Vì vậy, trong mã, Expectimax này trông như thế này.
`[00:23:55]` Một khi bạn thấy những sự tái diễn này, chúng sẽ có phần lặp đi lặp lại.
`[00:23:59]` Nhưng hy vọng chi phí cận biên để hiểu một cái mới sẽ bằng 0.
`[00:24:06]` Vì vậy, Expectimax nếu trò chơi kết thúc ở một trạng thái cụ thể thì chỉ cần trả lại tiện ích.
`[00:24:15]` Ngược lại, xem đến lượt ai và nếu đến lượt đại lý, tôi sẽ nhớ chọn hành động tối đa hóa hữu dụng.
`[00:24:25]` Vì vậy tôi sẽ xem xét các trạng thái tiếp theo.
`[00:24:29]` Ở đây trong trò chơi này, đó là A, B hoặc C.
`[00:24:32]` Tôi sẽ lặp lại và tìm ra giá trị tối đa dự kiến ​​​​của các trạng thái đó là gì.
`[00:24:39]` Và sau đó tôi sẽ chỉ chọn cái tối đa.
`[00:24:52]` Vì thế đối thủ cũng giống như trước.
`[00:24:57]` Tôi đã viết hơi khác một chút, nhưng nó chỉ lấy mức trung bình so với chính sách của đối thủ.
`[00:25:07]` Vì vậy, hành động tối ưu là chọn C trong trường hợp này.
`[00:25:13]` ĐƯỢC RỒI.
`[00:25:14]` Vì vậy, Expectimax tìm ra chính sách tác nhân tối ưu đối với chính sách đối thủ cố định.
`[00:25:20]` Và điều này tương tự với việc lặp lại giá trị trong MDP.
`[00:25:23]` Đánh giá trò chơi cũng tương tự như đánh giá chính sách.
`[00:25:27]` Expectimax tương tự như phép lặp giá trị.
`[00:25:35]` Thực sự cho đến nay tôi chưa làm được điều gì thú vị.
`[00:25:39]` Về cơ bản đây là tất cả các MDP thực sự, nhưng chỉ được mô tả bằng ngôn ngữ trò chơi.
`[00:25:47]` Nhưng bây giờ tôi sẽ làm điều gì đó khác biệt.
`[00:25:50]` Và đây là lúc tôi sẽ nói về minimax.
`[00:25:53]` Vì vậy, trước khi chính sách của đối thủ được biết đến, nhưng toàn bộ vấn đề của trò chơi là chúng ta không biết chính sách của đối thủ.
`[00:26:00]` Vậy chúng ta nên làm gì?
`[00:26:02]` Vì vậy ở đây có một nguyên tắc mà chúng ta có thể tuân theo được gọi là minimax.
`[00:26:07]` Và điều này có nghĩa là đối thủ đang muốn có được bạn.
`[00:26:10]` Đối thủ sẽ chơi chiến lược tốt nhất có thể của họ và sẽ giảm thiểu tiện ích của bạn.
`[00:26:19]` Vì vậy đây là phép truy toán minimax mô tả nguyên tắc này.
`[00:26:24]` Vì vậy, bây giờ, như trước đây, tôi có một hình tam giác hướng lên để biểu thị vị trí tôi đang lấy điểm tối đa trong một hình tam giác hướng xuống để biểu thị vị trí tôi đang lấy điểm tối thiểu.
`[00:26:36]` Vì vậy, đầu tiên tác nhân di chuyển, đó là mức tối đa, đối thủ di chuyển, đó là mức tối thiểu, tác nhân di chuyển, đó là mức tối đa, v.v.
`[00:26:42]` Và sự tái phát thực sự khá đơn giản.
`[00:26:47]` Nó thực sự đơn giản hơn các phép lặp khác mà chúng tôi đã trình bày.
`[00:26:51]` Vì vậy, giá trị cực tiểu của một trạng thái là nếu tôi ở đầu V, tôi sẽ nhận được tiện ích.
`[00:26:59]` Nếu tôi là tác nhân thì tôi thực hiện các hành động tổng thể tối đa về giá trị cực tiểu của các trạng thái kế tiếp.
`[00:27:06]` Và nếu đối thủ đang chuyển lượt, thì tôi sẽ thực hiện các hành động tổng thể tối thiểu.
`[00:27:16]` Và đó là lý do tại sao nó được gọi là minimax.
`[00:27:18]` Bởi vì tôi có max và tôi có Min.
`[00:27:23]` Vì vậy, đây là những gì nó trông giống như trò chơi một.
`[00:27:28]` Vì vậy, nếu tôi có các nút đối thủ này, hiện là các nút tối thiểu, thì tôi lấy min trên âm 50 và 50.
`[00:27:38]` Tôi nhận được âm 50, lấy số phút, tôi nhận được một, lấy số phút, tôi nhận được trừ 5.
`[00:27:42]` Và sau đó tác nhân sẽ chọn giá trị tối đa trên các giá trị tối thiểu này và giá trị tối đa là một.
`[00:27:51]` Vì vậy, đối với những người ban đầu chọn B, có thể bạn đang chạy minimax trong đầu.
`[00:28:05]` Và những người trong số các bạn đã chọn A, tôi không có lời giải thích nào cho điều đó.
`[00:28:11]` Được rồi.
`[00:28:12]` Vì vậy, đây là những gì nó trông giống như trong mã.
`[00:28:17]` Tính giá trị cực tiểu của một trạng thái.
`[00:28:20]` Nếu tôi ở n và trả lại tiện ích ở đây, tôi sẽ tự do một chút.
`[00:28:24]` Và tôi cũng sẽ trả về hành động liên quan, không chỉ giá trị, bởi vì tôi thực sự muốn biết phải làm gì.
`[00:28:33]` Vậy đến lượt ai tôi sẽ nhận được người chơi.
`[00:28:36]` Tôi sẽ lặp lại tất cả các trạng thái tiếp theo có thể có và nhận được một tập hợp các giá trị.
`[00:28:48]` Vậy nó sẽ là âm 51 và âm 5.
`[00:28:53]` Và nếu tôi là người đại diện, tôi sẽ lấy giá trị tối đa trên tất cả các giá trị này.
`[00:29:03]` Và nếu tôi là đối thủ, tôi sẽ dành một phút cho những giá trị đó.
`[00:29:08]` Và điều đó sẽ mang lại cho tôi trong trường hợp này hành động B, mang lại cho tôi giá trị 1.
`[00:29:15]` Vì vậy, giá trị tối đa của một trạng thái là tiện ích dự kiến ​​​​của tác nhân nếu tác nhân chơi tối ưu và tối đa hóa tiện ích còn đối thủ chơi tối ưu và giảm thiểu tiện ích.
`[00:29:28]` Được rồi, bây giờ hãy xem điều gì sẽ xảy ra với trò chơi giảm một nửa.
`[00:29:33]` Vì vậy trước hết, tôi sẽ biến sự tái diễn tối đa này thành một chính sách.
`[00:29:39]` Và cách tôi làm điều đó khá đơn giản.
`[00:29:42]` Một chính sách ghi nhớ sẽ nhận một trạng thái và trả về một phân phối theo các hành động.
`[00:29:50]` Và do đó, chính sách sẽ nói rằng tôi sẽ lấy trạng thái và tôi sẽ tính giá trị cực tiểu của trạng thái đó và hành động liên kết và chỉ trả về hành động đó.
`[00:30:06]` Và giả sử tôi sẽ chơi chính sách ngẫu nhiên.
`[00:30:11]` ĐƯỢC RỒI.
`[00:30:11]` Chính sách ngẫu nhiên chỉ là chọn mức giảm hoặc một nửa với xác suất một nửa.
`[00:30:19]` ĐƯỢC RỒI.
`[00:30:20]` Vì vậy bây giờ khi tôi mô phỏng tám.
`[00:30:23]` Tôi nhận được một cái gì đó trông như thế này.
`[00:30:27]` Vậy là đại lý giảm đi, bây giờ, chúng ta đang ở 10 và bây giờ đến lượt đối thủ, đối thủ quyết định một nửa, bây giờ tôi là 5.
`[00:30:35]` Đại lý lên sẽ giảm, đối thủ giảm.
`[00:30:42]` Đặc vụ sẽ có, sau đó đối thủ sẽ phải giảm và tôi nhận được 0.
`[00:30:50]` Và bây giờ đại lý thắng.
`[00:30:53]` ĐƯỢC RỒI.
`[00:30:53]` Vì vậy, điều này không có gì đáng ngạc nhiên vì người đại diện sẽ thắng nếu có thể thắng.
`[00:31:01]` Vậy hãy xem điều gì sẽ xảy ra nếu tôi-- tôi sẽ mô phỏng 10 lần và xem điều gì sẽ xảy ra.
`[00:31:11]` Và tác nhân phá vỡ chính sách ngẫu nhiên.
`[00:31:15]` Nó chiến thắng mọi lúc.
`[00:31:18]` ĐƯỢC RỒI.
`[00:31:23]` Vì vậy, một vài lưu ý ở đây.
`[00:31:27]` Một là khi bạn thực sự sử dụng chính sách minimax, bạn thực sự đang tính toán tỷ lệ lặp lại này ở mọi trạng thái.
`[00:31:43]` Và ở đây, để cho vui, tôi có thể cho bạn thấy giá trị cực tiểu của mỗi trạng thái trong số 11 trạng thái đầu tiên là bao nhiêu.
`[00:32:00]` Vì vậy, giá trị minimax của 11 là 1, có nghĩa là tác nhân sẽ thắng nếu tác nhân chơi tối ưu và ngay cả khi đối thủ chơi tối ưu.
`[00:32:10]` Và hành động tốt nhất là giảm bớt.
`[00:32:13]` Số trừ 1 này có nghĩa là giá trị tối thiểu trừ 1 có nghĩa là gì.
`[00:32:20]` Vì vậy đối thủ được đảm bảo sẽ giành chiến thắng nếu đối thủ chơi tối ưu.
`[00:32:24]` Nhưng không có nghĩa là hết hy vọng vì nếu gặp đối thủ yếu hơn, bạn vẫn có thể thắng.
`[00:32:34]` Và sau đó ở các trạng thái này, tác nhân sẽ thắng và sau đó là 6, đối thủ, nếu nó chơi tối ưu thì nó sẽ thắng, v.v.
`[00:32:47]` Vậy tôi có thể nói gì đây?
`[00:32:50]` Nếu giá trị là 1, người đại diện được đảm bảo sẽ thắng bất kể đối thủ có làm gì.
`[00:32:55]` Và chúng ta sẽ làm điều này một cách trang trọng hơn sau.
`[00:32:59]` Và giá trị là âm 1, đối thủ chắc chắn sẽ thắng nếu chơi tối ưu.
`[00:33:09]` ĐƯỢC RỒI.
`[00:33:14]` Vì vậy, một vài lưu ý.
`[00:33:16]` Chỉ là chuyện này chỉ là chuyện ngoài lề thôi.
`[00:33:19]` Khi người đại diện và đối thủ đang chơi tối ưu.
`[00:33:22]` Đây được gọi là cách chơi hoàn hảo và bạn có thể đã nghe người ta nói rằng cờ đam đã được giải hoặc một trò chơi đã được giải.
`[00:33:33]` Và điều đó có nghĩa là kết quả của trò chơi trong điều kiện chơi hoàn hảo đã được biết, OK, có nghĩa là chúng ta biết giá trị cực tiểu của nghiệm.
`[00:33:44]` Đó chính là ý nghĩa của việc giải quyết một trò chơi.
`[00:33:47]` Vì vậy, có một số trò chơi đã được giải quyết triệt để, điều đó có nghĩa là về cơ bản chúng ta biết giá trị cực tiểu cho mỗi trạng thái, tic-tac-toe, nim, kết nối bốn.
`[00:34:00]` Giải quyết hàng tuần có nghĩa là ngay từ vị trí ban đầu, tôi đã biết minimax là gì.
`[00:34:09]` Và cũng có những trò chơi chưa có lời giải như cờ vua và cờ vây.
`[00:34:15]` Vì vậy, đây là sự khác biệt quan trọng giữa-- mọi người nghĩ rằng cờ vua và cờ vây được giải quyết bởi vì chúng ta có máy tính có thể đánh bại con người.
`[00:34:27]` Nhưng điều đó có thể đúng.
`[00:34:28]` Nhưng chúng ta không biết giá trị cực tiểu của một nút.
`[00:34:32]` Và chúng tôi không có chính sách tối ưu.
`[00:34:35]` Chúng ta chỉ có những chính sách tốt hơn con người.
`[00:34:41]` ĐƯỢC RỒI.
`[00:34:42]` Tóm lại ở đây, trong minimax, tác nhân tối đa hóa hữu dụng.
`[00:34:47]` Đối thủ giảm thiểu tiện ích.
`[00:34:50]` Không giống như mức tối đa dự kiến, không có chính sách cố định nào được đưa ra.
`[00:34:56]` Expectimax chỉ tối ưu đối với chính sách cố định.
`[00:34:59]` Minimax, như chúng ta sẽ thấy, không thể đoán trước được những gì đối thủ đang làm.
`[00:35:05]` Và đây là phần duy nhất của trò chơi.
`[00:35:07]` Không có sự tương tự với MDP.
`[00:35:09]` Bởi vì MDP, chúng tôi chỉ đạt mức trung bình tối đa.
`[00:35:11]` Chúng tôi không Min.
`[00:35:14]` Vì vậy, phần tiếp theo này sẽ tính đến hoặc xem xét tất cả các chính sách mà chúng ta có thể tính toán và rút ra một số mối quan hệ giữa chúng.
`[00:35:30]` Vì vậy, phần này sẽ phức tạp hơn một chút.
`[00:35:34]` Và chúng ta sẽ phải suy nghĩ nhiều hơn một chút, nhưng hy vọng nó sẽ giúp bạn hiểu rõ hơn về mối quan hệ giữa kỳ vọng và giá trị trò chơi và cực tiểu.
`[00:35:45]` Cho đến nay, những gì chúng tôi đã làm là tính toán các lần lặp lại này và các lần lặp lại cung cấp cho chúng tôi các chính sách.
`[00:35:54]` Vì vậy, V minmax, giá trị minimax, sẽ cho chúng ta pi max, đây là chính sách tác nhân tối ưu.
`[00:36:04]` Và pi min là chính sách đối thủ tối ưu.
`[00:36:12]` Hãy nhớ trong minimax chúng ta có Min và Max.
`[00:36:16]` Và nếu chúng ta lấy argmin và argmax tương ứng với pi max và pi min.
`[00:36:23]` Chúng ta cũng có thể thực hiện Expectimax và điều đó mang lại cho chúng ta chính sách Expectimax.
`[00:36:31]` Tôi đang sử dụng dấu ngoặc đơn 7 ở đây.
`[00:36:34]` Vì vậy, pi7, tôi giả sử là một chính sách cố định tùy ý mà đối thủ đang chơi.
`[00:36:41]` Và Expectimax 7 có nghĩa là tôi Expectimax đối với pi7.
`[00:36:48]` Vì vậy bạn phải hết sức cẩn thận khi nói về chính sách tối ưu.
`[00:36:52]` Bạn luôn phải hỏi điều tối ưu liên quan đến điều gì, bởi vì mỗi chính sách tối ưu đều đưa ra một số giả định về cách người chơi khác đang chơi.
`[00:37:03]` Vì vậy, trong minimax, chúng ta có pi max tối ưu so với pi min.
`[00:37:12]` ĐƯỢC RỒI.
`[00:37:13]` Và chúng ta cũng có pi Min tối ưu so với pi max vì min và max đối xứng nhau.
`[00:37:21]` Và chúng tôi biết rằng pi Expectimax 7 là tối ưu đối với bất kỳ ai mà chúng tôi đang tính toán kỳ vọng tối đa đối với pi7.
`[00:37:36]` Vì vậy, chúng tôi có bốn chính sách ở đây.
`[00:37:38]` Chúng ta có pi min, pi max, pi Expectimax 7 và pi7.
`[00:37:42]` Và điều gì sẽ xảy ra khi chúng ta áp dụng các chính sách này với các chính sách khác.
`[00:37:51]` Vì vậy, tôi sẽ sử dụng ký hiệu V của chính sách đại lý cụ thể và chính sách đối thủ cố định cụ thể để làm giá trị của trò chơi khi đại lý PI chơi pi op.
`[00:38:03]` ĐƯỢC RỒI.
`[00:38:04]` Và chúng ta có thể chơi các chính sách chống lại nhau.
`[00:38:08]` Như vậy có 2 chính sách đại lý pi max và pi Expectimax.
`[00:38:13]` Và sau đó có hai chính sách đối lập pi min và pi7.
`[00:38:17]` Và đối với mỗi ô ở đây, tôi có một giá trị cụ thể, đó là điều xảy ra khi chính sách hàng thực hiện chính sách cột.
`[00:38:28]` Vì vậy, câu hỏi là có bất kỳ mối quan hệ nào giữa các giá trị này.
`[00:38:36]` Và để tôi thực sự vẽ cái này lên bảng.
`[00:38:40]` Và tôi sẽ cố gắng đánh dấu mọi thứ khi chúng ta đi.
`[00:38:42]` Vì vậy, chúng ta có pi max, pi Expectimax, và sau đó là pi min, pi7.
`[00:39:05]` Và mỗi thứ đều có giá trị nào đó.
`[00:39:08]` Và tôi đang cố gắng tìm ra mối quan hệ giữa những giá trị này.
`[00:39:11]` Vậy chúng ta có thể nói gì?
`[00:39:15]` Có ba tài sản ở đây.
`[00:39:17]` Vì vậy, thuộc tính đầu tiên cần nhớ là pi max là chính sách tốt nhất chống lại pi min.
`[00:39:24]` ĐƯỢC RỒI.
`[00:39:24]` Và đặc biệt, điều này có nghĩa là giá trị này ít nhất cũng lớn như thể tôi đã thay thế bất kỳ tác nhân nào khác.
`[00:39:34]` Đặc biệt, đây là chính sách pi max.
`[00:39:38]` Nếu tôi thay thế tác nhân pi làm việc khác, nó chỉ có thể làm giảm giá trị.
`[00:39:47]` Vì vậy, sử dụng thực tế đó thì chúng ta có thể kết luận rằng V của pi max là-- pi min lớn hơn hoặc bằng chính sách kia.
`[00:39:58]` Nếu điều này áp dụng cho tất cả các chính sách khác thì đây chỉ là một chính sách khác.
`[00:40:02]` Vậy vế phải lớn hơn vế trái OK.
`[00:40:06]` Điều đó có nghĩa là nước Mỹ này nắm giữ.
`[00:40:13]` Vậy giá trị này lớn hơn giá trị kia.
`[00:40:21]` Vì vậy, tính chất thứ hai, pi Min là chính sách tốt nhất chống lại pi max.
`[00:40:28]` ĐƯỢC RỒI.
`[00:40:28]` Như vậy có nghĩa là nếu tôi là đối thủ thì tôi không nên chọn thứ gì khác ngoài pi min nếu muốn giảm thiểu tiện ích.
`[00:40:38]` Một cách khác để giải thích điều này là điều này mang lại giới hạn thấp hơn so với bất kỳ đối thủ nào khác, có nghĩa là nếu tôi chơi pi max, thì việc chơi pi min này sẽ càng tệ hơn.
`[00:40:53]` Nếu đối thủ làm điều gì khác, tôi chỉ có thể tiến bộ hơn.
`[00:40:59]` ĐƯỢC RỒI.
`[00:41:00]` Vậy nghĩa là ở đây, điều này, tôi đảm bảo là 1.
`[00:41:05]` Nếu đối thủ làm điều gì đó khác, nếu đối thủ tình cờ làm được 15, thì tôi vẫn sẽ nhận được-- đối thủ chọn 15 sẽ không giảm con số này.
`[00:41:20]` Và nó có thể tăng lên vì nếu đối thủ chọn ba ở đây, thì tôi nhận được 3 ở đây.
`[00:41:26]` ĐƯỢC RỒI.
`[00:41:29]` Vậy áp dụng thuộc tính này thì mình thấy nếu mình thay đổi chính sách của đối phương sang một thứ khác thì mình chỉ có thể tăng giá trị mà thôi.
`[00:41:40]` Điều đó có nghĩa rằng đây là mối quan hệ giữa số này và số đó.
`[00:41:59]` Vì vậy, hy vọng nó sẽ có ý nghĩa.
`[00:42:01]` Nếu tôi ở giá trị minimax này, nếu tôi làm cho tác nhân tệ hơn thì nó sẽ nhỏ hơn.
`[00:42:08]` Nếu tôi làm cho đối thủ tệ hơn, nó sẽ trở nên lớn hơn.
`[00:42:14]` Vì vậy, một hệ quả quan trọng của điều này là nếu giá trị minimax là 1, điều đó có nghĩa là tác nhân được đảm bảo thắng bất kể đối thủ có làm gì.
`[00:42:25]` Tôi đã khẳng định điều này trước đó, nhưng bây giờ bạn có thể hiểu chính thức tại sao điều này lại đúng, bởi vì nếu tác nhân làm điều gì khác thì ít nhất sẽ là một điều.
`[00:42:36]` Và tôi đoán trong những trò chơi này chỉ có 1, nên nó phải là 1.
`[00:42:40]` Và thế là tôi chắc chắn sẽ thắng.
`[00:42:42]` Đó là lý do tại sao bạn có thể tự tin nói rằng nếu bạn tính toán theo chính sách minimax và trả về giá trị bằng 1 thì bạn chắc chắn sẽ thắng.
`[00:42:57]` Vậy tính chất thứ ba.
`[00:43:01]` Vì vậy hãy nhớ Expectimax 7 là gì.
`[00:43:05]` Expectimax là tối ưu so với pi7 Vì vậy, một hậu quả của việc này là giá trị minimax không tối ưu đối với-- nếu biết đối thủ.
`[00:43:24]` Vì vậy, tôi muốn nói chỉ để hiểu điều đó.
`[00:43:26]` Vì vậy, Expectimax là tối ưu so với pi7, có nghĩa là nếu tôi thay đổi chính sách tác nhân này thành một chính sách khác, cụ thể là như pi max, chỉ là một chính sách khác, thì điều này chỉ có thể đi xuống.
`[00:43:44]` Và bạn có thể thấy điều này ở đây, Expectimax nhớ là đã chọn C Và nếu tôi quyết định, tôi sẽ chỉ chơi chính sách minimax, tôi sẽ chọn B và 2 tệ hơn 5.
`[00:44:01]` Và điều này là do tôi cho rằng tôi đang chơi pi7, đây sẽ là chính sách ngẫu nhiên.
`[00:44:09]` Vì vậy dựa vào đó mà số pi max này được thiết lập.
`[00:44:15]` Pi 7 sẽ nhỏ hơn hoặc bằng giá trị này ở đây.
`[00:44:24]` Vì vậy, một nhận thức quan trọng là bạn thực sự có thể làm tốt hơn minimax nếu bạn biết đối thủ của mình.
`[00:44:31]` Nếu bạn đang chơi với một đối thủ yếu, bạn có thể làm tất cả những điều mà bạn không dám làm nếu bạn đang chơi với một đối thủ thực sự mạnh.
`[00:44:44]` Được rồi, sắp xếp mọi thứ lại với nhau, đây là những gì chúng ta có trên bảng.
`[00:44:51]` Vì vậy, giá trị minimax là 1.
`[00:44:59]` Nếu bạn chơi pi max với pi7, đó là 2.
`[00:45:04]` Nếu bạn chơi Expectimax, trò chơi sẽ chọn nhánh này chống lại pi min, bạn sẽ bị trừ 5.
`[00:45:12]` Và nếu bạn chơi Expectimax với pi 7, bạn sẽ nhận được 5.
`[00:45:16]` Và nó kiểm tra rằng âm 5 nhỏ hơn 1, nhỏ hơn 2, nhỏ hơn 5.
`[00:45:26]` Tôi nghĩ thật tuyệt vời khi tất cả những giá trị này thực sự có liên quan với nhau.
`[00:45:33]` Vì vậy, hãy tóm tắt.
`[00:45:38]` Vì vậy, khi nghĩ về sự tối ưu, bạn cũng nên hết sức cẩn thận về điều tối ưu của mình.
`[00:45:46]` Minimax đưa ra hai cách giải thích.
`[00:45:50]` Một là đó là chính sách tối ưu chống lại pi min, đối thủ tồi tệ nhất có thể.
`[00:45:59]` Tuy nhiên, một cách khác để nghĩ về nó là giới hạn thấp hơn trước bất kỳ đối thủ chưa biết nào.
`[00:46:06]` Cách tôi giới thiệu trò chơi là bạn không biết chính sách của mình.
`[00:46:13]` Và tôi thường thích cách giải thích đó hơn vì tôi nghĩ nói chung có lẽ hiếm khi bạn gặp phải đối thủ tồi tệ nhất, nhưng bạn vẫn muốn sử dụng minimax khi bạn muốn đảm bảo chống lại bất cứ điều gì có thể xảy ra.
`[00:46:33]` Vì vậy bây giờ tôi sẽ nói về Expectiminimax.
`[00:46:37]` Theo một nghĩa nào đó, điều này sẽ giống như một sa mạc.
`[00:46:42]` Nó không sâu lắm nhưng hy vọng nó sẽ cho bạn một ví dụ khác về những gì bạn có thể làm khi xảy ra hiện tượng tái phát.
`[00:46:50]` Vì vậy, giả sử bạn có trò chơi này.
`[00:46:52]` Bạn có 3 thùng A, B, C.
`[00:46:55]` Và bây giờ bạn chọn một trong số họ.
`[00:46:58]` Nhưng bây giờ tôi sẽ tung một đồng xu, và nếu nó là mặt ngửa, thì tôi sẽ di chuyển một cái thùng sang trái, quấn quanh, và tôi sẽ chọn một số từ thùng đó.
`[00:47:08]` Vì vậy, nếu đó là đuôi và tôi dính vào cùng một thùng.
`[00:47:11]` Và mục tiêu của bạn là tối đa hóa con số đã chọn.
`[00:47:17]` Vì vậy, để mô hình hóa trò chơi này, chúng ta chỉ cần vẽ cây trò chơi.
`[00:47:22]` Tôi sắp giới thiệu một chính sách không trích dẫn được gọi là "đồng xu", chính sách này chọn một hành động có trái một nửa và-- xin lỗi, sấp với xác suất 1/2 và ngửa với xác suất 1/2 khác.
`[00:47:41]` Vì vậy, điều đang xảy ra ở đây là giả sử bạn chọn A, thì đây là chính sách cố định, đó là lý do tại sao nó có hình tròn.
`[00:47:51]` Tôi sẽ chọn đầu hoặc đuôi.
`[00:47:54]` Và nếu là mặt ngửa, tôi di chuyển một mặt sang trái.
`[00:48:00]` Và trong đó tôi kết thúc ở C, đó là lý do tại sao tôi có âm 5 và 15.
`[00:48:04]` Và sau đó nếu tôi chọn mặt ngửa thì tôi-- xin lỗi, nếu tôi chọn mặt sấp thì tôi vẫn ở trong cùng một ô và tôi có một mặt ở đây.
`[00:48:18]` ĐƯỢC RỒI.
`[00:48:19]` Và nếu chọn B thì tôi hoặc ở lại hoặc di chuyển sang trái, ở lại hoặc di chuyển sang trái.
`[00:48:27]` ĐƯỢC RỒI.
`[00:48:28]` Bây giờ, hy vọng rằng nếu tôi đưa cho bạn cây này, bạn sẽ có thể tính được giá trị ở trên cùng.
`[00:48:34]` Điều này được gọi là kỳ vọng nhỏ nhất vì có những kỳ vọng.
`[00:48:40]` Có phút và có tối đa.
`[00:48:43]` Bạn có mọi thứ ở đây.
`[00:48:45]` Và tôi nghĩ nó khá dễ hiểu.
`[00:48:50]` Vì vậy, các nút tối thiểu, các nút này, bạn lấy mức trung bình.
`[00:48:55]` Và sau đó tại các nút tối đa này, bạn đạt tối đa.
`[00:48:59]` Vì vậy, đây là sự tái diễn.
`[00:49:02]` Bây giờ có ba trường hợp đệ quy.
`[00:49:06]` Nếu đến lượt đại lý, bạn lấy mức tối đa.
`[00:49:08]` Nếu đến lượt đối thủ, bạn sẽ đưa họ vào.
`[00:49:11]` Và nếu có lượt của đồng xu, thì bạn tính trung bình có trọng số đối với đồng xu pi.
`[00:49:25]` Vì vậy, nói chung, bạn có thể tưởng tượng ra đủ loại tái diễn khác nhau.
`[00:49:31]` Hy vọng rằng điều này sẽ mở khóa trí tưởng tượng của bạn.
`[00:49:34]` Vì vậy, bạn có thể tưởng tượng có nhiều hơn hai người chơi.
`[00:49:37]` Vì vậy, trong nhiệm vụ Pac-Man, bạn sẽ có Pac-Man và nhiều hồn ma.
`[00:49:41]` Và bạn sẽ phải lý luận về việc có nhiều bóng ma.
`[00:49:45]` Bạn cũng có thể có nhiều tác nhân trong cài đặt, nhưng theo một nghĩa nào đó, tất cả đều có thể được xử lý bằng khung đệ quy chung này.
`[00:49:58]` Bạn thậm chí có thể làm những việc như người chơi có thể chơi thêm lượt hoặc chọn người đi tiếp hoặc thua lượt.
`[00:50:04]` Và điều này chỉ là do tất cả những gì chúng tôi đang làm là lấy một trạng thái và chuyển sang một trạng thái kế tiếp nào đó, và người chơi đến lượt sẽ được đưa vào trạng thái đó.
`[00:50:17]` Và bạn có thể chuyển sang bất kỳ trạng thái nào bạn muốn.
`[00:50:21]` Vì vậy, bạn có thể nghĩ ra một trò chơi với một số quy tắc điên rồ với nó.
`[00:50:28]` Bạn chỉ cần xác định mức tái phát của mình giống như chúng tôi đã làm trước đây và bắt đầu cuộc đua.
`[00:50:34]` Có một số điều không được đề cập trong loại khung lặp lại cây trò chơi này.
`[00:50:40]` Và điều này bao gồm những thứ như trò chơi có thông tin không hoàn hảo như poker hoặc hầu hết các trò chơi bài, tôi nghĩ vậy.
`[00:50:50]` Và lý do điều này không được đưa vào là vì nếu bạn nghĩ về những cây trò chơi này, mọi thứ đều đi qua trạng thái và trạng thái phải có tất cả thông tin.
`[00:51:01]` Đây là đặc điểm riêng biệt của MDP và các vấn đề tìm kiếm cũng như các trò chơi này.
`[00:51:06]` Vì vậy, nếu bạn có những người chơi khác nhau với thông tin khác nhau, bạn không thể biểu thị điều này trong cây vì khi bạn chuyển từ nút tối thiểu sang nút tối đa, sẽ không có cách nào để bỏ qua trạng thái, nếu điều đó hợp lý.
`[00:51:29]` Chúng ta chỉ đang xem xét những trò chơi có tổng bằng 0, nhưng cũng có những trò chơi có tổng khác 0 như thế tiến thoái lưỡng nan của tù nhân.
`[00:51:37]` Và còn có các trò chơi hợp tác, v.v.
`[00:51:39]` Và cũng có những trò chơi không theo lượt.
`[00:51:41]` Vì vậy, ở đây, nó là theo lượt.
`[00:51:45]` Thế là có người thay phiên nhau.
`[00:51:46]` Đến lượt người khác.
`[00:51:47]` Một người khác sẽ thay phiên nhau.
`[00:51:48]` Và sau đó có một số trò chơi như oẳn tù tì diễn ra đồng thời.
`[00:51:53]` Nếu bạn chơi oẳn tù tì theo lượt thì sẽ khá nhàm chán.
`[00:51:59]` ĐƯỢC RỒI.
`[00:52:00]` Như vậy bây giờ chúng ta đã kết thúc phần mô hình hóa của bài giảng.
`[00:52:08]` Bây giờ tôi sẽ tập trung vào minimax và cố gắng tăng tốc nó.
`[00:52:13]` Vì vậy, hãy nói về việc cắt tỉa alpha-beta.
`[00:52:16]` Vì vậy, chúng ta hãy xem lại công thức minimax.
`[00:52:20]` Không có xúc xắc, không có thứ gì lạ.
`[00:52:22]` Nó chỉ là một trò chơi minimax cổ điển.
`[00:52:26]` Và do đó có các nút tối đa, các nút tối thiểu.
`[00:52:31]` Bạn tối đa hóa các nút tối đa và tối thiểu tại các nút tối thiểu.
`[00:52:35]` Và bây giờ việc này nói chung cần có thời gian theo cấp số nhân.
`[00:52:40]` Hàm mũ theo độ sâu là tuyến tính về số lượng nút, nhưng số lượng nút có thể theo cấp số nhân.
`[00:52:46]` Vậy làm thế nào bạn có thể tăng tốc độ này?
`[00:52:49]` Chìa khóa đằng sau kỹ thuật này là một kỹ thuật rất cổ điển trong trò chơi có tên là cắt tỉa alpha-beta, đó là bạn không cần phải đến thăm tất cả các trạng thái trước khi biết rằng một số trạng thái không đáng xem.
`[00:53:03]` ĐƯỢC RỒI.
`[00:53:05]` Vì vậy, bây giờ điều quan trọng là tìm ra cách để chúng ta biết khi nào điều gì đó ở mức dưới mức tối ưu nếu chúng ta thậm chí không nhìn vào nó?
`[00:53:11]` Có vẻ như có một chút phép thuật nào đó khi bạn có thể tỉa bớt các phần trên cây của mình.
`[00:53:17]` Có thể thực sự có chính sách hoặc hành động tối ưu ở đó.
`[00:53:21]` Ai biết?
`[00:53:23]` Vì vậy, để đưa ra một ví dụ về lý do tại sao điều này có thể xảy ra khi xem xét trường hợp sau.
`[00:53:29]` Giả sử bạn có hai hành động có thể xảy ra, A và B, và tôi nói với bạn rằng hành động đó có thể mang lại cho bạn mức hữu dụng, khoảng từ 3 đến 5, tôi không biết chính xác là gì, nhưng khoảng từ 3 đến 5.
`[00:53:41]` Và sau đó B sẽ cung cấp giá trị trong khoảng từ 5 đến 100.
`[00:53:47]` Bạn sẽ chọn cái nào?
`[00:53:50]` Có bao nhiêu bạn chọn A?
`[00:53:53]` B?
`[00:53:54]` ĐƯỢC RỒI.
`[00:53:56]` Vậy tại sao bạn lại chọn B?
`[00:53:58]` Chà, hóa ra bạn không cần biết giá trị hoặc tiện ích chính xác của A và B là gì.
`[00:54:04]` Bạn biết rằng dù có chuyện gì xảy ra thì B cũng sẽ tốt hơn hoặc ít nhất là tốt như vậy.
`[00:54:13]` Vì vậy, có ý tưởng này được gọi là phân nhánh và giới hạn, là một nguyên tắc chung, được sử dụng trong tối ưu hóa tổ hợp, cho biết bất cứ khi nào bạn định duy trì một số khoảng thời gian để theo dõi vị trí các giá trị cụ thể có thể nằm.
`[00:54:32]` Và sau đó bạn có thể cắt bớt mọi thứ nếu bạn có một khoảng lớn hơn một số khoảng khác.
`[00:54:41]` Vì vậy, đây là một ví dụ.
`[00:54:46]` Hãy xem xét cây trò chơi sau đây.
`[00:54:50]` Hãy tưởng tượng tôi đang tìm kiếm.
`[00:54:52]` ĐƯỢC RỒI.
`[00:54:52]` Vì vậy tôi đang thực hiện tìm kiếm minimax.
`[00:54:53]` Tôi thực hiện tìm kiếm theo chiều sâu đầu tiên, truyền tải.
`[00:54:55]` Vậy tôi đi xuống đây.
`[00:54:57]` Tôi có 3 và 5, lấy tối thiểu là 3 và 5.
`[00:54:59]` Tôi nhận được 3.
`[00:55:01]` Tôi tiến lên đây và tại thời điểm này, điểm tốt nhất của tôi cho đến nay là 3.
`[00:55:08]` Và tôi đến đây, đi xuống và tìm số 2.
`[00:55:13]` Vậy tôi có thể làm gì vào thời điểm này?
`[00:55:20]` Vì vậy tôi khẳng định rằng tôi có thể cắt bỏ phần này và tôi không cần phải khám phá bất cứ điều gì ở đây.
`[00:55:28]` Và lý do là gốc là giá trị lớn nhất giữa 3 và bất cứ thứ gì ở trên đây.
`[00:55:35]` Đây là tối thiểu của 2 và một số x Và đây sẽ là 3 cho dù x là bao nhiêu.
`[00:55:43]` Đây có thể là một triệu.
`[00:55:45]` Cái này vẫn sẽ là-- đây là 2.
`[00:55:48]` Và đây sẽ là 3.
`[00:55:49]` Số tiền này có thể là âm 1.000.000.
`[00:55:52]` Và đây là âm 1.000.000.
`[00:55:54]` Và đây vẫn là 3.
`[00:55:56]` Vì vậy, trong tình huống cụ thể này, tôi đã cho bạn một ví dụ mà hy vọng bạn có thể thuyết phục bản thân rằng bạn không cần phải nhìn qua đây cho dù giá trị này là bao nhiêu.
`[00:56:07]` Vậy hãy để tôi thử khái quát nguyên tắc đó thêm một chút.
`[00:56:14]` Vì vậy, nói chung, khi chúng ta thực hiện tìm kiếm hoặc tính cực tiểu, tôi sẽ ở một nút nào đó ở đây.
`[00:56:26]` Và tôi sẽ suy nghĩ bằng trực giác rằng, với mỗi nút, tôi sẽ có một khoảng hoặc một giới hạn.
`[00:56:34]` Và đối với các nút tối đa, tôi sẽ có giới hạn dưới.
`[00:56:38]` Và đối với các nút tối thiểu, tôi có giới hạn trên.
`[00:56:41]` ĐƯỢC RỒI.
`[00:56:42]` Và điều này là do nếu tôi phát hiện ra sáu, giá trị tối đa đó chỉ có thể tăng lên.
`[00:56:47]` Và ở đây, nếu tôi phát hiện ra số tám thì con số đó chỉ có thể giảm đi mà thôi.
`[00:56:51]` Vì vậy, các nút tối đa, tôi có các giới hạn dưới này.
`[00:56:57]` Các nút tối thiểu có giới hạn trên.
`[00:56:59]` Xuống tận mọi nút trong cây.
`[00:57:03]` Bây giờ, hãy nghĩ xem giá trị minimax đến từ đâu.
`[00:57:08]` Nó chắc hẳn đến từ một chiếc lá nào đó bởi vì tôi chỉ lấy tối đa và phút của các trạng thái kế tiếp.
`[00:57:17]` Và vì vậy có một chiếc lá nào đó chắc chắn đã làm tăng giá trị đó.
`[00:57:24]` Và vì vậy tôi sẽ nói về con đường tối ưu là con đường được các chính sách tối thiểu và tối đa này đi tới lá đó.
`[00:57:33]` Đó là điều tôi đang cố gắng tìm kiếm.
`[00:57:36]` ĐƯỢC RỒI.
`[00:57:38]` Và vì vậy đường dẫn này cần phải nằm trong giới hạn dưới và giới hạn trên mà tôi có.
`[00:57:49]` Điều đó có nghĩa là nếu một nút cung cấp cho tôi các giới hạn không trùng với các giới hạn của mọi tổ tiên thì tôi có thể loại bỏ nó.
`[00:58:03]` Vì vậy, ví dụ, số này lớn hơn 6, nhỏ hơn 8, lớn hơn 3.
`[00:58:11]` Nếu cái này bằng cách nào đó, giả sử, nhỏ hơn hoặc bằng 2, thì tôi có thể bỏ nó đi vì cái này lớn hơn hoặc bằng 3.
`[00:58:23]` Và nếu giá trị của this nhỏ hơn hoặc bằng 2 thì không thể nào nó có thể nằm trên con đường tối ưu.
`[00:58:31]` Vì vậy, câu hỏi là, bạn có thể cắt tỉa cái này không?
`[00:58:33]` Bởi vì cái này nói nó lớn hơn 6, cái này nói nó nhỏ hơn hoặc bằng 5.
`[00:58:37]` Và câu trả lời là có vì khoảng này không trùng với khoảng này.
`[00:58:43]` Và tôi phải nhìn vào toàn bộ đường nét của tổ tiên.
`[00:58:49]` Vì vậy, hãy làm một ví dụ trên bảng ở đây.
`[00:58:55]` Hãy để tôi xem ở đây và cố gắng nhớ những dòng nào.
`[00:59:04]` Vậy tôi có ba nút, 9 9, 7.
`[00:59:14]` Vì vậy, hãy lưu ý rằng cây cũng không nhất thiết phải có cùng số cấp độ.
`[00:59:17]` Vậy 6, 3, 4, 7, 9, 3-- ồ, 6, 3, 4, 7, 9, rồi ở đây 8, 3.
`[00:59:37]` ĐƯỢC RỒI.
`[00:59:37]` Vì vậy, giả sử chúng ta đang thực hiện việc cắt tỉa minimax hoặc alpha-beta, vì vậy ban đầu ở đây, chúng ta không biết gì cả.
`[00:59:47]` Vì vậy chúng ta sẽ đi qua đây, xuống đây, khám phá số chín.
`[00:59:53]` Vì vậy, tại thời điểm này, tôi đến đây và tôi nói cái này phải lớn hơn nhiều nhất là 9.
`[01:00:04]` Lại đây, tôi thấy đó là số 7.
`[01:00:06]` Tôi cập nhật nó là ít hơn 7.
`[01:00:10]` Thực ra cái này chỉ bằng 7 thôi vì tôi đã khám phá hết mọi thứ rồi.
`[01:00:14]` Vì vậy bây giờ tôi quay lại đây-- xin lỗi, tôi không thể chuyển cái này lên nữa.
`[01:00:19]` Nhưng điều này sẽ xảy ra, tôi sẽ chỉ viết nó ra đây, ít nhất là bảy.
`[01:00:26]` Vậy đây là bản alpha.
`[01:00:27]` Thế nên tôi quên nói điều này.
`[01:00:29]` Hãy để tôi viết điều này.
`[01:00:39]` Vì vậy, đối với các nút tối đa, tôi có giá trị alpha.
`[01:00:44]` Và các giá trị alpha về cơ bản sẽ là giới hạn dưới, giới hạn dưới của giá trị.
`[01:00:54]` Và đối với các nút này, tôi có các giá trị beta là giới hạn trên.
`[01:01:05]` Vì vậy, ở đây, số này lớn hơn hoặc bằng 7.
`[01:01:09]` Xuống đây tôi tìm được số 6, tôi lên đây, nhiều nhất là sáu.
`[01:01:20]` Vậy điều đó có nghĩa là gì?
`[01:01:22]` Tôi có thể tỉa thứ gì đó không?
`[01:01:24]` Sẽ có thể, phải không?
`[01:01:27]` Vì vậy, trong trường hợp này, tôi thực sự có thể cắt bớt-- tôi có thể dừng lại.
`[01:01:31]` Tôi có thể cắt tỉa mọi thứ ở đây.
`[01:01:37]` Bởi vì cái này đã lớn hơn 7, cái này nhỏ hơn 6, nên dù có chuyện gì xảy ra ở đây thì tôi thực sự không thể thay đổi giá trị ở đây.
`[01:01:48]` Được rồi, vậy tôi qua đây, lớn hơn hoặc bằng 7, tôi tìm được 8.
`[01:01:53]` Vậy bây giờ số này nhỏ hơn hoặc bằng 8.
`[01:01:58]` Tôi có thể tỉa cái này được không?
`[01:02:00]` Tôi không thể, phải không?
`[01:02:01]` Vì các khoảng này vẫn trùng nhau nên tôi chưa có đủ thông tin.
`[01:02:06]` Vì vậy tôi phải tìm hiểu điều này.
`[01:02:08]` Tôi thấy đó là số 3.
`[01:02:10]` Và sau đó tôi có 3.
`[01:02:12]` Và cuối cùng cập nhật nó lên 7.
`[01:02:16]` Và tôi đã xong.
`[01:02:21]` Vì vậy, hãy lưu ý rằng alpha-beta sẽ khá mạnh vì nó không chỉ cắt bớt một nút.
`[01:02:28]` Bạn tỉa toàn bộ cây con nếu bạn may mắn.
`[01:02:32]` Vâng, câu hỏi đặt ra là, điều này có hiệu quả với Expectimax không?
`[01:02:42]` Hãy xem.
`[01:02:42]` Tuy nhiên, câu trả lời ngắn gọn là không.
`[01:02:45]` Vì khi đã kỳ vọng thì phải tính đến tất cả những khả năng có thể xảy ra.
`[01:02:57]` Bạn vẫn có thể thực hiện một số giai đoạn alpha beta-- bạn chắc chắn có thể thực hiện cắt tỉa.
`[01:03:02]` Tôi nghĩ có thể có những trường hợp, chẳng hạn như kỳ vọng, nếu bạn có giới hạn về tiện ích, thì bạn vẫn có thể kiểm soát mức độ tiện ích có thể đạt được.
`[01:03:16]` Tôi sẽ phải suy nghĩ chính xác về điều này, nhưng đó là một câu hỏi hay.
`[01:03:21]` Làm cách nào tôi đạt được giới hạn dưới lớn hơn hoặc bằng 7 ở đây?
`[01:03:24]` Bởi vì khi tôi nhìn thấy cái này-- giá trị của cây con này là 7.
`[01:03:29]` Vì vậy, bất cứ khi nào tôi ở một nút, tôi sẽ xem qua từng nút con và cập nhật giá trị tối đa.
`[01:03:37]` Vậy chúng ta đang tính toán cái gì?
`[01:03:38]` Chức năng chất lượng.
`[01:03:40]` Vâng.
`[01:03:40]` Vì vậy, đó là sự tái diễn từ trên xuống, nhưng bạn đi xuống phía dưới và sau đó bạn đi lên.
`[01:03:49]` Vâng.
`[01:03:56]` ĐƯỢC RỒI.
`[01:03:56]` Vậy làm thế nào để bạn gặp may mắn?
`[01:03:58]` Vì vậy, hãy nói về việc đặt hàng.
`[01:04:01]` Vì vậy, thứ tự bạn đến thăm những người kế nhiệm của một bang quan trọng đối với mức độ bạn cắt tỉa.
`[01:04:09]` Vì vậy, ví dụ, trong trường hợp này mà chúng ta đã thấy trước đây, hãy xem.
`[01:04:21]` Vậy nếu chúng ta có 3, 5, 2, 10 thì 10 này sẽ bị lược bớt.
`[01:04:26]` Tuy nhiên, nếu chúng ta có 2, 10, 3, 5.
`[01:04:30]` Bây giờ, khi bạn tính cái này bạn sẽ có kết quả là 2.
`[01:04:34]` Và bây giờ khi bạn đi qua đây cái này lớn hơn hoặc bằng 2.
`[01:04:39]` Đây là số ba nên bạn sẽ không thể cắt bớt phần này.
`[01:04:46]` Vì vậy, trong thực tế, điều bạn muốn làm là đi qua nút con-- nếu bạn đang ở nút tối đa, bạn muốn đi qua các nút con có nhiều khả năng lớn hơn vì chúng càng lớn thì giới hạn càng chặt chẽ và khi đó bạn càng có thể cắt tỉa nhiều hơn.
`[01:05:07]` Được rồi, vậy nếu tôi có thể làm cái này trước, ba cái trước thay vì 2, thì tôi có thể cắt tỉa nó, nhưng không phải ngược lại.
`[01:05:15]` Vì vậy, trong thực tế, bạn có thể sử dụng hàm đánh giá heuristic mà chúng ta sẽ nói đến ngay sau đây để sắp xếp thứ tự cho phần tử con.
`[01:05:27]` Đối với các nút tối đa, bạn sắp xếp các nút con theo giá trị giảm dần.
`[01:05:32]` Và đối với các nút tối thiểu, bạn đặt hàng bằng cách tăng giá trị.
`[01:05:36]` Nói cách khác, bạn đang thực sự cố gắng tìm ra con đường tối ưu này, hãy đoán theo phương pháp heuristic.
`[01:05:41]` Và nếu bạn đoán, thì bạn có thể nhanh hơn.
`[01:05:48]` Vì vậy, đây có thể chỉ là một nhận xét chung.
`[01:05:53]` Chúng tôi đã thấy nhiều trường hợp trong khóa học này mà bạn vẫn có thể có các thuật toán chính xác, ngay cả với phương pháp phỏng đoán.
`[01:06:03]` Và nếu phương pháp phỏng đoán của bạn tốt, chẳng hạn như trong một ngôi sao, nếu phương pháp phỏng đoán của bạn tốt, thì điều đó thật tuyệt.
`[01:06:08]` Bạn rất nhanh.
`[01:06:09]` Nếu heuristic của bạn kém thì bạn không nhanh lắm nhưng bạn vẫn đúng.
`[01:06:14]` Vì vậy, để tóm tắt việc cắt tỉa alpha-beta, chúng tôi tăng tốc tìm kiếm minimax.
`[01:06:20]` Nó chính xác.
`[01:06:22]` Và bạn tiết kiệm được bao nhiêu sẽ phụ thuộc vào đơn đặt hàng và vấn đề của bạn.
`[01:06:31]` Nói chung, nó vẫn sẽ là thời gian theo cấp số nhân.
`[01:06:33]` Vì vậy, không phải là chúng ta đã giải được P bằng NP.
`[01:06:39]` Và trực giác là bạn muốn ra lệnh cho hành động của mình thu hẹp giới hạn càng nhanh càng tốt.
`[01:06:47]` Vì vậy, bây giờ chúng ta hãy nói về điều cuối cùng của ngày hôm nay là các hàm đánh giá.
`[01:06:54]` Đây sẽ là một cách gần đúng để tăng tốc độ tìm kiếm.
`[01:06:59]` Vì vậy, đây lại là sự tái diễn minimax.
`[01:07:05]` Và ý tưởng của hàm đánh giá là bạn chỉ cần nói quên tìm kiếm. Tôi sẽ đoán mò.
`[01:07:14]` Nói xem, trạng thái này tốt như thế nào?
`[01:07:18]` Vì vậy, đúng là trong một trò chơi, điều quan trọng duy nhất là cuối cùng ai là người chiến thắng.
`[01:07:24]` Tuy nhiên, nếu bạn đang chơi cờ, trong một số trường hợp, bạn có thể biết ai chơi tốt và ai chơi kém chỉ bằng cách nhìn vào nó.
`[01:07:35]` Và do đó, hàm đánh giá đang cố gắng nắm bắt kiến ​​thức có sẵn này về điều gì có thể là tốt.
`[01:07:41]` Vì vậy, trong trường hợp cờ vua, đây là ví dụ về loại hàm đánh giá mà bạn có thể có.
`[01:07:47]` Vì vậy, nói chung, hàm đánh giá sẽ là tổng của các số hạng khác nhau, mỗi số hạng nắm giữ một số thuộc tính trực quan.
`[01:07:55]` Hãy nghĩ về nó như một tính năng nếu bạn muốn.
`[01:07:57]` Vì vậy, bạn muốn rất nhiều mảnh.
`[01:08:01]` Đó là vật chất.
`[01:08:02]` Bạn muốn khả năng di chuyển để có thể di chuyển-- bạn không muốn khả năng di chuyển.
`[01:08:07]` Vương gia được an toàn.
`[01:08:08]` Bạn muốn kiểm soát trung tâm của bảng, v.v.
`[01:08:12]` Và về mặt vật chất, bạn có thể nghĩ, số lượng vua tôi có so với số lượng vua mà đối thủ có, các vị vua rất quan trọng.
`[01:08:22]` Quân Hậu có giá trị 9, Xe có giá trị 5, v.v.
`[01:08:30]` Vậy bạn sẽ làm gì với chức năng đánh giá?
`[01:08:35]` Vì vậy, bạn chỉ có thể chọn hành động tạo ra trạng thái mang lại cho bạn chức năng đánh giá cao nhất.
`[01:08:45]` Chà, điều đó phụ thuộc vào chức năng đánh giá của bạn là gì, nhưng nếu cứ như thế này thì có lẽ bạn sẽ không phải là một người chơi cờ giỏi.
`[01:08:51]` Có lẽ nó sẽ quá tham lam và cố gắng cứu lấy quân cờ của bạn và không thực sự làm tốt lắm.
`[01:09:00]` Nhưng bạn thực sự có thể sử dụng nó trong chức năng đánh giá và tìm kiếm.
`[01:09:05]` Và cách để thực hiện điều này được gọi là tìm kiếm có giới hạn độ sâu.
`[01:09:11]` Và về cơ bản nó nói rằng, hãy dùng mức tối đa.
`[01:09:13]` Tôi sẽ có độ sâu, là một số nguyên, giả sử là 5, và tôi sẽ chỉ tìm kiếm năm bước.
`[01:09:23]` Và nếu độ sâu bằng 0, nghĩa là tôi sẽ gọi hàm đánh giá và nói, được rồi, tôi sẽ không tìm kiếm nữa.
`[01:09:34]` Tôi sẽ kiểm tra rung cảm và cho tôi một con số.
`[01:09:41]` Và khi đó tôi vẫn còn ngân sách tìm kiếm, nếu độ sâu không bằng 0 thì khi tôi lặp lại, nếu tôi là tác nhân thì độ sâu là d, còn nếu tôi là đối thủ thì độ sâu là d trừ 1.
`[01:10:01]` Và điều này chỉ để đảm bảo rằng một đơn vị độ sâu tương ứng với cả tác nhân và đối thủ đang đi, vì vậy tôi không trừ hai lần ở đây.
`[01:10:13]` Vì vậy, về cơ bản là nó.
`[01:10:16]` Hy vọng rằng bạn đã thấy điều này giống như lần tái phát thứ sáu mà bạn đã thấy.
`[01:10:19]` Vì vậy hy vọng bạn đã quen với việc nhìn thấy những thứ này.
`[01:10:22]` Không có gì đảm bảo rằng bạn sẽ tìm được chính sách tối ưu.
`[01:10:25]` Đó là một heuristic hoàn chỉnh.
`[01:10:27]` Và hiệu quả của nó sẽ phụ thuộc vào chức năng đánh giá của bạn tốt đến mức nào.
`[01:10:35]` Nhưng điều tuyệt vời là bạn có thể kiểm soát được điều này một chút.
`[01:10:40]` Bạn càng tìm kiếm sâu hơn, bạn càng ít nhạy cảm với việc hàm đánh giá là xấu, trong khi đó nếu bạn thực hiện tìm kiếm nông thì hàm đánh giá của bạn sẽ tốt hơn.
`[01:10:55]` ĐƯỢC RỒI.
`[01:10:55]` Chức năng đánh giá, kiến ​​thức trước đó đánh giá trạng thái một cách nhanh chóng.
`[01:11:04]` Hãy tìm kiếm ở một độ sâu nhất định và sau đó sử dụng chức năng đánh giá.
`[01:11:08]` Đây là tìm kiếm có giới hạn độ sâu.
`[01:11:09]` Và sự tương tự này hơi giống với chi phí trong tương lai trong các bài toán tìm kiếm khi bạn nhìn về phía trước một bước và sau đó bạn ước chừng.
`[01:11:28]` Vì vậy, để kết thúc ở đây-- thực ra, một lưu ý khác về các hàm đánh giá cần chuẩn bị cho lần tiếp theo là nếu bạn nghĩ về-- các hàm đánh giá sẽ nhắc bạn nhớ đến điều gì?
`[01:11:42]` Có lẽ một cái gì đó trong học tập tăng cường.
`[01:11:46]` Vâng.
`[01:11:46]` Vậy giá trị Q hay chỉ là giá trị đơn giản hơn, phải không?
`[01:11:56]` Vì vậy, giá trị Q trong học tăng cường.
`[01:11:58]` Hãy tiếp tục với điều đó vì đó là những gì chúng ta đã nghiên cứu, là giá trị gần đúng của giá trị thực.
`[01:12:06]` Và điều này sẽ cho phép chúng ta nghĩ đến là hàm đánh giá này cũng có thể học được.
`[01:12:14]` Nó có thể được học từ dữ liệu được giám sát.
`[01:12:16]` Nó có thể được học từ học tăng cường.
`[01:12:18]` Và đó chính xác là điều chúng ta sẽ làm trong bài giảng tiếp theo là tìm hiểu hàm đánh giá.
`[01:12:25]` ĐƯỢC RỒI.
`[01:12:25]` Nhưng bây giờ chỉ tóm tắt thôi.
`[01:12:27]` Vậy là chúng tôi đã giới thiệu trò chơi.
`[01:12:29]` Ở đây, tác nhân vẫn đang cố gắng tối đa hóa tiện ích, nhưng chiến lược của đối thủ vẫn chưa được biết.
`[01:12:35]` Nguyên tắc minimax nói rằng, chỉ cần giả sử trong trường hợp xấu nhất đối thủ đang cố gắng giành lấy bạn và giảm thiểu lợi ích.
`[01:12:43]` Chúng tôi xác định một loạt các lần tái phát khác nhau.
`[01:12:47]` Với một trò chơi và một chính sách, chúng ta có thể đánh giá trò chơi, Expectimax, Minimax, Expectiminimax.
`[01:12:54]` Và bạn có thể tưởng tượng những người khác mong đợiiminimini, Expectimax hoặc bất cứ điều gì bạn muốn.
`[01:13:00]` Và chúng tôi xem xét hai cách để tăng tốc mọi thứ, việc cắt tỉa alpha-beta là chính xác và chức năng đánh giá là gần đúng.
`[01:13:11]` Và lần tới, chúng ta sẽ xem xét cách bạn có thể học tập trong bối cảnh trò chơi.
`[01:13:17]` Và chúng ta sẽ xem xét một thứ gọi là học TD.

---

## Game Playing 1 — Minimax, Alpha-beta Pruning | Stanford CS221: AI (Autumn 2019)

- **Link:** https://youtu.be/3pU-Hrz_xy4
- **Kênh:** Stanford Online — đăng ngày 08/01/2020
- **Thời lượng:** 01:21:33
- **Nguồn:** phụ đề gốc "English" (bản chuẩn của kênh) → dịch máy sang tiếng Việt, giữ nguyên mốc thời gian
- **Quy mô:** 1000 dòng, ~19407 từ

### Transcript

`[00:00:04]` Được rồi. Hãy bắt đầu nào các bạn.
`[00:00:08]` Được rồi. Vì vậy, một vài thông báo trước khi chúng ta bắt đầu.
`[00:00:13]` Vì vậy, ừm, nếu bạn có- nếu bạn cần chỗ ở của OAE, vui lòng cho chúng tôi biết nếu bạn chưa làm điều đó.
`[00:00:19]` Vì vậy, bạn cần cho chúng tôi biết trước ngày 31 tháng 10 vì chúng tôi cần tìm ra ngày thi thay thế.
`[00:00:24]` Vì vậy, ừ, chúng tôi sẽ liên hệ lại với bạn về thông tin chi tiết chính xác về ngày thi thay thế nhưng hãy cho chúng tôi biết trước ngày 31 tháng 10.
`[00:00:31]` Ừm, đề xuất dự án cũng phải nộp vào thứ Năm tuần này.
`[00:00:35]` Vì vậy hãy nói chuyện với TA.
`[00:00:36]` Hãy nói chuyện với chúng tôi, đến giờ hành chính, tất cả những điều đó.
`[00:00:38]` Được rồi. Được rồi.
`[00:00:40]` Vì vậy, hôm nay tôi muốn nói về trò chơi.
`[00:00:42]` Vì vậy, ừm, chúng ta đã bắt đầu nói về ý tưởng về các mô hình dựa trên trạng thái, thực tế là nếu bạn muốn có trạng thái như một cách thể hiện, ừm, mọi thứ về- mọi thứ mà chúng ta cần lập kế hoạch cho tương lai.
`[00:00:54]` Chúng ta đã nói về vấn đề tìm kiếm rồi.
`[00:00:55]` Chúng tôi đã nói về MDP trong đó chúng tôi có một bối cảnh mà chúng tôi đang chơi trái với tự nhiên và, và thiên nhiên có thể chơi, ừ, giống như theo xác suất.
`[00:01:03]` Và dựa vào đó mà chúng ta cần phản hồi.
`[00:01:06]` Uh, và hôm nay chúng ta muốn nói về trò chơi.
`[00:01:08]` Vì vậy, khi thiết lập, chúng ta có hai người chơi đấu với nhau.
`[00:01:12]` Vì vậy, chúng ta không nhất thiết phải đi ngược lại với thiên nhiên vốn có thể hành động theo xác suất.
`[00:01:16]` Chúng tôi thực sự đang đấu với một đặc vụ thông minh khác mà- điều đó đang quyết định vì lợi ích của chính anh ấy hoặc cô ấy.
`[00:01:22]` Vì vậy, đó là ý tưởng chính của trò chơi. Được rồi.
`[00:01:26]` Vì vậy, hãy bắt đầu với một ví dụ.
`[00:01:28]` Đây thực sự là một ví dụ mà chúng ta sẽ sử dụng trong suốt bài giảng. Được rồi.
`[00:01:32]` Ví dụ là, chúng ta có ba thùng.
`[00:01:33]` Chúng ta có A, B và C. Và sau đó bạn chọn một trong ba nhóm này.
`[00:01:39]` Và sau đó tôi chọn một số từ nhóm.
`[00:01:41]` Và câu hỏi là, mục tiêu của bạn ở đây là tối đa hóa số đã chọn và câu hỏi là, bạn sẽ sử dụng nhóm nào?
`[00:01:48]` Được rồi. Vậy có bao nhiêu bạn sẽ chọn nhóm A?
`[00:01:52]` Không ai tin tôi cả, được thôi [CƯỜI] Không ai tin tôi cả, tốt.
`[00:01:57]` Có bao nhiêu bạn sẽ chọn B?
`[00:02:00]` Được rồi. Thế nên bây giờ mọi người không còn tin tưởng tôi nữa [CƯỜI].
`[00:02:03]` Có bao nhiêu bạn chọn C?
`[00:02:05]` Được rồi. Vì vậy, có rất nhiều người ở đó.
`[00:02:07]` Vì vậy, làm thế nào bạn đưa ra quyết định đó?
`[00:02:09]` Vì vậy, cách bạn đưa ra quyết định này là, nếu bạn chọn A, về cơ bản bạn đang cho rằng tôi không chơi kiểu như thử- Tôi không cố gắng để có được bạn.
`[00:02:16]` Thực ra tôi có thể cho bạn 50.
`[00:02:17]` Và nếu tôi cho bạn 50, điều đó thật tuyệt vời.
`[00:02:19]` Và bạn có giá trị rất lớn này mà bạn đang cố gắng tối đa hóa.
`[00:02:23]` Nếu bạn nghĩ rằng tôi sẽ hành động đối địch, chống lại bạn và sau đó cố gắng giảm thiểu số lượng của bạn, thì bạn sẽ chọn nhóm B, đúng không, bởi vì, trong trường hợp xấu nhất, tôi sẽ chọn số thấp nhất của nhóm và,
`[00:02:35]` và trong nhóm B, số thấp nhất là số tốt hơn âm 50 và âm 5.
`[00:02:39]` Vì vậy, nếu bạn cho rằng tôi đang cố gắng giảm thiểu lợi ích của bạn thì bạn sẽ chọn nhóm B.
`[00:02:44]` Và nếu bạn không biết tôi đang chơi như thế nào và bạn chỉ cho rằng có thể tôi đang hành động một cách ngẫu nhiên và có thể tôi, giống như, tung một đồng xu và sau đó dựa vào đó để quyết định như nên đưa cho bạn số nào, bạn có thể chọn C vì trong kỳ vọng,
`[00:02:58]` C không tệ phải không?
`[00:02:59]` Giống như, C, nếu bạn chỉ tính trung bình các số này và sau đó chọn giá trị trung bình từ A, B, C- A, A và B và C, giá trị trung bình của A là 0, đối với B, là 2 và sau đó đối với C, là, ừm, 5.
`[00:03:12]` Đúng, vậy, vậy, nếu tôi chơi nó một cách ngẫu nhiên, bạn có thể nói, à, có lẽ tôi sẽ cho bạn thứ gì đó khoảng 5.
`[00:03:18]` Vậy bạn sẽ chọn C. Được rồi.
`[00:03:19]` Vì vậy, hôm nay chúng tôi muốn nói về những chính sách khác nhau mà bạn có thể chọn trong các cài đặt này và cách chúng tôi nên mô phỏng đối thủ của mình cũng như cách chúng tôi chính thức hóa những vấn đề này thành vấn đề của trò chơi.
`[00:03:28]` Đây là một ví dụ mà chúng ta mới bắt đầu.
`[00:03:31]` Được rồi. Vì vậy, kế hoạch là chính thức hóa trò chơi, hãy nói về cách chúng tôi tính toán các giá trị trong bối cảnh trò chơi.
`[00:03:37]` Vậy chúng ta sẽ nói về Expectimax và Minimax.
`[00:03:39]` Và đến cuối bài giảng, chúng ta sẽ nói về cách làm mọi việc nhanh hơn.
`[00:03:44]` Vì vậy, chúng ta sẽ nói về các hàm đánh giá như một cách để làm mọi thứ nhanh hơn, đó là sử dụng kiến ​​thức miền để, để, xác định các hàm đánh giá qua ghi chú.
`[00:03:53]` Chúng ta cũng sẽ nói về việc cắt tỉa alpha-beta, đây là một cách tổng quát hơn để cắt tỉa cây của bạn và giúp mọi việc diễn ra nhanh hơn.
`[00:03:59]` Được rồi. Được rồi.
`[00:04:00]` Đó là kế hoạch cho ngày hôm nay.
`[00:04:02]` Được rồi. Vì vậy, chúng tôi vừa xác định trò chơi này và cách thực hiện kế hoạch này là tạo ra một thứ gọi là cây trò chơi.
`[00:04:10]` Cây trò chơi rất giống với cây tìm kiếm.
`[00:04:12]` Vì vậy, điều này có thể khiến bạn nhớ đến cây tìm kiếm mà chúng ta đã nói về nó khoảng hai tuần trước, phải không.
`[00:04:17]` Vì vậy, ý tưởng là, chúng ta có cây trò chơi này trong đó chúng ta có các nút trong cây này và mỗi nút là điểm quyết định của người chơi.
`[00:04:25]` Và chúng ta có những người chơi khác nhau ở đây, đúng vậy, giống như tôi đang chơi hoặc bạn đang chơi hoặc chúng ta có hai người khác nhau, như đang chơi ở đây.
`[00:04:30]` Vì vậy, các nút quyết định này có thể dành cho một trong những người chơi chứ không phải cho cả hai người.
`[00:04:34]` Và khi đó mỗi đường đi từ gốc đến lá sẽ là một kết quả có thể xảy ra của trò chơi.
`[00:04:39]` Được rồi. Vì vậy, có thể là tôi đang chọn trừ 50 và sau đó quyết định của bạn là chọn nhóm A để con đường đó sẽ cho chúng ta một kết quả có thể xảy ra về cách mọi thứ có thể diễn ra.
`[00:04:50]` Được rồi. Vì vậy, về cơ bản đó là những gì cái cây đại diện ở đây.
`[00:04:54]` Được rồi. Vì vậy, các nút ở cấp độ đầu tiên là các quyết định mà tôi đã đưa ra và sau đó, nút đầu tiên, nút gốc là các quyết định mà bạn đang thực hiện trong cài đặt này.
`[00:05:04]` Vì vậy, nếu chúng ta chính thức hóa vấn đề này thêm một chút nữa, chúng ta sẽ chính thức hóa vấn đề này như một trò chơi có tổng bằng 0 giữa hai người chơi.
`[00:05:11]` Được rồi. Vì vậy, trong lớp học này, a- ít nhất, giống như hôm nay, chúng ta sẽ nói về trò chơi hai người chơi trong đó chúng ta có một đặc vụ và chúng ta có một đối thủ.
`[00:05:19]` Sau đó chúng ta sẽ nói về các chính sách và giá trị và đối với tất cả những điều đó, hãy coi bạn-chính bạn là người đại diện.
`[00:05:26]` Vậy là bạn đang chơi cho người đại diện.
`[00:05:27]` Bạn đang tối ưu hóa cho đại lý.
`[00:05:29]` Đối thủ là đối thủ đang chơi với bạn.
`[00:05:31]` Được rồi. Vì vậy, hôm nay chúng ta cũng sẽ nói về trò chơi, ừ, đó là những trò chơi theo lượt.
`[00:05:38]` Vì vậy chúng ta sẽ nói về những thứ như cờ vua.
`[00:05:40]` Chúng ta không nói về những thứ như oẳn tù tì.
`[00:05:43]` Chúng ta sẽ thực sự nói về điều đó vào lần tới khi chúng ta có những trò chơi đồng thời mà bạn chơi cùng một lúc.
`[00:05:48]` Hôm nay chúng ta đang nói về cài đặt theo lượt.
`[00:05:51]` Cài đặt lượt chơi của hai người chơi.
`[00:05:52]` Khả năng quan sát đầy đủ, chúng tôi thấy tất cả mọi thứ.
`[00:05:54]` Chúng ta không nói về những trò chơi như poker mà bạn không nhất thiết phải nhìn thấy, kiểu như, bạn có khả năng quan sát một phần và bạn không nhất thiết phải nhìn thấy ván bài của đối thủ.
`[00:06:02]` Quan sát đầy đủ, trò chơi hai người chơi và cả trò chơi có tổng bằng 0.
`[00:06:05]` Và, và tổng bằng 0 có nghĩa là, nếu tôi thắng và nếu tôi nhận được, chẳng hạn như, 10 đô la từ chiến thắng, thì đối thủ của tôi sẽ thua 10 đô la.
`[00:06:12]` Vì vậy, tổng hữu dụng sẽ bằng 0.
`[00:06:15]` Nếu tôi thắng một số tiền thì đối thủ của tôi cũng thua số tiền tương tự.
`[00:06:18]` Được rồi. Được rồi.
`[00:06:20]` Vì vậy, những điều chúng ta cần khi xác định trò chơi là gì?
`[00:06:23]` Vì vậy, chúng ta cần phải biết các cầu thủ.
`[00:06:25]` Chúng ta có người đại diện, chúng ta có đối thủ.
`[00:06:28]` Ngoài ra, bạn cần xác định một loạt thứ.
`[00:06:30]` Điều này sẽ khiến bạn nhớ đến bài giảng tìm kiếm hoặc bài giảng MDP.
`[00:06:33]` Vì vậy, bạn có thể có trạng thái bắt đầu, khi S bắt đầu.
`[00:06:36]` Chúng ta có các hành động là một hàm của trạng thái, cung cấp cho chúng ta các hành động có thể có từ trạng thái S tương tự như trước đó.
`[00:06:44]` Bạn có chức năng kế thừa tương tự như vấn đề tìm kiếm.
`[00:06:46]` Vì vậy, hàm kế thừa sẽ nhận một trạng thái và hành động, đồng thời nó cho chúng ta biết kết quả là bạn sẽ đạt đến trạng thái nào.
`[00:06:53]` Và this-và, và bạn có hàm end-this end để kiểm tra xem bạn có ở trạng thái kết thúc hay không.
`[00:06:58]` Và điều khác biệt ở đây, có hai điều khác biệt ở đây.
`[00:07:01]` Một là chức năng tiện ích này.
`[00:07:03]` Và chức năng tiện ích về cơ bản mang lại cho chúng ta tiện ích của tác nhân ở trạng thái cuối.
`[00:07:08]` Được rồi. Vì vậy, một điều cần lưu ý ở đây là tiện ích chỉ xuất hiện ở trạng thái kết thúc.
`[00:07:14]` Vì vậy, sau khi bạn kết thúc trò chơi, chẳng hạn như, tôi đã chơi cờ và bây giờ tôi đã thắng cờ và đây là ván cờ này.
`[00:07:20]` Và sau đó tôi nhận được tiện ích của mình.
`[00:07:21]` Giống như, khi tôi di chuyển, thông qua ván cờ của tôi, tôi không nhận được bất kỳ tiện ích nào.
`[00:07:26]` Giống như, bạn chỉ nhận được tiện ích ở trạng thái kết thúc.
`[00:07:28]` Và, và cách chúng tôi xác định tiện ích, là chúng tôi đang xác định nó cho các tác nhân bởi vì một lần nữa, chúng tôi đang phát lại từ góc độ của tác nhân.
`[00:07:35]` Vậy thì đối phương sẽ có ích lợi gì?
`[00:07:38]` Trừ điều đó, phải.
`[00:07:40]` Vì vậy, việc phủ nhận điều đó sẽ có ích cho đối thủ. Được rồi.
`[00:07:46]` Tôi đã nghe nói về quá trình ra quyết định Markov có thể quan sát được một phần.
`[00:07:50]` Đây là, giống như, nó là cái gì vậy?
`[00:07:52]` Giống như, điều này có thể quan sát được một phần không?
`[00:07:54]` Được rồi. Vì vậy, câu hỏi đặt ra là liệu quá trình ra quyết định Markov có thể quan sát được một phần này không?
`[00:07:57]` Đây không phải là quá trình ra quyết định Markov có thể quan sát được một phần.
`[00:08:00]` Ừm, có những lớp nói về, kiểu như có- quyết định này do lớp của Mykel Kochenderfer không chắc chắn và thực sự dạy điều đó.
`[00:08:06]` Vì vậy bạn nên, bạn nên, bạn nên tham gia các lớp học về vấn đề đó.
`[00:08:08]` Đây không phải là quá trình quyết định Markov có thể quan sát được một phần.
`[00:08:10]` Điều này hoàn toàn có thể quan sát được.
`[00:08:12]` Bạn có hai người chơi chơi với nhau. Đó là một thiết lập rất khác.
`[00:08:15]` [không nghe được].
`[00:08:19]` Vì vậy, câu hỏi đặt ra là có sự ngẫu nhiên nào ở đây không?
`[00:08:22]` Và cho đến nay, tôi vẫn chưa thảo luận về bất kỳ sự ngẫu nhiên nào.
`[00:08:24]` Ở phần sau của bài giảng, tôi sẽ nói thực sự về trường hợp có thể có một bản chất ở giữa hoạt động ngẫu nhiên và sau đó chúng ta sẽ giải quyết vấn đề đó như thế nào.
`[00:08:30]` Nhưng cho đến nay, hai người chơi đang chơi với nhau.
`[00:08:33]` Được rồi. Được rồi.
`[00:08:35]` Và điều khác mà chúng tôi cần xác định khi bạn định nghĩa một trò chơi, ừm, là người chơi.
`[00:08:40]` Vì vậy, vì vậy, người chơi là một hàm của trạng thái.
`[00:08:42]` Và về cơ bản cho chúng ta biết ai đang kiểm soát, chẳng hạn như ai đang chơi.
`[00:08:45]` Vậy trong ván cờ, bây giờ đến lượt ai.
`[00:08:48]` Và đó là chức năng mà bạn sẽ xác định khi chúng ta chính thức xác định trò chơi đó.
`[00:08:53]` Được rồi. Được rồi.
`[00:08:55]` Vì vậy, hãy xem một ví dụ.
`[00:08:57]` Thế là chúng ta có một ván cờ.
`[00:08:58]` Người chơi có màu trắng và đen.
`[00:09:00]` Giả sử bạn đang chơi quân trắng.
`[00:09:01]` Vì vậy người đại diện là người da trắng, đối thủ là người da đen.
`[00:09:04]` Và khi đó trạng thái S có thể biểu thị vị trí của tất cả các quân cờ và lượt của nó.
`[00:09:09]` Vì vậy, đó là những gì nhà nước đang đại diện.
`[00:09:12]` Vậy lượt của người chơi là của ai và sau đó là vị trí của các quân cờ.
`[00:09:15]` Vì vậy, hành động sẽ là tất cả các nước cờ hợp pháp mà người chơi S có thể thực hiện.
`[00:09:21]` Và về cơ bản, IsEnd sẽ kiểm tra xem trạng thái là chiếu tướng hay hòa.
`[00:09:25]` Đó là những gì nó đang kiểm tra.
`[00:09:27]` Được rồi. Vậy thì tiện ích sẽ là gì?
`[00:09:30]` Tiện ích sẽ có nếu bạn, kiểu như, bạn sẽ chỉ nhận được nó khi bạn thắng hoặc khi bạn thua hoặc, hoặc nếu có kết quả hòa.
`[00:09:37]` Vì vậy, cách chúng ta định nghĩa nó là, giả sử, cộng vô cùng nếu quân trắng thắng bởi vì, do người đại diện là quân trắng và, và nó sẽ bằng 0 nếu, nếu hòa và khi đó nó sẽ là âm vô cực nếu quân đen thắng.
`[00:09:49]` Được rồi. Vâng. Vì vậy, đó là tất cả những điều mà chúng ta cần phải xác định. Đúng.
`[00:09:55]` [không nghe được] Cái- tại sao chúng ta lại có, tại sao chúng ta lại có lượt của ai trong trạng thái.
`[00:10:05]` Uh, đó thực sự là một cách để trích xuất hàm trình phát.
`[00:10:09]` Vì vậy, cách bạn có thể định nghĩa hàm của trình phát là hàm của trình phát là hàm của trạng thái.
`[00:10:13]` Vì vậy, nhà nước đã cần mã hóa đến lượt ai.
`[00:10:16]` Vì vậy, bạn có thể trích xuất điều đó từ trình phát.
`[00:10:18]` Bạn đã nói rằng, tiện ích sẽ là tiện ích tiêu cực đối với tác nhân p.
`[00:10:22]` Đó có phải là giả định rằng cả hai đều thực hiện những hành động giống nhau trong suốt thời gian đó không?
`[00:10:26]` Không. Vậy, vậy, đây là lần lượt, phải không?
`[00:10:28]` Vì vậy, tôi thực hiện một hành động và sau đó đối thủ thực hiện một hành động và sau đó người đại diện thực hiện một hành động.
`[00:10:31]` Đối thủ thực hiện một hành động và sau đó vào cuối trò chơi, bạn nhận được tiện ích và sau đó đối thủ nhận được- nhận được điểm tiêu cực của tiện ích đó.
`[00:10:39]` Nhưng các hành động có thể rất khác nhau.
`[00:10:41]` Các chính sách có thể rất khác nhau.
`[00:10:42]` Và chúng ta sẽ nói về cách nghĩ ra điều đó.
`[00:10:43]` Vậy tại sao điều kiện đó lại thay đổi, vậy điều gì xảy ra nếu quân trắng thắng, bạn nhận được cộng vô cực, nhưng nếu đen thắng, nếu đen thắng, bạn nhận được âm vô cực, nhưng giống như, khi bạn thua- bạn có- bạn không có trò chơi có tổng bằng 0.
`[00:10:57]` Chúng ta sẽ nói một chút về bài giảng tiếp theo.
`[00:10:59]` Vì vậy, tôi đang nói về trò chơi có tổng bằng 0 ở đây vì thuật toán bạn đang nói đến là dành cho trò chơi có tổng bằng 0.
`[00:11:05]` Giống như chúng ta đang nói chuyện - sẽ nói về các chính sách loại tối thiểu-nhỏ-tối đa.
`[00:11:08]` Nơi tôi đang giảm thiểu và tác nhân đang tối đa hóa.
`[00:11:10]` Vì vậy, tôi sẽ quay lại vấn đề đó nếu, nếu tôi chưa trả lời câu hỏi đó.
`[00:11:13]` Giống như chúng ta có thể nói về nó sau giờ học và cả bài giảng tiếp theo, chúng ta sẽ nói về nhiều biến thể của trò chơi.
`[00:11:18]` Vì vậy- nhưng hiện tại, tôi đang giả định một loạt giả định đơn giản hóa về trò chơi này.
`[00:11:23]` Giả định là nếu trắng thắng thì âm vô cực, nhưng nếu trắng thắng, đen sẽ có 0 tiện ích, [không nghe được]. [TIẾNG ỒN] Ờ, vâng.
`[00:11:34]` Vì vậy các tiện ích này cần cộng lại bằng 0.
`[00:11:36]` Nếu trắng thắng, có thể trắng được 10, nhưng đen bị trừ 10.
`[00:11:39]` Vì vậy, giống như họ, họ cần phải cộng lại.
`[00:11:41]` Được rồi. Được rồi.
`[00:11:42]` Vì vậy, loại đặc điểm của trò chơi mà chúng ta đã thảo luận là hai điều chính.
`[00:11:47]` Một là tất cả các tiện ích đều ở trạng thái kết thúc.
`[00:11:50]` Vì vậy, trong suốt con đường này, bạn sẽ không nhận được các tiện ích mới, trái ngược với những thứ như MDP ở nơi chúng tôi đã ở, chúng tôi đã nhận được phần thưởng trong suốt con đường.
`[00:11:57]` Nhưng ở đây, giống như tiện ích chỉ xuất hiện ở phần cuối.
`[00:12:00]` Ở trạng thái cuối. Và điều khác là những người chơi khác nhau sẽ nắm quyền kiểm soát ở các trạng thái khác nhau, đúng không.
`[00:12:06]` Giống như nếu bạn đang ở trong trạng thái, bạn có thể không kiểm soát được mọi thứ.
`[00:12:10]` Có thể đến lượt đối thủ của bạn và bạn có thể không làm được gì.
`[00:12:13]` Được rồi? Vì vậy, đó là hai đặc điểm chính của trò chơi. Được rồi.
`[00:12:18]` Vì vậy, hãy nhìn vào một trò chơi mà bạn sắp chơi.
`[00:12:22]` Được rồi. Vì vậy, trò chơi là một trò chơi giảm một nửa.
`[00:12:24]` Vì vậy, chúng tôi bắt đầu với số N. Và sau đó người chơi- người chơi lần lượt thay phiên nhau và họ có thể làm hai việc.
`[00:12:31]` Họ có thể trừ 1.
`[00:12:32]` Vì vậy, họ có thể giảm N hoặc có thể thay N bằng N trên 2.
`[00:12:36]` Vì vậy, họ có thể chia hoặc trừ.
`[00:12:37]` Được rồi? Và người chơi còn lại 0 sẽ thắng.
`[00:12:42]` Được rồi. Vì vậy, đó là, đó là thiết lập.
`[00:12:44]` Đó là- có phải mọi người đang theo dõi điều đó không?
`[00:12:46]` Vì vậy, hãy cố gắng chính thức hóa trò chơi và sau đó bạn muốn tìm ra đâu là chính sách tốt để thực hiện nó.
`[00:12:51]` Vì vậy, ngay bây giờ chúng ta hãy cố gắng- hãy cố gắng chính thức hóa điều này.
`[00:12:56]` Vì vậy, bạn biết tất cả những thứ khác nhau của mô hình là gì.
`[00:13:00]` Vì vậy, hãy có một tập tin mới.
`[00:13:02]` Chúng ta sẽ định nghĩa trò chơi này.
`[00:13:05]` Vì vậy, đây là một trò chơi giảm một nửa.
`[00:13:07]` Được rồi, vậy chúng ta hãy lấy cái này. Được rồi.
`[00:13:13]` Vì vậy, chúng tôi đang khởi tạo với N. Vì vậy, chúng tôi bắt đầu với một số N. Vậy trạng thái của chúng tôi là gì?
`[00:13:22]` Bang của chúng ta sẽ mã hóa người chơi đến lượt của ai và số N. Được rồi.
`[00:13:25]` Vậy là chúng ta có một người chơi.
`[00:13:27]` Giả sử người chơi của chúng ta cộng 1 hoặc trừ 1.
`[00:13:29]` Đó là cách tôi xác định người chơi là ai.
`[00:13:32]` Vì vậy, trạng thái bắt đầu. Giả sử người chơi cộng 1 vị trí với N. Vậy đó là cộng 1 và N. Và sau đó chúng ta cần xác định điểm cuối của nó.
`[00:13:40]` Được rồi. Vì vậy, những gì bạn làm là kiểm tra kết thúc.
`[00:13:44]` Vâng, chúng tôi có nhà nước. Chúng tôi tách nó thành trình phát và số.
`[00:13:48]` Và nếu số đó bằng 0 thì đó là lúc trò chơi kết thúc.
`[00:13:51]` Đó là điều kiện kết thúc của chúng tôi. Được rồi.
`[00:13:54]` Tiện ích thì sao?
`[00:13:57]` Vâng, chúng tôi nhận được tiện ích ở trạng thái kết thúc.
`[00:13:59]` Vì vậy, một lần nữa tôi lấy một trạng thái.
`[00:14:01]` Tôi tách nó thành máy nghe nhạc và số.
`[00:14:03]` Tôi đảm bảo rằng chúng tôi đang ở trạng thái kết thúc nên chúng tôi khẳng định số đó bằng 0 vì loại đó xác định xem bạn có ở trạng thái kết thúc hay không.
`[00:14:11]` Và rồi tiện ích mà tôi sẽ nhận được, nếu tôi thắng, tôi sẽ nhận được vô tận.
`[00:14:15]` Nếu tôi không thắng tôi sẽ nhận được âm vô cực.
`[00:14:17]` Và cách tôi định nghĩa điều đó ở đây là chỉ thực hiện trình phát vô cực.
`[00:14:21]` Bởi vì người chơi- Tôi là người đại diện, tôi là người chơi cộng 1.
`[00:14:25]` Đối thủ là người chơi bị trừ 1.
`[00:14:27]` Đó là cách- giống như nếu trừ 1 thắng thì tôi sẽ nhận được âm vô cực.
`[00:14:30]` Được rồi? Những hành động mà chúng ta có thể làm là có thể trừ 1 hoặc có thể chia.
`[00:14:36]` Chia cho 2. Ý tôi là trừ và chia là những hành động chính.
`[00:14:40]` Và người chơi, chức năng người chơi này lại lấy trạng thái.
`[00:14:43]` Tôi sẽ tách trạng thái thành trình phát và số rồi trả lại trình phát.
`[00:14:48]` Nhờ đó tôi biết được lượt của người chơi là ai.
`[00:14:51]` Và sau đó chúng ta cần xác định hàm kế tiếp.
`[00:14:54]` Hàm kế tiếp nhận một trạng thái và một hành động, đồng thời cho chúng tôi biết bạn sẽ đạt đến trạng thái nào.
`[00:15:00]` Vì vậy, một lần nữa một trạng thái.
`[00:15:02]` Tôi sẽ tách nó thành một máy nghe nhạc và một con số.
`[00:15:05]` Và sau đó những hành động tôi có thể thực hiện là hai điều.
`[00:15:07]` Tôi có thể trừ 1 hoặc tôi có thể chia cho 2.
`[00:15:11]` Vì vậy, nếu tôi đang trừ thì tôi sẽ trả về một trạng thái mới là trừ người chơi vì bây giờ lượt của nó là trừ 1 hoặc cộng 1- giống như bây giờ là trừ bất cứ ai quay.
`[00:15:20]` Và sau đó tôi sẽ làm số trừ 1.
`[00:15:22]` Nếu hành động là chia, chúng tôi sẽ trả về người chơi mới là người chơi trừ và sau đó chia số cho 2.
`[00:15:29]` Được rồi? Đó là nó.
`[00:15:32]` Vì vậy, chúng tôi vừa xác định trò chơi này, được rồi.
`[00:15:35]` Vâng. Được rồi.
`[00:15:43]` Vì vậy, đó là trò chơi của tôi.
`[00:15:46]` Chút nữa chúng ta sẽ chơi trò chơi này.
`[00:15:49]` Nhưng hãy- nhanh chóng trước khi chơi nó.
`[00:15:51]` Hãy nói về giải pháp cho một trò chơi là gì.
`[00:15:53]` Giống như những gì chúng ta đang cố gắng làm trong một trò chơi.
`[00:15:55]` Vì vậy, nếu bạn còn nhớ MDP thì giải pháp cho trò chơi là chính sách.
`[00:15:58]` Vì vậy, chính sách là một chức năng của nhà nước.
`[00:16:00]` Nó sẽ trả về hành động mà bạn cần thực hiện trong trạng thái đó.
`[00:16:03]` Vì vậy, tương tự như MDP ở đây, chúng tôi có chính sách.
`[00:16:06]` Nhưng, nhưng, vấn đề là tôi có hai người chơi.
`[00:16:08]` Vì vậy, chính sách cũng nên phụ thuộc vào người chơi.
`[00:16:11]` Vậy là tôi có Pi của P là chính sách của người chơi P. Và tôi có thể định nghĩa nó tương tự như trước.
`[00:16:17]` Nó có thể là một chính sách như một chức năng của một trạng thái và nó có thể chỉ trả về một hành động.
`[00:16:21]` Và đây sẽ là một chính sách mang tính quyết định.
`[00:16:23]` Giống như một cách xác định nếu tôi ở trạng thái, chính sách sẽ cho tôi biết cần thực hiện hành động nào, được chứ.
`[00:16:28]` Chúng ta cũng có thể định nghĩa các chính sách Stochastic.
`[00:16:31]` Vì vậy, những gì các chính sách Stochastic sẽ làm là chúng sẽ thực hiện một trạng thái và hành động, sau đó chúng sẽ trả về một số từ 0 đến 1, tức là xác suất thực hiện hành động đó.
`[00:16:42]` Vì vậy, chính sách Pi của một trạng thái và hành động về cơ bản sẽ trả về xác suất người chơi P thực hiện hành động A ở trạng thái S. Vì vậy, nếu bạn nhớ ví dụ về nhóm, có lẽ một nửa thời gian tôi sẽ chọn số
`[00:16:56]` ở bên phải và một nửa thời gian tôi sẽ chọn số ở bên trái.
`[00:16:59]` Đó sẽ là một chính sách ngẫu nhiên, phải không.
`[00:17:00]` Tôi không nói một cách dứt khoát cho bạn biết hành động đó là gì.
`[00:17:03]` Tôi đang nghĩ ra cách ngẫu nhiên để cho bạn biết tôi đang tuân theo chính sách nào, được chứ?
`[00:17:08]` Vì vậy, chúng tôi có chính sách xác định.
`[00:17:09]` Chính sách ngẫu nhiên. Giống như trong trò chơi của chúng tôi, chúng tôi có thể theo dõi một trong số họ.
`[00:17:12]` Trong trường hợp nào bạn muốn có chính sách ngẫu nhiên so với chính sách xác định?
`[00:17:18]` Ờ, cậu có thể lên tiếng được không?
`[00:17:19]` Vâng. Trong trường hợp nào bạn muốn có chính sách ngẫu nhiên so với chính sách xác định?
`[00:17:24]` Vậy trong trường hợp nào bạn muốn có chính sách ngẫu nhiên so với chính sách xác định?
`[00:17:28]` Một lần nữa, chúng tôi sẽ đề cập đến vấn đề đó nhiều hơn một chút vào lần tới tùy thuộc vào trò chơi bạn tham gia.
`[00:17:32]` Giống như bạn có một số đặc tính khi các chính sách ngẫu nhiên mang lại cho chúng ta một số đặc tính và các chính sách xác định đang mang lại cho chúng ta một số đặc tính khác.
`[00:17:39]` Ngay bây giờ bạn chỉ đang định nghĩa chúng là những thứ có thể tồn tại.
`[00:17:42]` Và, ừ, chúng ta có thể nghĩ rằng đối thủ của chúng ta đang hành động chắc chắn nếu bạn biết chính xác họ đang làm gì.
`[00:17:48]` Đôi khi tôi không biết.
`[00:17:50]` Có lẽ bạn thích tôi đã học được nó bằng cách nào đó và tôi có một số điều ngẫu nhiên ở đó.
`[00:17:53]` Và sau đó tôi sẽ sử dụng một số chính sách ngẫu nhiên về cách đối thủ sẽ đấu với tôi.
`[00:17:57]` Nhưng chúng ta sẽ áp dụng điều- giống như những gì chúng ta thu được từ chính sách ngẫu nhiên và chính sách tất định sẽ nhiều hơn một chút vào lần tới.
`[00:18:03]` Được rồi. Được rồi. Vậy được rồi.
`[00:18:06]` Vì vậy, bây giờ hãy- được rồi để bây giờ chúng ta biết rằng đó là chính sách mà chúng ta muốn đạt được.
`[00:18:09]` Chúng ta hãy thử, chúng ta hãy thử viết ra một chính sách cho trò chơi này.
`[00:18:14]` Và sau đó tôi sẽ xác định chính sách con người.
`[00:18:16]` Và điều tôi muốn nói là điều này sẽ đến từ con người.
`[00:18:20]` Điều đó có nghĩa là một trong số các bạn hoặc hai trong số các bạn.
`[00:18:23]` Vì vậy, ừm, tôi cần hai tình nguyện viên cho việc này nhưng chúng ta hãy nhanh chóng viết nó lên.
`[00:18:28]` Vậy chính sách con người là gì?
`[00:18:29]` Nó chỉ lấy dữ liệu đầu vào từ bàn phím thôi.
`[00:18:32]` Vì vậy, điều tôi sắp gõ ở đây là thực hiện hành động từ bàn phím.
`[00:18:37]` Vì vậy, hãy lấy đầu vào từ bàn phím.
`[00:18:39]` Và đó sẽ là hành động mà chúng tôi đang chọn.
`[00:18:41]` Hãy nhớ các hành động là chia hoặc trừ.
`[00:18:44]` Trừ 1. Và nếu hành động hợp lệ thì trả về hành động đó.
`[00:18:48]` Nghe có vẻ là một chính sách chính trị tốt.
`[00:18:51]` Được rồi. Vì vậy, đó là một chính sách của con người.
`[00:18:54]` Vì thế điều tôi muốn làm bây giờ là tôi muốn có một trò chơi như thế này mà họ thực sự đang chơi với nhau.
`[00:18:59]` Vì vậy tôi muốn có chính sách cho đại lý của mình.
`[00:19:02]` Người đại diện của tôi là cộng 1.
`[00:19:03]` Đó sẽ là một chính sách của con người.
`[00:19:05]` Và đối với đối thủ của tôi, tôi sẽ nói đối thủ của tôi cũng là một chính sách nhân văn.
`[00:19:09]` Vì vậy, tôi chỉ muốn hai người chơi với nhau.
`[00:19:12]` Được rồi. Và trò chơi là, giả sử chúng ta bắt đầu với 15.
`[00:19:18]` Vậy con số mà chúng ta đang bắt đầu là 15.
`[00:19:21]` Được rồi? Được rồi, điều đó có vẻ đúng với tôi.
`[00:19:28]` Vậy làm thế nào để chúng ta đảm bảo rằng chúng ta đang tiến bộ trong trò chơi.
`[00:19:32]` Vì vậy, nếu bạn đang ở trạng thái kết thúc- nếu bạn không ở trạng thái kết thúc thì bạn muốn tiến bộ.
`[00:19:36]` Vì vậy, hãy in một loạt các thứ ở đây.
`[00:19:38]` Hãy in ra trạng thái.
`[00:19:42]` Được rồi. Hãy đưa người chơi ra khỏi trạng thái vì trạng thái lại mã hóa người chơi.
`[00:19:50]` Hãy lấy chính sách.
`[00:19:53]` Bởi vì chúng tôi đã xác định các chính sách này cho cả hai người chơi nên chúng tôi có thể áp dụng chính sách cho bất kỳ ai đang chơi ngay bây giờ.
`[00:20:00]` Và sau đó hành động xuất phát từ chính sách ở trạng thái đó.
`[00:20:04]` Và trạng thái mới mà bạn sắp đạt tới chỉ là trạng thái kế thừa của trạng thái và hành động hiện tại.
`[00:20:09]` Vì vậy, tôi chỉ đang tiến bộ thôi.
`[00:20:11]` Vì vậy, vòng lặp while này ở đây chỉ cho biết chúng ta đang ở trạng thái nào, chúng ta đang tuân theo chính sách nào và chúng ta sẽ kết thúc ở đâu và đó là hàm kế thừa.
`[00:20:19]` Được rồi. Và cuối cùng tôi sẽ in ra tiện ích.
`[00:20:24]` Vậy đó là cộng vô cực hoặc trừ vô cực.
`[00:20:28]` Và điều đó nghe có vẻ tốt.
`[00:20:30]` Vì vậy, được rồi.
`[00:20:32]` Vậy hãy thực sự- Được rồi.
`[00:20:33]` Vậy ai muốn chơi cái này?
`[00:20:36]` Được rồi đó là một người.
`[00:20:38]` Bạn là đại lý. Bạn là người chơi cộng 1.
`[00:20:41]` Đối thủ là ba người [CƯỜI].
`[00:20:44]` Tôi nghĩ bạn là người đầu tiên. Bởi [không nghe được] vâng.
`[00:20:47]` Được rồi vậy bạn trừ 1.
`[00:20:49]` Được rồi, chúng ta hãy chơi trò chơi này nhé.
`[00:20:55]` Thế này có đủ lớn không?
`[00:20:57]` Vâng. Được rồi. Được rồi, người chơi 1.
`[00:20:59]` Người chơi cộng 1. Chúng tôi đang ở số 15.
`[00:21:01]` Bạn có muốn, uh, giảm đi không?
`[00:21:03]` Được rồi. Vậy là trừ 1. Vậy chúng ta đang ở mức người chơi trừ 1.
`[00:21:07]` Chúng ta đang ở số 14. Bạn muốn làm gì?
`[00:21:10]` Chia.
`[00:21:11]` Chia. Được rồi. Bạn có chính sách [TUYỆT VỜI] [CƯỜI] [BỐI CẢNH] Trừ 1.
`[00:21:20]` Chia.
`[00:21:22]` Chia. [CƯỜI] [CƯỜI] Vâng, tôi thực sự không biết, ừ.
`[00:21:34]` Vâng, vậy là bạn hiểu ý rồi, phải không, vậy chờ đã, có phải bây giờ tôi đã làm bạn thua không?
`[00:21:39]` [CƯỜI] Xin lỗi. Cái xấu của tôi.
`[00:21:42]` Nhưng cuối cùng bạn sẽ nhận được tiện ích và về cơ bản bạn có thể thấy giao diện này - thực ra là có - Ồ, tôi không biết.
`[00:21:49]` Chúng ta không có nhiều thời gian như vậy. Tôi đang định thử như một cặp khác nhưng mã này trực tuyến nếu bạn muốn chơi với nó, hãy chơi với nó.
`[00:21:54]` Sau này chúng tôi sẽ có một phiên bản khác chơi với chính sách tự động.
`[00:21:59]` Ừm, được rồi.
`[00:22:00]` Vì vậy, được rồi.
`[00:22:03]` Vậy nên chúng tôi quay lại đây.
`[00:22:05]` Hãy để tôi đóng cái này lại.
`[00:22:08]` Ừm, được rồi. Vì vậy, chúng tôi vừa thấy cách chúng tôi có thể đưa ra một số chính sách con người và các chính sách con người có tác dụng chống lại nhau.
`[00:22:14]` Và một lần nữa, chính sách, bạn đưa ra trạng thái và hành động cho nó.
`[00:22:17]` Nó cho bạn một xác suất hoặc bạn cho nó một trạng thái và nó cho bạn một hành động.
`[00:22:20]` Vì vậy, chính sách xác định chỉ là một ví dụ của chính sách ngẫu nhiên.
`[00:22:24]` Phải? Vì vậy, nếu bạn có một chính sách xác định, bạn có thể coi như một chính sách ngẫu nhiên trong đó với xác suất 1 bạn đang chọn - bạn đang chọn một hành động.
`[00:22:31]` Vì vậy, được rồi.
`[00:22:33]` Vì vậy, bây giờ chúng tôi muốn nói về cách chúng tôi đánh giá một trò chơi.
`[00:22:36]` Vì vậy, giả sử có ai đó đến và đưa cho tôi chính sách của người đại diện và đối thủ, và tôi chỉ muốn biết điều đó tốt như thế nào.
`[00:22:43]` Và một lần nữa nếu bạn còn nhớ trong bài giảng MDP, chúng ta đã bắt đầu với việc đánh giá chính sách.
`[00:22:47]` Vì vậy, trong bài giảng MDP, chúng tôi bắt đầu với ý tưởng về việc ai đó đưa cho tôi chính sách, bạn chỉ muốn đánh giá xem điều đó tốt như thế nào và bạn đang làm điều đó tương tự như chính xác điều đó.
`[00:22:56]` Ai đó đến và nói với tôi rằng người đại diện của tôi sẽ chọn nhóm A, đó là điều mà người đại diện của tôi sẽ luôn làm.
`[00:23:02]` Và ai đó bước vào và nói, "Ồ, đối thủ của tôi sẽ hành động ngẫu nhiên và với xác suất là một nửa, hãy cho tôi một trong những con số đó." Được rồi? Vì vậy, đây là hai chính sách mà chúng tôi sẽ có.
`[00:23:12]` Vì vậy, câu hỏi là; cái này tốt thế nào?
`[00:23:14]` Vì vậy, quay trở lại với cái cây, cây trò chơi, điều thực sự đang xảy ra là người đại diện của tôi sẽ chọn cái này, phải không?
`[00:23:21]` Bởi vì anh ấy sẽ chọn thùng A.
`[00:23:23]` Vì vậy, với xác suất một, chúng ta sẽ kết thúc ở đây, với xác suất bằng 0, chúng ta sẽ kết thúc ở bất kỳ nhóm nào khác.
`[00:23:28]` Và sau đó đối thủ của tôi sẽ ngẫu nhiên chọn trừ 50 hoặc 50.
`[00:23:32]` Được rồi? Vì vậy, nếu đối thủ của tôi chọn âm 50 hoặc 50, thì giá trị của nút này chỉ là kỳ vọng của điều đó hoặc nó sẽ chỉ là 0.
`[00:23:42]` Vậy 50% số lần là âm 50, 50% số lần là 50, khi đó giá trị của nút này là 0.
`[00:23:47]` Và sau đó nếu người đại diện của tôi đang chọn, chọn A thì giá trị của nút này sẽ là 0.
`[00:23:53]` Được rồi? Vì vậy, bạn có thể thấy giá trị sẽ tăng lên như thế nào từ tiện ích.
`[00:23:59]` Vì vậy, chúng tôi có các tiện ích tại các nút lá, nhưng chúng tôi thực sự có thể tính toán giá trị cho từng nút trong số các nút này nếu tôi biết chính sách là gì.
`[00:24:06]` Giống như nếu tôi biết ai đang tuân theo chính sách nào, tôi thực sự có thể tính toán những giá trị này và đi lên cây.
`[00:24:11]` Được rồi? Và vì vậy trong trường hợp này, tôi có thể nói giá trị a- của trạng thái bắt đầu, nếu tôi đang đánh giá chính sách cụ thể này, sẽ bằng 0.
`[00:24:20]` Được rồi? Được rồi.
`[00:24:22]` Thế là có người đưa cho tôi chính sách, tôi đánh giá giá trị ở trạng thái bắt đầu.
`[00:24:27]` Vì vậy, nói chung, như tôi vừa nói trước đó, điều này tương tự như đánh giá chính sách.
`[00:24:33]` Điều này tương tự như trường hợp ai đó đưa cho tôi các chính sách và tôi sẽ đánh giá xem tình hình tốt như thế nào.
`[00:24:39]` Và bạn có thể viết một phép truy toán để thực sự tính toán điều đó.
`[00:24:41]` Vì vậy có lẽ tôi sẽ viết sự tái diễn ở đây.
`[00:24:44]` Vì vậy, bạn muốn tính toán giá trị này.
`[00:24:47]` Và giá trị này đang đánh giá một chính sách nhất định và nó là một hàm của trạng thái.
`[00:24:53]` Vâng, cái đó sẽ bằng bao nhiêu?
`[00:24:55]` Nó sẽ bằng độ hữu dụng của S, nếu bạn đang ở trạng thái kết thúc.
`[00:24:59]` Vậy đó là hữu dụng của S nếu chúng ta đã ở trạng thái kết thúc.
`[00:25:07]` Mặt khác, tôi có quyền truy cập vào chính sách của đối thủ và chính sách của người đại diện của tôi nên tôi chỉ có thể thực hiện một tổng dự kiến ​​đối với tất cả các hành động có thể có của S. Giả sử rằng tôi - nếu, nếu người chơi S là người đại diện, tôi đang xem chính sách của người đại diện,
`[00:25:26]` giả sử đó là chính sách ngẫu nhiên nhân với V của eval của trạng thái kế thừa.
`[00:25:33]` Người kế nhiệm của S và A.
`[00:25:35]` Và đây là nếu người chơi của tôi là đại lý.
`[00:25:38]` Vì vậy, nếu là người chơi - tôi sẽ viết là người chơi của S bằng với đặc vụ.
`[00:25:46]` Điều gì xảy ra nếu người chơi của tôi là đối thủ?
`[00:25:49]` Ừm, tôi cũng sẽ làm điều tương tự.
`[00:25:51]` Tôi chỉ đang đánh giá xem tôi có tiếp cận được chính sách của đối phương hay không.
`[00:25:55]` Tôi lại chỉ đang làm- sẽ tính tổng tất cả các hành động có thể xảy ra theo chính sách của đối thủ, cái này được giao cho tôi- ai đó đã đưa cái này cho tôi, trạng thái và số lần hành động giá trị của trạng thái kế tiếp.
`[00:26:10]` Và S và A và đây là trường hợp người chơi của tôi là đối thủ.
`[00:26:16]` Đây là sự lặp lại mà chúng tôi sẽ chỉ viết và nó khá trực quan.
`[00:26:20]` Một lần nữa, chúng tôi cũng đã thấy điều này trong nghiên cứu.
`[00:26:21]` Giống như bạn bắt đầu với các tiện ích tại các nút lá và bạn chỉ cần đẩy bản sao lưu đó dựa trên chính sách của bạn là gì và chính sách của bạn đang cho bạn biết những gì về phía nào - như bên nào, cạnh nào của cây bạn đang lấy với xác suất là bao nhiêu.
`[00:26:35]` Được rồi? Điều này có ý nghĩa? Được rồi.
`[00:26:39]` Được rồi. Vì vậy, đó là đánh giá trò chơi.
`[00:26:42]` Nhưng bây giờ tôi muốn giải quyết đại lý thì phải làm sao?
`[00:26:45]` Giống như tôi là đại lý, tôi quan tâm đến việc làm - như tìm hiểu xem đại lý Pi của tôi là gì.
`[00:26:50]` Tôi không biết Pi Agent của tôi là gì.
`[00:26:51]` Tôi cần phải tìm ra loại chính sách nào tôi nên tuân theo.
`[00:26:54]` Và điều đó đưa chúng ta đến ý tưởng về kỳ vọng về cơ bản là ý tưởng - nếu tôi ở trong một tình huống mà tôi biết đối thủ của mình làm gì, vì vậy tôi vẫn giả định điều gì - tôi biết đối thủ của mình làm gì,
`[00:27:07]` điều tốt nhất mà tôi nên làm với tư cách là một đại lý là gì?
`[00:27:10]` Được rồi? Cái gì, điều tốt nhất tôi nên làm là gì?
`[00:27:14]` Giống như nếu bạn biết, chẳng hạn như trong ví dụ về nhóm, tôi đang cố gắng - tôi đang hành động theo xác suất, bạn sẽ làm gì?
`[00:27:23]` Chọn hành động mang lại cho bạn giá trị tối đa.
`[00:27:27]` Vì vậy, bạn sẽ chọn hành động mang lại cho bạn giá trị tối đa vì bạn đang cố gắng tối đa hóa giá trị của chính mình.
`[00:27:32]` Vì vậy, nếu đúng như vậy thì sự tái diễn này cần phải thay đổi, phải không?
`[00:27:36]` Sự tái diễn này - theo cách thay đổi, tôi sẽ gọi đây là giá trị mới đó, vì vậy tôi sẽ chỉ làm mọi thứ trên đó, tôi sẽ không viết nó.
`[00:27:45]` Tôi sẽ gọi giá trị này là giá trị của chính sách Expectimax.
`[00:27:50]` Được rồi? Vì vậy, đánh giá giá trị này, tôi không đánh giá bất cứ điều gì nữa.
`[00:27:54]` Tôi thực sự muốn tìm hiểu xem người đại diện của tôi nên làm gì.
`[00:27:58]` Vì vậy tôi sẽ gọi nó là Expectimax.
`[00:28:02]` Và nếu tôi biết chính sách của đối thủ, tôi sẽ không thay đổi bất cứ điều gì ở đây vì tôi biết chính sách của đối thủ, tôi sẽ tính toán điều này.
`[00:28:10]` Nhưng bây giờ tôi muốn tìm hiểu xem đại lý nên làm gì và đại lý nên làm gì?
`[00:28:14]` Vâng, đại lý nên làm điều tối đa hóa giá trị này.
`[00:28:17]` Vì vậy, tôi sẽ xóa số tiền này cùng với chính sách vì tôi không có chính sách đó.
`[00:28:22]` Và tác nhân nên làm điều tối đa hóa giá trị này trên tất cả các hành động có thể.
`[00:28:32]` Vì vậy, điều này sẽ nhắc nhở bạn về việc lặp lại giá trị.
`[00:28:35]` Vì vậy, nếu bạn nhớ phép lặp giá trị trong bài giảng MDP, giống như chúng ta không đánh giá mọi thứ, phải không?
`[00:28:41]` Chúng tôi đã cố gắng tối đa hóa giá trị của mình.
`[00:28:43]` Và điều đó tương tự như những gì chúng tôi đang làm ở đây.
`[00:28:46]` Chúng tôi đang cố gắng tìm ra chính sách mà tác nhân nên thực hiện để tối đa hóa giá trị trong trường hợp tôi biết đối thủ làm gì.
`[00:28:53]` Vì vậy, tôi vẫn biết đối thủ làm gì.
`[00:28:55]` Vì vậy, quay lại ví dụ này, giả sử tôi biết đối thủ của mình đang hành động ngẫu nhiên. Tôi nên làm gì?
`[00:29:02]` Vì vậy, nếu đối thủ của tôi hành động ngẫu nhiên với xác suất bằng một nửa thì giá trị của mỗi nhóm này sẽ là 0, 2 và 5.
`[00:29:10]` Và tôi đang cố gắng tối đa hóa giá trị sử dụng của chính mình.
`[00:29:13]` Vậy tôi sẽ chọn cái nào cho tôi 5.
`[00:29:16]` Và, điều đó được thể hiện bằng hình tam giác hướng lên này mà tôi đang cố tối đa hóa.
`[00:29:19]` Vì vậy, tôi sẽ chọn nhóm C vì tôi đang cố gắng tối đa hóa hiểu biết rằng tác nhân kia đang hành động ngẫu nhiên.
`[00:29:26]` Được rồi? Và, và, sau đó bạn gọi đây là giá trị của chính sách Expectimax và giá trị của chính sách Expectimax từ trạng thái bắt đầu bằng 5.
`[00:29:36]` Phải? Bởi vì đó là đánh giá thứ tôi sắp nhận được. Hỏi lại đó?
`[00:29:39]` [không nghe được] Có. Điều này giả định rằng tôi biết chính sách của đối thủ và tôi đang theo dõi - tôi đoán là tôi đang tối đa hóa giá trị của chính mình, ừm, giá trị của chính tôi khi biết rằng đối thủ của tôi đang tuân theo chính sách này và những gì đối thủ sẽ làm theo mong đợi.
`[00:29:55]` Được rồi? Được rồi.
`[00:29:57]` Vì vậy, đây là, đây là phép truy toán mà chúng ta sẽ nhận được, chúng ta sẽ chỉ cập nhật phép truy hồi.
`[00:30:02]` Vậy nếu đặc vụ đang chơi thì chúng ta sẽ tối đa hóa giá trị của Expectimax.
`[00:30:07]` Được rồi? Được rồi.
`[00:30:10]` Vì vậy, được thôi, nói chung là tôi không biết chính sách của đối thủ.
`[00:30:15]` Phải? Vì vậy, nói chung, tôi biết điều gì mang lại cho tôi lựa chọn số pi này.
`[00:30:18]` Vậy nếu đúng như vậy thì chúng ta nên làm gì?
`[00:30:22]` Vì vậy, một điều chúng ta có thể làm là giả định trường hợp xấu nhất.
`[00:30:27]` Vì vậy, một điều bạn có thể làm là bạn có thể giống như ồ, đối thủ đang cố gắng lôi kéo tôi vào và họ sẽ chơi tình huống xấu nhất và họ đang cố gắng giảm thiểu giá trị của tôi.
`[00:30:35]` Và đó là điều công bằng để làm.
`[00:30:37]` Và chúng ta sẽ nói về việc liệu đó có phải là điều tốt nhất chúng ta có thể làm hay không, ở phần sau của bài giảng.
`[00:30:42]` Nhưng hiện tại, chúng ta có thể giả định rằng nếu tôi không biết gì về đối thủ của mình, tôi chỉ có thể cho rằng đối thủ đang hành động bất lợi với tôi.
`[00:30:49]` Vì vậy, kiểu đó giới thiệu ý tưởng về minimax trái ngược với Expectimax mà chúng ta vừa nói đến.
`[00:30:56]` Vậy minimax sẽ làm gì?
`[00:30:58]` Vì vậy, trong trường hợp chính sách tối đa hóa, tôi cho rằng tôi là tác nhân này đang cố gắng tối đa hóa giá trị của tôi, của chính tôi và sau đó tôi cho rằng đối thủ của tôi đang hành động bất lợi.
`[00:31:11]` Vì vậy, đối thủ của tôi thực sự đang cố gắng giảm thiểu giá trị của tôi.
`[00:31:13]` Và điều đó có nghĩa là từ thùng này, tôi sẽ được trừ 50, từ thùng này tôi sẽ được 1, từ thùng này tôi sẽ được trừ 5.
`[00:31:20]` Và theo giả định đó, tôi sẽ chọn thùng thứ hai vì nó mang lại cho tôi giá trị cao nhất- giá trị cao nhất.
`[00:31:27]` Vì vậy, đó là một chính sách minimax.
`[00:31:30]` Vì vậy, làm cách nào tôi có thể thay đổi tần số lặp của mình nếu tôi chơi minimax hoặc tôi sẽ- tôi sẽ gọi nó là V của- vì vậy hãy nhìn vào V của minimax của một trạng thái.
`[00:31:43]` Chà, sự tái diễn sẽ vượt quá minimax, V của minimax, vì vậy tôi sẽ thay đổi điều đó.
`[00:31:53]` Nếu đại lý đang chơi, đại lý vẫn đang cố gắng tối đa hóa giá trị.
`[00:31:58]` Vì vậy, tất cả đều tốt.
`[00:32:00]` Nếu đối thủ đang chơi thì sao?
`[00:32:04]` Đối phương sẽ giảm thiểu phải không?
`[00:32:06]` Vì vậy, tôi không có quyền truy cập vào pi opt.
`[00:32:09]` Vì vậy, điều tôi sẽ làm là tôi sẽ loại bỏ điều này và nói rõ rằng đối thủ sẽ thực hiện một hành động làm giảm thiểu giá trị của phần tử kế tiếp của S và A.
`[00:32:19]` Được rồi? Và đây là cách bạn tính giá trị của chính sách tối đa hóa.
`[00:32:25]` Đây có phải là giả định rằng tác nhân đối nghịch luôn cố gắng giảm thiểu tiện ích của tác nhân không?
`[00:32:32]` Đúng.
`[00:32:33]` Điều gì sẽ xảy ra khi, ừm, tác nhân đối nghịch không phải lúc nào cũng đi theo lựa chọn đó mà còn trở nên ngẫu nhiên.
`[00:32:41]` Đúng. Vì vậy, đó là một câu hỏi hay.
`[00:32:43]` Vậy điều gì sẽ xảy ra nếu tác nhân đối địch không phải lúc nào cũng là đối thủ, phải không?
`[00:32:46]` Vì vậy, trong trường hợp đó, bạn có một chính sách ngẫu nhiên khác xác định đối thủ đang làm gì.
`[00:32:51]` Và nếu bạn có quyền truy cập vào đó, bạn có thể làm điều gì đó tương tự như Expectimax.
`[00:32:54]` Nếu bạn không có quyền truy cập vào đó, có thể bạn sẽ muốn hành động trong trường hợp xấu nhất và cho rằng họ luôn cố gắng giảm thiểu.
`[00:33:00]` Nhưng- nhưng đó là một số kiến ​​thức trước đó mà bạn có cho phép bạn- hành động tốt hơn hoặc có thể đánh giá, à, giá trị tốt hơn cho bất cứ nơi nào bạn ở.
`[00:33:07]` Vì vậy chúng ta sẽ nói một chút về hàm đánh giá trong bài giảng.
`[00:33:09]` Và có thể bạn sẽ nhìn lại và hình thành hàm đánh giá của mình, được chứ? Được rồi.
`[00:33:15]` Vậy-vậy-vậy ở đây giá trị của minimax từ trạng thái bắt đầu sẽ là 1, phải không? Mọi người có thấy điều đó không?
`[00:33:22]` Vì vậy, tôi cho rằng đối thủ của tôi đang hành động bất lợi.
`[00:33:26]` Vậy chúng ta có âm 51 và âm 5.
`[00:33:28]` Nếu tôi tối đa hóa thì điều tốt nhất tôi có thể nhận được là 1.
`[00:33:32]` Và đó là cách chúng ta tính V của minimax, được chứ?
`[00:33:35]` Và thực sự không có sự tương tự nào với điều này trong cài đặt MDP vì trong cài đặt MDP bạn không thực sự có trò chơi này.
`[00:33:41]` Chúng tôi thực sự không có đối thủ này đang chơi với chúng tôi.
`[00:33:44]` Và điều xảy ra là, đây có phải là sự tái diễn mà bạn sẽ mắc phải, đó là những gì chúng ta đã có trên diễn đàn, phải không?
`[00:33:51]` Được rồi. Vậy- vậy chính sách sẽ như thế nào?
`[00:33:53]` Vì vậy, chính sách sẽ chỉ là argmax của V của minimax này.
`[00:33:58]` Vì vậy, nếu bạn muốn biết chính sách của đại lý của bạn là gì thì đó là Pi max.
`[00:34:02]` Đó là arg max trên v của minimax, trên trạng thái kế tiếp của trạng thái đó.
`[00:34:05]` Và nếu bạn muốn biết chính sách của- đối thủ của bạn là gì, thì trạng thái S đó sẽ- à, đó là argmin của- của b của minimax rất trực quan, phải không?
`[00:34:14]` Vậy- vậy thì bằng cách đó bạn có thể thực sự tìm ra hành động nên là gì, chính sách với hành động thực tế nên là gì, được chứ?
`[00:34:19]` Được rồi. Hãy quay lại ví dụ này, trò chơi giảm một nửa.
`[00:34:23]` Vì vậy, điều chúng tôi muốn làm là chúng tôi thực sự muốn mã hóa những gì chính sách tối đa hóa sẽ thực hiện trong cài đặt này.
`[00:34:28]` Và có lẽ sau đó chúng ta có thể áp dụng chính sách minimax, được chứ?
`[00:34:33]` Vậy chính sách minimax sẽ làm gì?
`[00:34:38]` Vì vậy, nó là một chính sách, vì vậy nó sẽ là một chức năng của các quốc gia, vì vậy hãy đặt tên cho nó là trạng thái.
`[00:34:42]` Và bạn sẽ chỉ viết phép đệ quy mà chúng ta có lên bảng.
`[00:34:46]` Vì vậy- vậy là chúng ta đang quay trở lại trạng thái.
`[00:34:48]` Nếu bạn đang ở trạng thái kết thúc thì chúng ta sẽ quay lại cái gì?
`[00:34:52]` Chỉ là tiện ích thôi, được chứ?
`[00:34:56]` Vì vậy, chúng tôi đang trả lại tiện ích của trạng thái đó và không có hành động nào.
`[00:35:02]` Và sau đó, nếu bạn không ở trạng thái kết thúc, thì bạn đang tối đa hóa hoặc tối thiểu hóa một loạt các lựa chọn.
`[00:35:08]` Vì vậy, hãy thực sự tạo ra những lựa chọn đó để họ có thể gọi max và min cho chúng.
`[00:35:13]` Vì vậy, những lựa chọn mà chúng ta sẽ lặp lại trên tất cả các hành động mà chúng ta có.
`[00:35:21]` Và chính xác thì điều đó sẽ là gì?
`[00:35:24]` Chà, điều đó sẽ thực hiện đệ quy trên các trạng thái kế tiếp.
`[00:35:28]` Vì vậy, chúng ta sẽ lặp lại trạng thái kế tiếp.
`[00:35:31]` Vì vậy, hãy lặp lại thành công-game.người kế thừa trạng thái và hành động.
`[00:35:37]` Và tôi cũng sẽ trả lại hành động ở đây vì tôi chỉ muốn lấy chính sách sau.
`[00:35:42]` Và người kế nhiệm - hàm đệ quy này có trả về một trạng thái và hành động hay không.
`[00:35:46]` Vì vậy, tôi chỉ muốn lấy trạng thái từ trạng thái đầu tiên và hành động từ trạng thái thứ hai.
`[00:35:50]` Được rồi. Vì vậy, nếu người chơi được cộng 1 thì đó là đại lý, đại lý nên tối đa hóa các lựa chọn.
`[00:35:56]` Và nếu người chơi bị trừ 1 thì- thì đó chính là đối thủ, đối thủ nên cố gắng hạn chế tối đa những lựa chọn này.
`[00:36:04]` Và nó khá giống với phép đệ quy mà chúng ta có trên bảng, và- và đó là hàm đệ quy của chúng ta, được chứ?
`[00:36:14]` Vì vậy, chúng ta sẽ lặp lại trạng thái của mình và điều đó mang lại cho chúng ta một giá trị và nó cũng mang lại cho chúng ta- mang lại cho chúng ta một hành động.
`[00:36:21]` Vì vậy, hãy in mọi thứ ra.
`[00:36:23]` Vì vậy bạn có thể tham khảo chúng.
`[00:36:24]` Vì vậy, minimax cung cấp cho chúng tôi một hành động và nó cho chúng tôi biết đây là giá trị mà bạn có thể nhận được [TIẾNG ỒN].
`[00:36:36]` Được rồi. Và đó là một chính sách, vì vậy chúng ta hãy trả lại hành động.
`[00:36:43]` Được rồi. Vì vậy bây giờ điều tôi sắp làm là, tôi sẽ nói rằng cộng thêm 1 tác nhân vẫn là một chính sách con người, và khi đó nó đang đi ngược lại chính sách tối đa hóa tối thiểu.
`[00:36:51]` Vậy được rồi.
`[00:36:52]` Vậy hãy- ai muốn chơi với cái này?
`[00:36:55]` Và sẽ đáng sợ hơn một chút khi sử dụng chính sách tối đa hóa [CƯỜI].
`[00:37:01]` Được rồi. Được rồi.
`[00:37:03]` Vì vậy, hãy làm điều này.
`[00:37:04]` Trăn.
`[00:37:07]` Được rồi. Vì vậy, bạn là đại lý. Vậy bạn là người chơi 1.
`[00:37:10]` Bạn đang bắt đầu từ tuổi 15. Bạn muốn làm gì?
`[00:37:12]` [LÝ LỊCH].
`[00:37:17]` Vậy là bạn vừa thua trò chơi [CƯỜI].
`[00:37:21]` Vậy- vậy tại sao tôi biết bạn thua trò chơi?
`[00:37:23]` Bây giờ người chơi bị trừ 1 đang chơi, bạn đang ở mức 7.
`[00:37:26]` Và chính sách minimax thực hiện hành động trừ, ờ, và nói hành động trừ, ừm, và- và nó cũng vậy, vâng, thực hiện hành động trừ. Vậy là chúng ta đang ở lúc 6 giờ.
`[00:37:35]` Và khi đó giá trị của trò chơi là âm vô cùng.
`[00:37:38]` Vì vậy, bạn đang chơi với chính sách tối thiểu, bạn đã nhận được âm vô cực.
`[00:37:41]` Vậy- vậy là bạn vừa thua trò chơi.
`[00:37:43]` Có ai muốn thử lại lần nữa không [CƯỜI].
`[00:37:48]` Có lẽ bạn muốn thử lại lần nữa.
`[00:37:49]` [BỐI CẢNH] Trừ.
`[00:37:55]` [CƯỜI] Được rồi.
`[00:37:58]` Vì vậy bạn- vì vậy bạn có thể giành chiến thắng, phải không?
`[00:38:00]` Vì vậy, giá trị là vô cùng ngay bây giờ.
`[00:38:03]` Và vâng, chính sách minimax cũng có một điểm trừ.
`[00:38:07]` Vậy bây giờ chúng ta đang ở 13.
`[00:38:09]` Đến lượt bạn, bạn ở 13 [BỐI CẢNH].
`[00:38:14]` Bạn vừa thua trò chơi lần nữa [CƯỜI].
`[00:38:16]` Vì vậy, vâng, trừ vô cực là- vâng, thực ra bạn cần phải xen kẽ giữa chúng.
`[00:38:22]` Tôi nghĩ đó là chính sách tốt nhất.
`[00:38:24]` Nhưng hãy chơi với loại này để hiểu nó hoạt động như thế nào. Mã này đang trực tuyến.
`[00:38:30]` Vì vậy, bạn chỉ cần thoải mái thử nghiệm và tìm ra chính sách tốt nhất để sử dụng là gì. Được rồi.
`[00:38:38]` Vậy- được thôi.
`[00:38:41]` Vậy- đó là một chính sách tối thiểu.
`[00:38:43]` Và đây gần như là sự lặp lại mà chúng tôi nhận được đối với chính sách tối đa hóa.
`[00:38:46]` Bây giờ, điều tôi muốn làm là dành một chút thời gian để nói về, ừm, một số tính chất của chính sách tối đa hóa này.
`[00:38:53]` Và sau đó chúng ta đã nói về hai loại chính sách, phải không?
`[00:38:56]` Chúng ta đã nói về Expectimax, về cơ bản có nghĩa là "Tôi với tư cách là một đại lý, tôi đang cố gắng tối đa hóa, nhưng tôi biết đối thủ của mình sẽ làm gì.
`[00:39:04]` Vì vậy, tôi sẽ cho rằng đối thủ của tôi làm bất cứ điều gì.
`[00:39:08]` Và sau đó tôi sẽ tối đa hóa dựa trên điều đó." Ví dụ: tôi đang theo dõi và tôi sẽ gọi số đó là Pi của Expectimax, có nghĩa là tác nhân và mọi thứ màu đỏ là dành cho tác nhân, mọi thứ màu xanh lam là dành cho đối thủ.
`[00:39:20]` Vì vậy, tôi sẽ nói rằng người đại diện đang tuân theo chính sách này: "Tôi sẽ tối đa hóa giả định đối thủ của tôi đang làm bất cứ điều gì.
`[00:39:28]` Và ở đây tôi đang gọi Pi 7 giống như một chính sách đối lập nào đó." Nó không thể giống bất cứ thứ gì ngoài Pi 7.
`[00:39:33]` Vì vậy, giả sử đối thủ đang chơi Pi 7, tôi sẽ tối đa hóa dựa trên điều đó.
`[00:39:37]` Và- và giá trị chúng ta vừa nói đến là giá trị của Expectimax.
`[00:39:40]` Giá trị khác mà chúng ta vừa nói đến là giá trị của minimax có nội dung: "Tôi là người đại diện.
`[00:39:45]` Tôi sẽ tối đa hóa giả sử đối thủ sẽ giảm thiểu." Và khi đó đối thủ thực sự sẽ tối thiểu hóa và sẽ đi theo pi min.
`[00:39:52]` Được rồi. Vậy- đây là hai giá trị mà chúng ta đã nói đến cho đến nay.
`[00:39:56]` Tôi muốn nói một chút về các đặc tính của điều này. Nhưng trước đó, hãy để tôi- Vậy nên cân nặng kiểu như trộn lẫn cả hai lại với nhau.
`[00:40:04]` Và bạn nói giống như chỉ làm nổi bật xác suất đạt được mức tối thiểu giống như mức tối đa dự kiến.
`[00:40:10]` Tôi đưa ra phân bố xác suất giống như các hành động, phải không?
`[00:40:13]` Giống như tại sao chúng ta không thực hiện hành động như giảm thiểu phần thưởng của mình và đặt trọng số cao hơn cho nó, trong Expectimax.
`[00:40:20]` Ừm- [TIẾNG ỒN] Thực ra tôi chưa hoàn toàn tuân theo chính sách mà bạn đang đề cập đến.
`[00:40:27]` Có phải- bạn đang đưa ra một chính sách mới mà bạn thực hiện- bạn đang nói rằng sẽ là một chính sách tốt hơn đối với [TIẾNG ỒN] giữa như Expectimax và Minimax theo một nghĩa nào đó?
`[00:40:36]` Vậy cái này có thể- cái này, cái bảng này có thể, đại loại, giải quyết vấn đề đó bởi vì nó đang xem xét bốn trường hợp khác nhau.
`[00:40:42]` Nó thực sự không xem xét hai trường hợp.
`[00:40:44]` Vì vậy, điều này thực sự có thể ám chỉ bạn là ai, bạn đang đề xuất điều gì.
`[00:40:47]` Vì vậy, chúng ta hãy thực sự xem xét vấn đề này trước và sau đó có thể, nếu nó không trả lời câu hỏi đó.
`[00:40:50]` Được rồi, vậy tôi muốn nói về bối cảnh.
`[00:40:53]` Vì vậy, bảng này thực sự không khó hiểu nhưng có thể gây nhầm lẫn.
`[00:40:56]` Vì vậy hãy chú ý đến phần này.
`[00:40:58]` Ừm, được rồi, vậy tôi muốn ở đâu- có lẽ, có lẽ tôi sẽ viết ở đó.
`[00:41:04]` Vậy nên tôi sẽ dùng màu đỏ cho đặc vụ.
`[00:41:08]` Màu xanh của tôi đâu, màu xanh của tôi? Trên sàn nhà?
`[00:41:11]` Treo bên trái.
`[00:41:13]` Bên trái?
`[00:41:13]` Quyền của bạn.
`[00:41:14]` Đúng rồi, [CƯỜI] được rồi, được rồi, [CƯỜI] được rồi.
`[00:41:16]` Và sau đó tôi sẽ sử dụng màu xanh lam cho, ừm, và tôi đã bỏ cái này đi.
`[00:41:20]` Tôi sẽ sử dụng màu xanh lam cho chính sách đối thủ.
`[00:41:24]` Được rồi. Vì vậy, đối với các đại lý, chúng ta sẽ có Pi max.
`[00:41:29]` Được rồi. Một đại lý có thể chơi Pi max. Điều đó có nghĩa là gì nữa?
`[00:41:33]` Tôi sẽ tối đa hóa giả sử bạn đang cố gắng giảm thiểu.
`[00:41:36]` Một đặc vụ có thể chơi Pi Expectimax.
`[00:41:39]` Có lẽ chính sách 7, tôi sẽ đặt 7 ở đây, có nghĩa là tôi sẽ tối đa hóa giả sử bạn sẽ làm theo Pi 7 này.
`[00:41:46]` Vì vậy, đây là điều mà các đại lý có thể làm.
`[00:41:49]` [TIẾNG ỒN] Được chứ?
`[00:41:52]` Và sau đó có những điều mà đối thủ của tôi có thể làm.
`[00:41:56]` Tôi sẽ viết nó ở đây.
`[00:41:57]` Đối thủ của tôi thực sự có thể tuân theo Pi min, điều mà tôi sẽ giảm thiểu hoặc đối thủ của tôi có thể tuân theo một số chính sách khác Pi 7.
`[00:42:06]` Giả sử Pi 7 trong ví dụ nhóm hiện tại chỉ hoạt động ngẫu nhiên.
`[00:42:10]` Vì vậy, một nửa thời gian chọn một số, một nửa thời gian chọn một số khác.
`[00:42:13]` Được rồi? Vì vậy, đó là những gì chúng ta có.
`[00:42:17]` Vì vậy tôi sẽ vẽ cái cây của tôi để chúng ta có thể xem qua các ví dụ về nó.
`[00:42:22]` Vì vậy, đây là ví dụ về thùng.
`[00:42:25]` Họ bắt đầu ở mức âm 50 và 50 ở nhóm A, 1 và 3 ở nhóm B, trừ 5 và 15 ở nhóm C. Được chứ?
`[00:42:34]` Vì vậy, đây là ví dụ về nhóm của tôi.
`[00:42:36]` Thực ra tôi đang định nói về điều đó.
`[00:42:37]` Vậy- Được rồi.
`[00:42:38]` Vì vậy, tôi sẽ nói về một loạt các tính chất của V của Pi max và Pi min, đó là cái mà chúng ta thường gọi là giá trị cực tiểu.
`[00:42:51]` Được rồi? Vì vậy, tôi muốn nói về điều này một chút.
`[00:42:53]` Được rồi? Vì vậy, thuộc tính đầu tiên mà chúng ta có thể có là V của Pi max và Pi min, nó thực sự là- hãy để tôi quay lại trang tiếp theo.
`[00:43:10]` Nó sẽ là giới hạn trên của bất kỳ giá trị đơn hàng nào của bất kỳ chính sách đơn hàng nào.
`[00:43:21]` Pi của- Tôi sẽ chỉ viết Pi của Expectimax cho bất kỳ chính sách nào khác dành cho đại lý.
`[00:43:26]` Giả sử rằng đối thủ của tôi đang chơi với tư cách là người thu nhỏ.
`[00:43:32]` Được rồi. Vì vậy, những gì tôi đang viết, những gì tôi đang viết ở đây là, giá trị đó sẽ là giới hạn trên của bất kỳ giá trị đơn hàng nào nếu người đại diện của tôi quyết định làm bất cứ điều gì khác với giả định rằng đối thủ của tôi là người giảm thiểu.
`[00:43:46]` Vì vậy, đối thủ của tôi thực sự đang cố gắng để có được tôi.
`[00:43:48]` Nếu đối thủ của tôi thực sự đang cố gắng để có được tôi thì điều tốt nhất tôi có thể làm là phát huy tối đa.
`[00:43:52]` Được rồi? Vì vậy, đó là loại trực quan, phải không? Đó là giới hạn trên.
`[00:43:55]` Hãy xem ví dụ đó. Vậy Pi-V của Pi mixer, Pi max và Pi min là gì?
`[00:44:00]` Vậy là chúng ta vừa nói về chuyện đó phải không?
`[00:44:02]` Vì vậy, nếu anh chàng này là người thu nhỏ, chúng ta sẽ nhận được âm 50 ở đây, 1 ở đây, trừ 5 ở đây.
`[00:44:08]` Nếu anh chàng này là người cầu toàn, giá trị tôi sẽ nhận được là bao nhiêu?
`[00:44:11]` Bạn sẽ nhận được 1, phải không? Tôi sẽ đi xuống đây và sau đó tôi sẽ lấy 1.
`[00:44:15]` Vậy V của Pi max và Pi min chỉ bằng 1.
`[00:44:19]` Đó là giá trị này chỉ bằng 1.
`[00:44:22]` Được rồi? Câu nói này có nghĩa là điều này sẽ lớn hơn có thể là bối cảnh mà đối thủ của tôi- vì vậy, người đại diện của tôi đang tuân theo Expectimax và đối thủ của tôi vẫn đang thực hiện Pi min.
`[00:44:37]` Vậy điều này sẽ tương ứng với điều gì?
`[00:44:39]` Giá trị này sẽ tương ứng với cái gì?
`[00:44:41]` Vì vậy, đây là một giá trị cho biết, tôi sẽ thực hiện một hành động giả sử đối thủ của tôi đang hành động ngẫu nhiên.
`[00:44:51]` Nếu đối thủ của tôi hành động ngẫu nhiên, tôi sẽ được 0 ở đây, tôi sẽ được 2 ở đây và 5 ở đây.
`[00:44:56]` Nếu tôi giả định điều đó và tôi đang cố gắng tối đa hóa giá trị của chính mình, thì tôi sẽ đi theo con đường nào? Tôi sẽ đi con đường này.
`[00:45:04]` Nhưng hóa ra đối thủ của tôi lại không làm như vậy.
`[00:45:07]` Đối thủ của tôi thực sự là một người giảm thiểu.
`[00:45:09]` Vì vậy, nếu đối thủ của tôi thực sự là người giảm thiểu và tôi đã đi theo con đường này, đối thủ của tôi sẽ cho tôi điểm trừ 5.
`[00:45:16]` Vậy giá trị tôi sẽ nhận được là âm 5.
`[00:45:19]` Vậy cái này bằng trừ 5.
`[00:45:22]` Cái này bằng âm 5.
`[00:45:25]` Được rồi? Vì vậy, cho đến nay tôi đã chứng tỏ rằng anh chàng này vĩ đại hơn anh chàng này.
`[00:45:30]` được rồi? Được rồi.
`[00:45:33]` Vì vậy, đó là tài sản đầu tiên.
`[00:45:34]` Đặc tính đầu tiên là nếu đối thủ của tôi quá tệ và đang cố gắng tóm lấy tôi, điều tốt nhất tôi có thể làm là phát huy tối đa. Tôi không nên làm gì khác.
`[00:45:40]` Được rồi? Thuộc tính thứ hai là đây là V của Pi max, một lần nữa cũng là V, V của Pi max và Pi min hiện là giới hạn dưới của cài đặt trong đó tác nhân của bạn đang tối đa hóa giả sử đối thủ của bạn đang giảm thiểu.
`[00:46:02]` Nhưng thực ra đối thủ của bạn không hề giảm thiểu, đối thủ của bạn đang đi theo Pi 7.
`[00:46:05]` Vì vậy, điều này có nghĩa là nếu bạn đang cố gắng tối đa hóa giả sử người đại diện, của bạn, đối thủ của bạn luôn giảm thiểu, thì bạn đang làm- giống như bạn sẽ nghĩ ra một giới hạn dưới và nếu đối thủ của bạn cuối cùng làm điều gì đó khác,
`[00:46:17]` bạn luôn có thể làm tốt hơn giới hạn dưới này.
`[00:46:20]` Được rồi? Vậy, V này bằng bao nhiêu hoặc chúng ta vừa chỉ ra rằng, đó là một, phải không?
`[00:46:28]` Đó là giá trị này.
`[00:46:29]` Được rồi? Điều này tương ứng với cái gì?
`[00:46:32]` Vì vậy, đây là giá trị của Pi max mà tôi cho rằng bạn đang cố gắng có được tôi.
`[00:46:38]` Nếu tôi cho rằng bạn đang cố gắng để có được tôi thì tôi sẽ đi theo con đường này vì đó là điều mang lại cho tôi giá trị cao nhất, cao nhất.
`[00:46:45]` Nhưng bạn không cố gắng để có được tôi, bạn đang theo dõi Pi 7.
`[00:46:48]` Vì vậy, nếu bạn đang theo dõi, theo Pi 7, bạn sẽ cho tôi một nửa thời gian 1 và một nửa thời gian 3 và nó thực sự tương ứng với 2, và tôi sẽ nhận được giá trị 2 thay vì giá trị 1.
`[00:47:00]` Vì vậy, điều này thực sự bằng 2 trong trường hợp này.
`[00:47:04]` Và giá trị này tương ứng với giá trị này trong bảng, một lần nữa, tác nhân đang theo một bộ tối đa hóa giả sử đối thủ là một bộ tối thiểu hóa.
`[00:47:12]` Đối thủ không phải là người thu nhỏ, đối thủ chỉ đi theo Pi 7 mà thôi.
`[00:47:16]` Và cái này chỉ bằng 2.
`[00:47:18]` Được rồi. Cho đến nay, những điều tôi trình bày thực sự rất trực quan.
`[00:47:23]` Chúng có vẻ hơi phức tạp nhưng chúng rất trực quan.
`[00:47:25]` Điều tôi vừa chỉ ra là giá trị cực tiểu này là giới hạn trên.
`[00:47:30]` Nếu bạn cho rằng đối thủ của chúng tôi là một đối thủ khủng khiếp, thì bây giờ nó sẽ là giới hạn trên vì điều tốt nhất tôi có thể làm là tối đa hóa.
`[00:47:36]` Tôi cũng đã chỉ ra rằng đó là giới hạn thấp hơn nếu đối thủ của tôi không tệ bằng.
`[00:47:40]` Vì vậy, đó là những gì tôi đã thể hiện cho đến nay.
`[00:47:42]` Một câu hỏi.
`[00:47:44]` Vì vậy, ở đây chính sách của đối thủ được ẩn hoàn toàn đối với đại lý.
`[00:47:48]` Vâng. Vì vậy, ở đây, giống như, bởi vì- Đúng vậy, đặc vụ thực sự không nhìn thấy đối thủ- Đối thủ đi đâu, phải không?
`[00:47:56]` Kể cả trường hợp Expectimax nó tưởng đối thủ sẽ theo Pi 7 nhưng có thể đối thủ sẽ theo Pi 7, cũng có thể không.
`[00:48:02]` Đúng vậy, giống như khi chúng ta nói về Expectimax và Minimax, luôn có trường hợp đối thủ không thực sự nhìn thấy đối thủ làm gì.
`[00:48:09]` Nhưng đối thủ có thể nghĩ- người đại diện có thể nghĩ đối thủ làm gì, được chứ?
`[00:48:13]` Và tôi sẽ nói về một tài sản nữa.
`[00:48:15]` Và thuộc tính cuối cùng này về cơ bản cho biết nếu bạn biết điều gì đó, thực ra hãy quay lại câu hỏi của bạn, liệu bạn có biết điều gì đó về đối thủ của mình không, phải không?
`[00:48:24]` Nếu bạn biết điều gì đó về đối thủ của mình thì bạn không nên thực hiện chính sách tối đa hóa.
`[00:48:28]` Bạn thực sự nên làm điều mà bạn có hiểu biết nhất định về những gì đối thủ của bạn làm.
`[00:48:32]` Vì vậy, về cơ bản nói lên điều này- chúng tôi Pi max và một số Pi của đối thủ, bạn biết điều gì đó về đối thủ Pi.
`[00:48:44]` Bạn biết đối thủ đang chơi Pi 7.
`[00:48:47]` Nó sẽ nhỏ hơn hoặc bằng trường hợp bạn đang theo sau Pi của kỳ vọng là 7, ừ, và đối thủ thực sự theo sau Pi 7.
`[00:49:01]` Được rồi. Vậy sự bình đẳng-bất bình đẳng cuối cùng này nói lên điều gì?
`[00:49:04]` Vâng, người ta nói rằng trường hợp bạn đang cố gắng tối đa hóa và bạn nghĩ rằng đối thủ của bạn đang tối thiểu hóa, nhưng đối thủ của bạn thực sự không giảm thiểu giá trị đó, giá trị của điều đó sẽ nhỏ hơn trường hợp bạn đang tối đa hóa theo
`[00:49:15]` một số kiến ​​thức về chính sách của đối thủ và chính sách của đối thủ thực sự đã làm được điều đó.
`[00:49:21]` Được rồi? Vì vậy, số hạng đầu tiên luôn là tác nhân.
`[00:49:24]` Thuật ngữ thứ hai luôn là đối thủ, phải không?
`[00:49:26]` Vậy giá trị này chúng ta đã tính rồi, nó bằng 2.
`[00:49:30]` Giá trị này, giá trị này nói lên điều gì?
`[00:49:32]` Nó nói lên rằng bạn sẽ tối đa hóa nếu giả sử đối thủ của bạn là ngẫu nhiên.
`[00:49:38]` Vì vậy, nếu tôi giả sử đối thủ của tôi là ngẫu nhiên, thì tôi giả sử rằng đây là 0, đây là 2, đây là 5, phải không?
`[00:49:46]` Tôi đang cố gắng tối đa hóa.
`[00:49:48]` Vậy tôi nên đi theo con đường nào?
`[00:49:51]` Tôi nên đi theo con đường này vì nó mang lại cho tôi 5 điểm.
`[00:49:54]` Vì vậy, đây là tác nhân đang nghĩ rằng đối thủ sẽ ngẫu nhiên, nghĩ rằng anh ta sẽ nhận được 5.
`[00:49:59]` Và nó đến đây và đối thủ thực sự đi theo Pi 7, đây là một điều ngẫu nhiên.
`[00:50:04]` Vì vậy, chúng ta thực sự sẽ nhận được 5.
`[00:50:06]` Vậy, vậy anh chàng này bằng 5.
`[00:50:10]` Và đây là bất đẳng thức cuối cùng mà chúng ta có, đó là V của Pi Expectimax bằng 7, và Pi của 7 lớn hơn hoặc bằng V của Pi max và Pi 7.
`[00:50:28]` Chúng tôi vừa chỉ ra giá trị này bằng 5 cho ví dụ này.
`[00:50:31]` Được rồi. Được rồi. Câu hỏi.
`[00:50:36]` [không nghe được] Hành động của đối thủ luôn có hoặc không có [không nghe được] [TIẾNG ỒN].
`[00:50:47]` Uh, vậy- Vậy nếu, nếu bạn, vậy nếu bạn biết điều gì đó về tính ngẫu nhiên, thì đúng như vậy.
`[00:50:52]` Giống như ở đây, tôi biết rằng đối thủ đang theo chính sách ngẫu nhiên một ra, một ra.
`[00:50:56]` Tôi có thể đã biết rằng đối thủ đang tuân theo một chính sách xác định trong- và luôn chọn bên trái.
`[00:51:01]` Vì vậy, tôi có thể đã làm theo, giống như chính sách kỳ vọng tương tự theo kiến ​​​​thức đó.
`[00:51:05]` Nó có thể là bất cứ điều gì khác, nhưng toàn bộ ý tưởng của Expectimax là, tôi có một số kiến ​​thức về chính sách của đối thủ, nó có thể là chính sách ngẫu nhiên, nó có thể là chính sách tất định, theo đó, tôi sẽ tối đa hóa như thế nào?
`[00:51:16]` Điều đó có nghĩa là giống như một cách bắc cầu, phía dưới bên phải luôn lớn hơn phía dưới bên trái phải không?
`[00:51:24]` Vâng. Vậy câu hỏi là chúng ta có-Ừ.
`[00:51:26]` Vì vậy, chúng ta có cái giống như sự bất bình đẳng này, nên về mặt bắc cầu, anh chàng này luôn lớn hơn anh chàng này.
`[00:51:30]` Và điều đó có ý nghĩa, phải không?
`[00:51:32]` Giống như chúng tôi đang nói, giống như nếu bạn đang theo dõi Expectimax, vậy điều cuối cùng này khá hợp lý, phải không?
`[00:51:37]` Tuy nhiên, về cơ bản nó có nghĩa là nếu bạn đang theo dõi Expectimax và bạn biết điều gì đó về đối thủ của mình và đối thủ của bạn thực sự đã làm điều đó, mặc dù giá trị của bạn phải lớn hơn khá nhiều thứ, phải không?
`[00:51:46]` Bởi vì bạn biết điều gì đó về đối thủ nên bạn chơi biết điều đó, có kiến ​​thức đó. Đúng.
`[00:51:51]` Khi bạn nói biết điều gì đó về đối thủ, đó chỉ là biết rằng điều đó được hỏi một cách ngẫu nhiên hay biết điều gì sẽ xảy ra? [TIẾNG ỒN] Nó biết họ sẽ lấy gì.
`[00:52:00]` Phải? Giống như ở đây, tôi biết họ sẽ chỉ ra điều gì.
`[00:52:01]` Tôi biết rằng một nửa thời gian họ sẽ lấy cái này, một nửa thời gian bạn sẽ lấy cái kia, và sau đó tôi sử dụng kiến ​​​​thức đó, phải không? Vâng.
`[00:52:07]` Vậy bạn biết chính xác điều này? [CHỒNG CHỒNG].
`[00:52:08]` Đúng. Vâng, vâng, sự mong đợi.
`[00:52:10]` Chính sách Expectimax có phải là đối thủ của bạn đang tuân theo chính sách Pi min- Vì điều đó, xin lỗi.
`[00:52:16]` Cho rằng đối thủ của bạn đang theo sau Pi min.
`[00:52:19]` Có phải- bạn có tối đa hóa nó không?
`[00:52:22]` Vậy chính sách kỳ vọng là chính sách này khi ở đây chúng ta có một tổng.
`[00:52:27]` Chính sách Expectimax, ừ, giả sử đối thủ của bạn đang theo dõi đối thủ Pi và cho rằng nó có quyền truy cập vào đối thủ Pi và vì vậy cuối cùng nó thực hiện số tiền này ở đây.
`[00:52:37]` Vâng. Nếu đối thủ của Pi là Pi min? Giống như- Uh, nếu Pi phản đối- Tôi hiểu bạn đang nói gì.
`[00:52:41]` Vì vậy, bạn đang nói nếu đối thủ của Pi thực sự là Pi min, thì cuối cùng họ có bình đẳng với nhau theo một nghĩa nào đó không?
`[00:52:46]` Vâng, tôi đoán vậy.
`[00:52:48]` Vâng. Vì vậy, nếu bạn biết rằng đối thủ- nó sẽ trở thành minimax, phải không?
`[00:52:51]` Nếu bạn biết đối thủ của mình đang theo dõi min, đóng vai trò là công cụ thu nhỏ hoặc chỉ thích gọi đó là minimax. Được rồi.
`[00:52:56]` Vậy tôi sẽ đi trước một chút.
`[00:52:59]` Được rồi- và sau đó, đây giống như những gì chúng ta đã nói đến.
`[00:53:03]` Được rồi. Vì vậy, một số điều khác về việc sửa đổi trò chơi này.
`[00:53:05]` Vì vậy, chúng ta đã- được rồi, chúng ta đã nói về trò chơi này, chúng ta đã nói về các đặc tính của trò chơi này.
`[00:53:09]` Có một sửa đổi đơn giản mà người ta có thể làm đó là mang thiên nhiên vào.
`[00:53:13]` Vì vậy, có một câu hỏi trước đó là, liệu có cơ hội nào ở đây không?
`[00:53:16]` Và sau đó, vâng, bạn có thể thực sự mang cơ hội vào đây.
`[00:53:18]` Vì vậy, giả sử bạn có trò chơi giống như trước, bạn đang chọn một trong ba thùng.
`[00:53:23]` Và sau đó, sau khi chọn một trong ba thùng, bạn có thể lật một đồng xu và nếu mặt ngửa xuất hiện, thì bạn có thể di chuyển một thùng sang trái, có bao bọc.
`[00:53:32]` Vì vậy, điều này có nghĩa là 50% trường hợp mặt sấp xuất hiện, bạn không thay đổi gì cả, bạn đã thiết lập sẵn điều này.
`[00:53:38]` 50% số lần bạn nhận được đầu.
`[00:53:41]` Và sau đó, trong những cài đặt đó, bạn sẽ chọn giống như thùng lân cận thay vì thùng ban đầu của mình, được chứ?
`[00:53:46]` Vì vậy, bạn đang thêm khái niệm về cơ hội này vào đây và nó giống như hoạt động như một người chơi mới, vì vậy, nó thực sự không khiến mọi thứ trở nên phức tạp hơn nhiều.
`[00:53:55]` Vì vậy, điều xảy ra là theo một nghĩa nào đó, chúng ta có chính sách về tiền xu, bản chất ở đây là đúng và chính sách về tiền xu là, một nửa thời gian tôi nhận được 0, tôi không thay đổi bất cứ điều gì, một nửa thời gian tôi chỉ nhận được thùng lân cận thay vì thùng chính của tôi.
`[00:54:09]` Và sau đó tôi có được cái cây mới này ở đâu, nơi tôi có một cấp độ hoàn toàn mới cho- nơi nào có cơ hội.
`[00:54:14]` Vì vậy, chúng ta có- bây giờ chúng ta có các nút tối đa, chúng ta có các nút tối thiểu, chúng ta cũng có các nút cơ hội này ở đây.
`[00:54:19]` Và các nút cơ hội một lần nữa, giống như đôi khi chúng đưa tôi đến nhóm ban đầu và sau đó 50% số lần họ đưa tôi đến nhóm lân cận, được chứ?
`[00:54:26]` Nhưng, nhưng toàn bộ câu chuyện vẫn như cũ, như không có gì thay đổi.
`[00:54:29]` Bạn có thể, bạn vẫn có thể tính toán các hàm giá trị, bạn vẫn có thể đẩy các hàm giá trị lên cao hơn nữa.
`[00:54:33]` Đó là kiểu tái phát tương tự.
`[00:54:35]` Không có gì thay đổi cơ bản.
`[00:54:37]` Chỉ là- có cảm giác như có ba thứ đang chơi, được chứ?
`[00:54:42]` Vì vậy, cái này thực sự được gọi là Expectiminimax, nên giá trị của Expectiminimax ở đây, ví dụ trong trường hợp này, là âm 2, bởi vì có một nút nhỏ dành cho đối thủ, có một nút kỳ vọng cho những gì bản chất thực hiện,
`[00:54:58]` và sau đó có một nút tối đa cho những gì tác nhân nên làm.
`[00:55:01]` Đó là lý do tại sao nó được gọi là Expectiminimax.
`[00:55:03]` Và sau đó, bạn thực sự có thể tính toán giá trị tương tự.
`[00:55:05]` Vì vậy, khi trò chơi đang diễn ra, sẽ có hai người chơi.
`[00:55:09]` Tôi chọn một cái thùng rồi bạn tung một đồng xu, rồi dịch chuyển sang trái hay không dịch chuyển sang trái, rồi tôi chọn số?
`[00:55:16]` Đúng. Vâng, không phải bạn, cũng là đối thủ.
`[00:55:19]` Đối thủ.
`[00:55:20]` Đúng vậy. Vậy là vẫn còn hai người chơi và sau đó là đồng xu thứ ba. Đúng.
`[00:55:24]` [không nghe được] Được rồi. Vì vậy, vâng.
`[00:55:28]` Vì vậy, cách để chính thức hóa điều này là bạn có người chơi, bạn có người đại diện, bạn có đối thủ, bạn có tiền, và sau đó sự tái diễn thay đổi một chút, tôi đoán vậy.
`[00:55:37]` Vì vậy, điều xảy ra là, sự lặp lại mà chúng ta có đối với minimax chỉ là giá trị tối đa và tối thiểu và nó sẽ chỉ trả lại cho chúng ta tiện ích nếu bạn đang ở hàm Kết thúc và ở trạng thái Kết thúc.
`[00:55:46]` Bây giờ, nếu- nếu đó là thuật ngữ về tiền xu, chúng ta chỉ cần tính tổng, ừ, tổng dự kiến ​​của chính sách của đồng xu, đó là những gì chúng ta đã làm trong Expectiminimax.
`[00:55:56]` Tuy nhiên, chúng tôi chỉ có một thuật ngữ mới về thời điểm đặt đồng xu.
`[00:55:59]` Vì vậy, mọi thứ ở đây diễn ra một cách tự nhiên theo những gì chúng ta mong đợi, được chứ?
`[00:56:05]` Được rồi, tóm tắt cho đến nay là, ừ, những gì chúng ta đã nói về các nút tối đa, chúng ta đã nói về các nút cơ hội, giống như nếu bạn có một đồng xu ở đó và sau đó là các nút tối thiểu.
`[00:56:14]` Ừm, và về cơ bản chúng ta đã nói về việc kết hợp các loại nút này lại với nhau và tạo ra giống như một trò chơi minimax hoặc hoặc một trò chơi Expectimax.
`[00:56:23]` Và sau đó, hàm giá trị, ừ, chúng ta- là- bạn chỉ cần thực hiện phép lặp thông thường mà chúng ta đã thực hiện trong lớp này từ tiện ích dự kiến ​​đến, đến- từ tiện ích để đưa ra giá trị tiện ích dự kiến ​​này cho tất cả các nút mà chúng ta có.
`[00:56:35]` Vì vậy, có thể có những tình huống khác mà bạn có thể muốn nghĩ đến, chẳng hạn như cho các dự án của bạn hoặc tương tự như vậy, nói chung có những biến thể khác của trò chơi mà bạn có thể muốn nghĩ đến.
`[00:56:44]` Vậy điều gì sẽ xảy ra nếu, giống như trường hợp bạn đang chơi với nhiều đối thủ?
`[00:56:47]` Giống như cho đến nay chúng ta đã nói về bối cảnh hai người chơi trong đó chúng ta có một đối thủ và một đặc vụ nhưng nếu bạn có nhiều đối thủ, chẳng hạn như bạn có thể nghĩ về cách cây thay đổi trong các cài đặt đó.
`[00:56:56]` Uh, hoặc ví dụ, như các khía cạnh thay phiên nhau của nó, chẳng hạn như nó giống như- nếu, nếu trò chơi diễn ra đồng thời với việc chơi theo lượt của bạn, ừ, hoặc giống như bạn có thể tưởng tượng các cài đặt trong đó bạn có một số hành động cho phép bạn có thêm một lượt.
`[00:57:07]` Vì vậy, bạn có hai lượt.
`[00:57:09]` Uh, và sau đó người tiếp theo sẽ thay phiên nhau.
`[00:57:11]` Vì vậy, bạn nên suy nghĩ về một số điều này, một số chúng xuất hiện trong bài tập về nhà.
`[00:57:14]` Vì vậy, hãy nghĩ về các biến thể của trò chơi nói chung.
`[00:57:18]` Họ là loại vui vẻ. Vì vậy, hãy nói một chút về khía cạnh tính toán của việc này.
`[00:57:24]` Ừm, chuyện này khá tệ.
`[00:57:27]` [CƯỜI] Đúng vậy, chúng ta đã nói về cây trò chơi tương tự như tìm kiếm trên cây.
`[00:57:31]` Vì vậy, chúng tôi đang thực hiện phương pháp tìm kiếm trên cây.
`[00:57:35]` Uh, nếu bạn nhớ tìm kiếm dạng cây, giống như các thuật toán chúng ta đang sử dụng, chẳng hạn như nếu bạn có hệ số phân nhánh là b và độ sâu nào đó của d thì trong trường hợp này xét về mặt thời gian, nó là hàm mũ theo thứ tự từ b đến 2d.
`[00:57:49]` Vì vậy, tôi đang sử dụng d cho số- tôi nói điều này như thế nào?
`[00:57:53]` Vì vậy, nó là 2d vì người chơi, người đại diện chơi và sau đó đối thủ chơi, đó là cách tôi tính nó.
`[00:57:58]` Vậy là cứ, cứ 2d giống như bạn có 2d plies nhưng d có chiều sâu.
`[00:58:02]` Điều đó có ý nghĩa không? Được rồi.
`[00:58:05]` Và về mặt không gian, nó cấp d theo thời gian, nó theo cấp số nhân, khá tệ.
`[00:58:09]` Vì vậy, đối với một ván cờ chẳng hạn, hệ số phân nhánh là khoảng 35, độ sâu là khoảng 50.
`[00:58:16]` Vì vậy, nếu bạn tính b theo 2d, thì nó sẽ theo thứ tự giống như số nguyên tử trong vũ trụ, điều đó là không thể thực hiện được - chúng ta không thể sử dụng bất kỳ phương pháp nào trong số này.
`[00:58:27]` Vậy làm cách nào để chúng ta làm mọi thứ nhanh hơn?
`[00:58:29]` Vì vậy chúng ta nên nói về cách làm cho mọi thứ nhanh hơn.
`[00:58:32]` Vì vậy, có hai cách tiếp cận mà chúng ta đang nói đến trong lớp học này để làm mọi việc nhanh hơn.
`[00:58:37]` Và cách tiếp cận đầu tiên là sử dụng chức năng đánh giá.
`[00:58:39]` Vì vậy, bằng cách sử dụng hàm đánh giá và những gì chúng tôi có thể làm là bạn có thể sử dụng kiến ​​thức cụ thể về miền trò chơi để xác định các tính năng gần giống như về trò chơi nhằm ước tính, chẳng hạn như, giá trị th- hàm giá trị này ở một trạng thái cụ thể.
`[00:58:54]` Vì vậy tôi sẽ nói về điều đó một chút.
`[00:58:56]` Và sau đó, một cách tiếp cận khác là cách tiếp cận này khá đơn giản và khá hay, được gọi là cắt tỉa alpha-beta.
`[00:59:02]` Và, cũng như phương pháp cắt tỉa alpha-beta, về cơ bản sẽ loại bỏ một phần của cây nếu nó nhận ra rằng bạn không cần phải đi xuống cây đó, phần đó, phần đó của cây con.
`[00:59:10]` Vì vậy, đây là một phương pháp cắt tỉa không khám phá toàn bộ cây mà chỉ khám phá các phần của cây.
`[00:59:15]` Vì vậy, chúng ta sẽ nói về cả hai. Được rồi.
`[00:59:19]` Vì vậy, chức năng đánh giá.
`[00:59:20]` Vậy hãy nói về điều đó.
`[00:59:23]` Được rồi. Vì vậy, chiều sâu có thể thực sự giống như chiều rộng và chiều sâu của trò chơi có thể rất lớn.
`[00:59:29]` Điều đó không tuyệt vời lắm. Vì vậy, một cách tiếp cận để giải quyết vấn đề là hạn chế độ sâu.
`[00:59:35]` Vì vậy, thay vì thích khám phá mọi thứ trên cây, chỉ cần giới hạn độ sâu và đạt đến độ sâu cụ thể đó.
`[00:59:42]` Và sau đó, khi bạn đạt đến độ sâu đó, chỉ cần gọi hàm đánh giá.
`[00:59:46]` Vì vậy, nếu bạn định tìm kiếm toàn bộ cây, thì đây chính là phép đệ quy mà chúng ta đã nói đến.
`[00:59:51]` Điều này giống như khi bạn đang thực hiện phương pháp tối đa hóa thì đây là phép đệ quy mà bạn phải thực hiện.
`[00:59:55]` Bạn phải xem xét tất cả các trạng thái và hành động, và xem xét toàn bộ cây.
`[00:59:59]` Nhưng nếu bạn đang sử dụng phương pháp tìm kiếm cây có độ sâu giới hạn, điều bạn có thể làm là, về cơ bản bạn có thể có độ sâu d này và sau đó giảm d mỗi khi bạn xem qua một tác nhân và đối thủ, giống như mỗi lần bạn đi xuống cây và tại một số điểm d chỉ bằng 0,
`[01:00:16]` vì vậy bạn đạt đến độ sâu cụ thể nào đó của cây và khi d trở thành 0, bạn sẽ gọi một hàm đánh giá trên các trạng thái mà bạn nhận được, được chứ?
`[01:00:25]` Và chức năng đánh giá này gần như có dạng giống như chi phí trong tương lai khi chúng ta nói về vấn đề tìm kiếm, phải không?
`[01:00:32]` Vì vậy, nếu bạn biết chính xác nó là gì thì bạn đã hoàn thành, nhưng bạn không biết chính xác nó là gì bởi vì nếu bạn biết rằng chúng ta phải giải quyết toàn bộ vấn đề tìm kiếm trên cây.
`[01:00:41]` Nhưng nói chung, nó có thể có một số ước tính yếu về chi phí trong tương lai sẽ là bao nhiêu.
`[01:00:48]` Vì vậy, ừm, vâng.
`[01:00:51]` Vì vậy, hàm đánh giá Eval của s là ước lượng yếu của V minimax của s. Vì vậy, đó là một ước tính yếu của hàm giá trị của bạn, được chứ?
`[01:01:02]` Được rồi. Vì vậy, sự tương tự của điều đó là chi phí trong tương lai của các vấn đề tìm kiếm.
`[01:01:07]` Vậy làm thế nào để chúng ta đưa ra một hàm đánh giá?
`[01:01:11]` Vì vậy, chúng tôi thực hiện điều đó theo cách tương tự mà chúng tôi đã xem trong bài giảng học tập, nơi chúng tôi nghĩ ra các tính năng và trọng số cho các tính năng đó, đúng không.
`[01:01:19]` Vì vậy, nếu tôi chơi như cờ vua, và thích cách chúng ta chơi nó, đúng vậy, giống như chúng ta nghĩ về một tập hợp các hành động mà chúng ta có thể thực hiện và nơi chúng ta kết thúc và, và dựa trên nơi chúng ta kết thúc ở ừm, thì bạn sẽ đánh giá bàn cờ đó tốt như thế nào, đúng không.
`[01:01:32]` Bạn có một số khái niệm về các tính năng và vẻ ngoài đẹp mắt như thế nào - chẳng hạn như tấm ván đó sẽ tốt như thế nào kể từ thời điểm đó trở đi.
`[01:01:37]` Và điều đó cho phép chúng ta đánh giá nên chọn hành động nào, đúng không, giống như khi chúng ta chơi cờ, đó là việc chúng ta làm.
`[01:01:42]` Chúng tôi chọn một vài hành động và xem bảng sẽ trông như thế nào sau khi thực hiện chúng.
`[01:01:46]` Một chức năng đánh giá cũng thực hiện điều tương tự, nó cố gắng tìm ra những điều được cho là chúng ta nên quan tâm trong một trò chơi cụ thể, trong trường hợp này là cờ vua và cố gắng đưa ra giá trị cho chúng.
`[01:01:56]` Vì vậy, nó có thể là những thứ như số lượng quân mà chúng ta có, hoặc khả năng di chuyển của những quân đó, hoặc vua của chúng ta có an toàn hay không, hoặc liệu chúng ta có quyền kiểm soát trung tâm hay không.
`[01:02:04]` Vì vậy, ví dụ, đối với những quân cờ mà chúng ta có thể làm là, chúng ta có thể xem xét sự khác biệt giữa số lượng quân cờ chúng ta có giữa những gì chúng ta có và những gì đối thủ của chúng ta có.
`[01:02:12]` Số lượng vua mà tôi có so với số lượng đối thủ mà tôi có.
`[01:02:16]` Chà, điều đó có vẻ thực sự quan trọng vì nếu tôi không có vua và đối thủ của chúng tôi có vua thì [CƯỜI] tôi đã thua trò chơi.
`[01:02:22]` Vì vậy, bạn có thể đặt một trọng số thực sự lớn cho điều đó và bạn có thể quan tâm đến sự khác biệt giữa số lượng quân tốt hoặc số quân hậu và các loại quân cờ khác mà bạn có trên bàn cờ.
`[01:02:32]` Vì vậy, điều đó cho phép bạn quan tâm- nghĩ xem bàn cờ tốt như thế nào hoặc số nước đi hợp lệ mà bạn có và số nước đi hợp pháp mà đối thủ của bạn có, và sau đó điều đó cho bạn một số khái niệm về tính di động của trạng thái đó.
`[01:02:45]` Được rồi. Được rồi.
`[01:02:48]` Vì vậy, ừm, tóm tắt cho đến nay là- vâng, điều này khá tệ, thứ tự từ B đến 2D khá tệ và về cơ bản, một hàm đánh giá sẽ cố gắng ước tính V minimax này bằng cách sử dụng một số kiến ​​thức về miền.
`[01:03:01]` Và không giống như ngôi sao A, chúng tôi thực sự không có bất kỳ đảm bảo nào về sai số tương tự từ những phép tính gần đúng này.
`[01:03:08]` Thế à, nhưng mà nó là con số gần đúng thôi, mọi người dùng cũng khá đấy.
`[01:03:12]` Chúng ta sẽ nói về vấn đề này muộn hơn vào lần tới, khi chúng ta nghĩ về việc chúng ta nên- loại trọng số nào, chúng ta nên chọn cho từng đặc điểm này, cho từng đặc điểm này.
`[01:03:22]` Vì vậy, bạn nên nghĩ đến việc học khi nghĩ về trọng số mà chúng ta đang sử dụng. Được rồi.
`[01:03:27]` Vậy- được rồi, bây giờ tôi muốn dành một chút thời gian cho việc cắt tỉa alpha-beta vì điều này- vâng, quan trọng.
`[01:03:35]` Được rồi. Vì vậy, việc cắt tỉa alpha-beta.
`[01:03:38]` Vâng. Khái niệm về việc cắt tỉa alpha-beta cũng khá đơn giản, nhưng tôi nghĩ đó là một trong những thứ- đó là loại bảng mà bạn nên chú ý đến, để hiểu điều gì đang xảy ra.
`[01:03:49]` Được rồi. Vì vậy, giả sử bạn muốn chọn giữa một số nhóm A và nhóm B.
`[01:03:55]` Được rồi, và bạn muốn chọn giá trị lớn nhất, và khi đó bạn biết rằng các giá trị của A rơi vào khoảng từ 3 đến 5 và giá trị của B rơi vào khoảng từ 5 đến 10.
`[01:04:04]` Vì vậy, chúng thực sự không có bất kỳ giao điểm nào giống nhau.
`[01:04:08]` Vì vậy, trong trường hợp đó, bạn không thực sự quan tâm đến nhóm của mình, của bạn- nếu bạn đang chọn quyền tối đa, bạn không nên quan tâm đến nhóm A hoặc phần còn lại của nhóm A đúng không, bởi vì bạn đã biết rằng bạn ở trên 5,
`[01:04:19]` bạn hài lòng với B, bạn thậm chí không nên nhìn vào A.
`[01:04:21]` Vì vậy, khái niệm cơ bản của việc cắt tỉa alpha-beta là duy trì giới hạn dưới và giới hạn trên của các giá trị, và sau đó nếu các khoảng không trùng nhau thì về cơ bản
`[01:04:33]` bỏ đi một phần cây con mà bạn không cần phải làm việc vì có, giữa chúng không có sự chồng chéo.
`[01:04:39]` Được rồi. Vì vậy, đây là một ví dụ, giả sử chúng ta có các nút tối đa và nút tối thiểu này và bạn sẽ đi xuống và thấy 3, và đây là nút tối thiểu, vì vậy bạn sẽ nhận được 3 ở đây.
`[01:04:51]` Vì vậy, khi tôi đến nút tối đa ở đây, phải, tôi- cái gì, cái gì, tôi biết là nút tối đa sẽ đạt 3 hoặc cao hơn, phải không.
`[01:05:00]` Đó- đó là một điều mà tôi sẽ biết mà không cần nhìn vào bất cứ thứ gì ở phía bên kia, thậm chí không cần nhìn vào cây con ở bên trái, tôi đã biết rằng nút tối đa này sẽ đạt 3 hoặc cao hơn, phải không.
`[01:05:12]` Mọi người đã đồng ý với điều đó chưa? Được rồi. Vì vậy, khi tôi đi xuống nút tối thiểu này và tôi thấy 2 ở đây, đúng vậy, tôi biết đây là nút tối thiểu, nó sẽ nhận được giá trị nhỏ hơn hoặc bằng 2.
`[01:05:25]` Nhỏ hơn hoặc bằng 2 không có khoảng nào lớn hơn hoặc bằng 3, vì vậy tôi không nên lo lắng về cây con đó.
`[01:05:34]` Mọi người thấy có thấy vậy không? Vậy có lẽ bạn sẽ thích để tôi vẽ nó ra đây.
`[01:05:39]` [TIẾNG ỒN] Điều đó gần giống như toàn bộ khái niệm về những gì xảy ra trong quá trình cắt tỉa alpha-beta.
`[01:05:47]` Vì vậy, tôi có nút tối đa này, đây là ba, đây là- năm.
`[01:05:56]` Mình thấy anh chàng là 3, đây là max node.
`[01:05:59]` Dù nó nhận được gì đi nữa, nó- nó sẽ lớn hơn hoặc bằng 3 bởi vì, vì nó đã nhìn thấy 3 nên nó sẽ không nhận được bất kỳ giá trị nào nhỏ hơn 3, đúng không.
`[01:06:08]` Vì vậy, chúng ta biết bất kỳ giá trị nào chúng ta sắp nhận được ở nút tối đa này sẽ là 3 hoặc cao hơn.
`[01:06:14]` Được rồi. Sau đó tôi sẽ đi xuống đây, và tôi thấy hai ở đây, phải. Đó là một nút tối thiểu bất kể nó nhận được sẽ nhỏ hơn hoặc bằng 2.
`[01:06:24]` Vậy nhỏ hơn hoặc bằng 2 là giá trị sẽ xuất hiện ở đây.
`[01:06:30]` Tôi đã biết nhỏ hơn hoặc bằng 2 không có khoảng cách nào với 3 hoặc lớn hơn.
`[01:06:36]` Vì vậy tôi thậm chí không cần phải lo lắng về điều này như tôi, giống như tôi hoàn toàn có thể bỏ qua mặt này của 3 bên, tôi không cần biết chuyện gì đang xảy ra dưới đây, tôi thậm chí không cần nhìn vào đó.
`[01:06:45]` Được rồi. Bởi vì, vì tôi- thích giá trị này nên lớn hơn và bằng 2. Có.
`[01:06:49]` Được rồi, chúng ta sẽ nhận được giá trị lớn hơn hoặc bằng 8.
`[01:06:54]` Lấy làm tiếc.
`[01:06:54]` [không nghe được] Đó là mức tối thiểu- vậy nên nó là mức tối thiểu, đó là một nút tối thiểu, đúng không.
`[01:07:02]` Vì vậy, nó sẽ nhỏ hơn hoặc bằng [NOISE] ở bên phải.
`[01:07:06]` Vâng. Đó là một nút tối thiểu, vì vậy tôi vẫn phải làm vậy, nếu tôi thấy 10 ở đây hoặc 20 ở đây, giống như tôi sẽ không chọn nút đó, giống như nó là 2 hoặc thấp hơn.
`[01:07:18]` Được rồi. Vì vậy, vâng- vì vậy nếu nó là 10, hoặc 100, hoặc bất kỳ cây con nào thì nó ở đó giống như chúng ta sẽ không xem xét nó.
`[01:07:27]` Vì vậy, đó là toàn bộ khái niệm.
`[01:07:29]` Ừm, được rồi.
`[01:07:31]` Vậy- được thôi.
`[01:07:34]` Hãy để tôi thực sự đi đến slide này, tôi nghĩ nó sẽ như vậy.
`[01:07:36]` Vì vậy, ý tưởng chính của việc cắt tỉa alpha-beta giống như chúng ta- với đường dẫn tối ưu sẽ đi đến một nút lá nào đó có một số tiện ích và tiện ích đó là thứ sẽ được đẩy lên, đúng không,
`[01:07:48]` thích- và điều thú vị là nếu bạn chọn đường dẫn tối ưu, giá trị của các nút trên đường dẫn tối ưu đó đều sẽ bằng nhau, đúng không, giống như chúng- về cơ bản là tiện ích mà bạn đang sử dụng
`[01:07:59]` để được đẩy lên đến đỉnh cao.
`[01:08:02]` Vì vậy, do đó, chúng ta cần có những thứ như thế này, những thứ giống như chúng ta, chúng ta không thể có những cài đặt mà không có bất kỳ điểm giao nhau nào giữa các khoảng vì chúng ta biết liệu đây có phải là con đường tối ưu hay không,
`[01:08:15]` giá trị trên nút này phải giống với giá trị tại nút này - giống với giá trị tại nút này, v.v.
`[01:08:21]` Vì vậy, nếu chúng không có bất kỳ khoảng nào thì không thể nào chúng có cùng giá trị và không có cách nào để đường dẫn đó là đường dẫn tối ưu.
`[01:08:28]` Được rồi. Vì vậy, đó là lý do khiến nó hoạt động vì đường đi tối ưu sẽ có cùng giá trị xuyên suốt.
`[01:08:34]` Được rồi. Vậy-được rồi, vậy chúng ta thực sự làm điều này như thế nào?
`[01:08:37]` Vì vậy, cách chúng tôi làm điều này là chúng tôi sẽ giữ giới hạn dưới trên các nút tối đa, vì vậy tôi sẽ gọi nó là a_s.
`[01:08:43]` Hãy để tôi [NOISE] đưa cái này lên đây.
`[01:08:46]` Vì vậy, chúng ta sẽ có a_s là giới hạn dưới của các nút tối đa.
`[01:08:58]` Vì vậy, chúng tôi sẽ theo dõi điều đó.
`[01:09:00]` Chúng ta cũng sẽ theo dõi b_s, là giới hạn trên của các nút tối thiểu.
`[01:09:11]` Được rồi. Và sau đó nếu chúng không có khoảng cách nào, chúng ta sẽ loại bỏ cây con đó.
`[01:09:17]` Nếu chúng có khoảng thời gian, chúng tôi sẽ tiếp tục cập nhật a_s và b_s.
`[01:09:20]` Được rồi. Vì vậy, đây là một ví dụ, giả sử chúng ta bắt đầu với nút trên cùng này.
`[01:09:25]` Bằng cách nào đó chúng tôi đã phát hiện ra rằng nút trên cùng này phải lớn hơn hoặc bằng 6, đúng không.
`[01:09:29]` Bằng cách nào đó tôi biết nó phải lớn hơn hoặc bằng 6.
`[01:09:34]` Được rồi. Vì vậy, đó là giá trị a_s của tôi.
`[01:09:37]` Vì vậy, a_s của tôi bằng 6, nó sẽ là giới hạn dưới trên các nút tối đa của tôi.
`[01:09:46]` Tôi biết, giá trị tối ưu có giá trị sẽ lớn hơn hoặc bằng 6.
`[01:09:50]` Được rồi. Sau đó, bằng cách nào đó chúng tôi đạt được nút tối thiểu này và sau đó chúng tôi nhận ra rằng nút tối thiểu này phải nhỏ hơn hoặc bằng 8.
`[01:09:57]` Vì vậy, bạn ở đây, giả sử 8 ở đây, chúng ta vẫn còn một khoảng nào đó, tất cả chúng ta đều ổn, đúng vậy, vì vậy b_s sẽ bằng 8, đúng, chúng ta có giới hạn trên của nút min, và điều đó cho chúng ta biết rằng giới hạn trên là 8.
`[01:10:13]` Vì vậy, giá trị có giá trị-tối ưu- giá trị và đường dẫn tối ưu sẽ nhỏ hơn hoặc bằng 8.
`[01:10:20]` Được rồi. Cho đến nay rất tốt.
`[01:10:22]` Sau đó bằng cách nào đó tôi phát hiện ra rằng số đó lớn hơn hoặc bằng 3.
`[01:10:26]` Lớn hơn hoặc bằng 3 thì không sao, phải, lớn hơn hoặc bằng 3 vẫn lớn hơn hoặc bằng 6, a_s của tôi trong trường hợp này, tôi sẽ gọi đây là S1, S2 và S3 bằng 3, đúng không, vì tôi biết mình cần phải lớn hơn hoặc bằng 3.
`[01:10:44]` Nhưng có vẻ như số 6 đã làm được việc rồi, phải không, làm như tôi không cần phải lo lắng về số 3 đó.
`[01:10:48]` Vì vậy, đó là tất cả, tốt cho đến nay.
`[01:10:50]` Và đối với nút cuối cùng này, tôi đang ở nút tối thiểu này, và tôi nhận ra rằng b_s4, tôi sẽ gọi nó là b_s4, bằng 5.
`[01:11:00]` Và điều này cho tôi biết là giá trị của bạn phải nhỏ hơn 5 và nhỏ hơn 5.
`[01:11:06]` Vì vậy tôi sẽ cập nhật từ dưới 8 lên dưới 5.
`[01:11:12]` Và bây giờ, chúng ta không có khoảng thời gian nào cả.
`[01:11:15]` Vì vậy, điều đó cho tôi biết là con đường đó sẽ không phải là con đường tối ưu, bởi vì không có khoảng cách.
`[01:11:21]` Vì vậy- vậy chúng ta sẽ không tìm thấy số này- con số này sẽ là tiện ích.
`[01:11:25]` Và điều đó cho tôi biết là, tôi thực sự có thể bỏ qua toàn bộ cây con đó bởi vì- bởi vì nó sẽ không nằm trong- con đường tối ưu của tôi, tôi có thể- tôi có thể loại bỏ nó, tôi có thể bỏ qua nó, được chứ. Đúng.
`[01:11:36]` Chúng tôi cũng bỏ qua 3 nếu, ừ, phiên bản beta bằng alpha, nếu chúng tôi đã có thứ khác, đó không phải là điều tương tự sao?
`[01:11:42]` Vâng. Vì vậy- vậy chúng ta đang bỏ qua 3 theo một cách khác.
`[01:11:45]` Tôi- tôi- vậy- vậy ừ- vậy nên chúng ta bỏ qua giá trị 3 vì giá trị này đã được mã hóa ở đây.
`[01:11:49]` Nhưng chúng ta đang bỏ qua cây con của 5, giống như tôi không khám phá nó.
`[01:11:53]` Giống như tôi cần khám phá mọi thứ sau phần 3 rồi, bởi vì tôi- thích- thích- thích với phần 3, chúng tôi đã có sự trùng lặp với bản Beta.
`[01:12:00]` Vì vậy, bạn đang xem xét- với giá trị b- chúng tôi đang xem xét sự chồng chéo giữa giới hạn trên của nút tối thiểu và giới hạn dưới của nút tối đa.
`[01:12:08]` Vì vậy, khoảng thời gian đó là khoảng thời gian bạn đang đảm bảo rằng nó vẫn có giá trị trong đó.
`[01:12:11]` Một ví dụ về, ừ, nếu hai hoặc ba mở rộng; dù sao thì bạn cũng bỏ qua chúng vì bạn đã có thứ khác- đó là [OVERLAPPING] là tối ưu phải không?
`[01:12:22]` Vâng, vâng. Vì vậy, ừ, ừ, tôi nghĩ vậy.
`[01:12:25]` Ừ, vậy- vậy nếu bạn đã thích, nếu 3 là 2, đó có phải là điều bạn đang nói không?
`[01:12:28]` Vâng, vậy-vậy- về cơ bản bạn muốn có những khoảng thời gian không tầm thường, vâng.
`[01:12:32]` Vâng. Vì vậy, giống như nếu- nếu- nếu- nó có cùng giá trị- bạn vẫn- vâng, bạn không có những khoảng thời gian không tầm thường.
`[01:12:38]` Và-và vâng câu hỏi.
`[01:12:40]` Tôi đang tự hỏi làm thế nào chúng ta có được 6, 8 và 3.
`[01:12:42]` Ồ, đây là một ví dụ về điều đó, hãy tưởng tượng bằng cách nào đó [TIẾNG ỒN].
`[01:12:46]` Nhưng chúng ta- chúng ta sẽ nói về một số ví dụ chúng ta lấy chúng ở đâu.
`[01:12:48]` Vì vậy, tôi sẽ nói về một ví dụ nữa mà chúng ta thực sự muốn lấy những thứ này, nhưng bây giờ hãy giả sử bằng cách nào đó chúng ta đã tìm thấy thứ này. Đúng.
`[01:12:55]` Ừm, ở ví dụ trên, tôi không hiểu tại sao, ừ, 3 là giới hạn trên hay 2 là giới hạn dưới.
`[01:13:03]` Vì vậy, ừm, vậy- giá trị thực tế, ừm, tôi không đưa ra ví dụ đầy đủ ở đây.
`[01:13:10]` Vì vậy, các giá trị thực tế đang đến từ một nơi nào đó mà tôi chưa nói đến nhưng- [OVERLAPPING] [không nghe được] Ồ, giá trị ở trên cùng. Được rồi, ồ xin lỗi.
`[01:13:17]` Vâng. Vậy cái ở trên cùng phải không?
`[01:13:20]` Vậy- vậy đây là nút tối thiểu, nút tối thiểu, đây là nút tối đa, phải không?
`[01:13:25]` Vì vậy, tại nút tối thiểu của tôi, tôi phát hiện ra rằng mức tối thiểu từ 3 đến 5 là 3, phải không?
`[01:13:30]` Vì vậy, nút tối đa đang tối đa hóa từ 3 đến một loạt thứ khác.
`[01:13:35]` Đó- đó là những gì nó phải làm, phải không?
`[01:13:37]` Vì vậy, nó tối đa hóa giữa 3 và một loạt những thứ khác, thì ít nhất nó sẽ là 3.
`[01:13:42]` Nó sẽ không bằng 2, không có cách nào nó bằng 2 hoặc nó sẽ không bằng 0, phải không?
`[01:13:46]` Bởi vì nó- sẽ mất tối đa 3 và thứ gì đó khác.
`[01:13:49]` Vì vậy, đó là lý do tại sao tôi nói, à, giá trị mà tôi sắp nhận được ở nút tối đa này sẽ lớn hơn hoặc bằng 3. Điều đó có hợp lý không?
`[01:13:58]` Vì thế bây giờ tôi đi xuống đây, và tôi thấy như thế này, tôi thấy cái này 2; đây là một nút tối thiểu.
`[01:14:04]` Vậy giá trị ở đây sẽ là nhỏ nhất giữa 2 và bất cứ thứ gì ở trên cây này, phải không?
`[01:14:12]` Vậy thì ít nhất là, ừ, tôi rất tệ với điều đó, ít nhất và nhiều nhất.
`[01:14:16]` Nó sẽ là- [CƯỜI] nó sẽ là 2 hoặc thấp hơn. Hãy để tôi sử dụng nó.
`[01:14:20]` Vậy- vậy những gì chúng ta nhận được ở đây sẽ là 2 hoặc thấp hơn, phải không?
`[01:14:25]` Vì vậy, tôi sẽ nhận được 2 hoặc 1 hoặc 0 hoặc- hoặc tất cả.
`[01:14:28]` Và đó là giá trị sẽ được đẩy lên đây, phải không?
`[01:14:32]` Vì vậy, đó là giá trị sẽ giảm xuống ở đây, nó sẽ là giá trị bằng 2 hoặc thấp hơn.
`[01:14:38]` Vì vậy, nếu tôi tối đa hóa từ 3 đến mức 2 hoặc thấp hơn thì 3 là đủ.
`[01:14:45]` Và tôi có thể nghĩ ra điều đó dựa trên những khoảng này và không nhìn vào phía bên này của cây.
`[01:14:49]` Giống như- giống như một lần tôi- Tôi đã nhìn thấy hai thứ này, tôi đã cảm thấy không- không có khoảng cách tầm thường nào giữa một giá trị lớn hơn 3 và một giá trị nhỏ hơn 2.
`[01:14:59]` Vì thế tôi không thể lo lắng về những thứ ở dưới đó được.
`[01:15:02]` Được rồi. Được rồi.
`[01:15:05]` Vì vậy, một cách triển khai nhanh khác, tôi nghĩ là chúng ta đã nói về các giá trị A, A và B này.
`[01:15:14]` Bạn có thể theo dõi chỉ một giá trị.
`[01:15:16]` Và đó sẽ là giá trị Alpha và giá trị Beta, trong đó giá trị Alpha chỉ là -Tôi sẽ minh họa nó ở đây.
`[01:15:22]` Giá trị Alpha- hãy để tôi hiểu đúng.
`[01:15:24]` Vậy Alpha của s là giá trị lớn nhất của a_s đối với tất cả các số nguyên tố s nhỏ hơn s. Vâng.
`[01:15:33]` Về cơ bản thì điều này có nghĩa là như vậy, hãy nhớ như khi chúng ta nhìn thấy số 3, chúng ta đã nói, "Chà, cái đó đã được bao gồm rồi, giống như chúng ta đã biết điều đó vậy." Đó là loại ý tưởng tương tự.
`[01:15:41]` Vì vậy Alpha của s sẽ chỉ là một giá trị.
`[01:15:44]` Trong trường hợp này, nó sẽ là 6, vì giống như khi tôi nhìn thấy 3, có vẻ như tôi không thực sự quan tâm đến 3 đó, phải không?
`[01:15:50]` Giống như tôi đã biết mình lớn hơn 6, biết rằng tôi lớn hơn 3 cũng chẳng thêm được gì.
`[01:15:54]` Vì vậy, chúng tôi theo dõi một giá trị; Alpha của a- al- Alpha của s. Trong trường hợp này, Alpha của s chỉ bằng 6.
`[01:16:02]` Và điều tương tự cũng xảy ra với Beta.
`[01:16:04]` Chúng ta sẽ theo dõi Beta của s và Beta của s chỉ tối thiểu là b_s.
`[01:16:11]` Và sau đó, những gì tôi đang viết ở đây chỉ là thứ tự của các nút mà bạn đã thấy.
`[01:16:15]` Vậy Beta của s là 5.
`[01:16:19]` Và sau đó, bạn đang xem các khoảng như Alpha của s, uh, và s- Alpha của s trở lên và Beta của s trở xuống.
`[01:16:27]` Và nếu những khoảng đó không có bất kỳ giao điểm tầm thường nào, thì bạn có thể- bạn có thể tỉa một phần của cây.
`[01:16:32]` Được rồi. Vì vậy- vì vậy, đây giống như một- một công việc triển khai thay vì theo dõi tất cả các a_s và b_s này, chỉ giữ một số, một Alpha và một Beta.
`[01:16:39]` Được rồi. Được rồi.
`[01:16:43]` Được rồi. Vì vậy, hãy xem xét một ví dụ khác.
`[01:16:46]` Ờ, vậy được rồi.
`[01:16:49]` Vì vậy tôi sẽ làm ví dụ này thật nhanh.
`[01:16:51]` Được rồi. Vì vậy, bạn sẽ bắt đầu từ nút trên cùng nào đó, chúng ta sẽ đi đến nút này, đây là nút tối thiểu nằm giữa 9 và 7.
`[01:17:01]` Từ 9 đến 7 phải không?
`[01:17:04]` Vì vậy, đây là nút tối thiểu, tôi sẽ lấy anh chàng này; 7.
`[01:17:08]` Tôi sẽ nhận ra rằng nút tối đa này sẽ ít nhất là 7, phải không?
`[01:17:13]` Nó sẽ là cái gì đó lớn hơn hoặc bằng 7.
`[01:17:16]` Vậy Alpha của s của tôi bây giờ sẽ là 7.
`[01:17:20]` Tôi biết bất kỳ giá trị nào tôi sắp nhận được sẽ là 7 hoặc cao hơn.
`[01:17:23]` Bất kể giá trị mà nút bắt đầu này nhận được là gì, nó phải là 7 hoặc cao hơn, được chứ?
`[01:17:27]` Bây giờ tôi đi xuống đây, tôi đang ở nút cực tiểu.
`[01:17:31]` Tôi thấy số 6 ở đây phải không?
`[01:17:34]` Tôi vào đây, đó là nút min, vậy nên bất cứ thứ gì chúng ta có ở đây, sẽ nhỏ hơn hoặc bằng 6, phải không?
`[01:17:41]` Vì vậy, nó sẽ là 6 hoặc thấp hơn.
`[01:17:44]` Điều đó cho tôi biết Beta của s của tôi bằng 6.
`[01:17:48]` Điều đó cho tôi biết bất cứ điều gì tôi nhận được trong nút tối thiểu đó sẽ là 6 hoặc thấp hơn.
`[01:17:52]` Nó không có giao điểm nào với Alpha của s của tôi. Vì vậy, tôi không thể làm bất cứ điều gì về chi nhánh này.
`[01:18:00]` Giống như tôi không- thích tôi không cần phải xem qua thích- như tôi biết giống như tất cả những thứ khác như, tôi có thể bỏ qua như toàn bộ chi nhánh này.
`[01:18:07]` Được rồi. Được rồi.
`[01:18:10]` Vì vậy bây giờ tôi quay trở lại.
`[01:18:12]` Tôi đi xuống đây, tôi đang ở nút tối thiểu.
`[01:18:16]` Vì vậy, hãy nhớ cách chúng tôi tính toán các giá trị Beta này dựa trên các nút mà chúng tôi đã thấy trước đây.
`[01:18:21]` Vậy là bây giờ tôi có bản Beta mới vì tôi đã xong việc với nhánh này rồi, phải không.
`[01:18:24]` Vậy tôi-tôi cần phải đến đây.
`[01:18:26]` Ở đây tôi có một phút giữa- nó là gì?
`[01:18:28]` 8. Đây là 8?
`[01:18:30]` 8 và 3. Vậy được rồi.
`[01:18:33]` Vì vậy- vậy tôi hiểu rồi- có lẽ hãy để tôi viết số 8.
`[01:18:35]` Tôi thấy số 8 của tôi ở đây, nó là nút tối thiểu, nên nó sẽ nhỏ hơn hoặc bằng 8.
`[01:18:40]` Vì vậy giá trị Beta mới của tôi sẽ là 8.
`[01:18:44]` Alpha của tôi vẫn là 7 vì đó là nút trên cùng của tôi.
`[01:18:48]` Vì vậy, nó là 8 hoặc thấp hơn.
`[01:18:51]` Chúng ta có một khoảng thời gian, khoảng thời gian chồng chéo, từ 7 đến 8.
`[01:18:54]` Mọi thứ đều tốt. Vì vậy, tôi thực sự cần phải đi xem giá trị này là gì.
`[01:18:59]` Giá trị này là 3, vì vậy tôi nhận được 3 ở đây, hoặc đại khái, nó chính xác bằng 3.
`[01:19:05]` Vì vậy, bản cập nhật Beta của tôi từ 8 lên 3.
`[01:19:10]` Dù sao thì chúng ta cũng đã khám phá phần đó của cây rồi, nhưng 3- bạn không có khoảng cách.
`[01:19:15]` Nếu có nhiều thứ bên dưới ba thứ này như tôi- tôi thích khi tôi quyết định bằng cách nào đó, kiểu như tôi sẽ không cần khám phá nó, nhưng chúng tôi thực sự không có thứ đó.
`[01:19:22]` Và sau đó chúng ta thấy rằng giá trị tối ưu của chúng ta là 7, vì vậy chúng ta chỉ trả về 7, được chứ.
`[01:19:28]` Và chúng tôi đã không khám phá phần giữa khổng lồ này của cái cây.
`[01:19:32]` Được rồi. Thêm một slide nữa và sau đó tôi sẽ- hai slide nữa- hai slide nữa, một ý tưởng nhanh.
`[01:19:37]` Được rồi. Vì vậy [CƯỜI] Được rồi.
`[01:19:40]` Vì vậy, thứ tự của mọi thứ thực sự quan trọng, vì vậy- điều duy nhất tôi muốn đề cập về ý tưởng cắt tỉa này là- thứ tự của mọi thứ đều quan trọng.
`[01:19:46]` Vì vậy, khi chúng ta xem ví dụ này, hãy nhớ rằng chúng ta chưa khám phá bất cứ điều gì về số 10, bởi vì chúng ta đã biết rằng giá trị này cần phải lớn hơn hoặc bằng 3.
`[01:19:54]` Đây là xô của tôi phải không?
`[01:19:55]` Nếu mình đổi xô, như đổi thứ tự các xô, mình chuyển xô 2-10 sang bên này, xô 3-5 sang bên kia, thì mình không làm được.
`[01:20:03]` Tôi thực sự cần khám phá toàn bộ cây, vì Alpha và Beta của tôi sẽ không có cùng đặc tính.
`[01:20:09]` Vì vậy, thứ tự bạn sắp xếp mọi thứ trên cây thực sự quan trọng và- và bạn nên quan tâm đến điều đó.
`[01:20:14]` Ừm, trường hợp xấu hơn là thứ tự của chúng ta quá tệ, vì vậy chúng ta thực sự cần phải xem xét toàn bộ cây theo thứ tự từ b đến 2d.
`[01:20:21]` Đó là trường hợp xấu nhất.
`[01:20:23]` Có thứ tự tốt nhất này mà bạn không khám phá được một nửa.
`[01:20:27]` Vì vậy- vì vậy bạn có thể- thích nếu bạn- nếu bạn có- nếu bạn có một cái cây mà bạn có thể khám phá tới độ sâu 10, thì với thứ tự tốt nhất, bạn thực sự có thể khám phá đến độ sâu như 20.
`[01:20:38]` Vì vậy- đó thực sự là một cải tiến lớn.
`[01:20:40]` Uh, vậy thứ tự tốt nhất sẽ là thứ tự từ b đến d. Và sau đó việc sắp xếp ngẫu nhiên hóa ra cũng khá ổn, vì vậy việc sắp xếp ngẫu nhiên sẽ là thứ tự từ b đến 2 nhân 3 lần thứ tư d. Vì vậy ngay cả khi bạn có thứ tự ngẫu nhiên,
`[01:20:54]` nó sẽ tốt hơn so với trường hợp xấu nhất.
`[01:20:57]` Và sau đó, làm thế nào để bạn tìm ra thế nào là một trật tự biên giới tốt?
`[01:21:00]` Vâng, chúng ta có thể có chức năng đánh giá này.
`[01:21:02]` Hãy nhớ rằng- bạn đang tính toán hàm đánh giá và- và điều bạn có thể làm là, bạn có thể sắp xếp, ừ, của bạn- vì vậy đối với các nút tối đa, bạn có thể sắp xếp các nút kế tiếp bằng cách giảm hàm đánh giá,
`[01:21:13]` và do đó, ở các nút tối thiểu, bạn có thể sắp xếp các nút kế tiếp bằng cách tăng các hàm đánh giá.
`[01:21:17]` Điều đó cho phép bạn cắt tỉa càng nhiều thứ càng tốt. Được rồi.
`[01:21:22]` Vì vậy, tôi sẽ gặp các bạn bài giảng tiếp theo nói về việc học TD.

---
