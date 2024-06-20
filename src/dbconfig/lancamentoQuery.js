const db = require('./sqliteService');

function createDatabaseStructure() {
  console.log("Banco criadooooo")
  db.serialize(() => {
    // Criar tabela de vendas
    db.run(`
          CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            data TEXT,
            cliente TEXT,
            colaborador TEXT
          )
        `);

    // Criar tabela de serviços relacionados à venda
    db.run(`
          CREATE TABLE IF NOT EXISTS venda_servicos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            venda_id INTEGER,
            preco REAL,
            taxa REAL,
            desconto REAL,
            repasse REAL,
            FOREIGN KEY(venda_id) REFERENCES vendas(id)
          )
        `);
  });
}

createDatabaseStructure();

/* QUERYS PARA COLABORADORES */
// const obterColaboradores = () => {
//   return new Promise((resolve, reject) => {
//     db.all('SELECT * FROM colaboradores ORDER BY nome ASC', (err, rows) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(rows);
//       }
//     });
//   });
// };

const criarVenda = async (body) => {
  console.log({'body':body})
  return new Promise((resolve, reject) => {
    // db.run('INSERT INTO colaboradores (nome, profissao, cpf) VALUES (?, ?, ?)', [nome, profissao, cpf], function (err) {
    //   if (err) {
    //     console.log(err)
    //     reject(err);
    //   } else {
    //     resolve(this.changes);
    //   }
    // });
  });
};

// const deletarColaborador = async (id) => {
//   return new Promise((resolve, reject) => {
//     db.run('DELETE FROM colaboradores WHERE id = ?', [id], function (err) {
//       if (err) {
//         console.log(err)
//         reject(err);
//       } else {
//         resolve(this.changes);
//       }
//     });
//   });
// };

// const editarColaborador = async (id, nome, profissao, cpf) => {
//   return new Promise((resolve, reject) => {
//     db.run('UPDATE colaboradores SET nome = ?, profissao = ?, cpf = ?  WHERE id = ?', [nome, profissao, cpf, id], function (err) {
//       if (err) {
//         console.log(err)
//         reject(err);
//       } else {
//         resolve(this.changes);
//       }
//     });
//   });
// };

module.exports = {
  // obterColaboradores,
  criarVenda,
  // deletarColaborador,
  // editarColaborador
};