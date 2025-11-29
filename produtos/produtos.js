// Lista de produtos (exemplo)
const produtos = [
    { nome: "Urso Carinhoso", categoria: "urso", preco: 79.90, promoção: true, img: "../img/produtos/ursocarinhoso.jpg" },
    { nome: "Gatinho Fofo", categoria: "gato", preco: 59.90, promoção: false, img: "../img/produtos/gatinhofofo.png" },
    { nome: "Cachorro Peludo", categoria: "cachorro", preco: 89.90, promoção: true, img: "../img/produtos/cachorropeludo.png" },
    { nome: "Ursão Gigante", categoria: "urso", preco: 149.90, promoção: false, img: "../img/produtos/ursogigante.png" }
];

const lista = document.getElementById("product-list");
const filtros = document.querySelectorAll(".filter");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// Função para adicionar item ao carrinho
function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert(`${produto.nome} foi adicionado ao carrinho!`);
}


// Função para mostrar produtos
function mostrarProdutos(filtrosAtivos = []) {
    lista.innerHTML = "";

    let filtrados = produtos.filter(produto => {
        if (filtrosAtivos.length === 0) return true;

        return filtrosAtivos.some(f => 
            produto.categoria === f || (f === "promoção" && produto.promoção)
        );
    });

    filtrados.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${prod.img}">
            <h3>${prod.nome}</h3>
            <p class="price">R$ ${prod.preco.toFixed(2)}</p>
            <button class="btn-addcarrinho">Adicionar ao carrinho</button>
        `;

        // Evento do botão
        card.querySelector(".btn-addcarrinho").addEventListener("click", () => {
            adicionarAoCarrinho(prod);
        }); 
        
        lista.appendChild(card);
    });
}

// Atualiza itens a cada clique no filtro
filtros.forEach(f => {
    f.addEventListener("change", () => {
        const ativos = [...filtros].filter(inp => inp.checked).map(inp => inp.value);
        mostrarProdutos(ativos);
    });
});

// Inicia mostrando tudo
mostrarProdutos();
