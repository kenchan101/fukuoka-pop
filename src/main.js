import { trip, facts, spots, foods, days, budget, checklist, extras, sources } from "./data.js";
import { getArt } from "./art.js";
import { createWorld } from "./scene.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const icons = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  down: '<path d="M12 4v16M6 14l6 6 6-6"/>',
  upRight: '<path d="M7 17L17 7M9 7h8v8"/>',
  pin: '<path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.6"/>',
  bowl: '<path d="M4 11h16c0 4.4-3.6 8-8 8s-8-3.6-8-8Z"/><path d="M8 5c-1 1.4-1 2.6 0 4M12 4c-1 1.5-1 2.8 0 4M16 5c-1 1.4-1 2.6 0 4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/><path d="M8 14h2M14 14h2M8 17h2M14 17h2"/>',
  check: '<path d="M5 12.5l4.2 4.2L19 6.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  yen: '<path d="M6 4l6 8 6-8M12 12v8M8 14h8M8 17h8"/>',
  train: '<rect x="5" y="3" width="14" height="15" rx="4"/><path d="M8 7h8M8 11h8M8 18l-2 3M16 18l2 3"/><circle cx="9" cy="14.5" r=".8"/><circle cx="15" cy="14.5" r=".8"/>',
  bed: '<path d="M4 20V7M4 16h16v4M8 16v-4h6a4 4 0 0 1 4 4M8 12V9h4v3"/>',
  bag: '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
  flower: '<circle cx="12" cy="12" r="2.3"/><path d="M12 9.7c-1.6-4.4 2.8-6.1 3.4-2.6M14.3 12c4.4-1.6 6.1 2.8 2.6 3.4M12 14.3c1.6 4.4-2.8 6.1-3.4 2.6M9.7 12c-4.4 1.6-6.1-2.8-2.6-3.4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',
  moon: '<path d="M20 15.5A8.3 8.3 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
  sound: '<path d="M4 10v4h3l4 3V7l-4 3H4Z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  mute: '<path d="M4 10v4h3l4 3V7l-4 3H4Z"/><path d="M16 10l4 4M20 10l-4 4"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  umbrella: '<path d="M3 12a9 9 0 0 1 18 0H3Z"/><path d="M12 12v6a2.5 2.5 0 0 0 5 0"/>',
  share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.5M8.2 13.2l7.6 4.5"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.6 2.6L16.5 9"/>',
  heart: '<path d="M20.8 5.7a5.4 5.4 0 0 0-7.7 0L12 7l-1.1-1.2a5.4 5.4 0 0 0-7.7 7.7L12 22l8.8-8.5a5.4 5.4 0 0 0 0-7.8Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  home: '<path d="M3 10.5L12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
  map: '<path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/>',
};

function icon(name, cls = "") {
  return `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.pin}</svg>`;
}

const typeIcon = {
  transport: "train",
  stay: "bed",
  sight: "pin",
  shop: "bag",
  food: "bowl",
  festival: "sparkle",
  nature: "flower",
};

const pickCopy = {
  tower: "福岡塔：日落前 45 分鐘上塔，一次過睇晒橙色天空同城市亮燈。",
  ramen: "拉麵君：食到一半記得嗌「替玉」，加多一球麵先算完整。",
  yatai: "屋台：見到有位就坐，唔好死等某一檔；現金要跟身。",
  ferris: "摩天輪：呢個角度影過去，成個百道海濱都係你背景。",
  sign: "呢個島就係你 2027 年 5 月嘅福岡小地圖。",
};

function showToast(message, duration = 2800) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), duration);
}

// ---------------- sound ----------------
let audioCtx = null;
let soundOn = localStorage.getItem("fukuoka-sound") === "on";
function ensureAudio() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx?.state === "suspended") audioCtx.resume();
}
function tone(freq = 520, duration = 0.09, type = "sine", gain = 0.035) {
  if (!soundOn) return;
  ensureAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, audioCtx.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.connect(g).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration + 0.03);
}
function chime() {
  tone(523, 0.12, "triangle", 0.03);
  setTimeout(() => tone(659, 0.12, "triangle", 0.026), 80);
  setTimeout(() => tone(784, 0.18, "triangle", 0.024), 165);
}
function updateSoundButton() {
  const btn = $("#soundBtn");
  if (!btn) return;
  btn.innerHTML = `${icon(soundOn ? "sound" : "mute")}<span class="sr-only">${soundOn ? "關閉音效" : "開啟音效"}</span>`;
  btn.setAttribute("aria-pressed", String(soundOn));
  btn.classList.toggle("is-on", soundOn);
}

// ---------------- render cards ----------------
function renderSpots() {
  const root = $("#spotCards");
  root.innerHTML = spots
    .map(
      (spot, i) => `
    <article class="spot-card reveal" style="--accent:${spot.color};--card-bg:${spot.bg};--d:${i * 55}ms">
      <button class="card-hit" type="button" data-spot="${spot.id}" aria-label="打開 ${spot.name} 景點詳情">
        <div class="spot-art">
          ${getArt(spot.id)}
          <span class="spot-no">${spot.no}</span>
          <span class="sticker">${spot.tag}</span>
        </div>
        <div class="spot-info">
          <p class="micro">${spot.area}</p>
          <h3>${spot.name}<span>${spot.jp}</span></h3>
          <p class="spot-headline">${spot.headline}</p>
          <div class="spot-meta">
            <span>${icon("clock")}${spot.time}</span>
            <span>${icon("yen")}${spot.price}</span>
          </div>
          <span class="text-link">揭開呢個景點 ${icon("upRight")}</span>
        </div>
      </button>
    </article>`
    )
    .join("");
}

function renderFoods() {
  const root = $("#foodCards");
  root.innerHTML = foods
    .map(
      (food, i) => `
    <article class="food-card reveal" style="--accent:${food.color};--card-bg:${food.bg};--d:${i * 55}ms">
      <div class="food-art">
        ${getArt(food.id)}
        <span class="food-level" aria-label="必食指數 ${food.level} 分">${[1, 2, 3, 4, 5].map((n) => `<i class="${n <= food.level ? "on" : ""}"></i>`).join("")}</span>
      </div>
      <div class="food-body">
        <p class="micro">${food.jp}</p>
        <h3>${food.name}</h3>
        <p>${food.body}</p>
        <div class="food-foot">
          <span class="price">${food.price}</span>
          <span class="where">${food.where}</span>
        </div>
      </div>
    </article>`
    )
    .join("");
}

function routeMap(route, color) {
  const w = 340;
  const h = 148;
  const pad = 27;
  const step = (w - pad * 2) / (route.length - 1);
  const pts = route.map((name, i) => {
    const x = pad + step * i;
    const y = 62 + Math.sin(i * 1.25 + 0.2) * 18;
    return { x, y, name };
  });
  let path = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const p = pts[i];
    const mx = (prev.x + p.x) / 2;
    path += ` C${mx} ${prev.y}, ${mx} ${p.y}, ${p.x} ${p.y}`;
  }
  const labels = pts
    .map((p, i) => {
      const y = p.y > 74 ? p.y - 23 : p.y + 35;
      return `<text x="${p.x}" y="${y}" text-anchor="middle" class="route-name">${p.name}</text>`;
    })
    .join("");
  return `<div class="route-map">
    <div class="route-top"><span>${icon("map")} 當日路線</span><span class="route-count">${route.length} 站</span></div>
    <svg viewBox="0 0 ${w} ${h}" role="img" aria-label="路線圖：${route.join("、")}">
      <path d="${path}" fill="none" stroke="#253740" stroke-width="8" stroke-linecap="round" opacity=".16"/>
      <path d="${path}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
      <path d="${path}" fill="none" stroke="#fff8e7" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="2 9"/>
      ${pts
        .map(
          (p, i) => `<g>
            <circle cx="${p.x}" cy="${p.y}" r="13" fill="#fff8e7" stroke="#253740" stroke-width="3"/>
            <circle cx="${p.x}" cy="${p.y}" r="8.5" fill="${i === 0 ? "#253740" : color}"/>
            <text x="${p.x}" y="${p.y + 3.5}" text-anchor="middle" font-size="9" font-weight="800" fill="${i === 0 ? "#fff8e7" : "#253740"}">${i + 1}</text>
          </g>`
        )
        .join("")}
      ${labels}
      <path d="M${w - 18} 18l2.2 6.2 6.2 2.2-6.2 2.2L${w - 18} 35l-2.2-6.4-6.2-2.2 6.2-2.2Z" fill="#ffd15c" stroke="#253740" stroke-width="2"/>
    </svg>
  </div>`;
}

function renderDays() {
  const tabs = $("#dayTabs");
  tabs.innerHTML = days
    .map(
      (day, i) => `
      <button class="day-tab ${i === 0 ? "is-active" : ""}" id="tab-${day.id}" role="tab" aria-controls="panel-${day.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-day="${i}" style="--day:${day.color}">
        <span class="tab-date">${day.dateLabel}</span>
        <span class="tab-meta">DAY ${i + 1} <i>星期${day.weekday}</i></span>
        <span class="tab-theme">${day.theme}</span>
      </button>`
    )
    .join("");

  const panels = $("#dayPanels");
  panels.innerHTML = days
    .map(
      (day, i) => `
      <section class="day-panel ${i === 0 ? "is-active" : ""}" id="panel-${day.id}" role="tabpanel" aria-labelledby="tab-${day.id}" ${i === 0 ? "" : "hidden"} style="--day:${day.color}">
        <div class="day-banner">
          <div class="day-banner-main">
            <span class="day-kicker">DAY ${i + 1} <i>/ 5</i></span>
            <h3>${day.theme}</h3>
            <p>${day.summary}</p>
          </div>
          <div class="day-facts">
            <span>${icon("pin")} ${day.area}</span>
            <span>${icon("sun")} ${day.weather}</span>
            <span>${icon("clock")} ${day.pace}</span>
            <span>${icon("yen")} 約 ${day.budget} / 人</span>
          </div>
        </div>
        <div class="day-grid">
          <div class="timeline">
            ${day.timeline
              .map(
                (item) => `
              <article class="tl-item tl-${item.type}">
                <div class="tl-time">${item.time}</div>
                <div class="tl-mark">${icon(typeIcon[item.type] || "pin")}</div>
                <div class="tl-card">
                  <div class="tl-head">
                    <h4>${item.title}</h4>
                    ${item.tag ? `<span class="tiny-tag">${item.tag}</span>` : ""}
                  </div>
                  <p>${item.text}</p>
                  ${item.meta ? `<span class="tl-meta">${item.meta}</span>` : ""}
                </div>
              </article>`
              )
              .join("")}
          </div>
          <aside class="day-side">
            ${routeMap(day.route, day.color)}
            <div class="must-eat">
              <p class="micro">TODAY'S BITE</p>
              <div class="must-eat-head"><span class="must-icon">${icon("bowl")}</span><h4>${day.mustEat.name}</h4></div>
              <p>${day.mustEat.text}</p>
              <span class="must-price">約 ${day.mustEat.price}</span>
            </div>
            <details class="rain-card">
              <summary>${icon("umbrella")} 落雨點算？<span>打開備案</span></summary>
              <p>${day.rainy}</p>
            </details>
            <div class="day-tip">
              <span>${icon("sparkle")}</span>
              <p>${day.tip}</p>
            </div>
          </aside>
        </div>
      </section>`
    )
    .join("");
}

function activateDay(index, shouldScroll = false) {
  index = Math.max(0, Math.min(days.length - 1, Number(index)));
  $$(".day-tab").forEach((tab, i) => {
    const active = i === index;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && shouldScroll) tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  });
  $$(".day-panel").forEach((panel, i) => {
    const active = i === index;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  if (shouldScroll) {
    const panel = $(`#panel-${days[index].id}`);
    if (panel) {
      const top = panel.getBoundingClientRect().top + window.scrollY - 86;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
}

function renderBudget() {
  const widths = [86, 68, 32, 18, 52];
  $("#budgetRows").innerHTML = budget.rows
    .map(
      (row, i) => `
      <div class="budget-row">
        <div class="budget-line">
          <span>${row.label}</span>
          <strong>${row.hkd}</strong>
        </div>
        <div class="budget-bar"><i style="width:${widths[i]}%;background:${row.color}"></i></div>
        <span class="budget-jpy">${row.jpy}</span>
      </div>`
    )
    .join("");
  $("#budgetTotal").textContent = budget.total;
  $("#budgetNote").textContent = budget.note;
  $("#flightNote").textContent = budget.flight;
}

function renderChecklist() {
  const saved = JSON.parse(localStorage.getItem("fukuoka-checklist") || "{}");
  $("#checkList").innerHTML = checklist
    .map(
      (item) => `
      <label class="check-item">
        <input type="checkbox" data-check="${item.id}" ${saved[item.id] ? "checked" : ""}>
        <span class="check-box">${icon("check")}</span>
        <span class="check-text">${item.text}</span>
      </label>`
    )
    .join("");
  updateCheckProgress();
}

function updateCheckProgress() {
  const boxes = $$("#checkList input[type=checkbox]");
  const done = boxes.filter((b) => b.checked).length;
  const pct = Math.round((done / boxes.length) * 100) || 0;
  $("#checkProgress").style.width = `${pct}%`;
  $("#checkCount").textContent = `${done} / ${boxes.length}`;
  $("#checkMessage").textContent =
    done === boxes.length ? "全部搞掂，可以出發！" : done === 0 ? "由第一項開始，慢慢嚟。" : pct > 60 ? "差少少咋，加油！" : "一步步嚟，唔急。";
}

function renderExtras() {
  $("#extraCards").innerHTML = extras
    .map(
      (extra) => `
    <article class="extra-card" style="--accent:${extra.color}">
      <div class="extra-top"><span>${extra.time}</span><span>${icon("map")}</span></div>
      <h3>${extra.name}<small>${extra.jp}</small></h3>
      <p>${extra.body}</p>
      <span class="extra-access">${icon("train")} ${extra.access}</span>
    </article>`
    )
    .join("");
}

function renderSources() {
  $("#sourceLinks").innerHTML = sources
    .map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.label} ${icon("upRight")}</a>`)
    .join("");
}

// ---------------- detail dialog ----------------
function openSpot(id) {
  const spot = spots.find((s) => s.id === id);
  if (!spot) return;
  const dialog = $("#detailDialog");
  $(".detail-inner", dialog).innerHTML = `
    <div class="detail-art" style="--card-bg:${spot.bg}">
      ${getArt(spot.id)}
      <span class="sticker">${spot.tag}</span>
      <button class="detail-close" type="button" aria-label="關閉" data-close>${icon("close")}</button>
    </div>
    <div class="detail-body">
      <p class="micro">SPOT ${spot.no} / ${spot.area}</p>
      <h2>${spot.name}<span>${spot.jp}</span></h2>
      <p class="detail-lead">${spot.headline}</p>
      <p>${spot.body}</p>
      <div class="detail-grid">
        <div><span>${icon("clock")} 建議時間</span><strong>${spot.time}</strong></div>
        <div><span>${icon("yen")} 門票</span><strong>${spot.price}</strong></div>
        <div><span>${icon("train")} 交通</span><strong>${spot.access}</strong></div>
        <div><span>${icon("calendar")} 行程位置</span><strong>${spot.day}</strong></div>
      </div>
      <div class="cute-note"><span>${icon("sparkle")}</span><p>${spot.cute}</p></div>
      <div class="detail-tip"><strong>貼士</strong><p>${spot.tip}</p></div>
      <div class="detail-actions">
        <button class="btn btn-primary" type="button" data-goto="${spot.id}">去睇行程 ${icon("arrow")}</button>
        <button class="btn btn-ghost" type="button" data-close>收埋</button>
      </div>
    </div>`;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  document.body.classList.add("dialog-open");
  dialog.querySelector("[data-close]")?.focus();
}

function closeDialog() {
  const dialog = $("#detailDialog");
  if (dialog.open) dialog.close();
  else dialog.removeAttribute("open");
  document.body.classList.remove("dialog-open");
}

// ---------------- ics & share ----------------
function icsEscape(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
function dateStamp(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}
function downloadIcs() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Fukuoka Pop//Trip 2027//ZH-HK",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];
  days.forEach((day) => {
    const start = day.date.replace(/-/g, "");
    const endDate = new Date(`${day.date}T00:00:00Z`);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    const end = endDate.toISOString().slice(0, 10).replace(/-/g, "");
    const desc = day.timeline.map((item) => `${item.time} ${item.title}｜${item.meta || ""}`).join("\n");
    lines.push(
      "BEGIN:VEVENT",
      `UID:fukuoka-pop-2027-${day.id}@fukuoka-pop`,
      `DTSTAMP:${dateStamp(new Date())}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `SUMMARY:${icsEscape(`福岡 5日4夜｜${day.dateLabel} ${day.theme}`)}`,
      `DESCRIPTION:${icsEscape(desc)}`,
      `LOCATION:${icsEscape(day.area)}`,
      "END:VEVENT"
    );
  });
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "fukuoka-pop-2027.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("行程已下載，用手機日曆打開就匯入到！");
  confetti();
  tone(660, 0.12, "triangle");
  setTimeout(() => tone(880, 0.16, "triangle"), 100);
}

function confetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#ff705b", "#ffd15c", "#7ed9c7", "#a8c7ff", "#ff9db5", "#fff8e7"];
  for (let i = 0; i < 46; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${8 + Math.random() * 84}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--tx", `${(Math.random() - 0.5) * 240}px`);
    piece.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    piece.style.borderRadius = i % 3 === 0 ? "50%" : "2px";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3000);
  }
}

async function shareTrip() {
  const data = {
    title: "福岡食住玩！5日4夜卡通小旅行",
    text: "2027 年 5 月福岡＋由布院行程：景點、美食、溫泉一泊，仲有得玩 3D 小島。",
    url: location.href,
  };
  try {
    if (navigator.share) {
      await navigator.share(data);
      tone(680, 0.12, "triangle");
      return;
    }
    await navigator.clipboard.writeText(location.href);
    showToast("連結已複製，send 畀同行朋友啦！");
  } catch (err) {
    if (err?.name !== "AbortError") showToast("复制唔到，長按網址列分享啦。");
  }
}

// ---------------- scene & hotspots ----------------
let world = null;
let hotspotsActive = true;

function handlePick(id) {
  const text = pickCopy[id];
  if (text) showToast(text);
  tone(id === "ramen" ? 440 : 560, 0.08, "sine");
  $$(".hotspot").forEach((h) => h.classList.toggle("is-picked", h.dataset.id === id));
  setTimeout(() => $$(".hotspot").forEach((h) => h.classList.remove("is-picked")), 700);
}

function setupScene() {
  const canvas = $("#world");
  if (new URLSearchParams(location.search).has("no3d")) {
    $("#hero").classList.add("no-3d");
    return;
  }
  try {
    world = createWorld(canvas, { onPick: handlePick });
  } catch (err) {
    console.warn(err);
    world = null;
  }
  if (world && /[?&](capture|debug)/.test(location.search)) window.__FUKUOKA__ = { world, scene: world.scene, camera: world.camera, group: world.worldGroup };
  if (!world) {
    $("#hero").classList.add("no-webgl");
    $("#heroFallback").innerHTML = `
      <div class="fallback-inner">
        <div class="fallback-art">${getArt("tower")}</div>
        <div class="fallback-bowl">${getArt("ramen")}</div>
        <span class="fallback-note">你部機未開 WebGL，但一樣睇得晒個行程！</span>
      </div>`;
    return;
  }

  const data = [
    { id: "tower", label: "福岡塔", sub: "234m" },
    { id: "ramen", label: "拉麵君", sub: "肚餓未？" },
    { id: "yatai", label: "中洲屋台", sub: "夜晚先開" },
  ];
  const wrap = $("#hotspots");
  wrap.innerHTML = data
    .map(
      (h) => `<button class="hotspot" type="button" data-id="${h.id}" aria-label="點擊 ${h.label}">
        <span class="hotspot-copy"><strong>${h.label}</strong><small>${h.sub}</small></span>
        <span class="hotspot-dot"></span>
      </button>`
    )
    .join("");
  wrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".hotspot");
    if (!btn) return;
    e.stopPropagation();
    world.triggerPick(btn.dataset.id);
  });

  let lastHotspot = 0;
  function tick(now) {
    requestAnimationFrame(tick);
    if (!hotspotsActive || !world) return;
    if (now - lastHotspot < 40) return;
    lastHotspot = now;
    const positions = world.projectAnchors();
    $$(".hotspot").forEach((btn) => {
      const p = positions[btn.dataset.id];
      if (!p || !p.visible) {
        btn.style.opacity = "0";
        btn.style.pointerEvents = "none";
        return;
      }
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
      btn.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -100%)`;
    });
  }
  requestAnimationFrame(tick);

  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      hotspotsActive = entry.isIntersecting;
      world.setActive(entry.isIntersecting);
    },
    { threshold: 0.02 }
  );
  heroObserver.observe($("#hero"));
}

// ---------------- scroll, nav, reveal ----------------
function setupScroll() {
  const progress = $("#scrollProgress");
  const topbar = $(".topbar");
  const copy = $(".hero-copy");
  let ticking = false;
  function update() {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    topbar.classList.toggle("is-stuck", y > 60);
    if (copy) {
      const shift = Math.min(y * 0.16, 52);
      copy.style.transform = `translate3d(0, ${shift}px, 0)`;
      copy.style.opacity = String(Math.max(0, 1 - y / 680));
    }
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  update();

  const links = $$(".bottom-nav a");
  const map = {
    hero: "hero",
    spots: "spots",
    foods: "foods",
    itinerary: "itinerary",
    checklist: "checklist",
  };
  const sections = Object.keys(map)
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}` || (id === "budget" && link.getAttribute("href") === "#checklist");
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-38% 0px -52% 0px", threshold: [0, 0.1, 0.4] }
  );
  sections.forEach((s) => observer.observe(s));
  if ($("#budget")) observer.observe($("#budget"));
}

function setupReveal() {
  const items = $$(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => observer.observe(el));
}

function setupCountdown() {
  const target = new Date("2027-05-10T00:00:00+08:00");
  const diff = target.getTime() - Date.now();
  const count = Math.max(0, Math.ceil(diff / 86400000));
  const el = $("#countdownDays");
  if (el) el.textContent = String(count);
  const label = $("#countdownLabel");
  if (label && count === 0) label.textContent = "出發喇！";
}

function setupTilt() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  $$(".tilt").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-3px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
}

// ---------------- wire everything ----------------
function setupUI() {
  renderSpots();
  renderFoods();
  renderDays();
  renderBudget();
  renderChecklist();
  renderExtras();
  renderSources();
  setupScene();
  setupScroll();
  setupReveal();
  setupCountdown();
  setupTilt();
  updateSoundButton();

  $$(".card-hit").forEach((btn) => btn.addEventListener("click", () => openSpot(btn.dataset.spot)));

  $("#dayTabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".day-tab");
    if (!tab) return;
    activateDay(tab.dataset.day);
    tone(520 + Number(tab.dataset.day) * 40, 0.06, "triangle");
  });
  $("#dayTabs").addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const active = $(".day-tab.is-active");
    let index = Number(active?.dataset.day || 0);
    if (e.key === "ArrowLeft") index = (index + days.length - 1) % days.length;
    if (e.key === "ArrowRight") index = (index + 1) % days.length;
    if (e.key === "Home") index = 0;
    if (e.key === "End") index = days.length - 1;
    activateDay(index);
    $(`.day-tab[data-day="${index}"]`)?.focus();
  });

  ["#dayPrev", "#dayNext"].forEach((sel, i) => {
    $(sel)?.addEventListener("click", () => {
      const current = Number($(".day-tab.is-active")?.dataset.day || 0);
      activateDay((current + (i === 0 ? -1 : 1) + days.length) % days.length, true);
    });
  });

  $("#detailDialog").addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeDialog();
    else if (e.target === $("#detailDialog")) closeDialog();
    const goto = e.target.closest("[data-goto]");
    if (goto) {
      const spot = spots.find((s) => s.id === goto.dataset.goto);
      closeDialog();
      const match = spot?.day?.match(/Day\s*(\d+)/i);
      if (match) {
        activateDay(Number(match[1]) - 1);
        setTimeout(() => {
          $("#itinerary").scrollIntoView({ behavior: "smooth" });
        }, 120);
      } else {
        setTimeout(() => {
          $("#extras").scrollIntoView({ behavior: "smooth" });
        }, 120);
      }
    }
  });
  $("#detailDialog").addEventListener("close", () => document.body.classList.remove("dialog-open"));

  $("#icsBtn").addEventListener("click", downloadIcs);
  $("#shareBtn").addEventListener("click", shareTrip);
  $("#floatShare")?.addEventListener("click", shareTrip);

  $("#soundBtn").addEventListener("click", () => {
    soundOn = !soundOn;
    localStorage.setItem("fukuoka-sound", soundOn ? "on" : "off");
    updateSoundButton();
    if (soundOn) {
      chime();
      showToast("音效開咗，點下個島會有聲。");
    } else {
      showToast("音效閂咗。");
    }
  });

  $$("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      const isNight = mode === "night";
      $("#hero").classList.toggle("is-night", isNight);
      $$("[data-mode]").forEach((b) => {
        const active = b.dataset.mode === mode;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
      });
      world?.setNight(isNight);
      tone(isNight ? 320 : 640, 0.1, "sine");
    });
  });

  $("#checkList").addEventListener("change", (e) => {
    if (!e.target.matches("input[type=checkbox]")) return;
    const saved = JSON.parse(localStorage.getItem("fukuoka-checklist") || "{}");
    saved[e.target.dataset.check] = e.target.checked;
    localStorage.setItem("fukuoka-checklist", JSON.stringify(saved));
    updateCheckProgress();
    if (e.target.checked) tone(720, 0.06, "triangle", 0.02);
  });
  $("#checkReset").addEventListener("click", () => {
    localStorage.removeItem("fukuoka-checklist");
    $$("#checkList input[type=checkbox]").forEach((b) => (b.checked = false));
    updateCheckProgress();
    showToast("清單已重設，重新嚟過。");
  });

  $("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const params = new URLSearchParams(location.search);
  if (params.has("day")) activateDay(Number(params.get("day")) - 1);
  if (params.has("section")) {
    setTimeout(() => {
      const target = document.getElementById(params.get("section"));
      if (target) window.scrollTo(0, Math.max(0, target.offsetTop - 24));
    }, 700);
  }
  if (params.has("spot")) {
    setTimeout(() => openSpot(params.get("spot")), 900);
  }

  setTimeout(() => $(".drag-hint")?.classList.add("is-gone"), 7000);
}

// loader
function hideLoader() {
  document.body.classList.add("ready");
  setTimeout(() => $("#loader")?.setAttribute("hidden", ""), 800);
}

document.addEventListener("DOMContentLoaded", () => {
  setupUI();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !location.search.includes("nosw")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((err) => console.warn("SW registration failed", err));
    });
  }
  const started = performance.now();
  window.addEventListener("load", () => {
    const wait = Math.max(0, 650 - (performance.now() - started));
    setTimeout(hideLoader, wait);
  });
  setTimeout(hideLoader, 2600);
});
