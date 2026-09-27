import './styles/index.css';
import './styles/components.css';
import './styles/pages.css';

import { renderSidebar, initSidebarToggle } from './components/sidebar.js';
import { renderIndikatorPage, initIndikatorPage } from './pages/indikatorPage.js';
import { renderMenrisPage, initMenrisPage } from './pages/menris/menrisPage.js';
import { ENTITY_CONFIG, getEntityConfigFromHash } from './config/entities.js';

const app = document.getElementById('app');
const MENRIS_HASH = '#/manajemen-risiko';

function render() {
  const hash = window.location.hash || '#/indikator-tujuan';

  if (hash.startsWith(MENRIS_HASH)) {
    app.innerHTML = `
      ${renderSidebar('manajemen-risiko')}
      <main class="main-content">
        ${renderMenrisPage()}
      </main>
    `;
    initSidebarToggle();
    initMenrisPage();
    return;
  }

  const config = getEntityConfigFromHash();

  app.innerHTML = `
    ${renderSidebar(config.type)}
    <main class="main-content">
      ${renderIndikatorPage(config)}
    </main>
  `;

  initSidebarToggle();
  initIndikatorPage(config);
}

window.addEventListener('hashchange', render);

render();
