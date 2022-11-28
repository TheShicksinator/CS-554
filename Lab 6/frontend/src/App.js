import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import PokemonPage from "./components/PokemonPage";
import PokemonDetails from "./components/PokemonDetails";
import TrainersPage from "./components/TrainersPage";
import Error from "./components/Error";

function App() {
    useEffect(() => {
        console.log("App mounted");
    });
    return (
        <BrowserRouter>
            <div className="App">
                <header className="App-header">
                    <Link to="/">PokeAPI Home</Link>
                    <br />
                    <div className="header-links">
                        <Link className="links" to="/pokemon/page/0">
                            Pokemon
                        </Link>
                        <Link className="links" to="/trainers">
                            Trainers
                        </Link>
                    </div>
                </header>
                <br />
                <div className="App-body">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/pokemon/page/:pagenum"
                            element={<PokemonPage />}
                        />
                        <Route
                            path="/pokemon/:id"
                            element={<PokemonDetails />}
                        />
                        <Route path="/trainers" element={<TrainersPage />} />
                        <Route path="/404" element={<Error />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
