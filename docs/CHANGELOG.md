# SOUDA — Changelog
**Version :** 1.0.0 (Post-Sprints 1-3)

---

## 🎯 Vue d'Ensemble

Ce changelog documente toutes les améliorations apportées lors des Sprints 1, 2 et 3, basées sur les retours de test et le plan de corrections.

---

## 📦 Sprint 1 : Corrections Prioritaires

### 💰 Balance Économique (Tâche 1.1)
**Problème :** Courbe de difficulté trop serrée J8-12, revenus insuffisants  
**Solution :**
- ✅ Revenus de base augmentés de **15%** (richness * 6-18 au lieu de 5-15)
- ✅ Coûts de réparation réduits de **20%** (0.4 au lieu de 0.5)
- ✅ Multiplicateur global or ajouté dans `BALANCE_CONFIG`

**Fichiers modifiés :**
- `src/config/balance.ts`
- `src/features/exploration/exploration.logic.ts`
- `src/features/forge/forge.logic.ts`

---

### 🎨 Feedback Items Compromis (Tâche 1.2)
**Problème :** Malus cachés pas visibles, frustration après équipement  
**Solution :**
- ✅ Renommé "maudits" → **"compromis"** (pas de magie, descriptions réalistes)
- ✅ Malus maintenant **visibles avant équipement** dans tooltip
- ✅ Comparaison stats avant/après équipement dans inventaire
- ✅ Descriptions détaillées des défauts (lourdeur, réputation, etc.)

**Items compromis :**
- Épée Lourde de Guerre (lourdeur)
- Armure de Pillard (réputation de pillard)
- Amulette de Déserteur (symbole de déserteur)
- Bottes Usées de Voyageur (protection insuffisante)

**Fichiers modifiés :**
- `src/features/items/cursedItems.ts` → `COMPROMISED_ITEMS`
- `src/features/loot/ItemCard.tsx`
- `src/screens/InventoryScreen.tsx`
- `src/types/item.ts`

---

### 📚 Onboarding Rumeurs (Tâche 1.3)
**Problème :** Impact des rumeurs pas évident au début  
**Solution :**
- ✅ Modal tutorial au **premier affichage** des rumeurs
- ✅ Explication des 4 types de rumeurs et leurs effets
- ✅ Flag `firstRumorSeen` sauvegardé dans le store

**Fichiers modifiés :**
- `src/screens/TaverneScreen.tsx`
- `src/store/gameStore.ts`

---

## 📦 Sprint 2 : Améliorations Moyennes

### 🌙 Événements du Soir Rééquilibrés (Tâche 2.1)
**Problème :** 30% chance trop faible, certains choix trop avantageux  
**Solution :**
- ✅ Probabilité augmentée : **30% → 45%**
- ✅ Récompenses rééquilibrées :
  - Marchand : 15💰 → 12💰
  - Message arbre : 25💰 → 20💰
  - Voyageurs (vol) : 15-30💰 → 12-22💰

**Fichiers modifiés :**
- `src/features/events/eveningEvents.ts`

---

### ⚔️ Feedback Combat (Tâche 2.2)
**Problème :** Pas d'indication de force avant combat, défaites frustrantes  
**Solution :**
- ✅ Fonction `estimateCombatRatio()` : Calcule ratio moyen sans random
- ✅ Fonction `getEstimatedEnemyForRisk()` : Ennemi moyen selon risque
- ✅ **Warnings visuels** dans MapScreen :
  - ⚠️ **DANGER** (rouge) : Ratio < 0.5
  - ⚠️ **RISQUÉ** (jaune) : Ratio < 0.7
  - ✓ **SÛR** (vert) : Ratio > 1.0

**Fichiers modifiés :**
- `src/utils/combat.ts`
- `src/screens/MapScreen.tsx`

---

### 📊 Impact Compteurs Narratifs (Tâche 2.3)
**Problème :** Compteurs n'impactent que les monologues  
**Solution :**
- ✅ **Impact sur prix marché** :
  - Humanité >= 10 : **+5% prix de vente**
  - Cynisme >= 10 : **-10% prix d'achat** (négociation)
- ✅ **Impact sur réparation** :
  - Pragmatisme >= 10 : **-10% coût de réparation**
- ✅ **Impact sur réputation** :
  - Humanité >= 15 : **+1 réputation bonus**
  - Cynisme >= 15 : **-1 réputation malus**
- ✅ **Impact sur événements** :
  - Requirements narratifs dans les choix (`humanite`, `cynisme`, `pragmatisme`)
  - Filtrage automatique des choix selon compteurs

**Fichiers modifiés :**
- `src/features/economy/priceCalculation.ts`
- `src/store/gameStore.ts`
- `src/features/forge/forge.logic.ts`
- `src/screens/ForgeScreen.tsx`
- `src/types/event.ts`
- `src/features/events/eventResolver.ts`
- `src/screens/EventScreen.tsx`

---

## 📦 Sprint 3 : Améliorations Futures

### 🌙 Plus d'Événements du Soir (Tâche 3.1)
**Ajout :** 4 nouveaux événements interactifs
1. **Ancien soldat** — Rencontre avec un vétéran
2. **Campement abandonné** — Découverte d'un campement
3. **Message d'un contact** — Mission proposée
4. **Réfugiés au camp** — Groupe de réfugiés affamés

**Total :** 8 événements interactifs (4 textuels + 8 interactifs = 12 événements)

**Fichiers modifiés :**
- `src/features/events/eveningEvents.ts`

---

### 🎬 Système de Fins Multiples (Tâche 3.2)
**Ajout :** 4 nouvelles fins basées sur compteurs narratifs (priorité haute)

1. **La Rédemption** (Humanité >= 15)
   - Ambiance : Lumière, monastère
   - Texte : Choix de l'humanité, rédemption

2. **La Survie** (Cynisme >= 15)
   - Ambiance : Cendres, sombre
   - Texte : Survie à tout prix

3. **L'Efficacité** (Pragmatisme >= 15)
   - Ambiance : Brume, logique
   - Texte : Victoire par la logique

4. **L'Équilibre** (Compteurs équilibrés, tous >= 5, différence < 5)
   - Ambiance : Neutre
   - Texte : Complexité humaine

**Total :** 9 fins de victoire (4 nouvelles + 5 existantes)

**Fichiers modifiés :**
- `src/features/endings/endings.logic.ts`
- `src/features/endings/types.ts`

---

## 📈 Statistiques

### Avant les Sprints
- Événements du soir : 30% chance, 4 interactifs
- Fins de victoire : 5
- Feedback combat : Aucun
- Impact compteurs : Monologues uniquement
- Balance économique : Trop serrée J8-12

### Après les Sprints
- Événements du soir : **45% chance, 8 interactifs** (+100%)
- Fins de victoire : **9** (+80%)
- Feedback combat : **Warnings visuels** (DANGER/RISQUÉ/SÛR)
- Impact compteurs : **Prix, réparation, réputation, événements, fins**
- Balance économique : **+15% revenus, -20% réparations**

---

## 🐛 Bugs Corrigés

- ✅ Correction ID items compromis (`armor_compromised` vs `amulet_compromised`)
- ✅ Correction coût réparation (utilisation de `BALANCE_CONFIG`)
- ✅ Correction affichage malus items compromis

---

## 📝 Notes Techniques

### Changements de Terminologie
- "Items maudits" → **"Items compromis"** (pas de magie)
- Descriptions réalistes (lourdeur, réputation, symboles)

### Nouveaux Fichiers
- `src/features/narrative/monologues.ts` (Sprint 4)
- `src/features/narrative/monologueSelector.ts` (Sprint 4)
- `src/types/eveningEvent.ts` (Sprint 4)
- `src/features/events/eveningEvents.ts` (Sprint 4)

### Fichiers Modifiés
- `src/config/balance.ts` — Configuration économique
- `src/features/exploration/exploration.logic.ts` — Revenus augmentés
- `src/features/forge/forge.logic.ts` — Coût réparation réduit
- `src/features/items/cursedItems.ts` — Renommé en COMPROMISED_ITEMS
- `src/features/loot/ItemCard.tsx` — Feedback visuel amélioré
- `src/screens/InventoryScreen.tsx` — Comparaison stats
- `src/screens/TaverneScreen.tsx` — Tutorial rumeurs
- `src/utils/combat.ts` — Fonctions d'estimation
- `src/screens/MapScreen.tsx` — Warnings combat
- `src/features/economy/priceCalculation.ts` — Bonus narratifs
- `src/types/event.ts` — Requirements narratifs
- `src/features/endings/endings.logic.ts` — Nouvelles fins

---

## 🎯 Prochaines Étapes Recommandées

1. **Tests utilisateurs élargis** (10-15 joueurs)
2. **Ajustements fins** selon feedback
3. **Polish visuel** (animations, transitions)
4. **Audio** (SFX, musique d'ambiance)
5. **Release v1.0**

---

**Date de mise à jour :** 2024-12-XX  
**Version :** 1.0.0
