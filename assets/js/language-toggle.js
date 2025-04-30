document.addEventListener('DOMContentLoaded', function() {
  // Get language toggle buttons from both navbar types
  const langToggles = document.querySelectorAll('#navbar-language-toggle');
  
  if (langToggles.length === 0) return;
  
  // Create simple transition overlay
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
    
    /* Dark mode support */
    [data-theme='dark'] .language-transition-overlay,
    [data-theme-setting='dark'] .language-transition-overlay {
      background-color: var(--global-bg-color, #1e1e1e);
    }
  `;
  document.head.appendChild(style);
  
  // Create overlay for transition effect (only once)
  const overlay = document.createElement('div');
  overlay.className = 'language-transition-overlay';
  document.body.appendChild(overlay);
  
  // Save current state before transition
  function saveCurrentState() {
    // Store current theme setting
    const currentState = {
      theme: localStorage.getItem('theme') || 'system',
      scrollTop: window.pageYOffset || document.documentElement.scrollTop
    };
    
    // Store in sessionStorage for persistence between pages
    sessionStorage.setItem('languageTransitionState', JSON.stringify(currentState));
    
    return currentState;
  }
  
  // Handle landing on a different language page
  function handlePageLoad() {
    // Check if this is a language transition
    const urlParams = new URLSearchParams(window.location.search);
    const isTransition = urlParams.get('_lang_transition') === 'true';
    
    if (isTransition) {
      // Remove the transition parameter from URL
      const cleanUrl = window.location.href
        .replace(/[?&]_lang_transition=true/, '')
        .replace(/\?$/, '');
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Restore saved state
      restoreState();
    }
  }
  
  // Restore state from localStorage
  function restoreState() {
    try {
      const storedState = localStorage.getItem('languageTransitionState');
      if (!storedState) return;
      
      const state = JSON.parse(storedState);
      
      // Restore theme
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
      
      // Restore scroll position
      if (state.scrollTop) {
        window.scrollTo(0, state.scrollTop);
      }
      
      // Clean up
      localStorage.removeItem('languageTransitionState');
    } catch (error) {
      console.error('Error restoring state:', error);
    }
  }
  
  // Setup each language toggle button
  langToggles.forEach(function(langToggle) {
    // Extract the target URL from onclick attribute
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
      
      // Save current state
      saveCurrentState();
      
      // Add transition parameter to URL
      const separator = targetUrl.includes('?') ? '&' : '?';
      const transitionUrl = targetUrl + separator + '_lang_transition=true';
      
      // Start transition animation
      overlay.classList.add('fade-in');
      
      // Navigate after animation completes
      setTimeout(function() {
        window.location.href = transitionUrl;
      }, 400);
      
      return false;
    };
  });
  
  // Handle page load
  handlePageLoad();
});