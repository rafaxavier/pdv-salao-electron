// CRUD Requisicoes IPC
export function getAllVendas() {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('obterVendas');
    window.electron.ipcRenderer.once('obterVendasResult', (resposta) => {
      resolve(resposta.vendas);
    });
  });
};

export function createVenda(data, cliente, colaborador, servicosTratados) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('criarVendas', {data, cliente, colaborador, servicosTratados});
    window.electron.ipcRenderer.once('criarVendasResult', (resposta) => {
      if (resposta.success) {
        console.log(resposta);
        resolve(resposta);
      } else {
        const erro = new Error(resposta.msg);
        reject(erro);
      }
    });
  });
};

export function deleteVenda(id) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('deletarVendas', { id });
    window.electron.ipcRenderer.once('deletarVendasResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};
