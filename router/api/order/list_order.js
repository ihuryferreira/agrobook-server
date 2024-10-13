/*
CRIADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const check_user = require('../../../middleware/auth/jwt_mongodb'); // PUXA FUNÇÃO QUE VÁLIDA SESSÃO DO USUÁRIO
const commands = require('../../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGODB
require('dotenv').config(); // SOLICÍTA AS VARIÁVEIS DE AMBIENTE

// *************** POST ***************
// Controla todas as rotas de listar pedidos
router.post("/api/order/list_order", async (req, res) => {

    var { collections, filter, sort, limit } = req.body; // RESERVA TODAS AS VARIÁVEIS RECEBIDAS

    const check_data = new check_user(); // CRIA O CONSTRUTOR
    const result = await check_data.initSyncSingIn(req); // EXECUTA A FUNÇÃO DO CONSTRUTOR
    const cookieUserData = result[0]['validToken']; // RECUPERA OS DADOS DA FUNÇÃO

    // VERIFICA VALORES RECEBIDOS
    if (collections && filter && sort && limit) {

        // VERIFICA SE O OBJETO [ collection ] E UM OBJETO
        if (typeof (collections) != 'object') {
            res.status(401).json({
                "codigo": process.env.CODE_FAIL,
                "resposta": process.env.MSG_SUCCESS_FAIL,
                "mensagem": "O objeto [ collections ] informado não segue o padrão esperado",
                "data_base": ""
            });
            return true;
        }

        // VERIFICA SE O OBJETO [ filter ] E UM OBJETO
        if (typeof (filter) != 'object') {
            res.status(401).json({
                "codigo": process.env.CODE_FAIL,
                "resposta": process.env.MSG_SUCCESS_FAIL,
                "mensagem": "O objeto [ filter ] informado não segue o padrão esperado",
                "data_base": ""
            });
            return true;
        }

        // VERIFICA SE O OBJETO [ sort ] E UM OBJETO
        if (typeof (sort) != 'object') {
            res.status(401).json({
                "codigo": process.env.CODE_FAIL,
                "resposta": process.env.MSG_SUCCESS_FAIL,
                "mensagem": "O objeto [ sort ] informado não segue o padrão esperado",
                "data_base": ""
            });
            return true;
        }

        // VERIFICA SE O OBJETO [ limit ] E UM NUMERO
        if (typeof (limit) != 'number') {
            res.status(401).json({
                "codigo": process.env.CODE_FAIL,
                "resposta": process.env.MSG_SUCCESS_FAIL,
                "mensagem": "O objeto [ limit ] informado não segue o padrão esperado",
                "data_base": ""
            });
            return true;
        }

        let listLookup = []; // RESERVA LISTA DE JOIN RECEBIDA DA API VIA [ collections ]

        // TENTA FORMATAR O JSON RECEBIDO PARA SER LIDO PELO MONGODB [ match ]
        try {

            // VERIFICA SE O USUARIO E ADM OU COMUN
            if (cookieUserData.cargo != 0) {
                filter["usuario"] = { "$oid": cookieUserData.id }
            }

            // ADICIONA O MATCH NO FILTER
            listLookup.push({ "$match": filter });
        } catch (errMatch) {

        }

        // LOOP PARA CRIAR OS JOIN
        for (row in collections) {
            if (row > 0) {
                listLookup.push({ "$lookup": collections[row] }); // ADICIONA O ELEMENTO DO LOOKUP NO NOVO OBJETO FILTERR
            }
        }

        const shell_commands = new commands(); // CRIA UM CONSTRUTOR
        const listOrderAgregate = await shell_commands.commandreadDataByIdAgregation('books', collections, listLookup, sort, limit); // EXCULTA FUNÇÃO EXPORTADA QUE AGREGA REGISTROS DO DB

        // PASSOU NA VARREDURA
        res.status(200).json({
            "codigo": process.env.CODE_SUCCESS,
            "resposta": process.env.MSG_SUCCESS,
            "mensagem": "Lista de registros recuperada com sucesso",
            "data_base": listOrderAgregate
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
// Mensagem de erro personalizada para rotas não existente apartir de /list_user
router.all("/api/user/list_user*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem": "O link expirou ou não existe, experimente acessar a documentação da API em htpp://localhost:57603/doc/list_user",
        "data_base": ""
    });

});

module.exports = router;