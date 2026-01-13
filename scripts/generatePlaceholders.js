// Script pour générer les placeholders de sprites
// Utilise Node.js avec canvas (npm install canvas)

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const slots = ['head', 'torso', 'legs', 'hands', 'weapon', 'offhand', 'accessory']
const rarities = ['common', 'uncommon', 'rare', 'legendary']
const colors = {
  common: '#808080',    // Gris
  uncommon: '#2ecc71',  // Vert
  rare: '#3498db',      // Bleu
  legendary: '#f39c12'  // Or
}

const size = 64

// Créer le répertoire sprites s'il n'existe pas
const spritesDir = path.join(__dirname, '../public/sprites')
if (!fs.existsSync(spritesDir)) {
  fs.mkdirSync(spritesDir, { recursive: true })
}

// Générer un sprite placeholder SVG (plus simple que canvas pour Node.js)
function generatePlaceholderSVG(slot, rarity) {
  const color = colors[rarity] || '#808080'
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}"/>
  <rect x="2" y="2" width="${size - 4}" height="${size - 4}" fill="none" stroke="#000" stroke-width="2"/>
  <text x="${size / 2}" y="${size / 2 + 4}" font-family="Arial" font-size="8" fill="#fff" text-anchor="middle">${slot}</text>
</svg>`
}

// Générer tous les placeholders
for (const slot of slots) {
  for (const rarity of rarities) {
    const filename = `${slot}_${rarity}_placeholder.svg`
    const filepath = path.join(spritesDir, filename)
    const svg = generatePlaceholderSVG(slot, rarity)
    
    fs.writeFileSync(filepath, svg)
    console.log(`Generated: ${filename}`)
  }
}

// Générer aussi le sprite de base du corps
const bodySVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#444"/>
  <rect x="2" y="2" width="${size - 4}" height="${size - 4}" fill="none" stroke="#666" stroke-width="1"/>
</svg>`

fs.writeFileSync(path.join(spritesDir, 'body_base.svg'), bodySVG)
console.log('Generated: body_base.svg')

console.log('\nAll placeholders generated!')
