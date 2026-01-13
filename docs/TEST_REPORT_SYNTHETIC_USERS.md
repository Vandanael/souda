# RAPPORT DE TESTS UTILISATEURS SYNTHÉTIQUES
## SOUDA - Sprint 4 (Post-Polish)

**Date :** Simulation post-implémentation Sprint 4  
**Méthodologie :** Analyse statique du code + Simulation de sessions de jeu  
**Profils testés :** 10 joueurs distincts avec comportements extrêmes

---

## 1. LUCAS "LE RUSHER" - Mobile, 5 min

**Session :** 4 min 32s | **Résultat :** Mort Jour 2 (Combat)  
**Ce qu'il a fait :** 
- Skip l'intro en cliquant partout (impossible, animation forcée 8s minimum)
- Skip le tutorial (possible via bouton)
- Clique sur "PARTIR EN MISSION" sans équiper d'items
- Explore une ruine niveau 3 avec stats de base (ATK: 5, DEF: 3)
- Combat perdu → Game Over

**🤬 PAIN POINT MAJEUR :** 
"PUTAIN L'INTRO EST TROP LONGUE ! 8 SECONDES OBLIGATOIRES POUR 4 PHRASES ?! Je veux jouer, pas regarder un film ! Et pourquoi je peux pas skip en cliquant ? Le bouton apparaît APRÈS l'animation, c'est de la torture !"

**❤️ MOMENT FORT :** 
"Bon, au moins le tutorial est skippable. Ça c'est bien."

**VERBATIM :** 
"J'ai cliqué partout pendant l'intro, rien ne se passe. C'est quoi ce délire ? Et après je meurs au jour 2 parce que j'ai pas compris qu'il fallait équiper des items. Le jeu me dit rien !"

**Note donnée :** 3/10

**Problèmes techniques identifiés :**
- `NarrativeIntro.tsx` : Pas de skip possible avant la fin de l'animation (ligne 31-33)
- `AubeScreen.tsx` : Pas d'indication visuelle que l'équipement est nécessaire avant l'exploration
- `TutorialScreen.tsx` : Tutorial skippable mais pas obligatoire → joueur peut être perdu

---

## 2. SARAH "THE STORY LOVER" - Lore Enthusiast

**Session :** 25 min | **Résultat :** Abandon Jour 8 (Frustration narrative)  
**Ce qu'il a fait :**
- Lit attentivement l'intro (apprécie l'ambiance)
- Explore tous les dialogues de la taverne
- Parle à tous les PNJ
- Cherche la cohérence de l'arc de Morten
- S'arrête car "l'histoire ne progresse pas assez"

**🤬 PAIN POINT MAJEUR :**
"L'intro est bien écrite, mais après ? Morten dit toujours la même chose. Les dialogues de la taverne sont répétitifs. Où est l'arc narratif ? Où sont les révélations ? Je veux comprendre QUI est Morten, POURQUOI il prête de l'argent. Le jeu me donne des miettes d'histoire mais jamais le repas complet."

**❤️ MOMENT FORT :**
"L'intro avec 'PAYE... OU MEURS' en rouge, c'est fort. L'ambiance est là."

**VERBATIM :**
"J'ai joué 8 jours, j'ai parlé à Morten 5 fois, et il me dit toujours 'Tu me dois de l'argent'. Où est la progression narrative ? Où sont les choix qui changent la relation ? Le système d'arcs narratifs existe dans le code (`characterArcs`) mais je ne le vois PAS dans le jeu !"

**Note donnée :** 5/10

**Problèmes techniques identifiés :**
- `MortenScreen.tsx` : Messages statiques basés uniquement sur la dette (lignes 30-52), pas de progression d'arc visible
- `characterArcs` existe dans le store mais pas d'affichage UI de la progression
- Pas de feedback visuel sur la relation avec Morten (trustLevel, storyStage)

---

## 3. MAX "LE MIN-MAXER" - Exploit Hunter

**Session :** 2h 15min | **Résultat :** Victoire Jour 20 (mais frustré)  
**Ce qu'il a fait :**
- Analyse le code source (décompilé)
- Teste toutes les combinaisons d'achat/vente
- Cherche les failles dans `calculateBuyPrice` / `calculateSellPrice`
- Teste les limites de l'inventaire
- Optimise la stratégie de remboursement

**🤬 PAIN POINT MAJEUR :**
"Le système économique est TROP SIMPLE. Pas de marché dynamique, pas de spéculation possible. Les prix sont fixes selon la réputation. Je peux pas exploiter quoi que ce soit. C'est équilibré mais BORING. Et pourquoi je peux pas vendre mes items équipés directement ? Il faut les déséquiper d'abord, c'est chiant."

**❤️ MOMENT FORT :**
"La formule d'XP méta est intéressante : (Jours * 50) + (Or * 0.5) + (Choix * 20). Ça récompense la survie ET l'exploration narrative. C'est bien pensé."

**VERBATIM :**
"J'ai trouvé ZÉRO exploit. Le code vérifie tout : `if (state.gold < buyPrice) return false`. C'est solide mais prévisible. Je veux des mécaniques complexes à optimiser, pas un système linéaire."

**Note donnée :** 6/10

**Problèmes techniques identifiés :**
- `gameStore.ts` : Validations solides (lignes 897-906) mais système économique trop simple
- Pas de système de marché dynamique ou de spéculation
- Interface : Pas de vente directe depuis l'équipement (nécessite déséquiper d'abord)

---

## 4. SOPHIE "UI SNOB" - Mobile UX Critic

**Session :** 12 min | **Résultat :** Abandon Jour 3 (Frustration UI)  
**Ce qu'il a fait :**
- Teste sur iPhone SE (petit écran)
- Critique chaque écran pour l'accessibilité
- Teste les boutons avec les doigts
- Vérifie les contrastes de couleurs

**🤬 PAIN POINT MAJEUR :**
"Les boutons sont TROP PETITS sur mobile ! `minHeight: '44px'` c'est le minimum Apple, mais avec `padding: '0.875rem'` et `fontSize: '0.9rem'`, c'est illisible. Et les textes narratifs ? `fontSize: '1rem'` sur un écran 4 pouces, je dois zoomer pour lire ! Le contraste gris sur noir (#ccc sur #000) est acceptable mais pas optimal."

**❤️ MOMENT FORT :**
"L'adaptation mobile existe (`isMobile` dans `AubeScreen.tsx`), c'est un bon début. Mais c'est pas assez."

**VERBATIM :**
"J'ai un iPhone SE. Les boutons 'INVENTAIRE' et 'MARCHÉ' sont côte à côte, chacun fait 50% de largeur. Sur mon écran, c'est 2 boutons de 2cm de large. J'arrive à cliquer mais c'est limite. Et le texte dans les dialogues ? Je dois plisser les yeux."

**Note donnée :** 4/10

**Problèmes techniques identifiés :**
- `AubeScreen.tsx` : Adaptation mobile présente mais insuffisante (lignes 130-178)
- `TaverneScreen.tsx` : Dialogues avec `fontSize: '1rem'` trop petit sur petit écran
- Pas de test d'accessibilité (contraste, taille de police minimale)
- `NarrativeText.tsx` : Pas d'adaptation mobile pour la vitesse d'animation

---

## 5. TOM "LE RAGEUX" - Casual Gamer

**Session :** 8 min | **Résultat :** Mort Jour 3 (RNG Combat) → Rage Quit  
**Ce qu'il a fait :**
- Joue normalement
- Meurt au jour 3 dans un combat (ratio 0.65, défaite)
- Voit l'écran de Game Over
- Vérifie la méta-progression

**🤬 PAIN POINT MAJEUR :**
"JE SUIS MORT AU JOUR 3 PARCE QUE LE RNG A DÉCIDÉ QUE JE PERDAIS ! J'avais de bons items, j'ai fait les bons choix, et BAM, défaite. L'écran de Game Over me dit juste 'Tu as été vaincu'. Pas de consolation, pas de 'Tu as gagné X XP', rien. La méta-progression existe (`MetaProgressionDisplay`) mais elle s'affiche APRÈS, et c'est pas assez visible. Je rage quit direct."

**❤️ MOMENT FORT :**
"Aucun. Je suis trop énervé."

**VERBATIM :**
"Le jeu me punit pour quelque chose que je contrôle pas. Le combat est basé sur un ratio aléatoire. Je peux avoir les meilleurs stats, si le RNG dit non, je meurs. C'est pas du skill, c'est de la chance. Et l'écran de défaite me donne pas envie de recommencer."

**Note donnée :** 2/10

**Problèmes techniques identifiés :**
- `DefeatScreen.tsx` : Affiche `EndingScreen` puis `MetaProgressionDisplay` (lignes 86-94), mais l'XP n'est pas mise en avant
- Pas de message de consolation ou d'encouragement
- Le système de combat (`resolveCombat`) est trop RNG-dépendant (ratio aléatoire)
- Pas de "retry" ou de feedback positif immédiat

---

## 6. ELENA "BUS RIDER" - Session Interruptus

**Session :** 3 min (interrompue) → Relance 2h plus tard  
**Résultat :** Sauvegarde fonctionnelle, reprise au Jour 2  
**Ce qu'il a fait :**
- Joue 3 minutes dans le bus
- App fermée brutalement (batterie)
- Relance 2h plus tard
- Vérifie si la sauvegarde existe

**🤬 PAIN POINT MAJEUR :**
"J'ai fermé l'app au milieu d'un combat. Quand j'ai relancé, j'étais toujours dans le combat mais avec un état bizarre. Le `autoSave` sauvegarde après chaque action, mais pas PENDANT un combat. J'ai perdu ma progression du combat en cours."

**❤️ MOMENT FORT :**
"Le bouton 'CONTINUER (Jour 2)' est apparu sur l'écran d'accueil. La sauvegarde fonctionne globalement."

**VERBATIM :**
"La sauvegarde fonctionne, c'est bien. Mais si je ferme l'app pendant un combat ou une animation, je perds ce qui était en cours. Le `autoSave` sauvegarde après les actions, pas pendant. C'est frustrant."

**Note donnée :** 7/10

**Problèmes techniques identifiés :**
- `saveSystem.ts` : `autoSave` appelé après les actions (lignes 135-169) mais pas pendant les états transitoires
- `CombatScreen.tsx` : Pas de sauvegarde de l'état de combat en cours
- `gameStore.ts` : `autoSave` déclenché après `exploreLocation`, `finishEvent`, etc., mais pas pendant les phases de transition

---

## 7. LE "GRIMDARK FANBOY" - Darkest Dungeon Comparer

**Session :** 45 min | **Résultat :** Abandon Jour 12 (Manque d'ambiance)  
**Ce qu'il a fait :**
- Compare chaque élément à Darkest Dungeon
- Critique l'ambiance visuelle
- Analyse les textes narratifs
- Vérifie la "maturité" du contenu

**🤬 PAIN POINT MAJEUR :**
"C'est pas assez GRIMDARK ! Les textes sont trop propres, trop 'jeu vidéo'. Dans Darkest Dungeon, chaque phrase suinte le désespoir. Ici, c'est 'Tu es un déserteur' puis 'Bourg-Creux. Des murs. Un toit.' C'est plat ! Où sont les descriptions de la pourriture, de la misère, de la folie ? Les monologues intérieurs sont bien mais pas assez sombres."

**❤️ MOMENT FORT :**
"L'intro avec 'PAYE... OU MEURS' en rouge sang, c'est dans le ton. Mais c'est le seul moment."

**VERBATIM :**
"Le jeu essaie d'être grimdark mais c'est superficiel. Les textes sont fonctionnels, pas immersifs. Je veux sentir la pourriture, la désolation, la folie qui ronge le personnage. Là, c'est juste 'Tu dois de l'argent, va explorer'."

**Note donnée :** 5/10

**Problèmes techniques identifiés :**
- `NarrativeIntro.tsx` : Intro forte mais le reste du jeu est moins immersif
- `AubeScreen.tsx` : Textes fonctionnels ("Bourg-Creux. Des murs. Un toit.") mais pas assez descriptifs
- `CrepusculeScreen.tsx` : Monologues intérieurs existent mais peuvent être plus sombres
- Manque de descriptions d'ambiance dans les écrans principaux

---

## 8. L'ÉCONOME (FREE-TO-PLAY) - Value Seeker

**Session :** 15 min | **Résultat :** Abandon (Pas de valeur perçue)  
**Ce qu'il a fait :**
- Joue la version gratuite
- Cherche les mécaniques de monétisation
- Évalue le contenu disponible
- Compare à d'autres jeux gratuits

**🤬 PAIN POINT MAJEUR :**
"Pourquoi je paierais pour ce jeu ? Il y a ZÉRO monétisation visible. Pas d'IAP, pas de pub, rien. C'est bien pour l'expérience mais ça veut dire que soit c'est gratuit (et alors pourquoi le développer ?), soit c'est payant (et alors pourquoi pas de démo ?). Je comprends pas le modèle économique."

**❤️ MOMENT FORT :**
"Le jeu est complet, pas de paywall. C'est rare."

**VERBATIM :**
"Le jeu est bien fait, mais je vois pas pourquoi je devrais le payer. Il y a pas de contenu premium, pas de skins, rien. C'est soit un jeu gratuit (et alors pourquoi pas de pub pour le financer ?), soit un jeu payant (et alors pourquoi pas de démo gratuite ?). Je comprends pas."

**Note donnée :** 6/10 (pour la qualité) mais 2/10 (pour la valeur perçue)

**Problèmes techniques identifiés :**
- Aucun système de monétisation dans le code
- Pas de distinction entre version gratuite/payante
- Pas de système de démo ou de contenu premium
- Le jeu semble être un one-shot payant sans modèle économique clair

---

## 9. LE BUG HUNTER - Chaos Tester

**Session :** 1h 30min | **Résultat :** 3 bugs trouvés, 0 crash  
**Ce qu'il a fait :**
- Double-clic sur tous les boutons
- Essaie d'acheter sans argent
- Essaie de vendre des items équipés
- Ferme l'app pendant les animations
- Teste les états invalides

**🤬 PAIN POINT MAJEUR :**
"J'ai trouvé 3 bugs : 
1. Double-clic sur 'PARTIR EN MISSION' peut déclencher 2 explorations si c'est rapide (pas de debounce)
2. Si je ferme l'app pendant `DayTransition`, la transition reste bloquée au retour
3. Les objectifs quotidiens peuvent être complétés plusieurs fois si je clique vite (pas de vérification de `completedDailyObjectives` avant l'ajout d'XP)"

**❤️ MOMENT FORT :**
"Le code gère bien les cas limites (inventaire plein, or insuffisant). Les validations sont solides."

**VERBATIM :**
"Le jeu est globalement solide, mais il manque des protections contre les actions rapides. Pas de debounce sur les boutons critiques, pas de vérification d'état avant les actions asynchrones. C'est pas critique mais c'est du polish manquant."

**Note donnée :** 7/10

**Problèmes techniques identifiés :**
- `AubeScreen.tsx` : Pas de debounce sur `handleGoToExploration` (ligne 215)
- `DayTransition.tsx` : Pas de cleanup si le composant est démonté pendant l'animation
- `DailyObjectives.tsx` : Vérification de `completedDailyObjectives` mais pas de lock pendant l'ajout d'XP
- `gameStore.ts` : Validations solides mais pas de protection contre les double-clics rapides

---

## 10. L'INCOMPRIS - Tutorial Skipper

**Session :** 6 min | **Résultat :** Abandon Jour 1 (Perdu)  
**Ce qu'il a fait :**
- Skip le tutorial immédiatement
- Ne lit pas les textes
- Clique partout au hasard
- Ne comprend pas les mécaniques

**🤬 PAIN POINT MAJEUR :**
"Je comprends RIEN ! J'ai skip le tutorial, et maintenant je suis perdu. Qu'est-ce que je dois faire ? Pourquoi j'ai 3 actions ? Pourquoi je dois équiper des items ? Pourquoi je dois rembourser une dette ? Le jeu me dit rien ! Les boutons 'INVENTAIRE', 'MARCHÉ', 'USURIER' sont là mais je sais pas à quoi ils servent."

**❤️ MOMENT FORT :**
"Aucun. Je suis trop perdu."

**VERBATIM :**
"Le tutorial est optionnel, mais le jeu est INJOUABLE sans. Les écrans sont pas intuitifs. Je vois des boutons mais je comprends pas leur fonction. L'UI est fonctionnelle mais pas explicative."

**Note donnée :** 2/10

**Problèmes techniques identifiés :**
- `TutorialScreen.tsx` : Tutorial skippable (ligne 65-68) mais pas de fallback
- `AubeScreen.tsx` : Pas d'indications visuelles sur la fonction des boutons
- `ContextualGuide.tsx` : Guide contextuel existe mais peut être manqué si le joueur skip tout
- Pas d'icônes ou de tooltips pour expliquer les mécaniques

---

## CONCLUSION GLOBALE

### 📊 STATISTIQUES
- **Moyenne des notes :** 4.8/10
- **Taux d'abandon :** 60% (6/10)
- **Taux de complétion :** 20% (2/10)
- **Taux de rage quit :** 10% (1/10)

### 🚨 TOP 3 PRIORITÉS ABSOLUES

#### 1. **SKIP DE L'INTRO + TUTORIAL OBLIGATOIRE**
**Problème :** L'intro est trop longue (8s minimum) et le tutorial est skippable, rendant le jeu injouable pour les nouveaux joueurs.

**Impact :** 
- Lucas (Rusher) : Frustration immédiate
- L'Incompris : Abandon total
- Sophie (UI) : Perte de temps

**Solution :**
- Ajouter un skip immédiat sur l'intro (double-tap ou bouton visible dès le début)
- Rendre le tutorial obligatoire pour la première partie (ou au moins les 2 premières étapes)
- Ajouter des tooltips contextuels sur les boutons principaux

**Fichiers à modifier :**
- `src/components/NarrativeIntro.tsx` : Ajouter skip immédiat
- `src/screens/TutorialScreen.tsx` : Rendre les étapes 0-1 obligatoires
- `src/screens/AubeScreen.tsx` : Ajouter des tooltips/icônes explicatives

---

#### 2. **FEEDBACK VISUEL SUR LA MÉTA-PROGRESSION**
**Problème :** La méta-progression existe mais n'est pas assez visible, surtout à l'écran de Game Over.

**Impact :**
- Tom (Rageux) : Rage quit car pas de consolation
- Elena (Bus Rider) : Pas de motivation à continuer après une défaite
- Max (Min-Maxer) : Ne voit pas l'intérêt de la méta-progression

**Solution :**
- Afficher l'XP gagnée IMMÉDIATEMENT à l'écran de défaite (avant l'animation)
- Ajouter un message de consolation : "Tu as gagné X XP ! Continue pour débloquer de nouveaux contenus."
- Afficher la progression vers le prochain niveau de manière plus visible
- Ajouter une notification de level-up si applicable

**Fichiers à modifier :**
- `src/screens/DefeatScreen.tsx` : Réorganiser l'affichage pour mettre l'XP en avant
- `src/components/MetaProgressionDisplay.tsx` : Améliorer la visibilité
- `src/store/metaProgression.ts` : Ajouter des messages de feedback

---

#### 3. **PROGRESSION NARRATIVE VISIBLE (ARCS DE PERSONNAGES)**
**Problème :** Le système d'arcs narratifs existe dans le code (`characterArcs`) mais n'est pas visible dans l'UI.

**Impact :**
- Sarah (Story Lover) : Abandon car pas de progression narrative visible
- Le Grimdark Fanboy : Manque d'immersion narrative
- L'Économe : Pas de valeur narrative perçue

**Solution :**
- Afficher la progression de l'arc de Morten dans l'écran Usurier (trustLevel, storyStage)
- Ajouter des dialogues différents selon le stage de l'arc
- Afficher un indicateur visuel de la relation (barre de confiance, icônes)
- Ajouter des événements narratifs qui évoluent selon la progression

**Fichiers à modifier :**
- `src/screens/MortenScreen.tsx` : Afficher `characterArcs.morten` (trustLevel, storyStage)
- `src/features/narrative/characterArcs.ts` : Améliorer les dialogues selon le stage
- `src/components/CharacterArcDisplay.tsx` : Créer un nouveau composant pour afficher la progression

---

### 📝 AUTRES PROBLÈMES IDENTIFIÉS (Priorité secondaire)

4. **Protection contre les double-clics** (Bug Hunter) : Ajouter debounce sur les boutons critiques
5. **Sauvegarde pendant les états transitoires** (Elena) : Sauvegarder l'état même pendant les animations
6. **Amélioration UI mobile** (Sophie) : Augmenter les tailles de police et améliorer les contrastes
7. **Modèle économique clair** (L'Économe) : Définir si le jeu est gratuit, payant, ou freemium
8. **Textes narratifs plus immersifs** (Grimdark Fanboy) : Enrichir les descriptions d'ambiance

---

**Rapport généré par :** SOUDA User Research Simulator  
**Date :** Post-Sprint 4  
**Version testée :** Code actuel (Sprint 4 implémenté)
