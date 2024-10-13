/*
CRIADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com  
*/

const { MongoClient } = require('mongodb'); // SOLICTA A BIBLIOTECA DO MONGO DB
require('dotenv').config(); // SOLICITA VARIÁVEIS DE AMBIENTE

// CONFIGURAÇÃO DA CONEXÃO
const createConnMongo = async (db) => {

    const url = process.env.DB_CONECTION; // DEFINE A URL DA CONEXÃO QUE ESTA NO AQUIVO .ENV

    const client = new MongoClient(url); // CRIA UMA NOVA CONEXÃO USANDO A URL

    return client; // RETORNA A CONEXÃO PARA EXPORTAR

}

// EXPORTA A FUNÇÃO PARA OUTRO ARQUIVO
module.exports = function(){
    
    this.parmsConfigDB = async () => {
        const data = createConnMongo();
        return data;
    }

}