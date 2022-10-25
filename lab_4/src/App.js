import marvelLogo from "./img/Marvel.png";
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Router, Link } from "react-router-dom";
import CharacterPage from "./components/CharacterPage";
import Home from "./components/Home";
import CharacterDetails from "./components/CharacterDetails";
import StoriesDetails from "./components/StoriesDetails";
import StoriesPage from "./components/StoriesPage";
import ComicsDetails from "./components/ComicsDetails";
import CharacterHistory from "./components/CharacterHistory";
import ComicsPage from "./components/ComicsPage";
import Error from "./components/Error";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <header className="App-header">
                    <img src={marvelLogo} className="logo" alt="logo" />
                    <title>Lab 4</title>
                    <Link to="/">
                        <h1>React Marvel API (click here for home)</h1>
                    </Link>
                </header>
                <br />
                <div className="App-body">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/characters/page/:page"
                            element={<CharacterPage />}
                        />
                        <Route
                            path="/characters/:id"
                            element={<CharacterDetails />}
                        />
                        <Route
                            path="/characters/history"
                            element={<CharacterHistory />}
                        />
                        <Route
                            path="/comics/page/:page"
                            element={<ComicsPage />}
                        />
                        <Route path="/comics/:id" element={<ComicsDetails />} />
                        <Route
                            path="/stories/page/:page"
                            element={<StoriesPage />}
                        />
                        <Route
                            path="/stories/:id"
                            element={<StoriesDetails />}
                        />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </div>
                <br />
                <br />
            </div>
        </BrowserRouter>
    );
}

export default App;
