# PLAN D'ACTION - CORRECTIFS POST-AUDIT

**Date :** 2024  
**Source :** 3 audits (Logique Narrative, Équilibrage, UX)  
**Méthodologie :** Regroupement par fichier pour éviter les ouvertures multiples

---

## 🔍 ANALYSE DES CONFLITS POTENTIELS

### Conflits détectés : **AUCUN**

✅ **Tous les correctifs sont compatibles :**
- Les modifications de flags (Audit 1) n'affectent pas l'équilibrage (Audit 2)
- Les modifications UX (Audit 3) n'affectent pas la logique (Audit 1)
- Les modifications d'équilibrage (Audit 2) sont dans des fichiers de config séparés

### Points d'attention :
- ⚠️ **Événement "refugies"** : Mentionné dans Audit 1 ET Audit 2 → Regrouper les corrections
- ⚠️ **Événement "collecteurs"** : Mentionné dans Audit 1 ET Audit 2 → Regrouper les corrections
- ✅ **Pénalité faim** : Seulement dans Audit 2 → Pas de conflit
- ✅ **Layout AubeScreen** : Seulement dans Audit 3 → Pas de conflit

---

## 📋 PLAN DE BATAILLE PAR FICHIER

### Fichier : `src/features/events/eventPool.ts`

**Modifications (Audit 1 - Logique Narrative) :**
- [ ] **CRITIQUE** : Ajouter `flags: { convoiDone: true }` dans choix `embuscade` et `prevenir` de l'événement `convoi`
- [ ] **CRITIQUE** : Ajouter `flags: { marchandMet: true }` dans TOUS les choix de l'événement `marchand`
- [ ] **MOYEN** : Ajouter `flags: { collecteursPaid: true }` dans choix `payer` de l'événement `collecteurs`
- [ ] **MOYEN** : Modifier `triggerCondition` de `collecteurs` pour vérifier `!state.npcFlags.collecteursPaid`

**Modifications (Audit 2 - Équilibrage) :**
- [ ] **MOYEN** : Ajouter compteur de déclenchements pour `refugies` (max 5 fois sur 20 jours)
- [ ] **MOYEN** : Ajouter `gold: -5` dans choix `negocier` de l'événement `collecteurs` (coût négociation)

**Ordre d'exécution :** Faire toutes les modifications en une seule passe (événement par événement)

---

### Fichier : `src/config/balance.ts`

**Modifications (Audit 2 - Équilibrage) :**
- [ ] **IMPORTANT** : Modifier `dailyInterest: 3` → `dailyInterest: 3.5` (compromis recommandé)
- [ ] **IMPORTANT** : Modifier `goldMultiplier: 1.35` → `goldMultiplier: 1.25` (compromis recommandé)

**Ordre d'exécution :** Modifications simples, une seule passe

---

### Fichier : `src/store/gameStore.ts`

**Modifications (Audit 2 - Équilibrage) :**
- [ ] **CRITIQUE** : Modifier pénalité faim dans `startDay()` : `actionsRemaining: Math.max(2, state.actionsRemaining - 1)` → `actionsRemaining: Math.max(1, state.actionsRemaining - 2)`
- [ ] **OPTIONNEL** : Ajouter commentaire expliquant la pénalité faim

**Ordre d'exécution :** Modification dans fonction `startDay()`, ligne ~336

---

### Fichier : `src/screens/AubeScreen.tsx`

**Modifications (Audit 3 - UX) :**
- [ ] **CRITIQUE** : Déplacer le texte narratif ("Bourg-Creux...") en haut de l'écran (avant les infos économiques)
- [ ] **CRITIQUE** : Compacter les infos économiques (Dette, Or, Réputation) en une seule ligne horizontale
- [ ] **CRITIQUE** : Masquer `EndingProgress` et `DailyObjectives` dans un accordéon `<details>` avec label "Progression et objectifs"
- [ ] **IMPORTANT** : Augmenter la taille du texte narratif (0.85rem → 1.1rem mobile, 1.2rem desktop)
- [ ] **IMPORTANT** : Changer la couleur du texte narratif (#aaa → #ddd)

**Ordre d'exécution :** Réorganiser complètement le layout, une seule passe

---

### Fichier : `src/screens/MortenScreen.tsx`

**Modifications (Audit 3 - UX) :**
- [ ] **IMPORTANT** : Ajouter état `debtAnimation` avec `useState(false)`
- [ ] **IMPORTANT** : Ajouter état `showConfirmation` avec `useState(false)`
- [ ] **IMPORTANT** : Importer `motion` de `framer-motion` et `useScreenShake` hook
- [ ] **IMPORTANT** : Modifier `handleRepay` pour déclencher animation et screen shake
- [ ] **IMPORTANT** : Envelopper l'affichage de la dette avec `motion.div` et animation scale/color
- [ ] **IMPORTANT** : Afficher message de confirmation temporaire après remboursement

**Ordre d'exécution :** Ajouter imports, états, puis modifier fonction et JSX

---

### Fichier : `src/screens/CrepusculeScreen.tsx`

**Modifications (Audit 3 - UX) :**
- [ ] **CRITIQUE** : Corriger bug valeur dette hardcodée : `const newDebt = debt + 5` → utiliser `BALANCE_CONFIG.economy.dailyInterest`
- [ ] **IMPORTANT** : Ajouter `minHeight: isMobile ? '48px' : '44px'` aux boutons de choix du soir
- [ ] **IMPORTANT** : Augmenter `fontSize` de `0.9rem` → `isMobile ? '1rem' : '0.95rem'`
- [ ] **IMPORTANT** : Augmenter `gap` de `0.5rem` → `0.75rem` entre boutons
- [ ] **IMPORTANT** : Importer `useIsMobile` hook si pas déjà fait

**Ordre d'exécution :** Corriger bug d'abord, puis améliorer boutons

---

## 📊 RÉSUMÉ DES MODIFICATIONS

| Fichier | Modifications | Gravité | Source Audit |
|---------|---------------|---------|--------------|
| `eventPool.ts` | 6 modifications (flags + équilibrage) | Critique/Moyen | Audit 1 + 2 |
| `balance.ts` | 2 modifications (intérêts + multiplicateur) | Important | Audit 2 |
| `gameStore.ts` | 1 modification (pénalité faim) | Critique | Audit 2 |
| `AubeScreen.tsx` | 5 modifications (layout UX) | Critique | Audit 3 |
| `MortenScreen.tsx` | 6 modifications (feedback UX) | Important | Audit 3 |
| `CrepusculeScreen.tsx` | 5 modifications (boutons + bug) | Critique | Audit 3 |

**Total :** 25 modifications sur 6 fichiers

---

## ⚠️ POINTS D'ATTENTION

1. **Import de BALANCE_CONFIG** : Vérifier que `CrepusculeScreen.tsx` importe bien `BALANCE_CONFIG` pour corriger le bug
2. **Imports framer-motion** : Vérifier que `MortenScreen.tsx` a déjà `framer-motion` importé (utilisé ailleurs ?)
3. **Hook useIsMobile** : Vérifier que `CrepusculeScreen.tsx` importe `useIsMobile` (sinon l'ajouter)
4. **Hook useScreenShake** : Vérifier que `MortenScreen.tsx` peut utiliser `useScreenShake` (vérifier si hook existe)

---

## ✅ VALIDATION PRÉ-IMPLÉMENTATION

- [x] Tous les fichiers identifiés
- [x] Conflits détectés : AUCUN
- [x] Ordre d'exécution défini
- [x] Points d'attention listés

---

## 🚀 PROCHAINES ÉTAPES

**PHASE 1 TERMINÉE** ✅

**En attente de confirmation utilisateur pour PHASE 2 (Application du code)**
