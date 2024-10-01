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

async function displayWord(word, guessedLetters) {
    try {
        const chalk = (await import('chalk')).default; // Dynamically import chalk
        return word.split('').map(letter => guessedLetters.includes(letter) ? chalk.green(letter) : chalk.white('_')).join(' ');
    } catch (error) {
        console.error('Error displaying word:', error);
    }
}

async function displayGuessedLetters(word, guessedLetters) {
    try {
        const chalk = (await import('chalk')).default; // Dynamically import chalk
        const correctGuesses = guessedLetters.filter(letter => word.includes(letter));
        const incorrectGuesses = guessedLetters.filter(letter => !word.includes(letter));

        console.log(`Correct Guesses: ${chalk.green(correctGuesses.join(', '))}`);
        console.log(`Incorrect Guesses: ${chalk.red(incorrectGuesses.join(', '))}`);
    } catch (error) {
        console.error('Error displaying guessed letters:', error);
    }
}

async function displayGameState(word, guessedLetters, attempts, showCompleteWord = false) {
    try {
        const chalk = (await import('chalk')).default; // Dynamically import chalk
        console.log(hangmanStages[6 - attempts]); // Display the current hangman stage
        if (showCompleteWord) {
            console.log(`Word: ${word.split('').map(letter => chalk.green(letter)).join(' ')}`); // Display the complete word in green
        } else {
            console.log(`Word: ${await displayWord(word, guessedLetters)}`); // Display the word with guessed letters
        }
        await displayGuessedLetters(word, guessedLetters); // Display the guessed letters
        console.log(`Attempts left: ${attempts}`); // Display the number of attempts left
    } catch (error) {
        console.error('Error displaying game state:', error);
    }
}

function clearScreen() {
    console.clear();
}

module.exports = {
    displayGameState,
    clearScreen,
    displayGuessedLetters
};
