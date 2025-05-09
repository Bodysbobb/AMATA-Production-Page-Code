// supabase-sync.js - With Thailand timestamp (UTC+7)
(function() {
  // Constants
  const URL_CLICKS_KEY = 'product_url_clicks';
  const LIGHTBOX_OPENS_KEY = 'product_lightbox_opens';
  const CLEANUP_INTERVAL_DAYS = 3; // Clear data every 3 days
  const LAST_CLEANUP_KEY = 'last_analytics_cleanup_date';
  const LAST_SYNC_KEY = 'last_supabase_sync_state';
  
  // Supabase configuration
  const SUPABASE_URL = 'https://twvwpdzcgtgyysxntill.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dndwZHpjZ3RneXlzeG50aWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NTg1MjUsImV4cCI6MjA2MjMzNDUyNX0.8PMguWXxjTZ_9Fjn-mlNIQ01bBLJvVHHN00_R7oWl7c';
  
  // Get Thailand timestamp (UTC+7)
  function getThailandTimestamp() {
    const now = new Date();
    // Get the current time adjusted to UTC+7
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const thailandTime = new Date(utcTime + (7 * 3600000));
    return thailandTime.toISOString();
  }
  
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
  
  // Check if product has changed since last sync
  function hasChanged(productId, currentData, lastSyncData, type) {
    if (!lastSyncData[productId]) return true;
    
    const currentCount = type === 'url' ? currentData[productId].clicks : currentData[productId].opens;
    const lastCount = type === 'url' ? 
                     (lastSyncData[productId].clicks || 0) : 
                     (lastSyncData[productId].opens || 0);
    
    return currentCount > lastCount;
  }
  
  // Sync function - works like the Google Sheets version
  async function syncToSupabase() {
    // Get current data
    const urlData = localStorage.getItem(URL_CLICKS_KEY);
    const lightboxData = localStorage.getItem(LIGHTBOX_OPENS_KEY);
    
    if (!urlData && !lightboxData) {
      return;
    }
    
    // Parse data
    const urlClicks = urlData ? JSON.parse(urlData) : {};
    const lightboxOpens = lightboxData ? JSON.parse(lightboxData) : {};
    
    // Get last synced state
    const lastSyncState = getLastSyncState();
    
    // Find products that have changed since last sync
    const changedProducts = new Set();
    
    // Check URL clicks
    Object.keys(urlClicks).forEach(productId => {
      if (hasChanged(productId, urlClicks, lastSyncState.urlClicks, 'url')) {
        changedProducts.add(productId);
      }
    });
    
    // Check lightbox opens
    Object.keys(lightboxOpens).forEach(productId => {
      if (hasChanged(productId, lightboxOpens, lastSyncState.lightboxOpens, 'lightbox')) {
        changedProducts.add(productId);
      }
    });
    
    if (changedProducts.size === 0) {
      return;
    }
    
    // Prepare batch of data to upload
    const batchData = [];
    
    // For each changed product, prepare data
    changedProducts.forEach(productId => {
      const category = getProductCategory(productId);
      
      // Add URL click events if they exist and have changed
      if (urlClicks[productId]) {
        const lastSyncedClicks = lastSyncState.urlClicks[productId]?.clicks || 0;
        const currentClicks = urlClicks[productId].clicks || 0;
        const newClicks = currentClicks - lastSyncedClicks;
        
        if (newClicks > 0) {
          batchData.push({
            product_id: productId,
            type: 'urlClick',
            category: category,
            count: newClicks,
            timestamp: urlClicks[productId].lastClicked || getThailandTimestamp()
          });
        }
      }
      
      // Add lightbox open events if they exist and have changed
      if (lightboxOpens[productId]) {
        const lastSyncedOpens = lastSyncState.lightboxOpens[productId]?.opens || 0;
        const currentOpens = lightboxOpens[productId].opens || 0;
        const newOpens = currentOpens - lastSyncedOpens;
        
        if (newOpens > 0) {
          batchData.push({
            product_id: productId,
            type: 'lightboxOpen',
            category: category,
            count: newOpens,
            timestamp: lightboxOpens[productId].lastOpened || getThailandTimestamp()
          });
        }
      }
    });
    
    if (batchData.length === 0) {
      return;
    }
    
    try {
      // Send to Supabase
      const response = await fetch(`${SUPABASE_URL}/rest/v1/product_clicks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(batchData)
      });
      
      if (response.ok) {
        // Save current state as last synced state
        saveCurrentAsLastSync(urlClicks, lightboxOpens);
      } else {
        console.error('Failed to sync to Supabase:', await response.text());
      }
    } catch (error) {
      console.error('Error syncing to Supabase:', error);
    }
  }
  
  // Check and cleanup function
  function checkAndCleanupData() {
    // Get last cleanup date
    const lastCleanupDate = localStorage.getItem(LAST_CLEANUP_KEY);
    
    // If never cleaned up before, set initial date and exit
    if (!lastCleanupDate) {
      localStorage.setItem(LAST_CLEANUP_KEY, getThailandTimestamp());
      return;
    }
    
    // Calculate days since last cleanup
    const lastCleanup = new Date(lastCleanupDate);
    const now = new Date();
    const daysSinceCleanup = Math.floor((now - lastCleanup) / (1000 * 60 * 60 * 24));
    
    // If it's been at least 3 days since last cleanup
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
        localStorage.removeItem(LAST_SYNC_KEY);
        
        // Update last cleanup date
        localStorage.setItem(LAST_CLEANUP_KEY, getThailandTimestamp());
      }, 5000); // 5-second delay to allow sync to complete
    }
  }
  
  // Initialize
  function init() {
    // Run sync when page loads (with no delay)
    syncToSupabase();
    
    // Run cleanup check
    checkAndCleanupData();
    
    // Run sync every 30 seconds to catch any new data quickly
    setInterval(syncToSupabase, 30 * 1000);
    
    // Check for cleanup once a day
    setInterval(checkAndCleanupData, 24 * 60 * 60 * 1000);
  }
  
  // Start the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();