# SOLUTION 2 : Fusionner les deux intros en une seule

## Principe
- Enrichir `NarrativeIntro` avec le meilleur des deux
- Supprimer les étapes 0-1 du `Tutorial`
- Créer une intro unique plus riche

## Modifications nécessaires

### 1. Enrichir `NarrativeIntro.tsx`
```typescript
const INTRO_TEXTS = [
  "La bataille est perdue.",
  "Vos compagnons sont morts.",
  "Vous fuyez dans la nuit...",
  "Tu es un déserteur.",
  "Tu dois 80 pièces d'or à Morten.",
  "Tu as 20 jours.",
  "PAYE... OU MEURS."
]
```

### 2. Ajouter une section dialogue Morten (optionnelle)
Après les textes, afficher un dialogue avec Morten (comme dans le tutorial étape 1)

### 3. Modifier `TutorialScreen.tsx`
- Commencer directement à l'étape 2 (inventaire)
- Supprimer les étapes 0-1

## Avantages
✅ Une seule intro riche et complète
✅ Contexte narratif préservé
✅ Expérience immersive
✅ Pas de redondance

## Inconvénients
❌ Intro plus longue (mais skip possible)
❌ Plus de code à maintenir
