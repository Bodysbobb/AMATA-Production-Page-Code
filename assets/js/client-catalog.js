/**
 * Continuous Clients Slider
 * Lightweight auto-scrolling carousel for client logos
 */

document.addEventListener('DOMContentLoaded', function() {
  const clientSliders = document.querySelectorAll('.clients-slider');
  if (!clientSliders.length) return;
  
  clientSliders.forEach(function(slider) {
    // Get slider parameters
    const speed = parseInt(slider.dataset.speed) || 30;
    const items = parseInt(slider.dataset.items) || 5;
    const itemsMobile = parseInt(slider.dataset.itemsMobile) || 2;
    const pauseOnHover = slider.dataset.pause !== 'false';
    
    // Set CSS variables
    slider.style.setProperty('--items-to-show', items);
    slider.style.setProperty('--items-to-show-mobile', itemsMobile);
    
    const track = slider.querySelector('.clients-track');
    if (!track) return;
    
    const clientItems = track.querySelectorAll('.client-item');
    
    // Initialize
    let position = 0;
    let animationId = null;
    let isPaused = false;
    
    // Set initial item widths
    updateItemWidths();
    
    // Start animation using requestAnimationFrame for better performance
    startAnimation();
    
    // Handle window resize events with debouncing
    window.addEventListener('resize', CatalogUtils.debounce(updateItemWidths, 200));
    
    // Pause on hover if enabled
    if (pauseOnHover) {
      slider.addEventListener('mouseenter', function() {
        isPaused = true;
      });
      
      slider.addEventListener('mouseleave', function() {
        isPaused = false;
      });
    }
    
    // Use shared Observer utility to pause when not visible
    const observer = CatalogUtils.createVisibilityObserver(
      slider,
      () => { // onVisible
        if (!animationId) startAnimation();
      },
      () => { // onHidden
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    );
    
    // Function to update item widths based on screen size
    function updateItemWidths() {
      const currentItems = CatalogUtils.getResponsiveValue(
        itemsMobile,
        itemsMobile,
        Math.min(items, 4),
        items
      );
      
      slider.style.setProperty('--items-to-show', currentItems);
      
      clientItems.forEach(item => {
        item.style.width = `${100 / currentItems}%`;
      });
    }

    // Animation function using requestAnimationFrame
    function animate() {
      if (!isPaused) {
        position -= 0.05;
        
        // Reset position when a full item has scrolled
        if (position <= -100 / items) {
          position = 0;
          // Move first item to the end
          track.appendChild(track.firstElementChild);
        }
        
        track.style.transform = `translateX(${position}%)`;
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    function startAnimation() {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(animate);
    }
    
    // Clean up on page changes
    window.addEventListener('beforeunload', function() {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      if (observer) {
        observer.disconnect();
      }
    });
  });
});