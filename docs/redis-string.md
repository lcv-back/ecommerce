# String redis

I.The list of commands about string redis and how to use them:

1. SET

   - Công dụng: Thiết lập giá trị của một key.

   - Cú pháp:
     SET key value

   - Ví dụ:
     SET user "John"

2. GET

   - Công dụng: Lấy giá trị của một key.

   - Cú pháp:
     GET key

   - Ví dụ:
     GET user

3. SETNX (Set if not exist)

   - Công dụng: Đặt giá trị cho key chỉ khi key đó chưa tồn tại.

   - Cú pháp:
     SETNX key value

   - Ví dụ:
     SETNX user "John"

4. SETEX (Set with Expiry)

   - Công dụng: Đặt giá trị của key và thiết lập thời gian sống (TTL) cho key đó.

   - Cú pháp:
     SETEX key seconds value

   - Ví dụ:
     SETEX session 3600 "data"

5. PSETEX

   - Công dụng: Giống như SETEX, nhưng thời gian sống được tính bằng milliseconds.

   - Cú pháp:
     PSETEX key milliseconds value

   - Ví dụ:
     PSETEX session 1000 "data"

6. MSET (Multiple SET)

   - Công dụng: Thiết lập giá trị cho nhiều keys cùng một lúc.

   - Cú pháp:
     MSET key1 value1 key2 value2 ...

   - Ví dụ:
     MSET user1 "John" user2 "Jane"

7. MGET (Multiple GET)

   - Công dụng: Lấy giá trị của nhiều keys cùng lúc.

   - Cú pháp:
     MGET key1 key2 ...

   - Ví dụ:
     MGET user1 user2

8. INCR (Increment)

   - Công dụng: Tăng giá trị của key lên 1. Key phải chứa số nguyên.

   - Cú pháp:
     INCR key

   - Ví dụ:
     INCR counter

9. DECR (Decrement)

   - Công dụng: Giảm giá trị của key đi 1.

   - Cú pháp:
     DECR key

   - Ví dụ:
     DECR counter

10. INCRBY

    - Công dụng: Tăng giá trị của key lên một số xác định.

    - Cú pháp:
      INCRBY key increment

    - Ví dụ:
      INCRBY counter 5

11. DECRBY

    - Công dụng: Giảm giá trị của key đi một số xác định.

    - Cú pháp:
      DECRBY key decrement

    - Ví dụ:
      DECRBY counter 3

12. INCRBYFLOAT

    - Công dụng: Tăng giá trị của key lên một số thực (floating point).

    - Cú pháp:
      INCRBYFLOAT key increment

    - Ví dụ:
      INCRBYFLOAT price 1.5

13. APPEND

    - Công dụng: Nối thêm một chuỗi vào giá trị hiện tại của key

    - Cú pháp:
      APPEND key value

    - Ví dụ:
      APPEND user " Doe"

14. STRLEN

    - Công dụng: Trả về độ dài của chuỗi lưu trong key.

    - Cú pháp:
      STRLEN key

    - Ví dụ:
      STRLEN user

15. GETRANGE (Substring)

    - Công dụng: Lấy một phần chuỗi từ key.

    - Cú pháp:
      GETRANGE key start end

    - Ví dụ:
      GETRANGE user 0 3 # Trả về "John"

16. SETRANGE

    - Công dụng: Thay thế một phần chuỗi bắt đầu từ vị trí được chỉ định.

    - Cú pháp:
      SETRANGE key offset value

    - Ví dụ:
      SETRANGE user 5 "Smith"

17. GETSET

    - Công dụng: Đặt giá trị mới cho key và trả về giá trị cũ.

    - Cú pháp:
      GETSET key value

    - Ví dụ:
      GETSET user "Jane"

18. BITCOUNT

    - Công dụng: Đếm số lượng bit có giá trị 1 trong chuỗi nhị phân lưu trong key.

    - Cú pháp:
      BITCOUNT key [start end]

19. SETBIT

    - Công dụng: Đặt giá trị bit tại một vị trí cụ thể.

    - Cú pháp:
      SETBIT key offset value

    - Ví dụ:
      SETBIT mykey 7 1

20. GETBIT

    - Công dụng: Lấy giá trị bit tại một vị trí cụ thể.

    - Cú pháp:
      GETBIT key offset

    - Ví dụ:
      GETBIT mykey 7

21. BITOP

    - Công dụng: Thực hiện các phép toán nhị phân (AND, OR, XOR, NOT) trên các chuỗi lưu trữ.

    - Cú pháp:
      BITOP operation destkey key1 key2 ...

    - Ví dụ:
      BITOP AND resultkey key1 key2

II. Kịch bản sử dụng
Redis strings có thể được sử dụng trong nhiều tình huống thực tế để lưu trữ dữ liệu tạm thời và xử lý nhanh chóng. Dưới đây là một số kịch bản sử dụng Redis strings, mô tả cách strings trong Redis giúp giải quyết các vấn đề phổ biến trong phát triển phần mềm:

1. Lưu trữ session của người dùng (Session Storage)

- Kịch bản: Trong một ứng dụng web, khi người dùng đăng nhập, hệ thống cần lưu trữ thông tin phiên (session) của họ để theo dõi trạng thái đăng nhập mà không cần truy vấn cơ sở dữ liệu liên tục.

- Giải pháp bằng Redis strings: Sử dụng Redis strings để lưu session ID với thời gian sống giới hạn, nhằm giữ cho session hợp lệ trong một khoảng thời gian nhất định.

```bash
# Tạo một session với giá trị là user ID, và đặt thời gian sống cho session là 1 giờ
SETEX session:12345 3600 "user_5678"

# Lấy thông tin session
GET session:12345  # Trả về "user_5678"

```

2. Lưu trữ bộ đếm (Counters)

- Kịch bản: Một website cần theo dõi số lượng lượt truy cập vào một bài viết cụ thể.
- Giải pháp bằng Redis strings: Sử dụng lệnh INCR để tăng giá trị đếm mỗi khi có một lượt truy cập mới.

```bash
# Mỗi lần có lượt truy cập mới vào bài viết "post_123"
INCR views:post_123

# Xem số lượt truy cập hiện tại
GET views:post_123  # Ví dụ: Trả về "101"

```

3. Lưu trữ dữ liệu cache tạm thời (Caching)

- Kịch bản: Bạn cần lưu trữ tạm thời dữ liệu tốn thời gian tính toán (như kết quả từ API hoặc truy vấn phức tạp) để giảm tải cho hệ thống.

- Giải pháp bằng Redis strings: Sử dụng Redis để lưu trữ kết quả truy vấn với thời gian sống ngắn, tránh việc truy vấn lại nhiều lần trong khoảng thời gian ngắn.

```bash
# Lưu cache kết quả của một truy vấn API trong 5 phút (300 giây)
SETEX api:result 300 "result_data"

# Lấy dữ liệu từ cache
GET api:result
```

4. Lưu trữ cấu hình tạm thời (Temporary Configuration Storage)

- Kịch bản: Bạn có một tính năng tạm thời hoặc cần kiểm tra một cấu hình thay đổi trong một khoảng thời gian nhất định, chẳng hạn như kiểm tra A/B.

- Giải pháp bằng Redis strings: Sử dụng Redis để lưu cấu hình tạm thời với thời gian sống giới hạn.

```bash
# Lưu cấu hình A/B test trong 1 giờ
SETEX ab_test:config 3600 "version_b"

# Lấy cấu hình hiện tại
GET ab_test:config  # Trả về "version_b"

```

5. Lưu trữ dữ liệu nhị phân (Binary Data Storage)

- Kịch bản: Bạn cần lưu trữ dữ liệu nhị phân như hình ảnh, file hay dữ liệu encode bằng Base64 mà không cần dùng đến hệ thống file.

- Giải pháp bằng Redis strings: Redis strings có thể lưu trữ dữ liệu nhị phân như hình ảnh, âm thanh hoặc tệp mã hóa dưới dạng Base64.

```bash
# Lưu trữ dữ liệu hình ảnh dưới dạng nhị phân (Base64)
SET image:profile_user_123 "\x89PNG\r\n\x1A\n..."

# Lấy lại dữ liệu hình ảnh
GET image:profile_user_123

```

6. Thực hiện thao tác chuỗi phức tạp (String Manipulation)

- Kịch bản: Bạn cần xử lý dữ liệu trong chuỗi (ví dụ như lấy một phần chuỗi từ dữ liệu).

- Giải pháp bằng Redis strings: Redis cung cấp các lệnh như GETRANGE để trích xuất một phần của chuỗi hoặc APPEND để nối chuỗi.

```bash
# Lưu trữ chuỗi dữ liệu
SET article:title "Understanding Redis Strings"

# Trích xuất phần đầu tiên của tiêu đề
GETRANGE article:title 0 11  # Trả về "Understanding"

# Thêm một phần mới vào tiêu đề
APPEND article:title " - A Complete Guide"
GET article:title  # Trả về "Understanding Redis Strings - A Complete Guide"
```

7. Đếm bit trong dữ liệu (Bitwise Operations)

- Kịch bản: Bạn cần lưu trữ dữ liệu boolean cho mỗi hành vi của người dùng (ví dụ như nhấp chuột hoặc xem video) và cần đếm số hành vi đã thực hiện.

- Giải pháp bằng Redis strings: Sử dụng các lệnh bit như SETBIT, GETBIT, và BITCOUNT để lưu trữ và thao tác trên bit.

```bash
# Đặt bit tại vị trí 7 để biểu thị người dùng đã nhấp chuột
SETBIT user:clicks 7 1

# Kiểm tra trạng thái bit tại vị trí 7
GETBIT user:clicks 7  # Trả về 1 (người dùng đã nhấp)

# Đếm số hành vi đã thực hiện (số bit 1)
BITCOUNT user:clicks  # Trả về số lượng bit có giá trị 1

```
