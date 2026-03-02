// ─────────────────────────────────────────────
//  CityLens — Dashboard JS
// ─────────────────────────────────────────────

/* ── State ── */
let currentCity = null;
let leafletMap = null;
let mapMarkers = [];
let lensLayers = [];
let cityLensActive = false;
let currentFilter = 'all';
let trendChartInst = null;
let localComplaints = [];
let localSuggestions = [];
let localPhotos = [];

const cityEmojis = {
    bengaluru: "🏙️", mumbai: "🌊", delhi: "🏛️", chennai: "🌴",
    hyderabad: "💎", pune: "📚", jaipur: "🌸", kolkata: "🎭",
    ahmedabad: "🏭", surat: "💍", lucknow: "🕌", patna: "🏺",
    bhopal: "🏔️", kochi: "⛵", indore: "✨",
};

const NOTIFICATIONS = [
    { text: "🔴 Lal Nagar Bridge — Critical report filed, 47 votes", time: "2 hours ago", color: "var(--red)" },
    { text: "🟡 Anna Nagar Road — Authority response received, repair scheduled", time: "1 day ago", color: "var(--yellow)" },
    { text: "🟢 Cubbon Park — Issue resolved! Health Score improved +0.5%", time: "2 days ago", color: "var(--green)" },
    { text: "🔔 Your complaint on KR Market was reviewed by BBMP", time: "3 days ago", color: "var(--blue-mid)" },
];

/* ── Helpers ── */
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
    return s === "green" ? "🟢 Functional" : s === "yellow" ? "🟡 Needs Maintenance" : "🔴 Critical";
}
function statusDotColor(s) {
    return s === "green" ? "var(--green)" : s === "yellow" ? "var(--yellow)" : "var(--red)";
}
function markerClass(s) {
    return `marker-${s}`;
}

/* ── Toast ── */
function showToast(msg, type = "info") {
    const c = document.getElementById("toast-container");
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.innerHTML = msg;
    c.appendChild(t);
    setTimeout(() => t.remove(), 4500);
}

/* ── Modal helpers ── */
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
}
function closeModal(id, ev) {
    if (ev && ev.target !== document.getElementById(id)) return;
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
}

/* ── Drawer ── */
function openDrawer() {
    document.getElementById("drawer").classList.add("open");
    document.getElementById("drawer-overlay").classList.add("active");
}
function closeDrawer() {
    document.getElementById("drawer").classList.remove("open");
    document.getElementById("drawer-overlay").classList.remove("active");
}

/* ── Tab switch ── */
function switchTab(btn, name) {
    document.querySelectorAll(".right-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    if (btn) btn.classList.add("active");
    const pane = document.getElementById(`tab-${name}`);
    if (pane) pane.classList.add("active");
}

/* ── Focus panel (from drawer) ── */
function focusPanel(name) {
    if (name === "map") {
        document.getElementById("panel-center")?.scrollIntoView({ behavior: "smooth" });
    } else if (name === "complaints") {
        switchTab(document.querySelector('[data-tab="complaints"]'), "complaints");
    } else if (name === "trends") {
        document.getElementById("panel-left")?.scrollIntoView({ behavior: "smooth" });
    }
}

/* ═══════════════════════════════
   INIT CITY DATA
═══════════════════════════════ */
function initCity(cityId) {
    currentCity = CITIES.find(c => c.id === cityId) || CITIES[0];
    localComplaints = [...COMPLAINTS];
    localSuggestions = [...SUGGESTIONS];
    localPhotos = [];

    document.title = `CityLens — ${currentCity.name} Dashboard`;

    /* Drawer city name */
    const dcn = document.getElementById("drawer-city-name");
    if (dcn) dcn.textContent = `${currentCity.name}, ${currentCity.state}`;

    populateCitySwitcher();
    renderTopbar();
    renderLeftPanel();
    renderAlertTicker();
    initMap();
    renderComplaints();
    renderSuggestions();
    renderPhotos();
    populateLandmarkDropdowns();
    renderNotifications();
}

/* ── City Switcher ── */
function populateCitySwitcher() {
    const sel = document.getElementById("city-switcher");
    sel.innerHTML = "";
    CITIES.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.name}, ${c.state}`;
        if (c.id === currentCity.id) opt.selected = true;
        sel.appendChild(opt);
    });
    sel.addEventListener("change", () => {
        localStorage.setItem("cl_selected_city", sel.value);
        initCity(sel.value);
    });
}

/* ═══════════════════════════════
   TOP BAR
═══════════════════════════════ */
function renderTopbar() {
    /* Score badge */
    const sb = document.getElementById("topbar-score");
    if (sb) {
        sb.textContent = `${currentCity.score}%`;
        sb.closest(".score-badge").style.borderColor = getScoreColor(currentCity.score);
        sb.style.color = getScoreColor(currentCity.score);
    }
}

/* Alert Ticker */
function renderAlertTicker() {
    const alerts = [
        { text: `⚠️ ALERT: Lal Nagar Bridge — Critical · 47 votes`, cls: "critical" },
        { text: `🟡 Anna Nagar Road — Repair scheduled by authority`, cls: "warning" },
        { text: `🟢 Cubbon Park issue resolved — Score improved +0.5%`, cls: "" },
        { text: `🔔 ${currentCity.name} Health Score: ${currentCity.score}% — Updated today`, cls: "" },
        { text: `⚠️ Majestic Bus Stand sanitation complaint: 18 votes`, cls: "warning" },
    ];

    const inner = document.getElementById("alert-ticker-inner");
    if (!inner) return;
    const doubled = [...alerts, ...alerts]; // duplicate for seamless loop
    inner.innerHTML = doubled.map(a =>
        `<span class="alert-item ${a.cls}">${a.text}</span>`
    ).join("");
}

/* ═══════════════════════════════
   LEFT PANEL
═══════════════════════════════ */
function renderLeftPanel() {
    /* City header */
    const emojiEl = document.getElementById("city-emoji");
    const nameEl = document.getElementById("city-name");
    const subEl = document.getElementById("city-sub");
    if (emojiEl) emojiEl.textContent = cityEmojis[currentCity.id] || "🏙️";
    if (nameEl) nameEl.textContent = currentCity.name;
    if (subEl) subEl.textContent = `${currentCity.state} · Pop. ${currentCity.population} · ${currentCity.area}`;

    /* Score ring */
    animateScoreRing(currentCity.score);

    /* Category scores (derived from city score with offsets) */
    const s = currentCity.score;
    const cats = {
        infra: Math.min(100, s + 7),
        env: Math.max(0, s - 7),
        gov: Math.min(100, s - 1),
        cit: Math.max(0, s - 17),
    };
    setCatBar("infra", cats.infra);
    setCatBar("env", cats.env);
    setCatBar("gov", cats.gov);
    setCatBar("cit", cats.cit);

    /* Trend cards */
    renderTrendCards();
}

function animateScoreRing(score) {
    const ringFill = document.getElementById("ring-fill");
    const valEl = document.getElementById("score-ring-value");
    const labelEl = document.getElementById("score-ring-label");
    if (!ringFill) return;

    const circumference = 314;
    const offset = circumference - (score / 100) * circumference;

    ringFill.style.strokeDashoffset = offset;
    ringFill.style.stroke = getScoreColor(score);

    /* Count-up */
    let cur = 0;
    const step = score / 50;
    const timer = setInterval(() => {
        cur = Math.min(cur + step, score);
        valEl.textContent = `${Math.round(cur)}%`;
        valEl.style.color = getScoreColor(score);
        if (cur >= score) clearInterval(timer);
    }, 20);
    if (labelEl) {
        labelEl.textContent = getScoreLabel(score);
    }
}

function setCatBar(key, val) {
    const pct = document.getElementById(`cat-${key}-pct`);
    const bar = document.getElementById(`cat-${key}-bar`);
    if (!pct || !bar) return;
    pct.textContent = `${val}%`;
    pct.style.color = getScoreColor(val);
    bar.style.width = `${val}%`;
    bar.className = `progress-fill ${getProgressClass(val)}`;
}

/* Trend Cards + Sparklines */
function renderTrendCards() {
    const key = currentCity.id;
    const data = TREND_DATA[key] || TREND_DATA.bengaluru;
    const n = data.length;

    const monthly = +(data[n - 1] - data[n - 2]).toFixed(1);
    const quarterly = +(data[n - 1] - data[n - 4]).toFixed(1);
    const yearly = +(data[n - 1] - data[0]).toFixed(1);

    setTrend("trend-m", monthly);
    setTrend("trend-q", quarterly);
    setTrend("trend-y", yearly);

    renderSparkline("spark-monthly", data.slice(-4));
    renderSparkline("spark-quarterly", data.slice(-5));
    renderSparkline("spark-yearly", data);
}

function setTrend(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    const sign = val >= 0 ? "+" : "";
    el.textContent = `${sign}${val}%`;
    el.className = `trend-change ${val >= 0 ? "up" : "down"}`;
}

function renderSparkline(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    /* Destroy existing Chart.js instance if any */
    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    const min = Math.min(...data) - 2;
    const max = Math.max(...data) + 2;

    new Chart(canvas, {
        type: "line",
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data,
                borderColor: data[data.length - 1] >= data[0] ? "#28A745" : "#E74C3C",
                borderWidth: 2, pointRadius: 0, tension: 0.4,
                fill: true,
                backgroundColor: data[data.length - 1] >= data[0]
                    ? "rgba(40,167,69,0.12)" : "rgba(231,76,60,0.12)",
            }]
        },
        options: {
            responsive: false, animation: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { display: false },
                y: { display: false, min, max },
            },
        }
    });
}

/* ═══════════════════════════════
   TREND CHART (full modal)
═══════════════════════════════ */
function openTrendChart() {
    openModal("trend-modal-overlay");
    setTimeout(renderFullTrendChart, 100);
}

function renderFullTrendChart() {
    const canvas = document.getElementById("trend-chart");
    if (!canvas) return;

    const existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    const key = currentCity.id;
    const data = TREND_DATA[key] || TREND_DATA.bengaluru;
    const labels = TREND_DATA.labels;
    const s = currentCity.score;

    new Chart(canvas, {
        type: "line",
        data: {
            labels,
            datasets: [
                { label: "City Health Score", data, borderColor: "#1F3B6F", backgroundColor: "rgba(31,59,111,0.08)", borderWidth: 3, tension: 0.4, fill: true, pointRadius: 4, pointBackgroundColor: "#1F3B6F" },
                { label: "Infrastructure", data: data.map(d => Math.min(100, d + 7)), borderColor: "#28A745", borderWidth: 2, tension: 0.4, pointRadius: 2, borderDash: [] },
                { label: "Environment", data: data.map(d => Math.max(0, d - 7)), borderColor: "#FFC107", borderWidth: 2, tension: 0.4, pointRadius: 2 },
                { label: "Governance", data: data.map(d => Math.min(100, d - 1)), borderColor: "#3A6BC4", borderWidth: 2, tension: 0.4, pointRadius: 2 },
                { label: "Citizen Input", data: data.map(d => Math.max(0, d - 17)), borderColor: "#E74C3C", borderWidth: 2, tension: 0.4, pointRadius: 2 },
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom", labels: { font: { family: "Inter", size: 12 } } },
                tooltip: { mode: "index", intersect: false },
            },
            scales: {
                y: { min: 0, max: 100, grid: { color: "rgba(0,0,0,0.05)" }, ticks: { callback: v => `${v}%` } },
                x: { grid: { color: "rgba(0,0,0,0.05)" } },
            },
            interaction: { mode: "nearest", axis: "x", intersect: false },
        }
    });
}

/* ═══════════════════════════════
   MAP
═══════════════════════════════ */
function initMap() {
    const landmarks = LANDMARKS[currentCity.id] || [];

    if (leafletMap) {
        leafletMap.remove();
        leafletMap = null;
        mapMarkers = [];
        lensLayers = [];
    }

    leafletMap = L.map("map-container", {
        center: [currentCity.lat, currentCity.lng],
        zoom: 14,
        zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
    }).addTo(leafletMap);

    landmarks.forEach(lm => addMapMarker(lm));
}

function addMapMarker(lm) {
    const icon = L.divIcon({
        className: "",
        html: `<div class="custom-marker ${markerClass(lm.status)}" title="${lm.name}">${lm.icon}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
    });

    const marker = L.marker([lm.lat, lm.lng], { icon })
        .addTo(leafletMap)
        .bindTooltip(buildTooltip(lm), {
            className: "map-tooltip",
            direction: "top",
            offset: [0, -18],
        });

    marker.on("click", () => openLandmarkModal(lm));
    mapMarkers.push({ marker, lm });
}

function buildTooltip(lm) {
    return `
    <div>
      <strong>${lm.icon} ${lm.name}</strong><br>
      ${statusLabel(lm.status)}<br>
      <span style="color:var(--gray-text);font-size:11px">Reports: ${lm.reports} · ${lm.lastUpdated}</span><br>
      <span style="color:var(--blue-mid);font-size:11px">Click to view details</span>
    </div>`;
}

function setMapFilter(btn, filter) {
    currentFilter = filter;
    document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");

    mapMarkers.forEach(({ marker, lm }) => {
        const visible = filter === "all" || lm.category === filter;
        if (visible) {
            marker.getElement()?.parentElement?.style.setProperty("display", "");
            marker.addTo(leafletMap);
        } else {
            leafletMap.removeLayer(marker);
        }
    });
}

/* ── City Lens ── */
function toggleCityLens() {
    cityLensActive = !cityLensActive;
    const btn = document.getElementById("city-lens-btn");
    const legend = document.getElementById("lens-legend");

    btn.classList.toggle("active", cityLensActive);
    legend.classList.toggle("hidden", !cityLensActive);

    if (cityLensActive) {
        addLensHotspots();
        showToast("🔍 City Lens activated — hotspots visible on map", "info");
    } else {
        lensLayers.forEach(l => leafletMap.removeLayer(l));
        lensLayers = [];
        showToast("City Lens deactivated", "info");
    }
}

function addLensHotspots() {
    const landmarks = LANDMARKS[currentCity.id] || [];
    const redLms = landmarks.filter(l => l.status === "red");
    const yellowLms = landmarks.filter(l => l.status === "yellow");
    const greenLms = landmarks.filter(l => l.status === "green");

    function addHotspot(lat, lng, color, label, radius) {
        const circle = L.circle([lat, lng], {
            color, fillColor: color, fillOpacity: 0.18,
            weight: 2, opacity: 0.6, radius,
        }).addTo(leafletMap)
            .bindTooltip(`<strong>${label}</strong>`, { className: "map-tooltip" });
        lensLayers.push(circle);
    }

    redLms.forEach(lm => addHotspot(lm.lat, lm.lng, "#E74C3C", `🔴 ${lm.name} — Critical`, 280));
    yellowLms.forEach(lm => addHotspot(lm.lat, lm.lng, "#FFC107", `🟡 ${lm.name} — Moderate`, 200));
    greenLms.forEach(lm => addHotspot(lm.lat, lm.lng, "#28A745", `🟢 ${lm.name} — Healthy`, 160));
}

/* ═══════════════════════════════
   LANDMARK MODAL
═══════════════════════════════ */
function openLandmarkModal(lm) {
    document.getElementById("lm-category").textContent = lm.category;
    document.getElementById("lm-title").textContent = `${lm.icon} ${lm.name}`;
    document.getElementById("lm-desc").textContent = lm.description;
    document.getElementById("lm-reports").textContent = `${lm.reports} open`;
    document.getElementById("lm-updated").textContent = lm.lastUpdated;
    document.getElementById("lm-authority").textContent = lm.authority;

    /* Status */
    const st = document.getElementById("lm-status");
    st.textContent = statusLabel(lm.status);
    st.style.color = statusDotColor(lm.status);

    /* History */
    const hist = IMPROVEMENT_HISTORY[lm.id] || [];
    const histEl = document.getElementById("lm-history");
    if (hist.length === 0) {
        histEl.innerHTML = `<p style="color:var(--gray-text);font-size:13px">No history recorded yet.</p>`;
    } else {
        histEl.innerHTML = hist.map(h => {
            const dotColor = h.type === "complaint" ? "var(--red)" : h.type === "authority" ? "var(--blue-mid)" : "var(--green)";
            return `
        <div class="history-item">
          <span class="history-dot" style="background:${dotColor}"></span>
          <span class="history-date">${h.date}</span>
          <span class="history-event">${h.event}</span>
        </div>`;
        }).join("");
    }

    /* Comments */
    document.getElementById("lm-comments").innerHTML = `
    <div class="comment-item">
      <div class="comment-avatar">👤</div>
      <div class="comment-body">
        <span class="comment-author">Ravi K.</span>
        <span class="comment-text">The condition here is concerning. Needs urgent attention!</span>
        <div class="comment-meta">▲ 23 · 2 days ago</div>
      </div>
    </div>
    <div class="comment-item">
      <div class="comment-avatar">👤</div>
      <div class="comment-body">
        <span class="comment-author">Meena S.</span>
        <span class="comment-text">I've been reporting this for months. No action yet!</span>
        <div class="comment-meta">▲ 18 · 3 days ago</div>
      </div>
    </div>`;

    /* Photos */
    const photoEl = document.getElementById("lm-photos");
    const cityPhotos = localPhotos.filter(p => p.landmarkId === lm.id);
    if (cityPhotos.length === 0) {
        photoEl.innerHTML = `<div class="photo-thumb placeholder-photo">📷<br><small>No photos yet</small></div>`;
    } else {
        photoEl.innerHTML = cityPhotos.map(p => `
      <div class="photo-thumb">
        <img src="${p.src}" alt="${p.caption}" title="${p.caption}" style="width:100%;height:100%;object-fit:cover;border-radius:6px">
      </div>`).join("");
    }

    openModal("landmark-modal-overlay");
}

/* ═══════════════════════════════
   RIGHT PANEL FEEDS
═══════════════════════════════ */
function renderComplaints(sort = "votes") {
    const feed = document.getElementById("complaints-feed");
    const countEl = document.getElementById("feed-complaint-count");
    if (!feed) return;

    const all = [...localComplaints];
    if (sort === "votes") all.sort((a, b) => b.votes - a.votes);

    countEl.textContent = `${all.length} open issues`;
    feed.innerHTML = "";

    all.forEach((c, i) => {
        const card = document.createElement("div");
        card.className = "complaint-card";
        card.style.animationDelay = `${i * 60}ms`;

        const statusMap = { open: "bg-red", "in-review": "bg-yellow", resolved: "bg-green" };
        const statusText = { open: "Open", "in-review": "In Review", resolved: "Resolved" };

        card.innerHTML = `
      <div class="cc-header">
        <div class="cc-landmark">📍 ${c.landmark}</div>
        <span class="cc-status-badge ${statusMap[c.status] || 'bg-blue'}">${statusText[c.status] || c.status}</span>
      </div>
      <div class="cc-text">${c.text}</div>
      <div class="cc-footer">
        <div class="cc-meta">🏷️ ${c.category} · ${c.time}</div>
        <div class="cc-actions">
          <button class="vote-btn" id="vote-${c.id}" onclick="upvote('${c.id}')">▲ ${c.votes}</button>
        </div>
      </div>`;
        feed.appendChild(card);
    });
}

function upvote(id) {
    const c = localComplaints.find(x => x.id === id);
    if (!c) return;
    c.votes++;
    const btn = document.getElementById(`vote-${id}`);
    if (btn) {
        btn.classList.add("voted");
        btn.textContent = `▲ ${c.votes}`;
    }

    /* Dynamic score impact */
    if (c.votes % 10 === 0) {
        currentCity.score = Math.max(0, currentCity.score - 0.1);
        updateTopbarScore();
        showToast(`⚠️ Complaint on ${c.landmark} gaining traction (${c.votes} votes)`, "warning");
    }

    if (c.votes === 25) {
        showToast(`🚨 Community alert: ${c.landmark} flagged to authorities (25 votes)`, "error");
        addNotification({ text: `🚨 ${c.landmark} flagged to authority — ${c.votes} votes`, time: "just now", color: "var(--red)" });
    }
}

function renderSuggestions() {
    const feed = document.getElementById("suggestions-feed");
    const countEl = document.getElementById("feed-suggestion-count");
    if (!feed) return;

    countEl.textContent = `${localSuggestions.length} suggestions`;
    feed.innerHTML = "";

    localSuggestions.forEach((s, i) => {
        const card = document.createElement("div");
        card.className = "suggestion-card";
        card.style.animationDelay = `${i * 60}ms`;
        card.innerHTML = `
      <div class="sc-header">
        <div class="sc-landmark">💡 ${s.landmark}</div>
        <span class="badge bg-blue" style="font-size:10px">${s.category}</span>
      </div>
      <div class="sc-text">${s.text}</div>
      <div class="sc-footer">
        <div class="sc-meta">${s.time}</div>
        <button class="vote-btn" id="svote-${s.id}" onclick="upvoteSuggestion('${s.id}')">▲ ${s.votes}</button>
      </div>`;
        feed.appendChild(card);
    });
}

function upvoteSuggestion(id) {
    const s = localSuggestions.find(x => x.id === id);
    if (!s) return;
    s.votes++;
    const btn = document.getElementById(`svote-${id}`);
    if (btn) { btn.classList.add("voted"); btn.textContent = `▲ ${s.votes}`; }
    if (s.votes === 10) showToast(`💡 "${s.text.slice(0, 40)}…" is gaining community support!`, "info");
}

function renderPhotos() {
    const grid = document.getElementById("photos-grid");
    if (!grid) return;

    const placeholders = [
        { emoji: "📷", label: "Cubbon Park — Before", lm: "cb1" },
        { emoji: "🌳", label: "Park maintenance done", lm: "cb1" },
        { emoji: "🛣️", label: "Anna Nagar Pothole", lm: "an1" },
        { emoji: "🌉", label: "Bridge crack — Jan 2026", lm: "ln1" },
    ];

    grid.innerHTML = placeholders.map(p => `
    <div class="photo-item" title="${p.label}">
      <span style="font-size:28px">${p.emoji}</span>
      <span style="font-size:11px;text-align:center">${p.label}</span>
    </div>`).join("");

    /* Add real uploaded photos */
    localPhotos.forEach(p => {
        const item = document.createElement("div");
        item.className = "photo-item";
        item.innerHTML = `<img src="${p.src}" alt="${p.caption}" title="${p.caption}">`;
        grid.appendChild(item);
    });
}

/* ═══════════════════════════════
   FORM SUBMISSIONS
═══════════════════════════════ */
function submitComplaint() {
    const landmark = document.getElementById("c-landmark")?.value || "General";
    const desc = document.getElementById("c-desc")?.value?.trim();
    const sev = document.querySelector('input[name="c-sev"]:checked')?.value || "medium";
    const cat = document.querySelector('input[name="c-cat"]:checked')?.value || "Infrastructure";

    if (!desc) { showToast("Please describe the issue.", "error"); return; }

    const now = new Date();
    const newC = {
        id: `c${Date.now()}`,
        landmark: landmark || "City Area",
        category: cat, severity: sev,
        text: desc, votes: 0,
        time: "just now", status: "open", color: sev === "critical" ? "red" : sev === "high" ? "red" : "yellow",
    };
    localComplaints.unshift(newC);

    /* Recalculate score */
    const drop = sev === "critical" ? 0.5 : sev === "high" ? 0.3 : 0.1;
    currentCity.score = Math.max(0, +(currentCity.score - drop).toFixed(1));
    updateTopbarScore();

    closeModal("complaint-modal-overlay");
    closeModal("landmark-modal-overlay");
    switchTab(document.querySelector('[data-tab="complaints"]'), "complaints");
    renderComplaints();
    clearForm(["c-desc", "c-preview"]);
    showToast("✅ Complaint submitted! City score updated.", "success");

    if (currentCity.score < 30) {
        showToast("🚨 ALERT: Health Score critical! Authorities notified.", "error");
        addNotification({ text: `🚨 ${currentCity.name} Health Score dropped below 30%! Authorities alerted.`, time: "just now", color: "var(--red)" });
    }
}

function submitSuggestion() {
    const landmark = document.getElementById("s-landmark")?.value || "";
    const title = document.getElementById("s-title-field")?.value?.trim();
    const desc = document.getElementById("s-desc")?.value?.trim();
    const cat = document.getElementById("s-cat")?.value || "Infrastructure";

    if (!desc) { showToast("Please describe your suggestion.", "error"); return; }

    const newS = {
        id: `s${Date.now()}`,
        landmark: landmark || "City (General)",
        category: cat,
        text: title ? `${title}: ${desc}` : desc,
        votes: 0, time: "just now",
    };
    localSuggestions.unshift(newS);

    closeModal("suggestion-modal-overlay");
    switchTab(document.querySelector('[data-tab="suggestions"]'), "suggestions");
    renderSuggestions();
    clearForm(["s-title-field", "s-desc"]);
    showToast("💡 Suggestion submitted! Thank you for your idea.", "success");
}

function submitPhoto() {
    const input = document.getElementById("p-file");
    const caption = document.getElementById("p-caption")?.value?.trim() || "Photo";
    const lmId = document.getElementById("p-landmark")?.value || "";
    const type = document.querySelector('input[name="p-type"]:checked')?.value || "general";

    if (!input?.files?.length) { showToast("Please select a photo.", "error"); return; }

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = e => {
        localPhotos.unshift({ src: e.target.result, caption, landmarkId: lmId, type });
        closeModal("photo-modal-overlay");
        switchTab(document.querySelector('[data-tab="photos"]'), "photos");
        renderPhotos();
        showToast("📷 Photo uploaded successfully!", "success");
        /* Score boost for after-photo */
        if (type === "after") {
            currentCity.score = Math.min(100, +(currentCity.score + 0.2).toFixed(1));
            updateTopbarScore();
            showToast("🟢 After-photo confirmed! Score improved +0.2%", "success");
        }
    };
    reader.readAsDataURL(file);
}

function previewFiles(event, previewId) {
    const container = document.getElementById(previewId);
    if (!container) return;
    container.innerHTML = "";
    Array.from(event.target.files).forEach(file => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        container.appendChild(img);
    });
}

function clearForm(ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.value = "";
        else el.innerHTML = "";
    });
}

/* ═══════════════════════════════
   LANDMARK DROPDOWNS
═══════════════════════════════ */
function populateLandmarkDropdowns() {
    const landmarks = LANDMARKS[currentCity.id] || [];
    const ids = ["c-landmark", "s-landmark", "p-landmark"];

    ids.forEach(selectId => {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        sel.innerHTML = `<option value="">— Select landmark —</option>`;
        landmarks.forEach(lm => {
            const opt = document.createElement("option");
            opt.value = lm.id;
            opt.textContent = `${lm.icon} ${lm.name}`;
            sel.appendChild(opt);
        });
    });
}

/* ═══════════════════════════════
   NOTIFICATIONS
═══════════════════════════════ */
function renderNotifications() {
    const list = document.getElementById("notif-list");
    if (!list) return;
    list.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item">
      <span class="notif-dot" style="background:${n.color}"></span>
      <div class="notif-content">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`).join("");
}

function addNotification(n) {
    NOTIFICATIONS.unshift(n);
    renderNotifications();
    const badge = document.getElementById("notif-badge");
    if (badge) badge.textContent = NOTIFICATIONS.length;
}

/* ── Update topbar score after changes ── */
function updateTopbarScore() {
    const sb = document.getElementById("topbar-score");
    if (sb) {
        sb.textContent = `${currentCity.score.toFixed(1)}%`;
        sb.style.color = getScoreColor(currentCity.score);
        sb.closest(".score-badge").style.borderColor = getScoreColor(currentCity.score);
    }
    animateScoreRing(currentCity.score);
    const s = currentCity.score;
    setCatBar("infra", Math.min(100, s + 7));
    setCatBar("env", Math.max(0, s - 7));
    setCatBar("gov", Math.min(100, s - 1));
    setCatBar("cit", Math.max(0, s - 17));
}

/* ═══════════════════════════════
   BOOT
═══════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("cl_selected_city") || "bengaluru";
    initCity(saved);
});
