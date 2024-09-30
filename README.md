# Hangman Game

## Description

A simple but scalable Node.js console Hangman game.

## How to Play

1. Run the game using `node index.js`.
2. Guess letters to reveal the hidden word.
3. You have 6 attempts to guess the word correctly.
4. Enter your name to save your score if you win.
5. After the game ends, you will be prompted to play again. Enter "yes" or "no" (or "y" or "n").

## Features

- Random word selection from a predefined list.
- Console-based user interface.
- Basic error handling for repeated guesses and invalid inputs.
- Enhanced display of the word and guessed letters with color coding and consistent spacing.
- **Mid-Game Summary**: Periodically displays the current game state, including the word display, guessed letters, and remaining attempts.
- **End-Game Summary**: Provides a detailed summary at the end of the game, including the final word, the player's guesses, and their score.
- **Leaderboard**: Top scores are saved and displayed from `hangman-nodejs_score.json`.
- **Visual Feedback**: Includes a simple ASCII art representation of the hangman that updates with each incorrect guess.
- **High Score Details**: Stores detailed information for each high score, including player name, score, date_time, word guessed, game duration, and guesses.
- **Replay Prompt**: Prompts the player to play again after the game ends, accepting "yes", "no", "y", and "n" as valid inputs.

## Future Enhancements

### Initial Setup

1. ~~**Basic Game Implementation**~~:
   - ~~Implement core game mechanics (word selection, letter guessing, win/loss conditions).~~
   - ~~Use a predefined list of words.~~
   - ~~Console-based user interface.~~

### ~~Phase 1: Basic Enhancements~~

1. ~~**Leaderboard**~~:
   - ~~Store and display top scores in a JSON file.~~
   - ~~Allow players to enter their names to save scores.~~

2. ~~**Error Handling**~~:
   - ~~Handle invalid inputs (e.g., non-alphabetic characters, multiple letters).~~
   - ~~Provide clear feedback for repeated guesses.~~

### Phase 2: User Experience Improvements

1. ~~**Enhanced Console Output**:~~
   - ~~Improve the display of the word and guessed letters.~~
   - ~~Add visual elements (e.g., hangman drawing) to represent remaining attempts.~~

2. **Difficulty Levels**:
   - Allow players to choose different difficulty levels (easy, medium, hard).
   - Adjust word length and number of attempts based on difficulty.

### Phase 3: Game Optimization

1. **Optimized Word List**:
   - Load words from an external file or API.
   - Implement caching to avoid repeated loading.

2. **Performance Optimization**:
   - Optimize game logic for efficiency.
   - Minimize redundant operations and improve data handling.

### Phase 4: Advanced Features

1. **Game Statistics**:
   - Track and display game statistics (e.g., total games played, win/loss ratio).
   - Store statistics in a JSON file.

### Phase 5: User Interface Enhancements

1. **Web Interface**:
    - Transition from console to a web-based interface using Node.js and Express.
    - Implement a simple front-end using HTML, CSS, and JavaScript.

2. **Mobile Compatibility**:
    - Ensure the web interface is mobile-friendly.
    - Consider creating a mobile app using frameworks like React Native.

### Phase 6: Additional Features

1. **Custom Word Lists**:
    - Allow players to create and use custom word lists.
    - Provide an option to share word lists with others.

2. **Hints and Clues**:
    - Implement a hint system to help players guess the word.
    - Provide clues based on word definitions or related words.

### Phase 7: Final Touches

1. **Polish and Refine**:
    - Refine the user interface for a polished look.
    - Conduct thorough testing to ensure all features work seamlessly.
    - Optimize code for readability and maintainability.

2. **Documentation**:
    - Update the README.md file to document all features and usage instructions.
    - Create a user manual or help section within the game.

<!-- MD047/single-trailing-newline -->
<!-- MD022/blanks-around-headings -->
<!-- MD029/ol-prefix -->