/*
CRIADO: GUILHERME HENRIQUE PORTO DOS SANTOS
MATRICULA: 202204463091
EMAIL: guilhermeportosantos1@gmail.com
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const commands = require('../../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGO DB
require('dotenv').config(); // SOLICITA AS VARIÁVEIS DE AMBIENTE

// *************** LINK TYPE ***************
// Verifica o tipo do link recebido pela api
const linkType = async (url) => {
    // A FAZER
}

// *************** POST ***************
// Controla todas as rotas de criação de livros
router.post("/api/book/create_book", async (req, res) => {

    var { titulo, capa, sinopse, paginas, categorias, autor, idioma, data_lancamento, total_estoque } = req.body; // RESERVA TODAS AS VARIÁVEIS RECEBIDAS

    const dateNow = new Date();

    if (!capa) { //INSERE IMAGEM PADRÃO 
        capa = 'https://www.ira-sme.net/wp-content/themes/consultix/images/no-image-found-360x260.png';
    }

    // VERIFICA VALORES RECEBIDOS
    if (
        titulo // VERIFICA SE O TITULO NÃO ESTÁ VAZIO
        && sinopse // VERIFICA SE A SINOPSE NÃO ESTA VAZIO
    ) {

        // QUERY DE BUSCA, TITULO INDEPENDENTE MAIÚSCULA MINÚSCULA
        const queryfind = {
            "titulo": { "$regex": titulo, "$options": "i" }
        };
        const sort = {
            "registro_criado_em": -1
        };
        const limit = 1;
        const regex_command = new commands(); // CRIA UM CONSTRUTOR
        const read_book = await regex_command.commandReadData('books', 'livros', queryfind, sort, limit);
        
        if(read_book.result.length < 1){
            const query = { // CRIA O OBJETO
                "titulo": titulo, //Regex insensível maiúsculas e minúsculas
                "capa": capa,
                "sinopse": sinopse,
                "paginas": parseInt(paginas),
                "categorias": categorias,
                "autor": autor,
                "idioma": idioma,
                "data_lancamento": data_lancamento,
                "total_estoque": parseInt(total_estoque),
                "registro_criado_em": dateNow,// DATA ATUAL DA CRIAÇÃO
                "registro_atualizado_em": dateNow // DATA ATUAL DA CRIAÇÃO
            }
    
            const shell_commands = new commands(); // CRIA UM CONSTRUTOR
            const createBook = await shell_commands.commandCreateData('books', 'livros', query); // INICIAR A FUNÇÃO EXPORTADA
    
            // VERIFICA SE EXITES VALORES DUPLICADOS
            if (createBook.keyValue) {
    
                // PASSOU NA VARREDURA MAS ENCONTROU ERRO [ CHAVES DUPLICADAS ]
                res.status(401).json({
                    "codigo": process.env.CODE_FAIL,
                    "resposta": process.env.MSG_SUCCESS_FAIL,
                    "mensagem": "Livro já existente no sistema",
                    "data_base": createBook
                });
                return true;
    
            } else {
    
                // PASSOU NA VARREDURA
                res.status(200).json({
                    "codigo": process.env.CODE_SUCCESS,
                    "resposta": process.env.MSG_SUCCESS,
                    "mensagem": "Livro criado com sucesso",
                    "data_base": createBook
                });
                return true;
    
            }
        }

        // REPROVOU NA VARREDURA DE VALORES JÁ EXISTENTES
        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "Livro já existente no sistema",
            "data_base": read_book
        });
        return true;
    } else {

        // REPROVOU NA VARREDURA
        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_FAIL,
            "mensagem": "Os dados informados não segue o padrão do sistema, revise-os e tente novamente",
            "data_base": ""
        });
        return true;

    }

});

// *************** ALL ***************
// Mensagem de erro personalizada para rotas não existemte a partir de /create_book
router.all("/api/user/create_book*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem": `O link expirou ou não existe, experimente acessar a documentacao da API em ${process.env.HOST_API_DOC}/doc/create_book`,
        "data_base": ""
    });

});

module.exports = router;