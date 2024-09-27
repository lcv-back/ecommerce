# Redis Sets

## 1. Giới thiệu về Redis Sets

Redis Sets là một kiểu dữ liệu lưu trữ các tập hợp các phần tử duy nhất (unique elements), không cho phép trùng lặp. Redis Sets hỗ trợ một số thao tác toán học như tập hợp (union), giao (intersection), và hiệu (difference) giữa các tập.

### Tính chất của Redis Sets:

- Các phần tử trong Set là duy nhất (không trùng lặp).
- Redis Sets có thể chứa tối đa 4.29 tỷ phần tử.
- Các phần tử không được sắp xếp theo thứ tự.

## 2. Các lệnh phổ biến

### 2.1 Thêm phần tử vào Set

```bash
SADD <tên_set> <phần_tử> [phần_tử...]
```

**Ví dụ cấu trúc Sets**:

```bash
SADD myset "apple" "banana" "orange"
```

### 2.2 Kiểm tra phần tử có trong Set

- **Công dụng**: Kiểm tra xem phần tử có nằm trong Set hay không. Trả về 1 nếu có, 0 nếu không.

- **Cú pháp**:

  ```bash
  SISMEMBER <tên_set> <phần_tử>
  ```

  **Ví dụ**:

```bash
SISMEMBER myset "apple"  # Trả về 1
SISMEMBER myset "grape"  # Trả về 0
```

### 2.3 Lấy tất cả phần tử trong Set

- **Công dụng**: Trả về tất cả các phần tử trong Set.

- **Cú pháp**:

  ```bash
  SMEMBERS <tên_set>
  ```

  **Ví dụ**:

```bash
SMEMBERS myset
```

### 2.4 Xóa phần tử khỏi Set

- **Công dụng**: Xóa một hoặc nhiều phần tử khỏi Set.

- **Cú pháp**:

  ```bash
  SREM <tên_set> <phần_tử> [phần_tử...]
  ```

  **Ví dụ**:

```bash
SREM myset "apple" "banana"
```

### 2.5 Lấy phần tử ngẫu nhiên từ Set

- **Công dụng**: Trả về một hoặc nhiều phần tử ngẫu nhiên từ Set mà không xóa chúng khỏi Set.

- **Cú pháp**:
  ```bash
  SRANDMEMBER <tên_set> [số_lượng]
  ```
  **Ví dụ**:

```bash
SRANDMEMBER myset 2
```

### 2.6 Lấy và xóa phần tử ngẫu nhiên từ Set

- **Công dụng**: Trả về một hoặc nhiều phần tử ngẫu nhiên từ Set và xóa chúng khỏi Set.

- **Cú pháp**:
  ```bash
  SRANDMEMBER <tên_set> [số_lượng]
  ```
  **Ví dụ**:

```bash
SPOP myset 1
```

### 2.7 Số lượng phần tử trong Set

- **Công dụng**: Trả về số lượng phần tử trong Set.

- **Cú pháp**:

  ```bash
  SCARD <tên_set>
  ```

  **Ví dụ**:

```bash
SCARD myset
```

### 2.8 Giao giữa các Sets

- **Công dụng**: Trả về tập giao của các Sets (các phần tử tồn tại trong tất cả các Set).

- **Cú pháp**:

  ```bash
  SINTER <set1> <set2> [set...]

  ```

  **Ví dụ**:

```bash
SINTER set1 set2

```

### 2.9 Hợp giữa các Sets

- **Công dụng**: Trả về tập hợp của tất cả các phần tử trong các Sets.
- **Cú pháp**:

  ```bash
  SUNION <set1> <set2> [set...]

  ```

  **Ví dụ**:

```bash
SUNION set1 set2
```

### 2.10 Hiệu giữa các Sets

- **Công dụng**: Trả về phần tử thuộc set1 mà không thuộc các Sets khác.
- **Cú pháp**:

  ```bash
  SDIFF <set1> <set2> [set...]
  ```

  **Ví dụ**:

```bash
SDIFF set1 set2

```

## 3. Khi nào nên sử dụng Redis Sets?

- Redis Sets thường được sử dụng trong các tình huống cần quản lý các tập hợp phần tử không trùng lặp, chẳng hạn như:

  - Theo dõi các ID duy nhất: Ví dụ, bạn có thể sử dụng Redis Sets để theo dõi các user ID hoặc session ID đã đăng nhập vào hệ thống.
  - Theo dõi các mục đã truy cập: Khi cần đảm bảo rằng một mục chỉ được xử lý một lần duy nhất, bạn có thể thêm vào Set và kiểm tra sự tồn tại.
  - Các phép toán trên tập hợp: Khi bạn cần tính toán sự giao thoa, hợp hoặc hiệu của các tập hợp dữ liệu.

### Ví dụ khi dùng Sets:

- Theo dõi các user đã like một bài post:

```bash
SADD post:1:likes user:1 user:2
```

- Kiểm tra xem user đã like bài post chưa:

```bash
SISMEMBER post:1:likes user:1
```
