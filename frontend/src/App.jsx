import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import WorkerDashboard from './pages/dashboards/WorkerDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import ThemeContext from './context/ThemeContext';

const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'worker') return <WorkerDashboard />;
  return <CustomerDashboard />;
};

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex flex-col min-h-screen bg-gold-50 dark:bg-dark-950 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" theme={theme} />
    </div>
  );
}

export default App;