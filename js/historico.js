const botaoLimparHistorico = document.querySelector('.limpar-historico');
const confirmationModal = document.getElementById("confirmationModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

document.addEventListener("DOMContentLoaded", function () {
    let livrosHistorico = JSON.parse(localStorage.getItem('livrosHistorico')) || [];

    const historicoContainer = document.querySelector('.historico-livros');
    let nadaEncontrado = '<p class="nenhum-livro">Nenhum livro no histórico.</p>';

    if (livrosHistorico.length === 0) {
        historicoContainer.innerHTML = nadaEncontrado;
    } else {
        livrosHistorico.forEach((livro, index) => {
            const livroElement = document.createElement('div');
            livroElement.classList.add('livro');

            const capaUrl = livro.cover_i 
                ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-L.jpg`
                : 'img/capa-livro-nao-encontrado.png'; 

            livroElement.innerHTML = `  
                <div class="lista-livros">
                    <a href="https://openlibrary.org${livro.key}" target="_blank" class="livro-link">
                        <h3>${livro.title}</h3>
                        <img src="${capaUrl}" alt="Capa do livro" class="livro-capa" />
                    </a>
                    <button class="remover-livro" data-index="${index}">Remover</button>
                </div>
            `;

            historicoContainer.appendChild(livroElement);
        });

        const botoesRemover = document.querySelectorAll('.remover-livro');
        botoesRemover.forEach(botao => {
            botao.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                mostrarModalConfirmacao(
                    () => {
                        livrosHistorico.splice(index, 1);
                        localStorage.setItem('livrosHistorico', JSON.stringify(livrosHistorico));

                        this.parentElement.remove();

                        if (livrosHistorico.length === 0) {
                            historicoContainer.innerHTML = nadaEncontrado;
                        }

                        fecharModal(); // Fecha o modal
                    },
                    () => {
                        fecharModal(); // Fecha o modal
                    }
                );
            });
        });
    }
});


function mostrarModalConfirmacao(acaoConfirmar, acaoCancelar) {
    confirmationModal.style.visibility = "visible"; // Torna o modal visível
    confirmationModal.style.opacity = "1"; // Torna o modal opaco

    confirmYes.onclick = function() {
        acaoConfirmar();  
    };

    confirmNo.onclick = function() {
        acaoCancelar(); 
    };
}


function fecharModal() {
    confirmationModal.style.visibility = "hidden"; 
    confirmationModal.style.opacity = "0"; 
}

botaoLimparHistorico.onclick = () => {
    mostrarModalConfirmacao(
        function() {
            localStorage.removeItem('livrosHistorico');
            const historicoContainer = document.querySelector('.historico-livros');
            historicoContainer.innerHTML = '<p class="nenhum-livro">Nenhum livro no histórico.</p>';
            fecharModal(); // Fecha o modal
        },
        function() {
            fecharModal(); // Fecha o modal
        }
    );
};
