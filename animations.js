(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.motion-toggle');
  let paused = preference.matches;
  const updateMotion = () => {
    document.documentElement.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Motion: off' : 'Motion: on';
  };
  toggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
  preference.addEventListener('change', event => { paused = event.matches; updateMotion(); });
  updateMotion();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    document.querySelectorAll('.section > .eyebrow, .section-heading, .about-layout > *, .skill-grid article, .project-visual, .project-copy > *, .contact h2, .contact > .button, .work > h2').forEach(element => {
      element.classList.add('reveal');
      if (element.matches('.about-layout > :first-child')) element.classList.add('reveal-left');
      if (element.matches('.about-layout > :last-child')) element.classList.add('reveal-right');
      if (element.matches('.project-visual')) element.classList.add('reveal-scale');
      const siblings = [...element.parentElement.children];
      const delay = element.matches('.skill-grid article, .project-copy > *') ? Math.min(siblings.indexOf(element), 3) * 110 : 0;
      element.style.setProperty('--reveal-delay', `${delay}ms`);
      observer.observe(element);
    });
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.skill-grid article, .project-visual').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (paused || !finePointer.matches) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      card.classList.add('has-spotlight');
    });
    card.addEventListener('pointerleave', () => card.classList.remove('has-spotlight'));
  });

  const links = [...document.querySelectorAll('nav a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  const artwork = document.querySelector('.portrait-art');
  let parallaxTarget = 0;
  let parallaxCurrent = 0;
  let parallaxFrame = null;
  function animateParallax() {
    parallaxCurrent += (parallaxTarget - parallaxCurrent) * 0.09;
    artwork.style.setProperty('--scroll-drift', `${parallaxCurrent.toFixed(2)}px`);
    if (Math.abs(parallaxTarget - parallaxCurrent) > 0.1) parallaxFrame = requestAnimationFrame(animateParallax);
    else parallaxFrame = null;
  }
  let scheduled = false;
  function updateScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector('.scroll-progress').style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
    document.querySelector('header').classList.toggle('scrolled', window.scrollY > 20);
    parallaxTarget = paused || window.innerWidth < 900 ? 0 : Math.min(window.scrollY * 0.09, 55);
    if (parallaxFrame === null) parallaxFrame = requestAnimationFrame(animateParallax);
    let active = null;
    sections.forEach(section => { if (section.getBoundingClientRect().top < window.innerHeight * 0.45) active = section.id; });
    links.forEach(link => {
      const selected = link.hash === `#${active}`;
      link.classList.toggle('active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();
})();
