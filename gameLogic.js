const fs = require('fs');
const path = require('path');
const { displayGameState, clearScreen } = require('./graphics');
const { promptPlayAgain, getGuess, getPlayerName } = require('./input');
const words = require('./wordList');

const SCORE_FILE = path.join(__dirname, 'hangman-nodejs_score.json');

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

async function displayEndGameSummary(word, guessedLetters, attempts) {
    console.log(`\n--- End of Game Summary ---`);
    console.log(`Final Word: ${word}`);
    await displayGuessedLetters(word, guessedLetters); // Display the guessed letters
    console.log(`Remaining Attempts: ${attempts}`);
    console.log(`--------------------------\n`);
}

function saveScore(playerName, score, word, gameDuration, guesses = []) {
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
        try {
            const data = fs.readFileSync(SCORE_FILE);
            scores = JSON.parse(data);
        } catch (error) {
            console.error('Error reading or parsing score file:', error);
        }
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

    let scores = [];
    try {
        const data = fs.readFileSync(SCORE_FILE);
        scores = JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing score file:', error);
        return;
    }

    console.log('Leaderboard:');
    scores.slice(0, 5).forEach((score, index) => {
        console.log(`${index + 1}. ${score.playerName} - ${score.score} (${score.date_time})`);
        console.log(`   Word Guessed: ${score.word_guessed}`);
        console.log(`   Game Duration: ${score.game_duration} seconds`);
        console.log(`   Guesses: ${score.guesses ? score.guesses.join(', ') : 'N/A'}`);
    });
}

async function playGame() {
    let word, guessedLetters, attempts;
    do {
        word = getRandomWord(); // Get a random word
        guessedLetters = []; // Array to store guessed letters
        attempts = 6; // Number of attempts
        const startTime = Date.now(); // Start time of the game

        while (attempts > 0) {
            clearScreen(); // Clear the console screen at the beginning of each turn
            await displayGameState(word, guessedLetters, attempts); // Display the current game state
            const guess = getGuess(); // Prompt the user to guess a letter

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
                clearScreen(); // Clear the screen before showing the final game state
                await displayGameState(word, guessedLetters, attempts, true); // Display the complete word
                console.log(`Congratulations! You guessed the word: ${word}`); // Display a congratulatory message
                const playerName = getPlayerName(); // Prompt the user to enter their name
                const gameDuration = Math.floor((Date.now() - startTime) / 1000); // Calculate game duration in seconds
                saveScore(playerName, attempts, word, gameDuration, guessedLetters); // Save the player's score
                clearScreen(); // Clear the screen before showing the leaderboard
                console.log(`Current Game Score: ${attempts}`);
                console.log('==========================');
                displayLeaderboard(); // Display the leaderboard
                break; // End the game loop
            }
        }

        if (attempts === 0) {
            console.log(`Game over! The word was: ${word}`); // Display a game over message
            const gameDuration = Math.floor((Date.now() - startTime) / 1000); // Calculate game duration in seconds
            clearScreen(); // Clear the screen before showing the leaderboard
            displayLeaderboard(); // Display the leaderboard
        }

        clearScreen(); // Clear the screen before asking if the player wants to play again
    } while (promptPlayAgain()); // Prompt the player to play again

    // Display end-game summary and thank you message
    await displayEndGameSummary(word, guessedLetters, attempts);
    console.log('Thank you for playing!'); // Display a thank you message
}

module.exports = playGame;