const produtos = [
    { id: 1, name: "Camiseta Preta", price: 59.90 },
    { id: 2, name: "Boné Mousse", price: 35.00 },
    { id: 3, name: "Fone Bluetooth", price: 120.00 }
];

let carrinho = [];

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const item = carrinho.find(i => i.id === id);
    if (item) {
        item.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    atualizarCarrinho();
}

function atualizarCarrinho() {
    const contador = document.getElementById("carrinho-contador");
    if (contador) {
        const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
        contador.innerText = totalItens;
    }
}

function pagarComPicPay() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    
    // Calcula o valor total
    let total = carrinho.reduce((sum, item) => sum + (item.price * item.quantidade), 0);
    
    // Aqui você pode colocar o seu link de pagamento ou redirecionar
    alert(`Redirecionando para o pagamento de R$ ${total.toFixed(2)}...`);
    
    // Exemplo de link de pagamento (substitua pelo seu link real do PicPay/Mercado Pago se quiser)
    window.location.href = "https://picpay.me/seu-usuario"; 
      }
