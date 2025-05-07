---
title: Product Analytics Dashboard
layout: admin
permalink: /admins/ProductAnalytics/
navbar_logo_one: /assets/img/page_logo/amata_main_logo.webp
lang: "th"
---

<style>
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin: 30px 0;
  }
  
  .stat-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .url-stats .stat-value {
    color: #3498db;
  }
  
  .lightbox-stats .stat-value {
    color: #9b59b6;
  }
  
  .total-stats .stat-value {
    color: #2ecc71;
  }
  
  .stat-label {
    color: #7f8c8d;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin: 20px 0;
  }
  
  .btn {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn:hover {
    opacity: 0.9;
  }
  
  .btn-primary {
    background-color: #3498db;
    color: white;
  }
  
  .btn-warning {
    background-color: #f39c12;
    color: white;
  }
  
  .btn-danger {
    background-color: #e74c3c;
    color: white;
  }
  
  .btn-sm {
    padding: 5px 10px;
    font-size: 12px;
  }
  
  .analytics-tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
  }
  
  .tab-button {
    padding: 10px 20px;
    background-color: #f8f9fa;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.2s;
  }
  
  .tab-button.active {
    border-bottom-color: #3498db;
    font-weight: 600;
    color: #3498db;
  }
  
  .tab-content {
    display: none;
  }
  
  .tab-content.active {
    display: block;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
  }
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #555;
  }
  
  td {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  tr:hover {
    background-color: #f9f9f9;
  }
  
  .no-data-message {
    text-align: center;
    padding: 30px;
    color: #7f8c8d;
    font-style: italic;
  }
  
  .progress-bar {
    height: 6px;
    background-color: #ecf0f1;
    border-radius: 3px;
    margin-top: 8px;
    overflow: hidden;
  }
  
  .progress-bar-fill {
    height: 100%;
    background-color: #3498db;
  }
  
  .lightbox-fill {
    background-color: #9b59b6;
  }
  
  .click-type {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 500;
    margin-right: 6px;
  }
  
  .url-type {
    background-color: rgba(52, 152, 219, 0.1);
    color: #3498db;
  }
  
  .lightbox-type {
    background-color: rgba(155, 89, 182, 0.1);
    color: #9b59b6;
  }
</style>

<div class="dashboard-container">
  <h1>Product Analytics Dashboard</h1>
  
  <div class="analytics-tabs">
    <button class="tab-button active" data-tab="overview">Overview</button>
    <button class="tab-button" data-tab="url-clicks">URL Click Stats</button>
    <button class="tab-button" data-tab="lightbox-clicks">Lightbox Stats</button>
    <button class="tab-button" data-tab="combined">Combined Stats</button>
  </div>
  
  <!-- Tab: Overview -->
  <div class="tab-content active" id="overview">
    <div class="stats-grid">
      <div class="stat-card url-stats">
        <div class="stat-label">Total URL Clicks</div>
        <div class="stat-value" id="total-url-clicks">0</div>
      </div>
      <div class="stat-card lightbox-stats">
        <div class="stat-label">Total Lightbox Opens</div>
        <div class="stat-value" id="total-lightbox-opens">0</div>
      </div>
      <div class="stat-card total-stats">
        <div class="stat-label">Total Products</div>
        <div class="stat-value" id="total-products">0</div>
      </div>
    </div>
    
    <div class="button-group">
      <button id="refresh-btn" class="btn btn-primary">Refresh Data</button>
      <button id="export-btn" class="btn btn-warning">Export CSV</button>
      <button id="reset-all-btn" class="btn btn-danger">Reset All Data</button>
    </div>
    
    <h2>Top 5 Products</h2>
    <table id="top-products-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>URL Clicks</th>
          <th>Lightbox Opens</th>
          <th>Total Interactions</th>
        </tr>
      </thead>
      <tbody id="top-products-body">
        <!-- Will be filled by JavaScript -->
      </tbody>
    </table>
  </div>
  
  <!-- Tab: URL Click Stats -->
  <div class="tab-content" id="url-clicks">
    <h2>URL Click Statistics</h2>
    <p>Tracking of "Copy URL" button clicks for each product</p>
    
    <table id="url-clicks-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>URL Clicks</th>
          <th>Last Clicked</th>
          <th>Performance</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="url-clicks-body">
        <!-- Will be filled by JavaScript -->
      </tbody>
    </table>
  </div>
  
  <!-- Tab: Lightbox Stats -->
  <div class="tab-content" id="lightbox-clicks">
    <h2>Lightbox Open Statistics</h2>
    <p>Tracking of lightbox openings for each product</p>
    
    <table id="lightbox-opens-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Lightbox Opens</th>
          <th>Last Opened</th>
          <th>Performance</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="lightbox-opens-body">
        <!-- Will be filled by JavaScript -->
      </tbody>
    </table>
  </div>
  
  <!-- Tab: Combined Stats -->
  <div class="tab-content" id="combined">
    <h2>Combined Statistics</h2>
    <p>All product interactions (URL clicks and lightbox opens)</p>
    
    <table id="combined-stats-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>URL Clicks</th>
          <th>Lightbox Opens</th>
          <th>Total</th>
          <th>Conversion Rate</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="combined-stats-body">
        <!-- Will be filled by JavaScript -->
      </tbody>
    </table>
  </div>
</div>

<script>
  // Constants for localStorage keys
  const URL_CLICKS_KEY = 'product_url_clicks';
  const LIGHTBOX_OPENS_KEY = 'product_lightbox_opens';
  
  // DOM Elements
  const totalUrlClicksElement = document.getElementById('total-url-clicks');
  const totalLightboxOpensElement = document.getElementById('total-lightbox-opens');
  const totalProductsElement = document.getElementById('total-products');
  const topProductsTableBody = document.getElementById('top-products-body');
  const urlClicksTableBody = document.getElementById('url-clicks-body');
  const lightboxOpensTableBody = document.getElementById('lightbox-opens-body');
  const combinedStatsTableBody = document.getElementById('combined-stats-body');
  
  // Buttons
  const refreshButton = document.getElementById('refresh-btn');
  const exportButton = document.getElementById('export-btn');
  const resetAllButton = document.getElementById('reset-all-btn');
  const tabButtons = document.querySelectorAll('.tab-button');
  
  // Tab switching
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      
      // Add active class to clicked tab
      button.classList.add('active');
      const tabId = button.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Data functions
  function getUrlClickData() {
    const data = localStorage.getItem(URL_CLICKS_KEY);
    return data ? JSON.parse(data) : {};
  }
  
  function getLightboxOpenData() {
    const data = localStorage.getItem(LIGHTBOX_OPENS_KEY);
    return data ? JSON.parse(data) : {};
  }
  
  function resetProduct(productId, dataType) {
    if (dataType === 'url' || dataType === 'all') {
      const urlData = getUrlClickData();
      if (urlData[productId]) {
        urlData[productId] = {
          clicks: 0,
          lastClicked: null
        };
        localStorage.setItem(URL_CLICKS_KEY, JSON.stringify(urlData));
      }
    }
    
    if (dataType === 'lightbox' || dataType === 'all') {
      const lightboxData = getLightboxOpenData();
      if (lightboxData[productId]) {
        lightboxData[productId] = {
          opens: 0,
          lastOpened: null
        };
        localStorage.setItem(LIGHTBOX_OPENS_KEY, JSON.stringify(lightboxData));
      }
    }
  }
  
  function resetAllData() {
    if (confirm('Are you sure you want to reset ALL analytics data? This cannot be undone.')) {
      localStorage.removeItem(URL_CLICKS_KEY);
      localStorage.removeItem(LIGHTBOX_OPENS_KEY);
      loadData();
    }
  }
  
  function exportToCsv() {
    const urlData = getUrlClickData();
    const lightboxData = getLightboxOpenData();
    
    // Get all product IDs from both datasets
    const productIds = new Set([
      ...Object.keys(urlData),
      ...Object.keys(lightboxData)
    ]);
    
    if (productIds.size === 0) {
      alert('No data to export.');
      return;
    }
    
    // Create CSV content
    let csvContent = 'Product,URL Clicks,Last URL Click,Lightbox Opens,Last Lightbox Open,Total Interactions\n';
    
    productIds.forEach(productId => {
      const urlClicks = urlData[productId] ? urlData[productId].clicks : 0;
      const lastUrlClick = urlData[productId] && urlData[productId].lastClicked ? urlData[productId].lastClicked : '';
      const lightboxOpens = lightboxData[productId] ? lightboxData[productId].opens : 0;
      const lastLightboxOpen = lightboxData[productId] && lightboxData[productId].lastOpened ? lightboxData[productId].lastOpened : '';
      const totalInteractions = urlClicks + lightboxOpens;
      
      csvContent += `"${productId}",${urlClicks},"${lastUrlClick}",${lightboxOpens},"${lastLightboxOpen}",${totalInteractions}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_analytics.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Load and display data
  function loadData() {
    const urlData = getUrlClickData();
    const lightboxData = getLightboxOpenData();
    
    // Get all product IDs from both datasets
    const productIds = new Set([
      ...Object.keys(urlData),
      ...Object.keys(lightboxData)
    ]);
    
    // Calculate summary stats
    const totalUrlClicks = Object.values(urlData).reduce((sum, product) => sum + (product.clicks || 0), 0);
    const totalLightboxOpens = Object.values(lightboxData).reduce((sum, product) => sum + (product.opens || 0), 0);
    
    // Update summary displays
    totalUrlClicksElement.textContent = totalUrlClicks;
    totalLightboxOpensElement.textContent = totalLightboxOpens;
    totalProductsElement.textContent = productIds.size;
    
    // Create combined data for tables
    const combinedData = Array.from(productIds).map(productId => {
      const urlClicks = urlData[productId] ? urlData[productId].clicks || 0 : 0;
      const lastUrlClick = urlData[productId] && urlData[productId].lastClicked ? new Date(urlData[productId].lastClicked) : null;
      
      const lightboxOpens = lightboxData[productId] ? lightboxData[productId].opens || 0 : 0;
      const lastLightboxOpen = lightboxData[productId] && lightboxData[productId].lastOpened ? new Date(lightboxData[productId].lastOpened) : null;
      
      return {
        productId,
        urlClicks,
        lastUrlClick,
        lightboxOpens,
        lastLightboxOpen,
        totalInteractions: urlClicks + lightboxOpens,
        conversionRate: lightboxOpens > 0 ? (urlClicks / lightboxOpens).toFixed(2) : 'N/A'
      };
    });
    
    // Sort by total interactions (descending)
    combinedData.sort((a, b) => b.totalInteractions - a.totalInteractions);
    
    // Update top products table
    topProductsTableBody.innerHTML = '';
    
    if (combinedData.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 4;
      cell.className = 'no-data-message';
      cell.textContent = 'No data available yet';
      row.appendChild(cell);
      topProductsTableBody.appendChild(row);
    } else {
      // Get top 5 products
      const topProducts = combinedData.slice(0, 5);
      
      topProducts.forEach(product => {
        const row = document.createElement('tr');
        
        const productCell = document.createElement('td');
        productCell.textContent = product.productId;
        productCell.title = product.productId; // For tooltip on long names
        row.appendChild(productCell);
        
        const urlClicksCell = document.createElement('td');
        urlClicksCell.textContent = product.urlClicks;
        row.appendChild(urlClicksCell);
        
        const lightboxOpensCell = document.createElement('td');
        lightboxOpensCell.textContent = product.lightboxOpens;
        row.appendChild(lightboxOpensCell);
        
        const totalCell = document.createElement('td');
        totalCell.textContent = product.totalInteractions;
        row.appendChild(totalCell);
        
        topProductsTableBody.appendChild(row);
      });
    }
    
    // Update URL clicks table
    urlClicksTableBody.innerHTML = '';
    
    if (Object.keys(urlData).length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.className = 'no-data-message';
      cell.textContent = 'No URL click data available yet';
      row.appendChild(cell);
      urlClicksTableBody.appendChild(row);
    } else {
      // Sort by URL clicks (descending)
      const sortedUrlData = combinedData.sort((a, b) => b.urlClicks - a.urlClicks);
      
      // Find max clicks for relative bar width
      const maxUrlClicks = sortedUrlData[0].urlClicks;
      
      sortedUrlData.forEach(product => {
        if (product.urlClicks === 0) return; // Skip products with no URL clicks
        
        const row = document.createElement('tr');
        
        const productCell = document.createElement('td');
        productCell.textContent = product.productId;
        productCell.title = product.productId;
        row.appendChild(productCell);
        
        const clicksCell = document.createElement('td');
        clicksCell.textContent = product.urlClicks;
        row.appendChild(clicksCell);
        
        const lastClickedCell = document.createElement('td');
        lastClickedCell.textContent = product.lastUrlClick ? product.lastUrlClick.toLocaleString() : '-';
        row.appendChild(lastClickedCell);
        
        const performanceCell = document.createElement('td');
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-bar-fill';
        progressFill.style.width = `${(product.urlClicks / maxUrlClicks) * 100}%`;
        progressBar.appendChild(progressFill);
        performanceCell.appendChild(progressBar);
        row.appendChild(performanceCell);
        
        const actionsCell = document.createElement('td');
        const resetButton = document.createElement('button');
        resetButton.className = 'btn btn-danger btn-sm';
        resetButton.textContent = 'Reset';
        resetButton.addEventListener('click', function() {
          if (confirm(`Reset URL click count for "${product.productId}"?`)) {
            resetProduct(product.productId, 'url');
            loadData();
          }
        });
        actionsCell.appendChild(resetButton);
        row.appendChild(actionsCell);
        
        urlClicksTableBody.appendChild(row);
      });
    }
    
    // Update lightbox opens table
    lightboxOpensTableBody.innerHTML = '';
    
    if (Object.keys(lightboxData).length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.className = 'no-data-message';
      cell.textContent = 'No lightbox open data available yet';
      row.appendChild(cell);
      lightboxOpensTableBody.appendChild(row);
    } else {
      // Sort by lightbox opens (descending)
      const sortedLightboxData = combinedData.sort((a, b) => b.lightboxOpens - a.lightboxOpens);
      
      // Find max opens for relative bar width
      const maxLightboxOpens = sortedLightboxData[0].lightboxOpens;
      
      sortedLightboxData.forEach(product => {
        if (product.lightboxOpens === 0) return; // Skip products with no lightbox opens
        
        const row = document.createElement('tr');
        
        const productCell = document.createElement('td');
        productCell.textContent = product.productId;
        productCell.title = product.productId;
        row.appendChild(productCell);
        
        const opensCell = document.createElement('td');
        opensCell.textContent = product.lightboxOpens;
        row.appendChild(opensCell);
        
        const lastOpenedCell = document.createElement('td');
        lastOpenedCell.textContent = product.lastLightboxOpen ? product.lastLightboxOpen.toLocaleString() : '-';
        row.appendChild(lastOpenedCell);
        
        const performanceCell = document.createElement('td');
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-bar-fill lightbox-fill';
        progressFill.style.width = `${(product.lightboxOpens / maxLightboxOpens) * 100}%`;
        progressBar.appendChild(progressFill);
        performanceCell.appendChild(progressBar);
        row.appendChild(performanceCell);
        
        const actionsCell = document.createElement('td');
        const resetButton = document.createElement('button');
        resetButton.className = 'btn btn-danger btn-sm';
        resetButton.textContent = 'Reset';
        resetButton.addEventListener('click', function() {
          if (confirm(`Reset lightbox open count for "${product.productId}"?`)) {
            resetProduct(product.productId, 'lightbox');
            loadData();
          }
        });
        actionsCell.appendChild(resetButton);
        row.appendChild(actionsCell);
        
        lightboxOpensTableBody.appendChild(row);
      });
    }
    
    // Update combined stats table
    combinedStatsTableBody.innerHTML = '';
    
    if (combinedData.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 6;
      cell.className = 'no-data-message';
      cell.textContent = 'No analytics data available yet';
      row.appendChild(cell);
      combinedStatsTableBody.appendChild(row);
    } else {
      // Sort by total interactions (descending)
      const sortedCombinedData = combinedData.sort((a, b) => b.totalInteractions - a.totalInteractions);
      
      sortedCombinedData.forEach(product => {
        const row = document.createElement('tr');
        
        const productCell = document.createElement('td');
        productCell.textContent = product.productId;
        productCell.title = product.productId;
        row.appendChild(productCell);
        
        const urlClicksCell = document.createElement('td');
        urlClicksCell.innerHTML = `<span class="click-type url-type">URL</span> ${product.urlClicks}`;
        row.appendChild(urlClicksCell);
        
        const lightboxOpensCell = document.createElement('td');
        lightboxOpensCell.innerHTML = `<span class="click-type lightbox-type">LB</span> ${product.lightboxOpens}`;
        row.appendChild(lightboxOpensCell);
        
        const totalCell = document.createElement('td');
        totalCell.textContent = product.totalInteractions;
        row.appendChild(totalCell);
        
        const conversionCell = document.createElement('td');
        if (product.lightboxOpens > 0) {
          const rate = (product.urlClicks / product.lightboxOpens).toFixed(2);
          conversionCell.textContent = `${rate}x`;
        } else {
          conversionCell.textContent = '-';
        }
        row.appendChild(conversionCell);
        
        const actionsCell = document.createElement('td');
        const resetButton = document.createElement('button');
        resetButton.className = 'btn btn-danger btn-sm';
        resetButton.textContent = 'Reset All';
        resetButton.addEventListener('click', function() {
          if (confirm(`Reset all stats for "${product.productId}"?`)) {
            resetProduct(product.productId, 'all');
            loadData();
          }
        });
        actionsCell.appendChild(resetButton);
        row.appendChild(actionsCell);
        
        combinedStatsTableBody.appendChild(row);
      });
    }
  }
  
  // Event listeners
  refreshButton.addEventListener('click', loadData);
  exportButton.addEventListener('click', exportToCsv);
  resetAllButton.addEventListener('click', resetAllData);
  
  // Initialize on load
  document.addEventListener('DOMContentLoaded', loadData);
</script>