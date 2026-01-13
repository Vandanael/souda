# SOUDA — MANUEL DE SURVIE
*Écrit par un vétéran qui a survécu*

## LA SITUATION

Tu es un déserteur. La guerre est finie, mais toi, tu vis encore. Morten, l'usurier de Bourg-Creux, t'a caché. Prix : **80💰**. Tu as **20 jours** pour rembourser. Chaque jour, **+5💰 d'intérêts**. Si tu échoues, ses hommes te retrouvent. Si tu meurs au combat, c'est fini.

**OBJECTIF : Rembourser 80💰 en 20 jours ou mourir.**

---

## LA BOUCLE

**AUBE** → Vérifie dette, or, équipement. Accès : Marché, Morten, Forge, Taverne, Exploration.

**EXPLORATION** → 5 lieux/jour. **3 actions max.** Explore = 1 action. Loot, combat, ou vide. Actions finies → Crépuscule.

**CRÉPUSCULE** → Nuit. Dette +5💰. Résumé du jour. Événements du soir (45% chance) :
- **Textuels** : Rumeurs, voyageurs, lumières dans la forêt, etc.
- **Interactifs** : 8 événements interactifs avec choix et conséquences :
  - Marchand de passage (acheter/négocier/refuser)
  - Lumières dans la forêt (aller voir/rester caché/embuscade)
  - Message sur arbre (accepter/ignorer/détruire)
  - Voyageurs (partager repas/échanger/voler)
  - Ancien soldat (partager/éviter/voler)
  - Campement abandonné (explorer/laisser/piller)
  - Message d'un contact (suivre/ignorer/dénoncer)
  - Réfugiés au camp (partager/chasser/négocier)

**MONOLOGUES INTÉRIEURS** : Selon tes compteurs narratifs (cynisme, humanité, pragmatisme) :
- **Cynisme élevé** : Monologues sombres sur la perte d'humanité
- **Humanité élevée** : Monologues d'espoir et de rédemption
- **Pragmatisme élevé** : Monologues sur l'efficacité et la logique
- **Combinaisons** : Monologues spéciaux si plusieurs compteurs sont élevés
- **Équilibre** : Monologues sur la complexité humaine

Jour 20 + dette = 0 → Victoire. Sinon → Nouveau jour.

**20 JOURS MAX.** Pas de négociation.

---

## LE COMBAT

Résolution automatique. **PUISSANCE = (ATK×0.5) + (DEF×0.3) + (VIT×0.2) + RANDOM**

- Toi : random 1-20 | Ennemi : random 1-15
- **RATIO = Ta puissance / Puissance ennemie**

**RÉSULTATS :**
- **>1.4** : Écrasant. Or, pas de dégâts.
- **>1.0** : Victoire. Or.
- **>0.7** : Coûteux. Or, -10-20% durabilité 1 item.
- **>0.4** : Fuite. -15% durabilité 1-2 items. Pas d'or.
- **≤0.4** : **MORT.** Fin.

**Conseil :** Ratio < 0.5 ? Fuis. Mieux perdre durabilité que mourir.

---

## L'ÉCONOMIE

**DETTE : 80💰 départ, +5💰/jour.** Jour 20 non payé = Morten envoie ses hommes.

**RÉPUTATION (⭐)** : 1-5. Plus d'étoiles = meilleurs prix de vente, mais prix d'achat baissent.

**PRIX VENTE** = Base × Rareté × Réputation
- Commun ×1.0 | Peu commun ×1.5 | Rare ×2.5 | Légendaire ×5.0

**PRIX ACHAT** = Base × 1.5 × Rareté × Réputation (inversé)

**Conseil :** Vends réputation haute, achète réputation basse.

---

## L'ÉQUIPEMENT

**SLOTS :** Tête, Torse, Jambes, Mains, Arme, Secondaire, Accessoire | **Inventaire : 10 max**

**RARETÉS :** Commun (×1.0) | Peu commun (×1.5) | Rare (×2.5) | Légendaire (×5.0)

**DURABILITÉ :**
- 100-51% : Normal (×1.0)
- 50-26% : Usé (×0.8)
- 25-1% : Endommagé (×0.5)
- 0% : Cassé (×0.0)

**PROPRIÉTÉS :** Léger (+VIT) | Lourd (+DEF, -VIT) | Rouillé (-durabilité) | Sanglant (+ATK) | Béni (résistance) | Solide (indestructible)

**ITEMS COMPROMIS** : Items spéciaux obtenus via le Marchand Mystérieux (pas de magie, juste des objets avec défauts) :
- **Épée Lourde de Guerre** : +20 ATK, mais -5 VIT (trop lourde)
- **Armure de Pillard** : +25 DEF, mais -10% or gagné (réputation de pillard)
- **Amulette de Déserteur** : +15 VIT, mais -1 réputation (symbole de déserteur)
- **Bottes Usées de Voyageur** : +5 DEF, +10 VIT, mais -3 DEF (protection insuffisante)
- Affichés avec badge **COMPROMIS** rouge. Les malus sont maintenant **visibles avant équipement** avec description détaillée. Comparaison stats avant/après disponible.

**Conseil :** Répare avant cassage. Item cassé = inutile.

---

## LE HUB (AUBE)

**MARCHÉ** : Vends items non-équipés. Achète 3-5 items/jour (stock change). Prix selon réputation. **Bonus humanité** : Si humanité >= 10, +5% prix de vente. **Bonus cynisme** : Si cynisme >= 10, -10% prix d'achat (négociation agressive).

**MORTEN** : Rembourse dette. Plus tôt = moins d'intérêts. Dette >150💰 = menaçant.

**FORGE** : Répare items. Coût = (max - actuel) × 0.4 × rareté (réduit de 20%). **Bonus pragmatisme** : Si pragmatisme >= 10, -10% coût de réparation. 20% chance item rare/légendaire à vendre (prix = valeur × 2).

**TAVERNE** : 
- **Rumeurs** : 1-2/jour (persistent 3 jours). Les rumeurs influencent le gameplay :
  - ⚔️ Rumeur "combat" : Augmente les chances de combat dans les lieux ciblés (30% → 50%)
  - 💰 Rumeur "loot" : Augmente les chances de trésor (40% → 60%) et améliore la qualité du loot (+50% rares/légendaires)
  - ⚠️ Rumeur "event" : Augmente les chances d'événement narratif (20% → 50%)
  - 📍 Rumeur "location" : Pointe vers un lieu spécifique
- **PNJ** : Dialogues avec informations et quêtes
- **Repas** : 5💰 pour restaurer ton moral (+1 humanité). Si tu ne manges pas, -1 action le jour suivant (fatigue)

**INVENTAIRE** : 10 slots. Équipe/déséquipe. Stats réelles.

---

## L'EXPLORATION

**5 LIEUX/JOUR.** Risque (⭐ 1-4) = chance combat. Richesse (💰 1-4) = qualité loot. *Risque augmente légèrement avec les jours (+0.1/jour, max +1).*

**LIEUX :** Village Fantôme (1-2⭐, 2💰) | Champ Bataille (2-3⭐, 3💰) | Ferme (1-2⭐, 1💰) | Monastère (2⭐, 4💰) | Fort (3-4⭐, 4💰) | Forêt (2⭐, 1💰) | Carrière (2-3⭐, 2💰) | **Cache au Trésor** (3-4⭐, 5💰) - Lieu spécial révélé par la carte du Marchand Mystérieux

**PERSISTANCE DES LIEUX :** Les lieux sont persistants entre les jours. Un lieu garde les mêmes valeurs de risque et richesse. Si tu explores un lieu déjà visité, les récompenses sont réduites de 50% (or et probabilité de loot).

**ÉVÉNEMENTS :** 40% Loot | 30% Combat | 20% Choix narratif | 10% Vide

**FEEDBACK COMBAT** : Avant d'explorer un lieu, tu vois un warning visuel :
- **⚠️ DANGER** (rouge) : Ratio estimé < 0.5 → Combat très risqué, fuis !
- **⚠️ RISQUÉ** (jaune) : Ratio estimé < 0.7 → Combat difficile
- **✓ SÛR** (vert) : Ratio estimé > 1.0 → Combat gagnable

**ÉVÉNEMENTS NARRATIFS** (système complet implémenté) :
- **Convoi** (J4-6, one-time) : À l'aube. Embuscade, ignorer, ou prévenir les gardes.
- **Collecteurs** (J12+, dette>100) : Au crépuscule ou à la taverne. Payer, négocier, ou résister.
- **Peste** (J10+) : Au crépuscule. Éviter, porter masque, ou aider les malades.
- **Marchand Mystérieux** (J7-15, one-time) : À l'aube ou à la taverne. Acheter objet maudit, carte, décliner, ou dénoncer.
- **Réfugiés** (10% chance/exploration) : Pendant l'exploration. Donner or, partager nourriture, ignorer, ou voler.

**SYSTÈME DE DÉCLENCHEMENT :** Les événements sont vérifiés automatiquement selon la phase (aube, exploration, crépuscule, taverne). Un seul événement narratif par phase maximum. Cooldown de 3 jours entre déclenchements du même événement (sauf one-time).

**3 ACTIONS/JOUR.** Pas de récupération.

---

## STATS

**ATK** : Dégâts infligés. **DEF** : Dégâts encaissés. **VIT** : Agilité, influe puissance.

**CALCUL :** Stats = Somme items équipés. Durabilité réduit stats. **Items maudits** appliquent des malus cachés aux stats.

**Conseil :** Équilibre ATK/DEF. Trop ATK sans DEF = mort rapide. Trop DEF sans ATK = jamais de victoire.

---

## COMPTEURS NARRATIFS

Trois compteurs suivent tes choix et actions :

- **CYNISME** : Augmente avec les choix égoïstes, violents, ou pragmatiques. Monologues sombres au crépuscule.
- **HUMANITÉ** : Augmente avec les choix altruistes, généreux, ou moraux. Monologues d'espoir au crépuscule.
- **PRAGMATISME** : Augmente avec les choix logiques, efficaces, ou calculés. Monologues sur l'efficacité au crépuscule.

**EFFETS SUR LE GAMEPLAY :**
- **Monologues du crépuscule** : Changent selon tes compteurs (niveaux 5, 10, 15, 20+)
- **Prix marché** : Humanité >= 10 → +5% prix de vente | Cynisme >= 10 → -10% prix d'achat
- **Réparation** : Pragmatisme >= 10 → -10% coût de réparation
- **Réputation** : Humanité >= 15 → +1 réputation bonus | Cynisme >= 15 → -1 réputation malus
- **Événements narratifs** : Certains choix nécessitent un compteur minimum (humanité, cynisme, ou pragmatisme)
- **Fins de partie** : 4 nouvelles fins basées sur tes compteurs (humanité >= 15, cynisme >= 15, pragmatisme >= 15, ou équilibré)

---

## CONSEILS

1. **Rembourse tôt.** +5💰/jour. Attendre = impossible.
2. **Gère durabilité.** 30% = stats ÷2. Répare avant.
3. **Évite combats perdus.** Ratio < 0.5 ? Fuis.
4. **Vends réputation haute**, achète basse.
5. **Explore lieux riches** (Monastère, Fort) = meilleur loot, plus dangereux.
6. **Garde de l'or.** Répare, achète si crucial.
7. **20 jours = court.** Chaque action compte.
8. **Utilise les rumeurs.** Les rumeurs "loot" augmentent drastiquement tes chances de trouver des trésors. Les rumeurs "combat" te préparent aux dangers.
9. **Mange régulièrement.** 5💰 pour un repas évite la fatigue (-1 action). C'est un investissement rentable.
10. **Attention aux items compromis.** Puissants mais avec des malus. Les malus sont maintenant **visibles avant équipement** - vérifie toujours la comparaison stats !
11. **La carte révélée** débloque un lieu spécial très riche (Cache au Trésor). Si tu l'achètes au Marchand Mystérieux, profites-en.
12. **Les événements du soir** (45% chance) peuvent être interactifs. 8 événements différents avec choix variés. Choisis bien selon tes objectifs.
13. **Utilise les warnings combat.** Si tu vois "DANGER", évite ce lieu ou améliore ton équipement d'abord.
14. **Maximise tes compteurs narratifs.** Ils ont un impact réel : meilleurs prix, réparations moins chères, nouvelles fins de partie.
15. **Les rumeurs sont importantes.** Un tutorial s'affiche au premier affichage - lis-le attentivement !

---

## FIN

**VICTOIRE :** Jour 20, dette = 0. Libre. **9 fins différentes** selon tes choix :
- **4 fins basées sur compteurs narratifs** (priorité haute) :
  - **La Rédemption** : Humanité >= 15
  - **La Survie** : Cynisme >= 15
  - **L'Efficacité** : Pragmatisme >= 15
  - **L'Équilibre** : Compteurs équilibrés (tous >= 5, différence < 5)
- **5 fins basées sur stats/or** :
  - **Le Seigneur des Ruines** : Réputation 5⭐, or >= 200, humanité > cynisme
  - **Le Roi des Charognes** : Or >= 300
  - **Le Rédempteur** : Humanité >= 10, cynisme < 3
  - **Le Fantôme** : Réputation <= 2, pragmatisme dominant
  - **Le Survivant** : Fin par défaut

**DÉFAITE :** Mort combat (ratio ≤ 0.4) | Jour 20 dette > 0 (Morten te trouve)

**Pas de deuxième chance.** Meurs. Apprends. Recommence.

---

*"La guerre est finie. Mais toi, tu vis encore. Pour combien de temps ?"*

**Bonne chance, déserteur.**

---

## NOTES TECHNIQUES

*Éléments vérifiés dans le code :*
- ✅ Boucle de jeu : Aube → Exploration → Crépuscule
- ✅ Combat : Formule puissance, seuils ratio
- ✅ Économie : Dette 80💰, intérêts +5💰/jour, réputation
- ✅ Équipement : Slots, raretés, durabilité, propriétés
- ✅ Hub : Marché, Morten, Forge, Taverne, Inventaire
- ✅ Exploration : 5 lieux/jour, 3 actions, événements
- ✅ Coût réparation : (max - actuel) × 0.4 × rareté (réduit de 20%)
- ✅ Événements narratifs : 5 événements implémentés avec système de déclenchement automatique
- ✅ Tutorial Jour 0 : Implémenté (4 étapes, 90s)
- ✅ Scaling risque : +0.1/jour (max +1)
- ✅ **Système de rumeurs** : Rumeurs influencent probabilités d'événements et qualité du loot
- ✅ **Lieux persistants** : Lieux gardent leurs valeurs entre les jours, système de revisite avec récompenses réduites
- ✅ **Système de repas** : Achat de repas à la taverne (5💰), pénalité si non mangé
- ✅ **Carte révélée** : Lieu spécial "Cache au Trésor" débloqué si carte achetée
- ✅ **Items maudits** : Pool d'items spéciaux avec malus cachés
- ✅ **Monologues du crépuscule** : Système enrichi avec progression par compteurs narratifs
- ✅ **Événements du soir interactifs** : 8 événements avec choix (probabilité 45%)
- ✅ **Feedback combat** : Warnings visuels (DANGER/RISQUÉ/SÛR) avant exploration
- ✅ **Impact compteurs narratifs** : Bonus prix marché, réparation, réputation, événements
- ✅ **Fins multiples** : 9 fins différentes (4 basées sur compteurs narratifs)
- ✅ **Balance économique améliorée** : Revenus +15%, réparations -20%
- ✅ **Feedback items compromis** : Malus visibles avant équipement, comparaison stats
- ✅ **Onboarding rumeurs** : Tutorial modal au premier affichage
- ❌ Coût logement 2💰/nuit : Mentionné dans GDD/Taverne mais **non déduit automatiquement** dans le code
- ❌ Scaling stats ennemis : Configuré dans balance.ts (+5%/jour) mais **non appliqué** dans getRandomEnemy/resolveCombat (ennemis sélectionnés selon risque uniquement)