

const promos = [
    { img: "img/Pelucias/cachorropeludo.png",
        titulo: "Ursão Gigante",
        desc: "O queridinho da loja — 30% de desconto hoje!" },
    { img: "img/Pelucias/gatinhofofo.png",
        titulo: "Gatinho Fofo",
        desc: "Um clássico para presentear ❤️"
 },
    { img: "img/Pelucias/ursocarinhoso.jpg",
        titulo: "Cachorrinho Fofuxo",
        desc: "Promoção especial até domingo!" }
];

let atual = 0;

const img = document.getElementById("carrossel-img");
const titulo = document.getElementById("carrossel-title");
const desc = document.getElementById("carrossel-desc");

function mostrarPromo() {
    img.src = promos[atual].img;
    titulo.textContent = promos[atual].titulo;
    desc.textContent = promos[atual].desc;
}

document.getElementById("next").onclick = () => {
    atual = (atual + 1) % promos.length;
    mostrarPromo();
};

document.getElementById("prev").onclick = () => {
    atual = (atual - 1 + promos.length) % promos.length;
    mostrarPromo();
};

mostrarPromo(); // inicializa
