import { useEffect, useReducer } from 'react';
import Header from './components/common/Header';
import { AppContext } from './context/AppContext';
import { appReducer, initialState } from './context/appReducer';
import { ToastProvider } from './context/ToastContext';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import PrescriptionPage from './pages/PrescriptionPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    localStorage.setItem('darkTheme', state.darkTheme);
    if (state.darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkTheme]);

  const renderPage = () => {
    switch (state.currentPage) {
      case 'home':
        return <HomePage />;
      case 'profile':
        return <ProfilePage />;
      case 'prescription':
        return <PrescriptionPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <ToastProvider>
        <div className="min-h-screen transition-colors duration-300 bg-light text-primary dark:bg-dark-bg-primary dark:text-dark-primary">
          <Header />
          <main className="pt-20">
            {renderPage()}
          </main>
        </div>
      </ToastProvider>
    </AppContext.Provider>
  );
};

export default App;