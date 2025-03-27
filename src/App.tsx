
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { LotteryProvider } from './context/LotteryContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Lotteries from './pages/Lotteries';
import LotteryDetail from './pages/LotteryDetail';
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Results from './pages/Results';
import About from './pages/About';

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
        userName={user?.username}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lotteries" element={<Lotteries />} />
          <Route path="/lottery/:id" element={<LotteryDetail />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
          <Route path="/reset-password" element={!isAuthenticated ? <ResetPassword /> : <Navigate to="/dashboard" />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/tickets" element={isAuthenticated ? <Tickets /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          {user?.role === 'admin' && (
            <Route path="/admin" element={<AdminPanel />} />
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LotteryProvider>
          <AppContent />
          <Toaster />
        </LotteryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
