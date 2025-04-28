/**
 * Direct approach to intercept clicks on navbar logos and prevent navigation
 * Enhanced with elegant logo/navbar transitions + working configurable tooltips
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get navbar elements
  const defaultNavbar = document.getElementById('default-navbar');
  const specialNavbar = document.getElementById('special-navbar');
  
  if (!defaultNavbar || !specialNavbar) {
    return; // Exit if navbars not found
  }
  
  // IMPORTANT: DO NOT check localStorage here or change the default visibility
  // The initial state is already set in header.liquid
  
  // Function to get page-specific tooltip texts from data attributes
  const getTooltipTexts = function() {
    // Default tooltip texts (fallbacks)
    let defaultTooltipText = "Click to switch navbar style";
    let specialTooltipText = "Click to switch navbar style";
    
    // Check if body has data attributes for tooltip text
    const bodyElement = document.body;
    
    if (bodyElement.hasAttribute('data-default-tooltip')) {
      defaultTooltipText = bodyElement.getAttribute('data-default-tooltip');
    }
    
    if (bodyElement.hasAttribute('data-special-tooltip')) {
      specialTooltipText = bodyElement.getAttribute('data-special-tooltip');
    }
    
    return {
      default: defaultTooltipText,
      special: specialTooltipText
    };
  };
  
  // Get tooltip texts for this page
  const tooltipTexts = getTooltipTexts();
  
  // Add transition styles for both logos and navbar elements
  const style = document.createElement('style');
  style.textContent = `
    /* Navbar transition styles */
    #default-navbar, #special-navbar {
      transition: opacity 0.4s ease-in-out;
    }
    
    /* Logo transition styles with tooltip */
    .navbar-brand.logo, .navbar-brand.title {
      position: relative;
      cursor: pointer;
    }
    
    /* Logo image specific */
    .navbar-brand.logo img, .navbar-brand.title {
      transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    /* Hover effect for logos */
    .navbar-brand.logo:hover img, .navbar-brand.title:hover {
      transform: scale(1.08);
    }
    
    /* Base tooltip styles */
    .logo-tooltip {
      position: absolute;
      bottom: -36px; /* slightly further from icon */
      left: 50%;
      transform: translateX(-50%);
      background: rgba(24, 24, 24, 0.85);
      color: #fff;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 500;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      letter-spacing: 0.2px;
      backdrop-filter: blur(4px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity 0.2s ease-out, transform 0.2s ease-out;
      z-index: 1000;
    }

    /* Show tooltip on hover */
    .navbar-brand.logo:hover .logo-tooltip,
    .navbar-brand.title:hover .logo-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(2px); /* soft lift on hover */
    }

    /* Other navbar elements transitions */
    .navbar-nav .nav-item, .toggle-container, .dropdown-menu, .navbar-toggler {
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    
    /* Animation classes */
    .navbar-fade-out {
      opacity: 0 !important;
    }
    
    .logo-fade-out {
      opacity: 0 !important;
      transform: scale(0.8) rotate(-5deg) !important;
    }
    
    .navbar-fade-in {
      animation: navbarFadeIn 0.5s forwards;
    }
    
    .logo-fade-in {
      animation: logoFadeIn 0.5s forwards;
    }
    
    /* Define animations */
    @keyframes navbarFadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    @keyframes logoFadeIn {
      0% { opacity: 0; transform: scale(0.8) rotate(5deg); }
      50% { transform: scale(1.1); }
      100% { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    
    /* Additional animation for navbar elements */
    .nav-item-fade-in {
      animation: navItemFadeIn 0.6s forwards;
    }
    
    @keyframes navItemFadeIn {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  
  // Create and add tooltip elements to logos
  const addTooltipsToLogos = function() {
    // Add tooltips to special navbar logos
    const specialLogoElements = document.querySelectorAll('#special-navbar .navbar-brand.logo');
    specialLogoElements.forEach(function(logoElement) {
      const tooltip = document.createElement('span');
      tooltip.className = 'logo-tooltip';
      tooltip.textContent = tooltipTexts.special;
      logoElement.appendChild(tooltip);
    });
    
    // Add tooltips to default navbar logos
    const defaultLogoElements = document.querySelectorAll('#default-navbar .navbar-brand.title');
    defaultLogoElements.forEach(function(logoElement) {
      const tooltip = document.createElement('span');
      tooltip.className = 'logo-tooltip';
      tooltip.textContent = tooltipTexts.default;
      logoElement.appendChild(tooltip);
    });
  };
  
  // Add tooltips to all logo elements
  addTooltipsToLogos();
  
  // Function to animate entire navbar with staggered elements
  const animateNavbars = function(fromNavbar, toNavbar) {
    // Find logo elements
    const fromLogos = fromNavbar.querySelectorAll('.navbar-brand.logo img, .navbar-brand.title');
    const fromNavItems = fromNavbar.querySelectorAll('.navbar-nav .nav-item, .toggle-container');
    
    // First animate the 'from' navbar out
    fromNavbar.classList.add('navbar-fade-out');
    
    // Animate logos with special effect
    fromLogos.forEach(logo => {
      logo.classList.add('logo-fade-out');
    });
    
    // Animate nav items out with slight delay
    fromNavItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('navbar-fade-out');
      }, index * 30); // Staggered effect
    });
    
    // Original toggle logic - after fade out
    setTimeout(() => {
      // Toggle navbars directly - PRESERVED FROM ORIGINAL CODE
      if (fromNavbar.id === 'special-navbar') {
        defaultNavbar.style.display = 'block';
        specialNavbar.style.display = 'none';
      } else {
        specialNavbar.style.display = 'block';
        defaultNavbar.style.display = 'none';
      }
      
      // Now find the newly visible navbar elements and animate them in
      const visibleNavbar = fromNavbar.id === 'special-navbar' ? defaultNavbar : specialNavbar;
      const toLogos = visibleNavbar.querySelectorAll('.navbar-brand.logo img, .navbar-brand.title');
      const toNavItems = visibleNavbar.querySelectorAll('.navbar-nav .nav-item, .toggle-container');
      
      // Initially set everything invisible
      visibleNavbar.style.opacity = '0';
      
      toLogos.forEach(logo => {
        logo.style.opacity = '0';
      });
      
      toNavItems.forEach(item => {
        item.style.opacity = '0';
      });
      
      // Force reflow
      void visibleNavbar.offsetWidth;
      
      // Animate navbar in
      visibleNavbar.classList.add('navbar-fade-in');
      
      // Animate logos in with special effect
      toLogos.forEach(logo => {
        logo.classList.add('logo-fade-in');
      });
      
      // Animate nav items in with staggered delay
      toNavItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('nav-item-fade-in');
        }, 100 + (index * 40)); // Staggered effect with initial delay
      });
      
      // Clean up classes after animation completes
      setTimeout(() => {
        // Reset from navbar
        fromNavbar.classList.remove('navbar-fade-out');
        
        fromLogos.forEach(logo => {
          logo.classList.remove('logo-fade-out');
          logo.style.opacity = ''; // Reset to default
        });
        
        fromNavItems.forEach(item => {
          item.classList.remove('navbar-fade-out');
          item.style.opacity = ''; // Reset to default
        });
        
        // Reset to navbar
        visibleNavbar.classList.remove('navbar-fade-in');
        visibleNavbar.style.opacity = ''; // Reset to default
        
        toLogos.forEach(logo => {
          logo.classList.remove('logo-fade-in');
          logo.style.opacity = ''; // Reset to default
        });
        
        toNavItems.forEach(item => {
          item.classList.remove('nav-item-fade-in');
          item.style.opacity = ''; // Reset to default
        });
      }, 800); // Longer cleanup timeout to account for staggered animations
    }, 400);
  };
  
  // Get all special navbar logos
  const specialLogos = document.querySelectorAll('#special-navbar .navbar-brand.logo');
  specialLogos.forEach(function(logo) {
    // Store the original click handler logic
    const originalClickAction = function(e) {
      // Always stop the default link behavior
      e.preventDefault();
      e.stopPropagation();
      
      // Animate entire navbar
      animateNavbars(specialNavbar, defaultNavbar);
      
      // Save preference - PRESERVED FROM ORIGINAL CODE
      localStorage.setItem('special_navbar_preference', 'false');
      
      return false; // Extra protection against navigation
    };
    
    // Completely replace the click handler
    logo.onclick = originalClickAction;
  });
  
  // Get all default navbar brand elements
  const defaultLogos = document.querySelectorAll('#default-navbar .navbar-brand.title');
  defaultLogos.forEach(function(logo) {
    // Store the original click handler logic
    const originalClickAction = function(e) {
      // Always stop the default link behavior
      e.preventDefault();
      e.stopPropagation();
      
      // Animate entire navbar
      animateNavbars(defaultNavbar, specialNavbar);
      
      // Save preference - PRESERVED FROM ORIGINAL CODE
      localStorage.setItem('special_navbar_preference', 'true');
      
      return false; // Extra protection against navigation
    };
    
    // Completely replace the click handler
    logo.onclick = originalClickAction;
  });
});