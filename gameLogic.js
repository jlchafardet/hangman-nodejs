const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const words = require('./wordList');

const SCORE_FILE = path.join(__dirname, 'hangman-nodejs_score.json');

// Hangman stages represented as ASCII art
const hangmanStages = [
    `
     -----
     |   |
         |
         |
         |
         |
    =========`,
    `
     -----
     |   |
     O   |
         |
         |
         |
    =========`,
    `
     -----
     |   |
     O   |
     |   |
         |
         |
    =========`,
    `
     -----
     |   |
     O   |
    /|   |
         |
         |
    =========`,
    `
     -----
     |   |
     O   |
    /|\\  |
         |
         |
    =========`,
    `
     -----
     |   |
     O   |
    /|\\  |
    /    |
         |
    =========`,
    `
     -----
     |   |
     O   |
    /|\\  |
    / \\  |
         |
    =========`
];

// Function to get a random word from the predefined list
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

// Function to display the word with guessed letters
async function displayWord(word, guessedLetters) {
    const chalk = (await import('chalk')).default; // Dynamically import chalk
    // Display each letter if guessed in green, otherwise display an underscore in white
    return word.split('').map(letter => guessedLetters.includes(letter) ? chalk.green(letter) : chalk.white('_')).join(' ');
}

// Function to display guessed letters
async function displayGuessedLetters(word, guessedLetters) {
    const chalk = (await import('chalk')).default; // Dynamically import chalk
    // Separate guessed letters into correct and incorrect guesses
    const correctGuesses = guessedLetters.filter(letter => word.includes(letter));
    const incorrectGuesses = guessedLetters.filter(letter => !word.includes(letter));

    console.log(`Correct Guesses: ${chalk.green(correctGuesses.join(', '))}`);
    console.log(`Incorrect Guesses: ${chalk.red(incorrectGuesses.join(', '))}`);
}

// Function to display the current game state
async function displayGameState(word, guessedLetters, attempts) {
    console.log(hangmanStages[6 - attempts]); // Display the current hangman stage
    console.log(`Word: ${await displayWord(word, guessedLetters)}`); // Display the word with guessed letters
    await displayGuessedLetters(word, guessedLetters); // Display the guessed letters
    console.log(`Attempts left: ${attempts}`); // Display the number of attempts left
}

// Function to display the end-game summary
async function displayEndGameSummary(word, guessedLetters, attempts) {
    console.log(`\n--- End of Game Summary ---`);
    console.log(`Final Word: ${word}`);
    await displayGuessedLetters(word, guessedLetters); // Display the guessed letters
    console.log(`Remaining Attempts: ${attempts}`);
    console.log(`--------------------------\n`);
}

// Function to save the player's score to a JSON file
function saveScore(playerName, score, word, gameDuration, guesses) {
    const scoreData = {
        playerName,
        score,
        date_time: new Date().toISOString(),
        word_guessed: word,
        game_duration: gameDuration,
        guesses
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

// Function to display the leaderboard
function displayLeaderboard() {
    if (!fs.existsSync(SCORE_FILE)) {
        console.log('No scores available.');
        return;
    }

    const data = fs.readFileSync(SCORE_FILE);
    const scores = JSON.parse(data);

    console.log('Leaderboard:');
    scores.slice(0, 10).forEach((score, index) => {
        console.log(`${index + 1}. ${score.playerName} - ${score.score} (${score.date_time})`);
        console.log(`   Word Guessed: ${score.word_guessed}`);
        console.log(`   Game Duration: ${score.game_duration} seconds`);
        console.log(`   Guesses: ${score.guesses.join(', ')}`);
    });
}

// Function to play the Hangman game
async function playGame() {
    const word = getRandomWord(); // Get a random word
    let guessedLetters = []; // Array to store guessed letters
    let attempts = 6; // Number of attempts
    const startTime = Date.now(); // Start time of the game

    while (attempts > 0) {
        await displayGameState(word, guessedLetters, attempts); // Display the current game state
        const guess = readlineSync.question('Guess a letter: ').toUpperCase(); // Prompt the user to guess a letter

        // Handle invalid inputs
        if (!/^[A-Z]$/.test(guess)) { // Check if the input is a single alphabetic character
            console.log('Invalid input. Please enter a single alphabetic character.'); // Display an error message for invalid input
            continue; // Continue to the next iteration without decrementing attempts
        }

        if (guessedLetters.includes(guess)) { // Check if the letter has already been guessed
            console.log('You already guessed that letter.'); // Display a message for repeated guess
        } else if (word.includes(guess)) { // Check if the guessed letter is in the word
            guessedLetters.push(guess); // Add the guessed letter to the array
            console.log('Correct guess!'); // Display a message for correct guess
        } else {
            guessedLetters.push(guess); // Add the guessed letter to the array
            attempts--; // Decrement the number of attempts
            console.log('Incorrect guess.'); // Display a message for incorrect guess
        }

        if (word.split('').every(letter => guessedLetters.includes(letter))) { // Check if all letters have been guessed
            console.log(`Congratulations! You guessed the word: ${word}`); // Display a congratulatory message
            const playerName = readlineSync.question('Enter your name: '); // Prompt the user to enter their name
            const gameDuration = Math.floor((Date.now() - startTime) / 1000); // Calculate game duration in seconds
            saveScore(playerName, attempts, word, gameDuration, guessedLetters); // Save the player's score
            displayLeaderboard(); // Display the leaderboard
            await displayEndGameSummary(word, guessedLetters, attempts); // Display the end-game summary
            return; // End the game
        }
    }

    console.log(`Game over! The word was: ${word}`); // Display a game over message
    const gameDuration = Math.floor((Date.now() - startTime) / 1000); // Calculate game duration in seconds
    displayLeaderboard(); // Display the leaderboard
    await displayEndGameSummary(word, guessedLetters, attempts); // Display the end-game summary
}

module.exports = playGame;