// product-details.js - Product details functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    
    // Load product data
    const product = getProductById(productId);
    
    // Update page with product data
    updateProductDetails(product);
    
    // Update cart count
    updateCartCount();
    
    // Update favorite button
    updateFavoriteButton();
    
    // Cart icon click
    document.getElementById('cartIcon').addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            window.location.href = 'payment.html';
        }
    });
    
    // Favorite button click
    document.getElementById('favoriteButton').addEventListener('click', function() {
        toggleFavorite(product);
        updateFavoriteButton();
    });
    
    // Add to cart button
    document.getElementById('addToCart').addEventListener('click', function() {
        if (!product) return;
        
        const quantity = parseInt(document.getElementById('buy_qty').value) || 1;
        
        // Create cart item
        const cartItem = {
            ...product,
            quantity: quantity
        };
        
        // Add to cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === cartItem.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push(cartItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${product.name} added to cart!`);
    });
});

// Get product by ID
function getProductById(id) {
    const products = [
        {
            id: 1,
            name: "Premium Logo Design",
            description: "Professional logo for your business with 3 concepts and unlimited revisions.",
            price: 150,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.8
        },
        {
            id: 2,
            name: "Website Showcase",
            description: "Responsive website with 5 pages, hosting included, and 3 months of support.",
            price: 500,
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.9
        },
        {
            id: 3,
            name: "Custom Illustration",
            description: "Unique digital illustration for your project in high resolution.",
            price: 80,
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            rating: 4.7
        }
    ];
    
    return products.find(p => p.id === id) || products[0];
}

// Update product details
function updateProductDetails(product) {
    if (!product) return;
    
    document.getElementById('p_name').textContent = product.name;
    document.getElementById('p_desc').textContent = product.description;
    document.getElementById('p_price').textContent = '€' + product.price;
    document.getElementById('p_img').src = product.image;
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
function updateFavoriteButton() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1;
    const isFavorite = isProductFavorite(productId);
    const button = document.getElementById('favoriteButton');
    
    if (button) {
        button.classList.toggle('active', isFavorite);
        button.innerHTML = isFavorite 
            ? '<i class="bi bi-heart-fill"></i>' 
            : '<i class="bi bi-heart"></i>';
    }
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