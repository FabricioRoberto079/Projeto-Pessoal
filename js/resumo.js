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

    // Adiciona Cabeçalho e Rodapé com logo e design aprimorado
    function adicionarCabecalhoRodape() {
        // Cabeçalho estilizado com logo e título centralizado
        doc.setFontSize(10);
        doc.setTextColor(58, 123, 213);
        doc.addImage('imagens/DriverLog.png', 'PNG', 10, 5, 20, 20);
        doc.setFont("helvetica", "bold");
        doc.text("Resumo da Viagem - Driver Log", pageWidth / 2, 15, { align: "center" });
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(10, 25, pageWidth - 10, 25);

        // Rodapé estilizado
        doc.setLineWidth(0.5);
        doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("© 2024 Driver Log - Desenvolvedor: Fabrício Roberto", pageWidth / 2, pageHeight - 10, { align: "center" });
    }

    adicionarCabecalhoRodape();

    // Função para desenhar caixas estilizadas com sombra e fundo gradiente
    let y = 30;
    function desenhaCaixa(titulo, conteudo) {
        const alturaCaixa = conteudo.length * 8 + 12;
        if (y + alturaCaixa + 20 > pageHeight - 20) { // Nova página se necessário
            doc.addPage();
            y = 30;
            adicionarCabecalhoRodape();
        }

        // Título da seção com estilo aprimorado
        doc.setFontSize(14);
        doc.setTextColor(43, 79, 124);
        doc.text(titulo, 10, y);
        y += 10;

        doc.setDrawColor(58, 123, 213);
        doc.setFillColor(245, 245, 245);
        doc.setLineWidth(0.3);
        doc.roundedRect(10, y, pageWidth - 20, alturaCaixa, 3, 3, 'FD');

        // Conteúdo da seção
        y += 10;
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        conteudo.forEach(texto => {
            if (y > pageHeight - 20) { // Nova página se necessário
                doc.addPage();
                y = 30;
                adicionarCabecalhoRodape();
            }
            doc.text(texto, 15, y);
            y += 8;
        });
        y += 12;
    }

    // Prepara os dados para cada passo
    const dadosResumoDiv = document.getElementById('dadosResumo');
    const elementos = dadosResumoDiv.querySelectorAll('h2, h3, li');

    let conteudoPasso = [];
    let passoTitulo = "";

    // Processa os elementos para inserção no PDF
    elementos.forEach(el => {
        if (el.tagName === 'H2') {
            if (conteudoPasso.length > 0) {
                desenhaCaixa(passoTitulo, conteudoPasso);
                conteudoPasso = [];
            }
            passoTitulo = el.textContent;
        } else if (el.tagName === 'H3') {
            conteudoPasso.push("• " + el.textContent);
        } else if (el.tagName === 'LI') {
            conteudoPasso.push("    - " + el.textContent);
        }
    });

    if (conteudoPasso.length > 0) {
        desenhaCaixa(passoTitulo, conteudoPasso);
    }

    // Salva o PDF final
    doc.save("Resumo_da_Viagem.pdf");
}

