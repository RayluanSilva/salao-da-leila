# Salão da Leila - Sistema de Agendamento

Teste prático para a vaga de Desenvolvimento - DSIN Tecnologia da Informação.

**Site publicado: https://salao-da-leila.vercel.app**

## Tecnologias utilizadas

- **HTML5**
- **CSS3** (Flexbox, Grid e variáveis de cor)
- **JavaScript puro** (sem frameworks)
- **Font Awesome** (ícones, via CDN)
- **Google Fonts** (Barlow Condensed e Jost)

A logo do site foi feita em SVG (`imagens/logo.svg`).

Não usei nenhum framework, então toda a lógica está em JavaScript "na mão".
Os dados são salvos no `localStorage` do navegador, então não é preciso
nenhum banco de dados.

O layout é responsivo e funciona no celular.

## Como rodar o projeto

Não precisa instalar nada. É só abrir o arquivo `index.html` no navegador
(dois cliques nele já funciona).

Se preferir, também dá para servir a pasta com qualquer servidor simples,
por exemplo:

O projeto tambem esta publicado no link: https://salao-da-leila.vercel.app

```
npx serve
```

## Como testar

**Login da administradora (Leila)** - já vem pronto:
- E-mail: leila@salao.com
- Senha: leila123

**Cliente:** não existe conta pronta. Crie uma pela aba "Criar conta" na
tela de login.

Sugestão:
1. Crie uma conta de cliente e marque um agendamento em "Agendar";
2. Saia e entre como funcionario (aba "Sou funcionario");
3. Confirme o agendamento no Painel e mude o status dos serviços;
4. Veja os números em "Desempenho".

## Estrutura de arquivos

```
index.html                - página inicial (banner, serviços e contato)
login.html                - entrar / criar conta
agendar.html              - cliente marca um novo horário
meus-agendamentos.html    - cliente vê, altera e cancela os agendamentos
historico.html            - cliente vê o histórico filtrado por período
painel.html               - o funcionario vê e gerencia os agendamentos
dashboard.html            - desempenho da semana

css/
  estilo.css              - estilos de todas as páginas
imagens/
  logo.svg                - logo do site
  favicon.svg             - ícone da aba do navegador
  salao.jpg               - foto do banner
  atendimento.jpg         - foto da seção de contato
js/
  menu.js                 - abre e fecha o menu no celular
  dados.js                - serviços, login da Leila e acesso ao localStorage
  utils.js                - funções de data, preço e status
  login.js                - login e cadastro
  agendar.js              - novo agendamento
  meusAgendamentos.js     - lista, alteração e cancelamento
  historico.js            - histórico com filtro por período
  painel.js               - painel do funcionario
  dashboard.js            - números da semana
```

## Funcionalidades

- Cadastro e login de cliente; login fixo para a administradora
- Agendar um ou mais serviços de uma vez
- Se a cliente já tem outro agendamento na mesma semana, o sistema avisa e
  sugere marcar na mesma data
- Alterar ou cancelar um agendamento, mas só até 2 dias antes da data
  marcada - depois disso, o sistema pede para ligar no salão
- Histórico de agendamentos já realizados, com filtro por período
- O funcionario pode ver todos os agendamentos, confirmar, mudar o status de
  cada serviço (pendente, em andamento, concluído, cancelado) e também
  alterar o horário de qualquer cliente, sem a trava dos 2 dias
- Painel de desempenho com o total de atendimentos, faturamento, ticket
  médio e os serviços mais pedidos da semana

## Observações

- A senha fica salva sem criptografia no localStorage.
- Os horários disponíveis são só um campo de hora com intervalo de 30 em
  30 minutos (das 9h às 19h) - não tem uma verificação de horário já
  ocupado por outra cliente.
- Se limpar os dados do navegador (localStorage), o sistema volta a ficar
  vazio.
- As fontes e os ícones vêm de CDN, então é preciso estar conectado à
  internet para o site aparecer com o visual completo.
