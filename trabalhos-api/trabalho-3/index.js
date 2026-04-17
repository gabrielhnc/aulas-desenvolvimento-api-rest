// Importar Express e Banco
const express = require('express');
const db = require('./database');
require('dotenv').config();

// Criar aplicação
const app = express();
app.set('json spaces', 2);

// Middleware
app.use(express.json());

// JWT
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const autenticar = require('./middleware/auth')

// Porta
const PORT = process.env.PORT

// ========================================

// ENDPOINT INICIAL
app.get('/', (req, res) => {
    res.json({
        mensagem: 'API para manipulação de Jogos (com banco de dados)',
        status: 'sucesso',
        timestamp: new Date().toISOString()
    });
});

// INFO
app.get('/api/info', (req, res) => {
    res.json({
        nome: 'API REST de Jogos',
        versao: '3.0.0',
        autor: 'Gabriel Casarini'
    });
});


// GET JOGOS (com filtros, ordenação e paginação)
app.get('/api/jogos', (req, res) => {
    try {
        const { 
            genero, nota_min, nota_max, 
            ano_min, ano_max, busca, 
            ordem, direcao,
            pagina = 1, 
            limite = 10 
        } = req.query;

        let sql = 'SELECT * FROM jogos WHERE 1=1';
        let params = [];

        // FILTROS
        if (genero) {
            sql += ' AND genero = ?';
            params.push(genero);
        }

        if (nota_min) {
            sql += ' AND nota >= ?';
            params.push(parseFloat(nota_min));
        }

        if (nota_max) {
            sql += ' AND nota <= ?';
            params.push(parseFloat(nota_max));
        }

        if (ano_min) {
            sql += ' AND ano >= ?';
            params.push(parseInt(ano_min));
        }

        if (ano_max) {
            sql += ' AND ano <= ?';
            params.push(parseInt(ano_max));
        }

        if (busca) {
            sql += ' AND LOWER(titulo) LIKE ?';
            params.push(`%${busca.toLowerCase()}%`);
        }

        // ORDENAÇÃO
        const camposValidos = ['titulo', 'ano', 'nota'];

        if (ordem && camposValidos.includes(ordem)) {
            sql += ` ORDER BY ${ordem}`;
            sql += direcao === 'desc' ? ' DESC' : ' ASC';
        }

        // CONTAR TOTAL
        const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
        const total = db.prepare(countSql).get(...params).total;

        // PAGINAÇÃO
        const limiteNum = parseInt(limite);
        const paginaNum = parseInt(pagina);
        const offset = (paginaNum - 1) * limiteNum;

        sql += ' LIMIT ? OFFSET ?';
        params.push(limiteNum, offset);

        const jogos = db.prepare(sql).all(...params);

        res.json({
            dados: jogos,
            paginacao: {
                pagina_atual: paginaNum,
                itens_por_pagina: limiteNum,
                total_itens: total,
                total_paginas: Math.ceil(total / limiteNum)
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro na busca' });
    }
});


// BUSCAR POR ID
app.get('/api/jogos/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const jogo = db.prepare(
            'SELECT * FROM jogos WHERE id = ?'
        ).get(id);

        if (!jogo) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }

        res.json(jogo);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar jogo' });
    }
});


// POST - CRIAR JOGO
app.post('/api/jogos', autenticar, (req, res) => {
    try {
        const { titulo, desenvolvedora, ano, genero, plataforma, nota } = req.body;

        // VALIDAÇÕES
        if (!titulo || !desenvolvedora || !ano || !genero || !plataforma || !nota) {
            return res.status(400).json({
                erro: "Campos obrigatórios: titulo, desenvolvedora, ano, genero, plataforma, nota"
            });
        }

        if (typeof nota !== 'number' || nota < 0 || nota > 10) {
            return res.status(400).json({ erro: "Nota deve estar entre 0 e 10" });
        }

        const stmt = db.prepare(`
            INSERT INTO jogos (titulo, desenvolvedora, ano, genero, plataforma, nota)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(titulo, desenvolvedora, ano, genero, plataforma, nota);

        const novoJogo = db.prepare(
            'SELECT * FROM jogos WHERE id = ?'
        ).get(result.lastInsertRowid);

        res.status(201).json(novoJogo);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao criar jogo' });
    }
});


// PUT - ATUALIZAR JOGO
app.put('/api/jogos/:id', autenticar, (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { titulo, desenvolvedora, ano, genero, plataforma, nota } = req.body;

        if (!titulo || !desenvolvedora || !ano || !genero || !plataforma || !nota) {
            return res.status(400).json({
                erro: "Campos obrigatórios faltando"
            });
        }

        if (nota < 0 || nota > 10) {
            return res.status(400).json({ erro: "Nota inválida" });
        }

        const stmt = db.prepare(`
            UPDATE jogos
            SET titulo = ?, desenvolvedora = ?, ano = ?, genero = ?, plataforma = ?, nota = ?
            WHERE id = ?
        `);

        const result = stmt.run(
            titulo, desenvolvedora, ano, genero, plataforma, nota, id
        );

        if (result.changes === 0) {
            return res.status(404).json({ erro: "Jogo não encontrado" });
        }

        const jogoAtualizado = db.prepare(
            'SELECT * FROM jogos WHERE id = ?'
        ).get(id);

        res.json(jogoAtualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao atualizar jogo' });
    }
});


// DELETE - REMOVER JOGO
app.delete('/api/jogos/:id', autenticar, (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const result = db.prepare(
            'DELETE FROM jogos WHERE id = ?'
        ).run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                erro: "Jogo não encontrado"
            });
        }

        res.status(204).send();

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao deletar jogo' });
    }
});


// POST /auth/register
app.post('/auth/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // 1. Validações
        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Campos obrigatórios' });
        }
        
        if (senha.length < 5) {
            return res.status(400).json({ erro: 'Senha mínimo 5 caracteres' });
        }
        
        // 2. Verificar se email já existe
        const usuarioExiste = db.prepare(
            'SELECT id FROM usuarios WHERE email = ?'
        ).get(email);
        
        if (usuarioExiste) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }
        
        // 3. Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        
        // 4. Inserir usuário
        const result = db.prepare(`
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `).run(nome, email, senhaHash);
        
        const userId = result.lastInsertRowid;
        
        // 5. Gerar token JWT
        const token = jwt.sign(
            { userId, email }, // payload
            JWT_SECRET,                // secret
            { expiresIn: '24h' }     // expira em 24h
        );
        
        // 6. Retornar token + dados (SEM senha!)
        res.status(201).json({
            mensagem: 'Usuário criado com sucesso',
            token,
            usuario: { id: userId, nome, email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
});


// POST /auth/login
app.post('/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // 1. Validações
        if (!email || !senha) {
            return res.status(400).json({ erro: 'Email e senha obrigatórios' });
        }
        
        // 2. Buscar usuário por email
        const usuario = db.prepare(
            'SELECT * FROM usuarios WHERE email = ?'
        ).get(email);
        
        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }
        
        // 3. Comparar senhas
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }
        
        // 4. Gerar token JWT
        const token = jwt.sign(
            { userId: usuario.id, email: usuario.email, role: usuario.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // 5. Retornar token + dados (SEM senha!)
        res.json({
            mensagem: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro no login' });
    }
});


// INICIAR SERVIDOR
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
