# Test : Route Laravel pour servir les fichiers storage

## Problème
L'URL `https://cajjrdc.com/api/public/api/storage/photos/1763677299-691f94734cdaa.jpg` renvoie "Image non disponible".

## Diagnostic

### Étape 1 : Vérifier que le fichier existe
Sur Hostinger, exécutez :
```bash
ls -la storage/app/public/photos/1763677299-691f94734cdaa.jpg
```

### Étape 2 : Tester la route Laravel directement
Ouvrez dans votre navigateur :
```
https://cajjrdc.com/api/public/api/storage/photos/1763677299-691f94734cdaa.jpg
```

### Étape 3 : Vérifier les logs Laravel
```bash
tail -f storage/logs/laravel.log
```
Puis accédez à l'URL ci-dessus et regardez les logs.

Les logs devraient indiquer :
- Si la route est appelée
- Quel chemin est cherché
- Si le fichier existe
- Toute erreur

### Étape 4 : Vérifier le chemin dans la base de données
L'URL sauvegardée dans la base de données devrait être `/storage/photos/1763677299-691f94734cdaa.jpg` (sans le préfixe `/api/public/api`).

## Solutions possibles

### Si le fichier n'existe pas
Re-uploader l'image.

### Si le fichier existe mais la route ne fonctionne pas
1. Vérifier les logs Laravel
2. Vérifier que la route est bien enregistrée
3. Vérifier les permissions du fichier

### Si l'URL est incorrecte
Vérifier que le frontend construit correctement l'URL avec `/api/public/api/storage/...` pour Hostinger.

