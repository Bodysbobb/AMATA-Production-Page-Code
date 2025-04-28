document.addEventListener('DOMContentLoaded', function() {
  // Check if the auto-hide feature is enabled via the body class
  if (document.body.classList.contains('navbar-auto-hide')) {
    // Target both navbar types directly
    const defaultNavbar = document.getElementById('navbar');
    const specialNavbar = document.getElementById('navbar-special');
    
    // Function to set up auto-hide for a navbar
    function setupAutoHide(navbar) {
      if (!navbar) return;
      
      // Add a class to indicate the navbar is in auto-hide mode
      navbar.classList.add('navbar-autohide-enabled');
      
      let lastScrollTop = 0;
      let ticking = false;
      
      // Function to handle scroll behavior
      function handleScroll() {
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
        
        ticking = false;
      }
      
      // Use requestAnimationFrame for scroll event performance
      window.addEventListener('scroll', function() {
        if (!ticking) {
          window.requestAnimationFrame(function() {
            handleScroll();
          });
          ticking = true;
        }
      });
      
      // Force initial state
      navbar.classList.remove('navbar-hidden');
    }
    
    // Set up auto-hide for both navbar types if they exist
    if (defaultNavbar) setupAutoHide(defaultNavbar);
    if (specialNavbar) setupAutoHide(specialNavbar);
    
    // Also handle navbars that might be inside containers
    const defaultNavbarContainer = document.getElementById('default-navbar');
    const specialNavbarContainer = document.getElementById('special-navbar');
    
    if (defaultNavbarContainer && !defaultNavbar) {
      const nestedDefaultNavbar = defaultNavbarContainer.querySelector('.navbar');
      if (nestedDefaultNavbar) setupAutoHide(nestedDefaultNavbar);
    }
    
    if (specialNavbarContainer && !specialNavbar) {
      const nestedSpecialNavbar = specialNavbarContainer.querySelector('.navbar');
      if (nestedSpecialNavbar) setupAutoHide(nestedSpecialNavbar);
    }
  }
});