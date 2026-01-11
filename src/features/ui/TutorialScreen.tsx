import { useState } from 'react';
import { initAudio } from '../../utils/sounds';

interface TutorialScreenProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: 'Bienvenue, mercenaire.',
    content: 'Tu es un voyageur sans attaches dans les Terres Oubliées. Un monde brutal où la survie passe avant tout.',
  },
  {
    title: 'Exploration',
    content: 'Clique sur les tuiles adjacentes pour te déplacer. Le brouillard se dissipe là où tu passes. Chaque pas révèle le monde.',
  },
  {
    title: 'Loot',
    content: 'Tu trouveras des armes, armures, consommables et trésors. Prends ce qui te semble utile. Attention au poids : 10kg maximum.',
  },
  {
    title: 'Combat',
    content: 'Les ennemis rôdent. Tu peux combattre, fuir ou parfois parler. Le combat est instantané : tu verras l\'estimation des dégâts avant de frapper.',
  },
  {
    title: 'Survie',
    content: 'Ta faim diminue avec le temps. Mange pour survivre. Si tu tombes au combat, tu te réveilles à l\'auberge avec une pénalité.',
  },
  {
    title: 'Le Hub',
    content: 'L\'Auberge du Carrefour est ton refuge. Repose-toi, équipe-toi, stocke tes affaires. C\'est là que tu démarres.',
  },
];

export function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const [step, setStep] = useState(0);
  
  const handleNext = () => {
    initAudio(); // Initialiser l'audio après la première interaction
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
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400 mb-2">
            SOUDA
          </h1>
          <p className="text-zinc-500 text-sm">Terra Incognita</p>
        </div>
        
        {/* Contenu */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6 border border-zinc-800 min-h-[200px]">
          <h2 className="text-xl font-bold text-zinc-100 mb-4">
            {currentStep.title}
          </h2>
          <p className="text-zinc-300 leading-relaxed">
            {currentStep.content}
          </p>
        </div>
        
        {/* Indicateur de progression */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-amber-400' : i < step ? 'bg-amber-600' : 'bg-zinc-700'
              }`}
            />
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors text-zinc-400"
          >
            Passer
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold transition-colors"
          >
            {step < STEPS.length - 1 ? 'Suivant' : 'Commencer'}
          </button>
        </div>
      </div>
    </div>
  );
}
