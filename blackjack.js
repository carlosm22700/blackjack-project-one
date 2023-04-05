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
    constructor() {
        //creates possible suits in Deck class/obj
        this.suits = ['hearts', 'diamonds', 'spades', 'clubs'];
        //creates possible values in 
        this.values = ['1,2,3,4,5,6,7,8,9,10,10,10,10,11'];
        this.cards = [];
        //when a new deck is created, we want to reset it in order to have all 52 cards
        this.reset();
    }

    reset(){
        this.cards = [];
        //loop through all possible conbinations of suits and values
            //iterate over the suits/value array of this class and assign the current element to the variable suit/value
            for (let suit of this.suits) {
                for (let value of this.values) {
                    //create a new card obj with the given suit and value, add it to the deck
                    this.cards.push({
                        suit: suit,
                        value: value,
                    });
                }
            }
            console.log(this.cards);
    }

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

    shuffledDeck(){

        this.reset();
        this.shuffle();
        console.log(this.cards);
    }
}

//create a new deck and shuffle it

const newDeck = new Deck();
newDeck.shuffledDeck();

console.log(newDeck);
