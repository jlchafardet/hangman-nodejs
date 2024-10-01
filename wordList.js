const fs = require('fs');
const path = require('path');

let cachedWords = null;

function loadWordsFromFile() {
    if (!cachedWords) {
        const filePath = path.join(__dirname, 'words.json'); // Assuming words are stored in a file named 'words.json'
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            cachedWords = JSON.parse(data).words;
        } catch (error) {
            console.error('Error loading words from file:', error);
            cachedWords = [];
        }
    }
    return cachedWords;
}

module.exports = {
    getWords: loadWordsFromFile
};