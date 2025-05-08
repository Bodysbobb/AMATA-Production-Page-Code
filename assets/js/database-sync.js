// Constants
const URL_CLICKS_KEY = 'product_url_clicks';
const LIGHTBOX_OPENS_KEY = 'product_lightbox_opens';
const LAST_SYNC_KEY = 'last_analytics_sync';
const SYNC_INTERVAL = 30 * 60 * 1000; // 30 minutes

// Updated URL to your Google Apps Script web app
const ANALYTICS_API_URL = 'https://script.google.com/macros/s/AKfycbzg-r9e3MaNneQjlV7-56tsW9OjPOxgwSQRp5XpvrtN9M-iNhm9Jn272UMvobTnK0cZ/exec';

// Extract category from product name
function getProductCategory(productId) {
  const productIdLower = productId.toLowerCase();
  if (productIdLower.includes('sports')) return 'กีฬา';
  else if (productIdLower.includes('polo')) return 'เสื้อโปโล';
  else if (productIdLower.includes('tshirt')) return 'เสื้อยืด';
  else if (productIdLower.includes('printing')) return 'สิ่งพิมพ์';
  else return 'อื่นๆ';
}

// Main sync function
function syncAnalyticsToSheet() {
  // Get stored analytics data
  const urlData = localStorage.getItem(URL_CLICKS_KEY);
  const lightboxData = localStorage.getItem(LIGHTBOX_OPENS_KEY);
  
  if (!urlData && !lightboxData) return;
  
  // Create rows
  const rows = [];
  const timestamp = new Date().toISOString();
  
  // Parse the data
  const urlClicks = urlData ? JSON.parse(urlData) : {};
  const lightboxOpens = lightboxData ? JSON.parse(lightboxData) : {};
  
  // Get all product IDs
  const productIds = [...new Set([
    ...Object.keys(urlClicks),
    ...Object.keys(lightboxOpens)
  ])];
  
  if (productIds.length === 0) return;
  
  // Create payload for each product
  productIds.forEach(productId => {
    const category = getProductCategory(productId);
    const urlClickCount = urlClicks[productId] ? urlClicks[productId].clicks : 0;
    const lastUrlClick = urlClicks[productId] && urlClicks[productId].lastClicked ? urlClicks[productId].lastClicked : '';
    const lightboxOpenCount = lightboxOpens[productId] ? lightboxOpens[productId].opens : 0;
    const lastLightboxOpen = lightboxOpens[productId] && lightboxOpens[productId].lastOpened ? lightboxOpens[productId].lastOpened : '';
    
    const payload = {
      timestamp: timestamp,
      productId: productId,
      category: category,
      urlClicks: urlClickCount,
      lastUrlClick: lastUrlClick,
      lightboxOpens: lightboxOpenCount,
      lastLightboxOpen: lastLightboxOpen,
      totalInteractions: urlClickCount + lightboxOpenCount
    };
    
    // Send to Google Apps Script
    fetch(ANALYTICS_API_URL, {
      method: 'POST',
      mode: 'no-cors', // Important for cross-domain requests to Google Apps Script
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(() => {
      console.log(`Analytics for ${productId} synced to Google Sheets`);
      localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    })
    .catch(error => {
      console.error('Failed to sync to Google Sheets:', error);
    });
  });
}

// Run on page load (after a delay)
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(syncAnalyticsToSheet, 5000);
});

// Set up periodic sync
setInterval(syncAnalyticsToSheet, SYNC_INTERVAL);

// Sync when user leaves the page
window.addEventListener('beforeunload', syncAnalyticsToSheet);

// Logging to confirm script is loaded
console.log('Database sync script loaded with Google Apps Script integration');