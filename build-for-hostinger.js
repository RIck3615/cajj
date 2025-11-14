const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Préparation du déploiement pour Hostinger...\n');

// 1. Build du frontend
console.log('📦 Build du frontend...');
try {
  process.chdir('frontend');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Frontend buildé avec succès\n');
} catch (error) {
  console.error('❌ Erreur lors du build du frontend:', error.message);
  process.exit(1);
}

// 2. Créer le dossier de déploiement
const deployDir = path.join(__dirname, 'deploy-hostinger');
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true, force: true });
}
fs.mkdirSync(deployDir, { recursive: true });
fs.mkdirSync(path.join(deployDir, 'api'), { recursive: true });

console.log('📁 Copie des fichiers...');

// 3. Copier le frontend (dist)
const frontendDist = path.join(__dirname, 'frontend', 'dist');
const frontendDest = deployDir;
if (fs.existsSync(frontendDist)) {
  copyRecursiveSync(frontendDist, frontendDest);
  console.log('✅ Frontend copié');
} else {
  console.error('❌ Le dossier frontend/dist n\'existe pas');
  process.exit(1);
}

// 4. Copier le backend Laravel
const backendSrc = path.join(__dirname, 'backend-laravel');
const backendDest = path.join(deployDir, 'api');
copyBackendFiles(backendSrc, backendDest);
console.log('✅ Backend copié');

// 5. Copier le .htaccess du frontend
const frontendHtaccess = path.join(__dirname, 'frontend', '.htaccess');
if (fs.existsSync(frontendHtaccess)) {
  fs.copyFileSync(frontendHtaccess, path.join(deployDir, '.htaccess'));
  console.log('✅ .htaccess frontend copié');
}

// 6. Créer un fichier README dans le dossier de déploiement
const readmeContent = `# Fichiers prêts pour le déploiement sur Hostinger

## Structure

- Tous les fichiers du frontend sont à la racine
- Le backend Laravel est dans le dossier api/

## Instructions

1. Connectez-vous à votre compte Hostinger
2. Accédez au File Manager
3. Allez dans public_html/
4. Uploadez TOUS les fichiers de ce dossier
5. Configurez la base de données MySQL
6. Modifiez api/.env avec vos informations de base de données
7. Exécutez les migrations : cd api && php artisan migrate --force
8. Créez le lien symbolique : php artisan storage:link

## Configuration requise

- PHP 8.1 ou supérieur
- MySQL 5.7 ou supérieur
- mod_rewrite activé
- Composer installé (ou utilisez le vendor/ fourni)
`;

fs.writeFileSync(path.join(deployDir, 'README-DEPLOIEMENT.txt'), readmeContent);
console.log('✅ README créé\n');

console.log('✨ Déploiement prêt !');
console.log(`📂 Dossier de déploiement : ${deployDir}`);
console.log('\n📋 Prochaines étapes :');
console.log('1. Compressez le dossier deploy-hostinger/');
console.log('2. Uploadez-le sur Hostinger dans public_html/');
console.log('3. Suivez les instructions dans README-DEPLOIEMENT.txt\n');

// Fonctions utilitaires
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyBackendFiles(src, dest) {
  const excludeDirs = ['node_modules', '.git', 'tests', 'storage/logs', 'storage/framework/cache', 'storage/framework/sessions', 'storage/framework/views'];
  const excludeFiles = ['.env', '.env.example', '.gitignore', 'phpunit.xml', 'README.md'];

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);

    // Ignorer les dossiers exclus
    if (stat.isDirectory() && excludeDirs.includes(item)) {
      return;
    }

    // Ignorer les fichiers exclus
    if (stat.isFile() && excludeFiles.includes(item)) {
      return;
    }

    if (stat.isDirectory()) {
      copyBackendFiles(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });

  // Créer les dossiers storage nécessaires
  const storageDirs = [
    'storage/app/public/photos',
    'storage/app/public/videos',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'bootstrap/cache'
  ];

  storageDirs.forEach(dir => {
    const fullPath = path.join(dest, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

