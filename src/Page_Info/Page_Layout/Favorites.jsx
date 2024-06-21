import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LiaMusicSolid } from "react-icons/lia"; // Importing a specific icon component from 'react-icons/lia'
import '../Page_Style/Favorites.css'; // Importing the CSS file for styling

const FavoriteEpisodes = () => {
    const [favoriteEpisodes, setFavoriteEpisodes] = useState({}); // State to hold favorite episodes data

    useEffect(() => {
        // Effect to load favorite episodes from local storage when component mounts
        const storedFavorites = localStorage.getItem('favorite-episodes');
        if (storedFavorites) {
            const favorites = JSON.parse(storedFavorites);
            setFavoriteEpisodes(favorites); // Set favorite episodes state from local storage
        }
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    const handleUnfavorite = (podcastTitle, episodeTitle) => {
        // Function to handle unfavorite button click
        const updatedFavorites = { ...favoriteEpisodes };

        // Remove the episode from the favorites
        if (updatedFavorites[podcastTitle]) {
            delete updatedFavorites[podcastTitle][episodeTitle];

            // Check if there are no more episodes for this podcast, remove the podcast entry
            if (Object.keys(updatedFavorites[podcastTitle]).length === 0) {
                delete updatedFavorites[podcastTitle];
            }

            // Update state and local storage with the updated favorites data
            setFavoriteEpisodes(updatedFavorites);
            localStorage.setItem('favorite-episodes', JSON.stringify(updatedFavorites));
        }
    };

    return (
        <div className="favorite-episodes">
            {/* Header section with logo, navigation links */}
            <div className="header">
                <div className="Logo">
                    <p><LiaMusicSolid />TTS</p> {/* Displaying the 'LiaMusicSolid' icon and text */}
                </div>
                <nav>
                    <ul>
                        <li><Link to="/home">Home</Link></li> {/* Link to Home page */}
                        <li><Link to="/">Log Out</Link></li> {/* Link to Log Out (possibly for user logout) */}
                    </ul>
                </nav>
            </div>
            <h1>Favorite Episodes</h1> {/* Main heading */}
            {/* Conditional rendering based on whether there are favorite episodes */}
            {Object.keys(favoriteEpisodes).length === 0 ? (
                <p>No favorite episodes found.</p> // Display message if no favorite episodes
            ) : (
                <div className="favorite-episodes-list">
                    {/* Iterating over each podcast title in favoriteEpisodes */}
                    {Object.keys(favoriteEpisodes).map(podcastTitle => (
                        <div key={podcastTitle} className="favorite-podcast">
                            <h2>{podcastTitle}</h2> {/* Displaying podcast title */}
                            {/* Iterating over each episode title in the current podcast */}
                            {Object.keys(favoriteEpisodes[podcastTitle]).map(episodeTitle => (
                                <div key={episodeTitle} className="favorite-episode">
                                    <h3>{episodeTitle}</h3> {/* Displaying episode title */}
                                    {/* Displaying additional episode details */}
                                    <p>From Season: {favoriteEpisodes[podcastTitle][episodeTitle].seasonTitle}</p>
                                    <p>Date Favorited: {new Date(favoriteEpisodes[podcastTitle][episodeTitle].dateFavorited).toLocaleDateString()}</p>
                                    <img
                                        src={favoriteEpisodes[podcastTitle][episodeTitle].seasonImage}
                                        alt={favoriteEpisodes[podcastTitle][episodeTitle].seasonTitle}
                                        className="season-image"
                                    />
                                    {/* Button to unfavorite an episode */}
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

export default FavoriteEpisodes; // Exporting the FavoriteEpisodes component
