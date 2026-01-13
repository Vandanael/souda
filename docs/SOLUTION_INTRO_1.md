# SOLUTION 1 : Garder NarrativeIntro, supprimer étapes 0-1 du Tutorial

## Principe
- Garder `NarrativeIntro` (courte, skip possible)
- Supprimer les étapes 0-1 du `Tutorial` (redondantes)
- Le tutorial commence directement à l'étape 2 (inventaire)

## Modifications nécessaires

### 1. Modifier `TutorialScreen.tsx`
```typescript
// Au lieu de commencer à l'étape 0, commencer directement à l'étape 2
const [tutorialStep, setTutorialStep] = useState<0 | 1 | 2 | 3>(2) // Commence à 2

// Supprimer la condition pour tutorialStep < 2
// Le tutorial commence directement avec l'inventaire
```

### 2. Modifier `Tutorial.tsx`
- Supprimer les étapes 0 et 1 (La Fuite, L'Arrivée)
- Le composant ne gère plus que les étapes 2-3 (overlays)

## Avantages
✅ Intro courte et percutante
✅ Skip possible dès le début
✅ Pas de redondance narrative
✅ Expérience plus fluide

## Inconvénients
❌ Perd le contexte narratif du tutorial (bataille perdue, fuite)
❌ Dialogue avec Morten supprimé du tutorial
