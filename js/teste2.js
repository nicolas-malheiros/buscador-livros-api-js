const livroPesquisado = document.getElementById('buscador');
const formBuscador = document.querySelector('.buscar-filme');
const botaoSemHistorico = document.querySelector('#btn-nao');
const botaoComHistorico = document.querySelector('#btn-sim');


let buscadorUsado = false;

// Função para buscar o livro na API da Open Library
formBuscador.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const pesquisado = livroPesquisado.value.trim();

    if (pesquisado !== "") {
        // Faz a requisição para a API
        fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(pesquisado)}&limit=1`)
            .then(response => response.json())
            .then(data => {
                if (data.docs.length > 0) {
                    const livro = data.docs[0];

                    console.log(livro);

                    document.getElementById('titulo-livro').textContent = livro.title || 'Título não encontrado';
                    document.getElementById('autor-livro').textContent = livro.author_name ? livro.author_name.join(', ') : 'Autor não encontrado';
                    document.getElementById('genero-livro').textContent = livro.subject ? livro.subject.join(', ') : 'Gênero não encontrado';
                    document.getElementById('editora-livro').textContent = livro.publisher ? livro.publisher.join(', ') : 'Editora não encontrada';
                    document.getElementById('ano-livro').textContent = livro.first_publish_year || 'Ano de publicação não encontrado';

                    const capaUrl = livro.cover_i ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg` : 'img/capa-livro-nao-encontrado.png';
                    document.getElementById('capa-livro').src = capaUrl;
                    buscadorUsado = true;
                } else {
                    alert('Nenhum livro encontrado.');
                }
            })
            .catch(error => {
                // console.error("Erro ao buscar o livro:", error);
            });
    } else {
        alert('Por favor, digite o nome de um livro.');
    }
});

botaoSemHistorico.onclick = () =>{
    location.reload();
}

botaoComHistorico.onclick = () => {
    
    if (buscadorUsado == true){
    alert('Livro Guardado');
    buscadorUsado = false;
    }
}


