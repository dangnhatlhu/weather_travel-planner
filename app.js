const weatherData = [
  { id: "bien-hoa", name: "Biên Hòa, Việt Nam", region: "ĐỒNG NAI · ĐÔNG NAM BỘ", temp: 31, condition: "Nắng đẹp", humidity: 67, wind: 9, uv: "Cao · 7", summary: "Trời nắng, thích hợp cho hành trình khám phá", forecasts: [["T2", "☀️", 31, 25], ["T3", "⛅", 32, 25], ["T4", "☀️", 31, 24], ["T5", "🌦️", 29, 24], ["T6", "☀️", 32, 25]] },
  { id: "da-lat", name: "Đà Lạt, Việt Nam", region: "ĐÀ LẠT · CAO NGUYÊN", temp: 22, condition: "Nắng nhẹ", humidity: 68, wind: 8, uv: "Thấp · 2", summary: "Thời tiết lý tưởng để khám phá", forecasts: [["T2", "☀️", 22, 14], ["T3", "⛅", 23, 15], ["T4", "🌦️", 20, 14], ["T5", "☀️", 24, 15], ["T6", "⛅", 21, 14]] },
  { id: "vung-tau", name: "Vũng Tàu, Việt Nam", region: "VŨNG TÀU · DUYÊN HẢI", temp: 29, condition: "Nắng có mây", humidity: 76, wind: 14, uv: "Cao · 6", summary: "Gió biển mát lành, sẵn sàng khám phá", forecasts: [["T2", "⛅", 29, 25], ["T3", "☀️", 30, 25], ["T4", "🌦️", 28, 24], ["T5", "⛅", 29, 25], ["T6", "☀️", 30, 25]] },
  { id: "hoi-an", name: "Hội An, Việt Nam", region: "HỘI AN · PHỐ CỔ", temp: 29, condition: "Nắng đẹp", humidity: 72, wind: 10, uv: "Cao · 6", summary: "Một ngày tuyệt vời bên phố cổ", forecasts: [["T2", "☀️", 29, 23], ["T3", "☀️", 30, 23], ["T4", "⛅", 28, 22], ["T5", "🌦️", 27, 22], ["T6", "☀️", 30, 23]] },
  { id: "sa-pa", name: "Sa Pa, Việt Nam", region: "SA PA · TÂY BẮC", temp: 17, condition: "Nhiều mây", humidity: 81, wind: 6, uv: "Thấp · 2", summary: "Không khí mát lành vùng núi cao", forecasts: [["T2", "⛅", 17, 12], ["T3", "🌦️", 16, 11], ["T4", "☁️", 18, 12], ["T5", "☀️", 19, 13], ["T6", "⛅", 17, 12]] },
  { id: "da-nang", name: "Đà Nẵng, Việt Nam", region: "ĐÀ NẴNG · MIỀN TRUNG", temp: 30, condition: "Nắng đẹp", humidity: 70, wind: 12, uv: "Cao · 7", summary: "Nắng vàng, biển xanh đang chờ bạn", forecasts: [["T2", "☀️", 30, 24], ["T3", "⛅", 29, 24], ["T4", "☀️", 31, 24], ["T5", "🌦️", 28, 23], ["T6", "☀️", 30, 24]] },
  { id: "nha-trang", name: "Nha Trang, Việt Nam", region: "NHA TRANG · DUYÊN HẢI", temp: 31, condition: "Trời quang", humidity: 66, wind: 11, uv: "Cao · 8", summary: "Nắng rực rỡ cho một ngày bên biển", forecasts: [["T2", "☀️", 31, 25], ["T3", "☀️", 32, 25], ["T4", "⛅", 30, 24], ["T5", "☀️", 31, 25], ["T6", "🌦️", 29, 24]] },
];

const defaultCity = weatherData.find(({ id }) => id === "da-lat");
const STORAGE_KEY = "wanderly-planner-state";
const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const defaultDeparture = new Date();
defaultDeparture.setDate(defaultDeparture.getDate() + 7);
const defaultItinerary = [
  { id: "stop-lake", name: "Hồ Xuân Hương", time: "08:30", duration: "1 giờ 30 phút", description: "Đi dạo quanh hồ, hít thở không khí trong lành", emoji: "🌿", price: "Miễn phí", completed: true },
  { id: "stop-flowers", name: "Vườn hoa thành phố", time: "10:30", duration: "2 giờ", description: "Ngắm muôn hoa khoe sắc giữa lòng Đà Lạt", emoji: "🌷", price: "50.000đ", completed: false },
  { id: "stop-palace", name: "Dinh Bảo Đại", time: "13:00", duration: "1 giờ", description: "Khám phá kiến trúc và câu chuyện lịch sử", emoji: "🏛️", price: "40.000đ", completed: false },
  { id: "stop-coffee", name: "Tiệm cà phê Túi Mơ To", time: "15:00", duration: "2 giờ", description: "Nhâm nhi cà phê, ngắm thung lũng mộng mơ", emoji: "☕", price: "45.000đ", completed: false },
];
let isFahrenheit = false;
let toastTimeout;
let countdownInterval;
let selectedCityId = defaultCity.id;
let itinerary = defaultItinerary.map((stop) => ({ ...stop }));
let departureDate = getLocalDateString(defaultDeparture);

const toDisplayTemp = (celsius) => isFahrenheit ? Math.round((celsius * 9) / 5 + 32) : celsius;

function renderForecast(forecasts) {
  const forecastList = document.querySelector("#forecast-list");
  forecastList.innerHTML = forecasts.map(([day, icon, high, low], index) => `
    <div class="forecast-day${index === 0 ? " today" : ""}">
      <span>${day}</span>
      <span class="forecast-icon" aria-hidden="true">${icon}</span>
      <span class="forecast-temps"><strong>${toDisplayTemp(high)}°</strong><span>${toDisplayTemp(low)}°</span></span>
    </div>
  `).join("");
}

function updateWeather(city) {
  document.querySelector("#city-select").value = city.id;
  document.querySelector("#city-name").textContent = city.name;
  document.querySelector("#temperature").textContent = toDisplayTemp(city.temp);
  document.querySelector("#weather-condition").textContent = city.condition;
  document.querySelector("#humidity").textContent = `${city.humidity}%`;
  document.querySelector("#wind").textContent = `${city.wind} km/h`;
  document.querySelector("#uv").textContent = city.uv;
  document.querySelector(".weather-summary").textContent = city.summary;
  document.querySelector("#photo-credit").textContent = city.region;
  const suggestion = city.temp < 20
    ? { text: "Nên mang theo áo khoác dày để giữ ấm.", icon: "🧥" }
    : city.temp > 30
      ? { text: "Nên mang theo kem chống nắng và mũ.", icon: "🧴" }
      : { text: "Thời tiết dễ chịu, một chiếc áo khoác nhẹ sẽ rất tiện.", icon: "🌤" };
  document.querySelector("#clothing-suggestion").textContent = suggestion.text;
  document.querySelector("#suggestion-icon").textContent = suggestion.icon;
  renderForecast(city.forecasts);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

function isValidStop(stop) {
  return stop
    && typeof stop.id === "string"
    && typeof stop.name === "string"
    && typeof stop.time === "string"
    && /^\d{2}:\d{2}$/.test(stop.time)
    && typeof stop.duration === "string"
    && typeof stop.description === "string"
    && typeof stop.emoji === "string"
    && typeof stop.price === "string"
    && typeof stop.completed === "boolean";
}

function isValidDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return parsed.getFullYear() === year
    && parsed.getMonth() === month - 1
    && parsed.getDate() === day;
}

function loadStorage() {
  let savedValue;
  try {
    savedValue = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("Unable to read the saved Wanderly planner state.", error);
    showToast("Không thể truy cập dữ liệu đã lưu; thay đổi sẽ chỉ tồn tại trong phiên này.");
    return null;
  }

  if (savedValue === null) return null;

  try {
    const savedState = JSON.parse(savedValue);
    const validStops = Array.isArray(savedState.itinerary)
      && savedState.itinerary.every(isValidStop)
      && new Set(savedState.itinerary.map(({ id }) => id)).size === savedState.itinerary.length;

    if (savedState.version !== 1
      || !validStops
      || typeof savedState.cityId !== "string"
      || (savedState.departureDate !== undefined && !isValidDateString(savedState.departureDate))) {
      throw new Error("Saved planner data does not match the supported format.");
    }

    return savedState;
  } catch (error) {
    console.error("Unable to parse saved Wanderly planner state.", error);
    showToast("Dữ liệu lịch trình đã lưu không hợp lệ; đang dùng lịch mặc định.");
    return null;
  }
}

function saveStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      cityId: selectedCityId,
      departureDate,
      itinerary,
    }));
    return true;
  } catch (error) {
    console.error("Unable to save the Wanderly planner state.", error);
    showToast("Không thể lưu thay đổi vào bộ nhớ trình duyệt.");
    return false;
  }
}

function renderStop(stop, isLast, shouldAnimate) {
  const [hours] = stop.time.split(":").map(Number);
  const period = hours < 12 ? "BUỔI SÁNG" : "BUỔI CHIỀU";
  const temperature = weatherData.find(({ id }) => id === selectedCityId)?.temp ?? defaultCity.temp;
  const item = document.createElement("article");
  item.className = `timeline-item${stop.completed ? " completed" : ""}${isLast ? " last-item" : ""}${shouldAnimate ? " entering" : ""}`;
  item.dataset.stopId = stop.id;
  item.innerHTML = `
    <div class="timeline-rail"><span class="timeline-dot">${stop.completed ? '<svg viewBox="0 0 16 16"><path d="m4 8 2.5 2.5L12 5" /></svg>' : ""}</span></div>
    <div class="stop-card">
      <div class="stop-topline"><span class="stop-time">${escapeHtml(stop.time)} <span>·</span> ${period}</span></div>
      <div class="stop-content">
        <span class="stop-emoji" aria-hidden="true">${escapeHtml(stop.emoji)}</span>
        <div class="stop-info"><h4>${escapeHtml(stop.name)}</h4><p>${escapeHtml(stop.description)}</p></div>
        <span class="stop-weather">☀️ <span>${toDisplayTemp(temperature)}°</span></span>
      </div>
      <div class="stop-meta"><span><svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l2.5 1.5" /></svg> ${escapeHtml(stop.duration)}</span>${stop.price ? `<span class="meta-dot"></span><span>${escapeHtml(stop.price)}</span>` : ""}<span class="stop-actions"><button class="arrived-button" type="button" data-action="arrived" aria-pressed="${stop.completed}">${stop.completed ? "Đã đến ✓" : "Đã đến"}</button><button class="delete-stop-button" type="button" data-action="delete">Xóa</button></span></div>
    </div>`;

  if (shouldAnimate) {
    item.addEventListener("animationend", () => item.classList.remove("entering"), { once: true });
  }
  return item;
}

function renderUI({ animateStopId } = {}) {
  const city = weatherData.find(({ id }) => id === selectedCityId) || defaultCity;
  selectedCityId = city.id;
  updateWeather(city);
  document.querySelector("#departure-date").value = departureDate;
  updateCountdown();

  const timeline = document.querySelector("#timeline");
  timeline.replaceChildren(...itinerary.map((stop, index) => (
    renderStop(stop, index === itinerary.length - 1, stop.id === animateStopId)
  )));
  updateProgress();
}

function updateCountdown() {
  const [year, month, day] = departureDate.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const countdown = document.querySelector("#countdown-text");

  if (target.getTime() < today.getTime()) {
    countdown.textContent = "Ngày khởi hành đã qua. Hãy chọn ngày mới.";
    return;
  }
  if (target.getTime() === today.getTime()) {
    countdown.textContent = "Chuyến đi bắt đầu hôm nay!";
    return;
  }

  const remainingMinutes = Math.floor((target.getTime() - now.getTime()) / 60_000);
  const days = Math.floor(remainingMinutes / (24 * 60));
  const hours = Math.floor((remainingMinutes % (24 * 60)) / 60);
  const minutes = remainingMinutes % 60;
  countdown.textContent = `Còn ${days} ngày ${hours} giờ ${minutes} phút nữa là đến ngày đi.`;
}

function exportItinerary() {
  const city = weatherData.find(({ id }) => id === selectedCityId) || defaultCity;
  const [year, month, day] = departureDate.split("-").map(Number);
  const formattedDeparture = new Intl.DateTimeFormat("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
  const stopsText = itinerary.length
    ? itinerary.map((stop, index) => [
      `${index + 1}. ${stop.time} - ${stop.name}`,
      `   Thời lượng: ${stop.duration}`,
      `   Trạng thái: ${stop.completed ? "Đã đến" : "Chưa đến"}`,
      stop.price ? `   Chi phí: ${stop.price}` : "",
    ].filter(Boolean).join("\n")).join("\n\n")
    : "Chưa có địa điểm nào trong lịch trình.";
  const contents = [
    "WANDERLY - LỊCH TRÌNH DU LỊCH",
    `Điểm đến: ${city.name}`,
    `Ngày khởi hành: ${formattedDeparture}`,
    `Tổng số điểm dừng: ${itinerary.length}`,
    "",
    stopsText,
  ].join("\n");
  try {
    const blob = new Blob(["\uFEFF", contents], { type: "text/plain;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `wanderly-lich-trinh-${departureDate}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    showToast("Đã xuất lịch trình thành tệp văn bản.");
  } catch (error) {
    console.error("Unable to export the Wanderly itinerary.", error);
    showToast("Không thể xuất tệp lịch trình trên trình duyệt này.");
  }
}

document.querySelector("#city-search").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#city-input");
  const query = input.value.trim().toLocaleLowerCase("vi");
  const city = weatherData.find(({ name }) => name.toLocaleLowerCase("vi").startsWith(query));
  if (!query) {
    input.focus();
    return;
  }
  if (!city) {
    showToast("Chưa có dữ liệu mô phỏng cho thành phố này.");
    return;
  }
  selectedCityId = city.id;
  renderUI();
  const saved = saveStorage();
  input.value = "";
  if (saved) showToast(`Đã cập nhật thời tiết tại ${city.name.split(",")[0]}.`);
});

document.querySelector("#city-select").addEventListener("change", (event) => {
  const city = weatherData.find(({ id }) => id === event.currentTarget.value);
  if (city) {
    selectedCityId = city.id;
    renderUI();
    saveStorage();
  }
});

document.querySelector("#departure-date").addEventListener("change", (event) => {
  if (!isValidDateString(event.currentTarget.value)) {
    event.currentTarget.setCustomValidity("Vui lòng chọn ngày khởi hành hợp lệ.");
    event.currentTarget.reportValidity();
    return;
  }
  event.currentTarget.setCustomValidity("");
  departureDate = event.currentTarget.value;
  updateCountdown();
  saveStorage();
});

document.querySelector("#export-itinerary").addEventListener("click", exportItinerary);

document.querySelector("#unit-toggle").addEventListener("click", (event) => {
  isFahrenheit = !isFahrenheit;
  document.querySelector("#unit-label").textContent = isFahrenheit ? "°F" : "°C";
  event.currentTarget.setAttribute("aria-label", `Chuyển sang độ ${isFahrenheit ? "Celsius" : "Fahrenheit"}`);
  const cityName = document.querySelector("#city-name").textContent.toLocaleLowerCase("vi").split(",")[0];
  const city = weatherData.find(({ name }) => name.toLocaleLowerCase("vi").startsWith(cityName)) || defaultCity;
  document.querySelector("#temperature").textContent = toDisplayTemp(city.temp);
  renderForecast(city.forecasts);
});

const dialog = document.querySelector("#add-stop-dialog");
document.querySelector("#add-stop").addEventListener("click", () => dialog.showModal());
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());

document.querySelector("#add-stop-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = form.elements["stop-name"].value.trim();
  const time = form.elements["stop-time"].value;
  const duration = form.elements["stop-duration"].value;
  const [hours, minutes] = time.split(":").map(Number);
  const id = `stop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  itinerary.push({
    id,
    name,
    time: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    duration,
    description: "Điểm dừng mới trong lịch trình của bạn",
    emoji: "📍",
    price: "",
    completed: false,
  });
  renderUI({ animateStopId: id });
  form.reset();
  document.querySelector("#stop-time").value = "16:00";
  dialog.close();
  if (saveStorage()) showToast(`Đã thêm ${name} vào lịch trình.`);
});

document.querySelector("#timeline").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = button.closest(".timeline-item");
  const stop = itinerary.find(({ id }) => id === item?.dataset.stopId);
  if (!stop) return;

  if (button.dataset.action === "arrived") {
    stop.completed = !stop.completed;
    renderUI();
    if (saveStorage()) showToast(stop.completed ? "Đã đánh dấu hoàn thành điểm dừng." : "Đã bỏ trạng thái đã đến.");
    return;
  }

  if (button.dataset.action === "delete") {
    itinerary = itinerary.filter(({ id }) => id !== stop.id);
    renderUI();
    if (saveStorage()) showToast(`Đã xóa ${stop.name} khỏi lịch trình.`);
  }
});

function updateProgress() {
  const total = document.querySelectorAll(".timeline-item").length;
  const completed = document.querySelectorAll(".timeline-item.completed").length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  document.querySelector("#stop-count").textContent = total;
  document.querySelector("#done-count").textContent = completed;
  document.querySelector("#progress-fill").style.width = `${progress}%`;
  document.querySelector(".progress-track").setAttribute("aria-valuenow", progress);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

const savedState = loadStorage();
if (savedState) {
  itinerary = savedState.itinerary;
  if (savedState.departureDate) departureDate = savedState.departureDate;
  if (weatherData.some(({ id }) => id === savedState.cityId)) {
    selectedCityId = savedState.cityId;
  } else {
    console.error(`Saved city "${savedState.cityId}" is no longer available.`);
    showToast("Thành phố đã lưu không còn trong dữ liệu; đang hiển thị Đà Lạt.");
  }
}
renderUI();
countdownInterval = window.setInterval(updateCountdown, 60_000);
