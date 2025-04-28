document.addEventListener('DOMContentLoaded', function() {
  // Get catalog container and its data attributes
  const catalogContainer = document.querySelector('.product-catalog');
  
  if (!catalogContainer) return; // Exit if no catalog is found
  
  // Check if image saving is allowed from data attribute
  const allowImageSave = catalogContainer.dataset.allowImageSave === 'true';
  
  // Disable right-click and prevent long-press on gallery images if saving is not allowed
  if (!allowImageSave) {
    const galleryImages = document.querySelectorAll('.product-image img');
    galleryImages.forEach(img => {
      // Prevent right-click
      img.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
      });
      
      // Prevent dragging
      img.setAttribute('draggable', 'false');
      
      // Add CSS to disable touch-callout but preserve touch events
      img.style.webkitTouchCallout = 'none';
      img.style.webkitUserSelect = 'none';
      img.style.khtmlUserSelect = 'none';
      img.style.mozUserSelect = 'none';
      img.style.msUserSelect = 'none';
      img.style.userSelect = 'none';
      
      // Track touch start time to distinguish between tap and long-press
      let touchStartTime = 0;
      
      img.addEventListener('touchstart', function(e) {
        touchStartTime = Date.now();
        // Let the event continue for normal taps
      });
      
      img.addEventListener('touchend', function(e) {
        const touchDuration = Date.now() - touchStartTime;
        // Only prevent default if it's a long press (over 500ms)
        if (touchDuration > 500) {
          e.preventDefault();
        }
      });
    });
    
    // Add a global right-click disabler for dynamically created lightbox images
    document.addEventListener('contextmenu', function(e) {
      if (e.target.closest('.lightbox img') || e.target.closest('.lightbox-content img')) {
        e.preventDefault();
        return false;
      }
    });
    
    // Add a global long-press prevention for lightbox images
    document.addEventListener('touchstart', function(e) {
      if (e.target.closest('.lightbox img') || e.target.closest('.lightbox-content img')) {
        e.target.touchStartTime = Date.now();
      }
    });
    
    document.addEventListener('touchend', function(e) {
      const target = e.target.closest('.lightbox img') || e.target.closest('.lightbox-content img');
      if (target && target.touchStartTime) {
        const touchDuration = Date.now() - target.touchStartTime;
        if (touchDuration > 500) {
          e.preventDefault();
        }
      }
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
    
    // Update on resize
    window.addEventListener('resize', updateResponsiveGrid);
  }
  
  // Apply feature visibility
  function applyFeatureVisibility() {
    // Handle top filters visibility
    const topFilterTags = document.querySelector('.top-filter-tags');
    if (topFilterTags && catalogContainer.dataset.showTopFilters === 'false') {
      topFilterTags.style.display = 'none';
    }
    
    // Handle dropdown filters visibility
    const filterSort = document.querySelector('.filter-sort');
    if (filterSort && catalogContainer.dataset.showDropdownFilters === 'false') {
      filterSort.style.display = 'none';
    }
  }
  
  // Apply all the global theme settings
  applyAspectRatio();
  applyImagesPerRow();
  applyFeatureVisibility();
  
  // Toggle category dropdowns
  const categoryHeaders = document.querySelectorAll('.category-header');
  categoryHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const filters = this.nextElementSibling;
      const arrow = this.querySelector('.arrow-icon');
      
      filters.classList.toggle('hidden');
      
      if (filters.classList.contains('hidden')) {
        arrow.innerHTML = '&#9662;'; // Down arrow
      } else {
        arrow.innerHTML = '&#9652;'; // Up arrow
      }
    });
  });
  
  // Filter functionality
  const filterTags = document.querySelectorAll('.filter-tag, .dropdown-filter-tag');
  const productItems = document.querySelectorAll('.product-item');
  const selectedFiltersList = document.querySelector('.selected-filters-list');
  const clearAllButton = document.querySelector('.clear-all-filters');
  
  // Store active filters
  let activeFilters = [];
  
  // Toggle filter dropdown
  const filterButton = document.querySelector('.filter-sort-button');
  const filterDropdown = document.querySelector('.filter-dropdown');
  
  if (filterButton && filterDropdown) {
    filterButton.addEventListener('click', function() {
      filterDropdown.classList.toggle('active');
      this.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.filter-sort') && filterDropdown.classList.contains('active')) {
        filterDropdown.classList.remove('active');
        filterButton.classList.remove('active');
      }
    });
  }
  
  // Get customizable labels from data attributes on the catalog container
  let copyButtonLabel = 'Copy URL';
  let copyButtonLabelFinalState = 'URL Copied!';
  let copyMessageLabel = 'Copy image URL:';
  let selectedFiltersLabel = 'Selected Filters';
  let clearAllLabel = 'Clear All';
  let noFiltersLabel = 'No filters selected';
  
  if (catalogContainer) {
    copyButtonLabel = catalogContainer.dataset.copyButtonLabel || copyButtonLabel;
    copyButtonLabelFinalState = catalogContainer.dataset.copyButtonLabelFinalstate || copyButtonLabelFinalState;
    copyMessageLabel = catalogContainer.dataset.copyMessageLabel || copyMessageLabel;
    selectedFiltersLabel = catalogContainer.dataset.selectedFiltersLabel || selectedFiltersLabel;
    clearAllLabel = catalogContainer.dataset.clearAllLabel || clearAllLabel;
    noFiltersLabel = catalogContainer.dataset.noFiltersLabel || noFiltersLabel;
  }
  
  // Set the Selected Filters heading text
  const selectedFiltersHeading = document.querySelector('.selected-filters h4');
  if (selectedFiltersHeading) {
    selectedFiltersHeading.textContent = selectedFiltersLabel;
  }
  
  // Update selected filters display
  function updateSelectedFilters() {
    if (!selectedFiltersList) return; // Exit if element doesn't exist
    
    selectedFiltersList.innerHTML = '';
    
    if (activeFilters.length === 0) {
      selectedFiltersList.innerHTML = `<span class="no-filters">${noFiltersLabel}</span>`;
      return;
    }
    
    activeFilters.forEach(filter => {
      const filterBadge = document.createElement('span');
      filterBadge.className = 'filter-badge';
      filterBadge.dataset.filter = filter;
      filterBadge.innerHTML = `${filter} <span class="remove-filter">&times;</span>`;
      
      filterBadge.querySelector('.remove-filter').addEventListener('click', function(e) {
        e.stopPropagation();
        removeFilter(filter);
      });
      
      selectedFiltersList.appendChild(filterBadge);
    });
  }
  
  // Apply active filters to products
  function applyFilters() {
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
      const itemTags = item.getAttribute('data-tags');
      let shouldDisplay = false;
      
      // Check if product has any of the active filters
      activeFilters.forEach(filter => {
        if (itemTags && itemTags.includes(filter)) {
          shouldDisplay = true;
        }
      });
      
      item.style.display = shouldDisplay ? 'block' : 'none';
    });
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
      updateSelectedFilters();
      applyFilters();
    }
  }
  
  // Remove a filter
  function removeFilter(filter) {
    activeFilters = activeFilters.filter(f => f !== filter);
    updateSelectedFilters();
    applyFilters();
  }
  
  // Clear all filters
  if (clearAllButton) {
    // Update the button text with custom label
    clearAllButton.textContent = clearAllLabel;
    
    clearAllButton.addEventListener('click', function() {
      activeFilters = [];
      updateSelectedFilters();
      applyFilters();
    });
  }
  
  // Add event listeners to filter tags
  filterTags.forEach(tag => {
    tag.addEventListener('click', function(e) {
      e.preventDefault();
      const filter = this.getAttribute('data-filter');
      
      // For top filters, toggle single filter
      if (this.classList.contains('filter-tag')) {
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
    });
  });
  
  // Initialize selected filters display
  updateSelectedFilters();
  
  // Check if copy URL feature should be hidden and if LINE account is available
  const shouldShowCopyUrl = !(catalogContainer && catalogContainer.dataset.showCopyUrl === 'false');
  const lineAccount = catalogContainer && catalogContainer.dataset.lineAccount;
  
  // Basic lightbox functionality
  const productLinks = document.querySelectorAll('.product-link');
  let allProducts = Array.from(productLinks); // Array of all product links for navigation
  let currentProductIndex = 0; // To track current image in lightbox
  
  productLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const imgSrc = this.getAttribute('href');
      const imgTitle = this.getAttribute('data-title') || '';
      currentProductIndex = index; // Store the current index for navigation
      
      openLightbox(imgSrc, imgTitle, index);
    });
  });

  // Auto-open lightbox if URL contains a matching slug (like ?sports-1)
  (function autoOpenFromURL() {
    const search = window.location.search;
    if (search.startsWith("?")) {
      const slug = search.substring(1); // Remove "?"
      const targetLink = document.querySelector(`a[data-product-slug="${slug}"]`);
      if (targetLink) {
        setTimeout(function() {
          targetLink.click();
        }, 300);
      }
    }
  })();
  
  // Track the active keyboard event handler to prevent duplicate listeners
  let activeKeyHandler = null;
  
  function openLightbox(imgSrc, imgTitle, index) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = allProducts[index].querySelector('img').alt;
  
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'lightbox-image-wrapper';    
    
    // Disable right-click and handle long-press on lightbox image if saving is not allowed
    if (!allowImageSave) {
      // Prevent right-click
      img.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
      });
      
      // Prevent dragging
      img.setAttribute('draggable', 'false');
      
      // Add CSS to disable touch-callout
      img.style.webkitTouchCallout = 'none';
      img.style.webkitUserSelect = 'none';
      img.style.khtmlUserSelect = 'none';
      img.style.mozUserSelect = 'none';
      img.style.msUserSelect = 'none';
      img.style.userSelect = 'none';
      
      // Track touch start time to distinguish between tap and long-press
      img.touchStartTime = 0;
      
      img.addEventListener('touchstart', function(e) {
        this.touchStartTime = Date.now();
        // Let the event continue for normal taps
      });
      
      img.addEventListener('touchend', function(e) {
        const touchDuration = Date.now() - this.touchStartTime;
        // Only prevent default if it's a long press (over 500ms)
        if (touchDuration > 500) {
          e.preventDefault();
        }
      });
      
      // Add protection to the entire lightbox too
      lightbox.addEventListener('contextmenu', function(e) {
        if (e.target === img || e.target.closest('img')) {
          e.preventDefault();
          return false;
        }
      });
    }
    
    const caption = document.createElement('div');
    caption.className = 'lightbox-caption';
    caption.textContent = imgTitle;
    
    // Create navigation arrows (only if there are multiple products)
    if (allProducts.length > 1) {
      // Left arrow for navigation
      const leftArrow = document.createElement('div');
      leftArrow.className = 'lightbox-nav lightbox-prev';
      leftArrow.innerHTML = '&#10094;';
      leftArrow.style.opacity = '0.7'; // Semi-transparent
      
      // Right arrow for navigation
      const rightArrow = document.createElement('div');
      rightArrow.className = 'lightbox-nav lightbox-next';
      rightArrow.innerHTML = '&#10095;';
      rightArrow.style.opacity = '0.7'; // Semi-transparent
      
      // Add event listeners to arrows
      leftArrow.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent lightbox from closing
        navigateLightbox('prev');
      });
      
      rightArrow.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent lightbox from closing
        navigateLightbox('next');
      });
      
      lightbox.appendChild(leftArrow);
      lightbox.appendChild(rightArrow);
    }
    
    // Create copy button and LINE button - only if not specifically disabled
    if (shouldShowCopyUrl) {
      const shareSection = document.createElement('div');
      shareSection.className = 'lightbox-share';
      
      const shareMessage = document.createElement('div');
      shareMessage.className = 'share-message';
      shareMessage.textContent = copyMessageLabel;
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-link-button';
      copyButton.textContent = copyButtonLabel;
  
      // Create Middle Label
      let middleLabelText = 'ส่งลิงก์ผ่าน LINE ได้เลย!';
      if (catalogContainer.dataset.middleLabelText) {
        middleLabelText = catalogContainer.dataset.middleLabelText;
      }
  
      const middleLabel = document.createElement('div');
      middleLabel.className = 'middle-label';
      middleLabel.textContent = middleLabelText;
      middleLabel.style.display = 'none'; // Hide initially
      
      // Create LINE button if a LINE account is provided
      let lineButton = null;
      if (lineAccount) {
        lineButton = document.createElement('a');
        lineButton.className = 'line-button';
        lineButton.href = lineAccount;
        lineButton.target = '_blank';
        lineButton.innerHTML = '<svg class="line-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z"/></svg>LINE';
      }
      
      // Copy functionality
      copyButton.addEventListener('click', function() {
        const productSlug = allProducts[index].dataset.productSlug || '';
        let linkToCopy = imgSrc; // fallback to image if no slug
      
        if (productSlug) {
          linkToCopy = window.location.origin + window.location.pathname + "?" + productSlug;
        }
      
        navigator.clipboard.writeText(linkToCopy).then(function() {
          copyButton.textContent = copyButtonLabelFinalState;
          
          // Show LINE button if it exists
          if (lineButton) {
            lineButton.style.display = 'inline-flex';
          }
          
          middleLabel.style.display = 'inline-block';
  
          setTimeout(function() {
            copyButton.textContent = copyButtonLabel;
          }, 2000);
        }).catch(function() {
          const textArea = document.createElement('textarea');
          textArea.value = linkToCopy;
          textArea.style.position = 'fixed';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
      
          try {
            document.execCommand('copy');
            copyButton.textContent = copyButtonLabelFinalState;
            
            // Show LINE button if it exists
            if (lineButton) {
              lineButton.style.display = 'inline-flex';
            }
            
            middleLabel.style.display = 'inline-block';
            
            setTimeout(function() {
              copyButton.textContent = copyButtonLabel;
            }, 2000);
          } catch (err) {
            copyButton.textContent = 'Failed to copy';
          }
      
          document.body.removeChild(textArea);
        });
      });
      
      // Add the copy button to the share section
      shareSection.appendChild(shareMessage);
      shareSection.appendChild(copyButton);
      
      // Insert middle label
      shareSection.appendChild(middleLabel);
      
      // Add LINE button if it exists
      if (lineButton) {
        shareSection.appendChild(lineButton);
      }
      
      imageWrapper.appendChild(shareSection);
    }
    
    // Enhanced close button
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
    
    // IMPORTANT: Append closeBtn to lightbox (inside lightboxContent)
    lightboxContent.appendChild(closeBtn);
  
    // Image wrapper
    imageWrapper.appendChild(img);
    lightboxContent.appendChild(imageWrapper);
    
    // Caption (optional)
    if (imgTitle) {
      lightboxContent.appendChild(caption);
    }
    
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Create a named function for keyboard navigation to allow removal later
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
    
    // First remove any existing keyboard handlers to prevent duplicates
    document.removeEventListener('keydown', activeKeyHandler);
    
    // Then add our new handler
    document.addEventListener('keydown', activeKeyHandler);
    
    // Close function
    const closeLightbox = function() {
      // Remove the keyboard event listener when closing
      document.removeEventListener('keydown', activeKeyHandler);
      activeKeyHandler = null;
      
      document.body.removeChild(lightbox);
      document.body.style.overflow = '';
    };
    
    // Close events
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeLightbox();
    });
    
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  
  // Function to navigate between lightbox images
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
});