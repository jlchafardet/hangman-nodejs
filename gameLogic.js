const words = require('./wordList');
const readlineSync = require('readline-sync');

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

function displayWord(word, guessedLetters) {
    return word.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
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
            return;
        }
    }

    console.log(`Game over! The word was: ${word}`);
}

module.exports = playGame;