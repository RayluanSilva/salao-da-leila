auth.onAuthStateChanged(function (usuario) {
  if (!usuario || !ehAdmin(usuario)) {
    window.location.href = "login.html";
    return;
  }
  iniciarPagina();
});

function iniciarPagina() {
  const dados = pegarDados();

  const hoje = new Date();
  const inicioSemanaAtual = inicioDaSemana(formatarDataISO(hoje));
  const fimSemanaAtual = new Date(inicioSemanaAtual);
  fimSemanaAtual.setDate(fimSemanaAtual.getDate() + 6);

  document.getElementById("periodoSemana").textContent =
    "De " + formatarDataObjeto(inicioSemanaAtual) + " até " + formatarDataObjeto(fimSemanaAtual);

  const agendamentosDaSemana = dados.agendamentos.filter(function (a) {
    const data = new Date(a.data + "T00:00:00");
    return data >= inicioSemanaAtual && data <= fimSemanaAtual;
  });

  const naoCancelados = agendamentosDaSemana.filter(function (a) {
    return statusGeral(a) !== "Cancelado";
  });
  const cancelados = agendamentosDaSemana.filter(function (a) {
    return statusGeral(a) === "Cancelado";
  });

  const faturamento = naoCancelados.reduce(function (soma, a) {
    return soma + calcularTotal(a);
  }, 0);

  const ticketMedio = naoCancelados.length > 0 ? faturamento / naoCancelados.length : 0;

  document.getElementById("numeroAtendimentos").textContent = naoCancelados.length;
  document.getElementById("numeroFaturamento").textContent = formatarPreco(faturamento);
  document.getElementById("numeroTicket").textContent = formatarPreco(ticketMedio);
  document.getElementById("numeroCancelados").textContent = cancelados.length;

  const contagemServicos = {};
  naoCancelados.forEach(function (agendamento) {
    agendamento.servicos.forEach(function (servico) {
      if (servico.status === "Cancelado") return;
      if (!contagemServicos[servico.nome]) {
        contagemServicos[servico.nome] = { quantidade: 0, total: 0 };
      }
      contagemServicos[servico.nome].quantidade += 1;
      contagemServicos[servico.nome].total += servico.preco;
    });
  });

  const tabela = document.getElementById("tabelaServicos");
  const nomesServicos = Object.keys(contagemServicos);

  if (nomesServicos.length === 0) {
    tabela.innerHTML =
      "<tr><td colspan='3' style='text-align:center; color:#8c8288; padding:30px;'>" +
      "Nenhum serviço registrado nesta semana.</td></tr>";
  } else {
    nomesServicos.sort(function (a, b) {
      return contagemServicos[b].total - contagemServicos[a].total;
    });

    nomesServicos.forEach(function (nome) {
      const linha = document.createElement("tr");
      linha.innerHTML =
        "<td>" + nome + "</td>" +
        "<td>" + contagemServicos[nome].quantidade + "</td>" +
        "<td>" + formatarPreco(contagemServicos[nome].total) + "</td>";
      tabela.appendChild(linha);
    });
  }
}

function formatarDataISO(dataObjeto) {
  const ano = dataObjeto.getFullYear();
  const mes = String(dataObjeto.getMonth() + 1).padStart(2, "0");
  const dia = String(dataObjeto.getDate()).padStart(2, "0");
  return ano + "-" + mes + "-" + dia;
}

function formatarDataObjeto(dataObjeto) {
  return formatarData(formatarDataISO(dataObjeto));
}
