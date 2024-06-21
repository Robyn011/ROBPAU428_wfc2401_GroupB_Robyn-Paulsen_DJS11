import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Importing useParams and Link from react-router-dom
import { LiaMusicSolid } from "react-icons/lia"; // Importing LiaMusicSolid icon from react-icons/lia
import './Page_Style/PodcastPlaylist.css'; // Importing CSS file for styling

const PodcastPlaylist = () => {
    const { podcastId } = useParams(); // Extracting podcastId from URL params using useParams hook
    const [podcast, setPodcast] = useState(null); // State for storing podcast data
    const [loading, setLoading] = useState(true); // Loading state for API fetch
    const [favoriteEpisodes, setFavoriteEpisodes] = useState({}); // State for favorite episodes

    useEffect(() => {
        // Fetch podcast data from API based on podcastId
        fetch(`https://podcast-api.netlify.app/id/${podcastId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPodcast(data); // Set podcast data from API response
                setLoading(false); // Set loading state to false
                // Load favorite episodes from localStorage
                const storedFavorites = localStorage.getItem('favorite-episodes');
                if (storedFavorites) {
                    setFavoriteEpisodes(JSON.parse(storedFavorites)); // Parse and set favorite episodes from localStorage
                }
            })
            .catch(error => {
                console.error('Error fetching podcast data:', error); // Log error if API fetch fails
                setLoading(false); // Set loading state to false
            });
    }, [podcastId]); // Dependency on podcastId ensures effect runs when podcastId changes

    // Loading state
    if (loading) {
        return <p>Loading...</p>; // Show loading message while fetching data
    }

    // Podcast not found state
    if (!podcast) {
        return <p>Podcast not found.</p>; // Show message if podcast data is null
    }

    // Function to save playback position to localStorage
    const savePlaybackPosition = (episodeTitle, currentTime) => {
        const localStorageKey = `episode-${podcastId}-${episodeTitle}`; // Unique key for each episode
        let storedPositions = JSON.parse(localStorage.getItem(localStorageKey)) || {}; // Retrieve stored data or initialize empty object
        storedPositions = {
            ...storedPositions,
            currentTime,
            timestamp: Date.now()
        };
        localStorage.setItem(localStorageKey, JSON.stringify(storedPositions)); // Save updated positions to localStorage
    };

    // Function to load playback position from localStorage
    const loadPlaybackPosition = (episodeTitle) => {
        const localStorageKey = `episode-${podcastId}-${episodeTitle}`; // Unique key for each episode
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
            const storedPositions = JSON.parse(storedData);
            return storedPositions.currentTime || 0; // Return stored currentTime or 0 if not found
        }
        return 0; // Return 0 if no stored data found
    };

    // Function to reset all playback positions for podcast episodes
    const resetPlaybackPositions = () => {
        podcast.seasons.forEach(season => {
            season.episodes.forEach(episode => {
                const localStorageKey = `episode-${podcastId}-${episode.title}`;
                localStorage.removeItem(localStorageKey); // Remove stored playback position for each episode
            });
        });
        alert("Playback positions have been reset."); // Show alert confirming reset
    };

    // Function to toggle favorite status of an episode
    const toggleFavorite = (episodeTitle, seasonTitle, seasonImage) => {
        const updatedFavorites = {
            ...favoriteEpisodes,
            [podcast.title]: {
                ...favoriteEpisodes[podcast.title],
                [episodeTitle]: favoriteEpisodes[podcast.title]?.[episodeTitle]
                    ? null
                    : {
                        seasonTitle,
                        seasonImage,
                        dateFavorited: Date.now()
                    }
            }
        };
        setFavoriteEpisodes(updatedFavorites); // Update favorite episodes state
        localStorage.setItem('favorite-episodes', JSON.stringify(updatedFavorites)); // Save updated favorites to localStorage
    };

    // Function to check if an episode is favorited
    const isFavorite = (episodeTitle) => {
        return favoriteEpisodes[podcast.title]?.[episodeTitle] || false; // Check if episode is favorited
    };

    return (
        <div className="podcast-playlist">
            {/* Header section with podcast title and navigation */}
            <div className="header">
                <div className='Logo'>
                    <p><LiaMusicSolid />TTS</p> {/* Displaying logo */}
                </div>
                <nav>
                    <ul>
                        <li><Link to="/favorite">Favorites</Link></li> {/* Link to favorites page */}
                        <li><Link to="/">Log Out</Link></li> {/* Link to log out */}
                    </ul>
                </nav>
                <h1>{podcast.title}</h1> {/* Displaying podcast title */}
                <button onClick={resetPlaybackPositions} className="reset-button">Reset Progress</button> {/* Button to reset playback progress */}
            </div>
            <img src={podcast.image} alt={podcast.title} className="podcast-playlist-image" /> {/* Displaying podcast image */}
            <p>{podcast.description}</p> {/* Displaying podcast description */}
            {/* Displaying seasons and episodes */}
            <div className="seasons">
                {podcast.seasons.map(season => (
                    <div key={season.id} className="season">
                        <h2>{season.title}</h2> {/* Displaying season title */}
                        <img src={season.image} alt={season.title} className="season-image" /> {/* Displaying season image */}
                        <div className="episodes">
                            {season.episodes.map(episode => (
                                <div key={episode.id} className="episode">
                                    <h3>{episode.title}</h3> {/* Displaying episode title */}
                                    <button 
                                        onClick={() => toggleFavorite(episode.title, season.title, season.image)} 
                                        className={`favorite-button ${isFavorite(episode.title) ? 'favorited' : ''}`}
                                    >
                                        {isFavorite(episode.title) ? 'Unfavorite' : 'Favorite'} {/* Button to favorite/unfavorite episode */}
                                    </button>
                                    <audio
                                        controls
                                        onTimeUpdate={(e) => {
                                            const { currentTime } = e.target;
                                            savePlaybackPosition(episode.title, currentTime); // Save playback position on time update
                                        }}
                                        onLoadedMetadata={(e) => {
                                            e.target.currentTime = loadPlaybackPosition(episode.title); // Load playback position on audio load
                                        }}
                                    >
                                        <source src={episode.file} type="audio/mpeg" /> {/* Audio source */}
                                        Your browser does not support the audio element. {/* Fallback message */}
                                    </audio>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PodcastPlaylist;
