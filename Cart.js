document.addEventListener('DOMContentLoaded', () => {

    // Check if global functions are available
    if (!window.formatPrice || !window.updateCartCount || !window.showNotification) {
        console.error("Error: Global script (global.js) is missing or loaded incorrectly.");
        return;
    }

    // DOM Elements
    const cartItemsBody = document.getElementById('cart-items-body');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const cartTable = document.getElementById('cart-table');
    const orderSummaryBox = document.getElementById('order-summary-box');
    const cartLayout = document.querySelector('.cart-layout'); // <-- ADD THIS LINE
    
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const totalEl = document.getElementById('cart-total');

    const shippingCost = 200; // Flat rate shipping

    /**
     * Loads cart items from localStorage and displays them.
     */
    function loadCartPage() {
        const cart = JSON.parse(localStorage.getItem('rongtuliCart')) || [];

        if (cart.length === 0) {
            emptyMsg.style.display = 'block';
            cartLayout.style.display = 'none'; // <-- THIS LINE IS NEW
            // cartTable.style.display = 'none'; // <-- This is no longer needed
            // orderSummaryBox.style.display = 'none'; // <-- This is no longer needed
            updateTotals(0); // Set totals to 0
        } else {
            emptyMsg.style.display = 'none';
            cartLayout.style.display = 'grid'; // <-- THIS LINE IS NEW (uses 'grid' to match CSS)
            // cartTable.style.display = 'table'; // <-- This is no longer needed
            // orderSummaryBox.style.display = 'block'; // <-- This is no longer needed

            cartItemsBody.innerHTML = ''; // Clear existing items
            let subtotal = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.qty;
                subtotal += itemTotal;

                const row = document.createElement('tr');
                
                // This structure helps with mobile responsiveness
                row.innerHTML = `
                    <td colspan="2" class="cart-item-info-cell" data-label="Product">
                        <div class="cart-item-info">
                            <img src="${item.imgSrc || 'https://placehold.co/80x100/FFF8DC/800000?text=Rongtuli'}" alt="${item.name}">
                            <div class="item-details">
                                <h3>${item.name}</h3>
                            </div>
                        </div>
                    </td>
                    <td data-label="Price">${window.formatPrice(item.price)}</td>
                    <td data-label="Quantity">
                        <input type="number" class="cart-quantity-input" value="${item.qty}" min="1" data-id="${item.id}">
                    </td>
                    <td data-label="Total">${window.formatPrice(itemTotal)}</td>
                    <td data-label="Remove">
                        <button class="btn-remove-item" data-id="${item.id}">×</button>
                    </td>
                `;
                cartItemsBody.appendChild(row);
            });
            
            updateTotals(subtotal);
        }
    }

    /**
     * Updates the subtotal, shipping, and grand total in the summary box.
     * @param {number} subtotal - The calculated subtotal.
     */
    function updateTotals(subtotal) {
        let currentShipping = (subtotal > 0) ? shippingCost : 0;
        const grandTotal = subtotal + currentShipping;

        subtotalEl.textContent = window.formatPrice(subtotal);
        shippingEl.textContent = window.formatPrice(currentShipping);
        totalEl.textContent = window.formatPrice(grandTotal);
    }

    /**
     * Updates an item's quantity in the cart.
     * @param {string} id - The ID of the item to update.
     * @param {number} newQty - The new quantity.
     */
    function updateCartQuantity(id, newQty) {
        let cart = JSON.parse(localStorage.getItem('rongtuliCart')) || [];
        const newQuantity = parseInt(newQty, 10);

        if (newQuantity <= 0) {
            // If quantity is 0 or less, remove the item
            removeFromCart(id);
            return;
        }

        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].qty = newQuantity;
        }

        localStorage.setItem('rongtuliCart', JSON.stringify(cart));
        loadCartPage(); // Reload the whole cart
        window.updateCartCount(); // Update header count
    }

    /**
     * Removes an item from the cart.
     * @param {string} id - The ID of the item to remove.
     */
    function removeFromCart(id) {
        let cart = JSON.parse(localStorage.getItem('rongtuliCart')) || [];
        const itemToRemove = cart.find(item => item.id === id);

        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('rongtuliCart', JSON.stringify(cart));

        if (itemToRemove) {
            window.showNotification(`${itemToRemove.name} removed from cart.`, 'info');
        }

        loadCartPage(); // Reload the whole cart
        window.updateCartCount(); // Update header count
    }

    // --- Event Listeners for Cart Page ---
    cartItemsBody.addEventListener('change', (event) => {
        if (event.target.classList.contains('cart-quantity-input')) {
            const id = event.target.dataset.id;
            const newQty = event.target.value;
            updateCartQuantity(id, newQty);
        }
    });

    cartItemsBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-remove-item')) {
            const id = event.target.dataset.id;
            removeFromCart(id);
        }
    });

    // Initial load
    loadCartPage();

});


