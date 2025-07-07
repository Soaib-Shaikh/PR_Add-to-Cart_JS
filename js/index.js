let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = [];
const product_grid = document.querySelector('.tab-content .product-grid');
const cart_list = document.querySelector('.offcanvas .offcanvas-body .cart-list');
const cartTotalDisplay = document.querySelector('.cart-total');
const counter = document.querySelector('.offcanvas .offcanvas-body .badge');

async function getProducts() {
    try {
        const res = await fetch('js/products.json');
        const data = await res.json();
        products = data;
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

const displayProducts = () => {
    product_grid.innerHTML = '';
    products.forEach(product => {
        const { id, name, price, rating, image } = product;
        const quantity = getCartQuantity(id) || 1;

        const col = document.createElement('div');
        col.classList.add('col');
        col.innerHTML = `
            <div class="product-item">
                <figure><img src="${image}" class="tab-image" alt="${name}"></figure>
                <h3>${name}</h3>
                <span class="qty">1 Unit</span>
                <span class="rating"><svg width="24" height="24"><use xlink:href="#star-solid"></use></svg> ${rating}</span>
                <span class="price">${price}</span>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="input-group product-qty d-flex justify-content-between">
                        <button type="button" class="quantity-left-minus btn btn-danger btn-number"><svg width="16" height="16"><use xlink:href="#minus"></use></svg></button>
                          <input type="text" class="form-control input-number " value="${quantity}" style="height: 26px; text-align: center;">
                        <button type="button" class="quantity-right-plus btn btn-success btn-number"><svg width="16" height="16"><use xlink:href="#plus"></use></svg></button>
                    </div>
                    <button type="button" class="nav-link add-to-cart-btn border px-2" data-id="${id}">Add to Cart <iconify-icon icon="uil:shopping-cart"></iconify-icon></button>
                </div>
            </div>`;
        product_grid.appendChild(col);
    });
    attachQuantityHandlers();
};

function attachQuantityHandlers() {
    document.querySelectorAll('.product-item').forEach(item => {
        const minusBtn = item.querySelector('.quantity-left-minus');
        const plusBtn = item.querySelector('.quantity-right-plus');
        const input = item.querySelector('.input-number');
        const cartBtn = item.querySelector('.add-to-cart-btn');
        const productId = parseInt(cartBtn.getAttribute('data-id'));

        plusBtn?.addEventListener('click', () => {
            let value = parseInt(input.value) || 1;
            input.value = ++value;
            const item = cart.find(p => p.id === productId);
            if (item) { item.quantity = value; renderCart(); }
        });

        minusBtn?.addEventListener('click', () => {
            let value = parseInt(input.value) || 1;
            if (value > 1) {
                input.value = --value;
                const item = cart.find(p => p.id === productId);
                if (item) { item.quantity = value; renderCart(); }
            }
        });

        cartBtn?.addEventListener('click', () => {
            const quantity = parseInt(input.value) || 1;
            handleAddtoCart(productId, quantity);
        });
    });
}

const handleAddtoCart = (productId, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
        alert("Product added to cart");
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    displayProducts();
};


function renderCart() {
    let count = 0;
    cart_list.innerHTML = '';
    if (cart.length === 0) {
        cart_list.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
        if (cartTotalDisplay) cartTotalDisplay.textContent = '$0.00';
        counter.textContent = 0;
        return;
    }

    let grandTotal = 0;

    cart.forEach(({ id, name, price, quantity }) => {
        count += quantity;
        const itemTotal = parseFloat(price.toString().replace(/[^0-9.]/g, '')) * quantity;
        grandTotal += itemTotal;

        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        li.innerHTML = `
            <div class="d-flex flex-grow-1 justify-content-between align-items-center">
                <div>
                    <strong>${name}</strong> <span class="text-muted ms-2">Qty: ${quantity}</span>
                </div>
                <div class="text-end">
                    <span class="text-muted me-3">${itemTotal.toFixed(2)}</span>
                    <button class="rem_btn btn btn-sm btn-danger" data-id="${id}">Remove</button>
                </div>
            </div>
        `;

        cart_list.appendChild(li);
    });



    counter.textContent = count;

    cart_list.innerHTML += `
        <li class="list-group-item d-flex justify-content-between">
            <strong>Total</strong><strong>${grandTotal.toFixed(2)}</strong>
        </li>`;

    if (cartTotalDisplay) cartTotalDisplay.textContent = `${grandTotal.toFixed(2)}`;

    document.querySelectorAll('.rem_btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            cart = cart.filter(item => item.id !== id);
            renderCart();
            displayProducts();
        });
    });
}

const getCartQuantity = (productId) => {
    const item = cart.find(p => p.id === productId);
    return item ? item.quantity : 0;
};


getProducts();