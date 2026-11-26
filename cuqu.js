/* Compartido por todas las páginas: idioma ES/EN y botón de copiar mail */
(function () {
  var root = document.documentElement;
  var MSG = {
    es: { copied: 'Mail copiado.', selected: 'Mail seleccionado. Copialo con Ctrl+C.', title: root.dataset.titleEs || document.title },
    en: { copied: 'Email copied.', selected: 'Email selected. Copy it with Ctrl+C.', title: root.dataset.titleEn || document.title }
  };
  var lang = 'es';
  var copiado = document.getElementById('copiado');

  function setLang(next) {
    lang = next === 'en' ? 'en' : 'es';
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (el.dataset.es === undefined) el.dataset.es = el.textContent;
      el.textContent = lang === 'en' ? el.dataset.en : el.dataset.es;
    });
    document.querySelectorAll('[data-href-en]').forEach(function (el) {
      if (el.dataset.hrefEs === undefined) el.dataset.hrefEs = el.getAttribute('href');
      el.setAttribute('href', lang === 'en' ? el.dataset.hrefEn : el.dataset.hrefEs);
    });
    document.querySelectorAll('[data-aria-en]').forEach(function (el) {
      if (el.dataset.ariaEs === undefined) el.dataset.ariaEs = el.getAttribute('aria-label');
      el.setAttribute('aria-label', lang === 'en' ? el.dataset.ariaEn : el.dataset.ariaEs);
    });
    root.lang = lang;
    document.title = MSG[lang].title;
    document.getElementById('lang-es').setAttribute('aria-pressed', String(lang === 'es'));
    document.getElementById('lang-en').setAttribute('aria-pressed', String(lang === 'en'));
    if (copiado) copiado.textContent = '';
    try { localStorage.setItem('cuqu-lang', lang); } catch (e) {}
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  var saved = null;
  try { saved = localStorage.getItem('cuqu-lang'); } catch (e) {}
  if (location.hash === '#en') saved = 'en';
  if (saved === 'en') setLang('en');

  /* Menú hamburguesa */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu-movil');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1040) setMenu(false); });
  }

  var copiar = document.getElementById('copiar');
  if (copiar) copiar.addEventListener('click', function () {
    var addr = document.getElementById('mail-addr').textContent.trim();
    function fallback() {
      var r = document.createRange(); r.selectNodeContents(document.getElementById('mail-addr'));
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      copiado.textContent = MSG[lang].selected;
    }
    try {
      navigator.clipboard.writeText(addr).then(function () { copiado.textContent = MSG[lang].copied; }, fallback);
    } catch (e) { fallback(); }
  });
})();
