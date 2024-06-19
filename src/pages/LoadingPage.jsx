import React from 'react';
import './Page_Style/LoadingPage.css'; 


const LoadingPage = () => {
  return (
    <div className="loadingPage">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingPage;
