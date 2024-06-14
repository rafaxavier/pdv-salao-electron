// CRUD Requisicoes IPC
export function getAllColaboradores() {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('obterColaboradores');
    window.electron.ipcRenderer.once('obterColaboradoresResult', (resposta) => {
      resolve(resposta.colaboradores);
    });
  });
};

export function createColaborador(nome, profissao, cpf) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('criarColaboradores', { nome, profissao, cpf });
    window.electron.ipcRenderer.once('criarColaboradoresResult', (resposta) => {
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

export function deleteColaborador(id) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('deletarColaboradores', { id });
    window.electron.ipcRenderer.once('deletarColaboradoresResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};

export function updateColaborador(id, nome, profissao, cpf) {
  return new Promise((resolve, reject) => {
    window.electron.ipcRenderer.sendMessage('editarColaboradores', { id, nome, profissao, cpf });
    window.electron.ipcRenderer.once('editarColaboradoresResult', (resposta) => {
      console.log(resposta);
      resolve(resposta);
    });
  });
};
