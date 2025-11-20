# Diagnostic : Pourquoi les images ne s'affichent pas

## Problème
- URL directe : `https://cajjrdc.com/api/public/storage/photos/1763665092-691f64c48dff8.jpg` → 404
- Route Laravel : `https://cajjrdc.com/api/public/api/storage/photos/1763665092-691f64c48dff8.jpg` → 404

## Diagnostic

### Étape 1 : Vérifier le fichier de diagnostic

J'ai créé un script de diagnostic. Une fois le nouveau build déployé, accédez à :
```
https://cajjrdc.com/api/public/check-storage.php
```

Ce script vous dira :
- Si le dossier `storage/app/public` existe
- Si le lien symbolique `public/storage` existe et où il pointe
- Si le fichier spécifique existe
- Combien de fichiers photos existent

### Étape 2 : Vérifier les logs Laravel

Si le fichier existe mais que la route ne fonctionne pas, vérifiez les logs Laravel :
```bash
tail -f storage/logs/laravel.log
```

Puis accédez à l'URL de la route Laravel pour voir les logs générés.

### Étape 3 : Vérifier manuellement

```bash
# Vérifier si le fichier existe
ls -la storage/app/public/photos/1763665092-691f64c48dff8.jpg

# Vérifier le dossier photos
ls -la storage/app/public/photos/

# Vérifier le lien symbolique
ls -la public/storage
```

### Solutions possibles

#### Si le fichier n'existe pas
**Solution :** Re-uploader l'image depuis l'interface d'administration

#### Si le fichier existe mais la route ne fonctionne pas
**Solution :** Vérifier les permissions :
```bash
chmod -R 755 storage/app/public
chmod -R 755 public/storage
```

#### Si le dossier photos n'existe pas
**Solution :** Créer le dossier :
```bash
mkdir -p storage/app/public/photos
chmod 755 storage/app/public/photos
```

### Après le déploiement

1. Déployez le nouveau build
2. Accédez à `https://cajjrdc.com/api/public/check-storage.php`
3. Partagez-moi le résultat du diagnostic

