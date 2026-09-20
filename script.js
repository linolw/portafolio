(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  const year = document.getElementById("year");

  const preferredTheme = localStorage.getItem("theme");
  if (preferredTheme === "light" || preferredTheme === "dark") {
    root.dataset.theme = preferredTheme;
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    root.dataset.theme = "light";
  }

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
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

  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px" }
  );

  items.forEach((item) => observer.observe(item));

  if (year) year.textContent = String(new Date().getFullYear());
})();