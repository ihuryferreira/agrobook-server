/*
CRIADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com  
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const md5 = require('md5'); // EXTRAI O MODULO MD5 PARA CRIPTOGRAFAR SENHA
const commands = require('../../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGO DB
require('dotenv').config(); // SOLICITA AS VARIÁVEIS DE AMBIENTE

// *************** POST ***************
// Controla todas as rotas de listagem e login de usuário
router.post("/api/user/update_user", async (req, res) => {

    const { filter, newValue } = req.body; // RESERVA VALORES DO BODY

    // VERIFICA SE RECEBEU A SENHA
    if (newValue["senha"] && (newValue["senha"] && newValue["senha"].toString().length >= BigInt(process.env.PWD_MIN))) {
        newValue["senha"] = md5(process.env.PWD_PREFIX + newValue["senha"]);
    } else if (newValue["senha"]) {
        
        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "O campo [ senha ] não respeita uma ou mais regras de entrada, revise os dados e tente novamente",
            "data_base": ""
        });
        return true;

    }

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

    // VERIFICA SE FOI SOLICIATADO A ALTERAÇÃO DO EMAIL
    if (newValue["email"]) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "O campo do tipo email não pode ser alterado, revise os dados e tente novamente",
            "data_base": ""
        });
        return true;

    }

    // VERIFICA SE FOI SOLICITADO A ALTERAÇÃO DO DOCUMENTO
    if (newValue["documento"]) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "O campo do tipo documento não pode ser alterado, revise os dados e tente novamente",
            "data_base": ""
        });
        return true;

    }

    const shell_commands = new commands(); // CRIA O CONSTRUTOR
    const updateUser = await shell_commands.commandUpadateData('books', 'usuarios', filter, newValue); // INICIAR A FUNÇÃO ATUALIZAR REGISTRO NO MONGO DB

    // VERIFICA EXISTE VALORES DUPLICADOS
    if (updateUser["keyValue"]) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "Nenhum registro foi alterado, revise os dados e tente novamente",
            "data_base": updateUser
        });
        return false;

    }

    // VERIFICA SE NÃO FOI FEITA NENHUMA ALTERAÇÃO
    if (!updateUser["result"]["modifiedCount"]) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "Nenhum registro foi alterado, verifique os valores informado e tente novamente",
            "data_base": updateUser
        });
        return false;

    }

    res.status(200).json({
        "codigo": process.env.CODE_SUCCESS,
        "resposta": process.env.MSG_SUCCESS,
        "mensagem": "Registro atualizado com sucesso",
        "data_base": updateUser
    });

});

// *************** ALL ***************
// Mensagem de erro personalizada para rotas não existente apartir de /update_user
router.all("/api/user/update_user*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem": `O linkk expirou ou não existe, experimente acessar a documentação da API em ${process.env.HOST_API_DOC}/doc/update_user`,
        "data_base": ""
    });

});

module.exports = router;