/*
CRIADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com  
*/

const express = require("express"); // EXTRAI O MODULO DO EXPRESS
var router = express.Router(); // EXTRAI O MODULO DE ROTAS
const md5 = require('md5'); // EXTRAI O MODULO MD5 PARA CRIPTOGRAFAR SENHA
const check_user = require('../../middleware/auth/jwt_mongodb'); // PUXA FUNÇÃO QUE VÁLIDA SESSÃO DO USUÁRIO
const commands = require('../../middleware/mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGO DB
require('dotenv').config(); // SOLICITA AS VARIÁVEIS DE AMBIENTE

// *************** ALL ***************
// Controla a atualização e resete de senha
router.post("/auth/reset/password", async (req, res) => {

    const check_data = new check_user(); // CRIA UM CONSTRUTOR
    const result = await check_data.initSyncSingIn(req); // EXECUTA A FUNÇÃO DO CONSTRUTOR
    var cookieData = result[0]['validToken']; // RESERVA O VALOR RECEBIDO

    const { antigaSenha, novaSenha } = req.body; // PUXA OS VALORES DO OBJETO QUE VEIO PELO BODY
    const md5AntigaSenha = md5(process.env.PWD_PREFIX + antigaSenha); // CONVERTE EM MD5 COM O PREFIXO QUE ESTA NO .ENV
    const md5NovaSenha = md5(process.env.PWD_PREFIX + novaSenha); // CONVERTE EM MD5 COM O PREFIXO QUE ESTA NO .ENV

    // VERIFICA SE O USUARIO ESTÁ LOGADO
    if (cookieData["hash_mail_pass"] != "false") {
        
        // VERIFICA SE RECEBEU VALORES PELO BODY
        if (antigaSenha && novaSenha) {

            // VERIFICA SE A NOVA SENHA E IGUAL A ANTIGA
            if (antigaSenha == novaSenha) {
                res.status(401).json({
                    "codigo": process.env.CODE_FAIL,
                    "resposta": process.env.MSG_SUCCESS_FAIL,
                    "mensagem": "A nova senha não pode ser igual a antiga",
                    "data_base": ""
                });
                return true;
            }

            // VERIFICA SE A NOVA SENHA SEGUE OS PADROES DE SENHA
            if (novaSenha.toString().length < parseInt(process.env.PWD_MIN)) {
                res.status(401).json({
                    "codigo": process.env.CODE_FAIL,
                    "resposta": process.env.MSG_SUCCESS_FAIL,
                    "mensagem": "A nova senha não respeita algumas regras, revise sua senha e tente novamente",
                    "data_base": ""
                });
                return true;
            }

        } else {
            res.status(401).json({
                "codigo": process.env.CODE_FAIL,
                "resposta": process.env.MSG_SUCCESS_FAIL,
                "mensagem": "Os dados informados não segue o padrão do sistema, revise-os e tente novamente",
                "data_base": ""
            });
            return true;
        }
        
        const filter = {
            "_id": {
                "$oid": cookieData["id"]
            },
            "nome": cookieData["nome"],
            "documento": cookieData["documento"],
            "senha": md5AntigaSenha,
            "email": cookieData["email"],
            "cargo": cookieData["cargo"],
            "status": cookieData["status"],
            "resetar_senha": cookieData["resetar_senha"]
        };
        const newValue = {
            "senha": md5NovaSenha,
            "resetar_senha": 0
        };
        const shell_commands = new commands(); // CRIA O CONSTRUTOR
        const updateUser = await shell_commands.commandUpadateData('books', 'usuarios', filter, newValue); // INICIAR A FUNÇÃO ATUALIZAR REGISTRO NO MONGO DB

        if (updateUser["result"]["modifiedCount"] == 0) {
            res.status(401).json({
                "codigo": process.env.CODE_FAIL,
                "resposta": process.env.MSG_SUCCESS_FAIL,
                "mensagem": "Nenhuma alteração realizada, revise seus dados e tente novamente",
                "data_base": ""
            });
            return true;
        }

        // ALTERAÇÃO DE SENHA REALIZADO COM SUCESSO
        res.status(200).json({
            "codigo": process.env.CODE_SUCCESS,
            "resposta": process.env.MSG_SUCCESS,
            "mensagem": "Sua senha foi alterada com sucesso, realize o login com a nova senha",
            "data_base": updateUser,
            "hash": cookieData
        });
        return true;

    } else { // USUARIO NÃO ESTÁ AUTENTICADO
        res.status(401).json({
            "codigo": process.env.CODE_FAIL,
            "resposta": process.env.MSG_SUCCESS_FAIL,
            "mensagem": "Realize o login antes de solicitar a mudança de senha",
            "data_base": ""
        });
        return true;
    }

});

// *************** ALL ***************
// Mensagem de erro personalizada para rotas não existente apartir de /password
router.all("/auth/reset/password*", async (req, res) => {

    res.status(404).json({
        "codigo": process.env.CODE_FAIL,
        "resposta": process.env.MSG_SUCCESS_FAIL,
        "mensagem": `O link expirou ou não existe, experimente acessar a documentação da API em ${process.env.HOST_API_DOC}/doc/password`,
        "data_base": ""
    });

});

module.exports = router;