const express = require("express");
const session = require("express-session");
const configRoutes = require("./routes");
const app = express();

app.use(express.json());

app.use(
    session({
        name: "AuthCookie",
        secret: "some secret string!",
        resave: false,
        saveUninitialized: false,
        user: null,
    })
);

//TODO: middleware stuff

configRoutes(app);

app.listen(3000, () => {
    console.log("server running on port 3000");
});
