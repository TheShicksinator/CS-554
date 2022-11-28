import { v4 as uuid } from "uuid";

const initialState = {
    trainers: [],
};

const trainerReducer = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case "ADD_TRAINER":
            const newTrainer = {
                id: uuid(),
                name: payload.name,
                team: [],
                selected: false,
            };
            return { ...state, trainers: [...state.trainers, newTrainer] };
        case "REMOVE_TRAINER":
            return {
                ...state,
                trainers: state.trainers.filter(
                    (trainer) => trainer.id !== payload.id
                ),
            };
        case "ADD_POKEMON":
            return {
                ...state,
                trainers: state.trainers.map((item) => {
                    if (item.id === payload.trainer) {
                        return {
                            ...item,
                            team: [
                                ...item.team,
                                { id: payload.id, name: payload.name },
                            ],
                        };
                    }
                    return item;
                }),
            };
        case "REMOVE_POKEMON":
            return {
                ...state,
                trainers: state.trainers.map((item) => {
                    if (item.id === payload.trainer) {
                        return {
                            ...item,
                            team: item.team.filter(
                                (item) => item.id !== payload.id
                            ),
                        };
                    }
                    return item;
                }),
            };
        case "SELECT_TRAINER":
            return {
                ...state,
                trainers: state.trainers.map((item) => {
                    if (item.id === payload.id) {
                        return { ...item, selected: true };
                    }
                    return { ...item, selected: false };
                }),
            };
        default:
            return state;
    }
};

export default trainerReducer;
