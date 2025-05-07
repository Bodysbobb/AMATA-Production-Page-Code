// Initialize filter UI - Non-critical functionality
function initFilters(container, data) {
  // Only show filter UI if enabled
  if (!data.ui.show_top_filters && !data.ui.show_dropdown_filters) {
    const filterSection = container.querySelector('.catalog-filters');
    if (filterSection) filterSection.style.display = 'none';
    return;
  }
  
  // Build top filters if enabled
  if (data.ui.show_top_filters !== false) {
    const topFiltersContainer = container.querySelector('.top-filter-tags');
    if (topFiltersContainer) {
      // Clear any existing filters (from placeholder)
      topFiltersContainer.innerHTML = '';
      
      // Add "All" filter
      const allFilter = document.createElement('a');
      allFilter.href = '#';
      allFilter.className = 'filter-tag active';
      allFilter.setAttribute('data-filter', 'all');
      allFilter.textContent = 'All';
      topFiltersContainer.appendChild(allFilter);
      
      // Add top filters from data
      data.topFilters.forEach(filter => {
        const filterTag = document.createElement('a');
        filterTag.href = '#';
        filterTag.className = 'filter-tag';
        filterTag.setAttribute('data-filter', filter.value);
        filterTag.textContent = filter.display;
        topFiltersContainer.appendChild(filterTag);
      });
    }
  } else {
    // Hide top filters section
    const topFiltersWrapper = container.querySelector('.top-filter-tags-wrapper');
    if (topFiltersWrapper) topFiltersWrapper.style.display = 'none';
  }
  
  // Build dropdown filters if enabled
  if (data.ui.show_dropdown_filters !== false) {
    const filterSortButton = container.querySelector('.filter-sort-button');
    if (filterSortButton) {
      filterSortButton.textContent = data.ui.labels.filter_button || 'Filter & Sort';
    }
    
    const filterDropdown = container.querySelector('.filter-dropdown');
    if (filterDropdown) {
      // Create filter categories
      Object.entries(data.filters).forEach(([category, filterData]) => {
        const filterCategory = document.createElement('div');
        filterCategory.className = 'filter-category';
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        
        const categoryTitle = document.createElement('h4');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = filterData.label;
        
        const toggleCategory = document.createElement('button');
        toggleCategory.className = 'toggle-category';
        toggleCategory.setAttribute('aria-label', 'Toggle category');
        toggleCategory.innerHTML = '<span class="arrow-icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></span>';
        
        categoryHeader.appendChild(categoryTitle);
        categoryHeader.appendChild(toggleCategory);
        
        const categoryFilters = document.createElement('div');
        categoryFilters.className = 'category-filters hidden';
        
        // Add filters for this category
        filterData.values.forEach(filter => {
          const filterTag = document.createElement('a');
          filterTag.href = '#';
          filterTag.className = 'dropdown-filter-tag';
          filterTag.setAttribute('data-filter', filter.value);
          filterTag.textContent = filter.display;
          categoryFilters.appendChild(filterTag);
        });
        
        filterCategory.appendChild(categoryHeader);
        filterCategory.appendChild(categoryFilters);
        
        // Insert before selected filters
        const selectedFilters = filterDropdown.querySelector('.selected-filters');
        if (selectedFilters) {
          filterDropdown.insertBefore(filterCategory, selectedFilters);
        } else {
          filterDropdown.appendChild(filterCategory);
        }
      });
      
      // Set up selected filters section
      const selectedFiltersHeading = container.querySelector('.selected-filters h4');
      if (selectedFiltersHeading) {
        selectedFiltersHeading.textContent = data.ui.labels.selected_filters || 'Selected Filters';
      }
      
      const selectedFiltersList = container.querySelector('.selected-filters-list');
      if (selectedFiltersList) {
        selectedFiltersList.innerHTML = `<span class="no-filters">${data.ui.labels.no_filters || 'No filters selected'}</span>`;
      }
      
      const clearAllButton = container.querySelector('.clear-all-filters');
      if (clearAllButton) {
        clearAllButton.textContent = data.ui.labels.clear_all || 'Clear All';
      }
    }
  } else {
    // Hide dropdown filters
    const filterSort = container.querySelector('.filter-sort');
    if (filterSort) filterSort.style.display = 'none';
  }
  
  // Setup event listeners
  setupEventListeners(container);
}

// Set up event listeners
function setupEventListeners(container) {
  // Toggle dropdown categories
  container.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', function() {
      const filters = this.nextElementSibling;
      const arrow = this.querySelector('.arrow-icon');
      if (filters && arrow) {
        filters.classList.toggle('hidden');
        arrow.classList.toggle('rotated');
      }
    });
  });
  
  // Toggle filter dropdown
  const filterSortButton = container.querySelector('.filter-sort-button');
  const filterDropdown = container.querySelector('.filter-dropdown');
  
  if (filterSortButton && filterDropdown) {
    filterSortButton.addEventListener('click', function() {
      filterDropdown.classList.toggle('active');
      this.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.filter-sort') && filterDropdown.classList.contains('active')) {
        filterDropdown.classList.remove('active');
        filterSortButton.classList.remove('active');
      }
    });
  }
  
  // Filter tag clicks and lightbox
  container.addEventListener('click', function(e) {
    const target = e.target;
    
    // Handle product links (lightbox)
    if (target.closest('.product-link')) {
      e.preventDefault();
      const link = target.closest('.product-link');
      const index = parseInt(link.getAttribute('data-index'), 10);
      
      if (!isNaN(index) && window.productCatalog.data) {
        createLightbox(window.productCatalog.data, index);
      }
    }
    // Handle filter tags
    else if (target.matches('.filter-tag, .dropdown-filter-tag')) {
      e.preventDefault();
      const filter = target.getAttribute('data-filter');
      
      if (target.classList.contains('filter-tag')) {
        // Top filter tags
        if (filter === 'all') {
          window.productCatalog.activeFilters = [];
        } else if (window.productCatalog.activeFilters.includes(filter)) {
          removeFilter(filter);
        } else {
          addFilter(filter);
        }
      } else {
        // Dropdown filter tags
        addFilter(filter);
      }
      
      updateSelectedFilters(container);
      applyFilters(container);
    }
    // Handle remove filter buttons
    else if (target.classList.contains('remove-filter')) {
      const badge = target.closest('.filter-badge');
      if (badge) {
        removeFilter(badge.dataset.filter);
        updateSelectedFilters(container);
        applyFilters(container);
      }
    }
  });
  
  // Clear all filters button
  const clearAllButton = container.querySelector('.clear-all-filters');
  if (clearAllButton) {
    clearAllButton.addEventListener('click', function() {
      window.productCatalog.activeFilters = [];
      updateSelectedFilters(container);
      applyFilters(container);
    });
  }
}

// Filter helper functions
function addFilter(filter) {
  if (!window.productCatalog.activeFilters.includes(filter)) {
    window.productCatalog.activeFilters.push(filter);
  }
}

function removeFilter(filter) {
  window.productCatalog.activeFilters = window.productCatalog.activeFilters.filter(f => f !== filter);
}

function updateSelectedFilters(container) {
  const data = window.productCatalog.data;
  const selectedFiltersList = container.querySelector('.selected-filters-list');
  if (!selectedFiltersList || !data) return;
  
  if (window.productCatalog.activeFilters.length === 0) {
    selectedFiltersList.innerHTML = `<span class="no-filters">${data.ui.labels.no_filters || 'No filters selected'}</span>`;
    return;
  }
  
  selectedFiltersList.innerHTML = '';
  window.productCatalog.activeFilters.forEach(filter => {
    // Find display name for this filter
    let displayName = filter;
    for (const category in data.filters) {
      const found = data.filters[category].values.find(v => v.value === filter);
      if (found) {
        displayName = found.display;
        break;
      }
    }
    
    const badge = document.createElement('span');
    badge.className = 'filter-badge';
    badge.dataset.filter = filter;
    badge.innerHTML = `${displayName} <span class="remove-filter">&times;</span>`;
    selectedFiltersList.appendChild(badge);
  });
}

function applyFilters(container) {
  // Update top filter tag active states
  container.querySelectorAll('.filter-tag').forEach(tag => {
    const filter = tag.getAttribute('data-filter');
    if (filter === 'all') {
      tag.classList.toggle('active', window.productCatalog.activeFilters.length === 0);
    } else {
      tag.classList.toggle('active', window.productCatalog.activeFilters.includes(filter));
    }
  });
  
  // Update dropdown filter tag active states - NEW CODE
  container.querySelectorAll('.dropdown-filter-tag').forEach(tag => {
    const filter = tag.getAttribute('data-filter');
    tag.classList.toggle('active', window.productCatalog.activeFilters.includes(filter));
  });
  
  // Apply filters to products
  const productItems = container.querySelectorAll('.product-item');
  
  if (window.productCatalog.activeFilters.length === 0) {
    // Show all products
    productItems.forEach(item => {
      item.style.display = 'block';
    });
    return;
  }
  
  // Filter products
  productItems.forEach(item => {
    const tags = (item.getAttribute('data-tags') || '').toLowerCase();
    let showItem = false;
    
    // Check if any active filter matches
    for (let i = 0; i < window.productCatalog.activeFilters.length; i++) {
      if (tags && tags.includes(window.productCatalog.activeFilters[i].toLowerCase())) {
        showItem = true;
        break;
      }
    }
    
    item.style.display = showItem ? 'block' : 'none';
  });
}

// Lightbox implementation - only loaded when needed
function createLightbox(data, index) {
  const product = data.products[index];
  const uiSettings = data.ui;
  
  // Store current index for navigation
  window.productCatalog.currentLightboxIndex = index;
  
  // Create lightbox container
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  
  // Create lightbox content
  const content = document.createElement('div');
  content.className = 'lightbox-content';
  
  // Create image wrapper
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'lightbox-image-wrapper';
  
  // Create image
  const image = document.createElement('img');
  image.src = product.path;
  image.alt = product.alt;
  
  // Create close button
  const closeButton = document.createElement('span');
  closeButton.className = 'lightbox-close';
  closeButton.innerHTML = '&times;';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.addEventListener('click', closeLightbox);
  
  // Create caption
  const caption = document.createElement('div');
  caption.className = 'lightbox-caption';
  caption.textContent = product.description;
  
  // Add share functionality if enabled
  if (uiSettings.show_copy_url) {
    const shareSection = document.createElement('div');
    shareSection.className = 'lightbox-share';
    
    const shareMessage = document.createElement('div');
    shareMessage.className = 'share-message';
    shareMessage.textContent = uiSettings.labels.copy_message;
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-link-button';
    copyButton.textContent = uiSettings.labels.copy_button;
    
    // Middle label
    const middleLabel = document.createElement('div');
    middleLabel.className = 'middle-label';
    middleLabel.textContent = uiSettings.labels.middle_label || '';
    middleLabel.style.display = 'none';
    
    // Copy button functionality
    copyButton.addEventListener('click', function() {
      // Create a clean URL-friendly version of the product description
      const productSlug = encodeURIComponent(product.description);
      const url = window.location.origin + window.location.pathname + '?' + productSlug;
      
      navigator.clipboard.writeText(url).then(() => {
        copyButton.textContent = uiSettings.labels.copy_button_final;
        middleLabel.style.display = 'inline-block';
        
        // If LINE button exists, show it
        const lineButton = shareSection.querySelector('.line-button');
        if (lineButton) {
          lineButton.style.display = 'inline-flex';
        }
        
        setTimeout(() => {
          copyButton.textContent = uiSettings.labels.copy_button;
        }, 2000);
      }).catch(() => {
        // Fallback for browsers without clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
          document.execCommand('copy');
          copyButton.textContent = uiSettings.labels.copy_button_final;
          middleLabel.style.display = 'inline-block';
          
          // If LINE button exists, show it
          const lineButton = shareSection.querySelector('.line-button');
          if (lineButton) {
            lineButton.style.display = 'inline-flex';
          }
          
          setTimeout(() => {
            copyButton.textContent = uiSettings.labels.copy_button;
          }, 2000);
        } catch (err) {
          console.error('Could not copy text: ', err);
        }
        
        document.body.removeChild(textarea);
      });
    });
    
    shareSection.appendChild(shareMessage);
    shareSection.appendChild(copyButton);
    shareSection.appendChild(middleLabel);
    
    // Add LINE button if available
    if (uiSettings.line_account) {
      const lineButton = document.createElement('a');
      lineButton.className = 'line-button';
      lineButton.href = uiSettings.line_account;
      lineButton.target = '_blank';
      lineButton.rel = 'noopener noreferrer';
      lineButton.style.display = 'none';
      lineButton.innerHTML = '<svg class="line-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z"/></svg>LINE';
      
      shareSection.appendChild(lineButton);
    }
    
    imageWrapper.appendChild(shareSection);
  }
  
  // Build lightbox structure - REORDERED COMPONENTS
  imageWrapper.appendChild(image);
  content.appendChild(closeButton);
  content.appendChild(imageWrapper);
  content.appendChild(caption);
  
  // Add size guide if available - MOVED AFTER CAPTION
  if (uiSettings.size_guide && uiSettings.size_content && uiSettings.size_picture) {
    const sizeGuide = document.createElement('div');
    sizeGuide.className = 'lightbox-size-guide';
    
    const sizeLink = document.createElement('a');
    sizeLink.className = 'size-guide-link';
    sizeLink.href = uiSettings.size_picture;
    sizeLink.target = '_blank';
    sizeLink.rel = 'noopener noreferrer';
    sizeLink.textContent = uiSettings.size_content;
    
    sizeGuide.appendChild(sizeLink);
    content.appendChild(sizeGuide);
  }
  
  lightbox.appendChild(content);
  
  // Add navigation if there are multiple products
  if (data.products.length > 1) {
    const prevNav = document.createElement('div');
    prevNav.className = 'lightbox-nav lightbox-prev';
    prevNav.innerHTML = '&#10094;';
    prevNav.setAttribute('aria-label', 'Previous image');
    prevNav.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateLightbox((index - 1 + data.products.length) % data.products.length);
    });
    
    const nextNav = document.createElement('div');
    nextNav.className = 'lightbox-nav lightbox-next';
    nextNav.innerHTML = '&#10095;';
    nextNav.setAttribute('aria-label', 'Next image');
    nextNav.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateLightbox((index + 1) % data.products.length);
    });
    
    lightbox.appendChild(prevNav);
    lightbox.appendChild(nextNav);
  }
  
  // Add keyboard navigation
  document.addEventListener('keydown', keyboardNavigation);
  
  // Close when clicking the background
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Add to DOM
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.removeEventListener('keydown', keyboardNavigation);
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    lightbox.style.opacity = '0';
    lightbox.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      if (lightbox.parentNode) {
        lightbox.parentNode.removeChild(lightbox);
      }
      document.body.style.overflow = '';
    }, 300);
  }
}

function navigateLightbox(newIndex) {
  closeLightbox();
  setTimeout(() => {
    createLightbox(window.productCatalog.data, newIndex);
  }, 300);
}

function keyboardNavigation(e) {
  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    navigateLightbox((window.productCatalog.currentLightboxIndex - 1 + window.productCatalog.data.products.length) % window.productCatalog.data.products.length);
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    navigateLightbox((window.productCatalog.currentLightboxIndex + 1) % window.productCatalog.data.products.length);
  }
}

// URL parameter handling for direct lightbox opening
function checkUrlForLightbox() {
  // Get the query string without the '?'
  const queryString = window.location.search.substring(1);
  
  if (queryString && window.productCatalog && window.productCatalog.data) {
    // Find the product with matching description
    const products = window.productCatalog.data.products;
    const foundIndex = products.findIndex(product => 
      product.description === queryString || 
      product.description === decodeURIComponent(queryString)
    );
    
    if (foundIndex !== -1) {
      // Wait a bit for everything to initialize
      setTimeout(() => {
        createLightbox(window.productCatalog.data, foundIndex);
      }, 500);
    }
  }
}

// Initialize immediately when this script loads
document.addEventListener("DOMContentLoaded", function() {
  const catalogs = document.querySelectorAll('.product-catalog[data-json-url]');
  
  catalogs.forEach(function(catalog) {
    // Check if data is already loaded (by inline script)
    if (window.productCatalog && window.productCatalog.data) {
      // Initialize filters with existing data
      initFilters(catalog, window.productCatalog.data);
      // Check for URL parameters
      checkUrlForLightbox();
    } else {
      // Wait for data to be loaded by inline script
      const checkInterval = setInterval(function() {
        if (window.productCatalog && window.productCatalog.data) {
          clearInterval(checkInterval);
          initFilters(catalog, window.productCatalog.data);
          // Check for URL parameters after data is loaded
          checkUrlForLightbox();
        }
      }, 100);
      
      // Safety timeout after 5 seconds
      setTimeout(function() {
        clearInterval(checkInterval);
      }, 5000);
    }
  });
});