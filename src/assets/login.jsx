import { useState } from 'react';
import axios from 'axios';
import { BitcoinAnimation } from '../bitcoin-animation';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Backend API URL - store in .env file for production
  const API_URL = 'https://vault-2g4c.onrender.com';

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username / Email is required!';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required!';
    }
    else if (formData.password.length <= 4) {
      newErrors.password = 'Password must be more than 8 characters!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (validateForm()) {
      try {
        setIsLoading(true);
        
        // Send login request to backend
        const response = await axios.post(`${API_URL}/api/auth/login`, formData);
        
        // Handle successful login
        const { token, user } = response.data;
        
        // Store token in localStorage or secure cookie
        localStorage.setItem('token', token);
        
        // Store user info if needed
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to account page
        window.location.href = '/mainpage';
      } catch (error) {   // Handle login errors
        if (error.response && error.response.data) {
          setServerError(error.response.data.message || 'Login failed. Please try again.');
        } else {
          setServerError('Network error. Please check your connection.');
        }
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#050b18]">
      {/* Animation de fond */}
      <div className="absolute inset-0 z-0">
        <BitcoinAnimation />
      </div>

      {/* Contenu avec formulaire */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Conteneur du formulaire avec fond semi-transparent */}
          <div className="backdrop-blur-sm bg-gray-900/30 rounded-xl p-8 shadow-2xl border border-gray-800">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Log In</span>
              </h1>
              <p className="text-gray-300">Welcome Back.</p>
              <p className="text-gray-300">Please Enter Your Details.</p>
            </div>

            {/* Server error message */}
            {serverError && (
              <div className="mb-4 p-3 bg-red-900/50 backdrop-blur-sm border border-red-500 text-red-200 rounded-lg">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email or Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Exemple@Exemple.com / username"
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-400">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>
                <div className="mt-1 text-right">
                  <a href="signup" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    Don't have an account? Sign Up
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full rounded-lg py-3 font-semibold transition-all duration-300 ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;