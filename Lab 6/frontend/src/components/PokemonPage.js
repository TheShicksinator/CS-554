import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPokemon, removePokemon } from "../actions";
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";
import noImage from "../img/download.jpeg";
import axios from "axios";

const PokemonPage = () => {
    const { pagenum } = useParams();
    const dispatch = useDispatch();
    const { trainers } = useSelector((state) => state.trainers);
    const [pokemon, setPokemon] = useState(undefined);
    const [cards, setCards] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedTrainer(trainers.find((item) => item.selected));
        console.log(selectedTrainer);
    }, []);

    let fetchPagePokemon = async () => {
        let pokeData = [];
        let result;
        try {
            result = await axios.get(
                `http://localhost:4000/pokemon/page/${parseInt(pagenum)}`
            );
            pokeData = result.data.results;
        } catch (error) {
            console.log(error);
            navigate("/404");
        }
        //handle last page status
        // console.log(pokeData);
        setLastPage(pokeData.length !== 20);
        if (pokeData.length === 0) {
            navigate("/404");
        }
        setPokemon(pokeData);
    };

    useEffect(() => {
        console.log("page: ", pagenum);
        console.log("on load useeffect");
        fetchPagePokemon();
        setLoading(false);
    }, [pagenum]);

    // useEffect(() => {
    //     setCards(
    //         Promise.all(
    //             pokemon.map(async (poke) => await buildPokemonCard(poke))
    //         )
    //     );
    // });

    const buildPokemonCard = (pokemon) => {
        //pull ids from urls
        const pokeId = pokemon.url.split("/")[6];
        // console.log(pokemon.name);
        //get official art for pokemon
        // let pokeArt = await axios.get(
        //     "http://localhost:4000/pokemon/" + pokeId
        // );

        // pokeArt = pokeArt.sprites.other["official-artwork"].front_default;
        let teamIsFull, pokemonIsInTeam;
        // let selectedTrainer = trainers.find((item) => item.selected);
        if (selectedTrainer) {
            teamIsFull = selectedTrainer.team.length >= 6;
            pokemonIsInTeam = selectedTrainer.team.find(
                (item) => item.id === pokeId
            );
        }
        return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={pokeId}>
                <Card variant="outlined">
                    <CardActionArea>
                        <Link to={`/pokemon/${parseInt(pokeId)}`}>
                            {/* <CardMedia
                                component="img"
                                image={pokeArt ? pokeArt : noImage}
                                height="200"
                                title="pokemon art"
                            /> */}

                            <CardContent>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                >
                                    {pokemon.name}
                                </Typography>
                            </CardContent>
                        </Link>
                        {selectedTrainer ? (
                            <button
                                onClick={() => {
                                    console.log("clicked");
                                    pokemonIsInTeam
                                        ? dispatch(
                                              removePokemon(
                                                  pokeId,
                                                  selectedTrainer.id
                                              )
                                          )
                                        : teamIsFull
                                        ? alert("Team is full!")
                                        : dispatch(
                                              addPokemon(
                                                  pokeId,
                                                  pokemon.name,
                                                  selectedTrainer.id
                                              )
                                          );
                                }}
                            >
                                {
                                    //if pokemon is in trainer's party, display remove button
                                    //if party is full, show party full on button
                                    // !pokemonIsInTeam
                                    //     ? "Catch"
                                    //     : teamIsFull
                                    //     ? "Party Full"
                                    //     : "Release"
                                    pokemonIsInTeam
                                        ? "Release"
                                        : teamIsFull
                                        ? "Party Full"
                                        : "Catch"
                                }
                            </button>
                        ) : null}
                    </CardActionArea>
                </Card>
            </Grid>
        );
    };

    let card = pokemon ? pokemon.map((poke) => buildPokemonCard(poke)) : null;

    return (
        <div>
            <h1>Pokemon Page</h1>

            <br />
            <div>
                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <div>
                        <div className="prevNextContainer">
                            {Number(pagenum) > 0 && (
                                <Link
                                    to={`/pokemon/page/${Number(pagenum) - 1}`}
                                >
                                    Previous
                                </Link>
                            )}

                            {!lastPage && (
                                <Link
                                    to={`/pokemon/page/${Number(pagenum) + 1}`}
                                >
                                    Next
                                </Link>
                            )}
                        </div>

                        <br />
                        <Grid container spacing={5}>
                            {card}
                        </Grid>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PokemonPage;
