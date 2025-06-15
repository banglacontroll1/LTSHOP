document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.header .container').appendChild(menuToggle);

    const navbar = document.querySelector('.navbar');
    menuToggle.addEventListener('click', function () {
        navbar.classList.toggle('active');
        menuToggle.innerHTML = navbar.classList.contains('active') ?
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Sticky Header on Scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            navbar.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Product Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Filter products
            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentTestimonial = 0;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        currentTestimonial = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });

    prevBtn.addEventListener('click', () => {
        let newIndex = currentTestimonial - 1;
        if (newIndex < 0) newIndex = testimonials.length - 1;
        showTestimonial(newIndex);
    });

    nextBtn.addEventListener('click', () => {
        let newIndex = currentTestimonial + 1;
        if (newIndex >= testimonials.length) newIndex = 0;
        showTestimonial(newIndex);
    });

    // Auto-rotate testimonials
    setInterval(() => {
        let newIndex = currentTestimonial + 1;
        if (newIndex >= testimonials.length) newIndex = 0;
        showTestimonial(newIndex);
    }, 5000);

    // Shopping Cart Functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-price');
    const cartCount = document.querySelector('.cart-count');

    let cart = [];

    // Toggle Cart Sidebar
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }

    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    // Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            const productId = productCard.getAttribute('data-id') || Math.random().toString(36).substr(2, 9);
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('€', ''));
            const productImage = productCard.querySelector('img').src;

            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }

            updateCart();
            toggleCart();

            // Show added animation
            const addedMsg = document.createElement('div');
            addedMsg.className = 'added-to-cart-msg';
            addedMsg.textContent = 'Aggiunto al carrello!';
            document.body.appendChild(addedMsg);

            setTimeout(() => {
                addedMsg.classList.add('show');
            }, 10);

            setTimeout(() => {
                addedMsg.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(addedMsg);
                }, 300);
            }, 2000);
        });
    });

    // Update Cart
    function updateCart() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Il tuo carrello è vuoto</p></div>';
            cartTotal.textContent = '€0.00';
            cartCount.textContent = '0';
            return;
        }

        let total = 0;
        let itemCount = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-price">€${item.price.toFixed(2)}</span>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <div class="remove-item"><i class="fas fa-trash"></i></div>
            `;

            cartItemsContainer.appendChild(cartItem);

            // Update totals
            total += item.price * item.quantity;
            itemCount += item.quantity;

            // Add event listeners to quantity buttons
            const minusBtn = cartItem.querySelector('.minus');
            const plusBtn = cartItem.querySelector('.plus');
            const quantityInput = cartItem.querySelector('.quantity-input');
            const removeBtn = cartItem.querySelector('.remove-item');

            minusBtn.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    quantityInput.value = item.quantity;
                    updateCart();
                }
            });

            plusBtn.addEventListener('click', () => {
                item.quantity++;
                quantityInput.value = item.quantity;
                updateCart();
            });

            removeBtn.addEventListener('click', () => {
                cart = cart.filter(cartItem => cartItem.id !== item.id);
                updateCart();
            });
        });

        cartTotal.textContent = `€${total.toFixed(2)}`;
        cartCount.textContent = itemCount;
    }

    // Quick View Modal
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.querySelector('.quick-view-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModal = document.querySelector('.close-modal');

    function openQuickView(productCard) {
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productImage = productCard.querySelector('img').src;
        const productRating = productCard.querySelector('.rating').innerHTML;

        quickViewModal.querySelector('.modal-body').innerHTML = `
            <div class="modal-image">
                <img src="${productImage}" alt="${productName}">
            </div>
            <div class="modal-details">
                <h3>${productName}</h3>
                <div class="modal-price">${productPrice}</div>
                <div class="modal-rating">
                    ${productRating}
                </div>
                <p class="modal-description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
                </p>
                <div class="modal-actions">
                    <button class="btn add-to-cart">Aggiungi al carrello</button>
                    <button class="btn" style="background-color: var(--secondary-color);">Acquista ora</button>
                </div>
            </div>
        `;

        // Add event listener to the new add-to-cart button
        quickViewModal.querySelector('.add-to-cart').addEventListener('click', function () {
            const productId = productCard.getAttribute('data-id') || Math.random().toString(36).substr(2, 9);

            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: parseFloat(productPrice.replace('€', '')),
                    image: productImage,
                    quantity: 1
                });
            }

            updateCart();
            closeQuickView();

            // Show added animation
            const addedMsg = document.createElement('div');
            addedMsg.className = 'added-to-cart-msg';
            addedMsg.textContent = 'Aggiunto al carrello!';
            document.body.appendChild(addedMsg);

            setTimeout(() => {
                addedMsg.classList.add('show');
            }, 10);

            setTimeout(() => {
                addedMsg.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(addedMsg);
                }, 300);
            }, 2000);
        });

        quickViewModal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeQuickView() {
        quickViewModal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = this.closest('.product-card');
            openQuickView(productCard);
        });
    });

    closeModal.addEventListener('click', closeQuickView);
    modalOverlay.addEventListener('click', closeQuickView);

    // Added to cart message styles
    const style = document.createElement('style');
    style.textContent = `
        .added-to-cart-msg {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-color);
            color: white;
            padding: 15px 30px;
            border-radius: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1300;
        }
        
        .added-to-cart-msg.show {
            opacity: 1;
            bottom: 30px;
        }
    `;
    document.head.appendChild(style);

    // Initialize cart
    updateCart();
});