# SOUDA — Plan de Corrections Post-Tests Utilisateurs
**Date :** 2024-12-XX  
**Basé sur :** Rapport de Tests Utilisateurs (15 joueurs)  
**Version cible :** v1.1.0  
**Durée estimée :** 2-3 semaines

---

## EXECUTIVE SUMMARY

Ce plan détaille toutes les modifications à apporter suite aux retours de 15 joueurs testeurs. Les problèmes critiques identifiés nécessitent des corrections avant release.

**Problèmes critiques :**
- Balance économique trop serrée (J8-12) : 12/15 joueurs
- Fins multiples difficiles à atteindre : 9/15 joueurs
- Compteurs narratifs peu impactants : 10/15 joueurs
- Warnings combat pas assez clairs : 8/15 joueurs
- Onboarding insuffisant : 7/15 joueurs

**Objectifs :**
- Taux de complétion : 40% → 60%+
- Satisfaction moyenne : 6.2/10 → 7.5/10+
- Intention d'achat : 33% → 50%+

---

## SPRINT 1 : CORRECTIONS CRITIQUES (Semaine 1)

### Tâche 1.1 : Rééquilibrer l'Économie (PRIORITÉ CRITIQUE)
**Problème :** J8-12 est un "mur" mentionné par 12/15 joueurs  
**Impact :** 80% des joueurs frustrés

#### Modifications à apporter :

1. **Réduire les intérêts journaliers**
   - Actuel : 5💰/jour
   - Nouveau : 4💰/jour (-20%)
   - Fichier : `src/config/balance.ts`
   - Ligne : `dailyInterest: 5` → `dailyInterest: 4`

2. **Augmenter les revenus de base**
   - Actuel : +15% (goldMultiplier: 1.15)
   - Nouveau : +25% (goldMultiplier: 1.25)
   - Fichier : `src/config/balance.ts`
   - Ligne : `goldMultiplier: 1.15` → `goldMultiplier: 1.25`

3. **Réduire les coûts de réparation**
   - Actuel : 0.4 (déjà réduit de 20%)
   - Nouveau : 0.3 (-30% au total)
   - Fichier : `src/config/balance.ts`
   - Ligne : `repairCostPerPoint: 0.4` → `repairCostPerPoint: 0.3`

4. **Augmenter les revenus d'exploration**
   - Actuel : richness * 6-18
   - Nouveau : richness * 8-24 (+33%)
   - Fichier : `src/features/exploration/exploration.logic.ts`
   - Fonction : `resolveExploration`

5. **Réduire les coûts des choix altruistes**
   - Réduire le coût des dons aux réfugiés : 10💰 → 8💰
   - Réduire le coût du repas partagé : 5💰 → 4💰
   - Fichiers : `src/features/events/eventPool.ts`, `src/store/gameStore.ts`

**Fichiers affectés :**
- `src/config/balance.ts`
- `src/features/exploration/exploration.logic.ts`
- `src/features/events/eventPool.ts`
- `src/store/gameStore.ts`

**Estimation :** 1 jour  
**Tests :** Vérifier que J8-12 est gérable avec revenus optimaux

---

### Tâche 1.2 : Réduire les Seuils des Fins Multiples (PRIORITÉ CRITIQUE)
**Problème :** 9/15 joueurs n'ont vu que "Survivant", fins impossibles à atteindre  
**Impact :** 60% des joueurs frustrés

#### Modifications à apporter :

1. **Réduire les seuils des fins basées sur compteurs**
   - Humanité : 15 → 12 (-20%)
   - Cynisme : 15 → 12 (-20%)
   - Pragmatisme : 15 → 12 (-20%)
   - Fichier : `src/features/endings/endings.logic.ts`
   - Fonction : `determineVictoryEnding`

2. **Réduire le seuil de la fin équilibrée**
   - Actuel : Tous >= 5, différence < 5
   - Nouveau : Tous >= 4, différence < 6
   - Fichier : `src/features/endings/endings.logic.ts`

3. **Augmenter les gains de compteurs narratifs**
   - Dons aux réfugiés : +2 → +3 humanité
   - Partage repas : +1 → +2 humanité
   - Aide malades : +2 → +3 humanité
   - Vol/embuscade : +1 → +2 cynisme
   - Fichiers : `src/features/events/eventPool.ts`, `src/features/events/eveningEvents.ts`

4. **Ajouter plus d'opportunités de gagner des compteurs**
   - Augmenter probabilité événements réfugiés : 10% → 15%
   - Ajouter bonus humanité pour repas quotidien : +1/jour si repas acheté
   - Fichiers : `src/features/events/eventPool.ts`, `src/store/gameStore.ts`

**Fichiers affectés :**
- `src/features/endings/endings.logic.ts`
- `src/features/events/eventPool.ts`
- `src/features/events/eveningEvents.ts`
- `src/store/gameStore.ts`

**Estimation :** 1 jour  
**Tests :** Vérifier qu'une fin basée sur compteurs est atteignable en 1 run normale

---

### Tâche 1.3 : Augmenter l'Impact des Compteurs Narratifs (PRIORITÉ CRITIQUE)
**Problème :** 10/15 joueurs ne voient pas l'impact des compteurs  
**Impact :** 67% des joueurs frustrés

#### Modifications à apporter :

1. **Augmenter les bonus de prix marché**
   - Humanité >= 10 : +5% → +10% prix de vente
   - Cynisme >= 10 : -10% → -15% prix d'achat
   - Fichier : `src/features/economy/priceCalculation.ts`

2. **Augmenter le bonus de réparation**
   - Pragmatisme >= 10 : -10% → -15% coût de réparation
   - Fichier : `src/features/forge/forge.logic.ts`

3. **Réduire les seuils des bonus**
   - Actuel : >= 10
   - Nouveau : >= 8 (-20%)
   - Fichiers : `src/features/economy/priceCalculation.ts`, `src/features/forge/forge.logic.ts`

4. **Afficher clairement les bonus actifs dans l'UI**
   - Ajouter un indicateur visuel dans le Marché si bonus actif
   - Ajouter un indicateur visuel dans la Forge si bonus actif
   - Fichiers : `src/screens/MarcheScreen.tsx`, `src/screens/ForgeScreen.tsx`

5. **Ajouter des notifications quand un bonus s'active**
   - Toast/notification quand un seuil est atteint
   - Fichier : `src/store/gameStore.ts` (dans `incrementCounter`)

**Fichiers affectés :**
- `src/features/economy/priceCalculation.ts`
- `src/features/forge/forge.logic.ts`
- `src/screens/MarcheScreen.tsx`
- `src/screens/ForgeScreen.tsx`
- `src/store/gameStore.ts`

**Estimation :** 1.5 jours  
**Tests :** Vérifier que les bonus sont visibles et impactants

---

## SPRINT 2 : AMÉLIORATIONS HAUTES PRIORITÉS (Semaine 2)

### Tâche 2.1 : Améliorer les Warnings Combat (PRIORITÉ HAUTE)
**Problème :** 8/15 joueurs trouvent les warnings pas assez clairs  
**Impact :** 53% des joueurs frustrés

#### Modifications à apporter :

1. **Afficher le ratio estimé exact**
   - Actuel : "DANGER", "RISQUÉ", "SÛR"
   - Nouveau : "DANGER (Ratio: 0.35)", "RISQUÉ (Ratio: 0.65)", "SÛR (Ratio: 1.2)"
   - Fichier : `src/screens/MapScreen.tsx`
   - Fonction : Affichage des warnings

2. **Ajouter une explication textuelle**
   - "DANGER : Tu risques de perdre ce combat"
   - "RISQUÉ : Combat difficile, tu risques de fuir"
   - "SÛR : Tu devrais gagner ce combat"
   - Fichier : `src/screens/MapScreen.tsx`

3. **Ajouter un pourcentage de chance de victoire**
   - Calculer probabilité basée sur ratio
   - Afficher : "Chance de victoire : 25%"
   - Fichier : `src/utils/combat.ts` (nouvelle fonction)
   - Fichier : `src/screens/MapScreen.tsx`

4. **Améliorer le visuel des warnings**
   - Couleurs plus contrastées
   - Icônes plus claires
   - Tooltip avec détails au survol
   - Fichier : `src/screens/MapScreen.tsx`

**Fichiers affectés :**
- `src/screens/MapScreen.tsx`
- `src/utils/combat.ts`

**Estimation :** 1 jour  
**Tests :** Vérifier que les warnings sont clairs et informatifs

---

### Tâche 2.2 : Améliorer l'Onboarding (PRIORITÉ HAUTE)
**Problème :** 7/15 joueurs ne comprennent pas les mécaniques de base  
**Impact :** 47% des joueurs perdus

#### Modifications à apporter :

1. **Améliorer le tutorial des rumeurs**
   - Modal plus détaillé avec exemples
   - Afficher un exemple concret d'impact
   - Fichier : `src/screens/TaverneScreen.tsx`

2. **Améliorer l'explication des items compromis**
   - Tooltip plus détaillé dans l'inventaire
   - Exemple visuel des malus
   - Fichier : `src/screens/InventoryScreen.tsx`
   - Fichier : `src/features/loot/ItemCard.tsx`

3. **Simplifier l'interface**
   - Réduire le texte dans les écrans principaux
   - Ajouter des icônes pour les actions courantes
   - Fichiers : Tous les écrans principaux

4. **Ajouter un guide contextuel**
   - Tooltips sur les éléments importants
   - Explications au premier affichage
   - Fichier : `src/components/ContextualHelp.tsx` (nouveau)

5. **Améliorer le tutorial Jour 0**
   - Ajouter une section sur les rumeurs
   - Ajouter une section sur les items compromis
   - Fichier : `src/screens/TutorialScreen.tsx`

**Fichiers affectés :**
- `src/screens/TaverneScreen.tsx`
- `src/screens/InventoryScreen.tsx`
- `src/features/loot/ItemCard.tsx`
- `src/screens/TutorialScreen.tsx`
- `src/components/ContextualHelp.tsx` (nouveau)

**Estimation :** 2 jours  
**Tests :** Vérifier que les nouveaux joueurs comprennent les mécaniques

---

### Tâche 2.3 : Afficher la Progression vers les Fins (PRIORITÉ HAUTE)
**Problème :** Les joueurs ne savent pas qu'ils progressent vers une fin  
**Impact :** Frustration narrative

#### Modifications à apporter :

1. **Ajouter un indicateur de progression**
   - Afficher les compteurs narratifs avec barres de progression
   - Afficher "X/12 humanité pour fin Rédemption"
   - Fichier : `src/screens/AubeScreen.tsx` ou nouveau composant

2. **Afficher les fins disponibles**
   - Liste des fins avec conditions
   - Indicateur de progression pour chaque fin
   - Fichier : `src/components/EndingProgress.tsx` (nouveau)

3. **Notification quand proche d'une fin**
   - "Tu es proche de la fin 'Rédemption' (11/12 humanité)"
   - Fichier : `src/store/gameStore.ts`

**Fichiers affectés :**
- `src/screens/AubeScreen.tsx`
- `src/components/EndingProgress.tsx` (nouveau)
- `src/store/gameStore.ts`

**Estimation :** 1 jour  
**Tests :** Vérifier que la progression est claire

---

## SPRINT 3 : AMÉLIORATIONS MOYENNES (Semaine 3)

### Tâche 3.1 : Améliorer l'Interface Mobile (PRIORITÉ MOYENNE)
**Problème :** 2/15 joueurs mobiles ont abandonné rapidement  
**Impact :** 13% des joueurs mobiles

#### Modifications à apporter :

1. **Améliorer le responsive**
   - Réduire la taille du texte sur mobile
   - Agrandir les boutons (minimum 44x44px)
   - Fichiers : Tous les écrans

2. **Optimiser les performances**
   - Réduire les animations sur mobile
   - Lazy loading des assets
   - Fichiers : `src/features/character/renderCharacter.ts`

3. **Simplifier la navigation mobile**
   - Menu hamburger pour les actions secondaires
   - Swipe gestures pour navigation
   - Fichiers : Navigation components

**Fichiers affectés :**
- Tous les écrans (CSS responsive)
- `src/features/character/renderCharacter.ts`
- Navigation components

**Estimation :** 2 jours  
**Tests :** Tester sur plusieurs appareils mobiles

---

### Tâche 3.2 : Réduire la Répétition des Monologues (PRIORITÉ MOYENNE)
**Problème :** 3/15 joueurs trouvent les monologues répétitifs  
**Impact :** 20% des joueurs narratifs

#### Modifications à apporter :

1. **Augmenter la variété des monologues**
   - Ajouter 5-10 nouveaux monologues par catégorie
   - Fichier : `src/features/narrative/monologues.ts`

2. **Améliorer la sélection**
   - Meilleur système d'évitement des répétitions
   - Fichier : `src/features/narrative/monologueSelector.ts`

**Fichiers affectés :**
- `src/features/narrative/monologues.ts`
- `src/features/narrative/monologueSelector.ts`

**Estimation :** 1 jour  
**Tests :** Vérifier que les monologues sont variés

---

## RÉSUMÉ DES MODIFICATIONS

### Fichiers à Modifier (par priorité)

**PRIORITÉ CRITIQUE :**
- `src/config/balance.ts` (économie)
- `src/features/exploration/exploration.logic.ts` (revenus)
- `src/features/endings/endings.logic.ts` (seuils fins)
- `src/features/events/eventPool.ts` (gains compteurs)
- `src/features/events/eveningEvents.ts` (gains compteurs)
- `src/features/economy/priceCalculation.ts` (bonus prix)
- `src/features/forge/forge.logic.ts` (bonus réparation)
- `src/store/gameStore.ts` (notifications, gains)

**PRIORITÉ HAUTE :**
- `src/screens/MapScreen.tsx` (warnings combat)
- `src/utils/combat.ts` (calcul probabilité)
- `src/screens/TaverneScreen.tsx` (tutorial rumeurs)
- `src/screens/InventoryScreen.tsx` (explication items)
- `src/features/loot/ItemCard.tsx` (tooltips)
- `src/screens/TutorialScreen.tsx` (tutorial amélioré)
- `src/components/ContextualHelp.tsx` (nouveau)
- `src/components/EndingProgress.tsx` (nouveau)
- `src/screens/AubeScreen.tsx` (progression fins)
- `src/screens/MarcheScreen.tsx` (indicateurs bonus)
- `src/screens/ForgeScreen.tsx` (indicateurs bonus)

**PRIORITÉ MOYENNE :**
- Tous les écrans (CSS responsive)
- `src/features/character/renderCharacter.ts` (performance)
- `src/features/narrative/monologues.ts` (variété)
- `src/features/narrative/monologueSelector.ts` (sélection)

---

## PLANNING DÉTAILLÉ

### Semaine 1 : Corrections Critiques
- **Jour 1 :** Tâche 1.1 (Rééquilibrer économie)
- **Jour 2 :** Tâche 1.2 (Réduire seuils fins)
- **Jour 3-4 :** Tâche 1.3 (Augmenter impact compteurs)
- **Jour 5 :** Tests et corrections Sprint 1

### Semaine 2 : Améliorations Hautes Priorités
- **Jour 1 :** Tâche 2.1 (Warnings combat)
- **Jour 2-3 :** Tâche 2.2 (Onboarding)
- **Jour 4 :** Tâche 2.3 (Progression fins)
- **Jour 5 :** Tests et corrections Sprint 2

### Semaine 3 : Améliorations Moyennes
- **Jour 1-2 :** Tâche 3.1 (Interface mobile)
- **Jour 3 :** Tâche 3.2 (Monologues)
- **Jour 4-5 :** Tests finaux et polish

---

## CRITÈRES DE SUCCÈS

### Métriques Cibles

**Avant corrections :**
- Taux de complétion : 40%
- Satisfaction moyenne : 6.2/10
- Intention d'achat : 33%

**Après corrections :**
- Taux de complétion : **60%+** (+50%)
- Satisfaction moyenne : **7.5/10+** (+21%)
- Intention d'achat : **50%+** (+52%)

### Tests de Validation

1. **Balance économique :**
   - ✅ J8-12 gérable avec revenus optimaux
   - ✅ Dette remboursable au J18-20 avec stratégie moyenne

2. **Fins multiples :**
   - ✅ Au moins 1 fin basée sur compteurs atteignable en 1 run normale
   - ✅ 3+ fins différentes visibles sur 5 runs

3. **Compteurs narratifs :**
   - ✅ Bonus visibles et impactants (+10% minimum)
   - ✅ Seuils atteignables (8 au lieu de 10)

4. **Warnings combat :**
   - ✅ Ratio exact affiché
   - ✅ Explication textuelle claire
   - ✅ 90%+ des joueurs comprennent les warnings

5. **Onboarding :**
   - ✅ 80%+ des nouveaux joueurs comprennent les mécaniques
   - ✅ Tutorial complet et clair

---

## RISQUES ET MITIGATION

### Risque 1 : Balance trop facile après corrections
**Mitigation :** Tests itératifs, ajustements progressifs

### Risque 2 : Fins trop faciles à atteindre
**Mitigation :** Garder un équilibre, tester avec différents styles de jeu

### Risque 3 : Interface mobile complexe
**Mitigation :** Tests sur plusieurs appareils, feedback utilisateurs mobiles

---

## NOTES TECHNIQUES

### Configuration de Balance Recommandée

```typescript
// src/config/balance.ts
export const BALANCE_CONFIG = {
  economy: {
    dailyInterest: 4, // Réduit de 5 à 4 (-20%)
    repairCostPerPoint: 0.3, // Réduit de 0.4 à 0.3 (-25%)
    goldMultiplier: 1.25 // Augmenté de 1.15 à 1.25 (+25%)
  }
}
```

### Seuils de Fins Recommandés

```typescript
// src/features/endings/endings.logic.ts
// Humanité >= 12 (au lieu de 15)
// Cynisme >= 12 (au lieu de 15)
// Pragmatisme >= 12 (au lieu de 15)
// Équilibré : Tous >= 4, différence < 6
```

### Bonus Compteurs Recommandés

```typescript
// Seuils : >= 8 (au lieu de 10)
// Humanité : +10% prix vente (au lieu de +5%)
// Cynisme : -15% prix achat (au lieu de -10%)
// Pragmatisme : -15% réparation (au lieu de -10%)
```

---

**Date de création :** 2024-12-XX  
**Prochaine révision :** Après implémentation Sprint 1
