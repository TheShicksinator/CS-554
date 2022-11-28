export const addTrainer = (trainerName) => ({
    type: "ADD_TRAINER",
    payload: {
        name: trainerName,
    },
});

export const removeTrainer = (trainerId) => ({
    type: "REMOVE_TRAINER",
    payload: {
        id: trainerId,
    },
});

export const addPokemon = (pokemonId, pokemonName, trainerId) => ({
    type: "ADD_POKEMON",
    payload: {
        id: pokemonId,
        name: pokemonName,
        trainer: trainerId,
    },
});

export const removePokemon = (pokemonId, trainerId) => ({
    type: "REMOVE_POKEMON",
    payload: {
        id: pokemonId,
        trainer: trainerId,
    },
});

export const selectTrainer = (trainerId) => ({
    type: "SELECT_TRAINER",
    payload: {
        id: trainerId,
    },
});
