// home.js - Home page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load products
    loadFeaturedProducts();
    
    // Update cart count
    updateCartCount();
    
    // Cart icon click
    document.getElementById('cartIcon').addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            window.location.href = 'payment.html';
        }
    });
    
    // Event delegation for add to cart and favorite buttons
    document.addEventListener('click', function(e) {
        // Add to cart
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const product = JSON.parse(button.dataset.product);
            addToCart(product);
        }
        
        // Favorite button
        if (e.target.closest('.fav-btn')) {
            const button = e.target.closest('.fav-btn');
            const product = JSON.parse(button.dataset.product);
            toggleFavorite(product);
            updateFavoriteButton(button);
        }
    });
});

// Load featured products
function loadFeaturedProducts() {
    const products = [
        {
            id: 1,
            name: "Premium Logo Design",
            description: "Professional logo for your business with 3 concepts.",
            price: 150,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            rating: 4.8
        },
        {
            id: 2,
            name: "Website Showcase",
            description: "Responsive website with 5 pages and hosting included.",
            price: 500,
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            rating: 4.9
        },
        {
            id: 3,
            name: "Custom Illustration",
            description: "Unique digital illustration for your project.",
            price: 80,
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            rating: 4.7
        }
    ];
    
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => {
        const isFavorite = isProductFavorite(product.id);
        return `
        <div class="col-md-4">
            <div class="card product-card h-100 position-relative">
                <button class="fav-btn ${isFavorite ? 'active' : ''}" data-product='${JSON.stringify(product)}'>
                    <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </button>
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5">${product.price} DT</span>
                        <span class="badge bg-success">${product.rating} ★</span>
                    </div>
                    <button class="btn btn-primary w-100 mt-3 add-to-cart" data-product='${JSON.stringify(product)}'>
                        <i class="bi bi-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Add to cart
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Check if product is favorite
function isProductFavorite(productId) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.id === productId);
}

// Toggle favorite
function toggleFavorite(product) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const existingIndex = favorites.findIndex(fav => fav.id === product.id);
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
        showNotification(`${product.name} removed from favorites`);
    } else {
        favorites.push(product);
        showNotification(`${product.name} added to favorites`);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Update favorite button state
function updateFavoriteButton(button) {
    button.classList.toggle('active');
    button.innerHTML = button.classList.contains('active') 
        ? '<i class="bi bi-heart-fill"></i>' 
        : '<i class="bi bi-heart"></i>';
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}