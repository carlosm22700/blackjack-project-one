//console.log('sanity check');

// the game starts
//player is prompted to increase/decrease bet by 10
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
//     //create deck to be 'shuffled' and used for game
// const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
// const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];

//   /*----- state variables -----*/
//   //will hold the new deck once created
//   let deck = []


//   /*----- cached elements  -----*/


//   /*----- event listeners -----*/


//   /*----- functions -----*/
//   //creates a function to 'shuffle' and create a new Deck
//   function shuffleDeck() {
//      const shuffledDeck = [];
//     //loop through the deck array
//      while (deck.length > 0){
//         randomCard = Math.floor(Math.random() * deck.length)
//      }
//   }

class Deck {
    // The constructor function is called when a new object of this class is created
    constructor() {
        //creates possible suits in Deck class/obj
        this.suits = ['hearts', 'diamonds', 'spades', 'clubs'];
        //creates possible values in card deck
        this.values = [1,2,3,4,5,6,7,8,9,10,10,10,10,11];
        //initializes the cards array
        this.cards = [];
        //when a new deck is created, we want to reset it in order to have all 52 cards
        this.reset();
    }

    reset(){
        //clear the cards array
        this.cards = [];
        //loop through all possible conbinations of suits and values
            //iterate over the suits/value array of this class and assign the current element to the variable suit/value
            for (let suit of this.suits) {
                for (let value of this.values) {
                    //create a new card obj with the given suit and value, add it to the deck
                    //Add a new card object to the cards array with the current suit and value
                    this.cards.push({
                        suit: suit,
                        value: value,
                    });
                }
            }
            console.log(this.cards);
    }
    //define function to shuffle the deck
    shuffle() {
        //uses the sort method to shuffle deck
        //generate random number between 0 - 1 and subtract .5 from it
        //if result is negative, the first value (card being compared to next card in array) is placed before the second value in sorted array
        //if result is positive, first value is placed after
        //creates random order for array - 'sorting' cards
        this.cards.sort(() => Math.random() - 0.5);
        console.log(this.cards);
        // if the result of this is negative
    }

    deal(){
        //remove and return the last card from the cards array
        return this.cards.pop();
    }
    //Define a function to reset the deck and shuffle it
    shuffledDeck(){
        //Call the reset function to reset the deck
        this.reset();
        //call the shuffle function to shuffle the deck
        this.shuffle();
        //Log te shuffled cards array to the console
        console.log(this.cards);
    }
}

//Define a Class called 'Player'
class Player {
    constructor(name){
        //initializes the name prop
        this.name = name;
        // Initialize the hand array
        this.hand = [];
    }
    addCard(card) {
        //Push the given card object ont the hand array
        this.hand.push(card);
    }

    getHandValue(){
        let sum = 0;
        let hasAce = false;

        for (let card of this.hand) {
            //add the value of the current card to sum variable
            sum += card.value;
            // If the current card is an Ace, set that hasAce variable to true
            if (card.value === 11) {
                hasAce = true;
            }
        }
        //if the player's hand contains an Ace and the sum is greater than 21, sibtract 10 from the sum
        if (hasAce && sum > 21) {
            sum -= 10;
        }
        return sum
    }
}

class Dealer extends Player {
    constructor () {
        super('Dealer');
        this.hideFirstCard = true;
    }
    
    getHandValue() {
        let sum = 0;
        let hasAce = false;

        for (let card of this.hand) {
            sum += card.value;
            if (card.value === 11) {
                hasAce = true;
            }
        }
        if (hasAce && sum > 21) {
            sum -= 10;
        }
        while (sum < 17) {
            this.hand.push(game.deck.deal());
            sum = this.getHandValue()
        }
        return sum;
    }
}

class Card {
    constructor(suit, value){
        //set the suit and value of a card
        this.suit = suit;
        this.value = value;
    }
    //return a string representation of the card
    toString() {
        return `${this.value} of ${this.suit}`;
    }
}
//The construcot sets up the initial state of the game
class Game {constructor(){
    //Create a new deck of cards and shuffle it
        this.deck = new Deck();
        this.deck.shuffle();
        //initialize the player and dealers hands to empty arrays
        this.playerHand = [];
        this.dealerHand = [];
        //sets starting bet amount and balance
        this.betAmount = 0;
        this.balance = 100;
    }
    //init method starts the game
    init() {
        //Ask the player for their bet amount and subtract it from their balance
        this.betAmount = Number(prompt(`Balance: ${this.balance}\nHow much would you like to bet?`))
        this.playerHand = [this.deck.deal(), this.deck.deal()];
        this.dealerHand = [this.deck.deal(), this.deck.deal()];
        console.log(`Dealer hand: ${this.dealerHand[0].toString()}, [hidden]`);
        console.log(`Player hand: ${this.playerHand[0].toString()}, ${this.playerHand[1].toString()}`);
    }

    newGame() {
        this.init();
        let choice = prompt('hit or stand?');
        while (choice === 'hit' || choice === 'stand') {
            if (choice === 'hit') {
                this.playerHand.push(this.deck.deal());
                console.log(`Player hand: ${this.playerHand.map(card => card.toString()).join(', ')}`);
                //gets the valuer of this player hand and checks if over 21
                if (this.getHandValue(this.playerHand) > 21) {
                    console.log('Bust! You lose.')
                    this.playerHand = [];
                    this.dealerHand = [];
                    //if player has no money (balance < 0), the game is over
                    if (this.balance <= 0) {
                        console.log('Game over. You are out of money.');
                        return;
                    } else {
                        //otherwise, start a new game
                        this.init();
                        return;
                    }
                }
            }
        }
    }
}
// //create a new deck and shuffle it

// const newDeck = new Deck();
// newDeck.shuffledDeck();

// console.log(newDeck);
