/**
 * Page header component.
 */
export function renderHeader(title, subtitle) {
  return `
    <header class="page-header">
      <div class="page-header__left">
        <h1 class="page-header__title">
          ${title}
          <span class="page-header__ai-badge">AI-Assisted</span>
        </h1>
        <p class="page-header__subtitle">${subtitle}</p>
      </div>
    </header>
  `;
}
