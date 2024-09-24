document.addEventListener("DOMContentLoaded", () => {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(products => {
            displayProducts(products);
        });
});

let cart = {};

function displayProducts(products) {
    const productContainer = document.getElementById("product-container");

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";

        const img = document.createElement("img");
        img.src = product.image;
        productCard.appendChild(img);

        const productName = document.createElement("h4");
        productName.textContent = product.title;
        productCard.appendChild(productName);

        const price = document.createElement("p");
        price.textContent = `₹${product.price}`;
        productCard.appendChild(price);

        const rating = document.createElement("p");
        rating.innerHTML = `<span>⭐</span> ${product.rating.rate.toFixed(1)}`;
        productCard.appendChild(rating);

        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "Add to Cart";
        addToCartBtn.className = "add-to-cart-btn";
        addToCartBtn.onclick = () => addToCart(product);
        productCard.appendChild(addToCartBtn);

        productContainer.appendChild(productCard);
    });
}

function addToCart(product) {
    if (!cart[product.id]) {
        cart[product.id] = { ...product, quantity: 1 };
    } else {
        cart[product.id].quantity += 1;
    }
    updateCart();
}

function changeQuantity(productId, change) {
    if (cart[productId]) {
        cart[productId].quantity += change;
        if (cart[productId].quantity <= 0) {
            delete cart[productId];
        }
        updateCart();
    }
}

function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    let totalMRP = 0;
    let platformFee = 10;
    let shippingCharges = 20;

    Object.values(cart).forEach(item => {
        totalMRP += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const img = document.createElement("img");
        img.src = item.image;
        cartItem.appendChild(img);

        const name = document.createElement("h4");
        name.textContent = item.title;
        cartItem.appendChild(name);

        const qtyContainer = document.createElement("div");
        qtyContainer.className = "qty-container";

        const minusBtn = document.createElement("button");
        minusBtn.className = "quantity-btn";
        minusBtn.textContent = "-";
        minusBtn.onclick = () => changeQuantity(item.id, -1);
        qtyContainer.appendChild(minusBtn);

        const qtyDisplay = document.createElement("span");
        qtyDisplay.textContent = item.quantity;
        qtyContainer.appendChild(qtyDisplay);

        const plusBtn = document.createElement("button");
        plusBtn.className = "quantity-btn";
        plusBtn.textContent = "+";
        plusBtn.onclick = () => changeQuantity(item.id, 1);
        qtyContainer.appendChild(plusBtn);

        cartItem.appendChild(qtyContainer);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove-from-cart-btn";
        removeBtn.onclick = () => {
            delete cart[item.id];
            updateCart();
        };
        cartItem.appendChild(removeBtn);

        cartItemsContainer.appendChild(cartItem);
    });

    const couponDiscount = totalMRP * 0.10; // 10% coupon discount
    const totalAmount = totalMRP - couponDiscount + platformFee + shippingCharges;

    document.getElementById("total-mrp").textContent = `₹${totalMRP > 0 ? totalMRP.toFixed(2) : '0.00'}`;
    document.getElementById("coupon-discount").textContent = `₹${couponDiscount.toFixed(2)}`;
    document.getElementById("platform-fee").textContent = `₹${platformFee.toFixed(2)}`;
    document.getElementById("shipping-charges").textContent = `₹${shippingCharges.toFixed(2)}`;
    document.getElementById("total-amount").textContent = `₹${totalAmount > 0 ? totalAmount.toFixed(2) : '0.00'}`;
}
