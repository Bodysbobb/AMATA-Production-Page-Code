document.addEventListener('DOMContentLoaded', function() {
  // Minimal language toggle functionality
  const langToggle = document.getElementById('navbar-language-toggle');
  
  if (!langToggle) return;
  
  // Add a simple hover effect for better user experience
  langToggle.addEventListener('mouseover', function() {
    this.classList.add('hover');
  });
  
  langToggle.addEventListener('mouseout', function() {
    this.classList.remove('hover');
  });
  
  // Clean URL if coming from language transition
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('_lang_transition') === 'true') {
    const cleanUrl = window.location.href
      .replace(/[?&]_lang_transition=true/, '')
      .replace(/\?$/, '');
    window.history.replaceState({}, document.title, cleanUrl);
  }
});