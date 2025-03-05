const https = require('https');
const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(process.cwd(), 'public', 'models', 'bergamot');

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

// Model URLs from OPUS-MT
const MODEL_URLS = {
  'en-hi': 'https://object.pouta.csc.fi/OPUS-MT-models/en-hi/opus-2020-01-16.zip',
  'hi-en': 'https://object.pouta.csc.fi/OPUS-MT-models/hi-en/opus-2020-01-16.zip'
};

async function downloadFile(url, filename) {
  const filepath = path.join(MODELS_DIR, filename);
  
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${filename}...`);
    
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadModels() {
  try {
    for (const [pair, url] of Object.entries(MODEL_URLS)) {
      const filename = `opus.${pair}.intgemm8bitalpha.bin`;
      await downloadFile(url, filename);
    }
    console.log('All models downloaded successfully!');
  } catch (error) {
    console.error('Error downloading models:', error);
  }
}

downloadModels(); 