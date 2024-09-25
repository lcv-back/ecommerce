Thuật toán Flag Map (còn gọi là Flag Map hoặc Flag Array) là một phương pháp dùng để sắp xếp hoặc phân loại các phần tử theo nhóm, dựa trên một tiêu chí cụ thể. Nó đặc biệt hữu ích khi bạn muốn sắp xếp dữ liệu thành các nhóm rời rạc và đã biết trước số nhóm cần sắp xếp. Một ví dụ kinh điển của thuật toán này là Dutch National Flag Problem của Dijkstra, nơi các phần tử được chia thành ba nhóm.

Ý tưởng chính:
Thuật toán Flag Map chủ yếu chia dữ liệu thành các nhóm dựa trên các giá trị đặc trưng (hoặc flags), và sau đó sắp xếp lại dữ liệu dựa trên nhóm của nó. Các bước tổng quát thường bao gồm:

Chọn nhóm hoặc flag: Các phần tử sẽ được chia thành các nhóm dựa trên một tiêu chí nào đó.
Quét qua mảng dữ liệu: Mỗi phần tử được kiểm tra và đưa vào đúng nhóm dựa trên flag của nó.
Sắp xếp các nhóm: Các phần tử sau khi được gán vào các nhóm sẽ được sắp xếp lại theo thứ tự mong muốn.

Ví dụ: Dutch National Flag Problem
Bài toán này yêu cầu sắp xếp một mảng chỉ chứa ba loại phần tử, ví dụ như [0, 1, 2], thành ba nhóm: nhóm 0, nhóm 1, và nhóm 2.
Mã giả (pseudocode):
Bắt đầu với ba con trỏ: low, mid, và high
Trong khi mid <= high: - Nếu nums[mid] == 0, hoán đổi nums[low] với nums[mid], tăng low và mid - Nếu nums[mid] == 1, giữ nguyên mid và tăng mid - Nếu nums[mid] == 2, hoán đổi nums[mid] với nums[high], giảm high

Giải thích:
low là con trỏ để giữ vị trí cuối cùng của các số 0.
high là con trỏ để giữ vị trí đầu tiên của các số 2.
mid sẽ kiểm tra từng phần tử trong mảng và phân loại chúng vào nhóm 0, 1, hoặc 2.
Ví dụ cụ thể:
Giả sử mảng đầu vào là [2, 0, 2, 1, 1, 0].

Ban đầu, low = 0, mid = 0, high = 5.
Lần quét đầu tiên: nums[mid] == 2, hoán đổi với nums[high], mảng trở thành [0, 0, 2, 1, 1, 2], giảm high.
Tiếp tục cho đến khi mảng được sắp xếp thành [0, 0, 1, 1, 2, 2].
Ứng dụng:
Thuật toán Flag Map thường được sử dụng trong các bài toán sắp xếp nhanh chóng theo nhóm hoặc trong các bài toán phân loại nhiều giai đoạn.
Nó cũng có thể được áp dụng trong các bài toán liên quan đến phân tích dữ liệu, nơi các giá trị cần được phân chia thành các cụm rõ ràng.
