document.addEventListener('DOMContentLoaded', function() {
  // Check if page transitions are enabled globally or for this page
  const transitionsEnabled = (function() {
    // Look for data attribute that would be set by Jekyll
    if (document.body.hasAttribute('data-page-transition')) {
      return true;
    }
    
    // Check if there's a meta tag indicating site-wide setting
    const metaTransition = document.querySelector('meta[name="page-transition"]');
    if (metaTransition && metaTransition.getAttribute('content') === 'true') {
      return true;
    }
    
    // Default to disabled if no configuration found
    return false;
  })();
  
  // Exit if transitions are not enabled
  if (!transitionsEnabled) {
    return;
  }
  
  // Create overlay for page transitions
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);
  
  // Add styles for the transition
  const style = document.createElement('style');
  style.textContent = `
    /* Page transition styles */
    .page-transition-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--global-bg-color, #fff);
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s ease;
      pointer-events: none;
      will-change: opacity, visibility;
    }
    
    .page-transition-overlay.visible {
      opacity: 1;
      visibility: visible;
      pointer-events: all;
    }
    
    /* Theme support */
    [data-theme='dark'] .page-transition-overlay,
    [data-theme-setting='dark'] .page-transition-overlay {
      background-color: var(--global-bg-color, #1e1e1e);
    }
    
    /* Proper page entry animation */
    body.page-entering {
      animation: fadeIn 0.5s forwards;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Special tooltip for language button specifically */
    #navbar-language-toggle {
      position: relative;
    }
    
    #navbar-language-toggle::after {
      content: "Switch language";
      position: absolute;
      bottom: -30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 1000;
      pointer-events: none;
    }
    
    #navbar-language-toggle:hover::after {
      opacity: 1;
      visibility: visible;
    }
    
    /* Dark mode tooltip support */
    [data-theme='dark'] #navbar-language-toggle::after,
    [data-theme-setting='dark'] #navbar-language-toggle::after {
      background-color: rgba(50, 50, 50, 0.95);
    }
  `;
  document.head.appendChild(style);
  
  // State preservation system - save the current navbar state
  function saveCurrentState() {
    // Get current navbar preference
    const navbarState = {
      // Get navbar preference (which navbar is currently shown)
      navbarPreference: localStorage.getItem('special_navbar_preference'),
      
      // Get theme state
      themePreference: localStorage.getItem('theme') || 'system',
      
      // Any other state you want to preserve
      scrollPosition: window.scrollY
    };
    
    // Save it to sessionStorage for the next page
    sessionStorage.setItem('preservedState', JSON.stringify(navbarState));
    
    return navbarState;
  }
  
  // Apply preserved state if available
  function applyPreservedState() {
    const preservedStateJson = sessionStorage.getItem('preservedState');
    if (!preservedStateJson) return;
    
    try {
      const preservedState = JSON.parse(preservedStateJson);
      
      // Apply navbar preference if it's a toggle-enabled page
      if (document.body.hasAttribute('data-switch-navbar') && preservedState.navbarPreference) {
        // This should apply before the page is visible
        localStorage.setItem('special_navbar_preference', preservedState.navbarPreference);
      }
      
      // Apply theme preference
      if (preservedState.themePreference) {
        localStorage.setItem('theme', preservedState.themePreference);
      }
      
      // Clear preserved state after applying
      sessionStorage.removeItem('preservedState');
    } catch (e) {
      console.error('Error applying preserved state:', e);
    }
  }
  
  // Apply state when page loads
  applyPreservedState();
  
  // Helper function to get domain
  function getDomainFromUrl(url) {
    const a = document.createElement('a');
    a.href = url;
    return a.hostname;
  }
  
  // Check if a URL is internal
  function isInternalLink(url) {
    if (!url) return false;
    if (url.startsWith('#')) return false; // Skip anchor links
    if (url.startsWith('mailto:') || url.startsWith('tel:')) return false;
    
    const currentDomain = window.location.hostname;
    const linkDomain = getDomainFromUrl(url);
    
    return linkDomain === currentDomain || linkDomain === '';
  }
  
  // Handle incoming page transitions
  function handlePageEntrance() {
    // Check if we're coming from another page on this site
    if (sessionStorage.getItem('pageIsTransitioning') === 'true') {
      sessionStorage.removeItem('pageIsTransitioning');
      
      // Hide content until animation is done
      document.body.style.opacity = '0';
      
      // After a tiny delay for the zero opacity to take effect
      setTimeout(function() {
        document.body.classList.add('page-entering');
        document.body.style.opacity = '1';
        
        // Remove class after animation completes
        setTimeout(function() {
          document.body.classList.remove('page-entering');
        }, 500);
      }, 10);
    }
  }
  
  // Handle outgoing page transitions
  function handlePageExit(event, url) {
    // Save the current state for the next page
    saveCurrentState();
    
    // Set flag for next page
    sessionStorage.setItem('pageIsTransitioning', 'true');
    
    // Show overlay
    overlay.classList.add('visible');
    
    // After animation completes, navigate to the new page
    setTimeout(function() {
      window.location.href = url;
    }, 400);
  }
  
  // Special handling for language switcher
  function setupLanguageSwitcher() {
    const langToggle = document.getElementById('navbar-language-toggle');
    if (!langToggle) return;
    
    // Store original onclick attribute content
    const originalOnclick = langToggle.getAttribute('onclick');
    
    // Extract URL from onclick attribute
    const urlMatch = originalOnclick ? originalOnclick.match(/window\.location\.href=['"](.*)['"]/i) : null;
    const targetUrl = urlMatch ? urlMatch[1] : null;
    
    if (!targetUrl) return;
    
    // Replace the onclick handler
    langToggle.onclick = function(e) {
      e.preventDefault();
      
      // Save state and trigger transition
      handlePageExit(e, targetUrl);
      
      return false;
    };
  }
  
  // Add click handlers to all internal links
  function setupLinkHandlers() {
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Only add transition to internal links
      if (isInternalLink(href)) {
        link.addEventListener('click', function(e) {
          // Skip if modified click (new tab, etc)
          if (e.ctrlKey || e.metaKey || e.shiftKey) return;
          
          e.preventDefault();
          handlePageExit(e, href);
        });
      }
    });
    
    // Handle language switcher specifically
    setupLanguageSwitcher();
  }
  
  // Run entrance animation if needed
  handlePageEntrance();
  
  // Set up handlers for all internal links
  setupLinkHandlers();
  
  // Run again after any AJAX content loads (optional, for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        // Check if any of the added nodes are links or contain links
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'A') {
              // If the node itself is a link
              const href = node.getAttribute('href');
              if (isInternalLink(href)) {
                node.addEventListener('click', function(e) {
                  if (e.ctrlKey || e.metaKey || e.shiftKey) return;
                  e.preventDefault();
                  handlePageExit(e, href);
                });
              }
            } else {
              // If the node might contain links
              const links = node.querySelectorAll('a');
              links.forEach(link => {
                const href = link.getAttribute('href');
                if (isInternalLink(href)) {
                  link.addEventListener('click', function(e) {
                    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
                    e.preventDefault();
                    handlePageExit(e, href);
                  });
                }
              });
            }
          }
        }
      }
    });
  });
  
  // Observe the entire document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});