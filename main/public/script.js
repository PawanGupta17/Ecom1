const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}
if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

let WishList = function (icon) {
  if (icon.classList.contains("ri-heart-line")) {
    icon.classList.replace("ri-heart-line", "ri-heart-fill");
    showToast(addMsg);
  } else {
    icon.classList.replace("ri-heart-fill", "ri-heart-line");
    showToast(remMsg);
  }
};
let AddCart = function (icon) {
  if (icon.classList.contains("ri-shopping-cart-line")) {
    icon.classList.replace("ri-shopping-cart-line", "ri-shopping-cart-fill");
    showToast(addCartMsg);
  } //else {
  //   icon.classList.replace("ri-shopping-cart-fill", "ri-shopping-cart-line");
  //   showToast(remCartMsg);
  // }
};
let toastBox = document.getElementById("toastBox");
let addMsg = '<i class="ri-emotion-happy-fill"></i> Added to Wishlist';
let remMsg = '<i class="ri-emotion-unhappy-fill"></i> Removed from Wishlist';
let addCartMsg = '<i class="ri-emotion-happy-fill"></i> Added to Cart';
let remCartMsg = '<i class="ri-emotion-unhappy-fill"></i> Removed from Cart';
function showToast(msg) {
  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerHTML = msg;
  toastBox.appendChild(toast);

  if (msg.includes("Removed")) {
    toast.classList.add("rem");
  }
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

//cartopen close
let cartIcon = document.querySelector("#cart-icon");
let cartIcon1 = document.querySelector("#cart-icon-1");
let cart = document.querySelector(".full-cart");
let closeCart = document.querySelector("#close-cart");
//open cart
cartIcon.onclick = () => {
  cart.classList.add("cart-active");
};
//closecart
closeCart.onclick = () => {
  cart.classList.remove("cart-active");
};
//open cart
cartIcon1.onclick = () => {
  cart.classList.add("cart-active");
};

// Making Add To Cart
//Cart Working JS
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

//Making Function
function ready() {
  //Remove Item From Cart
  var removeCartButtons = document.getElementsByClassName(
    "ri-close-circle-line"
  );
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  //Quantity Change
  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  //Add to Cart
  var addCart = document.getElementsByClassName("ri-shopping-cart-line");
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }
  loadCartItems();
}

//Remove Cart Item
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.parentElement.remove();
  updateTotal();
  saveCartItems();
  updateCartIcon();
}
// Quantity Change
function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

// Add to Cart function
function addCartClicked(event) {
  var button = event.target;
  var shopProducts = button.parentElement.parentElement;
  var title = shopProducts.getElementsByClassName("title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productImg = shopProducts.getElementsByClassName("cart-img")[0].src;
  addProductToCart(title, price, 1, productImg);
  updateTotal();
  saveCartItems();
  updateCartIcon();
}

function addProductToCart(title, price, quantity, productImg) {
  var cartShopBox = document.createElement("tr");
  cartShopBox.classList.add("sitem");
  var cartItems = document.getElementById("cart-item");
  var cartItemsNames = cartItems.getElementsByClassName("title");
  for (var i = 0; i < cartItemsNames.length; i++) {
    if (cartItemsNames[i].innerText == title) {
      alert("You have already added This item to cart");
      return;
    }
  }
  var cartBoxContent = `<td><a><i class="ri-close-circle-line" onclick="showToast(remCartMsg)"></i></a></td>
    <td><img src="${productImg}" alt="" class="cart-img"/></td>
    <td class="title">${title}</td>
    <td class="price">${price}</td>
    <td><input type="number" value="${quantity}" class="cart-quantity" /></td>  `;
  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox);
  cartShopBox
    .getElementsByClassName("ri-close-circle-line")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
  saveCartItems();
  updateCartIcon();
}

//Update Total
function updateTotal() {
  var cartContent = document.getElementsByClassName("items")[0];
  var cartBoxes = cartContent.getElementsByClassName("sitem");
  var total = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = quantityElement.value;
    total += price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("total-price")[0].innerText = "$" + total;
  document.getElementsByClassName("total-s-price")[0].innerText = "$" + total;
  //Save Total to Local
  localStorage.setItem("cartTotal", total);
}

//keep Item in cart Even after Refresh
function saveCartItems() {
  var cartContent = document.getElementsByClassName("items")[0];
  var cartBoxes = cartContent.getElementsByClassName("sitem");
  var cartItems = [];
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var titleElement = cartBox.getElementsByClassName("title")[0];
    var priceElement = cartBox.getElementsByClassName("price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var productImg = cartBox.getElementsByClassName("cart-img")[0].src;
    var item = {
      title: titleElement.innerText,
      price: priceElement.innerText,
      quantity: quantityElement.value,
      productImg: productImg,
    };
    cartItems.push(item);
  }
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

//Loads In Cart
function loadCartItems() {
  var cartItems = localStorage.getItem("cartItems");
  if (cartItems) {
    cartItems = JSON.parse(cartItems);
    for (var i = 0; i < cartItems.length; i++) {
      var item = cartItems[i];
      addProductToCart(item.title, item.price, 1, item.productImg);
      var cartBoxes = document.getElementsByClassName("sitem");
      var cartbox = cartBoxes[cartBoxes.length - 1];
      var quantityElement = cartbox.getElementsByClassName("cart-quantity")[0];
      quantityElement.value = item.quantity;
    }
  }
  var cartTotal = localStorage.getItem("cartTotal");
  if (cartTotal) {
    document.getElementsByClassName("total-price")[0].innerText =
      "$" + cartTotal;
    document.getElementsByClassName("total-s-price")[0].innerText =
      "$" + cartTotal;
  }
  updateCartIcon();
}

//Cart Quantity
function updateCartIcon() {
  var cartBoxes = document.getElementsByClassName("sitem");
  var quantity = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    quantity += parseInt(quantityElement.value);
  }
  var cartIcon = document.querySelector("#cart-icon");
  cartIcon.setAttribute("data-quantity", quantity);
}

//Clear Cart Item After successful Payment
function clearCart() {
  var cartContent = document.getElementById("cart-item");
  cartContent.innerHTML = "";
  updateTotal();
  localStorage.removeItem("cartItems");
}
