# SOUDA — Vertical Slice Jour 1

Prototype minimal jouable pour valider la boucle de jeu.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Structure

- `src/store/gameStore.ts` — État global (Zustand)
- `src/screens/` — Écrans du jeu (Aube, Exploration, Crépuscule)
- `src/App.tsx` — Router simple basé sur la phase

## Boucle de Jeu

1. **Aube** — Stats, bouton "Partir en mission"
2. **Exploration** — 1 lieu, 3 actions, événements (loot/combat)
3. **Crémuscule** — Résumé, intérêts dette, continuer

## Prochaines Itérations

- [ ] Sprites personnage
- [ ] Combat avec calculs
- [ ] Inventaire
- [ ] Plus de lieux
- [ ] Événements narratifs
