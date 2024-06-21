import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LiaMusicSolid } from "react-icons/lia";
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
    const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order

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

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortOrder(value);
        sortPodcasts(value);
    };

    const sortPodcasts = (order) => {
        const sortedData = [...filteredPreviews];

        if (order === 'asc') {
            sortedData.sort((a, b) => a.title.localeCompare(b.title));
        } else if (order === 'desc') {
            sortedData.sort((a, b) => b.title.localeCompare(a.title));
        }

        setFilteredPreviews(sortedData);
    };

    const filterPodcasts = (searchTerm, selectedGenre) => {
        let filtered = [...previews];

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

        sortPodcasts(sortOrder); // Sort filtered results
        setFilteredPreviews(filtered);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust format as needed
    };

    return (
        <div className="header_layout">
            <div className="header-top">
                <div className="logo-container">
                    <Link to="/" className="logo-link">
                        <LiaMusicSolid className="logo-icon" />
                        <span className="logo-text">TTS</span>
                    </Link>
                </div>
                <nav className="navigation-container">
                    <ul className="navigation">
                        <li><Link to="/favorite">Favorites</Link></li>
                        <li><Link to="/login">Log Out</Link></li>
                    </ul>
                </nav>
            </div>
            <div className="search-form">
                <input
                    type="text"
                    placeholder="Search Podcasts..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                />
                <select value={selectedGenre} onChange={handleGenreChange} className="genre-select">
                    <option value="">All Genres</option>
                    {Object.entries(genres).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>
                <select value={sortOrder} onChange={handleSortChange} className="sort-select">
                    <option value="asc">A-Z</option>
                    <option value="desc">Z-A</option>
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
                            </Link>
                            <div>
                                <h3>{preview.title}</h3>
                                {preview.genre && <p className="podcast-genre">Genre: {preview.genre}</p>}
                                {preview.updated && <p className="podcast-modified">Date modified: {formatDate(preview.updated)}</p>}
                                {preview.description && <p>{preview.description}</p>}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Header;
