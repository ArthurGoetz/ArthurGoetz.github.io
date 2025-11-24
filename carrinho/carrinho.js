// Carrega o carrinho salvo
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const lista = document.getElementById("lista-carrinho");
const total = document.getElementById("total");

function atualizarCarrinho() {
    lista.innerHTML = "";

    let soma = 0;

    carrinho.forEach((item, index) => {
        soma += item.preco;

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

    total.textContent = "Total: R$ " + soma.toFixed(2);
}

function removerItem(indice) {
    carrinho.splice(indice, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    atualizarCarrinho();
}

atualizarCarrinho();