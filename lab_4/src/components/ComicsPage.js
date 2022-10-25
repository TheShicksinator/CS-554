import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ComicsPage = () => {
    let { page } = useParams();
    const [comics, setComics] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    let fetchPageComics = async () => {
        let comicsData = [];
        let data;
        try {
            data = await axios.get(
                `http://localhost:4000/api/comics/page/${parseInt(page)}`
            );
            comicsData = data.data.results;
        } catch (error) {
            console.log(error);
            navigate("/404");
        }
        setLastPage(
            data.data.total - data.data.offset < data.data.limit ||
                comicsData.length < data.data.limit
        );
        if (comicsData.length === 0) {
            navigate("/404");
        }
        setComics(comicsData);
        setLoading(false);
    };
    useEffect(() => {
        console.log("page: ", page);
        console.log("on load useeffect");
        fetchPageComics();
    }, [page]);

    useEffect(() => {
        console.log("search: ", search);
        let fetchSearchComics = async () => {
            setLoading(true);
            let comicsData = [];
            let data;
            try {
                data = await axios.post(
                    `http://localhost:4000/api/comics/search/${search}`
                );
                comicsData = data.data.results;
            } catch (error) {
                comicsData = [];
            }
            setComics(comicsData);
            setLoading(false);
        };
        if (search.trim()) {
            console.log("searching");
            fetchSearchComics();
        } else {
            fetchPageComics();
        }
    }, [search]);

    return (
        <div>
            <h1>Comics</h1>
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
                                        to={`/comics/page/${Number(page) - 1}`}
                                        className="links"
                                    >
                                        Previous
                                    </Link>
                                )}

                                {!lastPage && (
                                    <Link
                                        to={`/comics/page/${Number(page) + 1}`}
                                        className="links"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                        <br />
                        {comics.map((comic) => {
                            return (
                                <div key={comic.id}>
                                    <Link
                                        className="links"
                                        to={`/comics/${comic.id}`}
                                    >
                                        {comic.title}
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

export default ComicsPage;
