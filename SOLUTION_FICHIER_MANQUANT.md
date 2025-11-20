# Solution : Fichier manquant sur le serveur

## Problème identifié
Le fichier `storage/app/public/photos/1763665092-691f64c48dff8.jpg` n'existe pas sur le serveur Hostinger.

Cela explique pourquoi :
- `/api/public/storage/photos/1763665092-691f64c48dff8.jpg` → 404
- `/api/public/api/storage/photos/1763665092-691f64c48dff8.jpg` → 404

## Diagnostic

### Vérifier le dossier photos
```bash
ls -la storage/app/public/photos/
```

### Vérifier si le dossier existe
```bash
ls -la storage/app/public/
```

### Vérifier les fichiers dans la base de données
Le fichier existe peut-être dans la base de données mais pas physiquement sur le disque.

## Solutions

### Solution 1 : Re-uploader l'image (Recommandé)
1. Connectez-vous à l'interface d'administration : `https://cajjrdc.com/admin/login`
2. Allez dans "Galerie" → "Photos"
3. Trouvez l'image correspondante (si elle apparaît dans la liste)
4. Si elle n'apparaît pas, créez une nouvelle actualité/publication avec cette image

### Solution 2 : Vérifier la base de données
Si l'image apparaît dans l'interface d'administration mais le fichier n'existe pas :
- Le fichier a été supprimé physiquement mais reste dans la base de données
- Il faut soit :
  1. Re-uploader l'image depuis l'interface
  2. Ou supprimer l'entrée de la base de données si l'image n'est plus nécessaire

### Solution 3 : Synchroniser les fichiers
Si vous avez les fichiers localement :
```bash
# Depuis votre machine locale (si vous avez SSH/SCP)
scp storage/app/public/photos/*.jpg user@hostinger:~/domains/cajjrdc.com/public_html/api/storage/app/public/photos/
```

## Prévention

Pour éviter ce problème à l'avenir :
1. Assurez-vous que les uploads fonctionnent correctement
2. Vérifiez les permissions du dossier `storage/app/public` (755 ou 775)
3. Vérifiez que le dossier `photos` existe et est accessible en écriture

## Vérifications nécessaires

### 1. Vérifier les permissions
```bash
chmod -R 755 storage/app/public
chmod -R 755 storage/app/public/photos
```

### 2. Vérifier que le dossier photos existe
```bash
mkdir -p storage/app/public/photos
chmod 755 storage/app/public/photos
```

### 3. Tester l'upload
1. Connectez-vous à l'administration
2. Essayez d'uploader une nouvelle image
3. Vérifiez qu'elle apparaît dans `storage/app/public/photos/`

