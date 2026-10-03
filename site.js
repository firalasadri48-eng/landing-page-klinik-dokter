/* ============================================================
   klinik-dokter/site.js — render halaman dari content.json
   dengan objek FALLBACK bila fetch gagal.
   ============================================================ */
import {
  waLink,
  loadContent,
  initFaq,
  initMobileNav,
  initCopyButtons,
  setYear,
  esc,
} from "./shared/utils.js";
import { navbarHTML } from "./shared/components/navbar.js";
import { footerHTML } from "./shared/components/footer.js";
import { sectionHeadHTML } from "./shared/components/section-head.js";

/* Cadangan bila content.json tidak dapat dimuat. */
const FALLBACK = {
  meta: {
    title: "Klinik Sehat Cahaya — Klinik Pratama di Bandung | Buat Janji via WhatsApp",
    description:
      "Klinik Sehat Cahaya melayani poli umum, poli gigi, dan poli anak. Buat janji berobat lewat WhatsApp, datang sesuai jadwal, langsung ditangani dokter.",
    ogTitle: "Klinik Sehat Cahaya — Berobat Jadi Tenang, Tanpa Antre Lama",
    ogDescription:
      "Poli umum, poli gigi, dan poli anak dalam satu atap. Buat janji via WhatsApp dan datang sesuai jadwal Anda.",
    ogType: "website",
  },
  brand: {
    name: "Klinik Sehat Cahaya",
    mark: "+",
    tagline: "Klinik pratama untuk keluarga — poli umum, poli gigi, dan poli anak.",
  },
  nav: {
    links: [
      { href: "#beranda", label: "Beranda" },
      { href: "#layanan", label: "Layanan" },
      { href: "#jadwal", label: "Jadwal Dokter" },
      { href: "#alur", label: "Alur Berobat" },
      { href: "#faq", label: "FAQ" },
      { href: "#kontak", label: "Kontak" },
    ],
    cta: {
      label: "Buat Janji",
      message: "Halo Klinik Sehat Cahaya, saya ingin membuat janji berobat.",
    },
  },
  hero: {
    eyebrow: "Klinik Pratama — Bandung",
    title: 'Berobat jadi <span class="hl">tenang</span>, tanpa antre lama.',
    desc: "Poli umum, poli gigi, dan poli anak dalam satu atap. Buat janji lewat WhatsApp, datang sesuai jadwal, langsung ditangani dokter.",
    ctaLabel: "Buat Janji via WhatsApp",
    ctaMessage:
      "Halo Klinik Sehat Cahaya, saya ingin membuat janji berobat. Mohon info jadwal yang tersedia.",
    badges: [
      { value: "3", label: "Poli layanan" },
      { value: "6 hari", label: "Buka tiap pekan" },
      { value: "WA", label: "Janji via WhatsApp" },
    ],
    formTitle: "Formulir Janji Cepat",
    formDesc: "Isi data di bawah ini, pesan WhatsApp terisi otomatis.",
    formNote: "Staf kami membalas pesan pada jam praktik.",
    submitLabel: "Kirim via WhatsApp",
    fields: {
      nama: "Nama lengkap pasien",
      poli: "Poli tujuan",
      tanggal: "Tanggal diinginkan",
      keluhan: "Keluhan singkat (opsional)",
    },
    poliOptions: ["Poli Umum", "Poli Gigi", "Poli Anak"],
  },
  sections: {
    layanan: {
      index: "01",
      eyebrow: "Layanan",
      title: 'Satu atap untuk <span class="hl">kebutuhan</span> keluarga',
      desc: "Tiga poli utama dengan dokter dan jadwal yang jelas. Pilih poli, buat janji, datang tepat waktu.",
    },
    jadwal: {
      index: "02",
      eyebrow: "Jadwal Dokter",
      title: 'Jadwal praktik <span class="hl">pekan ini</span>',
      desc: "Jadwal dapat berubah sewaktu-waktu. Pastikan lewat WhatsApp sebelum datang.",
    },
    alur: {
      index: "03",
      eyebrow: "Alur Berobat",
      title: 'Empat langkah <span class="hl">mudah</span> sampai pulang',
      desc: "Ikuti alur ini agar kunjungan Anda cepat dan tertib.",
    },
    pembayaran: {
      index: "04",
      eyebrow: "Pembayaran",
      title: 'Pilihan bayar yang <span class="hl">fleksibel</span>',
      desc: "Kami menerima pasien umum, peserta BPJS Kesehatan, dan pemegang asuransi swasta rekanan.",
    },
    faq: {
      index: "05",
      eyebrow: "FAQ",
      title: 'Pertanyaan yang <span class="hl">sering</span> ditanyakan',
      desc: "Tidak menemukan jawaban? Tanya langsung lewat WhatsApp.",
    },
    kontak: {
      index: "06",
      eyebrow: "Kontak & Lokasi",
      title: 'Kunjungi atau <span class="hl">hubungi</span> kami',
      desc: "Datang langsung pada jam praktik atau buat janji terlebih dahulu via WhatsApp.",
    },
  },
  layanan: [
    {
      nama: "Poli Umum",
      icon: "umum",
      desc: "Pemeriksaan dan pengobatan untuk keluhan kesehatan sehari-hari orang dewasa.",
      items: [
        "Pemeriksaan dan konsultasi umum",
        "Surat keterangan sehat dan surat sakit",
        "Cek tekanan darah dan gula darah",
        "Penanganan keluhan ringan dan rujukan",
      ],
      ctaLabel: "Daftar ke Poli Umum",
      ctaMessage: "Halo Klinik Sehat Cahaya, saya ingin membuat janji di Poli Umum.",
    },
    {
      nama: "Poli Gigi",
      icon: "gigi",
      desc: "Perawatan gigi dan mulut untuk anak hingga dewasa, dengan tindakan yang jelas.",
      items: [
        "Pembersihan karang gigi (scaling)",
        "Tambal dan cabut gigi",
        "Perawatan saluran akar sederhana",
        "Konsultasi kesehatan gigi anak",
      ],
      ctaLabel: "Daftar ke Poli Gigi",
      ctaMessage: "Halo Klinik Sehat Cahaya, saya ingin membuat janji di Poli Gigi.",
    },
    {
      nama: "Poli Anak",
      icon: "anak",
      desc: "Layanan kesehatan khusus bayi, balita, dan anak hingga usia remaja.",
      items: [
        "Imunisasi dasar lengkap",
        "Pemantauan tumbuh kembang anak",
        "Konsultasi gizi dan MPASI",
        "Pemeriksaan dan pengobatan anak",
      ],
      ctaLabel: "Daftar ke Poli Anak",
      ctaMessage: "Halo Klinik Sehat Cahaya, saya ingin membuat janji di Poli Anak.",
    },
  ],
  jadwal: {
    columns: ["Hari", "Jam", "Poli / Dokter"],
    note: "Nama dokter di bawah ini contoh. TODO: ganti nama dokter asli.",
    rows: [
      { hari: "Senin – Jumat", jam: "08.00 – 20.00", poli: "Poli Umum", dokter: "dr. Sinta Maharani", todo: "TODO: ganti nama dokter asli" },
      { hari: "Sabtu", jam: "08.00 – 14.00", poli: "Poli Umum", dokter: "dr. Andi Firmansyah", todo: "TODO: ganti nama dokter asli" },
      { hari: "Senin, Rabu, Jumat", jam: "09.00 – 15.00", poli: "Poli Gigi", dokter: "drg. Bagas Pratama", todo: "TODO: ganti nama dokter asli" },
      { hari: "Selasa, Kamis", jam: "09.00 – 15.00", poli: "Poli Gigi", dokter: "drg. Lestari Wulandari", todo: "TODO: ganti nama dokter asli" },
      { hari: "Senin – Sabtu", jam: "08.00 – 13.00", poli: "Poli Anak", dokter: "dr. Nadia Kusuma", todo: "TODO: ganti nama dokter asli" },
      { hari: "Minggu", jam: "Tutup", poli: "—", dokter: "—", todo: "" },
    ],
  },
  alur: [
    { judul: "Buat janji via WhatsApp", desc: "Kirim nama lengkap, poli tujuan, dan tanggal yang diinginkan. Staf kami mengonfirmasi jadwal Anda." },
    { judul: "Datang dan registrasi", desc: "Tiba 10 menit sebelum jadwal. Bawa KTP atau kartu keluarga, dan kartu BPJS atau asuransi bila ada." },
    { judul: "Diperiksa dokter", desc: "Dokter memeriksa, menjelaskan hasil, dan menentukan pengobatan atau rujukan bila diperlukan." },
    { judul: "Ambil obat dan jadwal kontrol", desc: "Tebus obat di bagian farmasi dan catat jadwal kontrol bila dokter menyarankan kunjungan ulang." },
  ],
  pembayaran: [
    {
      nama: "Pasien Umum",
      desc: "Bayar langsung setiap kunjungan.",
      items: [
        "Tunai, QRIS, dan transfer bank",
        "Biaya konsultasi mulai Rp50.000 (TODO: sesuaikan tarif asli)",
        "Kuitansi resmi setiap pembayaran",
      ],
    },
    {
      nama: "BPJS Kesehatan",
      desc: "Untuk peserta aktif.",
      items: [
        "Bawa kartu BPJS atau KIS yang aktif",
        "Status kerja sama faskes (TODO: konfirmasi status kerja sama)",
        "Rujukan ke rumah sakit bila diperlukan",
      ],
    },
    {
      nama: "Asuransi Swasta",
      desc: "Untuk pemegang polis rekanan.",
      items: [
        "Bawa kartu peserta dan KTP",
        "Daftar perusahaan rekanan (TODO: daftar rekanan asli)",
        "Staf administrasi membantu proses klaim",
      ],
    },
  ],
  faq: [
    {
      q: "Apakah harus daftar dulu atau bisa langsung datang?",
      a: "Anda bisa langsung datang pada jam praktik. Namun pasien yang sudah membuat janji via WhatsApp diprioritaskan, sehingga waktu tunggu jauh lebih singkat. Kami menyarankan membuat janji terlebih dahulu.",
    },
    {
      q: "Apakah klinik menerima BPJS Kesehatan?",
      a: "Ya, kami melayani peserta BPJS Kesehatan yang aktif. Bawa kartu BPJS atau KIS Anda saat registrasi. (TODO: konfirmasi status kerja sama faskes tingkat pertama.)",
    },
    {
      q: "Bagaimana cara membuat janji berobat?",
      a: "Isi formulir janji cepat di bagian atas halaman ini, atau kirim pesan WhatsApp berisi nama lengkap, poli tujuan, dan tanggal yang diinginkan. Staf kami membalas dan mengonfirmasi jadwal pada jam praktik.",
    },
    {
      q: "Apakah ada layanan gawat darurat 24 jam?",
      a: "Klinik melayani sesuai jam praktik yang tercantum. Untuk keadaan darurat di luar jam praktik, segera datangi IGD rumah sakit terdekat atau hubungi 119.",
    },
    {
      q: "Apakah anak boleh berobat tanpa didampingi orang tua?",
      a: "Pasien di bawah usia 17 tahun wajib didampingi orang tua atau wali saat berobat. Mohon bawa kartu keluarga atau kartu identitas anak.",
    },
  ],
  kontak: {
    address: "Jl. Melati No. 12, Sukamaju, Bandung 40123",
    addressTodo: "TODO: ganti alamat asli",
    hours: "Senin–Jumat 08.00–20.00 · Sabtu 08.00–14.00 · Minggu tutup",
    phoneDisplay: "+62 812-3456-7890",
    wa: "6281234567890",
    waTodo: "TODO: ganti nomor WA asli",
    mapsQuery: "Jl. Melati No. 12, Sukamaju, Bandung",
    mapsLabel: "Buka di Google Maps",
    copyAddressLabel: "Salin alamat",
    emergencyNote:
      "Keadaan darurat di luar jam praktik: hubungi 119 atau datangi IGD terdekat.",
  },
  footer: {
    note: "Informasi di halaman ini bersifat umum dan bukan pengganti diagnosis dokter.",
    socials: [
      { href: "https://instagram.com/kliniksehatcahaya", label: "Instagram" },
      { href: "https://facebook.com/kliniksehatcahaya", label: "Facebook" },
    ],
  },
  jsonld: {
    priceRange: "Rp",
    openingHours: [
      { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "20:00" },
      { dayOfWeek: "Saturday", opens: "08:00", closes: "14:00" },
    ],
  },
};

/* Ikon SVG inline untuk kartu layanan (dekoratif, tanpa foto). */
const ICONS = {
  umum: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M12 8.4v7.2M8.4 12h7.2"/></svg>`,
  gigi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4.5c-2.9 0-4.6 1.6-4.6 3.9 0 1.9.9 2.9.9 4.9 0 2.4-1 5.2 1.6 5.2 1.5 0 1-2.9 2.1-2.9s.6 2.9 2.1 2.9c2.6 0 1.6-2.8 1.6-5.2 0-2 .9-3 .9-4.9 0-2.3-1.7-3.9-4.6-3.9z"/></svg>`,
  anak: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5"/><path d="M12 14v5.5M9.5 19.5h5"/></svg>`,
};

function mapsUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/* Beri id pada h2 kepala seksi agar cocok dengan aria-labelledby di HTML. */
function tagHead(containerId, headId) {
  const h = document.querySelector(`#${containerId} .section-title`);
  if (h) h.id = headId;
}

function renderNav(c) {
  const ctaHref = waLink(c.kontak.wa, c.nav.cta.message);
  document.getElementById("site-nav").innerHTML = navbarHTML({
    brand: c.brand,
    links: c.nav.links,
    cta: { href: ctaHref, label: c.nav.cta.label },
  });
}

function renderHero(c) {
  const badges = c.hero.badges
    .map((b) => `<li><strong>${esc(b.value)}</strong><span>${esc(b.label)}</span></li>`)
    .join("");
  document.getElementById("hero-copy").innerHTML = `
    <p class="hero-eyebrow">${esc(c.hero.eyebrow)}</p>
    <h1 id="hero-title">${c.hero.title}</h1>
    <p class="hero-desc">${esc(c.hero.desc)}</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="${waLink(c.kontak.wa, c.hero.ctaMessage)}"
         target="_blank" rel="noopener noreferrer">${esc(c.hero.ctaLabel)}</a>
    </div>
    <ul class="hero-badges">${badges}</ul>`;

  const options = c.hero.poliOptions
    .map((p) => `<option value="${esc(p)}">${esc(p)}</option>`)
    .join("");
  document.getElementById("hero-form").innerHTML = `
    <div class="janji-card">
      <h2>${esc(c.hero.formTitle)}</h2>
      <p>${esc(c.hero.formDesc)}</p>
      <form id="janji-form" novalidate>
        <div class="field">
          <label for="f-nama">${esc(c.hero.fields.nama)}</label>
          <input id="f-nama" name="nama" type="text" autocomplete="name" required
                 placeholder="cth: Sinta Maharani">
        </div>
        <div class="field">
          <label for="f-poli">${esc(c.hero.fields.poli)}</label>
          <select id="f-poli" name="poli" required>${options}</select>
        </div>
        <div class="field">
          <label for="f-tanggal">${esc(c.hero.fields.tanggal)}</label>
          <input id="f-tanggal" name="tanggal" type="date" required>
        </div>
        <div class="field">
          <label for="f-keluhan">${esc(c.hero.fields.keluhan)}</label>
          <textarea id="f-keluhan" name="keluhan" rows="2"
                    placeholder="cth: demam sejak kemarin"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">${esc(c.hero.submitLabel)}</button>
        <p class="form-note">${esc(c.hero.formNote)}</p>
      </form>
    </div>`;

  const dateInput = document.getElementById("f-tanggal");
  dateInput.min = new Date().toISOString().slice(0, 10);

  document.getElementById("janji-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("f-nama").value.trim();
    const poli = document.getElementById("f-poli").value;
    const tanggalRaw = document.getElementById("f-tanggal").value;
    const keluhan = document.getElementById("f-keluhan").value.trim();
    if (!nama || !tanggalRaw) {
      const target = !nama ? "f-nama" : "f-tanggal";
      const el = document.getElementById(target);
      el.setAttribute("aria-invalid", "true");
      el.focus();
      return;
    }
    const tanggal = new Date(`${tanggalRaw}T00:00:00`).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    let pesan = `Halo ${c.brand.name}, saya ${nama} ingin membuat janji di ${poli} pada ${tanggal}.`;
    if (keluhan) pesan += ` Keluhan: ${keluhan}`;
    window.open(waLink(c.kontak.wa, pesan), "_blank", "noopener");
  });
}

function renderLayanan(c) {
  document.getElementById("layanan-head").innerHTML = sectionHeadHTML(c.sections.layanan);
  tagHead("layanan-head", "layanan-title");
  document.getElementById("layanan-grid").innerHTML = c.layanan
    .map(
      (l) => `
    <article class="layanan-card">
      <span class="layanan-icon" aria-hidden="true">${ICONS[l.icon] || ICONS.umum}</span>
      <h3>${esc(l.nama)}</h3>
      <p>${esc(l.desc)}</p>
      <ul class="layanan-list">
        ${l.items.map((i) => `<li>${esc(i)}</li>`).join("")}
      </ul>
      <a class="layanan-cta" href="${waLink(c.kontak.wa, l.ctaMessage)}"
         target="_blank" rel="noopener noreferrer">${esc(l.ctaLabel)} →</a>
    </article>`
    )
    .join("");
}

function renderJadwal(c) {
  document.getElementById("jadwal-head").innerHTML = sectionHeadHTML(c.sections.jadwal);
  tagHead("jadwal-head", "jadwal-title");
  const rows = c.jadwal.rows
    .map(
      (r) => `
      <tr>
        <td>${esc(r.hari)}</td>
        <td>${esc(r.jam)}</td>
        <td><strong>${esc(r.poli)}</strong><br>${esc(r.dokter)}
          ${r.todo ? `<br><span class="dokter-todo">${esc(r.todo)}</span>` : ""}</td>
      </tr>`
    )
    .join("");
  document.getElementById("jadwal-body").innerHTML = `
    <p class="jadwal-note">${esc(c.jadwal.note)}</p>
    <div class="table-scroll">
      <table class="jadwal">
        <caption>Jadwal praktik dokter</caption>
        <thead><tr>
          ${c.jadwal.columns.map((col) => `<th scope="col">${esc(col)}</th>`).join("")}
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderAlur(c) {
  document.getElementById("alur-head").innerHTML = sectionHeadHTML(c.sections.alur);
  tagHead("alur-head", "alur-title");
  document.getElementById("alur-list").innerHTML = c.alur
    .map(
      (s) => `
    <li class="alur-step">
      <h3>${esc(s.judul)}</h3>
      <p>${esc(s.desc)}</p>
    </li>`
    )
    .join("");
}

function renderPembayaran(c) {
  document.getElementById("pembayaran-head").innerHTML = sectionHeadHTML(c.sections.pembayaran);
  tagHead("pembayaran-head", "pembayaran-title");
  document.getElementById("pembayaran-grid").innerHTML = c.pembayaran
    .map(
      (p) => `
    <article class="bayar-card">
      <h3>${esc(p.nama)}</h3>
      <p>${esc(p.desc)}</p>
      <ul>${p.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </article>`
    )
    .join("");
}

function renderFaq(c) {
  document.getElementById("faq-head").innerHTML = sectionHeadHTML(c.sections.faq);
  tagHead("faq-head", "faq-title");
  document.getElementById("faq-wrap").innerHTML = c.faq
    .map(
      (f) => `
    <div class="faq-item" data-faq-item>
      <button class="faq-q" data-faq-q type="button">
        <span>${esc(f.q)}</span>
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-a" data-faq-a><p>${esc(f.a)}</p></div>
    </div>`
    )
    .join("");
}

function renderKontak(c) {
  document.getElementById("kontak-head").innerHTML = sectionHeadHTML(c.sections.kontak);
  tagHead("kontak-head", "kontak-title");
  const k = c.kontak;
  document.getElementById("kontak-grid").innerHTML = `
    <div class="kontak-card">
      <h3>Informasi kunjungan</h3>
      <ul class="kontak-list">
        <li><span class="k-label">Alamat</span><address>${esc(k.address)}</address></li>
        <li><span class="k-label">Jam praktik</span><span>${esc(k.hours)}</span></li>
        <li><span class="k-label">WhatsApp / Telepon</span>
          <a href="tel:${k.wa}">${esc(k.phoneDisplay)}</a></li>
      </ul>
      <button type="button" class="copy-btn" data-copy="${esc(k.address)}">${esc(k.copyAddressLabel)}</button>
      <p class="emergency-note">${esc(k.emergencyNote)}</p>
    </div>
    <div class="kontak-card">
      <h3>Aksi cepat</h3>
      <div class="kontak-actions">
        <a class="btn btn-primary" href="${waLink(k.wa, c.nav.cta.message)}"
           target="_blank" rel="noopener noreferrer">${esc(c.hero.ctaLabel)}</a>
        <a class="btn btn-outline" href="${mapsUrl(k.mapsQuery)}"
           target="_blank" rel="noopener noreferrer">${esc(k.mapsLabel)}</a>
      </div>
    </div>`;
}

function renderFooter(c) {
  document.getElementById("site-footer").innerHTML = footerHTML({
    brand: c.brand,
    contact: {
      address: c.kontak.address,
      hours: c.kontak.hours,
      phone: c.kontak.phoneDisplay,
    },
    socials: c.footer.socials,
    note: c.footer.note,
  });
}

function injectJsonLd(c) {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: c.brand.name,
    description: c.meta.description,
    telephone: `+${String(c.kontak.wa).replace(/\D/g, "")}`,
    priceRange: c.jsonld.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: c.kontak.address,
      addressLocality: "Bandung",
      addressCountry: "ID",
    },
    openingHoursSpecification: c.jsonld.openingHours.map((o) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: o.dayOfWeek,
      opens: o.opens,
      closes: o.closes,
    })),
    hasMap: mapsUrl(c.kontak.mapsQuery),
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

async function init() {
  const notice = document.getElementById("notice");
  const c = await loadContent("content.json", FALLBACK, notice);

  document.title = c.meta.title;
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", c.meta.description);
  document
    .querySelector('meta[property="og:title"]')
    .setAttribute("content", c.meta.ogTitle);
  document
    .querySelector('meta[property="og:description"]')
    .setAttribute("content", c.meta.ogDescription);

  renderNav(c);
  renderHero(c);
  renderLayanan(c);
  renderJadwal(c);
  renderAlur(c);
  renderPembayaran(c);
  renderFaq(c);
  renderKontak(c);
  renderFooter(c);
  injectJsonLd(c);

  initMobileNav();
  initFaq();
  initCopyButtons();
  setYear();
}

init();
