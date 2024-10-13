/*
CRIADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com  
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const bcrypt = require("bcryptjs"); // EXTRAI O MODULO PARA CRIPTOGRAFAR
const jwt = require("jsonwebtoken"); // EXTRAI O MODULO JSON WEB TOKEN PARA CRIPTOGRAFAR SESSÃO
const md5 = require('md5'); // EXTRAI O MODULO MD5 PARA CRIPTOGRAFAR SENHA
const check_user = require('../../middleware/jwt/jwt'); // EXTRAI FUNÇÕES PARA MANIPULAR O JWT
const command = require('../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGO DB
const { validate } = require("email-validator"); // EXTRAI BIBLIOTECA PARA VÁLIDAR EMAIL
require('dotenv').config(); // SOLICITA AS VARIÁVEIS DE AMBIENTE

// *************** DLC [ GERAR HASH ] ***************
// Essa arrow function recebe os dados do usuário e gerar um hash usando [ JWT + BCRYPT ] com validade de acordo com o perfil do usuário
const gerarHash = async (email, senha, user, req) => {

    const saltRounds = 10; // TOTAL DE NUMEROS PARA O HASH
    var expirateSessionUserMongo;
    
    // TENTA DEFINIR A EXPIRAÇÃO DA SENHA VIA MONGO DB
    try {
        expirateSessionUserMongo = user["expiracao_sessao"];
    }catch (x) {
        expirateSessionUserMongo = false
    }

    // CRIPTOGRAFA O EMAIL E SENHA
    return bcrypt.hash(email + '+' + senha, saltRounds).then(function (hash) {

        // FAZ A COMPARAÇÃO DO HASH A FIM DE VERIFICAR SE E VÁLIDO
        return bcrypt.compare(email + '+' + senha, hash).then(function (result) {

            // SALVA NOS COKIES O HASH CASO SEJA VÁLIDO
            if (result) {

                var token = jwt.sign({
                    "hash_mail_pass": hash,
                    "id": user["_id"],
                    "nome": user["nome"],
                    "documento": user["documento"],
                    "email": user["email"],
                    "cargo": user["cargo"],
                    "status": user["status"],
                    "resetar_senha": user["resetar_senha"]
                },
                    process.env.SECRET_JWT, // PUXA O SECREAT DO ARQUIVO .ENV
                    {
                        expiresIn: expirateSessionUserMongo ? expirateSessionUserMongo : !JSON.parse(process.env.EXPIRATE_JWT)[0][user["cargo"]] ? "30min" : JSON.parse(process.env.EXPIRATE_JWT)[0][user["cargo"]], // DEFINE A VALIDADE DO HASH
                    }
                );

                req.session.HASH_MAIL_PASS = token; // DEFINE O SESSION NO CACHE
                return token; // RETORNA O TOKEN

            }

        });

    });

}

// *************** POST ***************
// Controla todas as entradas da autenticação
router.post("/auth/singin", async (req, res) => {

    const check_data = new check_user(); // CRIA UM CONSTRUTOR
    const result = await check_data.check(req); // EXECUTA A FUNÇÃO DENTRO DO CONTRUTOR
    var cookieData = result[0]['validToken']; // RESERVA O VALOR RECEBIDO

    const { email, senha } = req.body; // RECUPERA OS DADOS DO BODY

    const newPassword = md5(process.env.PWD_PREFIX + senha); // CONVERTE A SENHA PARA O FORMATO EM PREFIXO + MD5 

    const emailValidate = validate(email); // VÁLIDA SE O EMAIL E VÁLIDO OU NÃO USANDO BIBLIOCA EXTERNA

    // VERIFICA SE O EMAIL RECEBIDO E INVÁLIDO
    if (!emailValidate) {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "O email recebido não é válido, verifique os dados e tente novamente",
            "data_base": ""
        });
        return true;

    }

    const filter = { // CRIA O FILTRO DA BUSCA
        "email": email,
        "senha": newPassword,
    };
    const sort = { // [ sort ] O MESMO QUE [ order by ] NO SQL
        "_id": -1
    };
    const limit = 1; // LIMITE DE RETORNO DA BUSCA O MESMO QUE [ top 1 ou limit 1 ] NO SQL
    const shell_commands = new command(); // CRIA UM CONSTRUTOR
    const readData = await shell_commands.commandReadData(`books`, `usuarios`, filter, sort, limit);

    // VERIFICA SE O EMAIL E SENHA ESTA INCORRETO
    if (readData["result"].length === 0) { // VERIFICA SE RECEBEU UM OBJETO VAZIO

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "Email ou senha incorreto, revise os dados e tente novamente",
            "data_base": readData
        });
        return true;

    }

    // VERIFICA SE O USUÁRIO ESTA COM STATUS [ 0 ]
    if (readData["result"][0]["status"] === 0) { // VERIFICA SE RECEBEU UM ATRIBUTO [ status ] COMO [ 0 ]

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "Esse usuário não está autorizado a relizar o login, contate seu administrador para liberar o acesso",
            "data_base": ""
        });
        return true;

    }

    const hash = await gerarHash(email, newPassword, readData["result"][0], req); // PASSA OS PARAMETROS PARA UMA ARROW FUCTION QUE GERAR UM HASH USANDO [ JWT + BCRYPT ]
    
    // VERIFICA SE O USUÁRIO JÁ ESTA LOGADO
    if (cookieData["hash_mail_pass"] !== "false") {

        res.status(200).json({
            "codigo": process.env.CODE_SUCCESS,
            "resposta": process.env.MSG_SUCCESS,
            "mensagem": "Você já está logado",
            "data_base": readData,
            "hash": cookieData
        });
        return true;

    }

    res.status(200).json({
        "codigo": process.env.CODE_SUCCESS,
        "resposta": process.env.MSG_SUCCESS,
        "mensagem": "Login realizado com sucesso",
        "data_base": readData,
        "hash": hash
    });

});

// *************** POST ***************
// Controla todas as entradas de validação da autenticação
router.post("/auth/singin/valid", async (req, res) => {

    const check_data = new check_user(); // CRIA UM CONSTRUTOR
    const result = await check_data.check(req); // EXECULTA A FUNÇÃO DENTRO DO CONSTRUTOR
    var cookieData = result[0]['validToken']; // RESERVA O VALOR RECEBIDO

    // VERIFICA SE O USUÁRIO ESTA DESLOGADO
    if (cookieData["hash_mail_pass"] == "false") {

        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_FAIL,
            "mensagem": "O usuário não está autenticado, realize o login e tente novamente",
            "auth": cookieData,
            "data_base": ""
        });
        return false;

    }

    res.status(200).json({
        "codigo": process.env.CODE_SUCCESS,
        "resposta": process.env.MSG_SUCCESS,
        "mensagem": "O usuário está com a sessão válida",
        "auth": cookieData,
        "data_base": ""
    });

});

// *************** DELETE ***************
// Controla todas as entradas de exclusão da sessão
router.delete("/auth/singin/logout", async (req, res) => {

    req.session = null; // LIMPA SESSÃO SALVA

    res.status(200).json({
        "codigo": process.env.CODE_SUCCESS,
        "resposta": process.env.MSG_SUCCESS,
        "mensagem": "A sessão foi desconectada com sucesso",
        "data_base": ""
    });

});

// *************** ALL ***************
// Mensagem de erro personalizada para rotas não existente apartir de /singin
router.all("/auth/singin*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem": `O link expirou ou não existe, experimente acessar a documentação da API em ${process.env.HOST_API_DOC}/doc/singin`,
        "data_base": ""
    });

});

module.exports = router;