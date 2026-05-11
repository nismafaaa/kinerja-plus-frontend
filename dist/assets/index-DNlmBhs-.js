(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();function T(e){return`
    <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle menu">☰</button>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar__brand">
        <div class="sidebar__logo">
          <div class="sidebar__logo-icon">📊</div>
          <div>
            <span class="sidebar__logo-text">Kinerja Plus</span>
            <span class="sidebar__logo-badge">AI Prototype</span>
          </div>
        </div>
      </div>
      <nav class="sidebar__nav">
        <div class="sidebar__section-label">Modul Perencanaan</div>
        <a href="#/indikator-tujuan"
           class="sidebar__nav-item ${e==="tujuan"?"sidebar__nav-item--active":""}"
           id="nav-tujuan">
          <span class="sidebar__nav-icon">🎯</span>
          Indikator Tujuan
        </a>
        <a href="#/indikator-sasaran"
           class="sidebar__nav-item ${e==="sasaran"?"sidebar__nav-item--active":""}"
           id="nav-sasaran">
          <span class="sidebar__nav-icon">📋</span>
          Indikator Sasaran
        </a>
      </nav>
      <div class="sidebar__footer">
        <div class="sidebar__footer-text">IPVS — Intelligent Planning<br>Validation System</div>
      </div>
    </aside>
  `}function P(){const e=document.getElementById("sidebar-toggle"),a=document.getElementById("sidebar"),n=document.getElementById("sidebar-overlay");!e||!a||!n||(e.addEventListener("click",()=>{a.classList.toggle("sidebar--open"),n.classList.toggle("sidebar-overlay--visible")}),n.addEventListener("click",()=>{a.classList.remove("sidebar--open"),n.classList.remove("sidebar-overlay--visible")}))}function b(e,a){return`
    <header class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title">
          ${e}
          <span class="page-header__ai-badge">✨ AI-Assisted</span>
        </h1>
        <p class="page-header__subtitle">${a}</p>
      </div>
    </header>
  `}function v(e=6){let a="";for(let n=0;n<e;n++)a+=`
      <div class="skeleton-card" style="animation-delay: ${n*.1}s">
        <div class="skeleton skeleton-line--title"></div>
        <div class="skeleton skeleton-block"></div>
        <div class="skeleton skeleton-line--medium"></div>
        <div class="skeleton-actions">
          <div class="skeleton skeleton-btn"></div>
          <div class="skeleton skeleton-btn"></div>
          <div class="skeleton skeleton-btn"></div>
        </div>
      </div>
    `;return a}function _(e,a,n=0){const r=n*.08;return`
    <div class="rec-card" id="rec-${e}" style="animation-delay: ${r}s" data-field="${e}">
      <div class="rec-card__header">
        <div class="rec-card__label">
          <span class="rec-card__ai-icon">✨</span>
          ${a.label}
        </div>
        <span class="rec-card__status rec-card__status--pending" id="status-${e}">Rekomendasi AI</span>
      </div>
      <div class="rec-card__value" id="value-${e}">${a.value}</div>
      <div class="rec-card__reasoning">
        <span class="rec-card__reasoning-icon">💡</span>
        <span>${a.reasoning}</span>
      </div>
      <div class="rec-card__edit-area" id="edit-area-${e}" style="display:none;">
        <textarea id="edit-input-${e}">${a.value}</textarea>
      </div>
      <div class="rec-card__actions" id="actions-${e}">
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${e}">
          ✅ Terima
        </button>
        <button class="btn btn--outline btn--sm" data-action="edit" data-field="${e}">
          ✏️ Edit
        </button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="${e}">
          ❌ Tolak
        </button>
      </div>
    </div>
  `}function f(e,a=0){const n=a*.08,r=Object.entries(e.values).map(([s,i])=>`
      <div class="target-grid__item">
        <div class="target-grid__year">Target ${s}</div>
        <div class="target-grid__value">${i}</div>
        <div class="target-grid__trend">▲</div>
      </div>
    `).join("");return`
    <div class="rec-card" id="rec-targetPeriode" style="animation-delay: ${n}s" data-field="targetPeriode">
      <div class="rec-card__header">
        <div class="rec-card__label">
          <span class="rec-card__ai-icon">✨</span>
          ${e.label}
        </div>
        <span class="rec-card__status rec-card__status--pending" id="status-targetPeriode">Rekomendasi AI</span>
      </div>
      <div class="target-grid" id="value-targetPeriode">
        ${r}
      </div>
      <div class="rec-card__reasoning" style="margin-top: var(--space-md);">
        <span class="rec-card__reasoning-icon">💡</span>
        <span>${e.reasoning}</span>
      </div>
      <div class="rec-card__actions" id="actions-targetPeriode">
        <button class="btn btn--success btn--sm" data-action="accept" data-field="targetPeriode">
          ✅ Terima Semua Target
        </button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="targetPeriode">
          ❌ Tolak
        </button>
      </div>
    </div>
  `}function h(e,a){const n={};return Object.keys(e).forEach(s=>{n[s]={status:"pending",value:e[s].value||""}}),document.addEventListener("click",function(i){const d=i.target.closest("[data-action]");if(!d)return;const o=d.dataset.action,t=d.dataset.field;if(!t||!n[t])return;const c=document.getElementById(`rec-${t}`),u=document.getElementById(`status-${t}`),m=document.getElementById(`actions-${t}`),l=document.getElementById(`edit-area-${t}`),g=document.getElementById(`value-${t}`);if(o==="accept"){if(n[t].status==="editing"&&l){const p=document.getElementById(`edit-input-${t}`);p&&(n[t].value=p.value,g&&(g.textContent=p.value)),l.style.display="none"}n[t].status="accepted",c.classList.remove("rec-card--rejected"),c.classList.add("rec-card--accepted"),u.className="rec-card__status rec-card__status--accepted",u.textContent="✓ Diterima",m.innerHTML=`
        <button class="btn btn--outline btn--sm" data-action="undo" data-field="${t}">
          ↩ Batalkan
        </button>
      `,k("Rekomendasi diterima","success")}if(o==="edit"&&(n[t].status="editing",u.className="rec-card__status rec-card__status--editing",u.textContent="Sedang Diedit",l&&(l.style.display="block"),m.innerHTML=`
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${t}">
          💾 Simpan
        </button>
        <button class="btn btn--outline btn--sm" data-action="cancel-edit" data-field="${t}">
          Batal
        </button>
      `),o==="cancel-edit"&&(n[t].status="pending",u.className="rec-card__status rec-card__status--pending",u.textContent="Rekomendasi AI",l&&(l.style.display="none"),m.innerHTML=`
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${t}">✅ Terima</button>
        <button class="btn btn--outline btn--sm" data-action="edit" data-field="${t}">✏️ Edit</button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="${t}">❌ Tolak</button>
      `),o==="reject"&&(n[t].status="rejected",c.classList.add("rec-card--rejected"),u.className="rec-card__status",u.textContent="Ditolak",m.innerHTML=`
        <button class="btn btn--outline btn--sm" data-action="undo" data-field="${t}">
          ↩ Kembalikan
        </button>
      `,k("Rekomendasi ditolak","info")),o==="undo"){n[t].status="pending",c.classList.remove("rec-card--accepted","rec-card--rejected"),u.className="rec-card__status rec-card__status--pending",u.textContent="Rekomendasi AI";const p=t==="targetPeriode";m.innerHTML=p?`
          <button class="btn btn--success btn--sm" data-action="accept" data-field="${t}">✅ Terima Semua Target</button>
          <button class="btn btn--danger btn--sm" data-action="reject" data-field="${t}">❌ Tolak</button>
        `:`
          <button class="btn btn--success btn--sm" data-action="accept" data-field="${t}">✅ Terima</button>
          <button class="btn btn--outline btn--sm" data-action="edit" data-field="${t}">✏️ Edit</button>
          <button class="btn btn--danger btn--sm" data-action="reject" data-field="${t}">❌ Tolak</button>
        `}}),n}function k(e,a="info"){document.querySelectorAll(".toast").forEach(r=>r.remove());const n=document.createElement("div");n.className=`toast toast--${a}`,n.innerHTML=`<span>${a==="success"?"✓":"ℹ"}</span> ${e}`,document.body.appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transform="translateY(10px)",n.style.transition="all 0.3s ease",setTimeout(()=>n.remove(),300)},2e3)}function S(e){return new Promise(a=>setTimeout(a,e))}function j(){return S(1500+Math.random()*1500)}const $={uraianIndikator:{value:"Indeks Kesehatan Masyarakat",reasoning:"Berdasarkan analisis semantic similarity terhadap tujuan strategis yang diinput, indikator ini memiliki relevansi tinggi (skor 0.92) dengan konteks peningkatan kualitas layanan kesehatan. Referensi: Kepmendagri No. 050-5889 Tahun 2021."},indikatorMinimum:{value:"Tidak",reasoning:"Indeks Kesehatan bersifat positif — semakin tinggi nilainya semakin baik. Oleh karena itu, indikator ini bukan indikator minimum. AI merekomendasikan target yang meningkat setiap periode."},definisiOperasional:{value:"Indeks komposit yang mengukur derajat kesehatan masyarakat berdasarkan angka harapan hidup, angka kesakitan, dan cakupan layanan kesehatan dasar sesuai standar SPM Kesehatan.",reasoning:"Definisi disusun berdasarkan referensi BPS dan standar Dinas Kesehatan. Mencakup aspek outcome sesuai prinsip cascading indikator SAKIP."},rumusHitung:{value:"(Angka Harapan Hidup × 0.4) + (Cakupan Layanan Kesehatan Dasar × 0.35) + (Indeks Kepuasan Layanan Kesehatan × 0.25)",reasoning:"Formula berbasis komposit indeks tertimbang, mengacu pada metodologi BPS dan Kemenkes RI. Bobot disesuaikan dengan prioritas pembangunan kesehatan daerah."},sumberData:{value:"Dinas Kesehatan, BPS Kabupaten/Kota, Laporan SPM Kesehatan Tahunan",reasoning:"Sumber data dipilih berdasarkan ketersediaan dan validitas data. Dinas Kesehatan sebagai sumber primer, BPS sebagai sumber verifikasi."},targetPeriode:{values:{2027:"75.50",2028:"77.20",2029:"79.00",2030:"80.80",2031:"82.50"},reasoning:"Target diproyeksikan berdasarkan tren historis 2021–2026 dengan pertumbuhan rata-rata 2.1% per tahun. Mempertimbangkan target RPJMD dan kapasitas daerah."}},A={uraianIndikator:{value:"Angka Partisipasi Murni (APM) Pendidikan Dasar",reasoning:"Indikator APM dipilih karena relevansi tinggi (skor 0.89) dengan sasaran strategis peningkatan akses pendidikan. Sesuai nomenklatur Kepmendagri No. 050-5889 Tahun 2021."},indikatorMinimum:{value:"Tidak",reasoning:"APM bersifat positif — semakin tinggi partisipasi semakin baik. Bukan indikator minimum, sehingga target direkomendasikan meningkat."},definisiOperasional:{value:"Persentase penduduk usia sekolah (7-12 tahun) yang bersekolah pada jenjang pendidikan dasar (SD/MI) terhadap total penduduk usia 7-12 tahun di wilayah tersebut.",reasoning:"Definisi mengacu pada standar Kemendikbud dan BPS. Fokus pada outcome akses pendidikan, bukan output kegiatan."},rumusHitung:{value:"(Jumlah siswa usia 7–12 tahun yang bersekolah di SD/MI ÷ Jumlah penduduk usia 7–12 tahun) × 100%",reasoning:"Rumus standar BPS untuk penghitungan APM. Sumber data: Data Pokok Pendidikan (Dapodik) dan data kependudukan."},sumberData:{value:"Dinas Pendidikan, Dapodik, BPS Kabupaten/Kota",reasoning:"Dapodik menyediakan data siswa terdaftar, BPS menyediakan data kependudukan sebagai denominator."},targetPeriode:{values:{2027:"96.50",2028:"97.00",2029:"97.50",2030:"98.00",2031:"98.40"},reasoning:"Target diproyeksikan mendekati universal enrollment (100%). Pertumbuhan melambat karena mendekati saturasi. Mempertimbangkan kondisi geografis daerah."}},E={uraianIndikator:{value:"Indeks Kinerja Pembangunan Daerah",reasoning:"Rekomendasi indikator umum berdasarkan konteks perencanaan pembangunan daerah. Dapat disesuaikan lebih lanjut sesuai bidang urusan spesifik."},indikatorMinimum:{value:"Tidak",reasoning:"Secara default, indikator kinerja pembangunan bersifat positif. Nilai yang lebih tinggi menunjukkan kinerja yang lebih baik."},definisiOperasional:{value:"Ukuran komposit yang menggambarkan capaian kinerja pembangunan daerah berdasarkan indikator-indikator utama sesuai RPJMD dan standar pemerintah.",reasoning:"Definisi umum yang dapat diperdalam sesuai konteks spesifik indikator."},rumusHitung:{value:"Realisasi Capaian ÷ Target × 100%",reasoning:"Rumus dasar pengukuran capaian kinerja. Dapat dikustomisasi sesuai jenis indikator spesifik."},sumberData:{value:"OPD Terkait, BPS, Laporan Kinerja Tahunan",reasoning:"Sumber data umum. Disarankan untuk diverifikasi dan dilengkapi sesuai bidang urusan."},targetPeriode:{values:{2027:"80.00",2028:"82.50",2029:"85.00",2030:"87.50",2031:"90.00"},reasoning:"Target dasar dengan pertumbuhan linear 2.5% per tahun. Perlu disesuaikan berdasarkan data historis aktual."}};function M(e){const a=e.toLowerCase();return a.includes("kesehatan")||a.includes("stunting")||a.includes("gizi")||a.includes("harapan hidup")?$:a.includes("pendidikan")||a.includes("sekolah")||a.includes("literasi")||a.includes("partisipasi")?A:E}async function y(e,a){await j();const n=M(a);return{uraianIndikator:{label:`Uraian Indikator ${e==="tujuan"?"Tujuan":"Sasaran"}`,...n.uraianIndikator},indikatorMinimum:{label:"Indikator Minimum",...n.indikatorMinimum},definisiOperasional:{label:"Definisi Operasional",...n.definisiOperasional},rumusHitung:{label:"Rumus Hitung",...n.rumusHitung},sumberData:{label:"Sumber Data",...n.sumberData},targetPeriode:{label:"Target Periode Berikutnya",...n.targetPeriode}}}function D(){return`
    ${b("Indikator Tujuan","Susun indikator berdasarkan Tujuan Strategis dengan bantuan AI")}
    <div class="page-body">

      <!-- STEP 1: Input -->
      <div class="step-section" id="step-input">
        <div class="step-label">
          <span class="step-number">1</span>
          Masukkan Tujuan Strategis
        </div>
        <div class="input-group">
          <label class="input-group__label" for="input-tujuan">Tujuan Strategis</label>
          <p class="input-group__hint">
            Ketik tujuan strategis organisasi Anda. AI akan memberikan rekomendasi indikator secara otomatis.
          </p>
          <textarea
            id="input-tujuan"
            placeholder="Contoh: Meningkatkan kualitas layanan kesehatan masyarakat"
          ></textarea>
        </div>
        <button class="btn btn--ai" id="btn-generate-tujuan" disabled>
          ✨ Dapatkan Rekomendasi AI
        </button>
      </div>

      <!-- STEP 2: AI Recommendations -->
      <div class="step-section" id="step-recommendations-tujuan" style="display:none;">
        <div class="step-label">
          <span class="step-number">2</span>
          Tinjau Rekomendasi AI
        </div>
        <p class="input-group__hint" style="margin-bottom: var(--space-lg);">
          AI telah menganalisis tujuan strategis Anda dan memberikan rekomendasi untuk setiap field.
          Anda dapat <strong>menerima</strong>, <strong>mengedit</strong>, atau <strong>menolak</strong> setiap rekomendasi.
        </p>
        <div id="recs-container-tujuan"></div>
      </div>

    </div>
  `}function L(){const e=document.getElementById("input-tujuan"),a=document.getElementById("btn-generate-tujuan"),n=document.getElementById("step-recommendations-tujuan"),r=document.getElementById("recs-container-tujuan");!e||!a||(e.addEventListener("input",()=>{a.disabled=e.value.trim().length<5}),a.addEventListener("click",async()=>{const s=e.value.trim();if(s){n.style.display="block",r.innerHTML=v(6),a.disabled=!0,a.innerHTML="⏳ Menganalisis...",n.scrollIntoView({behavior:"smooth",block:"start"});try{const i=await y("tujuan",s);let d="";const o=["uraianIndikator","indikatorMinimum","definisiOperasional","rumusHitung","sumberData"];o.forEach((t,c)=>{d+=_(t,i[t],c)}),d+=f(i.targetPeriode,o.length),r.innerHTML=`
        <div class="recs-section">
          <div class="recs-section__title">
            <span class="recs-section__ai-sparkle">🤖</span>
            Rekomendasi AI untuk Tujuan Anda
          </div>
          ${d}
        </div>
      `,h(i)}catch{r.innerHTML=`
        <div class="empty-state">
          <div class="empty-state__icon">⚠️</div>
          <div class="empty-state__text">Terjadi kesalahan saat memuat rekomendasi. Silakan coba lagi.</div>
        </div>
      `}a.disabled=!1,a.innerHTML="✨ Dapatkan Rekomendasi AI"}}))}function B(){return`
    ${b("Indikator Sasaran","Susun indikator berdasarkan Sasaran Strategis dengan bantuan AI")}
    <div class="page-body">

      <!-- STEP 1: Input -->
      <div class="step-section" id="step-input-sasaran">
        <div class="step-label">
          <span class="step-number">1</span>
          Masukkan Sasaran Strategis
        </div>
        <div class="input-group">
          <label class="input-group__label" for="input-sasaran">Sasaran Strategis</label>
          <p class="input-group__hint">
            Ketik sasaran strategis organisasi Anda. AI akan memberikan rekomendasi indikator secara otomatis.
          </p>
          <textarea
            id="input-sasaran"
            placeholder="Contoh: Meningkatnya akses dan kualitas pendidikan dasar"
          ></textarea>
        </div>
        <button class="btn btn--ai" id="btn-generate-sasaran" disabled>
          ✨ Dapatkan Rekomendasi AI
        </button>
      </div>

      <!-- STEP 2: AI Recommendations -->
      <div class="step-section" id="step-recommendations-sasaran" style="display:none;">
        <div class="step-label">
          <span class="step-number">2</span>
          Tinjau Rekomendasi AI
        </div>
        <p class="input-group__hint" style="margin-bottom: var(--space-lg);">
          AI telah menganalisis sasaran strategis Anda dan memberikan rekomendasi untuk setiap field.
          Anda dapat <strong>menerima</strong>, <strong>mengedit</strong>, atau <strong>menolak</strong> setiap rekomendasi.
        </p>
        <div id="recs-container-sasaran"></div>
      </div>

    </div>
  `}function H(){const e=document.getElementById("input-sasaran"),a=document.getElementById("btn-generate-sasaran"),n=document.getElementById("step-recommendations-sasaran"),r=document.getElementById("recs-container-sasaran");!e||!a||(e.addEventListener("input",()=>{a.disabled=e.value.trim().length<5}),a.addEventListener("click",async()=>{const s=e.value.trim();if(s){n.style.display="block",r.innerHTML=v(6),a.disabled=!0,a.innerHTML="⏳ Menganalisis...",n.scrollIntoView({behavior:"smooth",block:"start"});try{const i=await y("sasaran",s);let d="";const o=["uraianIndikator","indikatorMinimum","definisiOperasional","rumusHitung","sumberData"];o.forEach((t,c)=>{d+=_(t,i[t],c)}),d+=f(i.targetPeriode,o.length),r.innerHTML=`
        <div class="recs-section">
          <div class="recs-section__title">
            <span class="recs-section__ai-sparkle">🤖</span>
            Rekomendasi AI untuk Sasaran Anda
          </div>
          ${d}
        </div>
      `,h(i)}catch{r.innerHTML=`
        <div class="empty-state">
          <div class="empty-state__icon">⚠️</div>
          <div class="empty-state__text">Terjadi kesalahan saat memuat rekomendasi. Silakan coba lagi.</div>
        </div>
      `}a.disabled=!1,a.innerHTML="✨ Dapatkan Rekomendasi AI"}}))}const R=document.getElementById("app");function x(){return(window.location.hash||"#/indikator-tujuan").includes("indikator-sasaran")?"sasaran":"tujuan"}function I(){const e=x();let a="",n="";e==="sasaran"?(n="sasaran",a=B()):(n="tujuan",a=D()),R.innerHTML=`
    ${T(n)}
    <main class="main-content">
      ${a}
    </main>
  `,P(),e==="sasaran"?H():L()}window.addEventListener("hashchange",I);I();
