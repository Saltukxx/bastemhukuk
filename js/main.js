(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initHeader();
    initReveal();
    initFaq();
    initFilters();
    initToTop();
    initForms();
    setActiveNav();
    setYear();
  });

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-links");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    els.forEach(function (el) { obs.observe(el); });
  }

  function initFaq() {
    document.querySelectorAll(".faq-item").forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.addEventListener("click", function () {
        var open = item.classList.contains("is-open");
        document.querySelectorAll(".faq-item").forEach(function (other) {
          other.classList.remove("is-open");
          var body = other.querySelector(".faq-a");
          if (body) body.style.maxHeight = null;
        });
        if (!open) {
          item.classList.add("is-open");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
  }

  function initFilters() {
    var btns = document.querySelectorAll(".filter-btn");
    var posts = document.querySelectorAll("[data-category]");
    if (!btns.length || !posts.length) return;
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var cat = btn.getAttribute("data-filter");
        posts.forEach(function (post) {
          var match = cat === "all" || post.getAttribute("data-category") === cat;
          post.style.display = match ? "" : "none";
        });
      });
    });
  }

  function initToTop() {
    var btn = document.querySelector(".to-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 480);
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initForms() {
    document.querySelectorAll("form[data-validate]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var valid = true;
        form.querySelectorAll("[required]").forEach(function (field) {
          if (!validateField(field)) valid = false;
        });
        if (valid) {
          var success = form.querySelector(".form-success");
          if (success) {
            success.classList.add("show");
            success.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          form.reset();
        } else {
          var first = form.querySelector(".invalid");
          if (first) first.focus();
        }
      });
      form.querySelectorAll("[required]").forEach(function (field) {
        field.addEventListener("blur", function () { validateField(field); });
        field.addEventListener("input", function () {
          if (field.classList.contains("invalid")) validateField(field);
        });
      });
    });
  }

  function validateField(field) {
    var ok = true;
    var msg = "Bu alan zorunludur.";
    if (field.type === "radio") {
      var group = field.form.querySelectorAll('input[name="' + field.name + '"]');
      ok = Array.prototype.some.call(group, function (r) { return r.checked; });
      msg = "Lütfen bir seçim yapınız.";
    } else if (field.type === "checkbox") {
      ok = field.checked;
      msg = "Devam etmek için bu kutuyu işaretlemelisiniz.";
    } else {
      var value = (field.value || "").trim();
      if (!value) ok = false;
      else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        ok = false; msg = "Geçerli bir e-posta adresi giriniz.";
      } else if (field.type === "tel" && value.replace(/\D/g, "").length < 10) {
        ok = false; msg = "Geçerli bir telefon numarası giriniz.";
      }
    }
    var holder = field.closest(".field") || field.parentElement;
    var error = holder ? holder.querySelector(".field-error") : null;
    if (field.type !== "radio" && field.type !== "checkbox") {
      field.classList.toggle("invalid", !ok);
    }
    if (error) {
      error.textContent = msg;
      error.classList.toggle("show", !ok);
    }
    return ok;
  }

  function setActiveNav() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("is-active");
      }
    });
  }

  function setYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
