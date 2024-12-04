import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../frontend/pages/LoginPage';
import RegisterPage from '../frontend/pages/RegisterPage';
import AlbumsPage from './pages/AlbumsPage';
import UsersPage from './pages/UsersPage';
import PhotosPage from './pages/PhotosPage';
import MyAlbumsPage from './pages/MyAlbumsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/users' element={<UsersPage />} /> {/* Route for users list */}
        <Route path='/albums/:userId' element={<AlbumsPage />} />
        <Route path='/albums/:albumId/photos' element={<PhotosPage />} />
        <Route path='/myAlbums/' element={<MyAlbumsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
