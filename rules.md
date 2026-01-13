# SOUDA — Règles et Contexte Projet

**Version :** Vertical Slice Jour 1 (en développement)

---

## 🎯 Vision Rapide

**SOUDA** = Roguelite mobile où tu es un Soudard (déserteur-pilleur) qui doit survivre 20 jours et rembourser 80💰 de dette. Permadeath, transformation visuelle, pression économique.

**Stack :** React 18 + TypeScript + Vite + Zustand + Canvas API + IndexedDB (PWA)

---

## 📊 Structure d'une Run

```
20 JOURS = 1 RUN

Chaque JOUR :
├── AUBE (1-2 min)      → Équiper, Marché, Taverne, Usurier, Partir
├── JOURNÉE (4-5 min)   → 3 actions, explorer 5 lieux
└── CRÉPUSCULE (1 min)  → Résumé, +5💰 intérêts dette

JOUR 20 :
├── Dette remboursée → VICTOIRE
└── Dette non remboursée → DÉFAITE

MORT EN COMBAT → DÉFAITE (n'importe quand)
```

---

## 💰 Économie

### Dette
- **Départ :** 80💰
- **Intérêts quotidiens :** +5💰
- **Jour 20 minimum :** 175💰
- **Progression :** Jour 1=80, Jour 5=100, Jour 10=125, Jour 15=150, Jour 20=175

### Réputation (1-5 ⭐)
- **Départ :** ⭐⭐⭐
- **Modificateurs prix :**
  - ⭐ : +40% achat, -40% vente
  - ⭐⭐ : +20% achat, -20% vente
  - ⭐⭐⭐ : Normal
  - ⭐⭐⭐⭐ : -10% achat, +10% vente
  - ⭐⭐⭐⭐⭐ : -20% achat, +20% vente

### Revenus/Dépenses
- **Loot direct :** 5-30💰/lieu
- **Vente items :** Commun 5-15💰, Peu Commun 15-30💰, Rare 30-60💰, Légendaire 80-150💰
- **Logement :** 2💰/nuit (obligatoire)
- **Réparation :** 20-40% valeur item

---

## ⚔️ Combat Auto-Résolu

### Probabilité selon Risque
| Risque | Probabilité Combat |
|--------|-------------------|
| ⭐ | 10% |
| ⭐⭐ | 25% |
| ⭐⭐⭐ | 45% |
| ⭐⭐⭐⭐ | 65% |
| ⭐⭐⭐⭐⭐ | 85% |

### Calcul
```
Puissance Joueur = (ATK × 0.5) + (DEF × 0.3) + (VIT × 0.2) + random(1-20)
Puissance Ennemi = (ATK × 0.5) + (DEF × 0.3) + (VIT × 0.2) + random(1-15)
Ratio = Puissance Joueur / Puissance Ennemi
```

### Résultats
| Ratio | Résultat | Conséquence |
|-------|----------|-------------|
| > 1.4 | Victoire Écrasante | Loot complet, aucun dégât |
| > 1.0 | Victoire | Loot complet, aucun dégât |
| > 0.7 | Victoire Coûteuse | Loot, -10 à -20% durabilité 1 item |
| > 0.4 | Fuite | Pas de loot, -15% durabilité 1-2 items |
| ≤ 0.4 | **Défaite** | **MORT — FIN DE RUN** |

### Types d'Ennemis
| Ennemi | ATK | DEF | VIT | Loot |
|--------|-----|-----|-----|------|
| Bandits | 10 | 6 | 4 | Or, armes basiques |
| Déserteurs | 12 | 10 | 5 | Équipement militaire |
| Miliciens | 8 | 14 | 3 | Armures, peu d'or |
| Pillards Vétérans | 16 | 8 | 6 | Excellent loot |
| Loups | 8 | 4 | 10 | Fourrures |
| Squatteurs | 6 | 4 | 4 | Divers |

---

## 🎒 Équipement

### Slots (7)
1. **Tête** (Casques) → DEF
2. **Torse** (Armures) → DEF majeur
3. **Jambes** (Jambières) → DEF, VIT
4. **Mains** (Gantelets) → ATK, DEF
5. **Arme Principale** (Épées) → ATK majeur
6. **Arme Secondaire** (Boucliers) → DEF ou ATK
7. **Accessoire** (Capes) → Effets spéciaux

### Stats
- **ATK** : Dégâts infligés
- **DEF** : Protection reçue
- **VIT** : Initiative, esquive

### Raretés
| Rareté | Couleur | Forme | Bonus Stats | Propriétés |
|--------|---------|-------|-------------|------------|
| Commun | Gris | Cercle | Base | 0 |
| Peu Commun | Vert | Carré | +15% | 0 |
| Rare | Bleu | Losange | +30% | 1 |
| Légendaire | Or | Étoile | +50% | 2 |

### Propriétés Spéciales
- **Léger** : +1 VIT
- **Lourd** : -1 VIT, +2 DEF
- **Rouillé** : -10% ATK, réparation -50% coût
- **Ensanglanté** : +10% or trouvé
- **Béni** : +2 DEF dans lieux sacrés
- **Volé** : -1⭐ Réputation si équipé
- **Solide** : Immunité dégradation

### Durabilité
| Situation | Perte |
|-----------|-------|
| Combat normal | Aucune |
| Victoire coûteuse | -10 à -20% sur 1 item |
| Fuite | -15% sur 1-2 items |
| Événement/Piège | -20% sur 1 item |

| Durabilité | État | Effet |
|------------|------|-------|
| 100-50% | Normal | Aucun malus |
| 50-25% | Abîmé | -20% efficacité |
| 25-1% | Endommagé | -50% efficacité |
| 0% | Cassé | Inutilisable |

---

## 🗺️ Exploration

### Types de Lieux
| Type | Risque | Richesse | Description |
|------|--------|----------|-------------|
| Villages Fantômes | ⭐-⭐⭐ | 💰💰 | Abandonnés |
| Champs de Bataille | ⭐⭐-⭐⭐⭐ | 💰💰💰 | Armures rouillées |
| Fermes Abandonnées | ⭐-⭐⭐ | 💰 | Survivants hostiles |
| Monastères Pillés | ⭐⭐ | 💰💰💰💰 | Moines partis |
| Ruines de Forts | ⭐⭐⭐-⭐⭐⭐⭐ | 💰💰💰💰 | Équipement militaire |
| Forêts | ⭐⭐ | 💰 | Déserteurs, loups |
| Carrières | ⭐⭐-⭐⭐⭐ | 💰💰 | Outils, squatteurs |

### Événements
| Type | Fréquence | Résultat |
|------|-----------|----------|
| Loot Direct | 40% | 1-3 items, pas de combat |
| Combat | 30% | Affrontement → Victoire/Défaite |
| Choix Narratif | 20% | Dilemme moral, conséquences |
| Lieu Vide | 10% | Déjà pillé, rien |

**5 lieux générés/jour, 3 actions/jour**

---

## 🏘️ Hub Bourg-Creux

### Lieux
- **Taverne du Pendu** : Rumeurs, contacts, repos
- **Marché aux Charognes** : Vente/achat équipement
- **Échoppe de Morten** : Remboursement dette
- **Forge de Bertram** : Réparations (20-40% valeur)

### PNJ Principaux
- **Morten l'Usurier** : Créancier, antagoniste
- **Gareth le Borgne** : Vétéran, mentor/ennemi
- **Bertram le Forgeron** : Réparations
- **Sœur Margaux** : Soins, morale

---

## 🎨 Direction Artistique

### Style
- **Pixel Art 64×64**
- **Palette :** Bruns, Gris, Ocres, Rouge sombre, Vert terne, Bleu acier
- **Layering :** 7 couches superposées (Corps → Jambes → Torse → Tête → Mains → Arme → Accessoire)
- **Cache LRU :** Max 100 combinaisons pré-rendues

### Loot Reveal
- **Durée :** 1.5s (0.3s caché + 0.5s suspense + 0.4s flip + 0.3s particules)
- **Sons :** Commun=Clink, Peu Commun=Clink+résonance, Rare=Accord mineur, Légendaire=Accord majeur+basse
- **Haptic Android :** Patterns selon rareté

---

## 📁 Architecture Technique

```
src/
├── features/
│   ├── character/     → Personnage, layering, sprites
│   ├── exploration/   → Carte, lieux, événements
│   ├── combat/        → Résolution, animation
│   ├── economy/       → Or, dette, réputation
│   └── loot/          → Génération, reveal
├── shared/
│   ├── components/    → UI réutilisables
│   ├── hooks/         → Hooks React
│   └── utils/         → Helpers
├── store/
│   └── gameStore.ts   → Zustand store
├── data/
│   ├── items.json
│   ├── enemies.json
│   └── events.json
└── assets/
    ├── sprites/
    └── audio/
```

---

## 🎯 Piliers de Design

1. **Permadeath Significatif** — Chaque run compte
2. **Transformation Visuelle** — Voir son Soudard évoluer
3. **Pression Économique** — Dette qui monte = urgence
4. **Choix Moraux** — Pas de bonne réponse, que des conséquences
5. **Sessions Courtes** — 6-8 minutes

---

## 📝 État Actuel (Vertical Slice)

✅ **Fait :**
- Setup Vite + React + TypeScript + Zustand
- Store minimal (jour, dette, or, phase, actions)
- 3 écrans : Aube, Exploration, Crépuscule
- Boucle Jour 1 → Jour 2 fonctionnelle
- Événements simples (loot 70%, combat 30%)

🚧 **À faire :**
- Combat avec calculs ATK/DEF
- Inventaire et équipement
- Génération procédurale 5 lieux/jour
- Événements narratifs
- Sprites personnage
- Sauvegarde IndexedDB

---

## 🔑 Règles de Code

- **TypeScript strict** : Tous les types explicites
- **Zustand** : Store global unique
- **Mobile-first** : Touch events, responsive 360px+
- **Performance** : 60 FPS sur Snapdragon 450
- **PWA** : Offline-first, Service Worker
- **Accessibilité** : Formes pour raretés (daltonisme)

---

## 📚 Références

- **GDD complet :** `/docs/gdd.md`
- **Plan de développement :** `.cursor/plans/souda_blocs_testables_76020634.plan.md`
- **Prompts Pixellab :** `/docs/SOUDA_Pixellab_Prompts.md`

---

*Dernière mise à jour : Vertical Slice Jour 1*
