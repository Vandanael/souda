# 🚀 COMBO DE COMMANDES - DÉPLOIEMENT GITHUB PAGES

## ✅ DIAGNOSTIC .gitignore

### Sécurité : ✅ VALIDÉ
- ✅ `node_modules/` ignoré
- ✅ `dist/` ignoré  
- ✅ `.expo/` ignoré
- ✅ `web-build/` ignoré
- ✅ `.env*` ignoré
- ✅ `credentials.json` ignoré
- ✅ `.DS_Store` ignoré
- ✅ Aucun fichier sensible détecté

### Améliorations apportées
- Ajout de `.expo/`, `web-build/`, `.env*`, `credentials.json`
- Ajout de `.vite/`, `.cache/`, `.cursor/` (fichiers temporaires)

---

## 📦 PRÉPARATION (UNE SEULE FOIS)

### 1. Installer gh-pages
```bash
npm install --save-dev gh-pages
```

---

## 🎯 COMBO FINAL (À COPIER-COLLER)

### Option A : Séquentiel (recommandé pour la première fois)

```bash
# 1. Installer gh-pages (si pas déjà fait)
npm install --save-dev gh-pages

# 2. Vérifier les fichiers à commiter
git status

# 3. Ajouter tous les fichiers (sauf ceux dans .gitignore)
git add .

# 4. Commit avec message descriptif
git commit -m "feat: V1 - Audit corrections, UI refactor, Web compatibility & responsive layout"

# 5. Push sur main
git push origin main

# 6. Déployer sur GitHub Pages
npm run deploy
```

### Option B : Tout en une ligne (après avoir installé gh-pages)

```bash
git add . && git commit -m "feat: V1 - Ready for deployment" && git push origin main && npm run deploy
```

---

## ⚙️ CONFIGURATION GITHUB PAGES

### Première fois uniquement :
1. Aller sur : `https://github.com/Vandanael/souda/settings/pages`
2. **Source** : `gh-pages` branch
3. **Folder** : `/ (root)`
4. Cliquer **Save**

### URL du site déployé :
```
https://vandanael.github.io/souda/
```

---

## 📝 NOTES IMPORTANTES

### Base Path
- ✅ Configuré pour `/souda/` dans `vite.config.ts`
- ✅ Correspond au nom du repo GitHub

### Ordre des opérations
1. ✅ **D'abord** : Push le code source sur `main`
2. ✅ **Ensuite** : `npm run deploy` qui push le build sur `gh-pages`

### Mises à jour futures
- Pour mettre à jour le site : `npm run deploy` (pas besoin de re-pusher le code source)

---

## 🔍 VÉRIFICATIONS POST-DÉPLOIEMENT

```bash
# Vérifier que la branche gh-pages existe
git branch -a | grep gh-pages

# Vérifier le build localement
npm run build
npm run preview
```

---

## ⚠️ EN CAS DE PROBLÈME

### Si le déploiement échoue :
```bash
# Nettoyer et réessayer
rm -rf dist
npm run build
npm run deploy
```

### Si l'URL ne fonctionne pas :
- Vérifier que GitHub Pages est activé dans les Settings
- Attendre 1-2 minutes (premier déploiement)
- Vérifier que le `base` dans `vite.config.ts` correspond au nom du repo
