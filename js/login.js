const sessaoAtual = pegarSessao();
if (sessaoAtual) {
  if (sessaoAtual.tipo === "ADMIN") {
    window.location.href = "painel.html";
  } else {
    window.location.href = "agendar.html";
  }
}

function mostrarTipo(tipo) {
  const areaCliente = document.getElementById("areaCliente");
  const areaAdmin = document.getElementById("areaAdmin");
  const botaoCliente = document.getElementById("botaoAbaCliente");
  const botaoAdmin = document.getElementById("botaoAbaAdmin");

  if (tipo === "cliente") {
    areaCliente.classList.remove("escondido");
    areaAdmin.classList.add("escondido");
    botaoCliente.classList.add("ativa");
    botaoAdmin.classList.remove("ativa");
  } else {
    areaCliente.classList.add("escondido");
    areaAdmin.classList.remove("escondido");
    botaoCliente.classList.remove("ativa");
    botaoAdmin.classList.add("ativa");
  }
}

function mostrarFormulario(qual) {
  const formEntrar = document.getElementById("formEntrarCliente");
  const formCadastro = document.getElementById("formCadastro");
  const botaoEntrar = document.getElementById("botaoEntrar");
  const botaoCadastrar = document.getElementById("botaoCadastrar");

  if (qual === "entrar") {
    formEntrar.classList.remove("escondido");
    formCadastro.classList.add("escondido");
    botaoEntrar.classList.add("ativa");
    botaoCadastrar.classList.remove("ativa");
  } else {
    formEntrar.classList.add("escondido");
    formCadastro.classList.remove("escondido");
    botaoEntrar.classList.remove("ativa");
    botaoCadastrar.classList.add("ativa");
  }
}

function fazerLoginCliente(evento) {
  evento.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const senha = document.getElementById("loginSenha").value;
  const erro = document.getElementById("erroLoginCliente");

  const dados = pegarDados();
  const cliente = dados.clientes.find(function (c) {
    return c.email.toLowerCase() === email && c.senha === senha;
  });

  if (!cliente) {
    erro.textContent = "E-mail ou senha incorretos.";
    return false;
  }

  salvarSessao({ tipo: "CLIENTE", clienteId: cliente.id });
  window.location.href = "agendar.html";
  return false;
}

function fazerCadastro(evento) {
  evento.preventDefault();

  const nome = document.getElementById("cadastroNome").value.trim();
  const telefone = document.getElementById("cadastroTelefone").value.trim();
  const email = document.getElementById("cadastroEmail").value.trim().toLowerCase();
  const senha = document.getElementById("cadastroSenha").value;
  const erro = document.getElementById("erroCadastro");

  const dados = pegarDados();

  const jaExiste = dados.clientes.some(function (c) {
    return c.email.toLowerCase() === email;
  });

  if (jaExiste) {
    erro.textContent = "Já existe uma conta com esse e-mail.";
    return false;
  }

  const novoCliente = {
    id: gerarId(),
    nome: nome,
    telefone: telefone,
    email: email,
    senha: senha,
  };

  dados.clientes.push(novoCliente);
  salvarDados(dados);

  salvarSessao({ tipo: "CLIENTE", clienteId: novoCliente.id });
  window.location.href = "agendar.html";
  return false;
}

function fazerLoginAdmin(evento) {
  evento.preventDefault();

  const email = document.getElementById("adminEmail").value.trim().toLowerCase();
  const senha = document.getElementById("adminSenha").value;
  const erro = document.getElementById("erroLoginAdmin");

  if (email === ADMIN.email && senha === ADMIN.senha) {
    salvarSessao({ tipo: "ADMIN" });
    window.location.href = "painel.html";
    return false;
  }

  erro.textContent = "E-mail ou senha incorretos.";
  return false;
}
