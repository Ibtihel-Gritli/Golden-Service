// compte.js - Complete dashboard functionality with updated profile fields
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!requireLogin()) {
        return;
    }
    
    // Load the complete dashboard content
    loadDashboardContent();
});

function loadDashboardContent() {
    const user = getUser();
    if (!user) return;
    
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;
    
    // Create the complete dashboard structure
    dashboardContent.innerHTML = `
        <div class="container">
            <div class="row g-4">
                <!-- Sidebar -->
                <div class="col-lg-3">
                    <div class="card shadow-sm sidebar-card">
                        <div class="card-body p-4 text-center">
                            <div class="profile-avatar mb-4">
                                <div class="avatar-wrapper position-relative mx-auto" style="width: 120px; height: 120px;">
                                    <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'}" 
                                         class="rounded-circle w-100 h-100 object-fit-cover" alt="Avatar">
                                </div>
                            </div>
                            <h4 id="userName" class="mb-1">${user.name || 'Guest User'}</h4>
                            <p class="text-muted mb-3" id="userEmail">${user.email || 'guest@example.com'}</p>
                            <div class="user-badge mb-3">
                                <span class="badge ${user.type === 'freelancer' ? 'bg-warning text-dark' : 'bg-primary'}">
                                    <i class="bi ${user.type === 'freelancer' ? 'bi-briefcase' : 'bi-person'} me-1"></i>
                                    ${user.type === 'freelancer' ? 'Freelancer' : 'Premium Client'}
                                </span>
                            </div>
                        </div>
                        
                        <!-- Quick Stats -->
                        <div class="card-footer bg-transparent border-top">
                            <div class="row text-center">
                                <div class="col-6">
                                    <div class="h4 mb-1" id="orderCount">0</div>
                                    <small class="text-muted">Orders</small>
                                </div>
                                <div class="col-6">
                                    <div class="h4 mb-1" id="favoriteCount">0</div>
                                    <small class="text-muted">Favorites</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Navigation Menu -->
                    <div class="card shadow-sm mt-4">
                        <div class="list-group list-group-flush">
                            <button class="list-group-item list-group-item-action active" onclick="showSection('profile')">
                                <i class="bi bi-person me-2"></i>Profile
                            </button>
                            <button class="list-group-item list-group-item-action" onclick="showSection('orders')">
                                <i class="bi bi-bag me-2"></i>Orders
                                <span class="badge bg-primary float-end" id="ordersBadge">0</span>
                            </button>
                            <button class="list-group-item list-group-item-action" onclick="showSection('favorites')">
                                <i class="bi bi-heart me-2"></i>Favorites
                                <span class="badge bg-primary float-end" id="favoritesBadge">0</span>
                            </button>
                            <button class="list-group-item list-group-item-action" onclick="showSection('settings')">
                                <i class="bi bi-gear me-2"></i>Settings
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="col-lg-9">
                    <!-- Profile Section -->
                    <div class="card shadow-sm mb-4" id="profileSection">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0"><i class="bi bi-person me-2"></i>Profile Information</h5>
                            <button class="btn btn-sm btn-outline-primary" onclick="enableProfileEdit()">
                                <i class="bi bi-pencil me-1"></i>Edit Profile
                            </button>
                        </div>
                        <div class="card-body">
                            <form id="profileForm">
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <label class="form-label">First Name</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                                            <input type="text" class="form-control" id="profileFirstName" 
                                                   value="${user.firstName || user.name.split(' ')[0] || ''}" 
                                                   readonly>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Last Name</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                                            <input type="text" class="form-control" id="profileLastName" 
                                                   value="${user.lastName || user.name.split(' ').slice(1).join(' ') || ''}" 
                                                   readonly>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Email Address</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                                            <input type="email" class="form-control" id="profileEmail" 
                                                   value="${user.email || ''}" 
                                                   readonly>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Phone Number</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                                            <input type="tel" class="form-control" id="profilePhone" 
                                                   value="${user.phone || '+216 12 345 678'}" 
                                                   readonly>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Age</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-calendar"></i></span>
                                            <input type="number" class="form-control" id="profileAge" 
                                                   value="${user.age || ''}" 
                                                   min="18" max="100" readonly>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label">Address</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                                            <textarea class="form-control" id="profileAddress" rows="3" 
                                                      readonly>${user.address || '123 Peace Street, Tunis 1001, Tunisia'}</textarea>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Account Type</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-tag"></i></span>
                                            <input type="text" class="form-control" 
                                                   value="${user.type === 'freelancer' ? 'Freelancer' : 'Premium Client'}" 
                                                   readonly>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Member Since</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-calendar-check"></i></span>
                                            <input type="text" class="form-control" 
                                                   value="${user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('en-US', { 
                                                       year: 'numeric', 
                                                       month: 'long', 
                                                       day: 'numeric' 
                                                   }) : 'N/A'}" 
                                                   readonly>
                                        </div>
                                    </div>
                                    
                                    <!-- Edit Profile Buttons (Hidden by default) -->
                                    <div class="col-12 mt-3 d-none" id="profileEditButtons">
                                        <div class="d-flex gap-2">
                                            <button type="button" class="btn btn-primary" onclick="saveProfileChanges()">
                                                <i class="bi bi-check-circle me-1"></i>Save Changes
                                            </button>
                                            <button type="button" class="btn btn-outline-secondary" onclick="cancelProfileEdit()">
                                                <i class="bi bi-x-circle me-1"></i>Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <!-- Orders Section -->
                    <div class="card shadow-sm mb-4 d-none" id="ordersSection">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0"><i class="bi bi-bag me-2"></i>Recent Orders</h5>
                            <a href="store.html" class="btn btn-sm btn-primary">
                                <i class="bi bi-plus-circle me-1"></i>New Order
                            </a>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Product</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody id="ordersTable">
                                        <!-- Orders loaded by JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Favorites Section -->
                    <div class="card shadow-sm mb-4 d-none" id="favoritesSection">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0"><i class="bi bi-heart me-2"></i>Saved Products</h5>
                            <div class="d-flex gap-2">
                                <a href="store.html" class="btn btn-sm btn-primary">
                                    <i class="bi bi-plus-circle me-1"></i>Add More
                                </a>
                                <button class="btn btn-sm btn-outline-danger" id="clearFavoritesBtn">
                                    <i class="bi bi-trash me-1"></i>Clear All
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row g-4" id="favoritesGrid">
                                <!-- Favorites loaded by JavaScript -->
                            </div>
                            <div id="noFavoritesMessage" class="empty-state d-none text-center py-5">
                                <i class="bi bi-heart display-1 text-muted"></i>
                                <h4 class="mt-3">No favorites yet</h4>
                                <p class="text-muted">Start adding products to your favorites!</p>
                                <a href="store.html" class="btn btn-primary mt-3">
                                    <i class="bi bi-shop me-1"></i>Browse Store
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Settings Section -->
                    <div class="card shadow-sm mb-4 d-none" id="settingsSection">
                        <div class="card-header">
                            <h5 class="mb-0"><i class="bi bi-gear me-2"></i>Account Settings</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-4">
                                <div class="col-12">
                                    <h6 class="mb-3 text-primary"><i class="bi bi-shield-lock me-2"></i>Security</h6>
                                    <div class="mb-4">
                                        <label class="form-label">Change Password</label>
                                        <div class="row g-3">
                                            <div class="col-md-4">
                                                <input type="password" class="form-control" id="currentPassword" placeholder="Current Password">
                                            </div>
                                            <div class="col-md-4">
                                                <input type="password" class="form-control" id="newPassword" placeholder="New Password">
                                            </div>
                                            <div class="col-md-4">
                                                <input type="password" class="form-control" id="confirmNewPassword" placeholder="Confirm Password">
                                            </div>
                                        </div>
                                        <button class="btn btn-sm btn-primary mt-2" onclick="changePassword()">
                                            <i class="bi bi-key me-1"></i>Update Password
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="col-12">
                                    <hr>
                                    <h6 class="mb-3 text-primary"><i class="bi bi-bell me-2"></i>Notifications</h6>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" type="checkbox" id="emailNotifications" checked>
                                        <label class="form-check-label" for="emailNotifications">Email Notifications</label>
                                    </div>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" type="checkbox" id="orderUpdates" checked>
                                        <label class="form-check-label" for="orderUpdates">Order Updates</label>
                                    </div>
                                    <div class="form-check form-switch mb-2">
                                        <input class="form-check-input" type="checkbox" id="promotionalEmails">
                                        <label class="form-check-label" for="promotionalEmails">Promotional Emails</label>
                                    </div>
                                </div>
                                
                                <div class="col-12">
                                    <hr>
                                    <h6 class="mb-3 text-danger"><i class="bi bi-exclamation-triangle me-2"></i>Danger Zone</h6>
                                    <div class="alert alert-warning">
                                        <i class="bi bi-exclamation-circle me-2"></i>
                                        <strong>Warning:</strong> These actions are irreversible.
                                    </div>
                                    <div class="d-flex gap-2">
                                        <button class="btn btn-outline-danger" onclick="deleteAccount()">
                                            <i class="bi bi-trash me-1"></i>Delete Account
                                        </button>
                                        <button class="btn btn-outline-secondary" onclick="logout()">
                                            <i class="bi bi-box-arrow-right me-1"></i>Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Now that the content is loaded, initialize the rest
    updateCartCount();
    updateUserNameDisplay(user);
    loadOrders();
    loadFavorites();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show profile section by default
    showSection('profile');
}

function setupEventListeners() {
    // Setup Clear All Favorites button - use event delegation
    document.addEventListener('click', function(e) {
        if (e.target.closest('#clearFavoritesBtn')) {
            clearAllFavorites();
        }
    });
    
    // Setup cart icon click
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'warning');
            } else {
                window.location.href = 'payment.html';
            }
        });
    }
}

function updateUserNameDisplay(user) {
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = user.firstName || user.name.split(' ')[0] || 'Guest';
    }
}

function showLoginPrompt() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (dashboardContent) {
        dashboardContent.innerHTML = `
            <div class="container text-center py-5">
                <i class="bi bi-person-x display-1 text-muted mb-4"></i>
                <h2 class="mb-3">Please Login First</h2>
                <p class="text-muted mb-4">You need to be logged in to view your profile.</p>
                <a href="login.html" class="btn btn-primary btn-lg">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Go to Login
                </a>
            </div>
        `;
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function showSection(sectionId) {
    ['profile', 'orders', 'favorites', 'settings'].forEach(id => {
        const section = document.getElementById(id + 'Section');
        const button = document.querySelector(`[onclick="showSection('${id}')"]`);
        
        if (section) section.classList.add('d-none');
        if (button) button.classList.remove('active');
    });
    
    const activeSection = document.getElementById(sectionId + 'Section');
    const activeButton = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    
    if (activeSection) activeSection.classList.remove('d-none');
    if (activeButton) activeButton.classList.add('active');
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tableBody = document.getElementById('ordersTable');
    const orderCount = document.getElementById('orderCount');
    const ordersBadge = document.getElementById('ordersBadge');
    
    if (!tableBody) return;
    
    if (orders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <i class="bi bi-bag display-1 text-muted"></i>
                    <h4 class="mt-3">No orders yet</h4>
                    <p class="text-muted mb-0">Start shopping to see your orders here!</p>
                    <a href="store.html" class="btn btn-primary mt-3">Browse Store</a>
                </td>
            </tr>
        `;
    } else {
        tableBody.innerHTML = orders.map(order => `
            <tr>
                <td><strong>#${order.id || 'N/A'}</strong></td>
                <td>${order.date || new Date().toLocaleDateString()}</td>
                <td>${order.product || 'Multiple Items'}</td>
                <td><strong>DT ${order.amount || '0.00'}</strong></td>
                <td><span class="badge ${getStatusClass(order.status)}">${order.status || 'Pending'}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetails('${order.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    if (orderCount) orderCount.textContent = orders.length;
    if (ordersBadge) ordersBadge.textContent = orders.length;
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesGrid = document.getElementById('favoritesGrid');
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');
    const clearAllBtn = document.getElementById('clearFavoritesBtn');
    const favoriteCount = document.getElementById('favoriteCount');
    const favoritesBadge = document.getElementById('favoritesBadge');
    
    if (!favoritesGrid) return;
    
    // Update counts and badges
    if (favoriteCount) favoriteCount.textContent = favorites.length;
    if (favoritesBadge) favoritesBadge.textContent = favorites.length;
    
    // Show/hide Clear All button
    if (clearAllBtn) {
        clearAllBtn.style.display = favorites.length > 0 ? 'inline-block' : 'none';
    }
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '';
        if (noFavoritesMessage) noFavoritesMessage.classList.remove('d-none');
    } else {
        if (noFavoritesMessage) noFavoritesMessage.classList.add('d-none');
        
        favoritesGrid.innerHTML = favorites.map(fav => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 favorite-card position-relative">
                    <button class="remove-fav-btn btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2" 
                            data-id="${fav.id}" 
                            title="Remove from favorites"
                            onclick="removeFromFavorites('${fav.id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                    <img src="${fav.image || 'https://via.placeholder.com/300x200?text=No+Image'}" 
                         alt="${fav.name || 'Product'}" 
                         class="card-img-top" style="height: 180px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${fav.name || 'Unnamed Product'}</h5>
                        <p class="card-text text-muted small flex-grow-1">${fav.description || 'No description available'}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="h5 text-primary">DT ${fav.price || '0.00'}</span>
                            <span class="badge bg-secondary">${fav.category || 'General'}</span>
                        </div>
                        <div class="d-grid gap-2 mt-3">
                            <button class="btn btn-primary" onclick="addToCartFromFavorite('${fav.id}')">
                                <i class="bi bi-cart-plus me-1"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function getStatusClass(status) {
    if (!status) return 'bg-secondary';
    
    switch(status.toLowerCase()) {
        case 'completed': 
        case 'delivered': 
            return 'bg-success';
        case 'processing': 
        case 'shipped': 
            return 'bg-warning text-dark';
        case 'pending': 
            return 'bg-info';
        case 'cancelled': 
            return 'bg-danger';
        default: 
            return 'bg-secondary';
    }
}

// Profile Editing Functions
function enableProfileEdit() {
    const fields = ['profileFirstName', 'profileLastName', 'profileEmail', 'profilePhone', 'profileAge', 'profileAddress'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.readOnly = false;
            field.classList.add('bg-light');
        }
    });
    
    // Show edit buttons
    const editButtons = document.getElementById('profileEditButtons');
    if (editButtons) {
        editButtons.classList.remove('d-none');
    }
    
    // Change edit button to cancel
    const editBtn = document.querySelector('[onclick="enableProfileEdit()"]');
    if (editBtn) {
        editBtn.innerHTML = '<i class="bi bi-x-circle me-1"></i>Cancel Edit';
        editBtn.setAttribute('onclick', 'cancelProfileEdit()');
        editBtn.classList.remove('btn-outline-primary');
        editBtn.classList.add('btn-outline-secondary');
    }
}

function cancelProfileEdit() {
    const user = getUser();
    if (!user) return;
    
    // Reset fields to original values
    document.getElementById('profileFirstName').value = user.firstName || user.name.split(' ')[0] || '';
    document.getElementById('profileLastName').value = user.lastName || user.name.split(' ').slice(1).join(' ') || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profilePhone').value = user.phone || '+216 12 345 678';
    document.getElementById('profileAge').value = user.age || '';
    document.getElementById('profileAddress').value = user.address || '123 Peace Street, Tunis 1001, Tunisia';
    
    // Make fields read-only again
    const fields = ['profileFirstName', 'profileLastName', 'profileEmail', 'profilePhone', 'profileAge', 'profileAddress'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.readOnly = true;
            field.classList.remove('bg-light');
        }
    });
    
    // Hide edit buttons
    const editButtons = document.getElementById('profileEditButtons');
    if (editButtons) {
        editButtons.classList.add('d-none');
    }
    
    // Reset edit button
    const editBtn = document.querySelector('[onclick="cancelProfileEdit()"]');
    if (editBtn) {
        editBtn.innerHTML = '<i class="bi bi-pencil me-1"></i>Edit Profile';
        editBtn.setAttribute('onclick', 'enableProfileEdit()');
        editBtn.classList.remove('btn-outline-secondary');
        editBtn.classList.add('btn-outline-primary');
    }
}

function saveProfileChanges() {
    const user = getUser();
    if (!user) return;
    
    // Get updated values
    const updatedUser = {
        ...user,
        firstName: document.getElementById('profileFirstName').value.trim(),
        lastName: document.getElementById('profileLastName').value.trim(),
        name: document.getElementById('profileFirstName').value.trim() + ' ' + document.getElementById('profileLastName').value.trim(),
        email: document.getElementById('profileEmail').value.trim(),
        phone: document.getElementById('profilePhone').value.trim(),
        age: parseInt(document.getElementById('profileAge').value),
        address: document.getElementById('profileAddress').value.trim()
    };
    
    // Validate email
    if (!validateEmail(updatedUser.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate age
    if (updatedUser.age < 18 || updatedUser.age > 100) {
        showNotification('Age must be between 18 and 100', 'error');
        return;
    }
    
    // Check if email already exists (excluding current user)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some(u => u.id !== user.id && u.email === updatedUser.email);
    
    if (emailExists) {
        showNotification('This email is already registered to another account', 'error');
        return;
    }
    
    // Update user in localStorage
    const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update UI
    cancelProfileEdit();
    updateUserNameDisplay(updatedUser);
    
    showNotification('Profile updated successfully!', 'success');
}

// Remove single item from favorites
function removeFromFavorites(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteIndex = favorites.findIndex(fav => fav.id == id);
    
    if (favoriteIndex === -1) {
        showNotification('Item not found in favorites', 'error');
        return;
    }
    
    const favorite = favorites[favoriteIndex];
    
    if (confirm(`Remove "${favorite.name}" from your favorites?`)) {
        favorites.splice(favoriteIndex, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        loadFavorites();
        showNotification(`${favorite.name} removed from favorites`, 'success');
    }
}

// Clear all favorites
function clearAllFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (favorites.length === 0) {
        showNotification('Your favorites list is already empty', 'info');
        return;
    }
    
    if (confirm(`Are you sure you want to remove all ${favorites.length} items from your favorites?`)) {
        localStorage.setItem('favorites', JSON.stringify([]));
        loadFavorites();
        showNotification('All favorites have been cleared', 'success');
    }
}

// Add item from favorites to cart
function addToCartFromFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favorite = favorites.find(fav => fav.id == id);
    
    if (!favorite) {
        showNotification('Item not found in favorites', 'error');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id == id);
    
    if (existingItemIndex !== -1) {
        // Item already in cart, increase quantity
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
        // Add new item to cart
        const cartItem = {
            ...favorite,
            quantity: 1
        };
        cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${favorite.name} added to cart!`, 'success');
}

// View order details
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id == orderId);
    
    if (order) {
        alert(`Order Details:\n\nOrder ID: ${order.id}\nDate: ${order.date}\nProduct: ${order.product}\nAmount: DT ${order.amount}\nStatus: ${order.status}`);
    } else {
        showNotification('Order not found', 'error');
    }
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showNotification('Please fill in all password fields', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('New password must be at least 8 characters', 'error');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    const user = getUser();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) {
        showNotification('User not found', 'error');
        return;
    }
    
    // Check current password (simplified - in production, use proper encryption)
    if (atob(users[userIndex].password) !== currentPassword) {
        showNotification('Current password is incorrect', 'error');
        return;
    }
    
    // Update password
    users[userIndex].password = btoa(newPassword);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clear fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    
    showNotification('Password updated successfully!', 'success');
}

// Delete account
function deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
    }
    
    const user = getUser();
    if (!user) return;
    
    // Remove user from users array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.id !== user.id);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    localStorage.removeItem('orders');
    
    showNotification('Account deleted successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1500);
}

// Logout
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'home.html';
}

// Helper Functions
function getUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function requireLogin(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
        sessionStorage.setItem('redirectUrl', window.location.href);
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'info'}`;
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
    
    .favorite-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .favorite-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
    }
    
    .sidebar-card {
        border: none;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }
    
    .empty-state {
        color: #6c757d;
    }
`;
document.head.appendChild(style);