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

// export function deleteServico(id) {
//   return new Promise((resolve, reject) => {
//     window.electron.ipcRenderer.sendMessage('deletarServicos', { id });
//     window.electron.ipcRenderer.once('deletarServicosResult', (resposta) => {
//       console.log(resposta);
//       resolve(resposta);
//     });
//   });
// };
