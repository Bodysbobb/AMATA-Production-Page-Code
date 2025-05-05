---
layout: page
title: ไซซ์เสื้อ
img: assets/img/Size/Sports-Size-Guide.webp
importance: 1
category: บริการ

# ================ NAVBAR ================ #
navbar_scroll_effect: true
navbar_logo_one: /assets/img/page_logo/amata_main_logo.webp

# ================ Contact Info Button Configuration ================ #
contact_info: true

# ================ Language Switch ================ #
language_switch: true
lang: "th"
alternate_lang_url: "/AMATA-Size-Guide-en/"

# ================ Background ================ #
background_logo: /assets/img/custom_logo/amata/AMATA_Logo.svg
background_position: center
need_aos: false


# ================ META ================ #
## JSON Business Meta
schema_type: business

## Google META
description: ตารางไซซ์เสื้อจาก AMATA Production สำหรับเสื้อกีฬา เสื้อพิมพ์ลาย เสื้อทีม เสื้อองค์กร เสื้อโปโล สั่งผลิต แขนสั้น แขนยาว และยูนิฟอร์ม เพื่อช่วยให้ลูกค้าเลือกไซซ์ที่ดีที่สุด พร้อมคำแนะนำการวัดตัวอย่างถูกต้อง
keywords: ตารางไซซ์เสื้อ, ไซซ์เสื้อ, ไซซ์เสื้อกีฬา, ไซซ์ยูนิฟอร์ม, ไซซ์เสื้อพิมพ์ลาย, เลือกไซซ์เสื้อ, วัดตัว, เสื้อพอดีตัว, เสื้อทีม, ไซซ์เสื้อโปโล, เสื้อสั่งผลิต, AMATA Production

## OG META
og_title: ตารางไซซ์เสื้อ AMATA Production
og_description: ดูรายละเอียดตารางไซซ์สำหรับเสื้อกีฬา เสื้อพิมพ์ลาย และเสื้อองค์กรจาก AMATA Production เพื่อให้คุณมั่นใจว่าเลือกไซซ์ได้พอดีกับคุณ
og_image: /assets/img/Size/Sports-Size-Guide.webp
---

<style>
  .post h1, .post h2, .post h3, .post h4, .post h5, .post h6 {
    font-family: 'Prompt', sans-serif !important;
    text-align: center;
  }
  /* Size theme with responsive tall container */
  .product-catalog.theme-size {
    max-width: 900px;
    margin: 0 auto;
    padding: 0;
    
    /* Product grid with more vertical space */
    .product-grid {
      gap: 10px;
      margin: 0;
    }
    
    /* Allow product items to be as tall as needed */
    .product-item {
      margin-bottom: 10px;
      height: auto;
      min-height: 1000px; 
    }
    
    /* Remove all height constraints on image container */
    .product-image {
      height: auto !important;
      max-height: none !important;
      min-height: 1000px !important;
      padding: 0;
      margin: 0;
      aspect-ratio: unset !important;
    }
    
    /* Ensure image displays at full size */
    .product-image img {
      width: 100%;
      height: auto !important;
      max-height: none !important;
      min-height: 800px !important;
      object-fit: contain;
      transition: none;
      transform: none;
    }
    
    /* Disable hover effects */
    .product-image:hover img {
      transform: none;
    }
    
    /* Override any aspect ratio constraints */
    &[data-image-aspect-ratio] .product-image {
      aspect-ratio: unset !important;
    }
    
    /* Mobile optimizations */
    @media screen and (max-width: 768px) {
      max-width: 100%;
      
      .product-item {
        min-height: 800px;
      }
      
      .product-image {
        min-height: 800px !important;
      }
      
      .product-image img {
        min-height: 700px !important;
      }
    }
    
    /* iPhone Pro optimizations */
    @media screen and (max-width: 430px) {
      .product-item {
        min-height: 700px;
      }
      
      .product-image {
        min-height: 700px !important;
      }
      
      .product-image img {
        min-height: 600px !important;
      }
      
      /* Reduce filter padding on small screens */
      .filter-tag {
        padding: 5px 10px;
        font-size: 11px;
      }
      
      /* Better formatting for small screens */
      .top-filter-tags-wrapper {
        max-width: calc(100% - 110px);
      }
    }
    
    /* Small iPhone optimization */
    @media screen and (max-width: 375px) {
      .product-item {
        min-height: 600px;
      }
      
      .product-image {
        min-height: 600px !important;
      }
      
      .product-image img {
        min-height: 500px !important;
      }
    }
  }
</style>

<h1> ตารางไซซ์เสื้อ อมตะ โปรดักชั่น </h1>

{% include product-catalog.liquid 
  theme="size"
  redirect_link="size"
  show_top_filters=true
  show_dropdown_filters=false
  show_copy_url=false
  allow_image_save=true
  images_per_row_max="1"
  images_per_row_min="1"
  image_aspect_ratio="1/1"
  line_account="https://line.me/ti/p/@amatapr"
  filter_button_label="ตัวกรอง "
  copy_message_label="กดลิงก์ เพื่อแชร์"
  copy_button_label="คัดลอกลิงก์"
  copy_button_label_finalstate="คัดลอกแล้ว!"
  selected_filters_label="ตัวกรองที่เลือก"
  clear_all_label="ล้างทั้งหมด"
  no_filters_label="ไม่มีตัวกรองที่เลือก"
  image_animation=false
  paths="/assets/img/Size/Sports-Size-Guide.webp, /assets/img/Size/Polo-Size-Guide.webp"
  max_width="800px"

  alts="เสื้อกีฬา เสื้อพิมพ์ลาย เสื้อทีม ตารางขนาด ไซซ์เสื้อกีฬา สั่งผลิตใหม่ ออกแบบเอง AMATA, เสื้อโปโล แขรสั้น แขนยาว เสื้อพิมพ์ลาย ตารางขนาด ไซซ์เสื้อโปโลสั่งผลิต AMATA"

   titles="เสื้อกีฬา สีดำ สีฟ้าน้ำทะเลเข้ม แขนสั้น สินค้าขายดี จาก AMATA, ชุดกีฬา สีกรมท่า สีแดงเข้ม สีน้ำเงินเทาเข้ม แขนสั้น สินค้าขายดี คุณภาพพรีเมียม"

   tags="ไซซ์เสื้อกีฬา ไซซ์เสื้อพิมพ์ลาย ไซซ์เสื้อสั่งผลิต ไซซ์เสื้ออมตะ ไซซ์เสื้อ, ไซซ์เสื้อโปโล ไซซ์เสื้อพิมพ์ลาย แขนสั้น ไซซ์เสื้อสั่งผลิต ไซซ์เสื้ออมตะ ไซซ์เสื้อ"

   descriptions=","

   top_filters="ไซซ์เสื้อกีฬา:ไซซ์เสื้อกีฬา, ไซซ์เสื้อโปโล:ไซซ์เสื้อโปโล"
%}