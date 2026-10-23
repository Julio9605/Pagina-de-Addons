const state = { addons: [], category: "Todas", query: "" };
const $ = (s) => document.querySelector(s);
const normalize = (s) => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function getCategories(addons) {
  return [...new Set(addons.map(a => a.categoria).filter(Boolean))].sort((a,b) => a.localeCompare(b, "es"));
}
function matches(addon) {
  const query = normalize(state.query);
  const categoryOk = state.category === "Todas" || addon.categoria === state.category;
  const haystack = normalize([addon.nombre, addon.descripcion, addon.categoria, ...(addon.palabrasClave || [])].join(" "));
  return categoryOk && (!query || haystack.includes(query));
}
function artClass(addon) {
  const sum = [...addon.id].reduce((n,c) => n + c.charCodeAt(0), 0);
  return `art-${sum % 4}`;
}
function card(addon) {
  const keywords = (addon.palabrasClave || []).slice(0,3).map(k => `<span class="tag">${escapeHtml(k)}</span>`).join("");
  const hasDownload = typeof addon.descarga === "string" && addon.descarga.trim() && addon.descarga.trim() !== "#";
  const download = hasDownload
    ? `<a class="download-btn" href="${escapeAttr(addon.descarga)}" download>↓ Descargar addon</a>`
    : `<span class="download-btn disabled" aria-disabled="true" title="Añade el enlace de descarga en data/addons.json">Enlace de descarga pendiente</span>`;
  const art = addon.imagen
    ? `<div class="addon-art"><img src="${escapeAttr(addon.imagen)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></div>`
    : `<div class="addon-art ${artClass(addon)}"><span class="addon-glyph" aria-hidden="true">${iconFor(addon.categoria)}</span></div>`;
  return `<article class="addon-card">
    ${art}<div class="addon-body">
      <div class="addon-title-row"><h3>${escapeHtml(addon.nombre)}</h3><span class="badge">${escapeHtml(addon.categoria || "Addon")}</span></div>
      <div class="tag-row">${keywords}</div>
      <p>${escapeHtml(addon.descripcion || "Descripción pendiente.")}</p>
      <div class="card-bottom"><span class="version-text">Cliente ${escapeHtml(addon.versionJuego || "3.3.5a")} · Addon ${escapeHtml(addon.versionAddon || "sin confirmar")}</span></div>
      ${download}
    </div></article>`;
}
function iconFor(category) {
  if (/bolsa|inventario/i.test(category)) return "▦";
  if (/combate|estad/i.test(category)) return "◈";
  if (/mapa|recole/i.test(category)) return "⌖";
  if (/raid|jefe/i.test(category)) return "✹";
  if (/misiones/i.test(category)) return "⚑";
  if (/profesiones|subasta/i.test(category)) return "⚒";
  if (/interfaz/i.test(category)) return "✧";
  return "✦";
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(value) { return escapeHtml(value); }

function renderCategories() {
  const categories = getCategories(state.addons);
  $("#total-count").textContent = state.addons.length;
  $("#category-list").innerHTML = categories.map(cat => {
    const count = state.addons.filter(a => a.categoria === cat).length;
    return `<button class="category ${state.category === cat ? "active" : ""}" data-category="${escapeAttr(cat)}">✦ <span>${escapeHtml(cat)}</span><b>${count}</b></button>`;
  }).join("");
  document.querySelectorAll("[data-category]").forEach(btn => btn.classList.toggle("active", btn.dataset.category === state.category));
}
function render() {
  const filtered = state.addons.filter(matches);
  const sorted = [...filtered].sort((a,b) => {
    if ($("#sort-select").value === "category") return (a.categoria || "").localeCompare(b.categoria || "", "es") || a.nombre.localeCompare(b.nombre, "es");
    return a.nombre.localeCompare(b.nombre, "es");
  });
  const featured = sorted.filter(a => a.destacado).slice(0,3);
  $("#featured-grid").innerHTML = featured.map(card).join("");
  $("#featured-grid").style.display = featured.length ? "grid" : "none";
  $("#addon-grid").innerHTML = sorted.map(card).join("");
  $("#results-count").textContent = sorted.length;
  $("#results-summary").textContent = `Mostrando ${sorted.length} de ${state.addons.length} addons.`;
  $("#empty-state").hidden = sorted.length !== 0;
  renderCategories();
}
async function init() {
  try {
    const response = await fetch("data/addons.json");
    if (!response.ok) throw new Error("No se pudo cargar data/addons.json");
    state.addons = await response.json();
    render();
  } catch (error) {
    $("#results-summary").textContent = "No se pudo cargar el catálogo. Abre la página desde un servidor web y verifica que exista data/addons.json.";
    $("#empty-state").hidden = false;
    $("#empty-state h3").textContent = "No se pudo cargar el catálogo";
    $("#empty-state p").textContent = "Por seguridad, algunos navegadores bloquean la lectura de JSON si abres index.html directamente como archivo. Sube el sitio a tu servidor o ejecútalo con un servidor local.";
  }
}
$("#search-form").addEventListener("submit", e => { e.preventDefault(); state.query = $("#search-input").value; render(); });
$("#search-input").addEventListener("input", e => { state.query = e.target.value; render(); });
$("#sort-select").addEventListener("change", render);
document.addEventListener("click", e => {
  const cat = e.target.closest("[data-category]");
  if (cat) { state.category = cat.dataset.category; render(); }
  const tag = e.target.closest("[data-tag]");
  if (tag) { $("#search-input").value = tag.dataset.tag; state.query = tag.dataset.tag; render(); }
});
function resetFilters() { state.category = "Todas"; state.query = ""; $("#search-input").value = ""; render(); }
$("#clear-filters").addEventListener("click", resetFilters);
$("#empty-reset").addEventListener("click", resetFilters);
init();
