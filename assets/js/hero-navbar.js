document.addEventListener('DOMContentLoaded', function() {
  // Only run on pages with a landing hero
  const heroSection = document.querySelector('.landing-hero');
  if (!heroSection) return;
  
  // Get the header container
  const headerContainer = document.getElementById('header-container');
  if (!headerContainer) return;
  
  // Function to handle navbar visibility based on scroll position
  function handleNavbarVisibility() {
    const scrollPosition = window.scrollY;
    const heroHeight = heroSection.offsetHeight;
    
    // Show navbar when scrolled past 70% of hero height
    if (scrollPosition > heroHeight * 0.7) {
      headerContainer.style.transform = 'translateY(0)';
      headerContainer.style.opacity = '1';
      headerContainer.style.pointerEvents = 'auto';
    } else {
      // Hide navbar when in hero section
      headerContainer.style.transform = 'translateY(-100%)';
      headerContainer.style.opacity = '0';
      headerContainer.style.pointerEvents = 'none';
    }
  }
  
  // Handle scroll events
  window.addEventListener('scroll', handleNavbarVisibility);
  
  // Initial call
  handleNavbarVisibility();
});