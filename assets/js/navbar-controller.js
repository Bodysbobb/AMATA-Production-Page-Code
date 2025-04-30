document.addEventListener('DOMContentLoaded', function() {
  // ===== Configuration Detection =====
  const hasHeroSection = document.querySelector('.landing-hero') !== null;
  const hasAutoHide = document.body.classList.contains('navbar-auto-hide');
  const hasSpecialNavbar = document.body.getAttribute('data-special-navbar') === 'true';
  const hasBothNavbars = hasSpecialNavbar && document.body.getAttribute('data-switch-navbar') === 'true';
  
  // Get navbar elements
  const defaultNavbar = document.getElementById('default-navbar');
  const specialNavbar = document.getElementById('special-navbar');
  const headerContainer = document.getElementById('header-container');
  
  // Track scroll position
  let lastScrollTop = 0;
  let ticking = false;
  
  // ===== Add minimal transition styles =====
  const addTransitionStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Navbar transition styles */
      #default-navbar, #special-navbar, .navbar {
        transition: transform 0.4s ease, opacity 0.4s ease;
      }
      
      /* Auto-hide transitions */
      .navbar-hidden {
        transform: translateY(-100%) !important;
        opacity: 0 !important;
      }
      
      /* Hero section container */
      #header-container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1030;
        transform: translateY(-100%);
        opacity: 0;
        transition: transform 0.5s ease, opacity 0.5s ease;
        pointer-events: none;
      }
      
      #header-container.visible {
        transform: translateY(0);
        opacity: 1;
        pointer-events: auto;
      }
    `;
    document.head.appendChild(style);
  };
  
  // ===== Hero Section Handler =====
  const handleHeroSectionNavbar = () => {
    if (!hasHeroSection || !headerContainer) return;
    
    const heroSection = document.querySelector('.landing-hero');
    const handleScrollForHero = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = heroSection.offsetHeight;
      
      // Show navbar when scrolled past 70% of hero height
      if (scrollPosition > heroHeight * 0.7) {
        headerContainer.classList.add('visible');
      } else {
        headerContainer.classList.remove('visible');
      }
    };
    
    // Listen for scroll events
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleScrollForHero();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Initialize on load
    handleScrollForHero();
  };
  
  // ===== Auto-Hide Functionality =====
  const setupAutoHide = (navbar) => {
    if (!navbar || !hasAutoHide) return;
    
    const handleAutoHideScroll = () => {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Only apply logic if we've scrolled enough (10px threshold)
      if (Math.abs(lastScrollTop - currentScrollTop) > 10) {
        // Down scroll and past navbar height - hide navbar
        if (currentScrollTop > lastScrollTop && currentScrollTop > navbar.offsetHeight) {
          navbar.classList.add('navbar-hidden');
        } 
        // Up scroll or at the top - show navbar
        else if (currentScrollTop < lastScrollTop || currentScrollTop < navbar.offsetHeight) {
          navbar.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = currentScrollTop;
      }
    };
    
    // Listen for scroll events
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          handleAutoHideScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Initialize
    navbar.classList.remove('navbar-hidden');
  };
  
  // ===== Navbar Switch =====
  const setupNavbarToggle = () => {
    if (!hasBothNavbars || !defaultNavbar || !specialNavbar) return;
    
    // Function to switch between navbars based on scroll direction
    const switchNavbarsOnScroll = () => {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // Scrolling down - show special navbar
      if (currentScrollTop > lastScrollTop && Math.abs(lastScrollTop - currentScrollTop) > 20) {
        defaultNavbar.style.display = 'none';
        specialNavbar.style.display = 'block';
      }
      // Scrolling up - show default navbar
      else if (currentScrollTop < lastScrollTop && Math.abs(lastScrollTop - currentScrollTop) > 20) {
        specialNavbar.style.display = 'none';
        defaultNavbar.style.display = 'block';
        defaultNavbar.classList.add('visible'); 
      }
      
      lastScrollTop = currentScrollTop;
    };
    
    // Listen for scroll events
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          switchNavbarsOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  };
  
  // ===== Initialize all components =====
  addTransitionStyles();
  handleHeroSectionNavbar();
  
  // Setup auto-hide for relevant navbars
  if (defaultNavbar) {
    const defaultInnerNav = defaultNavbar.querySelector('#navbar');
    setupAutoHide(defaultInnerNav || defaultNavbar);
  }
  
  if (specialNavbar) {
    const specialInnerNav = specialNavbar.querySelector('#navbar-special');
    setupAutoHide(specialInnerNav || specialNavbar);
  }
  
  // Setup navbar toggle if both navbars are available
  if (hasBothNavbars) {
    setupNavbarToggle();
  }
});