"use strict";
/* ================= Datos iniciales (del PDF de Waitiki Terraza) ================= */
const SEED = [
  ['DIALSUR', null, [['Almendras', 6]]],
  ['FRIPOZO', null, [['Solomillo de pollo rebozado', 2]]],
  ['COCINA MEDITERRÁNEA', null, [['Caballito XL', 2.5], ['Mini pastel de carne', 1], ['Buñuelo de bacalao', 1], ['Costillar de cerdo a la BBQ', 8], ['Pollo Tikka Masala', 2], ['Alcachofa flor', 2], ['Solomillo de cerdo al PX', 4], ['Tarta de la abuela', 1], ['Tiramisú', 1], ['Tarta 3 chocolates', 1]]],
  ['JASA', null, [['Croquetón jamón', 2], ['Croqueta langostino y vieira', 1], ['Croquetón pollo', 1], ['Dátiles con bacon', 1], ['Brocheta Yakitori', 1], ['Brocheta secreto y boletus', 1], ['Tortillón de patatas', 5], ['Gilda cecina', 2], ['Pulled Pork', 8], ['Salchicha murciana', 1], ['Chorizo criollo', 1], ['Chimichurri', 2]]],
  ['ANGEL LINARES', null, [['Pan montadito', 3], ['Cheddar líquido', 2]]],
  ['PUKA', null, [['Empanada argentina pollo', 20], ['Empanada argentina ternera', 30], ['Empanada vegana', 0]]],
  ['MAKRO', 'Limpieza', [['Papel cocina', 3], ['Detergente lavavajillas', 2], ['Abrillantador lavavajillas', 2], ['Fairy', 1], ['Bayetas', 1], ['Estropajo hierro', 1], ['Estropajo normal verde', 2], ['Guantes negros', 3], ['Limpiacristales', 1], ['Fregona', 3]]],
  ['MAKRO', 'Despensa', [['Galleta Lotus picada', 1], ['Sirope chocolate blanco', 1], ['Sirope Nutella', 1], ['Aceite Arbequina 5L', 1], ['Picos', 3], ['Pan perrito caliente', 2], ['Nueces', 1], ['Pesto', 2], ['Vinagre de Módena', 1], ['Trufa', 2], ['Mayonesa Hellmann\x27s', 2], ['Mayonesa Ybarra', 2]]],
  ['MAKRO', 'Conservas y encurtidos', [['Picadillo ensaladilla', 2], ['Pepinillos picados perrito', 1], ['Aceitunas partidas', 1], ['Alcaparras', 1], ['Atún', 5]]],
  ['MAKRO', 'Especias y toppings', [['Orégano', 1], ['Eneldo', 1], ['Pimentón', 1], ['Salsa Teriyaki', 1], ['Cebolla crujiente', 2], ['Pimiento asado', 1], ['Tomate seco', 1], ['Cebolla caramelizada', 5]]],
  ['MAKRO', 'Carnes y embutidos', [['Chorizos picantes', 1], ['Lomo 5mm', 1], ['Pincho cerdo curry (Andaluz)', 1], ['Mousse de pato (foie)', 1], ['Sobrasada', 3], ['Salchicha seca', 5], ['Salchicha perrito', 8], ['Bacon taco', 2], ['Jamón viruta 1kg', 1]]],
  ['MAKRO', 'Quesos', [['Burrata', 5], ['Queso manchego curado', 2], ['Queso fresco', 5], ['Crema camembert', 5], ['Queso crema', 2]]],
  ['MAKRO', 'Pescado y marisco', [['Langostino cocido', 1], ['Mejillones cocidos ración', 0], ['Patas de pulpo', 2], ['Anchoas', 6], ['Boquerones', 2], ['Gilda tradicional', 2], ['Gilda de queso fresco', 2], ['Salmón ahumado', 1], ['Perlas negras', 2], ['Alioli casero', 1], ['Bonito', 1]]],
  ['MAKRO', 'Fruta y verdura', [['Tomate rallado', 5], ['Tomates', 0], ['Tomate cherry', 2], ['Mezcla de lechugas', 2], ['Canónigos', 2], ['Mango', 1], ['Aguacates', 1]]],
  ['MAKRO', 'Panadería', [['Bao', 12]]],
];
// Días de pedido y entrega (0 = lunes … 6 = domingo)
const SCHEDULE = {
  'DIALSUR': { o: [0], d: [2] },
  'FRIPOZO': { o: [6], d: [2] },
  'COCINA MEDITERRÁNEA': { o: [6, 2], d: [1, 4] },
  'JASA': { o: [6, 3], d: [1, 4] },
  'ANGEL LINARES': { o: [6], d: [2] },
  'PUKA': { o: [0, 3], d: [2, 5] },
  'MAKRO': { o: [6, 3], d: [1, 4] },
};
const COLORS = ['#0f5c4d', '#b8862f', '#9a3b3b', '#3b5b9a', '#6b4a9a', '#2f7a7a', '#a0522d', '#4a6b2f', '#8a3a6b', '#35505f'];

const KEY = 'waitiki-inventario-v2';
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function slug(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function seedState() {
  const suppliers = [], products = [];
  SEED.forEach(([sName, cat, items]) => {
    let s = suppliers.find(x => x.name === sName);
    if (!s) {
      const sc = SCHEDULE[sName] || { o: [], d: [] };
      s = { id: 's-' + slug(sName), name: sName, phone: '', email: '', color: COLORS[suppliers.length % COLORS.length],
        orderDays: [...sc.o], deliveryDays: [...sc.d], areas: ['cocina'] };
      suppliers.push(s);
    }
    // IDs fijos (no aleatorios): así el móvil del encargado y el del responsable reconocen los mismos productos
    items.forEach(([n, ideal, unit]) => products.push({ id: 'p-' + slug(sName + '-' + n), name: n, sup: s.id, area: 'cocina', cat: cat || '', ideal: ideal ?? null, unit: unit || '', current: null }));
  });
  return {
    v: 2, biz: 'Waitiki Terraza',
    greeting: 'Hola, buenos días. Os paso pedido de Waitiki Caña y Tapa:',
    bye: 'Muchas gracias.',
    suppliers, products, collapsed: {}, filter: 'all'
  };
}

let S;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
if (!S || !Array.isArray(S.products)) S = seedState();
let editing = false, query = '';
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
/* ================= Seguridad: limpiar todo dato que entra =================
   Los datos pueden venir de un enlace de WhatsApp, de un archivo importado o del almacenamiento.
   Nada se usa sin pasar por aquí: solo texto plano, números válidos, colores y códigos con formato fijo. */
const arr = v => Array.isArray(v) ? v : [];
const cleanId = v => String(v ?? '').replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 100) || 'x-' + Math.random().toString(36).slice(2, 8);
const cleanStr = (v, n = 200) => String(v ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, n);
const cleanText = (v, n = 500) => String(v ?? '').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ').slice(0, n);
const cleanNum = v => { const n = Number(v); return v !== null && v !== '' && Number.isFinite(n) && n >= 0 && n < 1e7 ? n : null; };
const cleanColor = (v, i) => /^#[0-9a-fA-F]{6}$/.test(v) ? v : COLORS[i % COLORS.length];
const cleanDays = a => [...new Set(arr(a).map(Number).filter(d => Number.isInteger(d) && d >= 0 && d <= 6))];
const cleanPhone = v => String(v ?? '').replace(/\D/g, '').slice(0, 15);
const cleanEmail = v => { const s = cleanStr(v, 120).trim(); return /^[^\s@<>"'`]+@[^\s@<>"'`]+\.[^\s@<>"'`]+$/.test(s) ? s : ''; };
const cleanDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
const cleanKey = v => typeof v === 'string' && /^[A-Za-z0-9_-]{43}$/.test(v) ? v : undefined;

function migrate() {
  if (!S || typeof S !== 'object' || Array.isArray(S)) S = seedState();
  S.areas = (arr(S.areas).length ? arr(S.areas) : [{ id: 'cocina', name: 'Cocina' }, { id: 'barra', name: 'Barra' }])
    .slice(0, 10).map(a => ({ id: cleanId(a && a.id), name: cleanStr(a && a.name, 40) || 'Sección' }));
  const areaIds = new Set(S.areas.map(a => a.id));
  const fixArea = a => areaIds.has(a) ? a : (areaIds.has('cocina') ? 'cocina' : S.areas[0].id);
  S.suppliers = arr(S.suppliers).slice(0, 500).filter(s => s && typeof s === 'object').map((s, i) => ({
    id: cleanId(s.id), name: cleanStr(s.name, 80) || 'PROVEEDOR', phone: cleanPhone(s.phone), email: cleanEmail(s.email),
    color: cleanColor(s.color, i), orderDays: cleanDays(s.orderDays), deliveryDays: cleanDays(s.deliveryDays),
    areas: [...new Set((arr(s.areas).length ? arr(s.areas) : ['cocina']).map(fixArea))] }));
  const supIds = new Set(S.suppliers.map(s => s.id));
  S.products = arr(S.products).slice(0, 5000).filter(p => p && typeof p === 'object').map(p => ({
    id: cleanId(p.id), name: cleanStr(p.name, 120) || 'Producto', sup: cleanId(p.sup), area: fixArea(p.area || 'cocina'),
    cat: cleanStr(p.cat, 60), ideal: cleanNum(p.ideal), unit: cleanStr(p.unit, 20), current: cleanNum(p.current) }))
    .filter(p => supIds.has(p.sup));
  S.orders = arr(S.orders).slice(-500).filter(o => o && cleanDate(o.date) && supIds.has(cleanId(o.sup))).map(o => ({
    id: cleanId(o.id), sup: cleanId(o.sup), area: fixArea(o.area || 'cocina'), date: o.date, delivery: cleanDate(o.delivery),
    receivedAt: cleanDate(o.receivedAt), status: o.status === 'pending' ? 'pending' : 'received',
    lines: arr(o.lines).slice(0, 1000).filter(l => l && typeof l === 'object')
      .map(l => ({ pid: cleanId(l.pid), name: cleanStr(l.name, 120), qty: cleanNum(l.qty) ?? 0, unit: cleanStr(l.unit, 20) })) }));
  S.biz = cleanStr(S.biz, 60) || 'Mi negocio';
  S.greeting = cleanText(S.greeting, 300); S.bye = cleanText(S.bye, 200);
  S.ownerPhone = cleanPhone(S.ownerPhone); S.me = cleanStr(S.me, 40);
  S.role = S.role === 'owner' || S.role === 'staff' ? S.role : undefined;
  S.teamKey = cleanKey(S.teamKey);
  S.view = S.view === 'cal' ? 'cal' : 'count';
  S.filter = ['all', 'pending', 'order', 'noideal'].includes(S.filter) ? S.filter : 'all';
  const col = {}; Object.entries(S.collapsed && typeof S.collapsed === 'object' ? S.collapsed : {}).forEach(([k, v]) => { if (supIds.has(k)) col[k] = !!v; });
  S.collapsed = col;
  const rv = {}; Object.entries(S.recv && typeof S.recv === 'object' ? S.recv : {}).forEach(([k, v]) => {
    if (areaIds.has(k) && v && Number.isFinite(+v.t)) rv[k] = { by: cleanStr(v.by, 40), t: +v.t, ok: v.ok === true }; });
  S.recv = rv;
  if (!areaIds.has(S.area)) S.area = S.areas[0].id;
}
migrate();
/* Todo lo que se ve está filtrado por la sección actual (Cocina / Barra) */
const AP = () => S.products.filter(p => p.area === S.area);
const AS = () => S.suppliers.filter(s => s.areas.includes(S.area));
const AO = () => S.orders.filter(o => o.area === S.area);
const APend = () => AO().filter(o => o.status === 'pending');
const areaName = () => S.areas.find(a => a.id === S.area)?.name || '';
function newSupplier(name) {
  const s = { id: uid(), name: name.trim().toUpperCase(), phone: '', email: '', color: COLORS[S.suppliers.length % COLORS.length],
    orderDays: [], deliveryDays: [], areas: [S.area] };
  S.suppliers.push(s); return s;
}
let weekOffset = 0;

/* ================= Fechas y calendario ================= */
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const wd = d => (d.getDay() + 6) % 7;               // 0 = lunes
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const today = () => { const x = new Date(); x.setHours(0, 0, 0, 0); return x; };
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const diffDays = d => Math.round((d - today()) / 864e5);
const shortDay = d => { const k = diffDays(d); return k === 0 ? 'hoy' : k === 1 ? 'mañana' : DAYS[wd(d)].slice(0, 3).toLowerCase() + ' ' + d.getDate(); };
const longDay = d => { const k = diffDays(d); const base = `${DAYS[wd(d)].toLowerCase()} ${d.getDate()}/${d.getMonth() + 1}`; return k === 0 ? 'hoy, ' + base : k === 1 ? 'mañana, ' + base : base; };
function nextOrderDate(s, from = today()) {
  for (let i = 0; i < 7; i++) { const d = addDays(from, i); if (s.orderDays.includes(wd(d))) return d; }
  return null;
}
function deliveryAfter(s, orderDate) {
  if (!orderDate) return null;
  for (let i = 1; i <= 7; i++) { const d = addDays(orderDate, i); if (s.deliveryDays.includes(wd(d))) return d; }
  return null;
}
const pending = () => S.orders.filter(o => o.status === 'pending');
function incoming(p) {
  let q = 0, date = null;
  pending().forEach(o => o.lines.forEach(l => {
    if (l.pid === p.id) { q += l.qty; if (o.delivery && (!date || o.delivery < date)) date = o.delivery; }
  }));
  return { q, date };
}

/* ================= Utilidades ================= */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = v => { if (v === '' || v === null || v === undefined) return null; const n = parseFloat(String(v).replace(',', '.')); return isNaN(n) ? null : Math.max(0, n); };
const fmt = n => n === null || n === undefined ? '' : (Number.isInteger(n) ? String(n) : String(+n.toFixed(2)).replace('.', ','));
// Lo que falta = ideal − lo que hay − lo que ya está pedido y en camino
const need = p => (p.ideal === null || p.current === null) ? null : Math.max(0, +(p.ideal - p.current - incoming(p).q).toFixed(3));
const sup = id => S.suppliers.find(s => s.id === id);
const initials = n => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 1800); }
const ICON_DEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>';
const ICON_CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

$('today').textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

/* ================= Render ================= */
function pillHTML(p) {
  if (p.ideal === null) return ['idle', 'Sin ideal'];
  const n = need(p), inc = incoming(p);
  const onWay = `En camino ${fmt(inc.q)}${inc.date ? ' · ' + shortDay(fromIso(inc.date)) : ''}`;
  if (n > 0) return ['warn', `Pedir ${fmt(n)}${p.unit ? ' ' + p.unit : ''}`];
  if (inc.q) return ['info', onWay];
  if (n === null) return ['idle', 'Contar'];
  return ['ok', '✓ OK'];
}
function itemState(p) { const n = need(p); if (n > 0) return 'need'; if (incoming(p).q) return 'incoming'; return n === 0 ? 'ok' : ''; }

function visible(p) {
  if (query && !norm(p.name).includes(query) && !norm(p.cat || '').includes(query)) return false;
  if (S.filter === 'pending') return p.current === null;
  if (S.filter === 'order') return (need(p) || 0) > 0;
  if (S.filter === 'noideal') return p.ideal === null;
  return true;
}

function itemHTML(p) {
  const [pc, pt] = pillHTML(p);
  return `<div class="item ${itemState(p)}" data-id="${p.id}">
    <div class="item-main">
      <div class="item-name">${esc(p.name)}</div>
      ${p.unit ? `<div class="item-meta">${esc(p.unit)}</div>` : ''}
    </div>
    <label class="field f-ideal"><span>Ideal</span>
      <input class="num ideal ${p.ideal === null ? 'missing' : ''}" data-f="ideal" inputmode="decimal" value="${fmt(p.ideal)}" placeholder="—"${S.role === 'staff' ? ' readonly tabindex="-1"' : ''}></label>
    <div class="field f-cur"><span>Hay</span>
      <div class="stepper">
        <button type="button" data-act="dec" aria-label="Restar">−</button>
        <input class="num" data-f="current" inputmode="decimal" value="${fmt(p.current)}" placeholder="—">
        <button type="button" data-act="inc" aria-label="Sumar">+</button>
      </div>
    </div>
    <div class="pill ${pc}">${pt}</div>
    <button class="del" data-act="del" title="Eliminar">${ICON_DEL}</button>
  </div>`;
}

function supStats(s) {
  const ps = AP().filter(p => p.sup === s.id);
  const counted = ps.filter(p => p.current !== null).length;
  const toOrder = ps.filter(p => (need(p) || 0) > 0).length;
  return { total: ps.length, counted, toOrder };
}
function supHeadInner(s) {
  const st = supStats(s);
  const pct = st.total ? Math.round(st.counted / st.total * 100) : 0;
  const badge = st.toOrder ? `<span class="badge warn">${st.toOrder} a pedir</span>`
    : (st.counted === st.total && st.total ? `<span class="badge ok">Completo</span>` : `<span class="badge idle">${st.total} producto${st.total === 1 ? '' : 's'}</span>`);
  return `<div class="avatar" style="background:${s.color}">${esc(initials(s.name))}</div>
    <div class="sup-info">
      <div class="sup-name">${esc(s.name)}</div>
      <div class="sup-sub">${st.counted} de ${st.total} contados${schedText(s)}</div>
      <div class="bar"><span style="width:${pct}%"></span></div>
    </div>${badge}${ICON_CHEV}`;
}

function renderList() {
  const html = AS().map(s => {
    const ps = AP().filter(p => p.sup === s.id && visible(p));
    if (!ps.length && (query || S.filter !== 'all')) return '';
    const collapsed = S.collapsed[s.id] && !query;
    let body = '', lastCat = null;
    ps.forEach(p => {
      if ((p.cat || '') !== lastCat) { lastCat = p.cat || ''; if (lastCat) body += `<div class="cat">${esc(lastCat)}</div>`; }
      body += itemHTML(p);
    });
    if (!ps.length) body = `<div class="item"><div class="muted">Sin productos. Añade uno con el botón +.</div></div>`;
    return `<section class="supplier ${collapsed ? 'collapsed' : ''}" data-sup="${s.id}">
      <button class="sup-head" type="button" data-act="toggle">${supHeadInner(s)}</button>
      <div class="items">${body}</div>
    </section>`;
  }).join('');
  $('list').innerHTML = html || (AS().length
    ? `<div class="empty-state">No hay productos que coincidan.</div>`
    : `<div class="empty-state"><h3>${esc(areaName())} está vacía</h3>Añade los proveedores y productos de ${esc(areaName().toLowerCase())}.<br>
        <button class="btn" type="button" data-empty="sup">Añadir proveedor</button><button class="btn primary" type="button" data-empty="prod">Añadir producto</button></div>`);
  $('toggleAll').textContent = AS().every(s => S.collapsed[s.id]) ? 'Desplegar todo' : 'Plegar todo';
}

function renderStats() {
  const total = AP().length;
  const counted = AP().filter(p => p.current !== null).length;
  const order = AP().filter(p => (need(p) || 0) > 0);
  const missing = AP().filter(p => p.ideal === null).length;
  const pct = total ? counted / total : 0;
  $('ringBar').style.strokeDashoffset = 213.6 * (1 - pct);
  $('ringText').textContent = Math.round(pct * 100) + '%';
  $('statCounted').textContent = `${counted} / ${total}`;
  $('statOrder').textContent = order.length;
  const sups = new Set(order.map(p => p.sup)).size;
  $('statOrderHint').textContent = order.length ? `de ${sups} proveedor${sups > 1 ? 'es' : ''}` : 'productos';
  $('statMissing').textContent = missing;

  const chips = [['all', 'Todos', total], ['pending', 'Por contar', total - counted], ['order', 'A pedir', order.length], ['noideal', 'Sin ideal', missing]];
  $('chips').innerHTML = chips.map(([k, l, n]) => `<button class="chip ${S.filter === k ? 'active' : ''}" data-filter="${k}">${l}<span class="n">${n}</span></button>`).join('');

  $('orderBtn').disabled = !order.length;
  $('dockTitle').textContent = order.length ? `${order.length} producto${order.length > 1 ? 's' : ''} por pedir` : 'Nada que pedir todavía';
  $('dockSub').textContent = order.length ? `${sups} proveedor${sups > 1 ? 'es' : ''} · listo para enviar` : (missing ? 'Configura el stock ideal y rellena «Hay»' : 'Rellena «Hay» en cada producto');
  if (S.role === 'staff') {
    $('dockTitle').textContent = `${counted} de ${total} contados`;
    $('dockSub').textContent = counted < total ? `${areaName()} · envíalo al terminar` : '¡Completo! Ya puedes enviarlo';
  }
  const rv = S.recv && S.recv[S.area];
  $('countHint').textContent = rv && S.role !== 'staff'
    ? `Recibido de ${rv.by}${rv.ok ? ' ✓' : ''} · ${shortDay(new Date(new Date(rv.t).setHours(0, 0, 0, 0)))} ${new Date(rv.t).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
    : 'productos contados';
}

function schedText(s) {
  const nx = nextOrderDate(s); if (!nx) return '';
  const dv = deliveryAfter(s, nx);
  return ` · pide ${shortDay(nx)}${dv ? ' → llega ' + shortDay(dv) : ''}`;
}

function renderAll() {
  $('bizName').textContent = S.biz;
  document.body.classList.toggle('staff', S.role === 'staff');
  if (S.role === 'staff') S.view = 'count';
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === S.view));
  $('viewCount').classList.toggle('hidden', S.view !== 'count');
  $('viewCal').classList.toggle('hidden', S.view !== 'cal');
  const np = APend().length;
  $('calDot').textContent = np; $('calDot').classList.toggle('hidden', !np);
  renderAreas(); renderList(); renderStats(); renderToday();
  if (S.view === 'cal') renderCal();
}
const IC_AREA = {
  cocina: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><path d="M6 17h12"/></svg>',
  barra: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8M12 11v11M19 3l-7 8-7-8Z"/><path d="M7 6h10"/></svg>'
};
function renderAreas() {
  $('areaSwitch').innerHTML = S.areas.map(a => {
    const n = S.products.filter(p => p.area === a.id && (need(p) || 0) > 0).length;
    return `<button class="area ${a.id === S.area ? 'active' : ''}" role="tab" aria-selected="${a.id === S.area}" data-area="${a.id}">${IC_AREA[a.id] || ''}${esc(a.name)}${n ? ` <small>· ${n}</small>` : ''}</button>`;
  }).join('');
  document.title = `${areaName()} · Inventario`;
}
$('areaSwitch').addEventListener('click', e => {
  const a = e.target.closest('[data-area]')?.dataset.area; if (!a || a === S.area) return;
  S.area = a; S.filter = 'all'; query = ''; $('search').value = ''; weekOffset = 0;
  save(); renderAll();
});
$('list').addEventListener('click', e => {
  const b = e.target.closest('[data-empty]'); if (!b) return;
  if (b.dataset.empty === 'prod') openAdd();
  else { $('settingsBtn').click(); setTimeout(() => $('newSupName').focus(), 50); }
});

/* Actualiza una fila sin re-renderizar (no perder el foco) */
function refreshItem(p) {
  const el = document.querySelector(`.item[data-id="${p.id}"]`);
  if (el) {
    el.className = 'item ' + itemState(p);
    const [pc, pt] = pillHTML(p);
    const pill = el.querySelector('.pill'); pill.className = 'pill ' + pc; pill.textContent = pt;
    el.querySelector('.ideal').classList.toggle('missing', p.ideal === null);
  }
  const sec = document.querySelector(`.supplier[data-sup="${p.sup}"] .sup-head`);
  if (sec) sec.innerHTML = supHeadInner(sup(p.sup));
  renderStats(); renderAreas();
}

/* ================= Eventos de la lista ================= */
const prodOf = el => S.products.find(p => p.id === el.closest('.item')?.dataset.id);

$('list').addEventListener('input', e => {
  const f = e.target.dataset.f; if (!f) return;
  const p = prodOf(e.target); if (!p) return;
  p[f] = num(e.target.value);
  save(); refreshItem(p);
});
$('list').addEventListener('change', e => {
  const f = e.target.dataset.f; if (!f) return;
  const p = prodOf(e.target); if (p) e.target.value = fmt(p[f]);
});
$('list').addEventListener('keydown', e => {
  if (e.key !== 'Enter' || !e.target.dataset.f) return;
  e.preventDefault();
  const all = [...document.querySelectorAll(`#list [data-f="${e.target.dataset.f}"]`)];
  const next = all[all.indexOf(e.target) + 1];
  if (next) { next.focus(); next.select(); } else e.target.blur();
});
$('list').addEventListener('focusin', e => { if (e.target.dataset.f) e.target.select(); });
$('list').addEventListener('click', e => {
  const btn = e.target.closest('[data-act]'); if (!btn) return;
  const act = btn.dataset.act;
  if (act === 'toggle') {
    const id = btn.closest('.supplier').dataset.sup;
    S.collapsed[id] = !S.collapsed[id]; save();
    btn.closest('.supplier').classList.toggle('collapsed', S.collapsed[id]);
    $('toggleAll').textContent = AS().every(s => S.collapsed[s.id]) ? 'Desplegar todo' : 'Plegar todo';
    return;
  }
  const p = prodOf(btn); if (!p) return;
  if (act === 'inc' || act === 'dec') {
    p.current = act === 'inc' ? (p.current ?? 0) + 1 : Math.max(0, (p.current ?? 1) - 1);
    btn.parentElement.querySelector('.num').value = fmt(p.current);
    save(); refreshItem(p);
  } else if (act === 'del') {
    if (!confirm(`¿Eliminar «${p.name}»?`)) return;
    S.products = S.products.filter(x => x !== p); save(); renderAll();
  }
});

$('chips').addEventListener('click', e => { const k = e.target.closest('[data-filter]')?.dataset.filter; if (k) { S.filter = k; save(); renderAll(); } });
$('search').addEventListener('input', e => { query = norm(e.target.value.trim()); renderList(); });
$('editToggle').addEventListener('click', () => {
  editing = !editing; document.body.classList.toggle('editing', editing);
  $('editToggle').classList.toggle('active', editing);
});
$('toggleAll').addEventListener('click', () => {
  const collapse = !AS().every(s => S.collapsed[s.id]);
  AS().forEach(s => S.collapsed[s.id] = collapse); save(); renderList();
});

/* ================= Diálogos ================= */
document.querySelectorAll('dialog').forEach(d => {
  d.addEventListener('click', e => {
    if (d.id === 'welcomeDlg') return;  // la bienvenida no se cierra sin elegir
    if (e.target === d || e.target.closest('[data-close]')) d.close();
  });
});

/* ---- Pedido ---- */
function orderFor(s) {
  return AP().filter(p => p.sup === s.id && (need(p) || 0) > 0);
}
function messageFor(s) {
  const lines = orderFor(s).map(p => `• ${p.name}: ${fmt(need(p))}${p.unit ? ' ' + p.unit : ''}`);
  const dv = deliveryAfter(s, today());
  const when = dv ? `\n\nEntrega: ${DAYS[wd(dv)].toLowerCase()} ${dv.getDate()}/${dv.getMonth() + 1}` : '';
  return `${S.greeting}\n\n${lines.join('\n')}${when}\n\n${S.bye}`.trim();
}
function orderMeta(s) {
  const t = today(), tags = [];
  if (s.orderDays.includes(wd(t))) tags.push('<span class="tag green">Hoy toca pedido</span>');
  else { const nx = nextOrderDate(s); tags.push(nx ? `<span class="tag">Día de pedido: ${shortDay(nx)}</span>` : '<span class="tag idle">Sin días programados</span>'); }
  const dv = deliveryAfter(s, t);
  if (dv) tags.push(`<span class="tag green">Si pides hoy llega ${shortDay(dv)}</span>`);
  return `<div class="order-meta">${tags.join('')}</div>`;
}
function markSent(s) {
  const t = today(), dv = deliveryAfter(s, t);
  const lines = orderFor(s).map(p => ({ pid: p.id, name: p.name, qty: need(p), unit: p.unit }));
  if (!lines.length) return;
  S.orders.push({ id: uid(), sup: s.id, area: S.area, date: iso(t), delivery: dv ? iso(dv) : null, lines, status: 'pending' });
  save(); renderAll();
  toast(dv ? `Pedido registrado · llega ${shortDay(dv)}` : 'Pedido registrado');
}
function openOrder() {
  const isToday = s => s.orderDays.includes(wd(today())) ? 0 : 1;
  const sups = AS().filter(s => orderFor(s).length).sort((a, b) => isToday(a) - isToday(b));
  if (!sups.length) { if ($('orderDlg').open) $('orderDlg').close(); return; }
  $('orderBody').innerHTML = (sups.length > 1 ? `<div class="dlg-actions" style="margin:0 0 14px; justify-content:flex-start"><button class="btn small" data-copyall>Copiar todos los pedidos</button></div>` : '') +
    sups.map(s => `<div class="order-card" data-sup="${s.id}">
      <div class="sup-head"><div class="avatar" style="background:${s.color}">${esc(initials(s.name))}</div>
        <div class="sup-info"><div class="sup-name">${esc(s.name)}</div><div class="sup-sub">${orderFor(s).length} producto${orderFor(s).length === 1 ? '' : 's'}${s.phone ? ' · ' + esc(s.phone) : ''}</div></div></div>
      ${orderMeta(s)}
      <ul class="order-lines">${orderFor(s).map(p => `<li><span>${esc(p.name)}</span><b>${fmt(need(p))}${p.unit ? ' ' + esc(p.unit) : ''}</b></li>`).join('')}</ul>
      <div class="order-actions">
        <button class="btn small" data-o="copy">Copiar mensaje</button>
        <button class="btn small wa" data-o="wa">WhatsApp</button>
        <button class="btn small" data-o="mail">Email</button>
        <button class="btn small primary" data-o="sent" title="Guarda el pedido como enviado: pasa a «En camino» y aparece en el calendario">✓ Marcar enviado</button>
      </div>
    </div>`).join('');
  if (!$('orderDlg').open) $('orderDlg').showModal();
}
async function copy(text) {
  try { await navigator.clipboard.writeText(text); }
  catch (e) { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
  toast('Mensaje copiado');
}
$('orderBtn').addEventListener('click', openOrder);
$('orderBody').addEventListener('click', e => {
  if (e.target.closest('[data-copyall]')) {
    copy(AS().filter(s => orderFor(s).length).map(s => `*${s.name}*\n` + orderFor(s).map(p => `• ${p.name}: ${fmt(need(p))}${p.unit ? ' ' + p.unit : ''}`).join('\n')).join('\n\n'));
    return;
  }
  const b = e.target.closest('[data-o]'); if (!b) return;
  const s = sup(b.closest('.order-card').dataset.sup), msg = messageFor(s);
  if (b.dataset.o === 'sent') { markSent(s); openOrder(); return; }
  if (b.dataset.o === 'copy') copy(msg);
  if (b.dataset.o === 'wa') window.open(`https://wa.me/${(s.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  if (b.dataset.o === 'mail') location.href = `mailto:${encodeURIComponent(s.email || '')}?subject=${encodeURIComponent('Pedido ' + S.biz)}&body=${encodeURIComponent(msg)}`;
});

/* ---- Añadir producto ---- */
function fillSupSelect() {
  const mine = AS(), others = S.suppliers.filter(s => !mine.includes(s));
  const opt = s => `<option value="${s.id}">${esc(s.name)}</option>`;
  $('aSup').innerHTML = `<option value="__new">+ Nuevo proveedor…</option>` +
    (mine.length ? `<optgroup label="${esc(areaName())}">${mine.map(opt).join('')}</optgroup>` : '') +
    (others.length ? `<optgroup label="Otras secciones">${others.map(opt).join('')}</optgroup>` : '');
  if (mine.length) $('aSup').value = mine[0].id;
  $('aNewSupWrap').classList.toggle('hidden', $('aSup').value !== '__new');
  $('catList').innerHTML = [...new Set(AP().map(p => p.cat).filter(Boolean))].map(c => `<option value="${esc(c)}">`).join('');
}
function openAdd(supId) {
  $('addForm').reset(); fillSupSelect();
  if (supId) $('aSup').value = supId;
  $('aNewSupWrap').classList.toggle('hidden', $('aSup').value !== '__new');
  $('addTitle').textContent = `Nuevo producto · ${areaName()}`;
  $('addDlg').showModal(); $('aName').focus();
}
$('addBtn').addEventListener('click', () => openAdd());
$('aSup').addEventListener('change', () => $('aNewSupWrap').classList.toggle('hidden', $('aSup').value !== '__new'));
$('addForm').addEventListener('submit', e => {
  e.preventDefault();
  let supId = $('aSup').value;
  if (supId === '__new') {
    const name = $('aNewSup').value.trim(); if (!name) { $('aNewSup').focus(); return; }
    supId = newSupplier(name).id;
  }
  const s = sup(supId); if (!s.areas.includes(S.area)) s.areas.push(S.area);
  const p = { id: uid(), name: $('aName').value.trim(), sup: supId, area: S.area, cat: $('aCat').value.trim(), ideal: num($('aIdeal').value), unit: $('aUnit').value.trim(), current: null };
  // Insertar tras el último producto de la misma categoría/proveedor en esta sección
  let idx = -1;
  S.products.forEach((x, i) => { if (x.sup === supId && x.area === S.area && (!p.cat || x.cat === p.cat)) idx = i; });
  if (idx === -1) S.products.forEach((x, i) => { if (x.sup === supId && x.area === S.area) idx = i; });
  idx === -1 ? S.products.push(p) : S.products.splice(idx + 1, 0, p);
  S.collapsed[supId] = false;
  save(); renderAll(); $('addDlg').close(); toast('Producto añadido');
});

/* ---- Ajustes ---- */
function renderSupList() {
  $('supTitle').textContent = `Proveedores de ${areaName()} · teléfono para WhatsApp y email`;
  $('supList').innerHTML = (AS().length ? '' : `<p class="muted">Aún no hay proveedores en ${esc(areaName())}.</p>`) + AS().map(s => `<div class="sup-row" data-sup="${s.id}">
    <div class="avatar" style="background:${s.color}">${esc(initials(s.name))}</div>
    <div class="nm"><span>${esc(s.name)}</span><button class="btn small ghost danger" data-delsup>Eliminar</button></div>
    <span></span>
    <input data-sf="phone" inputmode="tel" placeholder="Teléfono WhatsApp" value="${esc(s.phone)}">
    <input data-sf="email" type="email" placeholder="Email" value="${esc(s.email)}">
  </div>`).join('');
}
$('settingsBtn').addEventListener('click', () => {
  $('sBiz').value = S.biz; $('sGreeting').value = S.greeting; $('sBye').value = S.bye;
  $('sOwnerPhone').value = S.ownerPhone || ''; $('stOwnerPhone').value = S.ownerPhone || ''; $('stName').value = S.me || '';
  $('pasteLink').value = '';
  $('roleText').textContent = S.role === 'staff'
    ? `Modo encargado${S.me ? ' (' + S.me + ')' : ''}: haces el recuento y lo envías al responsable.`
    : 'Modo responsable: recibes recuentos, configuras productos y haces los pedidos.';
  updateInstall();
  renderSupList(); $('setDlg').showModal();
});
$('sBiz').addEventListener('input', e => { S.biz = e.target.value; $('bizName').textContent = S.biz; save(); });
$('sGreeting').addEventListener('input', e => { S.greeting = e.target.value; save(); });
$('sBye').addEventListener('input', e => { S.bye = e.target.value; save(); });
$('supList').addEventListener('input', e => {
  const f = e.target.dataset.sf; if (!f) return;
  sup(e.target.closest('.sup-row').dataset.sup)[f] = e.target.value.trim(); save();
});
$('supList').addEventListener('click', e => {
  if (!e.target.closest('[data-delsup]')) return;
  const s = sup(e.target.closest('.sup-row').dataset.sup);
  const n = AP().filter(p => p.sup === s.id).length;
  if (!confirm(`¿Quitar ${s.name} de ${areaName()}${n ? ` y sus ${n} productos de esta sección` : ''}?`)) return;
  S.products = S.products.filter(p => !(p.sup === s.id && p.area === S.area));
  S.orders = S.orders.filter(o => !(o.sup === s.id && o.area === S.area));
  s.areas = s.areas.filter(a => a !== S.area);
  if (!s.areas.length) S.suppliers = S.suppliers.filter(x => x !== s);
  save(); renderSupList(); renderAll();
});
$('addSupForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('newSupName').value.trim(); if (!name) return;
  const ex = S.suppliers.find(s => s.name.toLowerCase() === name.toLowerCase());
  if (ex) { if (!ex.areas.includes(S.area)) ex.areas.push(S.area); } else newSupplier(name);
  $('newSupName').value = ''; save(); renderSupList(); renderAll(); toast(`Proveedor añadido a ${areaName()}`);
});
$('resetCounts').addEventListener('click', () => {
  if (!confirm(`Se vaciará la columna «Hay» de todos los productos de ${areaName()}. El stock ideal se mantiene.`)) return;
  AP().forEach(p => p.current = null); S.filter = 'all'; save(); renderAll(); $('setDlg').close(); toast('Nuevo recuento listo');
});
$('exportBtn').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }));
  a.download = `inventario-${S.biz.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});
$('importBtn').addEventListener('click', () => $('importFile').click());
$('importFile').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const d = JSON.parse(await f.text());
    if (!Array.isArray(d.products) || !Array.isArray(d.suppliers)) throw 0;
    S = Object.assign(seedState(), d, { collapsed: d.collapsed || {} });
    migrate(); save(); renderAll(); $('setDlg').close(); toast('Datos importados');
  } catch (err) { alert('El archivo no es válido.'); }
  e.target.value = '';
});
$('restoreBtn').addEventListener('click', () => {
  if (!confirm('Se borrarán tus cambios (stock ideal, recuento, teléfonos) y se cargará la lista original. ¿Seguro?')) return;
  const keep = { role: S.role, me: S.me, ownerPhone: S.ownerPhone, teamKey: S.teamKey };   // el equipo y su clave se mantienen
  S = Object.assign(seedState(), keep); migrate(); save(); renderAll(); $('setDlg').close(); toast('Lista original restaurada');
});

/* ================= Avisos de hoy ================= */
const IC_CART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>';
const IC_TRUCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
const IC_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
const names = arr => arr.map(s => s.name).join(', ');

function renderToday() {
  const t = today(), w = wd(t), cards = [];
  const anySched = AS().some(s => s.orderDays.length);
  if (!anySched) {
    cards.push(`<button class="today-card o" data-go="cal"><div class="ic">${IC_CAL}</div><div><b>Programa tus pedidos</b><span>Indica qué días pides a cada proveedor y cuándo te lo traen</span></div></button>`);
  } else {
    const sentToday = new Set(AO().filter(o => o.date === iso(t)).map(o => o.sup));
    const todayO = AS().filter(s => s.orderDays.includes(w) && !sentToday.has(s.id));
    if (todayO.length) {
      const withItems = todayO.filter(s => orderFor(s).length).length;
      cards.push(`<button class="today-card o" data-go="order"><div class="ic">${IC_CART}</div><div><b>Hoy toca pedir a ${esc(names(todayO))}</b><span>${withItems ? `${withItems} con productos por pedir · toca para ver el pedido` : 'Haz el recuento para saber qué pedir'}</span></div></button>`);
    } else {
      let next = null;
      AS().forEach(s => { const d = nextOrderDate(s, addDays(t, 1)); if (d && (!next || d < next.d)) next = { d, s: [s] }; else if (d && next && +d === +next.d) next.s.push(s); });
      if (next) cards.push(`<button class="today-card o" data-go="cal"><div class="ic">${IC_CART}</div><div><b>Próximo pedido: ${shortDay(next.d)}</b><span>${esc(names(next.s))}</span></div></button>`);
    }
  }
  const late = APend().filter(o => o.delivery && o.delivery < iso(t));
  const arriving = APend().filter(o => o.delivery === iso(t));
  if (late.length) cards.push(`<button class="today-card late" data-go="cal"><div class="ic">${IC_TRUCK}</div><div><b>${late.length} pedido${late.length > 1 ? 's' : ''} sin recibir</b><span>${esc(names(late.map(o => sup(o.sup)).filter(Boolean)))} · márcalo como recibido</span></div></button>`);
  if (arriving.length) cards.push(`<button class="today-card d" data-go="cal"><div class="ic">${IC_TRUCK}</div><div><b>Hoy llega: ${esc(names(arriving.map(o => sup(o.sup)).filter(Boolean)))}</b><span>Márcalo como recibido al llegar</span></div></button>`);
  else if (APend().length && !late.length) {
    const nx = APend().filter(o => o.delivery).sort((a, b) => a.delivery.localeCompare(b.delivery))[0];
    if (nx) cards.push(`<button class="today-card d" data-go="cal"><div class="ic">${IC_TRUCK}</div><div><b>${APend().length} pedido${APend().length > 1 ? 's' : ''} en camino</b><span>Próxima entrega ${shortDay(fromIso(nx.delivery))}: ${esc(sup(nx.sup)?.name || '')}</span></div></button>`);
  }
  $('todayStrip').innerHTML = cards.join('');
}
$('todayStrip').addEventListener('click', e => {
  const g = e.target.closest('[data-go]')?.dataset.go; if (!g) return;
  if (g === 'order') { if (AP().some(p => (need(p) || 0) > 0)) openOrder(); else { S.view = 'count'; S.filter = 'pending'; save(); renderAll(); } }
  if (g === 'cal') { S.view = 'cal'; save(); renderAll(); $('viewCal').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});
$('tabs').addEventListener('click', e => { const v = e.target.closest('[data-view]')?.dataset.view; if (v) { S.view = v; save(); renderAll(); } });

/* ================= Vista calendario ================= */
function renderCal() {
  const t = today(), monday = addDays(t, -wd(t) + weekOffset * 7);
  const days = [...Array(7)].map((_, i) => addDays(monday, i));
  const sunday = days[6];
  const range = `${monday.getDate()} ${monday.toLocaleDateString('es-ES', { month: 'short' })} – ${sunday.getDate()} ${sunday.toLocaleDateString('es-ES', { month: 'short' })}`.replace(/\./g, '');

  const week = days.map(d => {
    const w = wd(d), key = iso(d);
    const evs = [];
    AS().filter(s => s.orderDays.includes(w)).forEach(s => {
      const sent = AO().some(o => o.sup === s.id && o.date === key);
      evs.push(`<div class="ev o" title="Día de pedido"><i style="background:${s.color}"></i><em>${sent ? '✓ ' : ''}Pedir ${esc(s.name)}</em></div>`);
    });
    const real = AO().filter(o => o.delivery === key && o.status !== 'cancelled');
    const realSups = new Set(real.map(o => o.sup));
    real.forEach(o => { const s = sup(o.sup); if (!s) return;
      const late = o.status === 'pending' && key < iso(t);
      evs.push(`<div class="ev ${late ? 'late' : 'real'}" title="Pedido ${o.status === 'received' ? 'recibido' : 'en camino'}"><i style="background:${s.color}"></i><em>${o.status === 'received' ? '✓ ' : ''}Llega ${esc(s.name)}</em></div>`); });
    AS().filter(s => s.deliveryDays.includes(w) && !realSups.has(s.id)).forEach(s =>
      evs.push(`<div class="ev d" title="Día de reparto"><i style="background:${s.color}"></i><em>Reparto ${esc(s.name)}</em></div>`));
    const cls = key === iso(t) ? 'is-today' : (key < iso(t) ? 'past' : '');
    return `<div class="day ${cls}"><div class="day-h"><b>${DAYS[w].slice(0, 3)}</b><span>${d.getDate()}</span></div>
      <div class="day-evs">${evs.join('') || '<div class="day-empty">—</div>'}</div></div>`;
  }).join('');

  const pend = APend().sort((a, b) => (a.delivery || '9').localeCompare(b.delivery || '9'));
  const pendHTML = pend.length ? pend.map(o => {
    const s = sup(o.sup) || { name: '¿?', color: '#888' };
    const late = o.delivery && o.delivery < iso(t);
    const tag = !o.delivery ? '<span class="tag idle">Sin fecha</span>' : late ? `<span class="tag late">Retrasado · era ${shortDay(fromIso(o.delivery))}</span>` : `<span class="tag green">Llega ${longDay(fromIso(o.delivery))}</span>`;
    return `<div class="orow" data-oid="${o.id}">
      <div class="avatar" style="background:${s.color}">${esc(initials(s.name))}</div>
      <div class="orow-info"><b>${esc(s.name)}</b><span>Pedido ${shortDay(fromIso(o.date))} · ${o.lines.map(l => `${esc(l.name)} (${fmt(l.qty)}${l.unit ? ' ' + esc(l.unit) : ''})`).join(', ')}</span></div>
      ${tag}
      <div class="orow-btns">
        <button class="btn small primary" data-recv="add" title="Suma las cantidades pedidas a la columna «Hay»">Recibido + sumar stock</button>
        <button class="btn small" data-recv="only" title="Lo marca como recibido sin tocar el stock (por ejemplo si vas a recontar)">Recibido</button>
        <button class="btn small ghost danger" data-recv="cancel">Anular</button>
      </div></div>`;
  }).join('') : '<p class="muted">No hay pedidos en camino. Cuando envíes un pedido, pulsa «Marcar enviado» y aparecerá aquí.</p>';

  const hist = AO().filter(o => o.status === 'received').slice(-10).reverse();
  const histHTML = hist.length ? `<details class="hist"><summary>Últimos pedidos recibidos (${hist.length})</summary>${hist.map(o => {
    const s = sup(o.sup) || { name: '¿?', color: '#888' };
    return `<div class="orow"><div class="avatar" style="background:${s.color}">${esc(initials(s.name))}</div>
      <div class="orow-info"><b>${esc(s.name)}</b><span>Pedido ${fromIso(o.date).toLocaleDateString('es-ES')} · recibido ${o.receivedAt ? fromIso(o.receivedAt).toLocaleDateString('es-ES') : ''} · ${o.lines.length} productos</span></div></div>`;
  }).join('')}</details>` : '';

  const sched = AS().map(s => {
    const sum = s.orderDays.length ? [...s.orderDays].sort().map(o => {
      const dv = deliveryAfter(s, addDays(monday, o));
      return `${DAYS[o].slice(0, 3).toLowerCase()}${dv ? ' → ' + DAYS[wd(dv)].slice(0, 3).toLowerCase() : ''}`;
    }).join(' · ') : 'Sin programar';
    const row = (k, label) => `<div class="drow"><span>${label}</span>${DS.map((l, i) =>
      `<button class="dbtn ${k} ${(k === 'o' ? s.orderDays : s.deliveryDays).includes(i) ? 'on' : ''}" data-tog="${k}" data-day="${i}" title="${DAYS[i]}">${l}</button>`).join('')}</div>`;
    return `<div class="sched" data-sup="${s.id}">
      <div class="sched-name"><div class="avatar" style="background:${s.color}">${esc(initials(s.name))}</div>
        <div><div>${esc(s.name)}</div><div class="sched-sum">${sum}</div></div></div>
      <div class="sched-rows">${row('o', 'Pido')}${row('d', 'Me llega')}</div>
    </div>`;
  }).join('');

  $('viewCal').innerHTML = `
    <div class="card">
      <div class="card-head">
        <div><h3>Semana</h3><p class="muted">${range}</p></div>
        <div class="weeknav">
          <button class="close" data-wk="-1" aria-label="Semana anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <button class="btn small" data-wk="0">Hoy</button>
          <button class="close" data-wk="1" aria-label="Semana siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>
      </div>
      <div class="week">${week}</div>
      <div class="legend"><span class="lo">Día de pedido</span><span class="ld">Día de reparto</span><span class="lr">Pedido enviado que llega</span></div>
    </div>
    <div class="card">
      <div class="card-head"><div><h3>En camino</h3><p class="muted">Pedidos enviados pendientes de recibir. Se descuentan de lo que hay que pedir.</p></div></div>
      <div style="margin-top:8px">${pendHTML}</div>
      ${histHTML}
    </div>
    <div class="card">
      <div class="card-head"><div><h3>Días de pedido y entrega</h3><p class="muted">Marca qué días pides a cada proveedor y qué días reparte. La app calcula cuándo llega cada pedido.</p></div></div>
      <div style="margin-top:8px">${sched}</div>
    </div>`;
}

$('viewCal').addEventListener('click', e => {
  const wk = e.target.closest('[data-wk]');
  if (wk) { weekOffset = wk.dataset.wk === '0' ? 0 : weekOffset + Number(wk.dataset.wk); renderCal(); return; }
  const tog = e.target.closest('[data-tog]');
  if (tog) {
    const s = sup(tog.closest('.sched').dataset.sup), arr = tog.dataset.tog === 'o' ? s.orderDays : s.deliveryDays, d = +tog.dataset.day;
    const i = arr.indexOf(d); i >= 0 ? arr.splice(i, 1) : arr.push(d);
    save(); renderAll(); return;
  }
  const rv = e.target.closest('[data-recv]');
  if (rv) {
    const o = S.orders.find(x => x.id === rv.closest('.orow').dataset.oid); if (!o) return;
    if (rv.dataset.recv === 'cancel') {
      if (!confirm('¿Anular este pedido? Sus productos volverán a contar como «por pedir».')) return;
      S.orders = S.orders.filter(x => x !== o); save(); renderAll(); toast('Pedido anulado'); return;
    }
    if (rv.dataset.recv === 'add') o.lines.forEach(l => { const p = S.products.find(x => x.id === l.pid); if (p) p.current = +((p.current ?? 0) + l.qty).toFixed(3); });
    o.status = 'received'; o.receivedAt = iso(today());
    save(); renderAll(); toast(rv.dataset.recv === 'add' ? 'Recibido · stock actualizado' : 'Pedido recibido');
  }
});

/* ================= Equipo: recuentos y invitaciones por enlace ================= */
// Los datos viajan dentro del enlace (después de #), comprimidos. No hay servidor.
async function pack(obj) {
  let bytes = new TextEncoder().encode(JSON.stringify(obj)), tag = 'j';
  if (window.CompressionStream) {
    const st = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
    bytes = new Uint8Array(await new Response(st).arrayBuffer()); tag = 'z';
  }
  return tag + b64url(bytes);
}
const MAX_LINK = 200000, MAX_DATA = 4 * 1024 * 1024;   // límites contra enlaces trucados
async function unpack(str) {
  if (str.length > MAX_LINK || !/^[jz][A-Za-z0-9_-]+$/.test(str)) throw new Error('formato');
  let bytes = fromB64url(str.slice(1));
  if (str[0] === 'z') {
    // Descomprime por trozos y corta si el contenido crece demasiado (evita «bombas» de compresión)
    const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
    const parts = []; let total = 0;
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      total += value.length; if (total > MAX_DATA) { reader.cancel(); throw new Error('demasiado grande'); }
      parts.push(value);
    }
    bytes = new Uint8Array(total); let o = 0; parts.forEach(p => { bytes.set(p, o); o += p.length; });
  } else if (bytes.length > MAX_DATA) throw new Error('demasiado grande');
  const d = JSON.parse(new TextDecoder().decode(bytes));
  if (!d || typeof d !== 'object' || Array.isArray(d)) throw new Error('formato');
  return d;
}
function b64url(bytes) { let bin = ''; for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function fromB64url(s) { let b = s.replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4) b += '='; return Uint8Array.from(atob(b), c => c.charCodeAt(0)); }

/* ---- Firma de recuentos: solo los móviles invitados por el responsable tienen la clave del equipo ---- */
const canSign = () => !!(window.crypto && crypto.subtle);
function ensureTeamKey() { if (!S.teamKey) { S.teamKey = b64url(crypto.getRandomValues(new Uint8Array(32))); save(); } return S.teamKey; }
async function hmac(key, msg) {
  const k = await crypto.subtle.importKey('raw', fromB64url(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg))));
}
async function verifySig(d) {
  if (!S.teamKey || !canSign() || typeof d.sig !== 'string') return false;
  const { sig, ...rest } = d;
  const good = await hmac(S.teamKey, JSON.stringify(rest));
  let diff = good.length ^ sig.length;                       // comparación en tiempo constante
  for (let i = 0; i < Math.min(good.length, sig.length); i++) diff |= good.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
const isWeb = () => /^https?:$/.test(location.protocol);
const appUrl = () => location.href.split('#')[0].split('?')[0];
const digits = s => String(s || '').replace(/\D/g, '');
const waLink = (phone, text) => `https://wa.me/${digits(phone)}?text=${encodeURIComponent(text)}`;
function needWeb() {
  if (isWeb()) return false;
  alert('Para enviar enlaces, la app tiene que estar publicada en internet y abierta desde esa dirección (no desde el archivo del ordenador).');
  return true;
}
function share(title, summaryHTML, text, phone, warn) {
  $('shareTitle').textContent = title;
  $('shareBody').innerHTML = `<div class="share-sum">${summaryHTML}</div>${warn ? `<div class="warnbox">${warn}</div>` : ''}
    <div class="share-actions">
      <button class="btn wa" type="button" data-sh="wa">${phone ? 'Enviar por WhatsApp' : 'Elegir chat de WhatsApp'}</button>
      <button class="btn" type="button" data-sh="copy">Copiar mensaje</button>
      ${navigator.share ? '<button class="btn" type="button" data-sh="share">Otras apps…</button>' : ''}
    </div>`;
  $('shareBody').onclick = e => {
    const k = e.target.closest('[data-sh]')?.dataset.sh; if (!k) return;
    if (k === 'wa') window.open(waLink(phone, text), '_blank', 'noopener,noreferrer');
    if (k === 'copy') copy(text);
    if (k === 'share') navigator.share({ text }).catch(() => {});
  };
  if (!$('shareDlg').open) $('shareDlg').showModal();
}

/* ---- Encargado: enviar recuento ---- */
$('sendBtn').addEventListener('click', async () => {
  if (needWeb()) return;
  const ps = AP(), counted = ps.filter(p => p.current !== null);
  if (!counted.length) { toast('Primero rellena «Hay» en los productos'); return; }
  const toOrder = ps.filter(p => (need(p) || 0) > 0);
  const bySup = {};
  toOrder.forEach(p => { const n = sup(p.sup)?.name || '¿?'; bySup[n] = (bySup[n] || 0) + 1; });
  const data = { k: 'r', a: S.area, an: areaName(), by: S.me || 'Encargado', t: Date.now(), c: counted.map(p => [p.id, p.name, p.current]) };
  if (S.teamKey && canSign()) data.sig = await hmac(S.teamKey, JSON.stringify(data));
  const url = appUrl() + '#r=' + await pack(data);
  const when = new Date().toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
  const lines = Object.entries(bySup).map(([n, k]) => `• ${n}: ${k}`).join('\n');
  const head = `📋 Recuento de ${areaName()} · ${data.by}\n${when}\n\nContados: ${counted.length} de ${ps.length}\nPor pedir: ${toOrder.length} producto${toOrder.length === 1 ? '' : 's'}${lines ? '\n' + lines : ''}`;
  const text = `${head}\n\nÁbrelo en la app para hacer los pedidos:\n${url}`;
  const missing = ps.length - counted.length;
  share('Enviar recuento', esc(head), text, S.ownerPhone,
    (missing ? `Faltan ${missing} producto${missing === 1 ? '' : 's'} por contar. Puedes enviarlo igualmente.` : '') +
    (S.ownerPhone ? '' : (missing ? '<br>' : '') + 'No tienes el WhatsApp del responsable: ponlo en ⚙ Ajustes o elige el chat al enviar.'));
});

/* ---- Responsable: recibir recuento ---- */
let pendingRecv = null;
async function receiveRecount(raw) {
  if (S.role === 'staff') { alert('Este enlace es un recuento para el responsable de pedidos. En modo encargado no se puede cargar.'); return; }
  if (!Array.isArray(raw.c)) throw new Error('formato');
  const verified = await verifySig(raw);
  // Solo se aceptan: código de producto, nombre (texto) y cantidad (número válido)
  const d = { a: cleanId(raw.a), an: cleanStr(raw.an, 40), by: cleanStr(raw.by, 40) || 'Encargado',
    t: Number.isFinite(+raw.t) ? +raw.t : Date.now(),
    c: raw.c.slice(0, 5000).filter(x => Array.isArray(x) && cleanNum(x[2]) !== null).map(x => [cleanId(x[0]), cleanStr(x[1], 120), cleanNum(x[2])]) };
  if (!S.role) S.role = 'owner';
  const area = S.areas.some(a => a.id === d.a) ? d.a : S.area;
  const aName = S.areas.find(a => a.id === area)?.name || d.an;
  const ps = S.products.filter(p => p.area === area);
  const byId = new Map(d.c.map(x => [x[0], x])), byName = new Map(d.c.map(x => [norm(x[1]), x]));
  const used = new Set();
  const plan = ps.map(p => { const x = byId.get(p.id) || byName.get(norm(p.name)); if (x) used.add(x); return [p, x ? x[2] : null]; });
  const unknown = d.c.filter(x => !used.has(x));
  const t = new Date(d.t);
  $('recvTitle').textContent = `Recuento de ${aName}`;
  $('recvOk').textContent = 'Cargar recuento';
  $('recvBody').innerHTML = (verified
      ? `<div class="okbox">✓ Verificado: enviado desde un móvil que tú invitaste.</div>`
      : `<div class="warnbox">⚠ Sin verificar: este recuento no viene de un móvil invitado por ti (o se envió con una versión antigua de la app). Cárgalo solo si confías en quien te lo ha mandado.</div>`) +
    `<div class="share-sum" style="margin-top:12px"><b>${esc(d.by)}</b> · ${esc(t.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }))}
${used.size} de ${ps.length} productos contados</div>
    <p class="muted">Se sustituirá la columna «Hay» de ${esc(aName)} por este recuento y verás lo que hay que pedir.</p>
    ${unknown.length ? `<div class="warnbox">${unknown.length} producto${unknown.length === 1 ? '' : 's'} no está${unknown.length === 1 ? '' : 'n'} en tu lista y se ignorará${unknown.length === 1 ? '' : 'n'}: ${esc(unknown.slice(0, 5).map(x => x[1]).join(', '))}${unknown.length > 5 ? '…' : ''}</div>` : ''}`;
  pendingRecv = () => {
    plan.forEach(([p, v]) => p.current = v);
    S.area = area; S.view = 'count'; S.filter = 'all';
    S.recv = S.recv || {}; S.recv[area] = { by: d.by, t: d.t, ok: verified };
    save(); renderAll(); toast('Recuento cargado');
    if (AP().some(p => (need(p) || 0) > 0)) openOrder();
  };
  $('recvDlg').showModal();
}
$('recvOk').addEventListener('click', () => { $('recvDlg').close(); if (pendingRecv) pendingRecv(); pendingRecv = null; });

/* ---- Responsable: invitar encargado (lleva la lista de productos) ---- */
$('inviteBtn').addEventListener('click', async () => {
  if (needWeb()) return;
  if (!canSign()) { alert('Este navegador no permite crear la clave de seguridad del equipo. Actualiza el navegador o el sistema.'); return; }
  const d = { k: 'i', biz: S.biz, op: digits(S.ownerPhone), key: ensureTeamKey(), areas: S.areas,
    s: S.suppliers.map(s => [s.id, s.name, s.color, s.areas, s.orderDays, s.deliveryDays]),
    p: S.products.map(p => [p.id, p.name, p.sup, p.area, p.cat, p.ideal, p.unit]) };
  const url = appUrl() + '#i=' + await pack(d);
  const head = `Hola 👋 Te paso la app de inventario de ${S.biz}.\n\n1. Abre el enlace en el móvil. En Android, con Google Chrome (en Samsung, no uses Samsung Internet).\n2. Instálala: en Chrome, menú ⋮ → «Instalar app». En iPhone, con Safari: botón Compartir → «Añadir a pantalla de inicio».\n3. Haz el recuento y pulsa «Enviar recuento».`;
  $('setDlg').close();
  share('Invitar a un encargado', esc(head) + `\n\n<span class="muted">${S.products.length} productos · ${S.suppliers.length} proveedores</span>`,
    `${head}\n\n${url}`, '', S.ownerPhone ? '' : 'Pon tu WhatsApp en Ajustes antes de invitar, así los recuentos te llegan directamente.');
});

/* ---- Encargado: recibir invitación ---- */
function receiveInvite(d) {
  if (!Array.isArray(d.s) || !Array.isArray(d.p) || !Array.isArray(d.areas)) throw new Error('formato');
  const row = x => Array.isArray(x) ? x : [];
  const apply = () => {
    const cur = new Map(S.products.map(p => [p.id, p.current]));
    S.biz = d.biz || S.biz; S.areas = d.areas; if (d.op) S.ownerPhone = d.op;
    S.teamKey = cleanKey(d.key);
    S.suppliers = d.s.map(row).map(([id, name, color, areas, o, dl]) => ({ id, name, color, areas, orderDays: o, deliveryDays: dl, phone: '', email: '' }));
    S.products = d.p.map(row).map(([id, name, sp, area, cat, ideal, unit]) => ({ id, name, sup: sp, area, cat, ideal, unit, current: cur.get(cleanId(id)) ?? null }));
    S.orders = []; S.role = 'staff'; S.view = 'count'; S.filter = 'all';
    migrate();   // limpia y valida todo lo recibido
    save(); renderAll();
    if (!S.me) showWelcome('staff'); else toast('Lista de productos actualizada');
  };
  if (S.role === 'owner') {
    $('recvTitle').textContent = 'Enlace para encargados';
    $('recvOk').textContent = 'Pasar a modo encargado';
    $('recvBody').innerHTML = `<p>Este enlace es una invitación para encargados. Si lo abres aquí, esta app pasará a <b>modo encargado</b> y se sustituirá tu lista de productos.</p><div class="warnbox">Si eres el responsable, cancela.</div>`;
    pendingRecv = apply; $('recvDlg').showModal();
  } else apply();
}

async function handleLink(str) {
  const m = String(str || '').match(/#([ri])=([A-Za-z0-9_-]+)/);
  if (!m) return false;
  let d;
  try {
    d = await unpack(m[2]);
    if (m[1] === 'r') await receiveRecount(d); else receiveInvite(d);
  } catch (e) { alert('El enlace no es válido o está incompleto. Asegúrate de copiarlo entero.'); }
  return true;
}
$('pasteBtn').addEventListener('click', async () => {
  const v = $('pasteLink').value;
  $('setDlg').close();
  if (!await handleLink(v)) alert('Ese texto no contiene un enlace de la app. Copia el enlace completo del mensaje de WhatsApp.');
});

/* ---- Bienvenida / perfiles ---- */
function showWelcome(pref) {
  document.querySelectorAll('.choice').forEach(c => c.classList.toggle('sel', c.dataset.role === pref));
  $('staffForm').classList.toggle('hidden', pref !== 'staff');
  $('wName').value = S.me || ''; $('wPhone').value = S.ownerPhone || ''; $('wLink').value = '';
  if (!$('welcomeDlg').open) $('welcomeDlg').showModal();
  if (pref === 'staff') $('wName').focus();
}
$('welcomeDlg').addEventListener('cancel', e => { if (!S.role) e.preventDefault(); });
$('welcomeDlg').addEventListener('click', e => {
  const r = e.target.closest('[data-role]')?.dataset.role; if (!r) return;
  if (r === 'owner') { S.role = 'owner'; save(); $('welcomeDlg').close(); renderAll(); toast('Modo responsable'); }
  else showWelcome('staff');
});
$('staffForm').addEventListener('submit', async e => {
  e.preventDefault();
  S.me = $('wName').value.trim(); S.ownerPhone = digits($('wPhone').value) || S.ownerPhone || '';
  S.role = 'staff'; S.view = 'count';
  save(); $('welcomeDlg').close(); renderAll();
  const link = $('wLink').value.trim();
  if (link) { if (!await handleLink(link)) alert('El enlace de invitación no es válido. Puedes pegarlo más tarde en ⚙ Ajustes.'); }
  else toast(`Hola, ${S.me}`);
});
$('switchRole').addEventListener('click', () => { $('setDlg').close(); showWelcome(S.role === 'staff' ? 'staff' : null); });
$('sOwnerPhone').addEventListener('input', e => { S.ownerPhone = digits(e.target.value); save(); });
$('stOwnerPhone').addEventListener('input', e => { S.ownerPhone = digits(e.target.value); save(); });
$('stName').addEventListener('input', e => { S.me = e.target.value.trim(); save(); renderStats(); });

/* ---- Instalar en el móvil ---- */
let installPrompt = null;
const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
// Samsung Internet crea la app instalada de otra forma y Play Protect puede marcarla como «no segura».
// En ese navegador se recomienda abrir la app en Chrome (conservando el enlace de invitación/recuento).
const isSamsung = /SamsungBrowser/i.test(navigator.userAgent);
const isAndroid = /Android/i.test(navigator.userAgent);
const entryHash = location.hash;
function chromeIntent() {
  const target = location.host + location.pathname + (/^#[ri]=[A-Za-z0-9_-]+$/.test(entryHash) ? entryHash : '');
  return `intent://${target}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent('https://' + target)};end`;
}
function updateInstall() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const samsungWarn = isSamsung && isAndroid && isWeb() && !standalone();
  $('samsungWarn').classList.toggle('hidden', !samsungWarn);
  if (samsungWarn) $('openChrome').href = chromeIntent();
  $('heroInstall').classList.toggle('hidden', !installPrompt || standalone() || isSamsung);
  $('installBtn').classList.toggle('hidden', !installPrompt || standalone() || isSamsung);
  $('installHint').textContent = standalone() ? 'La app ya está instalada en este dispositivo.'
    : !isWeb() ? 'Para instalarla, ábrela desde su dirección web (cuando esté publicada).'
    : isSamsung ? 'Estás en Samsung Internet: instálala desde Chrome para evitar el aviso de Play Protect (botón «Abrir en Chrome» arriba).'
    : ios ? 'En iPhone: abre esta página en Safari, pulsa el botón Compartir y luego «Añadir a pantalla de inicio».'
    : installPrompt ? 'Pulsa el botón para añadirla a tu pantalla de inicio como una app más.'
    : 'En Android (Chrome): menú ⋮ → «Instalar app» o «Añadir a pantalla de inicio».';
}
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; updateInstall(); });
window.addEventListener('appinstalled', () => { installPrompt = null; updateInstall(); toast('App instalada'); });
async function doInstall() { if (!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice.catch(() => {}); installPrompt = null; updateInstall(); }
$('installBtn').addEventListener('click', doInstall);
$('heroInstall').addEventListener('click', doInstall);
/* ---- Versión, actualizaciones y portapapeles ---- */
const APP_VERSION = '1.3';
if ('serviceWorker' in navigator && isWeb()) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
    reg.update().catch(() => {});
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
  }).catch(() => {});
  // Cuando se publica una versión nueva, se avisa y se recarga sola si no hay nada abierto
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return;
    const busy = [...document.querySelectorAll('dialog')].some(d => d.open) || document.activeElement?.matches?.('input, textarea');
    if (busy) toast('Hay una versión nueva: se aplicará al volver a abrir la app');
    else location.reload();
  });
}
$('clipBtn').addEventListener('click', async () => {
  try { $('pasteLink').value = await navigator.clipboard.readText(); }
  catch (e) { toast('Mantén pulsado el campo y elige «Pegar»'); $('pasteLink').focus(); }
});
$('settingsBtn').addEventListener('click', () => {
  $('officialUrl').textContent = isWeb() ? appUrl().replace(/^https:\/\//, '') : 'su dirección web oficial';
  $('versionText').textContent = `Versión ${APP_VERSION}`;
});

renderAll();
updateInstall();
// Al abrir: ¿viene un enlace de recuento o invitación? Si no, y es la primera vez, elegir perfil.
(async () => {
  const hash = location.hash;
  if (hash) history.replaceState(null, '', location.pathname + location.search);
  const handled = hash ? await handleLink(hash) : false;
  if (!S.role && !handled) showWelcome();
})();
// Si la app ya estaba abierta y llega un enlace nuevo, solo cambia el # de la dirección
window.addEventListener('hashchange', async () => {
  const hash = location.hash; if (!/#[ri]=/.test(hash)) return;
  history.replaceState(null, '', location.pathname + location.search);
  if ($('welcomeDlg').open && !S.role) $('welcomeDlg').close();
  await handleLink(hash);
});
