# Wanderly — Weather & Travel Planner

Wanderly là ứng dụng web tĩnh mô phỏng tra cứu thời tiết và lập lịch trình du lịch. Giao diện được chia thành hai cột: thời tiết ở bên trái, lịch trình ở bên phải. Dữ liệu thời tiết là mock data; ứng dụng không gọi API thời tiết bên ngoài.

## Chạy ứng dụng

Mở `index.html` trực tiếp bằng trình duyệt hiện đại, hoặc nhấn **F5** trong VS Code và chọn cấu hình **Launch Wanderly**. Cấu hình debug tự khởi động máy chủ tĩnh Python tại `http://127.0.0.1:8080` thông qua task trong `.vscode/tasks.json`. Không cần cài thư viện; nếu mở bằng Live Server thì dùng nút **Go Live** thay vì truy cập một cổng khi máy chủ chưa chạy. CSS và JavaScript được nạp từ `styles.css` và `app.js`.

## Toàn bộ prompt theo từng bước

### Bước 1 — Layout hiện đại (Glassmorphism)

> Hãy đóng vai chuyên gia UI/UX. Viết HTML5 và CSS3 để tạo một trang web 'Weather Planner'. Layout gồm 2 cột chính (sử dụng Flexbox hoặc Grid). Cột trái hiển thị thông tin thời tiết (Nhiệt độ, Độ ẩm, Tình trạng: Nắng/Mưa). Cột phải là một danh sách các địa điểm du lịch sẽ đi. Phong cách thiết kế: Glassmorphism (nền mờ, bo góc lớn, đổ bóng nhẹ, dùng ảnh nền thiên nhiên).

### Bước 2 — Xử lý logic thời tiết (Array & Object)

> Viết mã JavaScript để thực hiện:
>
> 1. Tạo một mảng các đối tượng chứa thông tin thời tiết của 3 thành phố: Biên Hòa, Đà Lạt, Vũng Tàu (gồm nhiệt độ và tình trạng).
> 2. Thêm một ô `<select>` chứa tên 3 thành phố này.
> 3. Khi người dùng chọn một thành phố, thông tin thời tiết ở cột bên trái phải được cập nhật tương ứng mà không cần tải lại trang.

### Bước 3 — Quản lý lịch trình (Interactive List)

> Bổ sung JavaScript cho cột bên phải:
>
> Cho phép người dùng nhập 'Tên địa điểm' và 'Thời gian' (ví dụ: Ghé thăm Thác Giang Điền - 9:00 AM).
>
> Khi nhấn 'Thêm', thông tin này sẽ hiện vào danh sách lịch trình.
>
> Mỗi địa điểm có một nút 'Đã đến' (để đổi màu) và nút 'Xóa'.
>
> Thêm hiệu ứng CSS Transition khi một mục mới được thêm vào danh sách.

### Bước 4 — Tối ưu hóa & lưu trữ (Persistence)

> Hãy nâng cấp mã JavaScript để:
>
> Lưu danh sách lịch trình du lịch vào LocalStorage.
>
> Khi mở lại trình duyệt, hãy tự động hiển thị lại thành phố đã chọn cuối cùng và danh sách lịch trình đã lưu.
>
> Viết code theo hướng Module hóa (chia nhỏ các hàm: saveStorage, loadStorage, renderUI).

### Bước 5 — Phần yêu cầu mở rộng

> **Gợi ý trang phục theo thời tiết (Smart Suggestion)**  
> Yêu cầu: Dựa vào nhiệt độ của thành phố được chọn, JavaScript sẽ hiển thị một dòng gợi ý.  
> Ví dụ: Nếu `< 20°C` -> "Nên mang theo áo khoác dày". Nếu `> 30°C` -> "Nên mang theo kem chống nắng và mũ".
>
> **Xuất dữ liệu ra file Text (Export Data)**  
> Yêu cầu: Thêm một nút "Xuất lịch trình". Khi nhấn vào, trình duyệt sẽ tự động tải xuống một file `.txt` chứa toàn bộ danh sách lịch trình đã lên.  
> Gợi ý: Yêu cầu AI sử dụng `Blob` và `URL.createObjectURL`.
>
> **Đếm ngược chuyến đi (Countdown Timer)**  
> Yêu cầu: Cho phép chọn một ngày khởi hành. Sử dụng `setInterval` để hiển thị đồng hồ đếm ngược: "Còn ... ngày ... giờ ... phút nữa là đến ngày đi".

## Giải thích mã nguồn theo từng dòng

Phần dưới đây lần lượt giải thích các dòng có chức năng trong ba tệp. Những dòng trống chỉ phân tách khối để dễ đọc. Các dòng HTML dài chứa thẻ SVG được giải thích theo từng hình/nhóm thuộc tính, còn các dòng CSS một dòng được giải thích theo từng selector và các thuộc tính khai báo trên dòng đó.

### `index.html` — cấu trúc trang

| Dòng | Giải thích |
|---|---|
| 1–2 | Khai báo tài liệu HTML5 và đặt ngôn ngữ trang là tiếng Việt (`vi`) để trình duyệt và công cụ trợ năng đọc đúng ngôn ngữ. |
| 3–10 | Mở phần metadata: UTF-8 hỗ trợ tiếng Việt; viewport cho giao diện co theo thiết bị; màu theme cho trình duyệt; description phục vụ mô tả trang khi chia sẻ/tìm kiếm. |
| 11 | Đặt tiêu đề tab trình duyệt. |
| 12–13 | Kết nối sớm đến Google Fonts và miền font để giảm thời gian tải font. |
| 14–17 | Tải font DM Sans và Manrope với các độ đậm được dùng trong thiết kế. |
| 18 | Nạp stylesheet riêng của ứng dụng. |
| 19 | Nạp `app.js`; thuộc tính `defer` cho phép HTML phân tích xong trước khi JavaScript truy cập phần tử. |
| 20–22 | Đóng `head`, mở `body`, tạo vỏ trang `.page-shell` để giới hạn chiều rộng và căn giữa nội dung. |
| 23–33 | Header thương hiệu: liên kết logo Wanderly; SVG tự vẽ biểu tượng núi/mặt trời; `aria-hidden` loại hình trang trí khỏi trình đọc màn hình. |
| 35–38 | Thanh điều hướng; các liên kết nhảy đến khu vực thời tiết và lịch trình bằng ID trong trang. |
| 40–46 | Nút hồ sơ minh họa gồm avatar chữ MA, tên và biểu tượng mở rộng; `aria-label` cung cấp tên dễ hiểu cho trợ năng. |
| 47–49 | Đóng header và bắt đầu vùng nội dung chính `<main>`. |
| 50–55 | Khối chào mừng: `aria-labelledby` nối section với tiêu đề; hiển thị ngày minh họa, tiêu đề và lời giới thiệu. |
| 56–64 | Form tìm thành phố. SVG kính lúp mang tính trang trí; label ẩn vẫn cung cấp tên cho ô nhập; `type="search"` và `autocomplete="off"` điều chỉnh hành vi nhập; nút `submit` kích hoạt tìm kiếm. |
| 67 | Mở CSS grid bao quanh hai cột dashboard. |
| 68–73 | Mở cột thời tiết, gắn ID neo và tiêu đề trợ năng; nhãn phụ và tiêu đề phân cấp rõ ràng. |
| 74–80 | Nhóm điều khiển thời tiết và dropdown chọn thành phố. Mỗi `<option>` có ID thành phố làm `value`; Đà Lạt được chọn ban đầu. |
| 81–86 | Nút đổi đơn vị nhiệt độ. `type="button"` tránh submit form; `unit-label` là vị trí JavaScript đổi °C/°F; SVG là biểu tượng chuyển đổi. |
| 90–93 | Thẻ thời tiết gồm lớp ảnh nền, lớp phủ tăng tương phản và vùng nội dung nằm phía trên ảnh. |
| 94–102 | Khu vực địa điểm: biểu tượng ghim SVG và `#city-name`, nơi JavaScript điền tên thành phố. |
| 103–109 | Hàng thời tiết chính: `#weather-condition`, phần mô tả, nhiệt độ `#temperature` và dấu độ. Các giá trị trong HTML là fallback ban đầu trước khi JavaScript render. |
| 110–131 | Vạch phân cách và ba thông số. `#humidity`, `#wind`, `#uv` là các đích được JavaScript cập nhật; các SVG giọt nước, gió và mặt trời minh họa từng thông số. |
| 132–133 | `#photo-credit` hiển thị nhãn vùng của thành phố, được cập nhật cùng dữ liệu thời tiết. |
| 135–144 | Khung dự báo 5 ngày: tiêu đề và vùng rỗng `#forecast-list`, nơi JavaScript dựng các ngày dự báo từ mock data. |
| 146–153 | Thẻ gợi ý trang phục. `#clothing-suggestion` và `#suggestion-icon` được JavaScript thay đổi theo nhiệt độ. |
| 156–170 | Mở cột lịch trình, cung cấp tiêu đề và một nút ngày minh họa. Ngày khởi hành có chức năng thực tế là trường `#departure-date` ở phần tổng quan chuyến đi phía dưới. |
| 172–185 | Thẻ chuyến đi: tên chuyến minh họa; trường ngày khởi hành loại date; `#countdown-text` là vùng thông báo bộ đếm; hình lều chỉ mang tính trang trí. |
| 187–194 | Thanh tổng kết lịch trình: bộ đếm điểm dừng và điểm đã khám phá, cùng progressbar có giá trị ban đầu bằng 0. |
| 196 | Tạo vùng `#timeline` rỗng. Các mục hành trình được dựng từ dữ liệu JavaScript thay vì viết cứng trong HTML. |
| 198–201 | Nút `#export-itinerary` kích hoạt tải lịch trình dạng văn bản; SVG biểu diễn tải/xuất. |
| 202–205 | Nút `#add-stop` mở hộp thoại thêm địa điểm. |
| 208–212 | Thẻ ghi chú phụ và nút trang trí; không làm thay đổi dữ liệu lịch trình. |
| 213–217 | Đóng cột, grid, main; footer chứa bản quyền và thông điệp thương hiệu. |
| 219–233 | Hộp thoại `<dialog>` và form thêm điểm dừng. Các trường tên, giờ, thời lượng có `required`; tên giới hạn 60 ký tự; các label được nối với input qua `for`/`id`. |
| 234 | Vùng toast thông báo có `role="status"` và `aria-live="polite"` để trình đọc màn hình thông báo thay đổi mà không gián đoạn. |
| 235–236 | Đóng body và tài liệu HTML. |

### `styles.css` — giao diện và responsive

| Dòng | Giải thích |
|---|---|
| 1–13 | `:root` đặt font, màu nền/chữ mặc định và các custom property dùng chung; các biến màu giúp thống nhất palette. |
| 15 | `box-sizing: border-box` khiến kích thước phần tử bao gồm padding và border, giúp tính layout dễ dự đoán. |
| 16–22 | Thiết lập nền trang, bỏ lề mặc định, giới hạn chiều rộng tối thiểu và thêm gradient mềm. |
| 23–25 | Đồng bộ font cho nút/input/select; nút dùng màu chữ kế thừa; liên kết bỏ gạch chân mặc định. |
| 26–34 | Header flex căn hai đầu, định chiều cao, căn giữa theo trục dọc và kẻ đường phân cách nhẹ. |
| 35–40 | Tạo logo, icon, chấm nhấn, menu ngang và trạng thái menu đang chọn. Pseudo-element `::after` vẽ gạch chân active; avatar có gradient/viền/bóng và chevron là SVG stroke. |
| 42–50 | Phần chào mừng và nhãn ngày: canh nội dung, cỡ chữ, màu, khoảng cách và chấm trang trí. |
| 51–60 | Reset margin heading/paragraph; định dạng tiêu đề/lời chào và form tìm kiếm. Form dùng flex, nền bán trong suốt, viền, bóng; icon/input/nút có màu và kích thước riêng; dòng 60 là hover nút. |
| 62–68 | Grid dashboard hai cột và style cho tiêu đề section, nhóm điều khiển thành phố/nút đổi đơn vị; select tự tạo mũi tên bằng SVG data URI. |
| 71–90 | Thẻ thời tiết: bo góc, cắt ảnh tràn, đặt ngữ cảnh xếp lớp; ảnh Unsplash làm nền; gradient phủ ảnh giúp chữ trắng dễ đọc; các dòng sau bố trí vị trí, nhiệt độ và thông số. |
| 93–104 | Khung dự báo nền trắng mờ, viền, bo góc, bóng; các ngày chia 5 cột, có icon và cặp nhiệt độ cao/thấp; ngày hiện tại có màu nhấn. |
| 106–110 | Thẻ gợi ý trang phục dùng gradient nhẹ, icon và văn bản; ký hiệu thời tiết đặt trang trí ở mép phải. |
| 112–134 | Style tiêu đề lịch trình, nút ngày và thẻ tổng quan chuyến đi; nền gradient/vòng tròn trang trí; trường ngày đi và countdown; các dòng cuối tạo thanh tiến độ có transition. |
| 136–145 | Timeline dạng grid; đường dọc nối các điểm, marker đổi kiểu khi hoàn thành và animation cho điểm dừng mới. |
| 146–159 | Style thẻ địa điểm, thời gian, icon, mô tả, badge thời tiết, metadata và nút “Đã đến”/“Xóa”; hover và trạng thái hoàn tất đổi màu/viền. |
| 160–178 | Nút xuất lịch trình với icon SVG và trạng thái hover; nút thêm địa điểm dùng viền nét đứt, đổi nền/viền khi hover. |
| 181–188 | Ghi chú cuối trang, icon, footer và màu phụ cho nội dung ít quan trọng hơn. |
| 189–200 | `.visually-hidden` giữ label cho trợ năng; style hộp thoại, backdrop, form, input/select và nút submit. |
| 201–202 | Toast cố định ở đáy màn hình, mặc định mờ/dịch xuống; class `.visible` làm toast hiện bằng transition. |
| 204–214 | Breakpoint màn hình lớn và trung bình thu lề, khoảng cách cột, icon và nội dung thẻ để phù hợp vùng hẹp hơn. |
| 215–231 | Breakpoint tablet/mobile xếp dashboard thành một cột, xếp khu chào mừng theo chiều dọc và giản lược phần hồ sơ. |
| 232–251 | Breakpoint điện thoại nhỏ giảm lề, font/icon và đảm bảo metadata có thể xuống dòng. |
| 252–254 | Media query `prefers-reduced-motion` giảm animation/transition cho người dùng chọn hạn chế chuyển động. |

### `app.js` — dữ liệu và hành vi

#### Dữ liệu, trạng thái và hiển thị thời tiết

| Dòng | Giải thích |
|---|---|
| 1–9 | `weatherData` là mảng object mock data. Mỗi thành phố có ID ổn định, tên/vùng, nhiệt độ Celsius, tình trạng, độ ẩm, gió, UV, mô tả và mảng dự báo 5 ngày. |
| 11–12 | Tìm object Đà Lạt để dùng làm dữ liệu mặc định và khai báo khóa duy nhất trong LocalStorage. |
| 13–18 | `getLocalDateString` định dạng ngày theo giờ địa phương thành `YYYY-MM-DD`; tránh lệch ngày do chuyển múi giờ khi dùng `toISOString()`. |
| 19–20 | Tạo ngày khởi hành mặc định bằng ngày hiện tại cộng 7 ngày. |
| 21–26 | `defaultItinerary` là bốn điểm dừng mẫu; mỗi object chứa ID, tên, giờ, thời lượng, mô tả, emoji, giá và trạng thái đã đến. |
| 27–32 | Khởi tạo trạng thái đơn vị nhiệt độ, timers, thành phố, bản sao danh sách mặc định và ngày khởi hành. |
| 34 | `toDisplayTemp` đổi Celsius sang Fahrenheit khi bật chế độ F; dữ liệu gốc vẫn giữ Celsius. |
| 36–45 | `renderForecast` chuyển từng bộ dự báo thành HTML, đổi nhiệt độ theo đơn vị hiện tại và thay nội dung vùng forecast. |
| 47–65 | `updateWeather` cập nhật các node DOM từ object thành phố, đồng bộ select/credit và tạo gợi ý trang phục theo ngưỡng nhiệt độ. |
| 67–73 | `showToast` đặt nội dung thông báo, hiện toast và xóa timer cũ trước khi hẹn ẩn toast sau 2,6 giây. |

#### Đọc, kiểm tra và lưu LocalStorage

| Dòng | Giải thích |
|---|---|
| 75–86 | `isValidStop` xác nhận cấu trúc một điểm dừng trước khi dùng dữ liệu LocalStorage: kiểu dữ liệu, định dạng giờ và trạng thái boolean. |
| 88–95 | `isValidDateString` kiểm tra ngày đúng mẫu ISO và xác nhận ngày thực tồn tại, loại ngày như 31/02. |
| 97–128 | `loadStorage` đọc dữ liệu trong khối `try/catch`; kiểm tra JSON, phiên bản, itinerary, ID không trùng và ngày. Lỗi bị log/thông báo; nếu không có dữ liệu thì trả `null`. |
| 130–144 | `saveStorage` tuần tự hóa phiên bản, city ID, ngày đi và itinerary; trả `true` khi thành công. Nếu lưu lỗi (ví dụ quota), log, hiện thông báo và trả `false`. |

#### Dựng lịch trình và countdown

| Dòng | Giải thích |
|---|---|
| 146–152 | `renderStop` nhận một điểm dừng cùng cờ điểm cuối/có animation; tính buổi sáng/chiều, lấy nhiệt độ thành phố, tạo node và gắn ID dữ liệu. |
| 153–163 | Tạo nội dung một điểm dừng: marker, tên/mô tả đã escape HTML, nhiệt độ, thời lượng, giá và hai nút thao tác. |
| 165–169 | Nếu mục mới cần animation, gỡ class sau khi animation kết thúc; trả node đã tạo. |
| 171–183 | `renderUI` chọn thành phố hợp lệ, render thời tiết/ngày/countdown, dựng lại toàn bộ timeline từ mảng và đồng bộ tiến độ. |
| 185–206 | `updateCountdown` phân tích ngày đi, xử lý ngày đã qua/hôm nay/tương lai, tính phút còn lại rồi tách thành ngày, giờ, phút; dòng 385 gọi lại hàm mỗi phút. |

#### Xuất dữ liệu

| Dòng | Giải thích |
|---|---|
| 208–215 | `exportItinerary` lấy thành phố/ngày khởi hành và định dạng ngày bằng locale tiếng Việt. |
| 216–223 | Chuyển từng điểm dừng thành văn bản gồm tên, giờ, thời lượng, trạng thái, chi phí; xử lý trường hợp lịch trình rỗng. |
| 224–231 | Ghép tiêu đề, thành phố, ngày đi, số điểm dừng và danh sách thành nội dung file. |
| 232–242 | Tạo Blob UTF-8 có BOM để các chương trình Windows nhận đúng tiếng Việt; tạo object URL và liên kết tải; click để tải tệp, dọn liên kết/URL và báo thành công. |
| 243–247 | Nếu trình duyệt không tạo được file, ghi lỗi và hiển thị thông báo thất bại. |

#### Sự kiện giao diện

| Dòng | Giải thích |
|---|---|
| 249–267 | Listener submit tìm kiếm: ngăn tải lại trang, chuẩn hóa tên thành phố, xử lý input rỗng/không tồn tại, cập nhật UI và lưu thành phố đã chọn. |
| 269–276 | Listener `change` trên select: tìm object theo ID, cập nhật UI và lưu. |
| 278–290 | Listener ngày khởi hành kiểm tra ngày hợp lệ, cập nhật countdown và lưu ngày mới; dòng 290 nối nút xuất với `exportItinerary`. |
| 292–300 | Listener đổi °C/°F: đổi trạng thái, cập nhật nhãn trợ năng, nhiệt độ hiện tại và dự báo. |
| 302–304 | Lấy dialog và nối nút thêm/đóng với các phương thức native của `<dialog>`. |
| 306–314 | Listener submit form: chặn submit mặc định, kiểm tra ràng buộc HTML, lấy tên/giờ/thời lượng và tạo ID duy nhất. |
| 315–330 | Tạo object điểm dừng mới, chuẩn hóa giờ thành `HH:mm`, đặt mô tả/biểu tượng mặc định và trạng thái chưa hoàn thành; render animation, reset form, đóng dialog và lưu. |
| 332–351 | Delegated click listener trên timeline: tìm object theo ID; nút “Đã đến” đảo trạng thái và lưu, nút “Xóa” lọc khỏi mảng, render lại và lưu. |
| 353–361 | `updateProgress` đếm tổng/đã hoàn thành, tính phần trăm, cập nhật số liệu, độ rộng thanh và giá trị ARIA. |
| 363–371 | `escapeHtml` thay các ký tự HTML đặc biệt thành entity trước khi chèn dữ liệu do người dùng nhập vào template HTML. |
| 373–383 | Khởi tạo: đọc LocalStorage, khôi phục itinerary/ngày/thành phố hợp lệ; nếu city cũ không còn thì log và dùng mặc định. |
| 384 | Render giao diện ban đầu sau khi dữ liệu lưu đã được khôi phục. |
| 385 | `setInterval` cập nhật countdown mỗi 60.000 ms để phút đếm ngược thay đổi mà không cần tải trang. |

## Luồng hoạt động chính

1. Khi mở trang, `loadStorage()` khôi phục dữ liệu; nếu chưa có dữ liệu thì dùng thành phố Đà Lạt và lịch trình mẫu.
2. Chọn hoặc tìm thành phố sẽ gọi `renderUI()` để cập nhật weather card, gợi ý trang phục và dự báo; lựa chọn được lưu.
3. Thêm/đánh dấu/xóa một điểm dừng sẽ cập nhật mảng `itinerary`, dựng lại timeline, tính tiến độ rồi lưu.
4. Chọn ngày đi sẽ lưu ngày và cập nhật countdown; countdown tự làm mới mỗi phút.
5. Nút xuất tạo file text từ trạng thái hiện tại. Tất cả dữ liệu thời tiết và dự báo vẫn là dữ liệu mô phỏng.
