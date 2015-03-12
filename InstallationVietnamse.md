## Hướng Dẫn Sử Dụng ##

### 1. Gladiatus Helper Extreme: ###
Để cài đặt và sử dụng được Gladiatus Helper, bạn phải bỏ ngay trình duyệt Internet Explorer và chuyển sang dùng trình duyệt Mozilla Firefox có cài đặt extension Greasemonkey. Ngoài ra, để chức năng auction hoạt động, bạn phải sử dụng 1 dedicate pc để cho nó chạy suốt thời gian auction chuyển từ "Ngắn hạn" sang "Rất ngắn".

Cách cài đặt:
  1. Sử dụng trình duyệt Firefox đã cài extension Greasemonkey (google for them)
  1. Vào địa chỉ: http://gladiatus.googlecode.com/svn/trunk/GladiatusHelper/src/gm/
  1. Click vào GladiatusHelper.user.js: http://gladiatus.googlecode.com/svn/trunk/GladiatusHelper/src/gm/GladiatusHelper.user.js
  1. Khi cài đặt xong, bạn có thể click vào những link trong trang gladiatus của bạn và thấy ngay kết quả :D

### 2. Gladiatus Automatic Bots: ###
Xin nói trước là bạn phải có kiến thức chút ít về Python để sử dụng nó... Mình xin lỗi vì ko co thời gian để chỉ chi tiết, hi vọng một bạn nào đó sẽ giúp để viết hướng dẫn cho anh em xài ké...

Để cài đặt và sử dụng Gladiatus Helper, bạn phải có:

  1. Cài đặt Google App Engine.
  1. Vào địa chỉ http://gladiatus.googlecode.com/svn/trunk/GladiatusHelper/src/ để lấy Python source code
  1. Chạy bot bằng cách dùng command để gọi python cho những script: Attacker.py, TrainingBot.py

Ví dụ sau đây là 1 đoạn bash shell script để bảo vệ những thành viên của Ma Giao:

## accounts.txt ##
```
userbot1 password-bot1 quocvu
userbot2 password-bot2 none
userbot3 password-bot3 Mig
userbot4 password-bot4 instcode
userbot5 password-bot5 btnguyen
userbot6 password-bot6 iam_valkyrie
```


## ProtectUs.sh ##
```
#!/bin/bash

export PYTHONPATH=~/application/google_appengine:~/application/gladiatus
gawk '{
system("python gladiatus/org/ddth/game/gladiatus/arena/Attacker.py -u" $1 " -p" $2 " -v" $3 " > " $3 ".log &")
}' accounts.txt
```

Ghi chú: Trong trường hợp này, cấu trúc thư mục như sau:

```
.. application <-- Working directory
........ google_appengine
............... <gì gì đó của google app engine>
........ gladiatus
............... org
....................... ddth
............................. game
..................................... gladiatus
.............................................. arena
........................................................ Attacker.py
............................................... core
........................................................ TrainingBot.py
```