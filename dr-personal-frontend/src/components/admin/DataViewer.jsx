import React, { useState, useEffect } from 'react';
import { Search, Download, Trash2, Eye, EyeOff, RefreshCw, Database, Clock } from 'lucide-react';
import { useLocalData } from '../../hooks/useLocalData';

const DataViewer = () => {
  const { localData, exportAllData, clearAllLocalData, searchLocalData, getLocalDataStats } = useLocalData();
  const [activeDataType, setActiveDataType] = useState('muscleGroups');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const dataTypes = [
    { id: 'muscleGroups', label: 'Grupos Musculares', key: 'muscleGroups' },
    { id: 'healthConditions', label: 'Condições de Saúde', key: 'healthConditions' },
    { id: 'preparationExercises', label: 'Exercícios Preparação', key: 'preparationExercises' },
    { id: 'strengthExercises', label: 'Exercícios Força', key: 'strengthExercises' },
    { id: 'routines', label: 'Rotinas', key: 'routines' }
  ];

  const stats = getLocalDataStats();

  // Dados ativos baseados no tipo selecionado
  const activeData = localData[activeDataType] || [];

  // Pesquisar quando o termo de busca muda
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      const timeoutId = setTimeout(async () => {
        try {
          const results = await searchLocalData(activeDataType, searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error('Erro na pesquisa:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, activeDataType, searchLocalData]);

  const displayData = searchTerm.trim() ? searchResults : activeData;

  const handleExport = async () => {
    try {
      await exportAllData();
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar dados');
    }
  };

  const handleClearAll = async () => {
    if (showDeleteConfirm) {
      try {
        await clearAllLocalData();
        setShowDeleteConfirm(false);
        alert('Todos os dados locais foram removidos');
      } catch (error) {
        console.error('Erro ao limpar dados:', error);
        alert('Erro ao limpar dados');
      }
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const renderItemPreview = (item) => {
    switch (activeDataType) {
      case 'muscleGroups':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{item.name}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                item.size === 'big' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {item.size}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                item.segment === 'upper' ? 'bg-green-100 text-green-800' : 
                item.segment === 'lower' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-purple-100 text-purple-800'
              }`}>
                {item.segment}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Ação: {item.action} | Posição: {item.position}
            </p>
            {item.antagonists && (
              <p className="text-xs text-gray-500">
                Antagonistas: {item.antagonists.join(', ')}
              </p>
            )}
          </div>
        );

      case 'healthConditions':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{item.name}</span>
              {item.category && (
                <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                  {item.category}
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-sm text-gray-600">{item.description}</p>
            )}
          </div>
        );

      case 'preparationExercises':
      case 'strengthExercises':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{item.name}</span>
              {item.type && (
                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  {item.type}
                </span>
              )}
              {item.count_type && (
                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                  {item.count_type}
                </span>
              )}
            </div>
            {item.muscle_groups && (
              <p className="text-sm text-gray-600">
                Músculos: {Array.isArray(item.muscle_groups) ? item.muscle_groups.join(', ') : item.muscle_groups}
              </p>
            )}
          </div>
        );

      case 'routines':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Nível: {item.level}</span>
              <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                {item.weekly_frequency}x/semana
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {item.exercises?.length || 0} grupos de exercícios
            </p>
          </div>
        );

      default:
        return <span className="font-semibold">{item.name || item.id}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-dark-primary">Visualizador de Dados Locais</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-secondary text-light dark:bg-dark-secondary px-4 py-2 rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80 inline-flex items-center transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button
            onClick={handleClearAll}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              showDeleteConfirm 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {showDeleteConfirm ? 'Confirmar Exclusão' : 'Limpar Dados'}
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-3 dark:text-dark-primary">Estatísticas dos Dados</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {dataTypes.map(type => (
            <div key={type.id} className="text-center">
              <div className="text-2xl font-bold dark:text-dark-primary">
                {stats[type.key]?.count || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{type.label}</div>
              {stats[type.key]?.lastSync && (
                <div className="text-xs text-gray-500 flex items-center justify-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(stats[type.key].lastSync).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Seletor de tipo de dados */}
      <div className="bg-white dark:bg-dark-bg-secondary shadow rounded-lg">
        <div className="flex overflow-x-auto">
          {dataTypes.map(type => (
            <button
              key={type.id}
              onClick={() => {
                setActiveDataType(type.id);
                setSearchTerm('');
                setSelectedItem(null);
              }}
              className={`px-4 py-3 whitespace-nowrap border-b-2 ${
                activeDataType === type.id
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-orange-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {type.label} ({localData[type.key]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Barra de pesquisa */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Pesquisar em ${dataTypes.find(t => t.id === activeDataType)?.label}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-bg-primary dark:border-gray-600 dark:text-dark-primary"
            />
            {isSearching && (
              <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
            )}
          </div>
          <button
            onClick={() => setShowRawData(!showRawData)}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              showRawData 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showRawData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Lista de dados */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-dark-primary">
              {dataTypes.find(t => t.id === activeDataType)?.label}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Database className="h-4 w-4 mr-1" />
              {displayData.length} itens
            </div>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {displayData.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              {searchTerm.trim() ? 'Nenhum resultado encontrado' : 'Nenhum dado disponível'}
            </div>
          ) : (
            <div className="space-y-1">
              {displayData.map((item, index) => (
                <div
                  key={item.id || index}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                    selectedItem === item ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                  onClick={() => setSelectedItem(selectedItem === item ? null : item)}
                >
                  {showRawData ? (
                    <pre className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(item, null, 2)}
                    </pre>
                  ) : (
                    renderItemPreview(item)
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhes do item */}
      {selectedItem && !showRawData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold dark:text-dark-primary">Detalhes do Item</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded">
              {JSON.stringify(selectedItem, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataViewer;