import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <p>
                This site contains a GUI for display of information fetched from
                the Marvel API. You can see paginated lists of characters,
                comics, and stories, and view the details for each entry within
                them, as well as see history of your past visited characters
            </p>
            <br />
            <div>
                <Link className="links" to="/characters/page/1">
                    Characters
                </Link>
                <Link className="links" to="/comics/page/1">
                    Comics
                </Link>
                <Link className="links" to="/stories/page/1">
                    Stories
                </Link>
                <Link className="links" to="/characters/history">
                    Character History
                </Link>
            </div>
        </div>
    );
};

export default Home;
