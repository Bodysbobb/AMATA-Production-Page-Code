// AMATA Production Navbar Control Script
// Minimal JavaScript for navbar functionality

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const navbar = document.getElementById('navbar');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navbarBrand = document.querySelector('.navbar-brand');
  const navbarTitle = document.querySelector('.navbar-title-container');
  
  // Mobile menu toggle
  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', function() {
      navbarCollapse.classList.toggle('show');
      navbarToggler.classList.toggle('collapsed');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInside = navbar.contains(event.target);
      if (!isClickInside && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
        navbarToggler.classList.add('collapsed');
      }
    });
  }
  
  // Scroll behavior for navbar
  let lastScroll = 0;
  let isScrolling = false;
  
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
      if (navbarTitle) {
        navbarTitle.style.display = 'flex';
      }
    } else {
      navbar.classList.remove('scrolled');
      if (navbarTitle) {
        navbarTitle.style.display = 'none';
      }
    }
    
    lastScroll = scrollTop;
    isScrolling = false;
  }
  
  // Optimized scroll listener
  window.addEventListener('scroll', function() {
    if (!isScrolling) {
      window.requestAnimationFrame(handleScroll);
      isScrolling = true;
    }
  });
  
  // Language toggle functionality
  const langToggle = document.querySelector('.language-btn-navbar');
  if (langToggle) {
    langToggle.addEventListener('click', function() {
      // This will trigger the actual page language switch
      // You may need to implement the actual language switching logic
      console.log('Language toggle clicked');
    });
  }
  
  // Active nav link highlighting
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
  
  // Simple dropdown functionality (if not using Bootstrap)
  const dropdowns = document.querySelectorAll('.simple-dropdown');
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-content');
    
    if (toggle && menu) {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
          menu.style.display = 'none';
        }
      });
    }
  });
});