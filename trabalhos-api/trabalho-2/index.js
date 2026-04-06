// 1. Importar Express
const express = require('express');

// 2. Criar aplicação
const app = express();
app.set('json spaces', 2);

// 3. Definir porta
const PORT = 3000;

// 4. Middleware
app.use(express.json());

// ARRAY DE JOGOS (INICIALMENTE 10 REGISTROS)
let jogos = [
    { id: 1, titulo: "The Witcher 3: Wild Hunt", desenvolvedora: "CD Projekt Red", ano: 2015, genero: "RPG", plataforma: "PC/PS4/Xbox One", nota: 9.5 },
    { id: 2, titulo: "God of War", desenvolvedora: "Santa Monica Studio", ano: 2018, genero: "Ação/Aventura", plataforma: "PS4/PS5", nota: 9.6 },
    { id: 3, titulo: "Grand Theft Auto V", desenvolvedora: "Rockstar Games", ano: 2013, genero: "Ação", plataforma: "PC/PS/Xbox", nota: 9.4 },
    { id: 4, titulo: "The Last of Us Part II", desenvolvedora: "Naughty Dog", ano: 2020, genero: "Ação/Drama", plataforma: "PS4", nota: 9.3 },
    { id: 5, titulo: "Red Dead Redemption 2", desenvolvedora: "Rockstar Games", ano: 2018, genero: "Ação/Aventura", plataforma: "PC/PS4/Xbox One", nota: 9.7 },
    { id: 6, titulo: "Minecraft", desenvolvedora: "Mojang", ano: 2011, genero: "Sandbox", plataforma: "Multiplataforma", nota: 9.0 },
    { id: 7, titulo: "Cyberpunk 2077", desenvolvedora: "CD Projekt Red", ano: 2020, genero: "RPG", plataforma: "PC/PS5/Xbox Series", nota: 8.5 },
    { id: 8, titulo: "Elden Ring", desenvolvedora: "FromSoftware", ano: 2022, genero: "RPG/Ação", plataforma: "PC/PS5/Xbox Series", nota: 9.6 },
    { id: 9, titulo: "FIFA 23", desenvolvedora: "EA Sports", ano: 2022, genero: "Esporte", plataforma: "PC/PS/Xbox", nota: 8.0 },
    { id: 10, titulo: "The Legend of Zelda: Breath of the Wild", desenvolvedora: "Nintendo", ano: 2017, genero: "Aventura", plataforma: "Switch", nota: 9.8 }
];

let proximoId = 11;

// ==============================================================

// ENDPOINT INICIAL
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API para manipulação de Jogos',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// INFO
app.get('/api/info', (req, res) => {
    res.json({
        nome: 'API REST de Jogos',
        versao: '2.0.0',
        autor: 'Gabriel Casarini'
    });
});

// ==============================================================

// ENDPOINT POST

app.post('/api/jogos', (req, res) => {
    // 1. Extrair dados do body
    const { titulo, desenvolvedora, ano, genero, plataforma, nota } = req.body;

    // 2. VALIDAÇÕES - Campos obrigatórios
    if (!titulo || !desenvolvedora || !ano || !genero || !plataforma || !nota) {
        return res.status(400).json({ erro: "Campos obrigatórios: titulo, desenvolvedora, ano, genero, plataforma, nota" });
    }

    // 3. VALIDAÇÕES - Tipos de dados
    if (typeof titulo !== 'string' || typeof desenvolvedora !== 'string' || typeof genero !== 'string' || typeof plataforma !== 'string') {
        return res.status(400).json({ erro: "Titulo, desenvolvedora, genero e plataforma devem ser texto" });
    }

    if (typeof ano !== 'number' || typeof nota !== 'number') {
        return res.status(400).json({ erro: "Ano e nota devem ser números" });
    }

    // 4. VALIDAÇÕES - Regras de negócio
    if (nota < 0 || nota > 10) {
        return res.status(400).json({ erro: "Nota deve estar entre 0 e 10" });
    }

    // 5. Criar novo jogo
    const novoJogo = { 
        id: proximoId++, 
        titulo, 
        desenvolvedora, 
        ano, 
        genero, 
        plataforma, 
        nota 
    };

    // 6. Adicionar ao array
    jogos.push(novoJogo);

    // 7. Retornar sucesso
    res.status(201).json(novoJogo);
});

// ==============================================================

// GET JOGOS (com filtros, ordenação e paginação)
app.get('/api/jogos', (req, res) => {
    // QUERY PARAMETERS
    const { 
        genero, nota_min, nota_max, ano_min, ano_max, busca, ordem, direcao, 
        pagina = 1, 
        limite = 10 
    } = req.query;

    let resultado = [...jogos];

    // FILTRO POR GÊNERO
    if (genero) resultado = resultado.filter(j => j.genero === genero);

    // FILTRO POR NOTA
    if (nota_min) resultado = resultado.filter(j => j.nota >= parseFloat(nota_min));
    if (nota_max) resultado = resultado.filter(j => j.nota <= parseFloat(nota_max));

    // FILTRO POR ANO
    if (ano_min) resultado = resultado.filter(j => j.ano >= parseInt(ano_min));
    if (ano_max) resultado = resultado.filter(j => j.ano <= parseInt(ano_max));

    // BUSCA POR TÍTULO
    if (busca) {
        const termo = busca.toLowerCase();
        resultado = resultado.filter(j => 
            j.titulo.toLowerCase().includes(termo));
    }

    // ORDENAÇÃO
    if (ordem) {
        resultado.sort((a, b) => {

            if (ordem === 'nota') {
                return direcao === 'desc'
                    ? b.nota - a.nota
                    : a.nota - b.nota;
            }

            if (ordem === 'ano') {
                return direcao === 'desc'
                    ? b.ano - a.ano
                    : a.ano - b.ano;
            }

            if (ordem === 'titulo') {
                return direcao === 'desc'
                    ? b.titulo.localeCompare(a.titulo)
                    : a.titulo.localeCompare(b.titulo);
            }
        });
    }

    // PAGINAÇÃO
    const paginaNum = parseInt(pagina);
    const limiteNum = parseInt(limite);

    const inicio = (paginaNum - 1) * limiteNum;
    const fim = inicio + limiteNum;

    const paginado = resultado.slice(inicio, fim);

    res.json({
        dados: paginado,
        paginacao: {
            pagina_atual: paginaNum,
            itens_por_pagina: limiteNum,
            total_itens: resultado.length,
            total_paginas: Math.ceil(resultado.length / limiteNum)
        }
    });
});

// ==============================================================

// PATH PARAMETERS (ESPECIFICO APÓS A ROTA)

// BUSCAR POR ID
app.get('/api/jogos/id/:id', (req, res) => {
    const jogo = jogos.find(j => j.id === parseInt(req.params.id));

    if (!jogo) return res.status(404).json({ erro: "Jogo não encontrado" });
    res.json(jogo);
});

// BUSCAR POR TÍTULO
app.get('/api/jogos/titulo/:titulo', (req, res) => {
    const titulo = req.params.titulo.toLowerCase();
    const jogo = jogos.find(j => j.titulo.toLowerCase() === titulo);

    if (!jogo) return res.status(404).json({ erro: "Jogo não encontrado" });
    res.json(jogo);
});

// ==============================================================

// ENDPOINT PUT

app.put('/api/jogos/:id', (req, res) => {
    // 1. Buscar jogo pelo ID
    const jogo = jogos.find(j => j.id === parseInt(req.params.id));

    // 2. Verificar se existe
    if (!jogo) return res.status(404).json({ erro: "Jogo não encontrado" });

    // 3. Extrair dados do body
    const { titulo, desenvolvedora, ano, genero, plataforma, nota } = req.body;

    // 4. VALIDAÇÕES - Campos obrigatórios
    if (!titulo || !desenvolvedora || !ano || !genero || !plataforma || !nota) {
        return res.status(400).json({ erro: "Campos obrigatórios: titulo, desenvolvedora, ano, genero, plataforma, nota" });
    }

    // 5. VALIDAÇÕES - Tipos de dados
    if (typeof titulo !== 'string' || typeof desenvolvedora !== 'string' || typeof genero !== 'string' || typeof plataforma !== 'string') {
        return res.status(400).json({ erro: "Titulo, desenvolvedora, genero e plataforma devem ser texto" });
    }

    if (typeof ano !== 'number' || typeof nota !== 'number') {
        return res.status(400).json({ erro: "Ano e nota devem ser números" });
    }

    // 6. VALIDAÇÕES - Regras de negócio
    if (nota < 0 || nota > 10) {
        return res.status(400).json({ erro: "Nota deve estar entre 0 e 10" });
    }

    // 7. Atualizar campos
    jogo.titulo = titulo;
    jogo.desenvolvedora = desenvolvedora;
    jogo.ano = ano;
    jogo.genero = genero;
    jogo.plataforma = plataforma;
    jogo.nota = nota;

    // 8. Retornar jogo atualizado
    res.json(jogo);
});

// ==============================================================

// ENDPOINT DELETE

app.delete('/api/jogos/:id', (req, res) => {
    // 1. Buscar índice do jogo pelo ID
    const index = jogos.findIndex(j => j.id === parseInt(req.params.id));

    // 2. Verificar se existe
    if (index === -1) return res.status(404).json({ erro: "Jogo não encontrado" });

    // 3. Remover do array
    jogos.splice(index, 1);

    // 4. Retornar sem conteúdo
    res.status(204).send();
});

// ==============================================================

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
});