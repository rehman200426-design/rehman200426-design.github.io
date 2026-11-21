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
    }, { threshold: 0.06, rootMargin: '0px 0px -25px 0px' });
    document.querySelectorAll('.company-logo, .experience-title, .experience-summary, .career-journey > div, .process-grid article, .tech-icons a, .tech-details details, .section > .eyebrow, .section-heading h2, .section-heading > p, .about-layout h2, .about-layout > div > *, .skill-grid article, .project-visual, .project-copy > *, .contact h2, .contact > .button, .work > h2').forEach(element => {
      element.classList.add('reveal');
      if (element.matches('.about-layout > :first-child')) element.classList.add('reveal-left');
      if (element.matches('.about-layout > :last-child')) element.classList.add('reveal-right');
      if (element.matches('.project-visual')) element.classList.add('reveal-scale');
      if (element.matches('.tech-icons a, .company-logo')) element.classList.add('reveal-pop');
      if (element.matches('h2, .experience-title')) element.classList.add('reveal-heading');
      if (element.matches('.skill-grid article, .process-grid article, .tech-details details')) element.classList.add('reveal-card');
      if (element.matches('.career-journey > div, .process-grid article')) element.classList.add('reveal-left');
      const siblings = [...element.parentElement.children];
      const stagger = element.matches('.tech-icons a') ? 55 : 95;
      const delay = element.matches('.skill-grid article, .project-copy > *, .about-layout > div > *, .tech-icons a, .tech-details details, .process-grid article, .career-journey > div') ? Math.min(siblings.indexOf(element), 5) * stagger : 0;
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
  const story = document.querySelector('.motion-story');
  const storyLines = story ? [...story.querySelectorAll('.motion-title span')] : [];
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
    // Measure before writes; native scrolling stays in control.
    const storyRect = story?.getBoundingClientRect();
    if (storyRect && storyRect.bottom > 0 && storyRect.top < window.innerHeight) {
      const clamp = value => Math.min(1, Math.max(0, value));
      const topOffset = window.innerWidth <= 700 ? 84 : 108;
      const progress = clamp((topOffset - storyRect.top) / Math.max(1, storyRect.height - window.innerHeight + topOffset));
      story.style.setProperty('--travel', paused ? '0' : String(progress * 2 - 1));
      story.style.setProperty('--card-opacity', String(0.4 + Math.sin(progress * Math.PI) * 0.45));
      storyLines.forEach((line, index) => line.style.setProperty('--fill', `${paused ? 100 : clamp(progress * 3.3 - index * 0.82) * 100}%`));
    }
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
