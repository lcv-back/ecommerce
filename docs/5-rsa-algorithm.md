# Thuật toán RSA (Rivest–Shamir–Adleman)

Thuật toán RSA (Rivest–Shamir–Adleman) là một trong những hệ thống mã hóa bất đối xứng phổ biến nhất, được sử dụng rộng rãi trong các ứng dụng bảo mật, như giao thức HTTPS, chữ ký số, và bảo vệ dữ liệu nhạy cảm. Dưới đây là giải thích chi tiết về thuật toán này:

## 1. Nguyên lý cơ bản

RSA dựa trên nguyên lý toán học của việc phân tích thừa số nguyên tố. Cụ thể, việc nhân hai số nguyên tố lớn thì dễ, nhưng việc phân tích một số lớn thành các thừa số nguyên tố của nó lại rất khó, ngay cả với các máy tính mạnh.

## 2. Các bước thực hiện thuật toán RSA

## 2.1 Khởi tạo khóa

1. Chọn hai số nguyên tố lớn: Gọi là p và q.

2. Tính mô-đun:

3. Tính hàm phi Euler:

4. Chọn số mũ công khai : sao cho ( và là các số nguyên tốc).

5. Tính khóa bí mật : ( là nghịch đảo module của trên mod ).

**Kết quả:**

- **Khóa công khai**: Được sử dụng để mã hóa dữ liệu. Bất kỳ ai cũng có thể truy cập khóa này.

- **Khóa bí mật**: Chỉ người nhận giữ để giải mã dữ liệu đã mã hóa. Khóa này phải được bảo vệ tuyệt đối.

## 2.2 Mã hóa

- Quá trình mã hóa sử dụng khóa công khai để chuyển đổi thông điệp thành dạng mã hóa không thể đọc được trừ khi có khóa bí mật.

- Biến đổi thông điệp thành số nguyên: Chuyển đổi thông điệp (plaintext) thành một số nguyên sao cho . Điều này thường được thực hiện bằng cách sử dụng các bảng mã hóa (như ASCII) hoặc các thuật toán chuyển đổi khác.

- Tính toán mã hóa: Sử dụng khóa công khai , bản mã được tính bằng công thức:

### Trong đó:

- :Thông điệp ban đầu (đã chuyển đổi).

- :Bản mã (ciphertext).

- :Số mũ công khai.

- :Mô-đun.

### **Lưu ý:**

- Quá trình này đảm bảo rằng bản mã không thể được giải mã nếu không có khóa bí mật .
