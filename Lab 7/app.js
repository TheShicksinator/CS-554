const express = require("express");

const app = express();
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");

app.use("/public", static);

configRoutes(app);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
