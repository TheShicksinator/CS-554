import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CharacterHistory = () => {
    const [characters, setCharacters] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("on load useeffect");
        let fetchChars = async () => {
            let charData = [];
            let data;
            try {
                data = await axios.get(
                    `http://localhost:4000/api/characters/history`
                );
                charData = data.data;
            } catch (error) {
                console.log(error);
                navigate("/404");
            }
            // setLastPage(
            //     data.data.total - 1 - data.data.offset <= data.data.limit ||
            //         charData.length < data.data.limit
            // );
            setCharacters(charData);
            setLoading(false);
        };
        fetchChars();
    }, []);

    return (
        <div>
            <h1>Characters</h1>
            <div>
                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <div>
                        {characters.map((character) => {
                            return (
                                <div key={character.id}>
                                    <Link
                                        className="links"
                                        to={`/characters/${character.id}`}
                                    >
                                        {character.name}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CharacterHistory;
