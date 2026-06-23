console.log("Site Agrotech carregado com sucesso.");

const HORAS_SOL_PLENO = 5;

function formatarNumero(valor) {
    return valor.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function obterNumero(id) {
    return Number(document.getElementById(id).value);
}

function configurarCalculadoraSolar() {
    const form = document.getElementById("solarForm");
    const resultado = document.getElementById("resultadoSolar");

    if (!form || !resultado) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const potenciaBomba = obterNumero("potenciaBomba");
        const horasBomba = obterNumero("horasBomba");
        const potenciaPainel = obterNumero("potenciaPainel");
        const areaPainel = obterNumero("areaPainel");

        if (potenciaBomba <= 0 || horasBomba <= 0 || horasBomba > 24 || potenciaPainel <= 0 || areaPainel <= 0) {
            resultado.innerHTML = "<strong>Preencha todos os campos com valores válidos.</strong>";
            return;
        }

        const consumoDiarioWh = potenciaBomba * horasBomba;
        const geracaoPainelDiaWh = potenciaPainel * HORAS_SOL_PLENO;
        const quantidadePaineis = Math.ceil(consumoDiarioWh / geracaoPainelDiaWh);
        const areaTotal = quantidadePaineis * areaPainel;

        resultado.innerHTML = `
            <strong>Resultado estimado:</strong><br>
            Consumo diário: ${formatarNumero(consumoDiarioWh / 1000)} kWh/dia.<br>
            Painéis necessários: ${quantidadePaineis} unidade(s).<br>
            Área aproximada: ${formatarNumero(areaTotal)} m².
        `;
    });
}

function configurarCalculadoraHidroponica() {
    const form = document.getElementById("hidroForm");
    const resultado = document.getElementById("resultadoHidro");

    if (!form || !resultado) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const areaCultivo = obterNumero("areaCultivo");
        const litrosPorMetro = obterNumero("litrosPorMetro");
        const diasReserva = obterNumero("diasReserva");

        if (areaCultivo <= 0 || litrosPorMetro <= 0 || diasReserva <= 0) {
            resultado.innerHTML = "<strong>Preencha todos os campos com valores válidos.</strong>";
            return;
        }

        const consumoDiario = areaCultivo * litrosPorMetro;
        const consumoSemanal = consumoDiario * 7;
        const reservatorio = consumoDiario * diasReserva;

        resultado.innerHTML = `
            <strong>Resultado estimado:</strong><br>
            Área informada: ${formatarNumero(areaCultivo)} m².<br>
            Consumo diário estimado: ${formatarNumero(consumoDiario)} litros/dia.<br>
            Consumo semanal estimado: ${formatarNumero(consumoSemanal)} litros/semana.<br>
            Reservatório recomendado: ${formatarNumero(reservatorio)} litros para ${diasReserva} dia(s).<br>
            <small>Premissa: ${litrosPorMetro} L/m²/dia.</small>
        `;
    });
}

function validarNomeCompleto(nome) {
    const partes = nome.trim().split(/\s+/);

    if (partes.length < 2) {
        return "Informe nome e sobrenome.";
    }

    const nomeInvalido = partes.some(parte => parte.replace(/[^A-Za-zÀ-ÿ]/g, "").length < 2);

    if (nomeInvalido) {
        return "Nome e sobrenome devem ter no mínimo duas letras cada.";
    }

    return "";
}

function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
        return "O e-mail não pode ficar em branco.";
    }

    if (!regexEmail.test(email.trim())) {
        return "Informe um e-mail válido.";
    }

    return "";
}

function validarMensagem(mensagem) {
    if (!mensagem.trim()) {
        return "A mensagem não pode ficar em branco.";
    }

    if (mensagem.length > 500) {
        return "A mensagem deve ter no máximo 500 caracteres.";
    }

    return "";
}

function aplicarEstadoCampo(campo, erro, elementoErro) {
    elementoErro.textContent = erro;
    campo.classList.toggle("is-invalid", Boolean(erro));
    campo.classList.toggle("is-valid", !erro && campo.value.trim().length > 0);
}

function configurarFormularioContato() {
    const form = document.getElementById("contatoForm");
    const nome = document.getElementById("nomeCompleto");
    const email = document.getElementById("email");
    const mensagem = document.getElementById("mensagem");
    const contador = document.getElementById("contadorMensagem");

    if (!form || !nome || !email || !mensagem || !contador) return;

    mensagem.addEventListener("input", function () {
        contador.textContent = `${mensagem.value.length}/500`;
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const nomeErro = validarNomeCompleto(nome.value);
        const emailErro = validarEmail(email.value);
        const mensagemErro = validarMensagem(mensagem.value);

        aplicarEstadoCampo(nome, nomeErro, document.getElementById("nomeErro"));
        aplicarEstadoCampo(email, emailErro, document.getElementById("emailErro"));
        aplicarEstadoCampo(mensagem, mensagemErro, document.getElementById("mensagemErro"));

        if (nomeErro || emailErro || mensagemErro) {
            return;
        }

        alert("Mensagem enviada com sucesso! A equipe Agrotech agradece o contato.");
        form.reset();
        contador.textContent = "0/500";
        nome.classList.remove("is-valid");
        email.classList.remove("is-valid");
        mensagem.classList.remove("is-valid");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    configurarCalculadoraSolar();
    configurarCalculadoraHidroponica();
    configurarFormularioContato();
});
