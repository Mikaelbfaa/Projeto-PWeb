import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const useTheme = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_DARK_THEME' });
  };
  
  return {
    darkTheme: state.darkTheme,
    toggleTheme
  };
};