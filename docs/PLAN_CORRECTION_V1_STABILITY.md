# PLAN DE CORRECTION V1 STABILITY
**Date :** 2024-12-XX  
**Objectif :** Corriger les 18 problèmes identifiés dans l'audit pour stabiliser la V1  
**Durée estimée :** 4-6 heures

---

## 📋 ANALYSE DES DÉPENDANCES

### ✅ CONFLITS IDENTIFIÉS ET RÉSOLUS

1. **Sticky Footer** : ✅ Déjà implémenté dans `EventScreen.tsx` et `CrepusculeScreen.tsx` - Pas de conflit
2. **HUD Compact** : ✅ Déjà implémenté dans `CompactHUD.tsx` - Pas de conflit
3. **recentMonologues** : ⚠️ Utilisé dans `CrepusculeScreen.tsx` et `monologueSelector.ts` - **DÉCISION : Garder mais documenter l'usage**
4. **combatsLost** : ⚠️ Utilisé dans UI (HallOfFame, DefeatScreen, etc.) - **DÉCISION : Incrémenter correctement au lieu de supprimer**
5. **carteRevelee** : ⚠️ Logique partielle dans `gameStore.ts:404` - **DÉCISION : Compléter la logique au lieu de supprimer**

---

## 🚨 P0 - CRITIQUE (GAMEPLAY & ÉCONOMIE)

### 1. Fichier : `src/config/balance.ts`

**Problème :** Dette incohérente (GDD dit 5💰, code fait 3.5💰)

- [ ] **Ligne 21** : Modifier `dailyInterest: 3.5` → `dailyInterest: 5`
- [ ] **Ligne 21** : Mettre à jour le commentaire : `// Intérêts quotidiens de la dette (selon GDD)`
- [ ] **Impact :** Recalculer toutes les références à la dette J20 (175💰 au lieu de 146.5💰)

**Dépendances :**
- `gameManager.ts` utilise cette valeur
- `CrepusculeScreen.tsx` affiche cette valeur
- `docs/gdd.md` doit être vérifié pour cohérence

---

### 2. Fichier : `src/store/gameStore.ts`

**Problème 1 :** Logement manquant (2💰/nuit non prélevé)

- [ ] **Ligne ~682-753** : Dans `endDay()`, AVANT `advanceDay()`, ajouter :
  ```typescript
  // Payer le logement (2💰/nuit obligatoire)
  const RENT_COST = 2
  if (state.gold >= RENT_COST) {
    newGold = state.gold - RENT_COST
  } else {
    // Option A : Permettre dette supplémentaire
    newDebt = state.debt + RENT_COST
    // OU Option B : Pénalité (réputation -1, actions -1 le jour suivant)
    // newReputation = Math.max(1, state.reputation - 1)
    // newActionsRemaining = Math.max(1, actionsRemaining - 1)
  }
  ```
- [ ] **Ligne ~705** : Passer `newGold` à `advanceDay()` ou mettre à jour le state avec la nouvelle valeur
- [ ] **Ajouter** : Variable `rentPaid: boolean` dans le state pour tracking (optionnel)

**Problème 2 :** Soft-lock Faim/Or (Or = 0 + Faim = 0 = Game Over)

- [ ] **Ligne ~327-341** : Dans `startDay()`, AVANT la pénalité de faim, ajouter :
  ```typescript
  // Mécanisme de secours : Si or = 0 et actions = 0, forcer 1 action minimale
  if (state.gold === 0 && state.actionsRemaining === 0 && !state.hasEatenToday) {
    // Option A : Forcer 1 action gratuite (mendicité)
    set({ actionsRemaining: 1 })
    // OU Option B : Permettre emprunt d'urgence à Morten (avec malus réputation)
    // set({ gold: 5, reputation: Math.max(1, state.reputation - 1) })
  }
  ```
- [ ] **Alternative** : Créer fonction `begForMoney()` qui donne 2-5💰 avec malus réputation -1

**Problème 3 :** Variables fantômes à nettoyer

- [ ] **Ligne 48** : `recentMonologues` - **DÉCISION : GARDER** (utilisé dans CrepusculeScreen)
- [ ] **Ligne 81** : `combatsLost` - **DÉCISION : INCRÉMENTER** au lieu de supprimer
  - [ ] **Ligne ~663** : Dans `finishEvent()`, si `combatResult.outcome === 'defeat'`, ajouter :
    ```typescript
    combatsLost: state.combatsLost + 1
    ```

**Problème 4 :** Flag `carteRevelee` logique incomplète

- [ ] **Ligne 404-421** : La logique existe déjà pour générer `cache_tresor` - **VÉRIFIER** qu'elle fonctionne
- [ ] **Si non fonctionnel** : Compléter la génération du lieu spécial
- [ ] **Si fonctionnel** : Documenter l'usage dans un commentaire

---

### 3. Fichier : `src/features/game/gameManager.ts`

**Problème :** Condition de victoire ambiguë (day >= 20)

- [ ] **Ligne 85-104** : Clarifier la logique `checkEndConditions()`
  - [ ] **Ligne 90** : Changer `if (day >= 20)` → `if (day > 20 || (day === 20 && debt <= 0))`
  - [ ] **OU** : Garder `>= 20` mais ajouter commentaire : `// Jour 20 inclus : vérification se fait APRÈS advanceDay(), donc au crépuscule du J20`
- [ ] **Ajouter** : Commentaire explicatif sur le timing de la vérification

**Problème :** Intérêts de dette avec système de sécurité

- [ ] **Ligne 67-71** : Vérifier que le système de sécurité (réduction à 2💰 si dette > 120 au J15+) est toujours valide avec intérêts à 5💰
- [ ] **Ajuster** : Si nécessaire, modifier le seuil (ex: dette > 150 au lieu de 120)

---

## 🧹 P1 - NETTOYAGE (VESTIGES)

### 4. Fichier : `src/store/gameStore.ts`

**Nettoyage des variables inutilisées :**

- [ ] **Ligne 48** : `recentMonologues` - **GARDER** (utilisé dans CrepusculeScreen.tsx:13,36,42,45)
- [ ] **Ligne 81** : `combatsLost` - **INCRÉMENTER** au lieu de supprimer (voir P0.2.3)
- [ ] **Vérifier** : Aucune autre variable inutilisée dans GameState

---

### 5. Fichier : `src/features/events/eventPool.ts`

**Flag carteRevelee :**

- [ ] **Ligne 172** : Vérifier que le flag est bien défini
- [ ] **Vérifier** : Que `gameStore.ts:404` utilise correctement ce flag
- [ ] **Si logique incomplète** : Compléter la génération du lieu `cache_tresor`
- [ ] **Documenter** : Ajouter commentaire expliquant l'usage du flag

---

## 📱 P2 - INTERFACE (UI & UX)

### 6. Fichier : `src/screens/EventScreen.tsx`

**Sticky Footer :** ✅ **DÉJÀ FAIT** - Vérifier que c'est correct

- [ ] **Vérifier** : Structure `position: relative` + `overflowY: auto` + `position: absolute` footer
- [ ] **Vérifier** : `paddingBottom: '140px'` dans la zone scrollable
- [ ] **Vérifier** : Dégradé de fond sur le footer (`linear-gradient`)

---

### 7. Fichier : `src/screens/CrepusculeScreen.tsx`

**Sticky Footer :** ✅ **DÉJÀ FAIT** - Vérifier que c'est correct

- [ ] **Vérifier** : Structure identique à EventScreen
- [ ] **Vérifier** : `paddingBottom: '100px'` dans la zone scrollable
- [ ] **Vérifier** : Footer avec dégradé et choix interactifs bien positionnés

---

### 8. Fichier : `src/components/CompactHUD.tsx`

**HUD Compact :** ✅ **DÉJÀ CRÉÉ** - Vérifier intégration

- [ ] **Vérifier** : Utilisé dans `MapScreen.tsx` et `AubeScreen.tsx`
- [ ] **Vérifier** : Hauteur max respectée (60px mobile / 64px desktop)
- [ ] **Vérifier** : Transparence et blur fonctionnent correctement

---

### 9. Fichier : `src/screens/CrepusculeScreen.tsx`

**Feedback visuel paiement loyer :**

- [ ] **Ajouter** : Message visuel si loyer payé (ex: "-2💰 Logement" dans le résumé)
- [ ] **Ajouter** : Message d'avertissement si loyer non payé (dette supplémentaire ou pénalité)
- [ ] **Intégrer** : Dans la section "Résumé du jour" ou "Dette avec animation"

---

## 📝 DOCUMENTATION

### 10. Fichier : `docs/gdd.md`

**Mise à jour cohérence :**

- [ ] **Ligne 493** : Vérifier que "+5💰/jour intérêts" est cohérent avec le code
- [ ] **Ligne 494** : Recalculer "Jour 20 minimum : 175💰" (80 + 5×19 = 175) ✅ Correct
- [ ] **Ligne 526** : Vérifier "Logement (obligatoire) : 2💰/nuit" est documenté

---

## 🔄 ORDRE D'IMPLÉMENTATION RECOMMANDÉ

### Phase 1 : Économie (Critique)
1. `balance.ts` - Corriger intérêts (5💰)
2. `gameStore.ts` - Implémenter logement
3. `gameManager.ts` - Ajuster système de sécurité si nécessaire

### Phase 2 : Anti-Soft-Lock
4. `gameStore.ts` - Ajouter mécanisme de secours (faim/or)

### Phase 3 : Nettoyage
5. `gameStore.ts` - Incrémenter `combatsLost` correctement
6. `eventPool.ts` - Vérifier/compléter `carteRevelee`

### Phase 4 : UI (Vérification)
7. `EventScreen.tsx` - Vérifier sticky footer
8. `CrepusculeScreen.tsx` - Vérifier sticky footer + ajouter feedback loyer
9. `CompactHUD.tsx` - Vérifier intégration

### Phase 5 : Documentation
10. `gdd.md` - Mettre à jour si nécessaire

---

## ⚠️ POINTS D'ATTENTION

1. **Répercussions économiques** : Passer de 3.5💰 à 5💰/jour augmente la difficulté. Vérifier l'équilibrage.
2. **Système de sécurité** : Le mécanisme de réduction d'intérêts (2💰 si dette > 120 au J15+) doit être réévalué avec intérêts à 5💰.
3. **Logement** : Décider entre Option A (dette supplémentaire) ou Option B (pénalité réputation/actions).
4. **Mécanisme de secours** : Décider entre Option A (1 action gratuite) ou Option B (emprunt Morten).
5. **Tests** : Tester une run complète (20 jours) après modifications pour vérifier l'équilibrage.

---

## ✅ CHECKLIST FINALE

- [ ] Tous les fichiers P0 modifiés
- [ ] Tous les fichiers P1 nettoyés
- [ ] Tous les fichiers P2 vérifiés
- [ ] Documentation à jour
- [ ] Test run complète (20 jours)
- [ ] Vérification équilibrage économique
- [ ] Aucune régression introduite

---

**Fin du Plan de Correction V1 Stability**
