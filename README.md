# SOUDA

Roguelite mobile où vous incarnez un Soudard — déserteur devenu pilleur — qui doit survivre 20 jours et rembourser 80 pièces d'or de dette. Permadeath, transformation visuelle, pression économique.

## 🎮 Concept

- **Genre** : Roguelite / Loot collector grimdark
- **Plateforme** : PWA (Mobile-first, Desktop supporté)
- **Session** : 6-8 minutes
- **Durée d'une run** : 20 jours in-game (~2-3 heures réelles)
- **Victoire** : Survivre 20 jours ET rembourser la dette
- **Défaite** : Mort en combat OU dette non remboursée au Jour 20

## 🚀 Installation

```bash
npm install
```

## 💻 Développement

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run test     # Tests unitaires
npm run lint     # Linter
```

## 🛠️ Stack Technique

- **React 18** + **TypeScript**
- **Vite** — Build tool
- **Zustand** — State management
- **Framer Motion** — Animations
- **IndexedDB** — Sauvegarde locale (PWA)

## 📁 Structure

```
src/
├── features/          # Logique métier par domaine
│   ├── combat/       # Système de combat
│   ├── exploration/  # Carte et lieux
│   ├── economy/      # Or, dette, réputation
│   ├── loot/         # Génération de loot
│   └── narrative/    # Événements narratifs
├── screens/          # Écrans principaux
├── store/            # État global (Zustand)
└── types/            # Types TypeScript
```

## 🎯 Boucle de Jeu

1. **Aube** — Équipement, marché, taverne, partir en mission
2. **Exploration** — 3 actions pour explorer 5 lieux (loot, combat, choix)
3. **Crépuscule** — Résumé, intérêts de la dette (+5💰/jour)

## 📝 License

Propriétaire — Tous droits réservés
