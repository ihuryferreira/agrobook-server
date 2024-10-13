/*
CRIADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com  
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const commands = require('../../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGODB
require('dotenv').config(); // SOLICÍTA AS VARIÁVEIS DE AMBIENTE

// *************** GET ***************
// Controla todas as rotas de listagem e login de usuário
router.post("/webhook/trello/card/update", async (req, res) => {

    // VERIFICA SE O BODY ESTÁ VAZIO
    if (Object.keys(req.body).length === 0) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem":"Nenhum valor foi recebido pelo BODY, revise sua solicitação e tente novamente",
            "data_base": ""
        });
        return true;

    }

    const shell_commands = new commands(); // CRIA UM CONSTRUTOR
    const insertLog = await shell_commands.commandCreateData(`books`, `log`, req.body); // EXECUTA A FUNÇÃO QUE LER REGISTRO NO BANCO DE DADOS 

    res.status(200).json({
        "codigo": process.env.CODE_SUCCESS,
        "resposta": process.env.MSG_SUCCESS,
        "mensagem":"Registro inserido com sucesso",
        "data_base": insertLog
    });

});

// *************** ALL ***************
// Mensagem de erro personalizada para rotas não existente apartir de /update
router.all("/webhook/trello/card/update*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem":"O link expirou ou não existe, experimente acessar a documentação da API em htpp://localhost:57603/doc/trello",
        "data_base": ""
    });

});

module.exports = router;