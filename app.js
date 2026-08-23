const produtos = [
    { id: 1, name: "Produto Exemplo A", price: 39.90 },
    { id: 2, name: "Produto Exemplo B", price: 59.90 },
    { id: 3, name: "Produto Exemplo C", price: 89.90 }
];

let carrinho = [];

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const item = carrinho.find(i => i.id === id);
    if (item) {
        item.qty++;
    } else {
        carrinho.push({ id: produto.id, qty: 1 });
    }

    atualizarContador();
}

function atualizarContador() {
    const totalItens = carrinho.reduce((sum, item) => sum + item.qty, 0);
    const contador = document.getElementById("carrinho-contador");
    if (contador) contador.innerText = totalItens;
}

async function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const pedidoData = {
        items: carrinho,
        customer: {
            name: "Cliente Teste",
            address: "Rua Exemplo, 123"
        },
        paymentMethod: "pix"
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedidoData)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(`Pedido ${resultado.id} criado com sucesso! Total com desconto Pix: R$ ${resultado.total.toFixed(2).replace('.', ',')}`);
            carrinho = [];
            atualizarContador();
        } else {
            alert("Erro ao finalizar pedido: " + resultado.error);
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao conectar com o servidor.");
    }
}
