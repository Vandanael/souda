# QA Checklist - SOUDA

## Tests Fonctionnels

- [x] Run complète sans crash
- [x] Toutes les fins atteignables (8 fins)
- [x] Sauvegarde/restore fonctionne (IndexedDB)
- [x] PWA installable et fonctionne offline
- [x] Audio ne bloque pas si indisponible (graceful degradation)
- [x] Responsive 360px → 1920px
- [x] Performance 60 FPS mobile (avec détection bas de gamme)
- [x] Pas de texte coupé/overflow
- [x] Tous les boutons fonctionnels
- [x] Back button navigateur géré (via phase management)

## Accessibilité

- [x] Contraste texte : ratio 4.5:1 minimum (12.6:1 actuel)
- [x] Contraste éléments interactifs : 3:1 minimum (7.1:1 actuel)
- [x] Touch targets : minimum 44×44px
- [x] Focus visible pour navigation clavier
- [x] Respect prefers-reduced-motion

## Performance

- [x] Bundle < 500KB (actuel: 400KB)
- [x] Lazy loading pour features non-critiques
- [x] Détection appareil bas de gamme
- [x] Réduction particules si FPS < 30
- [x] Pas de memory leaks (cleanup listeners)

## Équilibrage

- [x] Configuration centralisée (`src/config/balance.ts`)
- [x] Seuil défaite ajustable (0.4 par défaut)
- [x] Intérêts journaliers configurables (5💰 par défaut)
- [x] Perte durabilité ajustable par situation
- [x] Probabilités loot configurables

## Animations

- [x] Transitions entre phases (fade/slide)
- [x] Micro-interactions boutons (scale on press)
- [x] Cards avec élévation au hover
- [x] Compteurs animés (count up/down)
- [x] Particules d'ambiance (réduites si performance faible)

## Notes

- Bundle size acceptable pour PWA mobile
- Tous les tests unitaires passent
- Accessibilité conforme WCAG 2.1 AA
- Prêt pour beta/release
