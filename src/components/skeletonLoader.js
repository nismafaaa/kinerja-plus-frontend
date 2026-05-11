/**
 * Skeleton loader for recommendation cards (shown during AI loading).
 */
export function renderSkeletonCards(count = 6) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card" style="animation-delay: ${i * 0.1}s">
        <div class="skeleton skeleton-line--title"></div>
        <div class="skeleton skeleton-block"></div>
        <div class="skeleton skeleton-line--medium"></div>
        <div class="skeleton-actions">
          <div class="skeleton skeleton-btn"></div>
          <div class="skeleton skeleton-btn"></div>
          <div class="skeleton skeleton-btn"></div>
        </div>
      </div>
    `;
  }
  return html;
}
