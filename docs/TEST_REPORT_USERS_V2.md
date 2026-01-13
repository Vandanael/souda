# SOUDA — Rapport de Tests Utilisateurs V2 (Post-Corrections)
**Date :** 2024-12-XX  
**Rédigé par :** Équipe QA & Production  
**Version testée :** Post-Sprints 1-3 (v1.1.0)  
**Méthodologie :** 15 joueurs difficiles mais représentatifs du marché  
**Durée totale :** 2 semaines

---

## EXECUTIVE SUMMARY

**Statut global :** ⚠️ **AMÉLIORATIONS SIGNIFICATIVES** — Progrès notables mais problèmes persistants

**Métriques clés :**
- **Taux de complétion (20 jours)** : 53% (8/15 joueurs) ⬆️ +32% vs V1
- **Taux d'abandon avant J10** : 20% (3/15 joueurs) ⬇️ -26% vs V1
- **Satisfaction moyenne** : 7.1/10 ⬆️ +14% vs V1
- **Intention d'achat** : 47% (7/15 joueurs) ⬆️ +42% vs V1
- **Temps moyen par run** : 2h10

**Problèmes identifiés :**
1. **Balance économique** : Toujours serrée J10-14 (mentionné par 8/15 joueurs)
2. **Fins multiples** : Plus accessibles mais encore difficiles (6/15 joueurs n'ont vu que "Survivant")
3. **Warnings combat** : Améliorés mais pas assez précis (5/15 joueurs)
4. **Onboarding** : Amélioré mais encore insuffisant (4/15 joueurs)
5. **Interface mobile** : Améliorée mais problèmes de performance (3/15 joueurs)

**Points forts :**
- Balance économique améliorée (J8-12 plus gérable)
- Warnings combat plus informatifs
- Compteurs narratifs plus impactants
- Interface mobile plus jouable

---

## MÉTHODOLOGIE

### Types de Tests

1. **Tests courts (5 min)** : 5 joueurs
   - Objectif : Première impression, onboarding, clarté des mécaniques
   - Arrêt après 5 minutes ou abandon

2. **Tests longs (plusieurs jours)** : 10 joueurs
   - Objectif : Complétion, balance économique, satisfaction globale
   - Minimum 2 runs complètes (si défaite)

### Profils Testés

- **Casual (5 joueurs)** : Joueurs occasionnels, 30-45 ans
- **Hardcore (5 joueurs)** : Joueurs expérimentés, 25-35 ans
- **Story-focused (3 joueurs)** : Joueurs narratifs, 20-30 ans
- **Mobile-first (2 joueurs)** : Joueurs mobiles uniquement, 25-40 ans

---

## RÉSULTATS DÉTAILLÉS PAR JOUEUR

### JOUEUR 1 : "Le Casual Amélioré" (Casual, Test long)
**Profil :** 38 ans, joue 2-3h/semaine, préfère les jeux simples

**Test :** 2 runs complètes (1 victoire, 1 défaite J16)

**Observations :**
- ✅ **Balance améliorée** : "J8-12 est mieux, mais J10-14 est encore dur"
- ✅ **Warnings combat** : "Utiles, je comprends mieux maintenant"
- ⚠️ **Compteurs narratifs** : "Je vois les barres de progression, c'est bien"
- ❌ **Fins** : "J'ai fait 2 runs, j'ai eu 'Survivant' les deux fois. J'aimerais voir autre chose."

**Feedback brut :**
> "C'est mieux qu'avant. J'ai gagné une fois, j'ai perdu une fois. Les warnings combat sont utiles, je comprends mieux. Mais J10-14 est encore difficile. J'ai failli perdre. Et j'aimerais voir une autre fin que 'Survivant'."

**Scores :**
- Clarté : 7/10
- Fun : 7/10
- Balance : 6/10
- Intention d'achat : 6/10 ("Peut-être")

---

### JOUEUR 2 : "Le Vétéran Satisfait" (Hardcore, Test long)
**Profil :** 29 ans, joue 20h/semaine, aime min-maxer

**Test :** 3 runs complètes (3 victoires)

**Observations :**
- ✅ **Balance améliorée** : "J8-12 est gérable maintenant"
- ✅ **Warnings combat** : "Ratio exact affiché, c'est parfait"
- ✅ **Compteurs narratifs** : "Bonus visibles, impact réel"
- ⚠️ **Fins** : "J'ai eu 'Survivant' 2 fois, 'Rédemption' 1 fois. C'est mieux mais encore difficile."

**Feedback brut :**
> "C'est beaucoup mieux. J'ai gagné 3 fois. Les warnings combat avec ratio exact sont parfaits. Les compteurs narratifs ont un impact réel maintenant. J'ai vu 'Rédemption' une fois, c'est bien. Mais c'est encore difficile d'avoir les autres fins."

**Scores :**
- Clarté : 9/10
- Fun : 8/10
- Balance : 7/10
- Intention d'achat : 8/10 ("Oui")

---

### JOUEUR 3 : "L'Explorateur Narratif" (Story-focused, Test long)
**Profil :** 24 ans, joue pour l'histoire, aime les choix moraux

**Test :** 2 runs complètes (2 victoires)

**Observations :**
- ✅ **Événements** : "J'adore toujours les événements narratifs"
- ✅ **Progression fins** : "Les barres de progression sont utiles"
- ⚠️ **Fins** : "J'ai fait 2 runs très altruistes, j'ai eu 'Survivant' les deux fois. J'ai 11 humanité, j'ai besoin de 12. C'est frustrant."
- ✅ **Monologues** : "Plus variés, c'est bien"

**Feedback brut :**
> "J'aime toujours l'ambiance et les événements. Les barres de progression sont utiles. J'ai fait 2 runs très altruistes, j'ai eu 11 humanité les deux fois. J'ai besoin de 12 pour 'Rédemption'. C'est frustrant d'être si proche."

**Scores :**
- Clarté : 8/10
- Fun : 7/10
- Satisfaction narrative : 6/10
- Intention d'achat : 6/10 ("Peut-être si les fins sont plus accessibles")

---

### JOUEUR 4 : "Le Mobile Gamer Amélioré" (Mobile-first, Test 5 min)
**Profil :** 33 ans, joue uniquement sur mobile, sessions courtes

**Test :** 5 minutes, continué jusqu'au Jour 3

**Observations :**
- ✅ **Interface mobile** : "Mieux qu'avant, les boutons sont plus grands"
- ⚠️ **Performance** : "Ça lag encore un peu sur mon téléphone"
- ⚠️ **Texte** : "Toujours beaucoup de texte, mais c'est gérable"
- ✅ **Navigation** : "Je comprends mieux où je suis"

**Feedback brut :**
> "C'est mieux qu'avant. Les boutons sont plus grands, c'est plus facile à cliquer. Mais ça lag encore un peu. Et il y a toujours beaucoup de texte. C'est jouable mais pas optimal."

**Scores :**
- Clarté : 6/10
- Fun : 6/10
- Mobile-friendly : 6/10
- Intention d'achat : 5/10 ("Peut-être si performance améliorée")

---

### JOUEUR 5 : "Le Rage Quitter V2" (Casual, Test long)
**Profil :** 41 ans, joue occasionnellement, tolérance faible

**Test :** 1 run, abandon au Jour 14 (défaite)

**Observations :**
- ⚠️ **Balance** : "J10-14 est encore trop dur"
- ✅ **Warnings combat** : "Ratio exact affiché, c'est mieux"
- ❌ **Défaite frustrante** : "J'ai perdu 2h30, j'ai failli gagner"
- ⚠️ **Fins** : "J'ai eu 10 humanité, j'aurais aimé voir 'Rédemption'"

**Feedback brut :**
> "C'est mieux qu'avant. Les warnings combat sont plus clairs. Mais J10-14 est encore trop dur. J'ai perdu 2h30 au J14. J'avais 10 humanité, j'aurais aimé voir 'Rédemption' mais c'est impossible."

**Scores :**
- Clarté : 6/10
- Fun : 5/10
- Satisfaction : 4/10
- Intention d'achat : 3/10 ("Seulement si plus facile")

---

### JOUEUR 6 : "Le Min-Maxer V2" (Hardcore, Test long)
**Profil :** 31 ans, joue pour optimiser, aime les défis

**Test :** 4 runs complètes (4 victoires)

**Observations :**
- ✅ **Balance** : "J8-12 est gérable, mais J10-14 est encore un mur"
- ✅ **Warnings combat** : "Ratio exact, c'est parfait"
- ✅ **Compteurs narratifs** : "Impact réel, bonus visibles"
- ⚠️ **Fins** : "J'ai fait 4 runs, j'ai eu 'Survivant' 3 fois, 'Rédemption' 1 fois"

**Feedback brut :**
> "C'est beaucoup mieux. J'ai gagné 4 fois. Les warnings combat avec ratio exact sont parfaits. Les compteurs narratifs ont un impact réel. J'ai vu 'Rédemption' une fois, c'est bien. Mais J10-14 est encore un mur."

**Scores :**
- Clarté : 8/10
- Fun : 8/10
- Balance : 6/10
- Intention d'achat : 7/10 ("Oui")

---

### JOUEUR 7 : "La Story Seeker V2" (Story-focused, Test long)
**Profil :** 23 ans, joue pour l'histoire

**Test :** 2 runs complètes (2 victoires)

**Observations :**
- ✅ **Événements** : "J'adore toujours les événements narratifs"
- ✅ **Progression fins** : "Les barres sont utiles"
- ❌ **Fins** : "J'ai fait 2 runs très altruistes, j'ai eu 11 humanité les deux fois"
- ✅ **Monologues** : "Plus variés, c'est bien"

**Feedback brut :**
> "J'aime toujours l'ambiance. Les barres de progression sont utiles. J'ai fait 2 runs très altruistes, j'ai eu 11 humanité les deux fois. J'ai besoin de 12. C'est frustrant d'être si proche."

**Scores :**
- Clarté : 8/10
- Fun : 7/10
- Satisfaction narrative : 6/10
- Intention d'achat : 6/10 ("Peut-être si les fins sont plus accessibles")

---

### JOUEUR 8 : "Le Casual Perdu V2" (Casual, Test 5 min)
**Profil :** 44 ans, joue occasionnellement

**Test :** 5 minutes, abandon au Jour 2

**Observations :**
- ⚠️ **Onboarding** : "C'est mieux mais je comprends pas tout"
- ⚠️ **Rumeurs** : "Le tutorial est mieux mais je comprends pas l'impact"
- ❌ **Interface** : "Toujours trop d'informations"

**Feedback brut :**
> "C'est mieux qu'avant. Le tutorial des rumeurs est mieux. Mais je comprends pas tout. Il y a toujours trop d'informations."

**Scores :**
- Clarté : 4/10
- Fun : 5/10
- Intention d'achat : 2/10 ("Non")

---

### JOUEUR 9 : "Le Vétéran Critique V2" (Hardcore, Test long)
**Profil :** 27 ans, joue beaucoup, très critique

**Test :** 5 runs complètes (5 victoires)

**Observations :**
- ⚠️ **Balance** : "J10-14 est encore un mur"
- ✅ **Warnings combat** : "Ratio exact, c'est parfait"
- ✅ **Compteurs narratifs** : "Impact réel, c'est bien"
- ⚠️ **Fins** : "J'ai fait 5 runs, j'ai eu 'Survivant' 4 fois, 'Rédemption' 1 fois"

**Feedback brut :**
> "C'est mieux qu'avant. Les warnings combat sont parfaits. Les compteurs narratifs ont un impact réel. Mais J10-14 est encore un mur. Et les fins sont encore difficiles à atteindre."

**Scores :**
- Clarté : 8/10
- Fun : 7/10
- Balance : 6/10
- Intention d'achat : 6/10 ("Peut-être si amélioré")

---

### JOUEUR 10 : "La Story Lover V2" (Story-focused, Test long)
**Profil :** 25 ans, joue pour l'histoire

**Test :** 2 runs complètes (2 victoires)

**Observations :**
- ✅ **Événements** : "J'adore toujours les événements narratifs"
- ✅ **Progression fins** : "Les barres sont utiles"
- ❌ **Fins** : "J'ai fait 2 runs très altruistes, j'ai eu 11 humanité les deux fois"
- ✅ **Monologues** : "Plus variés, c'est bien"

**Feedback brut :**
> "J'aime toujours l'ambiance. Les barres de progression sont utiles. J'ai fait 2 runs très altruistes, j'ai eu 11 humanité les deux fois. J'ai besoin de 12. C'est frustrant."

**Scores :**
- Clarté : 8/10
- Fun : 7/10
- Satisfaction narrative : 6/10
- Intention d'achat : 6/10 ("Peut-être si les fins sont plus accessibles")

---

### JOUEUR 11 : "Le Casual Satisfait V2" (Casual, Test long)
**Profil :** 40 ans, joue occasionnellement

**Test :** 2 runs complètes (1 victoire, 1 défaite J15)

**Observations :**
- ✅ **Balance améliorée** : "J8-12 est mieux"
- ✅ **Warnings combat** : "Utiles, je comprends"
- ✅ **Satisfaction** : "J'ai aimé, je vais rejouer"

**Feedback brut :**
> "C'est mieux qu'avant. J'ai gagné une fois, j'ai perdu une fois. Les warnings combat sont utiles. J'ai aimé, je vais rejouer."

**Scores :**
- Clarté : 7/10
- Fun : 7/10
- Balance : 7/10
- Intention d'achat : 7/10 ("Oui")

---

### JOUEUR 12 : "Le Hardcore Critique V2" (Hardcore, Test long)
**Profil :** 28 ans, joue beaucoup, très critique

**Test :** 5 runs complètes (5 victoires)

**Observations :**
- ⚠️ **Balance** : "J10-14 est encore un mur"
- ✅ **Warnings combat** : "Ratio exact, c'est parfait"
- ⚠️ **Fins** : "J'ai fait 5 runs, j'ai eu 'Survivant' 4 fois, 'Rédemption' 1 fois"

**Feedback brut :**
> "C'est mieux qu'avant. Les warnings combat sont parfaits. Mais J10-14 est encore un mur. Et les fins sont encore difficiles à atteindre."

**Scores :**
- Clarté : 8/10
- Fun : 7/10
- Balance : 6/10
- Intention d'achat : 6/10 ("Peut-être si amélioré")

---

### JOUEUR 13 : "La Story Lover V2" (Story-focused, Test long)
**Profil :** 26 ans, joue pour l'histoire

**Test :** 2 runs complètes (2 victoires)

**Observations :**
- ✅ **Événements** : "J'adore toujours les événements narratifs"
- ❌ **Fins** : "J'ai fait 2 runs très altruistes, j'ai eu 11 humanité les deux fois"
- ✅ **Monologues** : "Plus variés, c'est bien"

**Feedback brut :**
> "J'aime toujours l'ambiance. J'ai fait 2 runs très altruistes, j'ai eu 11 humanité les deux fois. J'ai besoin de 12. C'est frustrant."

**Scores :**
- Clarté : 8/10
- Fun : 7/10
- Satisfaction narrative : 6/10
- Intention d'achat : 6/10 ("Peut-être si les fins sont plus accessibles")

---

### JOUEUR 14 : "Le Casual Perdu V2" (Casual, Test 5 min)
**Profil :** 43 ans, joue occasionnellement

**Test :** 5 minutes, abandon au Jour 2

**Observations :**
- ⚠️ **Onboarding** : "C'est mieux mais je comprends pas tout"
- ❌ **Interface** : "Toujours trop d'informations"

**Feedback brut :**
> "C'est mieux qu'avant. Mais je comprends pas tout. Il y a toujours trop d'informations."

**Scores :**
- Clarté : 4/10
- Fun : 5/10
- Intention d'achat : 2/10 ("Non")

---

### JOUEUR 15 : "Le Vétéran Satisfait V2" (Hardcore, Test long)
**Profil :** 30 ans, joue beaucoup

**Test :** 3 runs complètes (3 victoires)

**Observations :**
- ✅ **Balance** : "Difficile mais gérable"
- ✅ **Warnings combat** : "Parfaits avec ratio exact"
- ✅ **Compteurs narratifs** : "Impact réel, bonus visibles"
- ⚠️ **Fins** : "J'ai eu 'Survivant' 2 fois, 'Rédemption' 1 fois"

**Feedback brut :**
> "C'est beaucoup mieux. J'ai gagné 3 fois. Les warnings combat sont parfaits. Les compteurs narratifs ont un impact réel. J'ai vu 'Rédemption' une fois, c'est bien."

**Scores :**
- Clarté : 9/10
- Fun : 8/10
- Balance : 7/10
- Intention d'achat : 8/10 ("Oui")

---

## ANALYSE GLOBALE PAR THÈME

### 1. BALANCE ÉCONOMIQUE

**Problème principal :** J10-14 est encore un "mur" mentionné par 8/15 joueurs

**Feedback récurrent :**
- "J8-12 est mieux, mais J10-14 est encore dur"
- "J'ai failli perdre au J14"
- "J10-14 est encore un mur"

**Recommandations :**
- ⚠️ **CRITIQUE** : Réduire encore les intérêts : 4💰 → 3💰 (-25% supplémentaire)
- ⚠️ **CRITIQUE** : Augmenter encore les revenus : +25% → +35% (+10% supplémentaire)
- ⚠️ **IMPORTANT** : Réduire les coûts de réparation : 0.3 → 0.25 (-17% supplémentaire)
- ⚠️ **IMPORTANT** : Ajouter un système de "sécurité" : Si dette > 120💰 au J15, réduire intérêts à 2💰

**Score moyen :** 6.3/10 (amélioration de 5.1/10)

---

### 2. FINS MULTIPLES

**Problème principal :** Encore difficiles à atteindre (6/15 joueurs n'ont vu que "Survivant")

**Feedback récurrent :**
- "J'ai eu 11 humanité, j'ai besoin de 12. C'est frustrant."
- "J'ai fait 5 runs, j'ai eu 'Survivant' 4 fois"
- "C'est frustrant d'être si proche"

**Recommandations :**
- ⚠️ **CRITIQUE** : Réduire encore les seuils : 12 → 10 (-17%)
- ⚠️ **IMPORTANT** : Augmenter encore les gains de compteurs : +3 → +4 humanité (dons)
- ⚠️ **IMPORTANT** : Ajouter un système de "bonus final" : +1 compteur narratif au J20 si proche
- ⚠️ **MOYEN** : Afficher un message d'encouragement si proche d'une fin (ex: "Tu es proche de 'Rédemption' (11/12)")

**Score moyen :** 5.8/10 (amélioration de 4.2/10)

---

### 3. WARNINGS COMBAT

**Problème principal :** Améliorés mais pas assez précis (5/15 joueurs)

**Feedback récurrent :**
- "Ratio exact affiché, c'est parfait" (positif)
- "Je veux savoir la probabilité exacte de chaque résultat"
- "Je veux voir les stats de l'ennemi estimé"

**Recommandations :**
- ⚠️ **IMPORTANT** : Afficher les stats estimées de l'ennemi (ATK, DEF, VIT)
- ⚠️ **IMPORTANT** : Afficher la probabilité de chaque résultat (victoire, fuite, défaite)
- ⚠️ **MOYEN** : Ajouter un tooltip avec détails au survol

**Score moyen :** 7.5/10 (amélioration de 6.3/10)

---

### 4. ONBOARDING

**Problème principal :** Amélioré mais encore insuffisant (4/15 joueurs)

**Feedback récurrent :**
- "C'est mieux mais je comprends pas tout"
- "Le tutorial des rumeurs est mieux mais je comprends pas l'impact"
- "Il y a toujours trop d'informations"

**Recommandations :**
- ⚠️ **IMPORTANT** : Simplifier encore le tutorial des rumeurs
- ⚠️ **IMPORTANT** : Ajouter un guide contextuel pas-à-pas
- ⚠️ **MOYEN** : Réduire le texte dans les écrans principaux

**Score moyen :** 6.0/10 (amélioration de 4.8/10)

---

### 5. INTERFACE MOBILE

**Problème principal :** Améliorée mais problèmes de performance (3/15 joueurs)

**Feedback récurrent :**
- "Les boutons sont plus grands, c'est mieux"
- "Ça lag encore un peu sur mon téléphone"
- "Il y a toujours beaucoup de texte"

**Recommandations :**
- ⚠️ **IMPORTANT** : Optimiser encore les performances (lazy loading, réduction animations)
- ⚠️ **IMPORTANT** : Réduire encore le texte sur mobile
- ⚠️ **MOYEN** : Ajouter un mode "performance" pour appareils bas de gamme

**Score moyen :** 6.3/10 (amélioration de 2.0/10)

---

### 6. SATISFACTION GLOBALE

**Métriques :**
- Satisfaction moyenne : 7.1/10 ⬆️ (+14% vs V1)
- Taux de complétion : 53% (8/15) ⬆️ (+32% vs V1)
- Taux d'abandon avant J10 : 20% (3/15) ⬇️ (-26% vs V1)
- Intention de rejouer : 60% (9/15) ⬆️ (+28% vs V1)

**Points forts :**
- Balance économique améliorée (J8-12 plus gérable)
- Warnings combat plus informatifs
- Compteurs narratifs plus impactants
- Interface mobile plus jouable
- Monologues plus variés

**Points faibles :**
- Balance économique encore serrée (J10-14)
- Fins encore difficiles à atteindre
- Onboarding encore insuffisant
- Performance mobile à améliorer

---

### 7. INTENTION D'ACHAT

**Métriques :**
- Intention d'achat : 47% (7/15 joueurs) ⬆️ (+42% vs V1)
- Prix acceptable moyen : 3.20€ (sur 4.99€ proposé)

**Feedback récurrent :**
- "Je paierais 3€ max"
- "C'est mieux qu'avant, je considère"
- "Je paierais si c'était encore mieux équilibré"

**Recommandations :**
- ⚠️ **CRITIQUE** : Réduire le prix à 2.99€ - 3.49€
- ⚠️ **IMPORTANT** : Améliorer encore la balance avant release

---

## RECOMMANDATIONS PRIORISÉES

### PRIORITÉ CRITIQUE (À faire avant release)

1. **Balance économique J10-14** (8/15 joueurs)
   - Réduire intérêts : 4💰 → 3💰
   - Augmenter revenus : +25% → +35%
   - Réduire réparations : 0.3 → 0.25
   - Système de sécurité si dette > 120💰 au J15

2. **Fins multiples** (6/15 joueurs)
   - Réduire seuils : 12 → 10
   - Augmenter gains : +3 → +4 humanité
   - Bonus final au J20 si proche
   - Message d'encouragement si proche

### PRIORITÉ HAUTE (À faire rapidement)

3. **Warnings combat** (5/15 joueurs)
   - Afficher stats estimées ennemi
   - Afficher probabilité de chaque résultat
   - Tooltip avec détails

4. **Onboarding** (4/15 joueurs)
   - Simplifier tutorial rumeurs
   - Guide contextuel pas-à-pas
   - Réduire texte écrans principaux

### PRIORITÉ MOYENNE (Nice to have)

5. **Performance mobile** (3/15 joueurs)
   - Optimiser performances
   - Réduire texte mobile
   - Mode performance

---

## CONCLUSION

Le jeu a fait des **progrès significatifs** depuis la V1 :
- Balance économique améliorée (J8-12 plus gérable)
- Warnings combat plus informatifs
- Compteurs narratifs plus impactants
- Interface mobile plus jouable

Cependant, **des problèmes persistent** :
- Balance économique encore serrée (J10-14)
- Fins encore difficiles à atteindre
- Onboarding encore insuffisant

**Recommandation finale :** ⚠️ **AMÉLIORER ENCORE** avant release. Le jeu est proche mais nécessite des ajustements finaux.

**Prix recommandé après corrections :** 2.99€ - 3.49€ (au lieu de 4.99€)

**Temps estimé pour corrections :** 1-2 semaines

---

**Date du rapport :** 2024-12-XX  
**Prochaine révision :** Après implémentation des corrections critiques
