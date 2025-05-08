// Simple script to sync localStorage data to Google Sheets periodically
// ONLY ADD THIS TO ADMIN PANEL PAGES

(function() {
  // Google Apps Script web app URL
  const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzg-r9e3MaNneQjlV7-56tsW9OjPOxgwSQRp5XpvrtN9M-iNhm9Jn272UMvobTnK0cZ/exec';
  const SYNC_INTERVAL = 30 * 1000; // 30 minutes
  
  // Extract product category (using your existing function)
  function getProductCategory(productId) {
    const productIdLower = productId.toLowerCase();
    if (productIdLower.includes('sports')) return 'กีฬา';
    else if (productIdLower.includes('polo')) return 'เสื้อโปโล';
    else if (productIdLower.includes('tshirt')) return 'เสื้อยืด';
    else if (productIdLower.includes('printing')) return 'สิ่งพิมพ์';
    else return 'อื่นๆ';
  }

  // Sync function - reads from localStorage and sends to Google Sheets
  function syncToSheet() {
    // Get raw localStorage data using string keys
    const urlData = localStorage.getItem('product_url_clicks');
    const lightboxData = localStorage.getItem('product_lightbox_opens');
    
    if (!urlData && !lightboxData) return;
    
    // Parse data
    const urlClicks = urlData ? JSON.parse(urlData) : {};
    const lightboxOpens = lightboxData ? JSON.parse(lightboxData) : {};
    
    // Get all product IDs
    const productIds = [...new Set([
      ...Object.keys(urlClicks),
      ...Object.keys(lightboxOpens)
    ])];
    
    if (productIds.length === 0) return;
    
    console.log('Syncing ' + productIds.length + ' products to Google Sheet');
    
    // For each product, create a row and send it
    productIds.forEach(productId => {
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
      });
    });
    
    console.log('Data sync to Google Sheet completed');
  }

  // Run sync when page loads (with delay)
  console.log('Admin panel sync script loaded');
  setTimeout(syncToSheet, 5000);
  
  // Run sync periodically
  setInterval(syncToSheet, SYNC_INTERVAL);
})();