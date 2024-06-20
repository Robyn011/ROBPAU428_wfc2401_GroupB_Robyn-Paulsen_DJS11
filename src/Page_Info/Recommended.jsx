import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './Page_Style/HomePage.css'; // Import CSS file
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Recommended = () => {
  // State to store the podcast previews and loading status
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching podcast data from the API when the component mounts
  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then(response => response.json())
      .then(data => {
        // Shuffle the data array randomly
        const shuffled = data.sort(() => 0.5 - Math.random());
        // Select the first 5 previews from the shuffled array
        const selected = shuffled.slice(0, 5);
        // Update state with the selected previews and mark loading as false
        setPreviews(selected);
        setLoading(false);
      })
      .catch(error => {
        // Log an error message if fetching data fails and mark loading as false
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures useEffect runs only once when the component mounts

  // Function to truncate long descriptions for display
  const truncateDescription = (description) => {
    const sentences = description.split('. ');
    return sentences.slice(0, 4).join('. ') + (sentences.length > 4 ? '...' : '');
  };

  // Function to format date strings into a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Custom next arrow component for the Slider
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-arrow next-arrow`}
        style={{ ...style, display: 'block', right: '-25px' }}
        onClick={onClick}
      />
    );
  };

  // Custom previous arrow component for the Slider
  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} custom-arrow prev-arrow`}
        style={{ ...style, display: 'block', left: '-25px' }}
        onClick={onClick}
      />
    );
  };

  // Settings configuration for the Slider component
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    nextArrow: <NextArrow />, // Custom next arrow component
    prevArrow: <PrevArrow />, // Custom previous arrow component
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          nextArrow: <NextArrow />,
          prevArrow: <PrevArrow />
        }
      }
    ]
  };

  return (
    <div className="container">
      {loading ? ( // Display a loading message while data is being fetched
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Featured Podcasts:</h2>
          {/* Slider component to display podcast previews */}
          <Slider {...carouselSettings}>
            {previews.map(preview => (
              <div key={preview.id} className="podcast-item">
                <h3>{preview.title}</h3>
                <div className="podcast-content">
                  {/* Link to the detailed podcast page */}
                  <Link to={`/PodcastPlaylist/${preview.id}`}>
                    {preview.image && <img src={preview.image} alt={preview.title} className="podcast-image" />}
                  </Link>
                  <div className="podcast-description">
                    {/* Display truncated description */}
                    <p>{truncateDescription(preview.description)}</p>
                    {/* Display genre */}
                    <p className="podcast-genre">Genre: {preview.genre}</p>
                    {/* Display formatted date of last update */}
                    <p className="podcast-modified">Date modified: {formatDate(preview.updated)}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default Recommended;
