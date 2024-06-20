import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './Page_Style/HomePage.css'; // Import CSS file
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


const HomePage = () => {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then(response => response.json())
      .then(data => {
        // Shuffle the array and take the first 5 items
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setPreviews(selected);
        setLoading(false);
      });
  }, []);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const truncateDescription = (description) => {
    const sentences = description.split('. ');
    return sentences.slice(0, 4).join('. ') + (sentences.length > 4 ? '...' : '');
  };

  return (
    <div className="container">
      <h1>Welcome to the Podcast Homepage</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Featured Podcasts:</h2>
          <Slider {...carouselSettings}>
            {previews.map(preview => (
              <div key={preview.id} className="podcast-item">
                <h3>{preview.title}</h3>
                <Link to={`/PodcastPlaylist/${preview.id}`}>
                  {preview.image && <img src={preview.image} alt={preview.title} className="podcast-image" />}
                </Link>
                <p className="podcast-description">{truncateDescription(preview.description)}</p>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default HomePage;