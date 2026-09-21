// Memeriksa konsistensi data contoh: JSON internal + kecocokan dengan HTML layar.
// Tujuan: bug "Rizki di satu layar, Dewi di layar lain" ketahuan otomatis.
const fs = require("fs");

const DATA = "/Users/Shared/Development/work/eduhub/eduhub-rnd/05-presentation/data/demo-data.json";
const HTML = "/Users/Shared/Development/work/eduhub/eduhub-rnd/05-presentation/edutrust-platform-dan-alasannya.html";

const d = JSON.parse(fs.readFileSync(DATA, "utf8"));
const html = fs.readFileSync(HTML, "utf8");
const lab = html.slice(html.indexOf('<div id="lab">'), html.indexOf('<div class="labhint">'));
const stripTags = s => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// pecah per layar
const screens = {};
const re = /<div class="screen[^"]*" id="(\w+)">([\s\S]*?)(?=<div class="screen|$)/g;
let m;
while ((m = re.exec(lab))) screens[m[1]] = stripTags(m[2]);

let pass = 0, fail = 0;
const ok = (c, msg) => { c ? (pass++, console.log("  ✓ " + msg)) : (fail++, console.log("  ✗ FAIL: " + msg)); };
const rp = n => "Rp " + n.toLocaleString("id-ID");

console.log("=== 1. Konsistensi INTERNAL JSON (angka harus saling cocok) ===");
const p = d.pelajar_utama;
const sumTahap = p.tahapan.reduce((a, t) => a + t.jumlah, 0);
ok(sumTahap === p.pagu_total, `jumlah semua tahap (${rp(sumTahap)}) = pagu total (${rp(p.pagu_total)})`);
const cair = p.tahapan.filter(t => t.status === "cair").reduce((a, t) => a + t.jumlah, 0);
ok(cair === p.sudah_cair, `tahap berstatus cair (${rp(cair)}) = sudah_cair (${rp(p.sudah_cair)})`);
ok(p.pagu_total - p.sudah_cair === p.sisa_pagu, `pagu − cair = sisa (${rp(p.sisa_pagu)})`);
ok(p.tahapan.filter(t => t.status === "cair").length === p.tahap_selesai, `tahap_selesai (${p.tahap_selesai}) cocok dengan data tahapan`);
ok(p.tahapan.length === p.tahap_total, `tahap_total (${p.tahap_total}) cocok jumlah baris tahapan`);

const gagal = p.pemeriksaan.filter(c => !c.lolos).length;
ok(gagal === 1, `tepat 1 pemeriksaan gagal (inti cerita layar A6) — ada ${gagal}`);
const tahap3 = p.tahapan.find(t => t.no === p.tagihan_berjalan.tahap_no);
ok(tahap3.status === "tertahan", `tahap ${p.tagihan_berjalan.tahap_no} berstatus tertahan, konsisten dengan pemeriksaan gagal`);
ok(tahap3.jumlah === 25000000, "nominal tahap berjalan konsisten");
const menunggu = p.syarat_akademik.filter(s => s.status === "menunggu").length;
ok(menunggu === 1, `tepat 1 syarat akademik menunggu — penyebab tahap tertahan (${menunggu})`);

console.log("\n=== 2. Referensi antar tabel (tidak ada id yatim) ===");
const sumberIds = d.sumber_dana.map(s => s.id);
const instIds = d.institusi.map(i => i.id);
let yatim = [];
p.tahapan.forEach(t => { if (!sumberIds.includes(t.sumber_id)) yatim.push(`tahap ${t.no} → ${t.sumber_id}`); });
p.riwayat.forEach(r => { if (!sumberIds.includes(r.sumber_id)) yatim.push(`riwayat ${r.uraian} → ${r.sumber_id}`); });
d.pelajar_lain.forEach(s => {
  if (!instIds.includes(s.institusi_id)) yatim.push(`${s.nama} → institusi ${s.institusi_id}`);
  if (!sumberIds.includes(s.tagihan_berjalan.sumber_id)) yatim.push(`${s.nama} → sumber ${s.tagihan_berjalan.sumber_id}`);
});
if (!instIds.includes(p.institusi_id)) yatim.push(`pelajar utama → institusi ${p.institusi_id}`);
if (!sumberIds.includes(p.tagihan_berjalan.sumber_id)) yatim.push(`tagihan → sumber ${p.tagihan_berjalan.sumber_id}`);
ok(yatim.length === 0, "semua rujukan sumber dana & institusi ada" + (yatim.length ? ": " + yatim.join(", ") : ""));

console.log("\n=== 3. Aturan bisnis yang tidak boleh dilanggar ===");
const zakat = d.sumber_dana.filter(s => s.jenis === "Zakat");
ok(zakat.every(s => s.wajib_kembali === false), "dana zakat TIDAK pernah ditandai wajib kembali");
ok(d.sumber_dana.find(s => s.id === "deposito").wajib_kembali === true, "titipan perusahaan ditandai wajib kembali");
const lumsum = d.portal_donatur.rincian_penggunaan.find(r => !r.ada_invoice);
ok(lumsum && lumsum.kategori === "Biaya hidup", "hanya biaya hidup yang tanpa invoice (sesuai keputusan desain)");
const total = d.portal_donatur.rincian_penggunaan.reduce((a, r) => a + r.persen, 0);
ok(total === 100, `rincian penggunaan berjumlah 100% (${total}%)`);
ok(d.dana_bergulir.catatan_kejujuran.includes("Belum ada satu angkatan"), "catatan kejujuran dana bergulir ada");
ok(d.dana_bergulir.putus_kontak > 0, "kasus gagal ikut ditampilkan, bukan disembunyikan");

console.log("\n=== 4. Nama orang di layar: konsisten & tidak tertukar ===");
const pelajarScreens = ["c1", "c3"];   // c2 (riwayat) dibuang — generik, tidak membuktikan apa pun
let salah = [];
pelajarScreens.forEach(s => {
  if (!screens[s]) return salah.push(`${s} tidak ada`);
  if (!screens[s].includes(p.nama)) salah.push(`${s} tidak memuat ${p.nama}`);
  if (screens[s].includes(d.alumni_contoh.nama)) salah.push(`${s} keliru memuat ${d.alumni_contoh.nama}`);
});
ok(salah.length === 0, `layar pelajar aktif (C1, C3) semuanya "${p.nama}"` + (salah.length ? ": " + salah.join(", ") : ""));
ok(screens.c4 && screens.c4.includes(d.alumni_contoh.nama), `C4 memakai alumni "${d.alumni_contoh.nama}" (tahap berbeda)`);
ok(screens.c4 && /Alumni/i.test(screens.c4), "C4 menyatakan statusnya alumni, agar perpindahan orang tidak membingungkan");

console.log("\n=== 5. Angka di layar cocok dengan JSON ===");
const cek = [
  ["a4", "Rp 100 jt", "pagu total di A4"],
  ["a4", "2 dari 4", "progres tahap di A4"],
  ["a6", "Rp 25.040.000", "nominal tagihan di A6"],
  ["a6", "3 dari 4", "hasil pemeriksaan di A6"],
  ["c1", "Rp 25.000.000", "pagu semester di C1"],
  ["c1", "Rp 4.500.000", "biaya hidup di C1"],
  ["d1", "Rp 25.040.000", "nominal invoice di D1"],
];
cek.forEach(([s, val, label]) => ok(screens[s] && screens[s].includes(val), `${label}: "${val}"`));

console.log("\n=== 6. Identitas pelajar konsisten lintas layar ===");
// A3 (daftar pelajar) dibuang; identitas kini muncul di A4 detail pelajar
ok(screens.a4 && screens.a4.includes(p.identitas.nomor), `nomor paspor ${p.identitas.nomor} muncul di A4`);
const inst = d.institusi.find(i => i.id === p.institusi_id);
const instScreens = ["a4", "d1", "c1"].filter(s => screens[s] && !screens[s].includes("Tokyo Inst"));
ok(instScreens.length === 0, "institusi pelajar konsisten di A4/D1/C1" + (instScreens.length ? ": " + instScreens.join(",") : ""));

console.log("\n=== 7. Tidak ada nama orang asing yang tak terdaftar di JSON ===");
const known = [p.nama, d.alumni_contoh.nama, ...d.pelajar_lain.map(s => s.nama)];
const allText = Object.values(screens).join(" ");
const found = [...new Set((allText.match(/\b[A-Z][a-z]{2,}\s[A-Z][a-z]{2,}\b/g) || []))];
const suspectNames = found.filter(n =>
  /^(Rizki|Dewi|Siti|Ahmad|Bayu|Lia|Nur|Budi|Andi|Fajar)\s/.test(n) && !known.includes(n));
ok(suspectNames.length === 0, "tidak ada nama pelajar di luar daftar JSON" + (suspectNames.length ? ": " + suspectNames.join(", ") : ""));

console.log(`\n${"=".repeat(54)}\nLULUS ${pass} · GAGAL ${fail}\n${"=".repeat(54)}`);
process.exit(fail ? 1 : 0);
