# SOUDA: Terra Incognita
## Game Design Document v0.1 - Prototype "La Traversée"

---

# TABLE DES MATIÈRES

1. [Vision Générale](#vision-générale)
2. [Piliers de Design](#piliers-de-design)
3. [Le Monde - Les Terres Oubliées](#le-monde)
4. [Carte du Prototype](#carte-du-prototype)
5. [Système de Cartes](#système-de-cartes)
6. [Mécaniques Core](#mécaniques-core)
7. [Types d'Ennemis](#types-dennemis)
8. [Système d'Événements](#système-dévénements)
9. [Le Hub - Auberge du Carrefour](#le-hub)
10. [Boucle de Jeu Typique](#boucle-de-jeu-typique)
11. [Progression](#progression)
12. [Interface Utilisateur](#interface-utilisateur)
13. [Échange de Cartes Physiques IRL](#échange-de-cartes-physiques-irl)
14. [Paramètres Techniques](#paramètres-techniques)
15. [Plan de Test](#plan-de-test)
16. [Critères de Succès](#critères-de-succès)
17. [Timeline](#timeline)
18. [Stack Technique Proposée](#stack-technique-proposée)

---

<a name="vision-générale"></a>
# 1. VISION GÉNÉRALE

## High Concept

**"Un idle dungeon crawler low fantasy où tu guides un mercenaire explorant un pays ravagé, cartographiant un monde dangereux tuile par tuile, collectant des cartes d'équipement, dans un univers inspiré de La Compagnie Noire."**

## Objectif du Prototype v0.1

**Valider le core loop d'exploration low fantasy avec gestion de ressources et combat tactique.**

- Pas de boss, pas de "win condition" claire
- Juste : survivre, explorer, accumuler, revenir au hub
- **Le jeu = une balade dangereuse dans un monde post-guerre**
- Durée de jeu visée : 30-45 minutes par session

## Ce Qu'on Teste

1. ✅ Le déplacement entre tuiles est-il satisfaisant?
2. ✅ Le système de poids/cartes limité crée-t-il des choix intéressants?
3. ✅ Le combat simple (ATK/DEF/FLEE) est-il tendu?
4. ✅ Le loot donne-t-il envie de continuer?
5. ✅ Le retour au hub est-il un moment satisfaisant?
6. ✅ Comprend-on que c'est une "balade", pas un jeu à "gagner"?

---

<a name="piliers-de-design"></a>
# 2. PILIERS DE DESIGN

## 1. Exploration Organique
- Découverte lente d'un monde par tuiles connectées
- Navigation médiévale réaliste (pas de GPS)
- Fog of war personnel (ce que TU as exploré)
- Chaque tuile a sa personnalité

## 2. Dualité AFK/Actif (pour versions futures)
- Le mercenaire survit seul en AFK
- Mais progresse mieux quand tu le contrôles
- Prototype v0.1 : 100% actif, on teste le core

## 3. Gestion de Ressources Tendue
- Faim constante (timer permanent)
- Poids limité (choix durs sur quoi garder)
- HP précieux (pas de regen auto)
- Argent rare (chaque pièce compte)

## 4. Combat Simple mais Tactique
- Trois actions : ATK / DEF / FLEE
- 100% déterministe (pas de RNG damage)
- La fuite est une stratégie légitime
- Patterns ennemis lisibles

## 5. Brutalité Gratifiante
- Le monde est dur, hostile
- Victoires rares donc précieuses
- Survie = accomplissement
- Mais avec des "bulles de bonheur" rares

## 6. Low Fantasy Authentique
- Pas de magie, pas de monstres
- Bandits, loups, mercenaires rivaux
- Équipement réaliste (fer, cuir, maille)
- Ton sombre mais pas désespéré

---

<a name="le-monde"></a>
# 3. LE MONDE - LES TERRES OUBLIÉES

## Contexte Narratif

Après 20 ans de guerre civile, le Royaume de Valdara est en ruines. Les seigneurs sont morts ou en fuite, les villages brûlés, les routes infestées de bandits et de déserteurs. 

Tu es un mercenaire sans nom qui débarque dans ces terres, sans attaches, cherchant fortune dans le chaos.

## Atmosphère

- **95% du temps :** Sale, brutal, désespéré
  - Routes boueuses
  - Villages en cendres
  - Voyageurs méfiants
  - Faim constante
  - Danger latent

- **5% du temps :** Moments de beauté rare
  - Un feu partagé avec d'autres voyageurs
  - Un village encore debout
  - Un coucher de soleil sur les collines
  - Du pain frais chaud
  - Une nuit sans danger

**Ces moments rares sont puissants par contraste.**

## Pas de Magie, Pas de Monstres

**Ennemis :**
- Bandits et déserteurs
- Mercenaires rivaux
- Bêtes sauvages (loups, chiens)
- Soldats corrompus
- Patrouilles dangereuses

**Dangers :**
- Faim et soif
- Blessures et maladies
- Embuscades
- Pièges abandonnés
- Météo hostile (futures versions)

---

<a name="carte-du-prototype"></a>
# 4. CARTE DU PROTOTYPE (15 Tuiles)

## Layout Géographique

```
    [R]--[F]--[C]
     |    |    |
    [P]--[H]--[F]--[R?]
     |    |    |    |
    [F]--[P]--[C]--[?]
     |              |
   [V-A]----------[?]

Légende:
[H]   = Hub (Auberge du Carrefour) - SPAWN POINT
[P]   = Plaine
[F]   = Forêt
[C]   = Collines
[R]   = Ruines
[V-A] = Village Abandonné
[?]   = Brouillard (non encore exploré)
```

## Particularités

- **Tu commences AU HUB** (l'auberge)
- Les tuiles `[?]` se révèlent quand tu arrives à leur frontière
- Pas de destination finale, juste l'exploration
- Certaines tuiles ont des "élites" (mercenaires, meutes, chefs de patrouille)
- Chaque tuile est à 1-2h de marche (in-game) de ses voisines

## Types de Terrain

### Plaine
- **Description :** Herbes hautes, vue dégagée
- **Vitesse :** Normale (1h de marche)
- **Danger :** Faible à moyen
- **Contenu typique :** Bandits solitaires, voyageurs, trouvailles rares

### Forêt
- **Description :** Arbres denses, peu de lumière
- **Vitesse :** Lente (2h de marche)
- **Danger :** Moyen
- **Contenu typique :** Loups, meutes, campements cachés

### Collines
- **Description :** Terrain rocailleux, panoramas
- **Vitesse :** Lente (2h de marche)
- **Danger :** Moyen
- **Contenu typique :** Caches de contrebandiers, mercenaires, vue sur zones adjacentes

### Ruines
- **Description :** Structures anciennes effondrées
- **Vitesse :** Normale (1h de marche)
- **Danger :** Élevé
- **Contenu typique :** Élites, meilleur loot, événements narratifs

### Village Abandonné
- **Description :** Bâtiments déserts, atmosphère oppressante
- **Vitesse :** Normale (1h de marche)
- **Danger :** Variable
- **Contenu typique :** Loot multiple, événements narratifs, quêtes informelles

---

<a name="système-de-cartes"></a>
# 5. SYSTÈME DE CARTES

## Philosophie

**Les cartes représentent tout ce qui compose le mercenaire :**
- Son équipement physique
- Ses compétences acquises
- Ses items consommables
- Ses provisions

**Important :** Pas un card battler, mais un **inventory system sous forme de cartes**.

## Deck de Départ (10 Cartes)

```
═══════════════════════════════════════
TON ÉQUIPEMENT DE DÉPART
═══════════════════════════════════════

ARME ÉQUIPÉE:
🗡️ Épée Rouillée
   ATK: 3 | Poids: 1kg
   "Lame émoussée. Elle a connu des jours meilleurs."

ARMURE ÉQUIPÉE:
🧥 Vêtements de Voyage
   DEF: 1 | Poids: 1.5kg
   "Tissu épais, rapiécé. Mieux que rien."

COMPÉTENCE:
👁️ Vigilant
   Poids: 0kg
   "Tu as appris à lire les signes du danger."
   Effet: Vois dangers 1 tuile à l'avance

PROVISIONS (7):
🍞 Pain Sec x4
   +1 jour faim | 0.3kg chacun
   
💊 Bandage Sale x2
   +20 HP | 0.2kg chacun
   
💰 5 pièces de cuivre
   0kg

═══════════════════════════════════════
STATS INITIALES
═══════════════════════════════════════
HP: 100/100
Faim: 4 jours
Poids: 4.2kg / 10kg
ATK: 3 (arme)
DEF: 1 (armure)
```

## Catégories de Cartes

### Armes

| Nom | ATK | Poids | Prix | Particularités |
|-----|-----|-------|------|----------------|
| Dague Rapide | 3 | 0.5kg | 15p | Légère, rapide |
| Épée Rouillée | 3 | 1kg | — | Starter |
| Épée Longue | 5 | 2kg | 35p | Équilibrée |
| Hache de Guerre | 7 | 3.5kg | 60p | Lourde, puissante |
| Arc Court | 4 | 1kg | 45p | Range, esquive facile |

### Armures

| Nom | DEF | Poids | Prix | Particularités |
|-----|-----|-------|------|----------------|
| Vêtements | 1 | 1.5kg | — | Starter |
| Gambeson | 2 | 2kg | 25p | Bon rapport DEF/poids |
| Maille Légère | 3 | 3.5kg | 50p | Solide |
| Cuirasse | 5 | 5kg | 100p | Maximum protection |

### Compétences (Passives)

| Nom | Effet | Prix |
|-----|-------|------|
| Vigilant | Vois dangers 1 tuile à l'avance | Starter |
| Traqueur | Lis traces (âge, nombre ennemis) | 30p |
| Négociateur | Unlock dialogues, -20% prix | 40p |
| Résistant | +20 HP max permanent | 50p |

### Items Consommables

| Nom | Effet | Poids | Prix |
|-----|-------|-------|------|
| Pain Sec | +1 jour faim, +5 HP | 0.3kg | 2p |
| Pain Frais | +1 jour faim, +10 HP | 0.3kg | 3p |
| Viande Séchée | +2 jours faim, +15 HP | 0.5kg | 6p |
| Bandage Sale | +20 HP | 0.2kg | 3p |
| Bandage Propre | +30 HP | 0.2kg | 5p |
| Carte Partielle | Révèle 3 tuiles | 0kg | 20p |

### Items Permanents

| Nom | Effet | Poids | Prix |
|-----|-------|-------|------|
| Sac Renforcé | +3kg max poids | — | 40p |
| Boussole | Empêche se perdre | 0.2kg | 25p |

## Contrainte : Changement Uniquement au Hub

**RÈGLE CRITIQUE :**

Les cartes équipées (arme, armure, compétences) peuvent **SEULEMENT** être changées :
- Dans les hubs (auberges, villages)
- Pas en pleine exploration
- Pas pendant les voyages
- Pas en combat

**Pourquoi cette contrainte :**
- Force la planification avant départ
- Crée tension ("j'aurais dû prendre l'armure lourde...")
- Rend le retour au hub satisfaisant (moment d'optimisation)
- Augmente la valeur du loot trouvé (anticipation du retour)

**Exemple :**
```
[Tu explores avec équipement léger]
[Tu trouves une Hache de Guerre]
→ "Hache ajoutée à l'inventaire"
→ TU NE PEUX PAS l'équiper maintenant
→ Elle pèse dans ton sac (+3.5kg)
→ Tu dois retourner au hub pour l'équiper
```

---

<a name="mécaniques-core"></a>
# 6. MÉCANIQUES CORE

## 1. La Faim (Timer Permanent)

### Système

```
FAIM = Compte à rebours constant

Chaque heure de jeu (in-game) : Faim -0.5 jour

États:
- Faim > 2 jours  : Normal
- Faim 1-2 jours  : "Affamé" (-10% ATK)
- Faim < 1 jour   : "Famélique" (-20% ATK, -20% DEF)
- Faim = 0        : Perd 5 HP/heure jusqu'à mort
```

### Solutions

- **Manger du pain** : +1 jour faim
- **Chasser des loups** : viande = +2 jours faim
- **Acheter au hub** : nourriture variée
- **Trouver provisions** : dans le monde
- **Événements** : feu de camp partagé, fermes

### Design Intent

La faim crée une **tension permanente** :
- Tu ne peux pas explorer infiniment
- Tu dois retourner au hub régulièrement
- Ou prendre des risques (manger nourriture douteuse)
- Chaque heure compte

## 2. Le Poids (Choix Constant)

### Système

```
POIDS MAX = 10kg de base
(Upgradable à 13kg avec Sac Renforcé)

Tout compte:
- Armes (0.5-3.5kg)
- Armures (1.5-5kg)
- Items (0.1-0.5kg chacun)
- Loot trouvé

Si poids > max:
→ Vitesse -50% (voyages 2x plus longs)
→ Combat: -1 ATK, -1 DEF (encombré)
```

### Stratégies

- **Optimiser deck** avant départ (choix arme légère vs puissante)
- **Laisser loot** derrière si nécessaire (choix douloureux)
- **Retour hub** pour vider inventaire
- **Upgrade sac** (investissement long-terme)

### Design Intent

Le poids crée des **choix difficiles** :
- "Je prends la hache puissante ou je garde de la place pour le loot?"
- "Je laisse cette armure rare ici et je reviens?"
- "Je suis plein mais j'ai trouvé quelque chose de mieux..."

**C'est le cœur du gameplay de gestion.**

## 3. Le Combat (Simple mais Tactique)

### Format

**Tour par Tour - Déterministe**

### Actions du Joueur

#### [1] ATTAQUER
```
Dégâts = ton ATK - DEF ennemi (minimum 1)

Exemple:
Ton ATK: 5
Ennemi DEF: 2
→ Tu fais 3 dégâts (toujours, pas de RNG)
```

#### [2] DÉFENDRE
```
Ce tour : Dégâts reçus / 2
Prochain tour : +1 ATK (contre-attaque)

Usage stratégique:
- Si ennemi attaque fort ce tour
- Pour setup un gros coup au tour suivant
- Économiser HP dans combats longs
```

#### [3] FUIR
```
Test : Ta vitesse vs leur vitesse
Basé sur poids transporté et type ennemi

Succès : Combat terminé, aucune perte
Échec : Prends 1 coup gratuit, puis retry ou combat

Chances typiques:
- Vs Loup : 70% (rapide)
- Vs Bandit : 60% (moyen)
- Vs Mercenaire lourd : 80% (lent)
- Vs Meute : 40% (te poursuivent)
```

### Patterns Ennemis (Prévisibles)

**IMPORTANT :** Les ennemis suivent des patterns fixes, lisibles.

```
Bandit Solitaire:
Tour 1: Attaque
Tour 2: Attaque
Tour 3: Attaque
(Attaque constante, prévisible)

Loup:
Tour 1: Attaque
Tour 2: Attaque
Tour 3: Recule (ne fait rien)
Tour 4: Attaque
(Pattern 2 attaques + repos)

Mercenaire Rival:
Tour 1: Attaque
Tour 2: Défendre
Tour 3: Attaque
Tour 4: Défendre
(Alterne, stratégique)

Chef de Patrouille:
Si HP > 60%: Attaque
Si HP 30-60%: Alterne Attaque/Défendre
Si HP < 30%: Défendre puis tente Fuir
(Adaptatif selon HP)
```

### Déterminisme Total

**ZÉRO RNG dans les calculs de dégâts.**

```
AVANT (mauvais design):
"Tu attaques → 10-20 dégâts (random)"

APRÈS (bon design):
"Tu attaques → 15 dégâts (fixe)"
"Avec modificateurs → 18 dégâts (fixe)"

Même situation = même outcome si mêmes inputs.
```

**Pourquoi :** Le joueur peut **calculer mentalement** :
- "J'ai 50 HP, il fait 6 dmg/tour, je peux tenir 8 tours"
- "Il a 40 HP, je fais 5 dmg/tour, je gagne en 8 tours"
- "Je peux gagner mais je vais finir à ~10 HP, risqué"

**Le skill = savoir faire ces calculs et prendre les bonnes décisions.**

### Design Intent

Combat simple en apparence mais avec **profondeur tactique** :
- Patterns lisibles = apprendre par observation
- DÉFENDRE = timing crucial
- FUIR = option stratégique (pas une honte)
- Calculs déterministes = skill-based, pas chance-based

---

<a name="types-dennemis"></a>
# 7. TYPES D'ENNEMIS

## Communs (70% des rencontres)

### 🐺 Loup Errant

```
HP: 40
ATK: 4
DEF: 0

Pattern: 
Attaque x2 → Recule x1 (répète)

Loot:
- 🥩 Viande de Loup (50%) → +2 jours faim
- 🦴 Peau de Loup (30%) → Vends 5p

Dangerosité: ⚠️ Faible
Combat type: 8-10 tours
HP perdus: ~20-30 HP (si bien joué)

Stratégie:
- Facile seul
- Patterns prévisible
- Défendre tour 3 (il ne fait rien)
```

### 🗡️ Bandit Solitaire

```
HP: 60
ATK: 5
DEF: 1

Pattern:
Attaque constante

Loot:
- 💰 3-8 pièces (100%)
- 🗡️ Arme basique (40%)

Dangerosité: ⚠️⚠️ Moyen
Combat type: 10-15 tours
HP perdus: ~30-40 HP

Stratégie:
- Attaque agressive
- Utiliser DÉFENDRE stratégiquement
- Finir vite avant de perdre trop HP
```

## Élites (20% des rencontres)

### ⚔️ Mercenaire Rival

```
HP: 80
ATK: 6
DEF: 2

Pattern:
Attaque → Défendre → Attaque → Défendre (répète)

Loot:
- 💰 10-20 pièces (100%)
- 🗡️⚔️ Équipement rare (60%)

Dangerosité: ⚠️⚠️⚠️ Élevé
Combat type: 15-20 tours
HP perdus: ~40-60 HP

Stratégie:
- Observer pattern (1-2 tours)
- Attaquer quand il va DÉFENDRE (il riposte moins)
- DÉFENDRE quand il va ATTAQUER
- Combat de patience et lecture
```

### 🐺🐺🐺 Meute de Loups (x3)

```
HP: 30 chacun (90 total)
ATK: 3 chacun
DEF: 0

Pattern:
Attaquent en alternance (1 par tour)

Loot:
- 🥩 Viande x3 (100%)
- 🦴 Fourrure Rare (70%) → Vends 15p

Dangerosité: ⚠️⚠️⚠️ Élevé
Combat type: 20-25 tours
HP perdus: ~50-70 HP

Stratégie:
- Focus tuer 1 par 1 (diviser pour régner)
- Chaque loup mort = -3 ATK reçu/tour
- Long combat, gérer HP avec DÉFENDRE
- OU FUIR (40% chance vs meute)
```

## Dangereux (10% des rencontres)

### ⚔️⚔️ Groupe de Déserteurs (x2)

```
HP: 70 chacun (140 total)
ATK: 5 chacun (10 dmg/tour!)
DEF: 2 chacun

Pattern:
Attaquent ensemble, focus le joueur

Particularité:
Si 1 meurt → l'autre tente FUIR (50% chance)

Loot:
- 💰 20-35 pièces (100%)
- 🛡️ Armure rare (70%)
- 🗡️ Arme rare (50%)

Dangerosité: ⚠️⚠️⚠️⚠️ Très Élevé
Combat type: 25-30 tours si les 2 restent
HP perdus: ~60-80 HP

Stratégie:
- Combat TRÈS DUR
- Considérer FUIR immédiatement (60% chance)
- Si combat: focus tuer 1 vite (l'autre peut fuir)
- Utiliser DÉFENDRE beaucoup (10 dmg/tour sinon)
- Recommandé: armure DEF 3+ minimum
```

### 🛡️ Chef de Patrouille

```
HP: 120
ATK: 7
DEF: 3

Pattern Adaptatif:
- HP > 60%: Attaque agressive
- HP 30-60%: Alterne Attaque/Défendre
- HP < 30%: Défendre puis tente Fuir

Loot:
- 💰 40 pièces (100%)
- 🗡️ Arme légendaire (30%)
- 🛡️ Armure légendaire (30%)

Dangerosité: ⚠️⚠️⚠️⚠️⚠️ EXTRÊME
Combat type: 30-40 tours
HP perdus: ~70-90 HP

Stratégie:
- Le plus dangereux du prototype
- Recommandé: ATK 6+, DEF 3+, HP full
- Combat de calcul et patience
- Il adapte sa stratégie selon HP
- Peut fuir si tu l'affaiblis trop (perds loot)
- Victoire = accomplissement majeur

Note: Pas un "boss" au sens traditionnel,
juste l'ennemi le plus dangereux de la région.
```

---

<a name="système-dévénements"></a>
# 8. SYSTÈME D'ÉVÉNEMENTS

## Structure par Tuile

**Chaque tuile peut avoir 3 "slots" d'événements :**

```
SLOT 1 - COMBAT (60% chance)
→ Rencontre hostile
→ Type d'ennemi selon terrain et tuile

SLOT 2 - TROUVAILLE (30% chance)
→ Loot sans combat
→ Cache, corps, coffre, campement abandonné

SLOT 3 - NARRATIF (10% chance)
→ Événement avec choix
→ Conséquences variables
→ Pas de "bonne réponse" universelle
```

**Une tuile peut avoir 0, 1, 2 ou les 3 événements.**

## Exemples d'Événements Narratifs

### Le Voyageur Blessé

```
═══════════════════════════════════════
ÉVÉNEMENT: Le Voyageur Blessé
═══════════════════════════════════════

Tu croises un voyageur adossé à un arbre.
Il saigne de la jambe. Sa besace ouverte à côté.

"Aide... moi..."

Il ne survivra probablement pas la nuit.

CHOIX:
[1] Donner bandage
    → -1 Bandage
    → +Karma (hidden stat)
    → Il te donne info: "Ruines Nord... coffre caché..."
    
[2] Prendre sa besace et partir
    → Gain 8 pièces, Pain x2
    → -Karma
    → Pas d'info
    
[3] L'achever rapidement
    → Gain 10 pièces, Pain x2, Dague
    → --Karma (large penalty)
    → Unlock trait "Impitoyable" (change dialogues futurs)
    
[4] Continuer sans rien faire
    → Aucun effet

Note: Le karma affecte certains dialogues futurs
et événements aléatoires (monde réagit à toi).
```

### La Ferme Abandonnée

```
═══════════════════════════════════════
ÉVÉNEMENT: La Ferme Abandonnée
═══════════════════════════════════════

Une ferme, portes ouvertes. Silence total.

Tu entres. Cuisine. Table mise. Nourriture
encore sur les assiettes. Intacte mais...
étrange odeur de moisi.

CHOIX:
[1] Manger la nourriture
    → Gain +3 jours faim immédiatement
    → Test aléatoire (50/50):
       • Succès: "C'était bon!"
       • Échec: "Poison!" -30 HP, malus 2h
    
[2] Fouiller la maison sans manger
    → Trouve loot (15 pièces, items)
    → Déclenche piège (vieille arbalète)
    → -15 HP
    → Mais gain net positif
    
[3] Partir immédiatement
    → Aucun gain, aucune perte
    → "Ton instinct te dit de partir..."

Choix = risque vs récompense.
Pas de "mauvais choix", juste trade-offs.
```

### Le Feu de Camp (Bulle de Bonheur)

```
═══════════════════════════════════════
ÉVÉNEMENT: Le Feu de Camp
═══════════════════════════════════════

Tu aperçois de la fumée au loin.
Tu approches prudemment.

Un campement. Deux mercenaires assis près
d'un feu, mains visibles, armes posées.

L'un d'eux te fait signe.
"Approche, on mord pas. La nuit va être froide."

CHOIX:
[1] Rejoindre le feu
    → Repos gratuit: +20 HP
    → Partage repas: +1 jour faim
    → Échange infos: 1 tuile voisine révélée
    → Dialogue: histoires, rumeurs
    → [MOMENT DE BONHEUR]
    
    Texte:
    "Tu t'assois près du feu.
    La chaleur. Les voix. Un moment de paix rare.
    L'un d'eux sort une flasque. Vous partagez.
    Personne ne demande ton nom. C'est suffisant."
    
[2] Observer de loin sans approcher
    → Aucun effet
    → Continues ta route
    
[3] Les attaquer par surprise
    → Combat 2v1 (très dur)
    → Si victoire: loot important (50 pièces, équip)
    → Mais --Karma (tu as trahi la confiance)
    → Plus jamais d'événements "feu de camp"

Note: Ces événements sont rares (5% des tuiles).
Ils sont les "bulles de bonheur" du jeu.
Accepter l'hospitalité = toujours safe.
```

### Les Traces Fraîches (Si compétence Traqueur)

```
═══════════════════════════════════════
ÉVÉNEMENT: Traces Fraîches
═══════════════════════════════════════

[Compétence: Traqueur active]

Tu observes le sol. Des traces. Récentes.

Tu analyses:
- 3 personnes, lourdement chargées
- Sont passées il y a 1-2h
- Direction: Nord
- Boitent (l'une d'elles est blessée)

CHOIX:
[1] Suivre les traces
    → Voyage 1h vers Nord
    → Rattrapes 3 bandits blessés
    → Combat facile (affaiblis)
    → Bon loot garanti
    
[2] Tendre embuscade sur leur route
    → Attends 30 min caché
    → Combat avec avantage surprise
    → Premier coup gratuit
    → Meilleur loot
    
[3] Ignorer et continuer ta route
    → Aucun effet

Note: Cet événement n'apparaît QUE si tu as
la compétence Traqueur. Justifie l'achat.
```

## Design Intent

Les événements narratifs :
- **Créent des moments mémorables** (pas juste du combat)
- **N'ont pas de "bonne réponse"** (juste des trade-offs)
- **Reflètent le ton low fantasy** (choix moraux gris)
- **Récompensent les compétences** (Traqueur, Négociateur, etc.)
- **Incluent des bulles de bonheur** (feu de camp, villages vivants)

**Règle d'or :** Un événement doit être racontable.
"Tu te souviens quand j'ai trouvé le voyageur blessé et que..."

---

<a name="le-hub"></a>
# 9. LE HUB - AUBERGE DU CARREFOUR

## Fonction Principale

**L'auberge est le seul endroit sûr du jeu.**

Ici tu peux :
- Te soigner et manger
- Acheter/vendre équipement
- Réorganiser ton deck
- Stocker des items
- Lire des rumeurs
- Te reposer sans danger

## Interface Hub

```
═══════════════════════════════════════
AUBERGE DU CARREFOUR
═══════════════════════════════════════

"Bienvenue, mercenaire."

[Une salle commune. Feu de cheminée.
Quelques voyageurs. L'aubergiste te regarde.]

Ton état:
HP: 67/100
Faim: 1.5 jours (affamé!)
Argent: 23 pièces

═══════════════════════════════════════
SERVICES
═══════════════════════════════════════

[1] REPOS & REPAS (5 pièces)
    → HP: Heal 50 HP
    → Faim: +3 jours
    → Temps: 2h passent
    → Description: "Ragoût chaud et pain frais"
    
[2] CHAMBRE LUXE (15 pièces)
    → HP: Full heal (100%)
    → Faim: +4 jours
    → Buff 24h: +1 ATK, +1 DEF
    → Temps: 8h passent (nuit complète)
    → Description: "Lit propre, eau chaude, vraie nourriture"
    
[3] MARCHAND (Aldric)
    → Acheter équipement & items
    → Vendre ton loot
    
[4] TABLEAU D'ANNONCES
    → Lire rumeurs sur les tuiles
    → Infos sur loot rare
    → "Contrats" informels
    
[5] TON COFFRE
    → Stockage illimité gratuit
    → Réorganiser deck (équiper/déséquiper)
    → Items stockés sont 100% saufs
    
[6] REPARTIR EN EXPLORATION
    → Quitter le hub
    → Choisis direction
```

## Le Marchand (Aldric)

```
═══════════════════════════════════════
MARCHAND - Aldric le Vendeur d'Armes
═══════════════════════════════════════

"Montre-moi ta bourse, mercenaire."

Ton argent: 23 pièces

═══════════════════════════════════════
ARMES DISPONIBLES
═══════════════════════════════════════

🗡️ Dague Rapide
   ATK: 3 | Poids: 0.5kg
   Prix: 15 pièces
   "Légère et maniable. Pour les combattants agiles."
   
⚔️ Épée Longue
   ATK: 5 | Poids: 2kg
   Prix: 35 pièces [PAS ASSEZ]
   "Équilibrée. Le choix du professionnel."
   
🪓 Hache de Guerre
   ATK: 7 | Poids: 3.5kg
   Prix: 60 pièces [PAS ASSEZ]
   "Frappe lourde. Pour ceux qui ont la force."
   
🏹 Arc Court
   ATK: 4 | Poids: 1kg
   Prix: 45 pièces [PAS ASSEZ]
   "Attaque à distance. Évite les coups."

═══════════════════════════════════════
ARMURES DISPONIBLES
═══════════════════════════════════════

🧥 Gambeson Renforcé
   DEF: 2 | Poids: 2kg
   Prix: 25 pièces [PEUT ACHETER]
   "Tissu matelassé. Protection décente."
   
⛓️ Maille Légère
   DEF: 3 | Poids: 3.5kg
   Prix: 50 pièces [PAS ASSEZ]
   "Anneaux de fer. Solide."
   
🛡️ Cuirasse de Plaques
   DEF: 5 | Poids: 5kg
   Prix: 100 pièces [PAS ASSEZ]
   "Protection maximale. Très lourde."

═══════════════════════════════════════
ITEMS & PROVISIONS
═══════════════════════════════════════

🍞 Pain Frais x5
   +1 jour faim, +10 HP chacun
   Prix: 10 pièces [PEUT ACHETER]
   
🥩 Viande Séchée x3
   +2 jours faim, +15 HP chacun
   Prix: 18 pièces [PEUT ACHETER]
   
💊 Bandage Propre x3
   +30 HP chacun
   Prix: 15 pièces [PEUT ACHETER]
   
🗺️ Carte Partielle de la Région
   Révèle 3 tuiles aléatoires
   Prix: 20 pièces [PEUT ACHETER]
   
🎒 Sac Renforcé [PERMANENT]
   +3kg poids max (10kg → 13kg)
   Prix: 40 pièces [PAS ASSEZ]
   "Investissement long-terme."

═══════════════════════════════════════
VENDRE TON LOOT
═══════════════════════════════════════

[Affiche ton inventaire]

🦴 Peau de Loup → 5 pièces
🗡️ Dague Émoussée → 3 pièces

[Vendre sélection] [Tout vendre]

═══════════════════════════════════════

[1] Acheter item
[2] Vendre items
[3] Retour
```

### Prix & Économie

**Principe :** Les pièces sont rares. Chaque achat est un investissement.

**Gains typiques :**
- Bandit solitaire : 3-8 pièces
- Mercenaire rival : 10-20 pièces
- Chef de patrouille : 40 pièces
- Vente loot : 2-10 pièces

**Coûts typiques :**
- Repas : 5 pièces
- Bandages : 15 pièces (x3)
- Arme décente : 35-45 pièces
- Armure décente : 25-50 pièces

**Progression économique :**
- Jour 1-2 : 0-30 pièces (pauvre)
- Jour 3-5 : 30-80 pièces (stable)
- Jour 7+ : 100+ pièces (riche, peut tout acheter)

## Le Tableau d'Annonces

```
═══════════════════════════════════════
TABLEAU D'ANNONCES
═══════════════════════════════════════

[Notes épinglées, écrites à la main]

─────────────────────────────────────
[Note récente, encre fraîche]

"ATTENTION: Chef de patrouille vu près
des Ruines au Nord. Armure lourde, épée
longue. Très dangereux.

Il porte une bourse bien remplie, paraît-il.
Pour ceux qui ont les couilles."

- Marcus, il y a 2 jours

─────────────────────────────────────
[Note ancienne, papier jauni]

"Les Collines de l'Est cachent des coffres.
Anciens caches de contrebandiers de la guerre.

Cherchez sous les rochers marqués d'une croix.
Bonne chance."

- Anonyme

─────────────────────────────────────
[Note griffonnée]

"La Forêt Sombre, au Sud-Ouest: j'y ai vu
une meute de loups. 4 ou 5 bêtes.

Fuyez si vous n'êtes pas bien équipé.
Ou chassez-les si vous avez faim."

- Sarah, hier

─────────────────────────────────────
[Contrat informel]

"Cherche quelqu'un pour récupérer un pendentif
dans le Village Abandonné. Cadeau de ma
défunte mère.

30 pièces si ramené intact.
Voir l'aubergiste pour détails."

- Veuve Joanna

─────────────────────────────────────

[Retour]
```

**Design Intent :**
- Les rumeurs donnent des **indices vagues** (pas des quêtes formelles)
- Elles orientent sans forcer ("Chef au Nord" → suggestion, pas obligation)
- Elles enrichissent le worldbuilding (noms, histoires)
- Elles créent de l'anticipation ("Je vais explorer cette zone!")

## Ton Coffre (Stockage)

```
═══════════════════════════════════════
TON COFFRE PERSONNEL
═══════════════════════════════════════

[Un coffre en bois, cadenas rouillé]

"Tes affaires sont en sécurité ici."

CONTENU ACTUEL:
💰 120 pièces (économies)
🗡️ Épée Longue de Qualité (backup)
🛡️ Maille Légère (équipement lourd alternatif)
🗺️ Carte Région Ouest (pas encore utilisée)
🍞 Pain Sec x5
💊 Bandages x3

Capacité: Illimitée

═══════════════════════════════════════
TON DECK ACTUEL (équipé)
═══════════════════════════════════════

ARME: 🗡️ Dague Rapide (ATK 3)
ARMURE: 🧥 Gambeson (DEF 2)
COMPÉTENCE: 👁️ Vigilant

SAC (poids 7.2/10kg):
🍞 Pain Frais x2
💊 Bandage Propre x1
🥩 Viande Séchée x1

═══════════════════════════════════════
ACTIONS
═══════════════════════════════════════

[1] Déposer items dans coffre
[2] Retirer items du coffre
[3] Réorganiser deck
    → Équiper/déséquiper arme
    → Équiper/déséquiper armure
    → Ajouter/retirer items du sac
[4] Retour

Note: Le coffre est le SEUL endroit où tu peux
changer ton équipement équipé.
```

**Design Intent :**
- Le coffre permet **stratégie long-terme** (garder plusieurs sets)
- Il **sécurise tes richesses** (si tu meurs, coffre intact)
- Il crée **moment de planification** avant chaque départ
- C'est le "base camp" psychologique du joueur

---

<a name="boucle-de-jeu-typique"></a>
# 10. BOUCLE DE JEU TYPIQUE (30-45 min)

## Session Complète Annotée

### MINUTE 0-5 : Préparation au Hub

```
[Spawn à l'Auberge]

═══════════════════════════════════════
Tu te réveilles à l'auberge.
Nouvelle journée. Nouvelle chance de survie.

Ton état:
HP: 100/100
Faim: 4 jours
Argent: 5 pièces
Deck: Starter (Épée Rouillée, Vêtements, Vigilant)

[Tu lis le Tableau d'Annonces]
→ "Chef de patrouille aux Ruines Nord. Dangereux."
→ "Coffres dans Collines Est."

[Tu vérifies ton deck]
→ Poids: 4.2/10kg (OK, de la place)
→ Provisions: Pain x4, Bandages x2 (suffisant pour ~2h)

[Décision: Partir explorer]
→ Direction: Nord (vers Ruines, voir ce fameux chef)
═══════════════════════════════════════
```

### MINUTE 5-10 : Première Zone (Plaine Nord)

```
[Voyage vers Nord]
[1h in-game passe]

═══════════════════════════════════════
PLAINE DU NORD
═══════════════════════════════════════

Herbes hautes. Vent léger. Route visible au loin.

[Vigilant active]
→ NORD: Forêt (mouvement détecté - danger?)
→ EST: Collines (semble calme)

[Événement: RIEN]
→ Traversée sans incident

Faim: 4 → 3.5 jours
Temps: 9h → 10h

[Tu continues Nord vers Forêt]
═══════════════════════════════════════
```

### MINUTE 10-18 : Combat (Forêt)

```
[Voyage vers Forêt]
[2h in-game passent]

═══════════════════════════════════════
FORÊT SOMBRE
═══════════════════════════════════════

Arbres denses. Peu de lumière.

[Vigilant active]
→ OUEST: Danger confirmé
→ NORD: Collines (safe)

[Tu explores la zone]

[ÉVÉNEMENT: COMBAT]

═══════════════════════════════════════
Soudain, devant toi: 2 LOUPS !

Ils grondent, montrent les crocs.
Affamés. Agressifs.

[COMBAT COMMENCE]
═══════════════════════════════════════

   TOI             LOUP 1      LOUP 2
   100 HP          40 HP       40 HP
   ATK: 3          ATK: 4      ATK: 4
   DEF: 1          DEF: 0      DEF: 0

[Pattern observé après 2 tours:]
Loup 1: Attaque Tour 1-2, Recule Tour 3
Loup 2: Attaque Tour 1-2, Recule Tour 3

[Stratégie: Focus Loup 1 d'abord]

TOUR 1: Attaque Loup 1 → 40 → 37 HP
        Loup 1 attaque → 100 → 97 HP (4-1 DEF)
        Loup 2 attaque → 97 → 94 HP

TOUR 2: Attaque Loup 1 → 37 → 34 HP
        Loup 1 attaque → 94 → 91 HP
        Loup 2 attaque → 91 → 88 HP

TOUR 3: Attaque Loup 1 → 34 → 31 HP
        Loup 1 RECULE (ne fait rien)
        Loup 2 RECULE (ne fait rien)
        [Bon tour pour toi!]

[Combat continue... ~10 tours]

TOUR 11: Attaque Loup 1 → 4 → 1 HP
TOUR 12: Attaque Loup 1 → 1 → MORT
         [Loup 1 éliminé!]

[Maintenant 1v1 avec Loup 2]

TOUR 15: Attaque Loup 2 → MORT

═══════════════════════════════════════
VICTOIRE !
═══════════════════════════════════════

Ton état:
HP: 100 → 67 HP (perdu 33 HP)
Faim: 3.5 → 3 jours

LOOT:
🥩 Viande de Loup x2 (+2j faim chacune)
🦴 Peau de Loup x1 (vends 5p)

[Prendre tout]
Poids: 4.2 → 5.5kg

[Tu utilises 1 Bandage]
HP: 67 → 87 HP
Bandages: 2 → 1

"Combat dur. Mais j'ai de la viande maintenant."
═══════════════════════════════════════
```

### MINUTE 18-25 : Trouvaille (Collines)

```
[Tu continues Nord vers Collines]
[1h in-game]

═══════════════════════════════════════
COLLINES ROCHEUSES
═══════════════════════════════════════

Terrain escarpé. Vue panoramique sur la région.

[Vigilant]
→ NORD: Ruines (présence hostile forte!)
→ EST: ???
→ OUEST: Forêt (déjà visitée)

[Tu fouilles la zone]

[ÉVÉNEMENT: TROUVAILLE]

═══════════════════════════════════════
Sous un rocher marqué d'une croix
(la rumeur du tableau était vraie!)

Une vieille cache de contrebandier.

LOOT:
💰 12 pièces de cuivre
⚔️ Épée Longue (ATK 5, Poids 2kg) [!]
🗡️ Dague Fine (ATK 3, Poids 0.5kg)

[Problème: Poids actuel 5.5kg]

Si tu prends Épée Longue: 5.5 → 7.5kg
Si tu prends les deux: 5.5 → 10kg (FULL!)

[Décision stratégique]
→ Prendre Épée Longue (meilleur ATK)
→ Jeter Épée Rouillée (libère 1kg)

Résultat:
- ATK: 3 → 5 (+2, énorme upgrade!)
- Poids: 5.5 → 6.5kg
- Argent: 5 → 17 pièces

"Excellente trouvaille! Je suis beaucoup plus fort."
═══════════════════════════════════════
```

### MINUTE 25-30 : Évaluation & Retrait Tactique

```
[Tu approches des Ruines au Nord]

═══════════════════════════════════════
RUINES ANCIENNES
═══════════════════════════════════════

Structures en pierre effondrées.
Silence inquiétant.

[Vigilant - ALERT!]
→ "Présence hostile majeure détectée"

[Tu avances prudemment]

[ÉVÉNEMENT: RENCONTRE ÉLITE]

═══════════════════════════════════════
Un homme en armure lourde patrouille.
Cuirasse, heaume, épée longue à la ceinture.
Il n'a pas encore remarqué ta présence.

[Analyse: CHEF DE PATROUILLE]
═══════════════════════════════════════

   CHEF               TOI
   120 HP             87 HP
   ATK: 7             ATK: 5
   DEF: 3             DEF: 1

[Calcul mental rapide]

Lui vs Toi:
- Il fait 6 dmg/tour (7-1)
- Tu fais 2 dmg/tour (5-3)
- Il a 120 HP → ~60 tours pour le tuer
- Tu as 87 HP → ~15 tours avant mort
- TU VAS PERDRE ce combat

"Je ne suis pas prêt. Pas encore."

CHOIX:
[1] Attaquer quand même (combat suicidaire)
[2] FUIR discrètement (il ne t'a pas vu)
[3] Marquer la position, revenir plus tard

→ [Tu choisis 3]

[Tuile "Ruines Nord" marquée sur ta carte mentale]
[Chef de Patrouille confirmé présent]

"Je reviendrai. Avec meilleure armure."
═══════════════════════════════════════
```

### MINUTE 30-35 : Retour au Hub

```
[Voyage retour: Collines → Forêt → Plaine → Hub]
[3h in-game]

Faim: 3 → 1.5 jours (AFFAMÉ!)
HP: 87 HP
État: Fatigué, besoin de repos

═══════════════════════════════════════
AUBERGE DU CARREFOUR
═══════════════════════════════════════

Tu pousses la porte.
La chaleur du feu. Les voix.
Tu es de retour.

[L'aubergiste hoche la tête]
"Encore vivant. Bien."

[PHASE DE GESTION]

Ton argent: 17 pièces
Ton inventaire:
- Épée Longue (équipée)
- Viande x2
- Peau de Loup
- Pain x4
- Bandage x1

Actions:
1. Vendre Peau de Loup → +5 pièces
   Argent: 17 → 22 pièces

2. Acheter au Marchand:
   → Gambeson (DEF 2) = 25 pièces
   [Pas assez! Need 3 pièces de plus]

3. Vendre 2 Pains Secs (garde les autres)
   → +4 pièces
   Argent: 22 → 26 pièces

4. Acheter Gambeson
   Argent: 26 → 1 pièce
   DEF: 1 → 2 (+1!)

5. Manger 1 Viande
   Faim: 1.5 → 3.5 jours

6. Pas assez de pièces pour Repas
   HP reste: 87/100

[Nouveau setup]
═══════════════════════════════════════
ATK: 5 (Épée Longue)
DEF: 2 (Gambeson)
HP: 87/100
Faim: 3.5 jours
Argent: 1 pièce

Poids: 6kg/10kg

[Analyse]
"Bien mieux qu'au départ.
ATK +2, DEF +1.
Mais toujours pas assez pour le Chef.

Prochaine session: explorer Est (Collines cachent loot)
Accumuler ~50 pièces pour Maille Légère (DEF 3)
Puis retour Chef de Patrouille."

[FIN SESSION]
═══════════════════════════════════════
```

## Leçons de Cette Boucle

**Ce qui a bien fonctionné :**
- ✅ Décisions constantes (quelle direction, quel loot prendre)
- ✅ Combat tendu (loups ont fait mal)
- ✅ Découverte satisfaisante (cache dans collines)
- ✅ Upgrade visible (ATK 3→5, DEF 1→2)
- ✅ Objectif émergent (battre le Chef plus tard)
- ✅ Retour hub gratifiant (gestion, optimisation)

**Ce qui crée du replay :**
- "Je vais tuer ce Chef de Patrouille"
- "Je veux explorer la zone Est"
- "Je veux me payer la Cuirasse (100p)"
- "Je veux collecter toutes les armes"

**Pas de "fin" claire = exploration infinie.**

---

<a name="progression"></a>
# 11. PROGRESSION

## Pas de Levels - Progression par Équipement

**Le jeu n'a pas de système de XP/levels traditionnel.**

Ta progression = ton équipement et tes connaissances.

### Timeline Typique

#### Départ (Jour 1)
```
ATK: 3
DEF: 1
HP: 100
Poids Max: 10kg
Argent: 5 pièces
Tuiles explorées: 1/15
Compétences: Vigilant

Capable de battre:
✅ Loup Solitaire (facile)
✅ Bandit Solitaire (moyen)
❌ Mercenaire Rival (très dur)
❌ Meute (impossible)
❌ Déserteurs (impossible)
❌ Chef (impossible)
```

#### Après 1-2h de Jeu (Jour 2-3)
```
ATK: 5 (Épée Longue)
DEF: 2 (Gambeson)
HP: 100
Poids Max: 10kg
Argent: 30-50 pièces
Tuiles explorées: 6-8/15
Compétences: Vigilant

Capable de battre:
✅ Loup (facile)
✅ Bandit (facile)
✅ Mercenaire Rival (moyen, risqué)
⚠️ Meute (possible mais dur)
❌ Déserteurs (très dur)
❌ Chef (quasi impossible)
```

#### Après 3-4h de Jeu (Jour 5-7)
```
ATK: 6-7 (Hache ou Arc)
DEF: 3-4 (Maille ou mieux)
HP: 100 (ou 120 si Résistant)
Poids Max: 13kg (Sac Renforcé)
Argent: 100+ pièces
Tuiles explorées: 12-15/15
Compétences: Vigilant, Traqueur/Négociateur

Capable de battre:
✅ Tout ennemi commun (routine)
✅ Mercenaire (facile)
✅ Meute (moyen)
✅ Déserteurs (difficile mais faisable)
⚠️ Chef (possible, combat long)
```

#### Après 8-10h de Jeu (Vétéran)
```
ATK: 7 (Hache optimale)
DEF: 5 (Cuirasse)
HP: 120 (Résistant)
Poids Max: 13kg
Argent: 200-300+ pièces
Tuiles: Toutes explorées multiple fois
Compétences: Multiples

Capable de battre:
✅ TOUT (même Chef est routine)

État: "Je domine cette région."
Objectif: Accumuler richesse, collectionner tout l'équipement,
          attendre nouvelle région (v0.2)
```

## Achievements Informels

**Affichés en fin de session, pas de popup intrusif.**

```
═══════════════════════════════════════
FIN DE SESSION
═══════════════════════════════════════

Temps joué: 38 minutes
Jour in-game: 3

STATISTIQUES:
• Tuiles explorées: 8/15
• Ennemis tués: 6
  - Loups: 4
  - Bandits: 2
• Distance parcourue: 12km
• Argent gagné: 28 pièces
• Morts: 0

ACHIEVEMENTS:
🏆 Survivant (5 jours sans mourir)
🏆 Premier Sang (tué premier ennemi)
🏆 Chasseur (tué 3 loups)
🏆 Économe (accumulé 50 pièces)

PROGRÈS:
⬜ Cartographe (10/15 tuiles)
⬜ Vétéran (6/20 ennemis)
⬜ Riche (28/100 pièces)
⬜ Tueur d'Élite (0/1 Chef)
⬜ Pacifiste (0/10 fuites)

[Continuer] [Sauvegarder & Quitter]
═══════════════════════════════════════
```

**Types d'achievements :**

**Survie :**
- 🏆 Survivant : 5 jours sans mourir
- 🏆 Vétéran : 10 jours
- 🏆 Immortel : 20 jours

**Exploration :**
- 🏆 Explorateur : 5 tuiles révélées
- 🏆 Cartographe : 10 tuiles
- 🏆 Maître Géographe : 15 tuiles (toutes)

**Combat :**
- 🏆 Premier Sang : tué 1 ennemi
- 🏆 Guerrier : tué 10 ennemis
- 🏆 Vétéran : tué 20 ennemis
- 🏆 Tueur d'Élite : tué Chef de Patrouille
- 🏆 Chasseur : tué 5 loups
- 🏆 Pacifiste : fui 10 combats

**Économie :**
- 🏆 Économe : 50 pièces accumulées
- 🏆 Riche : 100 pièces
- 🏆 Fortune : 200 pièces

**Moral (choix narratifs) :**
- 🏆 Bon Samaritain : 5 choix "gentils"
- 🏆 Impitoyable : 5 choix "cruels"
- 🏆 Pragmatique : mix équilibré

**Collection :**
- 🏆 Collectionneur : possédé 10 items différents
- 🏆 Arsenal : possédé toutes les armes
- 🏆 Garde-Robe : possédé toutes les armures

---

<a name="interface-utilisateur"></a>
# 12. INTERFACE UTILISATEUR (Text-Based Prototype)

## Écran Principal (Exploration)

```
═══════════════════════════════════════
        SOUDA : La Traversée
═══════════════════════════════════════

LIEU: Forêt Sombre
HEURE: 14h (Après-midi, Jour 3)
MÉTÉO: Nuageux

═══════════════════════════════════════
TOI
═══════════════════════════════════════
HP: 67/100  [█████████████░░░░░░░]
Faim: 2.5j  [████████░░░░░░░░░░░░]
Poids: 8kg  [████████████████░░░░]

Équipement:
⚔️ ATK: 5 (Épée Longue)
🛡️ DEF: 2 (Gambeson)
👁️ Vigilant (active)

═══════════════════════════════════════
DESCRIPTION DE LA ZONE
═══════════════════════════════════════
Arbres serrés. Peu de lumière filtre entre
les branches. Silence pesant. Aucun oiseau.
Le sol est humide, couvert de mousse.

[Compétence: Vigilant]
Détection de dangers:
→ OUEST: ⚠️ DANGER (mouvement, voix)
→ NORD: ✓ Sûr (collines visibles)
→ SUD: ✓ Sûr (retour hub, 2h)
→ EST: ? (brouillard, non exploré)

═══════════════════════════════════════
POINTS D'INTÉRÊT
═══════════════════════════════════════
[!] Fumée à l'ouest (campement?)
[ ] Traces de pas récentes (est)

═══════════════════════════════════════
ACTIONS DISPONIBLES
═══════════════════════════════════════
DÉPLACEMENT:
[1] Nord → Collines (1h de marche)
[2] Ouest → Vers fumée/danger (30 min)
[3] Sud → Retour Auberge (2h)
[4] Est → Zone inconnue (2h)

AUTRES:
[5] Fouiller cette zone (30 min, trouvaille?)
[6] Manger/Repos (consomme items)
[7] Inventaire (voir deck complet)
[8] Carte (overview zones explorées)
[9] Sauvegarder
[0] Menu

Choix > _
═══════════════════════════════════════
```

## Écran Combat

```
═══════════════════════════════════════
COMBAT: Mercenaire Rival
═══════════════════════════════════════

      TOI                MERCENAIRE
      
 HP: 67/100            HP: 80/80
 [██████░░░░]          [████████]
 
 ATK: 5                ATK: 6
 DEF: 2                DEF: 2

═══════════════════════════════════════
TOUR 3
═══════════════════════════════════════

Le mercenaire te fixe. Il ajuste sa garde.
Son souffle est régulier. Calme. Professionnel.

[PATTERN OBSERVÉ]
Tour 1: Attaque
Tour 2: Défendre (riposte)
Tour 3: Attaque ← IL VA FAIRE ÇA
Tour 4: Défendre (prévu)

Si tu ATTAQUES maintenant:
→ Tu fais: 5 - 2 = 3 dégâts
→ Il riposte: 6 - 2 = 4 dégâts
→ Net: -1 HP pour toi

Si tu DÉFENDS maintenant:
→ Tu encaisses: 4 / 2 = 2 dégâts seulement
→ Prochain tour +1 ATK

═══════════════════════════════════════
TES ACTIONS
═══════════════════════════════════════
[1] ATTAQUER
    → 3 dégâts infligés
    → 4 dégâts reçus
    → Agressif
    
[2] DÉFENDRE
    → 2 dégâts reçus (réduit)
    → +1 ATK prochain tour
    → Tactique
    
[3] FUIR
    → 60% chance succès
    → Si échec: 1 coup gratuit puis retry
    → Abandonne combat

Choix > _
═══════════════════════════════════════
```

## Écran Hub (Auberge)

```
═══════════════════════════════════════
AUBERGE DU CARREFOUR
═══════════════════════════════════════

[Salle commune chaleureuse]

Le feu crépite dans la cheminée.
L'aubergiste essuie des verres au bar.
Trois voyageurs discutent à voix basse.
L'un d'eux te regarde, hoche la tête.

Heure: 18h (soir, Jour 3)

TON ÉTAT:
HP: 67/100 (blessé)
Faim: 2.5 jours (OK)
Argent: 23 pièces

═══════════════════════════════════════
QUE VEUX-TU FAIRE?
═══════════════════════════════════════
SERVICES:
[1] Repos & Repas (5p) - Heal 50HP, +3j faim
[2] Chambre Luxe (15p) - Full heal, +4j, buff
[3] Marchand (Aldric) - Acheter/Vendre
[4] Tableau d'Annonces - Lire rumeurs
[5] Ton Coffre - Stockage/équipement

DÉPART:
[6] Repartir en exploration
[7] Dormir jusqu'à demain (8h, gratuit)

SYSTÈME:
[8] Sauvegarder
[9] Statistiques/Achievements
[0] Quitter le jeu

Choix > _
═══════════════════════════════════════
```

## Écran Inventaire

```
═══════════════════════════════════════
INVENTAIRE
═══════════════════════════════════════

POIDS: 8kg / 10kg [████████████████░░░░]
ARGENT: 23 pièces de cuivre

═══════════════════════════════════════
ÉQUIPEMENT ÉQUIPÉ
═══════════════════════════════════════
ARME:
⚔️ Épée Longue
   ATK: 5 | Poids: 2kg
   Durabilité: ████████░░ 80%
   "Lame bien équilibrée. Entretenue."

ARMURE:
🛡️ Gambeson Renforcé
   DEF: 2 | Poids: 2kg
   Durabilité: ██████░░░░ 60%
   "Tissu matelassé. Protection décente."

COMPÉTENCES:
👁️ Vigilant (passive)
   "Détecte dangers 1 tuile à l'avance."

═══════════════════════════════════════
SAC (4kg occupés)
═══════════════════════════════════════
PROVISIONS:
🍞 Pain Frais x2 (0.6kg)
   +1j faim, +10 HP chacun
   
🥩 Viande Séchée x1 (0.5kg)
   +2j faim, +15 HP
   
💊 Bandage Propre x1 (0.2kg)
   +30 HP

LOOT:
🦴 Peau de Loup x1 (0.5kg)
   Valeur: ~5 pièces

DIVERS:
🗺️ Carte Partielle x1 (0kg)
   Révèle 3 tuiles (usage unique)

═══════════════════════════════════════
ACTIONS
═══════════════════════════════════════
[1] Utiliser item (manger, soigner)
[2] Jeter item (libérer poids)
[3] Voir détails item
[4] Retour

Choix > _
═══════════════════════════════════════
```

## Écran Carte

```
═══════════════════════════════════════
CARTE DES TERRES EXPLORÉES
═══════════════════════════════════════

    [R]--[F]--[ ]
     |    |    |
    [P]--[H]--[F]--[ ]
     |    |    |    |
    [F]--[P]--[C]--[?]
     |              |
    [ ]----------[?]

═══════════════════════════════════════
LÉGENDE
═══════════════════════════════════════
[H] = Hub (Auberge) ← TU ES ICI
[P] = Plaine (explorée)
[F] = Forêt (explorée)
[C] = Collines (explorée)
[R] = Ruines (vue mais pas explorée)
[ ] = Vu de loin (fog partiel)
[?] = Totalement inconnu

⚠️ = Danger signalé
✓ = Zone safe confirmée

═══════════════════════════════════════
NOTES PERSONNELLES
═══════════════════════════════════════
Ruines Nord:
  "Chef de Patrouille présent.
   HP 120, ATK 7, DEF 3.
   Trop fort pour moi actuellement.
   Revenir avec DEF 3+ minimum."

Collines Est:
  "Cache de contrebandiers trouvée.
   Rumeur du tableau était vraie.
   Y a-t-il d'autres caches?"

Forêt Sud-Ouest:
  "Meute de loups (rumeur Sarah).
   Pas encore allé vérifier."

═══════════════════════════════════════
[Retour]
═══════════════════════════════════════
```

---

<a name="échange-de-cartes-physiques-irl"></a>
# 13. ÉCHANGE DE CARTES PHYSIQUES IRL (v2.0)

## Vision Long-Terme

**Note :** Cette fonctionnalité n'est PAS dans le prototype v0.1.

C'est la vision pour la version complète du jeu (v2.0+).

### Le Concept

**Le jeu web/mobile = interface digitale**
**Mais les cartes = objets physiques qu'on peut échanger IRL**

### Comment Ça Marche

#### 1. Obtention Cartes Physiques

**Starter Pack ($14.99) :**
```
Contenu:
• 15 cartes physiques
  - 6 équipements (armes/armures)
  - 4 compétences
  - 3 items consommables
  - 1 carte géo
  - 1 joker (bonus)

• Chaque carte a un QR code unique
• Au premier lancement: scan les 15 cartes
• Elles sont ajoutées à ton compte in-game
```

#### 2. Trading IRL

**Scénario :**
```
[Yvan et Marcus se rencontrent à un meetup]

Yvan: "J'ai une Épée du Capitaine en double"
Marcus: "Nice! Je te l'échange contre ma Carte Région Sud?"

[Dans l'app]
→ Yvan scan QR de l'Épée de Marcus
→ Marcus scan QR de la Carte de Yvan
→ Les deux confirment
→ Server valide et swap ownership

[ILS ÉCHANGENT LES CARTES PHYSIQUES]
→ Maintenant Yvan a la carte physique de Marcus
→ Et in-game, les deux accounts reflètent l'échange
```

#### 3. Rareté & Collection

**Distribution :**
```
Starter Pack (15 cartes):
- 10 Commons
- 4 Uncommons
- 1 Rare (garantie)

Drop rates monde:
- Common: 60%
- Uncommon: 25%
- Rare: 12%
- Legendary: 3%

Légendaires:
- Édition limitée (ex: 500 exemplaires mondiaux)
- Numérotés: #001/500, #002/500...
- Vraie rareté, valeur collector réelle
```

#### 4. Événements Physiques

**Meetups naturels :**
- Trading Nights dans bars/cafés locaux
- Conventions gaming (stand + exclusives)
- Game stores partnerships
- Launch parties pour nouvelles séries

**Cartes exclusives physiques :**
- Convention exclusives (PAX, etc.)
- Kickstarter backers only
- Achievement unlocks (tue boss → achète carte physique)
- Top 100 leaderboard rewards

### Pourquoi C'est Brillant

**1. Social IRL (pas que digital) :**
- Vraies rencontres sociales
- Communauté locale naturelle
- Marketing viral physique

**2. Valeur tangible :**
- Objet réel qu'on peut toucher/montrer
- Économie réelle organique (eBay, Cardmarket)
- Collection physique satisfaisante

**3. Pas besoin de gérer l'économie :**
- Les joueurs créent Discord trades
- Ils s'organisent eux-mêmes
- Prix réels émergent naturellement

**4. Marketing physique :**
- Chaque carte = mini-billboard du jeu
- "C'est quoi ces cartes stylées?" → téléchargement

---

<a name="paramètres-techniques"></a>
# 14. PARAMÈTRES TECHNIQUES

## Timing In-Game

### Échelle Temporelle

```
1 minute réelle = 10 minutes in-game

Donc:
- 1h réelle = 10h in-game
- Session 30 min = 5h in-game
- Session 60 min = 10h in-game
```

### Impacts

**Voyage :**
- 1 tuile = 1-2h in-game = 6-12 min réelles

**Faim :**
- -0.5 jour par heure in-game
- Session 30 min = -2.5 jours faim

**Combat :**
- Temps réel (pause le timer)

**Hub :**
- Temps réel (pas de timer actif)

## Sauvegarde

### Auto-Save

**Déclenché automatiquement après :**
- Changement de tuile
- Fin de combat (victoire ou fuite)
- Transaction au hub (achat/vente)
- Choix dans événement narratif
- Utilisation d'item important

### Manuel-Save

**Disponible :**
- Au hub uniquement
- Dans menu pause (exploration)
- Crée snapshot complet de l'état

**Format de sauvegarde :**
```json
{
  "player": {
    "hp": 67,
    "maxHp": 100,
    "hunger": 2.5,
    "weight": 8,
    "maxWeight": 10,
    "gold": 23,
    "location": "forest_dark_01",
    "time": 14,
    "day": 3
  },
  "inventory": [...],
  "equipped": {...},
  "explored": [...],
  "achievements": [...],
  "karma": 0
}
```

## Death System

### Quand HP = 0

```
═══════════════════════════════════════
TU ES TOMBÉ
═══════════════════════════════════════

Le monde devient noir.
Douleur. Puis... rien.

[...]

Tu reprends conscience.
Quelqu'un t'a ramené à l'auberge.

"T'as eu de la chance, mercenaire."

═══════════════════════════════════════
CONSÉQUENCES
═══════════════════════════════════════

HP: 30/100 (gravement blessé)
Faim: -2 jours (épuisement)

PERDU:
• 50% pièces sur toi (12 → 6 pièces)
• Items consommables (pain, bandages)

GARDÉ:
• Équipement équipé (arme, armure)
• Items précieux dans ton coffre
• Toute ta progression (tuiles, achievements)

COÛT RÉSURRECTION:
• 10 pièces (prélevées de ton coffre)
• Si pas assez → dette envers auberge

MALUS TEMPORAIRE (2h in-game):
• -20% ATK
• -20% DEF
• "Traumatisé"

═══════════════════════════════════════
[CONTINUER]
═══════════════════════════════════════
```

### Design Intent

**Mort = setback mais pas game over.**

- Tu perds des ressources (pièces, items)
- Mais tu gardes ta progression (tuiles, équip, connaissances)
- Encouragé à être prudent (mort coûte cher)
- Mais pas punitif au point de rage quit

## Difficulté & Balance

### Paramètres Ajustables (Playtesting)

**Combat :**
```
// Facile à tweaker selon feedback

enemyDamageMultiplier = 1.0  // Augmenter = plus dur
playerDamageMultiplier = 1.0 // Augmenter = plus facile
fleeSuccessBonus = 0         // +10% = plus facile fuir

hungerDepletionRate = 0.5    // Jours/heure
startingGold = 5             // Pièces de départ
```

**Loot :**
```
goldDropMultiplier = 1.0     // x1.5 = plus généreux
rareLootChance = 0.4         // 40% sur bandits
legendaryChance = 0.05       // 5% sur élites
```

**Progression :**
```
shopPriceMultiplier = 1.0    // x0.8 = 20% moins cher
startingWeight = 10          // kg max de base
```

### Monitoring (Playtest)

**Métriques à tracker :**
- Temps moyen avant première mort
- % joueurs qui finissent 30 min session
- Combats fuis vs combats gagnés
- Argent moyen à J+3, J+7
- Tuiles explorées à 30 min

**Objectifs cibles :**
- Première mort : ~20-30 min (pas trop tôt)
- Complétion 30 min : 70%+
- Taux fuite : 20-30% (légitime mais pas spam)
- Argent J+3 : 30-50 pièces (permet 1 upgrade)
- Tuiles 30 min : 6-8/15 (bon rythme)

---

<a name="plan-de-test"></a>
# 15. PLAN DE TEST

## Phase 1 : Auto-Test (Développeur - 2h)

### Checklist Complète

**Systèmes Core :**
- [ ] Déplacement entre tuiles fonctionne
- [ ] Combat tour-par-tour correct
- [ ] Dégâts calculés correctement (déterministe)
- [ ] Patterns ennemis fonctionnent
- [ ] Fuite fonctionne (calcul chance)
- [ ] Faim diminue avec le temps
- [ ] Poids affecte vitesse/combat
- [ ] HP ne regen pas auto

**Hub :**
- [ ] Repos heal correct
- [ ] Marchand: achat/vente fonctionne
- [ ] Coffre: stockage/retrait OK
- [ ] Tableau annonces lisible
- [ ] Changement équipement au hub uniquement

**Événements :**
- [ ] Événements triggers selon %
- [ ] Choix narratifs ont effets
- [ ] Loot drops correctement
- [ ] Trouvailles sans combat OK

**Balance :**
- [ ] Combats sont difficiles mais gagnables
- [ ] Économie cohérente (prix vs gains)
- [ ] Faim crée pression mais gérable
- [ ] Poids force des choix

**Polish :**
- [ ] Pas de bugs game-breaking
- [ ] Textes sans fautes
- [ ] Interface claire
- [ ] Feedback actions visible

## Phase 2 : Test Aveugle (Créateur - Toi - 30-45 min)

### Protocole

**Objectif :** Observer comment tu interagis avec le jeu sans instructions.

**Instructions pour toi :**
```
1. Ouvre le jeu (URL)
2. Joue naturellement pendant 30-45 min
3. Pense à voix haute si possible
4. Note mentalement:
   - Moments où tu es bloqué
   - Ce qui n'est pas clair
   - Ce qui est fun
   - Ce qui est frustrant
```

**Ce que j'observe :**
- [ ] Comprends-tu les mécaniques sans aide?
- [ ] Te perds-tu dans les menus?
- [ ] Les combats sont-ils compréhensibles?
- [ ] Fais-tu des choix stratégiques?
- [ ] Sembles-tu engagé ou ennuyé?
- [ ] Où stoppes-tu (si tu stoppes)?

### Questions Post-Test (Oral)

```
1. "C'était clair que tu devais faire quoi au début?"
2. "Le combat, tu as compris comment ça marche?"
3. "As-tu senti que tes choix avaient de l'importance?"
4. "Moment le plus cool?"
5. "Moment le plus frustrant?"
6. "Tu continuerais à jouer?"
7. "Tu recommanderais à un ami?"
```

## Phase 3 : Playtest Externe (5 Personnes - 1 Semaine)

### Sélection Testeurs

**Profils variés :**
- 2 gamers expérimentés (connaissent roguelikes)
- 2 casual gamers (mobiles, peu de PC)
- 1 non-gamer (perspective fraîche)

### Protocole d'Envoi

**Message type :**
```
Salut [Nom],

Je développe un prototype de jeu web (30 min de jeu).
C'est un dungeon crawler low fantasy en texte.

Aurais-tu 30-45 min cette semaine pour tester?

Ce que je demande:
1. Jouer jusqu'à la fin ou abandon (note pourquoi)
2. Remplir questionnaire court après (5 min)

Lien jeu: [URL]
Questionnaire: [Google Form]

Merci!
```

### Questionnaire Post-Test

(Voir section suivante)

---

## QUESTIONNAIRE PLAYTEST DÉTAILLÉ

```
═══════════════════════════════════════
SOUDA PROTOTYPE - Feedback Joueur
═══════════════════════════════════════

Merci d'avoir testé le jeu!
Tes retours sont précieux pour améliorer l'expérience.

═══════════════════════════════════════
INFORMATIONS GÉNÉRALES
═══════════════════════════════════════

Nom/Pseudo: _______________
Date: _______________
Âge: [ ] 18-25  [ ] 26-35  [ ] 36-45  [ ] 46+

Expérience jeu vidéo:
[ ] Hardcore gamer (joue 10h+/semaine)
[ ] Gamer régulier (joue 5-10h/semaine)
[ ] Casual (joue <5h/semaine)
[ ] Très occasionnel

═══════════════════════════════════════
SESSION DE JEU
═══════════════════════════════════════

1. Combien de temps as-tu joué?
   [ ] <15 min (abandonné tôt)
   [ ] 15-25 min
   [ ] 25-35 min
   [ ] 35-45 min
   [ ] 45+ min (accro!)

2. As-tu fini la session ou abandonné?
   [ ] Fini naturellement
   [ ] Abandonné, raison: _______________

3. Combien de tuiles as-tu explorées?
   ____/15 tuiles

4. Es-tu mort pendant le jeu?
   [ ] Non
   [ ] Oui, ____ fois

═══════════════════════════════════════
MÉCANIQUES DE JEU
═══════════════════════════════════════

5. Note le système de déplacement (1-5):
   1☆ 2☆ 3☆ 4☆ 5☆
   
   Commentaire (optionnel):
   _________________________________

6. Le système de poids t'a-t-il forcé à faire des choix?
   [ ] Oui, souvent (bien)
   [ ] Parfois
   [ ] Rarement
   [ ] Jamais remarqué (pas assez impactant)

7. La faim a-t-elle créé de la tension?
   [ ] Oui, j'ai dû gérer activement
   [ ] Un peu
   [ ] Pas vraiment
   [ ] Je n'ai jamais eu faim

8. Le combat était:
   [ ] Trop facile (j'ai steamroll tout)
   [ ] Bien équilibré
   [ ] Trop difficile (frustrant)
   [ ] Pas compris comment ça marche

9. As-tu utilisé l'action DÉFENDRE?
   [ ] Oui, souvent (stratégique)
   [ ] Oui, parfois
   [ ] Une fois pour tester
   [ ] Jamais (pourquoi: _____________)

10. As-tu FUI au moins un combat?
    [ ] Oui, ____ fois
    [ ] Non, jamais
    
    Si non, pourquoi?
    [ ] Tous les combats étaient faciles
    [ ] Je voulais tout battre
    [ ] J'ai oublié que c'était possible
    [ ] Autre: _______________

═══════════════════════════════════════
EXPÉRIENCE GÉNÉRALE
═══════════════════════════════════════

11. Le moment le plus COOL du jeu:
    _________________________________
    _________________________________

12. Le moment le plus FRUSTRANT:
    _________________________________
    _________________________________

13. As-tu compris que:
    [ ] C'est un jeu sans "fin" claire
    [ ] C'est juste explorer et survivre
    [ ] Il faut "battre un boss final"
    [ ] Pas compris l'objectif

14. As-tu senti une progression?
    [ ] Oui, claire (équipement meilleur)
    [ ] Un peu
    [ ] Non, stagnation

15. Le retour au hub était:
    [ ] Un moment satisfaisant (repos)
    [ ] Neutre (juste un menu)
    [ ] Chiant (je voulais explorer)

═══════════════════════════════════════
CLARTÉ & COMPRÉHENSION
═══════════════════════════════════════

16. Les mécaniques étaient claires?
    [ ] Oui, tout compris facilement
    [ ] Globalement oui, quelques doutes
    [ ] Plusieurs choses floues
    [ ] Très confus

    Si confus, quoi? _______________

17. L'interface était:
    [ ] Claire et lisible
    [ ] Correct
    [ ] Encombrée/confuse
    [ ] Horrible

18. Les textes étaient:
    [ ] Bien écrits, immersifs
    [ ] Corrects
    [ ] Trop longs/ennuyeux
    [ ] Fautes/erreurs nombreuses

═══════════════════════════════════════
TON RESSENTI
═══════════════════════════════════════

19. Tu as ressenti quelles émotions? (plusieurs choix OK)
    [ ] Tension (danger, stress)
    [ ] Satisfaction (victoires, upgrades)
    [ ] Curiosité (envie d'explorer)
    [ ] Ennui (répétitif, plat)
    [ ] Frustration (bloqué, injuste)
    [ ] Accomplissement (fierté)
    [ ] Autre: _______________

20. Le ton "low fantasy sombre" passe?
    [ ] Oui, bien rendu
    [ ] Un peu
    [ ] Pas senti
    [ ] Trop déprimant

21. Tu rejouerais?
    [ ] Oui, immédiatement
    [ ] Oui, peut-être plus tard
    [ ] Peut-être
    [ ] Non

22. Tu recommanderais à un ami?
    [ ] Oui, sans hésiter
    [ ] Oui, à certains amis (gamers)
    [ ] Peut-être
    [ ] Non

═══════════════════════════════════════
TROIS MOTS POUR DÉCRIRE LE JEU
═══════════════════════════════════════

23. Si tu devais décrire ce jeu en 3 mots:
    
    1. _______________
    2. _______________
    3. _______________

═══════════════════════════════════════
SUGGESTIONS & COMMENTAIRES
═══════════════════════════════════════