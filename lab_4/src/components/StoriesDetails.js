import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const StoriesDetails = () => {
    let { id } = useParams();
    const [story, setStory] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        console.log("on load useeffect");
        let fetchStories = async () => {
            let story = {};
            let data;
            try {
                data = await axios.get(
                    `http://localhost:4000/api/stories/${id}`
                );
                story = data.data;
            } catch (error) {
                console.log(error);
                navigate("/404");
            }
            setStory(story);
            setLoading(false);
        };
        fetchStories();
    }, [id]);

    return (
        <div>
            <h1>Stories</h1>
            <div>
                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <div>
                        <div key={story.id}>
                            <h2>{story.title}</h2>
                            {story.thumbnail && (
                                <img
                                    className="infoImg"
                                    src={
                                        story.thumbnail.path +
                                        "." +
                                        story.thumbnail.extension
                                    }
                                    alt={story.title}
                                />
                            )}
                            <p>{story.description}</p>
                            {story.comics.items.length > 0 && <h3>Comics</h3>}
                            <ul>
                                <>
                                    {story.comics.items.map((comic) => (
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
                            {story.characters.items.length > 0 && (
                                <h3>Characters</h3>
                            )}
                            <ul>
                                <>
                                    {story.characters.items.map((character) => (
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

export default StoriesDetails;
