// navLoader.js

// Função para criar o menu
const criarMenu = (paginaAtiva) => {
  console.log(paginaAtiva);
  const cabecalhos = document.getElementsByClassName('header');

  if (cabecalhos.length > 0 && cabecalhos[0].querySelector('nav')) {
    return;
  }

  for (const cabecalho of cabecalhos) {
    let header = document.createElement('header');
    let nav = document.createElement('nav');
    let ul = document.createElement('ul');
    let boxConfig = document.createElement('div');
    let li_config = document.createElement('li');
    let a_config = document.createElement('a');
    a_config.href = '#'; // Pode ser '#' para não redirecionar
    a_config.textContent = 'Configuração';

    // Adicione a classe hidden inicialmente para ocultar os itens
    boxConfig.classList.add('hidden');

    const itensMenu = [
      { nome: 'Home', link: '../../views/home/index.html' },
      { nome: 'Clientes', link: '../../views/clientes/index.html' },
      { nome: 'Colaboradores', link: '../../views/colaboradores/index.html' },
      { nome: 'Serviços', link: '../../views/servicos/index.html' },
    ];

    for (const item of itensMenu) {
      let li = document.createElement('li');
      let a = document.createElement('a');
      a.href = item.link;
      a.textContent = item.nome;

      if (item.nome === paginaAtiva) {
        a.classList.add('active');
      }

      li.appendChild(a);
      if (item.nome === 'Clientes' || item.nome === 'Colaboradores' || item.nome === 'Serviços') {
        boxConfig.appendChild(li);
      } else {
        ul.appendChild(li);
      }
    }

    // Adicione o botão 'configs' fora do 'boxConfig'
    li_config.appendChild(a_config);
    ul.appendChild(li_config);

    nav.appendChild(ul);
    nav.appendChild(boxConfig);
    let logo = document.createElement('img');
    logo.src = '../../assets/logo.png';
    logo.width = '150';
    logo.style ='margin:25px'
    logo.alt = 'Logo da Empresa';
    header.appendChild(logo);
    header.appendChild(nav);
    cabecalho.appendChild(header);

    // Adicione o event listener para a_config
    a_config.addEventListener('click', (event) => {
      event.preventDefault(); // Previne o comportamento padrão do link
      if (paginaAtiva !== 'Home') {
        // Exibir links de configuração
        boxConfig.classList.remove('hidden');
      } else {
        // Alternar visibilidade dos links de configuração
        boxConfig.classList.toggle('hidden');
      }
    });

    // Verifique se a página ativa é 'Home' e se boxConfig está escondido
    if (paginaAtiva === 'Home') {
      boxConfig.classList.add('hidden');
    } else {
      boxConfig.classList.remove('hidden');
    }
  }
};
