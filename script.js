const sections = Array.from(document.querySelectorAll(".tabSection"));
const navLinks = Array.from(document.querySelectorAll(".navBtn"));
const mobileNav = document.getElementById("mobileNav");
const menuBtn = document.getElementById("menuBtn");
const toTop = document.getElementById("toTop");
const progress = document.getElementById("progress");

function closeMobileNav() {
  if (!mobileNav) return;
  mobileNav.style.display = "none";
  mobileNav.setAttribute("aria-hidden", "true");
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
}

function openMobileNav() {
  if (!mobileNav) return;
  mobileNav.style.display = "block";
  mobileNav.setAttribute("aria-hidden", "false");
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
}

function setActiveSection(id, push = true) {
  const targetId = (id || "#accueil").replace("#", "");
  const target = document.getElementById(targetId) || sections[0];

  sections.forEach(section => section.classList.remove("activeSection"));
  navLinks.forEach(link => link.classList.remove("active"));

  target.classList.add("activeSection");

  const activeLink = document.querySelector(`.navBtn[href="#${target.id}"]`);
  if (activeLink) activeLink.classList.add("active");

  if (push) {
    history.pushState({ tab: target.id }, "", `#${target.id}`);
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
  closeMobileNav();
}

navLinks.forEach(link => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    setActiveSection(link.getAttribute("href"), true);
  });
});

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
}

if (mobileNav) {
  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setActiveSection(link.getAttribute("href"), true);
    });
  });

  document.addEventListener("click", (event) => {
    if (mobileNav.getAttribute("aria-hidden") === "true") return;
    if (event.target === menuBtn) return;
    if (!mobileNav.contains(event.target)) closeMobileNav();
  });
}

window.addEventListener("popstate", () => {
  const hash = window.location.hash || "#accueil";
  setActiveSection(hash, false);
});

const revealEls = Array.from(document.querySelectorAll(".reveal"));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docH > 0 ? (scrollTop / docH) * 100 : 0;

  if (progress) progress.style.width = `${percent}%`;

  if (toTop) {
    toTop.style.display = scrollTop > 500 ? "block" : "none";
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (toTop) {
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const modalBtns = Array.from(document.querySelectorAll("[data-modal]"));
const closeBtns = Array.from(document.querySelectorAll("[data-close]"));
const modals = Array.from(document.querySelectorAll(".modal"));

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

modalBtns.forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.modal));
});

closeBtns.forEach(btn => {
  btn.addEventListener("click", () => closeModal(btn.closest(".modal")));
});

modals.forEach(modal => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const openedModal = document.querySelector(".modal.open");
  if (openedModal) closeModal(openedModal);
});

document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash || "#accueil";
  setActiveSection(hash, false);
});