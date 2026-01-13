# Guide de déploiement - SOUDA

## 🚀 Options d'hébergement

### 1. Netlify (Recommandé pour PWA)

**Avantages :**
- ✅ Configuration des headers HTTP (résout le problème MIME type)
- ✅ Support PWA complet
- ✅ Déploiement automatique depuis GitHub
- ✅ Gratuit pour projets open source
- ✅ Configuration simple via `netlify.toml`

**Déploiement :**

1. Créer un compte sur [Netlify](https://www.netlify.com/)
2. Connecter votre repository GitHub
3. Configurer :
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Netlify détectera automatiquement `netlify.toml`
5. Déploiement automatique à chaque push

**Configuration personnalisée :**
- Modifier `vite.config.ts` : changer `base: '/souda/'` en `base: '/'` pour un domaine personnalisé
- Ou garder `/souda/` si vous utilisez un sous-domaine

---

### 2. Vercel

**Avantages :**
- ✅ Optimisé pour React/Vite
- ✅ Déploiement automatique
- ✅ Configuration des headers
- ✅ Gratuit pour projets open source

**Déploiement :**

1. Créer un compte sur [Vercel](https://vercel.com/)
2. Importer votre repository GitHub
3. Vercel détectera automatiquement la configuration
4. Déploiement automatique à chaque push

**Configuration personnalisée :**
- Modifier `vite.config.ts` : changer `base: '/souda/'` en `base: '/'` pour un domaine personnalisé

---

### 3. GitHub Pages (Limité)

**Limitations :**
- ❌ Pas de contrôle sur les headers HTTP
- ❌ Problèmes avec les types MIME pour les modules ES6
- ❌ Configuration restreinte

**Si vous devez utiliser GitHub Pages :**

1. Modifier `vite.config.ts` : `base: '/souda/'` (ou votre repo name)
2. Build : `npm run build`
3. Déployer : `npm run deploy`

**Note :** Le problème MIME type peut persister avec GitHub Pages.

---

## 🔧 Configuration du base path

Pour changer le chemin de base selon la plateforme, modifiez `vite.config.ts` :

```typescript
base: '/souda/',  // GitHub Pages (nom du repo)
base: '/',        // Netlify/Vercel avec domaine personnalisé
```

---

## 📝 Comparaison des plateformes

| Fonctionnalité | GitHub Pages | Netlify | Vercel |
|---------------|--------------|---------|--------|
| Headers HTTP | ❌ | ✅ | ✅ |
| PWA Support | ⚠️ | ✅ | ✅ |
| Déploiement auto | ✅ | ✅ | ✅ |
| Configuration | Limitée | Flexible | Flexible |
| Gratuit | ✅ | ✅ | ✅ |

**Recommandation :** Utilisez **Netlify** ou **Vercel** pour votre PWA.
