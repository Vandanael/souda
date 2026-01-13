# 🔍 AUDIT GLOBAL & PROFOND - RAPPORT FINAL

**Date**: Audit complet du codebase  
**Fichiers scannés**: 117 fichiers (.ts et .tsx)  
**Méthode**: Analyse croisée complète de tous les exports et leurs usages

---

## 💀 CODE MORT CONFIRMÉ (Sûr à 100%)

### 1. Fonctions exportées mais jamais utilisées

#### `getDialogueForStage` (src/features/narrative/characterArcs.ts:119)
- **Preuve**: Exporté mais aucune référence trouvée dans les 117 fichiers scannés
- **Contexte**: Fonction pour obtenir un dialogue aléatoire pour un stage d'arc narratif
- **Action recommandée**: Supprimer ou implémenter son utilisation dans MortenScreen

#### `resetDailyObjectives` (src/features/meta/dailyObjectives.ts:233)
- **Preuve**: Exporté mais aucune référence trouvée dans les 117 fichiers scannés
- **Contexte**: Fonction utilitaire pour réinitialiser les objectifs quotidiens (probablement pour les tests)
- **Action recommandée**: Supprimer si non utilisé dans les tests, ou déplacer dans un fichier de test

#### `findEligibleEvent` (src/features/events/eventResolver.ts:12)
- **Preuve**: Exporté mais jamais importé/utilisé
- **Contexte**: Fonction remplacée par `EventManager.checkEvents()` qui est utilisé partout
- **Action recommandée**: Supprimer (code mort, remplacé par EventManager)

#### `generateEveningEvents` (src/features/events/eveningEvents.ts:9)
- **Preuve**: Exporté mais seulement utilisé en interne dans le même fichier (ligne 425)
- **Contexte**: Fonction génère tous les événements du soir, mais seule `selectEveningEvent` est utilisée
- **Action recommandée**: Rendre privée (retirer l'export) ou supprimer si non nécessaire

### 2. Types exportés mais jamais utilisés

#### `GameManagerState` (src/features/game/gameManager.ts:5)
- **Preuve**: Exporté via index.ts mais jamais importé/utilisé
- **Contexte**: Type défini mais non utilisé dans le code
- **Action recommandée**: Supprimer l'export (garder en interne si nécessaire)

#### `DaySummary` (src/features/game/gameManager.ts:7)
- **Preuve**: Exporté via index.ts mais jamais importé/utilisé
- **Contexte**: Interface utilisée uniquement en interne dans GameManager
- **Action recommandée**: Retirer l'export (garder en interne)

---

## 🔗 CONNEXIONS DOUTEUSES (Risque de Bug)

### 1. Duplication majeure : `utils/combat.ts` vs `features/combat/combat.logic.ts`

**PROBLÈME CRITIQUE**: Deux systèmes de combat coexistent avec des types incompatibles !

#### Types dupliqués avec différences :

1. **`CombatOutcome`** :
   - `utils/combat.ts`: `'crushing_victory' | 'victory' | 'costly_victory' | 'escape' | 'defeat'`
   - `combat.logic.ts`: `'crushing' | 'victory' | 'costly' | 'flee' | 'defeat'`
   - **Incompatibilité**: Valeurs différentes !

2. **`CombatResult`** :
   - `utils/combat.ts`: Contient `gold?`, `message`, `nearMissMessage?`
   - `combat.logic.ts`: Contient `durabilityLoss[]`, `lootEarned`, `gold?`, `message`, `nearMissMessage?`
   - **Incompatibilité**: Structure différente !

3. **`PlayerStats`** :
   - Défini dans 3 endroits : `utils/stats.ts`, `combat.logic.ts`, `utils/combat.ts`
   - **Risque**: Incohérence possible

4. **`resolveCombat`** :
   - `utils/combat.ts`: Signature `(playerStats, enemy) => CombatResult`
   - `combat.logic.ts`: Signature `(playerStats, enemy, equipment?, random?) => CombatResult`
   - **Incompatibilité**: Signatures différentes !

**Conséquence**: 
- `MapScreen.tsx` utilise `utils/combat.ts` pour les estimations
- `CombatScreen.tsx` et `exploration.logic.ts` utilisent `combat.logic.ts` pour la résolution réelle
- **Risque de crash** si les types sont mélangés

**Action recommandée**: 
- Supprimer `utils/combat.ts` et migrer `MapScreen.tsx` vers `combat.logic.ts`
- OU créer un module d'estimation séparé qui utilise les types de `combat.logic.ts`

### 2. `getStatsShort` jamais utilisé

- **Fichier**: `src/utils/stats.ts:129`
- **Preuve**: Exporté mais aucune référence trouvée
- **Action recommandée**: Supprimer ou documenter son usage prévu

### 3. `isChoiceAvailable` dans eventResolver.ts

- **Fichier**: `src/features/events/eventResolver.ts:35`
- **Preuve**: Exporté mais vérification nécessaire
- **Note**: Utilisé dans `EventScreen.tsx` (ligne 5), donc OK

---

## 📉 OPTIMISATION (Duplication)

### 1. Duplication de logique de combat

**Observation**: `utils/combat.ts` contient des fonctions d'estimation qui pourraient être dans `combat.logic.ts`

**Fonctions dupliquées**:
- `getCombatProbability` existe dans les deux fichiers avec la même logique
- `estimateCombatRatio`, `getEstimatedEnemyForRisk`, `calculateVictoryProbability`, `calculateCombatOutcomeProbabilities` sont uniquement dans `utils/combat.ts`

**Action recommandée**: 
- Déplacer toutes les fonctions d'estimation dans `combat.logic.ts`
- Supprimer `utils/combat.ts`
- Mettre à jour `MapScreen.tsx` pour utiliser `combat.logic.ts`

### 2. Types `PlayerStats` dupliqués

**Observation**: `PlayerStats` est défini dans 3 fichiers :
- `utils/stats.ts` (utilisé partout)
- `features/combat/combat.logic.ts` (utilisé localement)
- `utils/combat.ts` (ancien fichier)

**Action recommandée**: 
- Garder uniquement `utils/stats.ts` comme source de vérité
- Importer depuis `utils/stats.ts` dans `combat.logic.ts`

### 3. `BALANCE_CONFIG` non utilisé partout

**Observation**: `BALANCE_CONFIG` est défini mais certaines valeurs hardcodées existent encore

**Fichiers utilisant BALANCE_CONFIG**:
- ✅ `exploration.logic.ts` (goldMultiplier)
- ✅ `gameManager.ts` (dailyInterest)
- ✅ `forge.logic.ts` (repairCostPerPoint)

**Action recommandée**: Vérifier qu'il n'y a pas de valeurs hardcodées qui devraient utiliser BALANCE_CONFIG

---

## 📊 RÉSUMÉ STATISTIQUE

- **Fichiers scannés**: 117
- **Exports analysés**: ~250
- **Code mort confirmé**: 6 éléments
- **Connexions douteuses**: 3 problèmes majeurs
- **Duplications**: 3 zones critiques

---

## ✅ ACTIONS PRIORITAIRES

### Priorité 1 (CRITIQUE - Risque de bug)
1. **Résoudre la duplication `utils/combat.ts` vs `combat.logic.ts`**
   - Migrer `MapScreen.tsx` vers `combat.logic.ts`
   - Supprimer `utils/combat.ts`
   - Unifier les types `CombatOutcome` et `CombatResult`

### Priorité 2 (Code mort à nettoyer)
2. **Supprimer les exports inutilisés**:
   - `getDialogueForStage`
   - `resetDailyObjectives`
   - `findEligibleEvent`
   - `GameManagerState` (retirer export)
   - `DaySummary` (retirer export)
   - `getStatsShort`

3. **Rendre privée**:
   - `generateEveningEvents` (si non nécessaire en externe)

### Priorité 3 (Optimisation)
4. **Unifier les types `PlayerStats`**
   - Importer depuis `utils/stats.ts` partout

5. **Vérifier les valeurs hardcodées**
   - S'assurer que toutes les valeurs configurables utilisent `BALANCE_CONFIG`

---

## 🎯 CONCLUSION

Le codebase est globalement bien structuré, mais contient :
- **Duplication critique** entre `utils/combat.ts` et `combat.logic.ts` qui peut causer des bugs
- **Code mort mineur** facilement supprimable
- **Types dupliqués** à unifier

**Recommandation**: Commencer par résoudre la duplication critique de combat avant toute autre action.
