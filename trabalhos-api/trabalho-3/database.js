const Database = require('better-sqlite3');

const db = new Database('jogos.db');

// Criar tabela
db.exec(`
    CREATE TABLE IF NOT EXISTS jogos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        desenvolvedora TEXT NOT NULL,
        ano INTEGER NOT NULL,
        genero TEXT NOT NULL,
        plataforma TEXT NOT NULL,
        nota REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log('Banco conectado!');

// VERIFICAR SE JÁ TEM DADOS
const count = db.prepare('SELECT COUNT(*) as total FROM jogos').get().total;

if (count === 0) {
    console.log('Populando banco com dados iniciais...');

    db.exec(`
        INSERT INTO jogos (titulo, desenvolvedora, ano, genero, plataforma, nota) VALUES
        ('The Witcher 3: Wild Hunt', 'CD Projekt Red', 2015, 'RPG', 'PC', 9.5),
        ('God of War', 'Santa Monica Studio', 2018, 'Ação', 'PS4', 9.6),
        ('Grand Theft Auto V', 'Rockstar Games', 2013, 'Ação', 'Xbox One', 9.4),
        ('The Last of Us Part II', 'Naughty Dog', 2020, 'Drama', 'PS4', 9.3),
        ('Red Dead Redemption 2', 'Rockstar Games', 2018, 'Aventura', 'PC', 9.7),
        ('Minecraft', 'Mojang', 2011, 'Sandbox', 'PC', 9.0),
        ('Cyberpunk 2077', 'CD Projekt Red', 2020, 'RPG', 'PS5', 8.5),
        ('Elden Ring', 'FromSoftware', 2022, 'RPG', 'PS5', 9.6),
        ('FIFA 23', 'EA Sports', 2022, 'Esporte', 'PC', 8.0),
        ('The Legend of Zelda: Breath of the Wild', 'Nintendo', 2017, 'Aventura', 'Switch', 9.8),
        ('Horizon Zero Dawn', 'Guerrilla Games', 2017, 'RPG', 'PS4', 9.2),
        ('Assassin’s Creed Valhalla', 'Ubisoft', 2020, 'Ação', 'Xbox Series', 8.4),
        ('Call of Duty: Modern Warfare II', 'Infinity Ward', 2022, 'FPS', 'PS5', 8.7),
        ('Resident Evil 4 Remake', 'Capcom', 2023, 'Terror', 'PS5', 9.4),
        ('Dark Souls III', 'FromSoftware', 2016, 'RPG', 'PS4', 9.1),
        ('Fortnite', 'Epic Games', 2017, 'Battle Royale', 'PC', 8.3),
        ('League of Legends', 'Riot Games', 2009, 'MOBA', 'PC', 9.0),
        ('Valorant', 'Riot Games', 2020, 'FPS', 'PC', 8.8),
        ('Overwatch 2', 'Blizzard Entertainment', 2022, 'FPS', 'Xbox Series', 8.2),
        ('Starfield', 'Bethesda', 2023, 'RPG', 'Xbox Series', 8.6);
        `);

    console.log('Banco populado com sucesso!');
} else {
    console.log('Banco já está populado!');
}

module.exports = db;