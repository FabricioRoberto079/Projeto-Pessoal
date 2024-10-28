document.addEventListener('DOMContentLoaded', function() {
    const dadosResumoDiv = document.getElementById('dadosResumo');

    // Função para carregar e exibir dados
    function carregarDados() {
        dadosResumoDiv.innerHTML = ''; 

        // Loop para carregar dados de cada passo
        for (let passo = 1; passo <= 5; passo++) {
            const dadosPasso = JSON.parse(localStorage.getItem(`dadosPasso${passo}`)) || [];

            // Exibir dados se existir algum no localStorage
            if (dadosPasso.length > 0) {
                const titulo = document.createElement('h2');
                titulo.textContent = `Passo ${passo}`;
                dadosResumoDiv.appendChild(titulo);

                dadosPasso.forEach((dados, index) => {
                    const conteudo = document.createElement('div');
                    conteudo.className = 'dados-passo';

                    const subtitulo = document.createElement('h3');
                    subtitulo.textContent = `Entrada ${index + 1}`;
                    conteudo.appendChild(subtitulo);

                    const lista = document.createElement('ul');
                    for (const [chave, valor] of Object.entries(dados)) {
                        const item = document.createElement('li');
                        item.textContent = `${chave}: ${valor}`;
                        lista.appendChild(item);
                    }

                    conteudo.appendChild(lista);
                    dadosResumoDiv.appendChild(conteudo);
                });
            }
        }
    }
    carregarDados(); 
});