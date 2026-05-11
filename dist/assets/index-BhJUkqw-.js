(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();function j(e){return`
    <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle menu">&#9776;</button>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar__brand">
        <div class="sidebar__logo">
          <div class="sidebar__logo-icon">K+</div>
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
          <span class="sidebar__nav-icon">&bull;</span>
          Indikator Tujuan
        </a>
        <a href="#/indikator-sasaran"
           class="sidebar__nav-item ${e==="sasaran"?"sidebar__nav-item--active":""}"
           id="nav-sasaran">
          <span class="sidebar__nav-icon">&bull;</span>
          Indikator Sasaran
        </a>
        <a href="#/target-forecasting"
           class="sidebar__nav-item ${e==="forecasting"?"sidebar__nav-item--active":""}"
           id="nav-forecasting">
          <span class="sidebar__nav-icon">&bull;</span>
          Target Forecasting
        </a>
      </nav>
      <div class="sidebar__footer">
        <div class="sidebar__footer-text">IPVS — Intelligent Planning<br>Validation System</div>
      </div>
    </aside>
  `}function S(){const e=document.getElementById("sidebar-toggle"),a=document.getElementById("sidebar"),t=document.getElementById("sidebar-overlay");!e||!a||!t||(e.addEventListener("click",()=>{a.classList.toggle("sidebar--open"),t.classList.toggle("sidebar-overlay--visible")}),t.addEventListener("click",()=>{a.classList.remove("sidebar--open"),t.classList.remove("sidebar-overlay--visible")}))}function v(e,a){return`
    <header class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title">
          ${e}
          <span class="page-header__ai-badge">AI-Assisted</span>
        </h1>
        <p class="page-header__subtitle">${a}</p>
      </div>
    </header>
  `}function k(e=6){let a="";for(let t=0;t<e;t++)a+=`
      <div class="skeleton-card" style="animation-delay: ${t*.1}s">
        <div class="skeleton skeleton-line--title"></div>
        <div class="skeleton skeleton-block"></div>
        <div class="skeleton skeleton-line--medium"></div>
        <div class="skeleton-actions">
          <div class="skeleton skeleton-btn"></div>
          <div class="skeleton skeleton-btn"></div>
          <div class="skeleton skeleton-btn"></div>
        </div>
      </div>
    `;return a}function f(e,a,t=0){const r=t*.08;return`
    <div class="rec-card" id="rec-${e}" style="animation-delay: ${r}s" data-field="${e}">
      <div class="rec-card__header">
        <div class="rec-card__label">
          <span class="rec-card__ai-icon">AI</span>
          ${a.label}
        </div>
        <span class="rec-card__status rec-card__status--pending" id="status-${e}">Rekomendasi AI</span>
      </div>
      <div class="rec-card__value" id="value-${e}">${a.value}</div>
      <div class="rec-card__reasoning">
        <span class="rec-card__reasoning-icon">i</span>
        <span>${a.reasoning}</span>
      </div>
      <div class="rec-card__edit-area" id="edit-area-${e}" style="display:none;">
        <textarea id="edit-input-${e}">${a.value}</textarea>
      </div>
      <div class="rec-card__actions" id="actions-${e}">
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${e}">
          Terima
        </button>
        <button class="btn btn--outline btn--sm" data-action="edit" data-field="${e}">
          Edit
        </button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="${e}">
          Tolak
        </button>
      </div>
    </div>
  `}function h(e,a=0){const t=a*.08,r=Object.entries(e.values).map(([s,i])=>`
      <div class="target-grid__item">
        <div class="target-grid__year">Target ${s}</div>
        <div class="target-grid__value">${i}</div>
      </div>
    `).join("");return`
    <div class="rec-card" id="rec-targetPeriode" style="animation-delay: ${t}s" data-field="targetPeriode">
      <div class="rec-card__header">
        <div class="rec-card__label">
          <span class="rec-card__ai-icon">AI</span>
          ${e.label}
        </div>
        <span class="rec-card__status rec-card__status--pending" id="status-targetPeriode">Rekomendasi AI</span>
      </div>
      <div class="target-grid" id="value-targetPeriode">
        ${r}
      </div>
      <div class="rec-card__reasoning" style="margin-top: var(--space-md);">
        <span class="rec-card__reasoning-icon">i</span>
        <span>${e.reasoning}</span>
      </div>
      <div class="rec-card__actions" id="actions-targetPeriode">
        <button class="btn btn--success btn--sm" data-action="accept" data-field="targetPeriode">
          Terima Semua Target
        </button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="targetPeriode">
          Tolak
        </button>
      </div>
    </div>
  `}function y(e,a){const t={};return Object.keys(e).forEach(s=>{t[s]={status:"pending",value:e[s].value||""}}),document.addEventListener("click",function(i){const o=i.target.closest("[data-action]");if(!o)return;const d=o.dataset.action,n=o.dataset.field;if(!n||!t[n])return;const u=document.getElementById(`rec-${n}`),c=document.getElementById(`status-${n}`),g=document.getElementById(`actions-${n}`),p=document.getElementById(`edit-area-${n}`),m=document.getElementById(`value-${n}`);if(d==="accept"){if(t[n].status==="editing"&&p){const l=document.getElementById(`edit-input-${n}`);l&&(t[n].value=l.value,m&&(m.textContent=l.value)),p.style.display="none"}t[n].status="accepted",u.classList.remove("rec-card--rejected"),u.classList.add("rec-card--accepted"),c.className="rec-card__status rec-card__status--accepted",c.textContent="Diterima",g.innerHTML=`
        <button class="btn btn--outline btn--sm" data-action="undo" data-field="${n}">
          Batalkan
        </button>
      `,_("Rekomendasi diterima","success")}if(d==="edit"&&(t[n].status="editing",c.className="rec-card__status rec-card__status--editing",c.textContent="Sedang Diedit",p&&(p.style.display="block"),g.innerHTML=`
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${n}">
          Simpan
        </button>
        <button class="btn btn--outline btn--sm" data-action="cancel-edit" data-field="${n}">
          Batal
        </button>
      `),d==="cancel-edit"&&(t[n].status="pending",c.className="rec-card__status rec-card__status--pending",c.textContent="Rekomendasi AI",p&&(p.style.display="none"),g.innerHTML=`
        <button class="btn btn--success btn--sm" data-action="accept" data-field="${n}">Terima</button>
        <button class="btn btn--outline btn--sm" data-action="edit" data-field="${n}">Edit</button>
        <button class="btn btn--danger btn--sm" data-action="reject" data-field="${n}">Tolak</button>
      `),d==="reject"&&(t[n].status="rejected",u.classList.add("rec-card--rejected"),c.className="rec-card__status",c.textContent="Ditolak",g.innerHTML=`
        <button class="btn btn--outline btn--sm" data-action="undo" data-field="${n}">
          Kembalikan
        </button>
      `,_("Rekomendasi ditolak","info")),d==="undo"){t[n].status="pending",u.classList.remove("rec-card--accepted","rec-card--rejected"),c.className="rec-card__status rec-card__status--pending",c.textContent="Rekomendasi AI";const l=n==="targetPeriode";g.innerHTML=l?`
          <button class="btn btn--success btn--sm" data-action="accept" data-field="${n}">Terima Semua Target</button>
          <button class="btn btn--danger btn--sm" data-action="reject" data-field="${n}">Tolak</button>
        `:`
          <button class="btn btn--success btn--sm" data-action="accept" data-field="${n}">Terima</button>
          <button class="btn btn--outline btn--sm" data-action="edit" data-field="${n}">Edit</button>
          <button class="btn btn--danger btn--sm" data-action="reject" data-field="${n}">Tolak</button>
        `}}),t}function _(e,a="info"){document.querySelectorAll(".toast").forEach(r=>r.remove());const t=document.createElement("div");t.className=`toast toast--${a}`,t.innerHTML=`${e}`,document.body.appendChild(t),setTimeout(()=>{t.style.opacity="0",t.style.transform="translateY(10px)",t.style.transition="all 0.3s ease",setTimeout(()=>t.remove(),300)},2e3)}function A(e){return new Promise(a=>setTimeout(a,e))}function T(){return A(1500+Math.random()*1500)}const M={uraianIndikator:{value:"Indeks Kesehatan Masyarakat",reasoning:"Berdasarkan analisis semantic similarity terhadap tujuan strategis yang diinput, indikator ini memiliki relevansi tinggi (skor 0.92) dengan konteks peningkatan kualitas layanan kesehatan. Referensi: Kepmendagri No. 050-5889 Tahun 2021."},indikatorMinimum:{value:"Tidak",reasoning:"Indeks Kesehatan bersifat positif — semakin tinggi nilainya semakin baik. Oleh karena itu, indikator ini bukan indikator minimum. AI merekomendasikan target yang meningkat setiap periode."},definisiOperasional:{value:"Indeks komposit yang mengukur derajat kesehatan masyarakat berdasarkan angka harapan hidup, angka kesakitan, dan cakupan layanan kesehatan dasar sesuai standar SPM Kesehatan.",reasoning:"Definisi disusun berdasarkan referensi BPS dan standar Dinas Kesehatan. Mencakup aspek outcome sesuai prinsip cascading indikator SAKIP."},rumusHitung:{value:"(Angka Harapan Hidup × 0.4) + (Cakupan Layanan Kesehatan Dasar × 0.35) + (Indeks Kepuasan Layanan Kesehatan × 0.25)",reasoning:"Formula berbasis komposit indeks tertimbang, mengacu pada metodologi BPS dan Kemenkes RI. Bobot disesuaikan dengan prioritas pembangunan kesehatan daerah."},sumberData:{value:"Dinas Kesehatan, BPS Kabupaten/Kota, Laporan SPM Kesehatan Tahunan",reasoning:"Sumber data dipilih berdasarkan ketersediaan dan validitas data. Dinas Kesehatan sebagai sumber primer, BPS sebagai sumber verifikasi."},targetPeriode:{values:{2027:"75.50",2028:"77.20",2029:"79.00",2030:"80.80",2031:"82.50"},reasoning:"Target diproyeksikan berdasarkan tren historis 2021–2026 dengan pertumbuhan rata-rata 2.1% per tahun. Mempertimbangkan target RPJMD dan kapasitas daerah."}},E={uraianIndikator:{value:"Angka Partisipasi Murni (APM) Pendidikan Dasar",reasoning:"Indikator APM dipilih karena relevansi tinggi (skor 0.89) dengan sasaran strategis peningkatan akses pendidikan. Sesuai nomenklatur Kepmendagri No. 050-5889 Tahun 2021."},indikatorMinimum:{value:"Tidak",reasoning:"APM bersifat positif — semakin tinggi partisipasi semakin baik. Bukan indikator minimum, sehingga target direkomendasikan meningkat."},definisiOperasional:{value:"Persentase penduduk usia sekolah (7-12 tahun) yang bersekolah pada jenjang pendidikan dasar (SD/MI) terhadap total penduduk usia 7-12 tahun di wilayah tersebut.",reasoning:"Definisi mengacu pada standar Kemendikbud dan BPS. Fokus pada outcome akses pendidikan, bukan output kegiatan."},rumusHitung:{value:"(Jumlah siswa usia 7–12 tahun yang bersekolah di SD/MI ÷ Jumlah penduduk usia 7–12 tahun) × 100%",reasoning:"Rumus standar BPS untuk penghitungan APM. Sumber data: Data Pokok Pendidikan (Dapodik) dan data kependudukan."},sumberData:{value:"Dinas Pendidikan, Dapodik, BPS Kabupaten/Kota",reasoning:"Dapodik menyediakan data siswa terdaftar, BPS menyediakan data kependudukan sebagai denominator."},targetPeriode:{values:{2027:"96.50",2028:"97.00",2029:"97.50",2030:"98.00",2031:"98.40"},reasoning:"Target diproyeksikan mendekati universal enrollment (100%). Pertumbuhan melambat karena mendekati saturasi. Mempertimbangkan kondisi geografis daerah."}},L={uraianIndikator:{value:"Indeks Kinerja Pembangunan Daerah",reasoning:"Rekomendasi indikator umum berdasarkan konteks perencanaan pembangunan daerah. Dapat disesuaikan lebih lanjut sesuai bidang urusan spesifik."},indikatorMinimum:{value:"Tidak",reasoning:"Secara default, indikator kinerja pembangunan bersifat positif. Nilai yang lebih tinggi menunjukkan kinerja yang lebih baik."},definisiOperasional:{value:"Ukuran komposit yang menggambarkan capaian kinerja pembangunan daerah berdasarkan indikator-indikator utama sesuai RPJMD dan standar pemerintah.",reasoning:"Definisi umum yang dapat diperdalam sesuai konteks spesifik indikator."},rumusHitung:{value:"Realisasi Capaian ÷ Target × 100%",reasoning:"Rumus dasar pengukuran capaian kinerja. Dapat dikustomisasi sesuai jenis indikator spesifik."},sumberData:{value:"OPD Terkait, BPS, Laporan Kinerja Tahunan",reasoning:"Sumber data umum. Disarankan untuk diverifikasi dan dilengkapi sesuai bidang urusan."},targetPeriode:{values:{2027:"80.00",2028:"82.50",2029:"85.00",2030:"87.50",2031:"90.00"},reasoning:"Target dasar dengan pertumbuhan linear 2.5% per tahun. Perlu disesuaikan berdasarkan data historis aktual."}};function D(e){const a=e.toLowerCase();return a.includes("kesehatan")||a.includes("stunting")||a.includes("gizi")||a.includes("harapan hidup")?M:a.includes("pendidikan")||a.includes("sekolah")||a.includes("literasi")||a.includes("partisipasi")?E:L}async function I(e,a){await T();const t=D(a);return{uraianIndikator:{label:`Uraian Indikator ${e==="tujuan"?"Tujuan":"Sasaran"}`,...t.uraianIndikator},indikatorMinimum:{label:"Indikator Minimum",...t.indikatorMinimum},definisiOperasional:{label:"Definisi Operasional",...t.definisiOperasional},rumusHitung:{label:"Rumus Hitung",...t.rumusHitung},sumberData:{label:"Sumber Data",...t.sumberData},targetPeriode:{label:"Target Periode Berikutnya",...t.targetPeriode}}}async function B(e){await T();const{previous_period:a,previous_targets:t}=e,r=a.split("-").map(l=>parseInt(l.trim(),10)),s=r[0]||2021,i=r[1]||2025,o=i-s+1,d=t.length>0?t:[80,82,84,86,88],n=d[0],u=d[d.length-1],c=d.length>1?(u-n)/(d.length-1):2,g=i+1,p={};for(let l=0;l<o;l++){const b=g+l,P=u+c*(l+1);p[b]=parseFloat(Math.min(P,100).toFixed(2))}const m={};for(let l=0;l<d.length;l++)m[s+l]=d[l];return{payload:e,previousPeriod:{label:`Riwayat Target (${a})`,values:m},forecastedPeriod:{label:`Proyeksi Target (${g}–${g+o-1})`,values:p,reasoning:`AI menganalisis tren historis ${a} dengan pertumbuhan rata-rata ${c.toFixed(2)} per tahun. Proyeksi mempertimbangkan tujuan "${e.tujuan}" dan sasaran strategis "${e.sasaran_strategis}". Metode: regresi linear sederhana berdasarkan data historis. Rekomendasi target dapat disesuaikan sesuai kapasitas daerah dan kebijakan RPJMD.`},trendAnalysis:{label:"Analisis Tren",avgGrowthPerYear:c.toFixed(2),totalGrowth:(u-n).toFixed(2),direction:c>=0?"Meningkat":"Menurun",reasoning:`Dari data ${d.length} tahun terakhir, teridentifikasi tren ${c>=0?"positif":"negatif"} dengan pertumbuhan kumulatif sebesar ${(u-n).toFixed(2)} poin. Rata-rata pertumbuhan tahunan: ${c.toFixed(2)} poin.`}}}function H(){return`
    ${v("Indikator Tujuan","Susun indikator berdasarkan Tujuan Strategis dengan bantuan AI")}
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
          Dapatkan Rekomendasi AI
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
  `}function R(){const e=document.getElementById("input-tujuan"),a=document.getElementById("btn-generate-tujuan"),t=document.getElementById("step-recommendations-tujuan"),r=document.getElementById("recs-container-tujuan");!e||!a||(e.addEventListener("input",()=>{a.disabled=e.value.trim().length<5}),a.addEventListener("click",async()=>{const s=e.value.trim();if(s){t.style.display="block",r.innerHTML=k(6),a.disabled=!0,a.innerHTML="Menganalisis...",t.scrollIntoView({behavior:"smooth",block:"start"});try{const i=await I("tujuan",s);let o="";const d=["uraianIndikator","indikatorMinimum","definisiOperasional","rumusHitung","sumberData"];d.forEach((n,u)=>{o+=f(n,i[n],u)}),o+=h(i.targetPeriode,d.length),r.innerHTML=`
        <div class="recs-section">
          <div class="recs-section__title">
            Rekomendasi AI untuk Tujuan Anda
          </div>
          ${o}
        </div>
      `,y(i)}catch{r.innerHTML=`
        <div class="empty-state">
          <div class="empty-state__icon">!</div>
          <div class="empty-state__text">Terjadi kesalahan saat memuat rekomendasi. Silakan coba lagi.</div>
        </div>
      `}a.disabled=!1,a.innerHTML="Dapatkan Rekomendasi AI"}}))}function x(){return`
    ${v("Indikator Sasaran","Susun indikator berdasarkan Sasaran Strategis dengan bantuan AI")}
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
          Dapatkan Rekomendasi AI
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
  `}function w(){const e=document.getElementById("input-sasaran"),a=document.getElementById("btn-generate-sasaran"),t=document.getElementById("step-recommendations-sasaran"),r=document.getElementById("recs-container-sasaran");!e||!a||(e.addEventListener("input",()=>{a.disabled=e.value.trim().length<5}),a.addEventListener("click",async()=>{const s=e.value.trim();if(s){t.style.display="block",r.innerHTML=k(6),a.disabled=!0,a.innerHTML="Menganalisis...",t.scrollIntoView({behavior:"smooth",block:"start"});try{const i=await I("sasaran",s);let o="";const d=["uraianIndikator","indikatorMinimum","definisiOperasional","rumusHitung","sumberData"];d.forEach((n,u)=>{o+=f(n,i[n],u)}),o+=h(i.targetPeriode,d.length),r.innerHTML=`
        <div class="recs-section">
          <div class="recs-section__title">
            Rekomendasi AI untuk Sasaran Anda
          </div>
          ${o}
        </div>
      `,y(i)}catch{r.innerHTML=`
        <div class="empty-state">
          <div class="empty-state__icon">!</div>
          <div class="empty-state__text">Terjadi kesalahan saat memuat rekomendasi. Silakan coba lagi.</div>
        </div>
      `}a.disabled=!1,a.innerHTML="Dapatkan Rekomendasi AI"}}))}function C(){return`
    ${v("Target Forecasting","Proyeksikan target periode berikutnya berdasarkan data historis dengan bantuan AI")}
    <div class="page-body">

      <!-- STEP 1: Input -->
      <div class="step-section" id="step-forecast-input">
        <div class="step-label">
          <span class="step-number">1</span>
          Masukkan Data Historis dan Konteks Strategis
        </div>

        <div class="input-group">
          <label class="input-group__label" for="input-tujuan-fc">Tujuan</label>
          <p class="input-group__hint">Tujuan strategis organisasi Anda.</p>
          <textarea
            id="input-tujuan-fc"
            rows="2"
            placeholder="Contoh: Meningkatkan kualitas layanan kesehatan masyarakat"
          ></textarea>
        </div>

        <div class="input-group">
          <label class="input-group__label" for="input-sasaran-fc">Sasaran Strategis</label>
          <p class="input-group__hint">Sasaran strategis yang menjadi dasar target.</p>
          <textarea
            id="input-sasaran-fc"
            rows="2"
            placeholder="Contoh: Meningkatnya akses layanan kesehatan"
          ></textarea>
        </div>

        <div class="forecast-period-row">
          <div class="input-group forecast-period-field">
            <label class="input-group__label" for="input-year-start">Tahun Awal</label>
            <input type="number" id="input-year-start" class="forecast-input" value="2021" min="2000" max="2099" />
          </div>
          <span class="forecast-period-separator">&ndash;</span>
          <div class="input-group forecast-period-field">
            <label class="input-group__label" for="input-year-end">Tahun Akhir</label>
            <input type="number" id="input-year-end" class="forecast-input" value="2025" min="2000" max="2099" />
          </div>
        </div>

        <div class="input-group" id="targets-input-group">
          <label class="input-group__label">Target per Tahun (Periode Sebelumnya)</label>
          <p class="input-group__hint">Masukkan nilai target untuk setiap tahun dalam periode.</p>
          <div id="target-fields-container" class="target-fields"></div>
        </div>

        <button class="btn btn--ai" id="btn-forecast" disabled>
          Proyeksikan Target
        </button>
      </div>

      <!-- STEP 2: Results -->
      <div class="step-section" id="step-forecast-results" style="display:none;">
        <div class="step-label">
          <span class="step-number">2</span>
          Hasil Proyeksi AI
        </div>
        <div id="forecast-results-container"></div>
      </div>

    </div>
  `}function K(){const e=document.getElementById("input-tujuan-fc"),a=document.getElementById("input-sasaran-fc"),t=document.getElementById("input-year-start"),r=document.getElementById("input-year-end"),s=document.getElementById("target-fields-container"),i=document.getElementById("btn-forecast"),o=document.getElementById("step-forecast-results"),d=document.getElementById("forecast-results-container");if(!i||!s)return;function n(){const c=parseInt(t.value,10)||2021,g=parseInt(r.value,10)||2025,p=Math.max(0,Math.min(g-c+1,20));let m="";for(let l=0;l<p;l++){const b=c+l;m+=`
        <div class="target-field-item">
          <label class="target-field-label" for="target-val-${b}">${b}</label>
          <input
            type="number"
            id="target-val-${b}"
            class="forecast-input target-value-input"
            placeholder="0"
            step="0.01"
            data-year="${b}"
          />
        </div>
      `}s.innerHTML=m,u()}function u(){const c=e.value.trim().length>=3,g=a.value.trim().length>=3,p=s.querySelectorAll(".target-value-input"),m=p.length>0&&Array.from(p).every(l=>l.value.trim()!=="");i.disabled=!(c&&g&&m)}n(),t.addEventListener("change",n),r.addEventListener("change",n),e.addEventListener("input",u),a.addEventListener("input",u),s.addEventListener("input",u),i.addEventListener("click",async()=>{const c=parseInt(t.value,10),g=parseInt(r.value,10),p=s.querySelectorAll(".target-value-input"),m=Array.from(p).map(b=>parseFloat(b.value)||0),l={tujuan:e.value.trim(),sasaran_strategis:a.value.trim(),previous_period:`${c}-${g}`,previous_targets:m};o.style.display="block",d.innerHTML=k(3),i.disabled=!0,i.innerHTML="Menganalisis...",o.scrollIntoView({behavior:"smooth",block:"start"});try{const b=await B(l);d.innerHTML=F(b)}catch{d.innerHTML=`
        <div class="empty-state">
          <div class="empty-state__icon">!</div>
          <div class="empty-state__text">Terjadi kesalahan saat memproses proyeksi. Silakan coba lagi.</div>
        </div>
      `}i.disabled=!1,i.innerHTML="Proyeksikan Target"})}function F(e){const{previousPeriod:a,forecastedPeriod:t,trendAnalysis:r}=e,s=Object.entries(a.values).map(([o,d])=>`
      <div class="target-grid__item">
        <div class="target-grid__year">${o}</div>
        <div class="target-grid__value">${d}</div>
      </div>`).join(""),i=Object.entries(t.values).map(([o,d])=>`
      <div class="target-grid__item target-grid__item--forecast">
        <div class="target-grid__year">${o}</div>
        <div class="target-grid__value">${d}</div>
      </div>`).join("");return`
    <div class="recs-section">
      <div class="recs-section__title">Hasil Proyeksi Target</div>

      <!-- Trend Analysis Card -->
      <div class="rec-card" style="border-left-color: var(--color-primary);">
        <div class="rec-card__header">
          <div class="rec-card__label">
            <span class="rec-card__ai-icon">AI</span>
            ${r.label}
          </div>
          <span class="rec-card__status rec-card__status--pending">
            Tren: ${r.direction}
          </span>
        </div>
        <div class="forecast-trend-stats">
          <div class="forecast-stat">
            <span class="forecast-stat__label">Pertumbuhan Rata-rata/Tahun</span>
            <span class="forecast-stat__value">${r.avgGrowthPerYear}</span>
          </div>
          <div class="forecast-stat">
            <span class="forecast-stat__label">Total Pertumbuhan</span>
            <span class="forecast-stat__value">${r.totalGrowth}</span>
          </div>
          <div class="forecast-stat">
            <span class="forecast-stat__label">Arah Tren</span>
            <span class="forecast-stat__value">${r.direction}</span>
          </div>
        </div>
        <div class="rec-card__reasoning">
          <span class="rec-card__reasoning-icon">i</span>
          <span>${r.reasoning}</span>
        </div>
      </div>

      <!-- Previous Period Card -->
      <div class="rec-card">
        <div class="rec-card__header">
          <div class="rec-card__label">
            <span class="rec-card__ai-icon">AI</span>
            ${a.label}
          </div>
        </div>
        <div class="target-grid">${s}</div>
      </div>

      <!-- Forecasted Period Card -->
      <div class="rec-card" style="border-left-color: var(--color-success);">
        <div class="rec-card__header">
          <div class="rec-card__label">
            <span class="rec-card__ai-icon">AI</span>
            ${t.label}
          </div>
          <span class="rec-card__status rec-card__status--accepted">Proyeksi</span>
        </div>
        <div class="target-grid">${i}</div>
        <div class="rec-card__reasoning" style="margin-top: var(--space-md);">
          <span class="rec-card__reasoning-icon">i</span>
          <span>${t.reasoning}</span>
        </div>
      </div>

    </div>
  `}const O=document.getElementById("app");function N(){const e=window.location.hash||"#/indikator-tujuan";return e.includes("indikator-sasaran")?"sasaran":e.includes("target-forecasting")?"forecasting":"tujuan"}function $(){const e=N();let a="",t="";e==="sasaran"?(t="sasaran",a=x()):e==="forecasting"?(t="forecasting",a=C()):(t="tujuan",a=H()),O.innerHTML=`
    ${j(t)}
    <main class="main-content">
      ${a}
    </main>
  `,S(),e==="sasaran"?w():e==="forecasting"?K():R()}window.addEventListener("hashchange",$);$();
