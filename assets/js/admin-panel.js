document.addEventListener('DOMContentLoaded', function() {
    const ADMIN_PASSWORD = window.ADMIN_PASSWORD;
  
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    const loginScreen = document.getElementById('login-screen');
    const adminContent = document.getElementById('admin-content');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
  
    if (isAuthenticated) {
      loginScreen.style.display = 'none';
      adminContent.style.display = 'block';
    }
  
    loginButton.addEventListener('click', function() {
      if (passwordInput.value === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_authenticated', 'true');
        loginScreen.style.display = 'none';
        adminContent.style.display = 'block';
      } else {
        alert('Incorrect password. Please try again.');
      }
    });
  
    passwordInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        loginButton.click();
      }
    });
  });
  