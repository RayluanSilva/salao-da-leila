const firebaseConfig = {
  apiKey: "AIzaSyAGeoWrN_4T-Ekt7kGBZjBCKcUE9VE6DAU",
  authDomain: "salao-da-leila-app.firebaseapp.com",
  projectId: "salao-da-leila-app",
  storageBucket: "salao-da-leila-app.firebasestorage.app",
  messagingSenderId: "982795418790",
  appId: "1:982795418790:web:26912829ee7615ccbf4867",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
const db = firebase.firestore();
const colecaoAgendamentos = db.collection("agendamentos");

const EMAIL_ADMIN = "leila@salao.com";

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

function ehAdmin(usuario) {
  return !!usuario && usuario.email === EMAIL_ADMIN;
}

function paraListaDeAgendamentos(snapshot) {
  const lista = [];
  snapshot.forEach(function (doc) {
    const agendamento = doc.data();
    agendamento.id = doc.id;
    lista.push(agendamento);
  });
  return lista;
}

function buscarAgendamentosDoCliente(uid) {
  return colecaoAgendamentos
    .where("clienteId", "==", uid)
    .get()
    .then(paraListaDeAgendamentos);
}

function buscarTodosAgendamentos() {
  return colecaoAgendamentos.get().then(paraListaDeAgendamentos);
}

function criarAgendamento(agendamento) {
  return colecaoAgendamentos.add(agendamento);
}

function atualizarAgendamento(id, campos) {
  return colecaoAgendamentos.doc(id).update(campos);
}

function salvarPerfil(uid, perfil) {
  const perfis = JSON.parse(localStorage.getItem("perfis") || "{}");
  perfis[uid] = perfil;
  localStorage.setItem("perfis", JSON.stringify(perfis));
}

function pegarPerfil(uid) {
  const perfis = JSON.parse(localStorage.getItem("perfis") || "{}");
  return perfis[uid] || null;
}

function sair() {
  auth.signOut().then(function () {
    window.location.href = "login.html";
  });
}

function mensagemDeErro(codigo) {
  const mensagens = {
    "auth/invalid-email": "Digite um e-mail válido.",
    "auth/user-not-found": "E-mail ou senha incorretos.",
    "auth/wrong-password": "E-mail ou senha incorretos.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/email-already-in-use": "Já existe uma conta com esse e-mail.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco e tente de novo.",
    "auth/network-request-failed": "Sem conexão com a internet.",
  };
  return mensagens[codigo] || "Não foi possível completar. Tente novamente.";
}
