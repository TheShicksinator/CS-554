import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPokemon, removePokemon } from "../actions";
import axios from "axios";
import noImage from "../img/download.jpeg";

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { trainers } = useSelector((state) => state.trainers);
    const [pokemon, setPokemon] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [selectedTrainer, setSelectedTrainer] = useState(undefined);
    const [full, setFull] = useState(false);
    const [onTeam, setOnTeam] = useState(false);

    useEffect(() => {
        setSelectedTrainer(trainers.find((item) => item.selected));
        setOnTeam(selectedTrainer?.team.includes(id));
        setFull(selectedTrainer?.team.length >= 6);
    }, []);

    useEffect(() => {
        console.log("on load useeffect");
        let fetchPokemon = async () => {
            let result;
            try {
                result = await axios.get(
                    `http://localhost:4000/pokemon/${parseInt(id)}`
                );
            } catch (error) {
                console.log(error);
                navigate("/404");
            }
            setPokemon(result.data);
            setLoading(false);
        };
        fetchPokemon();
    }, [id]);

    let image = pokemon?.sprites?.other?.["official-artwork"]?.front_default
        ? pokemon?.sprites?.other?.["official-artwork"]?.front_default
        : noImage;

    return (
        <div>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div>
                    <h1>{pokemon.name}</h1>
                    <img src={image} alt={pokemon.name} />
                    <div className="pokemonTraits">
                        <h2>Abilities</h2>
                        <ul>
                            {pokemon.abilities.map((ability) => (
                                <li key={ability.ability.name}>
                                    {ability.ability.name}
                                </li>
                            ))}
                        </ul>
                        <h2>Types</h2>
                        <ul>
                            {pokemon.types.map((type) => (
                                <li key={type.type.name}>{type.type.name}</li>
                            ))}
                        </ul>
                        <h2>Stats</h2>
                        <ul>
                            {pokemon.stats.map((stat) => (
                                <li key={stat.stat.name}>
                                    {stat.stat.name}: {stat.base_stat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {selectedTrainer ? (
                        <button
                            onClick={() => {
                                console.log("clicked");
                                onTeam
                                    ? dispatch(
                                          removePokemon(id, selectedTrainer.id)
                                      )
                                    : full
                                    ? alert("Team is full!")
                                    : dispatch(
                                          addPokemon(
                                              id,
                                              pokemon.name,
                                              selectedTrainer.id
                                          )
                                      );
                            }}
                        >
                            {
                                //if pokemon is in trainer's party, display remove button
                                //if party is full, show party full on button
                                onTeam
                                    ? "Release"
                                    : full
                                    ? "Party Full"
                                    : "Catch"
                            }
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default PokemonDetails;
