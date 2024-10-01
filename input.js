const readlineSync = require('readline-sync');

function promptPlayAgain() {
    while (true) {
        const answer = readlineSync.question('Do you want to play again? (yes/no): ').toLowerCase();
        if (answer === 'yes' || answer === 'y') {
            return true;
        } else if (answer === 'no' || answer === 'n') {
            return false;
        } else {
            console.log('Invalid input. Please enter "yes" or "no".');
        }
    }
}

function getGuess() {
    return readlineSync.question('Guess a letter: ').toUpperCase();
}

function getPlayerName() {
    return readlineSync.question('Enter your name: ');
}

module.exports = {
    promptPlayAgain,
    getGuess,
    getPlayerName
};
