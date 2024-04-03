const fs = require('fs');
const path = require('path');
const electron = require('electron');

const userDataPath = electron.app.getPath('userData');

const dbPath = path.join(userDataPath, 'data.db');

// Verifica se o banco de dados existe
const dbExists = fs.existsSync(dbPath);

// Criar ou conectar ao banco de dados SQLite
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbPath);

// Função para criar a estrutura do banco de dados e inserir registros padrão
function createDatabaseStructure() {
  // Cria as tabelas necessárias se não existirem
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        telefone TEXT
      )
    `);

    // Insere um registro padrão de cliente se a tabela estiver vazia
    db.get('SELECT COUNT(*) AS count FROM clientes', (err, row) => {
      if (err) {
        console.error('Erro ao verificar a tabela de clientes:', err);
      } else {
        if (row.count === 0) {
          db.run('INSERT INTO clientes (nome, telefone) VALUES (?, ?)', ['Cliente Padrão', '123456789']);
        }
      }
    });

    // Outras tabelas e estruturas podem ser adicionadas aqui

  });
}

// Verifica se o banco de dados existe e cria a estrutura se necessário
if (!dbExists) {
  createDatabaseStructure();
}

// Função para obter todos os clientes
const obterClientes = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM clientes', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const criarCliente = async (nome, telefone) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO clientes (nome, telefone) VALUES (?, ?)', [nome, telefone], function (err) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

// Função para excluir um cliente
const deletarCliente = async (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM clientes WHERE id = ?', [id], function (err) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

// Função para excluir um cliente
const editarCliente = async (id, nome, telefone) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE clientes SET nome = ?, telefone = ?  WHERE id = ?', [nome, telefone, id], function (err) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

module.exports = {
  obterClientes,
  criarCliente,
  deletarCliente,
  editarCliente
};