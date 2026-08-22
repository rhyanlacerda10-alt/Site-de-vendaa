const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS = path.join(DATA_DIR, 'orders.json');

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS)) fs.writeFileSync(ORDERS, '[]');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const products = [
  { id: 1, name: 'Produto Exemplo A', price: 39.90, stock: 20 },
  { id: 2, name: 'Produto Exemplo B', price: 59.90, stock: 15 },
  { id: 3, name: 'Produto Exemplo C', price: 89.90, stock: 10 }
];

app.get('/api/products', (_, res) => res.json(products));

app.post('/api/orders', (req, res) => {
  const { items, customer, paymentMethod } = req.body;
  if (!Array.isArray(items) || !customer?.name || !customer?.address || !paymentMethod) {
    return res.status(400).json({ error: 'Dados do pedido incompletos.' });
  }

  let subtotal = 0;
  const orderItems = items.map(i => {
    const product = products.find(p => p.id === Number(i.id));
    const qty = Math.max(1, Number(i.qty || 1));
    if (!product) throw new Error('Produto inválido');
    subtotal += product.price * qty;
    return { id: product.id, name: product.name, qty, unitPrice: product.price };
  });

  const discount = paymentMethod === 'pix' ? subtotal * 0.10 : 0;
  const total = subtotal - discount;

  const orders = JSON.parse(fs.readFileSync(ORDERS, 'utf8'));
  const order = {
    id: 'PED-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'aguardando_pagamento',
    paymentMethod,
    customer,
    items: orderItems,
    subtotal,
    discount,
    total
  };
  orders.push(order);
  fs.writeFileSync(ORDERS, JSON.stringify(orders, null, 2));

  res.json(order);
});

app.listen(PORT, () => console.log(`Loja aberta em http://localhost:${PORT}`));
