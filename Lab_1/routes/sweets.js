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

router
    .route("/")
    .get(async (req, res) => {
        try {
            const listOfSweets = await sweets.getFiftySweets();
            return res.json(listOfSweets);
        } catch (error) {
            return res.status(404).json({ error: error });
        }
    })
    .post(async (req, res) => {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: "You must be logged in" });
            }
            if (!req.body) {
                return res.status(400).json({
                    error: "You must provide data to create a sweet",
                });
            }
            const { sweetText, sweetMood } = req.body;
            try {
                sweetText = xss(sweetText);
                sweetMood = xss(sweetMood);
                sweetText = validation.checkString(sweetText, "sweetText");
                sweetMood = validation.checkString(sweetMood, "sweetMood");
            } catch (error) {
                return res.status(400).json({ error: error });
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
            return res.status(500).json({ error: error });
        }
    });

router.route("/?page=:page").get(async (req, res) => {
    try {
        if (!req.params.page || isNaN(req.params.page)) {
            return res.status(400).json({ error: "Invalid or no page number" });
        }
        let numPage = parseInt(req.params.page);
        if (numPage < 1) {
            return res.status(400).json({ error: "Invalid page number" });
        }
        const listOfSweets = await sweets.getFiftySweets(numPage);
        if (listOfSweets.length === 0) {
            return res.status(404).json({ error: "No sweets found" });
        }
        return res.json(listOfSweets);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: "No id provided" });
            }
            try {
                let id = xss(req.params.id);
                id = validation.checkId(id);
            } catch (error) {
                return res.status(400).json({ error: error });
            }
            try {
                const sweet = await sweets.getSweetById(id);
                return res.json(sweet);
            } catch (error) {
                return res.status(404).json({ error: error });
            }
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    })
    .patch(async (req, res) => {
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
            try {
                if (!req.body.sweetText && !req.body.sweetMood) {
                    throw "You must provide data to update a sweet";
                }
                let id = xss(req.params.id);
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
                return res.status(400).json({ error: error });
            }
            try {
                const oldSweet = await sweets.getSweetById(id);
                if (oldSweet.userThatPosted._id != req.session.user._id)
                    throw "You can only edit your own sweets";
            } catch (error) {
                return res.status(403).json({ error: error });
            }
            let updatedObject = {};
            if (req.body.sweetText && req.body.sweetText != oldSweet.sweetText)
                updatedObject.sweetText = req.body.sweetText;
            if (req.body.sweetMood && req.body.sweetMood != oldSweet.sweetMood)
                updatedObject.sweetMood = req.body.sweetMood;
            const updatedSweet = await sweets.updateSweetById(
                id,
                updatedObject
            );
            return res.json(updatedSweet);
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    });

router.route("/:id/likes").post(async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        if (!req.params.id) {
            return res.status(400).json({ error: "No id provided" });
        }
        try {
            let id = xss(req.params.id);
            id = validation.checkId(id);
        } catch (error) {
            return res.status(400).json({ error: error });
        }
        const sweet = await sweets.getSweetById(id);
        if (!sweet) {
            return res.status(404).json({ error: "Sweet not found" });
        }
        const like = await sweets.likeSweetToggle(id, req.session.user._id);
        return res.json(like);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router.route("/:id/replies").post(async (req, res) => {
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
        const { replyText } = req.body;
        try {
            replyText = xss(replyText);
            replyText = validation.checkString(replyText, "replyText");
        } catch (error) {
            return res.status(400).json({ error: error });
        }
        try {
            let id = xss(req.params.id);
            id = validation.checkId(id);
        } catch (error) {
            return res.status(400).json({ error: error });
        }
        const sweet = await sweets.getSweetById(id);
        if (!sweet) {
            return res.status(404).json({ error: "Sweet not found" });
        }
        const reply = await sweets.replyToSweet(
            id,
            req.session.user,
            replyText
        );
        return res.json(reply);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router.route("/:sweetId/:replyId").delete(async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        if (!req.params.sweetId || !req.params.replyId) {
            return res.status(400).json({ error: "No id provided" });
        }
        try {
            let sweetId = xss(req.params.sweetId);
            sweetId = validation.checkId(sweetId);
            let replyId = xss(req.params.replyId);
            replyId = validation.checkId(replyId);
        } catch (error) {
            return res.status(400).json({ error: error });
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
        return res.status(500).json({ error: error });
    }
});

router.route("/signup").post(async (req, res) => {
    try {
        if (!req.body) {
            return res
                .status(400)
                .json({ error: "You must provide data to sign up" });
        }
        let { name, username, password } = req.body;
        try {
            username = xss(username);
            username = validation.checkString(username, "username");
            password = xss(password);
            password = validation.checkString(password, "password");
            name = xss(name);
            name = validation.checkString(name, "name");
        } catch (error) {
            return res.status(400).json({ error: error });
        }
        if (users.getUserByUsername(username)) {
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
        return res.status(500).json({ error: error });
    }
});

router.route("/login").post(async (req, res) => {
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
            return res.status(400).json({ error: error });
        }
        try {
            const auth_response = await users.authenticate(username, password);
            req.session.user = {
                _id: auth_response.userId,
                username: username,
            };
        } catch (error) {
            return res.status(401).json({ error: error });
        }
        let user = await users.getUserById(req.session.user._id);
        return res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
        });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router.route("/logout").get(async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: "You must be logged in" });
        }
        req.session.destroy();
        return res.status(200).json("Logged out");
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

module.exports = router;
