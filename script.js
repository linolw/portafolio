(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const year = document.getElementById("year");
  const greeting = document.getElementById("greeting");
  const roleFlip = document.getElementById("role-flip");
  const live = document.getElementById("terminal-live");

  const topo = document.querySelector(".topography-bg");
  let pointerRaf = 0;
  window.addEventListener("pointermove", (event) => {
    if (!topo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (pointerRaf) return;
    pointerRaf = requestAnimationFrame(() => {
      pointerRaf = 0;
      const x = (event.clientX / window.innerWidth - 0.5) * 8;
      const y = (event.clientY / window.innerHeight - 0.5) * 8;
      topo.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.dataset.theme = "light";
  }

  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });

  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (event) => {
    if (!mobileNav?.classList.contains("open")) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!mobileNav.contains(target) && !menuToggle?.contains(target)) {
      mobileNav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelectorAll(".project-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      const content = button.nextElementSibling;
      if (!(content instanceof HTMLElement)) return;
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      content.classList.toggle("open", !open);
    });
  });

  function getGreeting() {
    const parts = new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      hour: "numeric",
      hour12: false
    }).formatToParts(new Date());
    const hour = Number(parts.find((p) => p.type === "hour")?.value || 12);
    if (hour < 6) return "Buenas noches";
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  }
  if (greeting) greeting.textContent = getGreeting();

  const roles = [
    "Ingeniero de Software",
    "Desarrollo Web",
    "Producto & Software",
    "Git · GitHub · TypeScript"
  ];
  let roleIndex = 0;
  setInterval(() => {
    if (!roleFlip) return;
    roleFlip.animate(
      [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-4px)" }],
      { duration: 170, fill: "forwards" }
    ).onfinish = () => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleFlip.textContent = roles[roleIndex];
      roleFlip.animate(
        [{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 200, fill: "forwards" }
      );
    };
  }, 4200);

  const terminalAnswers = {
    whoami: "Leonardo Lino · Ingeniero de Software",
    stack: "TypeScript · JavaScript · C++ · Node.js · MongoDB · Git",
    status: "building / learning / improving"
  };

  document.querySelectorAll("[data-terminal]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!live) return;
      const command = button.getAttribute("data-terminal");
      live.textContent = command || "";
      setTimeout(() => {
        live.textContent = terminalAnswers[command] || "ready";
      }, 260);
    });
  });

  const liveLines = [
    "build --with-purpose",
    "git status: clean",
    "shipping useful software",
    "learning continuously"
  ];
  let lineIndex = 0;
  setInterval(() => {
    if (!live) return;
    lineIndex = (lineIndex + 1) % liveLines.length;
    live.textContent = liveLines[lineIndex];
  }, 5200);

  if (year) year.textContent = String(new Date().getFullYear());
})();