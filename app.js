let produtosDoServidor = [];
let carrinho = [];

// Busca os produtos direto da API do server.js ao carregar a página
async function carregarProdutos() {
    try {
        const response = await fetch('/api/products');
        produtosDoServidor = await response.json();
        
        const container = document.getElementById('lista-produtos');
        container.innerHTML = '';

        produtosDoServidor.forEach(produto => {
            container.innerHTML += `
                <div class="produto-card">
                    <div class="produto-info">
                        <h3>${produto.name}</h3>
                        <p>R$ ${produto.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

function adicionarAoCarrinho(id) {
    const produto = produtosDoServidor.find(p => p.id === id);
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

    // Dados de exemplo do cliente para teste (você pode criar inputs depois se quiser)
    const pedidoData = {
        items: carrinho,
        customer: {
            name: "Cliente Teste",
            address: "Rua Exemplo, 123"
        },
        paymentMethod: "pix" // Aplica os 10% de desconto do seu server.js
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

// Executa ao carregar a página
window.onload = carregarProdutos;
    
