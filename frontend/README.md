# CAJJ ASBL - Frontend

Site web du Centre d'Aide Juridico Judiciaire CAJJ ASBL.

## Configuration de l'URL de l'API

### Détection automatique

L'application détecte automatiquement l'URL de l'API :
- Si vous accédez via `http://192.168.1.100:5173`, l'API utilisera `http://192.168.1.100:4000`
- Si vous accédez via `http://localhost:5173`, l'API utilisera `http://localhost:4000`

### Configuration manuelle (optionnelle)

Créez un fichier `.env` dans le dossier `frontend/` :

```env
VITE_API_URL=http://localhost:4000
```

Pour accéder depuis un autre appareil :
```env
VITE_API_URL=http://192.168.1.100:4000
```

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

**Important** : Assurez-vous que le backend est démarré sur le port 4000.

## Build

```bash
npm run build
```

## Identifiants admin par défaut

- Username: `admin`
- Password: `admin123`

⚠️ Changez ces identifiants en production !

Voir [CONFIGURATION.md](./CONFIGURATION.md) pour plus de détails.
