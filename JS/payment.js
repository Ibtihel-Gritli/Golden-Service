// payment.js - Payment functionality with input constraints
document.addEventListener('DOMContentLoaded', function() {
    console.log('Payment page loaded');
    
    // Initialize cart display
    updateCartCount();
    loadCartItems();
    
    // Setup input constraints
    setupInputConstraints();
    
    // Setup Clear Cart button
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Setup Cart icon click
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty!');
            } else {
                window.location.href = 'payment.html';
            }
        });
    }
    
    // Setup Payment form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
    
    // Setup real-time validation
    setupRealTimeValidation();
});

// Setup real-time validation
function setupRealTimeValidation() {
    const inputs = [
        'fullName',
        'phone',
        'cardNumber',
        'expiryDate',
        'cvv'
    ];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', function() {
                // Remove invalid state when user starts typing
                this.classList.remove('is-invalid');
            });
        }
    });
}

// Validate individual field
function validateField() {
    const field = this;
    
    // Clear previous validation
    field.classList.remove('is-invalid');
    
    switch (field.id) {
        case 'fullName':
            if (field.value.trim().length < 2 || !/^[a-zA-Z\s\-']+$/.test(field.value.trim())) {
                field.classList.add('is-invalid');
            }
            break;
            
        case 'phone':
            // Phone number is only required, no format validation
            if (field.value.trim().length === 0) {
                field.classList.add('is-invalid');
            }
            break;
            
        case 'cardNumber':
            const cardDigits = field.value.replace(/\D/g, '');
            if (cardDigits.length !== 16) {
                field.classList.add('is-invalid');
            }
            break;
            
        case 'expiryDate':
            const expiry = field.value;
            const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
            if (!regex.test(expiry)) {
                field.classList.add('is-invalid');
            } else {
                // Check if card is expired
                const [month, year] = expiry.split('/');
                const currentYear = new Date().getFullYear() % 100;
                const currentMonth = new Date().getMonth() + 1;
                
                if (parseInt(year) < currentYear || 
                    (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                    field.classList.add('is-invalid');
                }
            }
            break;
            
        case 'cvv':
            const cvvDigits = field.value.replace(/\D/g, '');
            if (cvvDigits.length < 3 || cvvDigits.length > 4) {
                field.classList.add('is-invalid');
            }
            break;
    }
}

// Setup input constraints
function setupInputConstraints() {
    // Full Name - only letters and spaces
    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput) {
        fullNameInput.addEventListener('input', function(e) {
            // Allow only letters, spaces, hyphens, and apostrophes
            this.value = this.value.replace(/[^a-zA-Z\s\-']/g, '');
        });
    }
    
    // Phone Number - No constraints, free text input
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        // Remove any previous formatting/constraints
        // Phone is now free text with no constraints
    }
    
    // Card Number - format as XXXX XXXX XXXX XXXX
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 16 digits
            value = value.substring(0, 16);
            
            // Format with spaces every 4 digits
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            
            this.value = formatted;
        });
    }
    
    // Expiry Date - format as MM/YY
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            // Remove all non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 4 digits
            value = value.substring(0, 4);
            
            // Format as MM/YY
            let formatted = '';
            if (value.length >= 1) {
                formatted = value.substring(0, 1);
            }
            if (value.length >= 2) {
                formatted = value.substring(0, 2);
            }
            if (value.length >= 3) {
                formatted += '/' + value.substring(2, 3);
            }
            if (value.length >= 4) {
                formatted += value.substring(3, 4);
            }
            
            this.value = formatted;
        });
    }
    
    // CVV - only numbers, max 4 digits
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            // Remove all non-digits
            this.value = this.value.replace(/\D/g, '');
            
            // Limit to 4 digits
            this.value = this.value.substring(0, 4);
        });
    }
}

// Validate form before submission
function validateForm() {
    let isValid = true;
    
    // Check Full Name
    const fullName = document.getElementById('fullName');
    if (fullName) {
        if (fullName.value.trim().length < 2 || !/^[a-zA-Z\s\-']+$/.test(fullName.value.trim())) {
            fullName.classList.add('is-invalid');
            isValid = false;
        } else {
            fullName.classList.remove('is-invalid');
        }
    }
    
    // Check Phone Number - only required, no format validation
    const phone = document.getElementById('phone');
    if (phone) {
        if (phone.value.trim().length === 0) {
            phone.classList.add('is-invalid');
            isValid = false;
        } else {
            phone.classList.remove('is-invalid');
        }
    }
    
    // Check Card Number
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        const cardDigits = cardNumber.value.replace(/\D/g, '');
        if (cardDigits.length !== 16) {
            cardNumber.classList.add('is-invalid');
            isValid = false;
        } else {
            cardNumber.classList.remove('is-invalid');
        }
    }
    
    // Check Expiry Date
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        const expiry = expiryDate.value;
        const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!regex.test(expiry)) {
            expiryDate.classList.add('is-invalid');
            isValid = false;
        } else {
            // Check if card is expired
            const [month, year] = expiry.split('/');
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;
            
            if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                expiryDate.classList.add('is-invalid');
                isValid = false;
            } else {
                expiryDate.classList.remove('is-invalid');
            }
        }
    }
    
    // Check CVV
    const cvv = document.getElementById('cvv');
    if (cvv) {
        const cvvDigits = cvv.value.replace(/\D/g, '');
        if (cvvDigits.length < 3 || cvvDigits.length > 4) {
            cvv.classList.add('is-invalid');
            isValid = false;
        } else {
            cvv.classList.remove('is-invalid');
        }
    }
    
    return isValid;
}

// Load cart items from localStorage
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Get DOM elements
    const orderItems = document.getElementById('orderItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const payButton = document.getElementById('payButton');
    
    // Check if cart is empty
    if (cart.length === 0) {
        // Hide cart items and summary
        if (orderItems) orderItems.innerHTML = '';
        if (cartSummary) cartSummary.classList.add('d-none');
        if (emptyCartMessage) emptyCartMessage.classList.remove('d-none');
        if (clearCartBtn) clearCartBtn.style.display = 'none';
        
        // Disable pay button
        if (payButton) {
            payButton.textContent = 'Cart is Empty';
            payButton.disabled = true;
        }
        
        return;
    }
    
    // Show cart summary and hide empty message
    if (cartSummary) cartSummary.classList.remove('d-none');
    if (emptyCartMessage) emptyCartMessage.classList.add('d-none');
    if (clearCartBtn) clearCartBtn.style.display = 'inline-block';
    
    // Calculate totals
    let subtotal = 0;
    let html = '';
    
    // Generate HTML for each cart item
    cart.forEach((item, index) => {
        const quantity = item.quantity || 1;
        const itemTotal = item.price * quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                <div class="d-flex align-items-center">
                    <img src="${item.image || 'https://via.placeholder.com/50'}" 
                         alt="${item.name}" 
                         class="rounded me-3" 
                         style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">Qty: ${quantity} × ${item.price} DT</small>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold">${itemTotal.toFixed(2)} DT</div>
                    <button class="btn btn-sm btn-outline-danger mt-1 remove-item-btn" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    // Update order items
    if (orderItems) {
        orderItems.innerHTML = html;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeItemFromCart(index);
            });
        });
    }
    
    // Calculate fees and totals
    const serviceFee = subtotal * 0.10;
    const total = subtotal + serviceFee;
    
    // Update summary
    const subtotalElement = document.getElementById('subtotal');
    const serviceFeeElement = document.getElementById('serviceFee');
    const totalElement = document.getElementById('totalAmount');
    
    if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2) + ' DT';
    if (serviceFeeElement) serviceFeeElement.textContent = serviceFee.toFixed(2) + ' DT';
    if (totalElement) totalElement.textContent = total.toFixed(2) + ' DT';
    
    // Update pay button
    if (payButton) {
        payButton.textContent = `Confirm and Pay ${total.toFixed(2)} DT`;
        payButton.disabled = false;
    }
}

// Remove single item from cart
function removeItemFromCart(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (index >= 0 && index < cart.length) {
        const itemName = cart[index].name;
        
        if (confirm(`Remove "${itemName}" from your cart?`)) {
            // Remove item from cart
            cart.splice(index, 1);
            
            // Save updated cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            loadCartItems();
            updateCartCount();
            
            alert(`"${itemName}" removed from cart`);
        }
    }
}

// Clear entire cart
function clearCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is already empty!');
        return;
    }
    
    if (confirm(`Are you sure you want to remove all ${cart.length} items from your cart?`)) {
        // Clear cart
        localStorage.removeItem('cart');
        
        // Update UI
        loadCartItems();
        updateCartCount();
        
        alert('Cart cleared successfully!');
    }
}

// Update cart count in navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCount = document.getElementById('cartCount');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Handle payment form submission
function handlePaymentSubmit(event) {
    event.preventDefault();
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty! Please add items to your cart first.');
        return;
    }
    
    // Validate form
    if (!validateForm()) {
        alert('Please fill in all fields correctly.');
        return;
    }
    
    // Get submit button
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processing...';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Create order
        const order = createOrder(cart);
        
        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.unshift(order); // Add to beginning
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart after successful payment
        localStorage.removeItem('cart');
        
        // Update UI
        updateCartCount();
        
        // Show success message
        alert(`Payment successful!\nOrder #${order.id} has been created.\nTotal: ${order.amount}`);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'compte.html';
        }, 1000);
        
    }, 2000);
}

// Create order object from cart
function createOrder(cart) {
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const serviceFee = subtotal * 0.10;
    const total = subtotal + serviceFee;
    
    // Determine product name
    let productName;
    if (cart.length === 1) {
        productName = cart[0].name;
    } else {
        productName = `${cart.length} Items`;
    }
    
    // Create order object
    const order = {
        id: 'ORD-' + Date.now().toString().slice(-8),
        date: new Date().toLocaleDateString('en-GB'),
        product: productName,
        amount: total.toFixed(2) + ' DT',
        status: 'Completed'
    };
    
    return order;
}