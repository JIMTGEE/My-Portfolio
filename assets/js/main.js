(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isNarrow = window.matchMedia("(max-width: 760px)").matches;

  /* ---------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------- */
  var toggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------------------------------------------------------------
     Hero parallax — three depth layers move at different rates as the
     page scrolls. Disabled for reduced-motion and small screens, where
     it adds jank without adding anything.
     ------------------------------------------------------------------- */
  var heroLayers = document.querySelectorAll(".hero-field .layer");

  if (heroLayers.length && !reduceMotion && !isNarrow) {
    var ticking = false;

    function applyParallax() {
      var y = window.scrollY;
      heroLayers.forEach(function (layer) {
        var speed = parseFloat(layer.getAttribute("data-speed")) || 0;
        layer.style.transform = "translate3d(0, " + y * speed + "px, 0)";
      });
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(applyParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------------------
     Scroll reveal — section headings only, one quiet fade-up treatment.
     ------------------------------------------------------------------- */
  var revealTargets = document.querySelectorAll(".reveal");

  if (revealTargets.length && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------------------------------------------------------------------
     Process rail — steps activate in sequence as they enter view, and
     the connecting line fills to match, since the content is a genuine
     ordered sequence.
     ------------------------------------------------------------------- */
  var steps = document.querySelectorAll(".process-step");
  var trackFill = document.querySelector(".process-track-fill");

  if (steps.length && "IntersectionObserver" in window) {
    var activeCount = 0;

    var stepObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            obs.unobserve(entry.target);
            activeCount += 1;
            if (trackFill) {
              trackFill.style.width = (activeCount / steps.length) * 100 + "%";
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    steps.forEach(function (step) {
      stepObserver.observe(step);
    });
  } else {
    steps.forEach(function (step) {
      step.classList.add("active");
    });
    if (trackFill) {
      trackFill.style.width = "100%";
    }
  }

  /* ---------------------------------------------------------------------
     Contact form — static site, no backend. Builds a pre-filled mailto:
     so the message still reaches an inbox without any server component.
     Swap CONTACT_EMAIL for the live business address before launch.
     ------------------------------------------------------------------- */
  var CONTACT_EMAIL = "hello@jihope.tech";
  var form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var project = form.elements["project"].value.trim();
      var message = form.elements["message"].value.trim();

      var subject = "Project inquiry — " + (name || "New lead");
      var body =
        "Name: " + name +
        "\nEmail: " + email +
        "\nProject type: " + project +
        "\n\n" + message;

      window.location.href =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
