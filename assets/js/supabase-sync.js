// supabase-sync.js - One row per interaction
(function() {
  // Constants
  const URL_CLICKS_KEY = 'product_url_clicks';
  const LIGHTBOX_OPENS_KEY = 'product_lightbox_opens';
  const CLEANUP_INTERVAL_DAYS = 3; // Clear data every 3 days
  const LAST_CLEANUP_KEY = 'last_analytics_cleanup_date';
  const PROCESSED_INTERACTIONS_KEY = 'processed_supabase_interactions';
  
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
  
  // Get processed interactions to avoid duplicates
  function getProcessedInteractions() {
    const processed = localStorage.getItem(PROCESSED_INTERACTIONS_KEY);
    return processed ? JSON.parse(processed) : {
      urlClicks: {},
      lightboxOpens: {}
    };
  }
  
  // Mark interactions as processed
  function markAsProcessed(urlClicks, lightboxOpens) {
    const processed = getProcessedInteractions();
    
    // Update URL clicks
    if (urlClicks) {
      Object.entries(urlClicks).forEach(([productId, data]) => {
        processed.urlClicks[productId] = {
          lastProcessed: data.lastClicked,
          count: data.clicks
        };
      });
    }
    
    // Update lightbox opens
    if (lightboxOpens) {
      Object.entries(lightboxOpens).forEach(([productId, data]) => {
        processed.lightboxOpens[productId] = {
          lastProcessed: data.lastOpened,
          count: data.opens
        };
      });
    }
    
    // Save updated processed state
    localStorage.setItem(PROCESSED_INTERACTIONS_KEY, JSON.stringify(processed));
  }
  
  // Extract interactions that haven't been processed yet
  function getNewInteractions() {
    // Get current data
    const urlData = localStorage.getItem(URL_CLICKS_KEY);
    const lightboxData = localStorage.getItem(LIGHTBOX_OPENS_KEY);
    
    if (!urlData && !lightboxData) {
      return { newInteractions: [], currentUrlClicks: {}, currentLightboxOpens: {} };
    }
    
    // Parse data
    const currentUrlClicks = urlData ? JSON.parse(urlData) : {};
    const currentLightboxOpens = lightboxData ? JSON.parse(lightboxData) : {};
    
    // Get previously processed interactions
    const processed = getProcessedInteractions();
    
    // Prepare list of new interactions
    const newInteractions = [];
    
    // Process URL clicks
    Object.entries(currentUrlClicks).forEach(([productId, data]) => {
      const processedCount = processed.urlClicks[productId]?.count || 0;
      const currentCount = data.clicks || 0;
      const newCount = currentCount - processedCount;
      
      // Add an entry for each new click
      for (let i = 0; i < newCount; i++) {
        newInteractions.push({
          product_id: productId,
          type: 'urlClick',
          category: getProductCategory(productId),
          count: 1,
          timestamp: data.lastClicked || getThailandTimestamp()
        });
      }
    });
    
    // Process lightbox opens
    Object.entries(currentLightboxOpens).forEach(([productId, data]) => {
      const processedCount = processed.lightboxOpens[productId]?.count || 0;
      const currentCount = data.opens || 0;
      const newCount = currentCount - processedCount;
      
      // Add an entry for each new open
      for (let i = 0; i < newCount; i++) {
        newInteractions.push({
          product_id: productId,
          type: 'lightboxOpen',
          category: getProductCategory(productId),
          count: 1,
          timestamp: data.lastOpened || getThailandTimestamp()
        });
      }
    });
    
    return { 
      newInteractions,
      currentUrlClicks,
      currentLightboxOpens
    };
  }
  
  // Sync function
  async function syncToSupabase() {
    try {
      // Get new interactions
      const { newInteractions, currentUrlClicks, currentLightboxOpens } = getNewInteractions();
      
      if (newInteractions.length === 0) {
        return;
      }
      
      // Send to Supabase
      const response = await fetch(`${SUPABASE_URL}/rest/v1/product_clicks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(newInteractions)
      });
      
      if (response.ok) {
        // Mark as processed
        markAsProcessed(currentUrlClicks, currentLightboxOpens);
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
        const backupDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
        if (urlData) {
          localStorage.setItem(`product_url_clicks_backup_${backupDate}`, urlData);
        }
        if (lightboxData) {
          localStorage.setItem(`product_lightbox_opens_backup_${backupDate}`, lightboxData);
        }
        
        // Clear current data
        localStorage.removeItem(URL_CLICKS_KEY);
        localStorage.removeItem(LIGHTBOX_OPENS_KEY);
        localStorage.removeItem(PROCESSED_INTERACTIONS_KEY);
        
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
    
    // Run sync every 15 seconds to catch any new data quickly
    setInterval(syncToSupabase, 15 * 1000);
    
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