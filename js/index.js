const livroPesquisado = document.getElementById('buscador');
const formBuscador = document.querySelector('.buscar-filme');
const botaoSemHistorico = document.querySelector('#btn-nao');
const botaoComHistorico = document.querySelector('#btn-sim');
const mensagemUsuario = document.getElementById('mensagem');
let buscadorUsado = false;
let livroSalvo = null; // localstorage

// Função para exibir e ocultar o indicador de carregamento
function mostrarCarregando() {
    document.getElementById('loading-indicator').style.display = 'block';
    document.body.style.filter = 'blur(5px)'; // Aplica o desfoque no corpo da página
    document.querySelector('.container').classList.add('blur'); // Aplica o desfoque no conteúdo da página
}

function esconderCarregando() {
    const loadingIndicator = document.getElementById('loading-indicator');
    loadingIndicator.classList.add('fade-out'); // Aplica animação para desaparecer

    // Remove o desfoque após 0.5 segundos
    setTimeout(() => {
        loadingIndicator.style.display = 'none';
        loadingIndicator.classList.remove('fade-out');
        document.body.style.filter = 'none'; // Remove o desfoque do corpo
        document.querySelector('.container').classList.remove('blur');
    }, 500); // Duração da animação de fade-out
}

// Função para buscar o livro na API da Open Library
if (window.location.pathname === '/index.html') {
    // Esse código só será executado se estiver na página index.html
    if (formBuscador) {
        formBuscador.addEventListener('submit', (evento) => {
            evento.preventDefault();

            const pesquisado = livroPesquisado.value.trim();

            if (pesquisado !== "") {
                // Mostrar o indicador de carregamento enquanto espera a resposta da API
                mostrarCarregando();

                // Faz a requisição para a API principal de busca
                fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(pesquisado)}&limit=1`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.docs.length > 0) {
                            const livro = data.docs[0]; // Pegando o primeiro livro encontrado
                            const workKey = livro.key; // Obtendo o workKey para buscar as edições

                            document.getElementById('titulo-livro').textContent = livro.title || 'Título não encontrado';
                            document.getElementById('autor-livro').textContent = livro.author_name ? livro.author_name.join(', ') : 'Autor não encontrado';
                            document.getElementById('ano-livro').textContent = livro.first_publish_year || 'Ano de publicação não encontrado';

                            livroSalvo = livro;

                            buscarEdições(livro.key);
                        } else {
                            mostrarMensagem(2);
                            // Nenhum livro encontrado. 
                        }
                    })
                    .catch(error => {
                        console.error("Erro ao buscar o livro:", error);
                        mensagemUsuario(5);
                    })
                    .finally(() => {
                        esconderCarregando();
                    });
            } else {
                // alert('Por favor, digite o nome de um livro.');
            }
        });
    }
}

// Função para buscar as edições detalhadas do livro
function buscarEdições(workKey) {
    fetch(`https://openlibrary.org${workKey}/editions.json`)
        .then(response => response.json())
        .then(data => {
            if (data.entries.length > 0) {
                const livroDetalhado = data.entries[0]; // Pegando a primeira edição

                console.log(livroDetalhado);

                // Atualiza as informações detalhadas da edição
                document.getElementById('editora-livro').textContent = livroDetalhado.publishers ? livroDetalhado.publishers.join(', ') : 'Editora não encontrada';
                document.getElementById('resumo-livro').textContent = livroDetalhado.description ? livroDetalhado.description.value : 'Resumo não encontrado';

                // Atualiza a capa do livro
                const capaUrl = livroDetalhado.covers ? `https://covers.openlibrary.org/b/id/${livroDetalhado.covers[0]}-L.jpg` : 'img/capa-livro-nao-encontrado.png';
                document.getElementById('capa-livro').src = capaUrl;

                // Marca que a busca foi realizada
                buscadorUsado = true;
            } else {
                //alert('Nenhuma edição encontrada.');
            }
        })
        .catch(error => {
            console.error("Erro ao buscar a edição do livro:", error);
            //alert('Erro ao buscar detalhes da edição.');
        });
}

if (window.location.pathname === '/index.html') {
    // Manipulador do botão "Sem Histórico" (Recarrega a página)
    botaoSemHistorico.onclick = () => {
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

if (window.location.pathname === '/index.html') {
    // Manipulador do botão "Com Histórico" (Salva as informações no localStorage)
    botaoComHistorico.onclick = () => {
        if (buscadorUsado && livroSalvo) {
            // Recupera o histórico de livros salvo no localStorage
            let livrosHistorico = JSON.parse(localStorage.getItem('livrosHistorico')) || [];

            // Verifica se o livro já está no histórico
            const livroExistente = livrosHistorico.some(livro => livro.key === livroSalvo.key); // Compara pelo 'key' do livro, que é único

            if (!livroExistente) {
                // Se o livro não estiver no histórico, adiciona o livro ao histórico
                livrosHistorico.push(livroSalvo);

                // Atualiza o localStorage com o novo histórico
                localStorage.setItem('livrosHistorico', JSON.stringify(livrosHistorico));

                mostrarMensagem(1);
                //Livro Guardado no Histórico!


                buscadorUsado = false;
            } else {
                mostrarMensagem(3);
                //Este livro já foi adicionado ao histórico 
            }
        } else {
            mostrarMensagem(4);
            //Nenhum livro foi encontrado para salvar
        }
    }
}

function mostrarMensagem(numero) {
    let mensagem = ``;
    switch (numero) {
        case 1:
            mensagem =
                `<h3 style="color: rgb(5, 97, 5); background-color: rgb(140, 235, 140); border-radius: 10px; padding: 10px;">
                        Sucesso ao Guardar Livro ao Histórico!
                    </h3>`
            break;
        case 2:
            mensagem =
                `<h3 style="color: rgb(168, 5, 5); background-color: rgb(255, 0, 0); border-radius: 10px; padding: 10px;">
                        Nenhum Livro Encontrado!
                    </h3>`
            break;
        case 3:
            mensagem =
                `<h3 style="color: rgb(194, 191, 44); background-color: rgb(54, 53, 48); border-radius: 10px; padding: 10px;">
                        Este livro já foi adicionado ao histórico!
                    </h3>`
            break;
        case 4:
            mensagem =
                `<h3 style="color: rgb(226, 226, 218); background-color: rgb(49, 49, 47); border-radius: 10px; padding: 10px;">
                        Nenhum livro foi Encontrado para Salvar!
                    </h3>`
            break;
        case 5:
            mensagem =
                `<h3 style="color: rgb(223, 49, 49); background-color: rgb(252, 249, 249); border-radius: 10px; padding: 10px;">
                        Erro ao Buscar o Livro!
                    </h3>`
            break;
    }

    mensagemUsuario.innerHTML = mensagem;
    setTimeout(() => {
        mensagemUsuario.classList.add('mostrar');
    }, 1);

    mensagemUsuario.classList.remove('mostrar');
    setTimeout(() => {
        location.reload();
    }, 1000);
    return
}

// PARTE DE RESPONSIVIDADE 

const botaoSidebarMobile = document.querySelector('.imagem-botao');

const sidebarItensMobile = document.querySelector('.sidebar-mobile-itens');
let clicks = 0;

// Verifica a URL da página
const currentPage = window.location.pathname;

// Função para marcar o item ativo
function marcarItemAtivo() {
    const buscarItem = document.getElementById('buscar-item');
    const historicoItem = document.getElementById('historico-item');

    // Verifica se estamos na página 'index.html' ou 'historico.html'
    if (currentPage.includes('index.html') && buscarItem) {
        buscarItem.classList.add('active');
    } else if (currentPage.includes('historico.html') && historicoItem) {
        historicoItem.classList.add('active');
    }
}

// Manipulador do clique na sidebar (botão de abrir)
botaoSidebarMobile.addEventListener('click', function () {
    clicks++;

    if (clicks == 1) {
        sidebarItensMobile.innerHTML = `
        <div class="sidebar-mobile-itens" id="sidebar-mobile-itens">
            <a href="index.html" class="sidebar-item" id="buscar-item">
                <span>Buscar</span>
            </a>
            <a href="historico.html" class="sidebar-item" id="historico-item">
                <span>Histórico</span>
            </a>
        </div>
        `;
        
        // Agora que os itens foram inseridos no DOM, podemos marcar o item ativo
        marcarItemAtivo();
    } else if (clicks == 2) {
        sidebarItensMobile.innerHTML = ``;
        clicks = 0;
    }
});

