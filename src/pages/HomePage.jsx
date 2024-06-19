import React, { useState, useEffect } from 'react';


const HomePage = () => {
  const [previews, setPreviews] = useState([]);
  const [genres, setGenres] = useState({});
  const [loading, setLoading] = useState(true); // State to manage loading state
  const genreTitles = {
    1: 'Personal Growth',
    2: 'Investigative Journalism',
    3: 'History',
    4: 'Comedy',
    5: 'Entertainment',
    6: 'Business',
    7: 'Fiction',
    8: 'News',
    9: 'Kids and Family'
  };

  useEffect(() => {
    // Fetch previews data
    fetch('https://podcast-api.netlify.app')
      .then(response => response.json())
      .then(data => {
        setPreviews(data);
        setLoading(false); // Set loading to false after data is fetched
      });

    // Fetch genre data for each genre ID
    const fetchGenres = async () => {
      const genreData = {};
      for (let genreId in genreTitles) {
        const response = await fetch(`https://podcast-api.netlify.app/genre/${genreId}`);
        const genre = await response.json();
        genreData[genreId] = genre;
      }
      setGenres(genreData);
    };

    fetchGenres();
  }, []);

  // Settings for the react-slick carousel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
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

  return (
    <div>
      <h1>Welcome to the Podcast Homepage</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Featured Podcasts:</h2>
          <Slider {...carouselSettings}>
            {previews.map(preview => (
              <div key={preview.id}>
                <h3>{preview.title}</h3>
                {preview.image && <img src={preview.image} alt={preview.title} style={{ maxWidth: '100%', height: 'auto' }} />}
                <p>{preview.description}</p>
                <p>Genre: {genreTitles[preview.genre_id]}</p>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default HomePage;
