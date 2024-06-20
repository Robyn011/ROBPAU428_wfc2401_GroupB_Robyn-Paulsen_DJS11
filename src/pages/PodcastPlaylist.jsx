import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Page_Style/PodcastPlaylist.css'

const PodcastPlaylist = () => {
  const { podcastId } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://podcast-api.netlify.app/id/${podcastId}`)
      .then(response => response.json())
      .then(data => {
        setPodcast(data);
        setLoading(false);
      });
  }, [podcastId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!podcast) {
    return <p>Podcast not found.</p>;
  }

  return (
    <div className="podcast-playlist">
      <h1>{podcast.title}</h1>
      <img src={podcast.image} alt={podcast.title} className="podcast-playlist-image" />
      <p>{podcast.description}</p>
      <div className="episodes">
        {podcast.seasons.map(season => (
          <div key={season.id} className="season">
            <h2>Season {season.number}</h2>
            {season.episodes.map(episode => (
              <div key={episode.id} className="episode">
                <h3>{episode.title}</h3>
                <audio controls>
                  <source src={episode.audio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PodcastPlaylist;
