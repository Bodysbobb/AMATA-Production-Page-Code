document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const defaultLogo = navbar.dataset.defaultLogo;
  const defaultLogo2 = navbar.dataset.defaultLogo2;
  const scrollLogo = navbar.dataset.scrollLogo || defaultLogo;
  const scrollLogo2 = navbar.dataset.scrollLogo2;
  const scrollEffect = navbar.dataset.navbarScrollEffect === 'true';

  const navbarToggle = document.getElementById('navbar-toggle');
  const navbarNavigation = document.getElementById('navbar-navigation');

  const iconBars = navbarToggle?.querySelector('.icon-bars');
  const iconClose = navbarToggle?.querySelector('.icon-close');

  let isScrolled = false;
  let ticking = false;

  // Toggle icon helper
  const updateToggleIcons = (isExpanded) => {
    if (!iconBars || !iconClose) return;
    if (isExpanded) {
      iconBars.classList.add('d-none');
      iconClose.classList.remove('d-none');
    } else {
      iconBars.classList.remove('d-none');
      iconClose.classList.add('d-none');
    }
  };

  // ===============================
  // Toggle Mobile Menu
  // ===============================
  if (navbarToggle) {
    navbarToggle.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('active');
      navbarNavigation.classList.toggle('show');
      updateToggleIcons(!isExpanded);
    });
  }

  // ===============================
  // Close menu on outside click / nav link
  // ===============================
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      if (
        e.target.classList.contains('nav-link') &&
        !e.target.classList.contains('dropdown-toggle')
      ) {
        navbarNavigation.classList.remove('show');
        navbarToggle.classList.remove('active');
        navbarToggle.setAttribute('aria-expanded', 'false');
        updateToggleIcons(false);
      }

      if (!navbar.contains(e.target) && navbarNavigation.classList.contains('show')) {
        navbarNavigation.classList.remove('show');
        navbarToggle.classList.remove('active');
        navbarToggle.setAttribute('aria-expanded', 'false');
        updateToggleIcons(false);
      }
    }
  });

  // ===============================
  // Dropdown handler (mobile)
  // ===============================
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');

    if (toggle && menu) {
      toggle.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdowns.forEach((other) => {
            if (other !== dropdown) {
              const otherMenu = other.querySelector('.dropdown-menu');
              const otherToggle = other.querySelector('.dropdown-toggle');
              if (otherMenu) otherMenu.classList.remove('show');
              if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
            }
          });
          const isOpen = menu.classList.contains('show');
          menu.classList.toggle('show');
          toggle.setAttribute('aria-expanded', !isOpen);
        }
      });

      document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 && !dropdown.contains(e.target)) {
          menu.classList.remove('show');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // ===============================
  // Reset menu on resize
  // ===============================
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      navbarNavigation.classList.remove('show');
      navbarToggle.classList.remove('active');
      navbarToggle.setAttribute('aria-expanded', 'false');
      updateToggleIcons(false);
      dropdowns.forEach((dropdown) => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('show');
      });
    }
  });

  // ===============================
  // Scroll effect
  // ===============================
  let lastScrollTop = 0;
  const scrollThreshold = 50;
  
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
    // Collapse mobile menu only when scrolling down past threshold
    if (
      window.innerWidth <= 768 &&
      scrollTop > lastScrollTop + scrollThreshold &&
      navbarNavigation.classList.contains('show')
    ) {
      navbarNavigation.classList.remove('show');
      navbarToggle.classList.remove('active');
      navbarToggle.setAttribute('aria-expanded', 'false');
      updateToggleIcons(false);
    }
  
    // Scroll effect for navbar background / logo
    if (scrollEffect) {
      if (scrollTop > 50 && !isScrolled) {
        navbar.classList.add('scrolled');
  
        const logoOneImg = document.querySelector('.navbar-brand img');
        if (logoOneImg && scrollLogo) logoOneImg.src = scrollLogo;
  
        const logoTwoImgs = document.querySelectorAll('.navbar-brand img');
        if (logoTwoImgs[1] && scrollLogo2) logoTwoImgs[1].src = scrollLogo2;
  
        isScrolled = true;
      } else if (scrollTop <= 50 && isScrolled) {
        navbar.classList.remove('scrolled');
  
        const logoOneImg = document.querySelector('.navbar-brand img');
        if (logoOneImg && defaultLogo) logoOneImg.src = defaultLogo;
  
        const logoTwoImgs = document.querySelectorAll('.navbar-brand img');
        if (logoTwoImgs[1] && defaultLogo2) logoTwoImgs[1].src = defaultLogo2;
  
        isScrolled = false;
      }
    }
  
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }
  
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Run once
  handleScroll();
  updateToggleIcons(navbarToggle?.classList.contains('active'));
});
