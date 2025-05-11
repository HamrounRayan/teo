import React, { useState } from "react";
import axios from 'axios';
import { BitcoinAnimation } from '../bitcoin-animation';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Backend API URL
  const API_URL = 'https://vault-2g4c.onrender.com';

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = "Username is required!";
    }
    if (!formData.password) {
      newErrors.password = "Password is required!";
    } else if (formData.password.length <= 8) {
      newErrors.password = "Password must be more than 8 characters!";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required!";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSubmitted(false);
    
    if (validateForm()) {
      try {
        setIsLoading(true);
        
        // Send signup request to backend (sans confirmPassword)
        const signupData = {
          username: formData.username,
          password: formData.password
        };
        
        const response = await axios.post(`${API_URL}/api/auth/signup`, signupData);
        
        // Handle successful signup
        setSubmitted(true);
        
        // Option 1: Connexion automatique après inscription
        if (response.data.token) {
          // Si le backend renvoie un token après signup
          localStorage.setItem('token', response.data.token);
          
          // Store user info if provided
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          
          // Redirect to main page
          window.location.href = '/mainpage';
        } else {
          // Option 2: Redirection vers la page de login
          // Attendre 2 secondes pour montrer le message de succès
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
        
      } catch (error) {
        // Handle signup errors
        if (error.response && error.response.data) {
          setServerError(error.response.data.error || error.response.data.message || 'Signup failed. Please try again.');
        } else {
          setServerError('Network error. Please check your connection.');
        }
        console.error('Signup error:', error);
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
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Sign Up</span>
              </h1>
              <p className="text-gray-300">Create an account.</p>
            </div>

            {/* Server error message */}
            {serverError && (
              <div className="mb-4 p-3 bg-red-900/50 backdrop-blur-sm border border-red-500 text-red-200 rounded-lg">
                {serverError}
              </div>
            )}

            {/* Success message */}
            {submitted && !serverError && (
              <div className="mb-4 p-3 bg-green-900/50 backdrop-blur-sm border border-green-500 text-green-200 rounded-lg">
                Account created successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-4">
                <label htmlFor="username" className="block mb-2 text-sm text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={`w-full rounded-lg bg-gray-800/50 backdrop-blur-sm border ${
                    errors.username ? 'border-red-500' : 'border-gray-700'
                  } p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors`}
                  placeholder="Choose a username"
                  disabled={isLoading}
                />
                {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 text-sm text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full rounded-lg bg-gray-800/50 backdrop-blur-sm border ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  } p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                />
                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block mb-2 text-sm text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full rounded-lg bg-gray-800/50 backdrop-blur-sm border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  } p-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-colors`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
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
                    Creating Account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-300">
                Already have an account?{" "}
                <a href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  Log In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;