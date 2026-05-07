// Additional site functionality
// Cart system is managed by cart.js

(function() {
  const adminLink = document.querySelector('.nav-admin');
  const params = new URLSearchParams(window.location.search);
  const adminFlag = params.get('admin');
  const persistentAdmin = localStorage.getItem('showAdminLink');

  if (adminLink) {
    if (adminFlag === 'true' || persistentAdmin === 'true') {
      adminLink.classList.add('visible');
      localStorage.setItem('showAdminLink', 'true');
    }
  }

  if (adminFlag === 'true') {
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
  }
})();

