import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { EventChoice } from '../../data/events';
import { sounds } from '../../utils/sounds';

export function EventScreen() {
  const currentEvent = useGameStore(state => state.currentEvent);
  const resolveEventChoice = useGameStore(state => state.resolveEventChoice);
  
  const [result, setResult] = useState<{ message: string; success: boolean } | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  
  useEffect(() => {
    if (currentEvent) sounds.eventStart();
  }, [currentEvent]);
  
  if (!currentEvent) return null;
  
  const handleChoice = (choice: EventChoice) => {
    setIsResolving(true);
    const res = resolveEventChoice(choice);
    
    if (res.success) {
      sounds.eventSuccess();
    } else {
      sounds.eventFail();
    }
    
    setResult(res);
    
    setTimeout(() => {
      setResult(null);
      setIsResolving(false);
    }, 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'var(--bg-void)' }}
    >
      {/* Header */}
      <div className="safe-top px-4 py-4 text-center">
        <h2 
          className="text-xl font-bold"
          style={{ color: 'var(--copper)' }}
        >
          {currentEvent.title}
        </h2>
      </div>
      
      {/* Contenu */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Description */}
        <div className="card-metal p-5 mb-4">
          <p 
            className="whitespace-pre-line leading-relaxed"
            style={{ color: 'var(--text-primary)' }}
          >
            {currentEvent.description}
          </p>
        </div>
        
        {/* Resultat */}
        {result && (
          <div 
            className="card-metal p-4 mb-4 animate-in"
            style={{ 
              borderColor: result.success ? 'var(--positive-light)' : 'var(--danger-light)',
            }}
          >
            <p style={{ color: 'var(--text-primary)' }}>
              {result.message}
            </p>
          </div>
        )}
      </div>
      
      {/* Zone du pouce - Choix */}
      {!isResolving && (
        <div 
          className="p-4 space-y-3"
          style={{ 
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            background: 'linear-gradient(to top, var(--bg-dark) 80%, transparent)'
          }}
        >
          {currentEvent.choices.map(choice => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              className="w-full p-4 rounded text-left transition-all active:scale-[0.98]"
              style={{ 
                background: 'var(--bg-surface)',
                border: '1px solid var(--copper-dark)'
              }}
            >
              <div 
                className="font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {choice.label}
              </div>
              <div 
                className="text-sm mt-1"
                style={{ color: 'var(--text-muted)' }}
              >
                {choice.description}
              </div>
              
              {choice.successChance !== undefined && choice.successChance < 1 && (
                <div 
                  className="text-xs mt-2"
                  style={{ color: 'var(--copper)' }}
                >
                  {Math.round(choice.successChance * 100)}% de succes
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
