console.log('sanity check');

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
