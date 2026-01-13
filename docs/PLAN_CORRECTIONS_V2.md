# SOUDA — Plan de Corrections Post-Tests V2
**Date :** 2024-12-XX  
**Basé sur :** Rapport de Tests Utilisateurs V2 (15 joueurs, post-corrections)  
**Version cible :** v1.2.0  
**Durée estimée :** 1-2 semaines

---

## EXECUTIVE SUMMARY

Ce plan détaille toutes les modifications à apporter suite aux retours de 15 joueurs testeurs après les corrections initiales. Des progrès significatifs ont été faits, mais des problèmes persistent.

**Progrès réalisés :**
- Taux de complétion : 40% → 53% (+32%)
- Satisfaction moyenne : 6.2/10 → 7.1/10 (+14%)
- Intention d'achat : 33% → 47% (+42%)

**Problèmes persistants :**
- Balance économique J10-14 : 8/15 joueurs
- Fins multiples encore difficiles : 6/15 joueurs
- Warnings combat pas assez précis : 5/15 joueurs
- Onboarding encore insuffisant : 4/15 joueurs
- Performance mobile : 3/15 joueurs

**Objectifs :**
- Taux de complétion : 53% → 65%+
- Satisfaction moyenne : 7.1/10 → 8.0/10+
- Intention d'achat : 47% → 60%+

---

## SPRINT 1 : CORRECTIONS CRITIQUES (Semaine 1)

### Tâche 1.1 : Rééquilibrer l'Économie J10-14 (PRIORITÉ CRITIQUE)
**Problème :** J10-14 est encore un "mur" mentionné par 8/15 joueurs  
**Impact :** 53% des joueurs frustrés

#### Modifications à apporter :

1. **Réduire encore les intérêts journaliers**
   - Actuel : 4💰/jour
   - Nouveau : 3💰/jour (-25% supplémentaire)
   - Fichier : `src/config/balance.ts`
   - Ligne : `dailyInterest: 4` → `dailyInterest: 3`

2. **Augmenter encore les revenus de base**
   - Actuel : +25% (goldMultiplier: 1.25)
   - Nouveau : +35% (goldMultiplier: 1.35)
   - Fichier : `src/config/balance.ts`
   - Ligne : `goldMultiplier: 1.25` → `goldMultiplier: 1.35`

3. **Réduire encore les coûts de réparation**
   - Actuel : 0.3
   - Nouveau : 0.25 (-17% supplémentaire)
   - Fichier : `src/config/balance.ts`
   - Ligne : `repairCostPerPoint: 0.3` → `repairCostPerPoint: 0.25`

4. **Système de sécurité si dette élevée**
   - Si dette > 120💰 au J15+, réduire intérêts à 2💰/jour
   - Fichier : `src/features/game/gameManager.ts`
   - Fonction : `advanceDay`

5. **Augmenter encore les revenus d'exploration**
   - Actuel : richness * 8-24
   - Nouveau : richness * 10-30 (+25%)
   - Fichier : `src/features/exploration/exploration.logic.ts`

**Fichiers affectés :**
- `src/config/balance.ts`
- `src/features/exploration/exploration.logic.ts`
- `src/features/game/gameManager.ts`

**Estimation :** 1 jour  
**Tests :** Vérifier que J10-14 est gérable avec revenus optimaux

---

### Tâche 1.2 : Réduire Encore les Seuils des Fins (PRIORITÉ CRITIQUE)
**Problème :** 6/15 joueurs n'ont vu que "Survivant", fins encore difficiles  
**Impact :** 40% des joueurs frustrés

#### Modifications à apporter :

1. **Réduire encore les seuils des fins basées sur compteurs**
   - Humanité : 12 → 10 (-17%)
   - Cynisme : 12 → 10 (-17%)
   - Pragmatisme : 12 → 10 (-17%)
   - Fichier : `src/features/endings/endings.logic.ts`
   - Fonction : `determineVictoryEnding`

2. **Réduire encore le seuil de la fin équilibrée**
   - Actuel : Tous >= 4, différence < 6
   - Nouveau : Tous >= 3, différence < 7
   - Fichier : `src/features/endings/endings.logic.ts`

3. **Augmenter encore les gains de compteurs narratifs**
   - Dons aux réfugiés : +3 → +4 humanité
   - Partage repas : +1 → +2 humanité (déjà fait)
   - Aide malades : +3 → +4 humanité
   - Vol/embuscade : +2 → +3 cynisme
   - Fichiers : `src/features/events/eventPool.ts`, `src/features/events/eveningEvents.ts`

4. **Système de bonus final au J20**
   - Si compteur >= 9 au J20, ajouter +1 pour atteindre la fin
   - Fichier : `src/store/gameStore.ts`
   - Fonction : `endDay` ou `checkEndConditions`

5. **Message d'encouragement si proche d'une fin**
   - Afficher "Tu es proche de 'Rédemption' (11/12)" dans EndingProgress
   - Fichier : `src/components/EndingProgress.tsx`

**Fichiers affectés :**
- `src/features/endings/endings.logic.ts`
- `src/features/events/eventPool.ts`
- `src/features/events/eveningEvents.ts`
- `src/store/gameStore.ts`
- `src/components/EndingProgress.tsx`

**Estimation :** 1 jour  
**Tests :** Vérifier qu'une fin basée sur compteurs est atteignable en 1 run normale

---

## SPRINT 2 : AMÉLIORATIONS HAUTES PRIORITÉS (Semaine 1-2)

### Tâche 2.1 : Améliorer Encore les Warnings Combat (PRIORITÉ HAUTE)
**Problème :** 5/15 joueurs veulent plus de précision  
**Impact :** 33% des joueurs veulent plus d'infos

#### Modifications à apporter :

1. **Afficher les stats estimées de l'ennemi**
   - Afficher ATK, DEF, VIT estimés de l'ennemi
   - Fichier : `src/screens/MapScreen.tsx`
   - Utiliser `getEstimatedEnemyForRisk`

2. **Afficher la probabilité de chaque résultat**
   - Probabilité de victoire écrasante
   - Probabilité de victoire normale
   - Probabilité de victoire coûteuse
   - Probabilité de fuite
   - Probabilité de défaite
   - Fichier : `src/utils/combat.ts` (nouvelle fonction)
   - Fichier : `src/screens/MapScreen.tsx`

3. **Ajouter un tooltip avec détails au survol**
   - Tooltip détaillé avec toutes les infos
   - Fichier : `src/screens/MapScreen.tsx`

**Fichiers affectés :**
- `src/utils/combat.ts`
- `src/screens/MapScreen.tsx`

**Estimation :** 1 jour  
**Tests :** Vérifier que les warnings sont très informatifs

---

### Tâche 2.2 : Améliorer Encore l'Onboarding (PRIORITÉ HAUTE)
**Problème :** 4/15 joueurs ne comprennent pas tout  
**Impact :** 27% des joueurs perdus

#### Modifications à apporter :

1. **Simplifier encore le tutorial des rumeurs**
   - Version ultra-simplifiée avec 1 exemple concret
   - Fichier : `src/screens/TaverneScreen.tsx`

2. **Guide contextuel pas-à-pas**
   - Guide qui apparaît au premier affichage de chaque écran
   - Fichier : `src/components/ContextualGuide.tsx` (nouveau)

3. **Réduire le texte dans les écrans principaux**
   - Version courte des descriptions
   - Fichiers : Tous les écrans principaux

**Fichiers affectés :**
- `src/screens/TaverneScreen.tsx`
- `src/components/ContextualGuide.tsx` (nouveau)
- Tous les écrans principaux

**Estimation :** 1.5 jours  
**Tests :** Vérifier que les nouveaux joueurs comprennent tout

---

## SPRINT 3 : AMÉLIORATIONS MOYENNES (Semaine 2)

### Tâche 3.1 : Optimiser Performance Mobile (PRIORITÉ MOYENNE)
**Problème :** 3/15 joueurs mobiles ont des problèmes de performance  
**Impact :** 20% des joueurs mobiles

#### Modifications à apporter :

1. **Optimiser encore les performances**
   - Lazy loading des assets
   - Réduction animations sur mobile
   - Fichiers : `src/features/character/renderCharacter.ts`, `src/components/PageTransition.tsx`

2. **Réduire encore le texte sur mobile**
   - Version ultra-courte des descriptions
   - Fichiers : Tous les écrans

3. **Mode performance pour appareils bas de gamme**
   - Détection automatique
   - Désactivation animations
   - Réduction qualité graphique
   - Fichier : `src/hooks/useIsLowEndDevice.ts` (déjà créé)
   - Fichiers : Tous les écrans

**Fichiers affectés :**
- `src/features/character/renderCharacter.ts`
- `src/components/PageTransition.tsx`
- Tous les écrans
- `src/hooks/useIsLowEndDevice.ts`

**Estimation :** 1.5 jours  
**Tests :** Tester sur plusieurs appareils mobiles

---

## RÉSUMÉ DES MODIFICATIONS

### Fichiers à Modifier (par priorité)

**PRIORITÉ CRITIQUE :**
- `src/config/balance.ts` (économie J10-14)
- `src/features/exploration/exploration.logic.ts` (revenus)
- `src/features/game/gameManager.ts` (système sécurité)
- `src/features/endings/endings.logic.ts` (seuils fins)
- `src/features/events/eventPool.ts` (gains compteurs)
- `src/features/events/eveningEvents.ts` (gains compteurs)
- `src/store/gameStore.ts` (bonus final J20)
- `src/components/EndingProgress.tsx` (message encouragement)

**PRIORITÉ HAUTE :**
- `src/utils/combat.ts` (probabilités résultats)
- `src/screens/MapScreen.tsx` (warnings améliorés)
- `src/screens/TaverneScreen.tsx` (tutorial simplifié)
- `src/components/ContextualGuide.tsx` (nouveau)
- Tous les écrans principaux (texte réduit)

**PRIORITÉ MOYENNE :**
- `src/features/character/renderCharacter.ts` (performance)
- `src/components/PageTransition.tsx` (animations)
- `src/hooks/useIsLowEndDevice.ts` (mode performance)

---

## PLANNING DÉTAILLÉ

### Semaine 1 : Corrections Critiques
- **Jour 1 :** Tâche 1.1 (Rééquilibrer économie J10-14)
- **Jour 2 :** Tâche 1.2 (Réduire seuils fins)
- **Jour 3 :** Tâche 2.1 (Warnings combat améliorés)
- **Jour 4-5 :** Tâche 2.2 (Onboarding amélioré)

### Semaine 2 : Améliorations Moyennes
- **Jour 1-2 :** Tâche 3.1 (Performance mobile)
- **Jour 3-5 :** Tests finaux et polish

---

## CRITÈRES DE SUCCÈS

### Métriques Cibles

**Avant corrections V2 :**
- Taux de complétion : 53%
- Satisfaction moyenne : 7.1/10
- Intention d'achat : 47%

**Après corrections V2 :**
- Taux de complétion : **65%+** (+23%)
- Satisfaction moyenne : **8.0/10+** (+13%)
- Intention d'achat : **60%+** (+28%)

### Tests de Validation

1. **Balance économique :**
   - ✅ J10-14 gérable avec revenus optimaux
   - ✅ Système de sécurité actif si dette > 120💰

2. **Fins multiples :**
   - ✅ Au moins 1 fin basée sur compteurs atteignable en 1 run normale
   - ✅ 4+ fins différentes visibles sur 5 runs
   - ✅ Message d'encouragement si proche

3. **Warnings combat :**
   - ✅ Stats ennemi affichées
   - ✅ Probabilités de chaque résultat affichées
   - ✅ 95%+ des joueurs comprennent les warnings

4. **Onboarding :**
   - ✅ 90%+ des nouveaux joueurs comprennent les mécaniques
   - ✅ Guide contextuel complet

5. **Performance mobile :**
   - ✅ 60 FPS sur appareils moyens
   - ✅ 30 FPS sur appareils bas de gamme
   - ✅ Pas de lag perceptible

---

## NOTES TECHNIQUES

### Configuration de Balance Recommandée V2

```typescript
// src/config/balance.ts
export const BALANCE_CONFIG = {
  economy: {
    dailyInterest: 3, // Réduit de 4 à 3 (-25%)
    repairCostPerPoint: 0.25, // Réduit de 0.3 à 0.25 (-17%)
    goldMultiplier: 1.35 // Augmenté de 1.25 à 1.35 (+35%)
  }
}
```

### Seuils de Fins Recommandés V2

```typescript
// src/features/endings/endings.logic.ts
// Humanité >= 10 (au lieu de 12)
// Cynisme >= 10 (au lieu de 12)
// Pragmatisme >= 10 (au lieu de 12)
// Équilibré : Tous >= 3, différence < 7
```

### Gains Compteurs Recommandés V2

```typescript
// Dons réfugiés : +4 humanité (au lieu de +3)
// Partage repas : +2 humanité (déjà fait)
// Aide malades : +4 humanité (au lieu de +3)
// Vol/embuscade : +3 cynisme (au lieu de +2)
```

### Système de Sécurité

```typescript
// src/features/game/gameManager.ts
// Si dette > 120💰 au J15+, intérêts = 2💰/jour
```

### Bonus Final J20

```typescript
// src/store/gameStore.ts
// Si compteur >= 9 au J20, ajouter +1 pour atteindre la fin
```

---

## RISQUES ET MITIGATION

### Risque 1 : Balance trop facile après corrections
**Mitigation :** Tests itératifs, ajustements progressifs, système de sécurité

### Risque 2 : Fins trop faciles à atteindre
**Mitigation :** Garder un équilibre, tester avec différents styles de jeu

### Risque 3 : Warnings combat trop chargés
**Mitigation :** Version compacte sur mobile, tooltip au survol

---

**Date de création :** 2024-12-XX  
**Prochaine révision :** Après implémentation Sprint 1
