---
title: วิเคราะห์สินค้า
layout: admin
permalink: /admins/ProductAnalytics/
navbar_logo_one: /assets/img/page_logo/amata_main_logo.webp
lang: "th"
admin_nav: true
admin_nav_order: 1
---

<div class="dashboard-container">
  <h1>วิเคราะห์สินค้า</h1>
  
  <div class="analytics-tabs">
    <button class="tab-button active" data-tab="overview">ภาพรวม</button>
    <button class="tab-button" data-tab="url-clicks">สถิติคลิก URL</button>
    <button class="tab-button" data-tab="lightbox-clicks">สถิติ Lightbox</button>
    <button class="tab-button" data-tab="combined">สถิติรวม</button>
  </div>
  
  <!-- Tab: Overview -->
  <div class="tab-content active" id="overview">
    <div class="stats-grid">
      <div class="stat-card url-stats">
        <div class="stat-label">คลิก URL ทั้งหมด</div>
        <div class="stat-value" id="total-url-clicks">0</div>
      </div>
      <div class="stat-card lightbox-stats">
        <div class="stat-label">เปิด Lightbox ทั้งหมด</div>
        <div class="stat-value" id="total-lightbox-opens">0</div>
      </div>
      <div class="stat-card total-stats">
        <div class="stat-label">ผลิตภัณฑ์ทั้งหมด</div>
        <div class="stat-value" id="total-products">0</div>
      </div>
    </div>
    
    <div class="filter-container">
      <label for="category-filter">กรองตามประเภทสินค้า:</label>
      <select id="category-filter" class="form-control">
        <option value="all">ทั้งหมด</option>
        <!-- Options will be populated by JavaScript -->
      </select>
    </div>
    
    <div class="button-group">
      <button id="refresh-btn" class="btn btn-primary">รีเฟรชข้อมูล</button>
      <button id="export-btn" class="btn btn-warning">ส่งออก CSV</button>
      <button id="reset-all-btn" class="btn btn-danger">รีเซ็ตข้อมูลทั้งหมด</button>
    </div>
    
    <h2>5 ผลิตภัณฑ์ยอดนิยม</h2>
    <table id="top-products-table">
      <thead>
        <tr>
          <th>ผลิตภัณฑ์</th>
          <th>ประเภทสินค้า</th>
          <th>คลิก URL</th>
          <th>เปิด Lightbox</th>
          <th>การโต้ตอบทั้งหมด</th>
        </tr>
      </thead>
      <tbody id="top-products-body">
        <!-- Will be filled by JavaScript -->
      </tbody>
    </table>
  </div>
  
  <!-- Tab: URL Click Stats -->
  <div class="tab-content" id="url-clicks">
    <h2>สถิติการคลิก URL</h2>
    <p>การติดตามการคลิกปุ่ม "คัดลอก URL" สำหรับแต่ละผลิตภัณฑ์</p>
    
    <table id="url-clicks-table">
      <thead>
        <tr>
          <th>ผลิตภัณฑ์</th>
          <th>ประเภทสินค้า</th>
          <th>คลิก URL</th>
          <th>คลิกล่าสุด</th>
          <th>ประสิทธิภาพ</th>
          <th>การดำเนินการ</th>
        </tr>
      </thead>
      <tbody id="url-clicks-body">
        <!-- Will be filled by JavaScript -->
      </tbody>
    </table>
  </div>
  
  <!-- Tab: Lightbox Stats -->
  <div class="tab-content" id="lightbox-clicks">
    <h2>สถิติการเปิด Lightbox</h2>
    <p>การติดตามการเปิด Lightbox สำหรับแต่ละผลิตภัณฑ์</p>
    
    <table id="lightbox-opens-table">
      <thead>
        <tr>
          <th>ผลิตภัณฑ์</th>
          <th>ประเภทสินค้า</th>
          <th>เปิด Lightbox</th>
          <th>เปิดล่าสุด</th>
          <th>ประสิทธิภาพ</th>
          <th>การดำเนินการ</th>
        </tr>
      </thead>
      <tbody id="lightbox-opens-body">
        <!-- Will be filled by JavaScript -->
      </tbody>
    </table>
  </div>
  
  <!-- Tab: Combined Stats -->
  <div class="tab-content" id="combined">
    <h2>สถิติรวม</h2>
    <p>การโต้ตอบผลิตภัณฑ์ทั้งหมด (คลิก URL และเปิด Lightbox)</p>
    
    <table id="combined-stats-table">
      <thead>
        <tr>
          <th>ผลิตภัณฑ์</th>
          <th>ประเภทสินค้า</th>
          <th>คลิก URL</th>
          <th>เปิด Lightbox</th>
          <th>รวม</th>
          <th>อัตราการแปลง</th>
          <th>การดำเนินการ</th>
        </tr>
      </thead>
      <tbody id="combined-stats-body">
        <!-- Will be filled by JavaScript -->
      </tbody>
    </table>
  </div>
  
  <!-- Reset Data Confirmation Modal -->
  <div id="reset-confirm-modal" class="modal">
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>ยืนยันการรีเซ็ต</h2>
      <p>คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตข้อมูลทั้งหมด? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
      <div class="form-group">
        <label for="manager-password">รหัสผ่านผู้จัดการ:</label>
        <input type="password" id="manager-password" class="form-control" placeholder="กรุณาใส่รหัสผ่านผู้จัดการ">
      </div>
      <div class="modal-buttons">
        <button id="confirm-reset" class="btn btn-danger">ยืนยันการรีเซ็ต</button>
        <button id="cancel-reset" class="btn btn-secondary">ยกเลิก</button>
      </div>
    </div>
  </div>
</div>

<style>
  .dashboard-container {
    max-width: 1400px;
    margin: 0 auto;
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
  
  .filter-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
  }
  
  .filter-container label {
    font-weight: 500;
    margin-bottom: 0;
    white-space: nowrap;
  }
  
  .filter-container select {
    width: auto;
    min-width: 150px;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: white;
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
  
  .btn-secondary {
    background-color: #95a5a6;
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
  
  /* Modal styles */
  .modal {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: auto;
  }
  
  .modal-content {
    background-color: #fff;
    margin: 15% auto;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 500px;
    position: relative;
  }
  
  .close-modal {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #aaa;
    cursor: pointer;
  }
  
  .close-modal:hover {
    color: #333;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  @media screen and (max-width: 768px) {
    .filter-container {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
    
    .filter-container select {
      width: 100%;
    }
  }
</style>

<!-- Manager password for data reset -->
<script>
  {% if jekyll.environment == "development" %}
    window.MANAGER_PASSWORD_OBFUSCATED = "{{ 'manager123' | base64_encode }}";
  {% else %}
    window.MANAGER_PASSWORD_OBFUSCATED = "{{ site.env.MANAGER_PASSWORD_B64 }}";
  {% endif %}
</script>


<!-- Load the external JavaScript file -->
<script src="{{ '/assets/js/admin-product-analytics.js' | relative_url | bust_js_cache }}"></script>