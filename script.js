// ========== NAV TOGGLE ==========
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('nav--open');
  });
  
  // close when clicking a nav link (mobile)
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ========== SHOPPING CART FUNCTIONALITY ==========
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('mamacita-cart')) || [];
    this.init();
  }

  init() {
    this.updateCartUI();
    this.bindEvents();
  }

  bindEvents() {
    // Cart toggle
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    document.body.appendChild(cartOverlay);

    if (cartIcon && cartSidebar) {
      cartIcon.addEventListener('click', () => this.toggleCart());
      closeCart.addEventListener('click', () => this.closeCart());
      cartOverlay.addEventListener('click', () => this.closeCart());
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.handleCheckout());
    }
  }

  toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.querySelector('.cart-overlay');
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }

  closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.querySelector('.cart-overlay');
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
  }

  addItem(productName, price) {
    const existingItem = this.items.find(item => item.name === productName);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        name: productName,
        price: parseFloat(price),
        quantity: 1
      });
    }
    
    this.saveToStorage();
    this.updateCartUI();
    this.showAddToCartFeedback(productName);
  }

  removeItem(productName) {
    this.items = this.items.filter(item => item.name !== productName);
    this.saveToStorage();
    this.updateCartUI();
  }

  updateQuantity(productName, change) {
    const item = this.items.find(item => item.name === productName);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        this.removeItem(productName);
      } else {
        this.saveToStorage();
        this.updateCartUI();
      }
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  saveToStorage() {
    localStorage.setItem('mamacita-cart', JSON.stringify(this.items));
  }

  updateCartUI() {
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = this.getTotalItems();
    }

    // Update cart items
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartItems && cartTotal) {
      if (this.items.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      } else {
        cartItems.innerHTML = this.items.map(item => `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
              <button class="quantity-btn" onclick="cart.updateQuantity('${item.name}', -1)">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" onclick="cart.updateQuantity('${item.name}', 1)">+</button>
              <button class="remove-item" onclick="cart.removeItem('${item.name}')">×</button>
            </div>
          </div>
        `).join('');
      }
      
      cartTotal.textContent = this.getTotal().toFixed(2);
    }
  }

  showAddToCartFeedback(productName) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: var(--success);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: var(--shadow);
      z-index: 1000;
      transform: translateX(400px);
      transition: transform 0.3s ease;
    `;
    toast.textContent = `✓ Added ${productName} to cart!`;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.style.transform = 'translateX(0)', 100);
    
    // Remove after delay
    setTimeout(() => {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  handleCheckout() {
    if (this.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Simulate checkout process
    const checkoutBtn = document.getElementById('checkoutBtn');
    const originalText = checkoutBtn.textContent;
    
    checkoutBtn.textContent = 'Processing...';
    checkoutBtn.disabled = true;

    setTimeout(() => {
      alert('Thank you for your order! This is a demo store.');
      this.items = [];
      this.saveToStorage();
      this.updateCartUI();
      this.closeCart();
      
      checkoutBtn.textContent = originalText;
      checkoutBtn.disabled = false;
    }, 2000);
  }
}

// Initialize cart
const cart = new ShoppingCart();

// ========== PRODUCT "ADD TO CART" INTERACTION ==========
document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name || 'Product';
    const price = btn.dataset.price || '0';
    
    cart.addItem(name, price);
    
    // Visual feedback on button
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.style.opacity = '0.95';

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.opacity = '';
    }, 1400);
  });
});

// ========== FAVORITE BUTTONS ==========
document.querySelectorAll('.favorite-btn').forEach(btn => {
  // Load favorite state from localStorage
  const productName = btn.dataset.product;
  const favorites = JSON.parse(localStorage.getItem('mamacita-favorites')) || [];
  if (favorites.includes(productName)) {
    btn.textContent = '♥';
    btn.classList.add('active');
  }

  btn.addEventListener('click', () => {
    let favorites = JSON.parse(localStorage.getItem('mamacita-favorites')) || [];
    const isFavorite = favorites.includes(productName);
    
    if (isFavorite) {
      favorites = favorites.filter(fav => fav !== productName);
      btn.textContent = '♡';
      btn.classList.remove('active');
    } else {
      favorites.push(productName);
      btn.textContent = '♥';
      btn.classList.add('active');
    }
    
    localStorage.setItem('mamacita-favorites', JSON.stringify(favorites));
  });
});

// ========== PRODUCT CATEGORIES FILTER ==========
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // In a real implementation, you would filter products here
    // For now, we'll just show a message
    const category = btn.dataset.category;
    if (category !== 'all') {
      alert(`Filtering by ${category} - This would filter products in a real implementation`);
    }
  });
});

// ========== NEWSLETTER FORM ==========
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    
    btn.textContent = 'Subscribed ✔';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      newsletterForm.reset();
      
      // Show success message
      alert('Welcome to the MAMACITA family! Check your email for your 15% off coupon.');
    }, 1500);
  });
}

// ========== CONTACT FORM HANDLING ==========
const contactForm = document.getElementById('contactForm');
const contactStatus = document.getElementById('contact-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    contactStatus.textContent = 'Sending...';
    contactStatus.style.color = '#666';
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    const data = {
      name: contactForm.name.value.trim(),
      email: contactForm.email.value.trim(),
      subject: contactForm.subject.value,
      message: contactForm.message.value.trim()
    };

    // --- Simulated send (demo) ---
    setTimeout(() => {
      contactStatus.textContent = '✅ Message sent — we will reply soon!';
      contactStatus.style.color = '#28a745';
      submitBtn.disabled = false;
      contactForm.reset();
    }, 1200);

    // --- Uncomment and configure for real form submission:

    // EmailJS example:
    /*
    if (window.emailjs) {
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', data)
        .then(() => {
          contactStatus.textContent = '✅ Message sent — we will reply soon!';
          contactStatus.style.color = '#28a745';
          contactForm.reset();
          submitBtn.disabled = false;
        }, (err) => {
          contactStatus.textContent = '❌ Error sending — try again later.';
          contactStatus.style.color = '#d9534f';
          submitBtn.disabled = false;
          console.error('EmailJS error', err);
        });
    }
    */

    // Formspree example:
    /*
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        contactStatus.textContent = '✅ Message sent — we will reply soon!';
        contactStatus.style.color = '#28a745';
        contactForm.reset();
      } else {
        throw new Error('Network response not ok');
      }
    } catch (err) {
      contactStatus.textContent = '❌ Error sending — try again later.';
      contactStatus.style.color = '#d9534f';
    } finally {
      submitBtn.disabled = false;
    }
    */
  });
}

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========== LAZY LOADING IMAGES ==========
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ========== STICKY HEADER ENHANCEMENT ==========
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.backdropFilter = 'blur(10px)';
  } else {
    header.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.85))';
    header.style.backdropFilter = 'blur(6px)';
  }
});

console.log('MAMACITA Skincare website loaded successfully! 🧴✨');
