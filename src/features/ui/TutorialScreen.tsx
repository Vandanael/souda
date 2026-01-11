import { useState } from 'react';
import { initAudio } from '../../utils/sounds';

interface TutorialScreenProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: 'Bienvenue, mercenaire.',
    content: 'Tu es un voyageur sans attaches dans les Terres Oubliees. Un monde brutal ou la survie passe avant tout.',
  },
  {
    title: 'Exploration',
    content: 'Clique sur les tuiles adjacentes pour te deplacer. Le brouillard se dissipe la ou tu passes. Chaque pas revele le monde.',
  },
  {
    title: 'Loot',
    content: 'Tu trouveras des armes, armures, consommables et tresors. Prends ce qui te semble utile. Attention au poids : 10kg maximum.',
  },
  {
    title: 'Combat',
    content: 'Les ennemis rodent. Tu peux combattre, fuir ou parfois parler. Le combat est instantane : tu verras l\'estimation des degats avant de frapper.',
  },
  {
    title: 'Survie',
    content: 'Ta faim diminue avec le temps. Mange pour survivre. Si tu tombes au combat, tu te reveilles a l\'auberge avec une penalite.',
  },
  {
    title: 'Le Hub',
    content: 'L\'Auberge du Carrefour est ton refuge. Repose-toi, equipe-toi, stocke tes affaires. C\'est la que tu demarres.',
  },
];

export function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const [step, setStep] = useState(0);
  
  const handleNext = () => {
    initAudio();
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };
  
  const handleSkip = () => {
    initAudio();
    onComplete();
  };
  
  const currentStep = STEPS[step];

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'var(--bg-void)' }}
    >
      {/* Contenu centre */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-1"
            style={{ color: 'var(--copper)' }}
          >
            SOUDA
          </h1>
          <p style={{ color: 'var(--text-dim)' }}>Terra Incognita</p>
        </div>
        
        {/* Contenu du step */}
        <div className="card-metal p-6 w-full max-w-sm min-h-[180px]">
          <h2 
            className="text-lg font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {currentStep.title}
          </h2>
          <p 
            className="leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {currentStep.content}
          </p>
        </div>
        
        {/* Indicateur */}
        <div className="flex justify-center gap-2 mt-6">
          {STEPS.map((_, i) => (
            <div 
              key={i}
              className="w-2 h-2 rounded-full transition-colors"
              style={{ 
                background: i === step 
                  ? 'var(--copper)' 
                  : i < step 
                    ? 'var(--copper-dark)' 
                    : 'var(--bg-elevated)'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Zone du pouce */}
      <div 
        className="p-4 flex gap-3"
        style={{ 
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--bg-dark) 90%, transparent)'
        }}
      >
        <button
          onClick={handleSkip}
          className="btn-neutral flex-1"
        >
          Passer
        </button>
        <button
          onClick={handleNext}
          className="btn-copper flex-1"
        >
          {step < STEPS.length - 1 ? 'Suivant' : 'Commencer'}
        </button>
      </div>
    </div>
  );
}
