const menuToggle = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const navLinks = [...document.querySelectorAll(".sidebar-nav .nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  menuToggle.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
}

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.innerHTML = `<i class="bi ${isOpen ? "bi-x-lg" : "bi-list"}" aria-hidden="true"></i>`;
});

document.querySelector("[data-close-menu]").addEventListener("click", closeMenu);

function setActiveSection(section) {
  navLinks.forEach((link) => {
    const isCurrent = link.hash === `#${section.id}`;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

navLinks.forEach((link) => link.addEventListener("click", () => {
  closeMenu();
  const targetSection = document.getElementById(link.hash.slice(1));
  if (targetSection) setActiveSection(targetSection);
}));
sidebar.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
    closeMenu();
    menuToggle.focus();
  }
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

function updateActiveSection() {
  const marker = window.innerHeight * 0.32;
  let currentSection = sections[0];

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) currentSection = section;
  });

  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
    currentSection = sections[sections.length - 1];
  }

  setActiveSection(currentSection);
}

let scrollUpdatePending = false;
window.addEventListener("scroll", () => {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  window.requestAnimationFrame(() => {
    updateActiveSection();
    scrollUpdatePending = false;
  });
}, { passive: true });
window.addEventListener("resize", updateActiveSection);
updateActiveSection();
