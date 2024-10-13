const check_user = require('../jwt/jwt'); // EXTRAI O VALIDADOR DO JWT
const commands = require('../mongoDb/command/commands'); // EXTRAI OS COMANDOS NO MONGODB
require('dotenv').config(); // SOLICITA AS VARIAVEIS DE AMBIENTE

// FUNÇÃO QUE VALIDA O COOKIE PUXANDO NO MONGO DB A FIM DE VALIDAR O USUARIO LOCALMENTE E NO BANCO
const syncSingIn = async (req) => {

    const check_data = new check_user(); // CRIA O CONTRUTOR
    const result = await check_data.check(req); // EXECUTA A FUNCAO DO CONSTRUTOR
    const cookieData = result; // RECUPERA OS DADOS DA FUNÇÃO

    const filter = { // CRIA OBJETO PARA FILTRAR REGISTRO
        "nome": cookieData[0]["validToken"]["nome"],
        "documento": cookieData[0]["validToken"]["documento"],
        "email": cookieData[0]["validToken"]["email"],
        "cargo": cookieData[0]["validToken"]["cargo"],
        "status": cookieData[0]["validToken"]["status"],
        "resetar_senha": cookieData[0]["validToken"]["resetar_senha"]
    };
    const sort = { // CRIA UM OBJETO PARA SERVIR COMO SORT BY
        "_id": -1
    }
    const limit = 1; // CRIA UM LIMIT NA QUERY
    const shell_commands = new commands(); // CRIA UM CONSTRUTOR
    const listUser = await shell_commands.commandReadData(`books`, `usuarios`, filter, sort, limit); // EXECULTA A FUNCAO QUE LER REGISTRO NO BANCO DE DADOS

    // VERIFICA SE A BUSCA NO BANCO DE DADOS RETORNOU VALOR VAZIO
    if (listUser["result"].length === 0 /* VERIFICA SE RECEBEU VALOR VAZIO */ || listUser["result"].status === 0 /* VERIFICA SE O USUÁRIO ESTÁ DESATIVADO */) {
        cookieData[0].validToken.hash_mail_pass = 'false';
        cookieData[0].validToken.id = '';
        cookieData[0].validToken.nome = '';
        cookieData[0].validToken.documento = 0;
        cookieData[0].validToken.email = '';
        cookieData[0].validToken.cargo = 0;
        cookieData[0].validToken.status = 0;
        cookieData[0].validToken.resetar_senha = 0;
        cookieData[0].validToken.iat = 0;
        cookieData[0].validToken.exp = 0;
        return cookieData;
    }

    // ATUALIZA O STATUS DO RESETE DE SENHA
    cookieData[0].validToken.resetar_senha = listUser["result"][0].resetar_senha;

    return cookieData; // RETORNA O VALOR PARA O CALLBACK

};

// EXPORTA A FUNÇÃO PARA OUTRO AQUIVO
module.exports = function () {

    this.initSyncSingIn = async (req) => {
        const data = await syncSingIn(req);
        return data;
    }

}