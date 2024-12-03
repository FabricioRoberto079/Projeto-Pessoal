document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.linkPasso')
    const passos = document.querySelectorAll('.passo')
    const iniciarViagemBtn = document.getElementById('iniciarViagem')
    const controleBtn = document.getElementById('controleViagem')
    const navBar = document.getElementById('navBar')
    const dadosAdicionados = document.getElementById('dadosAdicionados')
    const adicionarBtn = document.getElementById('adicionar')
    const finalizarViagemBtn = document.getElementById('finalizarViagem')
    let passoAtual = "1"

    const viagemIniciada = localStorage.getItem('viagemIniciada')

    document.querySelectorAll('.litrosKmInput').forEach(input => {
        input.addEventListener('input', (event) => {
            event.target.value = event.target.value.replace(/[^0-9,]/g, ''); // Permite apenas números e vírgula
        });
        input.addEventListener('blur', (event) => {
            event.target.value = event.target.value.replace(',', '.'); // Substitui a vírgula por ponto ao sair do campo
        });
    });

    document.querySelectorAll('.nomeInput').forEach(input => {
        input.addEventListener('input', (event) => {
            event.target.value = event.target.value.replace(/\b\w/g, (c) => c.toUpperCase());
        });
    });

    // Validação para campo de placa (formato: ABC-1234)
    document.querySelectorAll('.placaInput').forEach(input => {
        input.addEventListener('input', (event) => {
            let value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
            if (value.length > 3) {
                value = value.replace(/(\w{3})(\w{1,4})/, "$1-$2");
            }
            event.target.value = value;
        });
    });

    // Validação para campos de valor em formato de moeda (R$ X,00)
    document.querySelectorAll('.valorInput').forEach(input => {
        input.addEventListener('input', (event) => {
            let value = event.target.value.replace(/\D/g, "");
            value = (parseFloat(value) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            event.target.value = value;
        });
    });

    document.querySelectorAll('.dataInput').forEach(input => {
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

    function exibirMensagem(texto, tipo = "sucesso") {
        const mensagem = document.createElement('div');
        mensagem.textContent = texto;
        mensagem.style.position = "fixed";
        mensagem.style.bottom = "20px";
        mensagem.style.right = "20px";
        mensagem.style.backgroundColor = tipo === "erro" ? "#f44336" : "#4CAF50"; // Vermelho para erros, verde para sucesso
        mensagem.style.color = "white";
        mensagem.style.padding = "10px";
        mensagem.style.borderRadius = "5px";
        mensagem.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        mensagem.style.zIndex = "1000";
        document.body.appendChild(mensagem);
    
        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            document.body.removeChild(mensagem);
        }, 3000);
    }
    

    function validarCampos(passoAtual) {
        const inputs = document.querySelectorAll(`[data-passo="${passoAtual}"] input`);

        let todosPreenchidos = true; // Variável para rastrear se todos os campos estão preenchidos

        inputs.forEach((input) => {
            const valor = input.value.trim();
            // Verifica se o campo está vazio
            if (!valor) {
                todosPreenchidos = false; // Marca como falso se algum campo estiver vazio
            }

            // Verifica se é uma data e se está completa no formato DD/MM/AAAA
            if (input.classList.contains('dataInput') && valor.length !== 10) {
                todosPreenchidos = false; // Marca como falso se a data não estiver no formato correto
            }
        });

        // Se não todos os campos estão preenchidos, mas existem dados salvos no localStorage, preencha os inputs
        if (!todosPreenchidos) {
            exibirMensagem("Por favor, preencha todos os campos obrigatórios.", "erro");
        }

        return todosPreenchidos; // Retorna se todos os campos estão preenchidos
    }


    function mostrarPasso(passo) {
        passos.forEach(function (divPasso) {
            divPasso.classList.remove("ativo")
            if (divPasso.dataset.passo === passo) {
                divPasso.classList.add("ativo")
            }
        })

        if (passo > "1") {
            controleBtn.style.display = 'block'
            navBar.style.display = 'block'
            dadosAdicionados.style.display = 'block'

        } else {
            controleBtn.style.display = 'none'
            navBar.style.display = 'none'
            dadosAdicionados.style.display = 'none'
        }
    }

    if (!viagemIniciada) {
        mostrarPasso("1");
    } else {
        mostrarPasso("2");
        passoAtual = "2"
    }



    links.forEach(function (link) {
        link.addEventListener('click', function (evento) {
            evento.preventDefault()
            const passo = this.dataset.passo
            mostrarPasso(passo)
            passoAtual = passo
        })
    })


    function salvarDados(passo) {

        if (!validarCampos(passo)) {
            return;
        }

        const dados = {}
        document.querySelectorAll(`[data-passo="${passo}"] input, [data-passo="${passo}"] select`).forEach(element => {
            dados[element.name] = element.value;
        })
        let listaDados = JSON.parse(localStorage.getItem(`dadosPasso${passo}`)) || [];

        if (Array.isArray(listaDados)) {
            listaDados.push(dados);
        } else {
            listaDados = [dados];
        }


        localStorage.setItem(`dadosPasso${passo}`, JSON.stringify(listaDados));
        exibirMensagem("Dados salvos com sucesso!", "sucesso");
    }

    function limparInputs(passo) {
        document.querySelectorAll(`[data-passo="${passo}"] input`).forEach(input => {
            input.value = ""
        })
    }

    function limparFormatoMoeda(valor) {
        if (typeof valor === 'string') {
            return parseFloat(valor.replace(/[^\d,-]/g, '').replace(',', '.'));
        }
        return parseFloat(valor) || 0;
    }

    iniciarViagemBtn.addEventListener('click', function () {
        if (validarCampos("1")) {
            salvarDados("1");
            localStorage.setItem('viagemIniciada', true);
            mostrarPasso("2");
            passoAtual = "2";
            exibirMensagem("Viagem iniciada com sucesso!", "sucesso");
        }
    });


    adicionarBtn.addEventListener('click', function () {
        const dataInicioInput = document.querySelector(`[data-passo="${passoAtual}"] [name="Data-Inicio-do-Frete"]`)
        const datafimInput = document.querySelector(`[data-passo="${passoAtual}"] [name="Data-Final-do-Frete"]`)
    
        if (dataInicioInput && datafimInput) {
            const dataInicial = new Date(dataInicioInput.value.split('/').reverse().join('-') || "");
            const dataFinal = new Date(datafimInput.value.split('/').reverse().join('-') || "");
    
            if (dataInicial > dataFinal) {
                exibirMensagem("A data inicial não pode ser maior que a data final.", "erro");
                return;
            }
        }
    
        if (validarCampos(passoAtual)) { // Valida o passo atual
            const dados = {};
            document.querySelectorAll(`[data-passo="${passoAtual}"] input, [data-passo="${passoAtual}"] select`).forEach(element => {
                dados[element.name] = element.value;
            });
    
            if (passoAtual === "3") {
                const anexoInput = document.getElementById('anexo'); // ID do input de arquivo
                const file = anexoInput ? anexoInput.files[0] : null;
    
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function () {
                        dados.imagemViagem = reader.result; // Adiciona a imagem em Base64
                        salvarDadosComImagem(passoAtual, dados); // Chama função para salvar os dados com imagem
                    };
                    reader.readAsDataURL(file); // Lê a imagem como Data URL
                } else {
                    salvarDadosComImagem(passoAtual, dados); // Salva sem imagem se não houver
                }
            } else {
                salvarDados(passoAtual); // Salva normalmente para passos diferentes
            }
    
            limparInputs(passoAtual);
    
            const listaDados = JSON.parse(localStorage.getItem(`dadosPasso${passoAtual}`)) || [];
            console.log(`Todos os dados do passo ${passoAtual}:`, listaDados);
    
            // Atualiza a exibição dos dados imediatamente após adicionar um novo item
            mostrarPasso(passoAtual); // Isso irá recarregar o estado atual dos dados
    
        } 
        exibirMensagem("Dados Adicionados com sucesso!", "sucesso");
    });
    
    // Função para salvar dados incluindo imagem
    function salvarDadosComImagem(passo, dados) {
        let listaDados = JSON.parse(localStorage.getItem(`dadosPasso${passo}`)) || [];
    
        if (Array.isArray(listaDados)) {
            listaDados.push(dados);
        } else {
            listaDados = [dados];
        }
    
        // Cálculo de Km rodado e média de consumo para o passo 3
        if (passo === "3") {
            const KmInicial = parseFloat(dados["Km-Inicial-do-Abastecimento"]) || 0;
            const KmFinal = parseFloat(dados["Km-Final-do-Abastecimento"]) || 0;
            const quantidadeCombustivel = parseFloat(dados["Litros-do-Abastecimento"]) || 0;

            const kmRodado = KmFinal - KmInicial;
            let mediaConsumo = 0;
            if (quantidadeCombustivel > 0) {
                mediaConsumo = kmRodado / quantidadeCombustivel;
            }

            dados["KM-Rodado"] = kmRodado;
            dados["Média-de-Consumo"] = mediaConsumo.toFixed(2);
        }
    
        localStorage.setItem(`dadosPasso${passo}`, JSON.stringify(listaDados));
    }
    


    dadosAdicionados.addEventListener('click', function () {
        window.location.href = 'dadosSalvos.html'
    })
    finalizarViagemBtn.addEventListener('click', function () {
        const dadosPasso1 = JSON.parse(localStorage.getItem('dadosPasso1')) || [];
        const dadosPasso2 = JSON.parse(localStorage.getItem('dadosPasso2')) || [];
        const dadosPasso3 = JSON.parse(localStorage.getItem('dadosPasso3')) || [];
        const dadosPasso4 = JSON.parse(localStorage.getItem('dadosPasso4')) || [];
        const dadosPasso5 = JSON.parse(localStorage.getItem('dadosPasso5')) || [];



        // Cálculo do total de recebimentos, abastecimentos e despesas
        const totalRecebimento = dadosPasso4.reduce((total, item) => total + limparFormatoMoeda(item["Valor-do-Recebimento"]), 0);

        const totalAbastecimento = dadosPasso3.reduce((total, item) => total + limparFormatoMoeda(item["Valor-do-Abastecimento"]), 0);
        const totalAbastecimentoDifCartao = dadosPasso3.reduce((total, item) => {
            if (item["Forma-do-Abastecimento"] !== "Cartão") {
                return total + limparFormatoMoeda(item["Valor-do-Abastecimento"])
            }
            return total
        }, 0);

        const totalDespesas = dadosPasso5.reduce((total, item) => total + limparFormatoMoeda(item["Valor-da-Despesa"]), 0);
        const totalDespesasDifCartao = dadosPasso5.reduce((total, item) => {
            if (item["Forma-do-Pagamento"] !== "Cartão") {
                return total + limparFormatoMoeda(item["Valor-da-Despesa"])
            }
            return total
        }, 0);

        const totalDinheiro = [
            ...dadosPasso3.filter(item => item["Forma-do-Abastecimento"] !== "Cartão"),
            ...dadosPasso5.filter(item => item["Forma-do-Pagamento"] !== "Cartão")
        ].reduce((total, item) => total + limparFormatoMoeda(item["Valor-do-Abastecimento"] || item["Valor-da-Despesa"]), 0);
        
        const totalCartao = [
            ...dadosPasso3.filter(item => item["Forma-do-Abastecimento"] === "Cartão"),
            ...dadosPasso5.filter(item => item["Forma-do-Pagamento"] === "Cartão")
        ].reduce((total, item) => total + limparFormatoMoeda(item["Valor-do-Abastecimento"] || item["Valor-da-Despesa"]), 0);
    
        

        // Cálculo total de dias passados em viagens
        let totalDiasPassados = 0;
        dadosPasso2.forEach(item => {
            const dataInicial = new Date(item["Data-Inicio-do-Frete"].split('/').reverse().join('-') || "");
            const dataFinal = new Date(item["Data-Final-do-Frete"].split('/').reverse().join('-') || "");

            const diffTime = Math.abs(dataFinal - dataInicial);
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            totalDiasPassados += diffDays;
        });

        // Calculando o total de diárias
        const valorDiaria = limparFormatoMoeda(dadosPasso1[0]["Valor-da-Diária"]);
        const totalDiarias = valorDiaria * totalDiasPassados; // Total de diárias para todas as viagens

        const despesaGeral = totalAbastecimento + totalDespesas

        // Calculando o valor final
        const valorFinal = totalRecebimento - (totalAbastecimentoDifCartao + totalDespesasDifCartao + totalDiarias);
        const resumoViagem = {
            totalRecebimento,
            totalAbastecimento,
            totalDespesas,
            totalDinheiro,
            totalCartao,
            totalDiarias,
            valorFinal,
            despesaGeral,
            totalDiasPassados 
        };

        // Salvando os dados no localStorage e redirecionando
        localStorage.setItem('resumoViagem', JSON.stringify(resumoViagem))
        exibirMensagem("Resumo finalizado com sucesso!", "sucesso");
        window.location.href = 'resumo.html'
    });
})

