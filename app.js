const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = { Monday: "MON", Tuesday: "TUE", Wednesday: "WED", Thursday: "THU", Friday: "FRI", Saturday: "SAT", Sunday: "SUN" };

function todayName() {
  const jsDay = new Date().getDay(); // 0 = Sunday
  return DAY_ORDER[(jsDay + 6) % 7];
}

function isNonVeg(text) {
  const t = text.toLowerCase();
  return NONVEG_HINTS.some((h) => t.includes(h));
}

function currentMealSlot() {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  if (h >= 7 && h < 10.5) return "breakfast";
  if (h >= 12 && h < 15) return "lunch";
  if (h >= 19 && h < 21.5) return "dinner";
  // between meals: point to the next upcoming one
  if (h < 7) return { next: "breakfast" };
  if (h < 12) return { next: "lunch" };
  if (h < 19) return { next: "dinner" };
  return { next: "breakfast" };
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
  return `<div class="extra-label">Extra counter</div><div class="chip-row">${items
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

function renderHero() {
  const slot = currentMealSlot();
  const today = findDay(todayName());
  const hero = document.getElementById("hero");

  const build = (label, key, eyebrow) => {
    const meal = today[key];
    const price = priceFor(today, key);
    hero.innerHTML = `
      <div class="hero-inner">
        <div>
          <p class="hero-eyebrow">${eyebrow}</p>
          <p class="hero-meal">${label}</p>
          <p class="hero-items">${meal.items.join(" · ")}</p>
        </div>
        <div class="hero-stub">
          <div class="price">₹${price}</div>
          <div class="price-label">coupon</div>
        </div>
      </div>`;
  };

  if (typeof slot === "string") {
    build(mealLabel(slot), slot, `Now serving · ${todayName()}`);
  } else {
    build(mealLabel(slot.next), slot.next, `Up next · ${todayName()}`);
  }
}

function renderDayTabs(selected) {
  const row = document.getElementById("dayRow");
  const today = todayName();
  row.innerHTML = DAY_ORDER.map((d) => {
    const active = d === selected ? "active" : "";
    const isToday = d === today ? '<span class="dot" title="today"></span>' : "";
    return `<button class="day-tab ${active}" data-day="${d}">${DAY_SHORT[d]}${isToday}</button>`;
  }).join("");

  row.querySelectorAll(".day-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      renderDayTabs(btn.dataset.day);
      renderMeals(btn.dataset.day);
    });
  });
}

function renderMeals(dayName) {
  const dayObj = findDay(dayName);
  const grid = document.getElementById("mealGrid");

  const card = (key) => {
    const meal = dayObj[key];
    const price = priceFor(dayObj, key);
    const special = key === "dinner" && dayObj.dinner.special;
    return `
      <div class="meal-card">
        <div class="meal-card-head">
          <p class="meal-name">${mealLabel(key)}</p>
          <span class="meal-price ${special ? "special" : ""}">₹${price}</span>
        </div>
        <div class="meal-body">
          ${special ? '<span class="special-badge">Special dinner</span>' : ""}
          <ul class="item-list">${itemsListHTML(meal.items)}</ul>
          ${chipsHTML(meal.extra)}
        </div>
      </div>`;
  };

  grid.innerHTML = card("breakfast") + card("lunch") + card("dinner");
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

function init() {
  const today = todayName();
  renderHero();
  renderDayTabs(today);
  renderMeals(today);
  renderStaples();
  renderPriceLegend();

  // refresh the "now serving" hero every few minutes so it stays accurate
  setInterval(renderHero, 5 * 60 * 1000);

  document.getElementById("headerDate").textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long"
  });
}

document.addEventListener("DOMContentLoaded", init);

// ---------- PWA: service worker + install prompt ----------

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
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
