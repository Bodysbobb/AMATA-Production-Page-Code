// Admin panel data sync and cleanup script
(function() {
  // Constants
  const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzg-r9e3MaNneQjlV7-56tsW9OjPOxgwSQRp5XpvrtN9M-iNhm9Jn272UMvobTnK0cZ/exec';
  const SYNC_INTERVAL = 30 * 60 * 1000; // 30 minutes
  const LAST_SYNC_KEY = 'last_sheet_sync_state';
  const LAST_CLEANUP_KEY = 'last_analytics_cleanup_date';
  const CLEANUP_INTERVAL_DAYS = 3; // Clear data every 3 days
  
  // Extract product category
  function getProductCategory(productId) {
    const productIdLower = productId.toLowerCase();
    if (productIdLower.includes('sports')) return 'กีฬา';
    else if (productIdLower.includes('polo')) return 'เสื้อโปโล';
    else if (productIdLower.includes('tshirt')) return 'เสื้อยืด';
    else if (productIdLower.includes('printing')) return 'สิ่งพิมพ์';
    else return 'อื่นๆ';
  }

  // Get previously synced state
  function getLastSyncState() {
    const lastState = localStorage.getItem(LAST_SYNC_KEY);
    return lastState ? JSON.parse(lastState) : {
      urlClicks: {},
      lightboxOpens: {}
    };
  }

  // Save current state as last synced
  function saveCurrentAsLastSync(urlClicks, lightboxOpens) {
    localStorage.setItem(LAST_SYNC_KEY, JSON.stringify({
      urlClicks: urlClicks || {},
      lightboxOpens: lightboxOpens || {}
    }));
  }

  // Check if product data has changed since last sync
  function hasChanged(productId, currentData, lastSyncData) {
    if (!lastSyncData[productId]) return true;
    
    if (currentData[productId].clicks !== lastSyncData[productId].clicks) return true;
    return false;
  }

  // PART 1: Sync function - only syncs changed/new data
  function syncToSheet() {
    // Get current data
    const urlData = localStorage.getItem('product_url_clicks');
    const lightboxData = localStorage.getItem('product_lightbox_opens');
    
    if (!urlData && !lightboxData) return;
    
    // Parse data
    const urlClicks = urlData ? JSON.parse(urlData) : {};
    const lightboxOpens = lightboxData ? JSON.parse(lightboxData) : {};
    
    // Get last sync state
    const lastSyncState = getLastSyncState();
    
    // Find products that have changed since last sync
    const changedProducts = new Set();
    
    // Check URL clicks
    Object.keys(urlClicks).forEach(productId => {
      if (hasChanged(productId, urlClicks, lastSyncState.urlClicks)) {
        changedProducts.add(productId);
      }
    });
    
    // Check lightbox opens
    Object.keys(lightboxOpens).forEach(productId => {
      if (hasChanged(productId, lightboxOpens, lastSyncState.lightboxOpens)) {
        changedProducts.add(productId);
      }
    });
    
    if (changedProducts.size === 0) {
      console.log('No changes since last sync');
      return;
    }
    
    console.log('Syncing ' + changedProducts.size + ' changed products to Google Sheet');
    
    // For each changed product, create a row and send it
    const changedProductsArray = Array.from(changedProducts);
    let syncCount = 0;
    
    changedProductsArray.forEach(productId => {
      const category = getProductCategory(productId);
      const urlClickCount = urlClicks[productId] ? urlClicks[productId].clicks : 0;
      const lastUrlClick = urlClicks[productId] && urlClicks[productId].lastClicked ? urlClicks[productId].lastClicked : '';
      const lightboxOpenCount = lightboxOpens[productId] ? lightboxOpens[productId].opens : 0;
      const lastLightboxOpen = lightboxOpens[productId] && lightboxOpens[productId].lastOpened ? lightboxOpens[productId].lastOpened : '';
      
      const payload = {
        timestamp: new Date().toISOString(),
        productId: productId,
        category: category,
        urlClicks: urlClickCount,
        lastUrlClick: lastUrlClick,
        lightboxOpens: lightboxOpenCount,
        lastLightboxOpen: lastLightboxOpen,
        totalInteractions: urlClickCount + lightboxOpenCount
      };
      
      // Send to Google Sheet
      fetch(SHEET_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(() => {
        syncCount++;
        console.log(`Synced ${productId} (${syncCount}/${changedProducts.size})`);
        
        // If all products have been synced, save the current state
        if (syncCount === changedProducts.size) {
          saveCurrentAsLastSync(urlClicks, lightboxOpens);
          console.log('Sync completed, saved new state');
        }
      })
      .catch(error => {
        console.error('Error syncing product:', productId, error);
      });
    });
  }

  // PART 2: Clean up function - clears analytics data every 3 days
  function checkAndCleanupData() {
    // Get last cleanup date
    const lastCleanupDate = localStorage.getItem(LAST_CLEANUP_KEY);
    
    // If never cleaned up before, set initial date and exit
    if (!lastCleanupDate) {
      localStorage.setItem(LAST_CLEANUP_KEY, new Date().toISOString());
      return;
    }
    
    // Calculate days since last cleanup
    const lastCleanup = new Date(lastCleanupDate);
    const now = new Date();
    const daysSinceCleanup = Math.floor((now - lastCleanup) / (1000 * 60 * 60 * 24));
    
    // If it's been at least 3 days since last cleanup
    if (daysSinceCleanup >= CLEANUP_INTERVAL_DAYS) {
      console.log(`Performing ${CLEANUP_INTERVAL_DAYS}-day cleanup of analytics data`);
      
      // First sync any pending data
      syncToSheet();
      
      // After brief delay to allow sync to complete
      setTimeout(() => {
        // Get current data before clearing
        const urlData = localStorage.getItem('product_url_clicks');
        const lightboxData = localStorage.getItem('product_lightbox_opens');
        
        // Create a backup of current data with date
        const backupDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        if (urlData) {
          localStorage.setItem(`product_url_clicks_backup_${backupDate}`, urlData);
        }
        if (lightboxData) {
          localStorage.setItem(`product_lightbox_opens_backup_${backupDate}`, lightboxData);
        }
        
        // Clear current data
        localStorage.removeItem('product_url_clicks');
        localStorage.removeItem('product_lightbox_opens');
        
        // Also clear sync state
        localStorage.removeItem(LAST_SYNC_KEY);
        
        // Update last cleanup date
        localStorage.setItem(LAST_CLEANUP_KEY, now.toISOString());
        
        console.log(`Analytics data cleared and backed up as of ${backupDate}`);
        
        // Reload the page to refresh the admin dashboard
        window.location.reload();
        
      }, 5000); // 5-second delay to allow sync to complete
    } else {
      console.log(`Next data cleanup in ${CLEANUP_INTERVAL_DAYS - daysSinceCleanup} days`);
    }
  }

  // Initialize
  console.log('Admin panel sync and cleanup script loaded');
  
  // Run sync when page loads (with delay)
  setTimeout(syncToSheet, 5000);
  
  // Check for cleanup when page loads (after sync starts)
  setTimeout(checkAndCleanupData, 10000);
  
  // Run sync periodically
  setInterval(syncToSheet, SYNC_INTERVAL);
  
  // Check for cleanup periodically (once per day is sufficient)
  setInterval(checkAndCleanupData, 24 * 60 * 60 * 1000);
})();