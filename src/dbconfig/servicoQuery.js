const db = require('./sqliteService');

function createDatabaseStructure() {
  
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        preco REAL,
        taxa REAL,
        
      )
    `);

    // Insere um registro padrão de servico se a tabela estiver vazia
    db.get('SELECT COUNT(*) AS count FROM servicos', (err, row) => {
      if (err) {
        console.error('Erro ao verificar a tabela de servicos:', err);
      } else {
        if (row.count === 0) {
          db.run('INSERT INTO servicos (nome, preco, taxa) VALUES (?, ?, ?)', ['Mão + pé', 50.0, 0.30]);
        }
      }
    });

    // Outras tabelas e estruturas podem ser adicionadas aqui

  });
}

createDatabaseStructure();

/* QUERYS PARA SERVICOS */
const obterServicos = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM servicos ORDER BY nome ASC', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const criarService = async (nome, preco, taxa) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO servico (nome, preco, taxa) VALUES (?, ?, ?)', [nome, preco, taxa], function (err) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

const deletarServico = async (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM servicos WHERE id = ?', [id], function (err) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

const editarServico = async (id, nome, preco, taxa) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE servicos SET nome = ?, preco = ?, taxa = ?  WHERE id = ?', [nome, preco, taxa, id], function (err) {
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
  obterServicos,
  criarService,
  deletarServico,
  editarServico
};