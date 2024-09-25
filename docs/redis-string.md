# String redis

The list of commands about string redis and how to use them:

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
