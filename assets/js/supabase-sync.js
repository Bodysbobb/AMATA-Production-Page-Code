// supabase-sync.js - Production version
(function() {
  // Constants
  const SYNC_DELAY = 15 * 1000; // 15 seconds after interaction
  const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes background check
  const CLEANUP_INTERVAL_DAYS = 2; // Clear data every 2 days
  const LAST_CLEANUP_KEY = 'last_analytics_cleanup_date';
  const URL_CLICKS_KEY = 'product_url_clicks';
  const LIGHTBOX_OPENS_KEY = 'product_lightbox_opens';
  const LAST_INTERACTION_KEY = 'last_product_interaction';
  const SYNCED_STATE_KEY = 'product_analytics_synced_state';
  
  // Supabase configuration - Updated with correct values
  const SUPABASE_URL = 'https://twvwpdzcgtgyysxntill.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dndwZHpjZ3RneXlzeG50aWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NTg1MjUsImV4cCI6MjA2MjMzNDUyNX0.8PMguWXxjTZ_9Fjn-mlNIQ01bBLJvVHHN00_R7oWl7c';
  
  // Extract product category
  function getProductCategory(productId) {
    const productIdLower = productId.toLowerCase();
    if (productIdLower.includes('sports')) return 'กีฬา';
    else if (productIdLower.includes('polo')) return 'เสื้อโปโล';
    else if (productIdLower.includes('tshirt')) return 'เสื้อยืด';
    else if (productIdLower.includes('printing')) return 'สิ่งพิมพ์';
    else return 'อื่นๆ';
  }
  
  // Function to make Supabase API requests
  async function createSupabaseRequest(path, method, data) {
    try {
      const response = await fetch(`${SUPABASE_URL}${path}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: data ? JSON.stringify(data) : undefined
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Supabase request failed:', errorText);
        return { ok: false, status: response.status, error: errorText };
      }
      
      return { ok: true, status: response.status };
    } catch (error) {
      console.error('Fetch error:', error);
      return { ok: false, error: error.message };
    }
  }
  
  // Get the last synced state to prevent duplicate uploads
  function getLastSyncedState() {
    const storedState = localStorage.getItem(SYNCED_STATE_KEY);
    if (storedState) {
      try {
        return JSON.parse(storedState);
      } catch (e) {
        console.error('Error parsing synced state:', e);
      }
    }
    return {
      urlClicks: {},
      lightboxOpens: {}
    };
  }
  
  // Save current sync state
  function saveSyncState(urlClicks, lightboxOpens) {
    const state = {
      urlClicks: urlClicks || {},
      lightboxOpens: lightboxOpens || {}
    };
    localStorage.setItem(SYNCED_STATE_KEY, JSON.stringify(state));
  }
  
  // Set up interaction observer to detect product interactions
  function setupInteractionObserver() {
    // Listen for URL clicks
    document.addEventListener('urlClickTracked', function(e) {
      localStorage.setItem(LAST_INTERACTION_KEY, Date.now().toString());
      scheduleSync();
    });
    
    // Listen for lightbox opens
    document.addEventListener('lightboxOpenTracked', function(e) {
      localStorage.setItem(LAST_INTERACTION_KEY, Date.now().toString());
      scheduleSync();
    });
    
    // Check if productAnalytics object exists and hook into it
    if (window.productAnalytics) {
      // Original trackUrlClick function - add event dispatch
      const originalTrackUrlClick = productAnalytics.trackUrlClick;
      if (originalTrackUrlClick && typeof originalTrackUrlClick === 'function') {
        productAnalytics.trackUrlClick = function(productId) {
          const result = originalTrackUrlClick.call(this, productId);
          document.dispatchEvent(new CustomEvent('urlClickTracked', { detail: { productId } }));
          return result;
        };
      }
      
      // Original trackLightboxOpen function - add event dispatch
      const originalTrackLightboxOpen = productAnalytics.trackLightboxOpen;
      if (originalTrackLightboxOpen && typeof originalTrackLightboxOpen === 'function') {
        productAnalytics.trackLightboxOpen = function(productId) {
          const result = originalTrackLightboxOpen.call(this, productId);
          document.dispatchEvent(new CustomEvent('lightboxOpenTracked', { detail: { productId } }));
          return result;
        };
      }
    }
  }
  
  // Schedule a sync after delay
  let syncTimeout = null;
  function scheduleSync() {
    // Clear existing timeout if any
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }
    
    // Set new timeout
    syncTimeout = setTimeout(function() {
      syncToSupabase();
    }, SYNC_DELAY);
  }
  
  // Sync function - only syncs changes since last sync
  async function syncToSupabase() {
    // Get current data
    const urlData = localStorage.getItem(URL_CLICKS_KEY);
    const lightboxData = localStorage.getItem(LIGHTBOX_OPENS_KEY);
    
    if (!urlData && !lightboxData) {
      return;
    }
    
    // Parse data
    const currentUrlClicks = urlData ? JSON.parse(urlData) : {};
    const currentLightboxOpens = lightboxData ? JSON.parse(lightboxData) : {};
    
    // Get last synced state
    const lastSyncedState = getLastSyncedState();
    
    // Prepare data to send (only new or changed data)
    const batchData = [];
    
    // Process URL clicks - only send new/changed data
    Object.entries(currentUrlClicks).forEach(([productId, data]) => {
      const lastSyncedClicks = (lastSyncedState.urlClicks[productId]?.clicks) || 0;
      const currentClicks = data.clicks || 0;
      const newClicks = currentClicks - lastSyncedClicks;
      
      if (newClicks > 0) {
        batchData.push({
          product_id: productId,
          type: 'urlClick',
          category: getProductCategory(productId),
          count: newClicks, // Only sync the new clicks
          timestamp: data.lastClicked || new Date().toISOString()
        });
      }
    });
    
    // Process lightbox opens - only send new/changed data
    Object.entries(currentLightboxOpens).forEach(([productId, data]) => {
      const lastSyncedOpens = (lastSyncedState.lightboxOpens[productId]?.opens) || 0;
      const currentOpens = data.opens || 0;
      const newOpens = currentOpens - lastSyncedOpens;
      
      if (newOpens > 0) {
        batchData.push({
          product_id: productId,
          type: 'lightboxOpen',
          category: getProductCategory(productId),
          count: newOpens, // Only sync the new opens
          timestamp: data.lastOpened || new Date().toISOString()
        });
      }
    });
    
    if (batchData.length === 0) {
      return;
    }
    
    // Try both table paths to handle possible schema configuration
    let response;
    
    // First try with schema prefix (website_analytics.product_clicks)
    response = await createSupabaseRequest('/rest/v1/website_analytics.product_clicks', 'POST', batchData);
    
    // If that fails, try without schema prefix (product_clicks)
    if (!response.ok) {
      response = await createSupabaseRequest('/rest/v1/product_clicks', 'POST', batchData);
    }
    
    if (response.ok) {
      // Update the synced state to match current state
      saveSyncState(currentUrlClicks, currentLightboxOpens);
      localStorage.setItem('last_sync_success', new Date().toISOString());
    }
  }
  
  // Check and cleanup function - run regularly to maintain storage
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
    
    // If it's been at least 2 days since last cleanup
    if (daysSinceCleanup >= CLEANUP_INTERVAL_DAYS) {
      // First sync any pending data
      syncToSupabase();
      
      // After brief delay to allow sync to complete
      setTimeout(() => {
        // Get current data before clearing
        const urlData = localStorage.getItem(URL_CLICKS_KEY);
        const lightboxData = localStorage.getItem(LIGHTBOX_OPENS_KEY);
        
        // Create a backup of current data with date
        const backupDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        if (urlData) {
          localStorage.setItem(`product_url_clicks_backup_${backupDate}`, urlData);
        }
        if (lightboxData) {
          localStorage.setItem(`product_lightbox_opens_backup_${backupDate}`, lightboxData);
        }
        
        // Clear current data
        localStorage.removeItem(URL_CLICKS_KEY);
        localStorage.removeItem(LIGHTBOX_OPENS_KEY);
        localStorage.removeItem(SYNCED_STATE_KEY);
        
        // Update last cleanup date
        localStorage.setItem(LAST_CLEANUP_KEY, now.toISOString());
      }, 5000); // 5-second delay to allow sync to complete
    }
  }
  
  // Initialize
  function init() {
    // Set up interaction observer
    setupInteractionObserver();
    
    // Check if there was a recent interaction
    const lastInteraction = localStorage.getItem(LAST_INTERACTION_KEY);
    if (lastInteraction) {
      const timeSinceInteraction = Date.now() - parseInt(lastInteraction);
      if (timeSinceInteraction < SYNC_DELAY) {
        // Schedule sync for remaining time
        const remainingTime = Math.max(0, SYNC_DELAY - timeSinceInteraction);
        setTimeout(syncToSupabase, remainingTime);
      } else {
        // Sync immediately if it's been a while
        syncToSupabase();
      }
    }
    
    // Run cleanup check
    checkAndCleanupData();
    
    // Set up periodic sync and cleanup
    setInterval(syncToSupabase, SYNC_INTERVAL);
    setInterval(checkAndCleanupData, 12 * 60 * 60 * 1000); // Check cleanup twice daily
  }
  
  // Start the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();