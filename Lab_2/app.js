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
    let char = JSON.parse(await client.getAsync(req.params.id));
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
        if (!response.data.results[0]) {
            res.status(404).send("Character not found");
        }
        char = response.data.results[0];
        await client.set(req.params.id, JSON.stringify(char));
    }
    let history = await client.getAsync("history");
    let historyArray = JSON.parse(history);
    historyArray.push(char);
    await client.set("history", JSON.stringify(historyArray));
    res.json(char);
});

app.get("/api/characters/history", async (req, res, next) => {
    let history = await client.getAsync("history");
    let historyArray = JSON.parse(history);
    let latest20entries = historyArray.slice(-20).reverse();
    res.json(latest20entries);
});

app.get("/api/comics/:id", async (req, res, next) => {
    let comic = JSON.parse(await client.getAsync(req.params.id));
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
        comic = response.data.results[0];
        let stringifiedComic = JSON.stringify(comic);
        await client.set(req.params.id, stringifiedComic);
    }
    res.json(comic);
});

app.get("/api/stories/:id", async (req, res, next) => {
    let story = await client.getAsync(req.params.id);
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
        story = response.data.results[0];
        let stringifiedStory = JSON.stringify(story);
        await client.set(req.params.id, stringifiedStory);
    }
    res.json(story);
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
