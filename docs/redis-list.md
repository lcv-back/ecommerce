# Redis List

## 1. Cấu trúc của kiểu dữ liệu List trong Redis

- **List** trong Redis là một danh sách các chuỗi được sắp xếp theo thứ tự chèn. Bạn có thể thêm các phần tử vào đầu (left) hoặc cuối (right) của danh sách.
- Redis Lists được dùng nhiều khi cần lưu trữ dữ liệu theo dạng hàng đợi (queue), ngăn xếp (stack), hoặc các chuỗi sự kiện.

**Ví dụ cấu trúc List**:

```bash
# Tạo một List lưu thông báo
LPUSH messages "Hello" "World"
```

---

## 2. Các lệnh phổ biến

### 2.1. `LPUSH`

- **Công dụng**: Thêm một hoặc nhiều phần tử vào đầu danh sách.
- **Cú pháp**:

  ```bash
  LPUSH key value1 value2 ...

  ```

  **Ví dụ**:

```bash
LPUSH messages "Hello" "World"

```

### 2.2. `RPUSH`

- **Công dụng**: Thêm một hoặc nhiều phần tử vào cuối danh sách.
- **Cú pháp**:

  ```bash
  RPUSH key value1 value2 ...


  ```

  **Ví dụ**:

```bash
RPUSH messages "Redis" "is awesome"
```

### 2.3. `LPOP`

- **Công dụng**: Lấy và loại bỏ phần tử đầu tiên của danh sách.
- **Cú pháp**:

  ```bash
  LPOP key

  ```

  **Ví dụ**:

```bash
LPOP messages  # Trả về "World"

```

### 2.4. `RPOP`

- **Công dụng**: Lấy và loại bỏ phần tử cuối cùng của danh sách.
- **Cú pháp**:

  ```bash
  RPOP key

  ```

  **Ví dụ**:

```bash
RPOP messages  # Trả về "is awesome"


```

### 2.5. `LRANGE`

- **Công dụng**: Lấy một dải phần tử từ danh sách.
- **Cú pháp**:

  ```bash
  LRANGE key start stop
  ```

  **Ví dụ**:

```bash
LRANGE messages 0 -1  # Lấy tất cả phần tử từ đầu đến cuối
```

### 2.6. `LLEN`

- **Công dụng**: Trả về độ dài của danh sách.

- **Cú pháp**:

  ```bash
  LLEN key

  ```

  **Ví dụ**:

```bash
LLEN messages  # Trả về 3 nếu danh sách có 3 phần tử

```

### 2.7. `LREM`

- **Công dụng**: Xóa các phần tử khớp với giá trị trong danh sách.

- **Cú pháp**:

  ```bash
  LREM key count value
  ```

  **Ví dụ**:

```bash
BLPOP messages 0  # Chặn vô thời hạn cho đến khi có phần tử
BLPOP messages 5  # Chặn trong tối đa 5 giây

```

### 2.8. `BLPOP`

- **Công dụng**: Lấy và loại bỏ phần tử đầu tiên từ danh sách, nếu danh sách trống sẽ chặn cho đến khi có phần tử mới hoặc hết thời gian chờ (timeout).

- **Cú pháp**:

  ```bash
  BLPOP key [key ...] timeout

  ```

  **Ví dụ**:

```bash
LREM messages 1 "Hello"  # Xóa 1 phần tử có giá trị "Hello"
```

### 2.9. `LINSERT`

- **Công dụng**: Chèn một phần tử vào danh sách trước hoặc sau một phần tử khác.
- **Cú pháp**:

  ```bash
  LINSERT key BEFORE|AFTER pivot value

  ```

  **Giải thích**:

  - BEFORE: Chèn phần tử mới trước pivot.
  - AFTER: Chèn phần tử mới sau pivot.

  **Ví dụ**:

```bash
LINSERT messages BEFORE "World" "Redis"
# Danh sách sau lệnh: ["Hello", "Redis", "World"]

```

## 3. Khi nào nên sử dụng Redis Lists?

- Redis Lists hữu ích khi bạn cần cấu trúc dữ liệu theo kiểu hàng đợi hoặc ngăn xếp, ví dụ như xử lý hàng đợi công việc, lưu trữ các sự kiện theo thời gian.
- **Ưu điểm của Lists**:
  - Dễ dàng thêm/xóa phần tử từ đầu hoặc cuối danh sách.
  - Tối ưu cho các hệ thống cần lưu trữ chuỗi sự kiện hoặc log.

### Ví dụ khi dùng Lists:

Giả sử bạn có một hệ thống xử lý hàng đợi công việc. Sử dụng Redis Lists để lưu trữ và xử lý các công việc theo thứ tự FIFO (first-in, first-out):

```bash
# Thêm công việc vào hàng đợi
RPUSH job_queue "Job 1" "Job 2"

# Lấy và xử lý công việc đầu tiên
LPOP job_queue  # Trả về "Job 1"


```
