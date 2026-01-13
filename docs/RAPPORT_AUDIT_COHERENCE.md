# RAPPORT DE VÉRITÉ - AUDIT DE COHÉRENCE
**Date :** 2024-12-XX  
**Auditeur :** Lead Game Designer & Product Owner  
**Mission :** Vérification cohérence DOCS vs CODE vs LOGIQUE après pivot Narrative-First

---

## 📊 RÉSUMÉ EXÉCUTIF

**Total problèmes détectés :** 18  
- 🔴 **MANQUANT** : 4  
- ⚠️ **LOGIQUE** : 6  
- 👻 **VESTIGE** : 3  
- 🟢 **OK** : 5 (systèmes fonctionnels)

---

## 🔴 MANQUANT - Fonctionnalités Promises mais Absentes

| Type | Description du Problème | Fichier/Système | Action Recommandée |
|------|------------------------|-----------------|-------------------|
| 🔴 MANQUANT | **Système de Logement** : Le GDD promet 2💰/nuit obligatoire, mais aucune déduction automatique dans le code. Mentionné dans `TaverneScreen.tsx` mais non fonctionnel. | `gameStore.ts`, `gameManager.ts` | **Coder** : Ajouter déduction automatique de 2💰 au crépuscule OU au début de chaque jour. |
| 🔴 MANQUANT | **Système de Maladies** : Le GDD mentionne "La Peste" (événement) mais pas de système de maladie persistant. L'événement `peste` existe mais ne cause pas de maladie récurrente (-1 action pendant 2 jours comme promis). | `eventPool.ts`, `gameStore.ts` | **Coder** : Ajouter flag `diseaseActive: number` (jours restants) qui réduit actions pendant X jours. |
| 🔴 MANQUANT | **Tutorial Jour 0** : Le GDD promet un tutorial de 90 secondes avec séquences "LA FUITE", "L'ARRIVÉE", "ÉQUIPEMENT", "PREMIÈRE EXPLORATION". Le code a `TutorialScreen.tsx` mais pas de séquence complète. | `TutorialScreen.tsx` | **Coder** : Implémenter les 4 séquences du GDD avec timing précis. |
| 🔴 MANQUANT | **Système de Commerce séparé** : Le GDD mentionne "Commerce" comme système distinct, mais le code n'a que "Marché" (MarcheScreen). Pas de distinction Commerce vs Marché. | `gdd.md` | **Supprimer du GDD** (Scope Cut) OU **Coder** un système de commerce itinérant distinct. |

---

## ⚠️ LOGIQUE - Incohérences Systémiques

| Type | Description du Problème | Fichier/Système | Action Recommandée |
|------|------------------------|-----------------|-------------------|
| ⚠️ LOGIQUE | **Condition de Victoire** : Le GDD dit "Tu as 20 jours" et `checkEndConditions()` vérifie bien `day >= 20`, mais la condition est `>=` donc le jour 20 est inclus. **OK** mais ambigu. | `gameManager.ts:90` | **Clarifier** : Le jour 20 est le dernier jour jouable. La vérification se fait APRÈS `advanceDay()`, donc au crépuscule du J20. |
| ⚠️ LOGIQUE | **Système de Faim** : Pénalité de -2 actions si pas mangé, mais le repas coûte 4💰. Si le joueur n'a pas d'or pendant 3 jours, il perd 6 actions totales. Risque de soft-lock si or = 0 et aucune source de revenus. | `gameStore.ts:333-338`, `gameStore.ts:976-999` | **Réduire** pénalité à -1 action OU **ajouter** source d'or minimale garantie (ex: 2💰/jour minimum en exploration). |
| ⚠️ LOGIQUE | **Impasse Économique** : Si or = 0, dette > 0, et aucune action disponible (faim), le joueur est bloqué. Pas de mécanisme de "prêt d'urgence" ou "aide minimale". | `gameStore.ts` | **Ajouter** : Si or = 0 et actions = 0, forcer 1 action minimale OU permettre emprunt à Morten (avec malus). |
| ⚠️ LOGIQUE | **Incohérence Temporelle** : L'événement `convoi` se déclenche J4-6, mais rien n'empêche un événement de J1 d'apparaître au J19 (ex: `refugies` peut se déclencher n'importe quand). | `eventPool.ts` | **Ajouter** : Restrictions temporelles plus strictes pour événements narratifs selon leur contexte. |
| ⚠️ LOGIQUE | **Intérêts de Dette** : Le GDD promet +5💰/jour, mais le code utilise `BALANCE_CONFIG.economy.dailyInterest = 3.5`. Incohérence entre docs et code. | `config/balance.ts:21`, `gdd.md:493` | **Harmoniser** : Soit mettre 5💰 dans le code, soit mettre 3.5💰 dans le GDD. |
| ⚠️ LOGIQUE | **Dette Jour 20** : Le GDD dit "Jour 20 minimum : 175💰" (80 + 5×19 = 175), mais avec intérêts à 3.5, c'est 80 + 3.5×19 = 146.5💰. Incohérence. | `gdd.md:494`, `config/balance.ts` | **Recalculer** : Si intérêts = 3.5, alors J20 = 146.5💰. Mettre à jour GDD. |

---

## 👻 VESTIGE - Code Fantôme / Variables Inutilisées

| Type | Description du Problème | Fichier/Système | Action Recommandée |
|------|------------------------|-----------------|-------------------|
| 👻 VESTIGE | **Variable `recentMonologues`** : Existe dans `GameState` mais jamais utilisée dans le code. Aucune logique de suivi des monologues récents. | `gameStore.ts:48` | **Supprimer** (Nettoyage) OU **Implémenter** : Utiliser pour éviter répétitions de monologues. |
| 👻 VESTIGE | **Flag `carteRevelee`** : Peut être défini par événement `marchand`, mais aucune logique ne l'utilise pour révéler un lieu spécial. Mentionné dans `PLAN_FONCTIONNALITES_INCOMPLETES.md` comme "non utilisé". | `eventPool.ts:172`, `gameStore.ts:404-421` | **Implémenter** : Utiliser le flag pour ajouter lieu `cache_tresor` à l'exploration (déjà partiellement codé ligne 404-421). |
| 👻 VESTIGE | **Variable `combatsLost`** : Existe dans `GameState` mais jamais incrémentée. La défaite en combat passe directement à `phase: 'defeat'` sans compteur. | `gameStore.ts:81` | **Supprimer** (Nettoyage) OU **Implémenter** : Incrémenter lors de défaite pour statistiques. |

---

## 🟢 OK - Systèmes Fonctionnels

| Type | Description du Problème | Fichier/Système | Action Recommandée |
|------|------------------------|-----------------|-------------------|
| 🟢 OK | **Système de Dette** : Fonctionne comme prévu. Intérêts quotidiens, remboursement, vérification J20. | `gameStore.ts`, `gameManager.ts` | R.A.S. |
| 🟢 OK | **Système de Combat** : Auto-résolu, probabilités selon risque, résultats cohérents. | `combat.logic.ts` | R.A.S. |
| 🟢 OK | **Système d'Équipement** : 7 slots, stats calculées, durabilité, raretés. Fonctionnel. | `gameStore.ts`, `stats.ts` | R.A.S. |
| 🟢 OK | **Système de Réputation** : 1-5⭐, modifie prix achat/vente. Fonctionnel. | `priceCalculation.ts` | R.A.S. |
| 🟢 OK | **Arcs Narratifs Personnages** : Morten a un arc complet avec stages, trustLevel. Fonctionnel. | `characterArcs.ts` | R.A.S. |

---

## 🔍 ANALYSE DÉTAILLÉE PAR SYSTÈME

### 1. SYSTÈME DE FAIM (⚠️ LOGIQUE)

**Problème :**
- Pénalité : -2 actions si `hasEatenToday === false` au début du jour
- Coût repas : 4💰
- Risque : Si or = 0 pendant 3 jours → -6 actions totales → soft-lock possible

**Simulation :**
```
Jour 1 : Or = 0, pas de repas → J2 : -2 actions (1 action restante)
Jour 2 : Or = 0, pas de repas → J3 : -2 actions (1 action restante)
Jour 3 : Or = 0, pas de repas → J4 : -2 actions (1 action restante)
→ Si aucune source d'or garantie, le joueur peut être bloqué
```

**Recommandation :**
- Option A : Réduire pénalité à -1 action (plus tolérant)
- Option B : Garantir 2-5💰 minimum par exploration (même si échec)
- Option C : Permettre emprunt d'urgence à Morten (avec malus réputation)

---

### 2. SYSTÈME DE LOGEMENT (🔴 MANQUANT)

**Promesse GDD :**
- "Logement (obligatoire) : 2💰/nuit"
- Mentionné dans `TaverneScreen.tsx:361` mais non fonctionnel

**Code actuel :**
- Aucune déduction automatique
- Aucune vérification si or < 2💰

**Recommandation :**
```typescript
// Dans gameManager.advanceDay() ou endDay()
if (state.gold >= 2) {
  newGold = state.gold - 2
} else {
  // Option A : Permettre dette supplémentaire
  // Option B : Pénalité (réputation -1, actions -1)
  // Option C : Forcer emprunt à Morten
}
```

---

### 3. SYSTÈME DE MALADIES (🔴 MANQUANT)

**Promesse GDD :**
- Événement "La Peste" : "Risque maladie (-1 action pendant 2 jours)"

**Code actuel :**
- Événement `peste` existe mais flag `pesteActive` ne cause pas de pénalité récurrente
- Pas de système de maladie persistant

**Recommandation :**
```typescript
// Ajouter au GameState
diseaseActive: number // Jours restants de maladie (0 = sain)

// Dans startDay()
if (state.diseaseActive > 0) {
  actionsRemaining = Math.max(1, actionsRemaining - 1)
  diseaseActive = state.diseaseActive - 1
}
```

---

### 4. INCOHÉRENCE INTÉRÊTS DETTE (⚠️ LOGIQUE)

**GDD promet :**
- "+5💰/jour intérêts"
- "Jour 20 minimum : 175💰" (80 + 5×19 = 175)

**Code actuel :**
- `dailyInterest: 3.5`
- J20 = 80 + 3.5×19 = 146.5💰

**Impact :**
- Le joueur a besoin de 28.5💰 de moins que promis
- Soit le jeu est plus facile (bon), soit la promesse est fausse (mauvais)

**Recommandation :**
- **Option A** : Mettre 5💰 dans le code (plus dur, comme promis)
- **Option B** : Mettre 3.5💰 dans le GDD (plus facile, ajustement d'équilibrage)

---

### 5. ÉVÉNEMENTS TEMPORELS (⚠️ LOGIQUE)

**Problème :**
- `convoi` : J4-6 uniquement ✅
- `collecteurs` : J12+ uniquement ✅
- `refugies` : N'importe quand (15% chance) ⚠️
- `marchand` : J7-15 uniquement ✅

**Incohérence :**
- Un événement de "rencontre avec réfugiés" peut arriver au J19, ce qui est narrativement étrange (pourquoi maintenant ?)

**Recommandation :**
- Ajouter fenêtre temporelle : `refugies` uniquement J3-15
- OU ajouter condition narrative : "Si humanité >= 3" pour déclencher plus tard

---

## 📋 CHECKLIST DE CORRECTION PRIORITAIRE

### PRIORITÉ CRITIQUE (Bloque l'expérience)
- [ ] **Logement** : Implémenter déduction 2💰/nuit
- [ ] **Intérêts** : Harmoniser GDD vs Code (5💰 ou 3.5💰)
- [ ] **Faim** : Réduire pénalité OU garantir or minimum

### PRIORITÉ HAUTE (Impact significatif)
- [ ] **Maladies** : Implémenter système persistant
- [ ] **Tutorial** : Compléter séquence Jour 0
- [ ] **Événements temporels** : Ajouter restrictions

### PRIORITÉ MOYENNE (Polish)
- [ ] **Vestiges** : Nettoyer variables inutilisées
- [ ] **Carte révélée** : Finaliser implémentation

---

## 🎯 RÉPONSE À LA QUESTION FINALE

### "Parmi les éléments MANQUANTS (🔴), lesquels sont indispensables pour la V1 selon toi ?"

**INDISPENSABLES :**
1. **Système de Logement (2💰/nuit)** ⭐⭐⭐
   - **Pourquoi :** Mentionné partout (GDD, UI, règles). Les joueurs s'attendent à cette dépense.
   - **Impact :** Sans ça, l'économie est déséquilibrée (trop facile).
   - **Effort :** Faible (1-2h de code)

2. **Harmonisation Intérêts Dette** ⭐⭐⭐
   - **Pourquoi :** Incohérence majeure entre promesse (5💰) et réalité (3.5💰).
   - **Impact :** Confusion joueur, équilibrage incorrect.
   - **Effort :** Très faible (changer 1 valeur OU 1 ligne GDD)

**SOUHAITABLES (mais pas bloquants) :**
3. **Système de Maladies persistant** ⭐⭐
   - **Pourquoi :** L'événement existe mais l'effet promis (-1 action/2 jours) n'est pas implémenté.
   - **Impact :** Expérience narrative incomplète.
   - **Effort :** Moyen (2-3h de code)

4. **Tutorial Jour 0 complet** ⭐
   - **Pourquoi :** Promis dans GDD mais partiellement implémenté.
   - **Impact :** Onboarding moins immersif.
   - **Effort :** Élevé (1-2 jours de travail)

**PEUVENT ATTENDRE :**
5. **Système de Commerce séparé** ⭐
   - **Pourquoi :** Mentionné vaguement dans GDD, pas clair si distinct du Marché.
   - **Impact :** Faible (le Marché existe déjà).
   - **Effort :** Élevé (nouveau système complet)

---

## 📊 STATISTIQUES FINALES

| Catégorie | Nombre | Gravité Moyenne |
|-----------|--------|-----------------|
| 🔴 MANQUANT | 4 | Critique |
| ⚠️ LOGIQUE | 6 | Moyenne-Haute |
| 👻 VESTIGE | 3 | Faible |
| 🟢 OK | 5 | - |
| **TOTAL** | **18** | - |

**Taux de cohérence :** ~72% (13/18 problèmes détectés)

---

**Fin du Rapport de Vérité**  
*"La vérité fait mal, mais elle libère."*
