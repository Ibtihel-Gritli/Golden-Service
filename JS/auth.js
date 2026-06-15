// auth.js - Authentication state management
document.addEventListener('DOMContentLoaded', function() {
    updateAuthState();
    updateNavbarAuth();
});

function updateAuthState() {
    // This function updates authentication state globally
    const user = getUser();
    
    // Update any auth-related UI elements
    const authElements = document.querySelectorAll('[data-auth]');
    authElements.forEach(element => {
        const authType = element.getAttribute('data-auth');
        if (user) {
            if (authType === 'logged-in') {
                element.classList.remove('d-none');
            } else if (authType === 'logged-out') {
                element.classList.add('d-none');
            }
        } else {
            if (authType === 'logged-in') {
                element.classList.add('d-none');
            } else if (authType === 'logged-out') {
                element.classList.remove('d-none');
            }
        }
    });
}

function updateNavbarAuth() {
    const user = getUser();
    const authButton = document.getElementById('authButton');
    const authButtonText = document.getElementById('authButtonText');
    const authIcon = document.getElementById('authIcon');
    
    if (authButton && authButtonText && authIcon) {
        if (user) {
            // User is logged in
            authButtonText.textContent = 'Logout';
            authIcon.className = 'bi bi-box-arrow-right me-1';
            authButton.href = '#';
            authButton.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem('user');
                updateAuthState();
                updateNavbarAuth();
                window.location.href = 'home.html';
            };
        } else {
            // User is not logged in
            authButtonText.textContent = 'Login';
            authIcon.className = 'bi bi-box-arrow-in-right me-1';
            authButton.href = 'login.html';
            authButton.onclick = null;
        }
    }
}

function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

function getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function requireLogin(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
        // Store current page to return after login
        sessionStorage.setItem('redirectUrl', window.location.href);
        window.location.href = redirectTo;
        return false;
    }
    return true;
}