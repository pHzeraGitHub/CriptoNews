# 🚀 CryptoNews Portal

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**CryptoNews** é um portal de notícias completo sobre **criptomoedas**, **mercado global** e **notícias personalizadas** pelo usuário, construído com **HTML**, **CSS**, **JavaScript** e **Bootstrap 5**.

---

## 🎯 Funcionalidades Principais

* **📊 Cotações de Criptomoedas**: painel discreto usando API do CoinGecko.
* **💱 Conversor de Moeda**: converte BRL ↔ BTC / USD em tempo real.
* **📈 Projeção de Investimento**: simula juros compostos com aportes iniciais e mensais.
* **📰 Notícias Externas de Cripto**: feed atualizado via CryptoCompare News API, com botão “🔄 Atualizar”.
* **🌍 Notícias do Mundo**: manchetes internacionais via GNews.io, recarregáveis.
* **✍️ Suas Notícias**: cadastro, listagem, filtragem por tags, pesquisa e detalhes; armazenadas em **Local Storage**.
* **⏰ Relógio em Tempo Real**: mostra o horário local no cabeçalho.


## 🗂 Estrutura do Projeto

```
CriptoNews-Portal/
├── index.html         # Página principal com widgets e notícias
├── view.html          # Detalhe da notícia selecionada
├── add.html           # Formulário de cadastro de nova notícia
├── contato.html       # Página de contato (template)
├── css/
│   └── style.css      # Estilos personalizados efetivos
├── js/
│   └── app.js         # Lógica de consumo de APIs e interações
├── assets/            # Imagens, logos e recursos estáticos
└── README.md          # Documentação e guia de uso
```


## ⚙️ Pré-requisitos

* Navegador moderno com suporte a ES6 (Fetch API, Promises)
* Conexão com internet para APIs externas
* (Opcional) Servidor local para testes (Live Server, http-server ou similar)

---

## 💻 Como Executar Localmente

1. **Clone o repositório**

   ```bash
   git clone https://github.com/pHzeraGitHub/CriptoNews.git
   cd CriptoNews
   ```
2. **Abra** `index.html` diretamente no navegador **ou** execute um servidor local:

   ```bash
   npx http-server .
   ```
3. **Acesse** `http://localhost:8080` (ou porta informada) e veja o portal em ação.

---

## 🔧 Configuração de APIs

* **CoinGecko**: público, sem chave
* **exchangerate.host**: público, sem chave
* **CryptoCompare News**: público, sem chave
* **Hacker News (Algolia)**: público, sem chave

> **Opcional:** para GNews.io, insira sua `API_KEY` em `js/app.js` e habilite no seed de notícias do mundo.

---

## 🚀 Publicação no GitHub

1. **Adicione o repositório remoto**:

   ```bash
   git remote add origin https://github.com/usuario/repositório.git
   ```
2. **Envie** sua branch principal:

   ```bash
   git push -u origin main
   ```

> Após isso, futuras alterações podem ser enviadas apenas com `git push`.

---

## 📝 Licença
