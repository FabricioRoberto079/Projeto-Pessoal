document.addEventListener('DOMContentLoaded', function () {
    const dadosResumoDiv = document.getElementById('dadosResumo');


    // Função para carregar e exibir dados
    function carregarDados() {
        dadosResumoDiv.innerHTML = '';

        for (let passo = 1; passo <= 5; passo++) {
            const dadosPasso = JSON.parse(localStorage.getItem(`dadosPasso${passo}`)) || [];

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
                            const img = document.createElement('img');
                            img.src = valor;
                            img.alt = 'Imagem da Viagem';
                            img.style.width = '100px';
                            img.style.height = 'auto';
                            item.appendChild(img);
                        } else {
                            item.textContent = `${chave}: ${valor}`;
                        }
                        lista.appendChild(item);
                    }

                    const editarBotao = document.createElement('button');
                    editarBotao.textContent = 'Editar';
                    editarBotao.addEventListener('click', () => editarEntrada(passo, index, dados));
                    conteudo.appendChild(lista);
                    conteudo.appendChild(editarBotao);
                    dadosResumoDiv.appendChild(conteudo);
                });
            }
        }
    }

    // Função para editar uma entrada
    function editarEntrada(passo, index, dados) {
        const form = document.createElement('form');
        form.className = 'form-editar';

        for (const [chave, valor] of Object.entries(dados)) {
            const div = document.createElement('div');
            div.className = 'inputViagem';

            const input = document.createElement('input');
            input.name = chave;
            input.placeholder = chave.replace(/-/g, ' '); // Formata o nome como placeholder
            input.value = valor;

            // Configura o ID e a classe com base nos dados do HTML fornecido
            switch (chave) {
                case 'Nome-Completo':
                case 'Nome-do-Frete':
                case 'Nome-da-Despesa':
                case 'Nome-do-Recimento':
                case 'Nome-do-Posto':
                    input.className = 'nomeInput';
                    break;

                case 'Placa-Do-Veiculo':
                    input.className = 'placaInput';
                    break;

                case 'Valor-da-Diária':
                case 'Valor-do-Recebimento':
                case 'Valor-da-Despesa':
                case 'Valor-do-Abastecimento':
                    input.className = 'valorInput';
                    break;

                case 'Data-do-Recebimento':
                case 'Data-Inicio-do-Frete':
                case 'Data-Final-do-Frete':
                case 'Data-da-Despesa':
                case 'Data-do-Abastecimento':
                    input.className = 'dataInput';
                    input.maxLength = 10;
                    break;

                case 'Km-Inicial-do-Abastecimento':
                case 'Km-Final-do-Abastecimento':
                case 'Litros-do-Abastecimento':
                    input.className = 'litrosKmInput';
                    break;

                case 'imagemViagem':
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.addEventListener('change', (event) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            dados[chave] = reader.result;
                        };
                        reader.readAsDataURL(event.target.files[0]);
                    });
                    div.innerHTML = '';
                    break;

                default:
                    input.className = 'nomeInput';
            }

            div.appendChild(input);
            form.appendChild(div);
        }

        const salvarBotao = document.createElement('button');
        salvarBotao.textContent = 'Salvar';
        salvarBotao.type = 'button';
        salvarBotao.addEventListener('click', () => salvarEdicao(passo, index, dados));
        form.appendChild(salvarBotao);

        const cancelarBotao = document.createElement('button');
        cancelarBotao.textContent = 'Cancelar';
        cancelarBotao.type = 'button';
        cancelarBotao.addEventListener('click', () => carregarDados());
        form.appendChild(cancelarBotao);

        dadosResumoDiv.innerHTML = '';
        dadosResumoDiv.appendChild(form);

        // Adiciona validação dinâmica aos inputs do formulário de edição
        form.querySelectorAll('.litrosKmInput').forEach(input => {
            input.addEventListener('input', (event) => {
                event.target.value = event.target.value.replace(/[^0-9,]/g, ''); 
            });
            input.addEventListener('blur', (event) => {
                event.target.value = event.target.value.replace(',', '.'); 
            });
        });

        form.querySelectorAll('.nomeInput').forEach(input => {
            input.addEventListener('input', (event) => {
                event.target.value = event.target.value.replace(/\b\w/g, (c) => c.toUpperCase());
            });
        });

        form.querySelectorAll('.placaInput').forEach(input => {
            input.addEventListener('input', (event) => {
                let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                if (value.length > 3) {
                    value = value.replace(/(\w{3})(\w{1,4})/, "$1-$2");
                }
                event.target.value = value;
            });
        });

        form.querySelectorAll('.valorInput').forEach(input => {
            input.addEventListener('input', (event) => {
                let value = event.target.value.replace(/\D/g, "");
                value = (parseFloat(value) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                event.target.value = value;
            });
        });

        form.querySelectorAll('.dataInput').forEach(input => {
            input.addEventListener('input', (event) => {
                let value = event.target.value.replace(/\D/g, "");
                if (value.length > 2 && value.length <= 4) {
                    value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
                } else if (value.length > 4) {
                    value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
                }
                event.target.value = value;
            });
        });
    }


    // Função para salvar a edição
    function salvarEdicao(passo, index, dados) {
        const form = document.querySelector('.form-editar');
        const inputs = form.querySelectorAll('input'); // Captura todos os inputs do formulário
    
        // Atualiza o objeto 'dados' com os novos valores do formulário
        inputs.forEach(input => {
            if (input.type === "file") {
                return;
            }
            dados[input.name] = input.value; 
        });
    
        const dadosPasso = JSON.parse(localStorage.getItem(`dadosPasso${passo}`)) || [];
        dadosPasso[index] = dados; 
        localStorage.setItem(`dadosPasso${passo}`, JSON.stringify(dadosPasso)); 
    
        // Mensagem de confirmação sem bloquear o fluxo
        const mensagem = document.createElement('div');
        mensagem.textContent = "Dados salvos com sucesso!";
        mensagem.style.position = "fixed";
        mensagem.style.bottom = "20px";
        mensagem.style.right = "20px";
        mensagem.style.backgroundColor = "#4CAF50";
        mensagem.style.color = "white";
        mensagem.style.padding = "10px";
        mensagem.style.borderRadius = "5px";
        document.body.appendChild(mensagem);
    
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            document.body.removeChild(mensagem);
        }, 3000);
    
        carregarDados(); 
    }
    

    carregarDados();
});
