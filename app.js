const products = [
  { id: 1, name: "Produto A", price: 49.90 },
  { id: 2, name: "Produto B", price: 79.90 },
  { id: 3, name: "Produto C", price: 99.90 }
];

let cart = [];

const $ = (id) => document.getElementById(id);

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const item = cart.find(p => p.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  renderCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  renderCart();
}

function getTotal() {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

function renderCart() {
  const container = $("cartItems");

  if (!container) return;

  container.innerHTML = "";

  if (
