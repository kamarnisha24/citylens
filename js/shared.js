// ─────────────────────────────────────────────
//  CityLens — Shared Navigation & Utilities
// ─────────────────────────────────────────────

const NAV_LINKS = [
    { href: "dashboard.html", icon: "📊", label: "City Overview" },
    { href: "map.html", icon: "🗺️", label: "Interactive Map" },
    { href: "infrastructure.html", icon: "🏗️", label: "Infrastructure" },
    { href: "complaints.html", icon: "💬", label: "Complaints & Feedback" },
    { href: "photos.html", icon: "📷", label: "Photo & Media" },
    { href: "trends.html", icon: "📈", label: "Health Score & Trends" },
    { href: "city-lens.html", icon: "🔍", label: "City Lens / Hotspots" },
];

function getCurrentPage() {
    return window.location.pathname.split("/").pop() || "index.html";
}

function getCity() {
    const id = localStorage.getItem("cl_selected_city") || "bengaluru";
    return CITIES.find(c => c.id === id) || CITIES[0];
}

const CITY_EMOJIS = {
    bengaluru: "🏙️", mumbai: "🌊", delhi: "🏛️", chennai: "🌴",
    hyderabad: "💎", pune: "📚", jaipur: "🌸", kolkata: "🎭",
    ahmedabad: "🏭", surat: "💍", lucknow: "🕌", patna: "🏺",
    bhopal: "🏔️", kochi: "⛵", indore: "✨",
};

function getScoreColor(s) {
    return s >= 70 ? "var(--green)" : s >= 50 ? "var(--yellow)" : "var(--red)";
}
function getScoreLabel(s) {
    return s >= 80 ? "Excellent" : s >= 60 ? "Good" : s >= 40 ? "Needs Attention" : "Critical";
}
function getProgressClass(s) {
    return s >= 70 ? "green" : s >= 50 ? "yellow" : "red";
}
function statusLabel(s) {
    return s === "green" ? "🟢 Functional" : s === "yellow" ? "🟡 Maintenance" : "🔴 Critical";
}
function statusDotColor(s) {
    return s === "green" ? "var(--green)" : s === "yellow" ? "var(--yellow)" : "var(--red)";
}

// ── Inject shared Topbar + Drawer into every page ──
function injectNav() {
    const city = getCity();
    const cur = getCurrentPage();

    const topbarHTML = `
  <div class="drawer-overlay" id="drawer-overlay" onclick="closeDrawer()"></div>
  <aside class="drawer" id="drawer">
    <div class="drawer-header">
      <a href="index.html" class="nav-logo" style="font-size:18px">
        <div class="logo-icon">🔭</div><span class="brand">CityLens</span>
      </a>
      <button class="close-btn" onclick="closeDrawer()">✕</button>
    </div>
    <div class="drawer-city-badge">
      <span class="city-dot"></span>
      <span>${CITY_EMOJIS[city.id] || "🏙️"} ${city.name}, ${city.state}</span>
      <span style="margin-left:auto;font-size:11px;font-weight:800;color:${getScoreColor(city.score)}">${city.score}%</span>
    </div>
    <div class="drawer-section-label">PAGES</div>
    <nav class="drawer-nav">
      ${NAV_LINKS.map(l => `
        <a href="${l.href}" class="drawer-item${cur === l.href ? ' drawer-item-active' : ''}">
          <span class="drawer-icon">${l.icon}</span>
          <span>${l.label}</span>
          <span class="drawer-arrow">›</span>
        </a>`).join("")}
    </nav>
    <hr class="divider"/>
    <div class="drawer-footer">
      <button class="btn btn-outline btn-sm btn-round" onclick="window.location.href='index.html'">
        🌐 Change City
      </button>
    </div>
  </aside>

  <header class="topbar">
    <div class="topbar-left">
      <button class="hamburger-btn" onclick="openDrawer()" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
      <a href="index.html" class="topbar-logo">
        <div class="logo-icon logo-icon-sm">🔭</div>
        <span class="brand">CityLens</span>
      </a>
    </div>
    <div class="page-breadcrumb">
      ${NAV_LINKS.find(l => l.href === cur)?.icon || "🏙️"}
      ${NAV_LINKS.find(l => l.href === cur)?.label || "Dashboard"}
    </div>
    <div class="topbar-right">
      <div class="select-wrap">
        <select class="city-switcher" id="city-switcher" aria-label="Switch city"></select>
      </div>
      <a href="complaints.html" class="notif-btn" title="Notifications">
        <span>🔔</span><span class="notif-badge">3</span>
      </a>
      <div class="score-badge" style="border-color:${getScoreColor(city.score)}">
        <span class="score-badge-label">Score</span>
        <span class="score-badge-value" style="color:${getScoreColor(city.score)}">${city.score}%</span>
      </div>
    </div>
  </header>`;

    document.body.insertAdjacentHTML("afterbegin", topbarHTML);
    populateNavCitySwitcher();
}

function populateNavCitySwitcher() {
    const sel = document.getElementById("city-switcher");
    if (!sel) return;
    const cur = getCity();
    CITIES.forEach(c => {
        const o = document.createElement("option");
        o.value = c.id; o.textContent = `${c.name}, ${c.state}`;
        if (c.id === cur.id) o.selected = true;
        sel.appendChild(o);
    });
    sel.addEventListener("change", () => {
        localStorage.setItem("cl_selected_city", sel.value);
        location.reload();
    });
}

function openDrawer() {
    document.getElementById("drawer").classList.add("open");
    document.getElementById("drawer-overlay").classList.add("active");
}
function closeDrawer() {
    document.getElementById("drawer").classList.remove("open");
    document.getElementById("drawer-overlay").classList.remove("active");
}

// ── Toast ──
function showToast(msg, type = "info") {
    let c = document.getElementById("toast-container");
    if (!c) { c = document.createElement("div"); c.id = "toast-container"; document.body.appendChild(c); }
    const t = document.createElement("div");
    t.className = `toast ${type}`; t.innerHTML = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 4500);
}

// ── Modal ──
function openModal(id) { document.getElementById(id)?.classList.add("active"); }
function closeModal(id, ev) {
    if (ev && ev.target !== document.getElementById(id)) return;
    document.getElementById(id)?.classList.remove("active");
}

// ── Page nav strip (mini tab bar below topbar) ──
function injectPageNav() {
    const cur = getCurrentPage();
    const strip = document.createElement("div");
    strip.className = "page-nav-strip";
    strip.innerHTML = NAV_LINKS.map(l => `
    <a href="${l.href}" class="page-nav-item${cur === l.href ? ' active' : ''}" title="${l.label}">
      <span class="page-nav-icon">${l.icon}</span>
      <span class="page-nav-label">${l.label}</span>
    </a>`).join("");
    document.body.insertAdjacentElement("afterbegin", strip);
}

// ── Shared CSS for nav strip injected via JS ──
function injectSharedNavCSS() {
    const style = document.createElement("style");
    style.textContent = `
    .page-nav-strip {
      position: fixed; top: 58px; left: 0; right: 0; z-index: 350;
      display: flex; overflow-x: auto; background: var(--white);
      border-bottom: 1px solid var(--gray-200);
      box-shadow: var(--shadow-sm); gap: 0;
      scrollbar-width: none;
    }
    .page-nav-strip::-webkit-scrollbar { display: none; }
    .page-nav-item {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 18px; white-space: nowrap;
      font-size: 13px; font-weight: 600; color: var(--gray-text);
      border-bottom: 2px solid transparent; transition: var(--transition);
      text-decoration: none; flex-shrink: 0;
    }
    .page-nav-item:hover { color: var(--blue-dark); background: var(--gray-100); }
    .page-nav-item.active { color: var(--blue-dark); border-bottom-color: var(--blue-dark); background: var(--blue-light); }
    .page-nav-icon { font-size: 15px; }
    .page-nav-label { }
    .page-main { padding-top: 108px; }
    .page-breadcrumb {
      font-size: 14px; font-weight: 700; color: var(--blue-dark);
      display: flex; align-items: center; gap: 6px;
    }
    .drawer-item-active {
      background: var(--blue-light) !important; color: var(--blue-dark) !important;
      font-weight: 700 !important;
    }
    .drawer-item { text-decoration: none; color: var(--dark); }
  `;
    document.head.appendChild(style);
}
