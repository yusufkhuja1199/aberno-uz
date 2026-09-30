/* ==========================================================
   ABERNO — umumiy skript
   ========================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ---------- Mobil menyu ---------- */
  var burger = document.querySelector(".burger");
  var nav = document.querySelector(".nav");

  function closeNav() {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) closeNav();
    });
  }

  /* ---------- Faol menyu bandi ---------- */
  var current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__link").forEach(function (link) {
    if (link.getAttribute("href") === current) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ---------- Header soyasi va "yuqoriga" tugmasi ---------- */
  var header = document.querySelector(".header");
  var toTop = document.querySelector(".to-top");

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Paydo bo'lish animatsiyasi ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Mahsulot filtri ---------- */
  document.querySelectorAll("[data-filters]").forEach(function (group) {
    var target = document.querySelector(group.getAttribute("data-filters"));
    if (!target) return;
    var items = target.querySelectorAll("[data-category]");

    group.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      group.querySelectorAll(".filter").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      var value = btn.getAttribute("data-filter");
      items.forEach(function (item) {
        var show = value === "all" || item.getAttribute("data-category") === value;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ---------- Aloqa formasi ---------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var success = form.querySelector(".form__success");

    var rules = {
      name: function (v) { return v.trim().length >= 2; },
      phone: function (v) { return /^[+\d][\d\s()-]{8,}$/.test(v.trim()); },
      email: function (v) { return v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      topic: function (v) { return v !== ""; },
      message: function (v) { return v.trim().length >= 10; }
    };

    function validate(field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var ok = rule(field.value);
      field.closest(".field").classList.toggle("has-error", !ok);
      return ok;
    }

    form.addEventListener("input", function (e) {
      if (e.target.closest(".field.has-error")) validate(e.target);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name && !validate(el)) valid = false;
      });
      if (!valid) {
        var firstError = form.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      // Server qismi ulanmagan: hozircha foydalanuvchiga tasdiq ko'rsatiladi.
      // Backend yoki Telegram-bot ulanganda shu yerga fetch() so'rovi qo'shiladi.
      form.reset();
      if (success) {
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(function () { success.classList.remove("is-visible"); }, 7000);
      }
    });

    // URL orqali mavzuni oldindan tanlash: contact.html?topic=export
    var topic = new URLSearchParams(location.search).get("topic");
    if (topic && form.topic) {
      var opt = form.topic.querySelector('option[value="' + topic + '"]');
      if (opt) form.topic.value = topic;
    }
  }

  /* ---------- Joriy yil ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
