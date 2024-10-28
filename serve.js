<<<<<<< HEAD
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

    function validarCampos(passoAtual) {
        const inputs = document.querySelectorAll(`[data-passo="${passoAtual}"] input`);
    
        let todosPreenchidos = true; // Variável para rastrear se todos os campos estão preenchidos
    
        inputs.forEach((input) => {
            const valor = input.value.trim();
            // Verifica se o campo está vazio
            if (!valor) {
                console.log(`Campo ${input.name} está vazio.`);
                todosPreenchidos = false; // Marca como falso se algum campo estiver vazio
            }
    
            // Verifica se é uma data e se está completa no formato DD/MM/AAAA
            if (input.classList.contains('dataInput') && valor.length !== 10) {
                console.log(`Campo de data ${input.name} não está no formato DD/MM/AAAA.`);
                todosPreenchidos = false; // Marca como falso se a data não estiver no formato correto
            }
        });
    
        // Se não todos os campos estão preenchidos, mas existem dados salvos no localStorage, preencha os inputs
        if (!todosPreenchidos) {
            const dadosSalvos = JSON.parse(localStorage.getItem(`dadosPasso${passoAtual}`)) || [];
            if (dadosSalvos.length > 0) {
                dadosSalvos[0].forEach((item) => {
                    const input = document.querySelector(`[name="${item}"]`);
                    if (input) {
                        input.value = item.valor; // Preenche o input com os dados salvos
                    }
                });
            }
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
            alert("Por favor, preencha todos os campos de data no formato DD/MM/AAAA.");
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

        if (passo === "3") {
            const KmInicial = parseFloat(dados["Km-Inicial-do-Abastecimento"]) || 0;
            const KmFinal = parseFloat(dados["Km-Final-do-Abastecimento"]) || 0;
            const quantidadeCombustivel = parseFloat(dados["Litros-do-Abastecimento"]) || 0;

            const kmRodado = KmFinal - KmInicial;
            let mediaConsumo = 0;
            if (quantidadeCombustivel > 0) {
                mediaConsumo = kmRodado / quantidadeCombustivel;
            }

            dados.kmRodado = kmRodado;
            dados.mediaConsumo = mediaConsumo.toFixed(2);
        }

        localStorage.setItem(`dadosPasso${passo}`, JSON.stringify(listaDados));
        console.log(`Dados do passo ${passo} salvos no localStorage:`, listaDados);
    }

    function limparInputs(passo) {
        document.querySelectorAll(`[data-passo="${passo}"] input`).forEach(input => {
            input.value = ""
        })
    }

    iniciarViagemBtn.addEventListener('click', function () {
        if (validarCampos("1")) { // Você pode querer deixar isso como "1" para validar o passo inicial
            console.log("Passo 1 validado com sucesso.");
            salvarDados("1");
            localStorage.setItem('viagemIniciada', true);
            mostrarPasso("2");
            passoAtual = "2";
        } else {
            alert("Por favor, preencha todos os campos obrigatórios no passo 1.");
        }
    });


    adicionarBtn.addEventListener('click', function () {
        if (validarCampos(passoAtual)) { // Valida o passo atual
            salvarDados(passoAtual);
            alert(`Dados do passo ${passoAtual} salvos com sucesso`);
            limparInputs(passoAtual);
    
            const listaDados = JSON.parse(localStorage.getItem(`dadosPasso${passoAtual}`)) || [];
            console.log(`Todos os dados do passo ${passoAtual}:`, listaDados);
            
            // Atualiza a exibição dos dados imediatamente após adicionar um novo item
            mostrarPasso(passoAtual); // Isso irá recarregar o estado atual dos dados
            
        } else {
            alert("Por favor, preencha todos os campos obrigatórios antes de adicionar.");
        }
    });
    

    dadosAdicionados.addEventListener('click', function () {
        window.location.href = 'dadosSalvos.html'
    })
    finalizarViagemBtn.addEventListener('click', function () {
        const dadosPasso2 = JSON.parse(localStorage.getItem('dadosPasso2')) || [];
    const dadosPasso3 = JSON.parse(localStorage.getItem('dadosPasso3')) || [];
    const dadosPasso4 = JSON.parse(localStorage.getItem('dadosPasso4')) || [];
    const dadosPasso5 = JSON.parse(localStorage.getItem('dadosPasso5')) || [];

    if (dadosPasso2.length === 0) {
        console.error("Não há dados salvos para o passo 1.");
        return; // Para evitar erro se não houver dados
    }

    // Cálculo do total de recebimentos, abastecimentos e despesas
    const totalRecebimento = dadosPasso4.reduce((total, item) => total + parseFloat(item["Valor-do-Recebimento"] || 0), 0);
    const totalAbastecimento = dadosPasso3.reduce((total, item) => total + parseFloat(item["Valor-do-Abastecimento"] || 0), 0);
    const totalDespesas = dadosPasso5.reduce((total, item) => total + parseFloat(item["Valor-da-Despesa"] || 0), 0);

    // Obtendo as datas inicial e final do passo 1
    const dataInicial = new Date(dadosPasso2[0]["Data-Inicio-do-Frete"] || "");
    const dataFinal = new Date(dadosPasso2[0]["Data-Final-do-Frete"] || "");

    // Calculando a diferença em dias
    const diffTime = Math.abs(dataFinal - dataInicial);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculando o total de diárias
    const valorDiaria = parseFloat(dadosPasso2[0]["Valor-da-Diária"] || 0);
    const totalDiarias = valorDiaria * diffDays;

    // Calculando o valor final
    const valorFinal = totalRecebimento - (totalAbastecimento + totalDespesas + totalDiarias);
    const resumoViagem = {
        totalRecebimento,
        totalAbastecimento,
        totalDespesas,
        totalDiarias,
        valorFinal
    };

    // Salvando os dados no localStorage e redirecionando
    localStorage.setItem('resumoViagem', JSON.stringify(resumoViagem));
    window.location.href = 'resumo.html';
    });
})

=======
const route = (event) => {
    event = event || window.event
    event.preventDefoult()
    window.history.pushState({}, "", event.target.href)
}


const 


window.route = route;
>>>>>>> 0d62766a07370c8ef493f3353120cf6f1915ee9a
