// 1. Importar Express
const express = require('express');

// 2. Criar aplicação
const app = express();

app.set('json spaces', 2);

// 3. Definir porta
const PORT = 3000;

// 4. Middleware
app.use(express.json());

let filmes = [
    { id: 1, titulo: "Interestelar", diretor: "Christopher Nolan", ano: 2014, genero: "Ficção", nota: 8.6 },
    { id: 2, titulo: "O Poderoso Chefão", diretor: "Francis Ford Coppola", ano: 1972, genero: "Crime", nota: 9.2 },
    { id: 3, titulo: "Vingadores: Ultimato", diretor: "Anthony e Joe Russo", ano: 2019, genero: "Ação", nota: 8.4 },
    { id: 4, titulo: "Titanic", diretor: "James Cameron", ano: 1997, genero: "Romance", nota: 7.9 },
    { id: 5, titulo: "Coringa", diretor: "Todd Phillips", ano: 2019, genero: "Drama", nota: 8.4 },
    { id: 6, titulo: "Matrix", diretor: "Lana e Lilly Wachowski", ano: 1999, genero: "Ficção", nota: 8.7 },
    { id: 7, titulo: "Homem-Aranha: Sem Volta Para Casa", diretor: "Jon Watts", ano: 2021, genero: "Ação", nota: 8.2 },
    { id: 8, titulo: "Parasita", diretor: "Bong Joon-ho", ano: 2019, genero: "Suspense", nota: 8.6 },
    { id: 9, titulo: "Toy Story", diretor: "John Lasseter", ano: 1995, genero: "Animação", nota: 8.3 },
    { id: 10, titulo: "O Senhor dos Anéis: A Sociedade do Anel", diretor: "Peter Jackson", ano: 2001, genero: "Fantasia", nota: 8.8 }
];

let proximoId = 11;

// ==============================================================

// ENDPOINT INICIAL
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API para manipulação de Filmes',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// INFO
app.get('/api/info', (req, res) => {
    res.json({
        nome: 'API REST de Filmes',
        versao: '1.0.0',
        autor: 'Gabriel Casarini'
    });
});

// ==============================================================

// ENDPOINT POST

app.post('/api/filmes', (req, res) => {
    // 1. Extrair dados do body
    const { titulo, diretor, ano, genero, nota } = req.body;
    
    // 2. VALIDAÇÕES - Campos obrigatórios
    if (!titulo || !diretor || !ano || !genero || !nota) {
        return res.status(400).json({
            erro: "Campos obrigatórios: titulo, diretor, ano, genero, nota"
        });
    }
    
    // 3. VALIDAÇÕES - Tipos de dados
    if (typeof titulo !== 'string' || typeof diretor !== 'string' || typeof genero !== 'string') {
        return res.status(400).json({
            erro: "Titulo, diretor e genero devem ser texto"
        });
    }

    if (typeof ano !== 'number' || typeof nota !== 'number') {
        return res.status(400).json({
            erro: "Ano e nota devem ser números"
        });
    }
    
    // 4. VALIDAÇÕES - Regras de negócio
    if (ano < 1888) { // Ano do primeiro filme da história
        return res.status(400).json({
            erro: "Ano inválido"
        });
    }

    if (nota < 0 || nota > 10) {
        return res.status(400).json({
            erro: "Nota deve estar entre 0 e 10"
        });
    }
    
    // 5. VALIDAÇÕES - Tamanho mínimo
    if (titulo.length < 2) {
        return res.status(400).json({
            erro: "Titulo deve ter pelo menos 2 caracteres"
        });
    }

    if (diretor.length < 3) {
        return res.status(400).json({
            erro: "Diretor deve ter pelo menos 3 caracteres"
        });
    }
    
    // 6. Criar novo filme
    const novoFilme = {
        id: proximoId++,
        titulo,
        diretor,
        ano,
        genero,
        nota
    };
    
    // 7. Adicionar ao array
    filmes.push(novoFilme);
    
    // 8. Retornar sucesso
    res.status(201).json(novoFilme);
});

// ==============================================================

// GET FILMES (com filtros, ordenação e paginação)
app.get('/api/filmes', (req, res) => {
    // QUERY PARAMETERS
    const { 
        genero, nota_min, nota_max, ano_min, ano_max, busca, ordem, direcao,
        pagina = 1,
        limite = 10
    } = req.query;

    let resultado = [...filmes];

    // FILTRO POR GÊNERO
    if (genero) {
        resultado = resultado.filter(f => f.genero === genero);
    }

    // BUSCA POR TÍTULO
    if (busca) {
        const termo = busca.toLowerCase();
        resultado = resultado.filter(f =>
            f.titulo.toLowerCase().includes(termo)
        );
    }

    // FILTRO POR NOTA
    if (nota_min) {
        resultado = resultado.filter(f => f.nota >= parseFloat(nota_min));
    }

    if (nota_max) {
        resultado = resultado.filter(f => f.nota <= parseFloat(nota_max));
    }

    // FILTRO POR ANO
    if (ano_min) {
        resultado = resultado.filter(f => f.ano >= parseInt(ano_min));
    }

    if (ano_max) {
        resultado = resultado.filter(f => f.ano <= parseInt(ano_max));
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
app.get('/api/filmes/id/:id', (req, res) => {
    const filme = filmes.find(f => f.id === parseInt(req.params.id));

    if (!filme) {
        return res.status(404).json({ erro: "Filme não encontrado" });
    }

    res.json(filme);
});

// BUSCAR POR TÍTULO
app.get('/api/filmes/titulo/:titulo', (req, res) => {
    const titulo = req.params.titulo.toLowerCase();

    const filme = filmes.find(f =>
        f.titulo.toLowerCase() === titulo
    );

    if (!filme) {
        return res.status(404).json({ erro: "Filme não encontrado" });
    }

    res.json(filme);
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});