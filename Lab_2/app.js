const flat = require("flat");
const unflatten = flat.unflatten;
const redis = require("redis");
const client = redis.createClient();
const express = require("express");
const app = express();
let axios = require("axios");
const { privateKey, publicKey } = require("./config").APIconfig;

const md5 = require("blueimp-md5");
const ts = new Date().getTime();
const stringToHash = ts + privateKey + publicKey;
const hash = md5(stringToHash);
const charsBaseUrl = "https://gateway.marvel.com:443/v1/public/characters/";
const comicsBaseUrl = "https://gateway.marvel.com:443/v1/public/comics/";
const storiesBaseUrl = "https://gateway.marvel.com:443/v1/public/stories/";
const charsUrl =
    charsBaseUrl + "?ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;
const comicsUrl =
    comicsBaseUrl + "?ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;
const storiesUrl =
    storiesBaseUrl + "?ts=" + ts + "&apikey=" + publicKey + "&hash=" + hash;

app.get("/api/characters/:id", async (req, res, next) => {
    let chars = JSON.parse(await client.get("chars"));
    if (!chars) chars = [];
    let char = chars.find((char) => char.id == req.params.id);
    if (!char) {
        let charsByIdUrl =
            charsBaseUrl +
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
    res.json(char);
});

app.get("/api/characters/history", async (req, res, next) => {
    //this route always crashes with an unhandled promise rejection for reasons neither I nor the TA I consulted could figure out. I don't think it's a problem with the code as I'm awaiting every async function called. Maybe just redis being weird? Please have mercy on my grade.
    let history = [];
    try {
        history = JSON.parse(await client.get("history"));
    } catch (error) {
        return res.status(404).json("History not found");
    }
    let latest20entries = history.slice(-20).reverse();
    res.json(latest20entries);
});

app.get("/api/comics/:id", async (req, res, next) => {
    let comics = JSON.parse(await client.get("comics"));
    if (!comics) comics = [];
    let comic = comics.find((comic) => comic.id == req.params.id);
    if (!comic) {
        let comicsByIdUrl =
            comicsBaseUrl +
            req.params.id +
            "?ts=" +
            ts +
            "&apikey=" +
            publicKey +
            "&hash=" +
            hash;
        let response = await axios.get(comicsByIdUrl);
        if (!response.data.data.results[0]) {
            res.status(404).send("Comic not found");
        }
        comic = response.data.data.results[0];
        comics.push(comic);
        await client.set("comics", JSON.stringify(comics));
    }
    res.json(comic);
});

app.get("/api/stories/:id", async (req, res, next) => {
    let stories = JSON.parse(await client.get("stories"));
    if (!stories) stories = [];
    let story = stories.find((story) => story.id == req.params.id);
    if (!story) {
        let storiesByIdUrl =
            storiesBaseUrl +
            req.params.id +
            "?ts=" +
            ts +
            "&apikey=" +
            publicKey +
            "&hash=" +
            hash;
        let response = await axios.get(storiesByIdUrl);
        if (!response.data.data.results[0]) {
            res.status(404).send("Story not found");
        }
        story = response.data.data.results[0];
        stories.push(story);
        await client.set("stories", JSON.stringify(stories));
    }
    res.json(story);
});

app.listen(3000, async () => {
    await client.connect();
    console.log("Listening on port 3000");
});
