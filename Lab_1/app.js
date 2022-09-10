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

app.patch("/sweets/:id", async (req, res, next) => {
    console.log("sweets/:id patch middleware");
    let id = req.params.id;
    let sweet = await sweets.getSweetById(id);
    if (sweet.userThatPosted._id != req.session.user._id) {
        return res.status(403).json({ error: "You cannot edit this sweet!" });
    }
    next();
});

app.post("/sweets/:id/replies", async (req, res, next) => {
    console.log("sweets/:id/replies middleware");
    if (!req.session.user) {
        return res
            .status(401)
            .json({ error: "You must be logged in to do that!" });
    }
    next();
});

app.delete("/sweets/:sweetId/:replyId", async (req, res, next) => {
    console.log("sweets/:sweetId/:replyId middleware");
    if (!req.session.user) {
        return res
            .status(401)
            .json({ error: "You must be logged in to do that!" });
    }
    let sweetId = req.params.sweetId;
    let replyId = req.params.replyId;
    const sweet = await sweets.getSweetById(sweetId);
    if (!sweet) {
        return res.status(404).json({ error: "Sweet not found" });
    }
    const reply = sweet.replies.find((reply) => reply._id == replyId);
    if (!reply) {
        return res.status(404).json({ error: "Reply not found" });
    }
    if (reply.userThatPostedReply._id != req.session.user._id) {
        return res.status(403).json({
            error: "You can only delete your own replies",
        });
    }
    next();
});

app.patch("/sweets", async (req, res, next) => {
    console.log("sweets middleware");
    if (!req.session.user) {
        return res
            .status(401)
            .json({ error: "You must be logged in to do that!" });
    }
    next();
});

app.post("/sweets", async (req, res, next) => {
    console.log("sweets middleware");
    if (!req.session.user) {
        return res
            .status(401)
            .json({ error: "You must be logged in to do that!" });
    }
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("server running on port 3000");
});
