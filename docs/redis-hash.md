# Redis Hashes

## 1. Cấu trúc của kiểu dữ liệu Hash trong Redis

- **Hash** trong Redis là một bộ sưu tập các cặp key-value, tương tự như một đối tượng (object) hoặc một từ điển (dictionary) trong các ngôn ngữ lập trình khác.
- Mỗi hash có một key riêng biệt và lưu trữ nhiều cặp field-value bên trong. Điều này giúp bạn có thể lưu trữ và truy cập nhiều giá trị liên quan đến một đối tượng dưới một key duy nhất.
- Redis Hash lý tưởng khi bạn cần lưu trữ một tập hợp nhỏ các trường (fields) với giá trị (values), ví dụ như thông tin của người dùng.

**Ví dụ cấu trúc Hash**:

```bash
# Tạo một Hash lưu thông tin người dùng
HMSET user:1000 name "John Doe" age 30 email "johndoe@example.com"
```

---

## 2. Các lệnh phổ biến

### 2.1. `HSET`

- **Công dụng**: Đặt một field (thuộc tính) và giá trị trong hash.
- **Cú pháp**:
  ```bash
  HSET key field value
  ```
  **Ví dụ**:

```bash
HSET user:1001 name "John Doe"
HSET user:1001 age 30
```

### 2.2. `HGET`

- **Công dụng**: Lấy giá trị của một field trong hash.

- **Cú pháp**:

  ```bash
  HGET key field

  ```

  **Ví dụ**:

```bash
HGET user:1001 name  # Trả về "John Doe"

```

### 2.3. `HGETALL`

- **Công dụng**: Lấy tất cả các field và giá trị của hash.

- **Cú pháp**:

  ```bash
  HGETALL key

  ```

  **Ví dụ**:

```bash
HGETALL user:1001
# Trả về:
# 1) "name"
# 2) "John Doe"
# 3) "age"
# 4) "30"
```

### 2.4. `HMSET`

- **Công dụng**: Đặt nhiều field và giá trị trong hash.

- **Cú pháp**:

  ```bash
  HMSET key field1 value1 field2 value2 ...
  ```

  **Ví dụ**:

```bash
HMSET user:1001 name "John Doe" age 30 email "john.doe@example.com"

```

### 2.5. `HMGET`

- **Công dụng**: Lấy giá trị của nhiều field trong hash.

- **Cú pháp**:

  ```bash
  HMGET key field1 field2 ...


  ```

  **Ví dụ**:

```bash
HMGET user:1001 name email
# Trả về:
# 1) "John Doe"
# 2) "john.doe@example.com"
```

### 2.6. `HDEL`

- **Công dụng**: Xóa một hoặc nhiều field khỏi hash.

- **Cú pháp**:

  ```bash
  HDEL key field1 field2 ...
  ```

  **Ví dụ**:

```bash
HDEL user:1001 age

```

### 2.7. `HLEN`

- **Công dụng**: Trả về số lượng field trong hash.

- **Cú pháp**:

  ```bash
  HLEN key
  ```

  **Ví dụ**:

```bash
HLEN user:1001  # Trả về 3 nếu hash có 3 field
```

### 2.8. `HEXISTS`

- **Công dụng**: Kiểm tra xem field có tồn tại trong hash hay không.

- **Cú pháp**:

  ```bash
  HEXISTS key field

  ```

  **Ví dụ**:

```bash
HLEN user:1001  # Trả về 3 nếu hash có 3 field
```

### 2.9. `HINCRBY`

- **Công dụng**: Tăng giá trị số nguyên của field trong hash lên một số xác định.

- **Cú pháp**:

  ```bash
  HINCRBY key field increment
  ```

  **Ví dụ**:

```bash
HINCRBY user:1001 age 1  # Tăng giá trị "age" lên 1

```

## 3. Khi nào nên sử dụng Redis Hashes?

- Redis Hashes được sử dụng khi bạn cần lưu trữ và thao tác trên các đối tượng có nhiều thuộc tính liên quan, như lưu thông tin người dùng, sản phẩm, hoặc cấu hình.
- **Ưu điểm của Hashes**:
  - Giảm thiểu việc sử dụng bộ nhớ: Thay vì tạo nhiều key cho mỗi thuộc tính, bạn có thể gom tất cả vào một hash duy nhất.
  - Dễ dàng thao tác các thuộc tính cụ thể mà không cần tải toàn bộ đối tượng.
  - Tối ưu hóa tốc độ truy vấn và cập nhật.

### Ví dụ khi dùng Hashes:

Giả sử bạn có một ứng dụng quản lý người dùng, cần lưu thông tin như tên, tuổi, và email. Sử dụng Hashes để lưu trữ và cập nhật các thuộc tính này một cách độc lập:

```bash
# Tạo hash lưu trữ thông tin người dùng
HSET user:1001 name "John Doe"
HSET user:1001 age 30
HSET user:1001 email "john.doe@example.com"

# Lấy tên người dùng
HGET user:1001 name  # Trả về "John Doe"

# Cập nhật tuổi người dùng
HINCRBY user:1001 age 1  # Tăng tuổi lên 1

# Xóa email người dùng
HDEL user:1001 email

```
