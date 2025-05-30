// Helpers de LocalStorage
function getLocalNews() {
  return JSON.parse(localStorage.getItem('noticias')) || [];
}
function saveLocalNews(list) {
  localStorage.setItem('noticias', JSON.stringify(list));
}
function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

if (location.pathname.includes('index')) {
  // 1) Recria lista vazia ou recupera do LocalStorage
  let lista = getLocalNews();

  // 2) Se estiver vazia, semeia uma notícia de exemplo
  if (lista.length === 0) {
    const demo = {
      cod:   uuid(),
      title: '📢 Notícia de Exemplo',
      body:  'Este é um exemplo que reaparece sempre que você limpa o storage.',
      tags:  ['demonstração','teste'],
      createdAt: Date.now()
    };
    lista.push(demo);
    saveLocalNews(lista);
  }

  // 3) Agora renderiza normalmente
  renderHome();
  // … seus outros handlers de busca/filtro …
}

// Render Home
function renderHome(filter = '') {
  const grid = $('#newsGrid');
  const list = getLocalNews().filter(n =>
    !filter ||
    n.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())) ||
    n.title.toLowerCase().includes(filter.toLowerCase())
  );
  grid.html(list.map(n => `
    <div class="col"><div class="card h-100 shadow-sm">
      <div class="card-body d-flex flex-column">
        <p class="text-muted small mb-1">📅 ${ new Date(n.createdAt).toLocaleDateString('pt-BR') }</p>
        <h5 class="card-title">🖊️ ${ n.title.substring(0,50) }…</h5>
        <p class="card-text small flex-grow-1">${ n.body.substring(0,150) }…</p>
        <a href="view.html?cod=${ n.cod }" class="btn btn-primary mt-2">Ver mais →</a>
      </div>
    </div></div>
  `).join(''));

  // Categorias
  const cats = [...new Set(getLocalNews().flatMap(n => n.tags))];
  $('#categoryList').html(cats.map(c =>
    `<li><a href="#" class="category-item">📂 ${c}</a></li>`
  ).join(''));
}

// Formulário de Cadastro
function handleForm() {
  $('#formAdd').submit(e => {
    e.preventDefault();
    const title = $('#title').val().trim();
    const body  = $('#body').val().trim();
    const tags  = $('#tags').val().split(',').map(t=>t.trim()).filter(Boolean);
    if (!title || !body || !tags.length) return alert('Preencha todos os campos!');
    const nova = { cod: uuid(), title, body, tags, createdAt: Date.now() };
    const lista = getLocalNews(); lista.unshift(nova); saveLocalNews(lista);
    $('#successMessage').removeClass('d-none');
    setTimeout(() => location.href = 'index.html', 1000);
  });
}

// Detalhe da Notícia
function renderDetail() {
  const cod = new URLSearchParams(window.location.search).get('cod');
  const n = getLocalNews().find(x => x.cod === cod);
  if (!n) return;
  $('#newsTitle').text(n.title);
  $('#newsDetail').html(`
    <p class="text-muted">🗓️ ${ new Date(n.createdAt).toLocaleDateString('pt-BR') }</p>
    <p>${ n.body }</p>
    <p><strong>Tags:</strong> ${ n.tags.join(', ') }</p>
  `);
}

// Cotação de Cripto (CoinGecko)
async function renderCryptoPrices() {
  const coins = await fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=5'
  ).then(r => r.json());
  $('#cryptoPrices').html(coins.map(c => `
    <div class="col"><div class="card text-center p-2 border border-${
      c.price_change_percentage_24h >= 0 ? 'success' : 'danger'
    }">
      <img src="${c.image}" width="30" height="40" style="object-fit:contain">
      <h6>💰 ${c.symbol.toUpperCase()}</h6>
      <p>$${ c.current_price.toLocaleString() }</p>
    </div></div>
  `).join(''));
}

/**
 * Notícias Externas de Criptomoedas 
 * (via CryptoCompare Public News API, sem chave necessária)
 */
async function renderExternalNews() {
  const container = $('#externalNews');
  if (!container.length) return;

  // 1) Spinner de carregamento
  container.html(`
    <div class="col text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando…</span>
      </div>
    </div>
  `);

  try {
    // 2) Fetch das notícias de cripto (retorna JSON com Data[])
    const json = await fetch(
      'https://min-api.cryptocompare.com/data/v2/news/?lang=EN'
    ).then(r => r.json());

    // 3) Usa só os 4 primeiros artigos
    const articles = (json.Data || []).slice(0, 4);
    if (!articles.length) throw new Error('Sem dados');

    // 4) Renderiza
    container.html(articles.map(a => `
      <div class="col">
        <div class="card shadow-sm h-100">
          ${a.imageurl
            ? `<img src="${a.imageurl}" class="card-img-top" alt="Ícone da notícia">`
            : ''
          }
          <div class="card-body d-flex flex-column">
            <h6 class="card-title mb-2">
              📰 
              <a href="${a.url}" target="_blank" class="stretched-link text-decoration-none">
                ${a.title}
              </a>
            </h6>
            <p class="text-muted small mb-2">
              ${new Date(a.published_on * 1000).toLocaleDateString('pt-BR')}
            </p>
            <p class="card-text small flex-grow-1">
              ${a.body.substring(0, 100)}…
            </p>
          </div>
        </div>
      </div>
    `).join(''));

  } catch (err) {
    console.error('Erro ao carregar notícias externas de cripto:', err);
    container.html(`
      <div class="col">
        <div class="alert alert-warning text-center">
          🚨 Falha ao carregar notícias externas de cripto.
        </div>
      </div>
    `);
  }
}

// No seu $(function(){ … })
$(function(){
  renderExternalNews();                  // carrega ao entrar
  $('#refreshExternal').on('click', () => {
    renderExternalNews();                // carrega ao clicar em Atualizar
  });
});



/**
 * Notícias do Mundo (via Hacker News – front page)
 */
async function renderWorldNews() {
  const container = $('#worldNews');
  if (!container.length) return;

  // Spinner de carregamento
  container.html(`
    <div class="col text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando…</span>
      </div>
    </div>
  `);

  try {
    // Busca as 4 notícias da front page
    const res = await fetch(
      'https://hn.algolia.com/api/v1/search?' +
      'tags=front_page&hitsPerPage=4'
    );
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const { hits } = await res.json();

    // Se não houver hits
    if (!hits.length) {
      container.html(`
        <div class="col">
          <div class="alert alert-info text-center">
            🤷‍♂️ Nenhuma notícia do mundo encontrada.
          </div>
        </div>
      `);
      return;
    }

    // Renderiza os cards
    container.html(hits.map(h => `
      <div class="col">
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex flex-column">
            <h6 class="card-title mb-2">
              🌍 
              <a href="${h.url}" target="_blank" class="stretched-link text-decoration-none">
                ${h.title}
              </a>
            </h6>
            <p class="text-muted small mb-2">
              ${new Date(h.created_at).toLocaleDateString('pt-BR')}
            </p>
            <p class="card-text small flex-grow-1">
              ${(h.story_text||h.comment_text||'').substring(0,100).trim()}…
            </p>
          </div>
        </div>
      </div>
    `).join(''));

  } catch (err) {
    console.error('Erro ao carregar notícias do mundo:', err);
    container.html(`
      <div class="col">
        <div class="alert alert-warning text-center">
          🚨 Falha ao carregar notícias do mundo.
        </div>
      </div>
    `);
  }
}

// E no seu init, mantenha:
$(function(){
  renderWorldNews();                   // carrega ao entrar
  $('#refreshWorld').on('click', renderWorldNews);  // botão 🔄 Atualizar
  // ... resto do init ...
});


// Relógio
function initClock() {
  setInterval(() => {
    $('#clock').text('🕒 ' + new Date().toLocaleTimeString('pt-BR'));
  }, 1000);
}

// Inicialização
$(function(){
  renderCryptoPrices();
  renderExternalNews();
  renderWorldNews();
  initClock();

  $('#refreshExternal').on('click', renderExternalNews);
  $('#refreshWorld').  on('click', renderWorldNews);

  if (location.pathname.includes('index')) {
    handleForm();
    renderHome();
    $('#searchButton').on('click', e=>{ e.preventDefault(); renderHome($('#searchInput').val()); });
    $('#categoryList').on('click','.category-item', e=>{
      e.preventDefault();
      const tag = $(e.target).text().replace('📂 ','');
      $('#searchInput').val(tag);
      renderHome(tag);
    });
  }

  if (location.pathname.includes('view')) renderDetail();
});
