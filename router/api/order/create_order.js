/*
CRIADO: GUILHERME HENRIQUE PORTO DOS SANTOS
MATRICULA: 202204463091
EMAIL: guilhermeportosantos1@gmail.com
---------
EDITADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const check_user = require('../../../middleware/auth/jwt_mongodb'); // PUXA FUNÇÃO QUE VÁLIDA SESSÃO DO USUÁRIO
const commands = require('../../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGODB
require('dotenv').config(); // SOLICÍTA AS VARIÁVEIS DE AMBIENTE

// *************** POST ***************
// Controla todas as rotas de criação de usuário
router.post("/api/order/create_order", async (req, res) => {

    var { livro, data_vencimento } = req.body; // RESERVA TODAS AS VARIÁVEIS RECEBIDAS

    const check_data = new check_user(); // CRIA O CONSTRUTOR
    const result = await check_data.initSyncSingIn(req); // EXECUTA A FUNÇÃO DO CONSTRUTOR
    const cookieUserData = result[0]['validToken']; // RECUPERA OS DADOS DA FUNÇÃO

    const dataAluguel = new Date();
    const dataVencimento = new Date(new Date(dataAluguel.getTime()).getTime() + 60 * 60 * 24 * 1000); // ADICIONA 24 HORAS PARA O VENCIMENTO

    // VERIFICA VALORES RECEBIDOS
    if (livro) {

        const query = { // CRIA O OBJETO
            "livro": { "$oid": livro },
            "usuario": { "$oid": cookieUserData.id },
            "status": 0,
            "data_aluguel": dataAluguel.getTime(),
            "data_vencimento": dataVencimento.getTime(),
            "entregou": 0,
            "recebeu": 0
        }
        const shell_commands = new commands(); // CRIA UM CONSTRUTOR
        const createorder = await shell_commands.commandCreateData('books', 'pedidos', query); // INICIA A FUNÇÃO EXPORTADA

        // VERIFICA SE EXITE VALORES DUPLICADOS
        if (createorder.keyValue) {

            // PASSOU NA VARREDURA MAIS ENCONTROU ERRO [ CHAVES DUPLICADAS ]
            res.status(401).json({
                "codigo": process.env.CODE_FAIL,
                "resposta": process.env.MSG_SUCCESS_FAIL,
                "mensagem": "Pedido já existe, verifique os parametros e tente novamente",
                "data_base": createorder
            });
            return true;

        }

        // PASSOU NA VARREDURA
        res.status(200).json({
            "codigo": process.env.CODE_SUCCESS,
            "resposta": process.env.MSG_SUCCESS,
            "mensagem": "Pedido criado com sucesso",
            "data_base": createorder
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
// Mensagem de erro personalizada para rotas não existente apartir de /create_order
router.all("/api/user/create_order*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem": "O link expirou ou não existe, experimente acessar a documentação da API em htpp://localhost:57603/doc/create_order",
        "data_base": ""
    });

});

module.exports = router;