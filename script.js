// VIP CLEANING CENTER — поведение на страницата

(function () {
  'use strict';

  // ---------- Мобилно меню ----------
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  }

  toggle.addEventListener('click', function () {
    setMenu(menu.hidden);
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 900 && !menu.hidden) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });

  // ---------- Плавно появяване при скрол ----------
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Първо само четем позициите, после само сменяме класове. Ако се редуват,
    // браузърът преизчислява разположението на страницата за всеки елемент.
    var vh = window.innerHeight;
    var below = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'))
      .filter(function (el) { return el.getBoundingClientRect().top >= vh * 0.9; });
    // Каквото вече се вижда при зареждане, остава видимо веднага.
    below.forEach(function (el) {
      el.classList.add('reveal-pending');
      io.observe(el);
    });
  }

  // ---------- Карусел с отзиви ----------
  var track = document.querySelector('.reviews-track');
  document.querySelectorAll('[data-carousel]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = track.firstElementChild;
      var step = card ? card.getBoundingClientRect().width + 18 : 360;
      var dir = btn.getAttribute('data-carousel') === 'next' ? 1 : -1;
      track.scrollBy({ left: dir * step, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  // ---------- Работно време: "Отворено сега" ----------
  // Изчислява се по българско време, независимо къде е посетителят.
  function sofiaNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Sofia',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
      }).formatToParts(new Date());
      var get = function (type) {
        return parts.find(function (p) { return p.type === type; }).value;
      };
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[get('weekday')], mins: Number(get('hour')) * 60 + Number(get('minute')) };
    } catch (err) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }

  // [отваряне, затваряне] в минути от полунощ; null = почивен ден.
  var schedule = [null, [510, 1050], [510, 1050], [510, 1050], [510, 1050], [510, 1050], [540, 960]];
  var dayNames = ['в неделя', 'в понеделник', 'във вторник', 'в сряда', 'в четвъртък', 'в петък', 'в събота'];

  function hhmm(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  var now = sofiaNow();
  var today = schedule[now.day];
  var open = !!today && now.mins >= today[0] && now.mins < today[1];

  // Кога отваряме следващия път (за текста в началото на страницата).
  function nextOpening() {
    if (today && now.mins < today[0]) return 'днес в ' + hhmm(today[0]);
    for (var i = 1; i <= 7; i++) {
      var d = (now.day + i) % 7;
      if (schedule[d]) return (i === 1 ? 'утре' : dayNames[d]) + ' в ' + hhmm(schedule[d][0]);
    }
    return '';
  }

  var todayKey = now.day === 0 ? 'sunday' : now.day === 6 ? 'saturday' : 'weekday';
  var todayRow = document.querySelector('.hours-row[data-day="' + todayKey + '"]');
  if (todayRow) todayRow.classList.add('is-today');

  var status = document.getElementById('open-status');
  if (status) {
    status.querySelector('.open-status-text').textContent = open ? 'Отворено сега' : 'Затворено в момента';
    status.style.setProperty('--status-color', open ? 'var(--green)' : 'var(--amber)');
    status.hidden = false;
  }

  var heroStatus = document.getElementById('hero-status');
  if (heroStatus) {
    heroStatus.classList.add(open ? 'is-open' : 'is-closed');
    heroStatus.querySelector('.hero-status-text').textContent = open
      ? 'Отворено сега · до ' + hhmm(today[1])
      : 'Затворено · отваряме ' + nextOpening();
  }

  // ---------- Хедър при скрол, лента за прогрес, бутон "нагоре" ----------
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 10);
    header.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1).toFixed(4) : '0');
    if (toTop) toTop.classList.toggle('is-visible', y > 800);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  // ---------- Активна секция в менюто ----------
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-desktop a[href^="#"]'));
  if ('IntersectionObserver' in window && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var active = a === byId[entry.target.id];
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (sec) { spy.observe(sec); });
  }

  // ---------- Светлина под курсора върху картите ----------
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.spotlight').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // ---------- Преди / След ----------
  var ba = document.querySelector('.ba');
  if (ba) {
    var range = ba.querySelector('.ba-range');
    var beforeImg = ba.querySelector('.ba-before');
    var afterImg = ba.querySelector('.ba-after');
    var dragging = false;

    var setPos = function (p) {
      p = Math.max(0, Math.min(100, p));
      ba.style.setProperty('--pos', p + '%');
      range.value = String(Math.round(p));
    };
    var fromPointer = function (e) {
      var r = ba.getBoundingClientRect();
      setPos((e.clientX - r.left) / r.width * 100);
    };

    // С пръст линията тръгва едва при движение (или при тап), за да не подскача,
    // когато човек просто скролва страницата през снимката.
    var moved = false;
    var startX = 0, startY = 0;
    ba.addEventListener('pointerdown', function (e) {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      ba.setPointerCapture(e.pointerId);
      if (e.pointerType === 'mouse') fromPointer(e);
    });
    ba.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (!moved && e.pointerType !== 'mouse') {
        var dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 4 && dy < 4) return;
        if (dy > dx) { dragging = false; return; } // вертикално = скрол на страницата
      }
      moved = true;
      fromPointer(e);
    });
    ba.addEventListener('pointerup', function (e) {
      if (dragging && !moved && e.pointerType !== 'mouse') fromPointer(e);
      dragging = false;
    });
    ba.addEventListener('pointercancel', function () { dragging = false; });
    range.addEventListener('input', function () { setPos(Number(range.value)); });

    var largest = function (srcset) { return srcset.split(',').pop().trim().split(' ')[0]; };
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('.ba-thumb'));
    var captionLabel = document.querySelector('.ba-caption-label');
    var captionCount = document.querySelector('.ba-caption-count');
    var current = 0;

    var show = function (index) {
      current = (index + thumbs.length) % thumbs.length;
      var thumb = thumbs[current];
      thumbs.forEach(function (t) {
        var on = t === thumb;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-pressed', String(on));
      });
      var label = thumb.getAttribute('data-label');
      beforeImg.srcset = thumb.getAttribute('data-before');
      beforeImg.src = largest(beforeImg.srcset);
      beforeImg.alt = 'Преди почистване: ' + label.toLowerCase();
      afterImg.srcset = thumb.getAttribute('data-after');
      afterImg.src = largest(afterImg.srcset);
      afterImg.alt = 'След почистване: ' + label.toLowerCase();
      captionLabel.textContent = label;
      captionCount.textContent = (current + 1) + ' / ' + thumbs.length;
      setPos(50);
    };
    thumbs.forEach(function (thumb, i) {
      thumb.addEventListener('click', function () { show(i); });
    });
    document.querySelector('.ba-prev').addEventListener('click', function () { show(current - 1); });
    document.querySelector('.ba-next').addEventListener('click', function () { show(current + 1); });

    // Кратко "помръдване" на линията, за да се види, че се плъзга.
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var hint = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        hint.disconnect();
        var start = null;
        var step = function (t) {
          if (dragging) return;
          if (start === null) start = t;
          var k = (t - start) / 1400;
          if (k >= 1) { setPos(50); return; }
          setPos(50 + Math.sin(k * Math.PI * 2) * 14 * (1 - k));
          window.requestAnimationFrame(step);
        };
        window.setTimeout(function () { window.requestAnimationFrame(step); }, 400);
      }, { threshold: 0.5 });
      hint.observe(ba);
    }
  }

  // ---------- Залепеният бутон "Обади се" на телефон ----------
  // Не дублира бутона в началото: появява се, когато той излезе от екрана.
  var sticky = document.querySelector('.sticky-call');
  var heroActions = document.querySelector('.hero-actions');
  if (sticky && heroActions) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        sticky.classList.toggle('is-visible', !entries[0].isIntersecting);
      }).observe(heroActions);
    } else {
      sticky.classList.add('is-visible');
    }
  }

  // ---------- Година във футъра ----------
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
