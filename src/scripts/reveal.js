// Progressive-enhancement scroll reveal. Content is visible by default in the
// CSS (see [data-reveal] in global.css) — this only adds motion on top for
// browsers that support IntersectionObserver and have JS enabled. Nothing is
// ever gated on this running: crawlers, headless renderers, and reduced-motion
// users all see full content immediately.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('js-reveal-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.revealDelay || '0';
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
})();
