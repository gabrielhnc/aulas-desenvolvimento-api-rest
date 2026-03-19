// 1. Importar Express
const express = require('express');

// 2. Criar aplicação
const app = express();

app.set('json spaces', 2);

// 3. Definir porta
const PORT = 3000;

// 4. Middleware para JSON
app.use(express.json());

// Array com 5 produtos
let produtos = [
    {id: 1, nome: "Mouse Logitech", preco: 300, categoria: "Eletronicos", estoque: 10},
    {id: 2, nome: "Bola de Futebol", preco: 25, categoria: "Brinquedos", estoque: 10},
    {id: 3, nome: "Notebook Acer", preco: 2500, categoria: "Eletronicos", estoque: 10},
    {id: 4, nome: "Cabo de Vassoura", preco: 15, categoria: "Utensilios", estoque: 10},
    {id: 5, nome: "Teclado Redragon", preco: 250, categoria: "Eletronicos", estoque: 10},
]

// ENDPOINT (GET) -> Lista todos os produtos do array (Comentado devido ao uso da mesma rota posteriormente)
app.get('/api/produtos/todos', (req, res) => {
    res.json(produtos)
})

// ENDPOINT INICIAL (GET)
app.get('/', (req, res) => {
    res.json({
        mensagem: '🎉 Minha primeira API funcionando!',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// ENDPOINT (GET /api/info)
app.get('/api/info', (req, res) => {
    res.json({
        nome: 'Minha API REST',
        versao: '1.0.0',
        autor: 'Seu Nome'
    });
});

// PATH PARAMETER (Encontra uma ocorrencia especifica de um dos itens do JSON)

// ENDPOINT GET/api/produtos/:id - Buscar por ID
app.get('/api/produtos/:id', (req, res) => {
    // 1. Pegar ID da URL
    const id = parseInt(req.params.id);

    // 2. Buscar produto no array
    const produto = produtos.find(p => p.id === id);

    // 3. Verificar se encontrou
    if (!produto) {
        return res.status(404).json({
            erro: "Produto não encontrado"
        });
    }

    // 4. Retornar produto encontrado
    res.json(produto)
})

// ENDPOINT GET/api/produtos/:nome - Buscar por NOME
app.get('/api/produtos/nomes/:nome', (req, res) => {
    // 1. Pegar nome da URL
    const nome = String(req.params.nome);

    // 2. Buscar produto no array
    const produto = produtos.find(p => p.nome === nome);

    // 3. Verificar se encontrou
    if (!produto) {
        return res.status(404).json({
            erro: "Nome não encontrado"
        });
    }

    // 4. Retornar produto encontrado
    res.json(produto)
})

// QUERY PARAMETERS (Implementação de filtros e buscas na URI)

// GET /api/produtos/categoria?categoria=Eletronicos
app.get('/api/produtos/categoria', (req, res) => {
    // 1. Pegar query parameters
    const { categoria } = req.query;

    // 2. Começar com todos os produtos
    let resultado = produtos;

    // 3. Aplicar filtro de categoria (se fornecido)
    if (categoria) {
        resultado = resultado.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());

        // Validando se a categoria é existente nos produtos após o filtro
        if (resultado.length === 0) {
            return res.status(404).json({
                erro: `Nenhum produto encontrado na categoria (${categoria})`
            });
        }
    } 

    // 4. Retornar o resultado filtrado
    res.json(resultado)
})

// GET /api/produtos?categoria=Eletronicos
app.get('/api/produtos/ordenar', (req, res) => {
    // Pegar query parameters
    const { categoria, preco_max, preco_min, ordem, direcao } = req.query;

    // Começar com todos os produtos
    let resultado = produtos;

    // Aplicar filtro de categoria (se fornecido)
    if (categoria) {
        resultado = resultado.filter(p => p.categoria === categoria);
    } 

    // Filtro de preço máximo
    if (preco_max) {
        resultado = resultado.filter(p => p.preco === parseFloat(preco_max));
    }

    // Filtro de preço mínimo
    if (preco_min) {
        resultado = resultado.filter(p => p.preco === parseFloat(preco_min))
    }

    // Ordenação
    if (ordem) {
        resultado = resultado.sort((a, b) => {
            //Ordenar por preço
            if (ordem === 'preco') {
                return direcao = 'desc' // Se verdadeiro, decrescente / Se Falso, crescente
                ? b.preco - a.preco // Decrescente (Preço do B - Preço do A)
                : a.preco - b.preco; // Crescente (Preço do A - Preço do B)
            }

            //Ordenar por nome (alfabético)
            if (ordem === 'nome') {
                return direcao === 'desc' // Se verdadeiro, decrescente / Se Falso, crescente
                    ? b.nome.localeCompare(a.nome)
                    : a.nome.localeCompare(b.nome);
            }
        });
    }
    
    // Retornar o resultado filtrado
    res.json(resultado)
})



// Chamada da Porta para execução da API no dispositivo local
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});