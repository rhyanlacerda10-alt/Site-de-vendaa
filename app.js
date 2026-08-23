const products = [
  { id: 1, name: "Camiseta Preta", price: 59.90 },
  { id: 2, name: "Boné Mousse", price: 35.00 },
  { id: 3, name: "Fone Bluetooth", price: 120.00 }
];


let carrinho = [];

function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  const item = carrinho.find(item => item.id === id);
  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  
  renderCarrinho();
}

function renderCarrinho() {
  console.log("Carrinho atualizado:", carrinho);
}

async function pagarComPicPay() {
  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  
  if (total === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  try {
    const response = await fetch('/api/criar-pix-picpay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valor: total,
        comprador: {
          nome: "Cliente",
          email: "cliente@email.com"
        }
      })
    });

    const data = await response.json();

    if (data.paymentUrl) {
      window.location.href = data.paymentUrl;
    } else {
      alert("Erro ao gerar o pagamento. Tente novamente.");
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}
