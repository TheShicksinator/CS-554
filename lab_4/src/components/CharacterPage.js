import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CharacterPage = () => {
    let { page } = useParams();
    const [characters, setCharacters] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    let fetchPageChars = async () => {
        let charData = [];
        let data;
        try {
            data = await axios.get(
                `http://localhost:4000/api/characters/page/${parseInt(page)}`
            );
            charData = data.data.results;
        } catch (error) {
            console.log(error);
            navigate("/404");
        }
        setLastPage(
            data.data.total - 1 - data.data.offset <= data.data.limit ||
                charData.length < data.data.limit
        );
        if (charData.length === 0) {
            navigate("/404");
        }
        setCharacters(charData);
        setLoading(false);
    };
    useEffect(() => {
        console.log("page: ", page);
        console.log("on load useeffect");
        fetchPageChars();
    }, [page]);

    useEffect(() => {
        console.log("search: ", search);
        let fetchSearchChars = async () => {
            setLoading(true);
            let charData = [];
            let data;
            try {
                data = await axios.get(
                    `http://localhost:4000/api/characters/search/${search}`
                );
                charData = data.data.results;
            } catch (error) {
                charData = [];
            }
            setCharacters(charData);
            setLoading(false);
        };
        if (search.trim()) {
            fetchSearchChars();
        } else {
            fetchPageChars();
        }
    }, [search]);

    return (
        <div>
            <h1>Characters</h1>
            <form>
                <input
                    type="text"
                    aria-label="Search"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>
            <div>
                {loading ? (
                    <h2>Loading...</h2>
                ) : (
                    <div>
                        {!search && (
                            <div className="prevNextContainer">
                                {Number(page) > 1 && (
                                    <Link
                                        to={`/characters/page/${
                                            Number(page) - 1
                                        }`}
                                        className="links"
                                    >
                                        Previous
                                    </Link>
                                )}

                                {!lastPage && (
                                    <Link
                                        to={`/characters/page/${
                                            Number(page) + 1
                                        }`}
                                        className="links"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                        <br />
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

export default CharacterPage;
