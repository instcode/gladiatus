For those who cannot read Vietnamese, please visit our wiki: http://code.google.com/p/gladiatus/w/list

# Ngày tàn của Ma Giáo #

Buổi tiệc nào cũng sẽ tàn, guild Ma Giao hôm nay lên đây để ra mắt các bạn cũng như là để được nói những lời cuối cùng với anh chị em chơi ở S1 nói riêng và cộng đồng chơi Gladiatus ở Viet Nam :D

Lời đầu tiên xin gửi đến anh chị em là: Kô "chít", nếu kô, bạn sẽ bị "chít" :)) Dịch word-by-word sang English là: Do not cheat, otherwise you will be dead :))

Đúng vậy, hầu như những thành viên của Ma Giao mà là "nightmare" của những bé cùi mía nay đã bị banned... Từ nay về sau, các bạn sẽ ko còn có cơ hội để bị... gõ nữa Happy Có trách thì trách tại sao Sở Lưu Hương kô nương tay :)).. Hi vọng các bạn sẽ dần quên những cái nick như: quocvu, none, Mig, instcode, golem, btnguyen, iam\_valkyrie, Tomato... và ráng cày bừa để có thể bụp những kẻ thù còn sót lại của chính mình...

Nhân đây, những ai thường xuyên bị instcode gõ thì cũng đừng buồn, nếu mình kô gõ thì cũng có người khác gõ thôi :))

# Gladiatus Helper #
Tiếp theo, đây là phần thú vị nhất mà các bạn chắc chắn nhiều bạn sẽ quan tâm... Đó là toàn bộ những "in-house" softwares của guild Ma Giao được phát triển trong suốt quá trình chơi gladiatus nay sẽ công bố cho anh em sử dụng, hoàn toàn miễn phí và... at your own risk :))...

Bộ tools này bao gồm:

  * Gladiatus Helper (easy arena, easy training, battle simulation, auction timer, market buying...)
  * Gladiatus Automatic Bots (auto training, auto attacking, auto protection...)

Các bạn có thể vào ngay địa chỉ: http://gladiatus.googlecode.com/svn để download ngay những gì có thể download được... Nhưng để chạy được thì các bạn cần theo những giới thiệu và hướng dẫn trong bài tiếp...

Project Home: http://gladiatus.googlecode.com

## Giới thiệu: ##

### 1. Gladiatus Helper: ###
Đây là bộ scripts ở client (web browser) nhằm hỗ trợ người chơi có những chức năng hữu hiệu trong quá trình chơi gladiatus, gồm những module sau:
  * Overview: Xem thử chỉ số của mình hiện giờ là ra sao, xem chỉ số của những người khác hiện giờ ra sao...
  * Arena: Simulate thử xem mình có khả năng thắng một chiến binh khác bao nhiêu %, damage họ gây cho mình khoảng bao nhiêu, mình gây cho họ bao nhiêu damage...
  * Market: Xem tỉ lệ food bán ở chợ là bao nhiêu tiền trên 1 đơn vị máu để mua food với giá rẻ nhất có thể...
  * Auction: Xem thời gian còn lại của auction là bao nhiêu (chính xác đến từng giây Big Grin )...
  * Quest: Xem mình đang cần phải làm công việc gì, thời gian công việc còn lại là bao nhiêu, tự động lấy quest mới...

### 2. Automatic Bots: ###
  * Training Bot: Tự động lựa đi training ở mức đơn giản, luôn giữ cho số expedition point còn lại ko vượt quá số lượng tối đa, tự động chăn ngựa ngủ nghỉ, tự động nâng cấp những basic stats khi có đủ tiền, tự động nhậ̣n quest...
  * Attacker Bot: Tự động gõ một player bao nhiều lần trên ngày :D, tự động gõ 1 player mỗi giờ rồi chăn ngựa...

Ghi chú: Những ứng dụng trên sử dụng một loạt các Bot APIs để viết, các bạn hoàn toàn có thể xem những API hiện có trong GladiatusBot.py để tự viết ra bot mới.

### 3. Tiểu sử: ###
  * Ban đầu, instcode sau khi google "gladiatus helper", hắn đã tìm ra 1 greasemonkey script rất đơn giản để xem simulation cho 1 trận đấu sử dụng trang gladiatus simulator (mà bây giờ là http://playerutils.com/), vậy là hắn ta bắt đầu bưng về cho anh em để họ tìm cách mổ xẻ và để phát triển tiếp...
  * Dẫn đầu bởi btnguyen, bộ 3 người gồm thêm none và iam\_valkyrie đã liên tục chửi cái greasemonkey script ở trên ghẻ và đã xoá nó hoàn toàn, những gì còn sót lại chỉ là ý tưởng... Thế là Gladiatus Helper ra đời version đầu tiên...
  * Trong giai đoạn này, btnguyen liên tục add những killer features như "múc" link, character overview, training timer, arena timer... mà tồn tại cho đến bây giờ...
  * Shortcut links để training và quest description/rewards đánh dấu sự xuất hiện của instcode trong Gladiatus Helper, nhưng tiếc thay phần HTML/javascript code của anh đã bị chửi thậm tệ và đã bị thay thế hoàn toàn bởi none... instcode dần dần mất bóng trong những release tiếp theo của Gladiatus Helper...
  * Và rồi chuyện gì đến cũng đã đến, btnguyen cho ra trang AuctionWatcher mà hiện giờ đang nằm trong phần trang chủ của guild Ma Giao, nhưng đáng tiếc là crontab có resolution quá lớn cho nên helper này lệch giờ đấu giá cả núi :D.. Bực mình, none nhà ta đã ra tay và viết ngay một cái auction watcher rồi tích hợp vào trong Gladiatus Helper...
  * Version 0.4.0 ra đời ở server chính làm trang web gladiatus simulator ngừng hoạt động, instcode ngay lập tức nhảy vào để viết lại phần simulator và cho nó online ở Google App Engine: http://gladiatus-helper.appspot.com/
  * Tomato requested chức năng tự động nhận quest, iam\_valkyrie ngay lập tức xông vào ngoáy ngoáy những dòng code, thế là một cái chức năng tự động nhận quest đã ra đời dù bug cả đống mà sau này instcode phải sửa lại :D
  * Tối tối, anh em ra chợ mua food về nhậu, vậy là instcode đã ra tay viết phần Market Food, nhằm mua food với giá rẻ nhất... Thế là anh lao vào sửa Gladiatus Helper, nhìn đống code như đống rừng, anh lập tức refactor lại đẹp đẽ trước khi chèn thêm 1 module Easy Market như bây giờ...
  * Ngày qua ngày, instcode liên tục bị bọn ác mạnh hơn gõ (điển hình trong giai đoạn này là những bác ở guild LOL: Halama, Togan và nguong), mỗi lần anh mất cả xô máu... Thế là anh đã nghĩ cách viết 1 auto protection bot nhằm hạn chế tang thương...
  * Và rồi anh em trong guild Ma Giao vì cơm áo gạo tiền, nên phải làm việc, từng "nhân vật" của họ bị bỏ bê kô ai chăm sóc... instcode một lần nữa ra tay và làm tiếp phần "auto training bot" nhằm hỗ trợ anh em trong những lúc kô đi cùng nhân vật mình được...
  * Version 0.4.0 ra đời ở server Vietnam hầu như giết hết khá nhiều features của Gladiatus Helper, mặc dù vậy, phần simulator vẫn được updated...
  * Và bùuuuuummmmmmmmm.... Hầu như mọi account đã bị banned, thế là Gladiatus Helper và Gladiatus Automatic Bots bây giờ đã được public ở đây!...

Các bạn có thể tham khảo wiki để biết cách cài đặt và sử dụng:
  * Vietnamese: http://code.google.com/p/gladiatus/wiki/InstallationVietnamse
  * English (đầy đủ hơn): http://code.google.com/p/gladiatus/wiki/Installation

P/S: Nếu ai có khả năng và muốn phát triển tiếp để sử dụng hoặc cung cấp cho cộng đồng, xin gửi mail về instcode [at](at.md) gmail [dot](dot.md) com, mình sẽ hỗ trợ trong khả năng có thể.

Khuyến khích các bạn phổ biến bộ scripts và tools này cho những người chơi Gladiatus, và xin các bạn tôn trọng bản quyền của tụi mình! Cám ơn!

Đây là những nhận xét của pmquan về project này:

http://board.gladiatus.vn/thread.php?postid=8474

http://board.gladiatus.vn/thread.php?threadid=1123

http://board.gladiatus.vn/thread.php?threadid=1134

```
À há BeautifulSoup :p

To: instcode
This code is not written by you. Maybe you've leeched it from somewhere then edit
something. You dont know how to use utf-8 char in .py language means .... you dont have
any basic about py. Without that knowledge about py, you cannot know how to use urllib.

That code is very basically, no any AI in that stuff.
Thats why, your guys are a loser. 
```
Xin lỗi, nhưng em phải chửi thằng stupid này:
```
Ặc ặc, why don't you just make your mouth close and look at the source code of
BeautifulSoup.py? Why a man in the world just has a big mouth to make an assumption
instead of using his buffalo eyes to read the header of a source file? =))

Eh man, have you ever used Beautiful Soup for parsing HTML? =)) What I saw from
your post is you even don't know why BeautifulSoup is existed =)) Eh man, have
you ever heard about HTML Tidy? =)) So, if you don't know, shut your mouth up and
just spend time on playing game, ok?

No AI in that stuff because I don't have enough time for both playing and
coding game/tool, does that matter to you puck? =))

Eh, I'm a loser and you will be next =))
```
Vậy là sau khi nó về nhà google này nọ để bổ sung kiến thức, nó quay lại búa em:
```
Use your skills at your work, it maybe useful. Keep trying to play game fairly.

PS: BeautifulSoup is rather slower than regex & waste your memory resourses. :-)
keep in mind, memory is money.
```
Ối trời ơi, nghe có vẻ đàn anh quá, vậy là em phải búa lại nó:
```
Ọc ọc, oé... What are you talking about? What do you want to prove, big mouth?
You gave me your words like my teachers did =)) Are you teaching me how to play
fair? OMFG, you should keep them for yourself, because I don't think you dare to
use your protection bots, your auto-buying-bots any more =))...

And about BeautifulSoup, I guess you've just googled it, right? =)) I know it is
never too late to learn, but why didn't you keep your mouth silent once you realized
that your knowledge is insufficient?? Why did you keep speaking out more and more
stupid things like that, man? Eh, Regular Expression is faster than DOM manipulating?
OMFG, you are talking like a big brother in programming field but you even don't know
a sh?t about what RegEx and DOM manipulating are! I think you should make another
googling and stop making more and more stupid assumption. And if you wanna make a debate
on this stuff, let's go to somewhere else ok? HVA online or DDTH, which is your
familiar discussion board? =))

Cho em dịch đoạn trên sang tiếng Việt:

"Trời ơi, ghẻ rứa pmquan, có biết lập trình hông? Hông biết thì nín chứ đừng quăng
dao búa ra kẻo mấy người biết chuyện nó cười cho thúi mũi."

=))

P/S: Xin lỗi bà con, mình sẽ rút trong câm lặng để còn làm việc, mình cũng khuyên
các bạn đừng nên chơi game nữa, tốn thời gian và tiền bạc lắm :"> 
```

Thât đáng tiếc, babybebebe gì đó vào xoá mất bài.. Thôi thì em giữ lại đây coi như là một phần của project vậy :))