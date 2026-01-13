# SOUDA — Plan d'Action Complet pour Corrections
**Date :** 2024-12-XX  
**Basé sur :** TEST_REPORT_LEAD_PRODUCER.md  
**Objectif :** Corriger tous les points identifiés avant release v1.0

---

## VUE D'ENSEMBLE

**Durée totale estimée :** 3-4 semaines  
**Équipe recommandée :** 1-2 développeurs  
**Priorisation :** 3 sprints (Haute → Moyenne → Basse)

---

## SPRINT 1 : CORRECTIONS PRIORITAIRES (Semaine 1-2)
*Objectif : Corriger les 3 points critiques avant tests utilisateurs élargis*

### 🔴 TÂCHE 1.1 : Ajuster Balance Économique
**Priorité :** CRITIQUE  
**Effort estimé :** 2-3 jours  
**Fichiers concernés :**
- `src/config/balance.ts`
- `src/features/exploration/exploration.logic.ts`
- `src/features/loot/loot.logic.ts`
- `src/features/economy/priceCalculation.ts`

**Problème identifié :**
- Courbe de difficulté trop serrée J8-12
- Revenus insuffisants pour rembourser dette confortablement
- Coûts de réparation trop élevés

**Solution proposée :**
1. **Augmenter revenus de base de 15%**
   - Modifier `exploration.logic.ts` : Multiplier or gagné par 1.15
   - Ajuster plages d'or selon richesse : `richness * 6` → `richness * 7` (au lieu de 5-15, faire 6-18)
   
2. **Réduire coûts réparation de 20%**
   - Modifier `balance.ts` : `repairCostPerPoint: 0.5` → `repairCostPerPoint: 0.4`
   - Vérifier dans `gameStore.ts` que la formule utilise cette constante

3. **Ajuster valeurs de base des items**
   - Augmenter `value` de base des items communs de 10-15%
   - Modifier `BASE_ITEMS` dans `src/types/item.ts`

**Détails d'implémentation :**
```typescript
// src/config/balance.ts
economy: {
  dailyInterest: 5,
  initialDebt: 80,
  buyMultiplier: 1.5,
  repairCostPerPoint: 0.4, // ← Changé de 0.5 à 0.4 (-20%)
  goldMultiplier: 1.15 // ← Nouveau : multiplicateur global or
}

// src/features/exploration/exploration.logic.ts
// Dans resolveExploration(), section loot :
const baseGold = random
  ? random.nextInt(location.richness * 6, location.richness * 18) // ← Changé de 5-15 à 6-18
  : Math.floor(Math.random() * (location.richness * 18 - location.richness * 6 + 1)) + location.richness * 6
const goldAmount = isRevisit 
  ? Math.floor(baseGold * 0.5) 
  : Math.floor(baseGold * BALANCE_CONFIG.economy.goldMultiplier) // ← Appliquer multiplicateur
```

**Tests à effectuer :**
- Run complète J1-20 : Vérifier que dette peut être remboursée au Jour 18-19 (au lieu de 20)
- Vérifier que réparations coûtent 20% moins cher
- Vérifier que revenus sont 15% plus élevés en moyenne

---

### 🔴 TÂCHE 1.2 : Améliorer Feedback Items Maudits
**Priorité :** CRITIQUE  
**Effort estimé :** 1-2 jours  
**Fichiers concernés :**
- `src/features/loot/ItemCard.tsx`
- `src/screens/InventoryScreen.tsx`
- `src/screens/EquipmentScreen.tsx` (si existe)
- `src/types/item.ts`

**Problème identifié :**
- Malus cachés pas visibles avant équipement
- Confusion sur les effets réels
- Frustration après équipement

**Solution proposée :**
1. **Afficher malus dans tooltip avant équipement**
   - Ajouter tooltip détaillé sur hover dans `ItemCard`
   - Afficher stats prévues avec malus appliqués
   
2. **Afficher malus dans inventaire**
   - Badge "MAUDIT" déjà présent, ajouter tooltip explicatif
   - Afficher malus dans description de l'item
   
3. **Afficher comparaison stats avant/après équipement**
   - Dans `InventoryScreen`, afficher stats actuelles vs stats avec item
   - Utiliser couleurs (rouge pour malus, vert pour bonus)

**Détails d'implémentation :**
```typescript
// src/types/item.ts
export interface Item {
  // ... existant
  curseEffect?: string // Description textuelle de l'effet maudit
  hiddenMalus?: { atk?: number; def?: number; vit?: number } // Malus cachés
  visibleMalus?: { atk?: number; def?: number; vit?: number } // Malus visibles (nouveau)
  curseDescription?: string // Description détaillée du malus
}

// src/features/loot/ItemCard.tsx
// Ajouter tooltip sur hover pour items maudits
{item.cursed && (
  <div style={{ 
    position: 'absolute', 
    top: '100%', 
    left: 0, 
    background: '#1a1a1a', 
    border: '1px solid #c44',
    padding: '0.5rem',
    borderRadius: '4px',
    zIndex: 1000,
    minWidth: '200px'
  }}>
    <div style={{ color: '#c44', fontWeight: 'bold' }}>⚠️ ITEM MAUDIT</div>
    {item.curseDescription && <div style={{ marginTop: '0.5rem' }}>{item.curseDescription}</div>}
    {item.hiddenMalus && (
      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
        <div>Malus cachés :</div>
        {item.hiddenMalus.atk && <div>ATK: -{item.hiddenMalus.atk}</div>}
        {item.hiddenMalus.def && <div>DEF: -{item.hiddenMalus.def}</div>}
        {item.hiddenMalus.vit && <div>VIT: -{item.hiddenMalus.vit}</div>}
      </div>
    )}
    {item.visibleMalus && (
      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#f44' }}>
        <div>Malus visibles :</div>
        {item.visibleMalus.atk && <div>ATK: -{item.visibleMalus.atk}</div>}
        {item.visibleMalus.def && <div>DEF: -{item.visibleMalus.def}</div>}
        {item.visibleMalus.vit && <div>VIT: -{item.visibleMalus.vit}</div>}
      </div>
    )}
  </div>
)}

// src/screens/InventoryScreen.tsx
// Ajouter comparaison stats avant équipement
const currentStats = calculateStatsFromEquipment(equipment)
const previewStats = calculateStatsFromEquipment({ ...equipment, [slot]: item })
const statDiff = {
  atk: previewStats.atk - currentStats.atk,
  def: previewStats.def - currentStats.def,
  vit: previewStats.vit - currentStats.vit
}
// Afficher statDiff avec couleurs
```

**Tests à effectuer :**
- Vérifier que tooltip s'affiche correctement
- Vérifier que malus sont visibles avant équipement
- Vérifier que comparaison stats fonctionne

---

### 🔴 TÂCHE 1.3 : Onboarding Rumeurs
**Priorité :** CRITIQUE  
**Effort estimé :** 1 jour  
**Fichiers concernés :**
- `src/screens/TaverneScreen.tsx`
- `src/features/taverne/rumors.logic.ts`
- `src/features/tutorial/tutorialPersistence.ts` (si existe)

**Problème identifié :**
- Impact des rumeurs pas évident au début
- Joueurs ignorent mécanique importante
- Pas de guidance initiale

**Solution proposée :**
1. **Tooltip explicatif au premier affichage**
   - Détecter première visite taverne avec rumeurs
   - Afficher tooltip/modal explicatif
   - Expliquer les 4 types de rumeurs et leurs effets
   
2. **Icônes visuelles améliorées**
   - Rendre les icônes plus explicites
   - Ajouter texte descriptif court sous chaque rumeur
   
3. **Tutorial optionnel**
   - Ajouter étape tutorial sur les rumeurs (optionnel)
   - Ou événement narratif qui explique les rumeurs

**Détails d'implémentation :**
```typescript
// src/store/gameStore.ts
// Ajouter flag pour première visite taverne
npcFlags: {
  ...state.npcFlags,
  firstRumorSeen: false // Nouveau flag
}

// src/screens/TaverneScreen.tsx
const [showRumorTutorial, setShowRumorTutorial] = useState(false)

useEffect(() => {
  const state = useGameStore.getState()
  if (state.rumors.length > 0 && !state.npcFlags.firstRumorSeen) {
    setShowRumorTutorial(true)
    useGameStore.setState({
      npcFlags: { ...state.npcFlags, firstRumorSeen: true }
    })
  }
}, [rumors])

// Modal tutorial rumeurs
{showRumorTutorial && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000
  }}>
    <div style={{
      background: '#2a2a2a',
      padding: '2rem',
      borderRadius: '8px',
      maxWidth: '500px',
      border: '2px solid #555'
    }}>
      <h2>Les Rumeurs</h2>
      <p>Les rumeurs de la taverne peuvent t'aider dans tes explorations :</p>
      <ul>
        <li>⚔️ <strong>Combat</strong> : Augmente les chances de combat (30% → 50%)</li>
        <li>💰 <strong>Trésor</strong> : Augmente les chances de loot (40% → 60%) et améliore la qualité</li>
        <li>⚠️ <strong>Événement</strong> : Augmente les chances d'événement narratif (20% → 50%)</li>
        <li>📍 <strong>Lieu</strong> : Pointe vers un lieu spécifique</li>
      </ul>
      <button onClick={() => setShowRumorTutorial(false)}>Compris</button>
    </div>
  </div>
)}
```

**Tests à effectuer :**
- Vérifier que modal s'affiche au premier affichage
- Vérifier que flag est bien sauvegardé
- Vérifier que modal ne s'affiche qu'une fois

---

## SPRINT 2 : AMÉLIORATIONS MOYENNES (Semaine 2-3)
*Objectif : Améliorer l'expérience utilisateur et l'équilibrage*

### 🟡 TÂCHE 2.1 : Rééquilibrer Événements du Soir
**Priorité :** MOYENNE  
**Effort estimé :** 1-2 jours  
**Fichiers concernés :**
- `src/features/events/eveningEvents.ts`
- `src/screens/CrepusculeScreen.tsx`

**Problème identifié :**
- 30% chance trop faible (frustration)
- Certains choix trop avantageux (déséquilibre)

**Solution proposée :**
1. **Augmenter probabilité à 45%**
   - Modifier `selectEveningEvent()` : `0.3` → `0.45`
   
2. **Rééquilibrer récompenses**
   - Réduire or gagné dans certains choix (marchand : 15💰 → 12💰)
   - Ajuster réputation et compteurs narratifs
   - Équilibrer risques/récompenses

**Détails d'implémentation :**
```typescript
// src/features/events/eveningEvents.ts
export function selectEveningEvent(day: number): EveningEvent | null {
  const events = generateEveningEvents(day)
  
  // 45% chance d'avoir un événement (au lieu de 30%)
  if (Math.random() < 0.45) {
    return events[Math.floor(Math.random() * events.length)]
  }
  
  return null
}

// Rééquilibrer récompenses dans les choix
{
  text: 'Acheter un équipement (12💰)', // ← Changé de 15💰 à 12💰
  description: 'Tu achètes un équipement de qualité.',
  consequence: () => {
    const store = useGameStore.getState()
    if (store.gold >= 12 && store.inventory.length < 10) {
      const item = generateLoot(3)
      useGameStore.setState({
        gold: store.gold - 12, // ← Changé
        inventory: [...store.inventory, item]
      })
    }
  }
}
```

**Tests à effectuer :**
- Vérifier que probabilité est bien 45%
- Vérifier que récompenses sont équilibrées
- Tester tous les choix interactifs

---

### 🟡 TÂCHE 2.2 : Feedback Combat (Ratio Estimé)
**Priorité :** MOYENNE  
**Effort estimé :** 2-3 jours  
**Fichiers concernés :**
- `src/screens/MapScreen.tsx`
- `src/store/gameStore.ts`
- `src/utils/combat.ts`
- `src/features/combat/combat.logic.ts`

**Problème identifié :**
- Pas d'indication de force avant combat
- Défaites frustrantes sans warning

**Solution proposée :**
1. **Afficher ratio estimé avant combat**
   - Calculer ratio estimé (sans random) avant combat
   - Afficher dans UI avec warning si ratio < 0.5
   
2. **Système de warning visuel**
   - Badge "DANGER" si ratio estimé < 0.5
   - Badge "RISQUÉ" si ratio estimé < 0.7
   - Badge "SÛR" si ratio estimé > 1.0

**Détails d'implémentation :**
```typescript
// src/utils/combat.ts
// Nouvelle fonction pour estimer le ratio
export function estimateCombatRatio(
  playerStats: PlayerStats,
  enemy: Enemy
): { ratio: number; confidence: 'low' | 'medium' | 'high' } {
  // Calculer puissance moyenne (sans random)
  const playerAvgPower = (playerStats.atk * 0.5) + (playerStats.def * 0.3) + (playerStats.vit * 0.2) + 10.5 // Moyenne de 1-20
  const enemyAvgPower = (enemy.atk * 0.5) + (enemy.def * 0.3) + (enemy.vit * 0.2) + 8 // Moyenne de 1-15
  
  const ratio = playerAvgPower / enemyAvgPower
  
  // Confidence basée sur l'écart type
  const confidence = ratio > 1.2 || ratio < 0.6 ? 'high' : ratio > 0.8 && ratio < 1.2 ? 'medium' : 'low'
  
  return { ratio, confidence }
}

// src/screens/MapScreen.tsx
// Avant d'explorer, calculer ratio estimé si combat possible
const estimateCombat = (location: Location) => {
  const state = useGameStore.getState()
  const combatProb = getCombatProbability(location.risk)
  
  if (combatProb > 0.1) {
    // Générer ennemi estimé selon risque
    const estimatedEnemy = getEstimatedEnemyForRisk(location.risk)
    const estimate = estimateCombatRatio(state.playerStats, estimatedEnemy)
    
    return {
      showWarning: estimate.ratio < 0.5,
      showRisk: estimate.ratio < 0.7,
      ratio: estimate.ratio
    }
  }
  return null
}

// Afficher badge sur lieu
{combatEstimate?.showWarning && (
  <span style={{
    background: '#c44',
    color: '#fff',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: 'bold'
  }}>
    ⚠️ DANGER
  </span>
)}
```

**Tests à effectuer :**
- Vérifier que ratio estimé est calculé correctement
- Vérifier que warnings s'affichent correctement
- Tester avec différents niveaux de stats

---

### 🟡 TÂCHE 2.3 : Impact Compteurs Narratifs sur Gameplay
**Priorité :** MOYENNE  
**Effort estimé :** 3-5 jours  
**Fichiers concernés :**
- `src/store/gameStore.ts`
- `src/features/economy/priceCalculation.ts`
- `src/features/events/eventManager.ts`
- `src/features/events/eventPool.ts`

**Problème identifié :**
- Compteurs narratifs n'impactent que les monologues
- Sentiment de manque d'impact

**Solution proposée :**
1. **Impact sur prix marché**
   - Humanité élevée : +5% prix de vente
   - Cynisme élevé : -10% prix d'achat (négociation)
   - Pragmatisme élevé : Réduction coût réparation
   
2. **Impact sur événements**
   - Humanité élevée : Plus d'options "généreuses" dans événements
   - Cynisme élevé : Plus d'options "violentes" dans événements
   - Pragmatisme élevé : Plus d'options "logiques" dans événements
   
3. **Impact sur réputation**
   - Humanité élevée : +1 réputation bonus (max 5)
   - Cynisme élevé : -1 réputation malus (min 1)

**Détails d'implémentation :**
```typescript
// src/features/economy/priceCalculation.ts
export function calculateSellPrice(
  item: Item, 
  reputation: Reputation,
  narrativeCounters?: Record<string, number>
): number {
  const baseValue = item.value
  const rarityMultiplier = RARITY_MULTIPLIERS[item.rarity]
  const reputationMultiplier = REPUTATION_SELL_MULTIPLIERS[reputation]
  
  // Bonus humanité : +5% prix de vente si humanité >= 10
  let humaniteBonus = 1.0
  if (narrativeCounters && narrativeCounters.humanite >= 10) {
    humaniteBonus = 1.05
  }
  
  return Math.floor(baseValue * rarityMultiplier * reputationMultiplier * humaniteBonus)
}

// src/store/gameStore.ts
// Dans sellItem(), passer narrativeCounters
sellItem: (item: Item) => {
  const state = get()
  const sellPrice = calculateSellPrice(item, state.reputation, state.narrativeCounters)
  // ...
}

// src/features/events/eventPool.ts
// Filtrer choix selon compteurs narratifs
function getAvailableChoices(
  event: NarrativeEvent,
  narrativeCounters: Record<string, number>
): Choice[] {
  return event.choices.filter(choice => {
    // Si choix nécessite humanité élevée
    if (choice.requiresHumanite && (narrativeCounters.humanite || 0) < 10) {
      return false
    }
    // Si choix nécessite cynisme élevé
    if (choice.requiresCynisme && (narrativeCounters.cynisme || 0) < 10) {
      return false
    }
    // Si choix nécessite pragmatisme élevé
    if (choice.requiresPragmatisme && (narrativeCounters.pragmatisme || 0) < 10) {
      return false
    }
    return true
  })
}
```

**Tests à effectuer :**
- Vérifier que prix sont modifiés selon compteurs
- Vérifier que choix sont filtrés selon compteurs
- Tester avec différents niveaux de compteurs

---

## SPRINT 3 : AMÉLIORATIONS FUTURES (Semaine 3-4)
*Objectif : Enrichir le contenu et améliorer la réjouabilité*

### 🟢 TÂCHE 3.1 : Plus d'Événements du Soir Interactifs
**Priorité :** BASSE  
**Effort estimé :** 2-3 jours  
**Fichiers concernés :**
- `src/features/events/eveningEvents.ts`

**Solution proposée :**
Ajouter 3-4 nouveaux événements interactifs :
1. **Rencontre avec un ancien soldat**
   - Choix : Partager expérience, éviter, ou voler
   - Conséquences : Stats, or, réputation
   
2. **Découverte d'un campement abandonné**
   - Choix : Explorer, laisser, ou piller
   - Conséquences : Loot, réputation, compteurs
   
3. **Message d'un contact**
   - Choix : Suivre, ignorer, ou dénoncer
   - Conséquences : Événement futur, or, réputation

**Détails d'implémentation :**
```typescript
// src/features/events/eveningEvents.ts
// Ajouter nouveaux événements dans generateEveningEvents()
{
  id: 'ancien_soldat',
  text: 'Tu croises un ancien soldat. Il te reconnaît.',
  type: 'interactive',
  choices: [
    {
      text: 'Partager une expérience',
      description: 'Vous partagez vos histoires. Tu te sens moins seul.',
      consequence: () => {
        const store = useGameStore.getState()
        useGameStore.setState({
          narrativeCounters: {
            ...store.narrativeCounters,
            humanite: (store.narrativeCounters.humanite || 0) + 1
          }
        })
      }
    },
    {
      text: 'Éviter',
      description: 'Tu passes ton chemin.',
      consequence: () => {}
    },
    {
      text: 'Voler ses affaires',
      description: 'Tu profites de sa distraction.',
      consequence: () => {
        const store = useGameStore.getState()
        useGameStore.setState({
          gold: store.gold + Math.floor(Math.random() * 11) + 10,
          narrativeCounters: {
            ...store.narrativeCounters,
            cynisme: (store.narrativeCounters.cynisme || 0) + 1
          },
          reputation: Math.max(1, store.reputation - 1) as 1 | 2 | 3 | 4 | 5
        })
      }
    }
  ]
}
```

**Tests à effectuer :**
- Vérifier que nouveaux événements s'affichent
- Tester tous les choix
- Vérifier équilibrage

---

### 🟢 TÂCHE 3.2 : Système de Fins Multiples
**Priorité :** BASSE  
**Effort estimé :** 5-7 jours  
**Fichiers concernés :**
- `src/features/endings/endings.ts` (créer)
- `src/store/gameStore.ts`
- `src/screens/VictoryScreen.tsx`

**Solution proposée :**
Créer 3-4 fins différentes selon compteurs narratifs :
1. **Fin Humanité** : Victoire avec humanité >= 15
2. **Fin Cynisme** : Victoire avec cynisme >= 15
3. **Fin Pragmatisme** : Victoire avec pragmatisme >= 15
4. **Fin Équilibrée** : Victoire avec compteurs équilibrés

**Détails d'implémentation :**
```typescript
// src/features/endings/endings.ts
export interface Ending {
  id: string
  title: string
  description: string
  requirements: (counters: Record<string, number>) => boolean
}

export const ENDINGS: Ending[] = [
  {
    id: 'humanite',
    title: 'La Rédemption',
    description: 'Tu as choisi l\'humanité. Tu as racheté tes erreurs.',
    requirements: (counters) => (counters.humanite || 0) >= 15
  },
  {
    id: 'cynisme',
    title: 'La Survie',
    description: 'Tu as survécu. Peu importe le prix.',
    requirements: (counters) => (counters.cynisme || 0) >= 15
  },
  {
    id: 'pragmatisme',
    title: 'L\'Efficacité',
    description: 'Tu as gagné. Par la logique et l\'efficacité.',
    requirements: (counters) => (counters.pragmatisme || 0) >= 15
  },
  {
    id: 'equilibre',
    title: 'L\'Équilibre',
    description: 'Tu as trouvé l\'équilibre. Entre tout et rien.',
    requirements: (counters) => {
      const h = counters.humanite || 0
      const c = counters.cynisme || 0
      const p = counters.pragmatisme || 0
      return Math.abs(h - c) < 5 && Math.abs(h - p) < 5 && Math.abs(c - p) < 5
    }
  }
]

export function getEnding(counters: Record<string, number>): Ending {
  return ENDINGS.find(e => e.requirements(counters)) || ENDINGS[0]
}
```

**Tests à effectuer :**
- Vérifier que fins s'affichent correctement
- Tester avec différents compteurs
- Vérifier que descriptions sont variées

---

## PLANNING DÉTAILLÉ

### Semaine 1
- **Jour 1-2 :** Tâche 1.1 (Balance économique)
- **Jour 3 :** Tâche 1.2 (Feedback items maudits)
- **Jour 4 :** Tâche 1.3 (Onboarding rumeurs)
- **Jour 5 :** Tests et corrections Sprint 1

### Semaine 2
- **Jour 1-2 :** Tâche 2.1 (Événements du soir)
- **Jour 3-5 :** Tâche 2.2 (Feedback combat)

### Semaine 3
- **Jour 1-5 :** Tâche 2.3 (Impact compteurs narratifs)

### Semaine 4 (Optionnel)
- **Jour 1-3 :** Tâche 3.1 (Plus d'événements)
- **Jour 4-7 :** Tâche 3.2 (Fins multiples)

---

## DÉPENDANCES

```
Sprint 1 (Priorité Haute)
├── 1.1 Balance économique (indépendant)
├── 1.2 Feedback items maudits (indépendant)
└── 1.3 Onboarding rumeurs (indépendant)

Sprint 2 (Priorité Moyenne)
├── 2.1 Événements du soir (indépendant)
├── 2.2 Feedback combat (indépendant)
└── 2.3 Impact compteurs (dépend de 1.2 pour affichage)

Sprint 3 (Priorité Basse)
├── 3.1 Plus d'événements (dépend de 2.1)
└── 3.2 Fins multiples (dépend de 2.3)
```

---

## CRITÈRES DE SUCCÈS

### Sprint 1
- ✅ Dette remboursable au Jour 18-19 (au lieu de 20)
- ✅ Réparations 20% moins chères
- ✅ Malus items maudits visibles avant équipement
- ✅ Modal rumeurs affiché au premier affichage

### Sprint 2
- ✅ Probabilité événements du soir = 45%
- ✅ Ratio estimé affiché avant combat
- ✅ Warnings visuels si ratio < 0.5
- ✅ Prix modifiés selon compteurs narratifs
- ✅ Choix filtrés selon compteurs

### Sprint 3
- ✅ 3-4 nouveaux événements du soir
- ✅ 3-4 fins différentes selon compteurs

---

## RISQUES ET MITIGATION

### Risque 1 : Balance économique trop facile
**Mitigation :** Tests itératifs, ajustements fins

### Risque 2 : Feedback combat trop révélateur
**Mitigation :** Ratio estimé avec confidence, pas ratio exact

### Risque 3 : Impact compteurs trop fort
**Mitigation :** Bonus/malus modérés (5-10%), tests d'équilibrage

---

## NOTES TECHNIQUES

### Fichiers à créer
- `src/features/endings/endings.ts` (Sprint 3)

### Fichiers à modifier
- `src/config/balance.ts` (Sprint 1)
- `src/features/exploration/exploration.logic.ts` (Sprint 1)
- `src/features/loot/ItemCard.tsx` (Sprint 1)
- `src/screens/InventoryScreen.tsx` (Sprint 1)
- `src/screens/TaverneScreen.tsx` (Sprint 1)
- `src/features/events/eveningEvents.ts` (Sprint 2)
- `src/screens/MapScreen.tsx` (Sprint 2)
- `src/utils/combat.ts` (Sprint 2)
- `src/features/economy/priceCalculation.ts` (Sprint 2)
- `src/store/gameStore.ts` (Sprint 2)

### Tests à effectuer
- Run complète J1-20 pour chaque sprint
- Tests unitaires pour nouvelles fonctions
- Tests d'intégration pour nouvelles fonctionnalités

---

**Document créé le :** 2024-12-XX  
**Dernière mise à jour :** 2024-12-XX  
**Statut :** En attente d'approbation
