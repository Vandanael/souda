# AUDIT UX & HIÉRARCHIE DE L'INFORMATION

**Date :** 2024  
**Focus :** Prototype narratif - Expérience utilisateur sur mobile  
**Méthodologie :** Analyse des écrans principaux et vérification des guidelines UX mobile

---

## 📱 CONTEXTE

Le jeu est un prototype narratif où **l'histoire doit être au centre**. L'interface doit être discrète et ne pas polluer l'expérience narrative.

---

## 🔍 CHECKLIST DE VÉRIFICATION

### 1. PRIORITÉ VISUELLE : Le texte narratif est-il la chose la plus visible ?

#### ✅ **EventScreen.tsx** - BON
- **Description de l'événement :** Grande boîte avec padding généreux (1.5rem), police 1rem, line-height 1.6
- **Titre :** Centré, 1.5rem, bold
- **Conséquence narrative :** Couleur distincte (#ca8), italique, bien visible
- **Verdict :** ✅ Le texte narratif est bien mis en avant

#### ⚠️ **AubeScreen.tsx** - PROBLÈME DÉTECTÉ
- **Problème :** Les informations économiques (Dette, Or, Réputation) sont affichées **en haut** dans une grande boîte, avant le texte narratif
- **Texte narratif :** Placé en bas ("Bourg-Creux. Des murs..."), petit (0.85rem), couleur grise (#aaa), italique
- **Verdict :** ❌ Les jauges économiques prennent trop de place. Le texte narratif est relégué en bas et peu visible.

#### ⚠️ **CrepusculeScreen.tsx** - PROBLÈME DÉTECTÉ
- **Problème :** L'écran affiche :
  1. Résumé du jour (activités)
  2. Dette avec animation (très visible)
  3. Événement du soir (texte narratif)
  4. Monologue intérieur (texte narratif)
- **Verdict :** ⚠️ Le texte narratif est présent mais noyé dans les informations mécaniques. La dette avec animation attire trop l'attention.

#### ✅ **CombatScreen.tsx** - BON
- Le texte narratif (description de l'ennemi, résultat) est bien mis en avant
- Les stats sont discrètes

---

### 2. LARD FACTOR (Gros Doigts) : Zone tactile suffisante ?

#### ✅ **EventScreen.tsx** - BON
- **Boutons de choix :** `minHeight: isMobile ? '48px' : '44px'` ✅
- **Padding :** `1rem` ✅
- **Gap entre boutons :** `0.75rem` ✅
- **Verdict :** ✅ Conforme aux guidelines (min 44px)

#### ✅ **AubeScreen.tsx** - BON
- **Tous les boutons :** `minHeight: isMobile ? '48px' : '44px'` ✅
- **Verdict :** ✅ Conforme

#### ⚠️ **CrepusculeScreen.tsx** - PROBLÈME DÉTECTÉ
- **Boutons de choix du soir :** `padding: '0.75rem'`, **PAS de minHeight défini** ❌
- **FontSize :** `0.9rem` (trop petit pour mobile)
- **Verdict :** ❌ Risque de cliquer sur le mauvais choix. Zone tactile insuffisante.

#### ✅ **MapScreen.tsx** - BON
- **Bouton EXPLORER :** `minHeight: '44px'` ✅
- **Verdict :** ✅ Conforme

---

### 3. FEEDBACK D'ACTION : Les changements sont-ils visibles ?

#### ✅ **EventScreen.tsx** - BON
- **Conséquence narrative :** Affichée immédiatement après le choix
- **Screen shake :** Pour les choix critiques (dette, dégâts)
- **Verdict :** ✅ Feedback immédiat

#### ⚠️ **MortenScreen.tsx** - PROBLÈME DÉTECTÉ
- **Problème :** Après remboursement, la dette mise à jour est affichée dans un texte statique
- **Code :** `Nouvelle dette : <span>{debt - repayAmount}💰</span>`
- **Verdict :** ⚠️ Pas d'animation ou de feedback visuel fort. Le joueur doit lire attentivement pour voir le changement.

#### ⚠️ **CrepusculeScreen.tsx** - PARTIELLEMENT BON
- **Dette :** Animation avec `motion.div` et screen shake ✅
- **Mais :** L'animation montre `debt + 5` (hardcodé) au lieu de la vraie valeur depuis le store
- **Code :** `const newDebt = debt + 5` (ligne 57) - **BUG DÉTECTÉ**
- **Verdict :** ⚠️ Animation présente mais valeur incorrecte

#### ❌ **AubeScreen.tsx** - PROBLÈME DÉTECTÉ
- **Problème :** Aucun feedback visuel quand les stats changent (équipement, or, dette)
- **Verdict :** ❌ Pas de feedback d'action. Le joueur doit mémoriser les valeurs précédentes.

---

### 4. SURCHARGE COGNITIVE : Trop d'infos inutiles ?

#### ⚠️ **AubeScreen.tsx** - PROBLÈME DÉTECTÉ
- **Affichage :**
  - Dette, Or, Réputation (3 lignes)
  - Personnage + Stats (ATK, DEF, VIT)
  - EndingProgress (3 barres : Humanité, Cynisme, Pragmatisme)
  - DailyObjectives (liste d'objectifs avec barres de progression)
  - Texte narratif (petit, en bas)
  - 6 boutons d'action
- **Verdict :** ❌ **SURCHARGE COGNITIVE**. Trop d'informations mécaniques avant le texte narratif. Le joueur doit scroller pour voir l'histoire.

#### ⚠️ **MapScreen.tsx** - PROBLÈME DÉTECTÉ
- **Affichage :** Pour chaque lieu :
  - Icône + Nom + Description
  - Risque + Richesse
  - Warning combat détaillé (ratio, probabilités, stats ennemi)
  - Bouton EXPLORER
- **Verdict :** ⚠️ Beaucoup d'informations techniques. Le warning combat est très détaillé (peut être masqué, mais visible par défaut).

#### ✅ **EventScreen.tsx** - BON
- **Affichage minimaliste :** Titre, Description, Choix
- **Verdict :** ✅ Focus narratif, pas de surcharge

---

## 🚨 LES 3 PLUS GROS PROBLÈMES D'UX

### 🔴 PROBLÈME #1 : SURCHARGE COGNITIVE À L'AUBE

**Fichier :** `src/screens/AubeScreen.tsx`

**Problème :**
L'écran d'aube affiche trop d'informations mécaniques avant le texte narratif :
- Dette, Or, Réputation (en haut)
- Personnage + Stats
- 3 barres de progression (Humanité, Cynisme, Pragmatisme)
- Liste d'objectifs quotidiens avec barres
- Texte narratif relégué en bas, petit et gris

**Impact :**
- Le joueur voit d'abord les "jauges" au lieu de l'histoire
- Le texte narratif ("Bourg-Creux. Des murs...") est noyé dans les informations mécaniques
- Surcharge cognitive : trop d'infos à traiter avant de comprendre le contexte narratif

**Correction proposée :**

```
LAYOUT RECOMMANDÉ :

┌─────────────────────────────────┐
│  AUBE — JOUR X/20                │
├─────────────────────────────────┤
│  [TEXTE NARRATIF EN GRAND]      │
│  "Bourg-Creux. Des murs..."     │
│  (Police 1.1rem, couleur #ddd)  │
├─────────────────────────────────┤
│  [INFOS ÉCONOMIQUES COMPACTES]  │
│  Dette: 80💰 | Or: 20💰 | ⭐⭐⭐ │
│  (Une seule ligne, discrète)    │
├─────────────────────────────────┤
│  [PERSONNAGE + STATS]            │
│  (Compact, sur une ligne)       │
├─────────────────────────────────┤
│  [Boutons d'action]              │
└─────────────────────────────────┘

[EndingProgress et DailyObjectives]
→ Déplacer dans un menu "STATS" ou "PROGRESSION"
→ Ou afficher seulement si le joueur clique sur "Détails"
```

**Code suggéré :**
```tsx
// Déplacer le texte narratif en haut
<div style={{
  fontSize: isMobile ? '1.1rem' : '1.2rem',
  lineHeight: '1.8',
  color: '#ddd',
  marginBottom: '1.5rem',
  padding: '1rem',
  background: '#1a1a1a',
  borderRadius: '4px',
  fontStyle: 'italic'
}}>
  "Bourg-Creux. Des murs. Un toit. Ça fera l'affaire. Pour l'instant."
</div>

// Infos économiques en une ligne compacte
<div style={{
  display: 'flex',
  justifyContent: 'space-around',
  fontSize: '0.9rem',
  color: '#aaa',
  marginBottom: '1rem'
}}>
  <span>Dette: <span style={{ color: '#c44' }}>{debt}💰</span></span>
  <span>Or: <span style={{ color: '#ca8' }}>{gold}💰</span></span>
  <span>Rép: {'⭐'.repeat(reputation)}</span>
</div>

// EndingProgress et DailyObjectives dans un accordéon
<details style={{ marginBottom: '1rem' }}>
  <summary style={{ cursor: 'pointer', color: '#aaa' }}>
    Progression et objectifs
  </summary>
  <EndingProgress compact={isMobile} />
  <DailyObjectives />
</details>
```

---

### 🟠 PROBLÈME #2 : FEEDBACK D'ACTION INSUFFISANT

**Fichiers :** `src/screens/MortenScreen.tsx`, `src/screens/AubeScreen.tsx`

**Problème :**
- **MortenScreen :** Après remboursement, la dette mise à jour est affichée mais sans animation ou feedback visuel fort
- **AubeScreen :** Aucun feedback quand les stats changent (équipement, or, dette)
- **CrepusculeScreen :** Animation de dette mais valeur hardcodée (`debt + 5` au lieu de la vraie valeur)

**Impact :**
- Le joueur ne voit pas immédiatement les conséquences de ses actions
- Risque de confusion : "Ai-je bien remboursé ?"
- Pas de satisfaction visuelle lors des actions importantes

**Correction proposée :**

```tsx
// MortenScreen.tsx - Ajouter animation après remboursement
const [debtAnimation, setDebtAnimation] = useState(false)

const handleRepay = () => {
  if (repayAmount > 0 && repayAmount <= maxRepay) {
    const oldDebt = debt
    repayDebt(repayAmount)
    
    // Animation de feedback
    setDebtAnimation(true)
    triggerShake(2, 400)
    
    // Afficher message de confirmation
    setShowConfirmation(true)
    setTimeout(() => {
      setDebtAnimation(false)
      setShowConfirmation(false)
    }, 2000)
  }
}

// Afficher avec animation
<motion.div
  animate={debtAnimation ? { 
    scale: [1, 1.1, 1],
    color: ['#c44', '#4a4', '#c44']
  } : {}}
  style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
>
  Nouvelle dette : <span style={{ color: '#c44' }}>{debt}💰</span>
  {debtAnimation && (
    <span style={{ color: '#4a4', marginLeft: '0.5rem' }}>
      -{repayAmount}💰
    </span>
  )}
</motion.div>

// AubeScreen.tsx - Ajouter feedback visuel pour changements
useEffect(() => {
  // Détecter changement d'or
  const prevGold = useRef(gold)
  if (gold !== prevGold.current) {
    const diff = gold - prevGold.current
    if (diff > 0) {
      // Animation "gain d'or"
      showNotification(`+${diff}💰`, '#4a4')
    } else {
      // Animation "perte d'or"
      showNotification(`${diff}💰`, '#c44')
    }
    prevGold.current = gold
  }
}, [gold])
```

---

### 🟡 PROBLÈME #3 : BOUTONS DE CHOIX TROP PETITS AU CRÉPUSCULE

**Fichier :** `src/screens/CrepusculeScreen.tsx`

**Problème :**
- **Boutons de choix du soir :** `padding: '0.75rem'`, **PAS de minHeight défini**
- **FontSize :** `0.9rem` (trop petit pour mobile)
- **Gap :** `0.5rem` (trop serré)

**Impact :**
- Risque de cliquer sur le mauvais choix (zone tactile insuffisante)
- Difficile à lire sur mobile
- Expérience frustrante

**Correction proposée :**

```tsx
// CrepusculeScreen.tsx - Corriger les boutons
<button
  key={index}
  onClick={() => handleChoice(index)}
  disabled={!isAvailable}
  style={{
    padding: isMobile ? '1rem' : '0.875rem',
    fontSize: isMobile ? '1rem' : '0.95rem', // Augmenter de 0.9rem
    minHeight: isMobile ? '48px' : '44px', // AJOUTER minHeight
    textAlign: 'left',
    background: isAvailable ? '#1a1a1a' : '#0a0a0a',
    border: `1px solid ${isAvailable ? '#555' : '#333'}`,
    borderRadius: '4px',
    color: isAvailable ? '#ccc' : '#666',
    cursor: isAvailable ? 'pointer' : 'not-allowed',
    opacity: isAvailable ? 1 : 0.5
  }}
>
  {choice.text}
</button>

// Augmenter le gap entre boutons
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem', // Augmenter de 0.5rem à 0.75rem
  marginTop: '1rem'
}}>
```

---

## 📊 RÉSUMÉ DES CORRECTIONS

| Problème | Fichier | Gravité | Correction |
|----------|---------|---------|------------|
| **Surcharge cognitive à l'aube** | `AubeScreen.tsx` | 🔴 Critique | Déplacer texte narratif en haut, compacter infos économiques, masquer progression dans accordéon |
| **Feedback d'action insuffisant** | `MortenScreen.tsx`, `AubeScreen.tsx` | 🟠 Important | Ajouter animations et notifications pour changements |
| **Boutons trop petits au crépuscule** | `CrepusculeScreen.tsx` | 🟡 Moyen | Ajouter minHeight 44px, augmenter fontSize et gap |

---

## ✅ POINTS POSITIFS

1. **EventScreen.tsx** : Excellent focus narratif, boutons bien dimensionnés
2. **CombatScreen.tsx** : Feedback visuel présent (screen shake, animations)
3. **MapScreen.tsx** : Boutons conformes aux guidelines (minHeight 44px)

---

## 🎯 RECOMMANDATIONS GÉNÉRALES

1. **Principe "Narratif-First" :** Toujours afficher le texte narratif avant les informations mécaniques
2. **Infos économiques discrètes :** Une seule ligne compacte en haut ou en bas, pas de grande boîte
3. **Feedback immédiat :** Animer tous les changements importants (or, dette, stats)
4. **Zone tactile :** Toujours définir `minHeight: 44px` (ou 48px sur mobile) pour tous les boutons
5. **Masquer les détails :** Utiliser des accordéons ou des menus "Détails" pour les informations secondaires (progression, objectifs)

---

## 🔧 PRIORITÉS D'IMPLÉMENTATION

1. **PRIORITÉ 1 :** Corriger `AubeScreen.tsx` (surcharge cognitive)
2. **PRIORITÉ 2 :** Ajouter feedback d'action dans `MortenScreen.tsx`
3. **PRIORITÉ 3 :** Corriger boutons dans `CrepusculeScreen.tsx`
4. **PRIORITÉ 4 :** Corriger bug valeur dette dans `CrepusculeScreen.tsx` (hardcodé `+5`)
