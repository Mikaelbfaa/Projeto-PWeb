export const initialState = {
  currentUser: null,
  currentPage: 'home',
  userProfile: null,
  partialPrescription: null,
  fullPrescription: null,
  prescriptionHistory: [],
  adminData: {
    muscleGroups: [],
    strengthExercises: [],
    preparationExercises: [],
    healthConditions: [],
    routines: []
  },
  loading: false,
  error: null,
  darkTheme: localStorage.getItem('darkTheme') === 'true',
};

export function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'SET_PARTIAL_PRESCRIPTION':
      return { ...state, partialPrescription: action.payload };
    case 'SET_FULL_PRESCRIPTION':
      return { ...state, fullPrescription: action.payload };
    case 'ADD_TO_PRESCRIPTION_HISTORY':
      const newPrescription = {
        id: Date.now(),
        createdAt: new Date().toLocaleString('pt-BR'),
        userProfile: action.userProfile,
        partialPrescription: action.partialPrescription,
        fullPrescription: action.fullPrescription
      };
      return { 
        ...state, 
        prescriptionHistory: [newPrescription, ...state.prescriptionHistory] 
      };
    case 'SET_ADMIN_DATA':
      return { 
        ...state, 
        adminData: { ...state.adminData, [action.dataType]: action.payload } 
      };
    case 'TOGGLE_DARK_THEME':
      return { ...state, darkTheme: !state.darkTheme };
    default:
      return state;
  }
}