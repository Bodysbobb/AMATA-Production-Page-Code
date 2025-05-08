// Constants for localStorage keys
const URL_CLICKS_KEY = 'product_url_clicks';
const LIGHTBOX_OPENS_KEY = 'product_lightbox_opens';

// DOM Elements
let totalUrlClicksElement;
let totalLightboxOpensElement;
let totalProductsElement;
let topProductsTableBody;
let urlClicksTableBody;
let lightboxOpensTableBody;
let combinedStatsTableBody;
let categoryFilterSelect; // New element for category filter

// Modal Elements
let resetModal;
let closeModalBtn;
let managerPasswordInput;
let confirmResetBtn;
let cancelResetBtn;

// Buttons
let refreshButton;
let exportButton;
let resetAllButton;
let tabButtons;

// Filter state
let activeCategory = 'all'; // Track active category filter

// Initialize after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize DOM elements
  totalUrlClicksElement = document.getElementById('total-url-clicks');
  totalLightboxOpensElement = document.getElementById('total-lightbox-opens');
  totalProductsElement = document.getElementById('total-products');
  topProductsTableBody = document.getElementById('top-products-body');
  urlClicksTableBody = document.getElementById('url-clicks-body');
  lightboxOpensTableBody = document.getElementById('lightbox-opens-body');
  combinedStatsTableBody = document.getElementById('combined-stats-body');
  categoryFilterSelect = document.getElementById('category-filter'); // New category filter
  
  // Modal Elements
  resetModal = document.getElementById('reset-confirm-modal');
  closeModalBtn = document.querySelector('.close-modal');
  managerPasswordInput = document.getElementById('manager-password');
  confirmResetBtn = document.getElementById('confirm-reset');
  cancelResetBtn = document.getElementById('cancel-reset');
  
  // Buttons
  refreshButton = document.getElementById('refresh-btn');
  exportButton = document.getElementById('export-btn');
  resetAllButton = document.getElementById('reset-all-btn');
  tabButtons = document.querySelectorAll('.tab-button');
  
  // Setup event listeners
  setupEventListeners();
  
  // Load initial data
  loadData();
  
  // Load categories for filter
  loadCategories();
});

// Setup all event listeners
function setupEventListeners() {
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
  
  // Button events
  refreshButton.addEventListener('click', loadData);
  exportButton.addEventListener('click', exportToCsv);
  resetAllButton.addEventListener('click', openModal);
  
  // Category filter event
  if (categoryFilterSelect) {
    categoryFilterSelect.addEventListener('change', function() {
      activeCategory = this.value;
      loadData();
    });
  }
  
  // Modal events
  closeModalBtn.addEventListener('click', closeModal);
  cancelResetBtn.addEventListener('click', closeModal);
  confirmResetBtn.addEventListener('click', function () {
    const inputPassword = managerPasswordInput.value;
    const decodedManagerPassword = atob(window.MANAGER_PASSWORD_OBFUSCATED); // decode base64
  
    if (inputPassword === decodedManagerPassword) {
      resetAllData();
    } else {
      alert('รหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง');
      managerPasswordInput.value = '';
      managerPasswordInput.focus();
    }
  });
  
  // Close modal if clicked outside
  window.addEventListener('click', function(event) {
    if (event.target === resetModal) {
      closeModal();
    }
  });
  
  // Allow Enter key to submit password
  managerPasswordInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      confirmResetBtn.click();
    }
  });
}

// Extract category from product name
function extractCategory(productId) {
  const productIdLower = productId.toLowerCase();
  
  // Check if product name contains any of the known categories
  if (productIdLower.includes('sports')) {
    return 'กีฬา';
  } else if (productIdLower.includes('polo')) {
    return 'เสื้อโปโล';
  } else if (productIdLower.includes('tshirt')) {
    return 'เสื้อยืด';
  } else if (productIdLower.includes('printing')) {
    return 'สิ่งพิมพ์';
  } else {
    // Return 'อื่นๆ' (Other) if no match
    return 'อื่นๆ';
  }
}

// Data functions
function getUrlClickData() {
  const data = localStorage.getItem(URL_CLICKS_KEY);
  return data ? JSON.parse(data) : {};
}

function getLightboxOpenData() {
  const data = localStorage.getItem(LIGHTBOX_OPENS_KEY);
  return data ? JSON.parse(data) : {};
}

// Load available categories for filter
function loadCategories() {
  if (!categoryFilterSelect) return;
  
  const urlData = getUrlClickData();
  const lightboxData = getLightboxOpenData();
  
  // Get all product IDs from both datasets
  const productIds = new Set([
    ...Object.keys(urlData),
    ...Object.keys(lightboxData)
  ]);
  
  // Extract unique categories
  const categories = new Set(['all']);
  productIds.forEach(productId => {
    const category = extractCategory(productId);
    categories.add(category);
  });
  
  // Clear existing options
  categoryFilterSelect.innerHTML = '';
  
  // Add options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    
    if (category === 'all') {
      option.textContent = 'ทั้งหมด';
    } else {
      option.textContent = category;
    }
    
    categoryFilterSelect.appendChild(option);
  });
  
  // Set active category
  categoryFilterSelect.value = activeCategory;
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
  localStorage.removeItem(URL_CLICKS_KEY);
  localStorage.removeItem(LIGHTBOX_OPENS_KEY);
  loadData();
  closeModal();
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
    alert('ไม่มีข้อมูลที่จะส่งออก');
    return;
  }
  
  // Create CSV content - added category column
  let csvContent = 'ผลิตภัณฑ์,ประเภทสินค้า,คลิก URL,คลิก URL ล่าสุด,เปิด Lightbox,เปิด Lightbox ล่าสุด,การโต้ตอบทั้งหมด\n';
  
  productIds.forEach(productId => {
    // Skip if product doesn't match active category filter
    const category = extractCategory(productId);
    if (activeCategory !== 'all' && category !== activeCategory) {
      return;
    }
    
    const urlClicks = urlData[productId] ? urlData[productId].clicks : 0;
    const lastUrlClick = urlData[productId] && urlData[productId].lastClicked ? urlData[productId].lastClicked : '';
    const lightboxOpens = lightboxData[productId] ? lightboxData[productId].opens : 0;
    const lastLightboxOpen = lightboxData[productId] && lightboxData[productId].lastOpened ? lightboxData[productId].lastOpened : '';
    const totalInteractions = urlClicks + lightboxOpens;
    
    csvContent += `"${productId}","${category}",${urlClicks},"${lastUrlClick}",${lightboxOpens},"${lastLightboxOpen}",${totalInteractions}\n`;
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

// Modal functions
function openModal() {
  resetModal.style.display = 'block';
  managerPasswordInput.value = '';
  managerPasswordInput.focus();
}

function closeModal() {
  resetModal.style.display = 'none';
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
  
  // Create filtered product list based on category
  const filteredProducts = Array.from(productIds).filter(productId => {
    if (activeCategory === 'all') return true;
    return extractCategory(productId) === activeCategory;
  });
  
  // Calculate summary stats
  const totalUrlClicks = filteredProducts.reduce((sum, productId) => {
    return sum + (urlData[productId]?.clicks || 0);
  }, 0);
  
  const totalLightboxOpens = filteredProducts.reduce((sum, productId) => {
    return sum + (lightboxData[productId]?.opens || 0);
  }, 0);
  
  // Update summary displays
  totalUrlClicksElement.textContent = totalUrlClicks;
  totalLightboxOpensElement.textContent = totalLightboxOpens;
  totalProductsElement.textContent = filteredProducts.length;
  
  // Create combined data for tables
  const combinedData = filteredProducts.map(productId => {
    const category = extractCategory(productId);
    const urlClicks = urlData[productId] ? urlData[productId].clicks || 0 : 0;
    const lastUrlClick = urlData[productId] && urlData[productId].lastClicked ? new Date(urlData[productId].lastClicked) : null;
    
    const lightboxOpens = lightboxData[productId] ? lightboxData[productId].opens || 0 : 0;
    const lastLightboxOpen = lightboxData[productId] && lightboxData[productId].lastOpened ? new Date(lightboxData[productId].lastOpened) : null;
    
    return {
      productId,
      category,
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
    cell.colSpan = 5; // Increased colspan for new category column
    cell.className = 'no-data-message';
    cell.textContent = 'ยังไม่มีข้อมูล';
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
      
      // New category cell
      const categoryCell = document.createElement('td');
      categoryCell.textContent = product.category;
      row.appendChild(categoryCell);
      
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
  
  if (combinedData.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6; // Increased colspan for new category column
    cell.className = 'no-data-message';
    cell.textContent = 'ยังไม่มีข้อมูลการคลิก URL';
    row.appendChild(cell);
    urlClicksTableBody.appendChild(row);
  } else {
    // Sort by URL clicks (descending)
    const sortedUrlData = [...combinedData].sort((a, b) => b.urlClicks - a.urlClicks);
    
    // Find max clicks for relative bar width
    const maxUrlClicks = sortedUrlData.length > 0 ? sortedUrlData[0].urlClicks : 0;
    
    sortedUrlData.forEach(product => {
      if (product.urlClicks === 0) return; // Skip products with no URL clicks
      
      const row = document.createElement('tr');
      
      const productCell = document.createElement('td');
      productCell.textContent = product.productId;
      productCell.title = product.productId;
      row.appendChild(productCell);
      
      // New category cell
      const categoryCell = document.createElement('td');
      categoryCell.textContent = product.category;
      row.appendChild(categoryCell);
      
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
      resetButton.textContent = 'รีเซ็ต';
      resetButton.addEventListener('click', function() {
        if (confirm(`รีเซ็ตจำนวนคลิก URL สำหรับ "${product.productId}"?`)) {
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
  
  if (combinedData.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6; // Increased colspan for new category column
    cell.className = 'no-data-message';
    cell.textContent = 'ยังไม่มีข้อมูลการเปิด Lightbox';
    row.appendChild(cell);
    lightboxOpensTableBody.appendChild(row);
  } else {
    // Sort by lightbox opens (descending)
    const sortedLightboxData = [...combinedData].sort((a, b) => b.lightboxOpens - a.lightboxOpens);
    
    // Find max opens for relative bar width
    const maxLightboxOpens = sortedLightboxData.length > 0 ? sortedLightboxData[0].lightboxOpens : 0;
    
    sortedLightboxData.forEach(product => {
      if (product.lightboxOpens === 0) return; // Skip products with no lightbox opens
      
      const row = document.createElement('tr');
      
      const productCell = document.createElement('td');
      productCell.textContent = product.productId;
      productCell.title = product.productId;
      row.appendChild(productCell);
      
      // New category cell
      const categoryCell = document.createElement('td');
      categoryCell.textContent = product.category;
      row.appendChild(categoryCell);
      
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
      resetButton.textContent = 'รีเซ็ต';
      resetButton.addEventListener('click', function() {
        if (confirm(`รีเซ็ตจำนวนการเปิด Lightbox สำหรับ "${product.productId}"?`)) {
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
    cell.colSpan = 7; // Increased colspan for new category column
    cell.className = 'no-data-message';
    cell.textContent = 'ยังไม่มีข้อมูลการวิเคราะห์';
    row.appendChild(cell);
    combinedStatsTableBody.appendChild(row);
  } else {
    // Sort by total interactions (descending)
    const sortedCombinedData = [...combinedData].sort((a, b) => b.totalInteractions - a.totalInteractions);
    
    sortedCombinedData.forEach(product => {
      const row = document.createElement('tr');
      
      const productCell = document.createElement('td');
      productCell.textContent = product.productId;
      productCell.title = product.productId;
      row.appendChild(productCell);
      
      // New category cell
      const categoryCell = document.createElement('td');
      categoryCell.textContent = product.category;
      row.appendChild(categoryCell);
      
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
      resetButton.textContent = 'รีเซ็ตทั้งหมด';
      resetButton.addEventListener('click', function() {
        if (confirm(`รีเซ็ตสถิติทั้งหมดสำหรับ "${product.productId}"?`)) {
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