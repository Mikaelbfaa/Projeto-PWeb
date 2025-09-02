import React from 'react';

const OptionSelector = ({ title, field, options, recommended, description, selectedOptions, onOptionChange }) => (
  <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold mb-2 text-primary dark:text-dark-primary">{title}</h3>
    {description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>}
    
    <div className="space-y-2">
      {options.map(option => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={field}
            value={option}
            checked={selectedOptions[field] === option}
            onChange={(e) => onOptionChange(field, e.target.value)}
            className="text-secondary dark:text-dark-secondary"
          />
          <span className={`${option === recommended ? 'font-semibold text-secondary dark:text-dark-secondary' : 'text-gray-700 dark:text-gray-300'}`}>
            {option}
            {option === recommended && ' (Recomendado)'}
          </span>
        </label>
      ))}
    </div>
  </div>
);

export default OptionSelector;