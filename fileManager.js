const fs = require('fs');
const path = require('path');

const SCORE_FILE = path.join(__dirname, 'hangman-nodejs_score.json');

function saveScore(playerName, score, word, gameDuration, guesses = []) {
    try {
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
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

function displayLeaderboard() {
    try {
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
    } catch (error) {
        console.error('Error displaying leaderboard:', error);
    }
}

module.exports = {
    saveScore,
    displayLeaderboard
};
