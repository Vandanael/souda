# 🔒 CHECKLIST DE DÉPLOIEMENT GITHUB PAGES

## ✅ DIAGNOSTIC .gitignore

### ✅ Sécurisé
- ✅ `node_modules/` - Ignoré
- ✅ `dist/` - Ignoré
- ✅ `.expo/` - Ignoré (ajouté)
- ✅ `web-build/` - Ignoré (ajouté)
- ✅ `.env*` - Ignoré (ajouté)
- ✅ `credentials.json` - Ignoré (ajouté)
- ✅ `.DS_Store` - Ignoré
- ✅ Fichiers système - Ignorés

### ⚠️ Améliorations apportées
- Ajout de `.expo/` et `web-build/`
- Ajout de `.env*` et `credentials.json`
- Ajout de `.vite/` et cache
- Ajout de `.cursor/` (fichiers temporaires IDE)

## 📦 VÉRIFICATIONS PRÉ-DÉPLOIEMENT

### 1. Installation de gh-pages
```bash
npm install --save-dev gh-pages
```

### 2. Configuration Vite
- ✅ `base: '/souda/'` configuré dans `vite.config.ts`
- ⚠️ **IMPORTANT** : Si votre repo GitHub s'appelle autrement que "souda", changez le `base` dans `vite.config.ts`

### 3. Script de déploiement
- ✅ Script `deploy` ajouté dans `package.json`

## 🚀 PROCÉDURE DE DÉPLOIEMENT

### ÉTAPE 1 : Installer gh-pages (si pas déjà fait)
```bash
npm install --save-dev gh-pages
```

### ÉTAPE 2 : Vérifier les modifications
```bash
git status
```

### ÉTAPE 3 : Commit et Push du code source
```bash
git add .
git commit -m "feat: V1 - Audit corrections, UI refactor, Web compatibility"
git push origin main
```

### ÉTAPE 4 : Déployer sur GitHub Pages
```bash
npm run deploy
```

Cette commande va :
1. Builder le projet (`npm run build`)
2. Pousser le dossier `dist/` sur la branche `gh-pages`

### ÉTAPE 5 : Activer GitHub Pages (si pas déjà fait)
1. Aller sur GitHub → Settings → Pages
2. Source : `gh-pages` branch
3. Folder : `/ (root)`
4. Save

## 📝 NOTES IMPORTANTES

### Base Path
- Le `base: '/souda/'` dans `vite.config.ts` suppose que votre repo s'appelle "souda"
- Si votre repo a un autre nom, changez le `base` en conséquence
- Pour un domaine personnalisé, utilisez `base: '/'`

### Première fois
- La première fois, GitHub Pages peut prendre 1-2 minutes pour se déployer
- Vérifiez l'URL : `https://[username].github.io/souda/`

### Mises à jour
- À chaque `npm run deploy`, le site sera mis à jour automatiquement
- Pas besoin de re-pusher le code source à chaque fois

## 🔧 COMMANDES RAPIDES

```bash
# Tout en une fois (après avoir installé gh-pages)
git add . && git commit -m "feat: V1 - Ready for deployment" && git push origin main && npm run deploy
```
