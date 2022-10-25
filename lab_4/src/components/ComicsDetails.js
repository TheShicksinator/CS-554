import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ComicDetails = () => {
    let { id } = useParams();
    const [comic, setComic] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("on load useeffect");
        let fetchComics = async () => {
            let comic = {};
            let data;
            try {
                data = await axios.get(
                    `http://localhost:4000/api/comics/${id}`
                );
                comic = data.data;
            } catch (error) {
                console.log(error);
                navigate("/404");
            }
            setComic(comic);
            setLoading(false);
        };
        fetchComics();
    }, [id]);

    return (
        <div>
            <h1>Comics</h1>
            <div>
                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <div>
                        <div key={comic.id}>
                            <h2>{comic.title}</h2>
                            <img
                                className="infoImg"
                                src={
                                    comic.thumbnail.path +
                                    "." +
                                    comic.thumbnail.extension
                                }
                                alt={comic.name}
                            />
                            <p>{comic.description}</p>
                            {comic.stories.items.length > 0 && <h3>Stories</h3>}
                            <ul>
                                <>
                                    {comic.stories.items.map((story) => (
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
                            {comic.characters.items.length > 0 && (
                                <h3>Characters</h3>
                            )}
                            <ul>
                                <>
                                    {comic.characters.items.map((character) => (
                                        <li key={character.resourceURI}>
                                            <Link
                                                to={`/characters/${character.resourceURI
                                                    .split("/")
                                                    .pop()}`}
                                            >
                                                {character.name}
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

export default ComicDetails;
