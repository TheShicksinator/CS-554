import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTrainer, removeTrainer, selectTrainer } from "../actions";
import { addPokemon, removePokemon } from "../actions";
import axios from "axios";

const TrainersPage = () => {
    const { trainers } = useSelector((state) => state.trainers);
    const [trainer, setTrainer] = useState(undefined);
    const [newTrainer, setNewTrainer] = useState("");
    const [selectedTrainer, setSelectedTrainer] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        setSelectedTrainer(trainers.find((item) => item.selected));
    }, []);
    return (
        <div>
            <h2>Trainers</h2>
            <form
                method="POST"
                onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(addTrainer(newTrainer));
                }}
            >
                <input
                    type="text"
                    id="trainerName"
                    placeholder="New Trainer Name"
                    aria-label="New Trainer Name"
                    onChange={(e) => setNewTrainer(e.target.value)}
                />
                <button type="submit">Add Trainer</button>
            </form>
            {trainers.map((trainer) => (
                <div key={trainer.id} className="trainerData">
                    <h3>{trainer.name}</h3>
                    <ul>
                        {trainer.team.map((pokemon) => (
                            <li key={pokemon.name}>
                                <Link to={`/pokemon/${parseInt(pokemon.id)}`}>
                                    {pokemon.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {!trainer.selected && (
                        <button
                            onClick={() => {
                                dispatch(selectTrainer(trainer.id));
                            }}
                        >
                            Select Trainer
                        </button>
                    )}
                    <button
                        onClick={() => {
                            dispatch(removeTrainer(trainer.id));
                        }}
                    >
                        Delete Trainer
                    </button>
                </div>
            ))}
        </div>
    );
};

export default TrainersPage;
