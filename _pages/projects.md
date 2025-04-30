---
layout: page
title: สินค้า
title_en: Products
permalink: /สินค้า/
nav: true
nav_order: 2
display_categories: [กีฬา, รีวิว]
horizontal: false
default_navbar_logo: /assets/img/page_logo/amata_white.png
hide_description: true

# JSON Business Meta
schema_type: business

# Google META
description: AMATA Production รับผลิตและออกแบบเสื้อทุกประเภท เสื้อพิมพ์ลาย เสื้อกีฬา เสื้อโปโล เสื้อหน่วยงาน พร้อมงานป้ายโฆษณา ป้ายหาเสียง และสื่อสิ่งพิมพ์ครบวงจร ด้วยดีไซน์ทันสมัย คุณภาพสูง ราคาจากโรงงาน ส่งไว ตรงเวลา
keywords: เสื้อพิมพ์ลาย, เสื้อกีฬา, เสื้อโปโล, เสื้อองค์กร, เสื้อหน่วยงาน, ป้ายโฆษณา, ป้ายหาเสียง, สื่อสิ่งพิมพ์, รับออกแบบเสื้อ, รับผลิตเสื้อ, โรงงานเสื้อ, ผลิตงานพิมพ์, ผลิตสื่อพิมพ์, เสื้อทีม, รับพิมพ์ป้าย, เสื้อพรีเมียม

# OG META
og_title: AMATA Production Co., Ltd. (บริษัท อมตะ โปรดักชั่น จำกัด)
og_description: ศูนย์รวมบริการผลิตและออกแบบ เสื้อกีฬา เสื้อพิมพ์ลาย เสื้อองค์กร เสื้อโปโล พร้อมงานป้ายโฆษณา ป้ายหาเสียง และสื่อสิ่งพิมพ์ทุกชนิด โดยทีมงานมืออาชีพ ผลิตเร็ว ส่งไว ราคาโรงงาน ครบจบในที่เดียว


# Contact Info Button Configuration
contact_info: true
main_animation: "true"
wave_animation: "true"
contact_messenger: "amataproduction.sport"
contact_call: "+66818888866"
contact_messenger: "amataproduction.sport"
contact_line_url: "https://line.me/ti/p/@amatapr"
contact_email: "sales@amataproduction.com"
contact_location_url: "https://maps.app.goo.gl/46SZnCwHuesWyBwm7"
contact_digitalcard_url: "https://vcard-admin.pkp.homes/U0NtnOPAOx"
contact_position: "right"

# Custom button labels
call_label: "โทร"
messenger_label: "Messenger"
line_label: "ไลน์@"
email_label: "อีเมล"
contact_title: "ติดต่อเรา"
smart_card_label: "Digital Card"
location_label: "ที่อยู่"

# Language Switch
language_switch: true
lang: "th"
hreflang: "th"
alternate_lang_url: "/english/AMATA-Products-en/"
---


<!-- pages/projects.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
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

{% assign sorted_projects = site.projects | sort: "importance" %}

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