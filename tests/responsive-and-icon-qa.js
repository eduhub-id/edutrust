// UJI IKON & GAMBAR: memastikan tiap ikon dan gambar di semua bab tidak rusak,
// diukur di dokumen SUNGGUHAN lewat Chrome headless pada 5 lebar layar.
//
// Tiga penyakit yang pernah nyata dan dikunci di sini:
//   1. SVG digencet flexbox sampai 0 lebar (4 ikon .ch jadi 0x15, 2 ikon .btn gepeng)
//   2. tabel meluber di layar HP sementara induknya overflow-x:hidden -> kolom hilang
//   3. anak grid dengan min-width:auto memaksa halaman melebar (445px di layar 390px)
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILE = "/Users/Shared/Development/work/eduhub/eduhub-rnd/05-presentation/edutrust-platform-dan-alasannya.html";
const LEBAR = [1400, 1100, 900, 600, 390];

const get = u => new Promise(r => { const t = setInterval(() => http.get(u, s => { let d = ""; s.on("data", c => d += c); s.on("end", () => { clearInterval(t); r(JSON.parse(d)); }); }).on("error", () => {}), 400); });

const PROBE = `(() => {
  document.querySelectorAll('#lab .screen').forEach(s => s.style.display = 'block');
  const sengajaTersembunyi = el => {
    let n = el.parentElement;
    while (n && n !== document.body) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden') return true;
      n = n.parentElement;
    }
    return false;
  };
  const svgs = [...document.querySelectorAll('svg')];
  let nol = 0, gepeng = 0, terpotong = 0;
  svgs.forEach(s => {
    if (sengajaTersembunyi(s)) return;
    const r = s.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) { nol++; return; }
    const vb = (s.getAttribute('viewBox') || '').split(/[\\s,]+/).map(Number);
    if (vb.length === 4 && vb[2] && vb[3]) {
      const rv = vb[2] / vb[3], rn = r.width / r.height;
      if (Math.abs(rv - rn) / rv > 0.25) gepeng++;
      let maxX = -1e9, maxY = -1e9, minX = 1e9, minY = 1e9, ada = false;
      s.querySelectorAll('path,circle,rect,line,polyline,polygon,ellipse').forEach(el => {
        try { const b = el.getBBox(); if (!b.width && !b.height) return; ada = true;
          maxX = Math.max(maxX, b.x + b.width); maxY = Math.max(maxY, b.y + b.height);
          minX = Math.min(minX, b.x); minY = Math.min(minY, b.y); } catch (e) {}
      });
      if (ada && (maxX > vb[0] + vb[2] + 0.6 || maxY > vb[1] + vb[3] + 0.6 ||
                  minX < vb[0] - 0.6 || minY < vb[1] - 0.6)) terpotong++;
    }
  });
  let tabelTerpotong = 0;
  const rinci = [];
  document.querySelectorAll('table').forEach(t => {
    if (sengajaTersembunyi(t)) return;
    // layar #lab yang kita paksa buka punya lebar induk palsu (2px) -> abaikan
    const sc = t.closest('.screen');
    if (sc && !sc.classList.contains('live')) return;
    const par = t.parentElement;
    if (!par) return;
    const tr = t.getBoundingClientRect(), pr = par.getBoundingClientRect();
    if (!tr.width || pr.width < 40) return;
    const ox = getComputedStyle(par).overflowX;
    // meluber DAN induk memotong tanpa bisa digeser = kolom hilang diam-diam
    if (tr.width > pr.width + 2 && (ox === 'hidden' || ox === 'clip') &&
        getComputedStyle(t).overflowX !== 'auto') {
      tabelTerpotong++;
      const sec = t.closest('[id]');
      rinci.push((sec ? sec.id : '?') + ' ' + Math.round(tr.width) + '>' + Math.round(pr.width));
    }
  });
  // PENYAKIT 4: ikon RAKSASA — <svg> tanpa width/height dan tanpa aturan CSS
  // yang cocok memuai mengikuti induknya (terukur 136x136px di .search narasi,
  // 60-68px di bilah navigasi tiruan layar). Ikon wajar 11-34px.
  let raksasa = 0;
  const rinciBesar = [];
  svgs.forEach(s => {
    if (sengajaTersembunyi(s)) return;
    const vb = (s.getAttribute('viewBox') || '').split(/[\\s,]+/).map(Number);
    if (!(vb.length === 4 && vb[2] <= 32 && vb[3] <= 32)) return;  // ikon, bukan diagram
    const r = s.getBoundingClientRect();
    if (r.width > 40 || r.height > 40) {
      raksasa++;
      const sec = s.closest('[id]');
      if (rinciBesar.length < 4) rinciBesar.push((sec ? sec.id : '?') + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    }
  });
  let gagalMuat = 0;
  document.querySelectorAll('img').forEach(im => { if (!sengajaTersembunyi(im) && (!im.complete || !im.naturalWidth)) gagalMuat++; });
  return JSON.stringify({
    innerWidth, docScrollWidth: document.documentElement.scrollWidth,
    totalSvg: svgs.length, nol, gepeng, terpotong, tabelTerpotong, gagalMuat, raksasa,
    rinci: rinci.slice(0,5), rinciBesar
  });
})()`;

(async () => {
  let pass = 0, fail = 0;
  const ok = (c, m) => { if (c) { pass++; console.log("  ✓ " + m); } else { fail++; console.log("  ✗ GAGAL: " + m); } };

  for (const w of LEBAR) {
    const PORT = 9500 + Math.floor(Math.random() * 90);
    const PROF = "/tmp/wf-test/cdp-t-" + PORT;
    const p = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars",
      "--remote-debugging-port=" + PORT, "--user-data-dir=" + PROF,
      "--window-size=" + w + ",1200", "file://" + FILE]);
    const tabs = await get("http://127.0.0.1:" + PORT + "/json");
    const page = tabs.find(t => t.type === "page");
    const WebSocket = require("ws");
    const ws = new WebSocket(page.webSocketDebuggerUrl, { maxPayload: 256 * 1024 * 1024 });
    let id = 0; const wait = {};
    ws.on("message", m => { const d = JSON.parse(m); if (wait[d.id]) { wait[d.id](d.result); delete wait[d.id]; } });
    const send = (m, prm = {}) => new Promise(r => { const i = ++id; wait[i] = r; ws.send(JSON.stringify({ id: i, method: m, params: prm })); });
    await new Promise(r => ws.on("open", r));
    await send("Emulation.setDeviceMetricsOverride", { width: w, height: 1200, deviceScaleFactor: 1, mobile: false, screenWidth: w, screenHeight: 1200 });
    await new Promise(r => setTimeout(r, 2600));
    const res = await send("Runtime.evaluate", { expression: PROBE, returnByValue: true });
    const d = JSON.parse(res.result.value);
    console.log("\n=== LEBAR " + w + "px (" + d.totalSvg + " ikon) ===");
    ok(d.innerWidth === w, "lebar layar benar-benar " + w + "px (terukur " + d.innerWidth + ")");
    ok(d.nol === 0, "tidak ada ikon berukuran nol (" + d.nol + ")");
    ok(d.gepeng === 0, "tidak ada ikon gepeng / rasio melenceng (" + d.gepeng + ")");
    ok(d.terpotong === 0, "tidak ada ikon terpotong viewBox (" + d.terpotong + ")");
    ok(d.tabelTerpotong === 0, "tidak ada tabel terpotong tanpa bisa digeser (" + d.tabelTerpotong + (d.rinci && d.rinci.length ? ": " + d.rinci.join(" · ") : "") + ")");
    ok(d.gagalMuat === 0, "tidak ada gambar gagal dimuat (" + d.gagalMuat + ")");
    ok(d.raksasa === 0, "tidak ada ikon raksasa >40px (" + d.raksasa + (d.rinciBesar && d.rinciBesar.length ? ": " + d.rinciBesar.join(" · ") : "") + ")");
    ok(d.docScrollWidth <= w + 2, "halaman tidak melebar ke samping (doc " + d.docScrollWidth + " vs layar " + w + ")");
    ws.close(); p.kill();
    try { fs.rmSync(PROF, { recursive: true, force: true }); } catch (e) {}
  }
  console.log("\n" + pass + " lulus · " + fail + " gagal");
  process.exit(fail ? 1 : 0);
})();
