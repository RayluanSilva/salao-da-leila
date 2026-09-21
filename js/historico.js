const sessao = pegarSessao();
if (!sessao || sessao.tipo !== "CLIENTE") {
  window.location.href = "login.html";
}

const dados = pegarDados();
const listaDiv = document.getElementById("listaHistorico");

const historicoCompleto = dados.agendamentos
  .filter(function (a) {
    return a.clienteId === sessao.clienteId && jaPassou(a.data);
  })
  .sort(function (a, b) {
    return (b.data + b.hora).localeCompare(a.data + a.hora);
  });

filtrar();

function filtrar() {
  const de = document.getElementById("filtroDe").value;
  const ate = document.getElementById("filtroAte").value;

  const filtrados = historicoCompleto.filter(function (a) {
    if (de && a.data < de) return false;
    if (ate && a.data > ate) return false;
    return true;
  });

  desenhar(filtrados);
}

function limparFiltro() {
  document.getElementById("filtroDe").value = "";
  document.getElementById("filtroAte").value = "";
  filtrar();
}

function desenhar(lista) {
  if (historicoCompleto.length === 0) {
    listaDiv.innerHTML =
      '<div class="vazio"><i class="fa-solid fa-clock-rotate-left"></i>' +
      "Você ainda não tem agendamentos anteriores.</div>";
    return;
  }

  if (lista.length === 0) {
    listaDiv.innerHTML =
      '<div class="vazio"><i class="fa-solid fa-magnifying-glass"></i>' +
      "Nenhum agendamento encontrado nesse período.</div>";
    return;
  }

  listaDiv.innerHTML = '<p class="contador">' + lista.length + " agendamento(s) encontrado(s)</p>";

  lista.forEach(function (agendamento) {
    const status = statusGeral(agendamento);

    let linhasServicos = "";
    agendamento.servicos.forEach(function (s) {
      linhasServicos +=
        '<tr><td><div class="nome-item"><i class="fa-solid fa-circle-check"></i>' + s.nome + "</div></td>" +
        '<td><span class="status ' + classeStatus(s.status) + '">' + s.status + "</span></td>" +
        "<td>" + formatarPreco(s.preco) + "</td></tr>";
    });

    const div = document.createElement("div");
    div.className = "agendamento";
    div.innerHTML =
      '<div class="agendamento-topo">' +
        "<div>" +
          '<div class="agendamento-data">' + formatarData(agendamento.data) + "</div>" +
          '<div class="agendamento-hora"><i class="fa-solid fa-clock"></i> às ' + agendamento.hora + "</div>" +
        "</div>" +
        '<span class="status ' + classeStatus(status) + '">' + status + "</span>" +
      "</div>" +
      "<table>" + linhasServicos + "</table>" +
      '<div class="total">Total: <span>' + formatarPreco(calcularTotal(agendamento)) + "</span></div>";

    listaDiv.appendChild(div);
  });
}
