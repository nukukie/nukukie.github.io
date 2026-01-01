/* ============================================
   NUKUKIE CRAFTS - MAIN JAVASCRIPT
   Handles filtering, carousel, animations, and interactions
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    addQuickViewButtons();
    animateProductsOnScroll();
    
    // Add dropdown filter listener
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            filterProducts(this.value);
        });
    }
});

// ============================================
// CATEGORY FILTER WITH ANIMATION
// ============================================
window.filterProducts = function(category) {
    console.log('Filtering by category:', category);
    const products = document.querySelectorAll('.product-card');
    const links = document.querySelectorAll('.filter-link');
    
    console.log('Found products:', products.length);
    
    // Update active tab
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-category') === category) {
            link.classList.add('active');
        }
    });
    
    // Also update mobile dropdown
    const mobileDropdown = document.querySelector('.mobile-filter-dropdown');
    if (mobileDropdown) {
        mobileDropdown.value = category;
    }

    // Filter products with smooth animation
    products.forEach((product, index) => {
        const productClasses = Array.from(product.classList);
        console.log('Product classes:', productClasses, 'Category:', category);
        
        if (category === 'all' || product.classList.contains(category)) {
            // Show product with staggered animation
            setTimeout(() => {
                product.classList.remove('hidden');
                product.style.display = '';
                product.style.animation = 'none';
                setTimeout(() => {
                    product.style.animation = '';
                }, 10);
            }, index * 50);
        } else {
            // Hide product
            product.classList.add('hidden');
            product.style.display = 'none';
        }
    });
}

// ============================================
// CAROUSEL FUNCTIONALITY
// ============================================
function moveCarousel(button, direction) {
    const container = button.parentElement;
    const imagesContainer = container.querySelector('.carousel-images');
    const images = imagesContainer.querySelectorAll('img');
    const dots = container.parentElement.querySelectorAll('.dot');
    
    // Find current active slide
    let currentIndex = 0;
    dots.forEach((dot, index) => {
        if (dot.classList.contains('active')) {
            currentIndex = index;
        }
    });

    // Calculate new index with infinite loop
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;

    // Update carousel position
    imagesContainer.style.transform = `translateX(-${newIndex * 100}%)`;
    
    // Update dot indicators
    dots.forEach(dot => dot.classList.remove('active'));
    dots[newIndex].classList.add('active');

    // Add subtle shake to indicate change
    button.style.animation = 'shake 0.3s';
    setTimeout(() => {
        button.style.animation = '';
    }, 300);
}

function currentSlide(dot, index) {
    const dotsContainer = dot.parentElement;
    const card = dotsContainer.parentElement;
    const imagesContainer = card.querySelector('.carousel-images');
    const dots = dotsContainer.querySelectorAll('.dot');

    // Smooth transition to selected slide
    imagesContainer.style.transform = `translateX(-${index * 100}%)`;
    
    // Update active dot
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
}

// ============================================
// QUICK VIEW FUNCTIONALITY
// ============================================
function addQuickViewButtons() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Check if button already exists
        if (!card.querySelector('.quick-view-btn')) {
            const button = document.createElement('button');
            button.className = 'quick-view-btn';
            button.textContent = 'Quick View';
            button.onclick = function() { quickView(this); };
            card.appendChild(button);
        }
    });
}

function quickView(button) {
    const card = button.closest('.product-card');
    const productName = card.querySelector('h3').textContent;
    const productPrice = card.querySelector('p').textContent;
    
    // Pulse animation on click
    button.style.animation = 'pulse 0.5s';
    setTimeout(() => {
        button.style.animation = '';
    }, 500);

    // Show alert
    setTimeout(() => {
        alert(`📦 ${productName}\n${productPrice}\n\n✨ Click "Place Your Order" button below to order this item!`);
    }, 200);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function animateProductsOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all product cards
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => observer.observe(card));
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', function(e) {
    // Press 'A' to show all products
    if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey) {
        const allLink = document.querySelector('[data-category="all"]');
        if (allLink && document.activeElement.tagName !== 'INPUT') {
            filterProducts('all');
        }
    }
});

// ============================================
// SMOOTH SCROLL TO ORDER BUTTON
// ============================================
function scrollToOrder() {
    document.querySelector('.order-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// ============================================
// ANALYTICS / TRACKING (Placeholder)
// ============================================
function trackProductClick(productName) {
    console.log('Product viewed:', productName);
    // Add your analytics code here
    // Example: gtag('event', 'product_view', { product_name: productName });
}

// ============================================
// EASTER EGG: Triple-click logo for surprise
// ============================================
const profilePic = document.querySelector('.profile-pic');
if (profilePic) {
    let clickCount = 0;
    profilePic.addEventListener('click', function() {
        clickCount++;
        if (clickCount === 3) {
            this.style.animation = 'spin 1s ease-in-out';
            setTimeout(() => {
                this.style.animation = '';
                clickCount = 0;
            }, 1000);
        }
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getVisibleProducts() {
    return Array.from(document.querySelectorAll('.product-card:not(.hidden)'));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c🎨 Welcome to Nukukie Crafts! ', 'background: #c9a882; color: white; padding: 10px; border-radius: 5px; font-size: 14px;');
console.log('%cEnjoy browsing our handcrafted products! ✨', 'color: #8b6f47; font-size: 12px;');
