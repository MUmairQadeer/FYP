import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import { CurrencyProvider } from './contexts/CurrencyContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PlanTrip from './pages/PlanTrip';
import Dashboard from './pages/Dashboard';
import Itinerary from './pages/Itinerary';
import BudgetTracker from './pages/BudgetTracker';
import TravelTools from './pages/TravelTools';
import Community from './pages/Community';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plan" element={<PlanTrip />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/itinerary/:id" element={<Itinerary />} />
        <Route path="/budget" element={<BudgetTracker />} />
        <Route path="/tools" element={<TravelTools />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <CurrencyProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)'
                }
              }} 
            />
          </Router>
        </CurrencyProvider>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;