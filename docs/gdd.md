# SOUDA — Game Design Document Final

**Version 4.0 — Janvier 2026**

---

# I. VISION

## Pitch

**SOUDA** est un roguelite mobile où tu incarnes un Soudard — un déserteur devenu pilleur — qui doit survivre 20 jours dans une région ravagée par la guerre et rembourser 80 pièces d'or de dette. Si tu meurs ou si tu ne rembourses pas à temps : tu recommences de zéro.

Chaque pièce d'équipement transforme visuellement ton personnage. Chaque or compte. Chaque choix te change.

## Fiche Technique

| Élément | Détail |
|---------|--------|
| Genre | Roguelite / Loot collector grimdark |
| Plateforme | PWA (Mobile-first, Desktop supporté) |
| Session | 6-8 minutes |
| Durée d'une run | 20 jours in-game (~2-3 heures réelles) |
| Condition de victoire | Survivre 20 jours ET rembourser la dette |
| Condition de défaite | Mort en combat OU dette non remboursée au Jour 20 |
| Permadeath | Oui — échec = nouvelle run, on perd tout |
| Méta-progression | Unlocks permanents (équipements, origines) |

## Piliers de Design

1. **Permadeath Significatif** — Chaque run compte, chaque mort enseigne
2. **Transformation Visuelle** — Voir son Soudard évoluer pièce par pièce
3. **Pression Économique** — La dette qui monte crée l'urgence
4. **Choix Moraux** — Pas de bonne réponse, que des conséquences
5. **Sessions Courtes** — Respecter le temps du joueur

---

# II. UNIVERS

## La Longue Agonie — Contexte

**Il y a quatre ans**, les Trois Couronnes se sont entredéchirées pour des terres que plus personne ne voulait. Ce qui devait être une guerre de succession rapide s'est transformé en pourriture lente — récoltes brûlées, villages pillés, routes coupées, la peste qui suit les armées.

**Il y a neuf mois**, la guerre était déjà presque finie. Plus de grandes offensives, juste des escarmouches, des sièges qui s'éternisent, des compagnies qui fondent.

**Il y a trois mois**, les dernières batailles ont cessé. Pas par traité de paix, mais par épuisement total. Les armées se sont désintégrées. Les soldats qui restaient ont déserté.

**Aujourd'hui**, il ne reste que des Soudards.

## Les Soudards

Pas des héros. Pas des mercenaires avec un code d'honneur. **Des déserteurs professionnels.**

Ils pillent les ruines que les vivants ont abandonnées et que les morts ne défendent plus. Certains s'appellent encore "récupérateurs" pour dormir la nuit. Tous savent qu'ils ne sont que des charognards en armure cabossée.

## Bourg-Creux — Le Hub

Ancienne ville marchande à moitié abandonnée. Pas un sanctuaire — juste le dernier endroit où on peut échanger du loot contre du pain et où les égorgements se font dans les ruelles, pas en pleine rue.

**Population (~400 âmes) :**

| Groupe | Description |
|--------|-------------|
| Les Vétérans | Soudards depuis le début. Quatre hivers de guerre. Ne parlent plus beaucoup. |
| Les Recrues | Déserteurs récents, encore naïfs. La plupart meurent vite. |
| Les Sangsues | Marchands, usuriers, informateurs. S'enrichissent sur les morts. |
| Les Fantômes | Civils sans nulle part où aller. |

**Règles tacites :**
1. Pas de vol entre Soudards dans les murs
2. Les dettes se paient
3. On ne demande pas d'où tu viens

**Lieux :**
- **Taverne du Pendu** — Rumeurs, contacts, repos
- **Marché aux Charognes** — Vente/achat d'équipement
- **Échoppe de Morten** — L'usurier, remboursement de dette
- **Forge de Bertram** — Réparations

## Les Marches Mortes — Zone d'Exploration

Zone de no man's land au carrefour des trois royaumes effondrés.

**Types de lieux :**

| Type | Risque Typique | Richesse Typique | Description |
|------|----------------|------------------|-------------|
| Villages Fantômes | ⭐-⭐⭐ | 💰💰 | Abandonnés, portes encore ouvertes |
| Champs de Bataille | ⭐⭐-⭐⭐⭐ | 💰💰💰 | Armures rouillées, ossements |
| Fermes Abandonnées | ⭐-⭐⭐ | 💰 | Parfois des survivants hostiles |
| Monastères Pillés | ⭐⭐ | 💰💰💰💰 | Les moines sont partis |
| Ruines de Forts | ⭐⭐⭐-⭐⭐⭐⭐ | 💰💰💰💰 | Équipement militaire |
| Forêts | ⭐⭐ | 💰 | Déserteurs cachés, loups |
| Carrières | ⭐⭐-⭐⭐⭐ | 💰💰 | Outils, squatteurs |

**Ce qu'il n'y a PAS :** Magie, monstres surnaturels, malédictions. Juste des hommes.

## Ton Histoire

Tu étais soldat de ligne dans l'armée du Roi Gris. Quatre ans à marcher, creuser, tuer sur ordre.

**Il y a trois semaines**, ta compagnie a été massacrée près du Gué Noir. Tu as couru.

Tu as atteint Bourg-Creux avec :
- Une épée ébréchée
- Une armure de cuir usée
- **80 pièces d'or de dette** envers Morten l'Usurier

**Tu as 20 jours pour rembourser. Sinon, tu meurs.**

---

# III. STRUCTURE D'UNE RUN

## Vue d'Ensemble

```
RUN = 20 JOURS

Chaque JOUR :
├── AUBE (Camp) — 1-2 min
│   └── Équiper, Marché, Taverne, Usurier
├── JOURNÉE (Exploration) — 4-5 min
│   └── 3 actions, explorer des lieux
└── CRÉPUSCULE (Retour) — 1 min
    └── Résumé, +5💰 intérêts dette

JOUR 20 :
├── Dette remboursée → VICTOIRE
└── Dette non remboursée → DÉFAITE

MORT EN COMBAT (n'importe quand) → DÉFAITE

DÉFAITE = NOUVELLE RUN (on perd tout sauf les unlocks permanents)
```

## Jour 0 : Tutorial (Première run uniquement)

**Durée : 90 secondes**

**Séquence :**

1. **LA FUITE** (20s)
   - Écran noir, sons de bataille
   - *"Tu cours. Derrière toi, ta compagnie meurt."*
   - Tap to continue

2. **L'ARRIVÉE** (20s)
   - Arrivée à Bourg-Creux
   - Morten explique la dette
   - Highlight : Jour 1/20, Dette 80💰, Or 0💰

3. **ÉQUIPEMENT** (30s)
   - Le joueur équipe son épée de départ
   - Montrer le changement visuel + stats
   - *"Chaque pièce change ton apparence ET tes chances de survie."*

4. **PREMIÈRE EXPLORATION** (20s)
   - Un seul lieu disponible (⭐)
   - Le joueur explore, trouve 1 item
   - *"Demain, tu auras 3 actions. Utilise-les bien."*

→ **Jour 1 commence**

## Phase 1 : Aube — Le Camp

**Interface :**

```
┌─────────────────────────────────────────┐
│  JOUR 5/20          Dette: 100💰        │
│                     Or: 45💰            │
│                     Réputation: ⭐⭐⭐    │
├─────────────────────────────────────────┤
│                                         │
│         [SOUDARD - Vue équipé]          │
│              (64×64 pixels)             │
│                                         │
│    ATK: 12  DEF: 10  VIT: 5             │
├─────────────────────────────────────────┤
│ [ÉQUIPER]  [MARCHÉ]  [TAVERNE]          │
│ [USURIER]        [PARTIR EN MISSION →]  │
└─────────────────────────────────────────┘
```

**Actions :**

| Action | Description |
|--------|-------------|
| Équiper | Gérer inventaire, équiper/déséquiper items |
| Marché | Vendre loot, acheter équipement |
| Taverne | Parler aux PNJ, rumeurs, événements |
| Usurier | Rembourser dette (ou emprunter) |
| Partir | Lancer la phase Exploration |

## Phase 2 : Journée — Exploration

**Génération de carte :**
- 5 lieux générés procéduralement chaque jour
- Mix de types selon la zone
- Certains lieux persistent (ex: Fort Vaillant)

**Le joueur a 3 ACTIONS par jour.**

Chaque action = explorer 1 lieu.

**Sélection d'un lieu :**

```
┌─────────────────────────────────────────┐
│          FORT VAILLANT (Ruines)         │
├─────────────────────────────────────────┤
│  Risque: ⭐⭐⭐⭐                          │
│  Richesse: 💰💰💰💰                       │
├─────────────────────────────────────────┤
│  "La garnison a tenu six mois.          │
│   Personne ne sait ce qui les a         │
│   fait partir."                         │
├─────────────────────────────────────────┤
│       [EXPLORER]        [PASSER]        │
└─────────────────────────────────────────┘
```

**Types d'événements lors de l'exploration :**

| Type | Fréquence | Résultat |
|------|-----------|----------|
| Loot Direct | 40% | 1-3 items, pas de combat |
| Combat | 30% | Affrontement → Victoire/Défaite |
| Choix Narratif | 20% | Dilemme moral, conséquences variables |
| Lieu Vide | 10% | Déjà pillé, rien à récupérer |

## Phase 3 : Crépuscule — Retour

**Résumé automatique :**

```
┌─────────────────────────────────────────┐
│           JOUR 5 - RÉSUMÉ               │
├─────────────────────────────────────────┤
│  Lieux explorés: 3                      │
│  Combats: 1 (Victoire)                  │
│  Items trouvés: 4                       │
├─────────────────────────────────────────┤
│  NOUVEAU LOOT:                          │
│  [Épée] [Casque] [23💰] [Gants]         │
├─────────────────────────────────────────┤
│  Dette: 100💰 → 105💰 (+5 intérêts)     │
│                                         │
│            [CONTINUER]                  │
└─────────────────────────────────────────┘
```

**Ce qui se passe automatiquement :**
- +5💰 ajoutés à la dette (intérêts quotidiens)
- Événement du soir possible (30% de chance)

→ **Jour suivant**

---

# IV. SYSTÈME DE COMBAT

## Philosophie

Le combat est **auto-résolu** mais **visuellement satisfaisant**. Le joueur ne contrôle pas le combat en temps réel — il l'a préparé par ses choix d'équipement et de lieu.

## Déclenchement

Quand le joueur explore un lieu, probabilité de combat selon le risque :

| Risque | Probabilité |
|--------|-------------|
| ⭐ | 10% |
| ⭐⭐ | 25% |
| ⭐⭐⭐ | 45% |
| ⭐⭐⭐⭐ | 65% |
| ⭐⭐⭐⭐⭐ | 85% |

## Séquence de Combat (4 phases, ~5 secondes)

### Phase 1 : Anticipation (0.5s)

```
┌─────────────────────────────────────────┐
│              ⚔️ COMBAT !                │
│                                         │
│          DÉSERTEURS (×3)                │
│          ATK: 18  DEF: 12               │
│                                         │
│         "Ils t'ont repéré."             │
└─────────────────────────────────────────┘
```
*Vibration courte*

### Phase 2 : Résolution Visuelle (2s)

```
┌─────────────────────────────────────────┐
│     [Animation simplifiée]              │
│                                         │
│     💥 TOUCHÉ   🛡️ PARÉ   ⚔️ RIPOSTE   │
│                                         │
│     [Barres de vie qui bougent]         │
└─────────────────────────────────────────┘
```

### Phase 3 : Résultat (1.5s)

```
┌─────────────────────────────────────────┐
│         ✓ VICTOIRE COÛTEUSE             │
├─────────────────────────────────────────┤
│  "Leur chef t'a chargé.                 │
│   Tu as paré avec ton bouclier."        │
│                                         │
│  → Plastron: -15% durabilité            │
│    "Il a absorbé un coup vicieux."      │
│                                         │
│  💬 Sans ton casque, tu serais mort.    │
└─────────────────────────────────────────┘
```

### Phase 4 : Loot Reveal (1s+)

Animation de carte qui flip, son selon rareté.

## Calcul de Combat (en coulisses)

```
Puissance Joueur = (ATK × 0.5) + (DEF × 0.3) + (VIT × 0.2) + random(1-20)
Puissance Ennemi = (ATK × 0.5) + (DEF × 0.3) + (VIT × 0.2) + random(1-15)

Ratio = Puissance Joueur / Puissance Ennemi
```

| Ratio | Résultat | Conséquence |
|-------|----------|-------------|
| > 1.4 | Victoire Écrasante | Loot complet, aucun dégât |
| > 1.0 | Victoire | Loot complet, aucun dégât |
| > 0.7 | Victoire Coûteuse | Loot complet, -10 à -20% durabilité sur 1 item |
| > 0.4 | Fuite | Pas de loot, -15% durabilité sur 1-2 items |
| ≤ 0.4 | Défaite | **MORT — FIN DE RUN** |

## Messages "Near Miss"

Après un combat serré (ratio 0.7-1.1), afficher un message explicatif :
- *"Ta Défense (14) a bloqué leur attaque (13)."*
- *"Sans ton casque, tu serais mort."*
- *"Ton arme a fait la différence."*

**Objectif :** Le joueur comprend que son équipement L'A SAUVÉ.

## Types d'Ennemis

| Ennemi | ATK | DEF | VIT | Loot | Notes |
|--------|-----|-----|-----|------|-------|
| Bandits | 10 | 6 | 4 | Or, armes basiques | Communs |
| Déserteurs | 12 | 10 | 5 | Équipement militaire | Comme toi |
| Miliciens | 8 | 14 | 3 | Armures, peu d'or | Défensifs |
| Pillards Vétérans | 16 | 8 | 6 | Excellent loot | Dangereux |
| Loups | 8 | 4 | 10 | Fourrures | En meute |
| Squatteurs | 6 | 4 | 4 | Divers | Nombreux |

---

# V. SYSTÈME D'ÉQUIPEMENT

## Slots (7)

| Slot | Types | Impact Principal |
|------|-------|------------------|
| Tête | Casques, capuches | DEF |
| Torse | Armures | DEF majeur |
| Jambes | Jambières, pantalons | DEF, VIT |
| Mains | Gantelets, gants | ATK, DEF |
| Arme Principale | Épées, haches, masses | ATK majeur |
| Arme Secondaire | Boucliers, dagues | DEF ou ATK |
| Accessoire | Capes, ceintures | Effets spéciaux |

## Stats

| Stat | Effet |
|------|-------|
| ATK (Attaque) | Dégâts infligés en combat |
| DEF (Défense) | Protection reçue en combat |
| VIT (Vitesse) | Initiative, esquive |

## Raretés

| Rareté | Couleur | Forme | Bonus Stats | Propriétés |
|--------|---------|-------|-------------|------------|
| Commun | Gris | Cercle | Base | Aucune |
| Peu Commun | Vert | Carré | +15% | Aucune |
| Rare | Bleu | Losange | +30% | 1 propriété |
| Légendaire | Or | Étoile | +50% | 2 propriétés |

*Les formes servent à l'accessibilité (daltonisme).*

## Propriétés Spéciales

| Propriété | Effet |
|-----------|-------|
| Léger | +1 VIT |
| Lourd | -1 VIT, +2 DEF |
| Rouillé | -10% ATK, réparation -50% coût |
| Ensanglanté | +10% or trouvé |
| Béni | +2 DEF dans lieux sacrés |
| Volé | -1⭐ Réputation si équipé |
| Solide | Immunité dégradation (très rare) |

## Durabilité

**Philosophie :** Les objets sont robustes. Une épée ne s'émousse pas en une journée. La durabilité est **rare mais significative**.

**Quand un item perd de la durabilité :**

| Situation | Perte |
|-----------|-------|
| Combat normal (victoire) | Aucune |
| Victoire coûteuse | -10 à -20% sur 1 item |
| Fuite | -15% sur 1-2 items |
| Événement/Piège | -20% sur 1 item |
| Passage du temps | Aucune |

**Seuils :**

| Durabilité | État | Effet |
|------------|------|-------|
| 100-50% | Normal | Aucun malus |
| 50-25% | Abîmé | -20% efficacité stats |
| 25-1% | Endommagé | -50% efficacité, risque casse |
| 0% | Cassé | Inutilisable |

**Réparation :** Chez Bertram, coût = 20-40% valeur de l'item.

## Sets d'Équipement (3 sets au lancement)

### Set du Déserteur (3 pièces)
- **Pièces :** Capuche usée, Veste de cuir, Bottes de marche
- **Bonus :** +1 VIT, -10% coût logement
- *"L'équipement de ceux qui ont fui. Léger, discret, oubliable."*

### Set du Pillard (3 pièces)
- **Pièces :** Cagoule sombre, Gants souples, Dague dentelée
- **Bonus :** +15% or trouvé
- *"Certains ont fait du pillage un art."*

### Set du Vétéran (3 pièces)
- **Pièces :** Casque bosselé, Plastron de mailles, Épée d'ordonnance
- **Bonus :** +2 DEF, immunité "Peur"
- *"Quatre hivers. Et toujours debout."*

## Légendaires Mythiques (5 items uniques)

| Item | Type | Drop | Effet | Histoire |
|------|------|------|-------|----------|
| Lame du Dernier Roi | Épée | Champ bataille, <1% | +50% ATK vs Déserteurs, -1⭐ Réputation permanente | L'arme du Roi Gris |
| Heaume de Fer-Martyr | Casque | Fort Vaillant, <1% | Immunité Fuite, +30% DEF | Un général qui a refusé de fuir |
| Cape des Ombres | Accessoire | Monastère, <1% | Risque combat -20% | Tissée par les moines |
| Gantelets du Collecteur | Mains | Événement Morten | +25% or trouvé | D'un usurier assassiné |
| Bottes du Déserteur | Jambes | Aléatoire, <0.5% | +2 VIT, 10% action gratuite | Origine inconnue |

## Interface Équipement

**Comparaison obligatoire :**

```
┌─────────────────────────────────────────┐
│         ÉPÉE DENTELÉE (Rare)            │
├──────────────────┬──────────────────────┤
│    ÉQUIPÉ        │      NOUVEAU         │
│  Épée Ébréchée   │    Épée Dentelée     │
│  ATK: 8          │  ATK: 14 (+6) ✓      │
│  DUR: 65%        │  DUR: 100%           │
│                  │  +Saignement         │
├──────────────────┴──────────────────────┤
│      [ÉQUIPER]        [VENDRE 35💰]     │
└─────────────────────────────────────────┘
```

**Preview visuelle :** Avant d'équiper, le Soudard s'affiche avec le nouvel item en transparence.

---

# VI. ÉCONOMIE

## La Dette

| Élément | Valeur |
|---------|--------|
| Départ | 80💰 |
| Intérêts quotidiens | +5💰 |
| Jour 20 minimum | 175💰 |

**Progression de la dette :**

| Jour | Dette |
|------|-------|
| 1 | 80💰 |
| 5 | 100💰 |
| 10 | 125💰 |
| 15 | 150💰 |
| 20 | 175💰 |

**Jour 20, dette non remboursée = GAME OVER**

*"Les hommes de Morten te trouvent dans ton sommeil."*

## Sources de Revenus

| Source | Gains |
|--------|-------|
| Loot direct (or) | 5-30💰 par lieu |
| Vente items communs | 5-15💰 |
| Vente items peu communs | 15-30💰 |
| Vente items rares | 30-60💰 |
| Vente items légendaires | 80-150💰 |

**Prix de vente affectés par la Réputation.**

## Dépenses

| Dépense | Coût |
|---------|------|
| Logement (obligatoire) | 2💰/nuit |
| Réparation item | 20-40% valeur |
| Achat items (Marché) | Variable |

## Réputation (1-5 ⭐)

**Départ : ⭐⭐⭐**

| Réputation | Prix Achat | Prix Vente | Effets |
|------------|------------|------------|--------|
| ⭐ | +40% | -40% | Marchands hostiles |
| ⭐⭐ | +20% | -20% | Méfiance |
| ⭐⭐⭐ | Normal | Normal | Neutre |
| ⭐⭐⭐⭐ | -10% | +10% | Accès contrats |
| ⭐⭐⭐⭐⭐ | -20% | +20% | Alliés, fins spéciales |

**Gagner :** Aider PNJ, compléter contrats, choix moraux positifs
**Perdre :** Vol, cruauté, équiper items "volés", ignorer dettes

## Stratégie Économique Type

Pour survivre, le joueur doit gagner en moyenne **~10💰/jour net** pour rembourser.

```
Revenus moyens par jour : 30-50💰 (3 explorations)
Dépenses fixes : 2💰 (logement) + 5💰 (intérêts) = 7💰
Dépenses variables : 0-20💰 (réparations)
Net moyen : 15-40💰

Sur 20 jours : 300-800💰 gagnés
Besoin minimum : 175💰 + dépenses = ~250💰
```

Le joueur a de la marge, mais pas de gaspillage possible.

---

# VII. ÉVÉNEMENTS NARRATIFS

## Choix lors de l'Exploration

**Exemple type :**

```
┌─────────────────────────────────────────┐
│              RENCONTRE                  │
├─────────────────────────────────────────┤
│  Un homme en haillons se cache.         │
│  Il serre un coffret contre lui.        │
│                                         │
│  "C'était à ma femme. Elle est morte    │
│   sur la route. Je n'ai plus rien."     │
├─────────────────────────────────────────┤
│  [PRENDRE LE COFFRET]                   │
│    → +15💰, -1⭐ Réputation             │
│    → Il s'en va. Tu ne le revois jamais.│
│                                         │
│  [LUI DONNER DE L'EAU]                  │
│    → Rien immédiatement                 │
│    → +1⭐ Réputation                    │
│    → Il s'appelle Edric. Tu le reverras │
│      peut-être.                         │
│                                         │
│  [PARTIR]                               │
│    → Rien ne se passe                   │
└─────────────────────────────────────────┘
```

## Événements Récurrents

### La Rumeur du Convoi (Jour 4-6)
Un marchand mort transportait quelque chose. Choix :
- Chercher seul (risque ⭐⭐⭐⭐, récompense totale)
- Proposer alliance (risque partagé, récompense partagée)
- Vendre l'info (20💰 immédiat)

### Les Collecteurs (Jour 12+, si dette > 80💰)
Les hommes de Morten te trouvent. Combat forcé.
- Victoire : Ils repartent (pour l'instant)
- Défaite : Ils prennent un item en "acompte"

### La Peste (Jour 10+, 15% de chance)
Un lieu est infecté.
- Explorer : Risque maladie (-1 action pendant 2 jours)
- Ignorer : Lieu inaccessible

### Le Marchand Mystérieux (1 fois par run, Jour 7-15)
Vend des items puissants à prix dérisoire. Piège ou opportunité ?

## Monologues Intérieurs

**Fréquence :** Maximum 1 par jour, pas systématique

**Déclencheurs :**
- Après un choix moral
- Au retour au camp (20% de chance)
- Jours clés (5, 10, 15)

**Exemples :**

```
[Jour 1, premier retour]
"Bourg-Creux. Des murs. Un toit.
Ça fera l'affaire. Pour l'instant."

[Après avoir pillé un cadavre du Roi Gris]
"C'était peut-être quelqu'un que je connaissais.
Je n'ai pas regardé son visage."

[Jour 10, si dette > 100💰]
"Morten sourit toujours.
C'est ce qui me fait peur."
```

## Compteurs Cachés

Le jeu trace les choix du joueur :

| Compteur | Incrémenté par | Impact |
|----------|----------------|--------|
| Cynisme | Choix cruels, équipement volé | Monologues sombres, fins "Seigneur" |
| Humanité | Aider PNJ, sacrifices | Monologues réflexifs, fins "Rédemption" |
| Pragmatisme | Choix neutres, efficacité | Peu de monologues, fin "Fantôme" |

---

# VIII. PERSONNAGES

## Morten l'Usurier

**Rôle :** Créancier, antagoniste principal

Ancien marchand qui a compris que l'or survivrait à la guerre. Petit, chauve, yeux de fouine, doigts couverts de bagues. Il sourit toujours.

**Arc relationnel :**

| Jours | Si Paiement Régulier | Si Aucun Paiement |
|-------|----------------------|-------------------|
| 1-5 | Cordial, professionnel | Cordial, professionnel |
| 6-10 | *"Tu es sérieux. J'aime ça."* | *"Je m'inquiète pour toi."* |
| 11-15 | Propose un investissement | Envoie des collecteurs |
| 16-19 | *"On va faire de bonnes affaires."* | *"Dernière chance."* |
| 20 | Partenariat possible | Confrontation finale |

**Événement unique (Jour 8-12, relation neutre+) :**

```
Tu croises Morten seul à la taverne.
Il regarde le feu. Il ne sourit pas.

"J'avais un fils. Ton âge.
Mort au Gué Noir."

"..."

"Rembourse-moi. C'est tout ce que je demande."

[Il part sans attendre de réponse]
```

## Gareth le Borgne

**Rôle :** Mentor potentiel, allié ou ennemi

Vétéran. Vraiment vétéran. Œil perdu au siège de Hautefort, bras gauche qui ne fonctionne plus. Boit plus qu'il ne mange. Connaît les Marches comme personne.

**Apparitions :**
- Jour 3-5 : Propose une info gratuite
- Jour 8-10 : Propose une mission ensemble (50/50 partage)
- Jour 15+ : Son sort dépend des choix précédents

## Bertram le Forgeron

**Rôle :** Artisan, réparateur

Ancien armurier du Roi Gris. Ne parle pas beaucoup.

**Services :**
- Réparation : 20-40% valeur item
- Parfois, pièces rares à vendre

## Sœur Margaux

**Rôle :** Conscience morale

Ancienne religieuse du Monastère de l'Aube. Refuse de partir. Soigne les blessés sans juger.

**Ce qu'elle offre :**
- Soins (gratuits, mais elle se souvient)
- Infos sur les lieux "bénis"
- Une autre perspective

---

# IX. CONDITIONS DE FIN

## Victoire (Jour 20, dette remboursée)

| Fin | Conditions | Description |
|-----|------------|-------------|
| **Le Seigneur** | Réputation ⭐⭐⭐⭐⭐ + Or > 200💰 | Tu prends le contrôle de Bourg-Creux |
| **Le Marchand** | Or > 300💰 | Tu ouvres ton commerce. Tu es devenu Morten. |
| **Le Rédempteur** | Humanité élevée | Tu quittes Bourg-Creux pour aider ailleurs |
| **Le Fantôme** | Réputation ⭐-⭐⭐ | Tu disparais une nuit. Personne ne demande où. |
| **Le Survivant** | Standard | Tu as survécu. C'est déjà beaucoup. |

## Défaite

| Fin | Condition | Description |
|-----|-----------|-------------|
| **La Dette de Sang** | Jour 20, dette non payée | Morten envoie ses hommes |
| **La Fuite** | Jour 20, dette non payée, Réputation ⭐⭐⭐⭐+ | Un allié te prévient. Tu fuis. |
| **Mort au Combat** | 0 PV / Ratio combat ≤ 0.4 | Tu tombes les armes à la main |

## Après une Défaite

**PERMADEATH : Tout est perdu.**

- Or : Perdu
- Équipement : Perdu
- Progression narrative : Perdue
- Réputation : Reset à ⭐⭐⭐

**Ce qui est CONSERVÉ (unlocks permanents) :**
- Origines débloquées
- Items ajoutés au pool de loot
- Défis complétés
- Hall of Fame (historique des runs)

---

# X. MÉTA-PROGRESSION

## Unlocks Permanents

### Nouvelles Origines

| Origine | Condition | Bonus | Malus |
|---------|-----------|-------|-------|
| Déserteur | Défaut | Équilibré | — |
| Vétéran | 1 victoire | +2 DEF départ | Départ avec -10💰 |
| Pillard | 50 items volés (total) | +1 VIT départ | Réputation départ ⭐⭐ |
| Ancien Moine | 5 églises pillées (total) | Items bénis +fréquents | Malus moral |

### Nouveaux Items dans le Pool

| Condition | Unlock |
|-----------|--------|
| Atteindre Jour 5 | Armes "lourdes" |
| Atteindre Jour 10 | Armures "plates" |
| Survivre 20 jours | Items légendaires |
| Compléter défi X | Item spécifique |

### Défis Permanents

| Défi | Condition | Récompense |
|------|-----------|------------|
| Premier Sang | Gagner 1 combat | Trait "Survivant" (+5% DEF) |
| Le Comptable | Rembourser avant Jour 15 | Origine "Le Prudent" |
| Charognard | Collecter 100 items (total) | +10 items dans le pool |
| Solitaire | Terminer sans aide PNJ | Trait "Indépendant" |
| Le Pacifiste | Atteindre Jour 10 sans combat | Origine "L'Esquiveur" |
| Fortune | 500💰 en une run | Set "Le Marchand" |

### Hall of Fame

Enregistrement permanent de chaque run :
- Nom du Soudard
- Jours survécus
- Équipement final (capture visuelle)
- Cause de mort / Type de victoire
- Or total accumulé
- Réputation finale

---

# XI. DIRECTION ARTISTIQUE

## Style Visuel

**Pixel Art 64×64**

**Inspirations :** Battle Brothers, Darkest Dungeon, Diablo 1

**Palette :**
- Base : Bruns (terre, cuir), Gris (métal, pierre), Ocres
- Accents : Rouge sombre (sang), Vert terne (mousse), Bleu acier
- Raretés : Gris → Vert → Bleu → Or

**Principes :**
- Silhouettes lisibles même en petit
- Dégradation visible (rouille, sang, usure)
- Pas de brillant, pas de magie — tout est sale

## Layering du Soudard

7 couches superposées :
1. Corps (base)
2. Jambes
3. Torse
4. Tête
5. Mains
6. Arme
7. Accessoire

**Optimisation :** Pré-render des combinaisons fréquentes (cache LRU, max 100).

## Loot Reveal

**Séquence (1.5s total) :**
1. Carte face cachée (0.3s)
2. Tremblement suspense (0.5s)
3. Flip avec ease-out (0.4s)
4. Particules selon rareté (0.3s)

**Sons par rareté :**
- Commun : Clink métallique bref
- Peu Commun : Clink + résonance
- Rare : Accord mineur, réverbération
- Légendaire : Accord majeur + basse profonde

**Haptic (Android) :**
- Commun : [10ms]
- Peu Commun : [30ms]
- Rare : [50ms, 30ms, 50ms]
- Légendaire : [100ms, 50ms, 100ms, 50ms, 200ms]

## Audio

**Musique :**
- Camp : Feu qui craque, murmures, guitare mélancolique
- Exploration : Tension basse, vent
- Combat : Percussion montante

**SFX prioritaires :**
- Loot reveal (4 variations)
- Équipement (métal, cuir)
- Combat (épées, impacts)
- UI (parchemin, pièces)

---

# XII. TECHNIQUE

## Stack

| Technologie | Usage |
|-------------|-------|
| React 18 | UI |
| TypeScript | Typage |
| Vite | Build |
| Zustand | State management |
| Canvas API | Rendu Soudard |
| IndexedDB (idb-keyval) | Sauvegarde |
| Workbox | PWA / Service Worker |

## Architecture

```
src/
├── features/
│   ├── character/
│   │   ├── CharacterView.tsx
│   │   ├── SpriteCache.ts
│   │   └── equipment.types.ts
│   ├── exploration/
│   │   ├── MapScreen.tsx
│   │   └── exploration.logic.ts
│   ├── combat/
│   │   ├── CombatResolver.ts
│   │   └── CombatAnimation.tsx
│   ├── economy/
│   │   ├── DebtTracker.tsx
│   │   └── economy.logic.ts
│   └── loot/
│       ├── LootReveal.tsx
│       └── loot.generator.ts
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── store/
│   └── gameStore.ts
├── data/
│   ├── items.json
│   ├── enemies.json
│   └── events.json
└── assets/
    ├── sprites/
    ├── audio/
    └── fonts/
```

## Sauvegarde

```json
{
  "version": "1.0",
  "savedAt": 1704067200000,
  "run": {
    "day": 5,
    "debt": 100,
    "gold": 45,
    "reputation": 3,
    "equipment": {
      "head": "helmet_rusty",
      "torso": "armor_leather"
    },
    "inventory": [],
    "flags": {
      "metGareth": true,
      "mortenEvent": false
    },
    "counters": {
      "cynicism": 2,
      "humanity": 5,
      "pragmatism": 3
    }
  },
  "unlocks": {
    "origins": ["deserter", "veteran"],
    "items": ["heavy_weapons"],
    "challenges": ["first_blood"]
  },
  "hallOfFame": []
}
```

## Performance

**Cible :** 60 FPS sur Snapdragon 450

**Optimisations :**
- Cache sprites composite (LRU, max 100)
- Pas de re-render inutile (React.memo)
- Assets compressés
- Lazy loading audio

---

# XIII. MODÈLE ÉCONOMIQUE

## Choix : Premium avec Démo

| Version | Contenu | Prix |
|---------|---------|------|
| Démo | Jours 1-5, équipement limité | Gratuit |
| Complète | 20 jours, tout le contenu | 4,99€ |

**Pourquoi :**
- Cohérent avec le ton hardcore
- Pas de F2P mechanics à développer
- Communauté engagée
- Éthique

**Conversion cible :** 5-8%

---

# XIV. PLANNING

| Phase | Durée | Contenu |
|-------|-------|---------|
| Phase 1 | 4 sem | Prototype (1 jour jouable, layering, combat) |
| Phase 2 | 10 sem | MVP (20 jours, 30 items, 3 sets, onboarding) |
| Phase 3 | 5 sem | Polish (audio, animations, balance, 5 événements) |
| Buffer | 2 sem | Bugs, imprévus |
| **Total** | **21 sem** | ~5 mois |

---

# XV. MÉTRIQUES

| Métrique | Cible |
|----------|-------|
| Rétention J1 | > 40% |
| Rétention J7 | > 20% |
| Complétion 20 jours | 5-10% |
| Session moyenne | 6-8 min |
| Replay après mort | > 30% |
| Conversion démo → achat | 5-8% |

---

# XVI. CHECKLIST

## Avant Prototype
- [ ] Style pixel art validé (1 Soudard, 3 équipements)
- [ ] Prototype Loot Reveal
- [ ] Setup technique complet
- [ ] 10 items définis

## Avant MVP
- [ ] 30 items avec stats
- [ ] 3 sets complets
- [ ] 5 Légendaires Mythiques
- [ ] Onboarding Jour 0
- [ ] Combat visuel (4 phases)
- [ ] Test Android bas de gamme

## Avant Launch
- [ ] 20 playtesters externes
- [ ] Balance économique validée
- [ ] Toutes les fins
- [ ] Audio complet
- [ ] Localisation FR/EN

---

# ANNEXE : GLOSSAIRE

| Terme | Définition |
|-------|------------|
| Soudard | Mercenaire-pilleur, ancien soldat devenu charognard |
| Bourg-Creux | Ville-refuge, hub du joueur |
| Les Marches Mortes | Région d'exploration |
| La Longue Agonie | Les 4 ans de guerre |
| Les Trois Couronnes | Les royaumes en guerre |
| Récupérateur | Euphémisme pour pilleur |
| Run | Une partie complète (20 jours ou mort) |
| Permadeath | Mort = recommencer de zéro |

---

# ANNEXE : EXEMPLE DE RUN COMPLÈTE

## Jour 1
- Réveil à Bourg-Creux, dette 80💰
- Exploration : Village fantôme (⭐), Ferme (⭐), Forêt (⭐⭐)
- Loot : Épée peu commune, 18💰, Casque commun
- Fin de journée : Dette 85💰, Or 16💰

## Jour 5
- Dette 100💰, Or 52💰
- Gareth propose une info sur le Fort Vaillant
- Exploration plus risquée, meilleur loot
- Combat contre des Déserteurs → Victoire coûteuse

## Jour 10
- Dette 125💰, Or 89💰
- Morten commence à s'impatienter
- Set du Pillard presque complet
- Événement : Réfugié (choix moral)

## Jour 15
- Dette 150💰, Or 134💰
- Collecteurs de Morten → Combat forcé
- Légendaire trouvé (Cape des Ombres)
- Course contre la montre

## Jour 20
- Dette 175💰
- **Option A :** Or ≥ 175💰 → Rembourse → VICTOIRE
- **Option B :** Or < 175💰 → DÉFAITE → Nouvelle run

---

**Document Final v4.0**
**Prêt pour production**

*"Tu es un déserteur qui pille les ruines d'une guerre oubliée. 20 jours pour rembourser tes dettes ou mourir. Chaque run transforme ton Soudard. Meurs. Apprends. Recommence."*
