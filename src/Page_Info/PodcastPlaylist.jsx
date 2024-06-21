import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LiaMusicSolid } from "react-icons/lia";
import './Page_Style/PodcastPlaylist.css';

const PodcastPlaylist = () => {
    const { podcastId } = useParams();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favoriteEpisodes, setFavoriteEpisodes] = useState({});

    useEffect(() => {
        fetch(`https://podcast-api.netlify.app/id/${podcastId}`)
            .then(response => {
                if (!response.ok) {
                   
                    throw new Error('Network response was not ok');
                } 

                return response.json();
            })
            .then(data => {
                setPodcast(data);
                setLoading(false);

                // Load favorite episodes from localStorage
                const storedFavorites = localStorage.getItem('favorite-episodes');
                if (storedFavorites) {
                    setFavoriteEpisodes(JSON.parse(storedFavorites));
                }
            })
            .catch(error => {
                console.error('Error fetching podcast data:', error);
                setLoading(false);
            });
    }, [podcastId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!podcast) {
        return <p>Podcast not found.</p>;
    }

    const savePlaybackPosition = (episodeTitle, currentTime) => {
        const localStorageKey = `episode-${podcastId}-${episodeTitle}`; // Unique key for each episode
        const storedData = localStorage.getItem(localStorageKey);
        let storedPositions = storedData ? JSON.parse(storedData) : {};
        storedPositions = {
            ...storedPositions,
            currentTime,
            timestamp: Date.now()
        };
        localStorage.setItem(localStorageKey, JSON.stringify(storedPositions));
    };

    const loadPlaybackPosition = (episodeTitle) => {
        const localStorageKey = `episode-${podcastId}-${episodeTitle}`; // Unique key for each episode
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
            const storedPositions = JSON.parse(storedData);
            return storedPositions.currentTime || 0;
        }
        return 0;
    };

    const resetPlaybackPositions = () => {
        podcast.seasons.forEach(season => {
            season.episodes.forEach(episode => {
                const localStorageKey = `episode-${podcastId}-${episode.title}`;
                localStorage.removeItem(localStorageKey);
            });
        });
        alert("Playback positions have been reset.");
    };

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
        setFavoriteEpisodes(updatedFavorites);
        localStorage.setItem('favorite-episodes', JSON.stringify(updatedFavorites));
    };

    const isFavorite = (episodeTitle) => {
        return favoriteEpisodes[podcast.title]?.[episodeTitle] || false;
    };

    return (
        <div className="podcast-playlist">
            <div className="header">
                <div className='Logo'>
                    <p><LiaMusicSolid />TTS</p> 
                </div>
                <nav>
                    <ul>
                        <li><Link to="/favorite">Favorites</Link></li>
                        <li><Link to="/">Log Out</Link></li>
                    </ul>
                </nav>
                <h1>{podcast.title}</h1>
                <button onClick={resetPlaybackPositions} className="reset-button">Reset Progress</button>
            </div>
            <img src={podcast.image} alt={podcast.title} className="podcast-playlist-image" />
            <p>{podcast.description}</p>
            <div className="seasons">
                {podcast.seasons.map(season => (
                    <div key={season.id} className="season">
                        <h2>{season.title}</h2>
                        <img src={season.image} alt={season.title} className="season-image" />
                        <div className="episodes">
                            {season.episodes.map(episode => (
                                <div key={episode.id} className="episode">
                                    <h3>{episode.title}</h3>
                                    <button 
                                        onClick={() => toggleFavorite(episode.title, season.title, season.image)} 
                                        className={`favorite-button ${isFavorite(episode.title) ? 'favorited' : ''}`}
                                    >
                                        {isFavorite(episode.title) ? 'Unfavorite' : 'Favorite'}
                                    </button>
                                    <audio
                                        controls
                                        onTimeUpdate={(e) => {
                                            const { currentTime } = e.target;
                                            savePlaybackPosition(episode.title, currentTime); // Use episode title here
                                        }}
                                        onLoadedMetadata={(e) => {
                                            e.target.currentTime = loadPlaybackPosition(episode.title); // Use episode title here
                                        }}
                                    >
                                        <source src={episode.file} type="audio/mpeg" />
                                        Your browser does not support the audio element.
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
