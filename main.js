let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = [];
let product_grid = document.querySelector('.tab-content .product-grid');
let cart_list = document.querySelector('.offcanvas .offcanvas-body .cart-list'); // Make sure .cart-list exists

// Fetch products from products.json
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

// Display all products
const displayProducts = () => {
    product_grid.innerHTML = '';

    products.forEach(product => {
        const { id, name, price, rating, image } = product;
        const col = document.createElement('div');
        col.classList.add('col');

        col.innerHTML = `
            <div class="product-item">
                <span class="badge bg-success position-absolute m-3">-30%</span>
                <a href="#" class="btn-wishlist"><svg width="24" height="24"><use xlink:href="#heart"></use></svg></a>
                <figure>
                  <a href="index.html" title="${name}">
                    <img src="${image}" class="tab-image">
                  </a>
                </figure>
                <h3>${name}</h3>
                <span class="qty">1 Unit</span><span class="rating">
                    <svg width="24" height="24" class="text-primary"><use xlink:href="#star-solid"></use></svg> ${rating}
                </span>
                <span class="price">${price}</span>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="input-group product-qty">
                      <span class="input-group-btn">
                          <button type="button" class="quantity-left-minus btn btn-danger btn-number" data-type="minus">
                            <svg width="16" height="16"><use xlink:href="#minus"></use></svg>
                          </button>
                      </span>
                      <input type="text" name="quantity" class="form-control input-number" value="1">
                      <span class="input-group-btn">
                          <button type="button" class="quantity-right-plus btn btn-success btn-number" data-type="plus">
                              <svg width="16" height="16"><use xlink:href="#plus"></use></svg>
                          </button>
                      </span>
                  </div>
                  <button type="button" class="nav-link" onclick='handleAddtoCart(${id})'>
                    Add to Cart <iconify-icon icon="uil:shopping-cart"></iconify-icon>
                  </button>
                </div>
            </div>
        `;
        product_grid.appendChild(col);
    });
}

// Add to cart function
const handleAddtoCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    renderCart();
}


// Display items in the cart section
function renderCart() {
    cart_list.innerHTML = '';

    if (cart.length === 0) {
        cart_list.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
        return;
    }

    let grandTotal = 0;

    cart.forEach(item => {
        const { name, price, quantity } = item;
        const itemTotal = parseFloat(price.toString().replace(/[^0-9.]/g, '')) * quantity;


        grandTotal += itemTotal;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
            <div>
                <h6 class="my-0">${name}</h6>
                <small class="text-muted">Qty: ${quantity}</small>
            </div>
            <span class="text-muted">₹ ${itemTotal.toFixed(2)}</span>
        `;

        cart_list.appendChild(li);
    });

    // Show total
    const totalLi = document.createElement('li');
    totalLi.className = 'list-group-item d-flex justify-content-between';
    totalLi.innerHTML = `
        <strong>Total</strong>
        <strong>$${grandTotal.toFixed(2)}</strong>
    `;
    cart_list.appendChild(totalLi);
}



getProducts();
