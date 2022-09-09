const express = require("express");
const session = require("express-session");
const configRoutes = require("./routes");
const { users, sweets } = require("./data");
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

app.use("/sweets", async (req, res, next) => {
    if ((req.method == "PATCH" || req.method == "POST") && !req.session.user) {
        return res
            .status(401)
            .json({ error: "You must be logged in to do that!" });
    }
    next();
});

app.use("/sweets/:id", async (req, res, next) => {
    if (req.method == "PATCH") {
        let id = req.params.id;
        let sweet = await sweets.getSweetById(id);
        if (sweet.userThatPosted._id != req.session.user._id) {
            return res
                .status(403)
                .json({ error: "You cannot edit this sweet!" });
        }
    }
    next();
});

app.use("/sweets/:id/replies", async (req, res, next) => {
    if (req.method == "POST" && !req.session.user) {
        return res
            .status(401)
            .json({ error: "You must be logged in to do that!" });
    }
    next();
});

app.use("/sweets/:sweetId/:replyId", async (req, res, next) => {
    if (req.method == "DELETE" && !req.session.user) {
        return res
            .status(401)
            .json({ error: "You must be logged in to do that!" });
    }
    const sweet = await sweets.getSweetById(sweetId);
    if (!sweet) {
        res.status(404).json({ error: "Sweet not found" });
        return;
    }
    const reply = sweet.replies.find((reply) => reply._id == replyId);
    if (!reply) {
        res.status(404).json({ error: "Reply not found" });
        return;
    }
    if (reply.userThatPostedReply._id != req.session.user._id) {
        res.status(403).json({
            error: "You can only delete your own replies",
        });
        return;
    }
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("server running on port 3000");
});
