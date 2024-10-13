/*
CRIADO: GUILHERME HENRIQUE PORTO DOS SANTOS
MATRICULA: 202204463091
EMAIL: guilhermeportosantos1@gmail.com
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const commands = require('../../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGODB
require('dotenv').config(); // SOLICITA AS VARIÁVEIS DE AMBIENTE

// *************** POST ***************
// Controla todas as rotas de listagem e login de livros
router.post("/api/book/update_book", async (req, res) => {

    const { filter, newValue } = req.body; // RESERVA VALORES DO BODY
    const attrValid = ["titulo"]; // PERMITE APENAS ESSAS CHAVES COMO PARÂMETROS ACEITAVEIS PARA ATUALIZAR LIVROS

    // VERIFICA SE A VARIÁVEL FILTER ESTÁ VAZIA
    if (!filter || Object.keys(filter).length === 0 || typeof (filter) !== `object`) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "O campo [ filter ] não respeita uma ou mais regras de entrada, revise os dados e tente novamente",
            "data_base": ""
        });
        return true;

    }

    //VERIFICA SE O FILTER É VÁLIDO
    for (key in Object.keys(filter)) {

        var valor = Object.keys(filter)[key];
        if (attrValid.indexOf(valor) == -1) { // VERIFICA SE O FILTER RECEBIDO ESTÁ DE ACORDO COM AS VARIÁVEIS VÁLIDAS
            res.status(401).json({
                "codigo": process.env.CODE_FAIL,
                "resposta": process.env.MSG_SUCCESS_FAIL,
                "mensagem": "O campo [ filter ] não respeita uma ou mais regras de entrada, revise os dados e tente novamente",
                "data_base": ""
            });
            return false;
        }
    }

    // VERIFICA SE O NOVO VALOR ESTÁ VAZIO
    if (!newValue || Object.keys(newValue).length === 0 || typeof (newValue) !== `object`) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "O campo [ newValue ] não respeita uma ou mais regras de entrada, revise os dados e tente novamente",
            "data_base": ""
        });
        return true;

    }

    // VERIFICA SE FOI SOLICITADO A ALTERAÇÃO DO ID
    if (newValue["_id"] || newValue["id"]) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "O campo do tipo _id ou id não pode ser alterado, revise os dados e tente novamente",
            "data_base": ""
        });
        return true;

    }

    const shell_commands = new commands(); // CRIA O CONSTRUTOR
    const updateBook = await shell_commands.commandUpadateData('books', 'livros', filter, newValue); // INICIAR A FUNÇÃO ATUALIZA REGISTRO NO MONGO DB

    // VERIFICA SE EXISTE VALORES DUPLICADOS
    if (updateBook["keyValue"]) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "Nenhum registro foi alterado, revise os dados e tente novamente",
            "data_base": updateBook
        });
        return false;

    }

    // VERIFICA SE NÃO FOI FEITA NENHUMA ALTERAÇÃO
    if (!updateBook["result"]["modifiedCount"]) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "Nenhum registro foi alterado, verifique os valores informado e tente novamente",
            "data_base": updateBook
        });
        return false;

    }

    res.status(200).json({
        "codigo": process.env.CODE_SUCCESS,
        "resposta": process.env.MSG_SUCCESS,
        "mensagem": "Registro atualizado com sucesso",
        "data_base": updateBook
    });

});

// *************** ALL ***************
// Mensagem de erro personalizada para rotas não existemte apartir de /update_book
router.all("/api/user/update_book*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem": `O linkk expirou ou não existe, experimente acessar a documentação da API em ${process.env.HOST_API_DOC}/doc/update_book`,
        "data_base": ""
    });

});

module.exports = router;