// main.js

// Modules to control application life and create native browser window
const path = require('node:path')
const { app, BrowserWindow, ipcMain } = require('electron');

const { obterClientes, criarCliente, deletarCliente, editarCliente } = require('./src/dbconfig/clienteQuery')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, './src/preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./src/pages/home/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

ipcMain.on('obterClientes', async (event) => {
  const clientes = await obterClientes(); // Chama a funcao do serviço SQLite para obter os clientes
  event.reply('obterClientesResult', { success: true, clientes }); // Envia os clientes de volta para o processo de renderização
});

ipcMain.on('criarClientes', async (event, { nome, telefone, cpf }) => {
  const create = await criarCliente(nome, telefone, cpf);
  if (create === 1) {
    feedBack = { success: true, msg: 'cliente salvo com sucesso' }
  } else {
    feedBack = { success: false, msg: 'cliente não deletado!' }
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
