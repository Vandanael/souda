# SOUDA — Plan Stratégique V3 (Pivot Narratif-First)
**Date :** 2024-12-XX  
**Basé sur :** Rapport de Tests Utilisateurs V3 (20 joueurs + analyse experte)  
**Objectif :** Atteindre 8-9/10 dans les stores  
**Durée estimée :** 4-6 semaines

---

## EXECUTIVE SUMMARY

**Diagnostic :**
- Progrès significatifs (7.8/10 satisfaction)
- Mais problèmes structurels identifiés :
  - Identité de jeu floue
  - Progression non satisfaisante
  - Narratif sous-exploité
  - Rejouabilité limitée

**Recommandation stratégique :**
⚠️ **PIVOT NARRATIF-FIRST** — Faire du narratif le cœur de l'expérience avec mécaniques de survie/gestion en support.

**Objectif :**
- Note stores : 8-9/10
- Satisfaction : 8.5/10+
- Intention d'achat : 75%+
- Prix : 5-7€ (au lieu de 3-5€)

---

## ANALYSE DES PROBLÈMES (CE QU'ILS EXPRIMENT VS CE QU'ILS VEULENT)

### Problème 1 : Identité de jeu floue

**Ce qu'ils expriment :**
- "Je comprends pas si c'est un jeu de survie ou de gestion"
- "Trop d'informations d'un coup"
- "Je sais pas quoi faire"

**Ce qu'ils veulent vraiment (analyse experte) :**
- Une expérience claire et guidée dès le début
- Une identité forte qui se comprend immédiatement
- Un "hook" narratif ou mécanique qui accroche

**Solution :** Introduction narrative immersive + hiérarchie claire (narratif en premier)

---

### Problème 2 : Progression non satisfaisante

**Ce qu'ils expriment :**
- "Pas de progression entre les runs"
- "J'ai perdu 1h30, c'est frustrant"
- "Pas de défi supplémentaire"

**Ce qu'ils veulent vraiment (analyse experte) :**
- Un système qui récompense le progrès même en cas de défaite
- Une progression méta qui donne envie de rejouer
- Des défis à long terme

**Solution :** Système de progression méta + récompenses partielles + achievements

---

### Problème 3 : Narratif sous-exploité

**Ce qu'ils expriment :**
- "Le narratif est présent mais pas assez central"
- "Pas de personnages récurrents"
- "Pas d'arcs narratifs"

**Ce qu'ils veulent vraiment (analyse experte) :**
- Une expérience narrative immersive
- Des personnages avec lesquels on crée un lien
- Des arcs narratifs qui se développent
- Des conséquences à long terme

**Solution :** Personnages récurrents + arcs narratifs + conséquences à long terme

---

### Problème 4 : Rejouabilité limitée

**Ce qu'ils expriment :**
- "Après 2-3 runs, je me lasse"
- "Pas de contenu nouveau à découvrir"

**Ce qu'ils veulent vraiment (analyse experte) :**
- Du contenu nouveau à découvrir
- Des défis supplémentaires
- Une progression qui récompense l'expertise

**Solution :** Système de progression méta + nouveaux contenus débloquables + modes de difficulté

---

### Problème 5 : Sessions courtes (mobile)

**Ce qu'ils expriment :**
- "Je veux pouvoir jouer 5-10 min, pas 2h"

**Ce qu'ils veulent vraiment (analyse experte) :**
- Une expérience adaptée aux sessions courtes
- Sauvegarde intelligente
- Objectifs quotidiens

**Solution :** Mode sessions courtes + sauvegarde intelligente + objectifs quotidiens

---

## PLAN D'IMPLÉMENTATION : PIVOT NARRATIF-FIRST

### SPRINT 1 : FONDATIONS NARRATIVES (Semaine 1-2)

#### Tâche 1.1 : Introduction narrative immersive (PRIORITÉ CRITIQUE)
**Objectif :** Créer un hook narratif dans les 30 premières secondes

**Modifications :**
1. **Scène d'ouverture cinématique**
   - Texte animé avec effets visuels
   - "Tu es un déserteur. Tu dois 80💰 à Morten. Tu as 20 jours pour payer. Ou mourir."
   - Immédiatement plongé dans l'ambiance

2. **Tutorial narratif progressif**
   - Chaque mécanique introduite via un événement narratif
   - "Morten te rappelle ta dette" → Introduction économie
   - "Tu explores les ruines" → Introduction exploration

3. **Hiérarchie visuelle**
   - Le narratif est mis en avant visuellement
   - Les mécaniques servent le narratif

**Fichiers affectés :**
- `src/screens/StartScreen.tsx` (nouvelle introduction)
- `src/components/NarrativeIntro.tsx` (nouveau composant)
- `src/features/tutorial/TutorialScreen.tsx` (tutorial narratif)

**Estimation :** 3 jours

---

#### Tâche 1.2 : Personnages récurrents avec arcs narratifs (PRIORITÉ CRITIQUE)
**Objectif :** Créer des personnages avec lesquels on crée un lien

**Modifications :**
1. **Morten (l'usurier) - Arc narratif**
   - Jour 1-5 : Menaces et pressions
   - Jour 6-10 : Négociations si progrès
   - Jour 11-15 : Ultimatum si dette élevée
   - Jour 16-20 : Conséquences finales
   - Dialogues évolutifs selon remboursements

2. **Sœur Margaux - Arc narratif**
   - Apparition si humanité >= 5
   - Propose des choix humanitaires
   - Évolution selon les choix
   - Fin spéciale si humanité >= 10

3. **Autres PNJ récurrents**
   - Marchand itinérant (apparitions aléatoires)
   - Ancien soldat (arc narratif cynisme)
   - Réfugiés (arc narratif humanité)

**Fichiers affectés :**
- `src/types/npc.ts` (nouveaux PNJ)
- `src/features/narrative/characterArcs.ts` (nouveau système)
- `src/screens/MortenScreen.tsx` (dialogues évolutifs)
- `src/features/events/eventPool.ts` (nouveaux événements)

**Estimation :** 5 jours

---

#### Tâche 1.3 : Arcs narratifs sur plusieurs jours (PRIORITÉ HAUTE)
**Objectif :** Créer des événements qui se construisent sur plusieurs jours

**Modifications :**
1. **Système d'arcs narratifs**
   - Événements qui se déclenchent sur plusieurs jours
   - Révélations progressives
   - Conséquences à long terme

2. **Exemples d'arcs :**
   - Arc "Réfugiés" : J5 rencontre → J10 choix → J15 conséquences
   - Arc "Marchand" : J3 rencontre → J8 choix → J13 révélations
   - Arc "Ancien soldat" : J7 rencontre → J12 choix → J17 conséquences

**Fichiers affectés :**
- `src/features/narrative/narrativeArcs.ts` (nouveau système)
- `src/store/gameStore.ts` (suivi des arcs)
- `src/features/events/eventPool.ts` (nouveaux événements)

**Estimation :** 4 jours

---

### SPRINT 2 : PROGRESSION MÉTA (Semaine 2-3)

#### Tâche 2.1 : Système de progression méta (PRIORITÉ HAUTE)
**Objectif :** Créer une progression qui récompense même en cas de défaite

**Modifications :**
1. **Expérience globale**
   - Points d'expérience accumulés entre les runs
   - Basés sur : jours survécus, choix faits, fins atteintes
   - Récompenses même en cas de défaite

2. **Niveaux de progression**
   - Niveau 1-10 : Déblocage de nouvelles origines
   - Niveau 11-20 : Déblocage de nouveaux événements
   - Niveau 21-30 : Déblocage de nouveaux items
   - Niveau 31+ : Déblocage de modes de difficulté

3. **Récompenses partielles**
   - En cas de défaite : XP basé sur progrès
   - En cas de victoire : XP bonus
   - Déblocage progressif de contenus

**Fichiers affectés :**
- `src/store/metaProgression.ts` (nouveau système)
- `src/store/gameStore.ts` (intégration)
- `src/screens/StartScreen.tsx` (affichage progression)

**Estimation :** 4 jours

---

#### Tâche 2.2 : Achievements et défis (PRIORITÉ MOYENNE)
**Objectif :** Créer des défis à long terme

**Modifications :**
1. **Système d'achievements**
   - Achievements pour différentes actions
   - "Survivre 10 jours", "Atteindre humanité 10", etc.
   - Récompenses : XP, nouveaux contenus

2. **Défis quotidiens/hebdomadaires**
   - Défis quotidiens : "Explorer 3 lieux", "Gagner 50💰"
   - Défis hebdomadaires : "Atteindre une fin spécifique"
   - Récompenses : XP, items

**Fichiers affectés :**
- `src/features/meta/achievements.ts` (nouveau système)
- `src/features/meta/dailyChallenges.ts` (nouveau système)
- `src/screens/AubeScreen.tsx` (affichage défis)

**Estimation :** 3 jours

---

#### Tâche 2.3 : Nouveaux contenus débloquables (PRIORITÉ MOYENNE)
**Objectif :** Créer du contenu nouveau à découvrir

**Modifications :**
1. **Nouvelles origines débloquables**
   - 3 nouvelles origines (déblocables via progression)
   - Chaque origine avec bonus/malus uniques

2. **Nouveaux événements débloquables**
   - 10 nouveaux événements (déblocables via progression)
   - Événements plus complexes

3. **Nouveaux items débloquables**
   - Items légendaires uniques (déblocables via progression)
   - Items avec effets spéciaux

**Fichiers affectés :**
- `src/features/meta/origins.ts` (nouvelles origines)
- `src/features/events/eventPool.ts` (nouveaux événements)
- `src/types/item.ts` (nouveaux items)

**Estimation :** 3 jours

---

### SPRINT 3 : MODE SESSIONS COURTES (Semaine 3-4)

#### Tâche 3.1 : Sauvegarde intelligente (PRIORITÉ HAUTE)
**Objectif :** Permettre de jouer en sessions courtes

**Modifications :**
1. **Sauvegarde automatique**
   - Sauvegarde après chaque action importante
   - Sauvegarde en cas de fermeture de l'app
   - Reprise instantanée

2. **Points de sauvegarde stratégiques**
   - Sauvegarde à l'aube (début de journée)
   - Sauvegarde après exploration
   - Sauvegarde après événement

**Fichiers affectés :**
- `src/features/game/saveSystem.ts` (sauvegarde automatique)
- `src/store/gameStore.ts` (points de sauvegarde)

**Estimation :** 2 jours

---

#### Tâche 3.2 : Objectifs quotidiens (PRIORITÉ MOYENNE)
**Objectif :** Créer des objectifs pour sessions courtes

**Modifications :**
1. **Objectifs quotidiens**
   - "Explorer 2 lieux", "Gagner 30💰", "Faire un choix humanitaire"
   - Récompenses : XP, items
   - Adaptés aux sessions courtes (5-10 min)

2. **Progression quotidienne**
   - Barre de progression visible
   - Récompenses immédiates

**Fichiers affectés :**
- `src/features/meta/dailyObjectives.ts` (nouveau système)
- `src/screens/AubeScreen.tsx` (affichage objectifs)

**Estimation :** 2 jours

---

### SPRINT 4 : POLISH ET OPTIMISATION (Semaine 4-6)

#### Tâche 4.1 : Polish narratif (PRIORITÉ HAUTE)
**Objectif :** Améliorer la qualité narrative

**Modifications :**
1. **Révision des textes**
   - Améliorer la qualité d'écriture
   - Cohérence narrative
   - Immersion

2. **Effets visuels narratifs**
   - Transitions entre scènes
   - Effets de texte
   - Ambiance renforcée

**Fichiers affectés :**
- Tous les fichiers avec textes narratifs
- `src/components/NarrativeEffects.tsx` (nouveau composant)

**Estimation :** 3 jours

---

#### Tâche 4.2 : Tests et ajustements (PRIORITÉ HAUTE)
**Objectif :** Valider le pivot

**Modifications :**
1. **Tests utilisateurs**
   - 10 joueurs sur la version pivot
   - Validation de l'identité narrative
   - Ajustements finaux

2. **Ajustements**
   - Corrections basées sur retours
   - Optimisations

**Estimation :** 5 jours

---

## RÉSUMÉ DES MODIFICATIONS

### Changements majeurs

1. **Introduction narrative immersive** (30 premières secondes)
2. **Personnages récurrents avec arcs narratifs**
3. **Arcs narratifs sur plusieurs jours**
4. **Système de progression méta**
5. **Achievements et défis**
6. **Nouveaux contenus débloquables**
7. **Mode sessions courtes**
8. **Polish narratif**

### Fichiers à créer

- `src/components/NarrativeIntro.tsx`
- `src/features/narrative/characterArcs.ts`
- `src/features/narrative/narrativeArcs.ts`
- `src/store/metaProgression.ts`
- `src/features/meta/achievements.ts`
- `src/features/meta/dailyChallenges.ts`
- `src/features/meta/dailyObjectives.ts`
- `src/components/NarrativeEffects.tsx`

### Fichiers à modifier

- `src/screens/StartScreen.tsx`
- `src/features/tutorial/TutorialScreen.tsx`
- `src/types/npc.ts`
- `src/screens/MortenScreen.tsx`
- `src/features/events/eventPool.ts`
- `src/store/gameStore.ts`
- `src/screens/AubeScreen.tsx`
- `src/features/meta/origins.ts`
- `src/types/item.ts`
- `src/features/game/saveSystem.ts`

---

## PLANNING DÉTAILLÉ

### Semaine 1-2 : Fondations narratives
- **Jour 1-3 :** Introduction narrative immersive
- **Jour 4-8 :** Personnages récurrents avec arcs narratifs
- **Jour 9-12 :** Arcs narratifs sur plusieurs jours

### Semaine 2-3 : Progression méta
- **Jour 13-16 :** Système de progression méta
- **Jour 17-19 :** Achievements et défis
- **Jour 20-22 :** Nouveaux contenus débloquables

### Semaine 3-4 : Mode sessions courtes
- **Jour 23-24 :** Sauvegarde intelligente
- **Jour 25-26 :** Objectifs quotidiens

### Semaine 4-6 : Polish et optimisation
- **Jour 27-29 :** Polish narratif
- **Jour 30-34 :** Tests et ajustements

---

## CRITÈRES DE SUCCÈS

### Métriques cibles

**Avant pivot :**
- Satisfaction moyenne : 7.8/10
- Intention d'achat : 60%
- Note estimée stores : 7.2/10

**Après pivot :**
- Satisfaction moyenne : **8.5/10+** (+9%)
- Intention d'achat : **75%+** (+25%)
- Note estimée stores : **8-9/10** (+11-25%)

### Tests de validation

1. **Identité narrative :**
   - ✅ 90%+ des joueurs comprennent l'identité dans les 30 premières secondes
   - ✅ 85%+ des joueurs sont accrochés par l'introduction

2. **Progression méta :**
   - ✅ 80%+ des joueurs rejouent après une défaite
   - ✅ 70%+ des joueurs atteignent niveau 5+

3. **Rejouabilité :**
   - ✅ 75%+ des joueurs font 5+ runs
   - ✅ 60%+ des joueurs débloquent du nouveau contenu

4. **Sessions courtes :**
   - ✅ 80%+ des joueurs mobiles peuvent jouer en sessions de 5-10 min

---

## RISQUES ET MITIGATION

### Risque 1 : Pivot trop important
**Mitigation :** Tests itératifs, validation progressive, rollback possible

### Risque 2 : Perte des joueurs mécaniques
**Mitigation :** Garder les mécaniques, juste les mettre en support du narratif

### Risque 3 : Contenu narratif insuffisant
**Mitigation :** Prioriser la qualité sur la quantité, réutiliser les événements existants

---

## ALTERNATIVE : AMÉLIORATION PROGRESSIVE

Si le pivot est trop risqué, alternative :

**Changements mineurs :**
1. Introduction narrative améliorée (1 jour)
2. 2-3 personnages récurrents simples (2 jours)
3. Système de progression méta basique (2 jours)
4. Mode sessions courtes (2 jours)

**Total :** 7 jours (au lieu de 4-6 semaines)

**Potentiel :** 7.5-8/10 (au lieu de 8-9/10)

---

**Date de création :** 2024-12-XX  
**Prochaine révision :** Après décision stratégique
