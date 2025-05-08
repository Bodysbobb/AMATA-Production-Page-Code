// Constants
const URL_CLICKS_KEY = 'product_url_clicks';
const LIGHTBOX_OPENS_KEY = 'product_lightbox_opens';
const SYNC_INTERVAL = 15 * 1000; 

// Google Sheets API endpoint
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets/';
const SHEET_ID = '{{ site.env.GOOGLE_SHEET_ID }}';
const API_KEY = '{{ site.env.ANALYTICS_API_KEY }}';

// Extract category from product name - using your existing function
function extractCategory(productId) {
  const productIdLower = productId.toLowerCase();
  if (productIdLower.includes('sports')) return 'กีฬา';
  else if (productIdLower.includes('polo')) return 'เสื้อโปโล';
  else if (productIdLower.includes('tshirt')) return 'เสื้อยืด';
  else if (productIdLower.includes('printing')) return 'สิ่งพิมพ์';
  else return 'อื่นๆ';
}

function syncToSheet() {
  const urlData = localStorage.getItem(URL_CLICKS_KEY);
  const lightboxData = localStorage.getItem(LIGHTBOX_OPENS_KEY);
  
  if (!urlData && !lightboxData) return;
  
  // Create rows exactly matching your current dashboard format
  const rows = [];
  const timestamp = new Date().toISOString();
  
  // Parse the data
  const urlClicks = urlData ? JSON.parse(urlData) : {};
  const lightboxOpens = lightboxData ? JSON.parse(lightboxData) : {};
  
  // Get all product IDs
  const productIds = new Set([
    ...Object.keys(urlClicks),
    ...Object.keys(lightboxOpens)
  ]);
  
  // Create rows matching your dashboard format
  productIds.forEach(productId => {
    const category = extractCategory(productId);
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
      urlClickCount + lightboxOpenCount // Total interactions
    ]);
  });
  
  if (rows.length === 0) return;
  
  // Send to Google Sheets
  const requestBody = {
    values: rows
  };
  
  fetch(`${SHEETS_API}${SHEET_ID}/values/ProductAnalytics!A:H:append?valueInputOption=RAW&key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {{ site.env.GOOGLE_SERVICE_ACCOUNT_KEY }}'
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (!response.ok) throw new Error('Failed to sync');
    console.log('Analytics synced successfully');
  })
  .catch(error => console.error('Sync error:', error));
}

// Sync periodically
setInterval(syncToSheet, SYNC_INTERVAL);

// Also sync on load and when leaving
document.addEventListener('DOMContentLoaded', () => setTimeout(syncToSheet, 5000));
window.addEventListener('beforeunload', syncToSheet);