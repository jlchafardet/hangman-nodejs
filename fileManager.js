const fs = require('fs');
const path = require('path');

const SCORE_FILE = path.join(__dirname, 'hangman-nodejs_score.json');
const STATS_FILE = path.join(__dirname, 'hangman_stats.json');

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

function readStats() {
    try {
        if (!fs.existsSync(STATS_FILE)) {
            return { totalGames: 0, wins: 0, losses: 0 };
        }

        const data = fs.readFileSync(STATS_FILE);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading stats file:', error);
        return { totalGames: 0, wins: 0, losses: 0 };
    }
}

function saveStats(stats) {
    try {
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 4));
    } catch (error) {
        console.error('Error saving stats:', error);
    }
}

function displayStats() {
    const stats = readStats();
    console.log('Game Statistics:');
    console.log(`Total Games Played: ${stats.totalGames}`);
    console.log(`Wins: ${stats.wins}`);
    console.log(`Losses: ${stats.losses}`);
    console.log(`Win/Loss Ratio: ${(stats.wins / (stats.losses || 1)).toFixed(2)}`);
}

module.exports = {
    saveScore,
    displayLeaderboard,
    readStats,
    saveStats,
    displayStats
};