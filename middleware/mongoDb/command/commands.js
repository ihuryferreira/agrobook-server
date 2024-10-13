/*
CRIADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com  
*/

const { MongoClient, ObjectId } = require('mongodb'); // SOLICTA A BIBLIOTECA DO MONGO DB
const configDB = require('../database/conn'); // SOLICITA ARQUIVOS DE CONEXÃO
const { EJSON } = require('bson'); // FORMATA JSON PARA SER INTERPLETADO PELO MONGODB
require('dotenv').config(); // SOLICITA VARIÁVEIS DO ARQUIVO .ENV

// C = CREATE | Função que cria um registro no mongoDb | Ex: [ db = 'books', collection = 'usuarios', obj = {nome: "user"} ]
const createData = async (dataBase, collectionName, obj) => {

    const configParms = new configDB(); // RECUPERA A FUNÇÃO QUE VEIO DO AQUIVO DE CONEXÃO
    const client = await configParms.parmsConfigDB(); // RESERVA APENAS A FUNÇÃO DE CONEXÃO

    // FUNÇÃO PARA CRIAR UM REGISTRO
    async function execute(dataBase, collectionName, obj) {

        await client.connect(); // AGUARDA A CONEXÃO COM O CLIENTE

        // TENTA CONVERTER O JSON PARA O FORMATO ACEITO PELO MONGODB
        try {
            obj = EJSON.parse(JSON.stringify(obj), { relaxed: true });
        } catch (errFormatedFilter) {
            throw new Error(errFormatedFilter)
        }

        const db = client.db(dataBase); // CRIA A CONEXÃO COM O BANCO
        const collection = db.collection(collectionName); // AGORA A CONEXÃO COM A COLLECTION
        const insertData = await collection.insertOne(obj); // PARA FINALIZAR REALIZA A INSERÇÃO DE UM UNICO OBJETO

        const objArray = {}; // CRIA UM OBJETO PARA GUARDAR O OBJ PASSADO

        objArray.dataBase = dataBase; // RESERVA OS DADOS DE ENTRADA [ db ]
        objArray.collectionName = collectionName; // RESERVA OS DADOS DE ENTRADA [ collection ]
        objArray.obj = obj; // RESERVA OS DADOS DE ENTRADA [ obj ]
        objArray.result = insertData; // RESERVA O RESULTADO FINAL DO COMANDO

        return objArray; // RETORNA O RESULTADO DA OPERAÇÃO O ESPERADO É {"ok":1}

    }

    return await execute(dataBase, collectionName, obj)
        .then((res) => { return res }) // EM CADO DE SUCESSO
        .catch((err) => { return err }) // EM CASO DE ERRO
        .finally(() => client.close()); // AO FINALIZAR FECHA A CONEXÃO

}

// R = READ | Função que le um registro no mongo Db
const readData = async (dataBase, collectionName, filter, sort, limit) => {

    const configParms = new configDB(); // RECUPERA A FUNÇÃO QUE VEIO DO AQUIVO DE CONEXÃO
    const client = await configParms.parmsConfigDB(); // RESERVA APENAS A FUNÇÃO DE CONEXÃO

    // FUNÇÃO PARA LER REGISTROS
    async function execute(dataBase, collectionName, filter, sortFild, limitFild) {

        await client.connect(); // AGUARDA A CONEXÃO COM O CLIENTE

        // TENTA CONVERTER O JSON PARA O FORMATO ACEITO PELO MONGODB
        try {
            filter = EJSON.parse(JSON.stringify(filter), { relaxed: true });
        } catch (errFormatedFilter) {
        }

        const db = client.db(dataBase); // CRIA A CONEXÃO COM O BANCO
        const collection = db.collection(collectionName); // AGORA A CONEXÃO COM A COLLECTION
        const findData = await collection.find(filter).sort(sortFild).limit(limitFild).toArray(); // PARA FINALIZAR REALIZA A INSERÇÃO DE UM UNICO OBJETO

        const objArray = {}; // CRIA UM OBJETO PARA GUARDAR O OBJ PASSADO

        objArray.dataBase = dataBase; // RESERVA OS DADOS DE ENTRADA [ db ]
        objArray.collectionName = collectionName; // RESERVA OS DADOS DE ENTRADA [ collection ]
        objArray.filter = filter; // PARAMETRO USANDO PARA FILTRAR QUERY
        objArray.sortFild = sortFild; // PARAMETRO USANDO PARA ORDENAR QUERY
        objArray.limitFild = limitFild; // PARAMETRO USANDO PARA LIMITAR NUMEROS DE REGISTRO QUERY
        objArray.result = findData; // RESERVA O RESULTADO FINAL DO COMANDO

        return objArray; // RETORNA O RESULTADO DA OPERAÇÃO O ESPERADO É {"ok":1}

    }

    return await execute(dataBase, collectionName, filter, sort, limit)
        .then((res) => { return res }) // EM CADO DE SUCESSO
        .catch((err) => { return err }) // EM CASO DE ERRO
        .finally(() => client.close()); // AO FINALIZAR FECHA A CONEXÃO

}

// R.I = READ BY ID | Função que busca registro usando o ID
const readDataById = async (dataBase, collectionName, o_id) => {

    const configParms = new configDB(); // RECUPERA A FUNÇÃO QUE VEIO DO AQUIVO DE CONEXÃO
    const client = await configParms.parmsConfigDB(); // RESERVA APENAS A FUNÇÃO DE CONEXÃO

    // FUNÇÃO PARA LER REGISTROS
    async function execute(dataBase, collectionName, o_id) {

        await client.connect(); // AGUARDA A CONEXÃO COM O CLIENTE

        const db = client.db(dataBase); // CRIA A CONEXÃO COM O BANCO
        const collection = db.collection(collectionName); // AGORA A CONEXÃO COM A COLLECTION
        const findData = await collection.findOne({ "_id": new ObjectId(o_id) }); // PARA FINALIZAR REALIZA A INSERÇÃO DE UM UNICO OBJETO

        const objArray = {}; // CRIA UM OBJETO PARA GUARDAR O OBJ PASSADO

        objArray.dataBase = dataBase; // RESERVA OS DADOS DE ENTRADA [ db ]
        objArray.collectionName = collectionName; // RESERVA OS DADOS DE ENTRADA [ collection ]
        objArray.filter = o_id; // PARAMETRO USANDO PARA FILTRAR QUERY
        objArray.sortFild = null; // PARAMETRO USANDO PARA ORDENAR QUERY
        objArray.limitFild = null; // PARAMETRO USANDO PARA LIMITAR NUMEROS DE REGISTRO QUERY
        objArray.result = findData; // RESERVA O RESULTADO FINAL DO COMANDO

        return objArray; // RETORNA O RESULTADO DA OPERAÇÃO O ESPERADO É {"ok":1}

    }

    return await execute(dataBase, collectionName, o_id)
        .then((res) => { return res }) // EM CADO DE SUCESSO
        .catch((err) => { return err }) // EM CASO DE ERRO
        .finally(() => client.close()); // AO FINALIZAR FECHA A CONEXÃO

}

// R.I.A = READ BY ID USING AGREGATION | Função que agrega dados de uma ou mais collection
const readDataByIdAgregation = async (dataBase, collections, filter, sortFild, limitFild) => {

    const configParms = new configDB(); // RECUPERA A FUNCAO QUE VEIO DO AQUIVO DE CONEXÃO
    const client = await configParms.parmsConfigDB(); // RESERVA APENAS A FUNÇÃO DE CONEXÃO

    // FUNÇÃO PARA LER REGISTROS
    async function execute(dataBase, collections, filter, sortFild, limitFild) {

        await client.connect(); // AGUARDA A CONEXAO COM O CLIENTE

        const db = client.db(dataBase); // CRIA A CONECAO COM O BANCO
        const collection = db.collection(collections[0]["collection"]); // PEGA O PRIMEIRO INDICE DO ARRAY, VALOR ESPERADO => [ { "collection": "pedido" } ]
        let findData; // RESERVA A RESPOSTA DA QUERY

        // TENTA CONVERTER O JSON PARA O FORMATO ACEITO PELO MONGODB
        try {
            filter = EJSON.parse(JSON.stringify(filter), { relaxed: true });
        } catch (errFormatedFilter) {
            // FAZ NADA
        }

        try {
            findData = await collection.aggregate(filter).limit(limitFild).toArray(); // REALIZA A AGREGAÇÃO USANDO O COMANDO LOOKUP COMO PREDOMINANTE
        } catch (x) {
            findData = false
            console.log(x)
        }

        const objArray = {}; // CRIA UM OBJETO PARA GUARDAR O OBJ PASSADO

        objArray.dataBase = dataBase; // RESERVA OS DADOS DE ENTRADA [ db ]
        objArray.collectionName = collections; // RESERVA OS DADOS DE ENTRADA [ collection ]
        objArray.filter = filter; // PARAMETRO USANDO PARA FILTRAR QUERY
        objArray.sortFild = sortFild; // PARAMETRO USANDO PARA ORDENAR QUERY
        objArray.limitFild = limitFild; // PARAMETRO USANDO PARA LIMITAR NUMEROS DE REGISTRO QUERY
        objArray.result = findData; // RESERVA O RESULTADO FINAL DO COMANDO

        return objArray; // RETORNA O RESULTADO DA OPERAÇÃO O ESPERADO É {"ok":1}

    }

    return await execute(dataBase, collections, filter, sortFild, limitFild)
        .then((res) => { return res }) // EM CADO DE SUCESSO
        .catch((err) => { return err }) // EM CASO DE ERRO
        .finally(() => client.close()); // AO FINALIZAR FECHA A CONEXÃO

}

// U = UPDATE | Função que atualiza um registro no mongodb usando o filter para localizar o registro e o updatefild para atualizar
const updateData = async (dataBase, collectionName, filter, updateFilds) => {

    const configParms = new configDB(); // RECUPERA A FUNÇÃO QUE VEIO DO AQUIVO DE CONEXÃO
    const client = await configParms.parmsConfigDB(); // RESERVA APENAS A FUNÇÃO DE CONEXÃO

    // FUNÇÃO PARA ATUALIZAR REGISTROS
    async function execute(dataBase, collectionName, filter, objectNewFilds) {

        await client.connect(); // AGUARDA A CONEXÃO COM O CLIENTE

        // TENTA CONVERTER O JSON PARA O FORMATO ACEITO PELO MONGODB
        try {
            filter = EJSON.parse(JSON.stringify(filter), { relaxed: true });
        } catch (errFormatedFilter) {
            throw new Error(errFormatedFilter)
        }

        // TENTA CONVERTER O JSON COM O NOVO VALOR PARA O FORMATO ACEITO PELO MONGODB
        try {
            objectNewFilds = EJSON.parse(JSON.stringify(objectNewFilds), { relaxed: true });
        } catch (errFormatedNewValue) {
            throw new Error(errFormatedNewValue)
        }

        const db = client.db(dataBase); // CRIA A CONEXÃO COM O BANCO
        const collection = db.collection(collectionName); // AGORA A CONEXÃO COM A COLLECTION
        const updateData = await collection.updateOne(filter, { $set: objectNewFilds }); // PARA FINALIZAR REALIZA A ALTERAÇÃO USANDO UM FILTRO E UM NOVO OBJETO

        const objArray = {}; // CRIA UM OBJETO PARA GUARDAR O OBJ PASSADO

        objArray.dataBase = dataBase; // RESERVA OS DADOS DE ENTRADA [ db ]
        objArray.collectionName = collectionName; // RESERVA OS DADOS DE ENTRADA [ collection ]
        objArray.filter = filter; // PARAMETRO USANDO PARA FILTRAR QUERY
        objArray.objectNewFilds = objectNewFilds; // PARAMETRO USANDO PARA INSERIR UM NOVO VALOR
        objArray.result = updateData; // RESERVA O RESULTADO FINAL DO COMANDO

        return objArray; // RETORNA O RESULTADO DA OPERAÇÃO O ESPERADO É {"ok":1}

    }

    return await execute(dataBase, collectionName, filter, updateFilds)
        .then((res) => { return res }) // EM CADO DE SUCESSO
        .catch((err) => { return err }) // EM CASO DE ERRO
        .finally(() => client.close()); // AO FINALIZAR FECHA A CONEXÃO

}

// D = DELETE | Função que apaga um registro no mongodb usando o filter para localizar o registro
const deleteData = async (dataBase, collectionName, filter) => {

    const configParms = new configDB(); // RECUPERA A FUNÇÃO QUE VEIO DO AQUIVO DE CONEXÃO
    const client = await configParms.parmsConfigDB(); // RESERVA APENAS A FUNÇÃO DE CONEXÃO

    // FUNÇÃO PARA APAGAR REGISTROS
    async function execute(dataBase, collectionName, filter) {

        await client.connect(); // AGUARDA A CONEXÃO COM O CLIENTE

         // TENTA CONVERTER O JSON PARA O FORMATO ACEITO PELO MONGODB
         try {
            filter = EJSON.parse(JSON.stringify(filter), { relaxed: true });
        } catch (errFormatedFilter) {
            throw new Error(errFormatedFilter)
        }



        const db = client.db(dataBase); // CRIA A CONEXÃO COM O BANCO
        const collection = db.collection(collectionName); // AGORA A CONEXÃO COM A COLLECTION
        const deleteData = await collection.deleteOne(filter); // PARA FINALIZAR REALIZA A EXCLUSÃO USANDO UM FILTRO

        console.log(deleteData);

        const objArray = {}; // CRIA UM OBJETO PARA GUARDAR O OBJ PASSADO

        objArray.dataBase = dataBase; // RESERVA OS DADOS DE ENTRADA [ db ]
        objArray.collectionName = collectionName; // RESERVA OS DADOS DE ENTRADA [ collection ]
        objArray.filter = filter; // RESERVA OS DADOS DE ENTRADA [ filter ]
        objArray.result = deleteData; // RESERVA O RESULTADO FINAL DO COMANDO

        return objArray; // RETORNA O RESULTADO DA OPERAÇÃO O ESPERADO É {"ok":1}

    }

    return await execute(dataBase, collectionName, filter)
        .then((res) => { return res }) // EM CADO DE SUCESSO
        .catch((err) => { return err }) // EM CASO DE ERRO
        .finally(() => client.close()); // AO FINALIZAR FECHA A CONEXÃO

}

// EXPORTA A FUNÇÃO PARA OUTRO ARQUIVO
module.exports = function () {

    // C - CREATE
    this.commandCreateData = async (db, collection, obj) => {
        const data = await createData(db, collection, obj);
        return data;
    }

    // R - READ
    this.commandReadData = async (dataBase, collectionName, filter, sort, limit) => {
        const data = await readData(dataBase, collectionName, filter, sort, limit);
        return data;
    }

    // R.I - READ BY ID
    this.commandReadDataById = async (dataBase, collectionName, objId) => {
        const data = await readDataById(dataBase, collectionName, objId);
        return data;
    }

    // R.I.A - READ BY ID USING AGREGATION
    this.commandreadDataByIdAgregation = async (dataBase, collections, filter, sortFild, limitFild) => {
        const data = await readDataByIdAgregation(dataBase, collections, filter, sortFild, limitFild);
        return data;
    }

    // U - UPDATE
    this.commandUpadateData = async (dataBase, collectionName, filter, newObj) => {
        const data = await updateData(dataBase, collectionName, filter, newObj);
        return data;
    }

    // D - DELETE
    this.commandDeleteData = async (dataBase, collectionName, filter) => {
        const data = await deleteData(dataBase, collectionName, filter);
        return data;
    }

}