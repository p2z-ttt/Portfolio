/* ==========================================================
   P2Z — front (lit data.json + interactions)
   ========================================================== */

const ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82c-1.06-.69-1.83-1.79-2.04-3.07-.05-.32-.08-.66-.08-1H11.7v13.42c0 1.5-1.22 2.72-2.72 2.72s-2.72-1.22-2.72-2.72c0-1.5 1.22-2.72 2.72-2.72.29 0 .56.05.82.13v-2.83a5.55 5.55 0 0 0-.82-.06c-3.07 0-5.56 2.49-5.56 5.56s2.49 5.56 5.56 5.56 5.56-2.49 5.56-5.56V9.34a7.6 7.6 0 0 0 4.5 1.46V7.97a4.7 4.7 0 0 1-2.44-2.15z"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.6"/></svg>`
};

const mapsURL = (addr) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
const igURL = (h) => `https://instagram.com/${h.replace(/^@/, "")}`;
const ttURL = (h) => `https://www.tiktok.com/@${h.replace(/^@/, "")}`;

function getByPath(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}

/* ---------- Font overrides (admin) ---------- */
let _dataRef = null;
function fontClassFor(path) {
  if (!_dataRef || !_dataRef.font_overrides) return "";
  const f = _dataRef.font_overrides[path];
  if (f === "anton") return "font-anton";
  if (f === "generate") return "font-generate";
  return "";
}
function applyFontTo(el, path) {
  if (!el) return;
  el.classList.remove("font-anton", "font-generate");
  const c = fontClassFor(path);
  if (c) el.classList.add(c);
}

/* ---------- Burger ---------- */
function setupBurger() {
  const b = document.querySelector(".burger");
  const l = document.querySelector(".nav-links");
  if (!b || !l) return;
  b.addEventListener("click", () => {
    const open = l.classList.toggle("open");
    b.classList.toggle("open", open);
    b.setAttribute("aria-expanded", String(open));
  });
}

/* ---------- Footer & header logo ---------- */
function renderHeaderFooter(data) {
  // brand logo
  const logo = document.getElementById("brand-logo");
  if (logo && data.site.logo) logo.src = data.site.logo;

  // Footer
  const foot = document.getElementById("footer");
  if (foot) {
    foot.innerHTML = `
      <div class="foot-col">
        <h3 class="foot-title">ADRESSE</h3>
        <a href="${mapsURL(data.site.studio_address)}" target="_blank" rel="noopener" class="foot-link foot-with-icon">
          <span class="foot-icon">${ICONS.pin}</span>
          <span>${data.site.studio_address}</span>
        </a>
      </div>
      <div class="foot-col">
        <h3 class="foot-title">CONTACTER · SUIVRE</h3>
        <div class="social-row">
          <a href="${igURL(data.site.instagram)}" target="_blank" rel="noopener" class="social-icon" aria-label="Instagram">${ICONS.instagram}</a>
          <a href="${ttURL(data.site.tiktok)}" target="_blank" rel="noopener" class="social-icon" aria-label="TikTok">${ICONS.tiktok}</a>
        </div>
      </div>
      <div class="foot-col foot-credit">© 2026 ${data.site.name}</div>
    `;
  }
}

/* ---------- BINDS DATA (génériques, appelés sur toutes les pages) ---------- */
function bindData(data) {
  // simple binds (titre, sous-titre, kicker, etc.)
  // -> on utilise innerHTML pour permettre des <span class="font-anton">...</span> inline
  document.querySelectorAll("[data-bind]").forEach(el => {
    const p = el.dataset.bind;
    const v = getByPath(data, p);
    if (v != null) el.innerHTML = v;
    applyFontTo(el, p);
  });
  document.querySelectorAll("[data-bind-html]").forEach(el => {
    const p = el.dataset.bindHtml;
    const v = getByPath(data, p);
    if (v != null) el.innerHTML = v;
    applyFontTo(el, p);
  });
  document.querySelectorAll("[data-bind-paragraphs]").forEach(el => {
    const p = el.dataset.bindParagraphs;
    const arr = getByPath(data, p) || [];
    el.innerHTML = arr.map((para, i) => {
      const cls = fontClassFor(`${p}.${i}`);
      return `<p class="lead ${cls}">${para}</p>`;
    }).join("");
  });
}

/* ---------- ACCUEIL ---------- */
function renderHome(data) {
  bindData(data);

  // portrait
  const portrait = document.getElementById("hero-portrait");
  if (portrait) portrait.src = data.home.portrait;

  // hero meta chips
  const meta = document.getElementById("hero-meta");
  if (meta) {
    meta.innerHTML = `
      <a class="chip" href="${igURL(data.site.instagram)}" target="_blank" rel="noopener" aria-label="Instagram @${data.site.instagram}">
        <span class="chip-icon">${ICONS.instagram}</span>
        <span class="chip-val">@${data.site.instagram}</span>
      </a>
      <a class="chip" href="${ttURL(data.site.tiktok)}" target="_blank" rel="noopener" aria-label="TikTok @${data.site.tiktok}">
        <span class="chip-icon">${ICONS.tiktok}</span>
        <span class="chip-val">@${data.site.tiktok}</span>
      </a>
      <a class="chip" href="${mapsURL(data.site.studio_address)}" target="_blank" rel="noopener" aria-label="${data.site.studio_address}">
        <span class="chip-icon">${ICONS.pin}</span>
        <span class="chip-val">${data.site.studio_address}</span>
      </a>
    `;
  }

  // strip (atelier photos)
  const strip = document.getElementById("strip-grid");
  if (strip && data.home.atelier && data.home.atelier.photos) {
    strip.innerHTML = data.home.atelier.photos
      .map(src => `<figure><img src="${src}" alt=""></figure>`).join("");
  }
}

/* ---------- RÉALISATIONS ---------- */
function renderRealisations(data) {
  const grid = document.getElementById("real-grid");
  if (!grid) return;
  grid.innerHTML = "";
  data.realisations.forEach((r, i) => {
    const btn = document.createElement("button");
    btn.className = "real-tile";
    btn.type = "button";
    btn.dataset.index = i;
    btn.setAttribute("aria-label", stripTags(r.title || "") || `Réalisation ${stripTags(String(r.id))}`);
    const numCls   = fontClassFor(`realisations.${i}.id`);
    const titleCls = fontClassFor(`realisations.${i}.title`);
    // L'id peut contenir des <span class="font-..."> ; on ne pad que si c'est du texte brut.
    const idStr   = String(r.id ?? "");
    const idPlain = stripTags(idStr);
    const idDisplay = idStr === idPlain ? idPlain.padStart(2,"0") : idStr;
    btn.innerHTML = `
      <img src="${r.cover}" alt="${escapeAttr(stripTags(r.title || ''))}" loading="lazy">
      <span class="real-label">
        <span class="real-num ${numCls}">${idDisplay}</span>
        ${r.title ? `<span class="real-title ${titleCls}">${r.title}</span>` : ""}
        <span class="real-pill">Voir</span>
      </span>
    `;
    btn.addEventListener("click", () => openLightbox(data.realisations, i, 0));
    grid.appendChild(btn);
  });
}

let _lbState = { list: [], proj: 0, item: 0 };

function openLightbox(list, projIdx, itemIdx) {
  _lbState = { list, proj: projIdx, item: itemIdx };
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add("show"));
  document.body.style.overflow = "hidden";
  renderLightbox();
}
function closeLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.classList.remove("show");
  setTimeout(() => {
    lb.hidden = true;
    const stage = lb.querySelector(".lb-stage");
    if (stage) stage.innerHTML = "";
    document.body.style.overflow = "";
  }, 280);
}
function renderLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const proj = _lbState.list[_lbState.proj];
  const item = proj.items[_lbState.item];
  const stage = lb.querySelector(".lb-stage");
  const cap   = lb.querySelector(".lb-caption");
  const cnt   = lb.querySelector(".lb-counter");
  stage.innerHTML = "";
  if (item.type === "image") {
    const im = document.createElement("img");
    im.src = item.src;
    stage.appendChild(im);
  } else {
    const v = document.createElement("video");
    v.controls = true;
    v.autoplay = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.loop = true;
    v.muted = true;            // requis pour l'autoplay (Safari/Chrome/iOS)
    v.setAttribute("muted", ""); // attribut HTML pour iOS strict
    v.preload = "metadata";
    v.src = item.src;
    // tente la lecture; si bloquée, l'utilisateur peut cliquer sur play
    v.addEventListener("loadedmetadata", () => { v.play().catch(()=>{}); });
    stage.appendChild(v);
  }
  if (cap) cap.innerHTML = [proj.title, proj.description].filter(Boolean).join(" — ");
  if (cnt) {
    const idStr = String(proj.id ?? "");
    const idPlain = stripTags(idStr);
    const idDisplay = idStr === idPlain ? idPlain.padStart(2,"0") : idStr;
    cnt.innerHTML = `${idDisplay} — ${_lbState.item+1} / ${proj.items.length}`;
  }
}
function lbNav(delta) {
  const proj = _lbState.list[_lbState.proj];
  _lbState.item = (_lbState.item + delta + proj.items.length) % proj.items.length;
  renderLightbox();
}
function setupLightbox() {
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", () => lbNav(-1));
  lb.querySelector(".lb-next").addEventListener("click", () => lbNav(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  lbNav(-1);
    if (e.key === "ArrowRight") lbNav(1);
  });
}

/* ---------- FLASHS ---------- */
function renderFlashs(data) {
  const grid = document.getElementById("flash-grid");
  if (!grid) return;
  grid.innerHTML = "";
  data.flashs.forEach((f, i) => {
    const btn = document.createElement("button");
    btn.className = "flash-tile";
    btn.type = "button";
    btn.setAttribute("aria-label", f.title || `Flash ${i+1}`);
    const tCls = fontClassFor(`flashs.${i}.title`);
    const altT = escapeAttr(stripTags(f.title || ""));
    btn.innerHTML = `<img src="${f.src}" alt="${altT}" loading="lazy">
      ${f.title ? `<span class="flash-title ${tCls}">${f.title}</span>` : ""}`;
    btn.addEventListener("click", () => {
      const wasOpen = btn.classList.contains("open");
      grid.querySelectorAll(".flash-tile.open").forEach(t => t.classList.remove("open"));
      if (!wasOpen) {
        btn.classList.add("open");
        grid.classList.add("has-open");
        btn.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        grid.classList.remove("has-open");
      }
    });
    grid.appendChild(btn);
  });

  document.addEventListener("click", (e) => {
    if (!grid.contains(e.target)) {
      grid.querySelectorAll(".flash-tile.open").forEach(t => t.classList.remove("open"));
      grid.classList.remove("has-open");
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      grid.querySelectorAll(".flash-tile.open").forEach(t => t.classList.remove("open"));
      grid.classList.remove("has-open");
    }
  });
}

/* ---------- CRÉATIONS (regroupées par catégorie) ---------- */
function renderCreations(data) {
  const root = document.getElementById("creations-root");
  if (!root) return;
  const items = (data.creations.items || []);
  const order = (data.creations.categories_order || []).slice();

  // Regrouper par catégorie : on compare en TEXTE BRUT (la catégorie peut contenir
  // du HTML <span class="font-...">), mais on conserve la version HTML pour l'affichage.
  const groups = new Map();           // catKey (plain) -> { display (html), items }
  for (const it of items) {
    const rawCat   = (it.category || "").trim();
    const catKey   = (stripTags(rawCat).trim()) || "Autres";
    const display  = rawCat || "Autres";
    if (!groups.has(catKey)) groups.set(catKey, { display, items: [] });
    groups.get(catKey).items.push(it);
    if (!order.includes(catKey)) order.push(catKey);
  }

  if (items.length === 0) {
    root.innerHTML = "";
    return;
  }

  // Pour appliquer la police choisie depuis l'admin sur les titres/descriptions
  // on retrouve l'index global de chaque item dans data.creations.items.
  const indexOf = (it) => items.indexOf(it);

  root.innerHTML = order
    .filter(cat => groups.has(cat))
    .map(cat => {
      const group = groups.get(cat);
      // Si tous les items sont des placeholders, afficher un message "À venir"
      const allPlaceholder = group.items.length > 0 && group.items.every(it => it.type === "placeholder");
      let body;
      if (allPlaceholder) {
        body = `<p class="cat-coming">À venir</p>`;
      } else {
        const cards = group.items.filter(it => it.type !== "placeholder").map(it => {
          const gi = indexOf(it);
          const tCls = fontClassFor(`creations.items.${gi}.title`);
          const dCls = fontClassFor(`creations.items.${gi}.description`);
          const gallery = it.gallery && it.gallery.length > 1 ? it.gallery : null;
          const clickable = !!gallery;
          // Les titres/descriptions peuvent contenir des <span class="font-...">,
          // on les insère donc en HTML brut (le contenu est admin-controlled).
          // alt= reste échappé car attribut.
          return `
          <article class="creation-tile${clickable ? " ct-clickable" : ""}"
            ${gallery ? `data-gallery='${JSON.stringify(gallery)}'` : ""}>
            <div class="ct-img">
              ${it.src ? `<img src="${it.src}" alt="${escapeAttr(stripTags(it.title||""))}" loading="lazy">` : `<div class="ct-noimg">Pas d'image</div>`}
              ${clickable ? `<span class="ct-gallery-badge">voir porté</span>` : ""}
            </div>
            <div class="ct-body">
              ${it.title ? `<h3 class="ct-title ${tCls}">${it.title}</h3>` : ""}
              ${it.description ? `<p class="ct-desc ${dCls}">${it.description}</p>` : ""}
            </div>
          </article>
        `; });
        // Mise en page spéciale pour Porte-clés : 1ère image grande, les suivantes en dessous
        if (cat === "Porte-clés" && cards.length >= 2) {
          // Sous-photos : carré arrondi cliquable avec lightbox individuel
          const subItems = group.items.filter(it => it.type !== "placeholder").slice(1);
          const subCards = subItems.map(it => {
            const gData = JSON.stringify([it.src]);
            return `<div class="ct-pk-sub ct-clickable" data-gallery='${gData}' role="button" tabindex="0" aria-label="Voir en grand">
              <img src="${escapeAttr(it.src)}" alt="${escapeAttr(stripTags(it.title||""))}" loading="lazy">
            </div>`;
          }).join("");
          body = `<div class="portecles-layout">
            <div class="portecles-main">${cards[0]}</div>
            <div class="portecles-sub">${subCards}</div>
          </div>`;
        } else {
          body = `<div class="grid grid-3">${cards.join("")}</div>`;
        }
      }
      // Le h2 utilise text-transform: uppercase via CSS, on garde donc le contenu raw
      return `
        <section class="cat-section">
          <h2 class="section-title">${group.display}</h2>
          ${body}
        </section>
      `;
    }).join("");

  // Attacher les écouteurs pour les galeries cliquables
  root.querySelectorAll(".ct-clickable[data-gallery]").forEach(tile => {
    try {
      const gallery = JSON.parse(tile.dataset.gallery);
      tile.addEventListener("click", () => {
        openLightbox([{ items: gallery.map(src => ({ type: "image", src })) }], 0, 0);
      });
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tile.click(); }
      });
    } catch(e) {}
  });
}
function escapeHTML(s){ return String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c])); }
function escapeAttr(s){ return escapeHTML(s).replace(/'/g, "&#39;"); }
function stripTags(html){
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || "";
}

/* ---------- BOOT ---------- */
async function loadData() {
  // 1) If parent preview window provided data, use it (admin preview mode)
  if (window._previewData) return window._previewData;
  // 2) localStorage override (for admin preview without iframe parent)
  try {
    const s = localStorage.getItem("p2z_preview_data");
    if (s) return JSON.parse(s);
  } catch (e) {}
  // 3) Use the global variable injected by data.js (works in file:// too)
  if (window.SITE_DATA) return window.SITE_DATA;
  // 4) Fallback : fetch the JSON file (only works on a server, not file://)
  try {
    const r = await fetch("data.json?_=" + Date.now());
    return await r.json();
  } catch (e) {
    console.error("Impossible de charger les données. Le fichier data.js est-il présent ?", e);
    throw e;
  }
}

(async function () {
  setupBurger();
  let data;
  try {
    data = await loadData();
  } catch (e) {
    console.error("Erreur chargement data.json", e);
    return;
  }
  _dataRef = data; // pour les surcharges de police
  renderHeaderFooter(data);
  bindData(data); // titres / kickers / sous-titres / paragraphes sur toutes les pages
  const page = document.body.dataset.page;
  if (page === "accueil")      renderHome(data);
  if (page === "realisations") { renderRealisations(data); setupLightbox(); }
  if (page === "flashs")       renderFlashs(data);
  if (page === "creations")    { renderCreations(data); setupLightbox(); }
})();
