/* Android back follows UI state before asking to leave the app. No native JS bridge. */
window.spodiumBack = function () {
  const modal = document.querySelector('.modal');
  if (modal) {
    const close = modal.querySelector('.modal-head .icon-button');
    if (close) { close.click(); return true; }
    return false;
  }
  const detail = document.querySelector('.facility-detail');
  if (detail) {
    const close = detail.querySelector('button[aria-label*="닫"]');
    if (close) { close.click(); return true; }
  }
  const nav = document.querySelector('.bottom-nav');
  if (nav && !nav.querySelector('button:first-child').classList.contains('active')) {
    nav.querySelector('button:first-child').click(); return true;
  }
  return false;
};
