const readlineSync = require('readline-sync');

function promptPlayAgain() {
    while (true) {
        try {
            const answer = readlineSync.question('Do you want to play again? (yes/no): ').toLowerCase();
            if (answer === 'yes' || answer === 'y') {
                return true;
            } else if (answer === 'no' || answer === 'n') {
                return false;
            } else {
                console.log('Invalid input. Please enter "yes" or "no".');
            }
        } catch (error) {
            console.error('Error prompting play again:', error);
        }
    }
}

function getGuess() {
    try {
        return readlineSync.question('Guess a letter: ').toUpperCase();
    } catch (error) {
        console.error('Error getting guess:', error);
    }
}

function getPlayerName() {
    try {
        return readlineSync.question('Enter your name: ');
    } catch (error) {
        console.error('Error getting player name:', error);
    }
}

module.exports = {
    promptPlayAgain,
    getGuess,
    getPlayerName
};
