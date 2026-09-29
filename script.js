// Cart
// =========================
// User Login Helper Functions
// =========================

function getLoggedInUser() {

    const user =
        JSON.parse(
            localStorage.getItem("studenthubUser")
        );

    const loggedIn =
        localStorage.getItem("studenthubLoggedIn");

    if (!user || loggedIn !== "true") {
        return null;
    }

    return user;
}


function getUserKey(type) {

    const user = getLoggedInUser();

    if (!user) {
        return null;
    }

    return "studenthub_" + type + "_" + user.email;
}


function saveUserCart() {

    const cartKey =
        getUserKey("cart");

    if (cartKey) {

        localStorage.setItem(
            cartKey,
            JSON.stringify(cart)
        );
    }
}


function saveUserWishlist() {

    const wishlistKey =
        getUserKey("wishlist");

    if (wishlistKey) {

        localStorage.setItem(
            wishlistKey,
            JSON.stringify(wishlist)
        );
    }
}
function loadUserData() {

    const user = getLoggedInUser();

    if (!user) {
        cart = [];
        wishlist = [];
        return;
    }


    // Load this user's cart
    const cartKey = getUserKey("cart");

    cart =
        JSON.parse(
            localStorage.getItem(cartKey)
        ) || [];


    // Load this user's wishlist
    const wishlistKey = getUserKey("wishlist");

    wishlist =
        JSON.parse(
            localStorage.getItem(wishlistKey)
        ) || [];
}

// =========================
// User Specific Cart & Wishlist
// =========================

let cart = [];

let wishlist = [];
let orders =
    JSON.parse(localStorage.getItem("studenthubOrders")) || [];


// Add product to cart
function addToCart(name, price) {

    const user = getLoggedInUser();

    if (!user) {

        showNotification(
            "Login Required",
            "Please login to add products to your cart.",
            "🔐"
        );

        return;
    }

    cart.push({
        name: name,
        price: price
    });

    saveUserCart();

    document.getElementById("cartCount").textContent = cart.length;

    showNotification(
        "Added to Cart!",
        name + " has been added to your cart.",
        "🛒"
    );
}


// Show cart
function showCart() {

    const user = getLoggedInUser();

    if (!user) {

        showNotification(
            "Login Required",
            "Please login to view your cart.",
            "🔐"
        );

        return;
    }


    const cartModal =
        document.getElementById("cartModal");

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent =
            "Total: ₹0";

    } else {

        let total = 0;


        cart.forEach((item, index) => {

            total += item.price;


            cartItems.innerHTML += `
                <div class="cart-item">

                    <span>
                        ${item.name}
                    </span>

                    <span>
                        ₹${item.price}

                        <button
                            onclick="removeFromCart(${index})">
                            ❌
                        </button>

                    </span>

                </div>
            `;

        });


        cartTotal.textContent =
            "Total: ₹" + total;
    }


    cartModal.style.display = "flex";
}

// Remove item
function removeFromCart(index) {

    const user = getLoggedInUser();

    if (!user) {

        showNotification(
            "Login Required",
            "Please login to manage your cart.",
            "🔐"
        );

        return;
    }


    cart.splice(index, 1);


    // Save only this user's cart
    saveUserCart();


    document.getElementById("cartCount").textContent =
        cart.length;


    showCart();


    showNotification(
        "Removed from Cart",
        "The product has been removed from your cart.",
        "🗑️"
    );
}


// Close cart
function closeCart() {

    document.getElementById("cartModal").style.display = "none";
}


// Login

function openLogin() {

    document.getElementById("loginModal").style.display = "flex";

}


function closeLogin() {

    document.getElementById("loginModal").style.display = "none";

}


// Login User

function loginUser() {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    if (email === "" || password === "") {

        showNotification(
            "Missing Details",
            "Please enter your email and password.",
            "⚠️"
        );

        return;
    }


    // Get all registered users
    const users =
        JSON.parse(
            localStorage.getItem("studenthubUsers")
        ) || [];


    // Find matching user
    const savedUser =
        users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase() &&
                user.password === password
        );


    if (!savedUser) {

        showNotification(
            "Login Failed",
            "Incorrect email or password.",
            "⚠️"
        );

        return;
    }


    // Save the currently logged-in user
    localStorage.setItem(
        "studenthubUser",
        JSON.stringify(savedUser)
    );


    localStorage.setItem(
        "studenthubLoggedIn",
        "true"
    );


    // Load this user's cart and wishlist
    loadUserData();


    // Update cart count
    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent =
            cart.length;
    }


    // Update wishlist display
    if (
        typeof displayWishlist === "function"
    ) {

        displayWishlist();
    }


    // Update orders display
    if (
        typeof displayOrders === "function"
    ) {

        displayOrders();
    }


    closeLogin();

    updateUserUI();


    // Clear login fields
    document.getElementById("email").value = "";

    document.getElementById("password").value = "";


    showNotification(
        "Login Successful!",
        "Welcome " + savedUser.name + " 🎓",
        "✓"
    );

}
// Register

function openRegister() {

    closeLogin();

    document.getElementById("registerModal").style.display = "flex";

}


function closeRegister() {

    document.getElementById("registerModal").style.display = "none";

}


// Register Account
// Register

function registerUser() {

    document.getElementById("loginModal").style.display = "none";

    document.getElementById("registerModal").style.display = "flex";

}


function registerAccount() {

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;


    if (name === "" || email === "" || password === "") {

        showNotification(
            "Missing Details",
            "Please fill all registration details.",
            "⚠️"
        );

        return;
    }


    if (password.length < 6) {

        showNotification(
            "Weak Password",
            "Password must contain at least 6 characters.",
            "⚠️"
        );

        return;
    }


    // Get all registered users
    let users =
        JSON.parse(
            localStorage.getItem("studenthubUsers")
        ) || [];


    // Check whether email already exists
    const existingUser =
        users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );


    if (existingUser) {

        showNotification(
            "Account Already Exists",
            "This email is already registered. Please login.",
            "⚠️"
        );

        return;
    }


    // Create new user
    const user = {

        name: name,

        email: email,

        password: password

    };


    // Add user to users list
    users.push(user);


    // Save all users
    localStorage.setItem(
        "studenthubUsers",
        JSON.stringify(users)
    );


    // Also keep the current user compatible
    // with the existing login system
    localStorage.setItem(
        "studenthubUser",
        JSON.stringify(user)
    );


    // Close register modal
    document.getElementById(
        "registerModal"
    ).style.display = "none";


    // Open login modal
    document.getElementById(
        "loginModal"
    ).style.display = "flex";


    // Clear registration fields
    document.getElementById(
        "registerName"
    ).value = "";

    document.getElementById(
        "registerEmail"
    ).value = "";

    document.getElementById(
        "registerPassword"
    ).value = "";


    showNotification(
        "Account Created!",
        "Your StudentHub account was created successfully.",
        "🎉"
    );

}

function closeRegister() {

    document.getElementById("registerModal").style.display = "none";

}


function showLoginFromRegister() {

    document.getElementById("registerModal").style.display = "none";

    document.getElementById("loginModal").style.display = "flex";

}



function backToLogin() {

    closeRegister();

    openLogin();

}

// Wishlist


// Search products
function searchProducts() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }


    const searchValue =
        searchInput.value
        .toLowerCase()
        .trim();


    const products =
        document.querySelectorAll(".product-card");


    let foundProducts = 0;


    products.forEach(product => {

        const nameElement =
            product.querySelector("h3");


        const productName =
            nameElement
                ? nameElement.textContent.toLowerCase()
                : "";


        const category =
            product.dataset.category
                ? product.dataset.category.toLowerCase()
                : "";


        const descriptionElement =
            product.querySelector("p");


        const description =
            descriptionElement
                ? descriptionElement.textContent.toLowerCase()
                : "";


        if (
            productName.includes(searchValue) ||
            category.includes(searchValue) ||
            description.includes(searchValue)
        ) {

            product.style.display = "";

            foundProducts++;

        } else {

            product.style.display = "none";

        }

    });


    // No products message

    let noProducts =
        document.getElementById(
            "noProductsMessage"
        );


    if (
        foundProducts === 0 &&
        searchValue !== ""
    ) {

        if (!noProducts) {

            noProducts =
                document.createElement("p");

            noProducts.id =
                "noProductsMessage";

            noProducts.textContent =
                "❌ No products found.";

            noProducts.style.textAlign =
                "center";

            noProducts.style.fontSize =
                "18px";

            noProducts.style.marginTop =
                "20px";

            noProducts.style.color =
                "#777";


            const container =
                document.getElementById(
                    "productContainer"
                );

            if (container) {

                container.appendChild(
                    noProducts
                );
            }

        }

    } else {

        if (noProducts) {

            noProducts.remove();

        }

    }

}


// Filter category
function filterCategory(category) {

    const products =
        document.querySelectorAll(".product-card");

    products.forEach(product => {

        if (product.dataset.category === category) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });

    document.getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// Scroll to products
function scrollToProducts() {
    const productsSection = document.getElementById("products");

    window.scrollTo({
        top: productsSection.offsetTop - 80,
        behavior: "smooth"
    });
}

// Checkout

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    let total = 0;

    cart.forEach(item => {

        total += item.price;

    });

    document.getElementById("checkoutTotal").textContent =
        "Total: ₹" + total;

    document.getElementById("cartModal").style.display =
        "none";

    document.getElementById("checkoutModal").style.display =
        "flex";
}


// Place Order

function placeOrder() {

    const user = getLoggedInUser();

    if (!user) {

        showNotification(
            "Login Required",
            "Please login before placing an order.",
            "🔐"
        );

        return;
    }


    if (cart.length === 0) {

        showNotification(
            "Cart is Empty",
            "Please add a product to your cart before placing an order.",
            "🛒"
        );

        return;
    }


    const name =
        document.getElementById("customerName").value.trim();

    const email =
        document.getElementById("customerEmail").value.trim();

    const phone =
        document.getElementById("customerPhone").value.trim();

    const address =
        document.getElementById("customerAddress").value.trim();


    if (
        name === "" ||
        email === "" ||
        phone === "" ||
        address === ""
    ) {

        showNotification(
            "Missing Details",
            "Please fill all delivery details.",
            "⚠️"
        );

        return;
    }


    let total = 0;

    cart.forEach(item => {

        total += item.price;

    });


    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        ).value;


    const order = {

        id: Date.now(),

        status: "Placed",

        name: name,

        email: email,

        phone: phone,

        address: address,

        payment: payment,

        items: [...cart],

        total: total,

        date: new Date().toLocaleString()

    };


    // Get only this user's orders

    const ordersKey =
        getUserKey("orders");


    let orders =
        JSON.parse(
            localStorage.getItem(ordersKey)
        ) || [];


    orders.push(order);


    // Save orders for this user

    localStorage.setItem(
        ordersKey,
        JSON.stringify(orders)
    );


    // Clear user's cart

    cart = [];

    saveUserCart();

    document.getElementById("cartCount").textContent = "0";


    // Close checkout

    closeCheckout();


    // Display this user's orders

    displayOrders();


    // Success notification

    showNotification(
        "Order Placed Successfully!",
        "Thank you for shopping with StudentHub. Your order has been placed.",
        "🎉"
    );

}
function displayOrders(){

    const ordersContainer =
        document.getElementById("ordersContainer");

    if (!ordersContainer) {
        return;
    }

    const user = getLoggedInUser();

    // If no user is logged in
    if (!user) {

        ordersContainer.innerHTML =
            '<p class="no-orders">Please login to view your orders.</p>';

        return;
    }

    const ordersKey =
        getUserKey("orders");

    const orders =
        JSON.parse(
            localStorage.getItem(ordersKey)
        ) || [];


    if (orders.length === 0) {

        ordersContainer.innerHTML =
            '<p class="no-orders">No orders placed yet.</p>';

        return;
    }


    ordersContainer.innerHTML = "";


    orders.forEach((order, index) => {

        let itemsHTML = "";


        order.items.forEach(item => {

            itemsHTML += `
                <p>
                    🛍️ ${item.name} - ₹${item.price}
                </p>
            `;

        });


        const status =
            order.status || "Placed";


        ordersContainer.innerHTML += `

            <div class="order-card">

                <h3>📦 Order #${index + 1}</h3>

                <p>
                    🆔 <strong>Order ID:</strong>
                    SH-${order.id}
                </p>

                <p>
                    📅 <strong>Date:</strong>
                    ${order.date}
                </p>

                <p>
                    👤 <strong>Name:</strong>
                    ${order.name}
                </p>

                <p>
                    💳 <strong>Payment:</strong>
                    ${order.payment}
                </p>

                <p>
                    📌 <strong>Status:</strong>
                    ${status}
                </p>

                <h4>Products:</h4>

                ${itemsHTML}

                <h3>
                    💰 Total: ₹${order.total}
                </h3>

                ${
                    status === "Placed"
                    ? `
                        <button
                            onclick="cancelOrder(${index})"
                            class="cancel-order-btn">
                            🗑️ Cancel Order
                        </button>

                        <button
                            onclick="viewOrderDetails(${index})"
                            class="view-order-btn">
                            👁️ View Details
                        </button>
                    `
                    : ""
                }

            </div>

        `;

    });

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayOrders();

    }
);
function cancelOrder(index) {

    const user = getLoggedInUser();

    if (!user) {

        showNotification(
            "Login Required",
            "Please login to manage your orders.",
            "🔐"
        );

        return;
    }


    const ordersKey =
        getUserKey("orders");


    let orders =
        JSON.parse(
            localStorage.getItem(ordersKey)
        ) || [];


    if (!orders[index]) {
        return;
    }


    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this order?"
        );


    if (!confirmCancel) {
        return;
    }


    orders[index].status = "Cancelled";


    localStorage.setItem(
        ordersKey,
        JSON.stringify(orders)
    );


    displayOrders();


    showNotification(
        "Order Cancelled",
        "Your order has been cancelled successfully.",
        "🗑️"
    );

}
// Close Checkout

function closeCheckout() {

    document.getElementById("checkoutModal").style.display =
        "none";

}


// Close Success

function closeSuccess() {

    document.getElementById("successModal").style.display =
        "none";

}
// Product Details

let selectedProduct = null;
let productQuantity = 1;


function showProductDetails(name, price, image, description) {

    selectedProduct = {
        name: name,
        price: price,
        image: image,
        description: description
    };

    productQuantity = 1;

    document.getElementById("detailName").textContent = name;

    document.getElementById("detailPrice").textContent =
        "₹" + price;

    document.getElementById("detailImage").src = image;

    document.getElementById("detailDescription").textContent =
        description;

    document.getElementById("quantity").textContent =
        productQuantity;

    document.getElementById("productModal").style.display =
        "flex";
}


function closeProductDetails() {

    document.getElementById("productModal").style.display =
        "none";
}


function increaseQuantity() {

    productQuantity++;

    document.getElementById("quantity").textContent =
        productQuantity;
}


function decreaseQuantity() {

    if (productQuantity > 1) {

        productQuantity--;

        document.getElementById("quantity").textContent =
            productQuantity;
    }
}


function addDetailToCart() {

    if (!selectedProduct) {
        return;
    }

    for (let i = 0; i < productQuantity; i++) {

        addToCart(
            selectedProduct.name,
            selectedProduct.price
        );

    }

    closeProductDetails();

}
// Wishlist


// Add to Wishlist

function addWishlist(product) {

    const user = getLoggedInUser();

    if (!user) {

        showNotification(
            "Login Required",
            "Please login to add products to your wishlist.",
            "🔐"
        );

        return;
    }

    if (wishlist.includes(product)) {

        showNotification(
            "Already in Wishlist!",
            product + " is already in your wishlist.",
            "❤️"
        );

        return;
    }

    wishlist.push(product);

    saveUserWishlist();

    showNotification(
        "Added to Wishlist!",
        product + " has been added to your wishlist.",
        "❤️"
    );

    displayWishlist();
}

// Display Wishlist

function displayWishlist() {

    const wishlistItems =
        document.getElementById("wishlistItems");

    if (!wishlistItems) {
        return;
    }

    if (wishlist.length === 0) {

        wishlistItems.innerHTML =
            "<p>Your wishlist is empty.</p>";

        return;
    }

    wishlistItems.innerHTML = "";

    wishlist.forEach((product, index) => {

        wishlistItems.innerHTML += `
            <div class="wishlist-card">

                <h3>❤️ ${product}</h3>

                <button onclick="removeWishlist(${index})">
                    Remove
                </button>

            </div>
        `;

    });
}


// Remove from Wishlist

function removeWishlist(index) {

    wishlist.splice(index, 1);

    localStorage.setItem(
        "studenthubWishlist",
        JSON.stringify(wishlist)
    );

    displayWishlist();

}


// Load Wishlist after page refresh

document.addEventListener("DOMContentLoaded", function () {

    displayWishlist();

});
// Reviews

let reviews =
    JSON.parse(localStorage.getItem("studenthubReviews")) || [];


// Add Review
function addReview() {

    const nameInput = document.getElementById("reviewName");
    const productInput = document.getElementById("reviewProduct");
    const ratingInput = document.getElementById("reviewRating");
    const textInput = document.getElementById("reviewText");

    const name = nameInput.value.trim();
    const product = productInput.value;
    const rating = ratingInput.value;
    const text = textInput.value.trim();

    if (name === "") {

        alert("Please enter your name.");

        nameInput.focus();

        return;
    }

    if (text === "") {

        alert("Please write a review.");

        textInput.focus();

        return;
    }

    const newReview = {

        name: name,
        product: product,
        rating: rating,
        text: text

    };

    reviews.push(newReview);

    localStorage.setItem(
        "studenthubReviews",
        JSON.stringify(reviews)
    );

    nameInput.value = "";
    textInput.value = "";

    displayReviews();

    alert("Review submitted successfully! ⭐");
}

// Display Reviews

function displayReviews() {

    const reviewsContainer =
        document.getElementById("reviewsContainer");


    if (!reviewsContainer) {
        return;
    }


    if (reviews.length === 0) {

        reviewsContainer.innerHTML =
            '<p class="no-reviews">No reviews yet.</p>';

        return;
    }


    reviewsContainer.innerHTML = "";


    reviews.forEach(review => {

        const stars =
            "⭐".repeat(Number(review.rating));


        reviewsContainer.innerHTML += `

            <div class="review-card">

                <h3>📦 ${review.product}</h3>

<p>
    👤 <strong>${review.name}</strong>
</p>

                <div class="stars">
                    ${stars}
                </div>

                <p>
                    ${review.text}
                </p>

            </div>

        `;

    });

}


// Load reviews after refresh

document.addEventListener("DOMContentLoaded", function () {

    displayReviews();

});
// Update User UI

function updateUserUI() {

    const userWelcome =
        document.getElementById("userWelcome");

    const loginButton =
        document.getElementById("loginButton");

    const logoutButton =
        document.getElementById("logoutButton");

    const savedUser =
        JSON.parse(
            localStorage.getItem("studenthubUser")
        );

    const loggedIn =
        localStorage.getItem("studenthubLoggedIn");


    if (savedUser && loggedIn === "true") {

        userWelcome.textContent =
            "👤 Welcome " + savedUser.name;

        loginButton.style.display = "none";

        logoutButton.style.display = "inline-block";

    } else {

        userWelcome.textContent = "";

        loginButton.style.display = "inline-block";

        logoutButton.style.display = "none";

    }

}


// Logout

function logoutUser() {

    // Logout user
    localStorage.removeItem("studenthubLoggedIn");

    // Clear current user's data from screen
    cart = [];
    wishlist = [];

    // Update cart count
    document.getElementById("cartCount").textContent = "0";

    // Clear wishlist display
    if (typeof displayWishlist === "function") {
        displayWishlist();
    }

    // Show login message in Orders
    if (typeof displayOrders === "function") {
        displayOrders();
    }


    // Close cart if it is open
    const cartModal =
        document.getElementById("cartModal");

    if (cartModal) {
        cartModal.style.display = "none";
    }

    // Update Login / Logout buttons
    updateUserUI();

    // Elegant logout notification
    showNotification(
        "Logged Out Successfully!",
        "You have been logged out of StudentHub. See you again! 👋",
        "👋"
    );
}


// Check login when page loads

document.addEventListener("DOMContentLoaded", function () {

    updateUserUI();

});

function viewOrderDetails(index) {

    const orders =
        JSON.parse(
            localStorage.getItem("studenthubOrders")
        ) || [];

    const order = orders[index];

    if (!order) {
        return;
    }

    let products = "";

    order.items.forEach(item => {

        products +=
            item.name + " - ₹" + item.price + "\n";

    });

    alert(
        "📦 Order Details\n\n" +
        "Order: #" + (index + 1) + "\n" +
        "Date: " + order.date + "\n" +
        "Name: " + order.name + "\n" +
        "Payment: " + order.payment + "\n" +
        "Status: " + (order.status || "Placed") +
        "\n\nProducts:\n" +
        products +
        "\nTotal: ₹" + order.total
    );

}
function sendMessage() {

    const name =
        document.getElementById("contactName")
        .value
        .trim();

    const email =
        document.getElementById("contactEmail")
        .value
        .trim();

    const message =
        document.getElementById("contactMessage")
        .value
        .trim();


    if (
        name === "" ||
        email === "" ||
        message === ""
    ) {

        alert("Please fill all contact details.");

        return;
    }


    alert(
        "Thank you " +
        name +
        "! Your message has been sent successfully. 📩"
    );


    document.getElementById("contactName").value = "";

    document.getElementById("contactEmail").value = "";

    document.getElementById("contactMessage").value = "";

}
// =========================
// Elegant Notification
// =========================

function showNotification(title, message, icon = "✓") {

    document.getElementById("notificationTitle").textContent = title;

    document.getElementById("notificationMessage").textContent = message;

    document.getElementById("notificationIcon").textContent = icon;

    document.getElementById("notificationModal").style.display = "flex";
}


function closeNotification() {

    document.getElementById("notificationModal").style.display = "none";

}