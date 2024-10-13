/*
CRIADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com  
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const md5 = require('md5'); // EXTRAI O MODULO MD5 PARA CRIPTOGRAFAR SENHA
const commands = require('../../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGODB
const { cpf, cnpj } = require('cpf-cnpj-validator'); // EXTRAI BIBLIOTECA PARA VALIDAR DOCUMENTO
const { validate } = require("email-validator"); // EXTRAI BIBLIOTECA PARA VALIDAR EMAIL
require('dotenv').config(); // SOLICÍTA AS VARIÁVEIS DE AMBIENTE

// *************** POST ***************
// Controla todas as rotas de criação de usuário
router.post("/api/user/create_user", async (req, res) => {

    var { nome, documento, email, senha, cargo, status } = req.body; // RESERVA TODAS AS VARIÁVEIS RECEBIDAS
    
    // VERIFICA SE O DOCUMENTO ESTÁ VAZIO
    if (!documento) {
        documento = "00000000000";
    }

    let validDocument = documento.length <= 11 ? cpf.isValid(JSON.stringify(documento)) : cnpj.isValid(JSON.stringify(documento)) // VERIFICA SE O VALOR NA ENTRADA [ DOCUMENTO ] É VÁLIDO
    const validEmail = validate(email); // VÁLIDA A ENTRADA DE E-MAIL USANDO BIBLIOTECA EXTERNA

    // VERIFICA SE O DOCUMENTO E INVÁLIDO
    if (!validDocument) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "O documento informado e inválido",
            "data_base": ""
        });
        return true;

    }

    // VERIFICA SE O EMAIL E INVÁLIDO
    if (!validEmail) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "O e-mail informado e inválido",
            "data_base": ""
        });
        return true;

    }

    // VERIFICA VALORES RECEBIDOS
    if (
        nome // VERIFICA SE O NOME NÃO ESTÁ VAZIO
        && ((documento) && ((documento)).toString().length >= BigInt(process.env.DOCUMENT_MIN)) // VERIFICA SE O DOCUMENTO E INTEIRO E MAIOR QUE 10
        && email // VERIFICA SE O E-MAIL NÃO ESTÁ VAZIO
        && (senha && senha.toString().length >= BigInt(process.env.PWD_MIN)) /* VERIFICA SE A SENHA NÃO ESTÁ VAZIA E SE É MAIOR QUE 8 */) {

        const query = { // CRIA O OBJETO
            "nome": nome,
            "documento": documento,
            "email": email,
            "senha": md5(process.env.PWD_PREFIX + senha), // CONVERTE EM MD5 COM O PREFIXO QUE ESTA NO .ENV
            "cargo": cargo,
            "status": status,
            "resetar_senha": 1
        }
        const shell_commands = new commands(); // CRIA UM CONSTRUTOR
        const createUser = await shell_commands.commandCreateData('books', 'usuarios', query); // INICIA A FUNÇÃO EXPORTADA

        // VERIFICA SE EXITE VALORES DUPLICADOS
        if (createUser.keyValue) {

            // PASSOU NA VARREDURA MAIS ENCONTROU ERRO [ CHAVES DUPLICADAS ]
            res.status(401).json({
                "codigo": process.env.CODE_FAIL,
                "resposta": process.env.MSG_SUCCESS_FAIL,
                "mensagem": "Usuário já existe, experimente redefinir a senha ou inserir outro usuário",
                "data_base": createUser
            });
            return true;

        }

        // PASSOU NA VARREDURA
        res.status(200).json({
            "codigo": process.env.CODE_SUCCESS,
            "resposta": process.env.MSG_SUCCESS,
            "mensagem": "Usuário criado com sucesso",
            "data_base": createUser
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
// Mensagem de erro personalizada para rotas não existente apartir de /create_user
router.all("/api/user/create_user*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem": "O link expirou ou não existe, experimente acessar a documentação da API em htpp://localhost:57603/doc/create_user",
        "data_base": ""
    });

});

module.exports = router;