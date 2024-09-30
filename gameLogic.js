const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const words = require('./wordList');

const SCORE_FILE = path.join(__dirname, 'hangman-nodejs_score.json');

// Function to get a random word from the predefined list
function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

// Function to display the word with guessed letters
function displayWord(word, guessedLetters) {
    // Display each letter if guessed, otherwise display an underscore
    return word.split('').map(letter => guessedLetters.includes(letter) ? letter : '_').join(' ');
}

// Function to display guessed letters
function displayGuessedLetters(word, guessedLetters) {
    // Separate guessed letters into correct and incorrect guesses
    const correctGuesses = guessedLetters.filter(letter => word.includes(letter));
    const incorrectGuesses = guessedLetters.filter(letter => !word.includes(letter));

    console.log(`Correct Guesses: ${correctGuesses.join(', ')}`);
    console.log(`Incorrect Guesses: ${incorrectGuesses.join(', ')}`);
}

// Function to save the player's score to a JSON file
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
        console.log(`${index + 1}. ${score.playerName} - ${score.score} (${score.date})`);
    });
}

// Function to play the Hangman game
function playGame() {
    const word = getRandomWord(); // Get a random word
    let guessedLetters = []; // Array to store guessed letters
    let attempts = 6; // Number of attempts

    while (attempts > 0) {
        console.log(`Word: ${displayWord(word, guessedLetters)}`); // Display the word with guessed letters
        displayGuessedLetters(word, guessedLetters); // Display the guessed letters
        console.log(`Attempts left: ${attempts}`); // Display the number of attempts left
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
            saveScore(playerName, attempts); // Save the player's score
            displayLeaderboard(); // Display the leaderboard
            return; // End the game
        }
    }

    console.log(`Game over! The word was: ${word}`); // Display a game over message
    displayLeaderboard(); // Display the leaderboard
}

module.exports = playGame;