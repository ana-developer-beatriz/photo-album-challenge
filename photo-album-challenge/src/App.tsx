import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import { PhotoAlbumPage } from './pages/PhotoAlbumPage.tsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/photo-album' element={<PhotoAlbumPage />} />
      </Routes>
    </Router>
  );
}

export default App;
