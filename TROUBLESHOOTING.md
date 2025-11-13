# Guide de dépannage - Erreur "Impossible de contacter le serveur"

## ✅ Vérifications rapides

### 1. Le backend est-il démarré ?

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
🚀 CAJJ API ready on http://localhost:4000
📡 Accessible depuis le réseau local sur le port 4000
```

### 2. Vérifier que le port 4000 est utilisé

**Windows :**
```powershell
netstat -ano | findstr :4000
```

**Linux/Mac :**
```bash
lsof -i :4000
```

### 3. Tester la connexion au backend

**Windows (PowerShell) :**
```powershell
Invoke-WebRequest -Uri http://localhost:4000/ -UseBasicParsing
```

**Linux/Mac :**
```bash
curl http://localhost:4000/
```

Vous devriez recevoir une réponse JSON avec le nom de l'API.

## 🔧 Solutions selon votre situation

### Situation 1 : Vous êtes sur le même ordinateur

1. **Vérifiez que le backend est démarré** (voir ci-dessus)
2. **Vérifiez l'URL dans la console du navigateur** (F12)
   - Vous devriez voir : `🔗 URL API détectée: http://localhost:4000`
3. **Si l'URL est incorrecte**, créez `frontend/.env` :
   ```env
   VITE_API_URL=http://localhost:4000
   ```
4. **Redémarrez le serveur frontend** après avoir créé/modifié `.env`

### Situation 2 : Vous êtes sur un autre ordinateur

1. **Trouvez l'adresse IP de la machine qui héberge le backend** :
   ```bash
   cd backend
   npm run get-ip
   ```
   Vous obtiendrez quelque chose comme : `172.20.10.4`

2. **Créez `frontend/.env` sur l'ordinateur client** :
   ```env
   VITE_API_URL=http://172.20.10.4:4000
   ```
   (Remplacez `172.20.10.4` par l'IP affichée)

3. **Vérifiez que le backend écoute sur toutes les interfaces** :
   - Le backend doit être démarré avec `npm run dev`
   - Il doit afficher : `🚀 CAJJ API ready on http://0.0.0.0:4000`

4. **Vérifiez le pare-feu** :
   - Windows : Autorisez le port 4000 dans le pare-feu Windows
   - Le backend doit être accessible depuis le réseau local

5. **Redémarrez le serveur frontend** après avoir créé/modifié `.env`

### Situation 3 : Vous êtes en production (Vercel, etc.)

1. **Configurez la variable d'environnement dans Vercel** :
   - Allez dans Settings > Environment Variables
   - Ajoutez : `VITE_API_URL` = `https://votre-backend-url.com`

2. **Redéployez le frontend** après avoir ajouté la variable

## 🐛 Diagnostic avancé

### Ouvrir la console du navigateur (F12)

1. Allez sur la page de login : `/admin/login`
2. Ouvrez la console (F12)
3. Regardez les messages :
   - `🔗 URL API détectée: ...` → L'URL utilisée
   - `✅ Backend accessible` → Tout fonctionne
   - `❌ Backend inaccessible` → Problème de connexion

### Tester manuellement l'API

**Depuis le navigateur (console) :**
```javascript
fetch('http://localhost:4000/')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Depuis le terminal :**
```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:4000/ -UseBasicParsing

# Linux/Mac
curl http://localhost:4000/
```

### Vérifier les erreurs CORS

Si vous voyez une erreur CORS dans la console, vérifiez que :
1. Le backend a `app.use(cors())` dans `backend/src/index.js`
2. Le backend écoute sur `0.0.0.0` (pas seulement `127.0.0.1`)

## 📞 Informations à fournir en cas de problème persistant

1. **URL API détectée** (dans la console du navigateur)
2. **URL actuelle du frontend** (dans la console)
3. **Statut du backend** (est-il démarré ?)
4. **Résultat de `npm run get-ip`** dans le backend
5. **Résultat de `netstat -ano | findstr :4000`** (Windows) ou `lsof -i :4000` (Linux/Mac)
6. **Messages d'erreur complets** de la console du navigateur

## ✅ Checklist complète

- [ ] Backend démarré (`cd backend && npm run dev`)
- [ ] Port 4000 accessible (pas utilisé par un autre programme)
- [ ] Backend répond à `http://localhost:4000/`
- [ ] URL API correcte dans la console du navigateur
- [ ] Fichier `.env` créé si nécessaire (même ordinateur ou autre ordinateur)
- [ ] Frontend redémarré après modification de `.env`
- [ ] Pare-feu autorise le port 4000 (si accès depuis un autre ordinateur)
- [ ] Backend écoute sur `0.0.0.0` (pas seulement `127.0.0.1`)
