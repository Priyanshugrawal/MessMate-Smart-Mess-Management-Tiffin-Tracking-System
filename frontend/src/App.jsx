import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import MenuPage from './pages/MenuPage';
import SkipMealPage from './pages/SkipMealPage';
import DeliveryPage from './pages/DeliveryPage';
import DeliveryListPage from './pages/DeliveryListPage';
import TransactionsPage from './pages/TransactionsPage';
import PaymentPage from './pages/PaymentPage';
import ComplaintsPage from './pages/ComplaintsPage';
import ChatPage from './pages/ChatPage';
import SuggestionsPage from './pages/SuggestionsPage';
import RatingsPage from './pages/RatingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/skip-meal" element={<SkipMealPage />} />
            <Route path="/delivery" element={<DeliveryPage />} />
            <Route 
              path="/delivery-list" 
              element={
                <ProtectedRoute role="admin">
                  <DeliveryListPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route 
              path="/payments" 
              element={
                <ProtectedRoute role="student">
                  <PaymentPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/complaints" element={<ComplaintsPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/suggestions" element={<SuggestionsPage />} />
            <Route path="/ratings" element={<RatingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
