const Database = require('better-sqlite3');
const db = new Database('produtos.db');

// SQL para criar tabela
const createTableSQL = `
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(100) NOT NULL,
        preco DECIMAL(10,2) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        estoque INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

const queryInsert = `
    INSERT INTO produtos (nome, preco, categoria)
    VALUES 
    ('Notebook', 3500, 'Tech'),
    ('Mouse', 150, 'Tech'),
    ('Livro', 89, 'Books');
`;

const queryUpdate = `
    UPDATE produtos SET preco = 3200 WHERE id = 1;
`

const queryDelete = `
    DELETE FROM produtos WHERE id = 3;
`

// Executar SQL
db.exec(queryDelete);

console.log('✅ Tabela produtos criada!');