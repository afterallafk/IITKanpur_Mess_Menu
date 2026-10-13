const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = { Monday: "MON", Tuesday: "TUE", Wednesday: "WED", Thursday: "THU", Friday: "FRI", Saturday: "SAT", Sunday: "SUN" };
const MEAL_EMOJI = { breakfast: "🌅", lunch: "☀️", dinner: "🌙" };

let selectedDay = null;

function todayName() {
  const jsDay = new Date().getDay(); // 0 = Sunday
  return DAY_ORDER[(jsDay + 6) % 7];
}

function isNonVeg(text) {
  const t = text.toLowerCase();
  return NONVEG_HINTS.some((h) => t.includes(h));
}

function currentHourFloat() {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

// Returns { active: "breakfast"|"lunch"|"dinner"|null, next: "...", minutesToNext: n }
function mealStatus() {
  const h = currentHourFloat();
  const order = ["breakfast", "lunch", "dinner"];

  for (const key of order) {
    const w = MEAL_WINDOWS[key];
    if (h >= w.start && h < w.end) {
      return { active: key, next: null, minutesToNext: 0 };
    }
  }

  const nextKey = order.find((key) => h < MEAL_WINDOWS[key].start) || "breakfast";
  const w = MEAL_WINDOWS[nextKey];
  let minutesToNext;
  if (h < w.start) {
    minutesToNext = Math.round((w.start - h) * 60);
  } else {
    // after dinner, next is tomorrow's breakfast
    minutesToNext = Math.round((24 - h + w.start) * 60);
  }
  return { active: null, next: nextKey, minutesToNext };
}

function relState(key, status) {
  const order = ["breakfast", "lunch", "dinner"];
  if (status.active === key) return "current";
  const activeOrNextIdx = order.indexOf(status.active || status.next);
  const idx = order.indexOf(key);
  if (status.active) return idx < activeOrNextIdx ? "past" : "upcoming";
  return idx < activeOrNextIdx ? "past" : "upcoming";
}

function fmtTime(h) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function dateForDay(name) {
  const now = new Date();
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  monday.setDate(monday.getDate() + DAY_ORDER.indexOf(name));
  return monday.getDate();
}

function findDay(name) {
  return MENU.find((d) => d.day === name);
}

function itemsListHTML(items) {
  return items
    .map((it) => `<li><span class="veg-dot ${isNonVeg(it) ? "nonveg" : ""}"></span><span>${it}</span></li>`)
    .join("");
}

function chipsHTML(items) {
  if (!items || !items.length) return "";
  return `<div class="extra-label"><span>Extra counter</span></div><div class="chip-row">${items
    .map((it) => `<span class="chip ${isNonVeg(it) ? "nonveg" : ""}">${it}</span>`)
    .join("")}</div>`;
}

function mealLabel(slot) {
  return { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" }[slot];
}

function priceFor(dayObj, slot) {
  if (slot === "dinner" && dayObj.dinner.special) return PRICES.specialDinner;
  return PRICES[slot];
}

function formatCountdown(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

function renderHero() {
  const status = mealStatus();
  const today = findDay(todayName());
  const hero = document.getElementById("hero");

  const key = status.active || status.next;
  const meal = today[key];
  const price = priceFor(today, key);
  const w = MEAL_WINDOWS[key];

  const pill = status.active
    ? `<span class="status-pill live"><span class="live-dot" aria-hidden="true"></span>Now serving</span>`
    : `<span class="status-pill">Up next</span>`;

  let foot;
  if (status.active) {
    const pct = Math.max(0, Math.min(100, ((currentHourFloat() - w.start) / (w.end - w.start)) * 100));
    foot = `<div class="hero-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}"><span style="width:${pct}%"></span></div>
      <p class="hero-time">Until ${fmtTime(w.end)}</p>`;
  } else {
    foot = `<p class="hero-time">Starts in ${formatCountdown(status.minutesToNext)} · ${fmtTime(w.start)}</p>`;
  }

  hero.innerHTML = `
    <div class="hero-main">
      <div class="hero-top">${pill}<span class="hero-day">${todayName()}</span></div>
      <p class="hero-meal"><span aria-hidden="true">${MEAL_EMOJI[key]}</span> ${mealLabel(key)}</p>
      <p class="hero-items">${meal.items.join(" · ")}</p>
      ${foot}
    </div>
    <div class="hero-stub">
      <div class="price">₹${price}</div>
      <div class="price-label">coupon</div>
    </div>`;
}

function renderDayTabs(selected) {
  selectedDay = selected;
  const row = document.getElementById("dayRow");
  const today = todayName();

  const tabs = DAY_ORDER.map((d) => {
    const active = d === selected ? "active" : "";
    const isToday = d === today ? " is-today" : "";
    return `<button class="day-tab ${active}${isToday}" data-day="${d}" aria-pressed="${d === selected}" aria-label="${d}${d === today ? ", today" : ""}"><span class="dn">${DAY_SHORT[d]}</span><span class="dd">${dateForDay(d)}</span></button>`;
  }).join("");

  const todayBtn = selected !== today ? `<button class="today-btn" id="jumpToday" type="button">Today</button>` : "";

  row.innerHTML = tabs + todayBtn;

  row.querySelectorAll(".day-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      renderDayTabs(btn.dataset.day);
      renderMeals(btn.dataset.day);
    });
  });

  const jump = document.getElementById("jumpToday");
  if (jump) {
    jump.addEventListener("click", () => {
      renderDayTabs(today);
      renderMeals(today);
    });
  }
}

function renderMeals(dayName) {
  const dayObj = findDay(dayName);
  const grid = document.getElementById("mealGrid");
  const status = mealStatus();
  const isToday = dayName === todayName();

  const card = (key) => {
    const meal = dayObj[key];
    const price = priceFor(dayObj, key);
    const special = key === "dinner" && dayObj.dinner.special;
    const state = isToday ? relState(key, status) : "";
    const stateClass = state === "current" ? "is-current" : state === "past" ? "is-past" : "";
    const tag = state === "current" ? '<span class="meal-tag">Now</span>' : state === "upcoming" && status.next === key ? '<span class="meal-tag">Next</span>' : "";

    return `
      <div class="meal-card ${stateClass}" data-meal="${key}">
        <div class="meal-card-head" role="button" tabindex="0" aria-expanded="true">
          <p class="meal-name"><span class="meal-emoji" aria-hidden="true">${MEAL_EMOJI[key]}</span>${mealLabel(key)}${tag}</p>
          <div class="meal-head-right">
            <span class="meal-price ${special ? "special" : ""}">₹${price}</span>
            <svg class="meal-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
        <div class="meal-body">
          <div class="meal-body-inner">
            ${special ? '<span class="special-badge">Special dinner</span>' : ""}
            <ul class="item-list">${itemsListHTML(meal.items)}</ul>
            ${chipsHTML(meal.extra)}
          </div>
        </div>
      </div>`;
  };

  grid.innerHTML = card("breakfast") + card("lunch") + card("dinner");

  grid.querySelectorAll(".meal-card-head").forEach((head) => {
    const toggle = () => {
      const cardEl = head.closest(".meal-card");
      const collapsed = cardEl.classList.toggle("collapsed");
      head.setAttribute("aria-expanded", String(!collapsed));
    };
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });
}

function renderStaples() {
  const el = document.getElementById("staples");
  el.innerHTML = `
    <h3>Every day at Hall 14</h3>
    <div class="staples-grid">
      <div>
        <strong>Breakfast base</strong>
        ${DAILY.breakfast.items.join(", ")}
      </div>
      <div>
        <strong>Lunch base</strong>
        ${DAILY.lunch.items.join(", ")}
        <div class="satwik-note">Satwik diet: ${DAILY.lunch.satwik}</div>
      </div>
      <div>
        <strong>Dinner base</strong>
        ${DAILY.dinner.items.join(", ")}
        <div class="satwik-note">Satwik diet: ${DAILY.dinner.satwik}</div>
      </div>
    </div>`;
}

function renderPriceLegend() {
  const el = document.getElementById("priceLegend");
  el.innerHTML = `
    <div class="pl-item"><b>₹${PRICES.breakfast}</b> Breakfast</div>
    <div class="pl-item"><b>₹${PRICES.lunch}</b> Lunch</div>
    <div class="pl-item"><b>₹${PRICES.dinner}</b> Dinner</div>
    <div class="pl-item"><b>₹${PRICES.specialDinner}</b> Special dinner</div>
    <div class="pl-item"><b>+₹${PRICES.packing}</b> Packing extra</div>`;
}

function refreshLiveBits() {
  renderHero();
  if (selectedDay === todayName()) renderMeals(selectedDay);
}

function init() {
  const today = todayName();
  renderHero();
  renderDayTabs(today);
  renderMeals(today);
  renderStaples();
  renderPriceLegend();

  const versionEl = document.getElementById("appVersion");
  if (versionEl) versionEl.textContent = `IITK Mess Menu · v${APP_VERSION}`;

  // keep "now serving" / countdown accurate without a full re-render
  setInterval(refreshLiveBits, 60 * 1000);

  document.getElementById("headerDate").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short"
  });
}

document.addEventListener("DOMContentLoaded", init);

// ---------- Splash screen ----------
// Shown briefly on first load only (not on every re-render/navigation).

(function () {
  const SPLASH_KEY = "h14-splash-shown";
  const splash = document.getElementById("splash");
  if (!splash) return;

  let alreadyShown = false;
  try { alreadyShown = sessionStorage.getItem(SPLASH_KEY) === "1"; } catch (e) {}

  if (alreadyShown) {
    splash.classList.add("hidden");
    splash.style.display = "none";
    return;
  }

  const hide = () => {
    splash.classList.add("hidden");
    try { sessionStorage.setItem(SPLASH_KEY, "1"); } catch (e) {}
    setTimeout(() => { splash.style.display = "none"; }, 500);
  };

  window.addEventListener("load", () => setTimeout(hide, 900));
  // safety net in case load event is delayed
  setTimeout(hide, 2500);
})();

// ---------- PWA: service worker + install prompt + update handling ----------

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`./service-worker.js?v=${APP_VERSION}`).then((reg) => {
      // Poll for an updated service-worker file so deployments are picked up
      // without the user needing to clear their cache.
      reg.addEventListener("updatefound", () => {
        const installing = reg.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateToast(reg);
          }
        });
      });
      setInterval(() => reg.update(), 60 * 60 * 1000);
    }).catch(() => {});
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

function showUpdateToast(reg) {
  const toast = document.getElementById("updateToast");
  const btn = document.getElementById("updateReloadBtn");
  if (!toast || !btn) return;
  toast.classList.add("visible");
  btn.addEventListener("click", () => {
    if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
  }, { once: true });
}

let deferredPrompt = null;
const installBtn = () => document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = installBtn();
  if (btn) btn.classList.add("visible");
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = installBtn();
  if (!btn) return;
  btn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btn.classList.remove("visible");
  });
});

window.addEventListener("appinstalled", () => {
  const btn = installBtn();
  if (btn) btn.classList.remove("visible");
});
