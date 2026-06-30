import './styles/index.css';
import './styles/components.css';
import './styles/pages.css';

import { renderSidebar, initSidebarToggle } from './components/sidebar.js';
import { renderIndikatorPage, initIndikatorPage } from './pages/indikatorPage.js';
import { ENTITY_CONFIG, getEntityConfigFromHash } from './config/entities.js';

const app = document.getElementById('app');

function render() {
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
