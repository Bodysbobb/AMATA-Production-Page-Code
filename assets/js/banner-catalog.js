document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.banner-slider');
  
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
    
    const dots = slider.querySelectorAll('.banner-dot');
    const prevBtn = slider.querySelector('.banner-prev');
    const nextBtn = slider.querySelector('.banner-next');
    
    let currentIndex = 0;
    let timer;
    let isAnimating = false;
    
    // Track current display count based on screen size
    let currentDisplayCount = displayCount;
    
    // Different handling based on display mode
    if (isSingleMode) {
      // Single picture display mode
      const slides = slidesContainer.querySelectorAll('.banner-slide');
      if (slides.length <= 1) return;
      
      // Apply transition speed
      slides.forEach(slide => {
        slide.style.transition = `opacity ${speed}ms ease`;
      });
      
      // Start slideshow
      startSlideShow();
      
      // Set up navigation
      if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
      if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
      
      // Handle dot navigation
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
      });
      
      function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Hide current slide
        slides[currentIndex].classList.remove('active');
        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
        
        // Show new slide
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        
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
    } else {
      // Multiple pictures display mode
      const track = slidesContainer.querySelector('.slides-track');
      const slides = track.querySelectorAll('.banner-slide');
      const totalSlides = parseInt(slidesContainer.dataset.total) || slides.length;
      
      // Calculate total positions (will update on resize)
      let totalPositions = Math.max(0, totalSlides - currentDisplayCount) + 1;
      
      // Apply transition speed
      track.style.transition = `transform ${speed}ms ease`;
      
      // Start slideshow if we have multiple positions
      if (totalPositions > 1) {
        startSlideShow();
      }
      
      // Set up navigation
      if (prevBtn) prevBtn.addEventListener('click', goToPrevSlide);
      if (nextBtn) nextBtn.addEventListener('click', goToNextSlide);
      
      // Handle dot navigation
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
      });
      
      // Handle window resize
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial check
      
      function handleResize() {
        // Get current CSS computed display count (affected by media queries)
        const computedStyle = getComputedStyle(slider);
        const newDisplayCount = parseInt(computedStyle.getPropertyValue('--display-count'));
        
        if (newDisplayCount !== currentDisplayCount) {
          currentDisplayCount = newDisplayCount;
          
          // Recalculate positions and update dots
          totalPositions = Math.max(0, totalSlides - currentDisplayCount) + 1;
          
          // Update slide display
          updateSlideDisplay();
          
          // Clamp current index if needed
          if (currentIndex >= totalPositions) {
            currentIndex = totalPositions - 1;
            track.style.transform = `translateX(-${currentIndex * (100 / currentDisplayCount)}%)`;
          }
          
          // Update active dot
          updateActiveDot();
        }
      }
      
      function updateSlideDisplay() {
        slides.forEach(slide => {
          slide.style.flex = `0 0 calc(100% / ${currentDisplayCount})`;
          slide.style.minWidth = `calc(100% / ${currentDisplayCount})`;
        });
      }
      
      function updateActiveDot() {
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
          
          // Hide extra dots that are no longer needed
          dot.style.display = i < totalPositions ? '' : 'none';
        });
      }
      
      function goToSlide(index) {
        if (isAnimating || index === currentIndex || index >= totalPositions) return;
        isAnimating = true;
        
        // Update dots
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
        
        // Move track to new position
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * (100 / currentDisplayCount)}%)`;
        
        // Reset animation state
        setTimeout(() => {
          isAnimating = false;
        }, speed);
        
        // Restart timer
        startSlideShow();
      }
      
      function goToNextSlide() {
        const nextIndex = (currentIndex + 1) % totalPositions;
        goToSlide(nextIndex);
      }
      
      function goToPrevSlide() {
        const prevIndex = (currentIndex - 1 + totalPositions) % totalPositions;
        goToSlide(prevIndex);
      }
    }
    
    // Common functions for both modes
    function startSlideShow() {
      if (timer) clearInterval(timer);
      
      // Only start timer if we have multiple slides/positions
      if ((isSingleMode && slides.length > 1) || 
          (!isSingleMode && totalPositions > 1)) {
        timer = setInterval(() => {
          if (!isAnimating) {
            goToNextSlide();
          }
        }, interval);
      }
    }
    
    // Pause on visibility change
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        if (timer) clearInterval(timer);
      } else {
        startSlideShow();
      }
    });
  });
});