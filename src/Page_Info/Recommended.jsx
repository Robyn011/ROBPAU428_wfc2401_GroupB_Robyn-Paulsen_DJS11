import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './Page_Style/HomePage.css'; // Import CSS file
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Recommended = () => {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then(response => response.json())
      .then(data => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        setPreviews(selected);
        setLoading(false);
      });
  }, []);

  const truncateDescription = (description) => {
    const sentences = description.split('. ');
    return sentences.slice(0, 4).join('. ') + (sentences.length > 4 ? '...' : '');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Featured Podcasts:</h2>
          <Slider {...carouselSettings}>
            {previews.map(preview => (
              <div key={preview.id} className="podcast-item">
                <h3>{preview.title}</h3>
                <div className="podcast-content">
                  <Link to={`/PodcastPlaylist/${preview.id}`}>
                    {preview.image && <img src={preview.image} alt={preview.title} className="podcast-image" />}
                  </Link>
                  <div className="podcast-description">
                    <p>{truncateDescription(preview.description)}</p>
                    <p className="podcast-genre">{preview.genre}</p>
                    <p className="podcast-modified">{formatDate(preview.modified)}</p>
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
