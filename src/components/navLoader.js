// navLoader.js

// Função para criar o menu
const criarMenu = (paginaAtiva) => {

    console.log(paginaAtiva)
    // Obtém todos os elementos com a classe 'header'
    const cabecalhos = document.getElementsByClassName('header');

    // Verifica se o menu já foi criado para evitar duplicação
    if (cabecalhos.length > 0 && cabecalhos[0].querySelector('nav')) {
        return; // Se o menu já existe, interrompe a execução da função
    }

    // Loop através de cada elemento com a classe 'header'
    for (const cabecalho of cabecalhos) {
        // Cria os elementos do menu
        let header = document.createElement('header');
        let nav = document.createElement('nav');
        let ul = document.createElement('ul');

        // Array de itens do menu com seus respectivos links
        const itensMenu = [
            { nome: 'Home', link: '../../pages/home/index.html' },
            { nome: 'Clientes', link: '../../pages/clientes/index.html' },
            { nome: 'Serviços', link: '#' },
            { nome: 'Contato', link: '#' }
        ];

        // Cria um item de menu para cada elemento no array 'itensMenu'
        for (const item of itensMenu) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            a.href = item.link; // Define o link conforme necessário
            a.textContent = item.nome;

            // Verifica se o nome da página corresponde ao nome da página ativa
            if (item.nome === paginaAtiva) {
                a.classList.add('active');
            }

            li.appendChild(a);
            ul.appendChild(li);
        }

        // Adiciona os elementos do menu ao documento HTML
        nav.appendChild(ul);
        header.appendChild(nav);
        cabecalho.appendChild(header);
    }

};


