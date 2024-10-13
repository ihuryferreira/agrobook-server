/*
CRIADO: JEAN CLEIDSON PEREIRA RODRIGUES
MATRICULA: 202202257141
EMAIL: jeantng2016@gmail.com
*/

const mainAppUse = require('./config/express');
const app = new mainAppUse;
const https = require('https');

/************* AGROBOOK [ START ] *************/

/************* AUTH [ START ] *************/
/* ROUTER AUTH - Controla todas rotas de entradas */
var ROUTER_AUTH_ALL = require('./router/auth/all');
app.use(ROUTER_AUTH_ALL);

/* ROUTER AUTH SINGIN - Controla todas rotas de entradas de login */
var ROUTER_AUTH_SINGIN = require('./router/auth/singin');
app.use(ROUTER_AUTH_SINGIN);

/* ROUTER AUTH RESET PWD - Controla todas rotas de resete de senha */
var ROUTER_AUTH_RESET_PWD = require('./router/auth/reset');
app.use(ROUTER_AUTH_RESET_PWD);
/************* AUTH [ END ] *************/

/************* USER [ START ] *************/
/* ROUTER CREATE USER - Controla todas as entradas de criação de usuário */
var ROUTER_CREATE_USER = require('./router/api/user/create_user');
app.use(ROUTER_CREATE_USER);

/* ROUTER READ USER - Controla todas as entradas de listagem de usuários */
var ROUTER_READ_USER = require('./router/api/user/list_user');
app.use(ROUTER_READ_USER);

/* ROUTER UPDATE USER - Controla todas as entradas de atualizações de usuário */
var ROUTER_UPDATE_USER = require('./router/api/user/update_user');
app.use(ROUTER_UPDATE_USER);

/* ROUTER DELETE USER - Controla todas as ordem de apagar usuário */
var ROUTER_DELETE_USER = require('./router/api/user/delete_user');
app.use(ROUTER_DELETE_USER);
/************* USER [ END ] *************/

/************* BOOKS [ START ] *************/
/* ROUTER BOOKS CREATE - Controla todas as entradas de criação de livro */
var ROUTER_BOOKS_CREATE = require('./router/api/book/create_book');
app.use(ROUTER_BOOKS_CREATE);

/* ROUTER READ BOOK - Controla todas as entradas de listagem de livros */
var ROUTER_READ_BOOK = require('./router/api/book/list_book');
app.use(ROUTER_READ_BOOK);

/* ROUTER UPDATE BOOK - Controla todas as entradas de atualizações de livros */
var ROUTER_UPDATE_BOOK = require('./router/api/book/update_book');
app.use(ROUTER_UPDATE_BOOK);

/* ROUTER DELETE BOOK - Controla todas as ordem de apagar Livros */
var ROUTER_DELETE_BOOK = require('./router/api/book/delete_book');
app.use(ROUTER_DELETE_BOOK);
/************* BOOKS [ END ] *************/

/************* ORDERS [ START ] *************/
/* ROUTER ORDERS CREATE - Controla todas as entradas de criação de PEDIDO */
var ROUTER_ORDER_CREATE = require('./router/api/order/create_order');
app.use(ROUTER_ORDER_CREATE);

/* ROUTER ORDERS READ - Controla todas as listagem de PEDIDOS */
var ROUTER_ORDER_READ = require('./router/api/order/list_order');
app.use(ROUTER_ORDER_READ);

/* ROUTER ORDERS UPDATE - Controla todas as atualização de PEDIDOS */
var ROUTER_ORDER_UPDATE = require('./router/api/order/update_order');
app.use(ROUTER_ORDER_UPDATE);

/* ROUTER DELETE ORDER - Controla todas as ordem de apagar pedidos */
var ROUTER_DELETE_ORDER = require('./router/api/order/delete_order');
app.use(ROUTER_DELETE_ORDER);
/************* ORDERS [ END ] *************/

/************* TRELLO [ START ] *************/
/* ROUTER TRELLO CARD UPDATE - Controla todas as entradas de alterações no trello */
var ROUTER_TRELLO_CARD_UPDATE = require('./router/api/trello/card_update');
app.use(ROUTER_TRELLO_CARD_UPDATE);
/************* TRELLO [ END ] *************/

/************* AGROBOOK [ END ] *************/