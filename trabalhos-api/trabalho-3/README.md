# **API REST - Loja de Jogos**

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![License](https://img.shields.io/badge/Licen%C3%A7a-Educacional-blue?style=for-the-badge)

API RESTful completa para gerenciamento de jogos e usuários, com autenticação JWT e banco de dados SQLite.

---

## **Funcionalidades**

* **CRUD de Jogos:** Cadastro, leitura, atualização e exclusão de jogos.
* **Filtros e Paginação:** Busca por gênero, ano, nota e ordenação de resultados.
* **Autenticação Segura:** Registro e login de usuários com senhas hash (Bcrypt) e tokens de sessão (JWT).
* **Banco inicialmente populado:** O banco de dados é inicializado automaticamente com dados de teste caso esteja vazio.

---

## **Tecnologias**

* **[Node.js](https://nodejs.org/)** - Ambiente de execução
* **[Express](https://expressjs.com/)** - Framework web
* **[SQLite](https://www.sqlite.org/)** - Banco de dados relacional leve
* **[JSON Web Token (JWT)](https://jwt.io/)** - Autenticação da API
* **[Bcrypt](https://www.npmjs.com/package/bcrypt)** - Criptografia de senhas
* **[Dotenv](https://www.npmjs.com/package/dotenv)** - Gerenciamento de variáveis de ambiente

---

## **📂 Estrutura do Projeto**

```text
api/
├── middleware/
│   └── auth.js
├── database.js
├── index.js
├── package.json
├── .env
└── jogos.db
```

---

## **🚀 Como executar o projeto**

Necessário ter o **Node.js** (versão 14 ou superior) e o **npm** instalados primariamente.

Próximos passos:

```bash
# Clonar repositório
git clone https://github.com/usuario/minha-api.git

# Entrar no diretório
cd minha-api

# Instalar dependências
npm install

# Criar arquivo .env
# exemplo:
# JWT_SECRET=chave_secreta
# PORT=3000

# Rodar o servidor
node index.js
```

---

## **Banco de Dados (SQLite3)**

O projeto utiliza SQLite (arquivo `jogos.db`), gerenciado com a biblioteca better-sqlite3.

As tabelas são criadas automaticamente ao iniciar o servidor.

---

### **Tabela: jogos**

Armazena os jogos cadastrados na API.

**Campos**:
* id
* titulo
* desenvolvedora
* ano
* genero
* plataforma
* nota
* created_at


### **Tabela: usuarios**

Armazena os usuários do sistema com autenticação.

**Campos**:
* id
* nome
* email (único)
* senha (criptografada com bcrypt)
* role (perfil do usuário)
* created_at


### **Inicialização**

Ao iniciar a aplicação:

* As tabelas são criadas automaticamente (caso não existam)
* O banco verifica se já existem jogos cadastrados
* Caso esteja vazio, são inseridos dados iniciais para testes

---

## **📡 EndPoints da API**

Rotas presentes na API com diferentes responsabilidades.

### **Status e Informações**

* **GET /**

Retorna o status de funcionamento da API (Tela inicial).

![STATUS](./prints/GET/get_status.png)

* **GET /api/info**

Retorna informações básicas da API.

![INFO](./prints/GET/get_info.png)

---

### **Autenticação de usuário**

* **POST /auth/register**

Cadastrar novo usuário.

Informações de Cadastro:

```json
{
    "nome": "usuario1",
    "email": "usuario1@email.com",
    "senha": "123456"
}
```

![REGISTER](./prints/POST/post_register.png)

* **POST /auth/login**

Login de usuário e geração de token JWT.

Informações de Login:

```json
{
    "email": "usuario1@email.com",
    "senha": "123456"
}
```

![LOGIN](./prints/POST/post_login.png)

---

### **JOGOS**

#### GET /api/jogos

Lista jogos com filtros, ordenação e paginação.

```bash
localhost:3000/api/jogos
```

![JOGOS](./prints/GET/get_jogos.png)

### Query Parameters

| Parâmetro  | Tipo   | Padrão | Descrição |
|------------|--------|--------|-----------|
| **Filtros** | | | |
| `genero`   | string | —      | Filtra por gênero |
| `nota_min` | number | —      | Nota mínima |
| `nota_max` | number | —      | Nota máxima |
| `ano_min`  | number | —      | Ano de lançamento mínimo |
| `ano_max`  | number | —      | Ano de lançamento máximo |
| `busca`    | string | —      | Busca por título |
| **Ordenação** | | | |
| `ordem`    | enum   | —      | Campo: `titulo` \| `ano` \| `nota` |
| `direcao`  | enum   | —      | Direção: `asc` \| `desc` |
| **Paginação** | | | |
| `pagina`   | number | `1`    | Número da página |
| `limite`   | number | `10`   | Itens por página |

---

#### GET /api/jogos/:id

Buscar um jogo específico por ID.

```bash
localhost:3000/api/jogos/12
```

![JOGOS_ID](./prints/GET/get_jogos_id.png)

---

#### POST /api/jogos (**Protegida**)

Criar um novo jogo no banco.

Exemplo de POST:

```json
{
    "titulo": "Novo Jogo",
    "desenvolvedora": "Teste desenvolvedora",
    "ano": 2024,
    "genero": "RPG",
    "plataforma": "PC",
    "nota": 9.0
}
```

* Inserido a autorização no header para ser possível o POST via token do login do usuário.

![HEADER_TOKEN_POST](./prints/HEADER_TOKENS/header_token_post.png)


![POST_JOGO](./prints/POST/post_jogos.png)

---

#### PUT /api/jogos/:id (**Protegida**)

Atualizar todos os dados de um jogo existente.

Exemplo de PUT:

```json
{
    "titulo": "Novo nome",
    "desenvolvedora": "Desenvolvedora atualizada",
    "ano": 2025,
    "genero": "Aventura",
    "plataforma": "PS4",
    "nota": 10.0
}
```

* Inserido a autorização no header para ser possível o PUT via token do login do usuário.

![HEADER_TOKEN_POST](./prints/HEADER_TOKENS/header_token_put.png)

![PUT_JOGO](./prints/PUT/put_jogos.png)

---

#### DELETE /api/jogos/:id (**Protegida**)

Remover um jogo do banco de dados.

```bash
localhost:3000/api/jogos/17
```

* Inserido a autorização no header para ser possível o PUT via token do login do usuário.

![HEADER_TOKEN_DELETE](./prints/HEADER_TOKENS/header_token_delete.png)

![DELETE_JOGO](./prints/DELETE/delete_jogos.png)

---

## **Autenticação**

As rotas protegidas exigem que o cliente envie um token JWT válido no cabeçalho (header) da requisição. O formato esperado é:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Falhas na Autenticação** (Fornecimento / Formatação):

* **TOKEN NÃO FORNECIDO**

Ocorre quando o token não é fornecido via header e a requisição tem como resultado **STATUS CODE 401** (Informa que a requisição não possui autenticação)

![401_TOKEN_SEM_FORNECIMENTO](./prints/AUTH_FAILURE/token_nao_fornecido.png)

* **TOKEN MAL FORMATADO**

Ocorre quando o token é posto no HEADER porém com a formatação incorreta. Para autenticar corretamente, é necessário o uso do Bearer e o corpo do token para a requisição ser bem sucedida. Da mesma forma a requisição irá disparar o **STATUS CODE 401**.

![401_TOKEN_MAL_FORMATADO](./prints/AUTH_FAILURE/token_mal_formatado.png)

---

## 👨‍💻 Autor

Gabriel Casarini

## 📄 Licença

Projeto desenvolvido para fins educacionais.
