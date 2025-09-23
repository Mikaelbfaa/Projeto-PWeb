import { AnimatePresence, motion } from 'framer-motion';
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
    let pageComponent;
    switch (state.currentPage) {
      case 'home':
        pageComponent = <HomePage />;
        break;
      case 'profile':
        pageComponent = <ProfilePage />;
        break;
      case 'prescription':
        pageComponent = <PrescriptionPage />;
        break;
      case 'admin':
        pageComponent = <AdminPage />;
        break;
      default:
        pageComponent = <HomePage />;
    }

    return (
      <motion.div
        key={state.currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {pageComponent}
      </motion.div>
    );
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <ToastProvider>
        <div className="theme-container min-h-screen transition-colors duration-300 bg-light text-primary dark:bg-dark-bg-primary dark:text-dark-primary">
          <Header />
          <main className="pt-20">
            <AnimatePresence mode="wait">
              {renderPage()}
            </AnimatePresence>
          </main>
        </div>
      </ToastProvider>
    </AppContext.Provider>
  );
};

export default App;