# Salão da Leila

Sistema de agendamento para salão de beleza. Teste prático — vaga de Desenvolvimento, DSIN Tecnologia da Informação.

**VERSÃO PUBLICADA:** https://salao-da-leila.vercel.app

## Tecnologias

- HTML5, CSS3, JavaScript (sem frameworks)
- Firebase Authentication — login e cadastro
- Cloud Firestore — banco de dados dos agendamentos
- Font Awesome — ícones (CDN)
- Google Fonts — Barlow Condensed / Jost

## Como rodar

Abrir `index.html` no navegador. Ou, com um servidor local:

```
npx serve
```

## Como usar

**Login da administradora (Leila)** - conta real, já criada no Firebase:
- E-mail: leila@salao.com
- Senha: leila123

**Cliente:** não existe conta pronta. Crie uma pela aba "Criar conta" na
tela de login - vira uma conta de verdade no Firebase, com e-mail e senha
reais (mínimo 6 caracteres, exigido pelo Firebase).

## Funcionalidades

- Cadastro e login
- Agendamento de um ou mais serviços por vez
- Aviso quando já existe agendamento na mesma semana
- Alteração e cancelamento até 2 dias antes do horário marcado
- Histórico de agendamentos com filtro por período
- Painel administrativo: confirmação de agendamento, status individual por serviço, alteração de horário sem restrição de prazo
- Dashboard com faturamento, ticket médio e serviços mais pedidos da semana

## Estrutura

```
index.html
login.html
agendar.html
meus-agendamentos.html
historico.html
painel.html
dashboard.html

css/estilo.css
imagens/

js/
  dados.js               configuração do Firebase, catálogo de serviços, acesso ao Firestore
  utils.js                formatação de data/preço, cálculo de status
  login.js                 autenticação
  agendar.js
  meusAgendamentos.js
  historico.js
  painel.js
  dashboard.js
  menu.js

firestore.rules
firebase.json
.firebaserc
```

## Banco de dados

Agendamentos na coleção `agendamentos` do Firestore. Regras de segurança (`firestore.rules`):

- cliente cria, lê e altera apenas os próprios agendamentos (`clienteId == uid`)
- administradora (e-mail fixo) lê e altera qualquer agendamento
- exclusão desabilitada — cancelamento é feito via status do serviço

## Observações

- A chave do Firebase em `js/dados.js` é pública por design, não é um segredo
- Nome e telefone do cadastro também ficam em cache local, usados ao criar o agendamento
- Sem verificação de conflito de horário entre agendamentos diferentes
- Depende de internet (Firebase, CDN de fontes e ícones)
