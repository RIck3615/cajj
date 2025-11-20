# Solution : Erreur 404 sur les images

## Problème
L'URL est correcte : `https://cajjrdc.com/api/public/storage/photos/...`
Mais vous obtenez une erreur 404 (Not Found).

## Causes possibles

### 1. Le lien symbolique n'existe pas
Le lien symbolique de `api/public/storage` vers `api/storage/app/public` n'a pas été créé.

### 2. Le fichier n'existe pas
Le fichier photo n'existe pas dans `api/storage/app/public/photos/`

### 3. Le lien symbolique pointe vers le mauvais chemin
Le lien symbolique existe mais pointe vers un mauvais chemin.

## Solution : Vérifier et créer le lien symbolique

### Étape 1 : Vérifier sur Hostinger via SSH

Connectez-vous en SSH et exécutez :

```bash
cd public_html/api/public
ls -la storage
```

**Résultat attendu :**
```
storage -> ../storage/app/public
```

Si vous voyez ceci, le lien symbolique existe ✅

**Si vous ne voyez rien ou une erreur :** Le lien symbolique n'existe pas ❌

### Étape 2 : Vérifier que le fichier existe

```bash
ls -la ../storage/app/public/photos/1763665092-691f64c48dff8.jpg
```

**Si le fichier existe :** Le fichier est là ✅
**Si le fichier n'existe pas :** Le fichier n'a pas été uploadé ❌

### Étape 3 : Créer le lien symbolique

**Option A : Via le script PHP**

```bash
cd public_html/api
php create-storage-link.php
```

**Option B : Via SSH (si disponible)**

```bash
cd public_html/api/public
ln -s ../storage/app/public storage
```

**Option C : Via File Manager Hostinger**

1. Allez dans `public_html/api/public/`
2. Cliquez sur "Créer" → "Lien symbolique"
3. Nom : `storage`
4. Chemin cible : `../storage/app/public`

### Étape 4 : Vérifier les permissions

```bash
chmod -R 755 ../storage/app/public
```

## Vérification finale

Testez l'URL directement dans votre navigateur :
```
https://cajjrdc.com/api/public/storage/photos/1763665092-691f64c48dff8.jpg
```

**Si l'image s'affiche :** ✅ Le problème est résolu !
**Si vous obtenez encore 404 :** Vérifiez les étapes ci-dessus.

## Diagnostic rapide

### Test 1 : Vérifier que le dossier storage existe
```bash
ls -la public_html/api/storage/app/public/photos/
```

### Test 2 : Vérifier le lien symbolique
```bash
ls -la public_html/api/public/storage
```

### Test 3 : Tester l'accès direct au fichier
```bash
curl -I https://cajjrdc.com/api/public/storage/photos/1763665092-691f64c48dff8.jpg
```

## Si le fichier n'existe pas

Si le fichier n'existe pas dans `api/storage/app/public/photos/`, cela signifie que :
1. L'image n'a pas été uploadée
2. L'image a été supprimée
3. Le chemin de stockage est incorrect

**Solution :** Re-uploader l'image depuis l'interface d'administration.

