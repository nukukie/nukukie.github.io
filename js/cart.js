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
            url: product.url || `product-${product.id}.html`, // Store URL or generate from ID
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
    
    // Update all add-to-cart buttons to show quantity controls if in cart
    updateCartButtons();
}

// Update all add-to-cart buttons on the page
function updateCartButtons() {
    const cart = getCart();
    
    // Update product card buttons (index.html)
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        const productData = btn.getAttribute('onclick');
        if (!productData) return;
        
        // Extract product ID from onclick attribute
        const match = productData.match(/id:\s*'([^']+)'/);
        if (!match) return;
        
        const productId = match[1];
        const cartItem = cart.find(item => item.id === productId);
        
        if (cartItem) {
            // Product is in cart - show quantity controls
            btn.innerHTML = `
                <button class="qty-btn" onclick="event.stopPropagation(); updateQuantity('${productId}', ${cartItem.quantity - 1}); return false;">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="qty-display">${cartItem.quantity}</span>
                <button class="qty-btn" onclick="event.stopPropagation(); updateQuantity('${productId}', ${cartItem.quantity + 1}); return false;">
                    <i class="fas fa-plus"></i>
                </button>
            `;
            btn.classList.add('quantity-mode');
        } else {
            // Product not in cart - show add to cart icon
            btn.innerHTML = '<i class="fas fa-cart-plus"></i>';
            btn.classList.remove('quantity-mode');
        }
    });
    
    // Update product page buttons
    document.querySelectorAll('.add-to-cart-btn-page').forEach(btn => {
        const productData = btn.getAttribute('onclick');
        if (!productData) return;
        
        const match = productData.match(/id:\s*'([^']+)'/);
        const nameMatch = productData.match(/name:\s*'([^']+)'/);
        if (!match) return;
        
        const productId = match[1];
        const productName = nameMatch ? nameMatch[1] : 'Product';
        const cartItem = cart.find(item => item.id === productId);
        
        // Find or create cart count text element
        let countText = btn.parentElement.querySelector('.cart-count-text');
        if (!countText) {
            countText = document.createElement('div');
            countText.className = 'cart-count-text';
            btn.parentElement.appendChild(countText);
        }
        
        if (cartItem) {
            // Product is in cart - show quantity controls
            btn.innerHTML = `
                <button class="qty-btn-page" onclick="event.stopPropagation(); updateQuantity('${productId}', ${cartItem.quantity - 1}); return false;">
                    −
                </button>
                <span class="qty-display-page">${cartItem.quantity}</span>
                <button class="qty-btn-page" onclick="event.stopPropagation(); updateQuantity('${productId}', ${cartItem.quantity + 1}); return false;">
                    +
                </button>
            `;
            btn.classList.add('quantity-mode');
            
            // Update count text with product-specific count
            countText.textContent = `${cartItem.quantity} ${productName} in cart`;
            countText.style.display = 'block';
        } else {
            // Product not in cart - show add to cart button
            btn.innerHTML = '<i class="fas fa-shopping-bag"></i> Add to Cart';
            btn.classList.remove('quantity-mode');
            countText.style.display = 'none';
        }
    });
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
    const orderItems = cart.map(item => 
        `${item.name}\nQuantity: ${item.quantity}\nPrice: ₹${item.price}\nSubtotal: ₹${item.price * item.quantity}`
    ).join('\n\n');
    
    // Calculate totals
    const subtotal = getCartTotal();
    let discount = 0;
    let total = subtotal;
    
    // Apply 10% discount if subtotal is above 599
    if (subtotal > 599) {
        discount = Math.round(subtotal * 0.1);
        total = subtotal - discount;
    }
    
    // Build full order summary
    let orderSummary = `${orderItems}\n\n---\nSubtotal: ₹${subtotal}`;
    if (discount > 0) {
        orderSummary += `\nDiscount (10%): -₹${discount}`;
    }
    orderSummary += `\nTotal: ₹${total}`;
    
    // Encode the data for URL
    const encodedOrderItems = encodeURIComponent(orderSummary);
    const encodedTotal = encodeURIComponent(`₹${total}`);
    
    // Build the Google Form URL with pre-filled data
    const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSejCZi0WWlWtbkBu4tl3fF0PrGLsS-AgurIZOh0xPUuL4EOkw/viewform?usp=pp_url&entry.1150537604=${encodedOrderItems}&entry.575583676=${encodedTotal}`;
    
    // Redirect to Google Form
    window.location.href = formUrl;
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
