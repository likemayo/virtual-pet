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

let money = 10;
document.addEventListener('DOMContentLoaded', function() {
    playButton.onclick = function() {
        play.classList.add('hide');
        input.classList.remove('hide');
        input.classList.add('show');
    };

    submitInputs.onclick = function() {
        userNameDisplay.textContent = "Hello, " + userName.value;
        petNameDisplay.textContent = petName.value;

        percent = money / parseInt(savingsGoal.value) * 100;

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

// ----------------------------- UPDATE ALL STATS ON SCREEN -----------------------

function updateStats() {
    hungerStats.textContent = "Hunger: " + hunger + "%";
    happinessStats.textContent = "Happiness: " + happiness + "%";
    energyStats.textContent = "Energy: " + cleanliness + "%";
    cleanlinessStats.textContent = "Cleanliness: " + energy + "%";
    healthStats.textContent = "Health: " + health + "%";
    ageStats.textContent = "Age: " + age + " years";
    
    
    let percent = Math.floor((money / parseInt(savingsGoal.value)) * 100);
    moneySaved.textContent = "money saved: $" + money;
    goal.textContent = "Goal: $" + savingsGoal.value + " (" + percent + "%)";
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