const express = require("express");
const router = express.Router();
const { sweets, users, validation } = require("../data");
const { ObjectId } = require("mongodb");
const xss = require("xss");

const validSweetMoods = [
    "happy",
    "sad",
    "angry",
    "excited",
    "surprised",
    "loved",
    "blessed",
    "grateful",
    "blissful",
    "silly",
    "chill",
    "motivated",
    "emotional",
    "annoyed",
    "lucky",
    "determined",
    "bored",
    "hungry",
    "disappointed",
    "worried",
];

router.route("/signup").post(async (req, res) => {
    //checked
    console.log("signup");
    try {
        if (!req.body) {
            return res
                .status(400)
                .json({ error: "You must provide data to sign up" });
        }
        let { name, username, password } = req.body;
        try {
            // username = xss(username);
            username = validation.checkString(username, "username");
            // password = xss(password);
            password = validation.checkString(password, "password");
            // name = xss(name);
            name = validation.checkString(name, "name");
        } catch (error) {
            return res.status(400).json(`${error}`);
        }
        if (await users.getUserByUsername(username)) {
            return res.status(400).json({ error: "Username already taken" });
        }
        const user = await users.createUser(name, username, password);
        req.session.user = user;
        const newUser = await users.getUserById(user._id);
        return res.json({
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
        });
    } catch (error) {
        return res.status(500).json(`${error}`);
    }
});

router.route("/login").post(async (req, res) => {
    //checked
    try {
        if (!req.body) {
            return res
                .status(400)
                .json({ error: "You must provide data to log in" });
        }
        let { username, password } = req.body;
        try {
            username = xss(username);
            username = validation.checkString(username, "username");
            password = xss(password);
            password = validation.checkString(password, "password");
            validation.checkLogin(username, password);
        } catch (error) {
            return res.status(400).json(`${error}`);
        }
        try {
            const auth_response = await users.authenticate(username, password);
            req.session.user = {
                _id: auth_response.userId,
                username: username,
            };
        } catch (error) {
            return res.status(401).json(`${error}`);
        }
        let user = await users.getUserById(req.session.user._id);
        return res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
        });
    } catch (error) {
        return res.status(500).json(`${error}`);
    }
});

router.route("/logout").get(async (req, res) => {
    //checked
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        req.session.destroy();
        return res.status(200).json("Logged out");
    } catch (error) {
        return res.status(500).json(`${error}`);
    }
});

router
    .route("/:id")
    .get(async (req, res) => {
        //checked
        console.log("get sweet by id");
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: "No id provided" });
            }
            let id = req.params.id;
            try {
                id = xss(id);
                id = validation.checkId(id);
            } catch (error) {
                return res.status(400).json(`${error}`);
            }
            try {
                const sweet = await sweets.getSweetById(id);
                return res.json(sweet);
            } catch (error) {
                return res.status(404).json(`${error}`);
            }
        } catch (error) {
            return res.status(500).json(`${error}`);
        }
    })
    .patch(async (req, res) => {
        //checked
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: "You must be logged in" });
            }
            if (!req.params.id) {
                return res.status(400).json({ error: "No id provided" });
            }
            if (!req.body) {
                return res.status(400).json({
                    error: "You must provide data to update a sweet",
                });
            }
            let id = req.params.id;
            try {
                if (!req.body.sweetText && !req.body.sweetMood) {
                    throw "You must provide data to update a sweet";
                }
                id = xss(id);
                if (req.body.sweetText) {
                    let sweetText = xss(req.body.sweetText);
                    sweetText = validation.checkString(sweetText, "sweetText");
                }
                if (req.body.sweetMood) {
                    let sweetMood = xss(req.body.sweetMood);
                    sweetMood = validation.checkString(sweetMood, "sweetMood");
                    sweetMood = sweetMood.toLowerCase();
                    if (!validSweetMoods.includes(sweetMood)) {
                        throw "Invalid sweetMood";
                    }
                }
            } catch (error) {
                return res.status(400).json(`${error}`);
            }
            const oldSweet = await sweets.getSweetById(id);
            try {
                if (oldSweet.userThatPosted._id != req.session.user._id)
                    throw "You can only edit your own sweets";
            } catch (error) {
                return res.status(403).json(`${error}`);
            }
            let updatedObject = {};
            if (req.body.sweetText && req.body.sweetText != oldSweet.sweetText)
                updatedObject.sweetText = req.body.sweetText;
            if (req.body.sweetMood && req.body.sweetMood != oldSweet.sweetMood)
                updatedObject.sweetMood = req.body.sweetMood;
            const updatedSweet = await sweets.updateSweet(id, updatedObject);
            return res.json(updatedSweet);
        } catch (error) {
            return res.status(500).json(`${error}`);
        }
    });

router.route("/:id/likes").post(async (req, res) => {
    //checked
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        if (!req.params.id) {
            return res.status(400).json({ error: "No id provided" });
        }
        let id = req.params.id;
        try {
            id = xss(id);
            id = validation.checkId(id);
        } catch (error) {
            return res.status(400).json(`${error}`);
        }
        const sweet = await sweets.getSweetById(id);
        if (!sweet) {
            return res.status(404).json({ error: "Sweet not found" });
        }
        const like = await sweets.likeSweetToggle(id, req.session.user._id);
        return res.json(like);
    } catch (error) {
        return res.status(500).json(`${error}`);
    }
});

router.route("/:id/replies").post(async (req, res) => {
    //checked
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        if (!req.params.id) {
            return res.status(400).json({ error: "No id provided" });
        }
        if (!req.body) {
            return res.status(400).json({
                error: "You must provide data to create a reply",
            });
        }
        let { reply } = req.body;
        let id = req.params.id;
        try {
            reply = xss(reply);
            reply = validation.checkString(reply, "reply");
        } catch (error) {
            return res.status(400).json(`${error}`);
        }
        try {
            id = xss(id);
            id = validation.checkId(id);
        } catch (error) {
            return res.status(400).json(`${error}`);
        }
        const sweet = await sweets.getSweetById(id);
        if (!sweet) {
            return res.status(404).json({ error: "Sweet not found" });
        }
        const replied = await sweets.replyToSweet(id, req.session.user, reply);
        return res.json(replied);
    } catch (error) {
        return res.status(500).json(`${error}`);
    }
});

router.route("/:sweetId/:replyId").delete(async (req, res) => {
    //checked
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        if (!req.params.sweetId || !req.params.replyId) {
            return res.status(400).json({ error: "No id provided" });
        }
        let sweetId = req.params.sweetId,
            replyId = req.params.replyId;
        try {
            sweetId = xss(req.params.sweetId);
            sweetId = validation.checkId(sweetId);
            replyId = xss(req.params.replyId);
            replyId = validation.checkId(replyId);
        } catch (error) {
            return res.status(400).json(`${error}`);
        }
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
        const deletedReply = await sweets.deleteSweetReply(sweetId, replyId);
        return res.json(deletedReply);
    } catch (error) {
        return res.status(500).json(`${error}`);
    }
});

router
    .route("/")
    .get(async (req, res) => {
        //checked
        console.log("pages of posts");
        try {
            let listOfSweets = [];
            if (req.query.page) {
                console.log("found params.page");
                if (isNaN(req.query.page)) {
                    return res.status(400).json({ error: "Invalid page" });
                }
                let numPage = parseInt(req.query.page);
                if (numPage < 1) {
                    return res
                        .status(400)
                        .json({ error: "Invalid page number" });
                }
                try {
                    listOfSweets = await sweets.getFiftySweets(numPage);
                } catch (error) {
                    return res.status(404).json(`${error}`);
                }
            } else {
                try {
                    listOfSweets = await sweets.getFiftySweets();
                } catch (error) {
                    return res.status(404).json(`${error}`);
                }
            }
            return res.json(listOfSweets);
        } catch (error) {
            return res.status(500).json(`${error}`);
        }
    })
    .post(async (req, res) => {
        //checked
        console.log("new post");
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: "You must be logged in" });
            }
            if (!req.body) {
                return res.status(400).json({
                    error: "You must provide data to create a sweet",
                });
            }
            let { sweetText, sweetMood } = req.body;
            try {
                sweetText = xss(sweetText);
                sweetMood = xss(sweetMood);
                sweetText = validation.checkString(sweetText, "sweetText");
                sweetMood = validation.checkString(sweetMood, "sweetMood");
            } catch (error) {
                return res.status(400).json(`${error}`);
            }
            sweetMood = sweetMood.toLowerCase();
            if (!validSweetMoods.includes(sweetMood)) {
                return res.status(400).json({ error: "Invalid sweetMood" });
            }
            const newSweet = await sweets.createSweet(sweetText, sweetMood, {
                _id: ObjectId(req.session.user._id),
                username: req.session.user.username,
            });
            return res.json(newSweet);
        } catch (error) {
            console.log(error);
            return res.status(500).json(`${error}`);
        }
    });

module.exports = router;
