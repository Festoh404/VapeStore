document.addEventListener("DOMContentLoaded", () => {
  // Simple UI interaction: Update cart count when an item is added
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartCountElement = document.querySelector(".cart-count");
  let cartCount = 0;

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      // Increment the counter
      cartCount++;
      cartCountElement.textContent = cartCount;

      // Optional: Add a little animation class to the cart icon so the user notices
      const cartIcon = document.querySelector(".cart-icon i");
      cartIcon.style.transform = "scale(1.2)";
      setTimeout(() => {
        cartIcon.style.transform = "scale(1)";
      }, 200);
    });
  });
});
