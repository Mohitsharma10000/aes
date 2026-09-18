/**
 * Aeva Essentials — Cinematic Scroll Experience
 * GSAP ScrollTrigger + Lenis smooth scroll
 * All animations respect prefers-reduced-motion.
 */
(function () {
  'use strict';

  /* ── Guard: only run on cinematic home ── */
  if (!document.querySelector('[data-cin-home]')) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 961;

  /* ── Register GSAP plugins ── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.warn('[Cinematic] GSAP/ScrollTrigger not loaded');
    return;
  }

  /* ── Lenis smooth scroll ── */
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !prefersReduced) {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  /* ── Helper: split text into words for animation ── */
  function splitWords(el) {
    if (!el || prefersReduced) return [];
    var text = el.textContent.trim();
    var words = text.split(/\s+/);
    el.innerHTML = '';
    var inners = [];
    words.forEach(function (word, i) {
      var outer = document.createElement('span');
      outer.className = 'cin-word';
      var inner = document.createElement('span');
      inner.className = 'cin-word-inner';
      inner.textContent = word;
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
      inners.push(inner);
    });
    return inners;
  }

  /* ── Helper: magnetic button effect ── */
  function initMagneticButtons() {
    if (isMobile || prefersReduced) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      var rect;
      btn.addEventListener('mouseenter', function () {
        rect = btn.getBoundingClientRect();
      });
      btn.addEventListener('mousemove', function (e) {
        if (!rect) return;
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      });
    });
  }

  /* ── Helper: create subtle scent particles ── */
  function initParticles(container) {
    if (isMobile || prefersReduced || !container) return;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    var scentColors = [
      '#5b7a4e', '#c4a35a', '#6b5b8a',
      '#3d8b7a', '#3d5a80', '#c47a3d'
    ];

    var particles = [];
    var count = 30;
    var w, h;

    function resize() {
      w = container.offsetWidth;
      h = container.offsetHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        r: Math.random() * 3 + 1,
        color: scentColors[Math.floor(Math.random() * scentColors.length)],
        alpha: Math.random() * 0.3 + 0.05,
        life: Math.random() * 200 + 100,
        maxLife: 0,
      };
    }

    resize();
    for (var i = 0; i < count; i++) {
      var p = createParticle();
      p.maxLife = p.life;
      particles.push(p);
    }

    var running = true;
    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p, idx) {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        var lifeRatio = p.life / p.maxLife;
        var alpha = p.alpha * (lifeRatio < 0.3 ? lifeRatio / 0.3 : 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.life <= 0 || p.y < -10 || p.x < -10 || p.x > w + 10) {
          var np = createParticle();
          np.y = h + 10;
          np.maxLife = np.life;
          particles[idx] = np;
        }
      });
      requestAnimationFrame(animate);
    }

    animate();
    window.addEventListener('resize', resize);

    return function () {
      running = false;
    };
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CHAPTER 01 — THE ENTRANCE
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initHero() {
    var hero = document.querySelector('.cin-hero');
    if (!hero) return;

    var video = hero.querySelector('video');
    var kicker = hero.querySelector('.cin-hero__kicker');
    var title = hero.querySelector('.cin-hero__title');
    var lede = hero.querySelector('.cin-hero__lede');
    var actions = hero.querySelector('.cin-hero__actions');
    var scrollCue = hero.querySelector('.cin-hero__scroll-cue');
    var videoWrap = hero.querySelector('.cin-hero__video-wrap');

    /* Entrance animation on load */
    var entrance = gsap.timeline({ delay: 0.3 });

    if (title) {
      var titleWords = splitWords(title);
      if (titleWords.length) {
        gsap.set(titleWords, { y: '110%' });
        entrance.to(titleWords, {
          y: '0%',
          duration: 1,
          stagger: 0.06,
          ease: 'power3.out',
        });
      }
    }

    if (kicker) {
      entrance.to(kicker, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.6');
    }

    if (lede) {
      entrance.to(lede, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.4');
    }

    if (actions) {
      entrance.to(actions, {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3');
    }

    if (scrollCue) {
      entrance.to(scrollCue, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.2');
    }

    /* Scroll-driven parallax (hero exits) */
    if (!prefersReduced) {
      var heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });

      if (videoWrap) {
        heroTl.to(videoWrap, { scale: 1.08, y: '-10%' }, 0);
      }

      heroTl.to(hero.querySelector('.cin-hero__content'), {
        y: -80,
        opacity: 0,
      }, 0);

      if (scrollCue) {
        heroTl.to(scrollCue, { opacity: 0, y: -20 }, 0);
      }
    }

    /* Auto-play video */
    if (video) {
      video.play().catch(function () {});
    }
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CHAPTER 02 — THE RANGE
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initRange() {
    var section = document.querySelector('.cin-range');
    if (!section || prefersReduced) return;

    var pin = section.querySelector('.cin-range__pin');
    var stage = section.querySelector('.cin-range__stage');
    var imgWrap = section.querySelector('.cin-range__img-wrap');
    var copy = section.querySelector('.cin-range__copy');
    var chips = section.querySelectorAll('.cin-range__scent-chip');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: isMobile ? '+=100%' : '+=200%',
        scrub: 1,
        pin: pin,
        anticipatePin: 1,
      }
    });

    /* Image enters scaled down, rises, becomes full */
    if (imgWrap) {
      gsap.set(imgWrap, { scale: 0.85, y: 60, opacity: 0 });
      tl.to(imgWrap, {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    /* Copy fades in */
    if (copy) {
      gsap.set(copy, { y: 40, opacity: 0 });
      tl.to(copy, {
        y: 0,
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
      }, 0.25);
    }

    /* Scent chips stagger in */
    if (chips.length) {
      tl.to(chips, {
        opacity: 1,
        duration: 0.15,
        stagger: 0.03,
        ease: 'power2.out',
      }, 0.35);
    }

    /* Subtle parallax on hold */
    if (imgWrap) {
      tl.to(imgWrap, {
        y: -30,
        scale: 1.02,
        duration: 0.4,
      }, 0.5);
    }
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CHAPTER 03 — THE RITUAL
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initRitual() {
    var section = document.querySelector('.cin-ritual');
    if (!section || prefersReduced) return;

    if (isMobile) {
      /* On mobile: simple scroll reveals */
      section.querySelectorAll('.cin-ritual__media').forEach(function (m) {
        ScrollTrigger.create({
          trigger: m,
          start: 'top 85%',
          onEnter: function () {
            gsap.to(m, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
          },
          once: true,
        });
      });
      return;
    }

    var pin = section.querySelector('.cin-ritual__pin');
    var mediaLeft = section.querySelector('.cin-ritual__media--left');
    var mediaRight = section.querySelector('.cin-ritual__media--right');
    var centerCopy = section.querySelector('.cin-ritual__center-copy');
    var roomsNav = section.querySelector('.cin-ritual__rooms-nav');
    var labelsLeft = section.querySelector('.cin-ritual__media--left .cin-ritual__label');
    var labelsRight = section.querySelector('.cin-ritual__media--right .cin-ritual__label');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=180%',
        scrub: 1,
        pin: pin,
        anticipatePin: 1,
      }
    });

    /* Left image slides in from left */
    if (mediaLeft) {
      gsap.set(mediaLeft, { x: '-100%' });
      tl.to(mediaLeft, { x: '0%', duration: 0.3, ease: 'power2.out' });
    }

    /* Right image slides in from right */
    if (mediaRight) {
      gsap.set(mediaRight, { x: '100%' });
      tl.to(mediaRight, { x: '0%', duration: 0.3, ease: 'power2.out' }, 0);
    }

    /* Center copy fades in */
    if (centerCopy) {
      gsap.set(centerCopy, { opacity: 0, scale: 0.9 });
      tl.to(centerCopy, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.2);
    }

    /* Labels slide up */
    if (labelsLeft) {
      gsap.set(labelsLeft, { y: 30, opacity: 0 });
      tl.to(labelsLeft, { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }, 0.35);
    }
    if (labelsRight) {
      gsap.set(labelsRight, { y: 30, opacity: 0 });
      tl.to(labelsRight, { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }, 0.4);
    }

    /* Room nav slides up */
    if (roomsNav) {
      gsap.set(roomsNav, { y: 60, opacity: 0 });
      tl.to(roomsNav, { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }, 0.5);
    }

    /* Subtle parallax on images */
    if (mediaLeft) {
      tl.to(mediaLeft.querySelector('img'), { scale: 1.06, duration: 0.5 }, 0.3);
    }
    if (mediaRight) {
      tl.to(mediaRight.querySelector('img'), { scale: 1.06, duration: 0.5 }, 0.3);
    }
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CHAPTER 04 — THE DETAIL
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initDetail() {
    var section = document.querySelector('.cin-detail');
    if (!section || prefersReduced) return;

    var pin = section.querySelector('.cin-detail__pin');
    var product = section.querySelector('.cin-detail__product');
    var bg = section.querySelector('.cin-detail__bg');
    var info = section.querySelector('.cin-detail__info');
    var eyebrow = info && info.querySelector('.cin-eyebrow');
    var heading = info && info.querySelector('h2');
    var scentLine = section.querySelector('.cin-detail__scent-line');
    var desc = section.querySelector('.cin-detail__desc');
    var promises = section.querySelectorAll('.cin-detail__promise');

    if (isMobile) {
      /* Simple reveals on mobile */
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: function () {
          gsap.to(product, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' });
          gsap.to(info, { x: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power2.out' });
          gsap.to(promises, { opacity: 1, stagger: 0.1, duration: 0.5, delay: 0.5, ease: 'power2.out' });
        },
        once: true,
      });
      gsap.set(product, { scale: 0.8, opacity: 0 });
      gsap.set(info, { y: 30, opacity: 0 });
      return;
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=250%',
        scrub: 1,
        pin: pin,
        anticipatePin: 1,
      }
    });

    /* Product starts small center, zooms in */
    gsap.set(product, { scale: 0.4, opacity: 0 });
    tl.to(product, {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });

    /* Background blurs in */
    if (bg) {
      tl.to(bg, {
        opacity: 0.3,
        duration: 0.2,
        ease: 'power2.out',
      }, 0.15);
    }

    /* Product shifts left to make room for info */
    tl.to(product, {
      x: function () { return -window.innerWidth * 0.15; },
      duration: 0.2,
      ease: 'power2.inOut',
    }, 0.3);

    /* Info panel slides in from right */
    if (info) {
      gsap.set(info, { x: 60, opacity: 0 });
      tl.to(info, {
        x: 0,
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
      }, 0.35);
    }

    /* Promises stagger in */
    if (promises.length) {
      tl.to(promises, {
        opacity: 1,
        duration: 0.1,
        stagger: 0.04,
        ease: 'power2.out',
      }, 0.5);
    }

    /* Hold, then exit */
    tl.to(product, {
      scale: 0.8,
      opacity: 0.4,
      duration: 0.2,
    }, 0.7);

    if (info) {
      tl.to(info, {
        opacity: 0,
        y: -30,
        duration: 0.15,
      }, 0.75);
    }
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CHAPTER 05 — THE SYSTEM
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initSystem() {
    var section = document.querySelector('.cin-system');
    if (!section || prefersReduced) return;

    var pin = section.querySelector('.cin-system__pin');
    var bottle = section.querySelector('.cin-system__bottle');
    var pouch = section.querySelector('.cin-system__pouch');
    var arrow = section.querySelector('.cin-system__arrow');
    var steps = section.querySelectorAll('.cin-system__step');
    var ctaRow = section.querySelector('.cin-system__cta-row');

    if (isMobile) {
      /* Simple stagger reveals */
      gsap.set(bottle, { x: -40, opacity: 0 });
      gsap.set(pouch, { x: 40, opacity: 0 });
      gsap.set(steps, { y: 20, opacity: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: function () {
          gsap.to(bottle, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
          gsap.to(pouch, { x: 0, opacity: 1, duration: 0.8, delay: 0.15, ease: 'power2.out' });
          gsap.to(steps, { y: 0, opacity: 1, stagger: 0.15, duration: 0.6, delay: 0.3, ease: 'power2.out' });
          if (ctaRow) gsap.to(ctaRow, { opacity: 1, duration: 0.6, delay: 0.8, ease: 'power2.out' });
        },
        once: true,
      });
      return;
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: pin,
        anticipatePin: 1,
      }
    });

    /* Bottle slides in from left */
    if (bottle) {
      gsap.set(bottle, { x: '-120%', opacity: 0 });
      tl.to(bottle, {
        x: '0%',
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      });
    }

    /* Pouch slides in from right */
    if (pouch) {
      gsap.set(pouch, { x: '120%', opacity: 0 });
      tl.to(pouch, {
        x: '0%',
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      }, 0.05);
    }

    /* Arrow fades in */
    if (arrow) {
      tl.to(arrow, {
        opacity: 1,
        duration: 0.15,
        ease: 'power2.out',
      }, 0.25);
    }

    /* Steps stagger in */
    if (steps.length) {
      gsap.set(steps, { y: 30, opacity: 0 });
      tl.to(steps, {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.15,
        ease: 'power2.out',
      }, 0.35);
    }

    /* CTA */
    if (ctaRow) {
      tl.to(ctaRow, {
        opacity: 1,
        duration: 0.1,
        ease: 'power2.out',
      }, 0.65);
    }
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CHAPTER 06 — THE COLLECTION (scroll-triggered reveals)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initCollection() {
    var sections = document.querySelectorAll('.cin-collection__section');
    if (!sections.length) return;

    sections.forEach(function (sec) {
      gsap.set(sec, { y: prefersReduced ? 0 : 50, opacity: prefersReduced ? 1 : 0 });

      ScrollTrigger.create({
        trigger: sec,
        start: 'top 80%',
        onEnter: function () {
          gsap.to(sec, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
          });
        },
        once: true,
      });
    });

    /* Feature image parallax */
    var featureImg = document.querySelector('.cin-feature__media img');
    if (featureImg && !prefersReduced && !isMobile) {
      gsap.to(featureImg, {
        y: '-10%',
        ease: 'none',
        scrollTrigger: {
          trigger: featureImg.closest('.cin-feature'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }

    /* Proof items stagger */
    var proofItems = document.querySelectorAll('.cin-proof__item');
    if (proofItems.length) {
      gsap.set(proofItems, { y: prefersReduced ? 0 : 30, opacity: prefersReduced ? 1 : 0 });
      ScrollTrigger.create({
        trigger: proofItems[0].parentElement,
        start: 'top 85%',
        onEnter: function () {
          gsap.to(proofItems, {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power2.out',
          });
        },
        once: true,
      });
    }
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CHAPTER 07 — THE CLOSE
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initClose() {
    var section = document.querySelector('.cin-close');
    if (!section) return;

    var pin = section.querySelector('.cin-close__pin');
    var product = section.querySelector('.cin-close__product');
    var copy = section.querySelector('.cin-close__copy');
    var particles = section.querySelector('.cin-particles');

    if (prefersReduced) return;

    /* Product scales in from small */
    if (product) {
      gsap.set(product, { scale: 0.7, opacity: 0 });
    }
    if (copy) {
      gsap.set(copy, { y: 40, opacity: 0 });
    }

    if (isMobile) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        onEnter: function () {
          if (product) gsap.to(product, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' });
          if (copy) gsap.to(copy, { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power2.out' });
        },
        once: true,
      });
      return;
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=120%',
        scrub: 1,
        pin: pin,
        anticipatePin: 1,
      }
    });

    if (product) {
      tl.to(product, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    }

    if (copy) {
      tl.to(copy, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, 0.35);
    }

    /* Particles */
    if (particles) {
      initParticles(particles);
    }
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     PARALLAX FOR MISC ELEMENTS
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initParallax() {
    if (prefersReduced || isMobile) return;

    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      gsap.to(el, {
        y: function () { return -window.innerHeight * speed; },
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.cin-chapter') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });
    });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     CURSOR FOLLOWER (subtle)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function initCursor() {
    if (isMobile || prefersReduced) return;

    var cursor = document.createElement('div');
    cursor.className = 'cin-cursor';
    cursor.style.cssText =
      'position:fixed;top:0;left:0;width:12px;height:12px;border-radius:50%;' +
      'background:' + getComputedStyle(document.documentElement).getPropertyValue('--aeva-accent').trim() + ';' +
      'pointer-events:none;z-index:9999;opacity:0;mix-blend-mode:multiply;' +
      'transition:width 300ms ease,height 300ms ease,opacity 300ms ease;' +
      'transform:translate(-50%,-50%);';
    document.body.appendChild(cursor);

    var cx = 0, cy = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      cursor.style.opacity = '0.4';
    });

    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });

    function tick() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(tick);
    }
    tick();

    /* Enlarge on interactive elements */
    document.addEventListener('mouseover', function (e) {
      var target = e.target.closest('a, button, [data-magnetic]');
      if (target) {
        cursor.style.width = '36px';
        cursor.style.height = '36px';
        cursor.style.opacity = '0.2';
      }
    });
    document.addEventListener('mouseout', function (e) {
      var target = e.target.closest('a, button, [data-magnetic]');
      if (target) {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursor.style.opacity = '0.4';
      }
    });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INITIALIZE
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function init() {
    initHero();
    initRange();
    initRitual();
    initDetail();
    initSystem();
    initCollection();
    initClose();
    initParallax();
    initMagneticButtons();
    initCursor();

    /* Refresh ScrollTrigger after DOM fully paints */
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

  /* Wait for chrome (header/footer) to be ready */
  if (document.querySelector('.site-chrome')) {
    init();
  } else {
    document.addEventListener('aeva:chrome-ready', init);
  }

})();
