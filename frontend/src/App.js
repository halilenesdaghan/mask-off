import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PostDetailPage from './pages/PostDetailPage';
import VerifyPage from './pages/VerifyPage'; // Yeni ekledik
import { useAuth } from './context/AuthContext';

// Oturum açık değilse /auth sayfasına yönlendiren özel bir rota
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/verify/:token" element={<VerifyPage />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/posts/:id" 
            element={
              <PrivateRoute>
                <PostDetailPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;