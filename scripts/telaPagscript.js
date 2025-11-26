/**
 * remove todos os caracteres que não forem dígitos
 * @param {string} s
 */
function apenasDigitos(s) {
  return s.replace(/\D/g, '');
}

/* ---------- form e elementos ---------- */

function attValorAndNomes() {
  const rawSoma = JSON.parse(localStorage.getItem("soma"));
  const soma = Number(rawSoma ?? 0);
  document.getElementById("total").textContent = "Total: R$ " + soma.toFixed(2);
  const nomes = JSON.parse(localStorage.getItem("nomes")) || [];
  document.getElementById("produtos").textContent = "Produto(s): " + (nomes.length ? nomes.join(", ") : "Nenhum");
}
attValorAndNomes();


const form = document.getElementById('payment-form');
const cardNumberInput = document.getElementById('card-number');
const cardNameInput = document.getElementById('card-name');
const cardExpiryInput = document.getElementById('card-expiry');
const cardCvvInput = document.getElementById('card-cvv');

const previewNumber = document.querySelector('.card-preview .card-number');
const previewName = document.querySelector('.card-preview .card-name');
const previewExpiry = document.querySelector('.card-preview .card-expiry');

const statusMessage = document.getElementById('status-message');

/* erro elements */
const errorCardNumber = document.getElementById('card-number-error');
const errorCardName = document.getElementById('card-name-error');
const errorCardExpiry = document.getElementById('card-expiry-error');
const errorCardCvv = document.getElementById('card-cvv-error');

/* ---------- máscaras / formatação ao digitar ---------- */

/* Formatar número do cartão em grupos de 4: 0000 0000 0000 0000 */
cardNumberInput.addEventListener('input', (e) => {
  const cursorPos = cardNumberInput.selectionStart;
  let digits = apenasDigitos(cardNumberInput.value).slice(0, 16); // limita a 16 dígitos
  // adiciona espaços a cada 4 dígitos
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substr(i, 4));
  }
  const formatted = parts.join(' ');
  cardNumberInput.value = formatted;
  // atualiza preview
  previewNumber.textContent = formatted.padEnd(19, '#');
});

/* Nome do titular: atualiza preview (maiusculas) */
cardNameInput.addEventListener('input', () => {
  const v = cardNameInput.value.trim();
  previewName.textContent = v ? v.toUpperCase() : 'NOME DO TITULAR';
});

/* Validade: formatar como MM/AA */
cardExpiryInput.addEventListener('input', () => {
  let v = apenasDigitos(cardExpiryInput.value).slice(0,4); // MMYY
  if (v.length >= 3) {
    v = v.slice(0,2) + '/' + v.slice(2);
  }
  cardExpiryInput.value = v;
  previewExpiry.textContent = v || 'MM/AA';
});

/* CVV: apenas dígitos, máximo 3 */
cardCvvInput.addEventListener('input', () => {
  cardCvvInput.value = apenasDigitos(cardCvvInput.value).slice(0,3);
});

/* ---------- validações ---------- */

/**
 * - tem entre 13 e 16 dígitos (varia por bandeira) — aqui limitamos a 13-19 por segurança
 * - passa no Luhn
 */
function validarCardNumber() {
  const digits = apenasDigitos(cardNumberInput.value);
  if (digits.length < 13 || digits.length > 19) {
    errorCardNumber.textContent = 'Número de cartão inválido (quantidade de dígitos).';
    return false;
  }
  errorCardNumber.textContent = '';
  return true;
}

function validarCardName() {
  const v = cardNameInput.value.trim();
  if (!v) {
    errorCardName.textContent = 'Informe o nome do titular.';
    return false;
  }
  // cheque simples: pelo menos 2 caracteres
  if (v.length < 2) {
    errorCardName.textContent = 'Nome muito curto.';
    return false;
  }
  errorCardName.textContent = '';
  return true;
}

function validarExpiry() {
  const v = apenasDigitos(cardExpiryInput.value);
  if (v.length !== 4) {
    errorCardExpiry.textContent = 'Validade inválida. Use MM/AA.';
    return false;
  }
  const month = parseInt(v.slice(0,2),10);
  const year = parseInt(v.slice(2),10);
  if (month < 1 || month > 12) {
    errorCardExpiry.textContent = 'Mês inválido na validade.';
    return false;
  }

  // converte AA para 20AA (ex: 24 -> 2024). Ajuste simples — funciona até 2099.
  const current = new Date();
  const currentYear = current.getFullYear() % 100; // dois dígitos
  const currentMonth = current.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    errorCardExpiry.textContent = 'Cartão expirado.';
    return false;
  }

  errorCardExpiry.textContent = '';
  return true;
}

function validarCvv() {
  const v = apenasDigitos(cardCvvInput.value);
  if (v.length < 3 || v.length > 4) {
    errorCardCvv.textContent = 'CVV inválido.';
    return false;
  }
  errorCardCvv.textContent = '';
  return true;
}

/* valida tudo e retorna booleano */
function validarTudo() {
  const a = validarCardNumber();
  const b = validarCardName();
  const c = validarExpiry();
  const d = validarCvv();
  return a && b && c && d;
}

/* ---------- submissão do formulário (simulada) ---------- */

form.addEventListener('submit', (ev) => {
  ev.preventDefault(); // evita envio real
  statusMessage.textContent = '';
  // desabilita botão para evitar múltiplos cliques
  const btn = document.getElementById('pay-button');
  btn.disabled = true;
  btn.textContent = 'Validando...';

  // valida front-end
  const ok = validarTudo();
  if (!ok) {
    statusMessage.textContent = 'Corrija os erros acima e tente novamente.';
    btn.disabled = false;
    btn.textContent = 'Realizar transação';
    return;
  }

  statusMessage.textContent = 'Processando pagamento...';
  setTimeout(() => {
    const success = true;
    if (success) {
      statusMessage.textContent = 'Pagamento efetuado com sucesso!';
      form.reset();
      // reset preview
      previewNumber.textContent = '#### #### #### ####';
      previewName.textContent = 'NOME DO TITULAR';
      previewExpiry.textContent = 'MM/AA';
      btn.textContent = 'Realizar transação';
      btn.disabled = false;
      //reset no carrinho pra esvaziar
      localStorage.setItem("soma", JSON.stringify(0));
      localStorage.setItem("nomes", JSON.stringify([]));  
      let carrinho = [];
      localStorage.setItem("carrinho", JSON.stringify(carrinho));
      attValorAndNomes();
    } else {
      statusMessage.textContent = 'Falha ao processar o pagamento. Tente outro cartão.';
      btn.textContent = 'Realizar transação';
      btn.disabled = false;
    }
  }, 1200); // atraso simulado de 1.2s
});

/* ---------- validação em blur (quando sai do campo) ---------- */
cardNumberInput.addEventListener('blur', validarCardNumber);
cardNameInput.addEventListener('blur', validarCardName);
cardExpiryInput.addEventListener('blur', validarExpiry);
cardCvvInput.addEventListener('blur', validarCvv);