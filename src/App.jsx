import { Routes, Route } from 'react-router-dom';
import LoginPage from './assets/login.jsx';
import SignupPage from './assets/signup.jsx';
import MainPage from './assets/mainpage.jsx';
import TransactionHistory from './TransactionHistory.jsx'; 
import Navbar from './navbar.jsx'; 
import Home from './page1.jsx';

function App() {
  return (
    <>
    <Navbar />
    {/* Routes pour la page d'accueil, la connexion et l'inscription */}
   <Routes>
   <Route path="/" element={<Home />} />
   <Route path="/login" element={<LoginPage />} />
   <Route path="/signup" element={<SignupPage />} />
   </Routes>
    <Routes>
      <Route path="/mainpage" element={<MainPage />} />
      <Route path="/transaction-history" element={<TransactionHistory />} />
      {/* Autres routes ici */}
    </Routes>
    </>
  );
}

export default App;