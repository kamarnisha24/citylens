// ─────────────────────────────────────────────
//  CityLens — Landing Page JS
// ─────────────────────────────────────────────

const cityEmojis = {
    bengaluru: "🏙️", mumbai: "🌊", delhi: "🏛️", chennai: "🌴",
    hyderabad: "💎", pune: "📚", jaipur: "🌸", kolkata: "🎭",
    ahmedabad: "🏭", surat: "💍", lucknow: "🕌", patna: "🏺",
    bhopal: "🏔️", kochi: "⛵", indore: "✨",
};

function getScoreColor(score) {
    if (score >= 70) return "var(--green)";
    if (score >= 50) return "var(--yellow)";
    return "var(--red)";
}
function getScoreClass(score) {
    if (score >= 70) return "status-green";
    if (score >= 50) return "status-yellow";
    return "status-red";
}
function getProgressClass(score) {
    if (score >= 70) return "green";
    if (score >= 50) return "yellow";
    return "red";
}

// ── Populate city dropdown ──
function populateCityDropdown() {
    const sel = document.getElementById("hero-select");
    if (!sel) return;

    CITIES.forEach(city => {
        const opt = document.createElement("option");
        opt.value = city.id;
        opt.textContent = `${city.name}, ${city.state}`;
        sel.appendChild(opt);
    });

    sel.addEventListener("change", onCityChange);
}

function onCityChange() {
    const sel = document.getElementById("hero-select");
    const city = CITIES.find(c => c.id === sel.value);
    if (!city) return;

    const previewName = document.getElementById("preview-name");
    const previewMeta = document.getElementById("preview-meta");
    const previewScore = document.getElementById("preview-score");
    const previewEmoji = document.getElementById("preview-emoji");

    previewEmoji.textContent = cityEmojis[city.id] || "🏙️";
    previewName.textContent = `${city.name}, ${city.state}`;
    previewMeta.textContent = `Pop. ${city.population} · ${city.area} · ${city.known}`;
    previewScore.textContent = `${city.score}%`;
    previewScore.style.color = getScoreColor(city.score);
}

// ── Navigate to dashboard ──
function goToDashboard() {
    const sel = document.getElementById("hero-select");
    if (!sel.value) {
        sel.focus();
        sel.style.borderColor = "var(--red)";
        showToast("Please select a city first! 🏙️", "error");
        setTimeout(() => sel.style.borderColor = "", 2000);
        return;
    }
    localStorage.setItem("cl_selected_city", sel.value);
    window.location.href = "dashboard.html";
}

// ── Render city tiles ──
function renderCityTiles() {
    const grid = document.getElementById("cities-grid");
    if (!grid) return;

    const featured = CITIES.slice(0, 8);
    featured.forEach((city, i) => {
        const tile = document.createElement("a");
        tile.className = "city-tile";
        tile.href = "#";
        tile.style.animationDelay = `${i * 80}ms`;
        tile.setAttribute("aria-label", `View ${city.name} dashboard`);

        const cls = getProgressClass(city.score);
        const col = getScoreColor(city.score);

        tile.innerHTML = `
      <div class="city-tile-header">
        <div>
          <div class="city-tile-name">${cityEmojis[city.id] || "🏙️"} ${city.name}</div>
          <div class="city-tile-state">${city.state}</div>
        </div>
        <div class="city-tile-score ${getScoreClass(city.score)}" style="background:${col}22">${city.score}%</div>
      </div>
      <div class="tile-bar">
        <div class="progress-track">
          <div class="progress-fill ${cls}" style="width: ${city.score}%"></div>
        </div>
      </div>
      <div class="tile-issues">🔴 ${city.issues} active issues</div>
      <div class="tile-known">${city.known}</div>
    `;

        tile.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.setItem("cl_selected_city", city.id);
            window.location.href = "dashboard.html";
        });

        grid.appendChild(tile);
    });
}

// ── Count-up animation ──
function animateCounters() {
    const nums = document.querySelectorAll(".stat-num");
    nums.forEach(el => {
        const target = parseInt(el.dataset.target);
        const format = el.dataset.format;
        if (!target) return;

        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            if (format) {
                el.textContent = format;
            } else {
                el.textContent = Math.floor(current).toLocaleString("en-IN") + "+";
            }
        }, 20);
    });
}

// ── Navbar scroll effect ──
function initNavScroll() {
    const nav = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 30);
    });
}

// ── Toast ──
function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ── IntersectionObserver for animations ──
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = "1";
                e.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".step-card, .feature-card, .city-tile").forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        observer.observe(el);
    });
}

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
    populateCityDropdown();
    renderCityTiles();
    initNavScroll();
    animateCounters();
    setTimeout(initScrollAnimations, 100);

    // Allow Enter key on explore button
    document.getElementById("explore-btn")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") goToDashboard();
    });
});
