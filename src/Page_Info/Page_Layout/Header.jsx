import React, { useState, useEffect } from 'react';

import { LiaMusicSolid } from "react-icons/lia";
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import '../Page_Style/Header.css'; // Import CSS file for styling
import Recommended from '../Recommended.jsx';



const Header = () => {
  const [previews, setPreviews] = useState([]);
  const [filteredPreviews, setFilteredPreviews] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));
        setPreviews(sortedData);
        setFilteredPreviews(sortedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    const genreIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const genresData = {};

    await Promise.all(
      genreIds.map(id =>
        fetch(`https://podcast-api.netlify.app/genre/${id}`)
          .then(response => response.json())
          .then(data => {
            genresData[id] = data.title;
          })
          .catch(error => {
            console.error('Error fetching genre data:', error);
          })
      )
    );

    setGenres(genresData);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterPodcasts(value, selectedGenre);
  };

  const handleGenreChange = (event) => {
    const value = event.target.value;
    setSelectedGenre(value);
    filterPodcasts(searchTerm, value);
  };

  const filterPodcasts = (searchTerm, selectedGenre) => {
    let filtered = previews;

    if (searchTerm) {
      const fuse = new Fuse(previews, {
        keys: ['title'],
        threshold: 0.3 // Adjust the threshold for fuzzy matching
      });
      const result = fuse.search(searchTerm);
      filtered = result.map(res => res.item);
    }

    if (selectedGenre) {
      filtered = filtered.filter(preview => preview.genreIds.includes(parseInt(selectedGenre)));
    }

    setFilteredPreviews(filtered);
  };

  return (
    <div className="header_layout">
      <div className='Logo'>
        <p><LiaMusicSolid />TTS</p>
      </div>
      <nav>
        <ul>
          <li><Link to="/favorite">Favorites</Link></li>
          <li><Link to="/login">Log Out</Link></li>
        </ul>
      </nav>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search Podcasts..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="">All Genres</option>
          {Object.entries(genres).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </div>
      <div> <Recommended /></div>
     
      <div className="podcast-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          filteredPreviews.map(preview => (
            <div key={preview.id} className="podcast-item">
              <Link to={`/PodcastPlaylist/${preview.id}`}>
                {preview.image && <img src={preview.image} alt={preview.title} className="podcast-image" />}
                <h3>{preview.title}</h3>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Header;
