---
layout: page
title_en: true
img: assets/img/Banner/banner/sports_product.webp
category: Sports
importance: 1
nav: true
nav_order: 1

# ================ TITLE & Description ================ #
hide_title: true
hide_description: true
amata_footer: false

# ================ NAVBAR ================ #
navbar_scroll_effect: true
navbar_logo_one: /assets/img/page_logo/amata_main_logo.webp

navbar_scroll_title: AMATA Production Sports Designs
navbar_scroll_logo_one: /assets/img/page_logo/amata_garment_logo.webp

# ================ Contact Info Button Configuration ================ #
contact_info: true

# ================ Language Switch ================ #
language_switch: true
lang: "en"
alternate_lang_url: "/products/amata-sports-designs"

# ================ Background ================ #
background: true
background_logo: /assets/img/custom_logo/amata/AMATA_Logo_Hover.svg
background_position: center

# ================ META ================ #
## JSON Business Meta
schema_type: product

## Google META
description: AMATA Production offers high-quality custom sportswear, sublimation jerseys, team uniforms, and printed signage at factory prices with fast delivery.
keywords: custom sportswear, sublimation jersey, team uniforms, custom apparel, printing service, athletic wear, polo shirt, affordable sportswear, uniform manufacturer, fast production

## OG META
og_title: AMATA Production – Custom Sportswear with Unique Designs
og_description: >
  AMATA Production specializes in designing and manufacturing custom sportswear, team shirts, university uniforms, corporate apparel, and sublimation print shirts. Unique styles, standout designs, and high-quality embroidery and screen printing – all in one place.
og_image: /assets/img/META_pic/sports_product.jpg
---


{% include product-catalog.liquid 
  json_data_file="sports_en.json"
  theme="product"
%}