// ============================================
// SYSTÈME AUDIO - SOUDA: Terra Incognita
// ============================================

// Contexte audio global
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

// Jouer un son avec oscillateur
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio is not supported
  }
}

// === SONS DU JEU ===

export const sounds = {
  // Navigation
  move: () => {
    playTone(220, 0.1, 'sine', 0.15);
  },
  
  reveal: () => {
    playTone(440, 0.15, 'sine', 0.2);
    setTimeout(() => playTone(550, 0.1, 'sine', 0.15), 50);
  },
  
  // Loot
  lootFound: () => {
    playTone(523, 0.1, 'sine', 0.25);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.25), 80);
    setTimeout(() => playTone(784, 0.15, 'sine', 0.2), 160);
  },
  
  lootTake: () => {
    playTone(392, 0.1, 'triangle', 0.2);
    setTimeout(() => playTone(523, 0.15, 'triangle', 0.25), 100);
  },
  
  lootDrop: () => {
    playTone(300, 0.1, 'sawtooth', 0.15);
    setTimeout(() => playTone(200, 0.15, 'sawtooth', 0.1), 80);
  },
  
  // Combat
  combatStart: () => {
    playTone(200, 0.2, 'sawtooth', 0.3);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.25), 150);
  },
  
  attack: () => {
    playTone(150, 0.1, 'sawtooth', 0.2);
    setTimeout(() => playTone(100, 0.1, 'square', 0.15), 50);
  },
  
  victory: () => {
    playTone(523, 0.15, 'sine', 0.25);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.25), 150);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.3), 300);
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.25), 450);
  },
  
  defeat: () => {
    playTone(300, 0.2, 'sawtooth', 0.25);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.2), 200);
    setTimeout(() => playTone(100, 0.5, 'sawtooth', 0.15), 400);
  },
  
  flee: () => {
    playTone(400, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(350, 0.1, 'sine', 0.15), 100);
    setTimeout(() => playTone(300, 0.15, 'sine', 0.1), 200);
  },
  
  // UI
  click: () => {
    playTone(800, 0.05, 'sine', 0.1);
  },
  
  error: () => {
    playTone(200, 0.15, 'square', 0.2);
  },
  
  heal: () => {
    playTone(440, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(550, 0.1, 'sine', 0.2), 100);
    setTimeout(() => playTone(660, 0.15, 'sine', 0.15), 200);
  },
  
  // Events
  eventStart: () => {
    playTone(330, 0.2, 'sine', 0.2);
    setTimeout(() => playTone(440, 0.2, 'sine', 0.15), 200);
  },
  
  eventSuccess: () => {
    playTone(523, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 100);
  },
  
  eventFail: () => {
    playTone(300, 0.15, 'sawtooth', 0.2);
    setTimeout(() => playTone(250, 0.2, 'sawtooth', 0.15), 150);
  },
  
  // Hub
  hubEnter: () => {
    playTone(262, 0.2, 'sine', 0.15);
    setTimeout(() => playTone(330, 0.2, 'sine', 0.15), 150);
    setTimeout(() => playTone(392, 0.3, 'sine', 0.2), 300);
  },
  
  purchase: () => {
    playTone(500, 0.1, 'triangle', 0.2);
    setTimeout(() => playTone(600, 0.1, 'triangle', 0.15), 80);
  },
};

// Précharger le contexte audio (doit être appelé après une interaction utilisateur)
export function initAudio() {
  try {
    getAudioContext();
  } catch {
    // Audio not supported
  }
}
