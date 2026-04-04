// --- 0. Product Card Animation Setup ---
const productCards = document.querySelectorAll(".product-card");

productCards.forEach((card) => {
  // 1. Grab the elements
  const img = card.querySelector("img");
  const btn = card.querySelector(".add-to-cart");

  // 2. Add text to the button
  btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';

  // 3. Create a wrapper specifically for the image and overlay
  const imgWrapper = document.createElement("div");
  imgWrapper.classList.add("image-wrapper");

  // 4. Create the glass overlay panel
  const overlay = document.createElement("div");
  overlay.classList.add("card-overlay");

  // 5. Move ONLY the button into the overlay
  overlay.appendChild(btn);

  // 6. Put the image and the overlay into the wrapper
  imgWrapper.appendChild(img);
  imgWrapper.appendChild(overlay);

  // 7. Insert the wrapper at the very top of the card
  card.prepend(imgWrapper);

  // 8. Add the click event to the image wrapper
  imgWrapper.addEventListener("click", function () {
    // Close other open cards
    productCards.forEach((c) => {
      if (c !== card) c.classList.remove("active-card");
    });

    // Toggle the animation on the clicked card
    card.classList.toggle("active-card");
  });
});
// --- Cart State Management ---
let cart = JSON.parse(localStorage.getItem("vapeShopCart")) || [];

const cartCountDisplay = document.querySelector(".cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceDisplay = document.querySelector(".total-price");
const cartIcon = document.querySelector(".cart-icon");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartBtn = document.getElementById("close-cart");

// --- 1. Core Functions ---

function updateCart() {
  localStorage.setItem("vapeShopCart", JSON.stringify(cart));

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountDisplay.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart-message">Your cart is currently empty.</p>';
    totalPriceDisplay.textContent = "KSh 0";
    return;
  }

  let cartHTML = "";
  let totalPrice = 0;

  cart.forEach((item, index) => {
    // Calculate total price for all items
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    // Generate the HTML for each item, now including the +/- buttons
    cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">KSh ${itemTotal.toLocaleString()}</div>
                    
                    <div class="cart-item-qty-controls">
                        <button class="qty-btn minus" data-index="${index}"><i class="fas fa-minus"></i></button>
                        <span class="qty-amount">${item.quantity}</span>
                        <button class="qty-btn plus" data-index="${index}"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
  });

  cartHTML += `<button class="clear-cart-btn" id="clear-cart">Clear Entire Cart</button>`;

  cartItemsContainer.innerHTML = cartHTML;
  totalPriceDisplay.textContent = `KSh ${totalPrice.toLocaleString()}`;

  attachCartButtons();
}

function attachCartButtons() {
  // 1. Trash Can Button
  const removeButtons = document.querySelectorAll(".remove-item");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemIndex = this.getAttribute("data-index");
      cart.splice(itemIndex, 1);
      updateCart();
    });
  });

  // 2. Plus Button (+)
  const plusButtons = document.querySelectorAll(".plus");
  plusButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemIndex = this.getAttribute("data-index");
      cart[itemIndex].quantity++; // Increase quantity by 1
      updateCart();
    });
  });

  // 3. Minus Button (-)
  const minusButtons = document.querySelectorAll(".minus");
  minusButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const itemIndex = this.getAttribute("data-index");

      // If they have more than 1, decrease it
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity--;
      } else {
        // If it drops below 1, remove it from the cart entirely
        cart.splice(itemIndex, 1);
      }
      updateCart();
    });
  });

  // 4. Clear Entire Cart
  const clearCartBtn = document.getElementById("clear-cart");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", function () {
      cart = [];
      updateCart();
    });
  }
}

// --- 2. "Add to Cart" Button Logic ---
const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const productCard = this.closest(".product-card");
    const title = productCard.querySelector("h3").innerText;
    const imageSrc = productCard.querySelector("img").src;
    const priceText = productCard.querySelector(".price").innerText;
    const priceNumber = parseInt(
      priceText.replace("KSh", "").replace(",", "").trim(),
    );

    const existingItem = cart.find((item) => item.title === title);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        title: title,
        price: priceNumber,
        image: imageSrc,
        quantity: 1,
      });
    }

    updateCart();

    cartCountDisplay.style.transition = "transform 0.2s ease";
    cartCountDisplay.style.transform = "scale(1.5)";
    setTimeout(() => (cartCountDisplay.style.transform = "scale(1)"), 200);

    cartOverlay.classList.add("active");
  });
});

// --- 3. Drawer Open/Close Logic ---
cartIcon.addEventListener("click", function (event) {
  event.preventDefault();
  cartOverlay.classList.add("active");
});

closeCartBtn.addEventListener("click", function () {
  cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", function (event) {
  if (event.target === cartOverlay) {
    cartOverlay.classList.remove("active");
  }
});

// --- 4. Smooth Scrolling ---
const shopNowButton = document.querySelector(".btn-primary");
const firstProductSection = document.querySelector(".product-section");

if (shopNowButton && firstProductSection) {
  shopNowButton.addEventListener("click", function (event) {
    event.preventDefault();
    firstProductSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Initialize
updateCart();

const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = [
  "e-liquids.",
  "disposable vapes.",
  "premium hardware.",
  "vape accessories.",
];

const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000; // How long it pauses before erasing

let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if (!cursorSpan.classList.contains("typing"))
      cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  } else {
    // Finished typing the word, pause before erasing
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if (!cursorSpan.classList.contains("typing"))
      cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(
      0,
      charIndex - 1,
    );
    charIndex--;
    setTimeout(erase, erasingDelay);
  } else {
    // Finished erasing, move to the next word
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 500);
  }
}

if (textArray.length) {
  setTimeout(type, 500);
}

document.querySelector(".checkout-btn").addEventListener("click", () => {
  const total = document.querySelector(".total-price").innerText;
  const cartItems = document.querySelectorAll(".cart-item");

  if (cartItems.length === 0 || total === "KSh 0") {
    document.getElementById("empty-cart-modal").style.display = "flex";
    return;
  }

  document.getElementById("modal-total").innerText = total;
  document.getElementById("payment-modal").style.display = "flex";

  const phoneNumber = "+254794199113";
  const message = `Hi! I've just sent ${total} for my Vape Store order. Please confirm receipt and process my delivery.`;

  // This encodes the message so it works in a URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Attach the URL to the green button
  document.getElementById("whatsapp-btn").onclick = () => {
    window.open(whatsappURL, "_blank");
  };
});

function copyNumber() {
  const number = document.getElementById("phone-number").innerText;
  const icon = document.getElementById("copy-icon");

  navigator.clipboard
    .writeText(number)
    .then(() => {
      // 1. Force the change to the checkmark
      icon.className = "fas fa-check"; // 'fas' is the solid version, 'fa-check' is the tick
      icon.style.color = "#14A751";
      icon.style.transform = "scale(1.3)"; // A nice little pop

      // 2. Revert after exactly 500ms
      setTimeout(() => {
        icon.className = "far fa-copy"; // Back to the regular copy icon
        icon.style.color = "#a0aec0";
        icon.style.transform = "scale(1)";
      }, 500);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}
