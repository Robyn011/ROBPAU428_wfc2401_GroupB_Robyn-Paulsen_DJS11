import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LiaMusicSolid } from "react-icons/lia"; // Importing an icon component from 'react-icons/lia'
import Fuse from 'fuse.js'; // Importing Fuse.js for fuzzy searching
import '../Page_Style/Header.css'; // Import CSS file for styling
import Recommended from '../Recommended.jsx'; // Importing Recommended component from '../Recommended.jsx'

const Header = () => {
    // State variables initialization
    const [previews, setPreviews] = useState([]); // Holds all podcast data from API
    const [filteredPreviews, setFilteredPreviews] = useState([]); // Holds filtered podcast data
    const [genres, setGenres] = useState({}); // Holds genre data from API
    const [loading, setLoading] = useState(true); // Loading state for API fetch
    const [searchTerm, setSearchTerm] = useState(''); // State for search term input
    const [selectedGenre, setSelectedGenre] = useState(''); // State for selected genre filter
    const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order (ascending by default)

    // Effect to fetch initial podcast data from API on component mount
    useEffect(() => {
        fetch('https://podcast-api.netlify.app')
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.title.localeCompare(b.title)); // Sorting data alphabetically by title
                setPreviews(sortedData); // Set all podcast previews
                setFilteredPreviews(sortedData); // Set filtered previews initially to all podcasts
                setLoading(false); // Set loading state to false after data is fetched
            })
            .catch(error => {
                console.error('Error fetching data:', error); // Log error if data fetching fails
                setLoading(false); // Set loading state to false even if there's an error
            });
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    // Effect to fetch genre data from API on component mount
    useEffect(() => {
        fetchGenres();
    }, []);

    // Function to fetch genre data from API
    const fetchGenres = async () => {
        const genreIds = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // Sample genre IDs to fetch
        const genresData = {};

        await Promise.all(
            genreIds.map(id =>
                fetch(`https://podcast-api.netlify.app/genre/${id}`)
                    .then(response => response.json())
                    .then(data => {
                        genresData[id] = data.title; // Store genre title in genresData object
                    })
                    .catch(error => {
                        console.error('Error fetching genre data:', error); // Log error if genre data fetching fails
                    })
            )
        );

        setGenres(genresData); // Set genres state with fetched genre data
    };

    // Handler for search input change
    const handleSearch = (event) => {
        const value = event.target.value; // Get input value
        setSearchTerm(value); // Update search term state
        filterPodcasts(value, selectedGenre); // Filter podcasts based on new search term and selected genre
    };

    // Handler for genre select change
    const handleGenreChange = (event) => {
        const value = event.target.value; // Get selected genre value
        setSelectedGenre(value); // Update selected genre state
        filterPodcasts(searchTerm, value); // Filter podcasts based on new selected genre and current search term
    };

    // Handler for sorting select change
    const handleSortChange = (event) => {
        const value = event.target.value; // Get selected sorting order value
        setSortOrder(value); // Update sorting order state
        sortPodcasts(value); // Sort filtered podcasts based on new sorting order
    };

    // Function to sort podcasts based on selected order
    const sortPodcasts = (order) => {
        const sortedData = [...filteredPreviews]; // Create a copy of filtered previews

        if (order === 'asc') {
            sortedData.sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically (ascending)
        } else if (order === 'desc') {
            sortedData.sort((a, b) => b.title.localeCompare(a.title)); // Sort alphabetically (descending)
        }

        setFilteredPreviews(sortedData); // Update filtered previews with sorted data
    };

    // Function to filter podcasts based on search term and selected genre
    const filterPodcasts = (searchTerm, selectedGenre) => {
        let filtered = [...previews]; // Create a copy of all previews

        if (searchTerm) {
            const fuse = new Fuse(previews, {
                keys: ['title'],
                threshold: 0.3 // Adjust the threshold for fuzzy matching
            });
            const result = fuse.search(searchTerm); // Perform fuzzy search
            filtered = result.map(res => res.item); // Update filtered array with fuzzy search results
        }

        if (selectedGenre) {
            filtered = filtered.filter(preview => preview.genreIds.includes(parseInt(selectedGenre))); // Filter by selected genre
        }

        sortPodcasts(sortOrder); // Sort filtered results
        setFilteredPreviews(filtered); // Update filtered previews state with filtered data
    };

    // Function to format date string to localized date format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Adjust format as needed
    };

    return (
        <div className="header_layout">
            <div className="header-top">
                {/* Logo and navigation */}
                <div className="logo-container">
                    <Link to="/" className="logo-link">
                        <LiaMusicSolid className="logo-icon" />
                        <span className="logo-text">The Timeless Escape</span>
                    </Link>
                </div>
                <nav className="navigation-container">
                    <ul className="navigation">
                        <li><Link to="/favorite">Favorites</Link></li> {/* Link to favorites page */}
                        <li><Link to="/">Log Out</Link></li> {/* Link to log out */}
                    </ul>
                </nav>
            </div>
            {/* Search form */}
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
            
            {/* Recommended component */}
            <div><Recommended /></div>

            {/* Displaying podcast list */}
            <div className="podcast-list">
                {loading ? (
                    <p>Loading...</p> // Show loading message while fetching data
                ) : (
                    filteredPreviews.map(preview => (
                        <div key={preview.id} className="podcast-item">
                            <Link to={`/PodcastPlaylist/${preview.id}`}>
                                {preview.image && <img src={preview.image} alt={preview.title} className="podcast-image" />} {/* Display podcast image if available */}
                            </Link>
                            <div>
                                <h3>{preview.title}</h3> {/* Display podcast title */}
                                {preview.genre && <p className="podcast-genre">Genre: {preview.genre}</p>} {/* Display podcast genre if available */}
                                {preview.updated && <p className="podcast-modified">Date modified: {formatDate(preview.updated)}</p>} {/* Display date modified if available */}
                                {preview.description && <p>{preview.description}</p>} {/* Display podcast description if available */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Header; // Exporting the Header component
