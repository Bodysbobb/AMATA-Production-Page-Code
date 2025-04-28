---
layout: page
title: Portfolio
permalink: /projects/
description: "An academic mind, a business heart, and a creator’s soul. | Please see all of my projects on this page!"
nav: true
nav_order: 3
display_categories: [Academic, Business, Programming]
horizontal: false

hide_title: true
hide_description: true
landing_hero: true
landing_hero_disable_contact_button: true

# META Setup
og_title: Pattawee Puangchit | Portfolio
og_description: "An academic mind, a business heart, and a creator’s soul. | Please see all of my projects on this page!"

# NAVBAR
navbar_auto_hide: false
default_navbar_logo: /assets/img/page_logo/navbar-icon_white.png

# Contact Info Button Configuration
contact_info: true
contact_title: "Contact Info"
contact_email: "ppuangch@purdue.edu"
contact_digitalcard_url: "https://vcard-admin.pkp.homes/ZYrVxC2m6S"
contact_position: "right"

need_aos: true
---

<!-- Hero Section -->
{% include landing-hero.liquid
  title="Portfolio"
  subtext="An academic mind, a business heart, and a creator's soul."
  signature="— Pattawee Puangchit —"
  scroll_text="See My Projects"
  particle_mode="mix"
  letter_delay="0.05"
  initial_delay="300"
  data-final-class="animation-complete"
%}
<a id="projects-start"></a>

<!-- Scroll-stacked projects by category -->
<div class="project-feed">
  {% for category in page.display_categories %}
    <section class="project-category-block">
      
      {% case category %}
        {% when "Business" %}
          {% assign display_label = "A business heart" %}
        {% when "Programming" %}
          {% assign display_label = "A creator’s soul" %}
        {% when "Academic" %}
          {% assign display_label = "An academic mind" %}
        {% else %}
          {% assign display_label = category %}
      {% endcase %}

      <h2 
        class="project-category-title" 
        data-aos="fade"
        data-aos-duration="300"
        data-aos-easing="ease-in"
      >
        {{ display_label }}
      </h2>

      <hr class="section-divider">

      {% assign categorized_projects = site.projects | where: "category", category %}
      {% assign sorted_projects = categorized_projects | sort: "importance" %}
      {% for project in sorted_projects %}
        <div 
          class="project-card-wrapper"
          data-aos="fade-up"
          data-aos-delay="{{ forloop.index0 | times: 30 }}"
          data-aos-duration="600"
          data-aos-easing="ease-in-out-back"
          data-aos-once="false"
        >
          {% include projects.liquid %}
        </div>
      {% endfor %}
      
    </section>
  {% endfor %}
</div>

<!-- All Projects -->
{% include project_summary.liquid %}
