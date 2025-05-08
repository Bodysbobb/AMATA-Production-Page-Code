// Use the exact environment variables you already have
const SHEET_ID = '{{ site.env.GOOGLE_SHEET_ID }}';
const SERVICE_ACCOUNT = '{{ site.env.GOOGLE_SERVICE_ACCOUNT }}';
const SYNC_INTERVAL = 15 * 1000;

// Extract product category function (reusing your existing one)
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
  // The key issue: Chrome and Edge have separate localStorage
  // We need to sync from the current browser to Google Sheets
  const urlData = localStorage.getItem('product_url_clicks');
  const lightboxData = localStorage.getItem('product_lightbox_opens');
  
  if (!urlData && !lightboxData) return;
  
  // Parse data
  const urlClicks = urlData ? JSON.parse(urlData) : {};
  const lightboxOpens = lightboxData ? JSON.parse(lightboxData) : {};
  
  // Get all unique product IDs
  const productIds = [...new Set([
    ...Object.keys(urlClicks),
    ...Object.keys(lightboxOpens)
  ])];
  
  if (productIds.length === 0) return;
  
  // Create rows
  const rows = [];
  const timestamp = new Date().toISOString();
  
  productIds.forEach(productId => {
    const category = getProductCategory(productId);
    const urlClickCount = urlClicks[productId] ? urlClicks[productId].clicks : 0;
    const lastUrlClick = urlClicks[productId] && urlClicks[productId].lastClicked ? urlClicks[productId].lastClicked : '';
    const lightboxOpenCount = lightboxOpens[productId] ? lightboxOpens[productId].opens : 0;
    const lastLightboxOpen = lightboxOpens[productId] && lightboxOpens[productId].lastOpened ? lightboxOpens[productId].lastOpened : '';
    
    rows.push([
      timestamp,
      productId,
      category,
      urlClickCount,
      lastUrlClick,
      lightboxOpenCount,
      lastLightboxOpen,
      urlClickCount + lightboxOpenCount
    ]);
  });
  
  // Create request body
  const requestBody = {
    values: rows
  };

  // Use your SERVICE_ACCOUNT directly as you've configured it
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/ProductAnalytics!A:H:append?valueInputOption=RAW`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_ACCOUNT}`
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error(`Failed to sync: ${text}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Analytics synced successfully');
  })
  .catch(error => {
    console.error('Sync error:', error);
  });
}

// Sync on page load, periodically, and when leaving
document.addEventListener('DOMContentLoaded', () => setTimeout(syncAnalyticsToSheet, 5000));
setInterval(syncAnalyticsToSheet, SYNC_INTERVAL);
window.addEventListener('beforeunload', syncAnalyticsToSheet);