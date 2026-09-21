const SERVICOS = [
  { id: 1, nome: "Corte Feminino", preco: 70, duracao: 50, icone: "fa-scissors" },
  { id: 2, nome: "Escova", preco: 60, duracao: 40, icone: "fa-wind" },
  { id: 3, nome: "Corte Masculino", preco: 45, duracao: 30, icone: "fa-user-tie" },
  { id: 4, nome: "Coloração", preco: 180, duracao: 120, icone: "fa-palette" },
  { id: 5, nome: "Hidratação", preco: 90, duracao: 60, icone: "fa-droplet" },
  { id: 6, nome: "Manicure", preco: 40, duracao: 40, icone: "fa-hand-sparkles" },
  { id: 7, nome: "Pedicure", preco: 50, duracao: 50, icone: "fa-shoe-prints" },
  { id: 8, nome: "Sobrancelha", preco: 35, duracao: 25, icone: "fa-eye" },
];

const ADMIN = {
  email: "leila@salao.com",
  senha: "leila123",
};

function pegarDados() {
  const salvo = localStorage.getItem("salaoDaLeila");
  if (salvo) {
    return JSON.parse(salvo);
  }
  const dadosIniciais = {
    clientes: [],
    agendamentos: [],
  };
  salvarDados(dadosIniciais);
  return dadosIniciais;
}

function salvarDados(dados) {
  localStorage.setItem("salaoDaLeila", JSON.stringify(dados));
}

function pegarSessao() {
  const sessao = localStorage.getItem("sessao");
  return sessao ? JSON.parse(sessao) : null;
}

function salvarSessao(sessao) {
  localStorage.setItem("sessao", JSON.stringify(sessao));
}

function sair() {
  localStorage.removeItem("sessao");
  window.location.href = "login.html";
}

function gerarId() {
  return Date.now();
}
