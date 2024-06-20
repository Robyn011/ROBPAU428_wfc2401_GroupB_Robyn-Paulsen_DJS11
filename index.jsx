import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route }from "react-router-dom";
import Login from './src/Page_Info/LoginPage.jsx';
import LoadingPage from './src/Page_Info/LoadingPage.jsx';
import SignUp from './src/Page_Info/SignUpPage.jsx';
import Home from './src/Page_Info/Page_Layout/Home.jsx';
import Favorite from './src/Page_Info/Favorites.jsx';
import PodcastPlaylist from './src/Page_Info/PodcastPlaylist.jsx'

function App(){
  
 return(
  <BrowserRouter>
  <Routes>
    <Route path = "/" element={<Login />}/>
    <Route path="/loading" element={<LoadingPage />} />
    <Route path ="/home" element = {<Home />}/>
    <Route path="/favorite" element = {<Favorite />}/>
    <Route path= "/signup" element = {<SignUp />}/>
    <Route path = "/PodcastPlaylist/:podcastId" element= {<PodcastPlaylist />}/>
  </Routes>
</BrowserRouter>
 )
}

ReactDOM
  .createRoot(document.getElementById('root'))
  .render(<App />);


