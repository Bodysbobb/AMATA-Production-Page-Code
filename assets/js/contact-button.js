/**
 * Contact Button Component
 * Optimized for performance with deferred loading and LCP awareness
 */
(function() {
  // Register for deferred loading after main content
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerContactButtonInit);
  } else {
    registerContactButtonInit();
  }

  function registerContactButtonInit() {
    // Check if contact containers exist on the page
    if (document.querySelector('.floating-contact-container')) {
      // First initialize the basic functionality without animations
      setTimeout(initContactButtons, 0);
      
      // Then add animations after LCP is likely complete
      if ('PerformanceObserver' in window) {
        try {
          // Use LCP observer when available
          const lcpObserver = new PerformanceObserver((entryList) => {
            // Wait a bit after LCP to start animations
            setTimeout(initAnimations, 1000);
            lcpObserver.disconnect();
          });
          
          lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
          
          // Fallback if LCP doesn't fire within 3 seconds
          setTimeout(() => {
            initAnimations();
          }, 3000);
        } catch (e) {
          // Fallback for browsers without PerformanceObserver
          setTimeout(initAnimations, 2000);
        }
      } else {
        // Fallback for older browsers
        setTimeout(initAnimations, 2000);
      }
    }
  }

  function initContactButtons() {
    const contactContainers = document.querySelectorAll('.floating-contact-container');
    
    contactContainers.forEach(container => {
      const toggleButton = container.querySelector('.contact-toggle');
      const contactOptions = container.querySelector('.contact-options');
      const position = container.getAttribute('data-position') || 'right';
      
      // Set position attribute for CSS targeting
      container.setAttribute('data-position', position);
      
      const waveAnimation = container.getAttribute('data-wave-animation');
      
      // Toggle event handling
      toggleButton.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const isActive = toggleButton.classList.contains('active');
        
        // Toggle active states
        contactOptions.classList.toggle('active');
        toggleButton.classList.toggle('active');
        container.classList.toggle('active');
        
        // Update ARIA states
        toggleButton.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
        
        // Toggle accessibility for button links
        const focusableElements = contactOptions.querySelectorAll('a, button');
        
        if (!isActive) {
          // Opening the menu
          focusableElements.forEach(el => {
            el.setAttribute('tabindex', '0');
          });
          
          // Add wave animation to buttons if enabled
          if (waveAnimation === 'true') {
            const contactButtons = container.querySelectorAll('.contact-button');
            contactButtons.forEach((button, index) => {
              button.classList.add('with-wave-animation');
              button.style.animationDelay = (index * 0.2) + 's';
            });
          }
        } else {
          // Closing the menu
          focusableElements.forEach(el => {
            el.setAttribute('tabindex', '-1');
          });
          
          // Remove wave animations when closed
          if (waveAnimation === 'true') {
            const contactButtons = container.querySelectorAll('.contact-button');
            contactButtons.forEach(button => {
              button.classList.remove('with-wave-animation');
              button.style.animationDelay = '0s';
            });
          }
        }
      });
      
      // Initialize with buttons not focusable
      const initialFocusableElements = contactOptions.querySelectorAll('a, button');
      initialFocusableElements.forEach(el => {
        el.setAttribute('tabindex', '-1');
      });
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.floating-contact-container')) {
        const activeOptions = document.querySelectorAll('.contact-options.active');
        const activeToggles = document.querySelectorAll('.contact-toggle.active');
        const activeContainers = document.querySelectorAll('.floating-contact-container.active');
        
        activeOptions.forEach(element => {
          element.classList.remove('active');
        });
        
        activeToggles.forEach(element => {
          element.classList.remove('active');
          element.setAttribute('aria-expanded', 'false');
        });
        
        activeContainers.forEach(element => {
          element.classList.remove('active');
          
          // Remove wave animations when closed
          const contactButtons = element.querySelectorAll('.contact-button');
          contactButtons.forEach(button => {
            button.classList.remove('with-wave-animation');
            button.style.animationDelay = '0s';
          });
          
          // Reset tabindex for all focusable elements
          const focusableElements = element.querySelectorAll('a, button');
          focusableElements.forEach(el => {
            el.setAttribute('tabindex', '-1');
          });
        });
      }
    });
  }
  
  // Initialize animations separately after LCP is complete
  function initAnimations() {
    const contactContainers = document.querySelectorAll('.floating-contact-container');
    contactContainers.forEach(container => {
      if (container.getAttribute('data-main-animation') === 'true') {
        // Only add animations to containers that aren't active (showing the comment icon)
        if (!container.classList.contains('active')) {
          container.classList.add('animations-ready');
        }
      }
    });
  }
})();