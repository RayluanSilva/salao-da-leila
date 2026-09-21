# Salão da Leila - Sistema de Agendamento

Teste prático para a vaga de Desenvolvimento - DSIN Tecnologia da Informação.

**Site publicado: https://salao-da-leila.vercel.app**

## Tecnologias utilizadas

- **HTML5**
- **CSS3** (Flexbox, Grid e variáveis de cor)
- **JavaScript puro** (sem frameworks)
- **Firebase Authentication** (login e cadastro de verdade)
- **Font Awesome** (ícones, via CDN)
- **Google Fonts** (Barlow Condensed e Jost)

A logo do site foi feita em SVG (`imagens/logo.svg`).

Não usei nenhum framework de front-end. O login e o cadastro são
autenticados de verdade pelo Firebase Authentication (servidor do Google) -
as senhas nunca ficam salvas no navegador nem em texto puro em lugar
nenhum. Os agendamentos continuam salvos no `localStorage` do navegador
(ver a seção **Sobre o Firebase** para o que isso significa na prática).

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

**Login da administradora (Leila)** - conta real, já criada no Firebase:
- E-mail: leila@salao.com
- Senha: leila123

**Cliente:** não existe conta pronta. Crie uma pela aba "Criar conta" na
tela de login - vira uma conta de verdade no Firebase, com e-mail e senha
reais (mínimo 6 caracteres, exigido pelo Firebase).

Sugestão:
1. Crie uma conta de cliente e marque um agendamento em "Agendar";
2. Saia e entre como funcionario (aba "Sou Funcionario");
3. Confirme o agendamento no Painel e mude o status dos serviços;
4. Veja os números em "Desempenho".

Importante: o agendamento só aparece no Painel se for testado **no mesmo
navegador** em que foi criado (veja o porquê em **Sobre o Firebase**
abaixo).

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
  dados.js                - configuração do Firebase, catálogo de serviços,
                             acesso ao localStorage dos agendamentos
  utils.js                - funções de data, preço e status
  login.js                - login e cadastro via Firebase Authentication
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

## Sobre o Firebase

O login e o cadastro usam o **Firebase Authentication**, um serviço do
Google. É autenticação de verdade: a senha nunca passa nem fica salva no
navegador - ela vai direto para o servidor do Firebase, que devolve só uma
confirmação de identidade. Ninguém consegue ler a senha de outra pessoa
abrindo o DevTools, e ninguém entra como administradora sem saber a senha
real dela.

A chave (`apiKey`) que aparece em `js/dados.js` **não é um segredo** - é
assim que o Firebase funciona: essa chave só identifica de qual projeto o
site está falando, ela não dá acesso a nada sozinha. Toda a documentação
oficial do Firebase recomenda deixá-la no código do front-end mesmo, e é
por isso que ela está exposta aqui sem problema.

O que o Firebase cuida:
- Login e cadastro (e-mail e senha)
- Saber quem está logada em cada página

O que **continua** no `localStorage` do navegador (não mudou):
- Os agendamentos em si
- O telefone informado no cadastro (o Firebase Authentication não tem um
  campo pronto para isso)

Na prática, isso significa que os agendamentos só aparecem para quem
testar tudo **no mesmo navegador**: se a cliente agenda no Chrome do
computador e a administradora abre o Firefox, ou o celular, ela não vai
ver esse agendamento - o login é o mesmo em qualquer lugar, mas os dados
do agendamento, não. Resolver isso de vez exigiria guardar os
agendamentos também no Firebase (no Firestore, o banco de dados dele) em
vez do localStorage - um passo natural a seguir, mas fora do que foi pedido
aqui.

## Outras observações

- Os horários disponíveis são só um campo de hora com intervalo de 30 em
  30 minutos (das 9h às 19h) - não tem uma verificação de horário já
  ocupado por outra cliente.
- As fontes, os ícones e o Firebase vêm de serviços externos (CDN e nuvem
  do Google), então é preciso estar conectado à internet para o site
  funcionar.
