/**
 * progress-bar.js
 * Simplified reading position indicator that:
 * - Works with navbar auto-hide settings
 * - Uses requestAnimationFrame for better performance
 * - Only initializes when needed
 * 
 * Based on original concept from CSS-Tricks by Pankaj Parashar
 * but significantly simplified and optimized
 */
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if progress bar element exists
  const progressBar = document.getElementById('progress');
  
  // Exit if progress bar doesn't exist or navbar has auto-hide enabled
  if (!progressBar || document.body.classList.contains('navbar-auto-hide')) {
    return;
  }
  
  // Initialize with short delay to account for page resources loading
  setTimeout(function() {
    initializeProgressBar();
  }, 50);
  
  // Function to initialize progress bar
  function initializeProgressBar() {
    // Check if browser supports <progress> element
    const supportsProgress = "max" in document.createElement("progress");
    
    // Position the progress bar correctly
    let navbarHeight = 0;
    const navbar = document.getElementById('navbar') || 
                  document.getElementById('navbar-special') || 
                  document.querySelector('.navbar');
    
    if (navbar) {
      navbarHeight = navbar.offsetHeight;
      progressBar.style.top = navbarHeight + 'px';
    }
    
    // Set initial values based on browser support
    if (supportsProgress) {
      setupProgressElement();
    } else {
      setupCSSProgressBar();
    }
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Initial update
    updateProgress();
  }
  
  // Function to handle scroll events with requestAnimationFrame
  let ticking = false;
  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  // Function to handle window resize
  function handleResize() {
    // Update max value for progress element
    if ("max" in document.createElement("progress")) {
      progressBar.setAttribute('max', getDistanceToScroll());
    }
    updateProgress();
  }
  
  // Function to update progress position
  function updateProgress() {
    const currentPosition = getCurrentScrollPosition();
    
    if ("max" in document.createElement("progress")) {
      // Update the progress element value
      progressBar.setAttribute('value', currentPosition);
    } else {
      // Update CSS width for older browsers
      const widthPercent = (currentPosition / getDistanceToScroll()) * 100;
      progressBar.style.width = widthPercent + '%';
    }
  }
  
  // Function to setup the progress element
  function setupProgressElement() {
    progressBar.setAttribute('max', getDistanceToScroll());
    progressBar.setAttribute('value', getCurrentScrollPosition());
  }
  
  // Function to setup CSS-based progress bar for older browsers
  function setupCSSProgressBar() {
    // Ensure the bar is visible but starts at 0%
    progressBar.style.width = '0%';
  }
  
  // Function to get current scroll position
  function getCurrentScrollPosition() {
    return window.scrollY || document.documentElement.scrollTop;
  }
  
  // Function to get the total scrollable distance
  function getDistanceToScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }
});