const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config(); // SOLICITA AS VARIAVEIS DE AMBIENTE

// VALIDA O USUARIO
const validarUser = async (req) => {

    const { email, senha } = req.body;
    var status = 0;
    var compareUser = null;

    // VALIDA O [ JWT ]
    var validToken;
    try {
        validToken = jwt.verify(
            req.session.HASH_MAIL_PASS,
            process.env.SECRET_JWT, function (err, decoded) {
                if (err) {
                    status = 401;
                    return {
                        hash_mail_pass: 'false',
                        iat: 0,
                        exp: 0
                    };
                } else {
                    status = 200;
                    return decoded;
                }
            }
        );
    } catch (x) {
        return validToken = false;
    }

    // COMPARA OS DADOS RECEBIDOS A FIM DE VALIDAR SE É VALIDOS
    try {
        await bcrypt.compare(email + '+' + senha, validToken["hash_mail_pass"]).then(function (result) {
            compareUser = result;
        });
    } catch (x) {
        compareUser = 'err' 
    }

    return [{
        "status_code": status,
        "compareUser": compareUser,
        "validToken": validToken,
        "parmsemail": email,
        "parmssenha": senha
    }]
}

// EXPORTA A FUNÇÃO PARA USAR EM OUTRO ARQUIVO
module.exports = function () {

    this.check = async (req) => {
        const data = await validarUser(req);
        return data;
    }

}