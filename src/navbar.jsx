import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home, History, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const API_URL = 'https://vault-2g4c.onrender.com/api';
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await axios.post(
            `${API_URL}/auth/profile`, 
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Si erreur d'authentification, supprimer le token
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };
  
  const handleNavigate = (path) => {
    navigate(path);
  };

  const isAuthenticated = !!localStorage.getItem('token');

  // Ne pas afficher la navbar si l'utilisateur n'est pas connecté
  if (!isAuthenticated || !user || loading) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 p-4">
      <div className="backdrop-blur-md bg-gray-900/30 rounded-xl border border-gray-800 px-6 py-3 shadow-lg">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <button 
            onClick={() => handleNavigate('/')} 
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity hidden md:block"
          >
            Vault
          </button>
          
          {/* Menu Items */}
          <div className="flex items-center gap-6">
     
            
            {/* Navigation Buttons */}
            <button 
              onClick={() => handleNavigate('/mainpage')} 
              className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
            >
              <Home size={18} />
              <span>Dashboard</span>
            </button>
            
            <button 
              onClick={() => handleNavigate('/transaction-history')} 
              className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors"
            >
              <History size={18} />
              <span>History</span>
            </button>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;