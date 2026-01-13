# AUDIT DE COHÉRENCE NARRATIVE - RAPPORT D'ANALYSE

**Date :** 2024  
**Fichiers analysés :**
- `src/features/events/eventPool.ts`
- `src/features/narrative/characterArcs.ts`
- `src/store/gameStore.ts`
- `src/features/events/eventManager.ts`
- `src/features/events/eventResolver.ts`

---

## INCOHÉRENCES DÉTECTÉES

| Fichier/ID Event | Incohérence Détectée | Gravité | Fix Suggéré |
|------------------|----------------------|---------|-------------|
| `eventPool.ts` / `convoi` | Flag `convoiDone` vérifié dans `triggerCondition` mais jamais mis à `true` dans les conséquences. L'événement ne peut jamais se déclencher après le premier jour 4-6. | **Critique** | Ajouter `flags: { convoiDone: true }` dans au moins un choix (ex: `embuscade` ou `prevenir`) |
| `eventPool.ts` / `marchand` | Flag `marchandMet` vérifié dans `triggerCondition` mais jamais mis à `true` dans les conséquences. L'événement peut se déclencher plusieurs fois malgré `oneTime: true`. | **Critique** | Ajouter `flags: { marchandMet: true }` dans tous les choix (ou au moins dans `decliner` et `denoncer`) |
| `eventPool.ts` / `collecteurs` | Événement peut se répéter indéfiniment tous les 3 jours si `debt > 100` persiste, même après avoir payé plusieurs fois. Peut être frustrant pour le joueur. | **Moyenne** | Ajouter un flag `collecteursPaid` après paiement, ou modifier la condition pour `debt > 100 && !state.npcFlags.collecteursPaid` |
| `eventPool.ts` / `collecteurs` / choix `resister` | Le texte dit "C'était dur, mais tu as gagné" mais il n'y a pas de gain d'or, seulement perte de durabilité et réduction de dette. Cohérent mais pourrait être plus clair. | **Faible** | Le texte est cohérent, mais on pourrait ajouter un commentaire dans le code pour clarifier l'intention |
| `eventPool.ts` / `peste` | Le flag `pesteActive` est bien mis à `true`, mais si l'événement se déclenche et que le joueur ferme sans choisir, le flag ne sera pas mis. Cependant, l'événement nécessite un choix, donc ce cas est peu probable. | **Très Faible** | Aucun fix nécessaire (cas edge très rare) |
| `eventPool.ts` / `refugies` | Événement peut se répéter indéfiniment avec 15% de chance à chaque exploration (avec cooldown de 3 jours). Peut être trop fréquent et casser l'immersion. | **Moyenne** | Ajouter un flag `refugiesHelped` après avoir aidé, ou réduire la probabilité à 10%, ou ajouter un maximum de déclenchements (ex: max 3 fois) |
| `eventPool.ts` / `refugies` / choix `voler` | Le texte dit "L'or est dans ta poche" et l'or est bien donné (5-15💰). Cohérent. | **Aucune** | Aucun problème détecté |
| `eventPool.ts` / `convoi` / choix `embuscade` | Le texte dit "L'or est dans ta poche" et l'or est bien donné (30-50💰). Cohérent. | **Aucune** | Aucun problème détecté |
| `eventPool.ts` / `marchand` / choix `carte` | Le texte dit "Elle révèle un lieu riche" et le flag `carteRevelee` est bien mis à `true`. Cohérent. | **Aucune** | Aucun problème détecté |

---

## ANALYSE PAR CATÉGORIE

### 1. BOUCLES INFINIES

**Problèmes détectés :**
- ✅ `convoi` : `oneTime: true` - Pas de boucle
- ⚠️ `collecteurs` : `oneTime: false` avec cooldown, mais peut se répéter si dette reste > 100
- ✅ `peste` : `oneTime: false` mais flag `pesteActive` empêche la répétition
- ✅ `marchand` : `oneTime: true` - Pas de boucle (mais bug avec flag)
- ⚠️ `refugies` : `oneTime: false` avec cooldown, peut se répéter indéfiniment

**Recommandations :**
- Ajouter des flags pour limiter la répétition des événements non-oneTime
- Ou réduire les probabilités de déclenchement après le premier

### 2. CONDITIONS FANTÔMES

**Analyse :**
- ✅ Les requirements sont **bien vérifiés** dans `isChoiceAvailable()` (eventResolver.ts)
- ✅ Les choix avec `requirements.gold` sont correctement désactivés si l'or est insuffisant
- ✅ Les choix avec `requirements.reputation` sont correctement désactivés si la réputation est insuffisante
- ✅ Les choix avec `requirements.item` vérifient bien l'inventaire et l'équipement

**Conclusion :** Aucun problème détecté dans cette catégorie.

### 3. CONFLITS D'ÉTAT PNJ

**Analyse :**
- ⚠️ L'événement `collecteurs` mentionne "Deux hommes de Morten", mais il n'y a pas de vérification si Morten est mort
- ❓ Aucun flag `morten_dead` n'a été trouvé dans le code
- ⚠️ Si un système de mort de Morten est ajouté plus tard, l'événement `collecteurs` devrait vérifier `!state.npcFlags.morten_dead`

**Recommandations :**
- Si un système de mort de Morten est prévu, ajouter la vérification dans `triggerCondition` de `collecteurs`
- Ou modifier le texte pour ne pas mentionner Morten directement

### 4. TEXTE VS DATA

**Analyse détaillée :**

| Événement | Choix | Texte | Data | Cohérence |
|-----------|-------|-------|------|-----------|
| `convoi` | `embuscade` | "L'or est dans ta poche" | `gold: 30-50` | ✅ OK |
| `convoi` | `prevenir` | "Ta réputation s'améliore" | `reputation: 1` | ✅ OK |
| `collecteurs` | `payer` | "Ils partent" | Pas de promesse | ✅ OK |
| `collecteurs` | `resister` | "Tu as gagné" | `debt: -30` | ✅ OK (gagne = réduction dette) |
| `peste` | `eviter` | "Moins de lieux à explorer" | `actionsRemaining: -1` | ✅ OK |
| `marchand` | `carte` | "Elle révèle un lieu riche" | `flags: { carteRevelee: true }` | ✅ OK |
| `refugies` | `voler` | "L'or est dans ta poche" | `gold: 5-15` | ✅ OK |
| `refugies` | `donner_or` | "Tu as fait une bonne action" | `counters: { humanite: 4 }` | ✅ OK |

**Conclusion :** Tous les textes narratifs sont cohérents avec les conséquences données.

---

## PROBLÈMES CRITIQUES À CORRIGER EN PRIORITÉ

### 1. Flag `convoiDone` jamais mis à `true`

**Fichier :** `src/features/events/eventPool.ts`  
**Ligne :** 13

**Problème :** La condition vérifie `!state.npcFlags.convoiDone`, mais ce flag n'est jamais mis à `true` dans les conséquences.

**Fix :**
```typescript
// Dans le choix 'embuscade' ou 'prevenir', ajouter :
flags: { convoiDone: true }
```

### 2. Flag `marchandMet` jamais mis à `true`

**Fichier :** `src/features/events/eventPool.ts`  
**Ligne :** 141

**Problème :** La condition vérifie `!state.npcFlags.marchandMet`, mais ce flag n'est jamais mis à `true` dans les conséquences. Même si `oneTime: true`, le système de flag devrait être cohérent.

**Fix :**
```typescript
// Dans tous les choix, ajouter :
flags: { marchandMet: true }
```

---

## RECOMMANDATIONS GÉNÉRALES

1. **Système de flags cohérent :** Tous les flags vérifiés dans `triggerCondition` devraient être mis à `true` dans au moins un choix.

2. **Limitation des répétitions :** Pour les événements non-oneTime, considérer ajouter des flags ou des compteurs pour limiter la répétition excessive.

3. **Documentation :** Ajouter des commentaires dans le code pour expliquer l'intention des flags et des conditions.

4. **Tests :** Ajouter des tests unitaires pour vérifier que les flags sont correctement mis à jour après les choix.

---

## CONCLUSION

**Incohérences critiques :** 2  
**Incohérences moyennes :** 2  
**Incohérences faibles :** 1  
**Aucun problème :** 4 vérifications

Les problèmes les plus critiques concernent les flags qui ne sont jamais mis à jour, ce qui peut empêcher certains événements de se déclencher ou permettre des répétitions non désirées.
