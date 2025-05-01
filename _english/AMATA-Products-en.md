---
layout: page
title: Products
title_en: true
display_categories: [Sports, Polo, Review, Services]
horizontal: false

# ================ TITLE & Description ================ #
hide_title: true
hide_description: true

# ================ NAVBAR ================ #
## Defailt Navbar
default_navbar_logo: /assets/img/page_logo/amata_main_text.png
navbar_default_logo_bg: true
navbar_default_logo_bg_color: "#ffffff" 

# ================ Contact Info Button Configuration ================ #
contact_info: true
contact_theme: "amata_en"

# ================ Language Switch ================ #
language_switch: true
lang: "en"
hreflang: "en"
#permalink: /english/AMATA-Products-en/
alternate_lang_url: "/สินค้า/"

# ================ META ================ #
# JSON Business Meta
schema_type: business

# Google META
description: AMATA Production offers complete custom manufacturing and design services for sublimation sportswear, polo shirts, organization uniforms, advertising signs, campaign banners, and all types of printed media — with modern design, factory-direct pricing, fast production, and on-time delivery.
keywords: custom sportswear, sublimation shirts, team uniforms, polo shirts, organization apparel, printed signs, campaign banners, printed media, printing service, factory production, custom apparel, premium uniforms, fast delivery

# OG META
og_title: AMATA Production Co., Ltd. – Custom Apparel & Printing Services
og_description: AMATA Production provides one-stop manufacturing for custom-designed sportswear, team apparel, organization uniforms, advertising signs, campaign banners, and full-service print production — fast, professional, and affordable from factory to finish.
og_image: /assets/img/project_covers/sports_product.png
---

<!-- All Projects -->
{% include project_summary.liquid title="Our Products" %}

<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.english | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}   <!-- ✅ FIXED LINE -->
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.english | sort: "importance" %}  <!-- Also updated to site.english -->

  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
