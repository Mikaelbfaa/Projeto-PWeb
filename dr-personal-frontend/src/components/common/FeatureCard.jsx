import React from 'react';
import { BORDER_RADIUS, SHADOWS, GRADIENTS } from '../../constants/styles';

const FeatureCard = ({ feature, Icon }) => {
  return (
    <div className={`${GRADIENTS.card} border-gray-100 ${GRADIENTS.cardDark} dark:border-gray-700 p-8 ${BORDER_RADIUS.large} ${SHADOWS.xl} text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border`}>
      <div className={`inline-flex items-center justify-center p-4 ${BORDER_RADIUS.medium} bg-secondary dark:bg-dark-secondary text-light mb-6 shadow-lg`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-primary dark:text-dark-accent">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
    </div>
  );
};

export default FeatureCard;