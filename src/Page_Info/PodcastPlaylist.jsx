import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Page_Style/PodcastPlaylist.css';

const PodcastPlaylist = () => {
    const { podcastId } = useParams();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const savePlaybackPosition = (episodeId, currentTime) => {
        const localStorageKey = `episode-${episodeId}`;
        const storedData = localStorage.getItem(localStorageKey);
        let storedPositions = storedData ? JSON.parse(storedData) : {};
        storedPositions = {
            ...storedPositions,
            [podcastId]: { // Store position for this specific podcastId
                currentTime,
                timestamp: Date.now()
            }
        };
        localStorage.setItem(localStorageKey, JSON.stringify(storedPositions));
        console.log(`Saved playback position for episode ${episodeId} in podcast ${podcastId}: ${currentTime}`);
    };

    const loadPlaybackPosition = (episodeId) => {
        const localStorageKey = `episode-${episodeId}`;
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
            const storedPositions = JSON.parse(storedData);
            const podcastPosition = storedPositions[podcastId];
            if (podcastPosition) {
                console.log(`Loaded playback position for episode ${episodeId} in podcast ${podcastId}: ${podcastPosition.currentTime}`);
                return podcastPosition.currentTime || 0;
            }
        }
        console.log(`No playback position found for episode ${episodeId} in podcast ${podcastId}. Defaulting to 0.`);
        return 0; // Default to beginning if no stored position found
    };

    return (
        <div className="podcast-playlist">
            <h1>{podcast.title}</h1>
            <img src={podcast.image} alt={podcast.title} className="podcast-playlist-image" />
            <p>{podcast.description}</p>
            <div className="seasons">
                {podcast.seasons.map(season => (
                    <div key={season.id} className="season">
                        <h2>Season: {season.title}</h2>
                        <img src={season.image} alt={season.title} className="season-image" />
                        <div className="episodes">
                            {season.episodes.map(episode => (
                                <div key={episode.id} className="episode">
                                    <h3>Episode: {episode.title}</h3>
                                    <audio
                                        controls
                                        onTimeUpdate={(e) => {
                                            const { currentTime } = e.target;
                                            savePlaybackPosition(episode.id, currentTime);
                                        }}
                                        onLoadedMetadata={(e) => {
                                            e.target.currentTime = loadPlaybackPosition(episode.id);
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
