const db = require('./sqliteService');

function createDatabaseStructure() {
  db.serialize(() => {
    // Criar tabela de vendas
    db.run(`
          CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
            nome TEXT,
            preco REAL,
            taxa REAL,
            desconto REAL,
            repasse REAL,
            FOREIGN KEY(venda_id) REFERENCES vendas(id) ON DELETE CASCADE
          )
        `);
  });
}

createDatabaseStructure();

const criarVenda = async (data, cliente, colaborador, servicosTratados) => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO vendas (data, cliente, colaborador) VALUES (?, ?, ?)', [data, cliente, colaborador], function (err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        const vendaId = this.lastID; // Obter o ID da venda recém-criada
        
        // Inserir serviços relacionados à venda
        const inserirServicos = servicosTratados.map(servico => {
          return new Promise((resolve, reject) => {
            const [nome, preco, taxa, desconto, repasse] = servico;
            db.run('INSERT INTO venda_servicos (venda_id, nome, preco, taxa, desconto, repasse) VALUES (?, ?, ?, ?, ?, ?)', 
              [vendaId, nome ,preco, taxa, desconto, repasse], 
              function (err) {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  resolve(this.changes);
                }
              }
            );
          });
        });

        // Esperar que todos os serviços sejam inseridos
        Promise.all(inserirServicos)
          .then(results => {
            resolve(results);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  });
};

const obterVendas = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        v.id as venda_id, 
        v.data, 
        v.cliente, 
        v.colaborador, 
        vs.id as servico_id, 
        vs.nome, 
        vs.preco, 
        vs.taxa, 
        vs.desconto, 
        vs.repasse
      FROM 
        vendas v
      LEFT JOIN 
        venda_servicos vs 
      ON 
        v.id = vs.venda_id
      ORDER BY 
        v.data ASC
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Organizar os dados para que cada venda tenha uma lista de serviços
        const vendasMap = new Map();

        rows.forEach(row => {
          if (!vendasMap.has(row.venda_id)) {
            vendasMap.set(row.venda_id, {
              id: row.venda_id,
              data: row.data,
              cliente: row.cliente,
              colaborador: row.colaborador,
              servicos: []
            });
          }

          if (row.servico_id) {
            vendasMap.get(row.venda_id).servicos.push({
              id: row.servico_id,
              nome: row.nome,
              preco: row.preco,
              taxa: row.taxa,
              desconto: row.desconto,
              repasse: row.repasse
            });
          }
        });

        resolve(Array.from(vendasMap.values()));
      }
    });
  });
};


const deletarVenda = async (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM vendas WHERE id = ?', [id], function (err) {
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
  obterVendas,
  criarVenda,
  deletarVenda,
};