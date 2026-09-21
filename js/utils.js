function formatarPreco(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function formatarData(dataTexto) {
  const partes = dataTexto.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function diasParaAgendamento(dataTexto) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataAgendamento = new Date(dataTexto + "T00:00:00");
  const diferencaMs = dataAgendamento - hoje;
  return Math.round(diferencaMs / (1000 * 60 * 60 * 24));
}

function podeAlterar(dataTexto) {
  return diasParaAgendamento(dataTexto) >= 2;
}

function inicioDaSemana(dataTexto) {
  const data = new Date(dataTexto + "T00:00:00");
  const diaDaSemana = data.getDay();
  const diferenca = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
  data.setDate(data.getDate() + diferenca);
  return data;
}

function mesmaSemanaOutraData(data1, data2) {
  const inicio1 = inicioDaSemana(data1).getTime();
  const inicio2 = inicioDaSemana(data2).getTime();
  return inicio1 === inicio2;
}

function calcularTotal(agendamento) {
  let total = 0;
  agendamento.servicos.forEach(function (servico) {
    if (servico.status !== "Cancelado") {
      total += servico.preco;
    }
  });
  return total;
}

function jaPassou(dataTexto) {
  return diasParaAgendamento(dataTexto) < 0;
}

function statusGeral(agendamento) {
  const servicosAtivos = agendamento.servicos.filter(function (s) {
    return s.status !== "Cancelado";
  });

  if (servicosAtivos.length === 0) {
    return "Cancelado";
  }

  const todosConcluidos = servicosAtivos.every(function (s) {
    return s.status === "Concluído";
  });
  if (todosConcluidos) {
    return "Concluído";
  }

  if (!agendamento.confirmado) {
    return "Aguardando confirmação";
  }

  return "Confirmado";
}

function classeStatus(status) {
  if (status === "Cancelado") return "status-cancelado";
  if (status === "Concluído") return "status-concluido";
  if (status === "Confirmado") return "status-confirmado";
  return "status-pendente";
}
