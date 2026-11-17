(function () {
  const root = document.documentElement;
  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => Array.from(document.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hoverAvailable = window.matchMedia("(hover: hover)").matches;
  const gsap = window.gsap;
  const themeButton = select("#theme");
  const menu = select("#menu");
  const menuButton = select("#burger");

  function getSavedTheme() {
    try {
      return window.localStorage.getItem("theme");
    } catch (error) {
      console.warn("Could not read the saved theme preference.", error);
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Could not save the theme preference.", error);
    }
  }

  function setTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    themeButton.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
    document.querySelector('meta[name="theme-color"]').setAttribute(
      "content",
      theme === "dark" ? "#0a1424" : "#eaf1fa"
    );
    if (persist) {
      saveTheme(theme);
    }
  }

  const savedTheme = getSavedTheme();
  const initialTheme =
    savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
  setTheme(initialTheme, false);

  themeButton.addEventListener("click", function () {
    setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
  });

  function closeMenu() {
    menu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  }

  menuButton.addEventListener("click", function () {
    const isOpen = menu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  menu.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menu.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  const nav = select("#nav");
  const progress = select("#progress");
  function updateScrollUI() {
    nav.classList.toggle("small", window.scrollY > 40);
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, scrollProgress)) + ")";
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  window.addEventListener("resize", updateScrollUI);
  updateScrollUI();

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          selectAll("#menu a").forEach(function (link) {
            if (link.getAttribute("href") === "#" + entry.target.id) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    selectAll("header[id], section[id]").forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  if (hoverAvailable) {
    window.addEventListener(
      "pointermove",
      function (event) {
        if (!(event.target instanceof Element)) {
          return;
        }

        const glass = event.target.closest(".glass");
        if (glass) {
          const bounds = glass.getBoundingClientRect();
          glass.style.setProperty("--mx", event.clientX - bounds.left + "px");
          glass.style.setProperty("--my", event.clientY - bounds.top + "px");
        }

        const magnetic = event.target.closest(".magnetic");
        if (magnetic && gsap && !reducedMotion) {
          const bounds = magnetic.getBoundingClientRect();
          gsap.to(magnetic, {
            x: (event.clientX - bounds.left - bounds.width / 2) * 0.2,
            y: (event.clientY - bounds.top - bounds.height / 2) * 0.25,
            duration: 0.3,
            overwrite: true
          });
        }

        const tilt = event.target.closest(".tilt");
        if (tilt) {
          const bounds = tilt.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          tilt.style.setProperty("--ry", (x - 0.5) * 10 + "deg");
          tilt.style.setProperty("--rx", (0.5 - y) * 10 + "deg");
        }
      },
      { passive: true }
    );

    document.addEventListener("pointerout", function (event) {
      if (!(event.target instanceof Element)) {
        return;
      }

      const relatedTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null;
      const tilt = event.target.closest(".tilt");
      if (tilt && !tilt.contains(relatedTarget)) {
        tilt.style.setProperty("--rx", "0deg");
        tilt.style.setProperty("--ry", "0deg");
      }

      const magnetic = event.target.closest(".magnetic");
      if (magnetic && gsap && !magnetic.contains(relatedTarget)) {
        gsap.to(magnetic, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
          overwrite: true
        });
      }
    });
  }

  if (reducedMotion || !gsap || !window.ScrollTrigger) {
    return;
  }

  gsap.registerPlugin(window.ScrollTrigger);

  selectAll(".word").forEach(function (word) {
    word.setAttribute("aria-hidden", "true");
    word.innerHTML = Array.from(word.textContent)
      .map(function (letter) {
        return '<span class="letter">' + letter + "</span>";
      })
      .join("");
  });

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .from(".letter", { yPercent: 110, rotate: 8, opacity: 0, duration: 0.9, stagger: 0.045 })
    .from(".eyebrow, .role, .lead, .cta", { y: 24, opacity: 0, duration: 0.7, stagger: 0.12 }, "-=0.5")
    .from(".stat", { y: 30, opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.1 }, "-=0.4")
    .from(".photo", { scale: 0.7, opacity: 0, duration: 1.1, ease: "back.out(1.5)" }, "-=1.2");

  selectAll("[data-count]").forEach(function (element) {
    const counter = { value: 0 };
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    gsap.to(counter, {
      value: target,
      duration: 2.2,
      delay: 0.9,
      ease: "power2.out",
      onUpdate: function () {
        element.textContent = Math.round(counter.value) + suffix;
      }
    });
  });

  const roles = [
    "Full Stack Developer",
    "Fast, scalable web apps",
    "Simplicity and functionality"
  ];
  const role = select("#role");
  let roleIndex = 0;
  window.setInterval(function () {
    gsap.to(role, {
      y: -12,
      opacity: 0,
      duration: 0.35,
      onComplete: function () {
        roleIndex = (roleIndex + 1) % roles.length;
        role.textContent = roles[roleIndex];
        gsap.fromTo(role, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
      }
    });
  }, 3200);

  selectAll(".reveal").forEach(function (element) {
    gsap.from(element.children, {
      y: 45,
      opacity: 0,
      duration: 0.9,
      stagger: 0.14,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 85%" }
    });
  });

  selectAll(".section-title").forEach(function (title) {
    gsap.from(title, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: { trigger: title, start: "top 90%" }
    });
  });

  gsap.fromTo(
    ".timeline",
    { "--timeline-progress": 0 },
    {
      "--timeline-progress": 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline",
        start: "top 75%",
        end: "bottom 60%",
        scrub: true
      }
    }
  );

  selectAll(".orb").forEach(function (orb, index) {
    gsap.to(orb, {
      y: (index + 1) * -180,
      x: index % 2 ? -70 : 70,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 1 }
    });
  });

  gsap.to(progress, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
  });
})();
