auth.onAuthStateChanged(function (usuario) {
  if (usuario) {
    window.location.href = ehAdmin(usuario) ? "painel.html" : "agendar.html";
  }
});

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
  erro.textContent = "";

  auth
    .signInWithEmailAndPassword(email, senha)
    .then(function (resultado) {
      if (ehAdmin(resultado.user)) {
        auth.signOut();
        erro.textContent = 'Esta conta é da equipe. Use a aba "Sou Funcionario".';
        return;
      }
      window.location.href = "agendar.html";
    })
    .catch(function (erroFirebase) {
      erro.textContent = mensagemDeErro(erroFirebase.code);
    });

  return false;
}

function fazerCadastro(evento) {
  evento.preventDefault();

  const nome = document.getElementById("cadastroNome").value.trim();
  const telefone = document.getElementById("cadastroTelefone").value.trim();
  const email = document.getElementById("cadastroEmail").value.trim().toLowerCase();
  const senha = document.getElementById("cadastroSenha").value;
  const erro = document.getElementById("erroCadastro");
  erro.textContent = "";

  auth
    .createUserWithEmailAndPassword(email, senha)
    .then(function (resultado) {
      salvarPerfil(resultado.user.uid, { nome: nome, telefone: telefone });
      return resultado.user.updateProfile({ displayName: nome });
    })
    .then(function () {
      window.location.href = "agendar.html";
    })
    .catch(function (erroFirebase) {
      erro.textContent = mensagemDeErro(erroFirebase.code);
    });

  return false;
}

function fazerLoginAdmin(evento) {
  evento.preventDefault();

  const email = document.getElementById("adminEmail").value.trim().toLowerCase();
  const senha = document.getElementById("adminSenha").value;
  const erro = document.getElementById("erroLoginAdmin");
  erro.textContent = "";

  auth
    .signInWithEmailAndPassword(email, senha)
    .then(function (resultado) {
      if (!ehAdmin(resultado.user)) {
        auth.signOut();
        erro.textContent = "Esta conta não tem acesso de administrador.";
        return;
      }
      window.location.href = "painel.html";
    })
    .catch(function (erroFirebase) {
      erro.textContent = mensagemDeErro(erroFirebase.code);
    });

  return false;
}
