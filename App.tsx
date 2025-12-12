import React, { useState, useCallback } from 'react';
import { analyzeFood } from './services/geminiService';
import { NutritionData, LogEntry, LoadingState } from './types';
import { NutritionCard } from './components/NutritionCard';
import { MacroChart } from './components/MacroChart';
import { DailyLog } from './components/DailyLog';
import { Search, Loader2, Leaf, ChefHat } from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [currentData, setCurrentData] = useState<NutritionData | null>(null);
  const [foodLog, setFoodLog] = useState<LogEntry[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus(LoadingState.LOADING);
    setErrorMsg(null);
    setCurrentData(null);

    try {
      const data = await analyzeFood(query);
      if (data) {
        setCurrentData(data);
        setStatus(LoadingState.SUCCESS);
      } else {
        // Should catch inside service, but double check
        throw new Error("Не удалось проанализировать продукт.");
      }
    } catch (err: any) {
      console.error(err);
      setStatus(LoadingState.ERROR);
      setErrorMsg(err.message || "Произошла ошибка при анализе. Попробуйте уточнить запрос.");
    }
  };

  const handleAddToLog = useCallback(() => {
    if (currentData) {
      const newEntry: LogEntry = {
        ...currentData,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      };
      setFoodLog(prev => [...prev, newEntry]);
      // Optional: Clear current search to encourage next search
      // setCurrentData(null);
      // setQuery('');
      // setStatus(LoadingState.IDLE);
    }
  }, [currentData]);

  const handleRemoveFromLog = useCallback((id: string) => {
    setFoodLog(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-600">
            <Leaf size={28} className="fill-current" />
            <span className="text-xl font-bold tracking-tight text-gray-900">Nutri<span className="text-brand-600">AI</span></span>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Анализатор на базе Gemini
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        
        {/* Hero / Search Section */}
        <section className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Что вы съели сегодня?
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Введите название любого блюда (например, "борщ со сметаной" или "авокадо тост"), 
            и ИИ рассчитает калорийность и БЖУ.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className={`text-gray-400 group-focus-within:text-brand-500 transition-colors`} size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Например: Куриная грудка с рисом 200г"
              className="block w-full pl-11 pr-20 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-lg"
              disabled={status === LoadingState.LOADING}
            />
            <button
              type="submit"
              disabled={status === LoadingState.LOADING || !query.trim()}
              className="absolute right-2 top-2 bottom-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-medium rounded-xl px-6 transition-colors flex items-center justify-center"
            >
              {status === LoadingState.LOADING ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Найти"
              )}
            </button>
          </form>

          {status === LoadingState.ERROR && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-xl mx-auto text-sm">
              {errorMsg}
            </div>
          )}
        </section>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Result */}
          <div className="space-y-6">
            {currentData ? (
              <div className="space-y-6 animate-fade-in">
                 <div className="flex items-center gap-2 text-gray-400 text-sm font-medium uppercase tracking-wider">
                  <ChefHat size={16} />
                  Результат анализа
                </div>
                <NutritionCard data={currentData} onAdd={handleAddToLog} />
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="font-semibold text-gray-700 mb-4 text-center">Распределение калорий</h3>
                   <MacroChart data={currentData} />
                </div>
              </div>
            ) : status === LoadingState.IDLE || status === LoadingState.LOADING ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                 {status === LoadingState.LOADING ? (
                   <>
                    <Loader2 className="animate-spin mb-4 text-brand-500" size={32} />
                    <p>Анализируем состав...</p>
                   </>
                 ) : (
                   <>
                    <Search size={48} className="mb-4 opacity-20" />
                    <p>Результаты появятся здесь</p>
                   </>
                 )}
              </div>
            ) : null}
          </div>

          {/* Right Column: Daily Log */}
          <div className="space-y-4">
             <div className="flex items-center gap-2 text-gray-400 text-sm font-medium uppercase tracking-wider">
               <Leaf size={16} />
               Журнал питания
             </div>
            <DailyLog log={foodLog} onRemove={handleRemoveFromLog} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;