/**
 * Classe représentant une carte de poker
 */
class Card {
    /**
     * Constantes pour les rangs et couleurs
     */
    static RANKS = [
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
        "A",
    ];
    static SUITS = ["hearts", "diamonds", "clubs", "spades"]; // cœur, carreau, trèfle, pique
    static SUIT_SYMBOLS = {
        hearts: "♥",
        diamonds: "♦",
        clubs: "♣",
        spades: "♠",
    };

    /**
     * Crée une nouvelle carte
     * @param {string} rank - Le rang de la carte (2-10, J, Q, K, A)
     * @param {string} suit - La couleur de la carte (hearts, diamonds, clubs, spades)
     */
    constructor(rank, suit) {
        if (!Card.RANKS.includes(rank)) {
            throw new Error(`Rang invalide: ${rank}`);
        }
        if (!Card.SUITS.includes(suit)) {
            throw new Error(`Couleur invalide: ${suit}`);
        }

        this.rank = rank;
        this.suit = suit;
    }

    /**
     * Obtient la valeur numérique du rang de la carte
     * @returns {number} - La valeur numérique (2-14, où As = 14)
     */
    getValue() {
        return Card.RANKS.indexOf(this.rank) + 2;
    }

    /**
     * Vérifie si la carte est un As
     * @returns {boolean}
     */
    isAce() {
        return this.rank === "A";
    }

    /**
     * Représentation textuelle de la carte
     * @returns {string} - Par exemple "A♥" pour l'As de cœur
     */
    toString() {
        return `${this.rank}${Card.SUIT_SYMBOLS[this.suit]}`;
    }
}

module.exports = { Card };
