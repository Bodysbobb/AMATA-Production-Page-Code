// Defer the execution until the page has fully loaded
window.addEventListener('load', function() {
  // Only initialize if contact containers exist on the page
  if (document.querySelector('.floating-contact-container')) {
    initContactButtons();
  }
});

function initContactButtons() {
  const contactContainers = document.querySelectorAll('.floating-contact-container');
  
  contactContainers.forEach(container => {
    const toggleButton = container.querySelector('.contact-toggle');
    const contactOptions = container.querySelector('.contact-options');
    const position = container.getAttribute('data-position') || 'right';
    
    // Set position attribute for CSS targeting
    container.setAttribute('data-position', position);
    
    // Apply animation classes based on data attributes
    const mainAnimation = container.getAttribute('data-main-animation');
    const waveAnimation = container.getAttribute('data-wave-animation');
    
    // Add the main button animation if enabled
    if (mainAnimation === 'true') {
      toggleButton.classList.add('with-animation');
    }
    
    // Get the SVG icon elements
    const commentIcon = toggleButton.querySelector('.fa-comment');
    const timesIcon = toggleButton.querySelector('.fa-times');
    
    // Toggle event with explicit icon handling
    toggleButton.addEventListener('click', function(e) {
      e.stopPropagation();
      contactOptions.classList.toggle('active');
      toggleButton.classList.toggle('active');
      
      // Explicitly toggle the display of icons
      if (toggleButton.classList.contains('active')) {
        commentIcon.style.display = 'none';
        timesIcon.style.display = 'block';
        
        // Add wave animation to all buttons immediately if enabled
        if (waveAnimation === 'true') {
          const contactButtons = container.querySelectorAll('.contact-button');
          contactButtons.forEach((button, index) => {
            button.classList.add('with-wave-animation');
            // Set staggered animation delays for the continuous wave effect
            button.style.animationDelay = (index * 0.2) + 's';
          });
        }
      } else {
        commentIcon.style.display = 'block';
        timesIcon.style.display = 'none';
        
        // Remove wave animations when closed
        if (waveAnimation === 'true') {
          const contactButtons = container.querySelectorAll('.contact-button');
          contactButtons.forEach(button => {
            button.classList.remove('with-wave-animation');
            button.style.animationDelay = '0s';
          });
        }
      }
      
      // Also toggle the container active state for z-index control
      container.classList.toggle('active');
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
        
        // Reset icon states
        const commentIcon = element.querySelector('.fa-comment');
        const timesIcon = element.querySelector('.fa-times');
        if (commentIcon && timesIcon) {
          commentIcon.style.display = 'block';
          timesIcon.style.display = 'none';
        }
      });
      
      activeContainers.forEach(element => {
        element.classList.remove('active');
        
        // Remove wave animations when closed
        const contactButtons = element.querySelectorAll('.contact-button');
        contactButtons.forEach(button => {
          button.classList.remove('with-wave-animation');
          button.style.animationDelay = '0s';
        });
      });
    }
  });
}