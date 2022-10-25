import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CharacterDetails = () => {
    let { id } = useParams();
    const [character, setCharacter] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("on load useeffect");
        let fetchChars = async () => {
            let char = {};
            console.log(id);
            let data;
            try {
                data = await axios.get(
                    `http://localhost:4000/api/characters/${id}`
                );
                char = data.data;
            } catch (error) {
                console.log(error);
                navigate("/404");
            }
            setCharacter(char);
            setLoading(false);
        };
        fetchChars();
    }, [id]);

    return (
        <div>
            <h1>Characters</h1>
            <div>
                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <div>
                        <div key={character.id}>
                            <h2>{character.name}</h2>
                            <img
                                className="infoImg"
                                src={
                                    character.thumbnail.path +
                                    "." +
                                    character.thumbnail.extension
                                }
                                alt={character.name}
                            />
                            <p>{character.description}</p>
                            {character.comics.items.length > 0 && (
                                <h3>Comics</h3>
                            )}
                            <ul>
                                <>
                                    {character.comics.items.map((comic) => (
                                        <li key={comic.resourceURI}>
                                            <Link
                                                to={`/comics/${comic.resourceURI
                                                    .split("/")
                                                    .pop()}`}
                                            >
                                                {comic.name}
                                            </Link>
                                        </li>
                                    ))}
                                </>
                            </ul>
                            {character.stories.items.length > 0 && (
                                <h3>Stories</h3>
                            )}
                            <ul>
                                <>
                                    {character.stories.items.map((story) => (
                                        <li key={story.resourceURI}>
                                            <Link
                                                to={`/stories/${story.resourceURI
                                                    .split("/")
                                                    .pop()}`}
                                            >
                                                {story.name}
                                            </Link>
                                        </li>
                                    ))}
                                </>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CharacterDetails;
