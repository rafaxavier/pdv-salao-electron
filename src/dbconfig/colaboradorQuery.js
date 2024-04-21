const db = require('./sqliteService');

function createDatabaseStructure() {
  
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS colaboradores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        profissao TEXT,
        cpf TEXT UNIQUE
        
      )
    `);

    // Insere um registro padrão de colaborador se a tabela estiver vazia
    db.get('SELECT COUNT(*) AS count FROM colaboradores', (err, row) => {
      if (err) {
        console.error('Erro ao verificar a tabela de colaboradores:', err);
      } else {
        if (row.count === 0) {
          db.run('INSERT INTO colaboradores (nome, profissao, cpf) VALUES (?, ?, ?)', ['Fulana dos Santos', '(21)97322-1111', '111.222.333-66']);
        }
      }
    });

    // Outras tabelas e estruturas podem ser adicionadas aqui

  });
}

createDatabaseStructure();

/* QUERYS PARA COLABORADORES */
const obterColaboradores = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM colaboradores ORDER BY nome ASC', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const criarColaborador = async (nome, profissao, cpf) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO colaboradores (nome, profissao, cpf) VALUES (?, ?, ?)', [nome, profissao, cpf], function (err) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

const deletarColaborador = async (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM colaboradores WHERE id = ?', [id], function (err) {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
};

const editarColaborador = async (id, nome, profissao, cpf) => {
  return new Promise((resolve, reject) => {
    db.run('UPDATE colaboradores SET nome = ?, profissao = ?, cpf = ?  WHERE id = ?', [nome, profissao, cpf, id], function (err) {
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
  obterColaboradores,
  criarColaborador,
  deletarColaborador,
  editarColaborador
};