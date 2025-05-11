import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BitcoinAnimation } from './bitcoin-animation';
import { ArrowDownCircle, ArrowUpCircle, Clock, Package } from 'lucide-react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const API_URL = 'https://vault-2g4c.onrender.com/api';

  // Récupérer les données de l'utilisateur
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          setUserLoading(false);
          return;
        }

        const res = await axios.post(
          `${API_URL}/auth/profile`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setUser(res.data);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('User profile error:', err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Récupérer l'historique des transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${API_URL}/transact/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setTransactions(res.data);
      } catch (err) {
        setError('Failed to load transaction history');
        console.error('Transaction history error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Attendre que les données user soient chargées avant de récupérer les transactions
    if (!userLoading) {
      fetchTransactions();
    }
  }, [userLoading]);

  // Filter transactions that involve the current user
  const userTransactions = transactions.flatMap(block => 
    block.transactions.filter(tx => 
      tx.from === user?.username || tx.to === user?.username
    ).map(tx => ({
      ...tx,
      blockIndex: block.index,
      timestamp: new Date(block.timestamp).toLocaleString(),
      type: tx.from === user?.username ? 'sent' : 'received'
    }))
  );

  if (loading || userLoading) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#050b18]">
        <div className="absolute inset-0 z-0">
          <BitcoinAnimation />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading transaction history...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#050b18]">
        <div className="absolute inset-0 z-0">
          <BitcoinAnimation />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="backdrop-blur-sm bg-gray-900/30 rounded-xl p-8 shadow-2xl border border-gray-800 max-w-md">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#050b18]">
        <div className="absolute inset-0 z-0">
          <BitcoinAnimation />
        </div>
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="backdrop-blur-sm bg-gray-900/30 rounded-xl p-8 shadow-2xl border border-gray-800 max-w-md">
            <p className="text-red-400 text-center">User not authenticated</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#050b18]">
      {/* Animation de fond */}
      <div className="absolute inset-0 z-0">
        <BitcoinAnimation />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4 pt-24">
        <div className="w-full max-w-4xl">
          <div className="backdrop-blur-sm bg-gray-900/30 rounded-xl p-8 shadow-2xl border border-gray-800">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Transaction History
              </span>
            </h2>
            
            {userTransactions.length === 0 ? (
              <p className="text-center text-gray-300 py-8">No transactions found.</p>
            ) : (
              <div className="space-y-4">
                {userTransactions.map((tx, index) => (
                  <div 
                    key={index} 
                    className={`backdrop-blur-sm rounded-lg p-6 border transition-all duration-300 hover:shadow-lg ${
                      tx.type === 'sent' 
                        ? 'bg-red-900/20 border-red-800 hover:border-red-600' 
                        : 'bg-green-900/20 border-green-800 hover:border-green-600'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        {tx.type === 'sent' ? (
                          <ArrowUpCircle className="text-red-400" size={24} />
                        ) : (
                          <ArrowDownCircle className="text-green-400" size={24} />
                        )}
                        <span className={`font-semibold text-lg ${
                          tx.type === 'sent' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {tx.type === 'sent' ? 'Sent' : 'Received'}
                        </span>
                      </div>
                      <span className={`font-bold text-xl ${
                        tx.type === 'sent' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {tx.type === 'sent' ? '-' : '+'}{tx.amount} TEO coins
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        {tx.type === 'sent' ? (
                          <>
                            <span className="text-gray-400">To:</span>
                            <span className="font-medium text-white">{tx.to}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-400">From:</span>
                            <span className="font-medium text-white">{tx.from}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Package className="text-gray-400" size={16} />
                        <span className="text-gray-400">Block:</span>
                        <span className="font-medium text-cyan-400">{tx.blockIndex}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="text-gray-400" size={16} />
                        <span className="text-gray-400">Date:</span>
                        <span className="font-medium">{tx.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionHistory;