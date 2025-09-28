import React, { useState, useContext } from 'react';
import { Home, UserPlus, FileText, Settings, Dumbbell, Moon, Sun } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';

const Header = () => {
  const { state, dispatch } = useContext(AppContext);
  const { darkTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'profile', label: 'Criar Perfil', icon: UserPlus },
    { id: 'prescription', label: 'Prescrições', icon: FileText },
    { id: 'admin', label: 'Administração', icon: Settings }
  ];

  return (
    <header className="bg-white text-primary dark:bg-dark-bg-secondary dark:text-dark-primary shadow-md fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}
            className="flex items-center space-x-3 group cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="p-2 rounded-xl bg-primary/10 dark:bg-dark-secondary/20">
              <Dumbbell className="h-8 w-8 text-primary dark:text-dark-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-secondary dark:text-dark-accent">
              FitnessPro
            </h1>
          </button>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-2">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      state.currentPage === item.id 
                        ? 'bg-primary/10 text-primary dark:bg-dark-secondary/20 dark:text-dark-secondary'
                        : 'text-primary/80 hover:text-primary hover:bg-primary/10 dark:text-gray-300 dark:hover:text-dark-secondary dark:hover:bg-dark-secondary/10'
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-transform duration-300 ${
                      state.currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
            
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-110 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-dark-secondary/20 dark:text-dark-secondary dark:hover:bg-dark-secondary/30"
              title={darkTheme ? 'Modo Claro' : 'Modo Escuro'}
            >
              {darkTheme ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-xl bg-primary/10 dark:bg-dark-secondary/20"
          >
            <div className={`w-5 h-5 flex flex-col justify-center items-center transition-all duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}>
              <span className={`block w-5 h-0.5 bg-primary dark:bg-dark-secondary ${mobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-primary dark:bg-dark-secondary ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-primary dark:bg-dark-secondary ${mobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 pt-6 border-t border-primary/20 dark:border-gray-700">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    dispatch({ type: 'SET_PAGE', payload: item.id });
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                    state.currentPage === item.id 
                      ? 'bg-primary/10 text-primary dark:bg-dark-secondary/20 dark:text-dark-secondary'
                      : 'text-primary/80 hover:text-primary hover:bg-primary/10 dark:text-gray-300 dark:hover:text-dark-secondary dark:hover:bg-dark-secondary/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;