// play section variables
let play = document.getElementById("play");
let playButton = document.getElementById("playButton");

// input section variables

let input = document.getElementById("input");
let userName = document.getElementById("userName");
let petName = document.getElementById("petName");
let petType = document.getElementById("petType");
let savingsGoal = document.getElementById("savingsGoal")
let submitInputs = document.getElementById("submitInputs");

// game section variables
let game = document.getElementById("game");

let hungerStats = document.getElementById("hungerStats");
let hunger = 0;

let happinessStats = document.getElementById("happinessStats");
let happiness = 100;

let energyStats = document.getElementById("energyStats");
let energy = 100;

let cleanlinessStats = document.getElementById("cleanlinessStats");
let cleanliness = 100;

let healthStats = document.getElementById("healthStats");
let health = 100;

let ageStats = document.getElementById("ageStats");
let age = 0;

let userNameDisplay = document.getElementById("userNameDisplay");
let petNameDisplay = document.getElementById("petNameDisplay");
let moneySaved = document.getElementById("moneySaved");
let goal = document.getElementById("goal");

// Pet emoji map by type
const petEmojis = {
    'Dog': '🐕',
    'Cat': '🐈',
    'Rabbit': '🐰',
    'Turtle': '🐢',
    'Bird': '🐦'
};

// ========================= AGING SYSTEM =========================
// Step 1: Define Life Stages
const petLifeStages = {
    baby: { min: 0, max: 4, label: 'Baby' },
    young: { min: 5, max: 9, label: 'Young' },
    adult: { min: 10, max: 19, label: 'Adult' },
    senior: { min: 20, max: 100, label: 'Senior' }
};

function getPetLifeStage() {
    for (const [key, stage] of Object.entries(petLifeStages)) {
        if (age >= stage.min && age <= stage.max) {
            return stage;
        }
    }
    return petLifeStages.adult;
}

// Step 2: Pet Type-Specific Emojis for Each Life Stage
const petStageEmojis = {
    'Dog': {
        'Baby': 'images/pets/dog-baby.png',
        'Young': 'images/pets/dog-young.png',
        'Adult': 'images/pets/dog-adult.png',
        'Senior': 'images/pets/dog-senior.png'
    },
    'Cat': {
        'Baby': '🐱',
        'Young': '🐈',
        'Adult': '🐈‍⬛',
        'Senior': '🐈'
    },
    'Rabbit': {
        'Baby': '🐰',
        'Young': '🐇',
        'Adult': '🐰',
        'Senior': '🐇'
    },
    'Turtle': {
        'Baby': '🥚',
        'Young': '🐢',
        'Adult': '🐢',
        'Senior': '🐢'
    },
    'Bird': {
        'Baby': '🐣',
        'Young': '🐦',
        'Adult': '🦅',
        'Senior': '🐦'
    }
};

// ========== DIFFICULTY SETTINGS ==========
const DIFFICULTY_SETTINGS = {
    easy: {
        hungerRate: 1,
        energyRate: 0.5,
        happinessRate: 0.5,
        cleanlinessRate: 0.25,
        healthDamage: 2
    },
    normal: {
        hungerRate: 2,
        energyRate: 1,
        happinessRate: 1,
        cleanlinessRate: 0.5,
        healthDamage: 3
    },
    hard: {
        hungerRate: 3,
        energyRate: 1.5,
        happinessRate: 1.5,
        cleanlinessRate: 1,
        healthDamage: 4
    }
};

// Default to normal, will be set by user
let currentDifficulty = DIFFICULTY_SETTINGS.normal;

// ADDED: Game state tracking
let gameOver = false;

// Step 3: Track Which Life Stage Was Last Logged
let lastLoggedStage = 'Baby';

let money = 10;

// Track expenses by category
let expenses = {
    food: 0,
    healthcare: 0,
    hygiene: 0,
    entertainment: 0
};


// Step 4: Get Emoji for Pet's Current Type and Life Stage
function getPetStageEmoji() {
    const currentStage = getPetLifeStage();
    const petTypeVal = petType.value;
    
    const emoji = petStageEmojis[petTypeVal] && petStageEmojis[petTypeVal][currentStage.label];
    
    return emoji || '🐾';
}

// Step 6: Check if pet moved to new life stage and log milestone
function checkLifeStageMilestone() {
    const currentStage = getPetLifeStage();
    if (currentStage.label !== lastLoggedStage) {
        lastLoggedStage = currentStage.label;
        log(`🎉 Your pet is now a ${currentStage.label}!`);
    }
}

// Step 7: Check if pet has passed away
function checkPetHealth() {
    // Pet passes away if very old AND very unhealthy
    if (age >= 100 && health <= 10 && !gameOver) {
        gameOver = true;  // ADDED: Set flag to true ONCE
        
        // ADDED: Stop decay timer
        if (window.gameDecayInterval) {
            clearInterval(window.gameDecayInterval);
            window.gameDecayInterval = null;
        }
        
        // Disable all action buttons (get fresh references)
        const feedBtn = document.getElementById("feedBtn");
        const playBtn = document.getElementById("playBtn");
        const restBtn = document.getElementById("restBtn");
        const cleanBtn = document.getElementById("cleanBtn");
        const vetBtn = document.getElementById("vetBtn");
        const choresBtn = document.getElementById("choresBtn");
        
        if (feedBtn) feedBtn.disabled = true;
        if (playBtn) playBtn.disabled = true;
        if (restBtn) restBtn.disabled = true;
        if (cleanBtn) cleanBtn.disabled = true;
        if (vetBtn) vetBtn.disabled = true;
        if (choresBtn) choresBtn.disabled = true;
        
        // ADDED: Display tombstone emoji when pet dies
        const petEmojiEl = document.getElementById('petEmoji');
        if (petEmojiEl) {
            petEmojiEl.innerHTML = '<p style="font-size: 80px; margin: 5px 0;">🪦</p>';
        }
        
        // ADDED: Update pet display info when pet dies
        const petTypeDisplay = document.getElementById('petTypeDisplay');
        const petStatusEl = document.getElementById('petStatus');
        const emotionEmojiEl = document.getElementById('emotionEmoji');
        
        if (petTypeDisplay) {
            petTypeDisplay.textContent = `${petType.value} (Deceased)`;
        }
        
        // Convert age from days to years
        const ageInYears = (age / 365).toFixed(1);
        if (petStatusEl) {
            petStatusEl.textContent = `Lived for ${age} days (${ageInYears} years)`;
        }
        
        if (emotionEmojiEl) {
            emotionEmojiEl.textContent = '🕊️';
        }
        
        log('😢 Your beloved pet has passed away. Game Over.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    playButton.onclick = function() {
        // Try to load saved game state and optionally resume
        const savedState = loadGame();
        if (savedState) {
            const continueGame = confirm('Found a saved game! Continue where you left off?');
            if (continueGame) {
                applyLoadedState(savedState);

                // Show game screen
                play.classList.add('hide');
                input.classList.add('hide');
                game.classList.remove('hide');
                game.classList.add('show');

                // Update headers from restored inputs
                userNameDisplay.textContent = "Hello, " + (userName.value || '').trim();
                petNameDisplay.textContent = (petName.value || '').trim();

                // Refresh stats and reaction
                updateStats();

                // ADDED: Start passive decay timer for continued game
                const decayInterval = setInterval(applyPassiveDecay, 5000);
                window.gameDecayInterval = decayInterval;
            } else {
                // Ensure inputs remain blank when not continuing
                userName.value = '';
                petName.value = '';
                petType.value = '';
                savingsGoal.value = '';
                
                // Show input screen
                play.classList.add('hide');
                input.classList.remove('hide');
                input.classList.add('show');
            }
        } else {
            // No saved game, just show input screen
            play.classList.add('hide');
            input.classList.remove('hide');
            input.classList.add('show');
        }
    };

    // Validation helpers and submit handling
    submitInputs.onclick = function() {
        if (!validateInputs()) {
            // Focus the first invalid field for convenience
            const invalid = document.querySelector('.error');
            if (invalid) invalid.focus();
            return;
        }

        userNameDisplay.textContent = "Hello, " + userName.value.trim();
        petNameDisplay.textContent = petName.value.trim();

        // ADDED: Set difficulty based on user selection
        currentDifficulty = DIFFICULTY_SETTINGS[document.getElementById('difficulty').value];

        let percent = Math.floor((money / parseFloat(savingsGoal.value)) * 100);
        moneySaved.textContent = "Money saved: $" + money;
        goal.textContent = "Goal: $" + savingsGoal.value + " (" + percent + "%)";

        input.classList.remove('show');
        input.classList.add('hide');
        game.classList.remove('hide');
        game.classList.add('show');

        hungerStats.textContent = "Hunger: " + hunger + "%";
        happinessStats.textContent = "Happiness: " + happiness + "%";
        energyStats.textContent = "Energy: " + energy + "%";
        cleanlinessStats.textContent = "Cleanliness: " + cleanliness + "%";
        healthStats.textContent = "Health: " + health + "%";
        ageStats.textContent = "Age: " + age + " days";

        updatePetReaction();

        // Save initial state after starting the game
        saveGame();

        // Start passive decay timer every 5 seconds
        const decayInterval = setInterval(applyPassiveDecay, 5000);
        window.gameDecayInterval = decayInterval;
    }

    // Setup action buttons (must be inside DOMContentLoaded for null safety)
    let feedBtn = document.getElementById("feedBtn");
    let playBtn = document.getElementById("playBtn");
    let restBtn = document.getElementById("restBtn");
    let cleanBtn = document.getElementById("cleanBtn");
    let vetBtn = document.getElementById("vetBtn");
    let choresBtn = document.getElementById("choresBtn");
    let logArea = document.getElementById("logArea");

    // ADDED: Help screen functionality
    let helpFromPlayBtn = document.getElementById('helpFromPlayBtn');
    let helpFromGameBtn = document.getElementById('helpFromGameBtn');
    let closeHelpBtn = document.getElementById('closeHelpBtn');
    let helpReturnTo = 'play';

    if (helpFromPlayBtn) {
        helpFromPlayBtn.onclick = function() {
            helpReturnTo = 'play';
            play.classList.add('hide');
            help.classList.remove('hide');
            help.classList.add('show');
        };
    }

    if (helpFromGameBtn) {
        helpFromGameBtn.onclick = function() {
            helpReturnTo = 'game';
            game.classList.add('hide');
            help.classList.remove('hide');
            help.classList.add('show');
        };
    }

    if (closeHelpBtn) {
        closeHelpBtn.onclick = function() {
            help.classList.remove('show');
            help.classList.add('hide');
            if (helpReturnTo === 'play') {
                play.classList.remove('hide');
                play.classList.add('show');
            } else {
                game.classList.remove('hide');
                game.classList.add('show');
            }
        };
    }

    // Wire up action buttons
    if (feedBtn) {
        feedBtn.onclick = function() {
            if (money >= 5) {
                money -= 5;
                expenses.food += 5;
                hunger = Math.max(0, hunger - 20);
                happiness += 5;
                log("You fed your pet. -$5");
            } else {
                log("Not enough money to feed your pet.");
            }
            updateStats();
        };
    }

    if (playBtn) {
        playBtn.onclick = function() {
            if (money >= 2) {
                money -= 2;
                expenses.entertainment += 2;
                happiness += 15;
                energy -= 10;
                log("You played with your pet. -$2");
            } else {
                log("Not enough money to play.");
            }
            updateStats();
        };
    }

    if (restBtn) {
        restBtn.onclick = function() {
            energy = Math.min(100, energy + 20);
            happiness -= 5;
            log("Your pet took a rest.");
            updateStats();
        };
    }

    if (cleanBtn) {
        cleanBtn.onclick = function() {
            if (money >= 2) {
                money -= 2;
                expenses.hygiene += 2;
                cleanliness = Math.min(100, cleanliness + 15);
                happiness += 3;
                log("You cleaned your pet. -$2");
            } else {
                log("Not enough money to clean your pet.");
            }
            updateStats();
        };
    }

    if (vetBtn) {
        vetBtn.onclick = function() {
            if (money >= 20) {
                money -= 20;
                expenses.healthcare += 20;
                health = Math.min(100, health + 40);
                happiness += 5;
                log("You visited the vet. -$20");
            } else {
                log("Not enough money for a vet visit");
            }
            updateStats();
        };
    }

    // Chores button with cooldown
    let choresCooldown = false;
    if (choresBtn) {
        choresBtn.onclick = function() {
            if (choresCooldown) {
                log("Chores are on cooldown. Try again soon!");
                return;
            }

            money += 10;
            happiness += 3;
            log("You did your chores. +$10");
            updateStats();

            choresCooldown = true;
            choresBtn.disabled = true;

            let timeLeft = 60;
            choresBtn.textContent = `Chores (${timeLeft}s)`;

            let timer = setInterval(() => {
                timeLeft--;
                choresBtn.textContent = `Chores (${timeLeft}s)`;

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    choresCooldown = false;
                    choresBtn.disabled = false;
                    choresBtn.textContent = "Chores (+$10)";
                }
            }, 1000);
        };
    }

    // Wire up reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.onclick = resetGame;
    }
    
    // Wire up report buttons
    const viewReportBtn = document.getElementById('viewReportBtn');
    const backToGameBtn = document.getElementById('backToGameBtn');
    
    if (viewReportBtn) {
        viewReportBtn.onclick = showReport;
    }
    if (backToGameBtn) {
        backToGameBtn.onclick = hideReport;
    }

});

// ----------------------------- VALIDATION HELPERS -----------------------
function showError(inputElement, errorElement, message) {
    inputElement.classList.add('error');
    errorElement.textContent = message;
}

function clearError(inputElement, errorElement) {
    inputElement.classList.remove('error');
    errorElement.textContent = '';
}

function validateInputs() {
    const userNameError = document.getElementById('userNameError');
    const petNameError = document.getElementById('petNameError');
    const petTypeError = document.getElementById('petTypeError');
    const savingsGoalError = document.getElementById('savingsGoalError');

    // Clear previous errors
    clearError(userName, userNameError);
    clearError(petName, petNameError);
    clearError(petType, petTypeError);
    clearError(savingsGoal, savingsGoalError);

    let isValid = true;

    const nameVal = userName.value.trim();
    if (nameVal === '') {
        showError(userName, userNameError, 'Name is required');
        isValid = false;
    } else if (nameVal.length > 24) {
        showError(userName, userNameError, 'Name must be 24 characters or less');
        isValid = false;
    }

    const petVal = petName.value.trim();
    if (petVal === '') {
        showError(petName, petNameError, 'Pet name is required');
        isValid = false;
    } else if (petVal.length > 24) {
        showError(petName, petNameError, 'Pet name must be 24 characters or less');
        isValid = false;
    }

    if (petType.value === '') {
        showError(petType, petTypeError, 'Please select a pet type');
        isValid = false;
    }

    const goalVal = parseFloat(savingsGoal.value);
    if (savingsGoal.value === '' || isNaN(goalVal)) {
        showError(savingsGoal, savingsGoalError, 'Savings goal must be a number');
        isValid = false;
    } else if (goalVal < 1) {
        showError(savingsGoal, savingsGoalError, 'Goal must be at least $1');
        isValid = false;
    } else if (goalVal > 1000000) {
        showError(savingsGoal, savingsGoalError, 'Goal must be less than $1,000,000');
        isValid = false;
    }

    return isValid;
}

// ----------------------------- PERSISTENCE (localStorage) -----------------------
// Step 10: Save lastLoggedStage to persistence
function saveGame() {
    const gameState = {
        userName: userName.value,
        petName: petName.value,
        petType: petType.value,
        savingsGoal: savingsGoal.value,
        money: money,
        hunger: hunger,
        happiness: happiness,
        energy: energy,
        cleanliness: cleanliness,
        health: health,
        age: age,
        lastLoggedStage: lastLoggedStage,
        difficulty: document.getElementById('difficulty').value,  // ADDED: Save difficulty setting
        expenses: expenses
    };
    try {
        localStorage.setItem('petGameState', JSON.stringify(gameState));
    } catch (e) {
        console.warn('Could not save game state:', e);
    }
}

// Load WITHOUT applying; return parsed state or null
function loadGame() {
    try {
        const raw = localStorage.getItem('petGameState');
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        console.warn('Could not load game state:', e);
        return null;
    }
}

// Reset the game to initial state and clear persistence
// Step 12: Reset age and milestone tracking
function resetGame() {
    const sure = confirm('Reset the game and delete saved progress?');
    if (!sure) return;

    // 1) Remove saved state so resume prompt won’t appear
    try { localStorage.removeItem('petGameState'); } catch (_) {}

    // 2) Reset stats to initial values
    money = 10;
    hunger = 0;
    happiness = 100;
    energy = 100;
    cleanliness = 100;
    health = 100;
    age = 0;  // RESET AGE
    lastLoggedStage = 'Baby';  // RESET MILESTONE (Capital B)
    gameOver = false;  // ADDED: Reset game over flag
    
    // Reset expenses
    expenses = {
        food: 0,
        healthcare: 0,
        hygiene: 0,
        entertainment: 0
    };

    // 3) Clear inputs
    userName.value = '';
    petName.value = '';
    petType.value = '';
    savingsGoal.value = '';

    // 4) Clear validation UI (if any)
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

    // 5) Clear log and re-enable all buttons
    const logArea = document.getElementById("logArea");
    if (logArea) logArea.innerHTML = '';
    
    // Re-enable all action buttons (get fresh references)
    const feedBtn = document.getElementById("feedBtn");
    const playBtn = document.getElementById("playBtn");
    const restBtn = document.getElementById("restBtn");
    const cleanBtn = document.getElementById("cleanBtn");
    const vetBtn = document.getElementById("vetBtn");
    const choresBtn = document.getElementById("choresBtn");
    
    if (feedBtn) feedBtn.disabled = false;
    if (playBtn) playBtn.disabled = false;
    if (restBtn) restBtn.disabled = false;
    if (cleanBtn) cleanBtn.disabled = false;
    if (vetBtn) vetBtn.disabled = false;
    if (choresBtn) {
        choresBtn.disabled = false;
        choresBtn.textContent = 'Chores (+$10)';
    }

    // 6) Reset pet reaction display
    const petReactionDiv = document.getElementById('petReaction');
    if (petReactionDiv) {
        petReactionDiv.className = '';
        const petEmojiEl = document.getElementById('petEmoji');
        const emotionEmojiEl = document.getElementById('emotionEmoji');
        const petTypeDisplay = document.getElementById('petTypeDisplay');
        const petStatusEl = document.getElementById('petStatus');
        if (petEmojiEl) petEmojiEl.textContent = '🐾';
        if (emotionEmojiEl) emotionEmojiEl.textContent = '🙂';
        if (petTypeDisplay) petTypeDisplay.textContent = '';
        if (petStatusEl) petStatusEl.textContent = 'Your pet is okay.';
    }

    // 6) Switch screens: hide game, show start screen
    game.classList.remove('show'); game.classList.add('hide');
    input.classList.remove('show'); input.classList.add('hide');
    play.classList.remove('hide');
    
    // Stop decay timer if running
    if (window.gameDecayInterval) {
        clearInterval(window.gameDecayInterval);
        window.gameDecayInterval = null;
    }
}

// ----------------------------- PASSIVE STAT DECAY -----------------------
// Step 8: Age increments every decay cycle
function applyPassiveDecay() {
    // ADDED: Don't decay stats if game is over
    if (gameOver) return;
    
    // CHANGED: Use difficulty settings for stat degradation rates
    // Hunger increases naturally over time (pet gets hungrier)
    hunger = Math.min(100, hunger + currentDifficulty.hungerRate);

    // Energy slightly decreases (pet gets tired)
    energy = Math.max(0, energy - currentDifficulty.energyRate);

    // Happiness slightly decreases if not interacting (pet gets bored)
    happiness = Math.max(0, happiness - currentDifficulty.happinessRate);

    // Cleanliness decreases slowly (pet gets dirty)
    cleanliness = Math.max(0, cleanliness - currentDifficulty.cleanlinessRate);

    // Health decreases if conditions are bad (consequences for neglect)
    if (hunger >= 85 || energy <= 15 || happiness <= 20 || cleanliness <= 20) {
        health = Math.max(0, health - currentDifficulty.healthDamage);
    }

    // Increment age (1 day per decay cycle, every 5 seconds)
    age += 1;

    // Update UI and check emotions
    updateStats();
}

// ----------------------------- BUDGET REPORT -----------------------
function updateBudgetReport() {
    const totalSpent = expenses.food + expenses.healthcare + expenses.hygiene + expenses.entertainment;
    const totalEarned = (money + totalSpent) - 10;
    
    document.getElementById('totalSpent').textContent = `Total Spent: $${totalSpent}`;
    document.getElementById('earnedAmount').textContent = totalEarned;
    
    updateCategoryDisplay('food', expenses.food, totalSpent);
    updateCategoryDisplay('healthcare', expenses.healthcare, totalSpent);
    updateCategoryDisplay('hygiene', expenses.hygiene, totalSpent);
    updateCategoryDisplay('entertainment', expenses.entertainment, totalSpent);
}

function updateCategoryDisplay(category, amount, total) {
    const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
    document.getElementById(`${category}Amount`).textContent = `$${amount}`;
    document.getElementById(`${category}Percent`).textContent = percent;
    document.getElementById(`${category}Bar`).style.width = `${percent}%`;
}

function showReport() {
    updateBudgetReport();
    const report = document.getElementById('report');
    // Hide game, show report
    game.classList.remove('show');
    game.classList.add('hide');
    report.classList.remove('hide');
    report.classList.add('show');
}

function hideReport() {
    const report = document.getElementById('report');
    // Hide report, show game
    report.classList.remove('show');
    report.classList.add('hide');
    game.classList.remove('hide');
    game.classList.add('show');
}

// Apply a previously loaded state to inputs and stats
// Step 11: Restore lastLoggedStage
function applyLoadedState(s) {
    // Inputs
    userName.value = s.userName || '';
    petName.value = s.petName || '';
    petType.value = s.petType || '';
    savingsGoal.value = s.savingsGoal || '';

    // Stats
    money = typeof s.money === 'number' ? s.money : 10;
    hunger = typeof s.hunger === 'number' ? s.hunger : 0;
    happiness = typeof s.happiness === 'number' ? s.happiness : 100;
    energy = typeof s.energy === 'number' ? s.energy : 100;
    cleanliness = typeof s.cleanliness === 'number' ? s.cleanliness : 100;
    health = typeof s.health === 'number' ? s.health : 100;
    age = typeof s.age === 'number' ? s.age : 0;
    // ADDED: Restore milestone tracking (Capital B for 'Baby')
    lastLoggedStage = typeof s.lastLoggedStage === 'string' ? s.lastLoggedStage : 'Baby';
    
    // Restore expenses
    if (s.expenses) {
        expenses.food = s.expenses.food || 0;
        expenses.healthcare = s.expenses.healthcare || 0;
        expenses.hygiene = s.expenses.hygiene || 0;
        expenses.entertainment = s.expenses.entertainment || 0;
    }

    // ADDED: Restore difficulty setting
    const difficultyDropdown = document.getElementById('difficulty');
    if (difficultyDropdown && s.difficulty) {
        difficultyDropdown.value = s.difficulty;
        currentDifficulty = DIFFICULTY_SETTINGS[s.difficulty];
    }
}

// -------------------------------------- PET REACTIONS -----------------------------------
function getPetEmotion() {
    if (health <= 30) {
        return { emotion: 'sick', emoji: '🤒', status: 'Your pet is very sick!' };
    }
    if (hunger >= 80) {
        return { emotion: 'hungry', emoji: '😫', status: 'Your pet is starving!' };
    }
    if (energy <= 20) {
        return { emotion: 'tired', emoji: '😴', status: 'Your pet is exhausted.' };
    }
    if (happiness <= 40 || health <= 40) {
        return { emotion: 'sad', emoji: '😢', status: 'Your pet is sad.' };
    }
    if (energy >= 85 && happiness >= 75) {
        return { emotion: 'energetic', emoji: '🤩', status: 'Your pet is full of energy!' };
    }
    if (happiness >= 80 && energy >= 70 && hunger <= 30) {
        return { emotion: 'happy', emoji: '😊', status: 'Your pet is very happy!' };
    }
    return { emotion: 'neutral', emoji: '🙂', status: 'Your pet is okay.' };
}

// Step 5: Updated to use stage-specific emoji
function updatePetReaction() {
    const petReactionDiv = document.getElementById('petReaction');
    const petEmojiEl = document.getElementById('petEmoji');
    const emotionEmojiEl = document.getElementById('emotionEmoji');
    const petTypeDisplay = document.getElementById('petTypeDisplay');
    const petStatusEl = document.getElementById('petStatus');

    if (!petReactionDiv) return;

    const reaction = getPetEmotion();
    const lifeStage = getPetLifeStage();

    // CHANGED: Display pet - use image for dog, emoji for others
    let petImagePath = getPetStageEmoji();
    if (petImagePath.endsWith('.png')) {
        // It's an image path, display as img tag
        petEmojiEl.innerHTML = `<img src="${petImagePath}" alt="Pet Image" style="width: 150px; height: 150px; object-fit: contain;">`;
    } else {
        // It's an emoji, display as text
        petEmojiEl.textContent = petImagePath;
    }
    
    emotionEmojiEl.textContent = reaction.emoji;
    // CHANGED: Now shows pet type + life stage
    petTypeDisplay.textContent = `${petType.value} (${lifeStage.label})`;
    petStatusEl.textContent = reaction.status;

    // Reset and apply emotion class for background color
    petReactionDiv.className = '';
    petReactionDiv.classList.add(reaction.emotion);
}

// ----------------------------- UPDATE ALL STATS ON SCREEN -----------------------
// Step 9: Updated to call milestone and health checks
function updateStats() {
    hungerStats.textContent = "Hunger: " + hunger + "%";
    happinessStats.textContent = "Happiness: " + happiness + "%";
    energyStats.textContent = "Energy: " + energy + "%";
    cleanlinessStats.textContent = "Cleanliness: " + cleanliness + "%";
    healthStats.textContent = "Health: " + health + "%";
    // CHANGED: Display age in days instead of years
    ageStats.textContent = "Age: " + age + " days";
    
    
    let percent = Math.floor((money / parseInt(savingsGoal.value)) * 100);
    moneySaved.textContent = "money saved: $" + money;
    goal.textContent = "Goal: $" + savingsGoal.value + " (" + percent + "%)";

    updatePetReaction();

    // Persist state after each stats refresh
    saveGame();
    
    // CHANGED: Check for life stage milestones and pet health only if game is active
    if (!gameOver) {
        checkLifeStageMilestone();
        checkPetHealth();
    }
}

function log(message) {
    const logArea = document.getElementById("logArea");
    if (logArea) {
        let entry = document.createElement("p");
        entry.textContent = message;
        logArea.appendChild(entry);
        logArea.scrollTop = logArea.scrollHeight;
    }
}