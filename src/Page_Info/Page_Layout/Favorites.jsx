import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LiaMusicSolid } from "react-icons/lia";
import '../Page_Style/Favorites.css';

const FavoriteEpisodes = () => {
    const [favoriteEpisodes, setFavoriteEpisodes] = useState({});

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorite-episodes');
        if (storedFavorites) {
            const favorites = JSON.parse(storedFavorites);
            setFavoriteEpisodes(favorites);
        }
    }, []);

    const handleUnfavorite = (podcastTitle, episodeTitle) => {
        const updatedFavorites = { ...favoriteEpisodes };

        // Remove the episode from the favorites
        if (updatedFavorites[podcastTitle]) {
            delete updatedFavorites[podcastTitle][episodeTitle];

            // Check if there are no more episodes for this podcast, remove the podcast entry
            if (Object.keys(updatedFavorites[podcastTitle]).length === 0) {
                delete updatedFavorites[podcastTitle];
            }

            // Update state and local storage
            setFavoriteEpisodes(updatedFavorites);
            localStorage.setItem('favorite-episodes', JSON.stringify(updatedFavorites));
        }
    };

    return (
        <div className="favorite-episodes">
            <div className="header">
                <div className="Logo">
                    <p><LiaMusicSolid />TTS</p>
                </div>
                <nav>
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/">Log Out</Link></li>
                    </ul>
                </nav>
            </div>
            <h1>Favorite Episodes</h1>
            {Object.keys(favoriteEpisodes).length === 0 ? (
                <p>No favorite episodes found.</p>
            ) : (
                <div className="favorite-episodes-list">
                    {Object.keys(favoriteEpisodes).map(podcastTitle => (
                        <div key={podcastTitle} className="favorite-podcast">
                            <h2>{podcastTitle}</h2>
                            {Object.keys(favoriteEpisodes[podcastTitle]).map(episodeTitle => (
                                <div key={episodeTitle} className="favorite-episode">
                                    <h3>{episodeTitle}</h3>
                                    <p>From Season: {favoriteEpisodes[podcastTitle][episodeTitle].seasonTitle}</p>
                                    <p>Date Favorited: {new Date(favoriteEpisodes[podcastTitle][episodeTitle].dateFavorited).toLocaleDateString()}</p>
                                    <img
                                        src={favoriteEpisodes[podcastTitle][episodeTitle].seasonImage}
                                        alt={favoriteEpisodes[podcastTitle][episodeTitle].seasonTitle}
                                        className="season-image"
                                    />
                                    <button
                                        className="unfavorite-button"
                                        onClick={() => handleUnfavorite(podcastTitle, episodeTitle)}
                                    >
                                        Unfavorite
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoriteEpisodes;
