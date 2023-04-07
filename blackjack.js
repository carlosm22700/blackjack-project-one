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
    if (betAmount < 10) {
        return;
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