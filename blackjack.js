//console.log('sanity check');

// the game starts
//player is prompted to increase/decrease bet by 10 through text on screen (written in html and styled with css)
//bet is not confirmed until player clicks 'confirm bet' button
    //player balance is reduced by the amount of bet

//after bet is confirmed, prompt 'bet confirmed, click 'New Game' to begin';
//after 'New Game' is clicked, dealer shuffles deck

//the dealer deals two cards to the player and two cards to themselves
    //for dealer: one card is faceup and another card is facedown

//the player can choose to 'hit' (request another card) or 'stand' (keep current hand/total)

//if the player chooses to hit, the dealer deals another card to the player.
    //this adds to the player total
//player can choose to hit until they choose to stand, or 'bust' if their total exceeds 21 points.

//once a player stands or bust, its now the dealers turn to play

//The dealer must continue to hit until their hand is worth at least 17, or they bust.

//if the dealer busts, then player wins;

//if the dealer does not bust
    //compare player hands and dealer hands
    //if player hand > dealer hand and is under 21; then player wins
    //if player hand < dealer hand and is under 21; then dealer wins

//if winner = player
    //player balance increases by betting amount
//if winner = dealer
    //player balance decreases by betting amount
//if tie
    //player balance remains the same

//Game came be played again with the same bet by clicking 'New Game' Button and the deck will be reset
//balance will only reset automatically if it reaches 0 or the page is refreshed
//the player can adjust their bet amount again before clicking 'confirm bet' to start the game.


//might need some error handling for cases where the player enters invalid input or tries to bet more than their current balance. 
//think about how to handle cases where the player refreshes the page or navigates away from the game in the middle of a round.



//   /*----- constants -----*/
const suits = ['hearts', 'diamonds', 'spades', 'clubs'];
const values = ['A', 'r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08', 'r09', 'r10', 'J', 'Q', 'K'];

//   /*----- state variables -----*/
let dealerTotal = 0;
let playerTotal = 0;
let betAmount = 0;
let betBalance = 100;
let deck = [];
let playerHand = [];
let dealerHand = [];
let betConfirmed = false;
let canHitOrStand = false;
let hiddenCard;

//   /*----- cached elements  -----*/
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const dealerCards = document.getElementById('dealer-cards');
const playerCards = document.getElementById('player-cards');
const gameResult = document.getElementById('game-result');
const placeBetBttn = document.getElementById('place-bet');
const withdrawBetBttn = document.getElementById('withdraw-bet');
const confirmBetBttn = document.getElementById('confirm-bet');
const yourBalanceDisplay = document.getElementById('player-balance');
const cardModel = document.createElement('div');
const playerBet = document.getElementById('player-bet');
cardModel.classList.add('card');
const newGameBttn = document.getElementById('new-game');

//   /*----- event listeners -----*/
hitButton.addEventListener('click', () => {
    hit(playerHand);
    //console.log('hit button pressed')
})
standButton.addEventListener('click', () =>{
    stand(playerHand)
    //console.log('hit button pressed')

})
placeBetBttn.addEventListener('click', () => {
    console.log('Bet Placed')
    placeBet();
    console.log('your balance is:' + betBalance)
    updateDOM();

})
withdrawBetBttn.addEventListener('click', () => {
    console.log('Bet Withdrawn');
    removeBet();
    console.log('Your balance is:' + betBalance);
    updateDOM();
})

confirmBetBttn.addEventListener('click', () => {
    betConfirmed = true;
    console.log('You Have confirmed your bet');
})

newGameBttn.addEventListener('click', () => {
    if (betConfirmed) {
        newGame()
    }
});


//   /*----- functions -----*//

window.onload = function() {
    createDeck();
    shuffleDeck();
    updateDOM();
    
}

function createDeck () {
    deck = [];
    values.forEach((cardValue) => {
        suits.forEach((cardSuit)=>{
            const card = {
                value: cardValue,
                suit: cardSuit
            };
            deck.push(card)
        })
    })
    // console.log(deck);
    return deck;

}

function shuffleDeck () {
    for (let i=0; i < deck.length; i++){
        let randomIndex = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[randomIndex];
        deck[randomIndex] = temp;
    }
    // console.log(deck);
}

function dealCards(){
    // Deal cards to player and dealer
    hiddenCard = deck.pop();
    dealerTotal += getCardValue(hiddenCard, dealerTotal);
    dealerHand = [deck.pop(), deck.pop()];
    //console.log(dealerHand);
    playerHand = [deck.pop(), deck.pop()];
    //console.log(playerHand);

    dealerTotal = getCardValue(dealerHand[0], dealerTotal) + getCardValue(dealerHand[1], dealerTotal);
    //console.log(dealerTotal)
    playerTotal = getCardValue(playerHand[0], playerTotal) + getCardValue(playerHand[1], playerTotal);
    //console.log(playerTotal)
    // console.log(hiddenCard);
    // console.log(dealerTotal)
    updateDOM();
}   

function updateDOM () {
    //update the DOM with current game state
    //update the player's balance and bet amount
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';

    yourBalanceDisplay.textContent = `Your Balance: ${betBalance}`;
    playerBet.textContent = `Your Bet: ${betAmount}`;

    dealerCards.innerHTML = '<h2>Dealer Cards:</h2>';
    playerCards.innerHTML = '<h2>Your Cards:</h2>';
    //display dealer's cards and total
    console.log(dealerHand);
    dealerHand.forEach((card, index) => {
        const cardElement = createCardElement(card);
        if (index === 0 && canHitOrStand) {
            cardElement.classList.add('card', card.value, card.suit);
        } else {
            cardElement.classList.add('card', card.value, card.suit);
        }
        dealerCards.appendChild(cardElement)
    });
    dealerCards.insertAdjacentHTML('beforeend', `<p id="dealer-total"> Total: ${dealerTotal} </p>`)

    //Display player's cards and total
    playerHand.forEach((card) => {
        const cardElement = createCardElement(card);
        cardElement.classList.add('card', card.value, card.suit);
        playerCards.appendChild(cardElement);
    });
    playerCards.insertAdjacentHTML('beforeend', `<p id= "player-total"> Total: ${playerTotal} </p>`);

    //Check if the game has ended due to a player running out fo money

    if (betBalance <= 0){
        gameResult.textContent = 'Game Over! You are out of money';
    } 
}

function createCardElement(card) {
    const cardElement = cardModel.cloneNode(true);
    const value = card.value;
    const suit = card.suit;
    cardElement.classList.add(suit.toLowerCase(), suit.charAt(0).toLowerCase() + value.toLowerCase())
    console.log(cardElement);
    return cardElement
}

function getCardValue (card, sum){
    //take the current card (ex: 9 hearts), split at the space and take the value which at [0] index
    let value = card.value;

    if (value[0] === 'r') {
        value = value.substring(1);
    }

    if (value === 'A'){
        if (sum + 11 > 21) {
            return 1;
        } else {
            return 11;
        }
    } else if (value ==='K' || value === 'Q' || value === 'J') {
        return 10
    } else {
        return parseInt(value);
    }
}

function calculateScore(hand) {
    //calculate the score for a given hand
    //if card value 02 <= x <= 09 {
    //return value = 
    //}
    let total = 0;
    let aces = 0;

    hand.forEach(card => {
        const value = getCardValue(card, total);
        total += value
        
        if (value === 11) {
            aces++;
        }
    });

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}

function hit(hand) {
    if (!canHitOrStand) return;
    //Add a card to the given hand

    const newCard = deck.pop();
    hand.push(newCard);
    if (hand === playerHand) {
        playerTotal = calculateScore(playerHand);
        if (playerTotal > 21) {
            canHitOrStand = false;
            determineWinner();
        }
    }
    //updae DOM to display new card and updated score
    updateDOM()
}

function stand() {
    //Reveal the hidden card and update DOM
    if (!canHitOrStand) return;

    canHitOrStand = false;
    dealerTotal += getCardValue(hiddenCard, dealerTotal);

    //dealer draws cards until their total is 17 or higher
    while (dealerTotal < 17) {
        const newCard = deck.pop();
        dealerHand.push(newCard);
        dealerTotal = calculateScore(dealerHand);
    }
    //compare dealer's and player totals and determine winner
    determineWinner();
    updateDOM();
}

function determineWinner(){
    //comparison logic??
    let result;
    if (playerTotal > 21) {
        result = "Dealer!";
    } else if (dealerTotal > 21) {
        result = "Player";
    } else if (playerTotal > dealerTotal) {
        result = "Player";
    }else if (playerTotal < dealerTotal) {
        result = "Dealer";
    } else {
        result = "Tie"
    }

    //update bet balance based on the result
    if (result === "Player") {
        betBalance += betAmount;
    } else if (result === "Dealer"){
        betBalance -= betAmount;
    }

    //display result message and update bet balance on the DOM
    gameResult.textContent = `Winner: ${result}`;
    yourBalanceDisplay.textContent = `Your Balance: ${betBalance}`

    // resets bet amount after determining winner
    betAmount = 0; 

    //reset the game state for a new round
    updateDOM();
    resetGameState();
}

function newGame(){
    if (!betConfirmed) return;

    createDeck();
    shuffleDeck();
    dealCards();
    updateDOM();

    canHitOrStand = true;
}
function resetGameState (){
    betConfirmed = false;
    canHitOrStand = false;
    dealerTotal = 0;
    playerTotal = 0;
    playerHand = [];
    dealerHand = [];
}
function placeBet () {
    if (betConfirmed === true){
        //console.log('Bet has been confirmed. Cannot place more.')
        return;
    }
    if (betBalance <= 0) {
       // console.log('No more money!')
        return;
    }
     betBalance -= 10;
     betAmount += 10;
     updateDOM();
     //yourBalanceDisplay.textContent = `Your Balance: ${betBalance}`;
}
function removeBet () {
    if (betConfirmed !== false){
        //console.log('Bet has been confirmed. Cannot withdraw more.');
        return
    }
    if (betBalance >= 100) {
        //console.log('bet balance cannot exceed 100');
        return
    }
     betBalance += 10;
     betAmount -= 10;
     updateDOM();
     //yourBalanceDisplay.textContent = `Your Balance: ${betBalance}`;
}


//goals: 
//get bet number to show up
//have that number change as I increase decrease
//come up with dealing function/method
//get the cards to physically deal and show up on the dom
//add functionalities to hit and stand buttons
//figure out how to incorporate new game and what that does... is it even needed?
//have total of cards show up on screen.
//implement betting system functionalities and have that be losing/winning condition



//might have to change gamesetup to render or something.
//create a different function that handles to check if bet has been confirmed first. if so, player can hit and deal card before handling the hit button.










// class Deck {
//     // The constructor function is called when a new object of this class is created
//     constructor() {
//         //creates possible suits in Deck class/obj
//         this.suits = ['hearts', 'diamonds', 'spades', 'clubs'];
//         //creates possible values in card deck
//         this.values = [1,2,3,4,5,6,7,8,9,10,10,10,10,11];
//         //initializes the cards array
//         this.cards = [];
//         //when a new deck is created, we want to reset it in order to have all 52 cards
//         this.reset();
//     }

//     reset(){
//         //clear the cards array
//         this.cards = [];
//         //loop through all possible conbinations of suits and values
//             //iterate over the suits/value array of this class and assign the current element to the variable suit/value
//             for (let suit of this.suits) {
//                 for (let value of this.values) {
//                     //create a new card obj with the given suit and value, add it to the deck
//                     //Add a new card object to the cards array with the current suit and value
//                     this.cards.push({
//                         suit: suit,
//                         value: value,
//                     });
//                 }
//             }
//             console.log(this.cards);
//     }
//     //define function to shuffle the deck
//     shuffle() {
//         //uses the sort method to shuffle deck
//         //generate random number between 0 - 1 and subtract .5 from it
//         //if result is negative, the first value (card being compared to next card in array) is placed before the second value in sorted array
//         //if result is positive, first value is placed after
//         //creates random order for array - 'sorting' cards
//         const shuffledCards = [...this.cards]
//         shuffledCards.sort(() => Math.random() - 0.5);
//         console.log(this.cards);
//         // if the result of this is negative
//     }

//     deal(){
//         //remove and return the last card from the cards array
//         return this.cards.pop();
//     }
//     //Define a function to reset the deck and shuffle it
//     shuffledDeck(){
//         //Call the reset function to reset the deck
//         this.reset();
//         //call the shuffle function to shuffle the deck
//         this.shuffle();
//         //Log te shuffled cards array to the console
//         console.log(this.cards);
//     }
// }

// //Define a Class called 'Player'
// class Player {
//     constructor(name){
//         //initializes the name prop
//         this.name = name;
//         // Initialize the hand array
//         this.hand = [];
//     }
//     addCard(card) {
//         //Push the given card object ont the hand array
//         this.hand.push(card);
//     }

//     getHandValue(){
//         let sum = 0;
//         let hasAce = false;

//         for (let card of this.hand) {
//             //add the value of the current card to sum variable
//             sum += card.value;
//             // If the current card is an Ace, set that hasAce variable to true
//             if (card.value === 11) {
//                 hasAce = true;
//             }
//         }
//         //if the player's hand contains an Ace and the sum is greater than 21, sibtract 10 from the sum
//         if (hasAce && sum > 21) {
//             sum -= 10;
//         }
//         return sum
//     }
// }

// class Dealer extends Player {
//     constructor () {
//         super('Dealer');
//         this.hideFirstCard = true;
//     }
    
//     getHandValue() {
//         let sum = 0;
//         let hasAce = false;

//         for (let card of this.hand) {
//             sum += card.value;
//             if (card.value === 11) {
//                 hasAce = true;
//             }
//         }
//         if (hasAce && sum > 21) {
//             sum -= 10;
//         }
//         while (sum < 17) {
//             this.hand.push(game.deck.deal());
//             sum = this.getHandValue()
//         }
//         return sum;
//     }
// }

// class Card {
//     constructor(suit, value){
//         //set the suit and value of a card
//         this.suit = suit;
//         this.value = value;
//     }
//     //return a string representation of the card
//     toString() {
//         return `${this.value} of ${this.suit}`;
//     }
// }
// //The construcot sets up the initial state of the game
// class Game {constructor(){
//     //Create a new deck of cards and shuffle it
//         this.deck = new Deck();
//         this.deck.shuffle();
//         //initialize the player and dealers hands to empty arrays
//         this.playerHand = [];
//         this.dealerHand = [];
//         //sets starting bet amount and balance
//         this.betAmount = 0;
//         this.balance = 100;
//         //initializes player within game
//         this.player = new Player('Player');
//     }
//     //init method starts the game
//     init() {
//         //Ask the player for their bet amount and subtract it from their balance
//         this.betAmount = Number(prompt(`Balance: ${this.balance}\nHow much would you like to bet?`))
//         this.playerHand = [this.deck.deal(), this.deck.deal()];
//         this.dealerHand = [this.deck.deal(), this.deck.deal()];
//         // console.log(`Dealer hand: ${this.dealerHand[0].toString()}, [hidden]`);
//         // console.log(`Player hand: ${this.playerHand[0].toString()}, ${this.playerHand[1].toString()}`);
//     }

//     newGame() {
//         this.init();
//         let choice = prompt('hit or stand?');
//         while (choice === 'hit' || choice === 'stand') {
//             if (choice === 'hit') {
//                 this.playerHand.push(this.deck.deal());
//                 console.log(`Player hand: ${this.playerHand.map(card => card.toString()).join(', ')}`);
//                 //gets the valuer of this player hand and checks if over 21
//                 if (this.player.getHandValue(this.playerHand) > 21) {
//                     console.log('Bust! You lose.')
//                     this.playerHand = [];
//                     this.dealerHand = [];
//                     //if player has no money (balance < 0), the game is over
//                     if (this.balance <= 0) {
//                         console.log('Game over. You are out of money.');
//                         return;
//                     } else {
//                         //otherwise, start a new game
//                         this.init();
//                         return;
//                     }
//                 }
//             } else {
//                 while (this.player.getHandValue(this.dealerHand) < 17) {
//                     this.dealerHand.push(this.deck.deal());
//                 }

//                 console.log(`Dealer hand: ${this.dealerHand.map(card => card.toString()).join(', ')}`);
//                 const playerValue = this.player.getHandValue(this.playerHand);
//                 const dealerValue = this.player.getHandValue(this.dealerHand);

//                 if (dealerValue > 21 || playerValue > dealerValue) {
//                     console.log('You win!');
//                     this.balance += 2 * this.betAmount;
//                 } else if (dealerValue > playerValue) {
//                     console.log('You lose!');
//                     this.balance -= this.betAmount;
//                 }
//                 this.playerHand = [];
//                 this.dealerHand = [];
//                 if (this.balance <= 0) {
//                     console.log('Game over: You are out of money');
//                     return;
//                 } else {
//                     this.init();
//                     return;
//                 }
//             }
//             choice = prompt('hit or stand');
//         }
//     }

//     playerHit () {
//         //when click on hit bttn, card will be dealt from shuffled deck. total gets added.
//         // const hitButton = document.getElementById('deal-card');

//         // hitButton.addEventListener('click', () => {
//         //     //when click on hit button, card will be dealt from shuffled deck, total gets added.
//         //     const card = deck.dealCard();
//         //     const cardEl = new Card(card.suit, card.value).render();
//         //     this.playerHand.addCard(card);
//         //     playerScore.textContent = this.playerHand.calculateScore();
//         //     playerHandContainer.appendChild(cardElement);

//         //     game.init()
//         //     console.log('button hit')
//         // });
//     }
// }

// const game = new Game();
// game.newGame();
// //create a new deck and shuffle it

// const newDeck = new Deck();
// newDeck.shuffledDeck();

// console.log(newDeck);
