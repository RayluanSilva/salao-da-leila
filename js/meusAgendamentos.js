auth.onAuthStateChanged(function (usuario) {
  if (!usuario || ehAdmin(usuario)) {
    window.location.href = "login.html";
    return;
  }
  buscarAgendamentosDoCliente(usuario.uid).then(function (agendamentos) {
    iniciarPagina(agendamentos);
  });
});

function iniciarPagina(agendamentos) {
  const listaDiv = document.getElementById("listaAgendamentos");

  desenharLista();

  function desenharLista() {
    const meusAgendamentos = agendamentos.filter(function (a) {
      return !jaPassou(a.data);
    });

    meusAgendamentos.sort(function (a, b) {
      return ((a.data || "") + (a.hora || "")).localeCompare((b.data || "") + (b.hora || ""));
    });

    if (meusAgendamentos.length === 0) {
      listaDiv.innerHTML =
        '<div class="vazio"><i class="fa-regular fa-calendar"></i>' +
        "Você ainda não tem agendamentos marcados.<br><br>" +
        '<a href="agendar.html" class="botao"><i class="fa-solid fa-calendar-plus"></i> Agendar agora</a></div>';
      return;
    }

    listaDiv.innerHTML = "";
    meusAgendamentos.forEach(function (agendamento) {
      listaDiv.appendChild(criarCartao(agendamento));
    });
  }

  function criarCartao(agendamento) {
    const status = statusGeral(agendamento);
    const podeMexer = podeAlterar(agendamento.data) && status !== "Cancelado" && status !== "Concluído";
    const id = agendamento.id;

    const div = document.createElement("div");
    div.className = "agendamento";

    let linhasServicos = "";
    agendamento.servicos.forEach(function (s) {
      linhasServicos +=
        '<tr><td><div class="nome-item"><i class="fa-solid fa-circle-check"></i>' + s.nome + "</div></td>" +
        '<td><span class="status ' + classeStatus(s.status) + '">' + s.status + "</span></td>" +
        "<td>" + formatarPreco(s.preco) + "</td></tr>";
    });

    let botoes = "";
    if (podeMexer) {
      botoes =
        '<button onclick="mostrarFormularioAlterar(\'' + id + '\')">' +
          '<i class="fa-solid fa-pen"></i> Alterar</button>' +
        '<button class="cancelar" onclick="cancelarAgendamento(\'' + id + '\')">' +
          '<i class="fa-solid fa-xmark"></i> Cancelar</button>';
    } else if (status !== "Cancelado" && status !== "Concluído") {
      botoes =
        '<span class="telefone-aviso"><i class="fa-solid fa-phone"></i>' +
        "Faltam menos de 2 dias. Para alterar, ligue (14) 3451-4098.</span>";
    }

    div.innerHTML =
      '<div class="agendamento-topo">' +
        "<div>" +
          '<div class="agendamento-data">' + formatarData(agendamento.data) + "</div>" +
          '<div class="agendamento-hora"><i class="fa-solid fa-clock"></i> às ' + agendamento.hora + "</div>" +
        "</div>" +
        '<span class="status ' + classeStatus(status) + '">' + status + "</span>" +
      "</div>" +
      "<table>" + linhasServicos + "</table>" +
      '<div class="total">Total: <span>' + formatarPreco(calcularTotal(agendamento)) + "</span></div>" +
      '<div class="acoes">' + botoes + "</div>" +
      '<div id="formAlterar' + id + '" class="escondido form-alterar">' +
        '<div class="campo"><label>Nova data</label><input type="date" id="novaData' + id + '" value="' + agendamento.data + '"></div>' +
        '<div class="campo"><label>Novo horário</label><input type="time" id="novaHora' + id + '" value="' + agendamento.hora + '" min="09:00" max="19:00" step="1800"></div>' +
        '<button onclick="salvarAlteracao(\'' + id + '\')">Salvar alteração</button>' +
      "</div>";

    return div;
  }

  window.mostrarFormularioAlterar = function (id) {
    document.getElementById("formAlterar" + id).classList.toggle("escondido");
  };

  window.salvarAlteracao = function (id) {
    const novaData = document.getElementById("novaData" + id).value;
    const novaHora = document.getElementById("novaHora" + id).value;

    if (!novaData || !novaHora) {
      alert("Preencha a nova data e o novo horário.");
      return;
    }

    atualizarAgendamento(id, { data: novaData, hora: novaHora, confirmado: false }).then(function () {
      const agendamento = agendamentos.find(function (a) {
        return a.id === id;
      });
      agendamento.data = novaData;
      agendamento.hora = novaHora;
      agendamento.confirmado = false;
      desenharLista();
    });
  };

  window.cancelarAgendamento = function (id) {
    const confirmou = confirm("Tem certeza que deseja cancelar este agendamento?");
    if (!confirmou) return;

    const agendamento = agendamentos.find(function (a) {
      return a.id === id;
    });
    const servicosCancelados = agendamento.servicos.map(function (s) {
      return { nome: s.nome, preco: s.preco, duracao: s.duracao, status: "Cancelado" };
    });

    atualizarAgendamento(id, { servicos: servicosCancelados }).then(function () {
      agendamento.servicos = servicosCancelados;
      desenharLista();
    });
  };
}
