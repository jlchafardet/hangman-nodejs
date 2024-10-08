const { displayGameState, clearScreen, displayGuessedLetters } = require('./graphics');
const { promptPlayAgain, getGuess, getPlayerName } = require('./input');
const { saveScore, displayLeaderboard, readStats, saveStats, displayStats } = require('./fileManager');
const { getWords } = require('./wordList');

function getRandomWord() {
    const words = getWords();
    return words[Math.floor(Math.random() * words.length)].toUpperCase();
}

async function displayEndGameSummary(word, guessedLetters, attempts) {
    try {
        console.log(`\n--- End of Game Summary ---`);
        console.log(`Final Word: ${word}`);
        await displayGuessedLetters(word, guessedLetters); // Display the guessed letters
        console.log(`Remaining Attempts: ${attempts}`);
        console.log(`--------------------------\n`);
    } catch (error) {
        console.error('Error displaying end game summary:', error);
    }
}

async function playGame() {
    let word, guessedLetters, attempts;
    const stats = readStats();
    do {
        try {
            word = getRandomWord(); // Get a random word
            guessedLetters = new Set(); // Use a set to store guessed letters for O(1) lookup
            const wordLetters = new Set(word); // Use a set to store word letters for O(1) lookup
            attempts = 6; // Number of attempts
            const startTime = Date.now(); // Start time of the game

            while (attempts > 0) {
                clearScreen(); // Clear the console screen at the beginning of each turn
                await displayGameState(word, Array.from(guessedLetters), attempts); // Display the current game state
                const guess = getGuess(); // Prompt the user to guess a letter

                // Handle invalid inputs
                if (!/^[A-Z]$/.test(guess)) { // Check if the input is a single alphabetic character
                    console.log('Invalid input. Please enter a single alphabetic character.'); // Display an error message for invalid input
                    continue; // Continue to the next iteration without decrementing attempts
                }

                if (guessedLetters.has(guess)) { // Check if the letter has already been guessed
                    console.log('You already guessed that letter.'); // Display a message for repeated guess
                } else {
                    guessedLetters.add(guess); // Add the guessed letter to the set
                    if (wordLetters.has(guess)) { // Check if the guessed letter is in the word
                        console.log('Correct guess!'); // Display a message for correct guess
                    } else {
                        attempts--; // Decrement the number of attempts
                        console.log('Incorrect guess.'); // Display a message for incorrect guess
                    }
                }

                if (Array.from(wordLetters).every(letter => guessedLetters.has(letter))) { // Check if all letters have been guessed
                    clearScreen(); // Clear the screen before showing the final game state
                    await displayGameState(word, Array.from(guessedLetters), attempts, true); // Display the complete word
                    console.log(`Congratulations! You guessed the word: ${word}`); // Display a congratulatory message
                    const playerName = getPlayerName(); // Prompt the user to enter their name
                    const gameDuration = Math.floor((Date.now() - startTime) / 1000); // Calculate game duration in seconds
                    saveScore(playerName, attempts, word, gameDuration, Array.from(guessedLetters)); // Save the player's score
                    stats.wins++;
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
                stats.losses++;
                clearScreen(); // Clear the screen before showing the leaderboard
                displayLeaderboard(); // Display the leaderboard
            }

            stats.totalGames++;
            saveStats(stats); // Save the updated statistics
            clearScreen(); // Clear the screen before asking if the player wants to play again
        } catch (error) {
            console.error('Error during game loop:', error);
        }
    } while (promptPlayAgain()); // Prompt the player to play again

    // Display end-game summary and thank you message
    await displayEndGameSummary(word, Array.from(guessedLetters), attempts);
    console.log('Thank you for playing!'); // Display a thank you message
    displayStats(); // Display game statistics
}

module.exports = playGame;