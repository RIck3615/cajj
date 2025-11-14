# Comment créer le lien symbolique storage sur Hostinger

Sur Hostinger, la fonction `exec()` est souvent désactivée, ce qui empêche l'utilisation de `php artisan storage:link`. Voici plusieurs solutions :

## Solution 1 : Script PHP alternatif (Recommandé)

1. Uploadez le fichier `create-storage-link.php` dans le dossier `api/` de votre serveur
2. Via SSH ou Terminal Hostinger, exécutez :
   ```bash
   cd public_html/api
   php create-storage-link.php
   ```

## Solution 2 : Création manuelle via File Manager

1. Connectez-vous au **File Manager** de Hostinger
2. Allez dans `public_html/api/public/`
3. Cliquez sur **"Créer"** ou **"New"**
4. Sélectionnez **"Symbolic Link"** ou **"Lien symbolique"**
5. Nommez-le `storage`
6. Pointez vers : `../storage/app/public`

**Note** : Si l'option "Symbolic Link" n'est pas disponible, utilisez la Solution 3.

## Solution 3 : Via SSH (si disponible)

Si vous avez accès SSH :

```bash
cd public_html/api/public
ln -s ../storage/app/public storage
```

## Solution 4 : Modifier la configuration Laravel

Si aucune des solutions ci-dessus ne fonctionne, vous pouvez modifier la configuration pour servir les fichiers directement depuis `storage/app/public` :

1. Modifiez `config/filesystems.php` pour utiliser `public` comme disque par défaut
2. Les fichiers seront accessibles via `/api/storage/app/public/...`

**Note** : Cette solution est moins sécurisée et moins optimale.

## Vérification

Après avoir créé le lien, vérifiez que :

1. Le dossier `public_html/api/public/storage` existe et pointe vers `storage/app/public`
2. Les images sont accessibles via : `https://votre-domaine.com/api/storage/photos/...`
3. Testez l'upload d'une image depuis l'admin

## Dépannage

### Le lien n'apparaît pas dans le File Manager

- Certains hébergeurs masquent les liens symboliques dans l'interface
- Vérifiez via SSH ou testez l'accès direct à une image

### Erreur 403 Forbidden sur les images

- Vérifiez les permissions : `chmod -R 755 storage/app/public`
- Vérifiez que le fichier `.htaccess` dans `storage/app/public` autorise l'accès

### Erreur 404 Not Found

- Vérifiez que le lien symbolique pointe vers le bon chemin
- Vérifiez que les fichiers sont bien dans `storage/app/public/photos/` ou `videos/`
