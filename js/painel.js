auth.onAuthStateChanged(function (usuario) {
  if (!usuario || !ehAdmin(usuario)) {
    window.location.href = "login.html";
    return;
  }
  iniciarPagina();
});

function iniciarPagina() {
  const dados = pegarDados();
  const listaDiv = document.getElementById("listaPainel");

  function iconeDoServico(nomeServico) {
    const servico = SERVICOS.find(function (s) {
      return s.nome === nomeServico;
    });
    return servico ? servico.icone : "fa-circle-check";
  }

  window.desenharLista = function () {
    const filtroStatus = document.getElementById("filtroStatus").value;
    const filtroNome = document.getElementById("filtroNome").value.trim().toLowerCase();

    let lista = dados.agendamentos.slice();

    lista.sort(function (a, b) {
      return (a.data + a.hora).localeCompare(b.data + b.hora);
    });

    if (filtroStatus) {
      lista = lista.filter(function (a) {
        return statusGeral(a) === filtroStatus;
      });
    }

    if (filtroNome) {
      lista = lista.filter(function (a) {
        return (a.clienteNome || "").toLowerCase().indexOf(filtroNome) !== -1;
      });
    }

    if (lista.length === 0) {
      listaDiv.innerHTML =
        '<div class="vazio"><i class="fa-solid fa-clipboard-list"></i>' +
        "Nenhum agendamento encontrado.</div>";
      return;
    }

    listaDiv.innerHTML = "";
    lista.forEach(function (agendamento) {
      listaDiv.appendChild(criarCartao(agendamento));
    });
  };

  function criarCartao(agendamento) {
    const status = statusGeral(agendamento);
    const finalizado = status === "Cancelado" || status === "Concluído";

    const div = document.createElement("div");
    div.className = "agendamento";

    let linhasServicos = "";
    agendamento.servicos.forEach(function (servico, indice) {
      linhasServicos +=
        '<tr><td><div class="nome-item"><i class="fa-solid ' + iconeDoServico(servico.nome) + '"></i>' +
          servico.nome + " (" + formatarPreco(servico.preco) + ")</div></td>" +
        "<td>" +
          '<select onchange="mudarStatusServico(' + agendamento.id + ", " + indice + ', this.value)">' +
            ["Pendente", "Em andamento", "Concluído", "Cancelado"].map(function (opcao) {
              const selecionado = opcao === servico.status ? "selected" : "";
              return '<option value="' + opcao + '" ' + selecionado + ">" + opcao + "</option>";
            }).join("") +
          "</select>" +
        "</td></tr>";
    });

    let botoes = "";
    if (!agendamento.confirmado && !finalizado) {
      botoes +=
        '<button onclick="confirmarAgendamento(' + agendamento.id + ')">' +
        '<i class="fa-solid fa-check"></i> Confirmar</button>';
    }
    if (!finalizado) {
      botoes +=
        '<button class="secundario" onclick="mostrarFormularioAlterar(' + agendamento.id + ')">' +
          '<i class="fa-solid fa-pen"></i> Alterar horário</button>' +
        '<button class="cancelar" onclick="cancelarAgendamento(' + agendamento.id + ')">' +
          '<i class="fa-solid fa-xmark"></i> Cancelar</button>';
    }

    div.innerHTML =
      '<div class="agendamento-topo">' +
        "<div>" +
          '<div class="agendamento-data">' + (agendamento.clienteNome || "Cliente removida") + "</div>" +
          '<div class="agendamento-hora"><i class="fa-solid fa-phone"></i>' + (agendamento.clienteTelefone || "-") + "</div>" +
        "</div>" +
        '<span class="status ' + classeStatus(status) + '">' + status + "</span>" +
      "</div>" +
      '<p class="agendamento-hora"><i class="fa-solid fa-calendar-day"></i>' +
        formatarData(agendamento.data) + " às " + agendamento.hora + "</p>" +
      "<table>" + linhasServicos + "</table>" +
      '<div class="total">Total: <span>' + formatarPreco(calcularTotal(agendamento)) + "</span></div>" +
      '<div class="acoes">' + botoes + "</div>" +
      '<div id="formAlterar' + agendamento.id + '" class="escondido form-alterar">' +
        '<div class="campo"><label>Nova data</label><input type="date" id="novaData' + agendamento.id + '" value="' + agendamento.data + '"></div>' +
        '<div class="campo"><label>Novo horário</label><input type="time" id="novaHora' + agendamento.id + '" value="' + agendamento.hora + '" min="09:00" max="19:00" step="1800"></div>' +
        '<button onclick="salvarAlteracao(' + agendamento.id + ')">Salvar</button>' +
      "</div>";

    return div;
  }

  window.mudarStatusServico = function (agendamentoId, indiceServico, novoStatus) {
    const agendamento = dados.agendamentos.find(function (a) {
      return a.id === agendamentoId;
    });
    agendamento.servicos[indiceServico].status = novoStatus;
    salvarDados(dados);
    desenharLista();
  };

  window.confirmarAgendamento = function (id) {
    const agendamento = dados.agendamentos.find(function (a) {
      return a.id === id;
    });
    agendamento.confirmado = true;
    salvarDados(dados);
    desenharLista();
  };

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

    const agendamento = dados.agendamentos.find(function (a) {
      return a.id === id;
    });

    agendamento.data = novaData;
    agendamento.hora = novaHora;

    salvarDados(dados);
    desenharLista();
  };

  window.cancelarAgendamento = function (id) {
    const confirmou = confirm("Cancelar este agendamento?");
    if (!confirmou) return;

    const agendamento = dados.agendamentos.find(function (a) {
      return a.id === id;
    });

    agendamento.servicos.forEach(function (s) {
      s.status = "Cancelado";
    });

    salvarDados(dados);
    desenharLista();
  };

  desenharLista();
}
