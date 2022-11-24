const cors = require("cors");
const express = require("express");
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const app = express();
app.use(cors());

app.get("/pokemon/page/:pagenum", async (req, res) => {
    try {
        let page = req.params.pagenum;
        if (!page) {
            return res.status(400).send("No page number provided");
        }
        page = parseInt(page);
        if (isNaN(page) || page < 1) {
            return res.status(400).send("Invalid page number");
        }
        let pokemon = JSON.parse(await client.get("pokemon:" + page));
        if (pokemon) {
            if (pokemon === 404) {
                return res.status(404).send("No pokemon found");
            }
            return res.json(pokemon);
        }
        const url =
            "https://pokeapi.co/api/v2/pokemon?offset=" + (page - 1) * 20;
        let response;
        try {
            response = await axios.get(url);
        } catch (error) {
            if (error.response.status === 404) {
                client.set("pokemon:" + page, "404");
                return res.status(404).send("No pokemon found");
            }
            return res.status(error.response.status).send(error);
        }
        pokemon = response.data.results;
        if (!pokemon || pokemon.length === 0) {
            client.set("pokemon:" + page, "404");
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
        let id = req.params.id;
        if (!id) {
            return res.status(400).send("No id provided");
        }
        id = parseInt(id);
        if (isNaN(id) || id < 1) {
            return res.status(400).send("Invalid id");
        }
        let pokemon = JSON.parse(await client.get("pokemonId:" + id));
        if (pokemon) {
            if (pokemon === 404) {
                return res.status(404).send("No pokemon found");
            }
            return res.json(pokemon);
        }
        const url = "https://pokeapi.co/api/v2/pokemon/" + id;
        let response;
        try {
            response = await axios.get(url);
        } catch (error) {
            if (error.response.status === 404) {
                client.set("pokemonId:" + id, "404");
                return res.status(404).send("No pokemon found");
            }
            return res.status(error.response.status).send(error);
        }
        pokemon = response.data;
        if (!pokemon) {
            client.set("pokemonId:" + id, "404");
            return res.status(404).send("No pokemon found");
        }
        client.set("pokemonId:" + id, JSON.stringify(pokemon));
        return res.json(pokemon);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

app.use("*", (req, res) => {
    res.status(404).send("Not found");
});

app.listen(3000, async () => {
    await client.connect();
    console.log("Server listening on port 3000");
});
