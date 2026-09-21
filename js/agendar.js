const sessao = pegarSessao();
if (!sessao || sessao.tipo !== "CLIENTE") {
  window.location.href = "login.html";
}

const dados = pegarDados();
const cliente = dados.clientes.find(function (c) {
  return c.id === sessao.clienteId;
});

document.getElementById("titulo").textContent = "Olá, " + cliente.nome.split(" ")[0] + "! O que vamos marcar?";

const listaServicos = document.getElementById("listaServicos");
SERVICOS.forEach(function (servico) {
  const div = document.createElement("div");
  div.className = "servico-item";
  div.innerHTML =
    "<label>" +
      '<span class="nome-servico">' +
        '<input type="checkbox" value="' + servico.id + '" onchange="atualizarTotal()">' +
        '<i class="fa-solid ' + servico.icone + '"></i>' +
        servico.nome +
      "</span>" +
      '<span class="preco-servico">' + formatarPreco(servico.preco) + "</span>" +
    "</label>" +
    '<div class="detalhe">' + servico.duracao + " minutos</div>";
  listaServicos.appendChild(div);
});

function atualizarTotal() {
  const marcados = pegarServicosMarcados();
  let totalPreco = 0;
  let totalDuracao = 0;

  marcados.forEach(function (servico) {
    totalPreco += servico.preco;
    totalDuracao += servico.duracao;
  });

  document.getElementById("totalPreco").textContent = formatarPreco(totalPreco);
  document.getElementById("totalDuracao").textContent = totalDuracao + " min";

  const itens = listaServicos.querySelectorAll(".servico-item");
  itens.forEach(function (item) {
    const checkbox = item.querySelector("input[type=checkbox]");
    if (checkbox.checked) {
      item.classList.add("marcado");
    } else {
      item.classList.remove("marcado");
    }
  });
}

function pegarServicosMarcados() {
  const checkboxes = listaServicos.querySelectorAll("input[type=checkbox]:checked");
  const marcados = [];
  checkboxes.forEach(function (checkbox) {
    const servico = SERVICOS.find(function (s) {
      return s.id === Number(checkbox.value);
    });
    marcados.push(servico);
  });
  return marcados;
}

document.getElementById("campoData").addEventListener("change", function () {
  const dataEscolhida = this.value;
  const aviso = document.getElementById("avisoMesmaSemana");

  if (!dataEscolhida) {
    aviso.classList.add("escondido");
    return;
  }

  const outroDaSemana = dados.agendamentos.find(function (a) {
    return (
      a.clienteId === cliente.id &&
      a.data !== dataEscolhida &&
      statusGeral(a) !== "Cancelado" &&
      mesmaSemanaOutraData(a.data, dataEscolhida)
    );
  });

  if (outroDaSemana) {
    aviso.innerHTML =
      '<i class="fa-solid fa-lightbulb"></i>' +
      "<span>Você já tem um horário marcado para <strong>" + formatarData(outroDaSemana.data) +
      "</strong> às " + outroDaSemana.hora + ". Que tal marcar este serviço na mesma data?</span>";
    aviso.classList.remove("escondido");
  } else {
    aviso.classList.add("escondido");
  }
});

function confirmarAgendamento() {
  const erro = document.getElementById("erroAgendar");
  erro.textContent = "";

  const servicosMarcados = pegarServicosMarcados();
  const data = document.getElementById("campoData").value;
  const hora = document.getElementById("campoHora").value;

  if (servicosMarcados.length === 0) {
    erro.textContent = "Escolha pelo menos um serviço.";
    return;
  }
  if (!data) {
    erro.textContent = "Escolha uma data.";
    return;
  }
  if (!hora) {
    erro.textContent = "Escolha um horário.";
    return;
  }
  if (diasParaAgendamento(data) < 0) {
    erro.textContent = "Escolha uma data futura.";
    return;
  }

  const novoAgendamento = {
    id: gerarId(),
    clienteId: cliente.id,
    data: data,
    hora: hora,
    confirmado: false,
    servicos: servicosMarcados.map(function (s) {
      return {
        nome: s.nome,
        preco: s.preco,
        duracao: s.duracao,
        status: "Pendente",
      };
    }),
  };

  dados.agendamentos.push(novoAgendamento);
  salvarDados(dados);

  window.location.href = "meus-agendamentos.html";
}
