import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <p>
                This site contains a GUI for display of information fetched from
                the Pokemon API. You can see paginated lists of pokemon, view
                the details for each, and create your own pokemon trainers and
                teams.
            </p>
            <br />
        </div>
    );
};

export default Home;
