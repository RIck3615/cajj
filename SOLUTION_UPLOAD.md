# Solution : Uploads ne fonctionnent pas

## Problème identifié
Les uploads d'images ne fonctionnent pas en production. Les fichiers ne sont pas sauvegardés dans `storage/app/public/photos/`.

## Modifications apportées

### 1. Amélioration de la méthode `uploadPhoto`
- ✅ Ajout de gestion d'erreur complète
- ✅ Vérification que le dossier `photos` existe (création automatique si absent)
- ✅ Vérification des permissions du dossier
- ✅ Logs détaillés pour le débogage
- ✅ Vérification que le fichier a été sauvegardé après l'upload

### 2. Vérifications automatiques
La méthode vérifie maintenant :
- Si le fichier est valide
- Si le dossier `photos` existe (création automatique)
- Si le dossier est accessible en écriture
- Si le fichier a été sauvegardé correctement

## Après déploiement

### Étape 1 : Vérifier les permissions
```bash
# Vérifier les permissions du dossier storage
chmod -R 755 storage/app/public

# Créer le dossier photos s'il n'existe pas
mkdir -p storage/app/public/photos
chmod 755 storage/app/public/photos
```

### Étape 2 : Tester l'upload
1. Connectez-vous à l'administration : `https://cajjrdc.com/admin/login`
2. Allez dans "Galerie" → "Photos"
3. Essayez d'uploader une image
4. Vérifiez les logs Laravel : `tail -f storage/logs/laravel.log`

### Étape 3 : Vérifier que le fichier a été créé
```bash
ls -la storage/app/public/photos/
```

## Diagnostic des erreurs

Si l'upload échoue toujours :

### 1. Vérifier les logs Laravel
```bash
tail -f storage/logs/laravel.log
```
Les logs indiqueront :
- Si le dossier n'existe pas
- Si les permissions sont incorrectes
- Si le fichier n'a pas pu être sauvegardé
- Toute autre erreur

### 2. Vérifier les permissions
```bash
# Permissions du dossier storage
ls -la storage/app/public/

# Permissions du dossier photos
ls -la storage/app/public/photos/

# Si nécessaire, corriger les permissions
chmod -R 755 storage/app/public
chmod -R 755 storage/app/public/photos
```

### 3. Vérifier que PHP peut écrire
```bash
# Tester l'écriture
touch storage/app/public/photos/test.txt
rm storage/app/public/photos/test.txt
```

Si cette commande échoue, les permissions ne sont pas correctes.

## Solutions possibles

### Si le dossier n'existe pas
La méthode le crée automatiquement maintenant, mais si cela ne fonctionne pas :
```bash
mkdir -p storage/app/public/photos
chmod 755 storage/app/public/photos
```

### Si les permissions sont incorrectes
```bash
chmod -R 755 storage/app/public
```

### Si le disque est plein
```bash
df -h
```

### Si PHP n'a pas les permissions
Vérifier avec votre hébergeur (Hostinger) les permissions PHP.

## Messages d'erreur possibles

### "Impossible de créer le dossier photos"
→ Vérifier les permissions du dossier parent `storage/app/public`

### "Le dossier photos n'est pas accessible en écriture"
→ Vérifier les permissions : `chmod 755 storage/app/public/photos`

### "Le fichier n'a pas pu être sauvegardé"
→ Vérifier les logs pour plus de détails, peut-être un problème de disque plein

### "Erreur lors de l'upload: ..."
→ Consulter les logs Laravel pour le message d'erreur complet

