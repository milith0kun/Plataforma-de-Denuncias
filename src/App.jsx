import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/common/ToastContainer/ToastContainer';
import { NotificationProvider } from './contexts/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
