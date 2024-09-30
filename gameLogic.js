const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const words = require('./wordList');

const SCORE_FILE = path.join(__dirname, 'hangman-nodejs_score.json');

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

function displayWord(word, guessedLetters) {
    return word.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
}

function saveScore(playerName, score) {
    const scoreData = {
        playerName,
        score,
        date: new Date().toISOString()
    };

    let scores = [];
    if (fs.existsSync(SCORE_FILE)) {
        const data = fs.readFileSync(SCORE_FILE);
        scores = JSON.parse(data);
    }

    scores.push(scoreData);
    scores.sort((a, b) => b.score - a.score);

    fs.writeFileSync(SCORE_FILE, JSON.stringify(scores, null, 4));
}

function displayLeaderboard() {
    if (!fs.existsSync(SCORE_FILE)) {
        console.log('No scores available.');
        return;
    }

    const data = fs.readFileSync(SCORE_FILE);
    const scores = JSON.parse(data);

    console.log('Leaderboard:');
    scores.slice(0, 10).forEach((score, index) => {
        console.log(`${index + 1}. ${score.playerName} - ${score.score} (${score.date})`);
    });
}

function playGame() {
    const word = getRandomWord();
    let guessedLetters = [];
    let attempts = 6;

    while (attempts > 0) {
        console.log(`Word: ${displayWord(word, guessedLetters)}`);
        console.log(`Attempts left: ${attempts}`);
        const guess = readlineSync.question('Guess a letter: ').toUpperCase();

        if (guessedLetters.includes(guess)) {
            console.log('You already guessed that letter.');
        } else if (word.includes(guess)) {
            guessedLetters.push(guess);
            console.log('Correct guess!');
        } else {
            guessedLetters.push(guess);
            attempts--;
            console.log('Incorrect guess.');
        }

        if (word.split('').every(letter => guessedLetters.includes(letter))) {
            console.log(`Congratulations! You guessed the word: ${word}`);
            const playerName = readlineSync.question('Enter your name: ');
            saveScore(playerName, attempts);
            displayLeaderboard();
            return;
        }
    }

    console.log(`Game over! The word was: ${word}`);
    displayLeaderboard();
}

module.exports = playGame;