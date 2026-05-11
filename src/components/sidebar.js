/**
 * Sidebar navigation component.
 */
export function renderSidebar(activePage) {
  return `
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
           class="sidebar__nav-item ${activePage === 'tujuan' ? 'sidebar__nav-item--active' : ''}"
           id="nav-tujuan">
          <span class="sidebar__nav-icon">🎯</span>
          Indikator Tujuan
        </a>
        <a href="#/indikator-sasaran"
           class="sidebar__nav-item ${activePage === 'sasaran' ? 'sidebar__nav-item--active' : ''}"
           id="nav-sasaran">
          <span class="sidebar__nav-icon">📋</span>
          Indikator Sasaran
        </a>
      </nav>
      <div class="sidebar__footer">
        <div class="sidebar__footer-text">IPVS — Intelligent Planning<br>Validation System</div>
      </div>
    </aside>
  `;
}

/**
 * Attach mobile sidebar toggle handlers.
 */
export function initSidebarToggle() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!toggle || !sidebar || !overlay) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar--open');
    overlay.classList.toggle('sidebar-overlay--visible');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('sidebar--open');
    overlay.classList.remove('sidebar-overlay--visible');
  });
}
