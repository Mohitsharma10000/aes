/**
 * Aeva Essentials — Arc Carousel
 *
 * Products arranged along a large invisible curved arc in 3D space.
 * Center product is the hero. Side products recede with perspective.
 *
 * Controls: drag, swipe, mouse-wheel, arrow buttons, dot clicks, scent chips.
 * Uses GSAP for smooth animation (already loaded on page).
 */
(function () {
  'use strict';

  var container = document.querySelector('[data-arc-carousel]');
  if (!container) return;

  /* ── Configuration ── */
  var ARC_RADIUS    = 800;           // radius of the invisible arc (px in 3D space)
  var ARC_ANGLE     = Math.PI * 0.7; // total arc span (radians) — ~126°
  var ITEM_SPREAD   = 0.22;          // angle between adjacent items (radians, ~12.6°)
  var CENTER_SCALE  = 1.0;
  var SIDE_SCALE    = 0.62;
  var FAR_SCALE     = 0.4;
  var CENTER_Z      = 180;           // how far forward the center item comes
  var SIDE_Z        = -60;           // side items pushed back
  var FAR_Z         = -200;
  var SIDE_ROTATE_Y = 28;            // degrees of Y-rotation for side items
  var FAR_ROTATE_Y  = 45;
  var SIDE_OPACITY  = 0.7;
  var FAR_OPACITY   = 0.35;
  var SNAP_DURATION = 0.55;          // seconds for snap animation
  var DRAG_SENSITIVITY = 0.003;      // radians per pixel of drag
  var WHEEL_SENSITIVITY = 0.0012;
  var INERTIA_FRICTION = 0.92;
  var INERTIA_THRESHOLD = 0.0003;

  /* ── Detect capabilities ── */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof gsap !== 'undefined';

  /* ── Gather products from catalog ── */
  var A = window.AEVA;
  var products = [];

  if (A && typeof A.listFormulas === 'function') {
    products = A.listFormulas().map(function (p) {
      return {
        id: p.id,
        name: p.name,
        scent: p.scentName || '',
        scentHex: p.scentHex || '#ddd',
        image: A.productImage(p, 'bottle'),
        href: A.productHref(p),
      };
    });
  }

  if (!products.length) return;

  /* ── Build DOM ── */
  var stage = container.querySelector('[data-arc-stage]');
  var track = container.querySelector('[data-arc-track]');
  var dotsWrap = container.querySelector('[data-arc-dots]');
  var prevBtn = container.querySelector('[data-arc-prev]');
  var nextBtn = container.querySelector('[data-arc-next]');
  var scentsWrap = container.querySelector('[data-arc-scents]');

  if (!stage || !track) return;

  // Create item DOM
  var items = [];
  products.forEach(function (p, i) {
    var el = document.createElement('div');
    el.className = 'arc-carousel__item';
    el.setAttribute('data-arc-index', i);
    el.innerHTML =
      '<a class="arc-carousel__item-inner" href="' + p.href + '">' +
        '<div class="arc-carousel__img-wrap">' +
          '<img src="' + p.image + '" alt="' + p.name + '" draggable="false" />' +
        '</div>' +
        '<div class="arc-carousel__label">' +
          '<p class="arc-carousel__name">' + p.name + '</p>' +
          '<p class="arc-carousel__scent" style="color:' + p.scentHex + '">' + p.scent + '</p>' +
          '<span class="arc-carousel__cta">See product</span>' +
        '</div>' +
      '</a>';
    track.appendChild(el);
    items.push({ el: el, index: i, product: p });
  });

  // Create dots
  if (dotsWrap) {
    products.forEach(function (p, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'arc-carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to ' + p.name);
      dot.setAttribute('data-arc-dot', i);
      dotsWrap.appendChild(dot);
    });
  }

  // Create scent chips
  if (scentsWrap) {
    products.forEach(function (p, i) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'arc-carousel__scent-chip' + (i === 0 ? ' is-active' : '');
      chip.setAttribute('data-arc-scent', i);
      chip.innerHTML =
        '<span class="arc-carousel__scent-pip" style="background:' + p.scentHex + '"></span>' +
        p.name.replace(/ (Liquid|Spray|Cleaner)$/i, '');
      scentsWrap.appendChild(chip);
    });
  }

  /* ── State ── */
  var currentAngle = 0;    // current rotation angle of the arc (radians)
  var targetAngle = 0;
  var currentIndex = 0;
  var count = products.length;
  var isDragging = false;
  var dragStartX = 0;
  var dragStartAngle = 0;
  var velocity = 0;
  var lastDragX = 0;
  var lastDragTime = 0;
  var inertiaRaf = 0;
  var snapTween = null;

  /* ── Position calculation ── */
  function getItemTransform(itemIndex, angle) {
    // How far is this item from center in terms of index distance
    var itemAngle = itemIndex * ITEM_SPREAD;
    var delta = itemAngle + angle; // delta from center position

    // Position on the arc
    var x = Math.sin(delta) * ARC_RADIUS;
    var z_arc = (Math.cos(delta) - 1) * ARC_RADIUS; // depth from curvature

    // Normalized distance (0 = center, 1 = one item away, etc.)
    var dist = Math.abs(delta) / ITEM_SPREAD;

    // Scale: smooth interpolation
    var scale;
    if (dist < 0.1) {
      scale = CENTER_SCALE;
    } else if (dist < 1.2) {
      scale = CENTER_SCALE + (SIDE_SCALE - CENTER_SCALE) * Math.min(dist, 1);
    } else {
      scale = SIDE_SCALE + (FAR_SCALE - SIDE_SCALE) * Math.min((dist - 1) / 2, 1);
    }

    // Z depth (forward/backward)
    var z;
    if (dist < 0.1) {
      z = CENTER_Z;
    } else if (dist < 1.2) {
      z = CENTER_Z + (SIDE_Z - CENTER_Z) * Math.min(dist, 1);
    } else {
      z = SIDE_Z + (FAR_Z - SIDE_Z) * Math.min((dist - 1) / 2, 1);
    }
    z += z_arc * 0.15; // add arc curvature depth

    // Y rotation
    var rotateY;
    var direction = delta > 0 ? -1 : 1;
    if (dist < 0.1) {
      rotateY = 0;
    } else if (dist < 1.2) {
      rotateY = direction * SIDE_ROTATE_Y * Math.min(dist, 1);
    } else {
      rotateY = direction * (SIDE_ROTATE_Y + (FAR_ROTATE_Y - SIDE_ROTATE_Y) * Math.min((dist - 1) / 2, 1));
    }

    // Opacity
    var opacity;
    if (dist < 0.3) {
      opacity = 1;
    } else if (dist < 1.3) {
      opacity = 1 + (SIDE_OPACITY - 1) * Math.min(dist - 0.3, 1);
    } else {
      opacity = SIDE_OPACITY + (FAR_OPACITY - SIDE_OPACITY) * Math.min((dist - 1.3) / 1.5, 1);
    }

    // Vertical offset — items dip down as they go to the sides (arc shape)
    var y = Math.abs(delta) * 18;

    // Clamp opacity for far items
    if (dist > 3.5) opacity = 0;

    return {
      x: x,
      y: y,
      z: z,
      scale: scale,
      rotateY: rotateY,
      opacity: opacity,
      dist: dist,
      zIndex: Math.round(1000 - dist * 100),
    };
  }

  /* ── Render all items ── */
  function render(angle) {
    var closestDist = Infinity;
    var closestIdx = 0;

    items.forEach(function (item) {
      var t = getItemTransform(item.index, angle);

      item.el.style.transform =
        'translate(-50%, -50%) ' +
        'translate3d(' + t.x.toFixed(1) + 'px, ' + t.y.toFixed(1) + 'px, ' + t.z.toFixed(1) + 'px) ' +
        'scale(' + t.scale.toFixed(4) + ') ' +
        'rotateY(' + t.rotateY.toFixed(2) + 'deg)';
      item.el.style.opacity = t.opacity.toFixed(3);
      item.el.style.zIndex = t.zIndex;

      if (t.dist < closestDist) {
        closestDist = t.dist;
        closestIdx = item.index;
      }

      // Toggle center class
      item.el.classList.toggle('is-center', t.dist < 0.4);
    });

    if (closestIdx !== currentIndex) {
      currentIndex = closestIdx;
      updateIndicators();
    }
  }

  /* ── Update dots + scent chips ── */
  function updateIndicators() {
    if (dotsWrap) {
      dotsWrap.querySelectorAll('[data-arc-dot]').forEach(function (dot) {
        dot.classList.toggle('is-active', Number(dot.getAttribute('data-arc-dot')) === currentIndex);
      });
    }
    if (scentsWrap) {
      scentsWrap.querySelectorAll('[data-arc-scent]').forEach(function (chip) {
        chip.classList.toggle('is-active', Number(chip.getAttribute('data-arc-scent')) === currentIndex);
      });
    }
  }

  /* ── Go to specific index ── */
  function goTo(index, immediate) {
    var target = -index * ITEM_SPREAD;

    if (snapTween) {
      snapTween.kill();
      snapTween = null;
    }

    cancelAnimationFrame(inertiaRaf);
    velocity = 0;

    if (immediate || prefersReduced || !hasGSAP) {
      currentAngle = target;
      targetAngle = target;
      render(currentAngle);
      return;
    }

    var state = { angle: currentAngle };
    snapTween = gsap.to(state, {
      angle: target,
      duration: SNAP_DURATION,
      ease: 'power3.out',
      onUpdate: function () {
        currentAngle = state.angle;
        render(currentAngle);
      },
      onComplete: function () {
        currentAngle = target;
        targetAngle = target;
        render(currentAngle);
        snapTween = null;
      },
    });
  }

  /* ── Snap to nearest ── */
  function snapToNearest() {
    var nearest = Math.round(-currentAngle / ITEM_SPREAD);
    nearest = Math.max(0, Math.min(count - 1, nearest));
    goTo(nearest);
  }

  /* ── Inertia loop ── */
  function runInertia() {
    if (isDragging) return;
    if (Math.abs(velocity) < INERTIA_THRESHOLD) {
      snapToNearest();
      return;
    }

    currentAngle += velocity;
    velocity *= INERTIA_FRICTION;

    // Clamp to valid range
    var minAngle = -(count - 1) * ITEM_SPREAD - ITEM_SPREAD * 0.3;
    var maxAngle = ITEM_SPREAD * 0.3;
    if (currentAngle < minAngle) {
      currentAngle = minAngle;
      velocity = 0;
    }
    if (currentAngle > maxAngle) {
      currentAngle = maxAngle;
      velocity = 0;
    }

    render(currentAngle);
    inertiaRaf = requestAnimationFrame(runInertia);
  }

  /* ── Drag handlers ── */
  function onDragStart(x) {
    isDragging = true;
    dragStartX = x;
    dragStartAngle = currentAngle;
    lastDragX = x;
    lastDragTime = Date.now();
    velocity = 0;

    if (snapTween) {
      snapTween.kill();
      snapTween = null;
    }
    cancelAnimationFrame(inertiaRaf);

    stage.style.cursor = 'grabbing';
  }

  function onDragMove(x) {
    if (!isDragging) return;

    var dx = x - dragStartX;
    currentAngle = dragStartAngle + dx * DRAG_SENSITIVITY;

    // Soft clamp (rubber-band)
    var minAngle = -(count - 1) * ITEM_SPREAD;
    var maxAngle = 0;
    if (currentAngle > maxAngle + ITEM_SPREAD * 0.4) {
      currentAngle = maxAngle + ITEM_SPREAD * 0.4;
    }
    if (currentAngle < minAngle - ITEM_SPREAD * 0.4) {
      currentAngle = minAngle - ITEM_SPREAD * 0.4;
    }

    render(currentAngle);

    // Track velocity
    var now = Date.now();
    var dt = now - lastDragTime;
    if (dt > 0) {
      velocity = (x - lastDragX) * DRAG_SENSITIVITY / (dt / 16);
    }
    lastDragX = x;
    lastDragTime = now;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    stage.style.cursor = 'grab';

    // Clamp velocity
    velocity = Math.max(-0.06, Math.min(0.06, velocity));

    if (Math.abs(velocity) > INERTIA_THRESHOLD * 2) {
      inertiaRaf = requestAnimationFrame(runInertia);
    } else {
      snapToNearest();
    }
  }

  /* ── Mouse events ── */
  stage.addEventListener('mousedown', function (e) {
    e.preventDefault();
    onDragStart(e.clientX);
  });
  window.addEventListener('mousemove', function (e) {
    if (isDragging) {
      e.preventDefault();
      onDragMove(e.clientX);
    }
  });
  window.addEventListener('mouseup', onDragEnd);

  /* ── Touch events ── */
  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length === 1) {
      onDragStart(e.touches[0].clientX);
    }
  }, { passive: true });

  stage.addEventListener('touchmove', function (e) {
    if (isDragging && e.touches.length === 1) {
      onDragMove(e.touches[0].clientX);
    }
  }, { passive: true });

  stage.addEventListener('touchend', onDragEnd);
  stage.addEventListener('touchcancel', onDragEnd);

  /* ── Wheel (horizontal scroll or regular scroll) ── */
  stage.addEventListener('wheel', function (e) {
    // Use deltaX primarily, fall back to deltaY
    var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 2) return;

    e.preventDefault();

    if (snapTween) {
      snapTween.kill();
      snapTween = null;
    }

    currentAngle -= delta * WHEEL_SENSITIVITY;

    // Clamp
    var minAngle = -(count - 1) * ITEM_SPREAD;
    var maxAngle = 0;
    currentAngle = Math.max(minAngle - ITEM_SPREAD * 0.2, Math.min(maxAngle + ITEM_SPREAD * 0.2, currentAngle));

    render(currentAngle);

    // Debounce snap
    clearTimeout(stage._wheelSnap);
    stage._wheelSnap = setTimeout(function () {
      snapToNearest();
    }, 200);
  }, { passive: false });

  /* ── Prevent click on drag ── */
  stage.addEventListener('click', function (e) {
    if (Math.abs(lastDragX - dragStartX) > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  /* ── Arrow buttons ── */
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      var target = Math.max(0, currentIndex - 1);
      goTo(target);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      var target = Math.min(count - 1, currentIndex + 1);
      goTo(target);
    });
  }

  /* ── Dot clicks ── */
  if (dotsWrap) {
    dotsWrap.addEventListener('click', function (e) {
      var dot = e.target.closest('[data-arc-dot]');
      if (dot) goTo(Number(dot.getAttribute('data-arc-dot')));
    });
  }

  /* ── Scent chip clicks ── */
  if (scentsWrap) {
    scentsWrap.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-arc-scent]');
      if (chip) goTo(Number(chip.getAttribute('data-arc-scent')));
    });
  }

  /* ── Keyboard ── */
  container.setAttribute('tabindex', '0');
  container.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goTo(Math.max(0, currentIndex - 1));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goTo(Math.min(count - 1, currentIndex + 1));
    }
  });

  /* ── Initial render ── */
  render(0);

  /* ── Handle resize ── */
  window.addEventListener('resize', function () {
    render(currentAngle);
  });

})();
