document.addEventListener('DOMContentLoaded', function() {
    const dadosResumoDiv = document.getElementById('dadosResumo');
    const finalizarBtn = document.getElementById('finalizarViagem');

    // Função para carregar e exibir dados
    function carregarDados() {
        dadosResumoDiv.innerHTML = ''; // Limpa qualquer dado anterior na div

        // Carregar e exibir dados de cada passo
        for (let passo = 1; passo <= 5; passo++) {
            const dadosPasso = JSON.parse(localStorage.getItem(`dadosPasso${passo}`)) || [];

            console.log(`Dados do passo ${passo}:`, dadosPasso); // Debug para verificar dados

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

        // Carregar e exibir o resumo da viagem
        const resumoViagem = JSON.parse(localStorage.getItem('resumoViagem')) || {};
        if (Object.keys(resumoViagem).length > 0) {
            const resumoTitulo = document.createElement('h2');
            resumoTitulo.textContent = 'Resumo da Viagem';
            dadosResumoDiv.appendChild(resumoTitulo);

            const resumoLista = document.createElement('ul');
            resumoLista.innerHTML = `
                <li><strong>Total Recebimento:</strong> R$ ${resumoViagem.totalRecebimento}</li>
                <li><strong>Total Abastecimento:</strong> R$ ${resumoViagem.totalAbastecimento}</li>
                <li><strong>Total Despesas Gerais:</strong> R$ ${resumoViagem.totalDespesas}</li>
                <li><strong>Total Diárias Recebidas:</strong> R$ ${resumoViagem.totalDiarias}</li>
                <li><strong>Valor Final a Receber:</strong> R$ ${resumoViagem.valorFinal}</li>
            `;
            dadosResumoDiv.appendChild(resumoLista);
        }
    }

    // Verifica e adiciona evento ao botão de finalizar
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', function() {
            localStorage.clear();  // Limpa todos os dados da viagem
            alert("Viagem finalizada com sucesso!");
            window.location.href = 'index.html';  // Retorna à página inicial
        });
    }

    carregarDados(); // Carrega os dados ao carregar a página
});
