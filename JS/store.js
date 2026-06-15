// store.js - Store page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Products data
    const products = [
        {
            id: 1,
            name: "Logo Design Premium",
            description: "Professional logo with 3 different concepts",
            price: 150,
            category: "design",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            name: "Showcase Website",
            description: "Responsive 5-page website + hosting",
            price: 500,
            category: "web",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 3,
            name: "Digital Illustration",
            description: "Custom high-resolution illustration",
            price: 80,
            category: "design",
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 4,
            name: "SEO Writing",
            description: "SEO-optimized article 1000 words",
            price: 50,
            category: "writing",
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 5,
            name: "Facebook Ads Campaign",
            description: "Complete advertising campaign management",
            price: 300,
            category: "marketing",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 6,
            name: "Mobile Application",
            description: "Native iOS/Android application",
            price: 1200,
            category: "web",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    ];
    
    // Initialize
    updateCartCount();
    renderProducts(products);
    
    // Cart icon click
    document.getElementById('cartIcon').addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            window.location.href = 'payment.html';
        }
    });
    
    // Event delegation
    document.addEventListener('click', function(e) {
        // Add to cart
        if (e.target.closest('.add-to-cart-btn')) {
            const button = e.target.closest('.add-to-cart-btn');
            const productId = parseInt(button.dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) addToCart(product);
        }
        
        // Favorite button
        if (e.target.closest('.fav-btn')) {
            const button = e.target.closest('.fav-btn');
            const productId = parseInt(button.dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) {
                toggleFavorite(product);
                updateFavoriteButton(button);
            }
        }
    });
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', filterProducts);
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') filterProducts();
    });
    
    // Filter functionality
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('priceFilter').addEventListener('change', filterProducts);
    document.getElementById('ratingFilter').addEventListener('change', filterProducts);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
});

// Render products
function renderProducts(productsArray) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (productsArray.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h4 class="mt-3">No products found</h4>
                <p class="text-muted">Try modifying your search criteria</p>
            </div>
        `;
        return;
    }
    
    productsArray.forEach(product => {
        const isFavorite = isProductFavorite(product.id);
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card product-card h-100 position-relative">
                <button class="fav-btn ${isFavorite ? 'active' : ''}" data-id="${product.id}">
                    <i class="bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </button>
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <span class="badge bg-primary mb-2">${product.category}</span>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="h5">${product.price} DT</span>
                        <span class="badge bg-success">${product.rating} ★</span>
                    </div>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">
                            <i class="bi bi-cart-plus me-2"></i>Add to Cart
                        </button>
                        <a href="product-details.html?id=${product.id}" class="btn btn-outline-primary">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
        productsGrid.appendChild(col);
    });
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    const rating = document.getElementById('ratingFilter').value;
    
    const products = [
        {
            id: 1,
            name: "Logo Design Premium",
            description: "Professional logo with 3 different concepts",
            price: 150,
            category: "design",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            name: "Showcase Website",
            description: "Responsive 5-page website + hosting",
            price: 500,
            category: "web",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 3,
            name: "Digital Illustration",
            description: "Custom high-resolution illustration",
            price: 80,
            category: "design",
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 4,
            name: "SEO Writing",
            description: "SEO-optimized article 1000 words",
            price: 50,
            category: "writing",
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 5,
            name: "Facebook Ads Campaign",
            description: "Complete advertising campaign management",
            price: 300,
            category: "marketing",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 6,
            name: "Mobile Application",
            description: "Native iOS/Android application",
            price: 1200,
            category: "web",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    ];
    
    let filtered = [...products];
    
    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Category filter
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    
    // Price filter
    if (priceRange) {
        if (priceRange === '1000+') {
            filtered = filtered.filter(product => product.price > 1000);
        } else {
            const [min, max] = priceRange.split('-');
            filtered = filtered.filter(product => 
                product.price >= parseInt(min) && 
                product.price <= parseInt(max)
            );
        }
    }
    
    // Rating filter
    if (rating) {
        const minRating = parseFloat(rating);
        filtered = filtered.filter(product => product.rating >= minRating);
    }
    
    renderProducts(filtered);
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('ratingFilter').value = '';
    
    const products = [
        {
            id: 1,
            name: "Logo Design Premium",
            description: "Professional logo with 3 different concepts",
            price: 150,
            category: "design",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 2,
            name: "Showcase Website",
            description: "Responsive 5-page website + hosting",
            price: 500,
            category: "web",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 3,
            name: "Digital Illustration",
            description: "Custom high-resolution illustration",
            price: 80,
            category: "design",
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 4,
            name: "SEO Writing",
            description: "SEO-optimized article 1000 words",
            price: 50,
            category: "writing",
            rating: 4.6,
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 5,
            name: "Facebook Ads Campaign",
            description: "Complete advertising campaign management",
            price: 300,
            category: "marketing",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            id: 6,
            name: "Mobile Application",
            description: "Native iOS/Android application",
            price: 1200,
            category: "web",
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    ];
    
    renderProducts(products);
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

// Update favorite button
function updateFavoriteButton(button) {
    button.classList.toggle('active');
    button.innerHTML = button.classList.contains('active') 
        ? '<i class="bi bi-heart-fill"></i>' 
        : '<i class="bi bi-heart"></i>';
}

// Show notification
function showNotification(message) {
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