// main.js

// Modules to control application life and create native browser window
const path = require('node:path')
const { app, BrowserWindow, ipcMain } = require('electron');

const { obterClientes, criarCliente, deletarCliente, editarCliente } = require('./src/dbconfig/clienteQuery');
const { obterColaboradores, criarColaborador, deletarColaborador, editarColaborador, obterColaboradorPorNome } = require('./src/dbconfig/colaboradorQuery');
const { obterServicos, editarServico, criarServico, deletarServico } = require('./src/dbconfig/servicoQuery');
const { criarVenda, obterVendas, deletarVenda } = require('./src/dbconfig/vendaQuery');

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, './src/preload.js')
    }
  })

  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadFile('./src/views/home/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

/* COMUNICADORES IPC PARA CHAMADAS DAS QUERYS*/
// CLIENTES
ipcMain.on('obterClientes', async (event) => {
  const clientes = await obterClientes(); // Chama a funcao do serviço SQLite para obter os clientes
  event.reply('obterClientesResult', { success: true, clientes }); // Envia os clientes de volta para o processo de renderização
});

ipcMain.on('criarClientes', async (event, { nome, telefone, cpf }) => {
  const create = await criarCliente(nome, telefone, cpf);
  if (create === 1) {
    feedBack = { success: true, msg: 'cliente salvo com sucesso' }
  } else {
    feedBack = { success: false, msg: 'cliente não criado!' }
  }
  event.reply('criarClientesResult', feedBack);
});

ipcMain.on('deletarClientes', async (event, { id }) => {
  const del = await deletarCliente(id);
  let feedBack = {};

  if (del === 1) {
    feedBack = { success: true, msg: 'cliente deletado com sucesso' }
  } else {
    feedBack = { success: false, msg: 'cliente não deletado!' }
  }

  event.reply('deletarClientesResult', feedBack);
});

ipcMain.on('editarClientes', async (event, { id, nome, telefone, cpf }) => {
  const update = await editarCliente(id, nome, telefone, cpf);
  let feedBack = {};

  if (update === 1) {
    feedBack = { success: true, msg: 'cliente atualizado com sucesso' }
  } else {
    feedBack = { success: false, msg: 'cliente não atualizado!' }
  }

  event.reply('editarClientesResult', feedBack);
});

// COLABORADORES
ipcMain.on('obterColaboradores', async (event) => {
  const colaboradores = await obterColaboradores();
  event.reply('obterColaboradoresResult', { success: true, colaboradores });
});

ipcMain.on('criarColaboradores', async (event, { nome, profissao, cpf }) => {
  try {
    await criarColaborador(nome, profissao, cpf);
    event.reply('criarColaboradoresResult', { success: true, msg: 'Colaborador salvo com sucesso' });
  } catch (error) {
    event.reply('criarColaboradoresResult', { success: false, msg: 'Erro ao criar colaborador: ' + error.message });
  }
});

ipcMain.on('deletarColaboradores', async (event, { id }) => {
  const del = await deletarColaborador(id);
  let feedBack = {};

  if (del === 1) {
    feedBack = { success: true, msg: 'Colaborador deletado com sucesso' }
  } else {
    feedBack = { success: false, msg: 'Colaborador não deletado!' }
  }

  event.reply('deletarColaboradoresResult', feedBack);
});

ipcMain.on('editarColaboradores', async (event, { id, nome, profissao, cpf }) => {
  const update = await editarColaborador(id, nome, profissao, cpf);
  let feedBack = {};

  if (update === 1) {
    feedBack = { success: true, msg: 'Colaborador atualizado com sucesso' }
  } else {
    feedBack = { success: false, msg: 'Colaborador não atualizado!' }
  }

  event.reply('editarColaboradoresResult', feedBack);
});

ipcMain.on('getOneByName', async (event, { nome }) => {
  const colaborador = await obterColaboradorPorNome(nome);
  const res = colaborador[0];
  event.reply('getOneByNameResult', { success: true, res });
});

// SERVICOS
ipcMain.on('obterServicos', async (event) => {
  const servicos = await obterServicos();
  event.reply('obterServicosResult', { success: true, servicos });
});

ipcMain.on('criarServicos', async (event, { nome, preco, taxa }) => {
  try {
    await criarServico(nome, preco, taxa);
    event.reply('criarServicosResult', { success: true, msg: 'Serviço salvo com sucesso' });
  } catch (error) {
    event.reply('criarServicosResult', { success: false, msg: 'Erro ao criar serviço: ' + error.message });
  }
});

ipcMain.on('deletarServicos', async (event, { id }) => {
  const del = await deletarServico(id);
  let feedBack = {};

  if (del === 1) {
    feedBack = { success: true, msg: 'Serviço deletado com sucesso' }
  } else {
    feedBack = { success: false, msg: 'Serviço não deletado!' }
  }

  event.reply('deletarServicosResult', feedBack);
});

ipcMain.on('editarServicos', async (event, { id, nome, preco, taxa }) => {
  const update = await editarServico(id, nome, preco, taxa);
  let feedBack = {};

  if (update === 1) {
    feedBack = { success: true, msg: 'Serviço atualizado com sucesso' }
  } else {
    feedBack = { success: false, msg: 'Serviço não atualizado!' }
  }

  event.reply('editarServicosResult', feedBack);
});

//  VENDAS
ipcMain.on('criarVendas', async (event, { data, cliente, colaborador, servicosTratados}) => {
  try {
    await criarVenda(data, cliente, colaborador, servicosTratados);
    event.reply('criarVendasResult', { success: true, msg: 'Venda salvo com sucesso' });
  } catch (error) {
    event.reply('criarVendasResult', { success: false, msg: 'Erro ao criar Venda: ' + error.message });
  }
});

ipcMain.on('obterVendas', async (event,{ parametros}) => {
  const vendas = await obterVendas(parametros);
  event.reply('obterVendasResult', { success: true, vendas });
});

ipcMain.on('deletarVendas', async (event, { id }) => {
  const del = await deletarVenda(id);
  let feedBack = {};

  if (del === 1) {
    feedBack = { success: true, msg: 'Serviço deletado com sucesso' }
  } else {
    feedBack = { success: false, msg: 'Serviço não deletado!' }
  }

  event.reply('deletarVendasResult', feedBack);
});

// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. Você também pode colocar eles em arquivos separados e requeridos-as aqui.
