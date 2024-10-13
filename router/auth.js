const express = require("express");
var router = express.Router();
const commands = require("../middleware/mongoDb/command/commands");
require("dotenv").config();

const a = new commands();

// *************** GET ***************
// Controla todas as entradas global no metodo GET
router.get("/*", async (req, res) => {
    res.send({
        status: "ok",
        router: "global",
    });
});

// *************** GET ***************
// Controla todas as entrada de api no metodo GET
a.router.get("/api/*", async (req, res) => {
    res.send({
        status: "ok",
        router: "api",
    });
});

router.get("/testx", async (req, res) => {
    res.status(200).json({ stats: "Ativado", title: "Api Ativado" });
});

module.exports = router;
