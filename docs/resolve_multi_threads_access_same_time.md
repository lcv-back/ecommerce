# Acquire Lock

1>
Trong lập trình đa luồng hoặc các hệ thống phân tán, các thuật toán acquire lock (giành quyền khóa), release lock (giải phóng khóa), và optimistic locks (khóa lạc quan) được sử dụng để đảm bảo tính nhất quán của dữ liệu khi nhiều tiến trình hoặc luồng truy cập vào cùng một tài nguyên chia sẻ.

2> Acquire Lock (Giành quyền khóa)

- Mục đích: Đảm bảo rằng chỉ một luồng (hoặc tiến trình) có quyền truy cập vào một tài nguyên chia sẻ tại một thời điểm.
- Cách hoạt động: Khi một luồng muốn truy cập tài nguyên, nó sẽ cố gắng acquire lock. Nếu tài nguyên đang bị khóa bởi luồng khác, luồng này sẽ phải đợi cho đến khi khóa được giải phóng.
- Ví dụ: Nếu một luồng đang ghi dữ liệu vào một file, luồng khác sẽ không thể đọc hoặc ghi vào file đó cho đến khi luồng đầu tiên hoàn thành và giải phóng khóa.

3> Release Lock (Giải phóng khóa)

- Mục đích: Sau khi luồng hoàn thành công việc với tài nguyên, nó sẽ giải phóng khóa để các luồng khác có thể giành quyền truy cập vào tài nguyên đó.
- Cách hoạt động: Khi một luồng hoàn thành xử lý tài nguyên, nó gọi lệnh release lock để giải phóng khóa. Các luồng khác sau đó có thể acquire lock để truy cập tài nguyên.
- Ví dụ: Sau khi một luồng ghi xong vào cơ sở dữ liệu, nó sẽ gọi hàm release lock để luồng khác có thể tiếp tục ghi dữ liệu.

4> Optimistic Locks (Khóa lạc quan)

- Mục đích: Khóa lạc quan là một kỹ thuật khác với khóa truyền thống (khóa bi quan). Nó giả định rằng các xung đột sẽ không thường xuyên xảy ra, vì vậy không cần phải khóa tài nguyên khi bắt đầu thao tác.
- Cách hoạt động: Trong quá trình sử dụng optimistic lock, thay vì khóa tài nguyên ngay lập tức, luồng sẽ:
  - Đọc phiên bản hiện tại của tài nguyên.
  - Thực hiện các thao tác cần thiết.
  - Khi hoàn tất, nó kiểm tra xem tài nguyên có bị thay đổi bởi một luồng khác hay không (dựa trên phiên bản đã đọc). Nếu không có thay đổi, thao tác thành công. Nếu có thay đổi, thao tác thất bại và phải thử lại.
- Ưu điểm: Không cần khóa tài nguyên trong suốt quá trình thực hiện thao tác, giúp tăng hiệu suất trong các trường hợp xung đột ít xảy ra.
- Ví dụ: Trong một hệ thống cơ sở dữ liệu, một luồng có thể cập nhật một hàng dữ liệu mà không cần khóa ngay từ đầu. Khi cập nhật xong, nó kiểm tra xem dữ liệu có bị luồng khác thay đổi trong quá trình cập nhật hay không.

5> So sánh

- Acquire lock/release lock thường được sử dụng khi cần đảm bảo hoàn toàn không có xung đột, nhưng có thể gây ra hiện tượng deadlock (khi hai luồng chờ nhau giải phóng tài nguyên).
- Optimistic locks thường được dùng trong các hệ thống nơi xung đột hiếm khi xảy ra, giúp tăng hiệu suất bằng cách tránh việc khóa tài nguyên không cần thiết.
