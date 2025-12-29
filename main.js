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

let money = 10;



document.addEventListener('DOMContentLoaded', function() {
    playButton.onclick = function() {
        play.classList.add('hide');
        input.classList.remove('hide');
        input.classList.add('show');
    };

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
        } else {
            // Ensure inputs remain blank when not continuing
            userName.value = '';
            petName.value = '';
            petType.value = '';
            savingsGoal.value = '';
        }
    }

    // Validation helpers and submit handling
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

    submitInputs.onclick = function() {
        if (!validateInputs()) {
            // Focus the first invalid field for convenience
            const invalid = document.querySelector('.error');
            if (invalid) invalid.focus();
            return;
        }

        userNameDisplay.textContent = "Hello, " + userName.value.trim();
        petNameDisplay.textContent = petName.value.trim();

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
        ageStats.textContent = "Age: " + age + " years";

        updatePetReaction();

        // Save initial state after starting the game
        saveGame();

        // Start passive decay timer every 5 seconds
        const decayInterval = setInterval(applyPassiveDecay, 5000);
        window.gameDecayInterval = decayInterval;
    }

    // Wire up reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.onclick = resetGame;
    }

});
//-------------------------------- ACTION BUTTON VARIABLE ---------------------------
let feedBtn = document.getElementById("feedBtn");
let playBtn = document.getElementById("playBtn");
let restBtn = document.getElementById("restBtn");
let cleanBtn = document.getElementById("cleanBtn");
let vetBtn = document.getElementById("vetBtn");
let choresBtn = document.getElementById("choresBtn");

let logArea = document.getElementById("logArea");

// ----------------------------- PERSISTENCE (localStorage) -----------------------
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
        age: age
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
    age = 0;

    // 3) Clear inputs
    userName.value = '';
    petName.value = '';
    petType.value = '';
    savingsGoal.value = '';

    // 4) Clear validation UI (if any)
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

    // 5) Clear log and reset dynamic button labels if needed
    if (logArea) logArea.innerHTML = '';
    if (typeof choresBtn !== 'undefined' && choresBtn) {
        choresBtn.disabled = false;
        choresBtn.textContent = 'Chores (+$10)';
    }

    // Optionally reset reaction panel visuals
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
function applyPassiveDecay() {
    // Hunger increases naturally over time (pet gets hungrier)
    hunger = Math.min(100, hunger + 2);

    // Energy slightly decreases (pet gets tired)
    energy = Math.max(0, energy - 1);

    // Happiness slightly decreases if not interacting (pet gets bored)
    happiness = Math.max(0, happiness - 1);

    // Cleanliness decreases slowly (pet gets dirty)
    cleanliness = Math.max(0, cleanliness - 0.5);

    // Health decreases if conditions are bad (consequences for neglect)
    if (hunger >= 85 || energy <= 15 || happiness <= 20 || cleanliness <= 20) {
        health = Math.max(0, health - 3);
    }

    // Update UI and check emotions
    updateStats();
}

// Apply a previously loaded state to inputs and stats
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

function updatePetReaction() {
    const petReactionDiv = document.getElementById('petReaction');
    const petEmojiEl = document.getElementById('petEmoji');
    const emotionEmojiEl = document.getElementById('emotionEmoji');
    const petTypeDisplay = document.getElementById('petTypeDisplay');
    const petStatusEl = document.getElementById('petStatus');

    if (!petReactionDiv) return;

    const reaction = getPetEmotion();

    // Set pet type emoji (big)
    petEmojiEl.textContent = petEmojis[petType.value] || '🐾';
    // Set emotion emoji (badge)
    emotionEmojiEl.textContent = reaction.emoji;
    // Set pet type text
    petTypeDisplay.textContent = petType.value;
    // Set status message
    petStatusEl.textContent = reaction.status;

    // Reset and apply emotion class for background color
    petReactionDiv.className = '';
    petReactionDiv.classList.add(reaction.emotion);
}

// ----------------------------- UPDATE ALL STATS ON SCREEN -----------------------

function updateStats() {
    hungerStats.textContent = "Hunger: " + hunger + "%";
    happinessStats.textContent = "Happiness: " + happiness + "%";
    energyStats.textContent = "Energy: " + energy + "%";
    cleanlinessStats.textContent = "Cleanliness: " + cleanliness + "%";
    healthStats.textContent = "Health: " + health + "%";
    ageStats.textContent = "Age: " + age + " years";
    
    
    let percent = Math.floor((money / parseInt(savingsGoal.value)) * 100);
    moneySaved.textContent = "money saved: $" + money;
    goal.textContent = "Goal: $" + savingsGoal.value + " (" + percent + "%)";

    updatePetReaction();

    // Persist state after each stats refresh
    saveGame();
}

function log(message) {
    let entry = document.createElement("p");
    entry.textContent = message;
    logArea.appendChild(entry);
    logArea.scrollTop = logArea.scrollHeight;
}

// -------------------------------------- ACTIONS -----------------------------------

feedBtn.onclick = function() {
    if (money >= 5) {
        money -= 5;
        hunger = Math.max(0, hunger - 20);
        happiness += 5;
        log("You fed your pet. -$5");
    } else {
        log("Not enough money to feed your pet.");
    }
    updateStats();
};

playBtn.onclick = function() {
    if (money >= 2) {
        money -= 2;
        happiness += 15;
        energy -= 10;
        log("You played with your pet. -$2");
    } else {
        log("Not enough money to play.");
    }

    updateStats();
}

restBtn.onclick = function() {
    energy = Math.min(100, energy + 20);
    happiness -= 5;
    log("Your pet took a rest.");
    updateStats();
}

cleanBtn.onclick = function() {
    if (money >= 2) {
        money -= 2;
        happiness += 3;
        log("You cleaned your pet. -$2");
    } else {
        log("Not enough money to clean your pet.");
    }

    updateStats();
}

vetBtn.onclick = function() {
    if (money >= 20) {
        money -= 20;
        happiness = Math.min(100, health + 40);
        cleanliness += 10;
        log("You visited the vet. - $20");
    } else {
        log("Not enough money for a vet visit");
    }

    updateStats();
}

choresBtn.onclick = function() {
    money += 10 ;
    happiness += 3;
    log("You did your chores. +$10");

    updateStats();
}

let choresCooldown = false;

chores.Btn.onclick = function () {
    if (choresCooldown) {
        log("Chores are on cooldown. Try again soon!");
        return;
    }

    money += 10 ;
    happiness += 3;
    log("You did your chores. +$10");

    updateStats();

    choresCooldown = true;
    choresBtn.disabled = true;

    let timeLeft = 60;
    choresBtn.textContent = `Chores (${timeLeft}s)`;

    let timer = setInterval(() => {
        timeLeft--;
        choresBtn.textContent = `Choes (${timeLeft}s)`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            choresCooldown = false;
            choresBtn.disabled = false;
            choresBtn.textContent = "Chores (+$10)";
        }
    }, 1000);
};