# Redis ZSet (Sorted Set)

## 1. Cấu trúc dữ liệu ZSet

Redis ZSet là một tập hợp các phần tử, trong đó mỗi phần tử được kết hợp với một giá trị số thực gọi là "score". Không giống như Set thông thường, ZSet cho phép lưu trữ các phần tử theo thứ tự dựa trên score, với mỗi phần tử là duy nhất nhưng score thì không nhất thiết phải như vậy.

- **Các phần tử trong ZSet**: Tương tự như một `Set`, các phần tử phải là duy nhất.
- **Score**: Mỗi phần tử có một số thực `score` đi kèm, cho phép sắp xếp các phần tử trong ZSet theo thứ tự tăng dần của score.

### Ví dụ

```bash
ZADD myzset 1 "one" 2 "two" 3 "three"
# Trong ví dụ này, ta thêm các phần tử "one", "two", "three" vào ZSet với score tương ứng là 1, 2, và 3.

```

## 2. Các lệnh phổ biến

### 2.1 ZADD

- **Công dụng**: Thêm một hoặc nhiều phần tử vào ZSet với score tương ứng. Nếu phần tử đã tồn tại, score của nó sẽ được cập nhật.

- **Cú pháp**:

  ```bash
  ZADD key score1 member1 [score2 member2 ...]

  ```

  **Ví dụ**:

```bash
ZADD myzset 1 "one" 2 "two"

```

### 2.2 ZRANGE

- **Công dụng**: Lấy các phần tử theo thứ tự dựa trên score trong khoảng chỉ định.
- **Cú pháp**:

  ```bash
  ZRANGE key start stop [WITHSCORES]
  ```

  **Ví dụ**:

```bash
ZRANGE myzset 0 -1 WITHSCORES
```

### 2.3 ZREM

- **Công dụng**: Xóa một hoặc nhiều phần tử khỏi ZSet.
- **Cú pháp**:

  ```bash
  ZREM key member [member ...]

  ```

  **Ví dụ**:

```bash
ZREM myzset "one"

```

### 2.4 ZSCORE

- **Công dụng**: Trả về score của một phần tử cụ thể trong ZSet.
- **Cú pháp**:

  ```bash
  ZSCORE key member
  ```

  **Ví dụ**:

```bash
ZSCORE myzset "two"
```

### 2.5 ZCOUNT

- **Công dụng**: Đếm số phần tử trong ZSet có score nằm trong khoảng chỉ định.
- **Cú pháp**:

  ```bash
  ZCOUNT key min max

  ```

  **Ví dụ**:

```bash
ZCOUNT myzset 1 3
```

### 2.6 ZRANK

- **Công dụng**: Trả về vị trí của một phần tử dựa trên thứ tự score tăng dần (tính từ 0).
- **Cú pháp**:

  ```bash
  ZRANK key member


  ```

  **Ví dụ**:

```bash
ZRANK myzset "two"

```

### 2.7 ZRANK

- **Công dụng**: Trả về vị trí của một phần tử dựa trên thứ tự score tăng dần (tính từ 0).
- **Cú pháp**:

  ```bash
  ZRANK key member
  ```

  **Ví dụ**:

```bash
ZRANK myzset "two"

```

### 2.8 ZREVRANK

- **Công dụng**: Trả về vị trí của một phần tử dựa trên thứ tự score giảm dần.
- **Cú pháp**:

  ```bash
  ZREVRANK key member
  ```

  **Ví dụ**:

```bash
ZREVRANK myzset "two"
```

## 3. Khi nào nên sử dụng Redis ZSet?

- Redis ZSet là lựa chọn lý tưởng trong các trường hợp sau:

  - Xếp hạng (leaderboards): Bạn có thể sử dụng ZSet để duy trì bảng xếp hạng theo điểm (score) của người chơi.
  - Thời gian thực: Đối với các ứng dụng cần xếp hạng các sự kiện hoặc giao dịch theo thời gian.
  - Xử lý dữ liệu dựa trên khoảng giá trị: Ví dụ, chọn tất cả các giao dịch có số điểm trong một khoảng nhất định.

### Ví dụ khi dùng ZSet:

**Xây dựng bảng xếp hạng người chơi**

- Trong trò chơi trực tuyến, để duy trì bảng xếp hạng người chơi dựa trên điểm, bạn có thể sử dụng ZSet như sau:

```bash
ZADD leaderboard 150 "Alice" 200 "Bob" 180 "Charlie"
```

**Lấy top 3 người chơi:**

```bash
ZRANGE leaderboard 0 2 WITHSCORES
```

**Sử dụng ZSet để lưu trữ các sự kiện theo thời gian:**

```bash
ZADD events 1692285600 "Event1" 1692290000 "Event2"
```

**Lấy các sự kiện từ một khoảng thời gian cụ thể:**

```bash
ZRANGEBYSCORE events 1692280000 1692300000
```
