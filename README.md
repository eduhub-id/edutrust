# EduTrust

> **Sistem Operasi, Tata Kelola & Audit Penyaluran Dana Talangan Pelajar Vokasi Global**  
> *Platform Infrastruktur Edukasi & Pembiayaan Tenaga Kerja Global (Eduhub Ecosystem)*

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=flat-square&logo=github)](https://eduhub-id.github.io/edutrust/)
[![Tests](https://img.shields.io/badge/Automated_Tests-238_Passing-success?style=flat-square)](tests/)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-blue?style=flat-square)](#)
[![Design Tokens](https://img.shields.io/badge/Design_Tokens-Single_Source_:root-6f42c1?style=flat-square)](#)
[![Tech](https://img.shields.io/badge/Dependencies-Zero_Runtime_Deps-orange?style=flat-square)](#)

---

## 📌 Ringkasan Eksekutif

**EduTrust** dirancang sebagai fondasi teknologi dan kepatuhan hukum untuk menyelesaikan friksi struktural penyaluran dana talangan pendidikan dan pelatihan vokasi (Jepang, Taiwan, Jerman) di ekosistem **Eduhub**.

Selama ini, pembiayaan talangan vokasi menghadapi tiga risiko kritis:
1. **Risiko Kebocoran Dana:** Penyaluran tunai rawan dialihkan untuk kebutuhan konsumtif non-pendidikan.
2. **Kepatuhan Regulasi & Beban Finansial:** Regulasi ketat OJK, BI (PJP), serta pelarangan model ISA agresif (CFPB v. BloomTech 2024) menuntut instrumen pembiayaan yang adil, patuh syariah (Fatwa DSN-MUI), dan transparan.
3. **Akuntabilitas Multi-Pihak:** Donatur, BAZNAS (zakat), mitra CSR korporat, kampus vokasi, serta majikan luar negeri membutuhkan audit waktu-nyata (*real-time verifiable audit trail*) tanpa ketergantungan pada klaim sepihak.

EduTrust menyatukan **narasi kepatuhan strategis** dan **antarmuka sistem operasi hidup (live interactive platform)** dalam satu media presentasi terpadu.

---

## 🌐 Live Presentation & Platform Demo

Presentasi lengkap 14 bab beserta 17 layar interaktif Ruang Coba dapat diakses langsung tanpa instalasi di:

👉 **[https://eduhub-id.github.io/edutrust/](https://eduhub-id.github.io/edutrust/)**

---

## 🏛️ Struktur Dokumen & 14 Bab Strategis

Dokumen presentasi menyajikan arsitektur menyeluruh dari fondasi hukum hingga implementasi antarmuka:

| Bab | Topik Utama | Substansi Kunci |
|:---|:---|:---|
| **Bab 01** | **Dasbor Tata Kelola** | Metrik penyaluran, rasio NPF, monitoring 3 sumber dana institusional |
| **Bab 02** | **Sumber Dana & Perjanjian Tripartit** | Integrasi BAZNAS/SiMBA, alokasi CSR korporat, deposito penjaminan |
| **Bab 03** | **Skrining Pelajar & Penilaian Kesiapan** | Verifikasi NIK, asesmen bahasa/keterampilan, status kelolosan mitra LN |
| **Bab 04** | **Penyaluran Bertahap (Closed-Loop)** | Dana langsung ke vendor resmi (Lembaga Bahasa, MCU, Visa, Tiket) |
| **Bab 05** | **Monitoring Akademik & Kedatangan** | Pemantauan presensi, sertifikasi JLPT/TOCFL, konfirmasi tiba di negara tujuan |
| **Bab 06** | **Mitra Penyalur & Rekonsiliasi Faktur** | Pembayaran SPK terbitan sistem, validasi bukti transfer per termin |
| **Bab 07** | **Pencatatan Pengembalian (Qardhul Hasan)** | Potong gaji transparan di negara tujuan tanpa skema jeratan bunga |
| **Bab 08** | **Jejak Audit & Kepatuhan Regulasi** | Immutability log, kepatuhan PSPK 1 & 2 (IFRS S1/S2), audit eksternal |
| **Bab 09** | **Portal Pelajar (Mobile Experience)** | Transparansi rincian talangan, jadwal keberangkatan, status pengembalian |
| **Bab 10** | **Portal Donatur & CSR Institusi** | Laporan dampak sosial (*Social Return on Investment*), sertifikat zakat |
| **Bab 11** | **Portal Kampus & Penyalur Kerja LN** | Manajemen kuota kandidat, integrasi penempatan kerja (*employer matching*) |
| **Bab 12** | **Ruang Coba Sistem (17 Layar Interaktif)** | Pengujian langsung seluruh alur kerja operasional secara live |
| **Bab 13** | **Daftar Pustaka & Landasan Regulasi** | 32 referensi primer terverifikasi (UU, Permenko, POJK, riset pasar) |
| **Bab 14** | **Peta Jalan Implementasi 2026–2027** | Fase 1 (Sistem Inti & Audit), Fase 2 (Integrasi API Perbankan/SiMBA) |

---

## 💼 Model Keberlanjutan: 5 Lapis Pendapatan

EduTrust dibangun di atas model bisnis yang sehat dan berimbang tanpa membebani pelajar:

```
┌─────────────────────────────────────────────────────────────┐
│                   5 LAPIS STRUKTUR PENDAPATAN               │
├─────────────────────────────────────────────────────────────┤
│ 1. Platform & Administration Fee Penyaluran Dana Institusi  │
│ 2. Success Fee Penempatan Mitra Kerja Luar Negeri           │
│ 3. Komisi Pelatihan & Sertifikasi Bahasa Terakreditasi      │
│ 4. Subscription SaaS Kampus / LPK Mitra (Vocational MIS)    │
│ 5. Layanan Verifikasi Kepatuhan & Audit Dampak CSR / Zakat   │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Kualitas Rekayasa & Standar Desain 2026

Repositori ini mematuhi standar rekayasa perangkat lunak tertinggi:

* **Satu Sumber Desain (Design Tokens):** Seluruh variabel visual diikat pada `:root` (`--navy-deep: #08417B`, `--brand-orange: #FF6D00`, `--font: 'Inter var'`).
* **Zero Runtime Dependencies:** Tidak memerlukan library berat pihak ketiga atau build step kompleks; langsung dirender dengan performa instan (<200ms).
* **Aksesibilitas Kontras WCAG 2.1 AA:** Rasio kontras terukur 10.23:1 (navy di atas putih) dan 6.71:1 (oranye di atas kanvas gelap).
* **Uji Visual Multi-Lebar Otomatis:** Diverifikasi secara headless pada 5 breakpoint (1400px, 1100px, 900px, 600px, 390px ponsel).

---

## 🧪 Validasi & Verifikasi Otomatis

Seluruh data dummy dan integritas tampilan diverifikasi oleh 238 pengujian otomatis:

```bash
# Uji konsistensi data dummy
cd data && node check-consistency.js

# Uji responsivitas & geometri ikon (Chrome Headless CDP)
cd tests && node responsive-and-icon-qa.js
```

---

## 📄 Lisensi & Hak Cipta

Dokumen dan kode antarmuka ini disiapkan khusus untuk **Eduhub Indonesia**. Seluruh hak kekayaan intelektual atas konsep dan implementasi dilindungi sesuai ketentuan PKS yang berlaku.
