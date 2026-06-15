// login.js - Registration functionality
document.addEventListener('DOMContentLoaded', function() {
    // Password confirmation validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const passwordMatch = document.getElementById('passwordMatch');
    
    function validatePasswords() {
        if (password.value && confirmPassword.value) {
            if (password.value === confirmPassword.value) {
                passwordMatch.textContent = 'Passwords match ✓';
                passwordMatch.style.color = '#198754';
                confirmPassword.classList.remove('is-invalid');
                confirmPassword.classList.add('is-valid');
            } else {
                passwordMatch.textContent = 'Passwords do not match ✗';
                passwordMatch.style.color = '#dc3545';
                confirmPassword.classList.remove('is-valid');
                confirmPassword.classList.add('is-invalid');
            }
        } else {
            passwordMatch.textContent = '';
            confirmPassword.classList.remove('is-valid', 'is-invalid');
        }
    }
    
    if (password && confirmPassword) {
        password.addEventListener('input', validatePasswords);
        confirmPassword.addEventListener('input', validatePasswords);
    }
    
    // Registration form submission
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const age = document.getElementById('age').value;
            const passwordVal = document.getElementById('password').value;
            const confirmPasswordVal = document.getElementById('confirmPassword').value;
            
            // Validation
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (age < 18 || age > 100) {
                showNotification('Age must be between 18 and 100', 'error');
                return;
            }
            
            if (passwordVal.length < 8) {
                showNotification('Password must be at least 8 characters long', 'error');
                return;
            }
            
            if (passwordVal !== confirmPasswordVal) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (!document.getElementById('terms').checked) {
                showNotification('You must agree to the Terms of Service', 'error');
                return;
            }
            
            // Check if user already exists
            const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
            if (existingUsers.some(user => user.email === email)) {
                showNotification('An account with this email already exists', 'error');
                return;
            }
            
            // Create user object
            const user = {
                id: Date.now().toString(),
                firstName: firstName,
                lastName: lastName,
                name: `${firstName} ${lastName}`,
                email: email,
                phone: phone,
                address: address,
                age: parseInt(age),
                password: btoa(passwordVal), // Simple encoding (not secure for production)
                type: 'client', // Default type
                registeredAt: new Date().toISOString(),
                avatar: getRandomAvatar()
            };
            
            // Save user to users array
            existingUsers.push(user);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            
            // Set as current user
            localStorage.setItem('user', JSON.stringify(user));
            
            showNotification(`Welcome ${firstName}! Your account has been created successfully.`, 'success');
            
            // Check if there's a redirect URL from sessionStorage
            const redirectUrl = sessionStorage.getItem('redirectUrl') || 'home.html';
            sessionStorage.removeItem('redirectUrl');
            
            // Redirect to previous page or home
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1500);
        });
    }
    
    // Login link
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginForm();
        });
    }
});

// Show login form (replaces registration form)
function showLoginForm() {
    const cardBody = document.querySelector('.card-body');
    if (!cardBody) return;
    
    cardBody.innerHTML = `
        <div class="text-center mb-4">
            <h2 class="fw-bold">Welcome Back</h2>
            <p class="text-muted">Sign in to your account</p>
        </div>
        
        <form id="loginForm">
            <div class="mb-4">
                <label class="form-label">Email Address</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                    <input type="email" class="form-control" id="loginEmail" placeholder="Enter your email" required>
                </div>
            </div>
            
            <div class="mb-4">
                <label class="form-label">Password</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    <input type="password" class="form-control" id="loginPassword" placeholder="Enter your password" required>
                </div>
            </div>
            
            <div class="mb-4">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="rememberMe">
                    <label class="form-check-label" for="rememberMe">Remember me</label>
                </div>
            </div>
            
            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg py-3">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                </button>
            </div>
        </form>
        
        <div class="text-center mt-4">
            <p class="text-muted mb-2">
                <a href="#" class="text-decoration-none" id="forgotPassword">Forgot your password?</a>
            </p>
            <p class="text-muted mb-0">
                Don't have an account? 
                <a href="#" class="text-primary fw-semibold" id="registerLink">Create one here</a>
            </p>
        </div>
    `;
    
    // Add event listeners for new elements
    setTimeout(() => {
        const loginForm = document.getElementById('loginForm');
        const registerLink = document.getElementById('registerLink');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }
        
        if (registerLink) {
            registerLink.addEventListener('click', function(e) {
                e.preventDefault();
                location.reload(); // Reload to show registration form
            });
        }
        
        const forgotPassword = document.getElementById('forgotPassword');
        if (forgotPassword) {
            forgotPassword.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Password reset feature coming soon!', 'info');
            });
        }
    }, 100);
}

// Handle login
function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && atob(u.password) === password);
    
    if (user) {
        // Remove password from stored user object
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        showNotification(`Welcome back, ${user.firstName}!`, 'success');
        
        const redirectUrl = sessionStorage.getItem('redirectUrl') || 'home.html';
        sessionStorage.removeItem('redirectUrl');
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Get random avatar URL
function getRandomAvatar() {
    const avatars = [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
}

// Show notification
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);