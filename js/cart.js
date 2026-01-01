// Shopping Cart Management using sessionStorage

// Initialize cart from sessionStorage or create empty cart
function initCart() {
    const cart = sessionStorage.getItem('nukukieCart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to sessionStorage
function saveCart(cart) {
    sessionStorage.setItem('nukukieCart', JSON.stringify(cart));
    updateCartDisplay();
}

// Get current cart
function getCart() {
    return initCart();
}

// Add item to cart
function addToCart(product) {
    const cart = getCart();
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showCartNotification(`${product.name} added to cart!`);
    return cart;
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

// Update item quantity
function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
    
    return cart;
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
function getCartCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear cart
function clearCart() {
    sessionStorage.removeItem('nukukieCart');
    updateCartDisplay();
}

// Update cart display (badge count)
function updateCartDisplay() {
    const cartCount = getCartCount();
    const cartBadge = document.querySelector('.cart-badge');
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    if (cartBadge) {
        if (cartCount > 0) {
            cartBadge.textContent = cartCount;
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
    
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
    
    // Update cart modal if open
    if (document.querySelector('.cart-modal.active')) {
        renderCartItems();
    }
}

// Render cart items in modal
function renderCartItems() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartFooter = document.querySelector('.cart-footer');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartFooter) cartFooter.style.display = 'none';
        return;
    }
    
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">₹${item.price}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Remove from cart">×</button>
        </div>
    `).join('');
    
    if (cartTotal) {
        cartTotal.textContent = `₹${getCartTotal()}`;
    }
}

// Show cart notification
function showCartNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Toggle cart modal
function toggleCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    cartModal.classList.toggle('active');
    
    if (cartModal.classList.contains('active')) {
        renderCartItems();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close cart modal
function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Build the order summary
    const orderSummary = cart.map(item => 
        `${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`
    ).join('\n');
    
    const total = getCartTotal();
    const fullSummary = `${orderSummary}\n\nTotal: ₹${total}`;
    
    // Store order details in sessionStorage for the form
    sessionStorage.setItem('orderSummary', fullSummary);
    sessionStorage.setItem('orderTotal', total.toString());
    
    // Redirect to Google Form
    window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSejCZi0WWlWtbkBu4tl3fF0PrGLsS-AgurIZOh0xPUuL4EOkw/viewform';
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    
    // Close modal when clicking outside
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                closeCartModal();
            }
        });
    }
    
    // Auto-detect product info on product pages
    autoDetectProductInfo();
});

// Auto-detect product information from page structure
function autoDetectProductInfo() {
    const productTitle = document.querySelector('.product-title');
    const productPrice = document.querySelector('.price');
    const mainImage = document.querySelector('#mainImage') || document.querySelector('.main-image-container img');
    
    if (productTitle && productPrice && mainImage) {
        // Store product info in window for easy access
        window.currentPageProduct = {
            name: productTitle.textContent.trim(),
            price: parseInt(productPrice.textContent.replace('₹', '').replace(',', '').trim()),
            image: mainImage.getAttribute('src'),
            id: 'product-' + productTitle.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        };
    }
}

// Make functions globally accessible
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleCartModal = toggleCartModal;
window.closeCartModal = closeCartModal;
window.proceedToCheckout = proceedToCheckout;
window.getCart = getCart;
window.clearCart = clearCart;
