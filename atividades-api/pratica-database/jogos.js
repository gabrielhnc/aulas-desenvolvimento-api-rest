const Database = require('better-sqlite3')
const db = new Database('jogos.db')

const createTableJogosSQL = `
    CREATE TABLE IF NOT EXISTS
    jogos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        desenvolvedora TEXT NOT NULL,
        ano INTEGER NOT NULL,
        genero TEXT NOT NULL,
        plataforma TEXT NOT NULL,
        nota REAL NOT NULL
    )
`;

const insertQuery = `
    INSERT INTO jogos (titulo, desenvolvedora, ano, genero, plataforma, nota) VALUES
    ('The Witcher 3', 'CD Projekt Red', 2015, 'RPG', 'PC', 9.8),
    ('God of War', 'Santa Monica Studio', 2018, 'Ação/Aventura', 'PlayStation', 9.7),
    ('GTA V', 'Rockstar Games', 2013, 'Ação', 'PC', 9.5),
    ('Minecraft', 'Mojang', 2011, 'Sandbox', 'Multiplataforma', 9.6),
    ('FIFA 23', 'EA Sports', 2022, 'Esporte', 'PC', 8.5);
`

db.exec(createTableJogosSQL);

console.log('Executando Query para o Database jogos.db!')
