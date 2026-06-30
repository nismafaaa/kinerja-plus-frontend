import { ENTITY_CONFIG } from '../config/entities.js';

export function renderSidebar(activeType) {
  const navItems = Object.values(ENTITY_CONFIG)
    .map((cfg) => {
      const isActive = cfg.type === activeType;
      // Visual hierarchy: indent each level 12px deeper
      const indent = cfg.hierarchyLevel * 12;
      // Connector line visual for sub-levels
      const connector = cfg.hierarchyLevel > 0
        ? `<span class="sidebar__nav-connector" aria-hidden="true"></span>`
        : '';
      return `
        <a href="${cfg.hash}"
           class="sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''} sidebar__nav-item--level-${cfg.hierarchyLevel}"
           id="nav-${cfg.type}"
           style="padding-left: calc(var(--space-md) + ${indent}px)"
        >
          ${connector}
          <span class="sidebar__nav-icon">&#8226;</span>
          ${cfg.navLabel}
        </a>
      `;
    })
    .join('');

  return `
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
        ${navItems}
      </nav>
      <div class="sidebar__footer">
        <div class="sidebar__footer-text">IPVS — Intelligent Planning<br>Validation System</div>
      </div>
    </aside>
  `;
}

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