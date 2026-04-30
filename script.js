// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle (Placeholder functionality)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            // Basic toggle for demonstration
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = '#fff';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    // 2. Shopping Cart / Agenda Implementation
    const cartButtons = document.querySelectorAll('.btn-cart');
    const toast = document.getElementById('toast');
    
    // Cart Elements
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBadge = document.getElementById('cart-badge');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = []; // Array to hold cart items

    // Open/Close Cart
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('show');
    }

    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Update Cart UI
    function updateCartUI() {
        cartBadge.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
            cartTotalPrice.textContent = '$0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;

        // Add event listeners to new remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1); // Remove item from array
                updateCartUI(); // Re-render
            });
        });
    }

    // Add to Cart Logic
    cartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const serviceName = this.getAttribute('data-service');
            const servicePrice = parseFloat(this.getAttribute('data-price'));
            
            // Add to array
            cart.push({ name: serviceName, price: servicePrice });
            updateCartUI();

            // Show toast notification
            showToast(`¡"${serviceName}" añadido al carrito!`);
            
            // Animation effect on button
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
            this.style.backgroundColor = '#4A3F3F';
            this.style.color = '#fff';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 2000);
        });
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('El carrito está vacío.');
            return;
        }
        
        // Build WhatsApp Message
        let message = "Hola, me gustaría agendar una cita para los siguientes servicios:%0A%0A";
        cart.forEach(item => {
            message += `- ${item.name} ($${item.price.toFixed(2)})%0A`;
        });
        message += `%0ATotal: ${cartTotalPrice.textContent}%0A%0A¿Podrían indicarme disponibilidad?`;
        
        window.open(`https://wa.me/529994420354?text=${message}`, '_blank');
        
        // Clear cart
        cart = [];
        updateCartUI();
        toggleCart();
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 3. Wishlist Toggle Animation
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                this.style.color = '#C08A89';
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    });

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // 5. Mailchimp Form Submission (Placeholder)
    const mailchimpForm = document.getElementById('mc-embedded-subscribe-form');
    if (mailchimpForm) {
        mailchimpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput.value) {
                showToast('¡Gracias por suscribirte!');
                emailInput.value = '';
            }
        });
    }

    // 6. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 7. Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 8. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Cierra todos los demás ítems abiertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Alterna el ítem actual (abre/cierra)
            item.classList.toggle('active');
        });
    });
});
