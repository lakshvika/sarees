/**
 * =========================================
 * GLOBAL JAVASCRIPT (global.js)
 * Use this file on EVERY page.
 * =========================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global Price Formatting ---
    /**
     * Formats a number into Indian Rupee currency string.
     * @param {number} price - The price as a number (e.g., 4000)
     * @returns {string} - Formatted price (e.g., ₹4,000)
     */
    function formatPrice(price) {
        return '₹' + price.toLocaleString('en-IN');
    }
    // === THIS IS THE NEW LINE YOU REQUESTED ===
    window.formatPrice = formatPrice; // Expose function for other scripts

    // --- Global Notification ---
    /**
     * Shows a non-blocking notification at the bottom of the screen.
     * @param {string} message - The text to display.
     * @param {string} [type='info'] - 'info' or 'error'.
     */
    function showNotification(message, type = 'info') {
        // Remove any existing notification
        const oldNotification = document.querySelector('.cart-notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        // Create new notification element
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10); // Small delay to allow CSS transition

        // Automatically hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            // Remove from DOM after transition ends
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    // Expose notification function for other scripts
    window.showNotification = showNotification;

    // --- Cart Logic (Global) ---
    
    /**
     * Adds an item to the cart in localStorage.
     * @param {string} id - Product ID (e.g., 'silk-1')
     * @param {string} name - Product Name
     * @param {number} price - Product Price (numeric)
     * @param {string} imgSrc - Product Image URL
     * @param {number} [quantity=1] - Quantity to add
     */
    window.addToCart = (id, name, price, imgSrc, quantity = 1) => {
        let cart = JSON.parse(localStorage.getItem('rongtuliCart')) || [];
        const qty = parseInt(quantity, 10);
        
        const existingItemIndex = cart.findIndex(item => item.id === id);
        
        if (existingItemIndex > -1) {
            // Update quantity
            cart[existingItemIndex].qty += qty;
        } else {
            // Add new item
            cart.push({ id, name, price, imgSrc, qty });
        }
        
        localStorage.setItem('rongtuliCart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${qty} x ${name} added to cart!`, 'info');
    };

    /**
     * Updates the cart count in the header.
     */
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('rongtuliCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
        }
    }
    // Expose function for other scripts
    window.updateCartCount = updateCartCount;


    // --- Wishlist Logic (Global) ---

    /**
     * Adds an item to the wishlist in localStorage.
     * @param {string} id - Product ID
     * @param {string} name - Product Name
     * @param {number} price - Product Price
     * @param {string} imgSrc - Product Image URL
     */
    window.addToWishlist = (id, name, price, imgSrc) => {
        let wishlist = JSON.parse(localStorage.getItem('rongtuliWishlist')) || [];
        
        const existingItemIndex = wishlist.findIndex(item => item.id === id);
        
        if (existingItemIndex === -1) {
            wishlist.push({ id, name, price, imgSrc });
            localStorage.setItem('rongtuliWishlist', JSON.stringify(wishlist));
            updateWishlistCount();
            showNotification(`${name} added to wishlist!`, 'info');
        } else {
            showNotification(`${name} is already in your wishlist.`, 'info');
        }
    };

    /**
     * Updates the wishlist count in the header.
     */
    function updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('rongtuliWishlist')) || [];
        const totalItems = wishlist.length;
        const wishlistCountEl = document.getElementById('wishlist-count');
        if (wishlistCountEl) {
            wishlistCountEl.textContent = totalItems;
        }
    }
    // Expose function for other scripts
    window.updateWishlistCount = updateWishlistCount;

    // --- Global Text Logic (NEW from previous request) ---
    /**
     * Reads data-attributes for the logo and motto and sets their text content.
     */
    function setupDynamicText() {
        // Use querySelectorAll to find all elements that match the logo class and have the data attribute (for header and footer)
        const logoEls = document.querySelectorAll('.logo[data-logo-text]');
        const mottoEl = document.querySelector('.motto[data-motto-text]');

        logoEls.forEach(logoEl => {
            const logoText = logoEl.getAttribute('data-logo-text');
            if (logoText) {
                logoEl.textContent = logoText;
            }
        });
        
        if (mottoEl) {
            mottoEl.textContent = mottoEl.getAttribute('data-motto-text');
        }
    }
    // Expose for external calls if needed
    window.setupDynamicText = setupDynamicText;


    // --- Header Icon Toggles (UPDATED) ---
    /**
     * Adds toggle functionality to navbar icons.
     */
    function setupIconToggles() {
        const navIconIds = ['search-icon', 'wishlist-icon', 'profile-icon', 'cart-icon'];

        navIconIds.forEach(id => {
            const iconEl = document.getElementById(id);
            if (iconEl) {
                iconEl.addEventListener('click', (event) => {
                    const svg = event.currentTarget;
                    const anchor = svg.closest('a');
                    
                    // Toggle visual class on SVG
                    svg.classList.toggle('icon-toggled-svg');

                    // Toggle visual class on associated text span (if inside an anchor)
                    if (anchor) {
                        const span = anchor.querySelector('span');
                        if (span) {
                            span.classList.toggle('icon-toggled-text');
                        }
                    }

                    let iconName = id.split('-')[0];
                    let notificationText = `${iconName} toggled!`;
                    
                    if (id === 'search-icon') {
                        // Search is a simple toggle; prevent navigation
                        event.preventDefault(); 
                    } else {
                        // For Wishlist, Profile, and Cart, allow navigation to proceed
                        // The toggle is momentary feedback before the page unloads
                        notificationText = `Navigating to ${iconName}...`;
                    }
                    
                    showNotification(notificationText, 'info');
                });
            }
        });
    }

    // --- Initialization ---
    
    // 1. Format all prices on the page load (if any exist)
    document.querySelectorAll('.price').forEach(el => {
        const rawPrice = parseFloat(el.textContent.replace(/[₹,]/g, ''));
        if (!isNaN(rawPrice)) {
            el.textContent = formatPrice(rawPrice); // Use the local function
        }
    });

    // 2. Update counts on header on every page load
    updateCartCount();
    updateWishlistCount();

    // 3. Setup icon toggles (Now includes all four icons)
    setupIconToggles();

    // 4. Dummy Chatbot
    const chatbot = document.querySelector('.chatbot-toggler');
    if (chatbot) {
        chatbot.addEventListener('click', () => {
            showNotification("Chatbot: Hello! How can I help you today?", "info");
        });
    }

    // 5. Setup dynamic text for logo/motto
    setupDynamicText();
});