function alternarMenu() {
  const menu = document.getElementById("menuPrincipal");
  const botao = document.getElementById("botaoMenu");

  menu.classList.toggle("aberto");

  if (menu.classList.contains("aberto")) {
    botao.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  } else {
    botao.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
}
