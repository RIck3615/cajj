# Debug : Upload ne fonctionne pas

## Problème
Erreur : "Le fichier n'a pas pu être sauvegardé"
L'upload échoue en production sur Hostinger.

## Diagnostic

### Vérifications à faire sur Hostinger

1. **Vérifier que le dossier photos existe :**
```bash
ls -la storage/app/public/photos/
```

2. **Si le dossier n'existe pas, le créer :**
```bash
mkdir -p storage/app/public/photos
chmod 755 storage/app/public/photos
```

3. **Vérifier les permissions :**
```bash
chmod -R 755 storage/app/public
chmod 755 storage/app/public/photos
```

4. **Vérifier l'espace disque :**
```bash
df -h
```

5. **Vérifier les logs Laravel :**
```bash
tail -f storage/logs/laravel.log
```
Puis essayez d'uploader une image et regardez les logs.

## Solutions appliquées

J'ai amélioré la méthode `uploadPhoto` pour :
1. ✅ Vérifier que le dossier existe et le créer automatiquement
2. ✅ Vérifier les permissions du dossier
3. ✅ Essayer plusieurs méthodes de sauvegarde (storeAs, Storage facade, sauvegarde manuelle)
4. ✅ Ajouter des logs détaillés pour diagnostiquer le problème

## Prochaines étapes

1. **Déployez le nouveau build** sur Hostinger
2. **Vérifiez les permissions** avec les commandes ci-dessus
3. **Essayez d'uploader une image** et consultez les logs Laravel
4. **Partagez-moi les logs** si l'upload échoue toujours

Les logs indiqueront exactement ce qui ne fonctionne pas :
- Si le dossier n'existe pas
- Si les permissions sont incorrectes
- Si le disque est plein
- Si le fichier ne peut pas être déplacé
- Toute autre erreur

