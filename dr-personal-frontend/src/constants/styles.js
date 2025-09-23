export const ANIMATION_DURATIONS = {
  fast: 'duration-300',
  normal: 'duration-500'
};

export const BORDER_RADIUS = {
  large: 'rounded-3xl',
  medium: 'rounded-2xl',
  small: 'rounded-xl'
};

export const SHADOWS = {
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  '3xl': 'shadow-3xl'
};

export const GRADIENTS = {
  primary: 'bg-gradient-to-br from-blue-400 via-secondary to-amber-700',

  // NOVO TEMA ESCURO: Um gradiente "Pôr do Sol" ou "Brasa".
  // Começa com nosso âmbar principal e escurece para tons de laranja queimado.
  primaryDark: 'dark:bg-gradient-to-br dark:from-secondary dark:via-orange-700 dark:to-orange-900',

  card: 'bg-gradient-to-br from-light to-white',
  cardDark: 'dark:bg-gradient-to-br dark:from-dark-bg-secondary dark:to-dark-bg-secondary/80'
};

export const BUTTON_VARIANTS = {
  primary: 'bg-white text-primary hover:bg-white/90 dark:bg-dark-accent dark:text-dark-bg-primary dark:hover:bg-dark-accent/90',
  secondary: 'bg-transparent border-2 border-light text-light hover:bg-light hover:text-primary dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent dark:hover:text-dark-bg-primary'
};