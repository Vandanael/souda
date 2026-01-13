# RAPPORT D'ÉQUILIBRAGE ÉCONOMIQUE - SIMULATION MONTE CARLO

**Date :** 2024  
**Méthodologie :** Analyse mathématique des paramètres économiques du jeu

---

## 📊 PARAMÈTRES DE BASE

### Économie
- **Dette initiale :** 80💰
- **Intérêts quotidiens :** 3💰/jour (réduit à 2💰/jour si dette > 120 au J15+)
- **Durée :** 20 jours
- **Dette finale minimum (sans remboursement) :** 80 + (3 × 19) = **137💰**

### Coûts fixes
- **Repas :** 4💰/jour (optionnel mais recommandé)
- **Pénalité si pas mangé :** -1 action le jour suivant (minimum 2 actions)
- **Actions par jour :** 3 (2 si pas mangé la veille)

### Multiplicateurs
- **Multiplicateur or gagné :** 1.35 (+35%)
- **Réputation de départ :** ⭐⭐⭐ (neutre)

---

## 💰 GAINS MOYENS PAR SOURCE

### 1. Exploration (3 actions/jour)

#### Loot direct (40% chance)
- **Or direct :** `richness × 10` à `richness × 30` × 1.35
- **Richesse moyenne des lieux :** 2-3 (selon type)
- **Gain moyen or direct :** (2.5 × 20) × 1.35 = **~68💰** (si richesse 2.5)
- **Gain moyen or direct :** (3 × 20) × 1.35 = **~81💰** (si richesse 3)

#### Items (70% chance si loot, 30% or)
- **Probabilités de rareté (risque normal) :**
  - Commun : 60% (valeur base ~10💰)
  - Peu commun : 30% (valeur base ~25💰)
  - Rare : 9% (valeur base ~45💰)
  - Légendaire : 1% (valeur base ~100💰+)

- **Prix de vente moyen (réputation ⭐⭐⭐) :**
  - Commun : 10💰 (10 × 1.0 × 1.0)
  - Peu commun : 37.5💰 (25 × 1.5 × 1.0)
  - Rare : 112.5💰 (45 × 2.5 × 1.0)
  - Légendaire : 500💰+ (100 × 5.0 × 1.0)

- **Valeur moyenne item vendu :** (0.6 × 10) + (0.3 × 37.5) + (0.09 × 112.5) + (0.01 × 500) = **~28💰**

#### Combat (30% chance)
- **Gain moyen selon ennemi :**
  - Risque 1 : 5-15💰 (moyenne 10💰)
  - Risque 2 : 8-20💰 (moyenne 14💰)
  - Risque 3 : 15-35💰 (moyenne 25💰)
  - Risque 4 : 15-35💰 (moyenne 25💰)

- **Gain moyen combat (risque moyen 2-3) :** ~15-20💰

#### Lieu vide (10% chance)
- **Gain :** 0💰

#### Calcul gain moyen par exploration
- **Loot (40%) :** 0.7 × 28💰 (item) + 0.3 × 68💰 (or) = **~40💰**
- **Combat (30%) :** 17.5💰 (moyenne)
- **Choix (20%) :** Variable (estimé 10💰)
- **Vide (10%) :** 0💰

**Gain moyen par action d'exploration :** (0.4 × 40) + (0.3 × 17.5) + (0.2 × 10) + (0.1 × 0) = **~24💰**

**Gain moyen par jour (3 actions) :** 24 × 3 = **~72💰**

### 2. Événements narratifs

#### Événement "Convoi" (J4-6, one-time)
- **Gain :** 30-50💰 (moyenne 40💰)
- **Coût :** -1 réputation (si embuscade)

#### Événement "Réfugiés" (15% chance/exploration, cooldown 3 jours)
- **Gain si vol :** 5-15💰 (moyenne 10💰)
- **Coût si aide :** -8💰

#### Événement "Collecteurs" (J12+, si dette > 100)
- **Coût :** -20💰 (si paye) ou -30 dette (si résiste)

#### Événement "Peste" (J10+, 15% chance, cooldown)
- **Coût :** -10💰 (masque) ou -5💰 (aider) ou -1 action (éviter)

**Gain moyen événements sur 20 jours :** ~50-80💰 (selon choix)

### 3. Vente d'items trouvés

**Estimation :** ~2-3 items/jour vendus (selon inventaire)
**Gain moyen :** 2.5 × 28💰 = **~70💰/jour** (si vend tout)

---

## 📈 SIMULATION 1 : LA RUN "PAUVRE" (10% chance de succès)

### Hypothèses
- Le joueur ne gagne que 10% des jets de chance
- Échecs fréquents en combat (fuite ou défaite)
- Loot principalement commun
- Peu d'événements favorables

### Calculs

#### Revenus moyens (réduits de 90%)
- **Exploration :** 72💰 × 0.1 = **~7💰/jour**
- **Événements :** 50💰 × 0.1 = **~5💰 sur 20 jours**
- **Vente items :** 70💰 × 0.1 = **~7💰/jour**

**Revenu total moyen :** 7 + 7 = **~14💰/jour**

#### Dépenses
- **Intérêts :** 3💰/jour
- **Repas (optionnel) :** 4💰/jour
- **Total :** 7💰/jour (si mange) ou 3💰/jour (si ne mange pas)

#### Bilan net
- **Avec repas :** 14 - 7 = **+7💰/jour**
- **Sans repas :** 14 - 3 = **+11💰/jour** (mais -1 action/jour)

#### Sur 20 jours
- **Revenu total :** 14 × 20 = **280💰**
- **Dette finale :** 80 + (3 × 19) = **137💰**
- **Or disponible :** 280 - (7 × 20) = **140💰** (si mange) ou 280 - (3 × 20) = **220💰** (si ne mange pas)

**Conclusion :** ✅ **POSSIBLE** de rembourser la dette (140💰 > 137💰), mais très serré. Sans repas, c'est plus confortable (220💰 > 137💰).

**⚠️ ALERTE :** Si le joueur a plusieurs mauvais jours consécutifs (défaites en combat, peu de loot), il peut rapidement se retrouver dans une spirale négative.

---

## 💀 SIMULATION 2 : LA SPIRALE DE LA MORT (Pas de nourriture)

### Hypothèses
- Le joueur ne mange jamais (économise 4💰/jour)
- Pénalité : -1 action/jour (2 actions au lieu de 3)
- Revenus réduits de 33% (2 actions au lieu de 3)

### Calculs

#### Revenus (2 actions/jour)
- **Exploration :** 24💰 × 2 = **48💰/jour**
- **Événements :** Inchangé (~50💰 sur 20 jours)
- **Vente items :** Réduite (~47💰/jour)

**Revenu total :** 48 + 47 = **~95💰/jour**

#### Dépenses
- **Intérêts :** 3💰/jour
- **Repas :** 0💰 (ne mange pas)

**Bilan net :** 95 - 3 = **+92💰/jour**

#### Sur 20 jours
- **Revenu total :** 95 × 20 = **1900💰**
- **Dette finale :** 137💰
- **Or disponible :** 1900 - (3 × 20) = **1840💰**

**Conclusion :** ✅ **TRÈS FACILE** de rembourser la dette. La pénalité de -1 action n'est pas assez sévère pour compenser l'économie de 4💰/jour.

**⚠️ ALERTE CRITIQUE :** Le système de faim est **trop faible**. Le joueur peut ignorer complètement la nourriture sans conséquence majeure. La pénalité de -1 action ne suffit pas.

**Recommandation :** 
- Augmenter la pénalité à -2 actions (1 action/jour seulement)
- Ou ajouter une pénalité de stats (-10% ATK/DEF/VIT)
- Ou ajouter une pénalité cumulative (chaque jour sans manger = pénalité croissante)

---

## 🔄 SIMULATION 3 : L'INFLATION (Exploits potentiels)

### Analyse des systèmes de trade

#### 1. Achat/Revente d'items
- **Prix d'achat :** `valeur × 1.5 × rareté × réputation`
- **Prix de vente :** `valeur × rareté × réputation`

**Exemple (item commun, valeur 10, réputation ⭐⭐⭐) :**
- Achat : 10 × 1.5 × 1.0 × 1.0 = **15💰**
- Vente : 10 × 1.0 × 1.0 = **10💰**
- **Perte :** -5💰

**Conclusion :** ❌ Pas d'exploit possible. Le système est conçu pour perdre de l'argent en achat/revente.

#### 2. Événement "Réfugiés" répété
- **Probabilité :** 15% par exploration, cooldown 3 jours
- **Gain si vol :** 5-15💰 (moyenne 10💰)
- **Fréquence max :** ~1 fois tous les 3 jours

**Gain potentiel :** 10💰 × (20/3) = **~67💰 sur 20 jours**

**Conclusion :** ⚠️ Exploit mineur possible, mais limité par le cooldown. Pas critique.

#### 3. Événement "Convoi" (one-time)
- **Gain :** 30-50💰 (moyenne 40💰)
- **One-time :** Ne peut se déclencher qu'une fois

**Conclusion :** ✅ Pas d'exploit.

#### 4. Vente d'items légendaires
- **Prix de vente :** `valeur × 5.0 × réputation`
- **Avec réputation ⭐⭐⭐⭐⭐ :** `valeur × 5.0 × 1.2 = valeur × 6.0`
- **Avec humanité >= 8 :** `valeur × 5.0 × 1.2 × 1.1 = valeur × 6.6`

**Exemple (item légendaire, valeur 100) :**
- Prix de vente max : 100 × 6.6 = **660💰**

**Conclusion :** ⚠️ Les items légendaires sont très rentables, mais leur probabilité est faible (1-3%). Pas d'exploit systématique possible.

#### 5. Système de réparation
- **Coût :** `(max - current) × 0.25 × rareté`
- **Avec pragmatisme >= 8 :** -15% coût

**Conclusion :** ✅ Pas d'exploit. Le système est cohérent.

#### 6. Événement "Collecteurs" - Négociation
- **Condition :** Réputation >= 3
- **Effet :** -10 dette, +1 pragmatisme
- **Coût :** 0💰

**Conclusion :** ⚠️ Exploit potentiel si l'événement se répète. Mais l'événement nécessite `debt > 100` et `day >= 12`, donc limité.

### Exploits détectés

| Exploit | Gravité | Description | Fix suggéré |
|---------|---------|-------------|-------------|
| Ignorer la nourriture | **CRITIQUE** | Pénalité -1 action insuffisante | Augmenter à -2 actions ou ajouter pénalité stats |
| Événement "Réfugiés" répété | **Faible** | Gain 10💰 tous les 3 jours | Limiter à 3-5 fois max sur 20 jours |
| Négociation "Collecteurs" gratuite | **Moyenne** | Réduction dette sans coût | Ajouter coût minimal (ex: -5💰) |

---

## 📊 BILAN GLOBAL

### Difficulté moyenne

**Scénario optimal (joueur compétent) :**
- Revenus : ~72💰/jour (exploration) + ~70💰/jour (vente) = **142💰/jour**
- Dépenses : 3💰 (intérêts) + 4💰 (repas) = **7💰/jour**
- **Bilan net :** +135💰/jour
- **Sur 20 jours :** 2700💰 - 137💰 (dette) = **2563💰 de marge**

**Conclusion :** Le jeu est **relativement facile** pour un joueur compétent.

### Points d'alerte

| Problème | Gravité | Impact |
|----------|---------|--------|
| **Pénalité faim trop faible** | **CRITIQUE** | Le joueur peut ignorer complètement la nourriture |
| **Gains moyens élevés** | **Moyenne** | Le joueur a beaucoup de marge, peut être trop facile |
| **Intérêts trop faibles** | **Moyenne** | 3💰/jour = seulement 57💰 sur 19 jours |
| **Pas de système de logement** | **Faible** | Mentionné dans GDD mais pas implémenté (2💰/nuit) |

---

## 🎯 RECOMMANDATIONS D'ÉQUILIBRAGE

### 1. Système de faim (PRIORITÉ HAUTE)
- **Option A :** Augmenter pénalité à -2 actions (1 action/jour seulement)
- **Option B :** Ajouter pénalité de stats (-10% ATK/DEF/VIT par jour sans manger, max -30%)
- **Option C :** Système cumulatif : Jour 1 sans manger = -1 action, Jour 2 = -2 actions, Jour 3+ = mort

### 2. Intérêts de la dette
- **Option A :** Augmenter à 4💰/jour (au lieu de 3)
- **Option B :** Intérêts progressifs : 3💰 J1-10, 4💰 J11-15, 5💰 J16-20

### 3. Coûts fixes
- **Implémenter le logement :** 2💰/nuit (mentionné dans GDD)
- **Total dépenses/jour :** 3💰 (intérêts) + 4💰 (repas) + 2💰 (logement) = **9💰/jour**

### 4. Réduire les gains moyens
- **Option A :** Réduire multiplicateur or de 1.35 à 1.20 (+20% au lieu de +35%)
- **Option B :** Réduire richesse moyenne des lieux
- **Option C :** Augmenter probabilité de lieux vides (10% → 20%)

### 5. Limiter les exploits
- **Événement "Réfugiés" :** Limiter à 3-5 déclenchements max sur 20 jours
- **Négociation "Collecteurs" :** Ajouter coût minimal (-5💰)

---

## 📈 PROJECTION AVEC CORRECTIONS

### Scénario corrigé (avec recommandations)

#### Paramètres ajustés
- **Intérêts :** 4💰/jour
- **Repas :** 4💰/jour (obligatoire avec pénalité -2 actions)
- **Logement :** 2💰/jour
- **Total dépenses :** 10💰/jour
- **Multiplicateur or :** 1.20 (au lieu de 1.35)
- **Gains moyens :** Réduits de ~11% (72💰 → 64💰/jour)

#### Nouveau calcul
- **Revenus :** 64💰 (exploration) + 62💰 (vente) = **126💰/jour**
- **Dépenses :** 10💰/jour
- **Bilan net :** +116💰/jour
- **Sur 20 jours :** 2320💰 - 156💰 (dette finale) = **2164💰 de marge**

**Conclusion :** Toujours confortable, mais plus équilibré. Le joueur doit gérer ses ressources.

---

## ✅ VALIDATION FINALE

### Scénario "Pauvre" avec corrections
- **Revenus :** 126💰 × 0.1 = **12.6💰/jour**
- **Dépenses :** 10💰/jour
- **Bilan net :** +2.6💰/jour
- **Sur 20 jours :** 52💰 - 156💰 = **-104💰**

**Conclusion :** ❌ **IMPOSSIBLE** de rembourser la dette dans le scénario "pauvre" avec les corrections. Le jeu devient **trop difficile**.

### Ajustement final recommandé
- **Multiplicateur or :** 1.25 (compromis entre 1.20 et 1.35)
- **Intérêts :** 3.5💰/jour (compromis)
- **Pénalité faim :** -2 actions OU -1 action + pénalité stats -5%

---

## 📝 CONCLUSION

Le jeu est actuellement **trop facile** pour un joueur compétent, mais les corrections proposées le rendraient **trop difficile** pour un joueur malchanceux. Il faut trouver un équilibre.

**Recommandation finale :** Implémenter les corrections progressivement et tester avec des joueurs réels pour ajuster finement les valeurs.
