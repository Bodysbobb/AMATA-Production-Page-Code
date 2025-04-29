---
layout: page
permalink: /repositories/
title: GitHub
description: "My journey in the coding universe begins here — one commit at a time."
nav: false
nav_order: 4

# META Setup
og_title: Pattawee Puangchit | GitHub Trophy
og_description: "Explore my GitHub contributions, open-source projects, and coding activity. With over 1,100 commits and a growing portfolio, this page highlights my development journey and collaborative work."

# NAVBAR
default_navbar_logo: /assets/img/page_logo/navbar-icon_white.png

# Contact Info Button Configuration
contact_info: true
contact_title: "Contact Info"
contact_email: "ppuangch@purdue.edu"
contact_digitalcard_url: "https://vcard-admin.pkp.homes/ZYrVxC2m6S"
contact_position: "right"
---

{% if site.data.repositories.github_users %}

## GitHub Name

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user %}
  {% endfor %}
</div>

---

{% if site.repo_trophies.enabled %}
{% for user in site.data.repositories.github_users %}
{% if site.data.repositories.github_users.size > 1 %}

  <h4>{{ user }}</h4>
  {% endif %}
  <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% include repository/repo_trophies.liquid username=user %}
  </div>

---

{% endfor %}
{% endif %}
{% endif %}

{% if site.data.repositories.github_repos %}

## GitHub Repositories

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
{% endif %}
