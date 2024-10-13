/*
CRIADO: GUILHERME HENRIQUE PORTO DOS SANTOS
MATRICULA: 202204463091
EMAIL: guilhermeportosantos1@gmail.com
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const commands = require('../../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGO DB
const check_user = require('../../../middleware/auth/jwt_mongodb'); // PUXA FUNÇÃO QUE VALIDA SESSÃO DO USUÁRIO
require('dotenv').config(); // SOLICITA AS VARIÁVEIS DE AMBIENTE

// *************** DELETE ***************
// Controla todas as entrada de apagar usuário
router.delete("/api/book/delete_book", async (req, res) => {

    const { filter } = req.body; // RESERVA OS VALORES RECEBIDOS VIA BODY
    const keysValid = [ '_id', 'titulo']; // CRIA UMA LISTA DE KEYS VÁLIDAS
    let statusLoopValidFilter = 0;

    

    // VERIFICA SE A VARIÁVEL [ filter ] NÃO ESTÁ VAZIA
    if (!filter || Object.keys(filter).length === 0 || typeof (filter) !== `object`) {
        
        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": `O campo [ filter ] não respeita uma ou mais regras de entrada, revise os dados e tente novamente`,
            "data_base": ""
        });
        return true;

    }

    // FAZ UMA VARREDURA NO OBJETO [ filter ]
    const keysRecived = Object.keys(filter);
    for (key in keysRecived) { // INICIAR A VARREDURA NO OBJETO [ filter ] recebido

        for (row in keysValid) { // VARRE TODOS AS KEYS VÁLIDAS A FIM DE LOCALIZAR ALGUMA CORRESPONDÊNCIA VÁLIDA

            if (keysRecived[key].indexOf(keysValid[row]) == 0) { // PAUSA A VARREDURA SE LOCALIZAR UMA CORRESPONDÊNCIA VÁLIDA
                statusLoopValidFilter = 1;
                break; // FINALIZA O FOR
            }
        
        }

        // ANTES DE INICAR UM NOVO LOOP VERIFICA SE ACHOU UMA CORRESPONDÊNCIA VÁLIDA PARA PAUSAR O LOOP
        if (statusLoopValidFilter == 1) {
            break; // FINALIZA O FOR
        }

    }

    // VERIFICA SE NÃO ENCONTROU UMA CORRENSPONDÊNCIA VÁLIDA
    if (statusLoopValidFilter == 0) {
        
        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": `O campo [ filter ] não contém nenhum destes valores [ ${keysValid} ] válidos para realizar a operação, revise os dados e tente novamente`,
            "data_base": ""
        });
        return true;

    } 
    
    const shell_command = new commands(); // CRIA UM CONSTRUTOR
    const deleteData = await shell_command.commandDeleteData('books', 'livros', filter); // EXECULTA A FUNÇÃO QUE EXCLUE O REGISTRO NO MONGODB

    // VERIFICA SE NÃO APAGOU NENHUM REGISTRO
    if (!deleteData["result"]["deletedCount"]) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": `Nenhum registro apagado, revise os dados e tente novamente`,
            "data_base": deleteData
        });
        return true;
    }

    res.status(200).json({
        "codigo": process.env.CODE_SUCCESS,
        "resposta": process.env.MSG_SUCCESS,
        "mensagem": `O registro foi excluido com sucesso`,
        "data_base": deleteData
    });

});

// *************** ALL ***************
// Mensagem de erro personalizada para rotas não existente apartir de /delete_book
router.all("/api/user/delete_book*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem": `O link expirou ou não existe, experimente acessar a documentação da API em ${process.env.HOST_API_DOC}/doc/delete_book`,
        "data_base": ""
    });

});

module.exports = router;