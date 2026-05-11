/**
 * Main entry point — SPA router for Kinerja Plus AI Prototype.
 */
import './styles/index.css';
import './styles/components.css';
import './styles/pages.css';

import { renderSidebar, initSidebarToggle } from './components/sidebar.js';
import {
  renderIndikatorTujuan,
  initIndikatorTujuan,
} from './pages/indikatorTujuan.js';
import {
  renderIndikatorSasaran,
  initIndikatorSasaran,
} from './pages/indikatorSasaran.js';

const app = document.getElementById('app');

/**
 * Simple hash-based router.
 */
function getRoute() {
  const hash = window.location.hash || '#/indikator-tujuan';
  if (hash.includes('indikator-sasaran')) return 'sasaran';
  return 'tujuan';
}

function render() {
  const route = getRoute();

  let pageContent = '';
  let activePage = '';

  if (route === 'sasaran') {
    activePage = 'sasaran';
    pageContent = renderIndikatorSasaran();
  } else {
    activePage = 'tujuan';
    pageContent = renderIndikatorTujuan();
  }

  app.innerHTML = `
    ${renderSidebar(activePage)}
    <main class="main-content">
      ${pageContent}
    </main>
  `;

  // Initialize sidebar toggle (mobile)
  initSidebarToggle();

  // Initialize page-specific logic
  if (route === 'sasaran') {
    initIndikatorSasaran();
  } else {
    initIndikatorTujuan();
  }
}

// Listen for hash changes
window.addEventListener('hashchange', render);

// Initial render
render();
