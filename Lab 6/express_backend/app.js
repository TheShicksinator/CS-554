const cors = require("cors");
const express = require("express");
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const app = express();
app.use(cors());

app.get("/pokemon/page/:pagenum", async (req, res) => {
    try {
        const page = req.params.pagenum;
        if (!page) {
            return res.status(400).send("No page number provided");
        }
        if (typeof page !== "number" || page < 1) {
            return res.status(400).send("Invalid page number");
        }
        let pokemon = JSON.parse(await client.get("pokemon:" + page));
        if (pokemon) {
            return res.json(pokemon);
        }
        const url =
            "https://pokeapi.co/api/v2/pokemon?offset=" + (page - 1) * 20;
        const response = await axios.get(url);
        pokemon = response.data.results;
        if (!pokemon) {
            return res.status(404).send("No pokemon found");
        }
        client.set("pokemon:" + page, JSON.stringify(pokemon));
        return res.json(pokemon);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.get("/pokemon/:id", async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send("No id provided");
        }
        if (typeof id !== "number" || id < 1) {
            return res.status(400).send("Invalid id");
        }
        let pokemon = JSON.parse(await client.get("pokemonId:" + id));
        if (pokemon) {
            return res.json(pokemon);
        }
        const url = "https://pokeapi.co/api/v2/pokemon/" + id;
        const response = await axios.get(url);
        pokemon = response.data;
        if (!pokemon) {
            return res.status(404).send("No pokemon found");
        }
        client.set("pokemonId:" + id, JSON.stringify(pokemon));
        return res.json(pokemon);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});
