// Product Data
const products = [
    { id: 1, name: 'Fresh Apples', category: 'fruits', weight: '1 kg', price: 120, image: 'apple', unit: 'kg' },
    { id: 2, name: 'Organic Bananas', category: 'fruits', weight: '6 pcs', price: 45, image: 'banana', unit: 'bunch' },
    { id: 3, name: 'Farm Fresh Eggs', category: 'dairy', weight: '12 pcs', price: 90, image: 'egg', unit: 'dozen' },
    { id: 4, name: 'Amul Milk', category: 'dairy', weight: '1 L', price: 60, image: 'milk', unit: 'pack' },
    { id: 5, name: 'Lays Chips', category: 'snacks', weight: '52 g', price: 20, image: 'chips', unit: 'pack' },
    { id: 6, name: 'Coca Cola', category: 'beverages', weight: '750 ml', price: 45, image: 'cola', unit: 'bottle' },
    { id: 7, name: 'Basmati Rice', category: 'staples', weight: '5 kg', price: 350, image: 'rice', unit: 'bag' },
    { id: 8, name: 'Dettol Soap', category: 'household', weight: '75 g', price: 35, image: 'soap', unit: 'pack' },
    { id: 9, name: 'Fresh Tomatoes', category: 'fruits', weight: '500 g', price: 30, image: 'tomato', unit: 'pack' },
    { id: 10, name: 'Pringles', category: 'snacks', weight: '165 g', price: 150, image: 'pringles', unit: 'can' },
    { id: 11, name: 'Paneer', category: 'dairy', weight: '200 g', price: 80, image: 'paneer', unit: 'pack' },
    { id: 12, name: 'Red Bull', category: 'beverages', weight: '250 ml', price: 110, image: 'redbull', unit: 'can' }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('quickcart_cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const categoryCards = document.querySelectorAll('.category-card');
const checkoutBtn = document.getElementById('checkoutBtn');

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('quickcart_cart', JSON.stringify(cart));
    updateCartUI();
}

// Update cart UI (count, total, items list)
function updateCartUI() {
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = itemCount;
    cartTotal.textContent = `₹${total}`;
    
    renderCartItems();
}

// Render cart items in sidebar
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-basket"></i>
                <p>Your cart is empty</p>
                <p class="empty-sub">Add items from the store</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <i class="fas fa-${item.image}"></i>
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price} / ${item.unit}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            const change = parseInt(btn.dataset.change);
            updateQuantity(productId, change);
        });
    });
}

// Update product quantity
function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        const newQuantity = cart[itemIndex].quantity + change;
        if (newQuantity <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].quantity = newQuantity;
        }
        saveCart();
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            unit: product.unit,
            quantity: 1
        });
    }
    saveCart();
    showCartNotification();
}

// Show notification when item added
function showCartNotification() {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Item added to cart!';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #10b981;
        color: white;
        padding: 12px 24px;
        border-radius: 40px;
        z-index: 3000;
        font-weight: 500;
        animation: fadeInOut 2s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Render products grid
function renderProducts(filterCategory = 'all', searchTerm = '') {
    let filteredProducts = products;
    
    if (filterCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === filterCategory);
    }
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (productsGrid) {
        productsGrid.innerHTML = filteredProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <i class="fas fa-${product.image}"></i>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-weight">${product.weight}</div>
                    <div class="product-price-row">
                        <span class="product-price">₹${product.price}</span>
                        <button class="btn-add" data-id="${product.id}">Add +</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners to add buttons
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.id);
                addToCart(productId);
            });
        });
    }
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('active');
}

// Event Listeners
if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', toggleCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', toggleCart);
}

// Category filter
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        renderProducts(category, searchInput?.value || '');
        
        // Highlight active category
        categoryCards.forEach(c => c.style.background = '');
        card.style.background = '#fed7aa';
    });
});

// Search functionality
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderProducts('all', e.target.value);
    });
}

// Checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Add some items first.');
        } else {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Order placed successfully!\nTotal: ₹${total}\nYour groceries will arrive in 10 minutes! 🚀`);
            cart = [];
            saveCart();
            toggleCart();
        }
    });
}

// Initial render
renderProducts('all', '');
updateCartUI();

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        15% { opacity: 1; transform: translateX(-50%) translateY(0); }
        85% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
    }
`;
document.head.appendChild(style);
