document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.linkPasso')
    const passos = document.querySelectorAll('.passo')
    const iniciarViagemBtn = document.getElementById('iniciarViagem') 
    const controleBtn = document.getElementById('controleViagem') 
    const navBar = document.getElementById('navBar')
    const adicionarBtn = document.getElementById('adicionar')
    const despesasGeraisBtn = document.getElementById('despesasGeraisBtn');
    const abastecimentoBtn = document.getElementById('abastecimentoBtn');
    const despesasGeraisForm = document.getElementById('despesasGeraisForm');
    const abastecimentoForm = document.getElementById('abastecimentoForm');
    let passoAtual = "1"
    
    function mostrarPasso(passo){
        passos.forEach(function(divPasso){
            divPasso.classList.remove("ativo")
            if (divPasso.dataset.passo === passo) {
                divPasso.classList.add("ativo")
            }
        })

        if (passo >"1" ){
            controleBtn.style.display = 'block'
            navBar.style.display = 'block'

        } else {
            controleBtn.style.display = 'none'
            navBar.style.display = 'none'
        }
    }
    
    

    mostrarPasso("1")

    links.forEach(function(link){
        link.addEventListener('click', function(evento){
            evento.preventDefault()
            const passo = this.dataset.passo
            mostrarPasso(passo)
            passoAtual = passo
        })
    })

    
    function salvarDados(passo){
        
        const dados = {}
        document.querySelectorAll(`[data-passo="${passo}"] input`).forEach(input => {
            dados[input.name] = input.value;
        })
        let listaDados = JSON.parse(localStorage.getItem(`dadosPasso${passo}`)) || [];

        if (Array.isArray(listaDados)) {
            listaDados.push(dados);
        } else {
            listaDados = [dados];
        }

        localStorage.setItem(`dadosPasso${passo}`, JSON.stringify(listaDados));
        console.log(`Dados do passo ${passo} salvos no localStorage:`, listaDados);
    }

    function limparInputs(passo){
        document.querySelectorAll(`[data-passo="${passo}"] input`).forEach(input => {
            input.value = ""
        })
    }

    iniciarViagemBtn.addEventListener('click', function() {
        salvarDados("1")
        mostrarPasso("2");
        passoAtual = "2";
    });

    adicionarBtn.addEventListener('click', function() {
        salvarDados(passoAtual);
        alert(`dados dos passo ${passoAtual} salvo com sucesso`)
        limparInputs(passoAtual)
    })

})

