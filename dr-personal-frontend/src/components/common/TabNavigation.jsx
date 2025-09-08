import React from 'react';

const TabNavigation = ({ 
  activeTab, 
  onTabChange, 
  tabs 
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-gray-100 dark:bg-dark-bg-primary rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-secondary text-light dark:bg-dark-secondary' 
                : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-dark-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;