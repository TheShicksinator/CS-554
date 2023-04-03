import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const StoriesPage = () => {
    let { page } = useParams();
    const [stories, setStories] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    let fetchPageStories = async () => {
        let storiesData = [];
        let data;
        try {
            data = await axios.get(
                `http://localhost:4000/api/stories/page/${parseInt(page)}`
            );
            storiesData = data.data.results;
        } catch (error) {
            console.log(error);
            navigate("/404");
        }
        setLastPage(
            data.data.total - 1 - data.data.offset <= data.data.limit ||
                storiesData.length < data.data.limit
        );
        if (storiesData.length === 0) {
            navigate("/404");
        }
        setStories(storiesData);
        setLoading(false);
    };

    useEffect(() => {
        console.log("page: ", page);
        console.log("on load useeffect");
        fetchPageStories();
    }, [page]);

    useEffect(() => {
        console.log("search: ", search);
        let fetchSearchStories = async () => {
            setLoading(true);
            let storiesData = [];
            let data;
            try {
                data = await axios.get(
                    `http://localhost:4000/api/stories/search/${search}`
                );
                storiesData = data.data.results;
            } catch (error) {
                storiesData = [];
            }
            setStories(storiesData);
            setLoading(false);
        };
        if (search.trim()) {
            console.log("searching");
            fetchSearchStories();
        } else {
            fetchPageStories();
        }
    }, [search]);

    return (
        <div>
            <h1>Stories</h1>
            <form>
                <input
                    type="text"
                    aria-label="Search"
                    placeholder="Search By Character IDs"
                    onChange={(e) =>
                        setSearch(e.target.value.trim() ? e.target.value : "")
                    }
                    style={{ width: "148px" }}
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
                                        to={`/stories/page/${Number(page) - 1}`}
                                        className="links"
                                    >
                                        Previous
                                    </Link>
                                )}

                                {!lastPage && (
                                    <Link
                                        to={`/stories/page/${Number(page) + 1}`}
                                        className="links"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                        <br />
                        {stories.map((story) => {
                            return (
                                <div key={story.id}>
                                    <Link
                                        className="links"
                                        to={`/stories/${story.id}`}
                                    >
                                        {story.title}
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

export default StoriesPage;
