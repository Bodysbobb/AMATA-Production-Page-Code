/**
 * Optimized Product Catalog
 * Handles product grid display, filtering, lightbox, and image protection
 * Performance optimized for large collections of images
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get catalog container
  const catalogContainer = document.querySelector('.product-catalog');
  if (!catalogContainer) return;
  
  // ============ PERFORMANCE OPTIMIZATIONS ============
  
  // Use passive event listeners where possible for better scrolling performance
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
  
  // Optimize image loading with IntersectionObserver
  const imageObserver = 'IntersectionObserver' in window ? new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Only deal with images that have data-src
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    }, 
    {
      rootMargin: '50px 0px', // Start loading a bit before they come into view
      threshold: 0.01 // Trigger when just a small part is visible
    }
  ) : null;
  
  // Batch DOM operations for better performance
  function batchDOM(callback) {
    // Use requestAnimationFrame for better performance
    return window.requestAnimationFrame 
      ? window.requestAnimationFrame(callback) 
      : setTimeout(callback, 0);
  }
  
  // Debounce function to limit rapid function calls
  function debounce(func, wait = 200) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  
  // ============ INITIALIZATION ============
  
  // Apply global settings from data attributes
  applyAspectRatio();
  applyImagesPerRow();
  
  // Get customizable labels
  const textLabels = {
    copyButton: catalogContainer.dataset.copyButtonLabel || 'Copy URL',
    copyButtonFinal: catalogContainer.dataset.copyButtonLabelFinalstate || 'URL Copied!',
    copyMessage: catalogContainer.dataset.copyMessageLabel || 'Copy image URL:',
    selectedFilters: catalogContainer.dataset.selectedFiltersLabel || 'Selected Filters',
    clearAll: catalogContainer.dataset.clearAllLabel || 'Clear All',
    noFilters: catalogContainer.dataset.noFiltersLabel || 'No filters selected',
    middleLabel: catalogContainer.dataset.middleLabelText || 'ส่งลิงก์ผ่าน LINE ได้เลย!'
  };
  
  // Get feature settings
  const featureSettings = {
    allowImageSave: catalogContainer.dataset.allowImageSave === 'true',
    showCopyUrl: !(catalogContainer.dataset.showCopyUrl === 'false'),
    lineAccount: catalogContainer.dataset.lineAccount || '',
    hasGlobalSizeGuide: catalogContainer.dataset.sizeGuide === 'true',
    globalSizeContent: catalogContainer.dataset.sizeContent || '',
    globalSizePicture: catalogContainer.dataset.sizePicture || ''
  };
  
  // Optimize image loading
  initLazyLoading();
  
  // ============ FILTER FUNCTIONALITY ============
  
  // Get filter elements
  const filterTags = document.querySelectorAll('.filter-tag, .dropdown-filter-tag');
  const productItems = document.querySelectorAll('.product-item');
  const selectedFiltersList = document.querySelector('.selected-filters-list');
  const clearAllButton = document.querySelector('.clear-all-filters');
  const filterButton = document.querySelector('.filter-sort-button');
  const filterDropdown = document.querySelector('.filter-dropdown');
  
  // Store active filters
  let activeFilters = [];
  
  // Set the Selected Filters heading text
  const selectedFiltersHeading = document.querySelector('.selected-filters h4');
  if (selectedFiltersHeading) {
    selectedFiltersHeading.textContent = textLabels.selectedFilters;
  }
  
  // Update clear all button text
  if (clearAllButton) {
    clearAllButton.textContent = textLabels.clearAll;
  }
  
  // Toggle category dropdowns
  initCategoryToggles();
  
  // Initialize filter dropdown toggle
  initFilterDropdown();
  
  // Add event listeners to filter tags
  initFilterListeners();
  
  // Initialize selected filters display
  updateSelectedFilters();
  
  // ============ LIGHTBOX FUNCTIONALITY ============
  
  // Get product links
  const productLinks = document.querySelectorAll('.product-link');
  let allProducts = Array.from(productLinks);
  let currentProductIndex = 0;
  
  // Set up lightbox triggers
  initLightboxTriggers();
  
  // Auto-open lightbox from URL
  autoOpenFromURL();
  
  // ============ PROTECT IMAGES IF NEEDED ============
  
  if (!featureSettings.allowImageSave) {
    protectGalleryImages();
  }
  
  // ============ FUNCTION IMPLEMENTATIONS ============
  
  // Initialize lazy loading for images
  function initLazyLoading() {
    if (!imageObserver) return; // Skip if IntersectionObserver not supported
    
    const productImages = document.querySelectorAll('.product-image img[data-src]');
    productImages.forEach(img => {
      // Add loading class for styling
      img.classList.add('loading');
      
      // Add placeholder if needed (technique to reduce layout shifts)
      if (!img.width || !img.height) {
        // Set placeholder dimensions from aspect ratio
        const aspectRatio = catalogContainer.dataset.imageAspectRatio;
        if (aspectRatio) {
          const [width, height] = aspectRatio.split('/').map(n => parseFloat(n.trim()));
          if (width && height) {
            img.style.aspectRatio = `${width} / ${height}`;
          }
        }
      }
      
      // Start observing
      imageObserver.observe(img);
    });
  }
  
  // Apply aspect ratio from theme or data attribute
  function applyAspectRatio() {
    const productImages = document.querySelectorAll('.product-image');
    let aspectRatio;
    
    // First check for data attribute
    if (catalogContainer.dataset.imageAspectRatio) {
      aspectRatio = catalogContainer.dataset.imageAspectRatio;
    } 
    // Then fallback to CSS variable if it exists
    else {
      const computedStyle = getComputedStyle(catalogContainer);
      aspectRatio = computedStyle.getPropertyValue('--image-aspect-ratio').trim();
    }
    
    if (aspectRatio) {
      // Set the CSS custom property for use in stylesheets
      catalogContainer.style.setProperty('--image-aspect-ratio', aspectRatio);
      
      // Also apply directly to images for older browsers
      productImages.forEach(image => {
        image.style.aspectRatio = aspectRatio;
      });
    }
  }
  
  // Apply images per row from theme or data attributes
  function applyImagesPerRow() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    // Check for max images per row
    let imagesPerRowMax;
    if (catalogContainer.dataset.imagesPerRowMax) {
      imagesPerRowMax = catalogContainer.dataset.imagesPerRowMax;
      catalogContainer.style.setProperty('--images-per-row-max', imagesPerRowMax);
    }
    
    // Check for min images per row
    let imagesPerRowMin;
    if (catalogContainer.dataset.imagesPerRowMin) {
      imagesPerRowMin = catalogContainer.dataset.imagesPerRowMin;
      catalogContainer.style.setProperty('--images-per-row-min', imagesPerRowMin);
    }
    
    // For backward compatibility - still support the original parameter
    let imagesPerRow;
    if (catalogContainer.dataset.imagesPerRow) {
      imagesPerRow = catalogContainer.dataset.imagesPerRow;
      catalogContainer.style.setProperty('--images-per-row', imagesPerRow);
    } 
    // Fallback to CSS variable if it exists
    else {
      const computedStyle = getComputedStyle(catalogContainer);
      imagesPerRow = computedStyle.getPropertyValue('--images-per-row').trim();
      
      if (imagesPerRow) {
        catalogContainer.style.setProperty('--images-per-row', imagesPerRow);
      }
    }
    
    // Set the current number of images per row based on screen size
    function updateResponsiveGrid() {
      let currentImagesPerRow = imagesPerRowMax || imagesPerRow || 4;
      
      if (window.innerWidth <= 576) {
        currentImagesPerRow = imagesPerRowMin || 1;
      } else if (window.innerWidth <= 768) {
        currentImagesPerRow = imagesPerRowMin || 2;
      } else if (window.innerWidth <= 992) {
        currentImagesPerRow = Math.min(imagesPerRowMax || 4, 3);
      } else if (window.innerWidth <= 1200) {
        currentImagesPerRow = Math.min(imagesPerRowMax || 4, 3);
      } else {
        currentImagesPerRow = imagesPerRowMax || imagesPerRow || 4;
      }
      
      // Apply the current images per row
      catalogContainer.style.setProperty('--images-per-row', currentImagesPerRow);
      
      // Apply directly for older browsers
      if (currentImagesPerRow) {
        productGrid.style.gridTemplateColumns = `repeat(${currentImagesPerRow}, 1fr)`;
      }
    }
    
    // Initial call
    updateResponsiveGrid();
    
    // Debounced resize handler for better performance
    window.addEventListener('resize', debounce(updateResponsiveGrid, 200), listenerOptions);
  }
  
  // Initialize category toggles
  function initCategoryToggles() {
    const categoryHeaders = document.querySelectorAll('.category-header');
    categoryHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const filters = this.nextElementSibling;
        const arrow = this.querySelector('.arrow-icon');
        
        filters.classList.toggle('hidden');
        arrow.classList.toggle('rotated');
      });
    });
  }
  
  // Initialize filter dropdown toggle
  function initFilterDropdown() {
    if (filterButton && filterDropdown) {
      filterButton.addEventListener('click', function() {
        filterDropdown.classList.toggle('active');
        this.classList.toggle('active');
      });
      
      // Close dropdown when clicking outside (with event delegation)
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-sort') && filterDropdown.classList.contains('active')) {
          filterDropdown.classList.remove('active');
          filterButton.classList.remove('active');
        }
      });
    }
  }
  
  // Initialize filter tag listeners
  function initFilterListeners() {
    // Use event delegation for better performance
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // Handle filter tags
      if (target.matches('.filter-tag, .dropdown-filter-tag')) {
        e.preventDefault();
        const filter = target.getAttribute('data-filter');
        
        // For top filters, toggle single filter
        if (target.classList.contains('filter-tag')) {
          if (filter === 'all') {
            activeFilters = [];
          } else if (activeFilters.includes(filter)) {
            removeFilter(filter);
          } else {
            addFilter(filter);
          }
        } else {
          // For dropdown filters, add to multiple selection
          addFilter(filter);
        }
        
        updateSelectedFilters();
        applyFilters();
      }
      
      // Handle filter badge removal
      else if (target.classList.contains('remove-filter')) {
        const filterBadge = target.closest('.filter-badge');
        if (filterBadge) {
          const filter = filterBadge.dataset.filter;
          removeFilter(filter);
          updateSelectedFilters();
          applyFilters();
        }
      }
    });
    
    // Clear all filters
    if (clearAllButton) {
      clearAllButton.addEventListener('click', function() {
        activeFilters = [];
        updateSelectedFilters();
        applyFilters();
      });
    }
  }
  
  // Add a filter
  function addFilter(filter) {
    if (filter === 'all') {
      // Clear all filters and show all products
      activeFilters = [];
      updateSelectedFilters();
      applyFilters();
      return;
    }
    
    if (!activeFilters.includes(filter)) {
      activeFilters.push(filter);
    }
  }
  
  // Remove a filter
  function removeFilter(filter) {
    activeFilters = activeFilters.filter(f => f !== filter);
  }
  
  // Update selected filters display
  function updateSelectedFilters() {
    if (!selectedFiltersList) return;
    
    batchDOM(() => {
      selectedFiltersList.innerHTML = '';
      
      if (activeFilters.length === 0) {
        selectedFiltersList.innerHTML = `<span class="no-filters">${textLabels.noFilters}</span>`;
        return;
      }
      
      // Create document fragment for better performance
      const fragment = document.createDocumentFragment();
      
      activeFilters.forEach(filter => {
        const filterBadge = document.createElement('span');
        filterBadge.className = 'filter-badge';
        filterBadge.dataset.filter = filter;
        filterBadge.innerHTML = `${filter} <span class="remove-filter">&times;</span>`;
        fragment.appendChild(filterBadge);
      });
      
      selectedFiltersList.appendChild(fragment);
    });
  }
  
  // Apply active filters to products
  function applyFilters() {
    batchDOM(() => {
      if (activeFilters.length === 0) {
        // If no filters, show all products
        productItems.forEach(item => {
          item.style.display = 'block';
        });
        
        // Update top filter active state
        document.querySelectorAll('.filter-tag').forEach(tag => {
          if (tag.getAttribute('data-filter') === 'all') {
            tag.classList.add('active');
          } else {
            tag.classList.remove('active');
          }
        });
        
        return;
      }
      
      // Update top filter active state
      document.querySelectorAll('.filter-tag').forEach(tag => {
        const filter = tag.getAttribute('data-filter');
        if (activeFilters.includes(filter)) {
          tag.classList.add('active');
        } else {
          tag.classList.remove('active');
          if (filter === 'all') {
            tag.classList.remove('active');
          }
        }
      });
      
      // Filter products by active filters
      productItems.forEach(item => {
        const itemTags = (item.getAttribute('data-tags') || '').toLowerCase();
        let shouldDisplay = false;
        
        // Check if product has any of the active filters
        for (let i = 0; i < activeFilters.length; i++) {
          if (itemTags && itemTags.includes(activeFilters[i])) {
            shouldDisplay = true;
            break; // Early exit for performance
          }
        }
        
        item.style.display = shouldDisplay ? 'block' : 'none';
      });
    });
  }
  
  // Initialize lightbox triggers
  function initLightboxTriggers() {
    document.addEventListener('click', function(e) {
      const target = e.target.closest('.product-link');
      if (!target) return;
      
      e.preventDefault();
      
      const imgSrc = target.getAttribute('href');
      const imgTitle = target.getAttribute('data-title') || '';
      const index = allProducts.indexOf(target);
      if (index !== -1) {
        currentProductIndex = index;
        openLightbox(imgSrc, imgTitle, index);
      }
    });
  }
  
  // Auto-open lightbox from URL
  function autoOpenFromURL() {
    const search = window.location.search;
    if (search.startsWith("?")) {
      const slug = search.substring(1); // Remove "?"
      const targetLink = document.querySelector(`a[data-product-slug="${slug}"]`);
      if (targetLink) {
        // Delay to ensure page is fully loaded
        setTimeout(() => targetLink.click(), 300);
      }
    }
  }
  
  // Protect gallery images if image saving is disabled
  function protectGalleryImages() {
    // Use feature detection for advanced protection
    const hasPointerEvents = CSS.supports('pointer-events', 'none');
    
    // Common protection for all images
    const galleryImages = document.querySelectorAll('.product-image img');
    
    galleryImages.forEach(img => {
      // Prevent right-click
      img.addEventListener('contextmenu', e => {
        e.preventDefault();
        return false;
      });
      
      // Prevent dragging
      img.setAttribute('draggable', 'false');
      
      // Add CSS to disable touch-callout
      if (hasPointerEvents) {
        img.style.webkitTouchCallout = 'none';
        img.style.webkitUserSelect = 'none';
        img.style.khtmlUserSelect = 'none';
        img.style.mozUserSelect = 'none';
        img.style.msUserSelect = 'none';
        img.style.userSelect = 'none';
      }
    });
    
    // Add global handlers for dynamically created elements using event delegation
    document.addEventListener('contextmenu', e => {
      if (e.target.closest('.lightbox img, .lightbox-content img')) {
        e.preventDefault();
        return false;
      }
    });
    
    // Prevent long-press save on mobile
    let touchStartTime = 0;
    document.addEventListener('touchstart', e => {
      if (e.target.closest('.product-image img, .lightbox img, .lightbox-content img')) {
        touchStartTime = Date.now();
      }
    }, listenerOptions);
    
    document.addEventListener('touchend', e => {
      if (e.target.closest('.product-image img, .lightbox img, .lightbox-content img')) {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration > 500) {
          e.preventDefault();
        }
      }
    }, listenerOptions);
  }
  
  // Track the active keyboard event handler to prevent duplicate listeners
  let activeKeyHandler = null;
  
  // Open lightbox
  function openLightbox(imgSrc, imgTitle, index) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    // Create image element
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = allProducts[index].querySelector('img').alt;
    
    // Try to get image dimensions from original for better loading
    const originalImg = allProducts[index].querySelector('img');
    if (originalImg.width && originalImg.height) {
      img.width = originalImg.width;
      img.height = originalImg.height;
    }
    
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'lightbox-image-wrapper';
    
    // Disable right-click and long-press if needed
    if (!featureSettings.allowImageSave) {
      img.addEventListener('contextmenu', e => {
        e.preventDefault();
        return false;
      });
      img.setAttribute('draggable', 'false');
    }
    
    // Add caption
    const caption = document.createElement('div');
    caption.className = 'lightbox-caption';
    caption.textContent = imgTitle;
    
    // Create navigation arrows if multiple products
    if (allProducts.length > 1) {
      addNavigationArrows(lightbox);
    }
    
    // Create copy button and LINE button if enabled
    if (featureSettings.showCopyUrl) {
      addShareControls(imageWrapper, index);
    }
    
    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close');
    
    // Check the aspect ratio and set the top position accordingly
    const aspectRatio = catalogContainer.dataset.imageAspectRatio;
    if (aspectRatio === "1/1") {
      closeBtn.style.top = "30px";
    } else {
      closeBtn.style.top = "10px"; 
    }
    
    // Append elements
    lightboxContent.appendChild(closeBtn);
    imageWrapper.appendChild(img);
    lightboxContent.appendChild(imageWrapper);
    
    if (imgTitle) {
      lightboxContent.appendChild(caption);
    }
  
    // Add size guide if enabled
    if (featureSettings.hasGlobalSizeGuide && featureSettings.globalSizeContent && featureSettings.globalSizePicture) {
      const guideDiv = document.createElement('div');
      guideDiv.className = 'lightbox-size-guide';
      
      const guideLink = document.createElement('a');
      guideLink.className = 'size-guide-link';
      guideLink.href = featureSettings.globalSizePicture;
      guideLink.target = '_blank';
      guideLink.rel = 'noopener noreferrer';
      guideLink.textContent = featureSettings.globalSizeContent;
      
      guideDiv.appendChild(guideLink);
      lightboxContent.appendChild(guideDiv);
    }
        
    lightbox.appendChild(lightboxContent);
    // =========================
    // SWIPE GESTURE FOR TOUCH
    // =========================
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50; // Minimum px to trigger swipe

    lightboxContent.addEventListener('touchstart', function(e) {
      if (e.touches && e.touches.length === 1) {
        startX = e.touches[0].clientX;
      }
    }, listenerOptions);

    lightboxContent.addEventListener('touchmove', function(e) {
      if (e.touches && e.touches.length === 1) {
        endX = e.touches[0].clientX;
      }
    }, listenerOptions);

    lightboxContent.addEventListener('touchend', function() {
      const diffX = endX - startX;
      if (Math.abs(diffX) > swipeThreshold) {
        if (diffX > 0) {
          navigateLightbox('prev');
        } else {
          navigateLightbox('next');
        }
      }
      startX = 0;
      endX = 0;
    }, listenerOptions);

    document.body.appendChild(lightbox);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Add keyboard navigation
    setupKeyboardNavigation();
    
    // Close events
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      closeLightbox();
    });
    
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Add navigation arrows
    function addNavigationArrows(lightbox) {
      const leftArrow = document.createElement('div');
      leftArrow.className = 'lightbox-nav lightbox-prev';
      leftArrow.innerHTML = '&#10094;';
      leftArrow.style.opacity = '0.7';
      leftArrow.setAttribute('aria-label', 'Previous image');
      
      const rightArrow = document.createElement('div');
      rightArrow.className = 'lightbox-nav lightbox-next';
      rightArrow.innerHTML = '&#10095;';
      rightArrow.style.opacity = '0.7';
      rightArrow.setAttribute('aria-label', 'Next image');
      
      leftArrow.addEventListener('click', e => {
        e.stopPropagation();
        navigateLightbox('prev');
      });
      
      rightArrow.addEventListener('click', e => {
        e.stopPropagation();
        navigateLightbox('next');
      });
      
      lightbox.appendChild(leftArrow);
      lightbox.appendChild(rightArrow);
    }
    
    // Add share controls
    function addShareControls(imageWrapper, index) {
      const shareSection = document.createElement('div');
      shareSection.className = 'lightbox-share';
      
      const shareMessage = document.createElement('div');
      shareMessage.className = 'share-message';
      shareMessage.textContent = textLabels.copyMessage;
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-link-button';
      copyButton.textContent = textLabels.copyButton;
      
      const middleLabel = document.createElement('div');
      middleLabel.className = 'middle-label';
      middleLabel.textContent = textLabels.middleLabel;
      middleLabel.style.display = 'none'; // Hide initially
      
      // Create LINE button if a LINE account is provided
      let lineButton = null;
      if (featureSettings.lineAccount) {
        lineButton = document.createElement('a');
        lineButton.className = 'line-button';
        lineButton.href = featureSettings.lineAccount;
        lineButton.target = '_blank';
        lineButton.rel = 'noopener noreferrer';
        lineButton.innerHTML = '<svg class="line-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z"/></svg>LINE';
      }

      // Copy functionality with fallback
      copyButton.addEventListener('click', function() {
        const productSlug = allProducts[index].dataset.productSlug || '';
        let linkToCopy = imgSrc; // fallback to image if no slug
        
        if (productSlug) {
          linkToCopy = window.location.origin + window.location.pathname + "?" + productSlug;
        }
        
        // Use modern clipboard API with fallback
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(linkToCopy)
            .then(() => {
              copyButton.textContent = textLabels.copyButtonFinal;
              
              // Show LINE button and middle label
              if (lineButton) {
                lineButton.style.display = 'inline-flex';
              }
              
              middleLabel.style.display = 'inline-block';
              
              setTimeout(() => {
                copyButton.textContent = textLabels.copyButton;
              }, 2000);
            })
            .catch(() => {
              fallbackCopy(linkToCopy, copyButton, lineButton, middleLabel);
            });
        } else {
          fallbackCopy(linkToCopy, copyButton, lineButton, middleLabel);
        }
      });
      
      // Build share section
      shareSection.appendChild(shareMessage);
      shareSection.appendChild(copyButton);
      shareSection.appendChild(middleLabel);
      
      if (lineButton) {
        shareSection.appendChild(lineButton);
      }
      
      imageWrapper.appendChild(shareSection);
    }
    
    // Set up keyboard navigation
    function setupKeyboardNavigation() {
      // Create named function for keyboard navigation
      function keyboardNavHandler(e) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          // Prevent default browser behavior for arrow keys
          e.preventDefault();
          
          if (e.key === 'ArrowLeft') {
            navigateLightbox('prev');
          } else if (e.key === 'ArrowRight') {
            navigateLightbox('next');
          }
        }
      }
      
      // Store the current handler for later removal
      activeKeyHandler = keyboardNavHandler;
      
      // First remove any existing keyboard handlers
      document.removeEventListener('keydown', activeKeyHandler);
      
      // Then add our new handler
      document.addEventListener('keydown', activeKeyHandler);
    }
  }
  
  // Close lightbox
  function closeLightbox() {
    // Remove keyboard event listener
    if (activeKeyHandler) {
      document.removeEventListener('keydown', activeKeyHandler);
      activeKeyHandler = null;
    }
    
    // Remove lightbox element with fade-out effect for smoother UX
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
      // Apply fade-out effect
      lightbox.style.opacity = '0';
      lightbox.style.transition = 'opacity 0.3s ease';
      
      // Remove after transition completes
      setTimeout(() => {
        if (lightbox.parentNode) {
          document.body.removeChild(lightbox);
        }
        // Restore body scrolling
        document.body.style.overflow = '';
      }, 300);
    } else {
      // Immediate fallback if transition fails
      document.body.style.overflow = '';
    }
  }
  
  // Navigate between lightbox images
  function navigateLightbox(direction) {
    let newIndex = currentProductIndex;
    
    if (direction === 'next') {
      newIndex = (currentProductIndex + 1) % allProducts.length;
    } else if (direction === 'prev') {
      newIndex = (currentProductIndex - 1 + allProducts.length) % allProducts.length;
    }
    
    // Only proceed if we're actually changing the image
    if (newIndex !== currentProductIndex) {
      // Get the product details
      const nextProduct = allProducts[newIndex];
      const imgSrc = nextProduct.getAttribute('href');
      const imgTitle = nextProduct.getAttribute('data-title') || '';
      
      // First remove keyboard event listener before removing lightbox
      if (activeKeyHandler) {
        document.removeEventListener('keydown', activeKeyHandler);
      }
      
      // Remove the existing lightbox
      const existingLightbox = document.querySelector('.lightbox');
      if (existingLightbox) {
        document.body.removeChild(existingLightbox);
      }
      
      // Update current index
      currentProductIndex = newIndex;
      
      // Open new lightbox with new image
      openLightbox(imgSrc, imgTitle, newIndex);
    }
  }
  
  // Fallback copy method for older browsers
  function fallbackCopy(text, copyButton, lineButton, middleLabel) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    
    try {
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      if (successful) {
        if (copyButton) {
          copyButton.textContent = textLabels.copyButtonFinal;
          
          // Show LINE button if it exists
          if (lineButton) {
            lineButton.style.display = 'inline-flex';
          }
          
          if (middleLabel) {
            middleLabel.style.display = 'inline-block';
          }
          
          setTimeout(() => {
            copyButton.textContent = textLabels.copyButton;
          }, 2000);
        }
      } else {
        if (copyButton) {
          copyButton.textContent = 'Failed to copy';
        }
      }
    } catch (err) {
      if (copyButton) {
        copyButton.textContent = 'Failed to copy';
      }
      console.error('Copy fallback failed:', err);
    }
    
    document.body.removeChild(textArea);
  }
  
  // Handle errors gracefully
  window.addEventListener('error', function(e) {
    console.error('Error in product-catalog.js:', e.message);
    // Prevent user-visible errors
    return true;
  });
  
  // Clean up on page unload to prevent memory leaks
  window.addEventListener('beforeunload', function() {
    // Remove any open lightboxes
    const lightbox = document.querySelector('.lightbox');
    if (lightbox && lightbox.parentNode) {
      lightbox.parentNode.removeChild(lightbox);
    }
    
    // Remove event listeners
    if (activeKeyHandler) {
      document.removeEventListener('keydown', activeKeyHandler);
    }
    
    // Disconnect observers
    if (imageObserver) {
      imageObserver.disconnect();
    }
  });
});