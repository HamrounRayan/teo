import React, { useEffect, useState } from 'react';
import { CreditCard, X, Send, DollarSign, User } from 'lucide-react';
import axios from 'axios';
import { BitcoinAnimation } from '../bitcoin-animation';

const CreditCardApp = () => {
  // États pour gérer le popup et les données du formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // États pour les données du profil
  const [profileData, setProfileData] = useState({
    username: 'Chargement...',
    balance: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = 'https://vault-2g4c.onrender.com';
  
  // Date d'expiration fictive pour la carte
  const expDate = '12/28';
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        console.log('Token récupéré:', token ? 'Oui' : 'Non');
        
        if (!token) {
          setError('Aucun token trouvé. Veuillez vous connecter.');
          setIsLoading(false);
          return;
        }
        
        // Syntaxe correcte pour POST avec body vide et headers
        const response = await axios.post(`${API_URL}/api/auth/profile`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Réponse du serveur:', response.data);
        
        // Mettre à jour les données du profil 
        if (response.data) {
          setProfileData({
            username: response.data.username || 'John Doe',
            balance: response.data.balance || 0
          });
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Erreur détaillée:', err);
        console.error('Status:', err.response?.status);
        console.error('Message:', err.response?.data);
        
        if (err.response?.status === 401) {
          setError('Token invalide ou expiré. Veuillez vous reconnecter.');
        } else {
          setError('Erreur lors du chargement du profil');
        }
        
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && amount) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Veuillez vous connecter pour effectuer une transaction');
          return;
        }
        
        // Envoyer la transaction avec les bonnes propriétés
        await axios.post(`${API_URL}/api/transact`, {
          to: username,  // Changé de 'recipient' à 'to'
          amount: parseFloat(amount)
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setIsSuccess(true);
        
        // Rafraîchir le profil pour mettre à jour le solde
        const response = await axios.post(`${API_URL}/api/auth/profile`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setProfileData({
            username: response.data.username || profileData.username,
            balance: response.data.balance || 0
          });
        }
        
        // Réinitialiser le formulaire après 2 secondes et fermer le modal
        setTimeout(() => {
          setIsSuccess(false);
          setIsModalOpen(false);
          setUsername('');
          setAmount('');
        }, 2000);
      } catch (err) {
        console.error('Erreur lors de la transaction:', err);
        setError(err.response?.data?.error || 'La transaction a échoué. Veuillez réessayer.');
      }
    }
  };
  
  // Formatter le solde avec 2 décimales
  const formattedBalance = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(profileData.balance);
  
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#050b18]">
      {/* Animation de fond */}
      <div className="absolute inset-0 z-0">
        <BitcoinAnimation />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Mon Compte</span>
            </h1>
            <p className="mt-2 text-gray-300">Gérez vos finances en toute simplicité</p>
          </div>
          
          {/* Affichage des erreurs */}
          {error && (
            <div className="bg-red-900/50 backdrop-blur-sm border border-red-500 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
              <span className="block sm:inline">{error}</span>
              <button 
                onClick={() => setError(null)} 
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <X size={16} className="text-red-200" />
              </button>
            </div>
          )}
          
          {/* Card Container avec glassmorphism */}
          <div className="backdrop-blur-sm bg-gray-900/30 rounded-xl p-6 shadow-2xl border border-gray-800">
            {/* Credit Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-xl">Carte Virtuelle</div>
                <CreditCard size={32} />
              </div>
              
              <div className="mb-6 mt-4">
                {/* Numéro de carte enlevé */}
              </div>
              
              <div className="flex justify-between">
                <div>
                  <div className="text-xs text-gray-200">TITULAIRE</div>
                  <div className="font-medium">
                    {isLoading ? 'Chargement...' : profileData.username.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-200">EXP</div>
                  <div>{expDate}</div>
                </div>
              </div>
            </div>
            
            {/* Balance Card dans le même container */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Solde disponible</h3>
                  <p className="text-2xl font-bold text-white mt-1">
                    {isLoading ? 'Chargement...' : `${formattedBalance} TEO coins`}
                  </p>
                </div>
                <div className="bg-green-900/50 backdrop-blur-sm p-3 rounded-full">
                  <DollarSign className="text-green-400" size={24} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Send Money Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold py-3 px-6 rounded-lg flex items-center shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              disabled={isLoading}
            >
              <Send className="mr-2" size={18} />
              Envoyer de l'argent
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal for sending money */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-sm bg-gray-900/90 rounded-lg shadow-xl max-w-md w-full p-6 relative border border-gray-700">
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setError(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6">Envoyer de l'argent</h2>
            
            {error && (
              <div className="bg-red-900/50 backdrop-blur-sm border border-red-500 text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-green-900/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  <div className="text-green-400 text-2xl">✓</div>
                </div>
                <p className="text-lg font-medium text-white">
                  Transfert réussi !
                </p>
                <p className="text-gray-300 mt-2">
                  {amount} coins ont été envoyés à {username}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-300 font-medium mb-2">
                    Destinataire
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="Entrez le nom du destinataire"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="amount" className="block text-gray-300 font-medium mb-2">
                    Montant (coins)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  <Send className="mr-2" size={18} />
                  Envoyer maintenant
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default CreditCardApp;