/**
 * Portfolio Website JavaScript
 * Organized using module pattern with utility functions and UI components
 */

// Utility functions
const Utils = {
  debounce: function (func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  },

  updateActiveSection: function () {
    try {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      const navLinks = document.querySelectorAll(".navbar a");

      if (scrollPosition === 0) {
        navLinks.forEach((item) => item.removeAttribute("aria-current"));
        const homeLink = document.querySelector(".navbar a[href='#home']");
        if (homeLink) homeLink.setAttribute("aria-current", "page");
        return;
      }

      document.querySelectorAll("section[id]").forEach((section) => {
        const sectionId = section.getAttribute("id");
        if (!sectionId) return;

        const offset = section.offsetTop;
        const height = section.offsetHeight;

        if (scrollPosition >= offset - 100 && scrollPosition < offset + height - 100) {
          navLinks.forEach((item) => item.removeAttribute("aria-current"));
          const targetLink = document.querySelector(`.navbar a[href='#${sectionId}']`);
          if (targetLink) targetLink.setAttribute("aria-current", "page");
        }
      });
    } catch (error) {
      this.handleError("Error updating active section:", error);
    }
  },

  revealElements: function () {
    try {
      const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");
      const windowHeight = window.innerHeight;
      const visibleThreshold = 120;

      elements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - visibleThreshold) {
          el.classList.add("active");
        }
      });
    } catch (error) {
      this.handleError("Error revealing elements:", error);
    }
  },

  handleError: function (message, error) {
    console.error(message, error);
    // Optionally, display a user-friendly message
  },

  // getRecaptchaSiteKey: function () {
  //   return "6Ld7Sh4rAAAAAFjepNd5uzi6Y1ihcmJMepnNTUzA";
  // },
};

// UI module
const UI = {
  init: function () {
    try {
      this.initStickyHeader();
      this.initSmoothScroll();
      this.initScrollReveal();
      this.initContactForm();
      this.initThemeToggle();
      this.initTyped();
      this.initMobileSidebar();
      this.initProjectTabs();
      this.initCopyrightYear();

      const debouncedRevealElements = Utils.debounce(Utils.revealElements, 100);
      window.addEventListener("scroll", debouncedRevealElements);
      window.addEventListener("load", Utils.revealElements);
    } catch (error) {
      Utils.handleError("Error initializing UI:", error);
    }
  },

  initStickyHeader: function () {
    try {
      const header = document.querySelector(".header-area");
      const debouncedUpdateActiveSection = Utils.debounce(Utils.updateActiveSection, 100);

      window.addEventListener("scroll", function () {
        if (window.pageYOffset > 1) {
          header?.classList.add("sticky");
        } else {
          header?.classList.remove("sticky");
        }
        debouncedUpdateActiveSection();
      });
    } catch (error) {
      Utils.handleError("Error initializing sticky header:", error);
    }
  },

  initSmoothScroll: function () {
    try {
      const links = document.querySelectorAll(".navbar a, .mobile-sidebar a");
      links.forEach((link) => {
        link.addEventListener("click", this.handleSmoothScroll);
      });
    } catch (error) {
      Utils.handleError("Error initializing smooth scroll:", error);
    }
  },

  handleSmoothScroll: function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    const offset = targetId === "#home" ? 0 : targetElement.offsetTop - 80;
    window.scrollTo({ top: offset, behavior: "smooth" });

    const mobileSidebar = document.getElementById("mobileSidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const menuToggle = document.getElementById("menuToggle");

    if (mobileSidebar?.classList.contains("active")) {
      mobileSidebar.classList.remove("active");
      sidebarOverlay?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  },

  initScrollReveal: function () {
    try {
      if (typeof ScrollReveal !== "function") {
        console.warn("ScrollReveal not loaded");
        return;
      }

      const sr = ScrollReveal({
        distance: "60px",
        duration: 1200,
        delay: 200,
        reset: false,
        easing: "ease-in-out",
      });

      sr.reveal(".profile-photo", { origin: "left", distance: "80px", duration: 1000 });
      sr.reveal(".profile-text", { origin: "right", distance: "80px", duration: 1000 });
      sr.reveal(".about-content", { origin: "left", delay: 300 });
      sr.reveal(".about-skills", { origin: "right", delay: 300 });
      sr.reveal(".skill-bar,", { origin: "bottom", distance: "40px", duration: 1000, interval: 200 });
      sr.reveal(".education-column", { origin: "bottom", interval: 300 });
      sr.reveal(".project-title", { origin: "top" });
      sr.reveal(".project", { origin: "bottom", interval: 100 });
      sr.reveal(".cert-card", { origin: "bottom", interval: 150 });
      sr.reveal("#career-goals, #volunteering", { origin: "bottom", distance: "40px" });
      sr.reveal(".contact-info", { origin: "left" });
      sr.reveal(".contact-form", { origin: "right" });
    } catch (error) {
      Utils.handleError("Error initializing ScrollReveal:", error);
    }
  },

  initProjectTabs: function () {
    try {
      const tabButtons = document.querySelectorAll(".tab-btn");
      const projectCards = document.querySelectorAll(".project");

      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          tabButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");

          const category = button.getAttribute("data-category");

          projectCards.forEach((card) => {
            card.classList.remove("show");
            if (category === "all" || card.dataset.category === category) {
              card.classList.add("show");
            }
          });
        });
      });

      document.querySelector(".tab-btn[data-category='all']")?.click();
    } catch (error) {
      Utils.handleError("Error initializing project tab filters:", error);
    }
  },

  initContactForm: function () {
    try {
      const form = document.forms["submitToGoogleSheet"];
      if (!form) return;
  
      // NO fetch, just normal browser submit
      form.addEventListener("submit", function () {
        const loader = form.querySelector(".loader");
        const buttonText = form.querySelector(".button-text");
  
        buttonText.style.display = "none";
        loader.style.display = "inline-block";
      });
    } catch (error) {
      Utils.handleError("Error initializing contact form:", error);
    }
  },
  
  

  initThemeToggle: function () {
    try {
      const toggle = document.getElementById("theme-switch");
      if (!toggle) return;

      const body = document.body;
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme === "light") {
        body.classList.add("light-mode");
        toggle.checked = true;
      }

      toggle.addEventListener("change", () => {
        if (toggle.checked) {
          body.classList.add("light-mode");
          localStorage.setItem("theme", "light");
        } else {
          body.classList.remove("light-mode");
          localStorage.setItem("theme", "dark");
        }
      });
    } catch (error) {
      Utils.handleError("Error initializing theme toggle:", error);
    }
  },

  initTyped: function () {
    try {
      if (typeof Typed !== "function") {
        console.warn("Typed.js not loaded");
        return;
      }

      const typedElement = document.getElementById("typed-role");
      if (typedElement) {
        new Typed("#typed-role", {
          strings: ["Cloud Engineer", "DevOps Enthusiast", "Microsoft 365 Administrator", "IT Professional"],
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 2000,
          startDelay: 500,
          loop: true,
          showCursor: true,
          cursorChar: "|",
        });
      }
    } catch (error) {
      Utils.handleError("Error initializing Typed.js:", error);
    }
  },

  initMobileSidebar: function () {
    try {
      const sidebar = document.getElementById("mobileSidebar");
      const overlay = document.getElementById("sidebarOverlay");
      const menuToggle = document.getElementById("menuToggle");

      if (!sidebar || !overlay || !menuToggle) return;

      menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("active");
        menuToggle.setAttribute("aria-expanded", sidebar.classList.contains("active").toString());
      });

      overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });

      document.querySelectorAll(".mobile-sidebar a").forEach((link) => {
        link.addEventListener("click", () => {
          sidebar.classList.remove("active");
          overlay.classList.remove("active");
          menuToggle.setAttribute("aria-expanded", "false");
        });
      });
    } catch (error) {
      Utils.handleError("Error initializing mobile sidebar:", error);
    }
  },

  initCopyrightYear: function () {
    try {
      const yearElement = document.getElementById("year");
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear().toString();
      }
    } catch (error) {
      Utils.handleError("Error setting copyright year:", error);
    }
  },
};


function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 400);
  }, 4000);
}

document.addEventListener("DOMContentLoaded", function () {
  UI.init(); // your existing UI code

  if (window.location.href.includes("?success=true")) {
    showToast("Message sent successfully!", "success");
    const cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  UI.init(); // initialize your UI

  // Show toast if success query param exists
  if (window.location.href.includes("?success=true")) {
    showToast("Message sent successfully!", "success");

    // Clean up the URL
    const cleanUrl = window.location.href.split("?")[0];
    window.history.replaceState({}, document.title, cleanUrl);
  }
});

