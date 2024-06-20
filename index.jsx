import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route }from "react-router-dom";
import Login from './src/pages/LoginPage.jsx';
import SignUp from './src/pages/SignUpPage.jsx';
import Home from './src/pages/HomePage.jsx';
import Favorite from './src/pages/Favorites.jsx';
import PodcastPlaylist from './src/pages/PodcastPlaylist.jsx'

function App(){
 return(
  <BrowserRouter>
  <Routes>
    <Route path = "/" element={<Login />}/>
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


