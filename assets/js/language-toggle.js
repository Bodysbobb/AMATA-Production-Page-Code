document.addEventListener('DOMContentLoaded', function() {
  // Get language toggle buttons from both navbar types
  const langToggles = document.querySelectorAll('#navbar-language-toggle');
  
  if (langToggles.length > 0) {
    // Add transition styles
    const style = document.createElement('style');
      style.textContent = `
      .language-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--global-bg-color, #fff);
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
        transition: opacity 0.5s ease;
      }
      
      .language-transition-overlay.fade-in {
        opacity: 1;
        pointer-events: all;
      }
      
      /* Triangle loader container */
      .triangle-loader-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
      }
      
      /* Overlay styling - simple transition */
      .language-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--global-bg-color, #fff);
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
        transition: opacity 0.5s ease;
      }
      
      /* Enhanced toggle animation */
      .language-btn-navbar .toggle-indicator {
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      }
      
      /* Animate toggle before page transition */
      .language-btn-navbar.en.animating-to-alt .toggle-indicator {
        transform: translateX(43px) !important;
      }
      
      .language-btn-navbar.alt-lang.animating-to-en .toggle-indicator {
        transform: translateX(3px) !important;
      }
      `;    
    document.head.appendChild(style);
    
    // Create overlay for transition effect (only once)
    const overlay = document.createElement('div');
    overlay.className = 'language-transition-overlay';
    document.body.appendChild(overlay);
    
    // Save current state before transition
    function saveCurrentState() {
      // Check which navbar is currently visible
      let specialNavbarActive = false;
      
      // Special navbar is active if it exists and is not hidden - check visibility in multiple ways
      const specialNavbar = document.getElementById('special-navbar');
      const defaultNavbar = document.getElementById('default-navbar');
      
      if (specialNavbar && defaultNavbar) {
        // First, check if special navbar is visible via CSS display property
        if (getComputedStyle(specialNavbar).display !== 'none') {
          specialNavbarActive = true;
        }
        // Also check if default navbar is hidden - this is another way to confirm
        else if (getComputedStyle(defaultNavbar).display === 'none') {
          specialNavbarActive = true;
        }
      }
      
      // Calculate scroll position as percentage and pixels
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
      
      // Save all important state information
      const currentState = {
        theme: localStorage.getItem('theme') || 'system',
        navbarType: specialNavbarActive ? 'true' : 'false',
        sourceLang: document.documentElement.lang || 'en',
        scrollTop: scrollTop,
        scrollPercentage: scrollPercentage
      };
      
      // Store the state in localStorage for reliable persistence
      localStorage.setItem('languageTransitionState', JSON.stringify(currentState));
    }
    
    // Handle each language toggle button
    langToggles.forEach(function(langToggle) {
      // Extract the target URL
      let targetUrl = '';
      const onclickAttr = langToggle.getAttribute('onclick');
      if (onclickAttr) {
        const match = onclickAttr.match(/window\.location\.href=\'([^\']+)\'/);
        if (match && match[1]) {
          targetUrl = match[1];
        }
      }
      
      // Don't proceed if we couldn't extract a URL
      if (!targetUrl) return;
      
      // Override the click behavior
      langToggle.onclick = function(e) {
        e.preventDefault();
        
        // Prevent multiple clicks
        if (langToggle.classList.contains('animating-to-en') || 
            langToggle.classList.contains('animating-to-alt')) {
          return false;
        }
        
        // Save current state
        saveCurrentState();
        
        // Add transition parameter to URL to indicate this is a language switch
        const separator = targetUrl.includes('?') ? '&' : '?';
        const transitionUrl = targetUrl + separator + '_lang_transition=true';
        
        // Add animation class based on current state
        if (langToggle.classList.contains('en')) {
          langToggle.classList.add('animating-to-alt');
        } else {
          langToggle.classList.add('animating-to-en');
        }
        
        // After toggle animation, start page transition
        setTimeout(function() {
          overlay.classList.add('fade-in');
          
          // After fade completes, navigate to the new URL
          setTimeout(function() {
            window.location.href = transitionUrl;
          }, 400);
        }, 300); // Wait for toggle animation
        
        return false;
      };
    });
    
    // Process transition on page load
    function handlePageLoad() {
      // Check if this is a language transition
      const urlParams = new URLSearchParams(window.location.search);
      const isTransition = urlParams.get('_lang_transition') === 'true';
      
      if (isTransition) {
        // Remove the transition parameter immediately
        const cleanUrl = window.location.href
          .replace(/[?&]_lang_transition=true/, '')
          .replace(/\?$/, '');
        window.history.replaceState({}, document.title, cleanUrl);
        
        // Process state restoration
        restoreState();
      }
    }
    
    // Restore state from localStorage
    function restoreState() {
      try {
        const storedState = localStorage.getItem('languageTransitionState');
        if (!storedState) return;
        
        const state = JSON.parse(storedState);
        
        // Restore theme if it exists
        if (state.theme) {
          localStorage.setItem('theme', state.theme);
          document.documentElement.setAttribute('data-theme-setting', state.theme);
          
          if (state.theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
          } else {
            document.documentElement.setAttribute('data-theme', state.theme);
          }
          
          // Update theme icons if they exist
          const systemIcon = document.querySelector('#light-toggle-system');
          const darkIcon = document.querySelector('#light-toggle-dark');
          const lightIcon = document.querySelector('#light-toggle-light');
          
          if (systemIcon && darkIcon && lightIcon) {
            systemIcon.style.display = state.theme === 'system' ? 'block' : 'none';
            darkIcon.style.display = state.theme === 'dark' ? 'block' : 'none';
            lightIcon.style.display = state.theme === 'light' ? 'block' : 'none';
          }
        }
        
        // Restore navbar type
        if (typeof state.navbarType !== 'undefined') {
          localStorage.setItem('special_navbar_preference', state.navbarType);
          
          const defaultNavbar = document.getElementById('default-navbar');
          const specialNavbar = document.getElementById('special-navbar');
          
          if (defaultNavbar && specialNavbar) {
            // Set the main body attribute
            document.body.setAttribute('data-special-navbar', state.navbarType === 'true' ? 'true' : 'false');
            
            // Set navbar visibility
            if (state.navbarType === 'true') {
              defaultNavbar.style.display = 'none';
              specialNavbar.style.display = 'block';
            } else {
              defaultNavbar.style.display = 'block';
              specialNavbar.style.display = 'none';
            }
          }
        }
        
        // Use requestAnimationFrame for more reliable scroll restoration
        requestAnimationFrame(function() {
          restoreScrollPosition(state);
        });
        
        // Clear transition state
        localStorage.removeItem('languageTransitionState');
      } catch (error) {
        console.error('Error restoring state:', error);
      }
    }
    
    // Dedicated function for scroll position restoration
    function restoreScrollPosition(state) {
      if (!state) return;
      
      // First attempt - use the most reliable method (after a delay)
      setTimeout(function() {
        // Try multiple scroll methods for maximum compatibility
        if (state.scrollTop) {
          // Method 1: Direct property
          document.documentElement.scrollTop = state.scrollTop;
          document.body.scrollTop = state.scrollTop; // For Safari
          
          // Method 2: Window scrollTo
          window.scrollTo(0, state.scrollTop);
        } 
        else if (state.scrollPercentage) {
          const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const targetPosition = scrollHeight * state.scrollPercentage;
          
          // Method 1: Direct property
          document.documentElement.scrollTop = targetPosition;
          document.body.scrollTop = targetPosition; // For Safari
          
          // Method 2: Window scrollTo
          window.scrollTo(0, targetPosition);
        }
        
        // Try again after images and other resources have likely loaded
        setTimeout(function() {
          if (state.scrollTop) {
            window.scrollTo(0, state.scrollTop);
          } else if (state.scrollPercentage) {
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            window.scrollTo(0, scrollHeight * state.scrollPercentage);
          }
        }, 500);
      }, 100);
    }
    
    // Run page load handler
    handlePageLoad();
  }
});