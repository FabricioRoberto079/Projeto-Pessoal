document.addEventListener('DOMContentLoaded', function () {
    const dadosResumoDiv = document.getElementById('dadosResumo');
    const finalizarBtn = document.getElementById('finalizarViagem');

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

                        if (chave === 'imagemViagem' && valor.startsWith('data:image')) {
                            // Adiciona a imagem como <img> se for um valor base64
                            const img = document.createElement('img');
                            img.src = valor;
                            img.alt = 'Imagem da Viagem';
                            img.style.width = '100px'; // Define a largura da imagem
                            img.style.height = 'auto';
                            item.appendChild(img);
                        } else {
                            // Adiciona outros dados normalmente
                            item.textContent = `${chave}: ${valor}`;
                        }
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
            <li><strong>Total Recebimento:</strong> R$ ${resumoViagem.totalRecebimento.toFixed(2)} <span>(Valor total recebido pelo frete)</span></li>
            <li><strong>Total Abastecimento:</strong> R$ ${resumoViagem.totalAbastecimento.toFixed(2)} <span>(Custos com combustível)</span></li>
            <li><strong>Despesas Gerais:</strong> R$ ${resumoViagem.totalDespesas.toFixed(2)} <span>(Outras despesas: pedágios, gorjetas, etc.)</span></li>
            <li><strong>Total Dinheiro:</strong> R$ ${resumoViagem.totalDinheiro.toFixed(2)} <span>(Despesas e abastecimentos pagos em dinheiro,cheque e pix)</span></li>
            <li><strong>Total Cartão:</strong> R$ ${resumoViagem.totalCartao.toFixed(2)} <span>(Despesas e abastecimentos pagos no cartão)</span></li>
            <li><strong>Total Despesas:</strong> R$ ${resumoViagem.despesaGeral.toFixed(2)} <span>(Abastecimento + Despesas Gerais)</span></li>
            <li><strong>Total Dias de Viagem:</strong> ${resumoViagem.totalDiasPassados} <span>(Dias totais passados em viagens)</span></li>
            <li><strong>Total Diárias Recebidas:</strong> R$ ${resumoViagem.totalDiarias.toFixed(2)} <span>(Valor a ser recebido para cobrir custos do motorista)</span></li>
            <li><strong>Valor Final da Viagem:</strong> R$ ${resumoViagem.valorFinal.toFixed(2)} <span>(Recebimento - Total Despesas incluso as diárias)</span></li>
            `;
            dadosResumoDiv.appendChild(resumoLista);

        }
    }

    // Verifica e adiciona evento ao botão de finalizar
    if (finalizarBtn) {
        finalizarBtn.addEventListener('click', function () {
            gerarPDF()
            localStorage.clear();  // Limpa todos os dados da viagem
            alert("Viagem finalizada com sucesso!");
            window.location.href = 'Contribuição.html';  // Retorna à página inicial
        });
    }

    carregarDados(); // Carrega os dados ao carregar a página
});

//Gerando pdf
async function gerarPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("Erro ao carregar a biblioteca jsPDF. Verifique a conexão de rede e tente novamente.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 30; // Posição vertical inicial

    // Função para adicionar cabeçalho e rodapé
    function adicionarCabecalhoRodape() {
        doc.setFontSize(10);
        doc.setTextColor(58, 123, 213);
        doc.addImage('imagens/DriverLog.png', 'PNG', 10, 5, 20, 20);
        doc.setFont("helvetica", "bold");
        doc.text("Resumo da Viagem - Driver Log", pageWidth / 2, 15, { align: "center" });
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(10, 25, pageWidth - 10, 25);

        // Rodapé
        doc.setLineWidth(0.5);
        doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("© 2024 Driver Log - Desenvolvedor: Fabrício Roberto", pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    adicionarCabecalhoRodape(); // Cabeçalho inicial na primeira página

    // Função para adicionar uma seção com título, conteúdo e imagem (caso haja)
    function adicionarSecao(titulo, conteudo, imagem = null) {
        const alturaImagem = imagem ? 50 : 0;
        const alturaConteudo = conteudo.length * 8 + alturaImagem + 10;

        // Quebra de página suave
        if (y + alturaConteudo > pageHeight - 20) {
            doc.addPage();
            y = 30;
            adicionarCabecalhoRodape();
        }

        // Título da seção
        doc.setFontSize(14);
        doc.setTextColor(43, 79, 124);
        doc.text(titulo, 10, y);
        y += 10;

        // Linha separadora
        doc.setDrawColor(58, 123, 213);
        doc.setLineWidth(0.3);
        doc.line(10, y, pageWidth - 10, y);
        y += 5;

        // Conteúdo da seção
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        conteudo.forEach(texto => {
            if (y > pageHeight - 20) {
                doc.addPage();
                y = 30;
                adicionarCabecalhoRodape();
                doc.setFontSize(12);
            }
            doc.text(texto, 15, y);
            y += 8;
        });

        // Adiciona a imagem imediatamente após o conteúdo
        if (imagem) {
            y += 5;
            doc.addImage(imagem, 'JPEG', 15, y, 50, 50);
            y += 60; // Espaçamento após a imagem
        } else {
            y += 10;
        }
    }

    // Captura e processa os elementos HTML
    const dadosResumoDiv = document.getElementById('dadosResumo');
    const elementos = dadosResumoDiv.querySelectorAll('h2, h3, li, img');

    let conteudoPasso = [];
    let passoTitulo = "";

    // Agora as imagens são adicionadas diretamente após cada conteúdo
    elementos.forEach(el => {
        if (el.tagName === 'H2') {
            if (conteudoPasso.length > 0) {
                adicionarSecao(passoTitulo, conteudoPasso);
                conteudoPasso = [];
            }
            passoTitulo = el.textContent;
        } else if (el.tagName === 'H3') {
            conteudoPasso.push("• " + el.textContent);
        } else if (el.tagName === 'LI') {
            conteudoPasso.push("    - " + el.textContent);
        } else if (el.tagName === 'IMG') {
            // Se encontrar uma imagem, adiciona-a imediatamente após o conteúdo atual
            adicionarSecao(passoTitulo, conteudoPasso, el.src);
            conteudoPasso = []; // Reseta para o próximo passo
            passoTitulo = ""; // Reseta o título para evitar duplicação
        }
    });

    // Adiciona qualquer conteúdo restante
    if (conteudoPasso.length > 0) {
        adicionarSecao(passoTitulo, conteudoPasso);
    }

    // Salva o PDF final
    doc.save("Resumo_da_Viagem.pdf");
}
