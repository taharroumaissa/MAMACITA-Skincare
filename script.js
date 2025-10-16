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

// ========== PRODUCT "ADD TO CART" INTERACTION ==========
document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name || 'Product';
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.style.opacity = '0.95';

    // simple visual micro-feedback; revert after short delay
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.opacity = '';
    }, 1400);

    // TODO: replace with real cart integration (localStorage / backend)
    // Example: addToCart(name);
  });
});

// ========== NEWSLETTER (fake) ==========
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button[type="submit"]');
    btn.textContent = 'Subscribed ✔';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.disabled = false;
      newsletterForm.reset();
    }, 1500);
  });
}

// ========== CONTACT FORM HANDLING ==========
// This contact form simulates sending for demo purposes.
// You can plug real email using EmailJS, Formspree, or your backend.
// I include commented examples below.

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
      message: contactForm.message.value.trim()
    };

    // --- Simulated send (demo) ---
    setTimeout(() => {
      contactStatus.textContent = '✅ Message sent — we will reply soon!';
      contactStatus.style.color = '#28a745';
      submitBtn.disabled = false;
      contactForm.reset();
    }, 1200);

    // --- Example: Send with EmailJS (uncomment + provide keys) ---
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

    // --- Example: Send to Formspree (uncomment + set action URL) ---
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
