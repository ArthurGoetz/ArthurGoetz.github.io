// Carrega o carrinho salvo
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const lista = document.getElementById("lista-carrinho");
const total = document.getElementById("total");
const erroCarrinhoVazio = document.getElementById('CarrinhoVazio');
let soma = 0;

function atualizarCarrinho() {
    lista.innerHTML = "";
    soma = 0;

    let nomes = [];

    carrinho.forEach((item, index) => {
        soma += item.preco;
        nomes.push(item.nome);

        const div = document.createElement("div");
        div.className = "item";

        div.innerHTML = `
                    <img src="${item.img}">
                    <div class="info">
                        <h3>${item.nome}</h3>
                        <p class="preco">R$ ${item.preco.toFixed(2)}</p>
                    </div>
                    <button class="remover" onclick="removerItem(${index})">Remover</button>
                `;

        lista.appendChild(div);
    });
    localStorage.setItem("soma", JSON.stringify(soma));
    total.textContent = "Total: R$ " + soma.toFixed(2);

    localStorage.setItem("nomes", JSON.stringify(nomes));
}

function removerItem(indice) {
    carrinho.splice(indice, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
}

function BloqFinCompraCarrinhoVazio() {
    document.getElementById("FinalizarCompra").addEventListener("click", function (event) {
        if (soma === 0) {
            event.preventDefault();
            erroCarrinhoVazio.textContent = 'O carrinho está vazio!';
        }
    })
}

atualizarCarrinho();
BloqFinCompraCarrinhoVazio();