# Salão da Leila - Sistema de Agendamento

Teste prático para a vaga de Desenvolvimento - DSIN Tecnologia da Informação.

**Site publicado: https://salao-da-leila.vercel.app**

## Tecnologias utilizadas

- **HTML5**
- **CSS3** (Flexbox, Grid e variáveis de cor)
- **JavaScript puro** (sem frameworks)
- **Firebase Authentication** (login e cadastro)
- **Cloud Firestore** (banco de dados dos agendamentos)
- **Font Awesome** (ícones, via CDN)
- **Google Fonts** (Barlow Condensed e Jost)

A logo do site foi feita em SVG (`imagens/logo.svg`).

Não usei nenhum framework de front-end. O login, o cadastro e os
agendamentos são todos de verdade, guardados no Firebase (Google) - as
senhas nunca ficam salvas no navegador, e os agendamentos ficam
disponíveis em qualquer dispositivo, não só no navegador onde foram
criados (ver a seção **Sobre o Firebase** para os detalhes).

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

O agendamento aparece no Painel **mesmo que a administradora esteja em
outro navegador, computador ou celular** - os dados agora ficam no
Firebase, não mais presos ao navegador que criou o agendamento.

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
                             funções de acesso ao Firestore
  utils.js                - funções de data, preço e status
  login.js                - login e cadastro via Firebase Authentication
  agendar.js              - novo agendamento
  meusAgendamentos.js     - lista, alteração e cancelamento
  historico.js            - histórico com filtro por período
  painel.js               - painel do funcionario
  dashboard.js            - números da semana

firestore.rules            - regras de segurança do banco de dados
firebase.json               - aponta para o firestore.rules
.firebaserc                  - qual projeto do Firebase este código usa
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

O site usa dois serviços do Firebase (Google):

**Firebase Authentication**, para login e cadastro. A senha nunca passa
nem fica salva no navegador - ela vai direto para o servidor do Firebase,
que devolve só uma confirmação de identidade. Ninguém consegue ler a
senha de outra pessoa abrindo o DevTools, e ninguém entra como
administradora sem saber a senha real dela.

**Cloud Firestore**, o banco de dados do Firebase, para os agendamentos.
Cada agendamento é um documento na coleção `agendamentos`, com o
`clienteId` (o uid do Firebase) marcando de quem é. Isso significa que
os agendamentos **não ficam mais presos a um navegador**: a cliente
agenda no celular, a administradora confirma no computador, e ambos
enxergam o mesmo dado, porque ele está guardado na nuvem do Google, não
no `localStorage`.

A chave (`apiKey`) que aparece em `js/dados.js` **não é um segredo** - é
assim que o Firebase funciona: essa chave só identifica de qual projeto o
site está falando, ela não dá acesso a nada sozinha. Toda a documentação
oficial do Firebase recomenda deixá-la no código do front-end mesmo, e é
por isso que ela está exposta aqui sem problema. Quem realmente controla
o que cada pessoa pode ler ou escrever é o arquivo `firestore.rules`.

### As regras de segurança (`firestore.rules`)

Sem essas regras, qualquer pessoa logada poderia ler ou editar o
agendamento de qualquer outra cliente direto pelo DevTools, contornando
completamente a tela do site. As regras rodam no servidor do Firebase,
não no navegador, então não tem como burlar:

- Uma cliente só consegue **criar** um agendamento em nome dela mesma
  (compara o `clienteId` do agendamento com o uid de quem está logada)
- Uma cliente só consegue **ler ou alterar** os próprios agendamentos
- A administradora (identificada pelo e-mail `leila@salao.com`) consegue
  ler e alterar **qualquer** agendamento
- Ninguém consegue apagar um agendamento (por isso cancelar marca os
  serviços como "Cancelado" em vez de remover o documento)

Essas regras foram testadas de verdade contra o Firebase (não é só teoria
no papel): uma cliente tentando se passar por outra, ou tentando ler o
agendamento alheio, recebe "Missing or insufficient permissions" do
próprio servidor do Google.

### O que ainda fica só no navegador

O nome e o telefone informados no cadastro ficam guardados localmente
(em `localStorage`) além de serem enviados para o Firebase - o
Authentication não tem um campo pronto para telefone, e o nome
(`displayName`) demora um instante para sincronizar depois do cadastro.
Isso só importa no exato momento de criar um agendamento: o nome e o
telefone são gravados dentro do próprio documento naquele instante, então
depois disso a informação já está no Firestore e visível de qualquer
lugar. O único cenário onde isso pode faltar é uma cliente **trocar de
navegador logo após se cadastrar** e agendar antes de o Firebase
sincronizar o nome - um caso bem específico, sem impacto no funcionamento
normal do sistema.

## Outras observações

- Os horários disponíveis são só um campo de hora com intervalo de 30 em
  30 minutos (das 9h às 19h) - não tem uma verificação de horário já
  ocupado por outra cliente.
- As fontes, os ícones e o Firebase vêm de serviços externos (CDN e nuvem
  do Google), então é preciso estar conectado à internet para o site
  funcionar.
