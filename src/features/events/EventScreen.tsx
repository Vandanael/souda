import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { EventChoice } from '../../data/events';

export function EventScreen() {
  const currentEvent = useGameStore(state => state.currentEvent);
  const resolveEventChoice = useGameStore(state => state.resolveEventChoice);
  
  const [result, setResult] = useState<{ message: string; success: boolean } | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  
  if (!currentEvent) return null;
  
  const handleChoice = (choice: EventChoice) => {
    setIsResolving(true);
    const res = resolveEventChoice(choice);
    setResult(res);
    
    setTimeout(() => {
      setResult(null);
      setIsResolving(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/95 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-lg my-8">
        {/* Header */}
        <h2 className="text-center text-2xl font-bold text-amber-400 mb-4">
          {currentEvent.title}
        </h2>
        
        {/* Description */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6 border border-zinc-800">
          <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
            {currentEvent.description}
          </p>
        </div>
        
        {/* Résultat */}
        {result && (
          <div className={`mb-6 p-4 rounded-xl border ${
            result.success 
              ? 'bg-emerald-950/50 border-emerald-800' 
              : 'bg-red-950/50 border-red-800'
          }`}>
            <p className="text-zinc-200 whitespace-pre-line">
              {result.message}
            </p>
          </div>
        )}
        
        {/* Choix */}
        {!isResolving && (
          <div className="space-y-3">
            {currentEvent.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="w-full p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] border border-zinc-700 text-left"
              >
                <div className="font-bold text-zinc-100">{choice.label}</div>
                <div className="text-sm text-zinc-400 mt-1">{choice.description}</div>
                
                {/* Indicateur de risque si pas 100% */}
                {choice.successChance !== undefined && choice.successChance < 1 && (
                  <div className="text-xs text-yellow-500 mt-2">
                    {Math.round(choice.successChance * 100)}% de succès
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
