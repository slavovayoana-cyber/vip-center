// CLEANSING VIP CENTER — поведение на страницата

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

    var vh = window.innerHeight;
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      // Каквото вече се вижда при зареждане, остава видимо веднага.
      if (el.getBoundingClientRect().top < vh * 0.9) return;
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

  var now = sofiaNow();
  var open = false;
  if (now.day >= 1 && now.day <= 5) open = now.mins >= 510 && now.mins < 1050; // 08:30 – 17:30
  if (now.day === 6) open = now.mins >= 540 && now.mins < 1050;               // 09:00 – 17:30

  var todayKey = now.day === 0 ? 'sunday' : now.day === 6 ? 'saturday' : 'weekday';
  var todayRow = document.querySelector('.hours-row[data-day="' + todayKey + '"]');
  if (todayRow) todayRow.classList.add('is-today');

  var status = document.getElementById('open-status');
  if (status) {
    status.querySelector('.open-status-text').textContent = open ? 'Отворено сега' : 'Затворено в момента';
    status.style.setProperty('--status-color', open ? 'var(--green)' : 'var(--amber)');
    status.hidden = false;
  }

  // ---------- Година във футъра ----------
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
