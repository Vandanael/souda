# Plan d'Implémentation - Fonctionnalités Incomplètes

**Date :** 2024  
**Objectif :** Finaliser toutes les fonctionnalités partiellement implémentées

---

## 📋 Vue d'Ensemble

### Priorités
1. **🔴 Critique** - Bloque l'expérience de jeu
2. **🟠 Important** - Impact significatif sur le gameplay
3. **🟡 Moyen** - Améliore l'expérience mais non bloquant
4. **🟢 Faible** - Polish et améliorations UX

---

## 1. 🔴 SYSTÈME DE RUMEURS - Déclenchement d'Objets/Lieux

### Problème
Les rumeurs sont générées et affichées mais n'ont aucun impact sur le gameplay. Le champ `hintType` existe mais n'est pas utilisé.

### Objectif
Les rumeurs doivent influencer :
- La génération de lieux (probabilités, types)
- Les événements rencontrés (combat, loot, événements spéciaux)
- Les récompenses (meilleur loot pour rumeurs 'loot')

### Étapes d'Implémentation

#### Phase 1 : Structure de données
- [ ] **Fichier :** `src/types/rumor.ts` (créer)
  - Définir interface `Rumor` avec `hintType` obligatoire
  - Ajouter `targetLocationType?: LocationType` pour rumeurs spécifiques
  - Ajouter `targetLocationId?: string` pour rumeurs pointant vers un lieu précis

#### Phase 2 : Génération de rumeurs liées aux lieux
- [ ] **Fichier :** `src/features/taverne/rumors.logic.ts`
  - Modifier `generateDailyRumors()` pour lier certaines rumeurs aux lieux du jour
  - Ajouter logique : si rumeur `hintType: 'loot'` → augmenter `richness` d'un lieu aléatoire
  - Si rumeur `hintType: 'combat'` → augmenter `risk` d'un lieu aléatoire
  - Si rumeur `hintType: 'location'` → pointer vers un lieu spécifique

#### Phase 3 : Intégration dans l'exploration
- [ ] **Fichier :** `src/features/exploration/exploration.logic.ts`
  - Modifier `resolveExploration()` pour accepter un paramètre `activeRumors: Rumor[]`
  - Si rumeur `'loot'` active pour ce lieu → augmenter probabilité d'événement `'loot'` de 40% à 60%
  - Si rumeur `'combat'` active → augmenter probabilité `'combat'` de 30% à 50%
  - Si rumeur `'event'` active → forcer événement `'choice'` avec choix spéciaux

#### Phase 4 : Amélioration du loot selon rumeurs
- [ ] **Fichier :** `src/features/loot/loot.logic.ts`
  - Modifier `generateLoot()` pour accepter `rumorBonus?: boolean`
  - Si `rumorBonus === true` → augmenter probabilités rares/légendaires de 50%
  - Exemple : `rare: 0.12 → 0.18`, `legendary: 0.03 → 0.045`

#### Phase 5 : Passage des rumeurs au store
- [ ] **Fichier :** `src/store/gameStore.ts`
  - Modifier `exploreLocation()` pour passer les rumeurs actives à `resolveExploration()`
  - Filtrer rumeurs actives : celles du jour actuel ou des 2 jours précédents
  - Passer rumeurs pertinentes selon le type de lieu exploré

#### Phase 6 : Affichage visuel
- [ ] **Fichier :** `src/screens/TaverneScreen.tsx`
  - Afficher icône selon `hintType` (⚔️ combat, 💰 loot, ⚠️ event, 📍 location)
  - Ajouter tooltip expliquant l'effet de la rumeur

- [ ] **Fichier :** `src/screens/ExplorationScreen.tsx` ou `MapScreen.tsx`
  - Afficher indicateur visuel si un lieu a une rumeur active
  - Badge "💬" sur les lieux avec rumeurs

### Fichiers à Modifier
- `src/types/rumor.ts` (créer)
- `src/features/taverne/rumors.logic.ts`
- `src/features/exploration/exploration.logic.ts`
- `src/features/loot/loot.logic.ts`
- `src/store/gameStore.ts`
- `src/screens/TaverneScreen.tsx`
- `src/screens/ExplorationScreen.tsx` ou `MapScreen.tsx`

### Tests
- [ ] Rumeur 'loot' augmente bien les chances de loot
- [ ] Rumeur 'combat' augmente bien les chances de combat
- [ ] Rumeur 'event' déclenche bien un événement spécial
- [ ] Rumeurs expirées ne sont plus actives après 3 jours

---

## 2. 🔴 LIEUX - Persistance et Valeurs Fixes

### Problème
Les lieux sont régénérés chaque jour avec des `risk`/`richness` différents, créant des incohérences. Un même type de lieu peut avoir des valeurs différentes.

### Objectif
Implémenter un système de lieux persistants avec valeurs fixes, ou un système de seed cohérent.

### Étapes d'Implémentation

#### Option A : Lieux persistants (recommandé)
- [ ] **Fichier :** `src/types/location.ts`
  - Ajouter `explored: boolean` à l'interface `Location`
  - Ajouter `firstSeenDay: number` pour tracking
  - Ajouter `explorationCount: number` pour revisites

- [ ] **Fichier :** `src/store/gameStore.ts`
  - Ajouter `persistentLocations: Location[]` au state
  - Modifier `goToExploration()` pour :
    - Générer 5 nouveaux lieux si `persistentLocations.length < 5`
    - Sinon, réutiliser les lieux existants non explorés
    - Mélanger les lieux explorés/non explorés pour variété

- [ ] **Fichier :** `src/features/exploration/exploration.logic.ts`
  - Modifier `generateDailyLocations()` pour accepter `existingLocations?: Location[]`
  - Si lieux existants fournis, les réutiliser avec `risk`/`richness` fixes
  - Sinon, générer nouveaux lieux avec seed basé sur le jour

- [ ] **Fichier :** `src/store/gameStore.ts` - `exploreLocation()`
  - Marquer lieu comme `explored: true` après exploration
  - Incrémenter `explorationCount`
  - Si revisite : récompenses réduites (50% or/loot)

#### Option B : Seed cohérent (alternative)
- [ ] **Fichier :** `src/features/exploration/exploration.logic.ts`
  - Modifier `generateDailyLocations()` pour utiliser seed basé sur `day`
  - Même seed = mêmes lieux avec mêmes valeurs
  - Permet de "mémoriser" les lieux sans persistance

### Fichiers à Modifier
- `src/types/location.ts`
- `src/store/gameStore.ts`
- `src/features/exploration/exploration.logic.ts`

### Tests
- [ ] Un lieu garde les mêmes `risk`/`richness` entre les jours
- [ ] Les lieux explorés peuvent être revisités avec récompenses réduites
- [ ] Nouveaux lieux sont générés quand tous sont explorés

---

## 3. 🟠 SYSTÈME NARRATIF - Déclenchement Complet

### Problème
Seul l'événement `'refugies'` est déclenché. Les autres événements (`convoi`, `collecteurs`, `peste`, `marchand`) ne sont jamais vérifiés.

### Objectif
Implémenter un système de vérification automatique des événements narratifs aux moments appropriés.

### Étapes d'Implémentation

#### Phase 1 : Système de vérification centralisé
- [ ] **Fichier :** `src/features/events/eventManager.ts` (créer)
  - Créer classe `EventManager` avec méthode `checkEvents(state: GameState, phase: GamePhase)`
  - Vérifier tous les événements éligibles selon la phase :
    - `'aube'` : événements de début de jour (convoi, marchand)
    - `'exploration'` : événements pendant exploration (refugies)
    - `'crepuscule'` : événements de fin de jour (collecteurs, peste)
    - `'taverne'` : événements à la taverne (marchand)

#### Phase 2 : Intégration dans les phases
- [ ] **Fichier :** `src/store/gameStore.ts`
  - Modifier `startDay()` pour vérifier événements de l'aube
  - Modifier `goToExploration()` pour vérifier événements d'exploration (déjà fait partiellement)
  - Modifier `endDay()` pour vérifier événements du crépuscule
  - Modifier `setPhase('taverne')` pour vérifier événements de taverne

#### Phase 3 : Probabilités et cooldowns
- [ ] **Fichier :** `src/features/events/eventManager.ts`
  - Ajouter système de probabilités par événement
  - Ajouter cooldown entre déclenchements du même événement (sauf one-time)
  - Éviter spam d'événements : max 1 événement narratif par phase

#### Phase 4 : Priorisation des événements
- [ ] **Fichier :** `src/features/events/eventResolver.ts`
  - Modifier `findEligibleEvent()` pour accepter priorité
  - Événements `oneTime: true` ont priorité sur événements répétables
  - Événements avec conditions strictes (jour, dette) ont priorité

### Fichiers à Modifier
- `src/features/events/eventManager.ts` (créer)
- `src/store/gameStore.ts`
- `src/features/events/eventResolver.ts`

### Tests
- [ ] Événement 'convoi' se déclenche entre jour 4-6
- [ ] Événement 'collecteurs' se déclenche si dette > 100 après jour 12
- [ ] Événement 'peste' peut se déclencher après jour 10
- [ ] Événement 'marchand' peut se déclencher à la taverne
- [ ] Un seul événement narratif par phase maximum

---

## 4. 🟡 SYSTÈME MORAL - Repas à la Taverne

### Problème
Le bouton "Repas (5💰)" existe mais est désactivé avec message "Système moral à implémenter".

### Objectif
Implémenter l'achat de repas avec impact sur les compteurs narratifs et peut-être la santé.

### Étapes d'Implémentation

#### Phase 1 : Action d'achat
- [ ] **Fichier :** `src/store/gameStore.ts`
  - Ajouter action `buyMeal(): boolean`
  - Vérifier que le joueur a 5💰
  - Déduire 5💰
  - Incrémenter compteur `humanite: +1` (geste de prendre soin de soi)

#### Phase 2 : Effets du repas
- [ ] **Fichier :** `src/store/gameStore.ts`
  - Ajouter flag `hasEatenToday: boolean` au state
  - Si `hasEatenToday === false` au crépuscule :
    - Réduire actions du jour suivant de 1 (fatigue)
    - Ou réduire stats temporairement
  - Réinitialiser `hasEatenToday` chaque jour

#### Phase 3 : UI
- [ ] **Fichier :** `src/screens/TaverneScreen.tsx`
  - Activer le bouton "Repas (5💰)"
  - Appeler `buyMeal()` au clic
  - Afficher message de confirmation
  - Désactiver le bouton si déjà mangé aujourd'hui ou or insuffisant

#### Phase 4 : Feedback visuel (optionnel)
- [ ] **Fichier :** `src/screens/CrepusculeScreen.tsx`
  - Afficher message si le joueur n'a pas mangé aujourd'hui
  - Avertissement : "Tu as faim. Tu seras moins efficace demain."

### Fichiers à Modifier
- `src/store/gameStore.ts`
- `src/screens/TaverneScreen.tsx`
- `src/screens/CrepusculeScreen.tsx` (optionnel)

### Tests
- [ ] Achat de repas déduit 5💰
- [ ] Compteur humanité augmente de 1
- [ ] Bouton désactivé si déjà mangé ou or insuffisant
- [ ] Pas de repas = pénalité le jour suivant

---

## 5. 🟡 CARTE RÉVÉLÉE - Flag Non Utilisé

### Problème
Le flag `carteRevelee` peut être défini par l'événement "Marchand Mystérieux", mais rien ne se passe.

### Objectif
Révéler un lieu spécial riche ou modifier la génération de lieux.

### Étapes d'Implémentation

#### Phase 1 : Lieu spécial
- [ ] **Fichier :** `src/types/location.ts`
  - Ajouter type `'cache_tresor'` à `LocationType`
  - Configurer dans `LOCATION_TYPES` :
    - `riskRange: [3, 4]`
    - `richness: 5` (au-dessus de la normale)
    - `frequency: 0` (ne peut pas être généré normalement)

#### Phase 2 : Génération conditionnelle
- [ ] **Fichier :** `src/features/exploration/exploration.logic.ts`
  - Modifier `generateDailyLocations()` pour accepter `hasRevealedMap: boolean`
  - Si `hasRevealedMap === true` :
    - Remplacer un lieu aléatoire par `'cache_tresor'`
    - Ou ajouter un 6ème lieu spécial

#### Phase 3 : Intégration
- [ ] **Fichier :** `src/store/gameStore.ts`
  - Modifier `goToExploration()` pour vérifier `npcFlags.carteRevelee`
  - Passer flag à `generateDailyLocations()`
  - Réinitialiser flag après utilisation (ou garder permanent)

#### Phase 4 : Affichage
- [ ] **Fichier :** `src/screens/ExplorationScreen.tsx` ou `MapScreen.tsx`
  - Afficher lieu spécial avec icône différente (🗺️)
  - Tooltip : "Lieu révélé par la carte"

### Fichiers à Modifier
- `src/types/location.ts`
- `src/features/exploration/exploration.logic.ts`
- `src/store/gameStore.ts`
- `src/screens/ExplorationScreen.tsx` ou `MapScreen.tsx`

### Tests
- [ ] Achat de carte définit `carteRevelee: true`
- [ ] Lieu spécial apparaît dans la liste des lieux
- [ ] Lieu spécial a richesse élevée (5)
- [ ] Lieu spécial peut être exploré normalement

---

## 6. 🟡 OBJETS MAUDITS - Items Spéciaux

### Problème
L'événement "Marchand Mystérieux" peut donner `items: ['cursed_item']`, mais cet item n'existe pas dans le pool.

### Objectif
Créer des items spéciaux avec malus cachés ou effets négatifs.

### Étapes d'Implémentation

#### Phase 1 : Définition des items maudits
- [ ] **Fichier :** `src/types/item.ts`
  - Ajouter propriété `cursed?: boolean` à l'interface `Item`
  - Ajouter propriété `curseEffect?: string` pour description du malus
  - Ajouter propriété `hiddenMalus?: Partial<PlayerStats>` pour malus caché

#### Phase 2 : Pool d'items maudits
- [ ] **Fichier :** `src/features/items/cursedItems.ts` (créer)
  - Créer pool `CURSED_ITEMS: Item[]` avec items maudits
  - Exemples :
    - Épée maudite : +15 ATK, mais -5 VIT (fatigue)
    - Armure maudite : +20 DEF, mais -10% or gagné
    - Amulette maudite : +10 VIT, mais réputation -1

#### Phase 3 : Génération conditionnelle
- [ ] **Fichier :** `src/store/gameStore.ts` - `applyEventConsequence()`
  - Modifier ligne 935-942
  - Si `consequence.items` contient `'cursed_item'` :
    - Sélectionner un item maudit aléatoire du pool
    - Sinon, générer item normal avec `generateLoot()`

#### Phase 4 : Affichage et avertissement
- [ ] **Fichier :** `src/components/ItemCard.tsx` (ou équivalent)
  - Afficher badge "MAUDIT" sur items maudits
  - Afficher `curseEffect` dans la description
  - Couleur différente (rouge/violet) pour items maudits

#### Phase 5 : Application des malus
- [ ] **Fichier :** `src/utils/stats.ts`
  - Modifier `calculateStatsFromEquipment()` pour appliquer `hiddenMalus`
  - Soustraire malus cachés des stats calculées

### Fichiers à Modifier
- `src/types/item.ts`
- `src/features/items/cursedItems.ts` (créer)
- `src/store/gameStore.ts`
- `src/components/ItemCard.tsx` (ou équivalent)
- `src/utils/stats.ts`

### Tests
- [ ] Achat d'objet maudit génère bien un item maudit
- [ ] Item maudit a malus caché appliqué
- [ ] Item maudit affiche badge "MAUDIT"
- [ ] Stats sont correctement réduites avec item maudit équipé

---

## 7. 🟢 MONOLOGUES DU CRÉPUSCULE - Amélioration

### Problème
Seulement 3 monologues pour chaque compteur, pas de progression narrative.

### Objectif
Enrichir le système de monologues avec plus de variété et progression.

### Étapes d'Implémentation

#### Phase 1 : Expansion du pool
- [ ] **Fichier :** `src/features/narrative/monologues.ts` (créer)
  - Créer pools de monologues par compteur et niveau :
    - `CYNISME_MONOLOGUES: Record<number, string[]>` (5, 10, 15, 20+)
    - `HUMANITE_MONOLOGUES: Record<number, string[]>` (5, 10, 15, 20+)
    - `PRAGMATISME_MONOLOGUES: Record<number, string[]>` (5, 10, 15, 20+)
  - Minimum 5 monologues par niveau

#### Phase 2 : Sélection intelligente
- [ ] **Fichier :** `src/features/narrative/monologueSelector.ts` (créer)
  - Fonction `selectMonologue(counters: Record<string, number>): string | null`
  - Sélectionner monologue selon le compteur le plus élevé
  - Éviter répétition : garder historique des monologues récents

#### Phase 3 : Intégration
- [ ] **Fichier :** `src/screens/CrepusculeScreen.tsx`
  - Remplacer logique inline par `selectMonologue()`
  - Afficher monologue avec animation fade-in

#### Phase 4 : Combinaisons (optionnel)
- [ ] **Fichier :** `src/features/narrative/monologueSelector.ts`
  - Ajouter monologues pour combinaisons (cynisme + humanité élevés = conflit intérieur)
  - Monologues spéciaux si tous compteurs équilibrés

### Fichiers à Modifier
- `src/features/narrative/monologues.ts` (créer)
- `src/features/narrative/monologueSelector.ts` (créer)
- `src/screens/CrepusculeScreen.tsx`

### Tests
- [ ] Monologue approprié selon niveau de compteur
- [ ] Pas de répétition immédiate
- [ ] Monologue s'affiche correctement

---

## 8. 🟢 ÉVÉNEMENTS DU SOIR - Interactivité

### Problème
Les événements du soir sont juste du texte, pas d'interaction.

### Objectif
Transformer certains événements en choix interactifs avec conséquences.

### Étapes d'Implémentation

#### Phase 1 : Types d'événements
- [ ] **Fichier :** `src/types/eveningEvent.ts` (créer)
  - Interface `EveningEvent` avec :
    - `id: string`
    - `text: string`
    - `choices?: Array<{ text: string; consequence: () => void }>`
    - `type: 'text' | 'interactive'`

#### Phase 2 : Pool d'événements
- [ ] **Fichier :** `src/features/events/eveningEvents.ts` (créer)
  - Créer pool `EVENING_EVENTS: EveningEvent[]`
  - 50% textuels, 50% interactifs
  - Exemples interactifs :
    - "Un marchand passe" → Acheter/Vendre/Ignorer
    - "Des lumières dans la forêt" → Aller voir/Rester/Préparer embuscade

#### Phase 3 : Intégration
- [ ] **Fichier :** `src/features/game/gameManager.ts`
  - Modifier `generateEveningEvent()` pour retourner `EveningEvent | null`
  - Sélectionner aléatoirement dans le pool

- [ ] **Fichier :** `src/screens/CrepusculeScreen.tsx`
  - Si événement interactif, afficher choix
  - Appliquer conséquences au clic

### Fichiers à Modifier
- `src/types/eveningEvent.ts` (créer)
- `src/features/events/eveningEvents.ts` (créer)
- `src/features/game/gameManager.ts`
- `src/screens/CrepusculeScreen.tsx`

### Tests
- [ ] Événements interactifs affichent choix
- [ ] Conséquences appliquées correctement
- [ ] Événements textuels fonctionnent toujours

---

## 9. 🟢 PERSISTANCE DES LIEUX EXPLORÉS

### Problème
Aucun suivi des lieux déjà explorés.

### Objectif
Marquer les lieux explorés et éviter répétitions ou offrir récompenses différentes.

### Étapes d'Implémentation

#### Option A : Éviter répétitions (simple)
- [ ] **Fichier :** `src/store/gameStore.ts`
  - Ajouter `exploredLocationIds: string[]` au state
  - Dans `exploreLocation()`, ajouter `location.id` à la liste
  - Dans `goToExploration()`, filtrer lieux déjà explorés

#### Option B : Récompenses réduites (plus intéressant)
- [ ] **Fichier :** `src/types/location.ts`
  - Ajouter `explored: boolean` à `Location`
  - Ajouter `explorationCount: number`

- [ ] **Fichier :`src/features/exploration/exploration.logic.ts`
  - Modifier `resolveExploration()` pour accepter `isRevisit: boolean`
  - Si `isRevisit === true` :
    - Réduire or de 50%
    - Réduire probabilité de loot rare de 50%
    - Message : "Tu as déjà exploré ce lieu. Moins de découvertes."

### Fichiers à Modifier
- `src/types/location.ts`
- `src/store/gameStore.ts`
- `src/features/exploration/exploration.logic.ts`

### Tests
- [ ] Lieux explorés sont marqués
- [ ] Revisites donnent récompenses réduites
- [ ] Message approprié affiché

---

## 📊 Ordre de Priorité Recommandé

### Sprint 1 (Critique)
1. Système de rumeurs - Déclenchement
2. Lieux - Persistance et valeurs fixes

### Sprint 2 (Important)
3. Système narratif - Déclenchement complet

### Sprint 3 (Moyen)
4. Système moral - Repas
5. Carte révélée
6. Objets maudits

### Sprint 4 (Polish)
7. Monologues du crépuscule
8. Événements du soir
9. Persistance des lieux explorés

---

## 📝 Notes d'Implémentation

### Patterns à Suivre
- Toujours sauvegarder le state après modifications importantes
- Utiliser `saveGameState()` après chaque action qui modifie le state
- Tester avec différents seeds pour reproductibilité
- Ajouter logs de debug pour traçabilité

### Points d'Attention
- Ne pas casser les fonctionnalités existantes
- Maintenir la compatibilité avec les sauvegardes existantes
- Tester les cas limites (inventaire plein, or insuffisant, etc.)
- Équilibrer les probabilités pour éviter frustration ou facilité excessive

### Tests à Effectuer
- [ ] Nouvelle partie complète (20 jours)
- [ ] Chargement de sauvegarde existante
- [ ] Tous les événements narratifs se déclenchent
- [ ] Rumeurs influencent bien le gameplay
- [ ] Lieux gardent leurs valeurs entre les jours
- [ ] Items maudits fonctionnent correctement

---

## 🎯 Critères de Succès

Une fonctionnalité est considérée **complète** quand :
- ✅ Tous les cas d'usage sont couverts
- ✅ L'UI est fonctionnelle et claire
- ✅ Les tests passent
- ✅ La documentation est à jour
- ✅ Aucune régression introduite

---

**Dernière mise à jour :** 2024
