class AudioController {
    constructor() {
        this.backgroundMusic = new Audio('Assets/Audio/technological.mp3');
        this.flipSound = new Audio('Assets/Audio/flip.wav');
        this.matchSound = new Audio('Assets/Audio/score.wav');
        this.victorySound = new Audio('Assets/Audio/score.wav');
        this.backgroundMusic.volume = 0.3;
        this.matchSound.volume = 0.5;
        this.flipSound.volume = 0.5;
        this.backgroundMusic.loop = true;
    }
    startMusic() {
        this.backgroundMusic.play();
    }
    stopMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
}

class mixOrMatch {
    constructor(cards) {
        this.cardsArray = cards;
        this.score = document.getElementById('score');
        this.ticker = document.getElementById('flips');
        this.message = document.getElementById('matched-message-container');
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.totalScore = 0;
        this.totalClicks = 0;
        this.matchedCards = [];
        this.message.classList.add('visible');
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffeCards();
            this.busy = false;
        }, 500);

        this.hideCards();
        this.ticker.innerText = this.totalClicks;
        this.score.innerText = this.totalScore;
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }

    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatched(card, this.cardToCheck);
        } else {
            this.cardMisMatched(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    }

    cardMatched(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.totalScore++;
        this.score.innerText = this.totalScore;
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }
    }

    cardMisMatched(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }

    victory() {
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
        this.hideCards();
    }

    shuffeCards() {
            for (let i = this.cardsArray.length - 1; i > 0; i--) {
                let randomIndex = Math.floor(Math.random() * (i + 1));
                this.cardsArray[randomIndex].style.order = i;
                this.cardsArray[i].style.order = randomIndex;
            }

        }
        /**if the card is already flipped (matched);
        an animation is happening or
        if the card that's flipped is already a card to be checked it shouldn't be clicked*/
    canFlipCard(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }

}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new mixOrMatch(cards);
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}