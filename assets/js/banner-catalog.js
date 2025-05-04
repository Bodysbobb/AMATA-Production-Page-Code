/**
 * Unified Catalog Sliders JavaScript
 * Handles both banner sliders and client logo sliders with optimized performance
 */
(function() {
  'use strict';
  
  // Performance optimizations
  const supportsPassive = (function() {
    let result = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() { result = true; }
      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {}
    return result;
  })();
  
  const listenerOptions = supportsPassive ? { passive: true } : false;
  
  // Utility functions
  function debounce(func, wait = 200) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    initBannerSliders();
    initClientSliders();
  });

  // ======================================================
  // BANNER SLIDER IMPLEMENTATION
  // ======================================================
  function initBannerSliders() {
    const sliders = document.querySelectorAll('.banner-slider');
    if (!sliders.length) return;
    
    sliders.forEach(function(slider) {
      // Get slider parameters
      const interval = parseInt(slider.dataset.interval) || 5000;
      const speed = parseInt(slider.dataset.speed) || 500;
      const displayCount = parseInt(slider.dataset.display) || 1;
      const displayMax = parseInt(slider.dataset.displayMax) || displayCount;
      const displayMin = parseInt(slider.dataset.displayMin) || 1;
      
      // Set CSS variables for responsive display
      slider.style.setProperty('--display-count', displayCount);
      slider.style.setProperty('--display-max', displayMax);
      slider.style.setProperty('--display-min', displayMin);
      
      // Get slider elements based on mode
      const isSingleMode = (displayCount === 1 && displayMax === 1);
      const slidesContainer = isSingleMode ? 
        slider.querySelector('.banner-slides.single-mode') : 
        slider.querySelector('.banner-slides.multi-mode');
      
      if (!slidesContainer) return;
      
      // Get navigation elements
      const dots = slider.querySelectorAll('.banner-dot');
      const prevBtn = slider.querySelector('.banner-prev');
      const nextBtn = slider.querySelector('.banner-next');
      
      // Initialize state
      let currentIndex = 0;
      let timer;
      let isAnimating = false;
      let currentDisplayCount = displayCount;
      
      // Show navigation on hover
      slider.addEventListener('mouseenter', function() {
        if (prevBtn) prevBtn.classList.add('visible');
        if (nextBtn) nextBtn.classList.add('visible');
      });
      
      slider.addEventListener('mouseleave', function() {
        if (prevBtn) prevBtn.classList.remove('visible');
        if (nextBtn) nextBtn.classList.remove('visible');
      });
      
      // Single mode initialization
      if (isSingleMode) {
        const slides = Array.from(slidesContainer.querySelectorAll('.banner-slide'));
        if (slides.length <= 1) return; // No need for slider with one slide
        
        // Apply transition
        slides.forEach(slide => {
          slide.style.transition = `opacity ${speed}ms ease`;
        });
        
        // Start slideshow
        startSlideShow();
        
        // Set up navigation
        if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
        if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
        
        // Handle dot navigation
        dots.forEach((dot) => {
          dot.addEventListener('click', () => {
            const dotIndex = parseInt(dot.getAttribute('data-index'));
            if (!isNaN(dotIndex)) {
              goToSlide(dotIndex);
            }
          });
        });
        
        function goToSlide(index) {
          if (isAnimating || index < 0 || index >= slides.length) return;
          isAnimating = true;
          
          // Hide current slide
          slides[currentIndex].classList.remove('active');
          
          // Update all dots
          dots.forEach((dot) => {
            const dotIndex = parseInt(dot.getAttribute('data-index'));
            if (!isNaN(dotIndex)) {
              dot.classList.toggle('active', dotIndex === index);
              dot.setAttribute('aria-selected', dotIndex === index ? 'true' : 'false');
            }
          });
          
          // Show new slide
          currentIndex = index;
          slides[currentIndex].classList.add('active');
          
          // Reset animation state
          setTimeout(() => {
            isAnimating = false;
          }, speed);
          
          // Restart timer
          startSlideShow();
        }
        
        function goToNextSlide() {
          const nextIndex = (currentIndex + 1) % slides.length;
          goToSlide(nextIndex);
        }
        
        function goToPrevSlide() {
          const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
          goToSlide(prevIndex);
        }
      } 
      // Multi-mode initialization
      else {
        const track = slidesContainer.querySelector('.slides-track');
        const slides = Array.from(track.querySelectorAll('.banner-slide'));
        const totalSlides = slides.length;
        
        // Handle case where totalSlides <= displayCount
        let effectiveTotalSlides = totalSlides;
        
        // Clone slides for continuous looping if needed
        if (totalSlides > 1 && totalSlides <= displayCount) {
          slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
          });
          effectiveTotalSlides = totalSlides * 2;
        }
        
        // Calculate visible positions
        let numVisiblePositions = Math.max(1, effectiveTotalSlides - (currentDisplayCount - 1));
        
        // Apply transition speed
        track.style.transition = `transform ${speed}ms ease`;
        
        // Initialize slide width
        updateSlideDisplay();
        
        // Start slideshow if we have multiple positions
        if (numVisiblePositions > 1) {
          startSlideShow();
        }
        
        // Set up navigation
        if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
        if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
        
        // Handle dot navigation
        dots.forEach((dot) => {
          dot.addEventListener('click', () => {
            const dotIndex = parseInt(dot.getAttribute('data-index'));
            if (!isNaN(dotIndex) && dotIndex < numVisiblePositions) {
              goToSlide(dotIndex);
            }
          });
        });
        
        // Responsive adjustments
        const handleResize = debounce(() => {
          let newDisplayCount = displayCount;
          
          // Determine display count based on screen width
          if (window.innerWidth <= 576) {
            newDisplayCount = displayMin;
          } else if (window.innerWidth <= 768) {
            newDisplayCount = Math.min(displayMax, 2);
          } else if (window.innerWidth <= 992) {
            newDisplayCount = Math.min(displayMax, 3);
          } else {
            newDisplayCount = displayMax;
          }
          
          if (newDisplayCount !== currentDisplayCount) {
            currentDisplayCount = newDisplayCount;
            
            // Update CSS variable
            slider.style.setProperty('--display-count', currentDisplayCount);
            
            // Recalculate visible positions
            numVisiblePositions = Math.max(1, effectiveTotalSlides - (currentDisplayCount - 1));
            
            // Update slide display
            updateSlideDisplay();
            
            // Clamp current index if needed
            if (currentIndex >= numVisiblePositions) {
              currentIndex = numVisiblePositions - 1;
            }
            
            // Update track position and active dot
            updateTrackPosition();
            updateActiveDot();
          }
        }, 200);
        
        window.addEventListener('resize', handleResize, listenerOptions);
        handleResize(); // Initial check
        
        function updateSlideDisplay() {
          const allSlides = track.querySelectorAll('.banner-slide');
          allSlides.forEach(slide => {
            slide.style.flex = `0 0 calc(100% / ${currentDisplayCount})`;
            slide.style.minWidth = `calc(100% / ${currentDisplayCount})`;
          });
        }
        
        function updateActiveDot() {
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
            dot.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
            // Only show dots that correspond to visible positions
            dot.style.display = i < numVisiblePositions ? '' : 'none';
          });
        }
        
        function updateTrackPosition() {
          if (effectiveTotalSlides <= currentDisplayCount) {
            // Center the slides if there are fewer slides than the display count
            track.style.transform = 'translateX(0)';
          } else {
            const translateValue = (currentIndex * (100 / currentDisplayCount));
            track.style.transform = `translateX(-${translateValue}%)`;
          }
        }
        
        function goToSlide(index) {
          if (isAnimating || index === currentIndex || index < 0 || index >= numVisiblePositions) return;
          isAnimating = true;
          
          // Update current index and dots
          currentIndex = index;
          updateActiveDot();
          
          // Move track to new position
          updateTrackPosition();
          
          // Reset animation state
          setTimeout(() => {
            isAnimating = false;
          }, speed);
          
          // Restart timer
          startSlideShow();
        }
        
        function goToNextSlide() {
          const nextIndex = (currentIndex + 1) % numVisiblePositions;
          goToSlide(nextIndex);
        }
        
        function goToPrevSlide() {
          const prevIndex = (currentIndex - 1 + numVisiblePositions) % numVisiblePositions;
          goToSlide(prevIndex);
        }
      }
      
      // Start slideshow - works for both single and multi mode
      function startSlideShow() {
        if (timer) clearInterval(timer);
        
        // Only start timer if there are multiple slides/positions
        if ((isSingleMode && slidesContainer.querySelectorAll('.banner-slide').length > 1) || 
            (!isSingleMode && slidesContainer.querySelector('.slides-track').querySelectorAll('.banner-slide').length > currentDisplayCount)) {
          timer = setInterval(() => {
            if (!isAnimating) {
              if (isSingleMode) {
                const slides = slidesContainer.querySelectorAll('.banner-slide');
                const nextIndex = (currentIndex + 1) % slides.length;
                
                isAnimating = true;
                slides[currentIndex].classList.remove('active');
                
                // Update dots
                dots.forEach((dot, i) => {
                  dot.classList.toggle('active', i === nextIndex);
                  dot.setAttribute('aria-selected', i === nextIndex ? 'true' : 'false');
                });
                
                currentIndex = nextIndex;
                slides[currentIndex].classList.add('active');
                
                setTimeout(() => {
                  isAnimating = false;
                }, speed);
              } else {
                const track = slidesContainer.querySelector('.slides-track');
                const slides = track.querySelectorAll('.banner-slide');
                const numPositions = Math.max(1, slides.length - (currentDisplayCount - 1));
                
                const nextIndex = (currentIndex + 1) % numPositions;
                currentIndex = nextIndex;
                
                // Update dots
                updateActiveDot();
                
                // Move track
                updateTrackPosition();
              }
            }
          }, interval);
        }
      }
      
      // Pause slideshow when tab is not visible
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          if (timer) clearInterval(timer);
        } else {
          startSlideShow();
        }
      });
    });
  }

  // ======================================================
  // CLIENT LOGO SLIDER IMPLEMENTATION
  // ======================================================
  function initClientSliders() {
    const clientSliders = document.querySelectorAll('.clients-slider');
    if (!clientSliders.length) return;
    
    clientSliders.forEach(function(slider) {
      // Get slider parameters
      const speed = parseFloat(slider.dataset.speed) || 30;
      const items = parseInt(slider.dataset.items) || 5;
      const itemsMobile = parseInt(slider.dataset.itemsMobile) || 2;
      const pauseOnHover = slider.dataset.pause !== 'false';
      
      // Set CSS variables
      slider.style.setProperty('--items-to-show', items);
      slider.style.setProperty('--items-to-show-mobile', itemsMobile);
      
      const track = slider.querySelector('.clients-track');
      if (!track) return;
      
      const clientItems = track.querySelectorAll('.client-item');
      if (clientItems.length === 0) return;
      
      // State variables
      let position = 0;
      let animationId = null;
      let isPaused = false;
      let currentItemWidth = 100 / items;
      
      // Set initial item widths
      updateItemWidths();
      
      // Start animation with performance optimizations
      startAnimation();
      
      // Handle window resize
      window.addEventListener('resize', debounce(updateItemWidths, 200), listenerOptions);
      
      // Pause on hover if enabled
      if (pauseOnHover) {
        slider.addEventListener('mouseenter', () => {
          isPaused = true;
        }, listenerOptions);
        
        slider.addEventListener('mouseleave', () => {
          isPaused = false;
        }, listenerOptions);
      }
      
      // Function to update item widths based on screen size
      function updateItemWidths() {
        let currentItems = items;
        
        if (window.innerWidth <= 576) {
          currentItems = itemsMobile;
        }
        
        currentItemWidth = 100 / currentItems;
        
        // Apply new width to all items
        clientItems.forEach(item => {
          item.style.width = `${currentItemWidth}%`;
          item.style.flex = `0 0 ${currentItemWidth}%`;
        });
      }
      
      // Optimized animation function using requestAnimationFrame
      function animate() {
        if (!isPaused) {
          // Use smaller increments for smoother animation
          // Adjust the increment based on speed setting (smaller number = faster)
          position -= (0.05 * (30 / speed)); 
          
          // Reset position when a full item has scrolled off
          if (position <= -currentItemWidth) {
            position = 0;
            
            // DOM modification optimization: Only move first item when needed
            const firstItem = track.firstElementChild;
            if (firstItem) {
              // Use transforms instead of appendChild for better performance
              track.appendChild(firstItem);
            }
          }
          
          // Use transform for better performance than changing left/top
          track.style.transform = `translateX(${position}%)`;
        }
        
        // Continue animation loop
        animationId = requestAnimationFrame(animate);
      }
      
      function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(animate);
      }
      
      // Optimize for page visibility changes
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        } else if (!animationId) {
          startAnimation();
        }
      });
      
      // Clean up on page changes
      window.addEventListener('beforeunload', function() {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
      });
    });
  }
})();