import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { translate } from '@vitalets/google-translate-api';

// Configuration des chemins (à adapter selon la structure de votre package)
const SRC_DIR = path.resolve(__dirname, '../');
const FR_FILE = path.resolve(__dirname, '../locales/fr.json');
const EN_FILE = path.resolve(__dirname, '../locales/en.json');

// Étape 1 : Collecter les traductions via FormatJS
function extractTranslations() {
  console.log('📦 Extraction des textes depuis le code source...');
  // Remplacez le chemin de src par celui où se trouvent vos composants
  const cmd = `npx formatjs extract "${SRC_DIR}/**/*.tsx" "${SRC_DIR}/**/*.ts" --out-file "${FR_FILE}" --format simple`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('✅ Extraction terminée.');
}

// Étape 2 : Traduire vers l'anglais
async function generateEnglishTranslations() {
  const frData = JSON.parse(fs.readFileSync(FR_FILE, 'utf-8'));
  
  let enData: Record<string, string> = {};
  if (fs.existsSync(EN_FILE)) {
    enData = JSON.parse(fs.readFileSync(EN_FILE, 'utf-8'));
  }

  let hasUpdates = false;
  const keys = Object.keys(frData);

  console.log(`🌍 Début de la traduction (${keys.length} clés trouvées)...`);

  for (const id of keys) {
    // Comme vos IDs SONT les messages en français, l'id est le texte à traduire
    const textToTranslate = id; 

    if (!enData[id]) {
      try {
        console.log(`Traduction : "${textToTranslate}"...`);
        const { text } = await translate(textToTranslate, { to: 'en' });
        enData[id] = text;
        hasUpdates = true;

        // Pause de 1s pour éviter l'erreur HTTP 429 (Too Many Requests) de Google
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Erreur lors de la traduction de "${textToTranslate}":`, error);
      }
    }
  }

  if (hasUpdates) {
    fs.writeFileSync(EN_FILE, JSON.stringify(enData, null, 2), 'utf-8');
    console.log('🎉 Fichier en.json mis à jour avec succès !');
  } else {
    console.log('👍 Aucune nouvelle traduction nécessaire. Tout est à jour.');
  }
}

// Exécution
async function run() {
  // S'assurer que le dossier de sortie existe
  if (!fs.existsSync(path.dirname(FR_FILE))) {
    fs.mkdirSync(path.dirname(FR_FILE), { recursive: true });
  }

  extractTranslations();
  await generateEnglishTranslations();
}

run();