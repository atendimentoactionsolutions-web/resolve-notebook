import { useEffect } from 'react';

const targets = '.trust-line, .section-heading, .service-row, .brand-strip, .process-grid > *, .notebook-grid > *, .trade-in, .business, .faq > *, .store-heading, .store-info, .store-map';

export default function useScrollReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    const elements = [...root.querySelectorAll(targets)];
    const finishAnimation = (event) => {
      if (event.animationName === 'scroll-reveal') event.target.classList.remove('reveal-enter');
    };
    root.addEventListener('animationend', finishAnimation);
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('reveal-enter');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.05 });

    for (const element of elements) {
      // Keep content already on screen immediately visible, including anchor links.
      if (element.getBoundingClientRect().top < window.innerHeight) continue;
      element.classList.add('reveal-pending');
      observer.observe(element);
    }

    const clear = () => {
      observer.disconnect();
      for (const element of elements) element.classList.remove('reveal-pending', 'reveal-enter');
    };
    const handleMotion = () => { if (motion.matches) clear(); };
    motion.addEventListener('change', handleMotion);
    return () => {
      root.removeEventListener('animationend', finishAnimation);
      motion.removeEventListener('change', handleMotion);
      clear();
    };
  }, [rootRef]);
}
