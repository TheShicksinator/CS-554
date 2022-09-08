const sweets = require("./sweets");

const constructorMethod = (app) => {
    app.use("sweets", sweets);
    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

module.exports = constructorMethod;
