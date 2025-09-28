import React, { useReducer, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import { appReducer, initialState } from './context/appReducer';
import { ToastProvider } from './context/ToastContext';
import Header from './components/common/Header';
import OfflineModal from './components/common/OfflineModal';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PrescriptionPage from './pages/PrescriptionPage';
import AdminPage from './pages/AdminPage';

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

  // Handlers para o modal offline
  const handleOfflineModalClose = () => {
    dispatch({ type: 'HIDE_OFFLINE_MODAL' });
  };

  const handleGoHome = () => {
    dispatch({ type: 'HIDE_OFFLINE_MODAL' });
    dispatch({ type: 'SET_PAGE', payload: 'home' });
  };

  const handleUseDemoData = () => {
    dispatch({ type: 'HIDE_OFFLINE_MODAL' });
    dispatch({ type: 'SET_DEMO_MODE', payload: true });
    dispatch({ type: 'SET_PAGE', payload: 'prescription' });
  };

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

          {/* Modal offline */}
          <OfflineModal
            isOpen={state.offlineModal.isOpen}
            onClose={handleOfflineModalClose}
            onGoHome={handleGoHome}
            onUseDemoData={handleUseDemoData}
          />

          {/* Indicador de modo demo */}
          {state.demoMode && (
            <div className="fixed bottom-4 right-4 bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg shadow-lg z-40">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Modo Demonstração</span>
                <button
                  onClick={() => dispatch({ type: 'SET_DEMO_MODE', payload: false })}
                  className="text-yellow-900 hover:text-yellow-700 ml-2"
                  title="Sair do modo demonstração"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </ToastProvider>
    </AppContext.Provider>
  );
};

export default App;