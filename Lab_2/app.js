const flat = require("flat");
const unflatten = flat.unflatten;
const redis = require("redis");
const client = redis.createClient();
const express = require("express");
const cors = require("cors");
const app = express();
let axios = require("axios");
const { privateKey, publicKey } = require("./config").APIconfig;

const md5 = require("blueimp-md5");
const ts = new Date().getTime();
const stringToHash = ts + privateKey + publicKey;
const hash = md5(stringToHash);
const charsBaseUrl = "https://gateway.marvel.com:443/v1/public/characters";
const comicsBaseUrl = "https://gateway.marvel.com:443/v1/public/comics";
const storiesBaseUrl = "https://gateway.marvel.com:443/v1/public/stories";

app.use(cors());

app.get("/api/characters/page/:pagenum", async (req, res) => {
    //TODO: for some reason URL doesn't work, discuss with TA
    try {
        const pageNum = req.params.pagenum;
        let chars = JSON.parse(await client.get("characters:" + pageNum));
        if (chars) {
            return res.json(chars);
        } else {
            let charsPageUrl =
                charsBaseUrl +
                "?ts=" +
                ts +
                "&apikey=" +
                publicKey +
                "&hash=" +
                hash +
                "&offset=" +
                (pageNum - 1) * 20;
            let response = await axios.get(charsPageUrl);
            const data = response.data.data;
            if (!data) {
                return res.status(404).send("No pages found");
            }
            client.set("characters:" + pageNum, JSON.stringify(data));
            res.json(data);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get("/api/characters/history", async (req, res, next) => {
    try {
        let history = [];
        try {
            history = JSON.parse(await client.get("history"));
        } catch (error) {
            return res.status(404).json("History not found");
        }
        let latest20entries = history.slice(-20).reverse();
        return res.json(latest20entries);
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.post("/api/characters/search/:search", async (req, res) => {
    try {
        const search = req.params.search;
        let chars = JSON.parse(await client.get("search:" + search));
        if (chars) {
            return res.json(chars);
        } else {
            let charsSearchUrl =
                charsBaseUrl +
                "?ts=" +
                ts +
                "&apikey=" +
                publicKey +
                "&hash=" +
                hash +
                "&nameStartsWith=" +
                search;
            let response = await axios.get(charsSearchUrl);
            const data = response.data.data;
            if (!data) {
                return res.status(404).send("No pages found");
            }
            client.set("search:" + search, JSON.stringify(data));
            res.json(data);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get("/api/characters/:id", async (req, res, next) => {
    try {
        let chars = JSON.parse(await client.get("chars"));
        if (!chars) chars = [];
        let char = chars.find((char) => char.id == req.params.id);
        if (!char) {
            let charsByIdUrl =
                charsBaseUrl +
                "/" +
                req.params.id +
                "?ts=" +
                ts +
                "&apikey=" +
                publicKey +
                "&hash=" +
                hash;
            let response = await axios.get(charsByIdUrl);
            if (!response.data.data.results[0]) {
                return res.status(404).send("Character not found");
            }
            char = response.data.data.results[0];
            chars.push(char);
            await client.set("chars", JSON.stringify(chars));
        }
        let history = (await client.get("history"))
            ? JSON.parse(await client.get("history"))
            : [];
        history.push(char);
        await client.set("history", JSON.stringify(history));
        return res.json(char);
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get("/api/comics/page/:pagenum", async (req, res) => {
    try {
        const pageNum = req.params.pagenum;
        let comics = JSON.parse(await client.get("comics:" + pageNum));
        if (comics) {
            return res.json(comics);
        } else {
            let comicsPageUrl =
                comicsBaseUrl +
                "?ts=" +
                ts +
                "&apikey=" +
                publicKey +
                "&hash=" +
                hash +
                "&offset=" +
                (pageNum - 1) * 20;
            let response = await axios.get(comicsPageUrl);
            const data = response.data.data;
            if (!data) {
                return res.status(404).send("No pages found");
            }
            client.set("comics:" + pageNum, JSON.stringify(data));
            res.json(data);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.post("/api/comics/search/:search", async (req, res) => {
    try {
        const search = req.params.search;
        let comics = JSON.parse(await client.get("search:" + search));
        if (comics) {
            return res.json(comics);
        } else {
            let comicsSearchUrl =
                comicsBaseUrl +
                "?ts=" +
                ts +
                "&apikey=" +
                publicKey +
                "&hash=" +
                hash +
                "&titleStartsWith=" +
                search;
            let response = await axios.get(comicsSearchUrl);
            const data = response.data.data;
            if (!data) {
                return res.status(404).send("No pages found");
            }
            client.set("search:" + search, JSON.stringify(data));
            res.json(data);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get("/api/comics/:id", async (req, res, next) => {
    try {
        let comics = JSON.parse(await client.get("comics"));
        if (!comics) comics = [];
        let comic = comics.find((comic) => comic.id == req.params.id);
        if (!comic) {
            let comicsByIdUrl =
                comicsBaseUrl +
                "/" +
                req.params.id +
                "?ts=" +
                ts +
                "&apikey=" +
                publicKey +
                "&hash=" +
                hash;
            let response = await axios.get(comicsByIdUrl);
            if (!response.data.data.results[0]) {
                return res.status(404).send("Comic not found");
            }
            comic = response.data.data.results[0];
            comics.push(comic);
            await client.set("comics", JSON.stringify(comics));
        }
        return res.json(comic);
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get("/api/stories/page/:pagenum", async (req, res) => {
    try {
        const pageNum = req.params.pagenum;
        let stories = JSON.parse(await client.get("stories:" + pageNum));
        if (stories) {
            return res.json(stories);
        } else {
            let storiesPageUrl =
                storiesBaseUrl +
                "?ts=" +
                ts +
                "&apikey=" +
                publicKey +
                "&hash=" +
                hash +
                "&offset=" +
                (pageNum - 1) * 20;
            let response = await axios.get(storiesPageUrl);
            const data = response.data.data;
            if (!data) {
                return res.status(404).send("No pages found");
            }
            client.set("stories:" + pageNum, JSON.stringify(data));
            res.json(data);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.post("/api/stories/search/:search", async (req, res) => {
    try {
        const search = req.params.search;
        let stories = JSON.parse(await client.get("search:" + search));
        if (stories) {
            return res.json(stories);
        } else {
            let storiesSearchUrl =
                storiesBaseUrl +
                "?ts=" +
                ts +
                "&apikey=" +
                publicKey +
                "&hash=" +
                hash +
                "&characters=" +
                search;
            let response = await axios.get(storiesSearchUrl);
            const data = response.data.data;
            if (!data) {
                return res.status(404).send("No pages found");
            }
            client.set("search:" + search, JSON.stringify(data));
            res.json(data);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.get("/api/stories/:id", async (req, res, next) => {
    try {
        let stories = JSON.parse(await client.get("stories"));
        if (!stories) stories = [];
        let story = stories.find((story) => story.id == req.params.id);
        if (!story) {
            let storiesByIdUrl =
                storiesBaseUrl +
                "/" +
                req.params.id +
                "?ts=" +
                ts +
                "&apikey=" +
                publicKey +
                "&hash=" +
                hash;
            let response = await axios.get(storiesByIdUrl);
            if (!response.data.data.results[0]) {
                return res.status(404).send("Story not found");
            }
            story = response.data.data.results[0];
            stories.push(story);
            await client.set("stories", JSON.stringify(stories));
        }
        return res.json(story);
    } catch (error) {
        return res.status(500).send(error);
    }
});

app.listen(4000, async () => {
    await client.connect();
    console.log("Listening on port 4000");
});
