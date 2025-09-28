import { TrendingUp, Heart, Calendar, Activity } from 'lucide-react';

export const HEALTH_CONDITIONS = [
  'tendinopatia do supraespinal',
  'lombalgia crônica',
  'artrose de joelho',
  'tendinite de aquiles',
  'síndrome do túnel do carpo',
  'hérnia de disco'
];

export const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'muscle-groups', label: 'Grupos Musculares' },
  { id: 'exercises', label: 'Exercícios' }
];

export const PROFILE_STEPS = [
  { id: 1, title: 'Dados Pessoais' },
  { id: 2, title: 'Experiência' },
  { id: 3, title: 'Força' },
  { id: 4, title: 'Saúde' }
];

export const ICON_MAP = {
  "Análise Inteligente": TrendingUp,
  "Saúde Personalizada": Heart,
  "Progressão Temporal": Calendar,
  "Otimização Científica": Activity
};

export const FEATURES = [
  {
    title: "Análise Inteligente",
    description: "Análise avançada para avaliação de perfil e classificação automática de nível",
  },
  {
    title: "Saúde Personalizada",
    description: "Adaptação baseada em condições de saúde e limitações físicas",
  },
  {
    title: "Progressão Temporal",
    description: "Planos com mesociclos e microciclos para evolução contínua",
  },
  {
    title: "Otimização Científica",
    description: "Algoritmos de programação linear para seleção ideal de exercícios",
  }
];